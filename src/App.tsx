import React, { useState, useEffect } from 'react';
import { GlobalBackground } from './components/GlobalBackground';
import { InteractiveCursor } from './components/InteractiveCursor';
import { Screen1WhyHere } from './components/Screen1WhyHere';
import { Screen2Magic } from './components/Screen2Magic';
import { Screen3BirthdayReveal } from './components/Screen3BirthdayReveal';
import { Screen4LongBirthdayPage } from './components/Screen4LongBirthdayPage';
import { ControlDrawer } from './components/ControlDrawer';
import { CustomizationModal } from './components/CustomizationModal';
import { BirthdayConfig, ScreenId } from './types/celebration';
import { loadConfig, saveConfig } from './utils/storage';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('screen1');
  const [config, setConfig] = useState<BirthdayConfig>(() => loadConfig());
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // Sync title with person's name
  useEffect(() => {
    document.title = `Happy Birthday, ${config.personName} ♡ | A Special Keepsake`;
  }, [config.personName]);

  const handleUpdateConfig = (newConfig: BirthdayConfig) => {
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  const handleRestart = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentScreen('screen1');
  };

  return (
    <div className={`relative bg-[#0c080d] text-[#FFF4F8] selection:bg-[#FFB6D5]/30 ${
      currentScreen === 'screen4' ? 'min-h-screen overflow-x-hidden' : 'h-[100dvh] overflow-hidden'
    }`}>
      {/* Cinematic global background with pink blobs, bokeh, stars, and subtle rays */}
      <GlobalBackground blurHeavy={currentScreen === 'screen1'} />

      {/* Subtle interactive cursor light follower on desktop */}
      <InteractiveCursor />

      {/* Three-dot menu button (top-right safe area) and right-sliding control drawer */}
      <ControlDrawer onOpenSettings={() => setIsCustomizerOpen(true)} />

      {/* Main cinematic interactive story flow */}
      <main className="relative z-10 w-full h-full">
        {currentScreen === 'screen1' && (
          <Screen1WhyHere onNext={() => setCurrentScreen('screen2')} />
        )}

        {currentScreen === 'screen2' && (
          <Screen2Magic onUnlockBirthday={() => setCurrentScreen('screen3')} />
        )}

        {currentScreen === 'screen3' && (
          <Screen3BirthdayReveal
            config={config}
            onProceedToLongPage={() => {
              setCurrentScreen('screen4');
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
          />
        )}

        {currentScreen === 'screen4' && (
          <Screen4LongBirthdayPage
            config={config}
            onRestart={handleRestart}
            onOpenCustomizer={() => setIsCustomizerOpen(true)}
          />
        )}
      </main>

      {/* Hidden Customization Panel (accessible via top-right gear or Shift+C) */}
      <CustomizationModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        config={config}
        onSaveConfig={handleUpdateConfig}
      />
    </div>
  );
}
