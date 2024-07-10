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

function count_emotions(converted_obj) {
    let Emotions = {
        "happy": 0,
        "angry": 0,
        "enjoy": 0,
        "relax": 0,
        "neutral": 0,
        "undefined": 0,
    }

    for (let i in converted_obj.human) {
        let human = converted_obj.human[i];
        if (human.emotion === 'happy') Emotions.happy++;
        if (human.emotion === 'angry') Emotions.angry++;
        if (human.emotion === 'enjoy') Emotions.enjoy++;
        if (human.emotion === 'relax') Emotions.relax++;
        if (human.emotion === 'neutral') Emotions.neutral++;
        if (human.emotion === 'undefined') Emotions.undefined++;
    }

    return Emotions;
}

function countLabel(converted_obj) {
    let Label = {
        carton_box: 0,
        beer_crate: 0,
        beer_bottle: 0,
        beer_canned: 0,
    }

    for (let i in converted_obj.product) {
        let product = converted_obj.product[i];
        if (product.label === "carton box") Label.carton_box++;
        if (product.label ===  "beer crate" || product.label ===  "crate") Label.beer_crate++;
        if (product.label === "beer bottle") Label.beer_bottle++;
        if (product.label === "canned beer" || product.label === "beer canned" || product.label === "canned") Label.canned_beer++;
    }

    return Label;

}

function detect_emotions(obj)
{
    let emotions = [];
    for (let i in obj.human)
        {
            let human = obj.human[i];
            emotions.push(human.emotion)
        }
    return [...new Set(emotions)]
}


module.exports = { convertObjectToArray, convert, getBrands, findBrand, count_emotions, countLabel, detect_emotions, count_Heineiken_Drinker}