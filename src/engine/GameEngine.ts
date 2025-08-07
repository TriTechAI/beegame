import {
  GameObject,
  Player,
  Enemy,
  Bullet,
  GameState,
  GameConfig,
  DEFAULT_CONFIG,
  ENEMY_TYPES,
  getResponsiveCanvasSize
} from '../types/game';
import { SoundManager } from './SoundManager';

// 创建全局音效管理器实例
const soundManager = new SoundManager();

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private config: GameConfig;
  private gameState: GameState;
  private player: Player;
  private enemies: Enemy[];
  private bullets: Bullet[];
  private keys: Set<string>;
  private virtualKeys: { [key: string]: boolean }; // 虚拟按键状态
  private animationId: number | null;
  private lastTime: number;
  private stars: Array<{ x: number; y: number; size: number }>;
  private backgroundMusicSource: AudioBufferSourceNode | null = null;
  private touchControls: {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
    shoot: boolean;
  };

  constructor() {
    this.config = { ...DEFAULT_CONFIG };
    this.gameState = {
      score: 0,
      level: 1,
      lives: 3,
      gameStatus: 'menu',
      highScore: 0
    };
    this.enemies = [];
    this.bullets = [];
    this.keys = new Set();
    this.virtualKeys = {};
    this.touchControls = {
      up: false,
      down: false,
      left: false,
      right: false,
      shoot: false
    };
    this.animationId = null;
    this.lastTime = 0;
    this.stars = [];
    
    // 初始化玩家
    this.player = {
      x: this.config.canvasWidth / 2 - 20,
      y: this.config.canvasHeight - 60,
      width: 40,
      height: 40,
      active: true,
      lives: 3,
      speed: this.config.playerSpeed,
      lastShot: 0
    };

    // 生成星空背景
    this.generateStars();
  }

  // 初始化游戏
  init(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('无法获取Canvas 2D上下文');
    }
    this.ctx = context;
    
    // 设置响应式画布尺寸
    this.updateCanvasSize();
    
    // 绑定键盘事件
    this.bindEvents();
    
    // 监听窗口大小变化
    window.addEventListener('resize', this.handleResize.bind(this));
    window.addEventListener('orientationchange', this.handleResize.bind(this));
  }

  // 更新Canvas尺寸
  private updateCanvasSize(): void {
    const { width, height, isMobile, scaleFactor } = getResponsiveCanvasSize();
    
    this.config.canvasWidth = width;
    this.config.canvasHeight = height;
    this.config.isMobile = isMobile;
    this.config.scaleFactor = scaleFactor;
    
    if (this.canvas) {
      this.canvas.width = width;
      this.canvas.height = height;
      
      // 设置Canvas样式尺寸
      this.canvas.style.width = `${width}px`;
      this.canvas.style.height = `${height}px`;
    }
    
    // 重新初始化星空
    this.initStars();
    
    // 调整玩家位置（如果已存在）
    if (this.player) {
      this.player.x = Math.min(this.player.x, this.config.canvasWidth - this.player.width);
      this.player.y = Math.min(this.player.y, this.config.canvasHeight - this.player.height);
    }
  }
  
  // 处理窗口大小变化
  private handleResize(): void {
    // 延迟处理，避免频繁调用
    setTimeout(() => {
      this.updateCanvasSize();
    }, 100);
  }

  // 绑定事件
  private bindEvents(): void {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  // 处理按键按下
  private handleKeyDown(e: KeyboardEvent): void {
    this.keys.add(e.code);
    if (e.code === 'Escape' && this.gameState.gameStatus === 'playing') {
      this.pauseGame();
    }
  }

  // 处理按键释放
  private handleKeyUp(e: KeyboardEvent): void {
    this.keys.delete(e.code);
  }

  // 生成星空背景
  private generateStars(): void {
    for (let i = 0; i < 100; i++) {
      this.stars.push({
        x: Math.random() * this.config.canvasWidth,
        y: Math.random() * this.config.canvasHeight,
        size: Math.random() * 2 + 1
      });
    }
  }

  // 初始化星空
  private initStars(): void {
    this.stars = [];
    this.generateStars();
  }

  // 开始游戏
  startGame(): void {
    this.gameState.gameStatus = 'playing';
    this.gameState.score = 0;
    this.gameState.level = 1;
    this.gameState.lives = 3;
    this.player.lives = 3;
    this.player.x = this.config.canvasWidth / 2 - 20;
    this.player.y = this.config.canvasHeight - 60;
    this.player.active = true;
    this.enemies = [];
    this.bullets = [];
    this.lastTime = performance.now();
    
    // 恢复音频上下文并播放背景音乐
    soundManager.resumeAudioContext();
    this.playBackgroundMusic();
    
    this.gameLoop();
  }

  // 暂停游戏
  pauseGame(): void {
    if (this.gameState.gameStatus === 'playing') {
      this.gameState.gameStatus = 'paused';
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
    } else if (this.gameState.gameStatus === 'paused') {
      this.gameState.gameStatus = 'playing';
      this.lastTime = performance.now();
      this.gameLoop();
    }
  }

  // 结束游戏
  endGame(): void {
    this.gameState.gameStatus = 'gameover';
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    
    // 清理事件监听器
    this.cleanup();
  }
  
  // 清理资源
  private cleanup(): void {
    window.removeEventListener('resize', this.handleResize.bind(this));
    window.removeEventListener('orientationchange', this.handleResize.bind(this));
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    document.removeEventListener('keyup', this.handleKeyUp.bind(this));
    
    // 停止背景音乐并播放游戏结束音效
    this.stopBackgroundMusic();
    soundManager.playSound('gameOver', 0.8);
  }

  // 游戏主循环
  gameLoop(): void {
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    if (this.gameState.gameStatus === 'playing') {
      this.update(deltaTime);
      this.render();
      this.animationId = requestAnimationFrame(() => this.gameLoop());
    }
  }

  // 更新游戏逻辑
  private update(deltaTime: number): void {
    this.handleInput();
    this.updateBullets();
    this.updateEnemies();
    this.spawnEnemies();
    this.checkCollisions();
    this.updateStars();
    
    // 检查游戏结束条件
    if (this.player.lives <= 0) {
      this.endGame();
    }
  }

  // 处理用户输入
  private handleInput(): void {
    const currentTime = performance.now();
    
    // 检查键盘或触摸控制
    const isLeftPressed = this.keys.has('ArrowLeft') || this.touchControls.left;
    const isRightPressed = this.keys.has('ArrowRight') || this.touchControls.right;
    const isUpPressed = this.keys.has('ArrowUp') || this.touchControls.up;
    const isDownPressed = this.keys.has('ArrowDown') || this.touchControls.down;
    const isShootPressed = this.keys.has('Space') || this.touchControls.shoot;
    
    // 移动控制
    if (isLeftPressed && this.player.x > 0) {
      this.player.x -= this.player.speed;
    }
    if (isRightPressed && this.player.x < this.config.canvasWidth - this.player.width) {
      this.player.x += this.player.speed;
    }
    if (isUpPressed && this.player.y > 0) {
      this.player.y -= this.player.speed;
    }
    if (isDownPressed && this.player.y < this.config.canvasHeight - this.player.height) {
      this.player.y += this.player.speed;
    }
    
    // 射击控制
    if (isShootPressed && currentTime - this.player.lastShot > 200) {
      this.shootBullet(this.player.x + this.player.width / 2, this.player.y, 'player');
      this.player.lastShot = currentTime;
      // 播放射击音效
      soundManager.playSound('shoot', 0.6);
    }
  }

  // 更新子弹
  private updateBullets(): void {
    this.bullets = this.bullets.filter(bullet => {
      if (bullet.owner === 'player') {
        bullet.y -= bullet.speed;
        return bullet.y > -bullet.height;
      } else {
        bullet.y += bullet.speed;
        return bullet.y < this.config.canvasHeight;
      }
    });
  }

  // 更新敌机
  private updateEnemies(): void {
    this.enemies = this.enemies.filter(enemy => {
      enemy.y += enemy.speed;
      return enemy.y < this.config.canvasHeight + enemy.height;
    });
  }

  // 生成敌机
  private spawnEnemies(): void {
    if (Math.random() < this.config.enemySpawnRate * (1 + this.gameState.level * 0.1)) {
      this.spawnEnemy();
    }
  }

  // 生成单个敌机
  spawnEnemy(): void {
    const types = Object.keys(ENEMY_TYPES) as Array<keyof typeof ENEMY_TYPES>;
    const randomType = types[Math.floor(Math.random() * types.length)];
    const enemyConfig = ENEMY_TYPES[randomType];
    
    const enemy: Enemy = {
      x: Math.random() * (this.config.canvasWidth - enemyConfig.width),
      y: -enemyConfig.height,
      width: enemyConfig.width,
      height: enemyConfig.height,
      active: true,
      type: randomType,
      speed: enemyConfig.speed * (1 + this.gameState.level * 0.1),
      points: enemyConfig.points,
      health: enemyConfig.health
    };
    
    this.enemies.push(enemy);
  }

  // 发射子弹
  shootBullet(x: number, y: number, owner: 'player' | 'enemy'): void {
    if (owner === 'player' && this.bullets.filter(b => b.owner === 'player').length >= this.config.maxBullets) {
      return;
    }
    
    const bullet: Bullet = {
      x: x - 2,
      y: y,
      width: 4,
      height: 10,
      active: true,
      speed: this.config.bulletSpeed,
      damage: 1,
      owner
    };
    
    this.bullets.push(bullet);
  }

  // 碰撞检测
  private checkCollisions(): void {
    // 玩家子弹与敌机碰撞
    this.bullets.forEach((bullet, bulletIndex) => {
      if (bullet.owner === 'player') {
        this.enemies.forEach((enemy, enemyIndex) => {
          if (this.isColliding(bullet, enemy)) {
            enemy.health -= bullet.damage;
            this.bullets.splice(bulletIndex, 1);
            
            if (enemy.health <= 0) {
              this.gameState.score += enemy.points;
              this.enemies.splice(enemyIndex, 1);
              
              // 播放爆炸音效
              soundManager.playSound('explosion', 0.7);
              
              // 升级检查
              const oldLevel = this.gameState.level;
              if (this.gameState.score > this.gameState.level * 1000) {
                this.gameState.level++;
                // 播放升级音效
                if (this.gameState.level > oldLevel) {
                  soundManager.playSound('levelUp', 0.8);
                }
              }
            } else {
              // 敌机被击中但未摧毁
              soundManager.playSound('enemyHit', 0.5);
            }
          }
        });
      }
    });
    
    // 玩家与敌机碰撞
    this.enemies.forEach((enemy, enemyIndex) => {
      if (this.isColliding(this.player, enemy)) {
        this.player.lives--;
        this.enemies.splice(enemyIndex, 1);
        
        // 播放玩家被击中音效
        soundManager.playSound('playerHit', 0.8);
      }
    });
  }

  // 碰撞检测辅助函数
  private isColliding(obj1: GameObject, obj2: GameObject): boolean {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
  }

  // 更新星空
  private updateStars(): void {
    this.stars.forEach(star => {
      star.y += 0.5;
      if (star.y > this.config.canvasHeight) {
        star.y = 0;
        star.x = Math.random() * this.config.canvasWidth;
      }
    });
  }

  // 渲染所有游戏对象
  render(): void {
    // 清空画布
    this.ctx.fillStyle = '#001122';
    this.ctx.fillRect(0, 0, this.config.canvasWidth, this.config.canvasHeight);
    
    // 渲染星空
    this.renderStars();
    
    // 渲染玩家
    this.renderPlayer();
    
    // 渲染敌机
    this.renderEnemies();
    
    // 渲染子弹
    this.renderBullets();
    
    // 渲染UI
    this.renderUI();
  }

  // 渲染星空
  private renderStars(): void {
    this.ctx.fillStyle = '#FFFFFF';
    this.stars.forEach(star => {
      this.ctx.fillRect(star.x, star.y, star.size, star.size);
    });
  }

  // 渲染玩家
  private renderPlayer(): void {
    const x = this.player.x;
    const y = this.player.y;
    
    // 机身主体 - 蓝色
    this.ctx.fillStyle = '#0088FF';
    this.ctx.fillRect(x + 12, y + 8, 16, 32);
    
    // 机头 - 深蓝色
    this.ctx.fillStyle = '#0066CC';
    this.ctx.fillRect(x + 16, y + 4, 8, 8);
    this.ctx.fillRect(x + 18, y, 4, 4);
    
    // 驾驶舱 - 浅蓝色
    this.ctx.fillStyle = '#66CCFF';
    this.ctx.fillRect(x + 16, y + 12, 8, 8);
    
    // 主机翼 - 银色
    this.ctx.fillStyle = '#CCCCCC';
    this.ctx.fillRect(x + 4, y + 20, 32, 8);
    this.ctx.fillRect(x + 8, y + 16, 24, 4);
    
    // 尾翼 - 银色
    this.ctx.fillStyle = '#AAAAAA';
    this.ctx.fillRect(x + 12, y + 36, 16, 4);
    this.ctx.fillRect(x + 16, y + 32, 8, 8);
    
    // 引擎火焰 - 动态效果
    const flameOffset = Math.sin(Date.now() * 0.01) * 2;
    this.ctx.fillStyle = '#FF6600';
    this.ctx.fillRect(x + 14, y + 40, 4, 4 + flameOffset);
    this.ctx.fillRect(x + 22, y + 40, 4, 4 + flameOffset);
    this.ctx.fillStyle = '#FFFF00';
    this.ctx.fillRect(x + 15, y + 41, 2, 2 + flameOffset);
    this.ctx.fillRect(x + 23, y + 41, 2, 2 + flameOffset);
    
    // 武器装备 - 深灰色
    this.ctx.fillStyle = '#666666';
    this.ctx.fillRect(x + 10, y + 24, 4, 8);
    this.ctx.fillRect(x + 26, y + 24, 4, 8);
    
    // 细节装饰 - 白色
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(x + 17, y + 14, 2, 2);
    this.ctx.fillRect(x + 21, y + 14, 2, 2);
  }

  // 渲染敌机
  private renderEnemies(): void {
    this.enemies.forEach(enemy => {
      const x = enemy.x;
      const y = enemy.y;
      
      if (enemy.type === 'small') {
        // 小型敌机 - 红色蜜蜂造型
        this.ctx.fillStyle = '#FF4444';
        this.ctx.fillRect(x + 8, y + 4, 14, 20);
        
        // 机翼
        this.ctx.fillStyle = '#FF6666';
        this.ctx.fillRect(x + 2, y + 8, 26, 6);
        this.ctx.fillRect(x + 4, y + 16, 22, 4);
        
        // 机头
        this.ctx.fillStyle = '#CC2222';
        this.ctx.fillRect(x + 12, y, 6, 8);
        
        // 引擎火焰
         const smallFlame = Math.sin(Date.now() * 0.015) * 1.5;
         this.ctx.fillStyle = '#FF6600';
         this.ctx.fillRect(x + 10, y + 20, 4, 3 + smallFlame);
         this.ctx.fillRect(x + 16, y + 20, 4, 3 + smallFlame);
         this.ctx.fillStyle = '#FFAA00';
         this.ctx.fillRect(x + 11, y + 21, 2, 2 + smallFlame);
         this.ctx.fillRect(x + 17, y + 21, 2, 2 + smallFlame);
        
      } else if (enemy.type === 'medium') {
        // 中型敌机 - 橙色轰炸机造型
        this.ctx.fillStyle = '#FF8844';
        this.ctx.fillRect(x + 10, y + 6, 30, 36);
        
        // 主机翼
        this.ctx.fillStyle = '#FFAA66';
        this.ctx.fillRect(x, y + 20, 50, 12);
        this.ctx.fillRect(x + 5, y + 14, 40, 8);
        
        // 机头
        this.ctx.fillStyle = '#CC5522';
        this.ctx.fillRect(x + 18, y, 14, 12);
        this.ctx.fillRect(x + 22, y - 4, 6, 8);
        
        // 引擎火焰
         const mediumFlame = Math.sin(Date.now() * 0.012) * 2;
         this.ctx.fillStyle = '#FF4400';
         this.ctx.fillRect(x + 8, y + 38, 8, 6 + mediumFlame);
         this.ctx.fillRect(x + 34, y + 38, 8, 6 + mediumFlame);
         this.ctx.fillStyle = '#FF8800';
         this.ctx.fillRect(x + 10, y + 40, 4, 4 + mediumFlame);
         this.ctx.fillRect(x + 36, y + 40, 4, 4 + mediumFlame);
         this.ctx.fillStyle = '#FFCC00';
         this.ctx.fillRect(x + 11, y + 41, 2, 2 + mediumFlame);
         this.ctx.fillRect(x + 37, y + 41, 2, 2 + mediumFlame);
        
        // 武器装备
        this.ctx.fillStyle = '#666666';
        this.ctx.fillRect(x + 20, y + 32, 4, 8);
        this.ctx.fillRect(x + 26, y + 32, 4, 8);
        
      } else if (enemy.type === 'large') {
        // 大型敌机 - 深红色母舰造型
        this.ctx.fillStyle = '#CC0000';
        this.ctx.fillRect(x + 15, y + 10, 50, 60);
        
        // 主体装甲
        this.ctx.fillStyle = '#AA0000';
        this.ctx.fillRect(x + 10, y + 20, 60, 40);
        
        // 巨大机翼
        this.ctx.fillStyle = '#FF3333';
        this.ctx.fillRect(x, y + 30, 80, 20);
        this.ctx.fillRect(x + 5, y + 20, 70, 15);
        
        // 指挥塔
        this.ctx.fillStyle = '#880000';
        this.ctx.fillRect(x + 30, y, 20, 20);
        this.ctx.fillRect(x + 35, y - 5, 10, 10);
        
        // 多个引擎火焰
         const largeFlame = Math.sin(Date.now() * 0.008) * 3;
         this.ctx.fillStyle = '#FF2200';
         this.ctx.fillRect(x + 12, y + 65, 8, 8 + largeFlame);
         this.ctx.fillRect(x + 30, y + 65, 8, 8 + largeFlame);
         this.ctx.fillRect(x + 42, y + 65, 8, 8 + largeFlame);
         this.ctx.fillRect(x + 60, y + 65, 8, 8 + largeFlame);
         
         this.ctx.fillStyle = '#FF6600';
         this.ctx.fillRect(x + 14, y + 67, 4, 6 + largeFlame);
         this.ctx.fillRect(x + 32, y + 67, 4, 6 + largeFlame);
         this.ctx.fillRect(x + 44, y + 67, 4, 6 + largeFlame);
         this.ctx.fillRect(x + 62, y + 67, 4, 6 + largeFlame);
         
         this.ctx.fillStyle = '#FFAA00';
         this.ctx.fillRect(x + 15, y + 68, 2, 4 + largeFlame);
         this.ctx.fillRect(x + 33, y + 68, 2, 4 + largeFlame);
         this.ctx.fillRect(x + 45, y + 68, 2, 4 + largeFlame);
         this.ctx.fillRect(x + 63, y + 68, 2, 4 + largeFlame);
        
        // 重型武器
        this.ctx.fillStyle = '#444444';
        this.ctx.fillRect(x + 20, y + 50, 6, 12);
        this.ctx.fillRect(x + 35, y + 50, 6, 12);
        this.ctx.fillRect(x + 50, y + 50, 6, 12);
        
        // 装甲细节
        this.ctx.fillStyle = '#FFAAAA';
        this.ctx.fillRect(x + 25, y + 25, 4, 4);
        this.ctx.fillRect(x + 45, y + 25, 4, 4);
        this.ctx.fillRect(x + 35, y + 35, 6, 6);
      }
    });
  }

  // 渲染子弹
  private renderBullets(): void {
    this.bullets.forEach(bullet => {
      const x = bullet.x;
      const y = bullet.y;
      
      if (bullet.owner === 'player') {
        // 玩家子弹 - 能量弹造型
        this.ctx.fillStyle = '#FFFF00';
        this.ctx.fillRect(x, y, bullet.width, bullet.height);
        
        // 能量光晕
        this.ctx.fillStyle = '#FFFF88';
        this.ctx.fillRect(x + 1, y + 1, bullet.width - 2, bullet.height - 2);
        
        // 核心光点
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(x + 1, y + 2, 2, bullet.height - 4);
        
      } else {
        // 敌机子弹 - 等离子弹造型
        this.ctx.fillStyle = '#FF0000';
        this.ctx.fillRect(x, y, bullet.width, bullet.height);
        
        // 红色光晕
        this.ctx.fillStyle = '#FF6666';
        this.ctx.fillRect(x + 1, y + 1, bullet.width - 2, bullet.height - 2);
        
        // 暗红核心
        this.ctx.fillStyle = '#AA0000';
        this.ctx.fillRect(x + 1, y + 2, 2, bullet.height - 4);
      }
    });
  }

  // 渲染UI
  private renderUI(): void {
    this.ctx.fillStyle = '#00FF00';
    this.ctx.font = '16px monospace';
    this.ctx.fillText(`得分: ${this.gameState.score}`, 10, 30);
    this.ctx.fillText(`生命: ${this.player.lives}`, 10, 55);
    this.ctx.fillText(`关卡: ${this.gameState.level}`, 10, 80);
  }

  // 获取游戏状态
  getGameState(): GameState {
    return { ...this.gameState };
  }

  // 设置游戏状态
  setGameState(newState: Partial<GameState>): void {
    this.gameState = { ...this.gameState, ...newState };
  }

  // 播放背景音乐
  private playBackgroundMusic(): void {
    this.stopBackgroundMusic();
    this.backgroundMusicSource = soundManager.playSound('bgMusic', 0.3, true);
  }

  // 停止背景音乐
  private stopBackgroundMusic(): void {
    if (this.backgroundMusicSource) {
      soundManager.stopSound(this.backgroundMusicSource);
      this.backgroundMusicSource = null;
    }
  }

  // 切换音效开关
  toggleSound(): boolean {
    const newState = !soundManager.getEnabled();
    soundManager.setEnabled(newState);
    
    if (newState && this.gameState.gameStatus === 'playing') {
      // 重新播放背景音乐
      this.playBackgroundMusic();
    } else if (!newState) {
      // 停止背景音乐
      this.stopBackgroundMusic();
    }
    
    return newState;
  }

  // 获取音效状态
  getSoundEnabled(): boolean {
    return soundManager.getEnabled();
  }

  // 设置音量
  setVolume(volume: number): void {
    soundManager.setMasterVolume(volume);
  }

  // 获取音量
  getVolume(): number {
    return soundManager.getMasterVolume();
  }

  // 触摸控制方法
  setTouchControl(direction: 'up' | 'down' | 'left' | 'right' | 'shoot', pressed: boolean): void {
    // 恢复音频上下文以支持移动端音效
    soundManager.resumeAudioContext();
    this.touchControls[direction] = pressed;
  }

  // 获取是否为移动端
  isMobile(): boolean {
    return this.config.isMobile;
  }
}