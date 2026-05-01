import { useState } from 'react';
import { FiSearch, FiMenu, FiX, FiHome, FiTrendingUp, FiClock, FiFilm, FiStar } from 'react-icons/fi';

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
    <nav className="fixed top-0 inset-x-0 z-50 glass-surface border-b border-white/5 shadow-2xl transition-all duration-500">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Logo Section */}
          <a href="/" className="flex items-center space-x-2 sm:space-x-3 group shrink-0">
            <div className="relative">
              <FiFilm className="text-2xl sm:text-3xl text-blue-500 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="text-lg sm:text-xl xl:text-2xl font-black tracking-tighter text-white">
              NontonYuk<span className="text-blue-500">21</span>
            </span>
          </a>

          {/* Center Search - Tablet/Desktop */}
          <form 
            onSubmit={handleSearch}
            className="hidden md:flex relative items-center transition-all duration-500 ease-out flex-1 max-w-md lg:max-w-lg"
          >
            <div className="relative w-full group">
              <input
                type="text"
                placeholder="Search movies, series..."
                className={`w-full pl-11 pr-4 py-2.5 rounded-full bg-slate-900/40 border border-white/10 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:bg-slate-900/80 transition-all duration-300 ${
                  isSearchFocused ? 'border-blue-500/50 ring-4 ring-blue-500/10' : 'focus:border-blue-500/30'
                }`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              <FiSearch className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isSearchFocused ? 'text-blue-500' : 'text-slate-500'}`} size={16} />
            </div>
          </form>

          {/* Right Section */}
          <div className="flex items-center gap-2 lg:gap-6">
            <div className="hidden lg:flex items-center space-x-1">
              {[
                { label: 'Home', href: '/' },
                { label: 'Trending', href: '/trending' },
                { label: 'Latest', href: '/latest' },
                { label: 'Popular', href: '/popular' }
              ].map((item) => (
                <a 
                  key={item.label}
                  href={item.href} 
                  className="px-4 py-2 text-[11px] xl:text-[12px] font-black uppercase tracking-[0.15em] text-slate-400 hover:text-white transition-all rounded-full hover:bg-white/5 active:scale-95"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden h-10 w-10 sm:h-11 sm:w-11 flex items-center justify-center text-slate-300 hover:text-white transition-all rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 active:scale-90"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu content */}
        <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${isMobileMenuOpen ? 'max-h-[600px] opacity-100 pb-8' : 'max-h-0 opacity-0'}`}>
          <div className="pt-2 space-y-6">
            <form onSubmit={handleSearch} className="md:hidden">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search titles..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-900/60 border border-white/10 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              </div>
            </form>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Home', icon: FiHome, href: '/' },
                { label: 'Trending', icon: FiTrendingUp, href: '/trending' },
                { label: 'Latest', icon: FiClock, href: '/latest' },
                { label: 'Popular', icon: FiStar, href: '/popular' }
              ].map((item) => (
                <a 
                  key={item.label}
                  href={item.href} 
                  className="flex flex-col items-center justify-center gap-3 p-5 text-slate-300 hover:text-white hover:bg-blue-600 rounded-3xl transition-all border border-white/5 group active:scale-95 bg-white/5"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon size={24} className="text-blue-500 group-hover:text-white transition-colors" /> 
                  <span className="font-black uppercase tracking-widest text-[10px]">{item.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>

  );
}