const moment = require('moment');

function convertObjectToArray(obj) {
    return Object.keys(obj).map(key => obj[key]);
} //!

function convert(obj) {
    const newObj = {
        product: convertObjectToArray(obj.product),
        human: convertObjectToArray(obj.human),
        posm: convertObjectToArray(obj.posm),
        context: obj.context
    }

    return newObj;
} //*

function findBrand(converted_obj, brand) {
    for (let i in converted_obj.product) {
        if (converted_obj.product[i].brand === brand)
            return true
    }
    return false;
} //!

function getBrands(converted_obj) {
    let result = [];
    if (findBrand(converted_obj, 'bia viet')) result.push("/images/bia-viet.svg");
    if (findBrand(converted_obj, 'heineken')) result.push("/images/heineken.svg");
    if (findBrand(converted_obj, 'tiger')) result.push("/images/tiger.svg");
    if (findBrand(converted_obj, 'larue',)) result.push("/images/larue.svg");
    if (findBrand(converted_obj, 'edelweiss',)) result.push("/images/edelweiss.svg");
    if (findBrand(converted_obj, 'bivina',)) result.push("/images/bivina.svg");
    if (findBrand(converted_obj, 'strongbow')) result.push("/images/strongbow.svg");
    return result;
} //*

function count_Heineiken_Drinker(converted_obj) {
    // count Heineiken beer bottle
    let count = 0;
    for (let i in converted_obj.product) {
        let product = converted_obj.product[i]
        if (product.brand === 'heineiken' && product.label === 'beer bottle') count++;
    }

    return count;
} //*

function count_emotions(converted_obj){
    let Emotions = {
        "happy": 0,
        "angry": 0,
        "enjoy": 0,
        "relax": 0,
        "neutral": 0,
        "undefined": 0,
    }

    for (let i in converted_obj.human){
        let human = converted_obj.human[i];
        if (human.emotion ==='happy') Emotions.happy++;
        if (human.emotion ==='angry') Emotions.angry++;
        if (human.emotion ==='enjoy') Emotions.enjoy++;
        if (human.emotion ==='relax') Emotions.relax++;
        if (human.emotion ==='neutral') Emotions.neutral++;
        if (human.emotion ==='undefined') Emotions.undefined++;
    }

    return Emotions;
}

module.exports = [convert, getBrands, count_Heineiken_Drinker, count_emotions]