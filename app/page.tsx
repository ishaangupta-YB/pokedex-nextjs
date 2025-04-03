"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";
import { PokemonCardSkeleton } from "@/components/PokemonCardSkeleton";
import { PokemonCard } from "@/components/PokemonCard";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PokemonDetailView from "@/src/components/PokemonDetailView";
import { Search, Filter, Sparkles } from "lucide-react";

interface Pokemon {
  id: number;
  name: string;
  imageUrl: string;
  types: string[];
}

interface PokemonApiResponse {
  pokemon: Pokemon[];
  totalCount: number;
}

const pokemonTypes = [
  "normal",
  "fire",
  "water",
  "grass",
  "electric",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

export default function Home() {
  const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [submittedQuery, setSubmittedQuery] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedPokemonName, setSelectedPokemonName] = useState<string | null>(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const limit = 20;

  const fetchPokemon = useCallback(
    async (page: number, query: string, type: string) => {
      console.log(
        `Fetching page ${page}, query: "${query}", type: "${type}"...`
      );
      setIsLoading(true);
      setError(null);
      try {
        const offset = (page - 1) * limit;
        const params = new URLSearchParams({
          limit: String(limit),
          offset: String(offset),
        });
        if (query) params.set("search", query);
        if (type) params.set("type", type);

        const response = await fetch(`/api/pokemon?${params.toString()}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch Pokémon: ${response.statusText}`);
        }
        const data: PokemonApiResponse = await response.json();

        setPokemonData(data.pokemon);
        setTotalPages(Math.ceil(data.totalCount / limit));
        if (!initialLoadComplete) setInitialLoadComplete(true);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setPokemonData([]);
        setTotalPages(0);
      } finally {
        setIsLoading(false);
      }
    },
    [limit, initialLoadComplete]
  );

  useEffect(() => {
    fetchPokemon(currentPage, submittedQuery, selectedType);
  }, [currentPage, submittedQuery, selectedType, fetchPokemon]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmittedQuery(searchQuery);
    setCurrentPage(1);
    console.log("Search submitted:", searchQuery);
  };

  const handleTypeChange = (value: string) => {
    const newType = value === "all" ? "" : value;
    setSelectedType(newType);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleOpenDetailView = (pokemonName: string) => {
    setSelectedPokemonName(pokemonName);
  };

  const handleCloseDetailView = () => {
    setSelectedPokemonName(null);
  };

  const placeholders = [
    "Search by name... e.g., Pikachu",
    "Try 'Charizard'",
    "Find 'Eevee'",
    "Who is 'Mewtwo'?",
    "Looking for 'Bulbasaur'?",
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        duration: 0.4,
        when: "beforeChildren",
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: "afterChildren",
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24, 
        mass: 0.5, 
        duration: 0.5 
      } 
    },
    exit: { 
      y: 20, 
      opacity: 0, 
      transition: { 
        duration: 0.3 
      }
    },
  };

  const pageTransitionVariant = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.3 }},
    exit: { opacity: 0, x: 20, transition: { duration: 0.3 }}
  };

  // Header decoration animation variants
  const headerDecorVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        delay: 0.2,
        duration: 0.6,
        type: "spring"
      }
    }
  };

  return (
    <Dialog open={!!selectedPokemonName} onOpenChange={(open: boolean) => !open && handleCloseDetailView()}>
      <motion.div 
        className="min-h-[calc(100vh-8rem)] space-y-8 py-2 px-4 sm:px-6"
        initial="initial"
        animate="animate"
        variants={pageTransitionVariant}
      >
        <motion.div 
          className="relative flex flex-col items-center mb-12 pt-4 pb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Decorative elements */}
          <motion.div 
            className="absolute top-0 left-0 w-24 h-24 text-primary/10 -z-10"
            variants={headerDecorVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="w-full h-full rounded-full bg-primary/5 backdrop-blur-sm" />
          </motion.div>
          <motion.div 
            className="absolute bottom-10 right-0 w-32 h-32 text-primary/10 -z-10"
            variants={headerDecorVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <div className="w-full h-full rounded-full bg-primary/5 backdrop-blur-sm" />
          </motion.div>
          
          {/* Main title */}
          <motion.div 
            className="mb-2 text-center"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center justify-center space-x-2 mb-2">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              >
                <Sparkles className="h-6 w-6 text-primary" />
              </motion.div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Explore the <span className="text-primary">Pokémon</span> World
              </h1>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
              Discover detailed information about your favorite Pokémon. Search by name or filter by type.
            </p>
          </motion.div>

          {/* Search and filter section */}
          <motion.div 
            className="w-full max-w-3xl mt-8 flex flex-col sm:flex-row gap-4 items-center"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3, type: "spring", stiffness: 100 }}
          >
            <div className="flex-grow w-full relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Search className="h-4 w-4" />
              </div>
              <PlaceholdersAndVanishInput
                placeholders={placeholders}
                onChange={handleSearchChange}
                onSubmit={handleSearchSubmit}
              />
            </div>

            <div className="flex-shrink-0 w-full sm:w-auto">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                  <Filter className="h-4 w-4" />
                </div>
                <Select onValueChange={handleTypeChange} value={selectedType || "all"}>
                  <SelectTrigger className="w-full sm:w-[180px] pl-9">
                    <SelectValue placeholder="Filter by Type" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    <SelectItem value="all">All Types</SelectItem>
                    {pokemonTypes.map((type) => (
                      <SelectItem key={type} value={type} className="capitalize">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              className="text-center text-red-500 bg-red-100 dark:bg-red-900/30 p-6 rounded-lg shadow-sm max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
              transition={{ duration: 0.3 }}
            >
              <p className="font-semibold text-lg mb-1">Error loading Pokémon!</p>
              <p>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentPage}-${submittedQuery}-${selectedType}`}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout
          >
            {isLoading &&
              Array.from({ length: limit }).map((_, index) => (
                <motion.div 
                  key={`skeleton-${index}`}
                  variants={itemVariants}
                  className="transform hover:scale-[1.02] transition-transform duration-200"
                >
                  <PokemonCardSkeleton />
                </motion.div>
              ))}

            {!isLoading && !error && (
              <>
                {pokemonData.length > 0 ? (
                  pokemonData.map((pokemon) => (
                    <motion.div
                      key={pokemon.id}
                      variants={itemVariants}
                      layout
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="transform hover:scale-[1.02] hover:-translate-y-1 transition-all duration-200"
                      whileHover={{ 
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" 
                      }}
                    >
                      <PokemonCard
                        pokemon={pokemon}
                        onClick={() => handleOpenDetailView(pokemon.name)}
                      />
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    className="col-span-full flex flex-col items-center justify-center text-center p-12 border border-dashed border-muted rounded-lg bg-background/50 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Search className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">No Pokémon Found</h3>
                    <p className="text-muted-foreground max-w-md">
                      {searchQuery || selectedType
                        ? `No Pokémon match your search criteria. Try different keywords or filters.`
                        : `No Pokémon found. Please try again later.`}
                    </p>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {!isLoading && !error && totalPages > 1 && (
            <motion.div 
              className="flex justify-center pt-8 pb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage - 1);
                      }}
                      className={
                        currentPage === 1
                          ? "pointer-events-none text-muted-foreground opacity-50"
                          : "hover:scale-105 transition-transform"
                      }
                      aria-disabled={currentPage === 1}
                    />
                  </PaginationItem>

                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      Math.abs(pageNum - currentPage) <= 1
                    ) {
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(pageNum);
                            }}
                            isActive={currentPage === pageNum}
                            className={currentPage === pageNum 
                              ? "scale-110 font-bold shadow-sm" 
                              : "hover:scale-110 transition-transform"}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    } else if (Math.abs(pageNum - currentPage) === 2) {
                      return (
                        <PaginationItem key={`ellipsis-${pageNum}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage + 1);
                      }}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none text-muted-foreground opacity-50"
                          : "hover:scale-105 transition-transform"
                      }
                      aria-disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-0">
        {selectedPokemonName && (
          <DialogHeader className="sr-only">
            <DialogTitle className="capitalize">{selectedPokemonName} Details</DialogTitle>
          </DialogHeader>
        )}
        {selectedPokemonName && (
          <PokemonDetailView pokemonName={selectedPokemonName} />
        )}
      </DialogContent>
    </Dialog>
  );
}
