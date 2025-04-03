import { NextRequest, NextResponse } from 'next/server';

interface PokemonListItem {
  name: string;
  url: string;
}

interface PokemonTypeInfo {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

interface PokemonSprites {
  front_default: string | null;
  other?: {
    'official-artwork': {
      front_default: string | null;
    };
  };
}

interface PokemonDetails {
  id: number;
  name: string;
  types: PokemonTypeInfo[];
  sprites: PokemonSprites;
}

// Function to fetch details for a single Pokémon
async function fetchPokemonDetails(url: string): Promise<PokemonDetails | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.statusText}`);
      return null; // Skip this Pokémon if details fetch fails
    }
    const data: PokemonDetails = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching details for ${url}:`, error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit') ?? '20'; // Default limit 20
  const offset = searchParams.get('offset') ?? '0'; // Default offset 0

  const POKEAPI_URL = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;

  try {
    // Fetch the initial list of Pokémon
    const listResponse = await fetch(POKEAPI_URL);
    if (!listResponse.ok) {
      return NextResponse.json(
        { error: `Failed to fetch Pokémon list: ${listResponse.statusText}` },
        { status: listResponse.status }
      );
    }
    const listData = await listResponse.json();
    const pokemonList: PokemonListItem[] = listData.results;

    // Fetch details for each Pokémon in parallel
    const detailedPokemonPromises = pokemonList.map(pokemon => fetchPokemonDetails(pokemon.url));
    const detailedPokemonResults = await Promise.all(detailedPokemonPromises);

    // Filter out null results (due to errors) and format the data
    const formattedPokemonData = detailedPokemonResults
      .filter((details): details is PokemonDetails => details !== null)
      .map(details => ({
        id: details.id,
        name: details.name,
        imageUrl: details.sprites.other?.['official-artwork']?.front_default ?? details.sprites.front_default ?? '/placeholder.png', // Provide a fallback
        types: details.types.map(typeInfo => typeInfo.type.name),
      }));

    // Return the formatted data and the total count for pagination purposes
    return NextResponse.json({
        pokemon: formattedPokemonData,
        totalCount: listData.count // Total number of Pokémon available in the API
    });

  } catch (error) {
    console.error('Error in GET /api/pokemon:', error);
    return NextResponse.json(
      { error: 'Internal Server Error fetching Pokémon data' },
      { status: 500 }
    );
  }
} 