const express = require("express");
const router = express.Router();

const authController = require("./authController");


router.post("/register", authController.register);
router.post("/login", authController.login);
router.post('/logout', authController.logout);


/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints de autenticação
 */
/**
 * @swagger
 * /auth/register:
 *  post:
 *   summary: Registrar um novo usuário
 *  tags: [Auth]
 *  requestBody:
 *   required: true
 *  content:
 *   application/json:
 *    schema:
 *    type: object
 *   properties:
 *    username:
 *    type: string
 *   example: user123
 *   password:
 *  type: string
 * example: pass123
 * responses:
 *  201:
 *  description: Usuário registrado com sucesso
 *  400:
 * description: Dados inválidos
 *  500:
 * description: Erro no servidor
 * /**
 * @swagger
 * /auth/login:
 * post:
 * summary: Login de usuário
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * username:
 * type: string
 * example: user123
 * password:
 * type: string
 * example: pass123
 * responses:
 * 200:
 * description: Login bem-sucedido
 * 400:
 * description: Dados inválidos
 * 401:
 * description: Credenciais inválidas
 * 500:
 * description: Erro no servidor
 * /**
 * @swagger
 * /auth/logout:
 * post:
 * summary: Logout de usuário
 *  
 * tags: [Auth]
 * responses:
 * 200:
 * description: Logout bem-sucedido
 * 500:
 * description: Erro no servidor
 * */

module.exports = router;
