// dialogueSystem_new.js - 单对话框替换系统（支持所有角色半身像）
const DialogueSystem = (function() {
    let currentIndex = 0;
    let script = [];
    let isAnimating = false;

    // 角色名映射
    const nameMap = {
        'lgg': '龙哥哥今天又鸽了',
        'rabbit': '血狼破军',
        'writer': '作者',
        'reader': '我',
        'mygs': '绵阳怪兽',
        'ks': '剑圣kensei',
        'wys': '维云斯',
        'mlh': '逗比寒MillerRHan',
        'zc': '魔法Zc目录',
        'sungan': '绝命笋干'
    };

    // 角色颜色映射 (用于对话框左边框)
    const colorMap = {
        'writer': '#9b59b6',
        'reader': '#2ecc71',
        'rabbit': '#e74c3c',
        'lgg': '#3498db',
        'mygs': '#f39c12',
        'ks': '#1abc9c',
        'wys': '#e67e22',
        'mlh': '#16a085',
        'zc': '#8e44ad',
        'sungan': '#27ae60'
    };

    function init(selector, storyScript) {
        console.log('DialogueSystem.init 初始化');
        script = storyScript;
        currentIndex = 0;
        isAnimating = false;
        
        // 获取容器
        const container = document.querySelector(selector);
        if (!container) {
            console.error('容器未找到:', selector);
            return;
        }
        
        // 设置容器样式
        container.style.cursor = 'pointer';
        
        // 移除旧的点击事件，避免重复绑定
        container.removeEventListener('click', nextStep);
        container.addEventListener('click', nextStep);
        
        // 开始第一句
        setTimeout(nextStep, 100);
    }

    function nextStep() {
        if (isAnimating) {
            console.log('正在动画中，跳过点击');
            return;
        }
        
        if (currentIndex >= script.length) {
            console.log('剧本已结束，显示免责声明');
            setTimeout(showDisclaimerModal, 500);
            return;
        }
        
        const item = script[currentIndex];
        console.log('处理剧本项目:', item);
        currentIndex++;
        
        if (item.character) {
            showDialogue(item);
        } else if (item.action) {
            handleAction(item);
            if (item.action !== 'showDisclaimer') {
                setTimeout(nextStep, 300);
            }
        }
    }

    function showDialogue(item) {
        isAnimating = true;
        console.log('显示对话，角色:', item.character);
        
        // 1. 获取或创建元素
        const portrait = document.getElementById('current-portrait');
        const bubble = document.getElementById('current-bubble');
        
        if (!portrait || !bubble) {
            console.error('找不到对话元素');
            isAnimating = false;
            return;
        }
        
        const speakerName = bubble.querySelector('.speaker-name');
        const dialogueText = bubble.querySelector('.dialogue-text');
        
        // 2. 设置说话者名称
        const displayName = nameMap[item.character] || item.character;
        speakerName.textContent = displayName;
        
        // 3. 设置对话框颜色
        const borderColor = colorMap[item.character] || '#3498db';
        bubble.style.borderLeftColor = borderColor;
        
        // 4. 处理人物立绘 - 【修改】现在支持所有角色
        const portraitPath = `images/half/${item.character}_half.png`;
        console.log('加载立绘路径:', portraitPath);
        
        portrait.src = portraitPath;
        portrait.style.display = 'block';
        portrait.alt = displayName;
        portrait.className = 'dialogue-portrait';
        
        // 添加加载处理
        portrait.onload = function() {
            console.log('立绘加载成功:', portraitPath);
        };
        
        portrait.onerror = function() {
            console.warn('立绘加载失败，使用默认图标:', portraitPath);
            
            // 创建默认图标
            portrait.style.display = 'flex';
            portrait.style.alignItems = 'center';
            portrait.style.justifyContent = 'center';
            portrait.style.backgroundColor = borderColor;
            portrait.style.borderRadius = '50%';
            portrait.style.width = '200px';
            portrait.style.height = '200px';
            portrait.innerHTML = `<div style="color: white; font-size: 48px; font-weight: bold;">${displayName.charAt(0)}</div>`;
        };
        
        // 5. 显示对话框
        bubble.style.display = 'block';
        
        // 6. 设置文本内容 - 使用打字机效果
        dialogueText.innerHTML = '';
        const textContainer = document.createElement('span');
        textContainer.className = 'typewriter-container';
        dialogueText.appendChild(textContainer);
        
        const fullText = item.text;
        let charIndex = 0;
        const typingSpeed = 30; // 打字速度，越小越快
        
        function typeNextChar() {
            if (charIndex < fullText.length) {
                textContainer.textContent += fullText.charAt(charIndex);
                charIndex++;
                
                // 添加光标
                const cursor = document.createElement('span');
                cursor.className = 'typewriter-cursor';
                dialogueText.appendChild(cursor);
                
                // 移除旧光标
                const oldCursor = dialogueText.querySelector('.typewriter-cursor:not(:last-child)');
                if (oldCursor) oldCursor.remove();
                
                setTimeout(typeNextChar, typingSpeed);
            } else {
                // 打字完成，移除光标
                const cursor = dialogueText.querySelector('.typewriter-cursor');
                if (cursor) cursor.remove();
                
                // 动画完成后允许下一次点击
                setTimeout(() => { 
                    isAnimating = false; 
                    console.log('对话显示完成，可点击下一步');
                }, 200);
            }
        }
        
        // 开始打字效果
        typeNextChar();
        
        // 7. 如果是场景切换，处理背景
        if (item.background) {
            const bg = document.getElementById('scene-background');
            if (bg) {
                bg.style.backgroundImage = `url('${item.background}')`;
            }
        }
    }

    function handleAction(actionItem) {
        console.log('处理动作:', actionItem.action);
        
        switch(actionItem.action) {
            case 'changeBackground':
                const bg = document.getElementById('scene-background');
                if (bg) {
                    bg.style.backgroundImage = `url('${actionItem.bg}')`;
                }
                break;
            case 'showDisclaimer':
                showDisclaimerModal();
                break;
        }
    }

    function showDisclaimerModal() {
        console.log('显示免责声明弹窗');
        const modal = document.getElementById('disclaimer-modal');
        if (modal) {
            modal.style.display = 'flex';
            
            // 弹窗显示后，暂停自动推进
            const container = document.getElementById('main-container');
            if (container) {
                container.removeEventListener('click', nextStep);
            }
        }
    }

    return { 
        init
    };
})();