const express = require('express');
const router = express.Router();

router.use('/project', require('./project.routes'));

router.use('/customer', require('./customer.routes'));

router.use('/ticket', require('./ticket.routes'));

router.use('/admin', require('./admin.routes'));

router.use('/employee', require('./employee.routes'));

router.use('/',require('./pages.routes'))

module.exports = router;