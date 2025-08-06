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
    <div className="min-h-screen bg-gradient-to-b from-red-900 via-red-800 to-black flex items-center justify-center p-4">
      {/* 新纪录庆祝动画 */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="text-center animate-pulse">
            <div className="text-8xl font-mono text-yellow-400 mb-4 animate-bounce">
              🎉
            </div>
            <h2 className="text-4xl font-mono text-yellow-400 animate-pulse">
              新纪录！
            </h2>
          </div>
        </div>
      )}

      <div className="text-center max-w-2xl w-full">
        {/* 游戏结束标题 */}
        <div className="mb-8">
          <h1 className="text-6xl font-mono text-red-400 mb-4 tracking-wider">
            游戏结束
          </h1>
          <h2 className="text-2xl font-mono text-white opacity-80">
            GAME OVER
          </h2>
        </div>

        {/* 得分显示区域 */}
        <div className="bg-black bg-opacity-50 border-4 border-red-400 p-8 mb-8">
          {/* 最终得分 */}
          <div className="mb-6">
            <h3 className="text-2xl font-mono text-yellow-400 mb-2">最终得分</h3>
            <div className="text-5xl font-mono text-white mb-2">
              {gameData.score.toLocaleString()}
            </div>
            <div className="text-lg font-mono text-green-400">
              {getScoreRating(gameData.score)}
            </div>
          </div>

          {/* 最高分记录 */}
          <div className="border-t-2 border-gray-600 pt-6">
            <h3 className="text-xl font-mono text-yellow-400 mb-2">
              {isNewRecord ? '新的最高分！' : '历史最高分'}
            </h3>
            <div className={`text-3xl font-mono ${
              isNewRecord ? 'text-yellow-400 animate-pulse' : 'text-green-400'
            }`}>
              {gameData.highScore.toLocaleString()}
            </div>
            {isNewRecord && (
              <div className="text-sm font-mono text-yellow-300 mt-2">
                恭喜你创造了新纪录！
              </div>
            )}
          </div>
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-black bg-opacity-30 border-2 border-blue-400 p-4">
            <div className="text-blue-400 font-mono text-lg">击败敌机</div>
            <div className="text-white font-mono text-2xl">
              {Math.floor(gameData.score / 100)}
            </div>
          </div>
          <div className="bg-black bg-opacity-30 border-2 border-green-400 p-4">
            <div className="text-green-400 font-mono text-lg">达到关卡</div>
            <div className="text-white font-mono text-2xl">
              {Math.floor(gameData.score / 1000) + 1}
            </div>
          </div>
          <div className="bg-black bg-opacity-30 border-2 border-purple-400 p-4">
            <div className="text-purple-400 font-mono text-lg">游戏时长</div>
            <div className="text-white font-mono text-2xl">
              {Math.floor(gameData.score / 50)}s
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="space-y-4">
          <button
            onClick={handlePlayAgain}
            className="w-full md:w-auto bg-green-600 hover:bg-green-500 text-white font-mono text-xl py-4 px-8 border-4 border-green-400 transition-all duration-200 hover:scale-105 active:scale-95 mr-0 md:mr-4 mb-4 md:mb-0"
            style={{ imageRendering: 'pixelated' }}
          >
            再来一局
          </button>
          <button
            onClick={handleBackToMenu}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white font-mono text-xl py-4 px-8 border-4 border-blue-400 transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ imageRendering: 'pixelated' }}
          >
            返回主菜单
          </button>
        </div>

        {/* 鼓励文字 */}
        <div className="mt-8 text-center">
          <div className="text-gray-400 font-mono text-sm">
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