import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getHighScore } from '../types/game';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const highScore = getHighScore();

  const handleStartGame = () => {
    navigate('/game');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        {/* 游戏标题 */}
        <div className="mb-12">
          <h1 className="text-6xl font-mono text-yellow-400 mb-4 tracking-wider">
            打蜜蜂
          </h1>
          <h2 className="text-2xl font-mono text-green-400 mb-2">
            BEE SHOOTER
          </h2>
          <p className="text-lg font-mono text-white opacity-80">
            经典红白机风格射击游戏
          </p>
        </div>

        {/* 最高分显示 */}
        <div className="mb-8">
          <div className="inline-block bg-black bg-opacity-50 border-2 border-green-400 px-6 py-3">
            <span className="text-green-400 font-mono text-xl">
              最高分: {highScore.toLocaleString()}
            </span>
          </div>
        </div>

        {/* 开始游戏按钮 */}
        <div className="mb-12">
          <button
            onClick={handleStartGame}
            className="bg-green-600 hover:bg-green-500 text-white font-mono text-2xl py-4 px-12 border-4 border-green-400 transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ imageRendering: 'pixelated' }}
          >
            开始游戏
          </button>
        </div>

        {/* 操作说明 */}
        <div className="bg-black bg-opacity-30 border-2 border-white border-opacity-30 p-6 rounded-lg">
          <h3 className="text-xl font-mono text-yellow-400 mb-4">操作说明</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-green-400 font-mono text-lg">↑↓←→</span>
                <span className="text-white font-mono">移动飞机</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-green-400 font-mono text-lg">空格</span>
                <span className="text-white font-mono">发射子弹</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-green-400 font-mono text-lg">ESC</span>
                <span className="text-white font-mono">暂停游戏</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-yellow-400 font-mono text-lg">目标</span>
                <span className="text-white font-mono">击败所有敌机</span>
              </div>
            </div>
          </div>
        </div>

        {/* 游戏特色 */}
        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-8 text-sm font-mono text-gray-300">
            <span>🎮 经典像素风格</span>
            <span>🚀 多种敌机类型</span>
            <span>⭐ 关卡升级系统</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;