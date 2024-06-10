const router = require('express').Router();
const customerController = require('../controllers/customer');
const token = require('../middleware/JWT');

router.get('/get', token.verifyToken, customerController.get);
router.get('/count', token.verifyToken, customerController.count);
router.post('/insert', token.verifyToken, customerController.insert);
router.post('/login', customerController.login);
router.patch('/update', token.verifyToken, customerController.update);
router.patch('/verify', token.verifyToken, customerController.verify);
router.delete('/delete/:id', token.verifyToken, customerController.delete);

module.exports = router;