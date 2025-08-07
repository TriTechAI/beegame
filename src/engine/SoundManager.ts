// 音效管理器类
export class SoundManager {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private isEnabled: boolean = true;
  private masterVolume: number = 0.3;

  constructor() {
    this.initAudioContext();
    this.generateSounds();
  }

  // 初始化音频上下文
  private initAudioContext(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  // 生成8位风格音效
  private generateSounds(): void {
    if (!this.audioContext) return;

    // 射击音效
    this.sounds.set('shoot', this.generateShootSound());
    
    // 爆炸音效
    this.sounds.set('explosion', this.generateExplosionSound());
    
    // 敌机被击中音效
    this.sounds.set('enemyHit', this.generateEnemyHitSound());
    
    // 玩家被击中音效
    this.sounds.set('playerHit', this.generatePlayerHitSound());
    
    // 升级音效
    this.sounds.set('levelUp', this.generateLevelUpSound());
    
    // 游戏结束音效
    this.sounds.set('gameOver', this.generateGameOverSound());
    
    // 背景音乐
    this.sounds.set('bgMusic', this.generateBackgroundMusic());
  }

  // 生成射击音效
  private generateShootSound(): AudioBuffer {
    const duration = 0.1;
    const sampleRate = this.audioContext!.sampleRate;
    const buffer = this.audioContext!.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      // 高频脉冲音效
      const frequency = 800 - (t * 400);
      data[i] = Math.sin(2 * Math.PI * frequency * t) * Math.exp(-t * 10) * 0.3;
    }

    return buffer;
  }

  // 生成爆炸音效
  private generateExplosionSound(): AudioBuffer {
    const duration = 0.5;
    const sampleRate = this.audioContext!.sampleRate;
    const buffer = this.audioContext!.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      // 噪音爆炸效果
      const noise = (Math.random() - 0.5) * 2;
      const envelope = Math.exp(-t * 3);
      const lowFreq = Math.sin(2 * Math.PI * 60 * t) * 0.5;
      data[i] = (noise * 0.7 + lowFreq * 0.3) * envelope * 0.4;
    }

    return buffer;
  }

  // 生成敌机被击中音效
  private generateEnemyHitSound(): AudioBuffer {
    const duration = 0.2;
    const sampleRate = this.audioContext!.sampleRate;
    const buffer = this.audioContext!.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      const frequency = 300 + Math.sin(t * 50) * 100;
      data[i] = Math.sin(2 * Math.PI * frequency * t) * Math.exp(-t * 8) * 0.2;
    }

    return buffer;
  }

  // 生成玩家被击中音效
  private generatePlayerHitSound(): AudioBuffer {
    const duration = 0.3;
    const sampleRate = this.audioContext!.sampleRate;
    const buffer = this.audioContext!.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      const frequency = 200 - (t * 150);
      data[i] = Math.sin(2 * Math.PI * frequency * t) * Math.exp(-t * 5) * 0.3;
    }

    return buffer;
  }

  // 生成升级音效
  private generateLevelUpSound(): AudioBuffer {
    const duration = 1.0;
    const sampleRate = this.audioContext!.sampleRate;
    const buffer = this.audioContext!.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      const frequency = 440 + Math.sin(t * 8) * 220;
      const envelope = Math.exp(-t * 2);
      data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.2;
    }

    return buffer;
  }

  // 生成游戏结束音效
  private generateGameOverSound(): AudioBuffer {
    const duration = 2.0;
    const sampleRate = this.audioContext!.sampleRate;
    const buffer = this.audioContext!.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      const frequency = 220 - (t * 100);
      const envelope = Math.exp(-t * 1);
      data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.25;
    }

    return buffer;
  }

  // 生成背景音乐
  private generateBackgroundMusic(): AudioBuffer {
    const duration = 8.0; // 8秒循环
    const sampleRate = this.audioContext!.sampleRate;
    const buffer = this.audioContext!.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);

    // 简单的旋律序列
    const melody = [440, 494, 523, 587, 659, 587, 523, 494]; // A, B, C, D, E, D, C, B
    const noteLength = duration / melody.length;

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      const noteIndex = Math.floor(t / noteLength);
      const noteTime = t % noteLength;
      const frequency = melody[noteIndex] || 440;
      
      const envelope = Math.max(0, 1 - (noteTime / noteLength));
      data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.1;
    }

    return buffer;
  }

  // 播放音效
  playSound(soundName: string, volume: number = 1.0, loop: boolean = false): AudioBufferSourceNode | null {
    if (!this.isEnabled || !this.audioContext || !this.sounds.has(soundName)) {
      return null;
    }

    try {
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();
      
      source.buffer = this.sounds.get(soundName)!;
      source.loop = loop;
      
      gainNode.gain.value = volume * this.masterVolume;
      
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      source.start();
      
      return source;
    } catch (error) {
      console.warn('Error playing sound:', error);
      return null;
    }
  }

  // 停止音效
  stopSound(source: AudioBufferSourceNode | null): void {
    if (source) {
      try {
        source.stop();
      } catch (error) {
        // 音效可能已经结束
      }
    }
  }

  // 设置音效开关
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  // 获取音效开关状态
  getEnabled(): boolean {
    return this.isEnabled;
  }

  // 设置主音量
  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  // 获取主音量
  getMasterVolume(): number {
    return this.masterVolume;
  }

  // 恢复音频上下文（用户交互后）
  resumeAudioContext(): void {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }
}

// 全局音效管理器实例
export const soundManager = new SoundManager();