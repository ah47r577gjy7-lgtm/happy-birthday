import React, { useState } from 'react';
import { X, Upload, Sparkles, RefreshCw, Check, Image as ImageIcon } from 'lucide-react';
import { BirthdayConfig } from '../types/celebration';
import { resetConfig } from '../utils/storage';

interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BirthdayConfig;
  onSaveConfig: (newConfig: BirthdayConfig) => void;
}

export const CustomizationModal: React.FC<CustomizationModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [formData, setFormData] = useState<BirthdayConfig>(config);
  const [activeTab, setActiveTab] = useState<'photos' | 'text'>('photos');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleImageUpload = (
    key: keyof Pick<
      BirthdayConfig,
      'soniaHeroPhoto' | 'soniaPhoto1' | 'soniaPhoto2' | 'soniaPhoto3' | 'soniaPhoto4' | 'soniaPhoto5'
    >,
    file: File
  ) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid JPG, PNG, or WEBP image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormData((prev) => ({
          ...prev,
          [key]: reader.result as string,
        }));
        showToast('Photo uploaded successfully!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    showToast('Saved changes to device storage!');
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handleReset = () => {
    if (confirm('Reset all photos and messages back to the default Sonia birthday experience?')) {
      const def = resetConfig();
      setFormData(def);
      onSaveConfig(def);
      showToast('Reset to original defaults!');
    }
  };

  const photoSlots: Array<{
    key: keyof Pick<
      BirthdayConfig,
      'soniaHeroPhoto' | 'soniaPhoto1' | 'soniaPhoto2' | 'soniaPhoto3' | 'soniaPhoto4' | 'soniaPhoto5'
    >;
    label: string;
    description: string;
  }> = [
    { key: 'soniaHeroPhoto', label: 'Hero Portrait', description: 'Used as the main large portrait in Screen 4' },
    { key: 'soniaPhoto1', label: 'Photo 1 (Cafe / Memory 1)', description: 'Slideshow #1 & Memory Card #1' },
    { key: 'soniaPhoto2', label: 'Photo 2 (Garden / Memory 2)', description: 'Slideshow #2 & Memory Card #2' },
    { key: 'soniaPhoto3', label: 'Photo 3 (Stargaze / Memory 3)', description: 'Slideshow #3 & Memory Card #3' },
    { key: 'soniaPhoto4', label: 'Photo 4 (Sunset)', description: 'Slideshow #4' },
    { key: 'soniaPhoto5', label: 'Photo 5 (Sparkle Close-Up)', description: 'Slideshow #5' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-2xl overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full my-auto glass-panel-elevated rounded-3xl p-6 sm:p-8 text-left border border-[#FFD6E5]/30 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#FFB6D5] font-semibold">
              Secret Keepsake Studio
            </span>
            <h3 className="text-xl sm:text-2xl font-serif text-[#FFF4F8]">
              Personalize Sonia&apos;s Experience
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full glass-pill hover:bg-white/20 text-[#FFF4F8] transition-colors cursor-pointer"
            aria-label="Close customizer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 pt-4 pb-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('photos')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer ${
              activeTab === 'photos'
                ? 'bg-[#FFD6E5] text-[#0c080d] shadow-sm'
                : 'text-[#F8C8DC] hover:text-white glass-pill'
            }`}
          >
            Photos ({photoSlots.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer ${
              activeTab === 'text'
                ? 'bg-[#FFD6E5] text-[#0c080d] shadow-sm'
                : 'text-[#F8C8DC] hover:text-white glass-pill'
            }`}
          >
            Messages & Names
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto flex-1 py-4 pr-1 space-y-6">
          {activeTab === 'photos' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {photoSlots.map((slot) => {
                const currentImg = formData[slot.key];
                return (
                  <div
                    key={slot.key}
                    className="p-3.5 rounded-2xl glass-panel border border-white/10 flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-black/40 shrink-0 border border-white/10">
                        <img
                          src={currentImg}
                          alt={slot.label}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-semibold text-[#FFF4F8] truncate">
                          {slot.label}
                        </p>
                        <p className="text-[11px] text-[#F8C8DC]/70 line-clamp-1">
                          {slot.description}
                        </p>
                      </div>
                    </div>

                    <label className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl glass-pill hover:bg-white/15 text-xs text-[#FFD6E5] font-medium cursor-pointer transition-colors border border-[#FFD6E5]/20">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Change Photo</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(slot.key, file);
                        }}
                      />
                    </label>
                  </div>
                );
              })}
            </div>
          ) : (
            <form id="text-edit-form" onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#FFB6D5] font-medium mb-1">
                    Birthday Person&apos;s Name
                  </label>
                  <input
                    type="text"
                    value={formData.personName}
                    onChange={(e) =>
                      setFormData({ ...formData, personName: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-[#FFF4F8] focus:border-[#FFB6D5] focus:outline-none"
                    placeholder="SONIA"
                  />
                </div>

                <div>
                  <label className="block text-[#FFB6D5] font-medium mb-1">
                    Your Name / Sender Signature
                  </label>
                  <input
                    type="text"
                    value={formData.senderName}
                    onChange={(e) =>
                      setFormData({ ...formData, senderName: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-[#FFF4F8] focus:border-[#FFB6D5] focus:outline-none"
                    placeholder="With all my heart"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#FFB6D5] font-medium mb-1">
                  Main Birthday Message (Screen 4 Hero)
                </label>
                <textarea
                  rows={3}
                  value={formData.mainBirthdayMessage}
                  onChange={(e) =>
                    setFormData({ ...formData, mainBirthdayMessage: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-[#FFF4F8] focus:border-[#FFB6D5] focus:outline-none"
                />
              </div>

              {/* Memory Cards 1, 2, 3 */}
              <div className="p-3 rounded-2xl glass-panel space-y-3">
                <span className="text-[11px] font-semibold text-[#FFD6E5] uppercase tracking-wider block">
                  Memory Card 1
                </span>
                <input
                  type="text"
                  value={formData.memory1Title}
                  onChange={(e) =>
                    setFormData({ ...formData, memory1Title: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 text-[#FFF4F8]"
                  placeholder="Title"
                />
                <textarea
                  rows={2}
                  value={formData.memory1Text}
                  onChange={(e) =>
                    setFormData({ ...formData, memory1Text: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 text-[#FFF4F8]"
                  placeholder="Text"
                />
              </div>

              <div className="p-3 rounded-2xl glass-panel space-y-3">
                <span className="text-[11px] font-semibold text-[#FFD6E5] uppercase tracking-wider block">
                  Memory Card 2
                </span>
                <input
                  type="text"
                  value={formData.memory2Title}
                  onChange={(e) =>
                    setFormData({ ...formData, memory2Title: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 text-[#FFF4F8]"
                  placeholder="Title"
                />
                <textarea
                  rows={2}
                  value={formData.memory2Text}
                  onChange={(e) =>
                    setFormData({ ...formData, memory2Text: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 text-[#FFF4F8]"
                  placeholder="Text"
                />
              </div>

              <div className="p-3 rounded-2xl glass-panel space-y-3">
                <span className="text-[11px] font-semibold text-[#FFD6E5] uppercase tracking-wider block">
                  Memory Card 3
                </span>
                <input
                  type="text"
                  value={formData.memory3Title}
                  onChange={(e) =>
                    setFormData({ ...formData, memory3Title: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 text-[#FFF4F8]"
                  placeholder="Title"
                />
                <textarea
                  rows={2}
                  value={formData.memory3Text}
                  onChange={(e) =>
                    setFormData({ ...formData, memory3Text: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 text-[#FFF4F8]"
                  placeholder="Text"
                />
              </div>

              <div>
                <label className="block text-[#FFB6D5] font-medium mb-1">
                  Final Emotional Message
                </label>
                <input
                  type="text"
                  value={formData.finalMessage}
                  onChange={(e) =>
                    setFormData({ ...formData, finalMessage: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-[#FFF4F8] focus:border-[#FFB6D5] focus:outline-none"
                />
              </div>
            </form>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 sm:pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-[#F8C8DC]/60 hover:text-white transition-colors cursor-pointer self-start sm:self-auto touch-manipulation"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset to Defaults</span>
          </button>

          <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-full text-xs font-medium text-[#FFF4F8] glass-pill hover:bg-white/10 cursor-pointer touch-manipulation text-center"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 sm:px-6 py-2 rounded-full text-xs font-semibold text-[#0c080d] bg-gradient-to-r from-[#FFD6E5] to-[#FFB6D5] hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md shadow-[#FFB6D5]/30 touch-manipulation"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Changes</span>
            </button>
          </div>
        </div>

        {/* Toast confirmation */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full glass-panel-elevated bg-[#FFB6D5] text-[#0c080d] text-xs font-semibold shadow-lg animate-fadeIn">
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
};
