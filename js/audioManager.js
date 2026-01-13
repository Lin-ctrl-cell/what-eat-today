// audioManager.js - 确保暴露到全局
window.AudioManager = (function() {
    let backgroundMusic = null;
    let soundEnabled = true;
    let musicEnabled = true;
    let audioControlsElement = null;

    // 预定义音效路径
    const SOUNDS = {
        CLICK: 'sounds/click.mp3',
        PAGE_TURN: 'sounds/pageTurn.mp3',
        DIALOGUE: 'sounds/dialogue.mp3',
        UNLOCK: 'sounds/unlock.mp3'
    };

    function init() {
        console.log('AudioManager 初始化开始');
        
        try {
            // 初始化背景音乐
            backgroundMusic = new Audio('music/background.mp3');
            backgroundMusic.loop = true;
            backgroundMusic.volume = 0.4; // 40%音量
            backgroundMusic.preload = 'auto';
            
            // 立即尝试播放
            backgroundMusic.play().then(() => {
                console.log('背景音乐自动播放成功');
                musicEnabled = true;
                updateAudioControls();
            }).catch(error => {
                console.log('自动播放被阻止，等待用户交互:', error.message);
                musicEnabled = false;
                updateAudioControls();
                
                // 监听首次用户交互
                const startMusicOnInteraction = () => {
                    if (!musicEnabled && backgroundMusic) {
                        backgroundMusic.play().then(() => {
                            musicEnabled = true;
                            updateAudioControls();
                            console.log('用户交互后音乐开始播放');
                        });
                        
                        // 移除监听器
                        document.removeEventListener('click', startMusicOnInteraction);
                        document.removeEventListener('keydown', startMusicOnInteraction);
                        document.removeEventListener('touchstart', startMusicOnInteraction);
                    }
                };
                
                document.addEventListener('click', startMusicOnInteraction);
                document.addEventListener('keydown', startMusicOnInteraction);
                document.addEventListener('touchstart', startMusicOnInteraction);
            });
            
            console.log('背景音乐加载完成');
        } catch (error) {
            console.warn('背景音乐加载失败:', error);
            backgroundMusic = null;
        }

        // 创建音频控制按钮
        createAudioControls();

        // 页面显示/隐藏时暂停/恢复音乐
        document.addEventListener('visibilitychange', () => {
            if (backgroundMusic) {
                if (document.hidden) {
                    backgroundMusic.pause();
                } else if (musicEnabled && !backgroundMusic.paused) {
                    backgroundMusic.play();
                }
            }
        });
        
        console.log('AudioManager 初始化完成');
    }

    // 创建音频控制按钮
    function createAudioControls() {
        // 如果按钮已存在，先移除
        const existingControls = document.getElementById('global-audio-controls');
        if (existingControls) {
            existingControls.parentNode.removeChild(existingControls);
        }
        
        audioControlsElement = document.createElement('div');
        audioControlsElement.id = 'global-audio-controls';
        audioControlsElement.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        
        // 创建音乐控制按钮
        const musicBtn = document.createElement('button');
        musicBtn.id = 'toggle-music-btn';
        musicBtn.style.cssText = `
            background: ${musicEnabled ? 'rgba(74, 157, 242, 0.9)' : 'rgba(255, 107, 107, 0.9)'};
            color: white;
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            cursor: pointer;
            font-size: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
        `;
        musicBtn.innerHTML = musicEnabled ? '🎵' : '🔇';
        musicBtn.title = musicEnabled ? '关闭音乐' : '开启音乐';
        
        // 悬停效果
        musicBtn.addEventListener('mouseenter', () => {
            musicBtn.style.transform = 'scale(1.1)';
        });
        musicBtn.addEventListener('mouseleave', () => {
            musicBtn.style.transform = 'scale(1)';
        });
        
        // 点击事件
        musicBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMusic(!musicEnabled);
            // 播放点击音效
            playSound(SOUNDS.CLICK);
        });
        
        audioControlsElement.appendChild(musicBtn);
        document.body.appendChild(audioControlsElement);
        
        console.log('音频控制按钮创建完成');
    }

    // 更新音频控制按钮
    function updateAudioControls() {
        const musicBtn = document.getElementById('toggle-music-btn');
        if (musicBtn) {
            musicBtn.innerHTML = musicEnabled ? '🎵' : '🔇';
            musicBtn.title = musicEnabled ? '关闭音乐' : '开启音乐';
            musicBtn.style.background = musicEnabled ? 'rgba(74, 157, 242, 0.9)' : 'rgba(255, 107, 107, 0.9)';
        }
    }

    // 播放音效
    function playSound(soundKey) {
        if (!soundEnabled) return;
        
        try {
            const soundPath = SOUNDS[soundKey];
            if (!soundPath) {
                console.warn('未知音效键:', soundKey);
                return;
            }
            
            const sound = new Audio(soundPath);
            sound.volume = 0.6;
            sound.play().catch(error => {
                console.warn('音效播放失败:', error);
            });
        } catch (error) {
            console.warn('音效加载失败:', error);
        }
    }

    // 切换音乐开关
    function toggleMusic(enable) {
        musicEnabled = enable;
        if (backgroundMusic) {
            if (enable) {
                backgroundMusic.play().catch(error => {
                    console.warn('音乐播放失败:', error);
                });
            } else {
                backgroundMusic.pause();
            }
        }
        updateAudioControls();
    }

    // 切换音效开关
    function toggleSound(enable) {
        soundEnabled = enable;
    }

    // 设置背景音乐音量
    function setMusicVolume(volume) {
        if (backgroundMusic) {
            backgroundMusic.volume = Math.max(0, Math.min(1, volume));
        }
    }

    // 公开接口
    return { 
        init, 
        playSound, 
        toggleMusic, 
        toggleSound,
        setMusicVolume,
        SOUNDS 
    };
})();
