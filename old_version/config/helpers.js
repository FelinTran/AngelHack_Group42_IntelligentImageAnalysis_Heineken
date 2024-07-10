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
        canned_beer: 0,
        crate: 0,
    }

    for (let i in converted_obj.product) {
        let product = converted_obj.product[i];
        if (product.label === "carton box") Label.carton_box++;
        if (product.label ===  "beer crate") Label.beer_crate++;
        if (product.label === "beer bottle") Label.beer_bottle++;
        if (product.label === "canned beer" || product.label === "canned" || product.label === "canned") Label.canned_beer++;
        if (product.label === 'undefined') Label.crate++;
    }

    return Label;

}

module.exports = { getBrands, count_Heineiken_Drinker, count_emotions, countLabel}