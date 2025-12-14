importScripts('/js/xlsx.full.min.js');
postMessage({ typeResult: 'ready' });
onmessage = function (evt) {
    var value;
    try {
        value = XLSX.read(evt.data.data, evt.data.readtype);
    }
    catch (e) {
        postMessage({ typeResult: "e", data: e.stack });
    }
    postMessage({ typeResult: evt.data.typeResult, data: JSON.stringify(value) });
}