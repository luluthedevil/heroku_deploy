const router = require('express').Router();
const userController = require('../controllers/user');
const adminController = require('../controllers/admin');
const { verifyAdmin } = require('../utils/verify-jwt');

// CRUD
router.get('/users/', verifyAdmin, userController.getAll);

router.get('/users/:id', verifyAdmin, userController.getOne);

router.post('/users/', verifyAdmin, userController.create);

router.put('/users/:id', verifyAdmin, userController.update);

router.delete('/users/:id', verifyAdmin, userController.delete);

// Rotas de confirmação
router.post('/login', adminController.login);

module.exports = router;
