import { memo, useMemo } from "react";
import { FiPlay, FiStar } from "react-icons/fi";

function MoviesCard({posterUrls,movieTitle,rating,id}) {
  return (
    <a href={`/movies/streaming/${id}/movie`} className="group relative block transition-all duration-300 transform active:scale-95">
      <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-slate-900 shadow-lg ring-1 ring-white/5 transition-all duration-500 group-hover:shadow-blue-500/20 group-hover:ring-blue-500/30">
        {/* Poster Image */}
        <img
          src={posterUrls}
          alt={movieTitle}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Minimal Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />
        
        {/* Play Icon - Refined */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white shadow-xl shadow-blue-500/40 transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <FiPlay className="fill-current ml-1" size={20} />
          </div>
        </div>

        {/* Info Section */}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
          <h3 className="text-sm font-semibold text-white line-clamp-2 mb-1.5 group-hover:text-blue-400 transition-colors duration-300">
            {movieTitle}
          </h3>
          
          <div className="flex items-center gap-2">
            {rating > 0 && (
              <div className="flex items-center gap-1 rounded-md bg-white/10 px-1.5 py-0.5 backdrop-blur-md ring-1 ring-white/10">
                <FiStar className="text-yellow-400 fill-yellow-400" size={10} />
                <span className="text-[10px] font-bold text-white">{rating}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </a>
  );
}
export default memo(MoviesCard);
