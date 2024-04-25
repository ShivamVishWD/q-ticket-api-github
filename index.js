require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const session = require('express-session');
require('./config/mongodb');
const authRouter = require('./routes/auth');

const statusMonitor = require('express-status-monitor')();
app.use(statusMonitor);

const port = process.env.PORT || 5001;

// Setup CORS
app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type,Accept,Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,DELETE,POST');
        return res.status(200).json({});
    }
    next();
});

app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))

app.use(session({
    secret : 'secret',
    resave : true,
    saveUninitialized : true
}));

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: false, limit: '50mb'}));

// Setup View Engine
app.set('Views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// app.use(logger('dev'));

app.use(express.static(path.join(__dirname, '/public')));

app.use('/api', require('./routes/routes'))
app.use('/', require('./routes/routes'))

app.use('/auth', authRouter);

app.use('*', async (req, res)=>{
    res.status(200).send({status:400, message:'URL does not exists !!'})
})

app.listen(port, () =>{
    console.log(`Server started at port ${port}`);
})
