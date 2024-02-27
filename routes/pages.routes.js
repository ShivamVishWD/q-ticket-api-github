const router = require('express').Router();

router.get('/admin/login', async(req, res) => {
    const baseUrl = req.protocol + '://' + req.headers.host + '/';
    if(req.session.userotken == null)
        res.render('login', {url: baseUrl, usertoken: null, pagename: 'login', pagetitle: 'Login | Admin', loginfor: 'admin', userid: null, profile: null, username: null})
    else
        res.render('dashboard', {url: baseUrl, usertoken: req.session?.userotken, pagename: 'dashboard', pagetitle: 'Q-Ticket | Dashboard', userid: req.session?.userid, profile: req.session?.profile, username: req.session?.username})    
})
router.get('/', async(req, res) => {
    const baseUrl = req.protocol + '://' + req.headers.host + '/';
    if(req.session.userotken == null)
        res.render('login', {url: baseUrl, usertoken: null, pagename: 'login', pagetitle: 'Login | Team', loginfor: 'employee', userid: null, profile: null, username: null})
    else
        res.render('dashboard', {url: baseUrl, usertoken: req.session?.userotken, pagename: 'dashboard', pagetitle: 'Q-Ticket | Dashboard', userid: req.session?.userid, profile: req.session?.profile, username: req.session?.username})    
})
router.get('/dashboard', async(req, res) => {
    const baseUrl = req.protocol + '://' + req.headers.host + '/';
    if(req.session.userotken == null)
        res.redirect('/')
    else
        res.render('dashboard', {url: baseUrl, usertoken: req.session?.userotken, pagename: 'dashboard', pagetitle: 'Q-Ticket | Dashboard', userid: req.session?.userid, profile: req.session?.profile, username: req.session?.username})
})
router.get('/projects', async(req, res) => {
    const baseUrl = req.protocol + '://' + req.headers.host + '/';
    if(req.session.userotken == null)
        res.redirect('/')
    else
        res.render('projects', {url: baseUrl, usertoken: req.session?.userotken, pagename: 'projects', pagetitle: 'Q-Ticket | Projects', userid: req.session?.userid, profile: req.session?.profile, username: req.session?.username})
})
router.get('/employees', async(req, res) => {
    const baseUrl = req.protocol + '://' + req.headers.host + '/';
    if(req.session.userotken == null)
        res.redirect('/')
    else
        res.render('employees', {url: baseUrl, usertoken: req.session?.userotken, pagename: 'employees', pagetitle: 'Q-Ticket | Teams', userid: req.session?.userid, profile: req.session?.profile, username: req.session?.username})
})
router.get('/customers', async(req, res) => {
    const baseUrl = req.protocol + '://' + req.headers.host + '/';
    if(req.session.userotken == null)
        res.redirect('/')
    else
        res.render('customers', {url: baseUrl, usertoken: req.session?.userotken, pagename: 'customers', pagetitle: 'Q-Ticket | Customers', userid: req.session?.userid, profile: req.session?.profile, username: req.session?.username})
})

router.get('/tickets', async(req, res) => {
    const baseUrl = req.protocol + '://' + req.headers.host + '/';
    if(req.session.userotken == null)
        res.redirect('/')
    else
        res.render('ticket', {url: baseUrl, usertoken: req.session?.userotken, pagename: 'tickets', pagetitle: 'Q-Ticket | Tickets', userid: req.session?.userid, profile: req.session?.profile, username: req.session?.username})
})

router.get('/admin/logout', async(req, res) => {
    const baseUrl = req.protocol + '://' + req.headers.host + '/';
    req.session.destroy();
    res.redirect('/')
})

router.get('/employee/logout', async(req, res) => {
    const baseUrl = req.protocol + '://' + req.headers.host + '/';
    req.session.destroy();
    res.redirect('/')
})


module.exports = router;