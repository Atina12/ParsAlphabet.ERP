
function getHIDWS(personModel, providerModel, insurerModel, referringModel, inQueryId) {

    var url = `${viewData_baseUrl_MC}/AdmissionApi/gethid`


    var modelGetHID = {
        person: personModel,
        provider: providerModel,
        insurer: insurerModel,
        referring: referringModel,
        inqueryId: inQueryId
    }

    var output = $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        async: false,
        cache: false,
        data: JSON.stringify(modelGetHID),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return JSON.parse(null);
        }
    });

    return output.responseJSON;
}

function getHIDUrgentWS(personModel, providerModel, insurerModel, referringModel) {

    var url = `${viewData_baseUrl_MC}/AdmissionApi/gethidurgent`


    var modelGetHID = {
        person: personModel,
        provider: providerModel,
        insurer: insurerModel,
        referring: referringModel,
        inqueryId: ""
    }

    var output = $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        async: false,
        cache: false,
        data: JSON.stringify(modelGetHID),
        success: function (result) {
            callback();
            return result;
        },
        error: function (xhr) {
            callback();
            error_handler(xhr, url);
            return JSON.parse(null);
        }
    });

    return output.responseJSON;
}

function eliminateHIDWS(hidModel, personModel, reason, description) {

    var url = `${viewData_baseUrl_MC}/AdmissionApi/eliminatehid`


    var eliminateHIDModel = {
        hid: hidModel,
        person: personModel,
        reasonValue: reason,
        description: description
    }

    var output = $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        async: false,
        cache: false,
        data: JSON.stringify(eliminateHIDModel),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return JSON.parse(null);
        }
    });

    return output.responseJSON;
}