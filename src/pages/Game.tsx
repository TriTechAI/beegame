import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameEngine } from '../engine/GameEngine';
import { GameState, getHighScore, saveHighScore } from '../types/game';

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
  const navigate = useNavigate();

  useEffect(() => {
    if (canvasRef.current) {
      // 初始化游戏引擎
      gameEngineRef.current = new GameEngine();
      gameEngineRef.current.init(canvasRef.current);
      gameEngineRef.current.startGame();

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
        if (gameEngineRef.current) {
          gameEngineRef.current.endGame();
        }
      };
    }
  }, [navigate]);

  const handlePause = () => {
    if (gameEngineRef.current) {
      gameEngineRef.current.pauseGame();
    }
  };

  const handleResume = () => {
    if (gameEngineRef.current) {
      gameEngineRef.current.pauseGame(); // 切换暂停状态
    }
  };

  const handleQuit = () => {
    if (gameEngineRef.current) {
      gameEngineRef.current.endGame();
    }
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      {/* 游戏状态栏 */}
      <div className="mb-4 flex justify-between items-center w-full max-w-4xl">
        <div className="flex space-x-6 text-green-400 font-mono text-lg">
          <span>得分: {gameState.score}</span>
          <span>生命: {gameState.lives}</span>
          <span>关卡: {gameState.level}</span>
          <span>最高分: {gameState.highScore}</span>
        </div>
        <div className="flex space-x-2">
          {gameState.gameStatus === 'playing' && (
            <button
              onClick={handlePause}
              className="px-4 py-2 bg-yellow-600 text-white font-mono text-sm border-2 border-yellow-400 hover:bg-yellow-500 transition-colors"
            >
              暂停 (ESC)
            </button>
          )}
          <button
            onClick={handleQuit}
            className="px-4 py-2 bg-red-600 text-white font-mono text-sm border-2 border-red-400 hover:bg-red-500 transition-colors"
          >
            退出
          </button>
        </div>
      </div>

      {/* 游戏画布 */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="border-4 border-green-400 bg-blue-900"
          style={{ imageRendering: 'pixelated' }}
        />
        
        {/* 暂停覆盖层 */}
        {gameState.gameStatus === 'paused' && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center">
            <div className="text-center">
              <h2 className="text-4xl font-mono text-yellow-400 mb-6">游戏暂停</h2>
              <div className="space-y-4">
                <button
                  onClick={handleResume}
                  className="block w-48 py-3 bg-green-600 text-white font-mono text-lg border-2 border-green-400 hover:bg-green-500 transition-colors"
                >
                  继续游戏
                </button>
                <button
                  onClick={handleQuit}
                  className="block w-48 py-3 bg-red-600 text-white font-mono text-lg border-2 border-red-400 hover:bg-red-500 transition-colors"
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
            <div className="text-center">
              <h2 className="text-4xl font-mono text-red-400 mb-4">游戏结束</h2>
              <p className="text-xl font-mono text-white mb-2">最终得分: {gameState.score}</p>
              <p className="text-lg font-mono text-yellow-400">正在跳转...</p>
            </div>
          </div>
        )}
      </div>

      {/* 操作说明 */}
      <div className="mt-6 text-center">
        <div className="text-green-400 font-mono text-sm space-y-1">
          <p>方向键: 移动飞机</p>
          <p>空格键: 射击</p>
          <p>ESC键: 暂停游戏</p>
        </div>
      </div>
    </div>
  );
};

export default Game;