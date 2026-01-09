async function getJsonDataAsync(p_url, dataType, object, errorValue) {

    var output = await $.ajax({
        url: p_url,
        type: "post",
        dataType: dataType,
        contentType: "application/json",
        cache: false,
        data: JSON.stringify(object),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, p_url);
            return JSON.parse(errorValue);
        }
    });

    return output;
}
