const router = require('express').Router();

router.get('/admin/login', async(req, res) => {
    const baseUrl = req.protocol + '://' + req.headers.host + '/';
    if(req.session.userotken == null)
        res.render('login', {url: baseUrl, usertoken: null, loginfor: 'admin'})
    else
        res.render('dashboard', {url: baseUrl, usertoken: req.session?.userotken, userid: req.session?.userid, profile: req.session?.profile, username: req.session?.username})    
})
router.get('/', async(req, res) => {
    const baseUrl = req.protocol + '://' + req.headers.host + '/';
    if(req.session.userotken == null)
        res.render('login', {url: baseUrl, usertoken: null, loginfor: 'employee'})
    else
        res.render('dashboard', {url: baseUrl, usertoken: req.session?.userotken, userid: req.session?.userid, profile: req.session?.profile, username: req.session?.username})    
})
router.get('/dashboard', async(req, res) => {
    const baseUrl = req.protocol + '://' + req.headers.host + '/';
    if(req.session.userotken == null)
        res.redirect('/admin/login')
    else
        res.render('dashboard', {url: baseUrl, usertoken: req.session?.userotken, userid: req.session?.userid, profile: req.session?.profile, username: req.session?.username})
})
router.get('/projects', async(req, res) => {
    const baseUrl = req.protocol + '://' + req.headers.host + '/';
    if(req.session.userotken == null)
        res.redirect('/admin/login')
    else
        res.render('projects', {url: baseUrl, usertoken: req.session?.userotken, userid: req.session?.userid, profile: req.session?.profile, username: req.session?.username})
})
router.get('/employees', async(req, res) => {
    const baseUrl = req.protocol + '://' + req.headers.host + '/';
    if(req.session.userotken == null)
        res.redirect('/admin/login')
    else
        res.render('employees', {url: baseUrl, usertoken: req.session?.userotken, userid: req.session?.userid, profile: req.session?.profile, username: req.session?.username})
})
router.get('/customers', async(req, res) => {
    const baseUrl = req.protocol + '://' + req.headers.host + '/';
    if(req.session.userotken == null)
        res.redirect('/admin/login')
    else
        res.render('customers', {url: baseUrl, usertoken: req.session?.userotken, userid: req.session?.userid, profile: req.session?.profile, username: req.session?.username})
})

router.get('/tickets', async(req, res) => {
    const baseUrl = req.protocol + '://' + req.headers.host + '/';
    if(req.session.userotken == null)
        res.redirect('/admin/login')
    else
        res.render('ticket', {url: baseUrl, usertoken: req.session?.userotken, userid: req.session?.userid, profile: req.session?.profile, username: req.session?.username})
})

router.get('/admin/logout', async(req, res) => {
    const baseUrl = req.protocol + '://' + req.headers.host + '/';
    req.session.destroy();
    res.redirect('/admin/login')
})

router.get('/employee/logout', async(req, res) => {
    const baseUrl = req.protocol + '://' + req.headers.host + '/';
    req.session.destroy();
    res.redirect('/')
})


module.exports = router;