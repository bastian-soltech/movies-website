import { useEffect, useState, useMemo, Suspense, lazy } from "react";
import { FiSearch, FiStar, FiCalendar, FiPlay, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useSearchParams } from "react-router";
import MoviesCard from "../components/MoviesComponent/MoviesCard";

const NavBar = lazy(() => import("../components/navbar"));

export default function SearchResult() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = useMemo(() => searchParams.get("q")?.trim() || "", [searchParams]);
  
  // Mengambil page dari URL parameter, default ke 1 jika tidak ada
  const page = useMemo(() => {
    const p = parseInt(searchParams.get("page"), 10);
    return isNaN(p) || p < 1 ? 1 : p;
  }, [searchParams]);

  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState(null);

  const base_api = useMemo(() => "https://nonton-yuk-api.vercel.app", []);

  // Handler untuk mengubah halaman lewat URL params
  const handlePageChange = (newPage) => {
    if (newPage < 1) return;
    setSearchParams({ q: query, page: newPage.toString() });
    window.scrollTo({ top: 0, behavior: "smooth" }); // Efek scroll ke atas saat ganti page
  };

  useEffect(() => {
    if (!query) return;

    const controller = new AbortController();
    const fetchMovies = async () => {
      setStatus("loading");
      setError(null);

      try {
        // Integrasi parameter page ke endpoint API Anda
        const urls = [
          `${base_api}/api/search?query=${encodeURIComponent(query)}&page=${page}`,
          `${base_api}/v1/api/search?query=${encodeURIComponent(query)}&page=${page}`
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

        // Gabungkan semua data dari 'detail'
        const combined = results.reduce((acc, curr) => {
          return [...acc, ...(curr.detail || [])];
        }, []);

        const uniqueMovies = Array.from(
          new Map(
            combined
              .filter(m => m?.resource_info?.enid && m?.resource_info?.adult == 0) // pastikan ID ada
              .map(m => [m.resource_info.enid, m])
          ).values()
        );

        setMovies(uniqueMovies);
        setStatus("success");
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
          setStatus("error");
        }
      }
    };

    fetchMovies();

    return () => controller.abort();
  }, [query, page, base_api]); // effect akan re-run jika query atau page berubah

  const resultsText = useMemo(() => {
    if (!query) return "Please enter a search term";
    if (status === "loading") return "Searching movies...";
    if (status === "error") return `Error: ${error}`;
    if (movies.length === 0) return `No movies found for "${query}" on page ${page}`;
    return `Found ${movies.length} results on Page ${page}`;
  }, [status, movies, query, error, page]);

  return (
    <div className="min-h-screen bg-slate-950">
      <Suspense fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
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

          {/* SKELETON / LOADING STATE */}
          {status === "loading" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 sm:gap-8">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="space-y-3 animate-pulse">
                  <div className="bg-slate-800 rounded-2xl aspect-[2/3] w-full" />
                  <div className="h-4 bg-slate-800 rounded w-2/3" />
                  <div className="h-3 bg-slate-800 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            /* MOVIES GRID */
            movies.length > 0 && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 sm:gap-8">
                  {movies.map((movie, index) => {
                    const info = movie.resource_info;
                    const share = movie.share_info;
                    
                    const title = info?.process_name || info?.name?.replace(/\.\w+$/, "") || "Unknown Movie";
                    const slug = info?.enid;
                    const poster = share?.cover?.url3 || "https://via.placeholder.com/300x450?text=No+Poster";

                    return (
                      <MoviesCard
                        key={`${slug}-${index}`}
                        posterUrls={poster}
                        movieTitle={title}
                        rating={info?.rating}
                        id={slug}
                      />
                    );
                  })}
                </div>

                {/* PAGINATION BUTTONS */}
                <div className="mt-16 flex items-center justify-center gap-4">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 transition disabled:opacity-30 disabled:hover:bg-slate-900 font-medium"
                  >
                    <FiChevronLeft size={20} />
                    <span>Prev</span>
                  </button>
                  
                  <div className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 font-bold min-w-[3rem] text-center">
                    {page}
                  </div>

                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={movies.length < 5} // Matikan tombol next jika data di page ini terlalu sedikit/habis
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 transition disabled:opacity-30 disabled:hover:bg-slate-900 font-medium"
                  >
                    <span>Next</span>
                    <FiChevronRight size={20} />
                  </button>
                </div>
              </>
            )
          )}

        </div>
      </div>
    </div>
  );
}