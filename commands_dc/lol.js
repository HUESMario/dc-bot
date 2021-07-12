const superagent = require('superagent');

const getHappy = () => {
    return new Promise(function(resolve, reject){
    superagent.get('www.boredapi.com/api/activity').then((object)=>{
            resolve(JSON.parse(object.text));
        }).catch(e => {reject(e)})
    })
}

exports.module = {
    getHappy: getHappy
}