import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams } from 'react-router';
import NavBar from '../components/navbar';
import EpisodeSelector from '../components/EpisodeSelector';
import MoviesDescription from '../components/MoviesDescription';
import ButtonServer from '../components/ButtonServer';

const StreamingMovies = () => {
  const { slug, type } = useParams();
  const [data, setData] = useState(null);
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
      console.log("streaming data",json.data);
      
      setData(json.data);

      // Construct streaming URL directly using parameters from metadata
      // No second fetch needed as the API serves the m3u8 directly
      const { uk, share_id, fs_id } = json.share_info;
      const streamUrl = `https://nonton-yuk-api.vercel.app/api/stream?uk=${uk}&shareid=${share_id}&fid=${fs_id}`;
      
      setSelectedLink(streamUrl);
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

  const handleEpisodeSelect = useCallback(async (episode) => {
    console.log('Episode selected:', episode);
  }, []);

  useEffect(() => {
    if (!selectedLink || !videoRef.current) return;

    let hls;

    const initHls = async () => {
      const HlsModule = await import('hls.js');
      const Hls = HlsModule.default;

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
    };

    initHls();

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
      <div className="pt-20 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
            <video
              ref={videoRef}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-12 space-y-10">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 space-y-6">
          <h1 className="text-3xl font-bold text-slate-100">
            {movieInfo?.personalized_name || movieInfo?.process_name || 'Untitled'}
          </h1>
          
          <div className="flex flex-wrap gap-4 text-sm">
            {tagInfo?.year && (
              <div className="flex items-center gap-2 text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full">
                <FaCalendarAlt /> {tagInfo.year}
              </div>
            )}
            {shareInfo?.duration && (
              <div className="flex items-center gap-2 text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full">
                <FaClock /> {formatDuration(shareInfo.duration)}
              </div>
            )}
            {tagInfo?.type && (
              <div className="flex items-center gap-2 text-purple-400 bg-purple-400/10 px-3 py-1 rounded-full">
                {tagInfo.type}
              </div>
            )}
            {movieInfo?.country && (
              <div className="flex items-center gap-2 text-slate-400 bg-slate-400/10 px-3 py-1 rounded-full">
                {movieInfo.country}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-200">Synopsis</h2>
            <p className="text-slate-300 leading-relaxed max-w-4xl">
              {movieInfo?.description || 'No description available.'}
            </p>
          </div>

          {(tagInfo?.actor || tagInfo?.director) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-700 text-sm">
              {tagInfo.director && (
                <div>
                  <span className="text-slate-500 block mb-1">Director</span>
                  <span className="text-slate-200">{tagInfo.director}</span>
                </div>
              )}
              {tagInfo.actor && (
                <div>
                  <span className="text-slate-500 block mb-1">Cast</span>
                  <span className="text-slate-200">{tagInfo.actor}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StreamingMovies;
