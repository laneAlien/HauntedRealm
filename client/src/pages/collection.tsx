import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import NftCard from "@/components/cards/nft-card";
import { useWallet } from "@/hooks/use-wallet";
import type { Nft } from "@shared/schema";

export default function Collection() {
  const { user } = useWallet();
  const [searchTerm, setSearchTerm] = useState("");
  const [rarityFilter, setRarityFilter] = useState("all");
  const [factionFilter, setFactionFilter] = useState("all");

  const { data: nfts = [], isLoading } = useQuery<Nft[]>({
    queryKey: ["/api/nfts", { ownerId: user?.id }],
    enabled: !!user?.id,
  });

  const filteredNfts = nfts.filter((nft) => {
    const matchesSearch = nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         nft.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRarity = rarityFilter === "all" || nft.rarity === rarityFilter;
    const matchesFaction = factionFilter === "all" || nft.faction === factionFilter;
    
    return matchesSearch && matchesRarity && matchesFaction;
  });

  if (!user) {
    return (
      <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-cinzel text-2xl font-bold text-lavender-300 mb-4">Connect Your Wallet</h2>
          <p className="text-moonlight-300">Please connect your TON wallet to view your collection.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="font-cinzel text-3xl md:text-5xl font-bold mb-6 text-lavender-300">
            Your Moonlit Collection
          </h1>
          <p className="text-lg text-moonlight-300 max-w-2xl mx-auto">
            Explore your ethereal NFT cards, each imbued with twilight magic and gothic elegance
          </p>
        </div>

        {/* Filter Controls */}
        <div className="glass-effect p-6 rounded-xl mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <Select value={rarityFilter} onValueChange={setRarityFilter}>
                <SelectTrigger className="w-40 bg-twilight-700 border-twilight-600" data-testid="select-rarity">
                  <SelectValue placeholder="All Rarities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Rarities</SelectItem>
                  <SelectItem value="Legendary">Legendary</SelectItem>
                  <SelectItem value="Epic">Epic</SelectItem>
                  <SelectItem value="Rare">Rare</SelectItem>
                  <SelectItem value="Common">Common</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={factionFilter} onValueChange={setFactionFilter}>
                <SelectTrigger className="w-44 bg-twilight-700 border-twilight-600" data-testid="select-faction">
                  <SelectValue placeholder="All Factions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Factions</SelectItem>
                  <SelectItem value="Shadow Realm">Shadow Realm</SelectItem>
                  <SelectItem value="Moonlight Court">Moonlight Court</SelectItem>
                  <SelectItem value="Ethereal Spirits">Ethereal Spirits</SelectItem>
                </SelectContent>
              </Select>
              
              <Input
                type="text"
                placeholder="Search cards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-twilight-700 border-twilight-600 text-moonlight-100 w-64"
                data-testid="input-search"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-moonlight-300 hover:text-lavender-300" data-testid="button-grid-view">
                <i className="fas fa-th-large"></i>
              </Button>
              <Button variant="ghost" size="icon" className="text-moonlight-300 hover:text-lavender-300" data-testid="button-list-view">
                <i className="fas fa-list"></i>
              </Button>
            </div>
          </div>
        </div>

        {/* NFT Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-xl bg-twilight-700/50" />
            ))}
          </div>
        ) : filteredNfts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredNfts.map((nft) => (
                <NftCard key={nft.id} nft={nft} />
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button
                variant="outline"
                className="glass-effect hover:bg-lavender-800/20 text-moonlight-100 px-8 py-3 rounded-xl font-medium transition-all duration-300 border-lavender-600/50"
                data-testid="button-load-more"
              >
                Load More Cards
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🌙</div>
            <h3 className="font-cinzel text-2xl font-semibold text-lavender-300 mb-2">No Cards Found</h3>
            <p className="text-moonlight-300 mb-8">
              {searchTerm || rarityFilter !== "all" || factionFilter !== "all"
                ? "Try adjusting your search filters to find more cards."
                : "Start your collection by purchasing your first NFT cards."}
            </p>
            <Button
              className="bg-gradient-to-r from-lavender-600 to-lavender-800 hover:from-lavender-500 hover:to-lavender-700 text-moonlight-100 px-8 py-3 rounded-xl font-semibold transition-all duration-300"
              data-testid="button-explore-marketplace"
            >
              <i className="fas fa-shopping-cart mr-2"></i>
              Explore Marketplace
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
