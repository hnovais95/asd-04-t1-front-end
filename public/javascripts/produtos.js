const tituloFormulario = document.getElementById('tituloFormulario');
const secaoId = document.getElementById('id');
const secaoDescricao = document.getElementById('descricao');
const secaoMarca = document.getElementById('marca');
const secaoValor = document.getElementById('valor');
const botaoFormulario = document.getElementById('botaoFormulario');
const secaoListaProdutos = document.getElementById('secaoListaProdutos')
const botaoListarProdutos = document.getElementById('botaoListarProdutos');
const campoId = document.getElementById('campoId')
const campoDescricao = document.getElementById('campoDescricao')
const campoMarca = document.getElementById('campoMarca')
const campoValor = document.getElementById('campoValor')
const tabela = document.getElementById('tabelaProdutos').getElementsByTagName('tbody')[0];
const caixaDeSelecao = document.getElementById('caixaDeSelecao');
const radioButtons = document.getElementsByName('opcao');

function mostrarProdutos(mostrar) {
    secaoListaProdutos.style.display = mostrar === true ?  'block' : 'none';
    botaoListarProdutos.value = mostrar === true ? 'Esconder produtos' : 'Listar produtos';
}

function mascararCampoValor() {
    const valor = campoValor.value.replace(/\D/g, '');

    if (valor.length === 0) {
        campoValor.value = '';
        return;
    }

    let valorFormatado = parseFloat(valor) / 100;
    valorFormatado = valorFormatado.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    campoValor.value = valorFormatado;
}

function carregarProdutosPara(executarAcao) {
    fetch('/api/produtos')
    .then(response => response.json())
    .then(produtos => {
        executarAcao(produtos);
    })
    .catch(error => {
        console.error('Erro ao buscar dados da API', error);
    });
}

function preencherTabela(produtos) {
    limparTabela()

    for (i=0; i < produtos.length; i++) {
        const newRow = tabela.insertRow();

        const cell1 = newRow.insertCell(0);
        const cell2 = newRow.insertCell(1);
        const cell3 = newRow.insertCell(2);
        const cell4 = newRow.insertCell(3);

        cell1.innerHTML = produtos[i].id;
        cell2.innerHTML = produtos[i].descricao;
        cell3.innerHTML = produtos[i].marca;
        cell4.innerHTML = `R$ ${produtos[i].valor.toFixed(2)}`;
    }
}

function limparTabela() {
    for(let i = tabela.rows.length - 1; i >= 0; i--) {
        tabela.deleteRow(i);
    }
}

function preencherIds(produtos) {
    limparIds();

    const ids = produtos.map(produto => produto.id);

    for (var i = 0; i < ids.length; i++) {
        var opcao = document.createElement('option');
        opcao.text = ids[i];
        opcao.value = i + 1;
        caixaDeSelecao.appendChild(opcao);
    }
}

function limparIds() {
    while (caixaDeSelecao.firstChild) {
        caixaDeSelecao.removeChild(caixaDeSelecao.firstChild);
    }
}

function configurarRadioButtons() {
    for (var i = 0; i < radioButtons.length; i++) {
        radioButtons[i].addEventListener('click', function() {
            const opcaoSelecionada = this.value;

            switch (opcaoSelecionada) {
                case 'adicionar':
                    configurarFormularioParaCadastro();
                    break;
                case 'editar':
                    configurarFormularioParaEdicao();
                    carregarProdutosPara(preencherIds);
                    break;
                case 'deletar':
                    configurarFormularioParaDelecao();
                    carregarProdutosPara(preencherIds);
                    break;
            }
        });
    }
}

function configurarFormularioParaCadastro() {
    tituloFormulario.textContent = 'Adicionar produto'
    secaoId.style.display = 'none';
    secaoDescricao.style.display = 'block';
    secaoMarca.style.display = 'block';
    secaoValor.style.display = 'block';
    botaoFormulario.value = 'Adicionar';
}

function configurarFormularioParaEdicao() {
    tituloFormulario.textContent = 'Editar produto'
    secaoId.style.display = 'block';
    secaoDescricao.style.display = 'block';
    secaoMarca.style.display = 'block';
    secaoValor.style.display = 'block';
    botaoFormulario.value = 'Editar';
}

function configurarFormularioParaDelecao() {
    tituloFormulario.textContent = 'Deletar produto';
    secaoId.style.display = 'block';
    secaoDescricao.style.display = 'none';
    secaoMarca.style.display = 'none';
    secaoValor.style.display = 'none';
    botaoFormulario.value = 'Deletar';
}

function adicionarProduto() {
    const produto = {
        id: campoId.value,
        descricao: campoDescricao.value,
        marca: campoMarca.value,
        valor: converterParaValorNumerico(campoValor.value)
    }

    fetch('/api/produtos', {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(produto)
    })
    .then(response => response.json()) 
    .then(json => console.log(json))
    .catch(err => console.log(err));
}

function converterParaValorNumerico(valorString) {
    const numeros = valorString.match(/\d+/g).join('');
    return (numeros / 100) ?? 0
}

function editarProduto() {

}

function deletarProduto() {

}

document.addEventListener('DOMContentLoaded', () => {
    configurarRadioButtons();
    configurarFormularioParaCadastro();
    mostrarProdutos(false);
});

campoValor.addEventListener('input', () => {
    mascararCampoValor();
});

botaoFormulario.addEventListener('click', () => {
    let opcaoSelecionada = null;

    for (var i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked) {
            opcaoSelecionada = radioButtons[i].value;
            break;
        }
    }

    switch (opcaoSelecionada) {
        case 'adicionar':
            adicionarProduto();
            break;
        case 'editar':
            editarProduto();
            break;
        case 'deletar':
            deletarProduto();
            break;
    }
});

botaoListarProdutos.addEventListener('click', () => {
    const deveMostrarProdutos = secaoListaProdutos.style.display === 'none';

    if (deveMostrarProdutos) {
        carregarProdutosPara(preencherTabela);
        mostrarProdutos(true);
    } else {
        mostrarProdutos(false);
    }
});