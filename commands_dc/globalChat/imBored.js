const superagent = require('superagent');

/**
 * Function to get an Activity if you feel Bored.
 * calls API and returns object in Best case.
 * Otherwise it will return null.
 * @returns object
 */
const imBored = () => {
    return new Promise(function(resolve, reject){
    superagent.get('www.boredapi.com/api/activity').then((object)=>{
            resolve(JSON.parse(object.text));
        }).catch(e => {reject(e)})
    })
}

module.exports = {
    imBored: imBored
}