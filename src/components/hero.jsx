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
        // 
        <SwiperSlide key={index} className="hero-swiper-slide">
          {/* {console.log(poster)} */}
          <div className="relative group">
            <img
              src={poster.share_info.cover.url3}
              alt={`Poster ${index + 1}`}
              className="rounded-2xl object-cover h-full w-full shadow-2xl transition-all duration-500 group-hover:shadow-blue-500/50"
              loading="lazy"
              decoding="async"
            />
            {/* Border Glow */}
            <div className="absolute inset-0 rounded-2xl border-2 border-blue-500/0 group-hover:border-blue-500/50 transition-all duration-500"></div>
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-600/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
          </div>
        </SwiperSlide>
      )),
    [Movies]
  );

  return (
    <div className="relative min-h-screen overflow-hidden pt-20 max-w-[100vw]">
      {/*  Background — gunakan memoized activeMovie agar tidak render ulang */}
      <div className="absolute inset-0 top-0">
        {/* {console.log('activeMovie ',activeMovie)} */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 will-change-transform"
          style={{
            backgroundImage: `url(${activeMovie.share_info.thumbs.url3})`,
            filter: "blur(2px)",
            // transform: "scale(1.2)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/50 to-slate-950"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-slate-950"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 py-20 max-w-full overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
         
            <div className="text-white space-y-8 text-center lg:text-left">
              {/* <div className="inline-flex items-center space-x-2 bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-blue-300 text-sm font-medium">Featured Movie</span>
              </div> */}

              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
                  {activeMovie.resource_info.process_name}
                </span>
              </h1>

              {activeMovie.rating && (
                <div className="flex items-center justify-center lg:justify-start space-x-4">
                  <div className="flex items-center space-x-2 bg-slate-800/50 backdrop-blur-sm rounded-lg px-4 py-2">
                    <FiStar className="text-yellow-400" />
                    <span className="text-white font-semibold">{activeMovie.rating}</span>
                  </div>
                  <div className="h-6 w-px bg-slate-600"></div>
                  <span className="text-slate-300">2024 </span>
                </div>
              )}

              {activeMovie.description && (
                <p className="text-slate-300 text-lg leading-relaxed max-w-2xl">
                  {activeMovie}
                </p>
              )}

              {/* 🔗 Tombol */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <a
                  href={
                    source === "filmapik"
                      ? `/movies/streaming/${activeMovie.resource_info.enid}/movie`
                      : `/ny21-indo/movies/streaming/${activeMovie.moviesTitle}`
                  }
                  className="group relative inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/50"
                >
                  <div className="absolute inset-0 bg-white/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <FiPlay className="relative" />
                  <span className="relative">Watch Now</span>
                </a>

                {/*  */}
              </div>
            </div>

            {/* 🎞️ Swiper */}
            <div className="w-full max-w-2xl mx-auto lg:mx-0 overflow-hidden">
              <div className="px-4 sm:px-0">
                <Swiper
                  effect="coverflow"
                  grabCursor
                  centeredSlides
                  slidesPerView="auto"
                  loop
                  autoplay={{
                    delay: 3500,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }}
                  coverflowEffect={{
                    rotate: 0,
                    stretch: 0,
                    depth: 300,
                    modifier: 1,
                    slideShadows: false,
                  }}
                  modules={[EffectCoverflow, Autoplay]}
                  onSlideChange={handleSlideChange}
                  className="hero-swiper"
                >
                  {slides}
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🎨 Custom Styles */}
      <style jsx>{`
        .hero-swiper {
          width: 100%;
          padding-top: 50px;
          padding-bottom: 50px;
          overflow: visible;
        }
        .hero-swiper-slide {
          background-position: center;
          background-size: cover;
          width: 220px;
          height: 330px;
        }
        @media (min-width: 640px) {
          .hero-swiper-slide {
            width: 280px;
            height: 420px;
          }
        }
        .hero-swiper-slide img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
});

export default Hero;
