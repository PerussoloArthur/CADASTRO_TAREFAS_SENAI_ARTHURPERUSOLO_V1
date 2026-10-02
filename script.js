const campoTarefa = document.getElementById('campo-tarefa');
const botaoAdicionar = document.getElementById('botao-adicionar');
const botaoLimpar = document.getElementById('botao-limpar');
const listaTarefas = document.getElementById('lista-tarefas');
const contadorTarefas = document.getElementById('contador-tarefas');
const botaoTema = document.getElementById('botao-tema');
const filtrosContainer = document.getElementById('filtros');

let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
let filtroAtual = 'todas';

// SALVAR NO LOCALSTORAGE
function salvar() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
    localStorage.setItem('tema', document.body.classList.contains('modo-escuro') ? 'escuro' : 'claro');
}

function atualizarContador() {
    const total = tarefas.length;
    const pendentes = tarefas.filter(t => !t.concluida).length;
    contadorTarefas.textContent = `${total} tarefas • ${pendentes} pendentes`;
}

function renderizar() {
    listaTarefas.innerHTML = '';
    
    let tarefasFiltradas = tarefas;
    if (filtroAtual === 'pendentes') tarefasFiltradas = tarefas.filter(t => !t.concluida);
    if (filtroAtual === 'concluidas') tarefasFiltradas = tarefas.filter(t => t.concluida);

    if (tarefasFiltradas.length === 0) {
        listaTarefas.innerHTML = `<li style="text-align:center; padding:20px; color:var(--text-soft)">Nenhuma tarefa aqui ✨</li>`;
        atualizarContador();
        return;
    }

    tarefasFiltradas.forEach((tarefa) => {
        const itemLista = document.createElement('li');
        itemLista.classList.add('item-tarefa');
        if (tarefa.concluida) itemLista.classList.add('concluida');

        itemLista.innerHTML = `
            <span class="texto-tarefa">${tarefa.texto}</span>
            <div class="acoes-tarefa">
                <button class="botao-acao editar"><i class="fa-solid fa-pen"></i></button>
                <button class="botao-acao concluir"><i class="fa-solid fa-check"></i></button>
                <button class="botao-acao excluir"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;

        // Concluir
        itemLista.querySelector('.concluir').addEventListener('click', () => {
            tarefa.concluida = !tarefa.concluida;
            salvar(); renderizar();
        });

        // Excluir
        itemLista.querySelector('.excluir').addEventListener('click', () => {
            tarefas = tarefas.filter(t => t.id !== tarefa.id);
            salvar(); renderizar();
        });

        // EDITAR - FUNÇÃO QUE VOCÊ PEDIU
        const iniciarEdicao = () => {
            itemLista.classList.add('editando');
            const span = itemLista.querySelector('.texto-tarefa');
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'input-edicao';
            input.value = tarefa.texto;
            
            span.replaceWith(input);
            input.focus();

            const salvarEdicao = () => {
                const novoTexto = input.value.trim();
                if (novoTexto) tarefa.texto = novoTexto;
                salvar(); renderizar();
            };

            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') salvarEdicao();
            });
            input.addEventListener('blur', salvarEdicao);
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') renderizar();
            });
        };

        itemLista.querySelector('.texto-tarefa').addEventListener('click', iniciarEdicao);
        itemLista.querySelector('.editar').addEventListener('click', iniciarEdicao);

        listaTarefas.appendChild(itemLista);
    });
    atualizarContador();
}

function adicionarTarefa() {
    const texto = campoTarefa.value.trim();
    if (!texto) return;
    tarefas.push({ id: Date.now(), texto, concluida: false });
    campoTarefa.value = '';
    salvar(); renderizar();
}

function limparTodasTarefas() {
    if (tarefas.length === 0) return;
    if (confirm('Tem certeza que deseja apagar todas as tarefas?')) {
        tarefas = [];
        salvar(); renderizar();
    }
}

// Eventos
botaoAdicionar.addEventListener('click', adicionarTarefa);
botaoLimpar.addEventListener('click', limparTodasTarefas);
campoTarefa.addEventListener('keypress', e => { if (e.key === 'Enter') adicionarTarefa() });

// FILTROS
filtrosContainer.addEventListener('click', (e) => {
    if (!e.target.classList.contains('filtro')) return;
    document.querySelectorAll('.filtro').forEach(b => b.classList.remove('ativo'));
    e.target.classList.add('ativo');
    filtroAtual = e.target.dataset.filtro;
    renderizar();
});

// TEMA COM LOCALSTORAGE
const temaSalvo = localStorage.getItem('tema');
if (temaSalvo === 'escuro') {
    document.body.classList.add('modo-escuro');
    botaoTema.querySelector('i').className = 'fa-solid fa-sun';
}
botaoTema.addEventListener('click', () => {
    document.body.classList.toggle('modo-escuro');
    const icone = botaoTema.querySelector('i');
    icone.className = document.body.classList.contains('modo-escuro') ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    salvar();
});

const botaoRfs = document.getElementById('botao-rfs');

botaoRfs.addEventListener('click', () => {
    alert(`📋 RFS - Minhas Tarefas | Arthur Perussolo

RF01 - Editar tarefa (clicando no texto ou no lápis)
RF02 - Filtrar por Todas / Pendentes / Concluídas
RF03 - Limpar todas as tarefas
RF04 - Persistência com localStorage (tarefas + tema)
RF05 - Contador dinâmico (total • pendentes)
RF16 - Animações e layout responsivo`);
});

// Inicializa
renderizar();