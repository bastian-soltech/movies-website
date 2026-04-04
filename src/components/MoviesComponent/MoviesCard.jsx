import { memo, useMemo } from "react";
import { FiPlay, FiStar } from "react-icons/fi";

function MoviesCard({posterUrls,movieTitle,rating,id}) {
  // Gunakan useMemo untuk menghindari perhitungan ulang href tiap render
  // const href = useMemo(() => {
  //   const title = encodeURIComponent(movie.moviesTitle || `movie-${index + 1}`);
  //   return source === "filmapik"
  //     ? `/movies/streaming/${title}/movie`
  //     : `/ny21-indo/movies/streaming/${title}`;
  // }, [movie.moviesTitle, index, source]);

  // Hindari re-render jika prop tidak berubah
  return (
    <a href={`/movies/streaming/${id}/movie`} className="group relative block will-change-transform">
      <div className="relative h-0 pb-[150%] overflow-hidden rounded-xl shadow-2xl transition-all duration-500 hover:shadow-blue-500/20">
        {/* Lazy Loaded Image */}
        <img
          src={posterUrls}
          alt={movieTitle || `Movie ${index + 1}`}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          decoding="async"
        />

        {/* Overlay & Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 will-change-transform">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-60 animate-pulse" />
            <div className="relative bg-blue-500/90 backdrop-blur-sm rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300">
              <FiPlay className="text-white text-3xl" />
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <h3
            className="text-white text-sm md:text-base font-semibold line-clamp-2 mb-2 drop-shadow-lg"
            title={movieTitle}
          >
            {movieTitle}
          </h3>

          {rating && (
            <div className="flex items-center space-x-1 bg-slate-900/80 backdrop-blur-sm rounded-full px-3 py-1 w-fit">
              <FiStar className="text-yellow-400 text-xs" />
              <span className="text-yellow-400 text-xs font-medium">
                {rating}
              </span>
            </div>
          )}
        </div>

        {/* Border Glow */}
        <div className="absolute inset-0 rounded-xl border border-blue-500/0 group-hover:border-blue-500/30 transition-all duration-500" />
      </div>
    </a>
  );
}
export default memo(MoviesCard);
