onmessage = function (evt) {
    fetchApi(evt.data.url, evt.data.model);
}

const fetchApi = async (url, data) => {

    const option = {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    };

    //console.log(" fetchApi 1:");
    //console.log(option);

    //console.log(" fetchApi 2:");
    //console.log(url);
    const result = await response(url, option);
    postMessage({ res: result/* Data */, model: data, url: "" })

};

const response = (url, option) => fetchManager(url, option);

var fetchManager = (url, option) => new Promise(function (resolve) {
    fetch(url, option).then(r => resolve(r));
})
    .then(respond => {
        //console.log(" fetchManager 1:");
        //console.log(respond);

        //console.log(" fetchManager 2:");
        //console.log(respond.json());
        if (respond.status !== 200)
            return null;

        return respond.json();
    })
    .then(result => {
        //console.log(" fetchManager 3:");
        //console.log(result);
        return result;
    })
    .catch((cth) => {
        //console.log(" fetchManager 4:");
        //console.log(cth);
        return null
    });
