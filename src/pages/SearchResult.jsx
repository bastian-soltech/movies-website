import { useEffect, useState, useMemo, Suspense, lazy } from "react";
import { FiSearch, FiStar, FiCalendar, FiPlay } from "react-icons/fi";
import { useSearchParams } from "react-router";
import MoviesCard from "../components/MoviesComponent/MoviesCard";

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
      <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>}>
        <NavBar />
      </Suspense>

      <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Search Header */}
          <div className="mb-16 space-y-4">
            <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold uppercase tracking-[0.3em] text-blue-500">
              Discovery
            </div>

            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-none">
              {query ? (
                <>Search: <span className="text-blue-500">{query}</span></>
              ) : (
                "Explore Movies"
              )}
            </h1>

            <p className="text-slate-500 text-lg font-medium">{resultsText}</p>
          </div>

          {/* Movies Grid */}
          {movies.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 sm:gap-8">
              {movies.map((movie, index) => {
                const info = movie.resource_info;
                const share = movie.share_info;
                
                // Construct clean title and slug
                const title = info?.process_name || info?.name?.replace(/\.\w+$/, "") || "Unknown Movie";
                const slug = info.enid;
                const poster =  share?.cover?.url3 || "https://via.placeholder.com/300x450?text=No+Poster";

                return (
                  <MoviesCard
                    key={index}
                    posterUrls={poster}
                    movieTitle={title}
                    rating={info?.rating}
                    id={slug}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
