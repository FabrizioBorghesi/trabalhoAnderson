const colorButtons = document.querySelectorAll('.color-button');
const startButton = document.getElementById('start-game');
const restartButton = document.getElementById('restart-game'); // Botão de reiniciar
const scoreDisplay = document.getElementById('score');
const historyContainer = document.getElementById('sequence-history');
const clearHistoryButton = document.getElementById('clear-history');
const backButton = document.getElementById('back-button'); // Seleciona o botão de voltar

// Carregar os sons com o caminho correto
const sounds = {
    green: new Audio('sons/VREDE.mp3'),
    red: new Audio('sons/VERMEIO.mp3'),
    yellow: new Audio('sons/AMARELO.mp3'),
    blue: new Audio('sons/AZU.mp3')
};

let sequence = [];
let playerSequence = [];
let score = 0;
let clickable = false;

function getRandomColor() {
    const colors = ['green', 'red', 'yellow', 'blue'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function flashButton(color) {
    const button = document.getElementById(color);
    button.style.opacity = '0.5';
    
    // Reiniciar o som para garantir que ele toque mesmo quando repetido
    sounds[color].currentTime = 0; // Reseta o tempo de reprodução
    sounds[color].play();  // Toca o som correspondente à cor
    
    setTimeout(() => {
        button.style.opacity = '1';
    }, 300);
}

function playSequence() {
    clickable = false;
    let i = 0;
    const interval = setInterval(() => {
        flashButton(sequence[i]);
        i++;
        if (i >= sequence.length) {
            clearInterval(interval);
            clickable = true;
        }
    }, 800);
}

function addHistoryEntry(score) {
    const historyItem = document.createElement('li');
    historyItem.textContent = `Você completou ${score} sequência(s) antes de errar.`;
    historyContainer.appendChild(historyItem);

    // Atualiza o Local Storage com o novo histórico
    saveHistoryToLocalStorage();
}

function nextRound() {
    sequence.push(getRandomColor());
    playerSequence = [];
    playSequence();
}

function checkSequence() {
    for (let i = 0; i < playerSequence.length; i++) {
        if (playerSequence[i] !== sequence[i]) {
            addHistoryEntry(score);
            resetGame(); // Reinicia o jogo sem alert
            return;
        }
    }
    if (playerSequence.length === sequence.length) {
        score++;
        scoreDisplay.textContent = `Sequências corretas: ${score}`;
        setTimeout(nextRound, 1000);
    }
}

function resetGame() {
    sequence = [];
    playerSequence = [];
    scoreDisplay.textContent = 'Sequências corretas: 0';
    clickable = false;
    score = 0;
}

function restartGame() {
    addHistoryEntry(score); // Registra a última sequência feita
    resetGame();
}

function clearHistory() {
    historyContainer.innerHTML = '';
    localStorage.removeItem('geniusHistory'); // Remove o histórico do Local Storage
}

// Função para salvar o histórico no Local Storage
function saveHistoryToLocalStorage() {
    const historyItems = [...historyContainer.querySelectorAll('li')].map(item => item.textContent);
    localStorage.setItem('geniusHistory', JSON.stringify(historyItems));
}

// Função para carregar o histórico do Local Storage
function loadHistoryFromLocalStorage() {
    const savedHistory = JSON.parse(localStorage.getItem('geniusHistory'));
    if (savedHistory) {
        savedHistory.forEach(entry => {
            const historyItem = document.createElement('li');
            historyItem.textContent = entry;
            historyContainer.appendChild(historyItem);
        });
    }
}

// Carrega o histórico ao iniciar a página
loadHistoryFromLocalStorage();

colorButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (!clickable) return;
        const color = button.id;
        playerSequence.push(color);
        flashButton(color);
        checkSequence();
    });
});

startButton.addEventListener('click', () => {
    resetGame();
    nextRound(); // Começa o jogo apenas uma vez
});

restartButton.addEventListener('click', restartGame); // Adiciona a funcionalidade ao botão de reiniciar

clearHistoryButton.addEventListener('click', clearHistory);

backButton.addEventListener('click', () => {
    window.location.href = 'selecao.html'; // Redireciona para a página de seleção
});
