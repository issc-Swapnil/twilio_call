const express = require('express');
const twilio = require('./Twilio');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('./utils/Jwt');
 
const app = express();
const server = http.createServer(app);
const io = socketIo(server); 
 
io.on('connection',(socket) => {
    // console.log('socket connected', socket.id);
    socket.on('disconnect', () => {
        console.log('socket disconnected' , socket.id);
    });
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const PORT = 3001;
app.get('/test', (req, res) => {
    console.log('Started');
    res.send('Welcome to Twilio');
});

app.post('/login', async(req ,res) => {
    console.log('Loging in');
    const {to, username, channel} = req.body;
    const data = await twilio.sendVerifyAsync('+91'+to, channel);
    res.send('Send Code');
});

app.post('/verify', async(req, res) => {
    console.log('Verifing Code');
    const {to, code, username} = req.body;
    const data = await twilio.verifyCodeAsync('+91'+to, code);
    
    if(data.status === 'approved'){
        const token = jwt.createJwt(username);
        console.log(token);
        return res.send({ token });
    }
    res.status(401).send('Invalid token');
});

app.post('/call-new', (req, res) => {
    console.log('receive a call', req.body);

    io.emit('call-new', {data: req.body})
    const response = twilio.voiceResponse('Thank you for your call');

     res.type('application/xml');
     res.send(response.toString());
});

app.post('/call-status-changed', (req, res) => {
    console.log('Call Status changes');
});

app.post('/enqueue', (req, res) => {
    const response = twilio.enqueueCall();

    res.type('application/xml');
    res.send(response.toString());
});

server.listen(PORT, () =>{
    console.log(`Listening on PORT : ${PORT}`);
});