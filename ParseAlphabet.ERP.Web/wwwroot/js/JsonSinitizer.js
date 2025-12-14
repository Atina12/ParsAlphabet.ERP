/**
 * 
 * @param {string} str Object to String
 * @param {object} propArray Object Parameter
 * @param {number} maxLn Object Length
 */
function safeJSONParse(str, propArray, maxLn) {
    let parsedObj = "", safeObj = {};
    try {
        if (maxLn && str.length > maxLn) {
            return null;
        } else {
            parsedObj = JSON.parse(str);

            if (typeof parsedObj !== "object" || Array.isArray(parsedObj))
                safeObj = parseObj;
            else {

                let propArrayLn = propArray.length, prop = "";

                for (let i = 0; i < propArrayLn; i++) {
                    prop = propArray[i];
                    if (parsedObj.hasOwnProperty(prop))
                        safeObj[prop] = parsedObj[prop];
                }
            }
            return safeObj;
        }
    }
    catch (e) {
        console.log("Sin : ", e.message);
        return null;
    }
}
