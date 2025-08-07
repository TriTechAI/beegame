import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameEngine } from '../engine/GameEngine';
import { GameState, getHighScore, saveHighScore } from '../types/game';
import MobileControls from '../components/MobileControls';
import { soundManager } from '../engine/SoundManager';

const Game: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    level: 1,
    lives: 3,
    gameStatus: 'playing',
    highScore: getHighScore()
  });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [isMobile, setIsMobile] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [touchStartPos, setTouchStartPos] = useState<{x: number, y: number} | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (canvasRef.current) {
      // 初始化游戏引擎
      gameEngineRef.current = new GameEngine();
      gameEngineRef.current.init(canvasRef.current);
      gameEngineRef.current.startGame();

      // 检查是否为移动端
      setIsMobile(gameEngineRef.current.isMobile());
      
      // 检测屏幕方向
      const checkOrientation = () => {
        setIsLandscape(window.innerWidth > window.innerHeight);
      };
      
      checkOrientation();
      window.addEventListener('orientationchange', checkOrientation);
      window.addEventListener('resize', checkOrientation);
      
      // 游戏状态更新循环
      const updateInterval = setInterval(() => {
        if (gameEngineRef.current) {
          const currentState = gameEngineRef.current.getGameState();
          setGameState(currentState);
          
          // 检查游戏结束
          if (currentState.gameStatus === 'gameover') {
            // 保存最高分
            if (currentState.score > currentState.highScore) {
              saveHighScore(currentState.score);
            }
            // 延迟跳转到游戏结束页面
            setTimeout(() => {
              navigate('/gameover', { 
                state: { 
                  score: currentState.score, 
                  highScore: Math.max(currentState.score, currentState.highScore) 
                } 
              });
            }, 2000);
          }
        }
      }, 100);

      return () => {
        clearInterval(updateInterval);
        window.removeEventListener('orientationchange', checkOrientation);
        window.removeEventListener('resize', checkOrientation);
        if (gameEngineRef.current) {
          gameEngineRef.current.endGame();
        }
      };
    }
  }, [navigate]);

  const handlePause = () => {
    // 恢复音频上下文以支持移动端音效
    soundManager.resumeAudioContext();
    if (gameEngineRef.current) {
      gameEngineRef.current.pauseGame();
    }
  };

  const handleResume = () => {
    // 恢复音频上下文以支持移动端音效
    soundManager.resumeAudioContext();
    if (gameEngineRef.current) {
      gameEngineRef.current.pauseGame(); // 切换暂停状态
    }
  };

  const handleQuit = () => {
    // 恢复音频上下文以支持移动端音效
    soundManager.resumeAudioContext();
    if (gameEngineRef.current) {
      gameEngineRef.current.endGame();
    }
    navigate('/');
  };

  const handleToggleSound = () => {
    // 恢复音频上下文以支持移动端音效
    soundManager.resumeAudioContext();
    if (gameEngineRef.current) {
      const newState = gameEngineRef.current.toggleSound();
      setSoundEnabled(newState);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    // 恢复音频上下文以支持移动端音效
    soundManager.resumeAudioContext();
    if (gameEngineRef.current) {
      gameEngineRef.current.setVolume(newVolume);
      setVolume(newVolume);
    }
  };
  
  // 触摸控制事件处理
  const handleDirectionPress = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameEngineRef.current) {
      gameEngineRef.current.setTouchControl(direction, true);
    }
  };
  
  const handleDirectionRelease = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameEngineRef.current) {
      gameEngineRef.current.setTouchControl(direction, false);
    }
  };
  
  const handleShoot = () => {
    if (gameEngineRef.current) {
      gameEngineRef.current.setTouchControl('shoot', true);
    }
  };
  
  const handleShootRelease = () => {
    if (gameEngineRef.current) {
      gameEngineRef.current.setTouchControl('shoot', false);
    }
  };

  // 触摸手势处理
  const handleCanvasTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    // 恢复音频上下文以支持移动端音效
    soundManager.resumeAudioContext();
    const touch = e.touches[0];
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    setTouchStartPos({ x, y });
  };

  const handleCanvasTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    // 恢复音频上下文以支持移动端音效
    soundManager.resumeAudioContext();
    if (!touchStartPos || !gameEngineRef.current) return;
    
    const touch = e.touches[0];
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    const deltaX = x - touchStartPos.x;
    const deltaY = y - touchStartPos.y;
    const threshold = 10; // 最小滑动距离
    
    // 重置所有方向
    gameEngineRef.current.setTouchControl('left', false);
    gameEngineRef.current.setTouchControl('right', false);
    gameEngineRef.current.setTouchControl('up', false);
    gameEngineRef.current.setTouchControl('down', false);
    
    // 根据滑动方向设置移动
    if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // 水平移动
        if (deltaX > 0) {
          gameEngineRef.current.setTouchControl('right', true);
        } else {
          gameEngineRef.current.setTouchControl('left', true);
        }
      } else {
        // 垂直移动
        if (deltaY > 0) {
          gameEngineRef.current.setTouchControl('down', true);
        } else {
          gameEngineRef.current.setTouchControl('up', true);
        }
      }
    }
  };

  const handleCanvasTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    // 恢复音频上下文以支持移动端音效
    soundManager.resumeAudioContext();
    if (!touchStartPos || !gameEngineRef.current) return;
    
    const touch = e.changedTouches[0];
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    const deltaX = Math.abs(x - touchStartPos.x);
    const deltaY = Math.abs(y - touchStartPos.y);
    const tapThreshold = 10; // 点击阈值
    
    // 如果是轻点（没有明显滑动），则射击
    if (deltaX < tapThreshold && deltaY < tapThreshold) {
      gameEngineRef.current.setTouchControl('shoot', true);
      setTimeout(() => {
        if (gameEngineRef.current) {
          gameEngineRef.current.setTouchControl('shoot', false);
        }
      }, 100);
    }
    
    // 重置所有移动状态
    gameEngineRef.current.setTouchControl('left', false);
    gameEngineRef.current.setTouchControl('right', false);
    gameEngineRef.current.setTouchControl('up', false);
    gameEngineRef.current.setTouchControl('down', false);
    
    setTouchStartPos(null);
  };

  return (
    <div className={`min-h-screen bg-gray-900 flex ${isMobile && isLandscape ? 'flex-row' : 'flex-col'} items-center justify-center ${isMobile && isLandscape ? 'p-2' : 'p-4'} relative`}>
      {/* 移动端触摸控制 */}
      <MobileControls
        onDirectionPress={handleDirectionPress}
        onDirectionRelease={handleDirectionRelease}
        onShoot={handleShoot}
        onShootRelease={handleShootRelease}
        isVisible={isMobile && gameState.gameStatus === 'playing'}
        isLandscape={isLandscape}
      />
      
      {/* 游戏状态栏 */}
      <div className={`${isMobile && isLandscape ? 'mb-2' : 'mb-4'} flex justify-between items-center w-full max-w-4xl ${isMobile ? 'text-sm' : ''}`}>
        <div className={`flex ${isMobile ? 'space-x-2 text-xs' : 'space-x-6 text-lg'} text-green-400 font-mono`}>
          <span>得分: {gameState.score}</span>
          <span>生命: {gameState.lives}</span>
          <span>关卡: {gameState.level}</span>
          {!isMobile && <span>最高分: {gameState.highScore}</span>}
        </div>
        <div className={`flex ${isMobile ? 'space-x-1' : 'space-x-2'} items-center`}>
          {/* 音效控制 */}
          <div className={`flex items-center ${isMobile ? 'space-x-1' : 'space-x-2'}`}>
            <button
              onClick={handleToggleSound}
              className={`${isMobile ? 'px-2 py-1 text-xs' : 'px-3 py-2 text-sm'} font-mono border-2 transition-colors ${
                soundEnabled 
                  ? 'bg-green-600 text-white border-green-400 hover:bg-green-500'
                  : 'bg-gray-600 text-gray-300 border-gray-400 hover:bg-gray-500'
              }`}
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>
            
            {/* 音量控制 - 桌面端显示 */}
            {!isMobile && (
              <div className="flex items-center space-x-1">
                <span className="text-green-400 font-mono text-xs">音量:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-16 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #10b981 0%, #10b981 ${volume * 100}%, #374151 ${volume * 100}%, #374151 100%)`
                  }}
                />
                <span className="text-green-400 font-mono text-xs w-8">{Math.round(volume * 100)}%</span>
              </div>
            )}
          </div>
          
          {gameState.gameStatus === 'playing' && (
            <button
              onClick={handlePause}
              className={`${isMobile ? 'px-2 py-1 text-xs' : 'px-4 py-2 text-sm'} bg-yellow-600 text-white font-mono border-2 border-yellow-400 hover:bg-yellow-500 transition-colors`}
            >
              {isMobile ? '暂停' : '暂停 (ESC)'}
            </button>
          )}
          <button
            onClick={handleQuit}
            className={`${isMobile ? 'px-2 py-1 text-xs' : 'px-4 py-2 text-sm'} bg-red-600 text-white font-mono border-2 border-red-400 hover:bg-red-500 transition-colors`}
          >
            退出
          </button>
        </div>
      </div>

      {/* 游戏画布 */}
      <div className={`relative ${isMobile && isLandscape ? 'flex-1' : ''}`}>
        <canvas
          ref={canvasRef}
          className={`border-4 border-green-400 bg-blue-900 ${
            isMobile ? 'max-w-full max-h-full' : ''
          }`}
          style={{ 
            imageRendering: 'pixelated',
            touchAction: 'none',
            ...(isMobile && {
              width: '100%',
              height: 'auto',
              maxWidth: isLandscape ? '70vw' : '90vw',
              maxHeight: isLandscape ? '80vh' : '60vh'
            })
          }}
          onTouchStart={isMobile ? handleCanvasTouchStart : undefined}
          onTouchMove={isMobile ? handleCanvasTouchMove : undefined}
          onTouchEnd={isMobile ? handleCanvasTouchEnd : undefined}
        />
        
        {/* 暂停覆盖层 */}
        {gameState.gameStatus === 'paused' && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center">
            <div className="text-center px-4">
              <h2 className={`font-mono text-yellow-400 mb-6 ${
                isMobile ? 'text-2xl' : 'text-4xl'
              }`}>游戏暂停</h2>
              <div className={`space-y-${isMobile ? '3' : '4'}`}>
                <button
                  onClick={handleResume}
                  className={`block ${isMobile ? 'w-40 py-2 text-base' : 'w-48 py-3 text-lg'} bg-green-600 text-white font-mono border-2 border-green-400 hover:bg-green-500 transition-colors`}
                >
                  继续游戏
                </button>
                <button
                  onClick={handleToggleSound}
                  className={`block ${isMobile ? 'w-40 py-2 text-base' : 'w-48 py-3 text-lg'} font-mono border-2 transition-colors mb-2 ${
                    soundEnabled 
                      ? 'bg-green-600 text-white border-green-400 hover:bg-green-500'
                      : 'bg-gray-600 text-gray-300 border-gray-400 hover:bg-gray-500'
                  }`}
                >
                  {soundEnabled ? '🔊 关闭音效' : '🔇 开启音效'}
                </button>
                <button
                  onClick={handleQuit}
                  className={`block ${isMobile ? 'w-40 py-2 text-base' : 'w-48 py-3 text-lg'} bg-red-600 text-white font-mono border-2 border-red-400 hover:bg-red-500 transition-colors`}
                >
                  退出游戏
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* 游戏结束覆盖层 */}
        {gameState.gameStatus === 'gameover' && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
            <div className="text-center px-4">
              <h2 className={`font-mono text-red-400 mb-4 ${
                isMobile ? 'text-2xl' : 'text-4xl'
              }`}>游戏结束</h2>
              <p className={`font-mono text-white mb-2 ${
                isMobile ? 'text-lg' : 'text-xl'
              }`}>最终得分: {gameState.score}</p>
              <p className={`font-mono text-yellow-400 ${
                isMobile ? 'text-base' : 'text-lg'
              }`}>正在跳转...</p>
            </div>
          </div>
        )}
      </div>

      {/* 操作说明 - 仅桌面端显示 */}
      {!isMobile && (
        <div className="mt-6 text-center">
          <div className="text-green-400 font-mono text-sm space-y-1">
            <p>方向键: 移动飞机</p>
            <p>空格键: 射击</p>
            <p>ESC键: 暂停游戏</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;