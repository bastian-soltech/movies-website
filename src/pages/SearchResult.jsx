import { useEffect, useState, useMemo, Suspense, lazy } from "react";
import { FiSearch, FiStar, FiCalendar, FiPlay } from "react-icons/fi";
import { useSearchParams } from "react-router";

// Lazy load komponen besar (kurangi initial bundle)
const NavBar = lazy(() => import("../components/navbar"));

export default function SearchResult() {
  const [searchParams] = useSearchParams();
  const query = useMemo(() => searchParams.get("q")?.trim() || "", [searchParams]);

  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState(null);

  const base_api = useMemo(() => "https://nonton-yuk-api.vercel.app", []);

  useEffect(() => {
    if (!query) return;

    const controller = new AbortController(); // bisa cancel fetch kalau user ganti query cepat
    const fetchMovies = async () => {
      setStatus("loading");
      setError(null);

      try {
        const urls = [
          // `${base_api}/api/search?query=${encodeURIComponent(query)}`,
          `${base_api}/v1/api/search?query=${encodeURIComponent(query)}`
        ];

        const responses = await Promise.all(
          urls.map(url => fetch(url, { 
            signal: controller.signal,
            cache: "force-cache" 
          }))
        );

        const results = await Promise.all(
          responses.map(async (res) => {
            if (!res.ok) return { detail: [] };
            try {
              return await res.json();
            } catch {
              return { detail: [] };
            }
          })
        );

        // Combine all 'detail' arrays and deduplicate by 'id'
        const combined = results.reduce((acc, curr) => {
          return [...acc, ...(curr.detail || [])];
        }, []);

        // const uniqueMovies = Array.from(
        //   new Map(combined.map(m => [m.resource_info?.id, m])).values()
        // );

        setMovies(combined);
        setStatus("success");
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
          setStatus("error");
        }
      }
    };

    fetchMovies();

    // cleanup → cancel fetch kalau user ganti query cepat
    return () => controller.abort();
  }, [query, base_api]);

  // Precompute text untuk hasil
  const resultsText = useMemo(() => {
    if (!query) return "Please enter a search term";
    if (status === "loading") return "Searching movies...";
    if (status === "error") return `Error: ${error}`;
    if (movies.length === 0) return `No movies found for "${query}"`;
    return `Found ${movies.length} ${movies.length === 1 ? "result" : "results"}`;
  }, [status, movies, query, error]);

  // Loading state global
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400">Searching movies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Suspense fallback={<div className="text-slate-400 text-center mt-20">Loading...</div>}>
        <NavBar />
      </Suspense>

      <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Search Header */}
          <div className="mb-12">
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-full px-4 py-2 mb-4">
              <FiSearch className="text-blue-400" />
              <span className="text-blue-300 text-sm font-medium">Search Results</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {query ? `Results for "${query}"` : "Search Movies"}
              </span>
            </h1>

            <p className="text-slate-400 text-lg">{resultsText}</p>
          </div>

          {/* Movies Grid */}
          {movies.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {movies.map((movie, index) => {
                const info = movie.resource_info;
                const share = movie.share_info;
                const tag = info?.tag_info;
                
                // Construct clean title and slug
                const title = info?.process_name || info?.name?.replace(/\.\w+$/, "") || "Unknown Movie";
                const slug = info.enid;
                
                const poster =  share?.cover?.url3 || "https://via.placeholder.com/300x450?text=No+Poster";

                return (
                  <a
                    key={index}
                    href={`/movies/streaming/${encodeURIComponent(slug)}/movie`}
                    className="group relative block will-change-transform"
                  >
                    <div className="relative h-0 pb-[150%] overflow-hidden rounded-xl shadow-2xl transition-all duration-500 hover:shadow-blue-500/20 hover:shadow-2xl">
                      {/* Lazy image loading */}
                      <img
                        src={poster}
                        alt={title}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/300x450?text=No+Poster";
                        }}
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      {/* Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="relative">
                          <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-60 animate-pulse"></div>
                          <div className="relative bg-blue-500/90 backdrop-blur-sm rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                            <FiPlay className="text-white text-3xl" />
                          </div>
                        </div>
                      </div>

                      {/* Movie Info */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-white text-sm md:text-base font-semibold line-clamp-2 mb-2 drop-shadow-lg">
                          {title}
                        </h3>

                        <div className="flex items-center gap-2">
                          {info?.rating > 0 && (
                            <div className="flex items-center space-x-1 bg-slate-900/80 backdrop-blur-sm rounded-full px-3 py-1">
                              <FiStar className="text-yellow-400 text-xs" />
                              <span className="text-yellow-400 text-xs font-medium">
                                {info.rating}
                              </span>
                            </div>
                          )}
                          {(tag?.year || info?.product_year) && (
                            <div className="flex items-center space-x-1 bg-slate-900/80 backdrop-blur-sm rounded-full px-3 py-1">
                              <FiCalendar className="text-blue-400 text-xs" />
                              <span className="text-blue-400 text-xs font-medium">
                                {tag?.year || info?.product_year}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="absolute inset-0 rounded-xl border border-blue-500/0 group-hover:border-blue-500/30 transition-all duration-500"></div>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
