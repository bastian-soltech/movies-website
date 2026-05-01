import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams } from 'react-router';
import NavBar from '../components/navbar';
import EpisodeSelector from '../components/EpisodeSelector';
import { FiServer } from 'react-icons/fi';
import { FaClock, FaStar, FaCalendarAlt } from 'react-icons/fa';
import Hls from 'hls.js/dist/hls.js';

const StreamingMovies = () => {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [series, setSeries] = useState(null);
  const [activeEpisode, setActiveEpisode] = useState(0);
  const [selectedLink, setSelectedLink] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch metadata
      const detailUrl = `https://nonton-yuk-api.vercel.app/api/detail/${slug}`;
      const res = await fetch(detailUrl);
      if (!res.ok) throw new Error('Failed to fetch movie details');
      
      const json = await res.json();
      setData(json);

      if (json.resource_info.tv_cnt > 0) {
        const seriesResponse = await fetch(`https://nonton-yuk-api.vercel.app/api/get-series?id=${json.resource_info.id}`);
        if (!seriesResponse.ok) throw new Error('Failed to fetch series data');
        const seriesData = await seriesResponse.json();

        setSeries(seriesData);
        if (seriesData.list?.length > 0) {
          setActiveEpisode(0);
          const streamUrl = `https://nonton-yuk-api.vercel.app/api/stream?uk=${seriesData.root_info.uk}&shareid=${seriesData.root_info.share_id}&fid=${seriesData.list[0].fs_id}`;
          setSelectedLink(streamUrl);
        }
      } else {
        const { uk, share_id, fs_id } = json.share_info;
        const streamUrl = `https://nonton-yuk-api.vercel.app/api/stream?uk=${uk}&shareid=${share_id}&fid=${fs_id}`;
        setActiveEpisode(0);
        setSelectedLink(streamUrl);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEpisodeSelect = useCallback((root_info, ep, index) => {
    setActiveEpisode(index);
    console.log('ep',ep)
    const streamUrl = `https://nonton-yuk-api.vercel.app/api/stream?uk=${root_info.uk}&shareid=${root_info.share_id}&fid=${ep}`;
    setSelectedLink(streamUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (!selectedLink || !videoRef.current) return;

    let hls;

    if (Hls.isSupported()) {
      hls = new Hls({
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        startLevel: -1,
        abandonLoadTimeout: 3000,
        enableWorker: true,
        fragLoadingRetryDelay: 500,
        manifestLoadingRetryDelay: 500
      });
      hls.loadSource(selectedLink);
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoRef.current.play().catch(e => console.error("Playback failed:", e));
      });
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = selectedLink;
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [selectedLink]);

  if (isLoading)
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-red-400">
        Error: {error}
      </div>
    );

  const movieInfo = data?.resource_info;
  const shareInfo = data?.share_info;
  const tagInfo = movieInfo?.tag_info;

  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <NavBar />
      
      {/* Cinematic Player Section */}
      <div className="pt-20 bg-slate-900/20">
        <div className="container mx-auto px-4 lg:px-8 py-6 sm:py-10">
          <div className="w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] ring-1 ring-white/10 relative group">
            <video
              ref={videoRef}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
            {/* Subtle glow behind the player */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Info */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Episode Selector - Enhanced */}
            {series?.list?.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="h-5 w-1 bg-blue-500 rounded-full"></span>
                  <h2 className="text-xl font-black uppercase tracking-tight text-white">
                    Select Episode
                  </h2>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 gap-3">
                  {series.list.map((ep, index) => (
                    <button
                      key={index}
                      onClick={() => handleEpisodeSelect(series.root_info, ep.fs_id, index)}
                      className={`h-12 rounded-xl font-bold transition-all duration-300 ${
                        activeEpisode === index
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 ring-2 ring-blue-400'
                          : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata Card */}
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-white leading-tight">
                  {movieInfo?.personalized_name || movieInfo?.process_name || 'Untitled'}
                </h1>
                
                <div className="flex flex-wrap gap-4 items-center text-xs font-bold uppercase tracking-widest">
                  {tagInfo?.year && (
                    <div className="flex items-center gap-2 text-blue-400 bg-blue-400/10 px-3 py-1.5 rounded-lg border border-blue-400/20">
                      <FaCalendarAlt /> {tagInfo.year}
                    </div>
                  )}
                  {shareInfo?.duration && (
                    <div className="flex items-center gap-2 text-cyan-400 bg-cyan-400/10 px-3 py-1.5 rounded-lg border border-cyan-400/20">
                      <FaClock /> {formatDuration(shareInfo.duration)}
                    </div>
                  )}
                  {tagInfo?.type && (
                    <div className="text-slate-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                      {tagInfo.type}
                    </div>
                  )}
                  {movieInfo?.country && (
                    <div className="text-slate-500 border-l border-white/10 pl-4">
                      {movieInfo.country}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-blue-500">Synopsis</h3>
                <p className="text-slate-400 text-lg leading-relaxed max-w-4xl font-medium">
                  {movieInfo?.description || 'No description available.'}
                </p>
              </div>

              {(tagInfo?.actor || tagInfo?.director) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                  {tagInfo.director && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 block">Director</span>
                      <span className="text-white font-bold">{tagInfo.director}</span>
                    </div>
                  )}
                  {tagInfo.actor && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 block">Lead Cast</span>
                      <span className="text-white font-bold leading-relaxed">{tagInfo.actor}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Area (Potential for related content) */}
          <div className="lg:col-span-4 space-y-8">
             <div className="glass-surface p-8 rounded-3xl space-y-6">
                <div className="space-y-2">
                  <h4 className="text-sm font-black uppercase tracking-widest text-white">Streaming Quality</h4>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Ultra High Definition</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                    <span>Server Status</span>
                    <span className="text-green-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                      Operational
                    </span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-[95%] bg-blue-500"></div>
                  </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StreamingMovies;
