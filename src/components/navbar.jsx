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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2 sm:space-x-3 group shrink-0">
            <div className="relative">
              <FiFilm className="text-2xl sm:text-3xl text-blue-500 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="text-lg font-black tracking-tighter sm:text-2xl text-white">
              NontonYuk<span className="text-blue-500">21</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <a href="/" className="px-4 py-2 text-[13px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
              Home
            </a>
            <a href="/trending" className="px-4 py-2 text-[13px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
              Trending
            </a>
            <a href="/latest" className="px-4 py-2 text-[13px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
              Terbaru
            </a>
            <a href="/popular" className="px-4 py-2 text-[13px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
              Popular
            </a>
          </div>

          {/* Search and Mobile Toggle Container */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Desktop Search */}
            <form 
              onSubmit={handleSearch}
              className={`hidden md:flex relative items-center transition-all duration-500 ease-out ${
                isSearchFocused ? 'w-64 lg:w-80' : 'w-48 lg:w-64'
              }`}
            >
              <div className="relative w-full group">
                <input
                  type="text"
                  placeholder="Search titles..."
                  className="w-full pl-10 pr-4 py-2 rounded-full bg-slate-900/50 border border-white/10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-slate-900/80 transition-all duration-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                <FiSearch className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isSearchFocused ? 'text-blue-500' : 'text-slate-500'}`} size={14} />
              </div>
            </form>

            {/* Mobile Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden h-10 w-10 flex items-center justify-center text-slate-300 hover:text-white transition-colors rounded-xl bg-white/5 border border-white/10"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-8 pt-2 animate-in fade-in slide-in-from-top-4 duration-300">
            <form onSubmit={handleSearch} className="mb-8 md:hidden">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-11 pr-4 py-4 rounded-2xl bg-slate-900/80 border border-white/10 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              </div>
            </form>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Home', icon: FiHome, href: '/' },
                { label: 'Trending', icon: FiTrendingUp, href: '/trending' },
                { label: 'Terbaru', icon: FiClock, href: '/latest' },
                { label: 'Popular', icon: FiStar, href: '/popular' }
              ].map((item) => (
                <a 
                  key={item.label}
                  href={item.href} 
                  className="flex items-center justify-between px-5 py-4 text-slate-300 hover:text-white hover:bg-blue-600 rounded-2xl transition-all border border-white/5 group"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center space-x-4">
                    <item.icon size={20} className="text-blue-500 group-hover:text-white transition-colors" /> 
                    <span className="font-bold uppercase tracking-widest text-xs">{item.label}</span>
                  </div>
                  <FiX size={14} className="opacity-0 group-hover:opacity-100 transition-opacity rotate-45" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}