import { NextRequest, NextResponse } from 'next/server';

interface PokemonStat {
  base_stat: number;
  stat: {
    name: string;
  };
}
 

interface PokemonType {
  slot: number;
  type: {
    name: string;
  };
}

interface PokemonSprites {
  front_default: string;
  other?: {
    dream_world?: {
      front_default?: string;
    };
    home?: {
      front_default?: string;
    };
    'official-artwork'?: {
      front_default?: string;
    };
  };
}

interface PokemonAbilityApi {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

interface PokeApiResponse {
  id: number;
  name: string;
  height: number; // decimetres
  weight: number; // hectograms
  stats: PokemonStat[];
  abilities: PokemonAbilityApi[];
  types: PokemonType[];
  sprites: PokemonSprites;
  species: {
    url: string; // URL to species data
  };
}

interface SpeciesApiResponse {
    flavor_text_entries: {
        flavor_text: string;
        language: {
            name: string;
            url: string;
        };
        version: {
            name: string;
            url: string;
        };
    }[];
    evolution_chain: {
        url: string; // URL for the evolution chain
    };
}

interface EvolutionChainNode {
    species: {
        name: string;
        url: string; // URL like https://pokeapi.co/api/v2/pokemon-species/1/
    };
    evolves_to: EvolutionChainNode[];
}

interface EvolutionChainResponse {
    chain: EvolutionChainNode;
    id: number;
}

interface EvolutionStage {
    id: number;
    name: string;
}

interface PokemonDetail {
  id: number;
  name: string;
  imageUrl: string;
  height: number; // Converted to meters
  weight: number; // Converted to kilograms
  stats: { name: string; value: number }[];
  abilities: { name: string; isHidden: boolean }[];
  types: string[];
  description: string;
  evolutionChain: EvolutionStage[] | null;
}

const findEnglishFlavorText = (entries: SpeciesApiResponse['flavor_text_entries']): string => {
    const englishEntry = entries.find(entry => entry.language.name === 'en');
    return englishEntry?.flavor_text.replace(/[\n\f\r]/g, ' ') || 'No description available.';
};

const getPokemonIdFromUrl = (url: string): number => {
  const parts = url.split('/').filter(Boolean);
  return parseInt(parts[parts.length - 1], 10);
};

const parseEvolutionChain = (node: EvolutionChainNode): EvolutionStage[] => {
    const chain: EvolutionStage[] = [];
    let currentNode: EvolutionChainNode | null = node;

    while (currentNode) {
        const pokemonId = getPokemonIdFromUrl(currentNode.species.url);
        if (!isNaN(pokemonId)) {
             chain.push({
                 id: pokemonId,
                 name: currentNode.species.name.replace('-', ' ')
             });
         }

        if (currentNode.evolves_to.length > 0) {
            currentNode = currentNode.evolves_to[0];
        } else {
            currentNode = null;
        }
    }
    return chain;
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ name: string }>   }
) {
  try {
    const name = (await context.params).name;

    if (!name) {
      return NextResponse.json({ error: 'Pokémon name or ID is required' }, { status: 400 });
    }
    const nameOrId = name.toLowerCase();

    const POKEAPI_URL = `https://pokeapi.co/api/v2/pokemon/${nameOrId}`;
    console.log(`Fetching details for: ${nameOrId} from ${POKEAPI_URL}`);
    const pokemonResponse = await fetch(POKEAPI_URL);

    if (!pokemonResponse.ok) {
      if (pokemonResponse.status === 404) {
        return NextResponse.json({ error: `Pokémon "${nameOrId}" not found` }, { status: 404 });
      }
      console.error(`PokeAPI error for ${nameOrId}: ${pokemonResponse.status} ${pokemonResponse.statusText}`);
      throw new Error(`Failed to fetch Pokémon data from PokeAPI: ${pokemonResponse.statusText}`);
    }

    const pokemonData: PokeApiResponse = await pokemonResponse.json();

    let description = 'Could not load description.';
    let evolutionChainUrl: string | null = null;
    try {
        console.log(`Fetching species data from: ${pokemonData.species.url}`)
        const speciesResponse = await fetch(pokemonData.species.url);
        if (speciesResponse.ok) {
            const speciesData: SpeciesApiResponse = await speciesResponse.json();
            description = findEnglishFlavorText(speciesData.flavor_text_entries);
            evolutionChainUrl = speciesData.evolution_chain.url;
        } else {
             console.error(`Failed to fetch species data: ${speciesResponse.status} ${speciesResponse.statusText}`);
        }
    } catch (speciesError) {
         console.error(`Error fetching species data:`, speciesError);
    }

    let evolutionChain: EvolutionStage[] | null = null;
    if (evolutionChainUrl) {
        try {
            console.log(`Fetching evolution chain from: ${evolutionChainUrl}`);
            const evolutionResponse = await fetch(evolutionChainUrl);
            if (evolutionResponse.ok) {
                const evolutionData: EvolutionChainResponse = await evolutionResponse.json();
                evolutionChain = parseEvolutionChain(evolutionData.chain);
            } else {
                 console.error(`Failed to fetch evolution chain: ${evolutionResponse.status} ${evolutionResponse.statusText}`);
            }
        } catch (evolutionError) {
             console.error(`Error fetching evolution chain:`, evolutionError);
        }
    } else {
        console.log("No evolution chain URL found.");
    }

    const pokemonDetail: PokemonDetail = {
      id: pokemonData.id,
      name: pokemonData.name,
      imageUrl:
        pokemonData.sprites.other?.['official-artwork']?.front_default ||
        pokemonData.sprites.other?.home?.front_default ||
        pokemonData.sprites.front_default,
      height: pokemonData.height / 10,
      weight: pokemonData.weight / 10,
      stats: pokemonData.stats.map((s) => ({
        name: s.stat.name.replace('-', ' '),
        value: s.base_stat,
      })).sort((a, b) => {
         const order = ['hp', 'attack', 'defense', 'special attack', 'special defense', 'speed'];
         return order.indexOf(a.name) - order.indexOf(b.name);
      }),
      abilities: pokemonData.abilities
        .sort((a, b) => a.slot - b.slot)
        .map((a) => ({
             name: a.ability.name.replace('-', ' '),
             isHidden: a.is_hidden
         })),
      types: pokemonData.types
        .sort((a, b) => a.slot - b.slot)
        .map((t) => t.type.name),
      description: description,
      evolutionChain: evolutionChain,
    };

    return NextResponse.json(pokemonDetail);

  } catch (error) {
    console.error("Error in Pokemon detail route:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    const displayError = errorMessage.includes("Failed to fetch")
      ? errorMessage
      : 'Failed to process Pokémon details.';
    return NextResponse.json({ error: displayError }, { status: 500 });
  }
}