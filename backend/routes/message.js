const router = require('express').Router();
const controller = require('../controllers/message');
const { verifyUserJwt } = require('../utils/verify-jwt');
// CRUD

router.use(verifyUserJwt);
router.post('/', controller.create);
router.get('/getAll/:email', controller.getAll);
router.get('/:id', controller.getOne);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;
