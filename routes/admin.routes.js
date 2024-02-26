const router = require('express').Router();
const adminController = require('../controllers/admin');
const token = require('../middleware/JWT');

router.get('/get', token.verifyToken, adminController.get);
router.post('/insert', adminController.insert);
router.post('/login', adminController.login);
router.patch('/update', token.verifyToken, adminController.update);
router.delete('/delete/:id', token.verifyToken, adminController.delete);

module.exports = router;