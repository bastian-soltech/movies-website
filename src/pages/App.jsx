import { useEffect, useState, useMemo, Suspense, lazy } from 'react'
import '../App.css'
import TvShow from '../components/TvShow'
import PopularAnimation from '../components/HotAnimation'
// import PopularMovies from '../components/PopularMovies'

// Lazy load komponen besar untuk mengurangi bundle awal
const NavBar = lazy(() => import('../components/navbar'))
const Hero = lazy(() => import('../components/hero'))
const PopularMovies = lazy(() => import('../components/PopularMovies'))
// const Trending = lazy(() => import('../components/trending'))
// const Latest = lazy(() => import('../components/Latest'))
const Faq = lazy(() => import('../components/Faq'))
const Footer = lazy(() => import('../components/Footer'))

function App() {
  const [movies, setMovies] = useState({
    hot:[],
    tvShow:[],
    animation:[]
    
    // top: [],
    // trending: [],
    // latest: [],
  })
  const [loading, setLoading] = useState(true)

  const base_api = useMemo(() => 'https://nonton-yuk-api.vercel.app', [])

  useEffect(() => {
    let isMounted = true // hindari memory leak
    const getMovies = async () => {
      try {
        const urls = [
          `${base_api}/api/hot-movies/1/1`,
          `${base_api}/api/hot-movies/2/1`,
          `${base_api}/api/hot-movies/3/1`,
          // `${base_api}/api/movies/v1/trending?page=1`,
          // `${base_api}/api/movies/v1/latest?page=1`,
          // `${base_api}/api/movies/v2/indo-movie?page=1`,
        ]

        // Jalankan paralel + cache otomatis dari browser
        // trendRes, latestRes,indoRes
        const [hotRes,tvShowRes,AnimationRes] = await Promise.all(
          urls.map((url) =>
            fetch(url, { cache: 'force-cache' }).then((r) => r.json())
          )
        )

        if (!isMounted) return
        console.log("hot", hotRes)
        setMovies({
          hot: hotRes.detail || [],
          tvShow: tvShowRes.detail || [],
          animation: AnimationRes.detail || [],
        })
      } catch (error) {
        console.error('Error fetching movies:', error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    getMovies()
    return () => {
      isMounted = false
    }
  }, [base_api])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400">Loading amazing movies...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-x-hidden">
      <Suspense
        fallback={
          <div className="text-slate-400 text-center mt-20">Loading...</div>
        }
      >
        <NavBar source="filmapik" />
        <main>
          <Hero Movies={movies.hot} />
          <div className="space-y-16 pb-20 mt-10">
            <PopularMovies popularMovies={movies.hot}/>
            <TvShow Serial={movies.tvShow}/>            
            <PopularAnimation popularAnimation={movies.animation}/>           
            <Faq />
          </div>
      </main>
        <Footer />
      </Suspense>
    </div>
  )
}

export default App
