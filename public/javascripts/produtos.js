// == Componentes ==

const formularioRadioButtons = document.getElementById('opcoes');
const radioButtons = document.getElementsByName('opcao');
const tituloFormulario = document.getElementById('tituloFormulario');
const formulario = document.getElementById('formulario');
const secaoId = document.getElementById('id');
const secaoDescricao = document.getElementById('descricao');
const secaoMarca = document.getElementById('marca');
const secaoValor = document.getElementById('valor');
const caixaDeSelecao = document.getElementById('caixaDeSelecao');
const campoId = document.getElementById('campoId')
const campoDescricao = document.getElementById('campoDescricao')
const campoMarca = document.getElementById('campoMarca')
const campoValor = document.getElementById('campoValor')
const botaoFormulario = document.getElementById('botaoFormulario');
const botaoListarProdutos = document.getElementById('botaoListarProdutos');
const secaoListaProdutos = document.getElementById('secaoListaProdutos')
const tabela = document.getElementById('tabelaProdutos').getElementsByTagName('tbody')[0];

// == Propriedades ==

var opcaoSelecionada = "adicionar";

// == Listeners ==

document.addEventListener('DOMContentLoaded', definirConfiguracaoInicial);

for (var i = 0; i < radioButtons.length; i++) {
    radioButtons[i].addEventListener('click', function() {
        opcaoSelecionada = this.value;

        switch (opcaoSelecionada) {
            case 'adicionar':
                configurarFormularioParaAdicao();
                break;
            case 'editar':
                configurarFormularioParaEdicao();
                carregarProdutosPara(preencherCaixaDeSelecao);
                break;
            case 'deletar':
                configurarFormularioParaDelecao();
                carregarProdutosPara(preencherCaixaDeSelecao);
                break;
        }

        formulario.reset();
    });
}

caixaDeSelecao.addEventListener('change', function(event) {
    const indiceSelecionado = caixaDeSelecao.selectedIndex;
    const id = caixaDeSelecao.options[indiceSelecionado].text;
    preencherFormularioComProdutoSelecionado(id);
})

campoValor.addEventListener('input', () => {
    campoValor.value = converterParaBRL(campoValor.value);
});

botaoListarProdutos.addEventListener('click', () => {
    const mostrarProdutos = secaoListaProdutos.style.display === 'none';

    if (mostrarProdutos) {
        carregarProdutosPara(preencherTabela);
        definirVisibilidaDaListaDeProdutos(true);
    } else {
        definirVisibilidaDaListaDeProdutos(false);
    }
});

formulario.addEventListener('submit', function(event) {
    event.preventDefault();

    let opcaoSelecionada = null;

    for (var i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked) {
            opcaoSelecionada = radioButtons[i].value;
            break;
        }
    }

    const id = opcaoSelecionada != 'adicionar' ? caixaDeSelecao.options[caixaDeSelecao.selectedIndex].text : null;

    switch (opcaoSelecionada) {
        case 'adicionar':
            adicionarProduto()
            break;
        case 'editar':
            editarProduto(id)
            break;
        case 'deletar':
            deletarProduto(id);
            break;
    }
});

// == Funções ==

function definirConfiguracaoInicial() {
    configurarFormularioParaAdicao();
    formularioRadioButtons.reset();
    formulario.reset();
    definirVisibilidaDaListaDeProdutos(false);
}

function configurarFormularioParaAdicao() {
    tituloFormulario.textContent = 'Adicionar produto'
    secaoId.style.display = 'none';
    caixaDeSelecao.value = null;
    secaoDescricao.style.display = 'block';
    secaoMarca.style.display = 'block';
    secaoValor.style.display = 'block';
    botaoFormulario.value = 'Adicionar';
    caixaDeSelecao.required = false;
    campoDescricao.required = true;
    campoMarca.required = true;
    campoValor.required = true;
}

function configurarFormularioParaEdicao() {
    tituloFormulario.textContent = 'Editar produto'
    secaoId.style.display = 'block';
    secaoDescricao.style.display = 'block';
    secaoMarca.style.display = 'block';
    secaoValor.style.display = 'block';
    botaoFormulario.value = 'Editar';
    caixaDeSelecao.required = true;
    campoDescricao.required = true;
    campoMarca.required = true;
    campoValor.required = true;
}

function configurarFormularioParaDelecao() {
    tituloFormulario.textContent = 'Deletar produto';
    secaoId.style.display = 'block';
    secaoDescricao.style.display = 'none';
    secaoMarca.style.display = 'none';
    secaoValor.style.display = 'none';
    botaoFormulario.value = 'Deletar';
    caixaDeSelecao.required = false;
    campoDescricao.required = false;
    campoMarca.required = false;
    campoValor.required = false;
}

function preencherFormularioComProdutoSelecionado(id) {
    fetch('/api/produtos/' + id)
    .then(response => response.json())
    .then(produto => {
        campoDescricao.value = produto.descricao;
        campoMarca.value = produto.marca;
        const valor = Math.round(produto.valor * 100.0)
        campoValor.value = converterParaBRL(valor);
    })
    .catch(error => {
        console.error('Erro ao buscar dados da API', error);
    });
}

function definirVisibilidaDaListaDeProdutos(mostrar) {
    secaoListaProdutos.style.display = mostrar === true ?  'block' : 'none';
    botaoListarProdutos.value = mostrar === true ? 'Esconder produtos' : 'Listar produtos';
}

function converterParaBRL(valor) {
    const valorString = valor.toString().replace(/\D/g, '');

    if (valorString.length === 0) {
        return '';
    }

    let valorFormatado = parseFloat(valorString) / 100;

    valorFormatado = valorFormatado.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    return valorFormatado
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
        const valor = Math.round(produtos[i].valor * 100);
        cell4.innerHTML = converterParaBRL(valor);
    }
}

function limparTabela() {
    for(let i = tabela.rows.length - 1; i >= 0; i--) {
        tabela.deleteRow(i);
    }
}

function preencherCaixaDeSelecao(produtos) {
    while (caixaDeSelecao.children.length > 1) {
        caixaDeSelecao.removeChild(caixaDeSelecao.lastChild);
    }

    const ids = produtos.map(produto => produto.id);

    for (var i = 0; i < ids.length; i++) {
        const opcao = document.createElement('option');
        opcao.text = ids[i];
        opcao.value = i + 1;
        caixaDeSelecao.appendChild(opcao);
    }
}

function adicionarProduto() {
    fetch('/api/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            descricao: campoDescricao.value,
            marca: campoMarca.value,
            valor: converterBRLParaFloat(campoValor.value),
        })
    })
    .then(response => {
        if (!response.ok) {
          throw new Error(`Erro de rede - ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(data)
        swal('Bom trabalho!', 'Produto adicionado com sucesso!', 'success');
        definirConfiguracaoInicial();
    })
    .catch(error => {
        console.log(error)
        swal('Oops!', 'Erro ao adicionar produto.', 'error');
    });
}

function editarProduto(id) {
    fetch('/api/produtos/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            descricao: campoDescricao.value,
            marca: campoMarca.value,
            valor: converterBRLParaFloat(campoValor.value),
        })
    })
    .then(response => {
        if (!response.ok) {
          throw new Error(`Erro de rede - ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        swal('Bom trabalho!', 'Produto editado com sucesso!', 'success');
        definirConfiguracaoInicial();
     })
    .catch(error => { 
        console.log(error)
        swal('Oops!', 'Erro ao editar produto.', 'error');
    });
}

function deletarProduto(id) {
    fetch('/api/produtos/' + id, { method: 'DELETE' })
    .then(response => {
        if (!response.ok) {
          throw new Error(`Erro de rede - ${response.status}`);
        }
        return response.json();
    })
    .then(data => { 
        swal('Bom trabalho!', 'Produto deletado com sucesso!', 'success');
        definirConfiguracaoInicial();
    })
    .catch(error => { 
        console.log(error)
        swal('Oops!', 'Erro ao deletar produto.', 'error');
    });
}

function converterBRLParaFloat(reais) {
    const numeros = reais.replace(/\D/g, '');
    return parseFloat(numeros) / 100;
}