var express = require('express');
var router = express.Router();

const knex = require('knex')(require('../knexfile').development)

router.get('/produtos', function(req, res, next) {
    knex('produtos')
        .select('*')
        .then(rows => {
            res.status(200).json(rows)
        })
        .catch(err => res.status(500).json({
            message: `Erro ao obter produtos: ${err.message}.`
        }))
});

router.get('/produtos/:id', function(req, res, next) {
    const id = req.params.id

    knex('produtos')
    .select('*')
    .where('id', id)
    .then(rows => {
        const produto = rows[0]

        if (produto) {
            res.status(200).json(produto)
        } else {
            throw new Error(`Produto não encontrado`)
        }
    })
    .catch(err => {
        const status = err.message === `Produto não encontrado` ? 404 : 500

        res.status(status).json({
            message: `Erro ao obter produto: ${err.message}`
        })
    })
});

router.post('/produtos', function(req, res, next) {
    const produto = req.body
    
    knex('produtos')
        .insert(produto)
        .returning('id')
        .then(ids => {
            const newId = ids[0]
            res.status(201).json({
                message: `Produto inserido com sucesso`,
                data: newId
            })
        })
});

router.delete('/produtos/:id', function(req, res, next) {
    const id = req.params.id

    knex('produtos')
        .where({ id: id })
        .del()
        .then(rows => {
            if (rows > 0) {
                res.status(200).json({ message: `Produto excluído com sucesso`})
            } else {
                res.status(404).json({ message: `Produto não encontrado`})
            }
        })
        .catch(err => {
            res.status(500).json({
                message: `Erro ao deletar produto: ${err.message}.`
            })
        })
});

router.put('/produtos/:id', function(req, res, next) {
    const id = req.params.id
    const produto = req.body

    knex('produtos')
    .where({ id: id })
    .update({
        descricao: produto.descricao,
        marca: produto.marca,
        valor: produto.valor
    })
    .then(rows => {
        if (rows > 0) {
            res.status(200).json({ message: `Produto alterado com sucesso`})
        } else {
            res.status(404).json({ message: `Produto não encontrado`})
        }
    })
    .catch(err => {
        res.status(500).json({
            message: `Erro ao alterar produto: ${err.message}.`
        })
    })
});

module.exports = router;