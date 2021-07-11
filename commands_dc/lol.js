const http = require('http');

const getHappy = (sendMsg) => {

    const options = {
        hostname: 'www.boredapi.com',
        path: '/api/activity/',
        method: 'GET'
    }
    
    http.request(options, (response) => {
        const chunks = [];
        response.on('data', (data) => {
            console.log(data);
            chunks.push(data);
        })

        response.on('end', () => {
            sendMsg(Buffer.concat(chunks));
            console.log(Buffer.concat(chunks));
        })
    })
}

exports.module = {
    getHappy: getHappy
}