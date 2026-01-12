import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

// Cria uma instância do Prisma
const prisma = new PrismaClient();

// Cria a aplicação Express
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// =====================
// ROTA POST - Criar usuário
// =====================
app.post("/usuarios", async (req, res) => {
  await prisma.user.create({
    data: {
      email: req.body.email,
      name: req.body.name,
      age: req.body.age,
    },
  });

  res.status(201).json(req.body);
});

// =====================
// ROTA GET - Listar usuários
// =====================
app.get("/usuarios", async (req, res) => {
  let users = [];

  if (
    req.query.name ||
    req.query.email ||
    req.query.age
  ) {
    users = await prisma.user.findMany({
      where: {
        name: req.query.name,
        email: req.query.email,
        age: req.query.age ? Number(req.query.age) : undefined,
      },
    });
  } else {
    users = await prisma.user.findMany();
  }

  res.status(200).json(users);
});

// =====================
// ROTA PUT - Atualizar usuário
// =====================
app.put("/usuarios/:id", async (req, res) => {
  await prisma.user.update({
    where: {
      id: Number(req.params.id),
    },
    data: {
      email: req.body.email,
      name: req.body.name,
      age: req.body.age,
    },
  });

  res.status(201).json(req.body);
});

// =====================
// ROTA DELETE - Deletar usuário
// =====================
app.delete("/usuarios/:id", async (req, res) => {
  await prisma.user.delete({
    where: {
      id: Number(req.params.id),
    },
  });

  res.status(200).json({ message: "Usuário deletado com sucesso!" });
});

// Inicia o servidor
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000 🚀");
});
