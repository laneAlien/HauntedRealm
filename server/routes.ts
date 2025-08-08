import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertNftSchema, insertDeckSchema, insertTransactionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Users
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Connect wallet
  app.post("/api/wallet/connect", async (req, res) => {
    try {
      const { walletAddress, username } = req.body;
      
      // Check if user exists by wallet address
      const existingUser = await storage.getUserByUsername(username || `user_${walletAddress.slice(-6)}`);
      
      if (existingUser) {
        // Update wallet address if needed
        const updatedUser = await storage.updateUser(existingUser.id, { walletAddress });
        return res.json(updatedUser);
      }
      
      // Create new user
      const newUser = await storage.createUser({
        username: username || `user_${walletAddress.slice(-6)}`,
        walletAddress,
      });
      
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ message: "Failed to connect wallet" });
    }
  });

  // NFTs
  app.get("/api/nfts", async (req, res) => {
    try {
      const { ownerId } = req.query;
      
      if (ownerId) {
        const nfts = await storage.getNftsByOwner(ownerId as string);
        return res.json(nfts);
      }
      
      const nfts = await storage.getAllNfts();
      res.json(nfts);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/nfts/:id", async (req, res) => {
    try {
      const nft = await storage.getNft(req.params.id);
      if (!nft) {
        return res.status(404).json({ message: "NFT not found" });
      }
      res.json(nft);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/nfts", async (req, res) => {
    try {
      const nftData = insertNftSchema.parse(req.body);
      const nft = await storage.createNft(nftData);
      res.status(201).json(nft);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Decks
  app.get("/api/decks", async (req, res) => {
    try {
      const { ownerId } = req.query;
      
      if (!ownerId) {
        return res.status(400).json({ message: "Owner ID required" });
      }
      
      const decks = await storage.getDecksByOwner(ownerId as string);
      res.json(decks);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/decks", async (req, res) => {
    try {
      const deckData = insertDeckSchema.parse(req.body);
      
      // Calculate deck stats
      const cardIds = deckData.cardIds || [];
      const cards = await Promise.all(cardIds.map(id => storage.getNft(id)));
      const validCards = cards.filter(Boolean);
      
      const totalPower = validCards.reduce((sum, card) => sum + (card!.power || 0), 0);
      const avgMana = validCards.length > 0 
        ? (validCards.reduce((sum, card) => sum + (card!.mana || 0), 0) / validCards.length).toFixed(1)
        : "0";
      const synergy = Math.min(95, Math.random() * 40 + 50).toFixed(1); // Mock synergy calculation
      
      const deck = await storage.createDeck(deckData);
      const updatedDeck = await storage.updateDeck(deck.id, {
        totalPower,
        avgMana,
        synergy,
      });
      
      res.status(201).json(updatedDeck);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/decks/:id", async (req, res) => {
    try {
      const { cardIds, name } = req.body;
      
      if (cardIds) {
        // Recalculate stats when cards change
        const cards = await Promise.all(cardIds.map((id: string) => storage.getNft(id)));
        const validCards = cards.filter(Boolean);
        
        const totalPower = validCards.reduce((sum, card) => sum + (card!.power || 0), 0);
        const avgMana = validCards.length > 0 
          ? (validCards.reduce((sum, card) => sum + (card!.mana || 0), 0) / validCards.length).toFixed(1)
          : "0";
        const synergy = Math.min(95, Math.random() * 40 + 50).toFixed(1);
        
        const updatedDeck = await storage.updateDeck(req.params.id, {
          cardIds,
          totalPower,
          avgMana,
          synergy,
          ...(name && { name }),
        });
        
        return res.json(updatedDeck);
      }
      
      const updatedDeck = await storage.updateDeck(req.params.id, req.body);
      res.json(updatedDeck);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/decks/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteDeck(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Deck not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Events
  app.get("/api/events", async (req, res) => {
    try {
      const { status } = req.query;
      
      if (status === "active") {
        const events = await storage.getActiveEvents();
        return res.json(events);
      }
      
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/events/:id/join", async (req, res) => {
    try {
      const { userId } = req.body;
      
      const event = await storage.getEvent(req.params.id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      if (event.currentParticipants >= event.maxParticipants!) {
        return res.status(400).json({ message: "Event is full" });
      }
      
      const updatedEvent = await storage.updateEvent(req.params.id, {
        currentParticipants: event.currentParticipants + 1,
      });
      
      res.json({ message: "Successfully joined event", event: updatedEvent });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Transactions
  app.get("/api/transactions", async (req, res) => {
    try {
      const { userId } = req.query;
      
      if (!userId) {
        return res.status(400).json({ message: "User ID required" });
      }
      
      const transactions = await storage.getTransactionsByUser(userId as string);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const transactionData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(transactionData);
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Leaderboard
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const { period = "Weekly" } = req.query;
      const leaderboard = await storage.getLeaderboard(period as string);
      
      // Populate user data
      const enrichedLeaderboard = await Promise.all(
        leaderboard.map(async (entry) => {
          const user = await storage.getUser(entry.userId!);
          return {
            ...entry,
            user: user ? { username: user.username, id: user.id } : null,
          };
        })
      );
      
      res.json(enrichedLeaderboard);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Analytics
  app.get("/api/analytics/:userId", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const nfts = await storage.getNftsByOwner(req.params.userId);
      const transactions = await storage.getTransactionsByUser(req.params.userId);
      
      // Calculate analytics
      const totalValue = parseFloat(user.tonBalance) + nfts.reduce((sum, nft) => sum + (nft.power || 0) * 0.01, 0);
      const rarityIndex = nfts.length > 0 
        ? nfts.reduce((sum, nft) => {
            const rarityScore = { Common: 1, Rare: 3, Epic: 7, Legendary: 15 }[nft.rarity] || 1;
            return sum + rarityScore;
          }, 0) / nfts.length
        : 0;
      
      const analytics = {
        powerScore: user.powerScore,
        winRate: parseFloat(user.winRate),
        rarityIndex: rarityIndex.toFixed(1),
        synergyLevel: user.powerScore > 10000 ? "Master" : user.powerScore > 5000 ? "Expert" : "Apprentice",
        totalValue: totalValue.toFixed(2),
        cardCount: nfts.length,
        recentTransactions: transactions.slice(0, 5),
      };
      
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
