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


module.exports = { convertObjectToArray, convert, getBrands, findBrand}