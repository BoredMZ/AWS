'use client';

import { downloadCredentials, downloadArduinoCode, STATION_CONFIG, COMPONENT_ALTERNATIVES, AUDIENCE_TYPES, type AudienceType } from '@/lib/credentialsGenerator';
import { useState } from 'react';

interface CredentialsPanelProps {
  language?: 'en' | 'tl';
}

const STATIONS = ['manila', 'laguna', 'pampanga', 'cavite', 'bulacan', 'batangas'];

const SENSOR_LABELS = {
  atmosphericPressure: '🏙️ Atmospheric Pressure',
  solarRadiation: '☀️ Solar Radiation',
  soilMoisture: '🌱 Soil Moisture',
  uvIndex: '🌞 UV Index',
  visibility: '👁️ Visibility',
};

export default function CredentialsPanel({ language = 'en' }: CredentialsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState<string>('manila');
  const [showCustomization, setShowCustomization] = useState(false);
  const [showComponentCustomization, setShowComponentCustomization] = useState(false);
  const [selectedRainfallComponent, setSelectedRainfallComponent] = useState<string>(COMPONENT_ALTERNATIVES.RAINFALL.default);
  const [selectedWindSpeedComponent, setSelectedWindSpeedComponent] = useState<string>(COMPONENT_ALTERNATIVES.WIND_SPEED.default);
  const [selectedAudience, setSelectedAudience] = useState<AudienceType>('students');

  const stationConfig = STATION_CONFIG[selectedStation] || STATION_CONFIG['manila'];
  const [selectedSensors, setSelectedSensors] = useState<string[]>(stationConfig.sensors || []);

  const labels = {
    en: {
      title: 'ESP32 Credentials',
      subtitle: 'Download configuration files for your ESP32 weather station device',
      downloadJSON: '📥 Download JSON Credentials',
      downloadCode: '📥 Download Arduino Code',
      jsonDesc: 'Configuration file in JSON format for ESP32 setup',
      codeDesc: 'Arduino/C++ code with Firebase integration',
      instructions: 'Instructions',
      step1: '1. Download the JSON credentials file',
      step2: '2. Upload to your ESP32 device storage',
      step3: '3. Or download the Arduino code template',
      step4: '4. Modify with your WiFi credentials',
      selectStation: 'Select Station:',
      customize: 'Customize Sensors',
      customizeComponents: '🔧 Customize Components',
      selectSensors: 'Select sensors for this station:',
      rainfallComponent: 'Rainfall Sensor Component:',
      windSpeedComponent: 'Wind Speed Sensor Component:',
      download: 'Download Code',
      close: 'Close',
      back: 'Back',
      audienceTarget: 'Target Audience:',
      audienceHelp: 'This determines the news and data insights shown for this station',
    },
    tl: {
      title: 'ESP32 Mga Credentials',
      subtitle: 'I-download ang configuration files para sa iyong ESP32 weather station device',
      downloadJSON: '📥 I-download ang JSON Credentials',
      downloadCode: '📥 I-download ang Arduino Code',
      jsonDesc: 'Configuration file sa JSON format para sa ESP32 setup',
      codeDesc: 'Arduino/C++ code na may Firebase integration',
      instructions: 'Mga Tagubilin',
      step1: '1. I-download ang JSON credentials file',
      step2: '2. I-upload sa iyong ESP32 device storage',
      step3: '3. O i-download ang Arduino code template',
      step4: '4. Baguhin gamit ang iyong WiFi credentials',
      selectStation: 'Piliin ang Station:',
      customize: 'I-customize ang Mga Sensor',
      customizeComponents: '🔧 I-customize ang Mga Component',
      selectSensors: 'Piliin ang mga sensor para sa stasyong ito:',
      rainfallComponent: 'Rainfall Sensor Component:',
      windSpeedComponent: 'Wind Speed Sensor Component:',
      download: 'I-download ang Code',
      close: 'Isara',
      back: 'Bumalik',
      audienceTarget: 'Target Audience:',
      audienceHelp: 'Ito ay tumutukoy sa balita at insights na ipapakita para sa istasyong ito',
    },
  };

  const t = labels[language];

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full p-4 shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 z-30 flex items-center gap-2 animate-bounce"
        title="ESP32 Credentials"
      >
        <span className="text-2xl">🤖</span>
        <span className="hidden sm:inline font-bold">ESP32</span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-fadeIn"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Credentials Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl border-2 border-purple-300 p-6 max-w-sm z-50 animate-slideInUp max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span className="text-2xl">🤖</span> {t.title}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>
          </div>

          <p className="text-sm text-gray-600 mb-6">{t.subtitle}</p>

          {/* Download Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => {
                downloadCredentials();
                setIsOpen(false);
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg transition-all hover:scale-105 transform"
            >
              {t.downloadJSON}
            </button>
            <p className="text-xs text-gray-500 text-center">{t.jsonDesc}</p>

            {/* Station Selection */}
            {!showCustomization ? (
              <button
                onClick={() => setShowCustomization(true)}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg transition-all hover:scale-105 transform"
              >
                {t.customize}
              </button>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg border-2 border-green-200">
                <label className="block text-sm font-bold text-gray-700 mb-2">{t.selectStation}</label>
                <select
                  value={selectedStation}
                  onChange={(e) => {
                    setSelectedStation(e.target.value);
                    setSelectedSensors(STATION_CONFIG[e.target.value]?.sensors || []);
                  }}
                  className="w-full p-2 border border-gray-300 rounded-lg mb-4 text-gray-800"
                >
                  {STATIONS.map(station => (
                    <option key={station} value={station}>
                      {station.charAt(0).toUpperCase() + station.slice(1)} ({STATION_CONFIG[station]?.municipality || 'Unknown'})
                    </option>
                  ))}
                </select>

                {/* Target Audience Selector */}
                <label className="block text-sm font-bold text-gray-700 mb-2">{t.audienceTarget}</label>
                <div className="space-y-2 mb-4">
                  {(Object.entries(AUDIENCE_TYPES) as [AudienceType, typeof AUDIENCE_TYPES['students']][]).map(([audienceKey, audienceInfo]) => (
                    <label key={audienceKey} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-100 transition">
                      <input
                        type="radio"
                        name="audience"
                        value={audienceKey}
                        checked={selectedAudience === audienceKey}
                        onChange={(e) => setSelectedAudience(e.target.value as AudienceType)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-700">
                        <span className="text-lg mr-1">{audienceInfo.icon}</span>
                        <span className="font-semibold">{audienceInfo.label}</span>
                        <span className="text-xs text-gray-500 ml-2">- {audienceInfo.description}</span>
                      </span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-600 mb-4 bg-blue-50 p-2 rounded">{t.audienceHelp}</p>
                <label className="block text-sm font-bold text-gray-700 mb-2">{t.selectSensors}</label>
                <div className="space-y-2 mb-4">
                  {Object.entries(SENSOR_LABELS).map(([sensor, label]) => (
                    <label key={sensor} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedSensors.includes(sensor)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSensors([...selectedSensors, sensor]);
                          } else {
                            setSelectedSensors(selectedSensors.filter(s => s !== sensor));
                          }
                        }}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>

                {/* Download & Cancel Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      downloadArduinoCode({ 
                        stationLocation: selectedStation, 
                        sensors: selectedSensors,
                        rainfallComponent: selectedRainfallComponent,
                        windSpeedComponent: selectedWindSpeedComponent,
                        audienceTarget: selectedAudience,
                      });
                      setShowCustomization(false);
                      setShowComponentCustomization(false);
                      setIsOpen(false);
                    }}
                    className="flex-1 bg-green-500 text-white font-bold py-2 px-3 rounded-lg hover:bg-green-600 transition-all"
                  >
                    {t.download}
                  </button>
                  <button
                    onClick={() => {
                      setShowComponentCustomization(false);
                      if (!showComponentCustomization) {
                        setShowCustomization(false);
                      }
                    }}
                    className="flex-1 bg-gray-400 text-white font-bold py-2 px-3 rounded-lg hover:bg-gray-500 transition-all"
                  >
                    {t.back}
                  </button>
                </div>

                {/* Component Customization Button */}
                {!showComponentCustomization && (
                  <button
                    onClick={() => setShowComponentCustomization(true)}
                    className="w-full mt-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-2 px-3 rounded-lg hover:shadow-lg transition-all text-sm"
                  >
                    {t.customizeComponents}
                  </button>
                )}

                {/* Component Customization Section */}
                {showComponentCustomization && (
                  <div className="mt-4 bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                    <h4 className="font-bold text-gray-800 mb-3 text-sm">⚙️ {t.customizeComponents}</h4>
                    
                    {/* Rainfall Component */}
                    <div className="mb-4">
                      <label className="block text-sm font-bold text-gray-700 mb-2">{t.rainfallComponent}</label>
                      <select
                        value={selectedRainfallComponent}
                        onChange={(e) => setSelectedRainfallComponent(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 text-sm"
                      >
                        {COMPONENT_ALTERNATIVES.RAINFALL.alternatives.map(comp => (
                          <option key={comp.id} value={comp.id}>
                            {comp.name} - PIN: {comp.pins} (Cal: {comp.calibration})
                          </option>
                        ))}
                      </select>
                      {selectedRainfallComponent && (
                        <p className="text-xs text-gray-600 mt-1">
                          💡 {COMPONENT_ALTERNATIVES.RAINFALL.alternatives.find(c => c.id === selectedRainfallComponent)?.description}
                        </p>
                      )}
                    </div>

                    {/* Wind Speed Component */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">{t.windSpeedComponent}</label>
                      <select
                        value={selectedWindSpeedComponent}
                        onChange={(e) => setSelectedWindSpeedComponent(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 text-sm"
                      >
                        {COMPONENT_ALTERNATIVES.WIND_SPEED.alternatives.map(comp => (
                          <option key={comp.id} value={comp.id}>
                            {comp.name} - PIN: {comp.pins} (Cal: {comp.calibration})
                          </option>
                        ))}
                      </select>
                      {selectedWindSpeedComponent && (
                        <p className="text-xs text-gray-600 mt-1">
                          💡 {COMPONENT_ALTERNATIVES.WIND_SPEED.alternatives.find(c => c.id === selectedWindSpeedComponent)?.description}
                        </p>
                      )}
                    </div>

                    {/* Back Button */}
                    <button
                      onClick={() => setShowComponentCustomization(false)}
                      className="w-full mt-3 bg-gray-400 text-white font-bold py-2 px-3 rounded-lg hover:bg-gray-500 transition-all text-sm"
                    >
                      {t.back}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-lg">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span>📋</span> {t.instructions}
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold mt-0.5">1</span>
                <span>{t.step1}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold mt-0.5">2</span>
                <span>{t.step2}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold mt-0.5">3</span>
                <span>{t.step3}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold mt-0.5">4</span>
                <span>{t.step4}</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
