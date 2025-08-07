import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getHighScore, saveHighScore } from '../types/game';

interface GameOverState {
  score: number;
  highScore: number;
}

const GameOver: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [gameData, setGameData] = useState<GameOverState>({
    score: 0,
    highScore: getHighScore()
  });
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    window.addEventListener('orientationchange', checkDevice);
    
    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkDevice);
    };
  }, []);

  useEffect(() => {
    // 从路由状态获取游戏数据
    const state = location.state as GameOverState | null;
    if (state) {
      const currentHighScore = getHighScore();
      const finalScore = state.score;
      const isRecord = finalScore > currentHighScore;
      
      if (isRecord) {
        saveHighScore(finalScore);
        setIsNewRecord(true);
        setShowCelebration(true);
        // 3秒后隐藏庆祝动画
        setTimeout(() => setShowCelebration(false), 3000);
      }
      
      setGameData({
        score: finalScore,
        highScore: Math.max(finalScore, currentHighScore)
      });
    }
  }, [location.state]);

  const handlePlayAgain = () => {
    navigate('/game');
  };

  const handleBackToMenu = () => {
    navigate('/');
  };

  const getScoreRating = (score: number): string => {
    if (score >= 10000) return '传奇飞行员！';
    if (score >= 5000) return '王牌飞行员！';
    if (score >= 2000) return '优秀飞行员！';
    if (score >= 1000) return '合格飞行员';
    if (score >= 500) return '新手飞行员';
    return '继续努力！';
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-red-900 via-red-800 to-black flex items-center justify-center ${isMobile ? 'p-2' : 'p-4'}`}>
      {/* 新纪录庆祝动画 */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="text-center animate-pulse">
            <div className={`font-mono text-yellow-400 mb-4 animate-bounce ${
              isMobile ? 'text-5xl' : 'text-8xl'
            }`}>
              🎉
            </div>
            <h2 className={`font-mono text-yellow-400 animate-pulse ${
              isMobile ? 'text-2xl' : 'text-4xl'
            }`}>
              新纪录！
            </h2>
          </div>
        </div>
      )}

      <div className={`text-center w-full ${
        isMobile ? 'max-w-sm px-2' : 'max-w-2xl'
      }`}>
        {/* 游戏结束标题 */}
        <div className={`${isMobile ? 'mb-6' : 'mb-8'}`}>
          <h1 className={`font-mono text-red-400 mb-4 tracking-wider ${
            isMobile ? 'text-3xl' : 'text-6xl'
          }`}>
            游戏结束
          </h1>
          <h2 className={`font-mono text-white opacity-80 ${
            isMobile ? 'text-lg' : 'text-2xl'
          }`}>
            GAME OVER
          </h2>
        </div>

        {/* 得分显示区域 */}
        <div className={`bg-black bg-opacity-50 border-4 border-red-400 mb-8 ${
          isMobile ? 'p-4' : 'p-8'
        }`}>
          {/* 最终得分 */}
          <div className={`${isMobile ? 'mb-4' : 'mb-6'}`}>
            <h3 className={`font-mono text-yellow-400 mb-2 ${
              isMobile ? 'text-lg' : 'text-2xl'
            }`}>最终得分</h3>
            <div className={`font-mono text-white mb-2 ${
              isMobile ? 'text-3xl' : 'text-5xl'
            }`}>
              {gameData.score.toLocaleString()}
            </div>
            <div className={`font-mono text-green-400 ${
              isMobile ? 'text-base' : 'text-lg'
            }`}>
              {getScoreRating(gameData.score)}
            </div>
          </div>

          {/* 最高分记录 */}
          <div className={`border-t-2 border-gray-600 ${
            isMobile ? 'pt-4' : 'pt-6'
          }`}>
            <h3 className={`font-mono text-yellow-400 mb-2 ${
              isMobile ? 'text-base' : 'text-xl'
            }`}>
              {isNewRecord ? '新的最高分！' : '历史最高分'}
            </h3>
            <div className={`font-mono ${
              isNewRecord ? 'text-yellow-400 animate-pulse' : 'text-green-400'
            } ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
              {gameData.highScore.toLocaleString()}
            </div>
            {isNewRecord && (
              <div className={`font-mono text-yellow-300 mt-2 ${
                isMobile ? 'text-xs' : 'text-sm'
              }`}>
                恭喜你创造了新纪录！
              </div>
            )}
          </div>
        </div>

        {/* 统计信息 */}
        <div className={`grid gap-4 mb-8 ${
          isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'
        }`}>
          <div className={`bg-black bg-opacity-30 border-2 border-blue-400 ${
            isMobile ? 'p-3' : 'p-4'
          }`}>
            <div className={`text-blue-400 font-mono ${
              isMobile ? 'text-base' : 'text-lg'
            }`}>击败敌机</div>
            <div className={`text-white font-mono ${
              isMobile ? 'text-xl' : 'text-2xl'
            }`}>
              {Math.floor(gameData.score / 100)}
            </div>
          </div>
          <div className={`bg-black bg-opacity-30 border-2 border-green-400 ${
            isMobile ? 'p-3' : 'p-4'
          }`}>
            <div className={`text-green-400 font-mono ${
              isMobile ? 'text-base' : 'text-lg'
            }`}>达到关卡</div>
            <div className={`text-white font-mono ${
              isMobile ? 'text-xl' : 'text-2xl'
            }`}>
              {Math.floor(gameData.score / 1000) + 1}
            </div>
          </div>
          <div className={`bg-black bg-opacity-30 border-2 border-purple-400 ${
            isMobile ? 'p-3' : 'p-4'
          }`}>
            <div className={`text-purple-400 font-mono ${
              isMobile ? 'text-base' : 'text-lg'
            }`}>游戏时长</div>
            <div className={`text-white font-mono ${
              isMobile ? 'text-xl' : 'text-2xl'
            }`}>
              {Math.floor(gameData.score / 50)}s
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className={`${isMobile ? 'space-y-3' : 'space-y-4'}`}>
          <button
            onClick={handlePlayAgain}
            className={`w-full md:w-auto bg-green-600 hover:bg-green-500 text-white font-mono border-4 border-green-400 transition-all duration-200 hover:scale-105 active:scale-95 mr-0 md:mr-4 mb-4 md:mb-0 ${
              isMobile ? 'text-lg py-3 px-6' : 'text-xl py-4 px-8'
            }`}
            style={{ imageRendering: 'pixelated' }}
          >
            再来一局
          </button>
          <button
            onClick={handleBackToMenu}
            className={`w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white font-mono border-4 border-blue-400 transition-all duration-200 hover:scale-105 active:scale-95 ${
              isMobile ? 'text-lg py-3 px-6' : 'text-xl py-4 px-8'
            }`}
            style={{ imageRendering: 'pixelated' }}
          >
            返回主菜单
          </button>
        </div>

        {/* 鼓励文字 */}
        <div className={`text-center ${
          isMobile ? 'mt-6' : 'mt-8'
        }`}>
          <div className={`text-gray-400 font-mono ${
            isMobile ? 'text-xs' : 'text-sm'
          }`}>
            {gameData.score < 1000 
              ? "多练习，你会变得更强！" 
              : gameData.score < 5000 
              ? "表现不错，继续加油！" 
              : "你是真正的飞行高手！"
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameOver;