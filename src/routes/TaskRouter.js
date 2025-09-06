const Task = require('../controllers/TaskController');
const express = require('express');
const router = express.Router();

router.post('/create', Task.create);

router.patch('/complete/:taskId', Task.finish);
router.patch('/open/:taskId', Task.reOpen);

router.get('/get/:taskId', Task.getTask);

router.put('/updateTask/:taskId', Task.updateTask);
router.post('/addStep', Task.addStep);
router.delete('/deleteStep/:stepId', Task.deleteStep);
router.put('/updateStep', Task.updateStep);
router.get('/fetchSteps/:taskId', Task.fetchSteps);


/** * @swagger
 * tags:
 *   name: Tasks
 *   description: Endpoints de tarefas
 * /**
 * @swagger
 * /task/create:
 * post:
 * summary: Criar uma nova tarefa
 * tags: [Tasks]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * title:
 * type: string
 * example: Minha Tarefa
 * description:
 * type: string
 * example: Esta é uma tarefa de exemplo
 * userId:
 * type: string
 * example: 123456
 * responses:
 * 201:
 * description: Tarefa criada com sucesso
 * 400:
 * description: Dados inválidos
 * 500:
 * description: Erro no servidor
 * /**
 * @swagger
 * /task/complete/{taskId}:
 * patch:
 * summary: Marcar uma tarefa como concluída
 * tags: [Tasks]
 * parameters:
 * - in: path
 * name: taskId
 * required: true
 * description: ID da tarefa a ser marcada como concluída
 * schema:
 * type: string
 * example: 123456
 * responses:
 * 200:
 * description: Tarefa marcada como concluída com sucesso
 * 404:
 * description: Tarefa não encontrada
 * 500:
 * description: Erro no servidor
 * /**
 * @swagger
 * /task/open/{taskId}:
 * patch:
 * summary: Reabrir uma tarefa concluída
 * tags: [Tasks]
 * parameters:
 * - in: path
 * name: taskId
 * required: true
 * description: ID da tarefa a ser reaberta
 * schema:
 * type: string
 * example: 123456
 * responses:
 * 200:
 * description: Tarefa reaberta com sucesso
 * 404:
 * description: Tarefa não encontrada
 * 500:
 * description: Erro no servidor
 * /**
 * @swagger
 * /task/get/{taskId}:
 * get:
 * summary: Obter uma tarefa pelo ID
 * tags: [Tasks]
 * parameters:
 * - in: path
 * name: taskId
 * required: true
 * description: ID da tarefa a ser obtida
 * schema:
 * type: string
 * example: 123456
 * responses:
 * 200:
 * description: Tarefa obtida com sucesso
 * 404:
 * description: Tarefa não encontrada
 * 500:
 * description: Erro no servidor
 * /**
 * @swagger
 * /task/updateTask/{taskId}:
 * put:
 * summary: Atualizar uma tarefa existente
 * tags: [Tasks]
 * parameters:
 * - in: path
 * name: taskId
 * required: true
 * description: ID da tarefa a ser atualizada
 * schema:
 * type: string
 * example: 123456
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * title:
 * type: string
 * example: Título Atualizado
 * description:
 * type: string
 * example: Descrição Atualizada
 * responses:
 * 200:
 * description: Tarefa atualizada com sucesso
 * 400:
 * description: Dados inválidos
 * 404:
 * description: Tarefa não encontrada
 * 500:
 * description: Erro no servidor
 * /**
 * @swagger
 * /task/addStep:
 * post:
 * summary: Adicionar um passo a uma tarefa
 * tags: [Tasks]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * taskId:
 * type: string
 * example: 123456
 * step:
 * type: string
 * example: "Novo passo"
 * responses:
 * 201:
 * description: Passo adicionado com sucesso
 * 400:
 * description: Dados inválidos
 * 404:
 * description: Tarefa não encontrada
 * 500:
 * description: Erro no servidor
 * /**
 * @swagger
 * /task/deleteStep/{stepId}:
 * delete:
 * summary: Remover um passo de uma tarefa
 * tags: [Tasks]
 * parameters:
 * - in: path
 * name: stepId
 * required: true
 * description: ID do passo a ser removido
 * schema:
 * type: string
 * example: 123456
 * responses:
 * 204:
 * description: Passo removido com sucesso
 * 404:
 * description: Passo não encontrado
 * 500:
 * description: Erro no servidor
 * /**
 * @swagger
 * /task/updateStep:
 * put:
 * summary: Atualizar um passo de uma tarefa
 * tags: [Tasks]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * stepId:
 * type: string
 * example: 123456
 * title:
 * type: string
 * example: "Título do passo atualizado"
 * description:
 * type: string
 * example: "Descrição do passo atualizado"
 * responses:
 * 200:
 * description: Passo atualizado com sucesso
 * 400:
 * description: Dados inválidos
 * 404:
 * description: Passo não encontrado
 * 500:
 * description: Erro no servidor
 * /**
 * @swagger
 * /task/fetchSteps/{taskId}:
 * get:
 * summary: Obter todos os passos de uma tarefa
 * tags: [Tasks]
 * parameters:
 * - in: path
 * name: taskId
 * required: true
 * description: ID da tarefa cujos passos serão obtidos
 * schema:
 * type: string
 * example: 123456
 * responses:
 * 200:
 * description: Passos obtidos com sucesso
 * 404:
 * description: Tarefa não encontrada
 * 500:
 * description: Erro no servidor
 * /**
 * @swagger
 * /task/deleteTask:
 * delete:
 * summary: Deletar uma tarefa
 * tags: [Tasks]
 * parameters:
 * - in: query
 * name: taskId
 * required: true
 * description: ID da tarefa a ser deletada
 * schema:
 * type: string
 * example: 123456
 * responses:
 * 204:
 * description: Tarefa deletada com sucesso
 * 404:
 * description: Tarefa não encontrada
 * 500:
 * description: Erro no servidor
 * */

module.exports = router;


