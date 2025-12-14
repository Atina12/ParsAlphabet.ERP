async function getJsonDataAsync(p_url, dtype, object, errorValue, httpMethod = "post") {
    
    apiLoader(true)

    //let xhr = $.ajax({
    //    url: p_url,
    //    type: httpMethod,
    //    dataType: dtype,
    //    contentType: "application/json",
    //    cache: false,
    //    async: true,
    //    data: JSON.stringify(object),
    //})

    //getJsonDataAsyncPromise(p_url, dtype, object, httpMethod)
    //    .then(res => {
    //        apiLoader(false)

    //    })


    //let xhr = $.ajax({
    //    url: p_url,
    //    type: httpMethod,
    //    dataType: dtype,
    //    contentType: "application/json",
    //    cache: false,
    //    async: true,
    //    data: JSON.stringify(object),
    //});


    //if (xhr.readyState == 0) {
    //    //Client has been created. open() not called yet.
    //    throw JSON.parse("");
    //}
    //else if (xhr.readyState == 1) {
    //    //open() has been called.
    //    throw JSON.parse("");
    //}
    //else if (xhr.readyState == 2) {
    //    //send() has been called, and headers and status are available.
    //    throw JSON.parse("");
    //}
    //else if (xhr.readyState == 3) {
    //    //Downloading; responseText holds partial data.
    //    throw JSON.parse("");
    //}
    //else if (xhr.readyState == 4 && xhr.status == 200) {
    //    //	The operation is complete.
    //    return xhr.responseJSON;
    //}

    //if (xhr.readyState == 4 && xhr.status == 200) {
    //	The operation is complete.
    //    return xhr.responseJSON;
    //}
    //else
    //throw JSON.parse("");


    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let otp = await $.ajax({
        url: p_url,
        type: httpMethod,
        dataType: dtype,
        contentType: "application/json",
        cache: false,
        data: JSON.stringify(object),
        success: function (res) {
            apiLoader(false)
            return res;
        },
        error: function (xhr) {
            error_handler(xhr, p_url);
            apiLoader(false)
            throw JSON.parse(errorValue);
        }
    });

    return otp;
}

//function getJsonDataAsyncPromise(p_url, dtype, object, httpMethod) {

//    let xhr = $.ajax({
//        url: p_url,
//        type: httpMethod,
//        dataType: dtype,
//        contentType: "application/json",
//        cache: false,
//        data: JSON.stringify(object),
//    })

//    return new Promise((resolve, reject) => {

//        resolve(xhr)

//    })
//}
