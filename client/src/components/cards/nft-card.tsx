import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Nft } from "@shared/schema";

interface NftCardProps {
  nft: Nft;
  onClick?: () => void;
}

export default function NftCard({ nft, onClick }: NftCardProps) {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Legendary":
        return "bg-gradient-to-r from-yellow-500 to-yellow-600";
      case "Epic":
        return "bg-gradient-to-r from-purple-600 to-purple-800";
      case "Rare":
        return "bg-gradient-to-r from-blue-600 to-blue-800";
      case "Common":
        return "bg-gradient-to-r from-gray-600 to-gray-800";
      default:
        return "bg-gradient-to-r from-gray-600 to-gray-800";
    }
  };

  const getManaColor = (mana: number) => {
    if (mana <= 2) return "bg-green-600";
    if (mana <= 4) return "bg-blue-600";
    if (mana <= 6) return "bg-purple-600";
    return "bg-red-600";
  };

  const getFactionIcon = (faction?: string) => {
    switch (faction) {
      case "Shadow Realm":
        return "fas fa-mask";
      case "Moonlight Court":
        return "fas fa-moon";
      case "Ethereal Spirits":
        return "fas fa-ghost";
      default:
        return "fas fa-star";
    }
  };

  return (
    <Card 
      className="nft-card rounded-xl p-4 cursor-pointer bg-gradient-to-br from-twilight-700/30 to-twilight-800/50 border-twilight-600/50 hover:border-lavender-400/50"
      onClick={onClick}
      data-testid={`nft-card-${nft.id}`}
    >
      <CardContent className="p-0">
        {/* Card Image */}
        <div className="relative mb-4">
          <img
            src={nft.imageUrl || "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400"}
            alt={nft.name}
            className="w-full h-48 object-cover rounded-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400";
            }}
            data-testid={`nft-image-${nft.id}`}
          />
          
          {/* Rarity Badge */}
          <Badge 
            className={`absolute top-2 right-2 ${getRarityColor(nft.rarity)} text-white text-xs px-2 py-1 font-semibold border-0`}
            data-testid={`nft-rarity-${nft.id}`}
          >
            {nft.rarity}
          </Badge>
          
          {/* Mana Cost */}
          <div className="absolute bottom-2 left-2 flex items-center gap-1">
            <div className={`w-6 h-6 ${getManaColor(nft.mana || 0)} rounded-full flex items-center justify-center text-xs font-bold text-white`}>
              <i className={getFactionIcon(nft.faction)}></i>
            </div>
            <span className="text-xs font-medium text-moonlight-100 bg-black/70 px-2 py-1 rounded backdrop-blur-sm">
              {nft.mana || 0}
            </span>
          </div>

          {/* Power indicator */}
          <div className="absolute top-2 left-2 bg-black/70 text-moonlight-100 text-xs px-2 py-1 rounded backdrop-blur-sm font-semibold">
            ⚡ {nft.power || 0}
          </div>
        </div>

        {/* Card Info */}
        <div>
          <h3 className="font-cinzel text-lg font-semibold mb-2 text-lavender-300 truncate" data-testid={`nft-name-${nft.id}`}>
            {nft.name}
          </h3>
          
          <p className="text-sm text-moonlight-300 mb-3 font-spectral line-clamp-2 min-h-[2.5rem]" data-testid={`nft-description-${nft.id}`}>
            {nft.description || "A mysterious card shrouded in twilight magic."}
          </p>
          
          <div className="flex justify-between items-center text-xs">
            <span className="text-moonlight-400">
              Power: <span className="text-lavender-300 font-semibold">{nft.power || 0}</span>
            </span>
            <span className="text-moonlight-400">
              Mana: <span className="text-lavender-300 font-semibold">{nft.mana || 0}</span>
            </span>
          </div>

          {/* Abilities */}
          {nft.abilities && nft.abilities.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {nft.abilities.slice(0, 2).map((ability, index) => (
                <Badge 
                  key={index}
                  variant="outline"
                  className="text-xs border-lavender-600/50 text-lavender-300 bg-lavender-900/20"
                  data-testid={`nft-ability-${nft.id}-${index}`}
                >
                  {ability}
                </Badge>
              ))}
              {nft.abilities.length > 2 && (
                <Badge 
                  variant="outline"
                  className="text-xs border-lavender-600/50 text-lavender-300 bg-lavender-900/20"
                >
                  +{nft.abilities.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* Faction */}
          {nft.faction && (
            <div className="mt-2 text-xs text-moonlight-400 flex items-center gap-1">
              <i className={getFactionIcon(nft.faction)}></i>
              <span data-testid={`nft-faction-${nft.id}`}>{nft.faction}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
