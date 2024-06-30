function convertObjectToArray(obj) {
    if (!obj) return null;
    return Object.keys(obj).map(key => obj[key]);
} //!

function convert(obj) {
    const newObj = {
        product: obj.product? convertObjectToArray(obj.product): null,
        human: obj.human? convertObjectToArray(obj.human): null,
        posm: obj.posm? convertObjectToArray(obj.posm): null,
        context: obj.context
    }

    return newObj;
} //*

module.exports = { convertObjectToArray, convert }