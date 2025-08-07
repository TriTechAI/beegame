import React from 'react';
import { soundManager } from '../engine/SoundManager';

interface MobileControlsProps {
  onDirectionPress: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onDirectionRelease: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onShoot: () => void;
  onShootRelease: () => void;
  isVisible: boolean;
  isLandscape?: boolean;
}

const MobileControls: React.FC<MobileControlsProps> = ({
  onDirectionPress,
  onDirectionRelease,
  onShoot,
  onShootRelease,
  isVisible,
  isLandscape = false
}) => {
  if (!isVisible) return null;

  const handleTouchStart = (direction: 'up' | 'down' | 'left' | 'right') => {
    return (e: React.TouchEvent) => {
      e.preventDefault();
      // 恢复音频上下文以支持移动端音效
      soundManager.resumeAudioContext();
      onDirectionPress(direction);
    };
  };

  const handleTouchEnd = (direction: 'up' | 'down' | 'left' | 'right') => {
    return (e: React.TouchEvent) => {
      e.preventDefault();
      // 恢复音频上下文以支持移动端音效
      soundManager.resumeAudioContext();
      onDirectionRelease(direction);
    };
  };

  const handleShootStart = (e: React.TouchEvent) => {
    e.preventDefault();
    // 恢复音频上下文以支持移动端音效
    soundManager.resumeAudioContext();
    onShoot();
  };

  const handleShootEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    // 恢复音频上下文以支持移动端音效
    soundManager.resumeAudioContext();
    onShootRelease();
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* 左侧方向键 */}
      <div className={`absolute pointer-events-auto ${
        isLandscape 
          ? 'bottom-2 left-2' 
          : 'bottom-4 left-4'
      }`}>
        <div className={`relative ${
          isLandscape ? 'w-24 h-24' : 'w-32 h-32'
        }`}>
          {/* 上方向键 */}
          <button
            className={`absolute top-0 left-1/2 transform -translate-x-1/2 ${
              isLandscape ? 'w-8 h-8 text-sm' : 'w-12 h-12 text-xl'
            } bg-gradient-to-br from-blue-500 to-blue-700 text-white font-mono font-bold flex items-center justify-center active:from-blue-600 active:to-blue-800 transition-none select-none`}
            style={{
              touchAction: 'none',
              imageRendering: 'pixelated',
              borderRadius: '6px',
              border: '2px solid #1e40af',
              boxShadow: '0 4px 0 #1e3a8a, 0 6px 8px rgba(0,0,0,0.3)'
            }}
            onTouchStart={handleTouchStart('up')}
            onTouchEnd={handleTouchEnd('up')}
          >
            ↑
          </button>
          
          {/* 左方向键 */}
          <button
            className={`absolute top-1/2 left-0 transform -translate-y-1/2 ${
              isLandscape ? 'w-8 h-8 text-sm' : 'w-12 h-12 text-xl'
            } bg-gradient-to-br from-blue-500 to-blue-700 text-white font-mono font-bold flex items-center justify-center active:from-blue-600 active:to-blue-800 transition-none select-none`}
            style={{
              touchAction: 'none',
              imageRendering: 'pixelated',
              borderRadius: '6px',
              border: '2px solid #1e40af',
              boxShadow: '0 4px 0 #1e3a8a, 0 6px 8px rgba(0,0,0,0.3)'
            }}
            onTouchStart={handleTouchStart('left')}
            onTouchEnd={handleTouchEnd('left')}
          >
            ←
          </button>
          
          {/* 右方向键 */}
          <button
            className={`absolute top-1/2 right-0 transform -translate-y-1/2 ${
              isLandscape ? 'w-8 h-8 text-sm' : 'w-12 h-12 text-xl'
            } bg-gradient-to-br from-blue-500 to-blue-700 text-white font-mono font-bold flex items-center justify-center active:from-blue-600 active:to-blue-800 transition-none select-none`}
            style={{
              touchAction: 'none',
              imageRendering: 'pixelated',
              borderRadius: '6px',
              border: '2px solid #1e40af',
              boxShadow: '0 4px 0 #1e3a8a, 0 6px 8px rgba(0,0,0,0.3)'
            }}
            onTouchStart={handleTouchStart('right')}
            onTouchEnd={handleTouchEnd('right')}
          >
            →
          </button>
          
          {/* 下方向键 */}
          <button
            className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 ${
              isLandscape ? 'w-8 h-8 text-sm' : 'w-12 h-12 text-xl'
            } bg-gradient-to-br from-blue-500 to-blue-700 text-white font-mono font-bold flex items-center justify-center active:from-blue-600 active:to-blue-800 transition-none select-none`}
            style={{
              touchAction: 'none',
              imageRendering: 'pixelated',
              borderRadius: '6px',
              border: '2px solid #1e40af',
              boxShadow: '0 4px 0 #1e3a8a, 0 6px 8px rgba(0,0,0,0.3)'
            }}
            onTouchStart={handleTouchStart('down')}
            onTouchEnd={handleTouchEnd('down')}
          >
            ↓
          </button>
        </div>
      </div>

      {/* 右侧射击按钮 */}
      <div className={`absolute pointer-events-auto ${
        isLandscape 
          ? 'bottom-2 right-2' 
          : 'bottom-4 right-4'
      }`}>
        <button
          className={`${
            isLandscape ? 'w-14 h-14 text-sm' : 'w-20 h-20 text-lg'
          } bg-gradient-to-br from-orange-500 to-red-600 text-white font-mono font-bold flex items-center justify-center active:from-orange-600 active:to-red-700 transition-none select-none`}
          style={{
            touchAction: 'none',
            imageRendering: 'pixelated',
            borderRadius: '50%',
            border: '3px solid #dc2626',
            boxShadow: '0 6px 0 #b91c1c, 0 8px 12px rgba(0,0,0,0.4)'
          }}
          onTouchStart={handleShootStart}
          onTouchEnd={handleShootEnd}
        >
          <div className="text-center">
            <div className={`${isLandscape ? 'text-lg mb-0' : 'text-2xl mb-1'}`}>🔥</div>
            {!isLandscape && <div className="text-xs">射击</div>}
          </div>
        </button>
      </div>

      {/* 移动端操作提示 */}
      {!isLandscape && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 pointer-events-none">
          <div className="bg-black bg-opacity-60 px-4 py-2 rounded-lg">
            <div className="text-green-400 font-mono text-sm text-center">
              <p>左侧：移动飞机</p>
              <p>右侧：射击攻击</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileControls;