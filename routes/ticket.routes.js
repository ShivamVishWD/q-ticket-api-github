const router = require('express').Router();
const ticketController = require('../controllers/ticket');
const token = require('../middleware/JWT');
const upload = require('../middleware/fileuploader');

router.get('/get', token.verifyToken, ticketController.get);
router.get('/count', token.verifyToken, ticketController.count);
router.post('/insert', token.verifyToken, upload.any('files'), ticketController.insert);
router.patch('/update', token.verifyToken, upload.any('files'), ticketController.update);
router.delete('/delete/:id', token.verifyToken, ticketController.delete);
router.patch('/log', token.verifyToken, ticketController.updateLog);
router.patch('/comment', token.verifyToken, ticketController.updateComment);

module.exports = router;