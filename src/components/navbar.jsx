import { useState } from 'react';
import { FiSearch, FiMenu, FiX, FiHome, FiTrendingUp, FiClock, FiFilm } from 'react-icons/fi';

export default function NavBar({source = 'filmapik'}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const target = source === 'filmapik' ? '/movies/search' : '/ny21-indo/movies/search';
      window.location.href = `${target}?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-surface border-b border-white/5 shadow-2xl transition-all duration-300">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <FiFilm className="text-3xl text-blue-500 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="text-xl font-bold tracking-tighter sm:text-2xl text-white">
              NontonYuk<span className="text-blue-500">21</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <a href="/" className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors rounded-full hover:bg-white/5">
              Home
            </a>
            <a href="/trending" className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors rounded-full hover:bg-white/5">
              Trending
            </a>
            <a href="/latest" className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors rounded-full hover:bg-white/5">
              Terbaru
            </a>
            <a href="/popular" className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors rounded-full hover:bg-white/5">
              Popular
            </a>
          </div>

          {/* Desktop Search */}
          <form 
            onSubmit={handleSearch}
            className={`hidden md:flex relative items-center transition-all duration-500 ease-out ${
              isSearchFocused ? 'w-80 lg:w-96' : 'w-64'
            }`}
          >
            <div className="relative w-full group">
              <input
                type="text"
                placeholder="Search titles..."
                className="w-full pl-11 pr-4 py-2.5 rounded-full bg-slate-900/50 border border-white/10 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-slate-900/80 transition-all duration-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              <FiSearch className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isSearchFocused ? 'text-blue-500' : 'text-slate-500'}`} size={18} />
            </div>
          </form>

          {/* Mobile Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-slate-300 p-2 hover:text-white transition-colors"
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-6 pt-2 animate-in fade-in slide-in-from-top-4 duration-300">
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-slate-100 placeholder-slate-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              </div>
            </form>
            <div className="grid grid-cols-2 gap-2">
              <a href="/" className="flex items-center space-x-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                <FiHome size={18} /> <span className="font-medium">Home</span>
              </a>
              <a href="/trending" className="flex items-center space-x-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                <FiTrendingUp size={18} /> <span className="font-medium">Trending</span>
              </a>
              <a href="/latest" className="flex items-center space-x-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                <FiClock size={18} /> <span className="font-medium">Terbaru</span>
              </a>
              <a href="/popular" className="flex items-center space-x-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                <FiStar size={18} /> <span className="font-medium">Popular</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}