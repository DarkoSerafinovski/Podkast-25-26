import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import api from "../api";
import AudioPlayer from "../components/AudioPlayer";
import VideoPlayer from "../components/VideoPlayer";

const EpisodeDetails = () => {
  const { episodeId } = useParams();
  const navigate = useNavigate();
  const [mediaUrl, setMediaUrl] = useState(null);
  const [epizoda, setEpizoda] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const epRes = await api.get(`/emisije/${episodeId}`);
        const epData = epRes.data.data;
        setEpizoda(epData);
        const fileRes = await api.get(epData.file, {
          responseType: 'blob' 
        });

    
        const blobUrl = URL.createObjectURL(fileRes.data);
        setMediaUrl(blobUrl);
      } catch (err) {
        console.error("Greška pri učitavanju:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
    return () => {
      if (mediaUrl) URL.revokeObjectURL(mediaUrl);
    };
  }, [episodeId]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Učitavanje...
      </div>
    );

  if (!epizoda)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Epizoda nije pronađena.</h2>
        <button
          onClick={() => navigate(-1)}
          className="text-indigo-600 font-bold"
        >
          ← Nazad
        </button>
      </div>
    );

  const isVideo = epizoda.tip.includes("video");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 text-gray-500 hover:text-indigo-600 flex items-center gap-2 font-bold transition-all"
        >
          ← Nazad na podkast
        </button>

        <div className="bg-white rounded-[40px] shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8 md:p-12 border-b border-gray-50">
            <div className="flex items-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                  {epizoda.naslov}
                </h1>
              </div>
            </div>

            <div className="bg-black rounded-3xl overflow-hidden shadow-2xl">
              {isVideo ? (
                <VideoPlayer videoUrl={mediaUrl} title={epizoda.naslov} />
              ) : (
                <AudioPlayer audioUrl={mediaUrl} title={epizoda.naslov} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EpisodeDetails;
