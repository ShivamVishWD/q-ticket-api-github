const router = require('express').Router();
const ticketController = require('../controllers/ticket');
const token = require('../middleware/JWT');

router.get('/get', token.verifyToken, ticketController.get);
router.post('/insert', token.verifyToken, ticketController.insert);
router.patch('/update', token.verifyToken, ticketController.update);
router.delete('/delete/:id', token.verifyToken, ticketController.delete);
router.patch('/log', token.verifyToken, ticketController.updateLog);

module.exports = router;