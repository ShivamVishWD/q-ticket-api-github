const router = require('express').Router();
const projectController = require('../controllers/project');
const token = require('../middleware/JWT');

router.get('/get', token.verifyToken, projectController.get);
router.post('/insert', token.verifyToken, projectController.insert);
router.patch('/update', token.verifyToken, projectController.update);
router.delete('/delete/:id', token.verifyToken, projectController.delete);
router.patch('/editteam', token.verifyToken, projectController.editTeam);

module.exports = router;