import React from "react";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";

interface EvolutionStage {
  id: number;
  name: string;
}

interface EvolutionChainDisplayProps {
  chain: EvolutionStage[] | null;
  currentPokemonId: number; // To highlight the current Pokémon
}

const EvolutionChainDisplay = ({
  chain,
  currentPokemonId,
}: EvolutionChainDisplayProps) => {
  if (!chain || chain.length < 1) {
    return (
      <p className="text-muted-foreground text-sm">
        No evolution data available for this Pokémon.
      </p>
    );
  }

  // Basic display: names separated by arrows
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
      {chain.map((stage, index) => (
        <React.Fragment key={stage.id}>
          {/* Separator Arrow */}
          {index > 0 && (
            <ArrowRightIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          )}

          {/* Evolution Stage Item */}
          <div
            className={cn(
              "flex flex-col items-center text-center capitalize p-2 rounded-md transition-colors",
              stage.id === currentPokemonId
                ? "font-semibold text-primary" // Highlight current Pokémon
                : "text-muted-foreground hover:text-foreground"
              // Later: Add hover effects, link to pokemon page, or fetch image
            )}
          >
            {/* Placeholder for image - Future enhancement */}
            {/* <div className="w-16 h-16 bg-muted rounded-full mb-1"></div> */}
            <span className="text-sm">{stage.name}</span>
            {/* <span className="text-xs text-muted-foreground">#{String(stage.id).padStart(4, '0')}</span> */}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default EvolutionChainDisplay;
