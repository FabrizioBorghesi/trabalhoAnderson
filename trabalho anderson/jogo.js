const botoesCores = document.querySelectorAll('.botao-cor');
const botaoIniciar = document.getElementById('iniciar-jogo');
const botaoReiniciar = document.getElementById('reiniciar-jogo');
const displayPontuacao = document.getElementById('pontuacao');
const containerHistorico = document.getElementById('lista-historico');
const botaoLimparHistorico = document.getElementById('limpar-historico');
const botaoVoltar = document.getElementById('voltar');

// Carregar os sons com o caminho correto
const sons = {
    verde: new Audio('sons/VREDE.mp3'),
    vermelho: new Audio('sons/VERMEIO.mp3'),
    amarelo: new Audio('sons/AMARELO.mp3'),
    azul: new Audio('sons/AZU.mp3')
};

let sequencia = [];
let sequenciaJogador = [];
let pontuacao = 0;
let clicavel = false;

function obterCorAleatoria() {
    const cores = ['verde', 'vermelho', 'amarelo', 'azul'];
    return cores[Math.floor(Math.random() * cores.length)];
}

function piscarBotao(cor) {
    const botao = document.getElementById(cor);
    botao.style.opacity = '0.5';

    // Reiniciar o som para garantir que ele toque mesmo quando repetido
    sons[cor].currentTime = 0;
    sons[cor].play();

    setTimeout(() => {
        botao.style.opacity = '1';
    }, 300);
}

function reproduzirSequencia() {
    clicavel = false;
    let i = 0;
    const intervalo = setInterval(() => {
        piscarBotao(sequencia[i]);
        i++;
        if (i >= sequencia.length) {
            clearInterval(intervalo);
            clicavel = true;
        }
    }, 800);
}

function adicionarEntradaHistorico(pontuacao) {
    const itemHistorico = document.createElement('li');
    itemHistorico.textContent = `Você completou ${pontuacao} sequência(s) antes de errar.`;
    containerHistorico.appendChild(itemHistorico);

    // Atualiza o Local Storage com o novo histórico
    salvarHistoricoNoLocalStorage();
}

function proximaRodada() {
    sequencia.push(obterCorAleatoria());
    sequenciaJogador = [];
    reproduzirSequencia();
}

function verificarSequencia() {
    for (let i = 0; i < sequenciaJogador.length; i++) {
        if (sequenciaJogador[i] !== sequencia[i]) {
            adicionarEntradaHistorico(pontuacao);
            resetarJogo();
            return;
        }
    }
    if (sequenciaJogador.length === sequencia.length) {
        pontuacao++;
        displayPontuacao.textContent = `Sequências corretas: ${pontuacao}`;
        setTimeout(proximaRodada, 1000);
    }
}

function resetarJogo() {
    sequencia = [];
    sequenciaJogador = [];
    displayPontuacao.textContent = 'Sequências corretas: 0';
    clicavel = false;
    pontuacao = 0;
}

function reiniciarJogo() {
    adicionarEntradaHistorico(pontuacao);
    resetarJogo();
}

function limparHistorico() {
    containerHistorico.innerHTML = '';
    localStorage.removeItem('geniusHistory');
}

function salvarHistoricoNoLocalStorage() {
    const itensHistorico = [...containerHistorico.querySelectorAll('li')].map(item => item.textContent);
    localStorage.setItem('geniusHistory', JSON.stringify(itensHistorico));
}

function carregarHistoricoDoLocalStorage() {
    const historicoSalvo = JSON.parse(localStorage.getItem('geniusHistory'));
    if (historicoSalvo) {
        historicoSalvo.forEach(entry => {
            const itemHistorico = document.createElement('li');
            itemHistorico.textContent = entry;
            containerHistorico.appendChild(itemHistorico);
        });
    }
}

carregarHistoricoDoLocalStorage();

botoesCores.forEach(botao => {
    botao.addEventListener('click', () => {
        if (!clicavel) return;
        const cor = botao.id;
        sequenciaJogador.push(cor);
        piscarBotao(cor);
        verificarSequencia();
    });
});

botaoIniciar.addEventListener('click', () => {
    resetarJogo();
    proximaRodada();
});

botaoReiniciar.addEventListener('click', reiniciarJogo);

botaoLimparHistorico.addEventListener('click', limparHistorico);

botaoVoltar.addEventListener('click', () => {
    window.location.href = 'selecao.html';
});
