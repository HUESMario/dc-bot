const extract = (rawPos) => {
    console.log(rawPos);
    if(Array.isArray(rawPos))
    {
        return rawPos[0].split(':');
    }
    else if(typeof(rawPos) === 'string')
    {
        return rawPos.split(':');
    }
}
exports.module = {extract: extract}