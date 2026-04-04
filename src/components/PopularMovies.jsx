import MoviesCard from "./MoviesComponent/MoviesCard";
import Headers from "./MoviesComponent/MoviesHeader";
import MoviesSlide from "./MoviesComponent/MoviesSlide";
import { FiClock } from 'react-icons/fi';

export default function PopularMovies({popularMovies, source="filmapik"}) {
    if (!popularMovies || !popularMovies.length) {
        return (
          <div className="mt-10 mx-4 md:mx-10 h-64 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-slate-400">Loading popular movies...</p>
            </div>
          </div>
        );
      }
      return (
        <section className="px-4 md:px-10">
            {console.log('pop',popularMovies)}
          <div className="container mx-auto">
            {/* Section Badge */}
           
            <Headers title="Popular Film" url="/popular"/>
            
            <div className="relative">
              {/* Decorative Glow */}
              <div className="absolute -top-20 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
              
              <div className="relative h-auto min-h-[300px] md:min-h-[400px]">
                <MoviesSlide
                  movies={popularMovies}
                  renderSlide={(movie, index) => <MoviesCard movieTitle={movie.resource_info.process_name} id={movie.resource_info.enid} posterUrls={movie.share_info.cover.url3} index={index} source={source} />}
                />
              </div>
            </div>
          </div>
        </section>
      );
}