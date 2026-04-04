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
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
          <NavBar/>
          {/* {console.log(Popular)} */}
          <div className="container mx-auto px-4 lg:px-8 pt-28 pb-16">
            {/* Page Header */}
            <div className="mb-12">
              <div className="inline-flex items-center space-x-2 bg-cyan-500/10 backdrop-blur-sm border border-cyan-500/20 rounded-full px-4 py-2 mb-4">
                <FiClock className="text-cyan-400" />
                <span className="text-cyan-300 text-sm font-medium">Fresh Releases</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Popular Movies
                </span>
              </h1>
              
              <p className="text-slate-400 text-lg">
                Brand new releases just added to our collection
              </p>
            </div>
    
            {/* Content */}
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-slate-400">Loading popular movies...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-96">
                <div className="text-center p-8 bg-red-500/10 border border-red-500/30 rounded-2xl max-w-md">
                  <p className="text-red-400 text-lg">{error}</p>
                </div>
              </div>
            ) : Popular.length> 0 ? (
              <>
                {/* Movies Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12">
                  {console.log('popular',Popular)}
                  {Popular.map((movie) => (
                    // console.log('movie',movie)
                      <MoviesCard posterUrls={movie.share_info.cover.url3} movieTitle={movie.resource_info.process_name} id={movie.resource_info.enid}  />
                  ))}
                </div>
    
                {/* Pagination */}
                <div className="flex justify-center items-center gap-3 flex-wrap">
                  <button
                    onClick={prevPageBlock}
                    disabled={pageBlock === 0}
                    className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                      pageBlock === 0
                        ? "bg-slate-800/30 text-slate-600 cursor-not-allowed"
                        : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700 hover:border-cyan-500/50"
                    }`}
                  >
                    ← Previous
                  </button>
    
                  {renderPageNumbers()}
    
                  <button
                    onClick={nextPageBlock}
                    disabled={!hasNextPage}
                    className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                      !hasNextPage
                        ? "bg-slate-800/30 text-slate-600 cursor-not-allowed"
                        : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700 hover:border-cyan-500/50"
                    }`}
                  >
                    Next →
                  </button>
                </div>
              </>
            ) : (
              <div className="flex justify-center items-center h-96">
                <div className="text-center space-y-4">
                  <div className="text-6xl">🎬</div>
                  <p className="text-slate-400 text-lg">No movies found.</p>
                </div>
              </div>
            )}
          </div>
    
          {/* Decorative Background Elements */}
          <div className="fixed top-1/4 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="fixed bottom-1/4 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
        </div>
      );
}