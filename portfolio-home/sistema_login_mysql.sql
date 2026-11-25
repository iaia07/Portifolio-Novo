-- VERSÃO MYSQL (para XAMPP/WampServer/MySQL local).
-- Use este arquivo se estiver testando no MySQL.
-- Para Supabase, use o arquivo sistema_login.sql (que é PostgreSQL).

CREATE DATABASE IF NOT EXISTS sistema_login
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE sistema_login;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    login VARCHAR(50) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Exemplo didático: senha "12345" salva com SHA-256.
-- Em um projeto real, gere o hash no backend com bcrypt/argon2.
INSERT INTO usuarios (login, senha_hash)
VALUES ('prof@email.com', SHA2('12345', 256))
ON DUPLICATE KEY UPDATE login = login;

-- Nunca faça: SELECT senha FROM usuarios ...
SELECT id, login, criado_em FROM usuarios;
