import React, { useState } from 'react';
import { X, Sparkles, Heart } from 'lucide-react';
import { sounds } from '../utils/audio';

interface PersonalizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  onSaveName: (name: string) => void;
}

export const PersonalizeModal: React.FC<PersonalizeModalProps> = ({
  isOpen,
  onClose,
  currentName,
  onSaveName,
}) => {
  const [nameInput, setNameInput] = useState(currentName);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      sounds.playArpeggio();
      onSaveName(nameInput.trim());
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl"
      onClick={onClose}
    >
      <div
        className="relative max-w-md w-full glass-panel-elevated rounded-3xl p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          data-interactive="true"
          className="absolute top-6 right-6 p-2 rounded-full glass-panel text-[#FFF4F8] hover:bg-white/20 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-full glass-pill flex items-center justify-center text-[#FFB6D5] mx-auto mb-4">
          <Heart className="w-5 h-5 fill-[#FFB6D5]/40" />
        </div>

        <h3 className="text-2xl font-serif text-[#FFF4F8] mb-2">
          Personalize Dedication
        </h3>
        <p className="text-xs text-[#F8C8DC]/80 font-light mb-6">
          Enter the name of the person you are celebrating. All animations and cards will update dynamically.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="e.g. Elena, Sophia, Maya..."
            maxLength={30}
            className="w-full px-5 py-3 rounded-full text-center text-sm font-serif text-[#FFF4F8] bg-white/5 border border-[#FFD6E5]/25 focus:outline-none focus:border-[#FFB6D5] focus:ring-2 focus:ring-[#FFB6D5]/30 transition-all placeholder:text-white/30"
            autoFocus
          />

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              data-interactive="true"
              className="flex-1 py-3 rounded-full text-xs font-medium text-[#FFF4F8] glass-pill hover:bg-white/10 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              data-interactive="true"
              className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-full text-xs font-semibold text-[#0c080d] bg-gradient-to-r from-[#FFD6E5] to-[#FFB6D5] hover:scale-102 active:scale-98 transition-all cursor-pointer shadow-md shadow-[#FFB6D5]/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Apply Name</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
