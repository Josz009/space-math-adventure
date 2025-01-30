// Sound generation using Web Audio API
export function createSoundEffects() {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

  const createExplosionSound = () => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(100, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    gainNode.gain.setValueAtTime(1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const createEngineSound = () => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(50, audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    
    return {
      start: () => oscillator.start(),
      stop: () => oscillator.stop(),
      setVolume: (volume: number) => {
        gainNode.gain.setValueAtTime(volume * 0.1, audioContext.currentTime);
      }
    };
  };

  return {
    playExplosion: createExplosionSound,
    createEngine: createEngineSound,
  };
}
