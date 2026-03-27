import { useState } from 'react';
import { FiSearch, FiMenu, FiX, FiHome, FiTrendingUp, FiClock, FiFilm } from 'react-icons/fi';

export default function NavBar({source = 'filmapik'}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if(source == 'filmapik'){
        window.location.href = `/movies/search?q=${encodeURIComponent(searchQuery)}`;
      }else{
        window.location.href = `/ny21-indo/movies/search?q=${encodeURIComponent(searchQuery)}`;
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 backdrop-blur-xl border-b border-blue-500/10 shadow-2xl">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <FiFilm className="relative text-4xl text-blue-400 group-hover:text-blue-300 transition-colors" />
            </div>
            <div className="hidden sm:block">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                NontonYuk21
              </span>
            </div>
          </a>

          {/* Desktop Search Bar */}
          <form 
            onSubmit={handleSearch}
            className={`hidden md:flex relative items-center transition-all duration-300 ${
              isSearchFocused ? 'w-96' : 'w-72'
            }`}
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Cari film favorit..."
                className="w-full pl-12 pr-4 py-3 rounded-full bg-slate-800/50 border border-blue-500/20 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:bg-slate-800/80 transition-all duration-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              <button 
                type="submit" 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <FiSearch size={20} />
              </button>
              {isSearchFocused && (
                <div className="absolute inset-0 rounded-full bg-blue-500/5 blur-xl -z-10"></div>
              )}
            </div>
          </form>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <a 
              href="/" 
              className="group px-5 py-2.5 text-slate-300 hover:text-blue-400 flex items-center space-x-2 transition-all duration-300 rounded-lg hover:bg-slate-800/50 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <FiHome size={18} className="relative" />
              <span className="relative font-medium">Home</span>
            </a>
            <a 
              href="/trending" 
              className="group px-5 py-2.5 text-slate-300 hover:text-blue-400 flex items-center space-x-2 transition-all duration-300 rounded-lg hover:bg-slate-800/50 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <FiTrendingUp size={18} className="relative" />
              <span className="relative font-medium">Trending</span>
            </a>
            <a 
              href="/latest" 
              className="group px-5 py-2.5 text-slate-300 hover:text-blue-400 flex items-center space-x-2 transition-all duration-300 rounded-lg hover:bg-slate-800/50 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <FiClock size={18} className="relative" />
              <span className="relative font-medium">Terbaru</span>
            </a>
           
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-slate-300 p-2 hover:text-blue-400 transition-colors"
          >
            {isMobileMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-6 animate-fade-in">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari film..."
                  className="w-full pl-12 pr-4 py-3 rounded-full bg-slate-800/50 border border-blue-500/20 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400"
                >
                  <FiSearch size={20} />
                </button>
              </div>
            </form>

            {/* Mobile Nav Links */}
            <div className="flex flex-col space-y-2">
              <a 
                href="/" 
                className="flex items-center space-x-3 px-4 py-3 text-slate-300 hover:text-blue-400 hover:bg-slate-800/50 rounded-lg transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FiHome size={20} />
                <span className="font-medium">Home</span>
              </a>
              <a 
                href="/trending" 
                className="flex items-center space-x-3 px-4 py-3 text-slate-300 hover:text-blue-400 hover:bg-slate-800/50 rounded-lg transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FiTrendingUp size={20} />
                <span className="font-medium">Trending</span>
              </a>
              <a 
                href="/latest" 
                className="flex items-center space-x-3 px-4 py-3 text-slate-300 hover:text-blue-400 hover:bg-slate-800/50 rounded-lg transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FiClock size={20} />
                <span className="font-medium">Terbaru</span>
              </a>
              {/* <a 
                href="/ny21-indo" 
                className="flex items-center space-x-3 px-4 py-3 text-slate-300 hover:text-blue-400 hover:bg-slate-800/50 rounded-lg transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="font-medium">FilmIndo</span>
              </a> */}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}