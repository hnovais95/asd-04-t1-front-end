document.addEventListener('DOMContentLoaded', () => {
    console.log('A página foi completamente carregada.');

    fetch('/api/produtos')
    .then(response => response.json())
    .then(produtos => {
        const tabela = document.getElementById('tabelaProdutos').getElementsByTagName('tbody')[0];

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
    })
    .catch(error => {
        console.error('Erro ao buscar dados da API', error);
    });
});

document.addEventListener('load', () => {
    console.error('Ocorreu um erro ao carregar a página.');
});