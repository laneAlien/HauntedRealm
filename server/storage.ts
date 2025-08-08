import { type User, type InsertUser, type Nft, type InsertNft, type Deck, type InsertDeck, type Event, type InsertEvent, type Transaction, type InsertTransaction, type LeaderboardEntry } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  
  // NFTs
  getNft(id: string): Promise<Nft | undefined>;
  getNftsByOwner(ownerId: string): Promise<Nft[]>;
  createNft(nft: InsertNft): Promise<Nft>;
  updateNft(id: string, updates: Partial<Nft>): Promise<Nft | undefined>;
  getAllNfts(): Promise<Nft[]>;
  
  // Decks
  getDeck(id: string): Promise<Deck | undefined>;
  getDecksByOwner(ownerId: string): Promise<Deck[]>;
  createDeck(deck: InsertDeck): Promise<Deck>;
  updateDeck(id: string, updates: Partial<Deck>): Promise<Deck | undefined>;
  deleteDeck(id: string): Promise<boolean>;
  
  // Events
  getEvent(id: string): Promise<Event | undefined>;
  getAllEvents(): Promise<Event[]>;
  getActiveEvents(): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, updates: Partial<Event>): Promise<Event | undefined>;
  
  // Transactions
  getTransaction(id: string): Promise<Transaction | undefined>;
  getTransactionsByUser(userId: string): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  
  // Leaderboard
  getLeaderboard(period: string): Promise<LeaderboardEntry[]>;
  updateLeaderboardEntry(userId: string, period: string, updates: Partial<LeaderboardEntry>): Promise<LeaderboardEntry>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private nfts: Map<string, Nft> = new Map();
  private decks: Map<string, Deck> = new Map();
  private events: Map<string, Event> = new Map();
  private transactions: Map<string, Transaction> = new Map();
  private leaderboard: Map<string, LeaderboardEntry> = new Map();

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize with some sample data for demonstration
    const sampleUser: User = {
      id: "user-1",
      username: "MoonlitCollector",
      walletAddress: "0:abc123...",
      tonBalance: "127.45",
      powerScore: 8542,
      winRate: "73.5",
      createdAt: new Date(),
    };
    this.users.set(sampleUser.id, sampleUser);

    // Sample NFTs with twilight gothic theme
    const sampleNfts: Nft[] = [
      {
        id: "nft-1",
        ownerId: "user-1",
        name: "Moonlit Fortress",
        description: "An ancient castle shrouded in eternal moonlight, home to ethereal guardians.",
        imageUrl: "https://pixabay.com/get/gb25ff1c4287c15c20a03460de2bc2fdb61c69c29df91164a7ceaea8f9fc4e2e4fdadb0fddd9337e211c41d4810d5cd577f549176a324d8e98fde13224f4a6c1a_1280.jpg",
        rarity: "Legendary",
        faction: "Moonlight Court",
        power: 850,
        mana: 7,
        abilities: ["Moonbeam Shield", "Ethereal Defense"],
        metadata: { element: "Light", type: "Structure" },
        createdAt: new Date(),
      },
      {
        id: "nft-2",
        ownerId: "user-1",
        name: "Ethereal Enchantress",
        description: "A mystical being who weaves moonbeams into powerful spells.",
        imageUrl: "https://images.unsplash.com/photo-1494256997604-768d1f608cac?w=400",
        rarity: "Epic",
        faction: "Ethereal Spirits",
        power: 620,
        mana: 5,
        abilities: ["Moonweave", "Spirit Call"],
        metadata: { element: "Spirit", type: "Creature" },
        createdAt: new Date(),
      },
      {
        id: "nft-3",
        ownerId: "user-1",
        name: "Twilight Guardian",
        description: "Ancient protector of the mystic forest, shrouded in eternal mist.",
        imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
        rarity: "Rare",
        faction: "Shadow Realm",
        power: 420,
        mana: 3,
        abilities: ["Forest Veil", "Nature's Wrath"],
        metadata: { element: "Nature", type: "Guardian" },
        createdAt: new Date(),
      },
    ];

    sampleNfts.forEach(nft => this.nfts.set(nft.id, nft));

    // Sample events
    const sampleEvents: Event[] = [
      {
        id: "event-1",
        name: "Moonlight Tournament",
        description: "Battle under the full moon for legendary rewards and eternal glory in the Haunted Realm.",
        imageUrl: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800",
        type: "Tournament",
        status: "Active",
        prizePool: "500",
        maxParticipants: 1000,
        currentParticipants: 847,
        startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        requirements: { minPowerScore: 1000 },
        createdAt: new Date(),
      },
    ];

    sampleEvents.forEach(event => this.events.set(event.id, event));

    // Sample leaderboard
    const sampleLeaderboard: LeaderboardEntry[] = [
      {
        id: "lb-1",
        userId: "user-1",
        rank: 15,
        powerScore: 8542,
        wins: 34,
        title: "Rising Collector",
        period: "Weekly",
        updatedAt: new Date(),
      },
    ];

    sampleLeaderboard.forEach(entry => this.leaderboard.set(entry.id, entry));
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      tonBalance: "0",
      powerScore: 0,
      winRate: "0",
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // NFT methods
  async getNft(id: string): Promise<Nft | undefined> {
    return this.nfts.get(id);
  }

  async getNftsByOwner(ownerId: string): Promise<Nft[]> {
    return Array.from(this.nfts.values()).filter(nft => nft.ownerId === ownerId);
  }

  async createNft(insertNft: InsertNft): Promise<Nft> {
    const id = randomUUID();
    const nft: Nft = {
      ...insertNft,
      id,
      createdAt: new Date(),
    };
    this.nfts.set(id, nft);
    return nft;
  }

  async updateNft(id: string, updates: Partial<Nft>): Promise<Nft | undefined> {
    const nft = this.nfts.get(id);
    if (!nft) return undefined;
    
    const updatedNft = { ...nft, ...updates };
    this.nfts.set(id, updatedNft);
    return updatedNft;
  }

  async getAllNfts(): Promise<Nft[]> {
    return Array.from(this.nfts.values());
  }

  // Deck methods
  async getDeck(id: string): Promise<Deck | undefined> {
    return this.decks.get(id);
  }

  async getDecksByOwner(ownerId: string): Promise<Deck[]> {
    return Array.from(this.decks.values()).filter(deck => deck.ownerId === ownerId);
  }

  async createDeck(insertDeck: InsertDeck): Promise<Deck> {
    const id = randomUUID();
    const deck: Deck = {
      ...insertDeck,
      id,
      avgMana: "0",
      totalPower: 0,
      synergy: "0",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.decks.set(id, deck);
    return deck;
  }

  async updateDeck(id: string, updates: Partial<Deck>): Promise<Deck | undefined> {
    const deck = this.decks.get(id);
    if (!deck) return undefined;
    
    const updatedDeck = { ...deck, ...updates, updatedAt: new Date() };
    this.decks.set(id, updatedDeck);
    return updatedDeck;
  }

  async deleteDeck(id: string): Promise<boolean> {
    return this.decks.delete(id);
  }

  // Event methods
  async getEvent(id: string): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getActiveEvents(): Promise<Event[]> {
    return Array.from(this.events.values()).filter(event => event.status === "Active");
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = randomUUID();
    const event: Event = {
      ...insertEvent,
      id,
      currentParticipants: 0,
      createdAt: new Date(),
    };
    this.events.set(id, event);
    return event;
  }

  async updateEvent(id: string, updates: Partial<Event>): Promise<Event | undefined> {
    const event = this.events.get(id);
    if (!event) return undefined;
    
    const updatedEvent = { ...event, ...updates };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  // Transaction methods
  async getTransaction(id: string): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async getTransactionsByUser(userId: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(tx => tx.userId === userId)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = randomUUID();
    const transaction: Transaction = {
      ...insertTransaction,
      id,
      createdAt: new Date(),
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  // Leaderboard methods
  async getLeaderboard(period: string): Promise<LeaderboardEntry[]> {
    return Array.from(this.leaderboard.values())
      .filter(entry => entry.period === period)
      .sort((a, b) => a.rank - b.rank);
  }

  async updateLeaderboardEntry(userId: string, period: string, updates: Partial<LeaderboardEntry>): Promise<LeaderboardEntry> {
    const existingEntry = Array.from(this.leaderboard.values())
      .find(entry => entry.userId === userId && entry.period === period);
    
    if (existingEntry) {
      const updatedEntry = { ...existingEntry, ...updates, updatedAt: new Date() };
      this.leaderboard.set(existingEntry.id, updatedEntry);
      return updatedEntry;
    } else {
      const id = randomUUID();
      const newEntry: LeaderboardEntry = {
        id,
        userId,
        period,
        rank: 999,
        powerScore: 0,
        wins: 0,
        title: "Newcomer",
        ...updates,
        updatedAt: new Date(),
      };
      this.leaderboard.set(id, newEntry);
      return newEntry;
    }
  }
}

export const storage = new MemStorage();
