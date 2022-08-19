const router = require('express').Router();
const controller = require('../controllers/user');
const { verifyUserJwt } = require('../utils/verify-jwt');

// CRUD
router.post('/', controller.create);

router.put('/:id', verifyUserJwt, controller.update);

router.delete('/:id', verifyUserJwt, controller.delete);

// Rotas de confirmação
router.get('/verifyAccount/:token', controller.verifyAccount);

router.post('/login', controller.login);

module.exports = router;
