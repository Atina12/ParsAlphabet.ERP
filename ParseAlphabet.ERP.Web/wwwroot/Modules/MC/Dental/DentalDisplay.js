var viewData_controllername = "DentalApi",
    viewData_get_DentalGet = `${viewData_baseUrl_MC}/${viewData_controllername}/get`,
    viewData_get_AdMissingetDiagnosis = `${viewData_baseUrl_MC}/AdmissionApi/getdiagnosis`,
    viewData_get_AdmissionSearch = `${viewData_baseUrl_MC}/AdmissionApi/search`,
    viewData_getDentalCheckExist = `${viewData_baseUrl_MC}/${viewData_controllername}/checkexist`,

    emptyRow = `<tr id="emptyRow"><td colspan="thlength" class="text-center">سطری وجود ندارد</td></tr>`,

    admissionIdentity = 0, dentalId = +$("#dentalId").val(), dentalHID = "",
    currentAbuseHistoryRowNumber = 0, currentFamilyHistoryRowNumber = 0,

    typeSaveAbuseHistory = "INS", typeSaveFamilyHistory = "INS",
    typeSaveAdverseReaction = "INS", typeSaveTooth = "INS", typeSaveToothLineDetail = "INS", typeSaveTreatmentC = "INS",
    typeSaveDrugHistory = "INS", typeSaveDrugOrdered = "INS", typeSaveMedicalHistory = "INS",
    typeSaveDiag = "INS", typeSaveToothC = "INS",

    arr_TempAbuseHistory = [], arr_TempFamilyHistory = [],
    arr_TempDrugHistory = [], arr_TempDrugOrdered = [], arr_TempMedicalHistory = [],
    arr_TempAdverseReaction = [], arr_TempTooth = [], arr_TempToothLineDetail = [], arr_TempTreatmentLine = [],
    arr_TempDiagnosis = [], referringDoctorId = 0, currentToothRowNumber = 0;

function headerindexChoose(e) {
    let elm = $(e.target);

    if (e.keyCode === KeyCode.Enter) {
        let checkExist = false;
        checkExist = checkExistDentalId(+elm.val());
        if (checkExist) {
            getDentalData(+elm.val(), 0);
            elm.val("");
        }
        else
            alertify.warning("این کد در سیستم وجود ندارد").delay(alertify_delay);
    }
}

function checkExistDentalId(id) {

    let outPut = $.ajax({
        url: viewData_getDentalCheckExist,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getDentalCheckExist);
        }
    });
    return outPut.responseJSON;

}

function display_pagination(opr) {
    var elemId = $("#dentalId").val();
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
    getDentalData(elemId, headerPagination);
}

function setAdmissionInfo(admissionId, stateId) {

    admissionIdentity = +admissionId;
    var dataAdm = getfeildByAdmissionId(admissionId, stateId)
    //getDiagnosis(+admissionId);
    $("#admissionSelected").html("");

    referringDoctorId = dataAdm.attenderId;
    checkPatientNationalCode = dataAdm.patientNationalCode;

    var admissionOutput = `<tr>
                               <td>${dataAdm.admissionId}</td> 
                               <td>${dataAdm.patientId} - ${dataAdm.patientFullName}</td> 
                               <td>${dataAdm.patientNationalCode}</td> 
                               <td>${dataAdm.basicInsurerName}</td> 
                               <td>${dataAdm.insuranceBoxName}</td> 
                               <td>${dataAdm.compInsuranceBoxName}</td> 
                               <td>${dataAdm.thirdPartyId == 0 ? "" : `${dataAdm.thirdPartyId} - ${dataAdm.thirdPartyName}`}</td>
                               <td>${dataAdm.admissionHID}</td> 
                               <td>${dataAdm.insurExpDatePersian}</td> 
                               <td>${dataAdm.attenderFullName}</td> 
                           </tr>`

    $("#admissionSelected").html(admissionOutput);
    //modal_close("searchAdmissionModal");
}

var getfeildByAdmissionId = (admId, stateId) => {

    var modelSearch = {
        stateId: +stateId,
        id: +admId,
        createDatePersian: "",
        patientFullName: "",
        patientNationalCode: ""
    }

    var result = $.ajax({
        url: viewData_get_AdmissionSearch,
        async: false,
        cache: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(modelSearch),
        success: function (data) {
            return data;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_get_AdmissionSearch);
            return null;
        }
    });
    return result.responseJSON;
};

function getDentalData(elemId, headerPagination = 0) {

    let nextDentalmodel = {
        dentalId: elemId,
        headerPagination: headerPagination
    };

    $.ajax({
        url: viewData_get_DentalGet,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(nextDentalmodel),
        success: function (data) {
            resetDentalForm("tableDental");
            fillDental(data);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_get_DentalGet);
        }
    });
};

var fillDental = (data) => {

    if (data !== null) {
        $("#dentalId").val(data.id);
        $("#userFullName").val(`${data.userId} - ${data.userFullName}`);
        $("#dentalFormBox").removeClass("displaynone");
        $("#creatDateTime").val(data.admissionCreateDatePersian);
        dentalHID = data.relatedHID;

        setAdmissionInfo(data.admissionId, 9);

        admissionIdentity = data.admissionId;

        var datadb, LineLength;

        // Tooth
        if (data.dentalToothLines != null) {
            LineLength = data.dentalToothLines.length;
            for (var dld = 0; dld < LineLength; dld++) {
                datadb = data.dentalToothLines[dld];

                var model = {
                    headerId: datadb.headerId,
                    rowNumber: datadb.rowNumber,
                    isMissing: datadb.isMissing,
                    toothId: datadb.toothId,
                    toothName: datadb.toothId + " - " + datadb.toothName,
                    partId: datadb.partId,
                    partName: datadb.partId + " - " + datadb.partName,
                    segmentId: datadb.segmentId,
                    segmentName: datadb.segmentId + " - " + datadb.segmentName,
                    comment: datadb.comment,
                    hasDiaganosis: datadb.hasDiaganosis,
                    hasTreatment: datadb.hasTreatment,
                };

                arr_TempTooth.push(model);
                appendTempTooth(model);
                model = {};
            }
        }
        // Tooth

        // DiagnosisTooth
        if (data.dentalToothLineDetails != null) {
            LineLength = data.dentalToothLineDetails.length;
            for (var dld = 0; dld < LineLength; dld++) {
                datadb = data.dentalToothLineDetails[dld];

                var model = {
                    headerId: datadb.headerId,
                    rowNumber: datadb.rowNumber,
                    detailRowNumber: datadb.detailRowNumber,
                    statusId: datadb.statusId,
                    statusName: datadb.statusId + " - " + datadb.diagnosisStatusName,
                    diagnosisResonId: datadb.diagnosisReasonId,
                    diagnosisResonName: datadb.diagnosisReasonId + " - " + datadb.diagnosisReasonName,
                    serverityId: datadb.serverityId,
                    serverityName: datadb.serverityId + " - " + datadb.severityName,
                    comment: datadb.comment,
                };

                arr_TempToothLineDetail.push(model);
                //appendTempToothC(model);
                model = {};
            }
        }
        // DiagnosisTooth

        // treatment
        if (data.dentalTreatmentLineDetails != null) {
            LineLength = data.dentalTreatmentLineDetails.length;
            for (var dld = 0; dld < LineLength; dld++) {
                datadb = data.dentalTreatmentLineDetails[dld];

                var model = {
                    headerId: datadb.headerId,
                    rowNumber: datadb.rowNumber,
                    detailRowNumber: datadb.detailRowNumber,
                    serviceId: datadb.serviceId,
                    serviceName: datadb.serviceId + " - " + datadb.serviceName,
                    serviceTypeId: datadb.serviceTypeId,
                    serviceTypeName: datadb.serviceTypeId + " - " + datadb.serviceTypeName,
                    serviceCountUnitId: datadb.serviceCountUnitId,
                    serviceCountUnitName: datadb.serviceCountUnitId + " - " + datadb.serviceCountUnitName,
                    serviceCount: datadb.serviceCount,
                };

                arr_TempTreatmentLine.push(model);
                model = {};
            }
        }
        // treatment

        // AbuseHistory
        if (data.dentalAbuseHistoryLines != null) {
            
            LineLength = data.dentalAbuseHistoryLines.length;
            for (var dld = 0; dld < LineLength; dld++) {
                datadb = data.dentalAbuseHistoryLines[dld];
                
                var model = {
                    headerId: datadb.headerId,
                    rowNumber: datadb.rowNumber,
                    abuseDuration: datadb.abuseDuration,
                    abuseDurationUnitId: datadb.abuseDurationUnitId,
                    abuseDurationUnitName: datadb.abuseDurationUnitId + " - " + datadb.abuseDurationUnitName,
                    abuseDurationUnitDescription: datadb.abuseDurationUnitDescription,
                    amountOfAbuseDosage: datadb.amountOfAbuseDosage,
                    amountOfAbuseUnitId: datadb.amountOfAbuseUnitId,
                    amountOfAbuseUnitName: datadb.amountOfAbuseUnitId + " - " + datadb.amountOfAbuseUnitName,
                    amountOfAbuseUnitDescription: datadb.amountOfAbuseUnitDescription,
                    quitDatePersian: datadb.quitDatePersian,
                    startDatePersian: datadb.startDatePersian,
                    substanceTypeId: datadb.substanceTypeId,
                    substanceTypeName: datadb.substanceTypeId + " - " + datadb.substanceTypeName,
                };

                arr_TempAbuseHistory.push(model);
                appendTempAbuseHistory(model);
                model = {};
            }
        }
        // AbuseHistory

        // FamilyHistory
        if (data.dentalFamilyHisotryLines != null) {
            LineLength = data.dentalFamilyHisotryLines.length;
            for (var dld = 0; dld < LineLength; dld++) {
                datadb = data.dentalFamilyHisotryLines[dld];

                var model = {
                    headerId: datadb.headerId,
                    rowNumber: datadb.rowNumber,
                    conditionId: datadb.conditionId,
                    conditionName: datadb.conditionId + " - " + datadb.conditionName,
                    description: datadb.description,
                    isCauseofDeath: datadb.isCauseofDeath,
                    relatedPersonId: datadb.relatedPersonId,
                    relatedPersonName: datadb.relatedPersonId + " - " + datadb.relatedPersonName,
                };

                arr_TempFamilyHistory.push(model);
                appendTempFamilyHistory(model);
                model = {};
            }
        }
        // FamilyHistory

        // drugHistory
        if (data.dentalDrugHistoryLines != null) {
            LineLength = data.dentalDrugHistoryLines.length;
            for (var dld = 0; dld < LineLength; dld++) {
                datadb = data.dentalDrugHistoryLines[dld];

                var model = {
                    headerId: datadb.headerId,
                    rowNumber: datadb.rowNumber,
                    medicationId: datadb.medicationId,
                    medicationName: datadb.medicationId + " - " + datadb.medicationName,
                    routeId: datadb.routeId,
                    routeName: datadb.routeId + " - " + datadb.routeName,
                };

                arr_TempDrugHistory.push(model);
                appendTempDrugHistory(model);
                model = {};
            }
        }
        // drugHistory

        // drugOrdered
        if (data.dentalDrugOrderedLines != null) {
            LineLength = data.dentalDrugOrderedLines.length;
            for (var dld = 0; dld < LineLength; dld++) {
                datadb = data.dentalDrugOrderedLines[dld];

                var model = {
                    headerId: datadb.headerId,
                    rowNumber: datadb.rowNumber,
                    administrationDateTimePersian: datadb.administrationDateTimePersian,
                    description: datadb.description,
                    dosage: datadb.dosage,
                    dosageUnitId: datadb.dosageUnitId,
                    dosageUnitName: datadb.dosageUnitId + " - " + datadb.dosageUnitName,
                    dosageUnitDescription: datadb.dosageUnitDescription,
                    drugGenericName: datadb.drugGenericName,
                    frequencyId: datadb.frequencyId,
                    frequencyName: datadb.frequencyId + " - " + datadb.frequencyName,
                    totalNumber: datadb.totalNumber,
                    longTerm: datadb.longTerm,
                    longTermUnitId: datadb.longTermUnitId,
                    longTermUnitName: datadb.longTermUnitId + " - " + datadb.longTermUnitName,
                    longTermUnitDescription: datadb.longTermUnitDescription,
                    productId: datadb.productId,
                    productName: datadb.productId + " - " + datadb.productName,
                    routeId: datadb.routeId,
                    routeName: datadb.routeId + " - " + datadb.routeName,
                };

                arr_TempDrugOrdered.push(model);
                appendTempDrugOrdered(model);
                model = {};
            }
        }
        // drugOrdered

        // medicalHistory
        if (data.dentalMedicalHistoryLines != null) {
            LineLength = data.dentalMedicalHistoryLines.length;
            for (var dld = 0; dld < LineLength; dld++) {
                datadb = data.dentalMedicalHistoryLines[dld];

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

        // Diagnosis
        if (data.admissionDiagnosisLines != null) {
            LineLength = data.admissionDiagnosisLines.length;
            for (var dld = 0; dld < LineLength; dld++) {
                datadb = data.admissionDiagnosisLines[dld];

                var model = {
                    headerId: datadb.headerId,
                    rowNumber: datadb.rowNumber,
                    statusId: datadb.statusId,
                    statusName: datadb.statusId + " - " + datadb.diagnosisStatusName,
                    diagnosisResonId: datadb.diagnosisReasonId,
                    diagnosisResonName: datadb.diagnosisReasonId + " - " + datadb.diagnosisReasonName,
                    serverityId: datadb.serverityId,
                    serverityName: datadb.serverityId + " - " + datadb.severityName,
                    comment: datadb.comment,
                };

                arr_TempDiagnosis.push(model);
                appendTempDiagnosis(model);
                model = {};
            }
        }
        // Diagnosis




    }
};



async function loadingAsync(loading, elementId) {

    if (loading)
        $(`#${elementId} i`).addClass(`fa fa-spinner fa-spin`);
    else
        $(`#${elementId} i`).removeClass("fa fa-spinner fa-spin")
}

var resetDentalT = async () => {
    $("#tempabuseHistoryField").html(fillEmptyRow(8));
    $("#tempadmissionField").html(fillEmptyRow(5));
    $("#tempdiagnosisField").html(fillEmptyRow(5));
    $("#tempdrugHistoryField").html(fillEmptyRow(3));
    $("#tempdrugOrderedField").html(fillEmptyRow(12));
    $("#tempfamilyHistoryField").html(fillEmptyRow(5));
    $("#tempinsuranceField").html(fillEmptyRow(6));
    $("#temppastMedicalHistoryField").html(fillEmptyRow(6));
    $("#iSQueriableT").prop("checked", false).trigger("change");
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


// ADMISSIONREFER GetFeedBackAdmissionRefer START *************

var appendTempadmissionField = (data) => {
    var dataOutput = "";
    if (data) {
        var emptyRow = $("#tempadmissionField").find("#emptyRow");

        if (emptyRow.length > 0)
            $("#tempadmissionField").html("");

        dataOutput = `<tr id="adT">
                          <td>${data.admissionDateTime}</td>
                          <td>${data.admissionType}</td>
                          <td>${data.institute}</td>
                          <td>${data.referringDoctor}</td>
                          <td>${data.attendingDoctor}</td>
                     </tr>`

        $(dataOutput).appendTo("#tempadmissionField");
    }
}


var appendTempinsuranceField = (data) => {
    var dataOutput = "";
    if (data) {
        var emptyRow = $("#tempinsuranceField").find("#emptyRow");

        if (emptyRow.length > 0)
            $("#tempinsuranceField").html("");

        dataOutput = `<tr id="inT">
                          <td>${data.insurer}</td>
                          <td>${data.insuranceBox}</td>
                          <td>${data.insuranceBookletSerialNumber}</td>
                          <td>${data.insuranceExpirationDate}</td>
                          <td>${data.insuredNumber}</td>
                          <td>${data.sHEBAD}</td>
                     </tr>`

        $(dataOutput).appendTo("#tempinsuranceField");
    }
}

// ADMISSIONREFER AbuseHistory START *************

function modelAppendAbuseHistory(rowNumber, typeSave) {
    
    var modelAbuseHistory = {
        headerId: 0,
        rowNumber: rowNumber,
        abuseDuration: +$("#abuseDuration").val(),
        abuseDurationUnitId: +$("#abuseDurationUnitId").val(),
        abuseDurationUnitName: $("#abuseDurationUnitId").select2('data').length > 0 ? $("#abuseDurationUnitId").select2('data')[0].text : "",
        abuseDurationUnitDescription: $("#abuseDurationUnitId").select2('data').length > 0 ? $("#abuseDurationUnitId").select2('data')[0].text : "",
        amountOfAbuseDosage: +$("#amountOfAbuseDosage").val(),
        amountOfAbuseUnitId: +$("#amountOfAbuseUnitId").val(),
        amountOfAbuseUnitName: $("#amountOfAbuseUnitId").select2('data').length > 0 ? $("#amountOfAbuseUnitId").select2('data')[0].text : "",
        amountOfAbuseUnitDescription: $("#amountOfAbuseUnitId").select2('data').length > 0 ? $("#amountOfAbuseUnitId").select2('data')[0].text : "",
        quitDatePersian: $("#quitDate").val(),
        startDatePersian: $("#startDate").val(),
        substanceTypeId: +$("#substanceTypeId").val(),
        substanceTypeName: $("#substanceTypeId").select2('data').length > 0 ? $("#substanceTypeId").select2('data')[0].text : "",

    }

    if (typeSave == "INS")
        arr_TempAbuseHistory.push(modelAbuseHistory);

    appendTempAbuseHistory(modelAbuseHistory, typeSaveAbuseHistory);
    typeSaveAbuseHistory = "INS";
}

var appendTempAbuseHistory = (data, tSave = "INS") => {
    
    var dataOutput = "";
    if (data) {
        if (tSave == "INS") {
            var emptyRow = $("#tempabuseHistory").find("#emptyRow");
            
            if (emptyRow.length > 0)
                $("#tempabuseHistory").html("");

            dataOutput = `<tr id="ah_${data.rowNumber}">
                          <td>${data.rowNumber}</td>
                          <td>${data.substanceTypeId != 0 ? data.substanceTypeName : ""}</td>
                          <td>${data.amountOfAbuseDosage}</td>
                          <td>${data.amountOfAbuseUnitId != 0 ? `${data.amountOfAbuseUnitDescription}` : ""}</td>
                          <td>${data.abuseDuration}</td>
                          <td>${data.abuseDurationUnitId != 0 ? `${data.abuseDurationUnitDescription}` : ""}</td>
                          <td>${data.startDatePersian}</td>
                          <td>${data.quitDatePersian}</td>
                     </tr>`

            $(dataOutput).appendTo("#tempabuseHistory");
        }
        resetDentalForm("abuseHistory");
    }
}

$("#canceledabuseHistory").on("click", function () {

    $("#abuseHistoryBox .select2").val("").trigger("change");
    $("#abuseHistoryBox input.form-control").val("");
    $("#substanceTypeId").select2("focus");
    typeSaveAbuseHistory = "INS";
});

// ADMISSIONREFER AbuseHistory END *************

// ADMISSIONREFER FamilyHistory START *************

function modelAppendFamilyHistory(rowNumber, typeSave) {

    var modelFamilyHistory = {
        headerId: 0,
        rowNumber: rowNumber,
        conditionId: +$("#conditionId_familyHistory").val(),
        conditionName: $("#conditionId_familyHistory").select2('data').length > 0 ? $("#conditionId_familyHistory").select2('data')[0].text : "",
        description: $("#description_familyHistory").val(),
        isCauseofDeath: $("#isCauseofDeath").prop("checked"),
        relatedPersonId: +$("#relatedPersonId").val(),
        relatedPersonName: $("#relatedPersonId").select2('data').length > 0 ? $("#relatedPersonId").select2('data')[0].text : "",
    }

    if (typeSave == "INS")
        arr_TempFamilyHistory.push(modelFamilyHistory);

    appendTempFamilyHistory(modelFamilyHistory, typeSaveFamilyHistory);
    typeSaveFamilyHistory = "INS";
}

var appendTempFamilyHistory = (data, tSave = "INS") => {
    var dataOutput = "";
    if (data) {
        if (tSave == "INS") {
            var emptyRow = $("#tempfamilyHistory").find("#emptyRow");

            if (emptyRow.length > 0)
                $("#tempfamilyHistory").html("");

            dataOutput = `<tr id="fh_${data.rowNumber}">
                            <td>${data.rowNumber}</td>
                            <td>${data.relatedPersonId != 0 ? `${data.relatedPersonName}` : ""}</td>
                            <td>${data.conditionId != 0 ? `${data.conditionName}` : ""}</td>
                            <td>${data.isCauseofDeath ? "بلی" : "خیر"}</td>
                            <td>${data.description}</td>
                     </tr>`

            $(dataOutput).appendTo("#tempfamilyHistory");
        }
        resetDentalForm("familyHistory");
    }
}

$("#canceledfamilyHistory").on("click", function () {

    $("#familyHistoryBox .select2").val("").trigger("change");
    $("#familyHistoryBox input.form-control").val("");
    $("#familyHistoryBox .funkyradio input:checkbox").prop("checked", false).trigger("change");
    $("#relatedPersonId").select2("focus");
    typeSaveFamilyHistory = "INS";
});

// ADMISSIONREFER FamilyHistory END *************


// ADMISSIONREFER drugHistory START *************

function modelAppendDrugHistory(rowNumber, typeSave) {

    var modelDrugHistory = {
        headerId: 0,
        rowNumber: rowNumber,
        medicationId: +$("#medicationId").val(),
        medicationName: $("#medicationId").select2('data').length > 0 ? $("#medicationId").select2('data')[0].text : "",
        routeId: +$("#routeId_drugHistory").val(),
        routeName: $("#routeId_drugHistory").select2('data').length > 0 ? $("#routeId_drugHistory").select2('data')[0].text : "",
    }

    if (typeSave == "INS")
        arr_TempDrugHistory.push(modelDrugHistory);

    appendTempDrugHistory(modelDrugHistory, typeSaveDrugHistory);
    typeSaveDrugHistory = "INS";
}

var appendTempDrugHistory = (data, tSave = "INS") => {
    var dataOutput = "";
    if (data) {
        if (tSave == "INS") {
            var emptyRow = $("#tempdrugHistory").find("#emptyRow");

            if (emptyRow.length > 0)
                $("#tempdrugHistory").html("");

            dataOutput = `<tr id="dh_${data.rowNumber}">
                          <td>${data.rowNumber}</td>
                          <td>${data.medicationId != 0 ? `${data.medicationName}` : ""}</td>
                          <td>${data.routeId != 0 ? `${data.routeName}` : ""}</td>
                     </tr>`

            $(dataOutput).appendTo("#tempdrugHistory");
        }
        resetDentalForm("drugHistory");
    }
}

$("#canceleddrugHistory").on("click", function () {

    $("#drugHistoryBox .select2").val("").trigger("change");
    $("#drugHistoryBox input.form-control").val("");
    $("#medicationId").select2("focus");
    typeSaveDrugHistory = "INS";
});


// ADMISSIONREFER drugHistory END *************

// ADMISSIONREFER drugOrdered START *************

function modelAppendDrugOrdered(rowNumber, typeSave) {

    var modelDrugOrdered = {
        headerId: 0,
        rowNumber: rowNumber,
        administrationDateTimePersian: $("#administrationDateTime").val(),
        totalNumber: $("#totalNumber").val(),
        description: $("#description_drugOrdered").val(),
        dosage: $("#dosage").val(),
        dosageUnitId: +$("#dosageUnitId").val(),
        dosageUnitName: $("#dosageUnitId").select2('data').length > 0 ? $("#dosageUnitId").select2('data')[0].text : "",
       // dosageUnitDescription: $("#dosageUnitId").select2('data').length > 0 ? $("#dosageUnitId").select2('data')[0].text : "",
        drugGenericName: $("#drugGenericName").val(),
        frequencyId: +$("#frequencyId").val(),
        frequencyName: $("#frequencyId").select2('data').length > 0 ? $("#frequencyId").select2('data')[0].text : "",
        longTerm: $("#longTerm").val(),
        longTermUnitId: +$("#longTermUnitId").val(),
        longTermUnitName: $("#longTermUnitId").select2('data').length > 0 ? $("#longTermUnitId").select2('data')[0].text : "",
       // longTermUnitDescription: $("#longTermUnitId").select2('data').length > 0 ? $("#longTermUnitId").select2('data')[0].text : "",
        productId: +$("#productId").val(),
        productName: $("#productId").select2('data').length > 0 ? $("#productId").select2('data')[0].text : "",
        routeId: +$("#routeId_drugOrdered").val(),
        routeName: $("#routeId_drugOrdered").select2('data').length > 0 ? $("#routeId_drugOrdered").select2('data')[0].text : "",
    }

    if (typeSave == "INS")
        arr_TempDrugOrdered.push(modelDrugOrdered);

    appendTempDrugOrdered(modelDrugOrdered, typeSaveDrugOrdered);
    typeSaveDrugOrdered = "INS";
}

var appendTempDrugOrdered = (data, tSave = "INS") => {
    var dataOutput = "";
    if (data) {
        if (tSave == "INS") {
            var emptyRow = $("#tempdrugOrdered").find("#emptyRow");

            if (emptyRow.length > 0)
                $("#tempdrugOrdered").html("");

            dataOutput = `<tr id="do_${data.rowNumber}">
                        <td>${data.rowNumber}</td>
                        <td>${data.productId != 0 ? `${data.productName}` : ""}</td>
                        <td>${data.drugGenericName}</td>
                        <td>${data.routeId != 0 ? `${data.routeName}` : ""}</td>
                        <td>${data.frequencyId != 0 ? `${data.frequencyName}` : ""}</td>
                        <td>${data.dosage}</td>
                        <td>${data.dosageUnitId != 0 ? `${data.dosageUnitDescription}` : ""}</td>
                        <td>${data.longTerm}</td>
                        <td>${data.longTermUnitId != 0 ? `${data.longTermUnitDescription}` : ""}</td>
                        <td>${data.totalNumber}</td>
                        <td>${data.administrationDateTimePersian}</td>
                        <td>${data.description}</td>                          
                     </tr>`

            $(dataOutput).appendTo("#tempdrugOrdered");
        }
        resetDentalForm("drugOrdered");
    }
}

$("#canceleddrugOrdered").on("click", function () {

    $("#drugOrderedBox .select2").val("").trigger("change");
    $("#drugOrderedBox input.form-control").val("");
    $("#productId").select2("focus");
    typeSaveDrugOrdered = "INS";
});
// ADMISSIONREFER drugOrdered END *************

// ADMISSIONREFER MedicalHistory START *************

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
        else {
            var i = arr_TempMedicalHistory.findIndex(x => x.rowNumber == data.rowNumber);
            arr_TempMedicalHistory[i].headerId = data.headerId;
            arr_TempMedicalHistory[i].rowNumber = data.rowNumber;
            arr_TempMedicalHistory[i].conditionId = data.conditionId;
            arr_TempMedicalHistory[i].conditionName = data.conditionName;
            arr_TempMedicalHistory[i].description = data.description;
            arr_TempMedicalHistory[i].dateOfOnsetPersian = data.dateOfOnsetPersian;
            arr_TempMedicalHistory[i].onsetDurationToPresent = data.onsetDurationToPresent;
            arr_TempMedicalHistory[i].onsetDurationToPresentUnitId = data.onsetDurationToPresentUnitId;
            arr_TempMedicalHistory[i].onsetDurationToPresentUnitName = data.onsetDurationToPresentUnitName;

            $(`#mh_${data.rowNumber} td:eq(0)`).text(`${data.rowNumber}`);
            $(`#mh_${data.rowNumber} td:eq(1)`).text(`${data.conditionId != 0 ? `${data.conditionName}` : ""}`);
            $(`#mh_${data.rowNumber} td:eq(2)`).text(`${data.dateOfOnsetPersian}`);
            $(`#mh_${data.rowNumber} td:eq(3)`).text(`${data.onsetDurationToPresent}`);
            $(`#mh_${data.rowNumber} td:eq(4)`).text(`${data.onsetDurationToPresentUnitId != 0 ? `${data.onsetDurationToPresentUnitName}` : ""}`);
            $(`#mh_${data.rowNumber} td:eq(5)`).text(`${data.description}`);
        }
        resetDentalForm("medicalHistory");
    }
}

$("#canceledmedicalHistory").on("click", function () {
    $("#medicalHistoryBox .select2").val("").trigger("change");
    $("#medicalHistoryBox input.form-control").val("");
    $("#conditionId_medicalHistory").select2("focus");
    typeSaveMedicalHistory = "INS";
});
// ADMISSIONREFER MedicalHistory END *************

// ADMISSIONREFER Diagnosis START *************

function modelAppendDiagnosis(rowNumber, typeSave) {

    var modelDiag = {
        admissionId: 0,
        rowNumber: rowNumber,
        statusId: +$("#statusId").val(),
        statusName: $("#statusId").select2('data').length > 0 ? $("#statusId").select2('data')[0].text : "",
        diagnosisResonId: +$("#diagnosisResonId").val(),
        diagnosisResonName: $("#diagnosisResonId").select2('data').length > 0 ? $("#diagnosisResonId").select2('data')[0].text : "",
        serverityId: +$("#serverityId").val(),
        serverityName: $("#serverityId").select2('data').length > 0 ? $("#serverityId").select2('data')[0].text : "",
        comment: $("#comment").val()
    };
    if (typeSave == "INS")
        arr_TempDiagnosis.push(modelDiag);

    appendTempDiagnosis(modelDiag, typeSaveDiag);
    typeSaveDiag = "INS";
}

$("#canceledDiagnosis").on("click", function () {

    $("#diagBox .select2").val("").trigger("change");
    $("#diagBox .funkyradio input:checkbox").prop("checked", false).trigger("change");
    $("#diagBox input.form-control").val("");
    $("#statusId").select2("focus");

    typeSaveDiag = "INS";

});

var appendTempDiagnosis = (diag, tSave = "INS") => {

    var diagOutput = "";

    if (diag) {
        if (tSave == "INS") {

            var emptyRow = $("#tempDiag").find("#emptyRow");

            if (emptyRow.length > 0)
                $("#tempDiag").html("");

            diagOutput = `<tr id="dg_${diag.rowNumber}">
                          <td>${diag.rowNumber}</td>
                          <td>${diag.statusId != 0 ? `${diag.statusName}` : ""}</td>
                          <td>${diag.diagnosisResonId != 0 ? `${diag.diagnosisResonName}` : ""}</td>
                          <td>${diag.serverityId != -1 ? `${diag.serverityName}` : ""}</td>
                          <td>${diag.comment}</td>                          
                     </tr>`

            $(diagOutput).appendTo("#tempDiag");
        }
    }
    resetDentalForm("diag");

}

// ADMISSIONREFER Diagnosis END *************


// ADMISSIONREFER ToothName Start *************

function modelAppendTooth(rowNumber, typeSave) {
    var modelTooth = {
        headerId: 0,
        rowNumber: rowNumber,
        isMissing: $("#isMissing").prop("checked"),
        toothId: +$("#toothId").val(),
        toothName: $("#toothId").select2('data').length > 0 ? $("#toothId").select2('data')[0].text : "",
        partId: +$("#partId").val(),
        partName: $("#partId").select2('data').length > 0 ? $("#partId").select2('data')[0].text : "",
        segmentId: +$("#segmentId").val(),
        segmentName: $("#segmentId").select2('data').length > 0 ? $("#segmentId").select2('data')[0].text : "",
        comment: $("#toothComment").val(),
        hasDiaganosis: $("#hasdiaganosis").val().length > 0 ? $("#hasdiaganosis").val() : "ندارد",
        hastreatment: $("#hastreatment").val().length > 0 ? $("#hastreatment").val() : "ندارد"
    };


    if (typeSave == "INS")
        arr_TempTooth.push(modelTooth);

    appendTempTooth(modelTooth, typeSaveTooth);
    typeSaveTooth = "INS";
}

$("#canceledTooth").on("click", function () {

    $("#dentalFormBox .select2").val("").trigger("change");
    $("#dentalFormBox .funkyradio input:checkbox").prop("checked", false).trigger("change");
    $("#dentalFormBox input.form-control").val("");
    $("#toothId").select2("focus");

    typeSaveTooth = "INS";

});

var appendTempTooth = (tooth, tSave = "INS") => {
    var toothOutput = "";

    if (tooth) {
        if (tSave == "INS") {

            var emptyRow = $("#tempTooth").find("#emptyRow");

            if (emptyRow.length > 0)
                $("#tempTooth").html("");

            var compoundButton = "";

            if (tooth.hasDiaganosis)
                compoundButton += `<button type="button" onclick="addCompoundTooth(${tooth.rowNumber})" class="btn blue_outline_1 ml-2" title="تشخیص">
                                      <i class="fa fa-list"></i>
                                   </button>`;
            else
                compoundButton += `<i class="fa fa-times btn maroon_outline ml-2" title="تشخیص برای این سطر ثبت نشده است"></i>`;

            if (tooth.hasTreatment)
                compoundButton += `<button type="button" onclick="addCompoundTreatment(${tooth.rowNumber})" class="btn blue_outline_1 ml-2" title="خدمات">
                                      <i class="fa fa-list"></i>
                                   </button>` ;
            else
                compoundButton += `<i class="fa fa-times btn maroon_outline ml-2" title="خدمات برای این سطر ثبت نشده است"></i>`;


            toothOutput = `<tr id="dt_${tooth.rowNumber}">
                          <td>${tooth.rowNumber}</td>
                          <td>${tooth.isMissing ? "بلی" : "خیر"}</td>
                          <td>${tooth.toothId != 0 ? `${tooth.toothName}` : ""}</td>
                          <td>${tooth.partId != 0 ? `${tooth.partName}` : ""}</td>
                          <td>${tooth.segmentId != 0 ? `${tooth.segmentName}` : ""}</td>
                          <td>${tooth.comment}</td>
                          <td>${tooth.hasDiaganosis ? "دارد" : "ندارد"}</td>
                          <td>${tooth.hasTreatment ? "دارد" : "ندارد"}</td>
                          <td id="operationdt_${tooth.rowNumber}">${compoundButton}</td>
                     </tr>`

            $(toothOutput).appendTo("#tempTooth");
        }
    }
    resetDentalForm("tooth");
}

var addCompoundTooth = (rowNumber) => {

    $("#tempTooth tr").removeClass("highlight");
    $(`#dr_${rowNumber}`).addClass("highlight");

    currentToothRowNumber = rowNumber;

    if (arr_TempToothLineDetail.length > 0) {

        for (var d = 0; d < arr_TempToothLineDetail.length; d++) {

            var currentToothC = arr_TempToothLineDetail[d];

            if (currentToothC.rowNumber == currentToothRowNumber)
                appendTempToothC(currentToothC);

        }
    }
    else {
        var colspan = $("#tempToothListC thead th").length;
        $("#tempToothC").html(emptyRow.replace("thlength", colspan));
    }


    modal_show(`ToothModalC`);
}

var appendTempToothC = (toothC, tSave = "INS") => {

    var toothOutputC = "";

    if (toothC) {
        if (tSave == "INS") {

            var emptyRow = $("#tempToothC").find("#emptyRow");

            if (emptyRow.length > 0)
                $("#tempToothC").html("");



            toothOutputC = `<tr id="drC_${toothC.detailRowNumber}">
                          <td>${toothC.detailRowNumber}</td>
                          <td>${toothC.statusId != 0 ? `${toothC.statusName}` : ""}</td>
                          <td>${toothC.diagnosisResonId != 0 ? `${toothC.diagnosisResonName}` : ""}</td>
                          <td>${toothC.serverityId != -1 ? `${toothC.serverityName}` : ""}</td>
                          <td>${toothC.comment}</td>
                     </tr>`
            $(toothOutputC).appendTo("#tempToothC");
        }
    }
    resetDentalForm("toothC");
}

$("#modalCloseToothC").on("click", function () {
    modal_close("ToothModalC");
});

$("#ToothModalC").on("hidden.bs.modal", function () {

    currentToothRowNumber = 0;
    $("#tempToothC").html("");
});

$("#modalCloseToothC").on("click", function () {

    modal_close("ToothModalC");
});

// ADMISSIONREFER ToothDiag END *************

// ADMISSIONREFER Treatment START *************
var addCompoundTreatment = (rowNumber) => {

    $("#tempTreatmentC tr").removeClass("highlight");
    $(`#dtr_${rowNumber}`).addClass("highlight");

    currentTreatmentRowNumber = rowNumber;

    if (arr_TempTreatmentLine.length > 0) {

        for (var d = 0; d < arr_TempTreatmentLine.length; d++) {

            var currentTreatmentC = arr_TempTreatmentLine[d];

            if (currentTreatmentC.rowNumber == currentTreatmentRowNumber)
                appendTempTreatmentC(currentTreatmentC);

        }
    }
    else {
        var colspan = $("#tempTreatmentListC thead th").length;
        $("#tempTreatmentC").html(emptyRow.replace("thlength", colspan));
    }


    modal_show(`TreatmentModalC`);


}

var appendTempTreatmentC = (treatmentC, tSave = "INS") => {

    var TreatmentOutputC = "";

    if (treatmentC) {
        if (tSave == "INS") {

            var emptyRow = $("#tempTreatmentC").find("#emptyRow");

            if (emptyRow.length > 0)
                $("#tempTreatmentC").html("");



            TreatmentOutputC = `<tr id="dtr_${treatmentC.detailRowNumber}">
                          <td>${treatmentC.detailRowNumber}</td>
                          <td>${treatmentC.serviceTypeId != 0 ? `${treatmentC.serviceTypeName}` : ""}</td>
                          <td>${treatmentC.serviceId != 0 ? `${treatmentC.serviceName}` : ""}</td>
                          <td>${treatmentC.serviceCount}</td>
                          <td>${treatmentC.serviceCountUnitId != 0 ? `${treatmentC.serviceCountUnitName}` : ""}</td>
                     </tr>`
            $(TreatmentOutputC).appendTo("#tempTreatmentC");
        }
    }
    resetDentalForm("treatmentC");

}

$("#TreatmentModalC").on("hidden.bs.modal", function () {

    currentTreatmentRowNumber = 0;
    $("#tempTreatmentC").html("");
});
$("#modalCloseTreatmentC").on("click", function () {

    modal_close("TreatmentModalC");
});

// ADMISSIONREFER Treasment END *************

function resetDentalForm(typeBox) {

    if (typeBox == "abuseHistory") {

        $("#abuseHistoryBox .select2").val("").trigger("change");
        $("#abuseHistoryBox input.form-control").val("");
        $("#substanceTypeId").select2("focus");
        typeSaveAbuseHistory = "INS";
    }
    else if (typeBox == "familyHistory") {
        $("#familyHistoryBox .select2").val("").trigger("change");
        $("#familyHistoryBox input.form-control").val("");
        $("#familyHistoryBox .funkyradio input:checkbox").prop("checked", false).trigger("change");
        $("#relatedPersonId").select2("focus");
        typeSaveFamilyHistory = "INS";
    }
    else if (typeBox == "drugHistory") {
        $("#drugHistoryBox .select2").val("").trigger("change");
        $("#drugHistoryBox input.form-control").val("");
        $("#medicationId").select2("focus");
        typeSaveDrugHistory = "INS";
    }
    else if (typeBox == "drugOrdered") {
        $("#drugOrderedBox .select2").val("").trigger("change");
        $("#drugOrderedBox input.form-control").val("");
        $("#productId").select2("focus");
        typeSaveDrugOrdered = "INS";
    }
    else if (typeBox == "medicalHistory") {
        $("#medicalHistoryBox .select2").val("").trigger("change");
        $("#medicalHistoryBox input.form-control").val("");
        $("#conditionId_medicalHistory").select2("focus");
        typeSaveMedicalHistory = "INS";
    }
    else if (typeBox == "diag") {
        $("#diagBox .select2").val("").trigger("change");
        $("#diagBox .funkyradio input:checkbox").prop("checked", false).trigger("change");
        $("#diagBox input.form-control").val("");
        $("#statusId").select2("focus");
        typeSaveDiag = "INS";
    }
    else if (typeBox == "tooth") {
        $("#dentalForm .select2").val("").trigger("change");
        $("#dentalForm .funkyradio input:checkbox").prop("checked", false).trigger("change");
        $("#dentalForm input.form-control").val("");
        $("#toothId").select2("focus");
        typeSaveTooth = "INS";
    }
    else if (typeBox == "toothC") {
        $("#toothBoxC .select2").val("").trigger("change");
        $("#toothBoxC input.form-control").val("");
        $("#toothStatusId").select2("focus");
        typeSaveToothC = "INS";
    }

    else if (typeBox == "treatmentC") {
        $("#treatmentBoxC .select2").val("").trigger("change");
        $("#treatmentBoxC .funkyradio input:checkbox").prop("checked", false).trigger("change");
        $("#treatmentBoxC input.form-control").val("");
        $("#serviceTypeId").select2("focus");
        typeSaveTreatmentC = "INS";
    }
    else if (typeBox == "tableDental") {
        arr_TempTooth = [];
        arr_TempToothLineDetail = [];
        arr_TempTreatmentLine = [];
        arr_TempAbuseHistory = [];
        arr_TempFamilyHistory = [];
        arr_TempDrugHistory = [];
        arr_TempDrugOrdered = [];
        arr_TempMedicalHistory = [];
        arr_TempDiagnosis = [];

        $("#tempadmissionField").html(fillEmptyRow(5));
        $("#tempinsuranceField").html(fillEmptyRow(6));

        $("#tempDiag").html(fillEmptyRow(5));
        $("#tempTooth").html(fillEmptyRow(9));
        $("#tempToothC").html(fillEmptyRow(6));
        $("#tempTreatmentC").html(fillEmptyRow(6));
        $("#tempabuseHistory").html(fillEmptyRow(8));
        $("#tempfamilyHistory").html(fillEmptyRow(5));
        $("#tempdrugHistory").html(fillEmptyRow(3));
        $("#tempdrugOrdered").html(fillEmptyRow(12));
        $("#tempmedicalHistory").html(fillEmptyRow(6));

    }

}

initSendDentalForm();

async function bindDentalElement() {
    if (dentalId !== 0)
        getDentalData(dentalId);
}

async function initSendDentalForm() {

    ColumnResizeable("tempabuseHistoryFieldList");
    ColumnResizeable("tempfamilyHistoryFieldList");
    ColumnResizeable("tempadmissionFieldList");
    ColumnResizeable("tempdiagnosisFieldList");
    ColumnResizeable("tempdrugHistoryFieldList");
    ColumnResizeable("tempdrugOrderedFieldList");
    ColumnResizeable("tempinsuranceFieldList");
    ColumnResizeable("temppastMedicalHistoryFieldList");
    ColumnResizeable("tempabuseHistoryList");
    ColumnResizeable("tempfamilyHistoryList");
    ColumnResizeable("tempdrugHistoryList");
    ColumnResizeable("tempdrugOrderedList");
    ColumnResizeable("tempmedicalHistoryList");
    ColumnResizeable("tempdiagnosisList");
    ColumnResizeable("tempToothList");
    ColumnResizeable("tempTreatmentList");

    bindDentalElement();
    inputMask();
    $("#isMissing").trigger("change");

    $(".card-body").fadeIn(1000);
}

$("#list_adm").on("click", function () {
    navigation_item_click('/MC/Dental', 'لیست دندانداکتری')
});
