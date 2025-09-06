const express = require('express');
const ListController = require('../controllers/ListController');
const router = express.Router();

router.post('/create', ListController.create);
router.post('/add', ListController.addTask);
router.post('/remove', ListController.removeTask);
router.delete('/delete/:taskListId', ListController.deleteList);
router.put('/rename', ListController.renameList);
router.get('/get/:taskListId', ListController.getList);
router.get('/fetch/:taskListId', ListController.fetchTasks);
router.get('/user/:userId', ListController.find);
router.get('/all', ListController.all);

/**
 * @swagger
 * tags:
 *   name: Lists
 *   description: Endpoints de listas de tarefas
 */
/**
 * @swagger
 * /list/create:
 * post:
 * summary: Criar uma nova lista de tarefas
 * tags: [Lists]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * name:
 * type: string
 * example: Minha Lista
 * userId:
 * type: string
 * example: 123456
 * responses:
 * 201:
 * description: Lista criada com sucesso
 * 400:
 * description: Dados inválidos
 * 500:
 * description: Erro no servidor
 * /**
 * @swagger
 * /list/add:
 * post:
 * summary: Adicionar uma tarefa a uma lista
 * tags: [Lists]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * taskId:
 * type: string
 * example: 654321
 * listId:
 * type: string
 * example: 123456
 * responses:
 * 201:
 * description: Tarefa adicionada com sucesso
 * 400:
 * description: Dados inválidos
 * 500:
 * description: Erro no servidor
 * /**
 * @swagger
 * /list/remove:
 * post:
 * summary: Remover uma tarefa de uma lista
 * tags: [Lists]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * taskId:
 * type: string
 * example: 654321
 * listId:
 * type: string
 * example: 123456
 * responses:
 * 201:
 * description: Tarefa removida com sucesso
 * 400:
 * description: Dados inválidos
 * 500:
 * description: Erro no servidor
 * /**
 * @swagger
 * /list/delete/{taskListId}:
 * delete:
 * summary: Remover uma lista de tarefas
 * tags: [Lists]
 * parameters:
 * - in: path
 * name: taskListId
 * required: true
 * description: ID da lista de tarefas a ser removida
 * schema:
 * type: string
 * example: 123456
 * responses:
 * 204:
 * description: Lista removida com sucesso
 * 400:
 * description: Dados inválidos
 * 500:
 * description: Erro no servidor
 * /**
 * @swagger
 * /list/rename:
 * put:
 * summary: Renomear uma lista de tarefas
 * tags: [Lists]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * name:
 * type: string
 * example: Nova Lista
 * responses:
 * 200:
 * description: Lista renomeada com sucesso
 * 400:
 * description: Dados inválidos
 * 500:
 * description: Erro no servidor
 * /**
 * @swagger
 * /list/get/{taskListId}:
 * get:
 * summary: Obter uma lista de tarefas
 * tags: [Lists]
 * parameters:
 * - in: path
 * name: taskListId
 * required: true
 * description: ID da lista de tarefas a ser obtida
 * schema:
 * type: string
 * example: 123456
 * responses:
 * 200:
 * description: Lista obtida com sucesso
 * 404:
 * description: Lista não encontrada
 * 500:
 * description: Erro no servidor
 * /**
 * @swagger
 * /list/fetch/{taskListId}:
 * get:
 * summary: Obter as tarefas de uma lista
 * tags: [Lists]
 * parameters:
 * - in: path
 * name: taskListId
 * required: true
 * description: ID da lista de tarefas a ser obtida
 * schema:
 * type: string
 * example: 123456
 * responses:
 * 200:
 * description: Tarefas obtidas com sucesso
 * 404:
 * description: Lista não encontrada
 * 500:
 * description: Erro no servidor
 * /**
 * @swagger
 * /list/user/{userId}:
 * get:
 * summary: Obter listas de tarefas de um usuário
 * tags: [Lists]
 * parameters:
 * - in: path
 * name: userId
 * required: true
 * description: ID do usuário cujas listas de tarefas serão obtidas
 * schema:
 * type: string
 * example: 123456
 * responses:
 * 200:
 * description: Listas obtidas com sucesso
 * 404:
 * description: Usuário não encontrado
 * 500:
 * description: Erro no servidor
 * /**
 * @swagger
 * /list/all:
 * get:
 * summary: Obter todas as listas de tarefas
 * tags: [Lists]
 * responses:
 * 200:
 * description: Listas obtidas com sucesso
 * 500:
 * description: Erro no servidor
 *
 */


module.exports = router;