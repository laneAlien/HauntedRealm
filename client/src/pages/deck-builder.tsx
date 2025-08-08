import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/use-wallet";
import { apiRequest } from "@/lib/queryClient";
import DeckCard from "@/components/cards/deck-card";
import type { Nft, Deck } from "@shared/schema";

export default function DeckBuilder() {
  const { user } = useWallet();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [deckName, setDeckName] = useState("My Twilight Deck");
  const [selectedCards, setSelectedCards] = useState<string[]>([]);

  const { data: availableCards = [], isLoading: cardsLoading } = useQuery<Nft[]>({
    queryKey: ["/api/nfts", { ownerId: user?.id }],
    enabled: !!user?.id,
  });

  const { data: decks = [] } = useQuery<Deck[]>({
    queryKey: ["/api/decks", { ownerId: user?.id }],
    enabled: !!user?.id,
  });

  const saveDeckMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/decks", {
        ownerId: user?.id,
        name: deckName,
        cardIds: selectedCards,
      });
    },
    onSuccess: () => {
      toast({
        title: "Deck Saved",
        description: "Your twilight deck has been saved successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/decks"] });
      setSelectedCards([]);
      setDeckName("My Twilight Deck");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save deck. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredCards = availableCards.filter((card) => {
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || 
      (card.metadata as any)?.type?.toLowerCase() === typeFilter.toLowerCase();
    
    return matchesSearch && matchesType;
  });

  const deckCards = selectedCards.map(cardId => 
    availableCards.find(card => card.id === cardId)
  ).filter(Boolean) as Nft[];

  const deckStats = {
    cardCount: selectedCards.length,
    maxCards: 30,
    avgMana: deckCards.length > 0 ? 
      (deckCards.reduce((sum, card) => sum + (card.mana || 0), 0) / deckCards.length).toFixed(1) : "0",
    totalPower: deckCards.reduce((sum, card) => sum + (card.power || 0), 0),
    synergy: Math.min(95, Math.random() * 40 + 50).toFixed(0), // Mock synergy calculation
  };

  const addCardToDeck = (cardId: string) => {
    if (selectedCards.length >= 30) {
      toast({
        title: "Deck Full",
        description: "Maximum deck size is 30 cards.",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedCards.includes(cardId)) {
      setSelectedCards([...selectedCards, cardId]);
    }
  };

  const removeCardFromDeck = (cardId: string) => {
    setSelectedCards(selectedCards.filter(id => id !== cardId));
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-cinzel text-2xl font-bold text-lavender-300 mb-4">Connect Your Wallet</h2>
          <p className="text-moonlight-300">Please connect your TON wallet to build decks.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gradient-to-b from-twilight-900 to-twilight-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="font-cinzel text-3xl md:text-5xl font-bold mb-6 text-lavender-300">
            Twilight Deck Builder
          </h1>
          <p className="text-lg text-moonlight-300 max-w-2xl mx-auto">
            Craft powerful decks with mystical synergies under the moonlit sky
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card Collection Panel */}
          <div className="lg:col-span-2">
            <div className="glass-effect p-6 rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-cinzel text-xl font-semibold text-lavender-300">Available Cards</h3>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-twilight-700 border-twilight-600 text-moonlight-100 w-40"
                    data-testid="input-card-search"
                  />
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-32 bg-twilight-700 border-twilight-600" data-testid="select-card-type">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="creature">Creatures</SelectItem>
                      <SelectItem value="spell">Spells</SelectItem>
                      <SelectItem value="artifact">Artifacts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {cardsLoading ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 rounded-lg bg-twilight-700/50" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-96 overflow-y-auto">
                  {filteredCards.map((card) => (
                    <div
                      key={card.id}
                      className="cursor-pointer transform hover:scale-105 transition-transform"
                      onClick={() => addCardToDeck(card.id)}
                      data-testid={`card-available-${card.id}`}
                    >
                      <img
                        src={card.imageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"}
                        alt={card.name}
                        className="w-full h-20 object-cover rounded-lg border border-twilight-600 hover:border-lavender-400"
                      />
                      <p className="text-xs text-center mt-1 text-moonlight-300 truncate">{card.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Deck Panel */}
          <div>
            <div className="glass-effect p-6 rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-cinzel text-xl font-semibold text-lavender-300">Current Deck</h3>
                <span className="text-sm text-moonlight-400" data-testid="text-deck-count">
                  {deckStats.cardCount}/{deckStats.maxCards}
                </span>
              </div>

              {/* Deck Name */}
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Deck name..."
                  value={deckName}
                  onChange={(e) => setDeckName(e.target.value)}
                  className="bg-twilight-700/50 border-twilight-600 text-moonlight-100"
                  data-testid="input-deck-name"
                />
              </div>

              {/* Deck Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-twilight-700/50 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-lavender-300" data-testid="text-avg-mana">{deckStats.avgMana}</div>
                  <div className="text-xs text-moonlight-400">Avg Mana</div>
                </div>
                <div className="bg-twilight-700/50 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-lavender-300" data-testid="text-total-power">{deckStats.totalPower}</div>
                  <div className="text-xs text-moonlight-400">Total Power</div>
                </div>
                <div className="bg-twilight-700/50 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-lavender-300" data-testid="text-synergy">{deckStats.synergy}%</div>
                  <div className="text-xs text-moonlight-400">Synergy</div>
                </div>
                <div className="bg-twilight-700/50 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-lavender-300" data-testid="text-deck-rarity">
                    {deckCards.length > 0 ? "Epic" : "-"}
                  </div>
                  <div className="text-xs text-moonlight-400">Avg Rarity</div>
                </div>
              </div>

              {/* Deck Cards */}
              <div className="space-y-2 max-h-64 overflow-y-auto mb-6">
                {deckCards.map((card) => (
                  <DeckCard
                    key={card.id}
                    card={card}
                    onRemove={() => removeCardFromDeck(card.id)}
                  />
                ))}
                {deckCards.length === 0 && (
                  <div className="text-center py-8 text-moonlight-400">
                    <div className="text-2xl mb-2">🃏</div>
                    <p className="text-sm">Drag cards here to build your deck</p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => saveDeckMutation.mutate()}
                  disabled={deckCards.length === 0 || saveDeckMutation.isPending}
                  className="w-full bg-gradient-to-r from-lavender-600 to-lavender-800 hover:from-lavender-500 hover:to-lavender-700 text-moonlight-100 py-3 rounded-xl font-semibold transition-all duration-300"
                  data-testid="button-save-deck"
                >
                  {saveDeckMutation.isPending ? "Saving..." : "Save Deck"}
                </Button>
                <Button
                  onClick={() => setSelectedCards([])}
                  variant="outline"
                  className="w-full glass-effect hover:bg-red-900/20 text-moonlight-100 py-2 rounded-xl font-medium transition-all duration-300 border-red-500/50"
                  data-testid="button-clear-deck"
                >
                  Clear Deck
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
