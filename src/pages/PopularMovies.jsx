import { useEffect, useState } from "react";
import { FiClock, FiPlay, FiStar } from "react-icons/fi";
import NavBar from "../components/navbar";
import MoviesCard from "../components/MoviesComponent/MoviesCard";
import { IoCompassOutline } from "react-icons/io5";

export default function PopularMoviesPage() {
    const [Popular, setPopular] = useState([]);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);
      const [currentPage, setCurrentPage] = useState(1);
      const [hasNextPage, setHasNextPage] = useState(true);
      const perPage = 21;
      const [pageBlock, setPageBlock] = useState(0);
    
      useEffect(() => {
        const fetchPopular = async () => {
          setLoading(true);
          try {
            const response = await fetch(
              `https://nonton-yuk-api.vercel.app/api/hot-movies/1/${currentPage}`
            );
            const data = await response.json();
            setPopular(data.detail);
            setHasNextPage(data.total === perPage);
          } catch (err) {
            setError("Failed to fetch movies.");
          } finally {
            setLoading(false);
          }
        };
    
        fetchPopular();
      }, [currentPage]);
    
      const handlePageClick = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
    
      const nextPageBlock = () => {
        if (hasNextPage) {
          setPageBlock(pageBlock + 1);
          setCurrentPage((pageBlock + 1) * 5 + 1);
        }
      };
    
      const prevPageBlock = () => {
        if (pageBlock > 0) {
          setPageBlock(pageBlock - 1);
          setCurrentPage((pageBlock - 1) * 5 + 1);
        }
      };
    
      const renderPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= 5; i++) {
          const pageNumber = pageBlock * 5 + i;
          pages.push(
            <button
              key={pageNumber}
              onClick={() => handlePageClick(pageNumber)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                pageNumber === currentPage
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/50"
                  : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700 hover:border-blue-500/50"
              }`}
            >
              {pageNumber}
            </button>
          );
        }
        return pages;
      };
    
      return (
    <div className="min-h-screen bg-slate-950">
      <NavBar/>
      
      <div className="container mx-auto px-4 lg:px-8 pt-32 pb-24">
        {/* Page Header */}
        <div className="mb-16 space-y-4">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold uppercase tracking-[0.3em] text-blue-500">
            Global Trends
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-none">
            Popular <span className="text-blue-500">Movies</span>
          </h1>
          
          <p className="text-slate-500 text-lg font-medium">
            The most watched cinematic experiences worldwide
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-96">
            <div className="text-center p-10 glass-surface border-red-500/20 rounded-3xl max-w-md">
              <p className="text-red-400 font-bold uppercase tracking-widest text-sm">{error}</p>
            </div>
          </div>
        ) : Popular.length > 0 ? (
          <>
            {/* Movies Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 sm:gap-8 mb-16">
              {Popular.map((movie, index) => (
                <MoviesCard 
                  key={movie.resource_info.enid || index}
                  posterUrls={movie.share_info.cover.url3} 
                  movieTitle={movie.resource_info.process_name} 
                  id={movie.resource_info.enid}
                  rating={movie.rating}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 flex-wrap pt-8 border-t border-white/5">
              <button
                onClick={prevPageBlock}
                disabled={pageBlock === 0}
                className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                  pageBlock === 0
                    ? "bg-white/5 text-slate-700 cursor-not-allowed"
                    : "bg-white/5 text-slate-400 hover:bg-blue-500 hover:text-white border border-white/5"
                }`}
              >
                Prev
              </button>

              <div className="flex gap-2">
                {renderPageNumbers()}
              </div>

              <button
                onClick={nextPageBlock}
                disabled={!hasNextPage}
                className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                  !hasNextPage
                    ? "bg-white/5 text-slate-700 cursor-not-allowed"
                    : "bg-white/5 text-slate-400 hover:bg-blue-500 hover:text-white border border-white/5"
                }`}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center h-96">
            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">No movies found</p>
          </div>
        )}
      </div>

      {/* Background Decor */}
      <div className="fixed top-1/4 -left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
    </div>
  );
}