import React, { useState, useMemo, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import { FiPlay, FiInfo, FiStar } from "react-icons/fi";
import "swiper/css/effect-coverflow";
import "swiper/css";

const Hero = React.memo(({ Movies = [], source = "filmapik" }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Cegah re-render kalau Movies kosong
  // if (!Movies.length) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-slate-950">
  //       <div className="text-center space-y-4">
  //         <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  //         <p className="text-slate-400">Loading amazing movies...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // Gunakan useCallback agar fungsi tidak dibuat ulang setiap render
  const handleSlideChange = useCallback((swiper) => {
    setActiveIndex(swiper.realIndex);
  }, []);

  //  Cache movie aktif agar tidak hitung ulang tiap render
  const activeMovie = useMemo(() => Movies[activeIndex] || {}, [Movies, activeIndex]);
// console.log("cover",Movies)
  //  Cache daftar slide agar tidak render ulang tiap index berubah
  const slides = useMemo(
    () =>
      Movies.map((poster, index) => (
        <SwiperSlide key={index} className="!w-[220px] !h-[330px] sm:!w-[280px] sm:!h-[420px]">
          <div className="relative group cursor-pointer h-full w-full">
            <img
              src={poster.share_info?.cover?.url3 || poster.share_info?.thumbs?.url3}
              alt={poster.resource_info?.process_name}
              className="rounded-2xl object-cover h-full w-full shadow-2xl transition-all duration-500 group-hover:scale-[1.02]"
              loading="lazy"
            />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 group-hover:ring-blue-500/40 transition-all duration-500"></div>
            {/* Subtle Reflection Effect */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-4/5 h-8 bg-blue-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
          </div>
        </SwiperSlide>
      )),
    [Movies]
  );

  return (
    <div className="relative min-h-[90vh] lg:min-h-screen overflow-hidden pt-16 flex items-center bg-slate-950">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-out scale-105 blur-[2px]"
          style={{
            backgroundImage: `url(${activeMovie.share_info?.thumbs?.url3 || activeMovie.share_info?.cover?.url3})`,
          }}
        />
        <div className="absolute inset-0 bg-slate-950/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-slate-950" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Movie Content */}
          <div className="order-2 lg:order-1 lg:col-span-7 space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000 py-6 lg:py-0">
            <div className="space-y-4 sm:space-y-5 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-blue-500">
                <span className="h-px w-8 sm:w-10 bg-blue-500"></span>
                Top Recommendation
              </div>
              
              <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-8xl font-black leading-[0.95] text-white uppercase break-words drop-shadow-2xl">
                {activeMovie.resource_info?.process_name}
              </h1>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-6 text-[10px] sm:text-xs text-slate-300 font-bold uppercase tracking-widest">
                {activeMovie.rating > 0 && (
                  <div className="flex items-center gap-1.5 sm:gap-2 text-white bg-blue-600/20 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg backdrop-blur-md border border-blue-500/20">
                    <FiStar className="text-yellow-400 fill-yellow-400" size={12} />
                    {activeMovie.rating}
                  </div>
                )}
                <span className="bg-white/5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-white/5">2024</span>
                <span className="hidden sm:block w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                <span className="text-blue-400">Action & Drama</span>
              </div>
            </div>

            <p className="text-slate-400 text-sm sm:text-lg leading-relaxed max-w-xl line-clamp-3 font-medium mx-auto lg:mx-0">
              {activeMovie.resource_info?.description || "Experience the most anticipated cinematic masterpiece of the year, featuring breathtaking visuals and an unforgettable story."}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <a
                href={`/movies/streaming/${activeMovie.resource_info?.enid}/movie`}
                className="w-full sm:w-auto group relative flex items-center justify-center gap-3 bg-white text-slate-950 font-black px-8 py-4 sm:px-10 sm:py-5 rounded-xl sm:rounded-2xl transition-all duration-300 hover:bg-blue-600 hover:text-white hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(0,0,0,0.3)] uppercase tracking-widest text-[11px] sm:text-sm"
              >
                <FiPlay className="fill-current" size={16} />
                <span>Watch Now</span>
              </a>
              <button className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white font-black px-8 py-4 sm:px-10 sm:py-5 rounded-xl sm:rounded-2xl transition-all duration-300 border border-white/10 backdrop-blur-md uppercase tracking-widest text-[11px] sm:text-sm">
                <FiInfo size={16} />
                <span>Details</span>
              </button>
            </div>
          </div>

          {/* Carousel Side */}
          <div className="order-1 lg:order-2 lg:col-span-5 py-4 sm:py-8 lg:py-0">
             <div className="w-full  sm:max-w-md lg:max-w-2xl mx-auto overflow-hidden">
                <Swiper
                  effect="coverflow"
                  grabCursor
                  centeredSlides
                  slidesPerView="auto"
                  loop
                  autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }}
                  coverflowEffect={{
                    rotate: 0,
                    stretch: 0,
                    depth: 200,
                    modifier: 1.5,
                    slideShadows: false,
                  }}
                  modules={[EffectCoverflow, Autoplay]}
                  onSlideChange={handleSlideChange}
                  className="hero-swiper !overflow-visible"
                >
                  {slides}
                </Swiper>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});


export default Hero;
