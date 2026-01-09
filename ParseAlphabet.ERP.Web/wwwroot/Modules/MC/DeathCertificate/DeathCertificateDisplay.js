var viewData_controllername = "DeathCertificateApi",
    viewData_get_DeathGet = `${viewData_baseUrl_MC}/${viewData_controllername}/get`,
    viewData_get_AdMissingetDiagnosis = `${viewData_baseUrl_MC}/AdmissionApi/getdiagnosis`,
    viewData_get_StatusId = `${viewData_baseUrl_MC}/${viewData_controllername}/getdeathcausestatusdropdown`,
    viewData_get_burialAttesterId = `${viewData_baseUrl_MC}/AttenderApi/getattenderbooking`,
    viewData_getDeathCertificateCheckExist = `${viewData_baseUrl_MC}/${viewData_controllername}/checkexist`,
    emptyRow = `<tr id="emptyRow"><td colspan="thlength" class="text-center">سطری وجود ندارد</td></tr>`,
    admissionIdentity = 0, deathId = +$("#deathId").val(), deathHID = "",
    currentMedicalHistoryRowNumber = 0, currentDeathCauseRowNumber = 0,

    typeSaveMedicalHistory = "INS", typeSaveDeathCause = "INS", typeSaveInfantDelivery = "INS",

    arr_TempMedicalHistory = [], arr_TempDeathCertificate = [], arr_TempDeathCause = [], arr_TempInfantDelivery = [];

function headerindexChoose(e) {
    let elm = $(e.target);

    if (e.keyCode === KeyCode.Enter) {
        let checkExist = false;
        checkExist = checkExistDeathCertificateId(+elm.val());
        if (checkExist) {
            getDeathData(+elm.val(), 0);
            elm.val("");
        }
        else
            alertify.warning("این کد در سیستم وجود ندارد").delay(alertify_delay);
    }
}


function checkExistDeathCertificateId(id) {

    let outPut = $.ajax({
        url: viewData_getDeathCertificateCheckExist,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getPrescriptionCheckExist);
        }
    });
    return outPut.responseJSON;

}

function display_pagination(opr) {

    var elemId = $("#deathId").val();
    display_paginationAsync(opr, elemId);
}
async function display_paginationAsync(opr, elemId) {

    headerPagination = 0;
    switch (opr) {
        case "first":
            headerPagination = 1;
            break;
        case "previous":
            headerPagination = 2;
            break;
        case "next":
            headerPagination = 3;
            break;
        case "last":
            headerPagination = 4;
            break;
    }
    getDeathData(elemId, headerPagination);
}


async function bindDeathElement() {

    if (deathId !== 0)
        getDeathData(deathId);
}

var getDeathData = (elemId, headerPagination = 0) => {

    let model = {
        deathCertificateId: elemId,
        headerPagination: headerPagination
    }

    $.ajax({
        url: viewData_get_DeathGet,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (data) {
            resetDeathForm("tableDeathCertificate");
            fillDeath(data);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_get_DeathGet);
        }
    });
};

var fillDeath = (data) => {

    if (data !== null) {

        $("#deathId").val(data.id);
        $("#userFullName").val(`${data.userId} - ${data.userFullName}`);
        $("#creatDateTime").val(data.createDatePersian);
        $("#deathBox").removeClass("displaynone");
        $("#switchList").val(`${data.nationalId != 0 ? "دارد" : "ندارد"}`);

        deathHID = data.relatedHID;

        $("#burialAttesterId").val(`${data.burialAttesterId} - ${data.burialAttesterFullName}`).trigger('change');
        $("#deathLocationId").val(`${data.deathLocationId} - ${data.deathLocationName}`).trigger('change');
        $("#sourceOfNotificationId").val(`${data.sourceOfNotificationId} - ${data.sourceofDeathNotificationName}`).trigger('change');
        $("#deathDateTime").val(data.deathDateTimePersian);
        $("#issueDate").val(data.issueDatePersian);
        $("#comment").val(data.comment);
        $("#serialNumber").val(data.serialNumber);
        $("#householdHeadNationalCode").val(data.householdHeadNationalCode);

        $("#genderId").val(`${data.genderId == 1 ? "مرد" : "زن"}`);
        $("#firstName").val(data.firstName);
        $("#lastName").val(data.lastName);
        $("#nationalId").val(data.nationalId);
        $("#birthDate").val(data.birthDatePersian);

        var datadb, LineLength;
        // InfantDelivery
        if (data.deathInfantDeliveryLines != null) {
            LineLength = data.deathInfantDeliveryLines.length;
            for (var dld = 0; dld < LineLength; dld++) {
                datadb = data.deathInfantDeliveryLines[dld];

                var model = {
                    headerId: datadb.headerId,
                    rowNumber: datadb.rowNumber,
                    infantWeight: datadb.infantWeight,
                    infantWeightUnitId: datadb.infantWeightUnitId,
                    infantWeightUnitName: datadb.infantWeightUnitName,
                    deliveryNumber: datadb.deliveryNumber,
                    deliveryPriority: datadb.deliveryPriority,
                    deliveryAgentId: datadb.deliveryAgentId,
                    deliveryAgentName: datadb.deliveryAgentId + " - " + datadb.deliveryAgentName,
                    deliveryLocationId: datadb.deliveryLocationId,
                    deathLocationName: datadb.deliveryLocationId + " - " + datadb.deathLocationName,
                    motherNationalCode: datadb.motherNationalCode,
                    motherFirstName: datadb.motherFirstName,
                    motherLastName: datadb.motherLastName,
                    motherGenderId: 2,
                    motherBirthDatePersian: datadb.motherBirthDatePersian,
                    motherMobileNumber: datadb.motherMobileNumber,
                };

                arr_TempInfantDelivery.push(model);
                appendTempInfantDelivery(model);
                model = {};
            }
        }
        // InfantDelivery


        // deathCause
        if (data.deathCauseLines != null) {
            LineLength = data.deathCauseLines.length;
            for (var dld = 0; dld < LineLength; dld++) {
                datadb = data.deathCauseLines[dld];

                var model = {
                    headerId: datadb.headerId,
                    rowNumber: datadb.rowNumber,
                    statusId: datadb.statusId,
                    deathCauseStatusName: datadb.statusId + " - " + datadb.deathCauseStatusName,
                    durationDeathUnitId: datadb.durationDeathUnitId,
                    causeId: datadb.causeId,
                    causeName: datadb.causeId + " - " + datadb.causeName,
                    durationDeath: datadb.durationDeath,
                    durationDeathUnitName: datadb.durationDeath + " - " + datadb.durationDeathUnitName,
                    durationDeathUnitDescription: datadb.durationDeathUnitDescription,

                };

                arr_TempDeathCause.push(model);
                appendTempDeathCause(model);
                model = {};
            }
        }
        // deathCause


        // medicalHistory
        if (data.deathMedicalHistoryLines != null) {
            LineLength = data.deathMedicalHistoryLines.length;
            for (var dld = 0; dld < LineLength; dld++) {
                datadb = data.deathMedicalHistoryLines[dld];

                var model = {
                    headerId: datadb.headerId,
                    rowNumber: datadb.rowNumber,
                    conditionId: datadb.conditionId,
                    conditionName: datadb.conditionId + " - " + datadb.conditionName,
                    description: datadb.description,
                    dateOfOnsetPersian: datadb.dateOfOnsetPersian,
                    onsetDurationToPresent: datadb.onsetDurationToPresent,
                    onsetDurationToPresent: datadb.onsetDurationToPresent,
                    onsetDurationToPresentUnitId: datadb.onsetDurationToPresentUnitId,
                    onsetDurationToPresentUnitName: datadb.onsetDurationToPresentUnitId + " - " + datadb.onsetDurationToPresentUnitName,
                    onsetDurationToPresentUnitDescription: datadb.onsetDurationToPresentUnitDescription,
                };

                arr_TempMedicalHistory.push(model);
                appendTempMedicalHistory(model);
                model = {};
            }
        }
        // medicalHistory

    }
};



async function loadingAsync(loading, elementId) {

    if (loading)
        $(`#${elementId} i`).addClass(`fa fa-spinner fa-spin`);
    else
        $(`#${elementId} i`).removeClass("fa fa-spinner fa-spin")
}

function plusR(item) {
    if ($(item).nextAll(".slideToggle").hasClass("open")) {
        $(item).nextAll(".slideToggle").slideUp().removeClass("open");
        $(item).children(".fas").removeClass("fa-minus").addClass("fa-plus");
    }
    else {
        $(item).nextAll(".slideToggle").addClass("current");
        $(".slideToggle:not(.current)").slideUp().removeClass("open");
        $(".slideToggle:not(.current)").siblings(".btn").html("<i class='fas fa-plus'></i>");

        $(item).nextAll(".slideToggle").slideToggle().toggleClass("open");

        if ($(item).nextAll(".slideToggle").hasClass("open")) {
            $(item).children(".fas").removeClass("fa-plus").addClass("fa-minus");
            $(item).nextAll(".open").css("display", "block");
        }
        else
            $(item).children(".fas").removeClass("fa-minus").addClass("fa-plus");

        let firstInput = $(item).nextAll(".slideToggle").find("[tabindex]:not(:disabled)").first();

        firstInput.hasClass("select2") ? $(`#${firstInput.attr("id")}`).select2('focus') : firstInput.focus();

        $(item).nextAll(".slideToggle").removeClass("current");
    }
}

//  DeathCause START *************

function modelAppendDeathCause(rowNumber, typeSave) {

    var modelDeathCause = {
        headerId: 0,
        rowNumber: rowNumber,
        causeId: +$("#causeId").val(),
        causeName: $("#causeId").select2('data').length > 0 ? $("#causeId").select2('data')[0].text : "",
        statusId: +$("#statusId").val(),
        deathCauseStatusName: $("#statusId").select2('data').length > 0 ? $("#statusId").select2('data')[0].text : "",
        durationDeath: +$("#durationDeath").val(),
        durationDeathUnitId: $("#durationDeathUnitId").val(),
        durationDeathUnitName: $("#durationDeathUnitId").select2('data').length > 0 ? $("#durationDeathUnitId").select2('data')[0].text : "",
    }

    if (typeSave == "INS")
        arr_TempDeathCause.push(modelDeathCause);

    appendTempDeathCause(modelDeathCause, typeSaveDeathCause);
    typeSaveDeathCause = "INS";
}

var appendTempDeathCause = (data, tSave = "INS") => {

    var dataOutput = "";
    if (data) {
        if (tSave == "INS") {
            var emptyRow = $("#tempdeathCause").find("#emptyRow");

            if (emptyRow.length > 0)
                $("#tempdeathCause").html("");

            dataOutput = `<tr id="ah_${data.rowNumber}">
                          <td>${data.rowNumber}</td>
                          <td>${data.causeId != 0 ? data.causeName : ""}</td>
                          <td>${data.statusId != 0 ? `${data.deathCauseStatusName}` : ""}</td>
                          <td>${data.durationDeath}</td>
                          <td>${data.durationDeathUnitId != 0 ? `${data.durationDeathUnitDescription}` : ""}</td>
                     </tr>`

            $(dataOutput).appendTo("#tempdeathCause");
        }
        resetDeathForm("deathCause");
    }
}

function modelAppendInfantDelivery(rowNumber, typeSave) {

    var modelInfantDelivery = {
        headerId: 0,
        rowNumber: rowNumber,
        infantWeight: +$("#infantWeight").val(),
        infantWeightUnitId: +$("#infantWeightUnitId").val(),
        infantWeightUnitName: $("#infantWeightUnitId").select2('data').length > 0 ? $("#infantWeightUnitId").select2('data')[0].text : "",
        deliveryNumber: +$("#deliveryNumber").val(),
        deliveryPriority: +$("#deliveryPriority").val(),
        deliveryAgentId: +$("#deliveryAgentId").val(),
        deliveryAgentName: $("#deliveryAgentId").select2('data').length > 0 ? $("#deliveryAgentId").select2('data')[0].text : "",
        deliveryLocationId: +$("#deliveryLocationId").val(),
        deathLocationName: $("#deliveryLocationId").select2('data').length > 0 ? $("#deliveryLocationId").select2('data')[0].text : "",
        motherNationalCode: $("#motherNationalCode").val(),
        motherFirstName: $("#motherFirstName").val(),
        motherLastName: $("#motherLastName").val(),
        motherBirthDatePersian: $("#motherBirthDate").val(),
        motherMobileNumber: $("#motherMobileNumber").val(),

    }

    if (typeSave == "INS")
        arr_TempInfantDelivery.push(modelInfantDelivery);

    appendTempInfantDelivery(modelInfantDelivery, typeSaveInfantDelivery);
    typeSaveInfantDelivery = "INS";
}

var appendTempInfantDelivery = (data, tSave = "INS") => {

    var dataOutput = "";
    if (data) {
        if (tSave == "INS") {
            var emptyRow = $("#tempinfantDelivery").find("#emptyRow");

            if (emptyRow.length > 0)
                $("#tempinfantDelivery").html("");

            dataOutput = `<tr id="dh_${data.rowNumber}">
                          <td>${data.rowNumber}</td>
                          <td>${data.infantWeight}</td>
                          <td>${data.infantWeightUnitId != 0 ? `${data.infantWeightUnitName}` : ""}</td>
                          <td>${data.deliveryNumber}</td>
                          <td>${data.deliveryPriority}</td>
                          <td>${data.deliveryAgentId != 0 ? `${data.deliveryAgentName}` : ""}</td>
                          <td>${data.deliveryLocationId != 0 ? `${data.deathLocationName}` : ""}</td>
                          <td>${data.motherNationalCode}</td>
                          <td>${data.motherFirstName}</td>
                          <td>${data.motherLastName}</td>
                          <td>${data.motherBirthDatePersian}</td>
                          <td>${data.motherMobileNumber}</td>
                     </tr>`

            $(dataOutput).appendTo("#tempinfantDelivery");
        }
        resetDeathForm("infantDelivery");
    }
}

function modelAppendMedicalHistory(rowNumber, typeSave) {

    var modelMedicalHistory = {
        headerId: 0,
        rowNumber: rowNumber,
        conditionId: +$("#conditionId_medicalHistory").val(),
        conditionName: $("#conditionId_medicalHistory").select2('data').length > 0 ? $("#conditionId_medicalHistory").select2('data')[0].text : "",
        description: $("#description_medicalHistory").val(),
        dateOfOnsetPersian: $("#dateOfOnSet").val(),
        onsetDurationToPresent: +$("#onsetDurationToPresent_medicalHistory").val(),
        onsetDurationToPresentUnitId: +$("#onsetDurationToPresentUnitId_medicalHistory").val(),
        onsetDurationToPresentUnitName: $("#onsetDurationToPresentUnitId_medicalHistory").select2('data').length > 0 ? $("#onsetDurationToPresentUnitId_medicalHistory").select2('data')[0].text : "",
    }

    if (typeSave == "INS")
        arr_TempMedicalHistory.push(modelMedicalHistory);

    appendTempMedicalHistory(modelMedicalHistory, typeSaveMedicalHistory);
    typeSaveMedicalHistory = "INS";
}

var appendTempMedicalHistory = (data, tSave = "INS") => {
    var dataOutput = "";
    if (data) {
        if (tSave == "INS") {
            var emptyRow = $("#tempmedicalHistory").find("#emptyRow");

            if (emptyRow.length > 0)
                $("#tempmedicalHistory").html("");

            dataOutput = `<tr id="mh_${data.rowNumber}">
                          <td>${data.rowNumber}</td>
                          <td>${data.conditionId != 0 ? `${data.conditionName}` : ""}</td>
                          <td>${data.dateOfOnsetPersian}</td>
                          <td>${data.onsetDurationToPresent}</td>
                          <td>${data.onsetDurationToPresentUnitId != 0 ? `${data.onsetDurationToPresentUnitDescription}` : ""}</td>
                          <td>${data.description}</td>
                     </tr>`

            $(dataOutput).appendTo("#tempmedicalHistory");
        }
        resetDeathForm("medicalHistory");
    }
}


function resetDeathForm(typeBox) {

    if (typeBox == "deathCause") {

        $("#deathCauseBox .select2").val("").trigger("change");
        $("#deathCauseBox input.form-control").val("");
        $("#causeId").select2("focus");
        typeSavedeathCause = "INS";
    }

    else if (typeBox == "infantDelivery") {
        $("#infantDeliveryBox .select2").val("").trigger("change");
        $("#infantDeliveryBox input.form-control").val("");
        $("#infantWeight").focus();
        typeSaveInfantDelivery = "INS";
    }
    else if (typeBox == "medicalHistory") {
        $("#medicalHistoryBox .select2").val("").trigger("change");
        $("#medicalHistoryBox input.form-control").val("");
        $("#conditionId_medicalHistory").select2("focus");
        typeSaveMedicalHistory = "INS";
    }
    else if (typeBox == "tableDeathCertificate") {

        arr_TempDeathCertificate = [];
        arr_TempDeathCause = [];
        arr_TempMedicalHistory = [];
        arr_TempInfantDelivery = [];

        $("#tempdeathCause").html(fillEmptyRow(5));
        $("#tempinfantDelivery").html(fillEmptyRow(12));
        $("#tempmedicalHistory").html(fillEmptyRow(6));
    }
}
initSendDeathForm();

async function initSendDeathForm() {

    ColumnResizeable("tempdeathCauseFieldList");
    ColumnResizeable("tempadmissionFieldList");
    ColumnResizeable("tempinfantDeliveryFieldList");
    ColumnResizeable("tempinsuranceFieldList");
    ColumnResizeable("temppastMedicalHistoryFieldList");
    ColumnResizeable("tempinfantDeliveryList");
    ColumnResizeable("tempdrugOrderedList");
    ColumnResizeable("tempmedicalHistoryList");

    bindDeathElement();
    inputMask();

    $(".card-body").fadeIn(1000);
}

$("#list_adm").on("click", function () {
    navigation_item_click('/MC/DeathCertificate', 'لیست فوتی')
});
