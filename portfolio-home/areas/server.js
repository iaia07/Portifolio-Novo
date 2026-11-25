/**
 * VERSÃO MYSQL LOCAL — não é usada pelo site publicado no GitHub Pages.
 * O login publicado usa Supabase em ../js/supabase.js e ../js/script.js.
 * Se quiser testar MySQL, rode este arquivo junto com sistema_login_mysql.sql.
 */
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// Em produção, defina CORS_ORIGIN no .env (ex.: https://seu-usuario.github.io).
const origens = process.env.CORS_ORIGIN;
app.use(cors(origens ? { origin: origens.split(',') } : {}));
app.use(express.json());

const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '12345',
    database: process.env.DB_NAME || 'sistema_login',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.get('/', (req, res) => {
    res.send('Servidor funcionando!');
});

app.post('/api/login', (req, res) => {

    const login = req.body.usuario ?? req.body.email;
    const senha = req.body.senha;

    console.log('Tentativa de login:', login);

    const sql = `
        SELECT id, login
        FROM usuarios
        WHERE login = ? AND senha_hash = SHA2(?, 256)
    `;

    db.query(sql, [login, senha], (err, results) => {

        if (err) {
            console.error('Erro no MySQL:', err);

            return res.status(500).json({
                success: false,
                message: 'Erro interno no servidor'
            });
        }

        if (results.length > 0) {

            console.log('Login realizado com sucesso!');

            return res.json({
                success: true,
                user: results[0]
            });

        } else {

            console.log('E-mail ou senha inválidos!');

            return res.status(401).json({
                success: false,
                message: 'E-mail ou senha inválidos!'
            });
        }
    });
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});