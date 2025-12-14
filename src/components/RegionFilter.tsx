'use client';

import { useState } from 'react';

interface RegionFilterProps {
  regions: string[];
  selectedRegion: string | null;
  onRegionChange: (region: string | null) => void;
  language?: 'en' | 'tl';
}

const PHILIPPINE_REGIONS = {
  'Luzon': '🏔️',
  'Visayas': '🏝️',
  'Mindanao': '🌴',
  'Metro Manila': '🏙️',
  'Calabarzon': '🌾',
  'Cagayan Valley': '🌄',
  'Central Luzon': '🏞️',
  'Cordillera': '⛰️',
  'Ilocos': '🌊',
  'Bicol': '🌋',
  'Eastern Visayas': '⛵',
  'Western Visayas': '🏖️',
  'Central Visayas': '🏝️',
  'Davao': '🌺',
  'Soccsksargen': '🌿',
  'Zamboanga': '🏄',
  'Bangsamoro': '🕌',
};

export default function RegionFilter({
  regions,
  selectedRegion,
  onRegionChange,
  language = 'en',
}: RegionFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const labels = {
    en: { filter: 'Filter by Region:', all: 'All Regions' },
    tl: { filter: 'I-filter ayon sa Rehiyon:', all: 'Lahat ng Rehiyon' },
  };

  const t = labels[language];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <label className="flex text-sm font-bold text-cyan-300 items-center gap-2">
          <span className="animate-pulse">●</span> 🗺️ {t.filter}
        </label>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-3 py-1 text-xs bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 rounded-lg hover:bg-cyan-500/30 transition-all"
        >
          {isExpanded ? '▼ Collapse' : '▶ Expand'}
        </button>
      </div>
      <div className={`flex flex-wrap gap-3 overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96' : 'max-h-16'}`}>
        <button
          onClick={() => onRegionChange(null)}
          className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 text-sm whitespace-nowrap ${
            selectedRegion === null
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-2 border-cyan-300 shadow-lg shadow-cyan-500/50'
              : 'bg-cyan-500/10 text-cyan-300 border-2 border-cyan-400/30 hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/30'
          }`}
        >
          🇵🇭 {t.all}
        </button>
        {regions
          .filter(r => r !== 'Unknown')
          .sort()
          .map((region) => (
            <button
              key={region}
              onClick={() => onRegionChange(selectedRegion === region ? null : region)}
              className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 text-sm whitespace-nowrap ${
                selectedRegion === region
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-2 border-cyan-300 shadow-lg shadow-cyan-500/50'
                  : 'bg-cyan-500/10 text-cyan-300 border-2 border-cyan-400/30 hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/30'
              }`}
            >
              {PHILIPPINE_REGIONS[region as keyof typeof PHILIPPINE_REGIONS] || '📍'} {region}
            </button>
          ))}
      </div>
    </div>
  );
}
