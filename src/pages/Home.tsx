import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHighScore } from '../types/game';
import { soundManager } from '../engine/SoundManager';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const highScore = getHighScore();
  const [isMobile, setIsMobile] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth <= 768;
      const landscape = window.innerWidth > window.innerHeight;
      setIsMobile(mobile);
      setIsLandscape(landscape);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    window.addEventListener('orientationchange', checkDevice);
    
    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkDevice);
    };
  }, []);

  const handleStartGame = () => {
    // 恢复音频上下文以支持移动端音效
    soundManager.resumeAudioContext();
    navigate('/game');
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center ${isMobile ? 'p-2' : 'p-4'}`}>
      <div className={`text-center ${isMobile ? 'max-w-sm px-2' : 'max-w-2xl'}`}>
        {/* 游戏标题 */}
        <div className={`${isMobile ? 'mb-8' : 'mb-12'}`}>
          <h1 className={`font-mono text-yellow-400 mb-4 tracking-wider ${
            isMobile ? 'text-3xl' : 'text-6xl'
          }`}>
            打蜜蜂
          </h1>
          <h2 className={`font-mono text-green-400 mb-2 ${
            isMobile ? 'text-lg' : 'text-2xl'
          }`}>
            BEE SHOOTER
          </h2>
          <p className={`font-mono text-white opacity-80 ${
            isMobile ? 'text-sm' : 'text-lg'
          }`}>
            经典红白机风格射击游戏
          </p>
        </div>

        {/* 最高分显示 */}
        <div className={`${isMobile ? 'mb-6' : 'mb-8'}`}>
          <div className={`inline-block bg-black bg-opacity-50 border-2 border-green-400 ${
            isMobile ? 'px-4 py-2' : 'px-6 py-3'
          }`}>
            <span className={`text-green-400 font-mono ${
              isMobile ? 'text-base' : 'text-xl'
            }`}>
              最高分: {highScore.toLocaleString()}
            </span>
          </div>
        </div>

        {/* 开始游戏按钮 */}
        <div className={`${isMobile ? 'mb-8' : 'mb-12'}`}>
          <button
            onClick={handleStartGame}
            className={`bg-green-600 hover:bg-green-500 text-white font-mono border-4 border-green-400 transition-all duration-200 hover:scale-105 active:scale-95 ${
              isMobile ? 'text-lg py-3 px-8' : 'text-2xl py-4 px-12'
            }`}
            style={{ imageRendering: 'pixelated' }}
          >
            开始游戏
          </button>
        </div>

        {/* 操作说明 */}
        <div className={`bg-black bg-opacity-30 border-2 border-white border-opacity-30 rounded-lg ${
          isMobile ? 'p-4' : 'p-6'
        }`}>
          <h3 className={`font-mono text-yellow-400 mb-4 ${
            isMobile ? 'text-lg' : 'text-xl'
          }`}>操作说明</h3>
          <div className={`grid gap-4 text-left ${
            isMobile ? 'grid-cols-1 space-y-2' : 'grid-cols-1 md:grid-cols-2'
          }`}>
            <div className="space-y-2">
              <div className={`flex items-center ${
                isMobile ? 'space-x-2' : 'space-x-3'
              }`}>
                <span className={`text-green-400 font-mono ${
                  isMobile ? 'text-base' : 'text-lg'
                }`}>↑↓←→</span>
                <span className={`text-white font-mono ${
                  isMobile ? 'text-sm' : 'text-base'
                }`}>移动飞机</span>
              </div>
              <div className={`flex items-center ${
                isMobile ? 'space-x-2' : 'space-x-3'
              }`}>
                <span className={`text-green-400 font-mono ${
                  isMobile ? 'text-base' : 'text-lg'
                }`}>{isMobile ? '触摸' : '空格'}</span>
                <span className={`text-white font-mono ${
                  isMobile ? 'text-sm' : 'text-base'
                }`}>发射子弹</span>
              </div>
            </div>
            {!isMobile && (
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
            )}
            {isMobile && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-400 font-mono text-base">目标</span>
                  <span className="text-white font-mono text-sm">击败所有敌机</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 游戏特色 */}
        <div className={`text-center ${
          isMobile ? 'mt-6' : 'mt-8'
        }`}>
          <div className={`flex justify-center font-mono text-gray-300 ${
            isMobile ? 'flex-col space-y-2 text-xs' : 'space-x-8 text-sm'
          }`}>
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