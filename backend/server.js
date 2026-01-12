// Importa o framework Express
import express from "express";

// Importa o Prisma Client para comunicação com o banco de dados
import { PrismaClient } from '@prisma/client'

// Cria uma instância do Prisma
const prisma = new PrismaClient()

// Cria a aplicação Express
const app = express()

// Middleware para permitir o uso de JSON nas requisições
app.use(express.json())

// =====================
// ROTA POST - Criar usuário
// =====================
app.post('/usuarios', async (req, res) => {

    // Cria um novo usuário no banco de dados
    await prisma.user.create({
        data: {
            // Recebe os dados enviados no body da requisição
            email: req.body.email,
            name: req.body.name,
            age: req.body.age
        }
    })

    // Retorna status 201 (criado) e os dados enviados
    res.status(201).json(req.body)
})

// =====================
// ROTA GET - Listar usuários
// =====================
app.get('/usuarios', async (req, res) => {

    // Variável para armazenar os usuários
    let users = []

    // Verifica se existem parâmetros de busca na query
    if (req.query) {
        // Busca usuários filtrando pelos campos enviados na query
        users = await prisma.user.findMany({
            where: {
                name: req.query.name,
                email: req.query.email,
                age: req.query.age
            }
        })
    } else {
        // Caso não haja filtros, retorna todos os usuários
        users = await prisma.user.findMany()
    }

    // Retorna a lista de usuários com status 200 (ok)
    res.status(200).json(users)
})

// =====================
// ROTA PUT - Atualizar usuário
// =====================
app.put('/usuarios/:id', async (req, res) => {

    // Atualiza um usuário pelo ID passado na URL
    await prisma.user.update({
        where: {
            // ID recebido como parâmetro da rota
            id: req.params.id
        },
        data: {
            // Novos dados enviados no body
            email: req.body.email,
            name: req.body.name,
            age: req.body.age
        }
    })

    // Retorna status 201 e os dados atualizados
    res.status(201).json(req.body)
})

// =====================
// ROTA DELETE - Deletar usuário
// =====================
app.delete('/usuarios/:id', async (req, res) => {

    // Remove o usuário do banco de dados pelo ID
    await prisma.user.delete({
        where: {
            id: req.params.id
        }
    })

    // Retorna mensagem de sucesso
    res.status(200).json({ message: 'Usuário deletado com Sucesso!' })
})

// Inicia o servidor na porta 3000
app.listen(3000)
