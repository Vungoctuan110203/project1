const mqtt = require('mqtt')
const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)
app.use(express.static('public'));

const options = {
    port: 1883,
    host: 'broker.mqttdashboard.com',
    clientId: 'clientId-gAe5UTm3Ou',
    username: 'thuy',
    password: '123456',
}
const client = mqtt.connect(options);
client.on('connect', () => {
    console.log('MQTT connected!!');
});
const sensors = 'sensorData'
const led1 = 'Led1'
const led2 = 'Led2'
client.subscribe(sensors, () => {
    client.on('message', (topic, message, packet) => {
        console.log(message.toString());
        io.sockets.emit('updateSensor', message.toString().split(' '))
        // insertTB(`'${topic}', ${message.toString().split(' ')}`);
    });
});
io.on('connection', socket => {
    console.log(`user ${socket.id} connected`)
});

io.on('connection', socket => {
    socket.on('led1', msg => {
        io.sockets.emit('led1', msg);
        msg === 'on' && client.publish(led1, msg)
        msg === 'off' && client.publish(led1, msg)
    });
    socket.on('led2', msg => {
        io.sockets.emit('led2', msg);
        msg === 'on' && client.publish(led2, msg)
        msg === 'off' && client.publish(led2, msg)
    })
})

server.listen(3001, () => {
    console.log('listening on *:3001')
});


