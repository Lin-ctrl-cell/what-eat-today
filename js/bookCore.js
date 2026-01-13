// bookCore.js - 简化版：所有人物一开始就解锁
const BookManager = (function() {
    // 1. 所有人物一开始就解锁
    const characters = [
        { id: 'rabbit', name: '血狼破军', page: 'page_rabbit.html' },
        { id: 'lgg', name: '龙哥哥今天又鸽了', page: 'page_lgg.html' },
        { id: 'mygs', name: '绵阳怪兽', page: 'page_mygs.html' },
        { id: 'ks', name: '剑圣kensei', page: 'page_ks.html' },
        { id: 'wys', name: '维云斯', page: 'page_wys.html' },
        { id: 'mlh', name: '逗比寒MillerRHan', page: 'page_mlh.html' },
        { id: 'zc', name: '魔法Zc目录', page: 'page_zc.html' },
        { id: 'sungan', name: '绝命笋干', page: 'page_sungan.html' }
    ];

    // 引导对话数据
    const guideDialogues = [
        { speaker: '作者', text: '嗨~观众朋友你好！欢迎来到这里！' },
        { speaker: '我', text: '？' },
        { speaker: '作者', text: '相信你一定有很多迷茫！跟着引导了解一下吧！' },
        { speaker: '作者', text: '这里是游戏《明日方舟》的一个非官方赛事同人网站！' },
        { speaker: '作者', text: '主要讲述了该赛事"仙术杯"和几位玩家&主播&选手间的小故事！' },
        { speaker: '作者', text: '让我们开始吧！' },
        { speaker: '作者', text: '点击第一位人物，开始阅读故事！' }
    ];

    // 初始化
     function init() {
        console.log('BookManager 初始化');
        
        // 检查是否已经显示过引导
        const guideShown = sessionStorage.getItem('guideShown');
        
        if (!guideShown) {
            // 显示引导对话
            showGuideDialogue();
        } else {
            // 直接渲染目录
            if (document.getElementById('character-directory')) {
                renderDirectory();
            }
        }
    }

    // 显示引导对话
    function showGuideDialogue() {
        // 创建引导对话容器
        const guideContainer = document.createElement('div');
        guideContainer.id = 'guide-dialogue-container';
        guideContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 1000;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
        `;

        // 创建对话框（与主线故事相同的样式）
        const dialogueBubble = document.createElement('div');
        dialogueBubble.className = 'dialogue-bubble';
        dialogueBubble.style.cssText = `
            position: relative;
            min-width: 600px;
            max-width: 800px;
            min-height: 200px;
            background: rgba(30, 30, 46, 0.95);
            border-radius: 20px;
            padding: 30px 35px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
            border-left: 10px solid #4a6fa5;
            animation: bubbleAppear 0.5s ease;
            backdrop-filter: blur(5px);
        `;

        // 创建说话者名字
        const speakerName = document.createElement('div');
        speakerName.className = 'speaker-name';
        speakerName.style.cssText = `
            font-weight: bold;
            font-size: 1.4em;
            color: #fff;
            margin-bottom: 15px;
            text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
        `;

        // 创建对话文本
        const dialogueText = document.createElement('div');
        dialogueText.className = 'dialogue-text';
        dialogueText.style.cssText = `
            font-size: 1.5em;
            line-height: 1.8;
            color: #f0f0f0;
            min-height: 70px;
        `;

        // 创建继续提示
        const continueHint = document.createElement('div');
        continueHint.className = 'continue-hint';
        continueHint.style.cssText = `
            text-align: right;
            color: #aaa;
            font-style: italic;
            margin-top: 20px;
            font-size: 1em;
            animation: blink 1.5s infinite;
        `;
        continueHint.textContent = '↓ 点击以继续……';

        // 组装对话框
        dialogueBubble.appendChild(speakerName);
        dialogueBubble.appendChild(dialogueText);
        dialogueBubble.appendChild(continueHint);
        guideContainer.appendChild(dialogueBubble);
        document.body.appendChild(guideContainer);

        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes bubbleAppear {
                from { opacity: 0; transform: translateY(40px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes blink {
                0%, 100% { opacity: 0.6; }
                50% { opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        // 对话控制变量
        let currentDialogueIndex = 0;

        // 显示当前对话
        function showCurrentDialogue() {
            if (currentDialogueIndex >= guideDialogues.length) {
                // 引导结束
                document.body.removeChild(guideContainer);
                document.head.removeChild(style);
                sessionStorage.setItem('guideShown', 'true');
                
                // 显示目录
                document.getElementById('character-directory').style.display = '';
                renderDirectory();
                return;
            }

            const dialogue = guideDialogues[currentDialogueIndex];
            speakerName.textContent = dialogue.speaker;
            dialogueText.textContent = dialogue.text;
            currentDialogueIndex++;
        }

        // 点击继续
        guideContainer.addEventListener('click', showCurrentDialogue);

        // 开始显示第一个对话
        showCurrentDialogue();
    }

    // 显示选择对话框（通用）
    function showChoiceDialog(characterId) {
        // ... 保持原有的选择对话框代码不变 ...
        const character = characters.find(c => c.id === characterId);
        if (!character) return;
        
        const dialog = document.createElement('div');
        dialog.id = 'choice-dialog';
        dialog.style.cssText = `
            position: fixed;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            background-color: #333;
            padding: 30px;
            border-radius: 12px;
            z-index: 1001;
            min-width: 320px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.4);
            text-align: center;
            animation: fadeIn 0.3s ease;
        `;

        // rabbit特殊选项（三个选项）
        if (characterId === 'rabbit') {
            dialog.innerHTML = `
                <div style="margin-bottom: 25px; font-size: 1.2em; color: #fff; font-weight: bold;">选择操作</div>
                <button id="choice-start-story" style="
                    display: block; width: 100%; padding: 12px; margin-bottom: 10px;
                    background-color: #4CAF50; color: white; border: none;
                    border-radius: 6px; font-size: 1em; cursor: pointer;
                    transition: all 0.2s ease;
                " onmouseover="this.style.backgroundColor='#45a049'" onmouseout="this.style.backgroundColor='#4CAF50'">开始阅读故事</button>
                <button id="choice-view-profile" style="
                    display: block; width: 100%; padding: 12px; margin-bottom: 10px;
                    background-color: #3498db; color: white; border: none;
                    border-radius: 6px; font-size: 1em; cursor: pointer;
                    transition: all 0.2s ease;
                " onmouseover="this.style.backgroundColor='#2980b9'" onmouseout="this.style.backgroundColor='#3498db'">已经看过故事了，看看资料吧</button>
                <button id="choice-back" style="
                    display: block; width: 100%; padding: 12px;
                    background-color: #666; color: white; border: none;
                    border-radius: 6px; font-size: 1em; cursor: pointer;
                    transition: all 0.2s ease;
                " onmouseover="this.style.backgroundColor='#777'" onmouseout="this.style.backgroundColor='#666'">再看看</button>
            `;
            
            document.body.appendChild(dialog);

            // rabbit的三个选项处理
            document.getElementById('choice-start-story').addEventListener('click', function() {
                document.body.removeChild(dialog);
                startMainStory();
            });

            document.getElementById('choice-view-profile').addEventListener('click', function() {
                document.body.removeChild(dialog);
                window.location.href = character.page;
            });

            document.getElementById('choice-back').addEventListener('click', function() {
                document.body.removeChild(dialog);
                // "再看看"就是关闭对话框，什么也不做
            });
        }
        // 其他人物（两个选项）- 包括lgg
        else {
            dialog.innerHTML = `
                <div style="margin-bottom: 25px; font-size: 1.2em; color: #fff; font-weight: bold;">选择操作</div>
                <button id="choice-view-profile" style="
                    display: block; width: 100%; padding: 12px; margin-bottom: 10px;
                    background-color: #4CAF50; color: white; border: none;
                    border-radius: 6px; font-size: 1em; cursor: pointer;
                    transition: all 0.2s ease;
                " onmouseover="this.style.backgroundColor='#45a049'" onmouseout="this.style.backgroundColor='#4CAF50'">现在就查看他的资料</button>
                <button id="choice-back" style="
                    display: block; width: 100%; padding: 12px;
                    background-color: #666; color: white; border: none;
                    border-radius: 6px; font-size: 1em; cursor: pointer;
                    transition: all 0.2s ease;
                " onmouseover="this.style.backgroundColor='#777'" onmouseout="this.style.backgroundColor='#666'">还是先读故事吧</button>
            `;

            document.body.appendChild(dialog);

            // 其他人物（包括lgg）的两个选项处理
            document.getElementById('choice-view-profile').addEventListener('click', function() {
                document.body.removeChild(dialog);
                window.location.href = character.page;
            });

            document.getElementById('choice-back').addEventListener('click', function() {
                document.body.removeChild(dialog);
                // "还是先读故事吧"就是关闭对话框，什么也不做
            });
        }

        return dialog;
    }

    // 开始主线故事
    function startMainStory() {
        if (window.AudioManager) {
            AudioManager.playSound(AudioManager.SOUNDS.PAGE_TURN);
        }
        window.location.href = 'main_story.html';
    }

    // 渲染目录
    function renderDirectory() {
        const container = document.getElementById('character-directory');
        if (!container) return;

        // 清空容器，但保留网格类
        container.innerHTML = '';
        container.className = 'character-grid';

        characters.forEach(character => {
            const card = document.createElement('div');
            card.className = 'character-portrait';
            card.dataset.id = character.id;

            // 创建图片
            const img = document.createElement('img');
            img.src = `images/portraits/${character.id}.png`;
            img.alt = character.name;

            // 创建名字标签
            const nameTag = document.createElement('div');
            nameTag.className = 'name';
            nameTag.textContent = character.name;

            // 组装卡片
            card.appendChild(img);
            card.appendChild(nameTag);

            // 添加点击事件
            card.addEventListener('click', (event) => {
                event.stopPropagation();

                if (window.AudioManager) {
                    AudioManager.playSound(AudioManager.SOUNDS.CLICK);
                }

                // 所有人物（包括lgg）都直接显示选择对话框
                showChoiceDialog(character.id);
            });

            // 添加到容器
            container.appendChild(card);
        });
    }

    // 初始化
    window.addEventListener('DOMContentLoaded', init);

    // 公开接口
    return {
        startMainStory
    };
})();