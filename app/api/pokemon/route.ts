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

// --- Caching Mechanism (Simple In-Memory Cache) ---
// WARNING: Simple cache, clears on server restart. Consider Redis/etc. for production.
interface CacheEntry {
    data: PokemonListItem[];
    timestamp: number;
}
const cache: { allPokemon?: CacheEntry } = {};
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour

async function getAllPokemonList(): Promise<PokemonListItem[]> {
    const now = Date.now();
    if (cache.allPokemon && (now - cache.allPokemon.timestamp < CACHE_DURATION_MS)) {
        console.log("Cache hit for allPokemon list.");
        return cache.allPokemon.data;
    }

    console.log("Cache miss or expired. Fetching allPokemon list from API...");
    try {
        // Fetch a large limit to get most/all Pokémon names/URLs
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1500'); 
        if (!response.ok) {
            throw new Error(`Failed to fetch full Pokémon list: ${response.statusText}`);
        }
        const data = await response.json();
        const allPokemon: PokemonListItem[] = data.results;
        
        // Update cache
        cache.allPokemon = { data: allPokemon, timestamp: now };
        console.log(`Fetched and cached ${allPokemon.length} Pokémon names.`);
        return allPokemon;
    } catch (error) {
        console.error("Error fetching all Pokémon list:", error);
        // Return cached data if available, even if expired, otherwise throw
        if (cache.allPokemon) return cache.allPokemon.data;
        throw error; 
    }
}
// --- End Cache ---

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
  const limit = parseInt(searchParams.get('limit') ?? '20');
  const offset = parseInt(searchParams.get('offset') ?? '0');
  const searchTerm = searchParams.get('search')?.toLowerCase() ?? '';
  const filterType = searchParams.get('type')?.toLowerCase() ?? '';

  try {
    // 1. Get the full list (from cache or API)
    const allPokemonList = await getAllPokemonList();

    // 2. Filter the list based on search term (server-side)
    let filteredList = allPokemonList;
    if (searchTerm) {
      filteredList = filteredList.filter(p => p.name.toLowerCase().includes(searchTerm));
    }

    // 3. Filter by type (requires fetching details - less efficient here, better if API supported type filtering directly)
    //    Alternatively, skip type filtering here and let client handle it if needed.
    //    For this example, we will fetch details for the search-filtered list and then filter by type.
    
    const totalCountAfterSearch = filteredList.length;

    // 4. Apply Pagination *before* fetching details
    const paginatedListSlice = filteredList.slice(offset, offset + limit);

    // 5. Fetch details ONLY for the paginated slice
    const detailedPokemonPromises = paginatedListSlice.map(pokemon => fetchPokemonDetails(pokemon.url));
    let detailedPokemonResults = await Promise.all(detailedPokemonPromises);

    // Remove nulls (fetch errors)
    detailedPokemonResults = detailedPokemonResults.filter(Boolean);

    // 6. Apply Type Filter (if provided) AFTER fetching details for the slice
    if (filterType) {
        detailedPokemonResults = detailedPokemonResults.filter(details => 
            details!.types.some(typeInfo => typeInfo.type.name.toLowerCase() === filterType)
        );
    }

    // 7. Format the final slice
    const formattedPokemonData = detailedPokemonResults.map(details => ({
      id: details!.id,
      name: details!.name,
      imageUrl: details!.sprites.other?.['official-artwork']?.front_default ?? details!.sprites.front_default ?? '/placeholder.png',
      types: details!.types.map(typeInfo => typeInfo.type.name),
    }));

    // Return the formatted slice and the total count *after search filtering*
    return NextResponse.json({
      pokemon: formattedPokemonData,
      totalCount: totalCountAfterSearch // Total count relevant for pagination is after search filter
    });

  } catch (error) {
    console.error('Error in GET /api/pokemon:', error);
    return NextResponse.json(
      { error: 'Internal Server Error fetching Pokémon data' },
      { status: 500 }
    );
  }
} 