import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter,Routes,Route, HashRouter } from 'react-router'
import './index.css'
import App from './pages/App.jsx'
import Movies from './pages/MoviesPage.jsx'
import StreamingMovie from './pages/Streaming.jsx'
import SearchResult from './pages/SearchResult.jsx'
import TrendingPage from './pages/TrendingPage.jsx'
import LatestPage from './pages/LatestPage.jsx'
import NotFound from './pages/NotFound.jsx'
import PopularMoviesPage from './pages/PopularMovies.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>  
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/movies" element={<Movies />} />
      <Route path="/trending" element={<TrendingPage/>} />
      <Route path="/latest" element={<LatestPage/>} />
      <Route path="/movies/streaming/:slug/:type" element={<StreamingMovie />} />
      <Route path="/movies/search?" element={<SearchResult />} />
      <Route path="/popular" element={<PopularMoviesPage />} />
    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
