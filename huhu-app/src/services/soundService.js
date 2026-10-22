// Sound Notification Service with Web Audio synthesizer and MP3 File support

class SoundService {
  constructor() {
    this.customAudio = null;
    this.customAudioData = null;
    this.audioContext = null;
    this.enabled = true;
    this.soundName = 'Default Chime';
    
    // Load stored MP3 if available
    try {
      const savedMp3 = localStorage.getItem('huhu_custom_mp3');
      const savedName = localStorage.getItem('huhu_sound_name');
      if (savedMp3) {
        this.customAudioData = savedMp3;
        this.customAudio = new Audio(savedMp3);
        this.soundName = savedName || 'Custom MP3';
      }
    } catch (e) {
      console.warn('Could not load saved audio from storage', e);
    }
  }

  setEnabled(val) {
    this.enabled = !!val;
    localStorage.setItem('huhu_sound_enabled', this.enabled ? 'true' : 'false');
  }

  isEnabled() {
    return this.enabled;
  }

  getSoundName() {
    return this.soundName;
  }

  // Load custom MP3 file from user file picker
  async setCustomMp3File(file) {
    return new Promise((resolve, reject) => {
      if (!file) return reject(new Error('No file selected'));
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const base64Data = e.target.result;
          this.customAudioData = base64Data;
          this.customAudio = new Audio(base64Data);
          this.soundName = file.name || 'Custom MP3';
          
          // Save in localStorage (if size permits, otherwise keep in memory for session)
          try {
            localStorage.setItem('huhu_custom_mp3', base64Data);
            localStorage.setItem('huhu_sound_name', this.soundName);
          } catch (storageError) {
            console.warn('MP3 exceeds localStorage quota, using in-memory audio for this session:', storageError);
          }

          // Test play
          this.customAudio.currentTime = 0;
          this.customAudio.play().catch(err => console.log('Autoplay policy caught:', err));
          resolve(this.soundName);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }

  // Reset to default chime
  resetToDefault() {
    this.customAudio = null;
    this.customAudioData = null;
    this.soundName = 'Default Chime';
    localStorage.removeItem('huhu_custom_mp3');
    localStorage.removeItem('huhu_sound_name');
    this.playDefaultChime();
  }

  // Fallback Web Audio API synthesizer for mobile phone speaker
  playDefaultChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.audioContext || this.audioContext.state === 'closed') {
        this.audioContext = new AudioCtx();
      }
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      const now = this.audioContext.currentTime;
      
      // Pleasant melodic chime: 3 harmonious tones (E5, G#5, B5)
      const notes = [659.25, 830.61, 987.77];
      notes.forEach((freq, idx) => {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0.001, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.3, now + idx * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 0.4);

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.45);
      });
    } catch (e) {
      console.warn('AudioContext failed:', e);
    }
  }

  // Main notification trigger
  playNotification() {
    if (!this.enabled) return;

    if (this.customAudio) {
      try {
        this.customAudio.currentTime = 0;
        const playPromise = this.customAudio.play();
        if (playPromise !== undefined) {
          playPromise.catch((e) => {
            console.log('Custom MP3 play error, falling back to chime:', e);
            this.playDefaultChime();
          });
        }
      } catch (err) {
        this.playDefaultChime();
      }
    } else {
      this.playDefaultChime();
    }
  }
}

export const soundService = new SoundService();
