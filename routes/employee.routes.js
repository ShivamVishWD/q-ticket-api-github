const router = require('express').Router();
const employeeController = require('../controllers/employee');
const token = require('../middleware/JWT');

router.get('/get', token.verifyToken, employeeController.get);
router.get('/count', token.verifyToken, employeeController.count);
router.post('/insert', token.verifyToken, employeeController.insert);
router.post('/login', employeeController.login);
router.patch('/update', token.verifyToken, employeeController.update);
router.delete('/delete/:id', token.verifyToken, employeeController.delete);

module.exports = router;