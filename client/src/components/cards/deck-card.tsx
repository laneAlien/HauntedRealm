import { Button } from "@/components/ui/button";
import type { Nft } from "@shared/schema";

interface DeckCardProps {
  card: Nft;
  onRemove: () => void;
}

export default function DeckCard({ card, onRemove }: DeckCardProps) {
  const getManaColor = (mana: number) => {
    if (mana <= 2) return "bg-green-600";
    if (mana <= 4) return "bg-blue-600";
    if (mana <= 6) return "bg-purple-600";
    return "bg-red-600";
  };

  return (
    <div 
      className="flex items-center gap-3 p-2 bg-twilight-700/30 rounded-lg hover:bg-twilight-700/50 transition-colors"
      data-testid={`deck-card-${card.id}`}
    >
      {/* Card Image */}
      <img
        src={card.imageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60"}
        alt={card.name}
        className="w-8 h-10 object-cover rounded border border-twilight-600"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60";
        }}
      />
      
      {/* Card Info */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-moonlight-100 truncate" data-testid={`deck-card-name-${card.id}`}>
          {card.name}
        </div>
        <div className="flex items-center gap-2 text-xs text-moonlight-400">
          <span>
            Mana: <span className="text-lavender-300 font-semibold">{card.mana || 0}</span>
          </span>
          <span>•</span>
          <span>
            Power: <span className="text-lavender-300 font-semibold">{card.power || 0}</span>
          </span>
        </div>
      </div>

      {/* Mana Cost Indicator */}
      <div className={`w-6 h-6 ${getManaColor(card.mana || 0)} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
        {card.mana || 0}
      </div>
      
      {/* Remove Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="text-red-400 hover:text-red-300 hover:bg-red-900/20 h-6 w-6 p-0"
        data-testid={`button-remove-deck-card-${card.id}`}
      >
        <i className="fas fa-times text-xs"></i>
      </Button>
    </div>
  );
}
