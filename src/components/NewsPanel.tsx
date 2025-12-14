'use client';

import { useState, useEffect } from 'react';
import { getNewsByRegion, type NewsCategory } from '@/lib/newsData';
import { fetchLivePhilippineNews, type LiveNewsItem } from '@/lib/liveNewsApi';
import type { WeatherStationData } from '@/types/weather';

interface NewsPanelProps {
  selectedRegion: string | null;
  weatherStations: WeatherStationData[];
  language?: 'en' | 'tl';
}

export default function NewsPanel({
  selectedRegion,
  weatherStations,
  language = 'en',
}: NewsPanelProps) {
  const [liveNews, setLiveNews] = useState<LiveNewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [useHardcodedNews, setUseHardcodedNews] = useState(false);
  const labels = {
    en: {
      title: 'Location News',
      stationFocus: 'News based on',
      students: '👨‍🎓 Students',
      farmers: '👨‍🌾 Farmers',
      government: '🏛️ Government',
      selectStation: 'Select a station to view targeted news',
      noRegion: 'Select a region to view relevant news',
      noNews: 'No news available for this category',
      switchStation: 'Switch to another station',
    },
    tl: {
      title: 'Balita ng Lokasyon',
      stationFocus: 'Balita batay sa',
      students: '👨‍🎓 Mga Estudyante',
      farmers: '👨‍🌾 Mga Magsasaka',
      government: '🏛️ Pamahalaan',
      selectStation: 'Pumili ng istasyon upang makita ang targeted na balita',
      noRegion: 'Pumili ng rehiyon upang makita ang kaugnay na balita',
      noNews: 'Walang available na balita para sa kategoryang ito',
      switchStation: 'Lumipat sa ibang istasyon',
    },
  };

  const t = labels[language];

  // Get stations in the selected region
  const stationsInRegion = selectedRegion
    ? weatherStations.filter(s => s.region === selectedRegion)
    : [];

  // Determine which station's audience focus to use
  // Priority: Use the most common audience type in the region
  const getAudienceFocusForRegion = (): NewsCategory => {
    if (stationsInRegion.length === 0) return 'students';
    
    const focusCounts = {
      students: 0,
      farmers: 0,
      government: 0,
    };
    
    stationsInRegion.forEach(station => {
      const focus = (station.audienceFocus || 'students') as NewsCategory;
      focusCounts[focus]++;
    });
    
    // Return the most common focus
    if (focusCounts.farmers > focusCounts.government && focusCounts.farmers > focusCounts.students) {
      return 'farmers';
    }
    if (focusCounts.government > focusCounts.students) {
      return 'government';
    }
    return 'students';
  };

  const audienceFocus = getAudienceFocusForRegion();
  const activeStation = stationsInRegion.find(s => (s.audienceFocus || 'students') === audienceFocus) || stationsInRegion[0];

  const hardcodedNews = getNewsByRegion(selectedRegion, audienceFocus);

  // Fetch live news when region or audience changes
  useEffect(() => {
    if (!selectedRegion) {
      setLiveNews([]);
      return;
    }

    setLoadingNews(true);
    fetchLivePhilippineNews(selectedRegion, audienceFocus)
      .then((news) => {
        if (news.length > 0) {
          setLiveNews(news);
          setUseHardcodedNews(false);
        } else {
          // Fallback to hardcoded news if live news fetch fails
          setUseHardcodedNews(true);
          setLiveNews([]);
        }
      })
      .catch(() => {
        setUseHardcodedNews(true);
        setLiveNews([]);
      })
      .finally(() => setLoadingNews(false));
  }, [selectedRegion, audienceFocus]);

  const getAudienceLabel = (focus: NewsCategory) => {
    const labelMap = {
      students: labels[language].students,
      farmers: labels[language].farmers,
      government: labels[language].government,
    };
    return labelMap[focus];
  };

  return (
    <div className="bg-gradient-to-br from-blue-950/40 to-cyan-950/20 backdrop-blur-2xl border border-cyan-400/20 rounded-3xl p-8 h-full flex flex-col hover:border-cyan-400/40 transition-all duration-300 shadow-2xl animate-slideInUp">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl animate-float">📰</span>
        <div className="flex-1">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            {t.title}
          </h2>
          {selectedRegion && <p className="text-xs text-cyan-300/80 mt-1">Region: {selectedRegion}</p>}
        </div>
      </div>

      {!selectedRegion ? (
        <div className="text-center py-12 animate-fadeIn">
          <p className="text-cyan-300/60 text-sm">📍 {t.noRegion}</p>
        </div>
      ) : stationsInRegion.length === 0 ? (
        <div className="text-center py-12 animate-fadeIn">
          <p className="text-cyan-300/60 text-sm">{t.selectStation}</p>
        </div>
      ) : (
          <>
        <div className="mb-6 bg-blue-500/10 border border-blue-400/20 p-4 rounded-2xl hover:bg-blue-500/20 transition-all duration-300 animate-slideInDown">
          <p className="text-xs font-semibold text-cyan-300/80 mb-2">
            <span className="animate-pulse">●</span> Audience Focus
          </p>
          <p className="text-lg font-bold text-cyan-300">{getAudienceLabel(audienceFocus)}</p>
          <p className="text-xs text-cyan-300/60 mt-2">
            {stationsInRegion.filter(s => (s.audienceFocus || 'students') === audienceFocus).length} of {stationsInRegion.length} stations
          </p>
        </div>

        <div className="space-y-3 flex-1 overflow-y-auto pr-4">
          {loadingNews && (
            <div className="text-center py-8 animate-fadeIn">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-cyan-400 border-t-blue-400 mb-2"></div>
              <p className="text-xs text-cyan-300/60 animate-pulse">{language === 'en' ? 'Loading news...' : 'Loading...'}</p>
            </div>
          )}

          {!loadingNews && useHardcodedNews && liveNews.length === 0 && (
            <div className="bg-yellow-500/10 border border-yellow-400/30 p-3 rounded-lg mb-4 animate-slideInDown">
              <p className="text-xs text-yellow-300">
                ⚠️ {language === 'en' 
                  ? 'Showing curated news (live news not available)' 
                  : 'Ipinapakita ang curated na balita (live news hindi available)'}
              </p>
            </div>
          )}

          {!loadingNews && liveNews.length > 0 ? (
            <>
              <div className="bg-green-500/10 border border-green-400/30 p-2 rounded-lg mb-3 animate-slideInDown sticky top-0 z-10">
                <p className="text-xs text-green-300">
                  <span className="animate-pulse">●</span> Live News
                </p>
              </div>
              {liveNews.map((newsItem, index) => (
                <a
                  key={newsItem.id}
                  href={newsItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-3 bg-blue-500/10 border border-blue-400/20 p-3 rounded-xl hover:bg-blue-500/20 hover:border-blue-400/40 transition-all duration-300 animate-slideInUp group overflow-hidden"
                  style={{
                    animationDelay: `${index * 0.08}s`,
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-cyan-300 line-clamp-2 group-hover:text-cyan-200 transition-colors">
                      {newsItem.title}
                    </h4>
                    <p className="text-cyan-300/60 text-xs line-clamp-1 mt-1 group-hover:text-cyan-300/80 transition-colors">
                      {newsItem.description}
                    </p>
                    <div className="flex items-center justify-between mt-2 gap-1">
                      <span className="text-xs text-cyan-300/50 group-hover:text-cyan-300/70 transition-colors truncate">
                        {newsItem.source}
                      </span>
                      <span className="text-xs text-cyan-300/50 whitespace-nowrap">
                        {new Date(newsItem.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  {newsItem.imageUrl && (
                    <img 
                      src={newsItem.imageUrl} 
                      alt={newsItem.title}
                      className="w-14 h-14 object-cover rounded-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  )}
                </a>
              ))}
            </>
          ) : !loadingNews && !useHardcodedNews && liveNews.length === 0 ? (
              // Fallback to hardcoded news
              hardcodedNews.length > 0 ? (
                hardcodedNews.map((newsItem, index) => (
                  <div
                    key={newsItem.id}
                    className="bg-blue-500/10 border border-blue-400/20 p-3 rounded-xl hover:bg-blue-500/20 hover:border-blue-400/40 transition-all duration-300 animate-slideInUp group"
                    style={{
                      animationDelay: `${index * 0.08}s`,
                    }}
                  >
                    <div className="flex gap-2 mb-2">
                      <span className="text-lg group-hover:animate-bounce transition-all">{newsItem.emoji}</span>
                      <h4 className="text-xs font-bold text-cyan-300 line-clamp-2 group-hover:text-cyan-200 transition-colors flex-1">
                        {newsItem.title}
                      </h4>
                    </div>
                    <p className="text-cyan-300/60 text-xs leading-tight group-hover:text-cyan-300/80 transition-colors line-clamp-2">
                      {newsItem.description}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 animate-fadeIn">
                  <p className="text-cyan-300/60 text-xs">{t.noNews}</p>
                </div>
              )
            ) : null}
        </div>
        </>
        )}
    </div>
  );
}
