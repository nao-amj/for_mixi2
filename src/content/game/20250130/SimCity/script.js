document.addEventListener('DOMContentLoaded', () => {
    const gameOutput = document.getElementById('game-output');
    const timeProgressBar = document.getElementById('time-progress-bar');
    const clock = document.getElementById('clock');
    const cityDetails = document.getElementById('city-details');
    const notification = document.createElement('div');
    notification.id = 'notification';
    document.body.appendChild(notification);

    const canvas = document.getElementById('cityMap');
    const ctx = canvas.getContext('2d');

    let year = 2025;
    let population = 0;
    let funds = 1000;
    let houses = 0;
    let factories = 0;
    let roads = 0;
    let happiness = 50;
    let environment = 70;
    let education = 60;
    let taxRate = 0.1; // 10%
    let gameInterval;

    function updateCityDetails() {
        gameOutput.textContent = `
年: ${year}
人口: ${population}
資金: $${funds}
住宅: ${houses}
工場: ${factories}
道路: ${roads}
幸福度: ${happiness}%
環境: ${environment}%
教育: ${education}%
        `;
        cityDetails.innerHTML = `
            <h2>都市の詳細</h2>
            <p><strong>年:</strong> ${year}</p>
            <p><strong>人口:</strong> ${population}</p>
            <p><strong>資金:</strong> $${funds}</p>
            <p><strong>住宅:</strong> ${houses}</p>
            <p><strong>工場:</strong> ${factories}</p>
            <p><strong>道路:</strong> ${roads}</p>
            <p><strong>幸福度:</strong> ${happiness}%</p>
            <p><strong>環境:</strong> ${environment}%</p>
            <p><strong>教育:</strong> ${education}%</p>
            <p><strong>税率:</strong> ${(taxRate * 100).toFixed(2)}%</p>
        `;
        drawMap();
    }

    function drawMap() {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw houses
        for (let i = 0; i < houses; i++) {
            ctx.fillStyle = 'blue';
            ctx.fillRect(50 + i * 30, 50, 20, 20);
        }

        // Draw factories
        for (let i = 0; i < factories; i++) {
            ctx.fillStyle = 'gray';
            ctx.fillRect(50 + i * 30, 100, 20, 20);
        }

        // Draw roads
        for (let i = 0; i < roads; i++) {
            ctx.fillStyle = 'black';
            ctx.fillRect(50 + i * 30, 150, 20, 5);
        }
    }

    function buildHouse() {
        if (funds >= 100) {
            houses++;
            funds -= 100;
            gameOutput.textContent += '\n新しい住宅を建設しました。';
        } else {
            gameOutput.textContent += '\n住宅を建設するための資金が不足しています。';
        }
        updateCityDetails();
    }

    function buildFactory() {
        if (funds >= 200) {
            factories++;
            funds -= 200;
            gameOutput.textContent += '\n新しい工場を建設しました。';
        } else {
            gameOutput.textContent += '\n工場を建設するための資金が不足しています。';
        }
        updateCityDetails();
    }

    function buildRoad() {
        if (funds >= 50) {
            roads++;
            funds -= 50;
            gameOutput.textContent += '\n新しい道路を建設しました。';
        } else {
            gameOutput.textContent += '\n道路を建設するための資金が不足しています。';
        }
        updateCityDetails();
    }

    function nextYear() {
        year++;
        funds += Math.floor(population * 10 * taxRate);
        gameOutput.textContent += `\n${year}年が始まりました。`;
        updateCityDetails();
    }

    function showMenu() {
        gameOutput.textContent += `
1. 住宅を建設
2. 工場を建設
3. 道路を建設
4. 次の年へ
5. 税率を設定
6. 都市の詳細を見る
7. 終了
        `;
    }

    function handleInput(input) {
        switch (input.trim()) {
            case '1':
                buildHouse();
                break;
            case '2':
                buildFactory();
                break;
            case '3':
                buildRoad();
                break;
            case '4':
                nextYear();
                break;
            case '5':
                setTaxRate();
                break;
            case '6':
                viewCityDetails();
                break;
            case '7':
                gameOutput.textContent += '\nゲームを終了します。';
                clearInterval(gameInterval);
                break;
            default:
                gameOutput.textContent += '\n無効なオプションです。';
        }
        showMenu();
    }

    function setTaxRate() {
        const newTaxRate = prompt('新しい税率を入力してください（パーセンテージで）：');
        if (newTaxRate !== null) {
            taxRate = parseFloat(newTaxRate) / 100;
            gameOutput.textContent += `\n税率を${newTaxRate}%に設定しました。`;
            updateCityDetails();
        }
    }

    function viewCityDetails() {
        gameOutput.textContent += `
都市の詳細:
年: ${year}
人口: ${population}
資金: $${funds}
住宅: ${houses}
工場: ${factories}
道路: ${roads}
幸福度: ${happiness}%
環境: ${environment}%
教育: ${education}%
税率: ${(taxRate * 100).toFixed(2)}%
        `;
    }

    function triggerRandomEvent() {
        const events = [
            {
                title: '市内で火災発生！',
                message: '消防署が被害を最小限に抑えました。',
                effect: () => { population = Math.max(0, population - 10); }
            },
            {
                title: '新しい工場が開業！',
                message: '雇用が増え、経済が活性化しました。',
                effect: () => { funds += 500; factories++; }
            },
            {
                title: '嵐で道路が損傷',
                message: '修理作業が進行中です。',
                effect: () => { roads = Math.max(0, roads - 1); }
            },
            {
                title: '観光客の流入！',
                message: '地元経済が活性化しています。',
                effect: () => { funds += 300; population += 5; }
            },
            {
                title: '環境賞受賞',
                message: '持続可能な都市開発が認められました。',
                effect: () => { funds += 200; }
            },
            {
                title: '地震発生！',
                message: '建物が損傷しました。復旧作業が始まります。',
                effect: () => {
                    houses = Math.max(0, houses - 1);
                    population = Math.max(0, population - 15);
                }
            },
            {
                title: '停電発生！',
                message: '停電が市内に影響を与えました。',
                effect: () => { happiness = Math.max(0, happiness - 10); }
            },
            {
                title: '水不足！',
                message: '水不足が市内に影響を与えました。',
                effect: () => { happiness = Math.max(0, happiness - 5); }
            },
            {
                title: '新しい公園が開園！',
                message: '新しい公園が開園し、幸福度が上がりました。',
                effect: () => { happiness = Math.min(100, happiness + 10); }
            },
            {
                title: '学校が建設されました！',
                message: '新しい学校が建設され、教育が向上しました。',
                effect: () => { education = Math.min(100, education + 10); }
            },
            {
                title: '病院が建設されました！',
                message: '新しい病院が建設され、幸福度が上がりました。',
                effect: () => { happiness = Math.min(100, happiness + 5); }
            },
            {
                title: '工場の汚染！',
                message: '工場が汚染を引き起こし、環境が悪化しました。',
                effect: () => { environment = Math.max(0, environment - 10); }
            }
        ];
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        randomEvent.effect();
        showNotification(randomEvent.title, randomEvent.message);
        gameOutput.textContent += `\nイベント: ${randomEvent.title}\n${randomEvent.message}`;
        updateCityDetails();
    }

    function updateProgressBar() {
        timeProgressBar.style.width = '0%';
        setTimeout(() => {
            timeProgressBar.style.width = '100%';
        }, 100);
    }

    function updateClock() {
        const now = new Date();
        clock.textContent = now.toLocaleTimeString();
    }

    function showNotification(title, message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `<strong>${title}</strong><p>${message}</p>`;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    updateCityDetails();
    showMenu();

    document.addEventListener('keydown', (event) => {
        handleInput(event.key);
    });

    gameInterval = setInterval(() => {
        triggerRandomEvent();
        updateProgressBar();
    }, 10000);

    setInterval(updateClock, 1000);

    updateProgressBar();
    updateClock();
});
