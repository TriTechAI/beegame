// 游戏对象基类
export interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  active: boolean;
}

// 玩家飞机
export interface Player extends GameObject {
  lives: number;
  speed: number;
  lastShot: number;
}

// 敌机
export interface Enemy extends GameObject {
  type: 'small' | 'medium' | 'large';
  speed: number;
  points: number;
  health: number;
}

// 子弹
export interface Bullet extends GameObject {
  speed: number;
  damage: number;
  owner: 'player' | 'enemy';
}

// 游戏状态
export interface GameState {
  score: number;
  level: number;
  lives: number;
  gameStatus: 'menu' | 'playing' | 'paused' | 'gameover';
  highScore: number;
}

// 游戏配置
export interface GameConfig {
  canvasWidth: number;
  canvasHeight: number;
  playerSpeed: number;
  bulletSpeed: number;
  enemySpawnRate: number;
  maxBullets: number;
  isMobile: boolean;
  scaleFactor: number;
}

// 本地存储键名定义
export const STORAGE_KEYS = {
  HIGH_SCORE: 'bee_game_high_score',
  GAME_SETTINGS: 'bee_game_settings'
} as const;

// 响应式Canvas尺寸计算
export function getResponsiveCanvasSize(): { width: number; height: number; isMobile: boolean; scaleFactor: number } {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
  
  let width: number;
  let height: number;
  let scaleFactor: number;
  
  if (isMobile) {
    // 移动端：使用屏幕宽度的90%，保持16:9比例
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    if (screenWidth > screenHeight) {
      // 横屏模式
      width = Math.min(screenHeight * 0.9 * (16/9), screenWidth * 0.8);
      height = width * (9/16);
    } else {
      // 竖屏模式
      width = screenWidth * 0.9;
      height = Math.min(width * (4/3), screenHeight * 0.6);
    }
    scaleFactor = width / 800; // 基于800px基准计算缩放比例
  } else {
    // 桌面端：使用固定尺寸或根据窗口大小调整
    const maxWidth = Math.min(window.innerWidth * 0.8, 1000);
    const maxHeight = Math.min(window.innerHeight * 0.7, 750);
    
    width = Math.min(800, maxWidth);
    height = Math.min(600, maxHeight);
    scaleFactor = 1;
  }
  
  return { width, height, isMobile, scaleFactor };
}

// 游戏配置默认值
export const DEFAULT_CONFIG: GameConfig = {
  canvasWidth: 800,
  canvasHeight: 600,
  playerSpeed: 5,
  bulletSpeed: 8,
  enemySpawnRate: 0.02,
  maxBullets: 5,
  isMobile: false,
  scaleFactor: 1
};

// 敌机类型配置
export const ENEMY_TYPES = {
  small: {
    width: 30,
    height: 30,
    speed: 2,
    points: 100,
    health: 1
  },
  medium: {
    width: 50,
    height: 50,
    speed: 1.5,
    points: 200,
    health: 2
  },
  large: {
    width: 80,
    height: 80,
    speed: 1,
    points: 500,
    health: 3
  }
} as const;

// 存储最高分
export function saveHighScore(score: number): void {
  localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, score.toString());
}

// 读取最高分
export function getHighScore(): number {
  const stored = localStorage.getItem(STORAGE_KEYS.HIGH_SCORE);
  return stored ? parseInt(stored, 10) : 0;
}