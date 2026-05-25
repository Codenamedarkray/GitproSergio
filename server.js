const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// "Banco de dados" em memória para testes
const USUARIOS_CADASTRADOS = [
    { email: "usuario@teste.com", senha: "123", nome: "Dev Solitário" }
];

// Tokens ativos na sessão atual
const sessoesAtivas = new Set();

// ==========================================
// ROTA DE LOGIN
// ==========================================
app.post('/api/login', (express.json()), (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ erro: "E-mail e senha são obrigatórios." });
    }

    // Busca o usuário no nosso array em memória
    const usuario = USUARIOS_CADASTRADOS.find(u => u.email === email && u.senha === senha);

    if (!usuario) {
        return res.status(401).json({ erro: "E-mail ou senha inválidos." });
    }

    // Gera um token simples simulado (em produção, use JWT)
    const tokenSimulado = `token_${Math.random().toString(36).substr(2)}`;
    sessoesAtivas.add(tokenSimulado);

    return res.json({
        mensagem: "Login efetuado com sucesso!",
        usuario: { nome: usuario.nome, email: usuario.email },
        token: tokenSimulado
    });
});

// ==========================================
// MIDDLEWARE DE AUTENTICAÇÃO (PROTEÇÃO)
// ==========================================
// Garante que a rota de cálculo só aceite requisições de quem passou pelo login
const verificarAutenticacao = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader || !sessoesAtivas.has(authHeader)) {
        return res.status(403).json({ erro: "Acesso negado. Faça login para acessar esta página." });
    }
    
    next();
};

// ==========================================
// ROTA DE CÁLCULO DE COMBUSTÍVEL
// ==========================================
app.post('/api/calculo-combustivel', verificarAutenticacao, (req, res) => {
    const { distanciaKm, consumoKmL, precoCombustivel } = req.body;

    // Validação dos dados recebidos
    if (!distanciaKm || !consumoKmL || !precoCombustivel) {
        return res.status(400).json({ erro: "Por favor, preencha todos os campos do cálculo." });
    }

    if (consumoKmL <= 0) {
        return res.status(400).json({ erro: "O consumo do veículo deve ser maior que zero." });
    }

    // Regra de negócio / Cálculo
    const litrosNecessarios = distanciaKm / consumoKmL;
    const custoTotal = litrosNecessarios * precoCombustivel;

    return res.json({
        litrosNecessarios: parseFloat(litrosNecessarios.toFixed(2)),
        custoTotal: parseFloat(custoTotal.toFixed(2))
    });
});

// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando com sucesso na porta ${PORT}`);
});