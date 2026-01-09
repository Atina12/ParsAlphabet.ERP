var viewData_controllername = "AdmissionReferApi",
    viewData_get_AdmissionGet = `${viewData_baseUrl_MC}/${viewData_controllername}/getfeedback`,
    viewData_get_referPatientRecord = `${viewData_baseUrl_MC}/${viewData_controllername}/getreferpatientrecord`,

    viewData_get_NextAdmissionReferId = `${viewData_baseUrl_MC}/${viewData_controllername}/getnextadmissionreferid`,
    viewData_getReferAdmissionCheckExist = `${viewData_baseUrl_MC}/AdmissionReferApi/checkexist`,
    viewData_get_AdmissionGetDiagnosis = `${viewData_baseUrl_MC}/AdmissionApi/getdiagnosis`,
    viewData_get_AdmissionSearch = `${viewData_baseUrl_MC}/AdmissionApi/search`,
    viewData_display_form_title = "نمایش ارجاع",
    emptyRow = `<tr id="emptyRow"><td colspan="thlength" class="text-center">سطری وجود ندارد</td></tr>`,

    admissionIdentity = 0, admissionReferId = +$("#admissionReferId").val(), admissionReferTypeName = $("#admissionReferTypeName").val(), type =$("#type").val(), referralHID = "",
    currentAbuseHistoryRowNumber = 0, currentFamilyHistoryRowNumber = 0, currentCareActionRowNumber = 0,
    currentClinicFindingRowNumber = 0, currentDrugHistoryRowNumber = 0, currentDrugOrderedRowNumber = 0, currentMedicalHistoryRowNumber = 0, currentDiagRowNumber = 0,
    typeSaveAbuseHistory = "INS", typeSaveFamilyHistory = "INS", typeSaveCareAction = "INS",
    typeSaveClinicFinding = "INS", typeSaveDrugHistory = "INS", typeSaveDrugOrdered = "INS", typeSaveMedicalHistory = "INS", typeSaveDiag = "INS",
    arr_TempAbuseHistory = [], arr_TempFamilyHistory = [], arr_TempCareAction = [], arr_TempClinicFinding = [],
    arr_TempDrugHistory = [], arr_TempDrugOrdered = [], arr_TempMedicalHistory = [], arr_TempDiagnosis = [], referringDoctorId = 0, referringDoctorFirstName = "", referringDoctorLastName = "", referringDoctorSpecialityCode = 0, referringDoctorRoleCode = 0,
    referringDoctorMsc = 0, referringDoctorMscTypeId = 0, checkPatientNationalCode = 0, checkReferallNationalCode = 0,
    checkFirsLastName = "", checkDatetime = "";


function headerindexChoose(e) {
    let elm = $(e.target);

    if (e.keyCode === KeyCode.Enter) {
        let checkExist = false;
        checkExist = checkExistReferAdmissionId(+elm.val());
        if (checkExist) {
            display_paginationAsync(0, +elm.val());
            elm.val("");
        }
        else
            alertify.warning("این کد در سیستم وجود ندارد").delay(alertify_delay);
    }
}

function checkExistReferAdmissionId(id) {
    
    let outPut = $.ajax({
        url: viewData_getReferAdmissionCheckExist,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getReferAdmissionCheckExist);
        }
    });
    return outPut.responseJSON;
}

function display_pagination(opr) {
    var elemId = $("#admissionReferId").val();
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
    getNextAdmissionReferId(elemId, headerPagination);
}

function getNextAdmissionReferId(admId, headerPagination) {
    
    var model = {
        admissionReferId: admId,
        headerPagination: headerPagination
    }
    $.ajax({
        url: viewData_get_NextAdmissionReferId,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (data) {
            getReferType(data);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_get_AdmissionReferGet);
        }
    });
}

function showAdmssionRefer(type, AdmissionReferId) {
    
    if (type == 3) {
        getAdmissionReferData(AdmissionReferId);
    }
    else if (type == 1) {
        navigateToModalDisplay(`/MC/AdmissionRefer/displaygetrefer/${AdmissionReferId}`);
    }
}

function getReferType(AdmissionReferId) {
    
    var output = $.ajax({
        url: viewData_get_referType_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(AdmissionReferId),
        cache: false,
        async: false,
        success: function (result) {
            showAdmssionRefer(result, AdmissionReferId);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_get_referType_url);
            return 0;
        }
    });
    return output.responseJSON;
}

async function bindAdmissionReferElement() { 
    if (admissionReferId !== 0)
        getAdmissionReferData(admissionReferId);
}

function setAdmissionInfo(admissionId) {
    
    admissionIdentity = +admissionId;
    var dataAdm = getfeildByAdmissionId(admissionId)
    getDiagnosis(+admissionId);
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
                               <td>${dataAdm.admissionHID}</td> 
                               <td>${dataAdm.insurExpDatePersian}</td> 
                               <td>${dataAdm.attenderFullName}</td> 
                           </tr>`

    $("#admissionSelected").html(admissionOutput);
    
    modal_close("searchAdmissionModal");
    if ($("#referralId").val() !== "")
        $("#getreferral").click();
}

var getfeildByAdmissionId = (admId) => {
    
    var modelSearch = {
        stateId: 0,
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

var getDiagnosis = (admId) => {
    
    $.ajax({
        url: viewData_get_AdmissionGetDiagnosis,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(admId),
        success: function (data) {
            fillDiagnosis(data);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_get_AdmissionGetDiagnosis);
            return {
                status: -100,
                statusMessage: "عملیات با خطا مواجه شد",
                successfull: false
            };
        }
    });
};

var fillDiagnosis = (data) => {
    
    if (data !== null) {
        // Diagnosis
        if (data != null) {
            // $("#tempDiag").html("");
            var LineLength = data.length;
            for (var dld = 0; dld < LineLength; dld++) {
                var datadb = data[dld];
                var model = {
                    admissionId: datadb.admissionId,
                    rowNumber: datadb.rowNumber,
                    statusId: datadb.statusId,
                    statusName: datadb.statusId + " - " + datadb.statusName,
                    diagnosisResonId: datadb.diagnosisReasonId,
                    diagnosisResonName: datadb.diagnosisReasonId + " - " + datadb.diagnosisReasonName,
                    serverityId: datadb.serverityId,
                    serverityName: datadb.serverityId + " - " + datadb.serverityName,
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
        $(`#${elementId} i`).removeClass("fa fa-spinner fa-spin");
}

function getAdmissionReferData(admId) {
    
    $.ajax({
        url: viewData_get_AdmissionGet,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(admId),
        success: function (data) {
            resetAdmissionReferForm("admissionReferSendFeedback");
            fillAdmissionRefer(data);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_get_AdmissionGet);
            return {
                status: -100,
                statusMessage: "عملیات با خطا مواجه شد",
                successfull: false
            };
        }
    });
};

var fillAdmissionRefer = (data) => {
    
    if (data !== null) {
        $("#admissionReferId").val(data.id);
        $("#userFullName").val(`${data.userId} - ${data.userFullName}`);
        $("#AdmissionReferBox").removeClass("displaynone");
        setAdmissionInfo(data.admissionId);
        admissionIdentity = data.admissionId;
        referralHID = data.relatedHID;
        $("#referralId").val(referralHID);
        
        fillElementRefer(data)
        //getDiagnosis(data.admissionId);
        var datadb, LineLength;
        // AbuseHistory
        if (data.admissionReferAbuseHistoryLines != null) {
            LineLength = data.admissionReferAbuseHistoryLines.length;
            for (var dld = 0; dld < LineLength; dld++) {
                datadb = data.admissionReferAbuseHistoryLines[dld];

                var model = {
                    headerId: datadb.headerId,
                    rowNumber: datadb.rowNumber,
                    abuseDuration: datadb.abuseDuration,
                    abuseDurationUnitId: datadb.abuseDurationUnitId,
                    abuseDurationUnitName: datadb.abuseDurationUnitId + " - " + datadb.abuseDurationUnitName,
                    amountOfAbuseDosage: datadb.amountOfAbuseDosage,
                    amountOfAbuseUnitId: datadb.amountOfAbuseUnitId,
                    amountOfAbuseUnitName: datadb.amountOfAbuseUnitId + " - " + datadb.amountOfAbuseUnitName,
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
        if (data.admissionReferalFamilyHisotryLines != null) {
            LineLength = data.admissionReferalFamilyHisotryLines.length;
            for (var dld = 0; dld < LineLength; dld++) {
                datadb = data.admissionReferalFamilyHisotryLines[dld];

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
        // careAction
        if (data.admissionReferCareActionLines != null) {
            
            LineLength = data.admissionReferCareActionLines.length;
            for (var dld = 0; dld < LineLength; dld++) {
                datadb = data.admissionReferCareActionLines[dld];

                var model = {
                    headerId: datadb.headerId,
                    rowNumber: datadb.rowNumber,
                    actionDescription: datadb.actionDescription,
                    actionNameId: datadb.actionNameId,
                    actionName: datadb.actionNameId + " - " + datadb.actionName,
                    startDateTimePersian: datadb.startDateTimePersian,
                    endDateTimePersian: datadb.endDateTimePersian,
                    timeTaken: datadb.timeTaken,
                    timeTakenUnitId: datadb.timeTakenUnitId,
                    timeTakenUnitName: datadb.timeTakenUnitId + " - " + datadb.timeTakenUnitName,
                    timeTakenUnitDescription: datadb.timeTakenUnitDescription,
                };

                arr_TempCareAction.push(model);
                appendTempCareAction(model);
                model = {};
            }
        }
        // careAction
        // clinicFinding
        if (data.admissionReferClinicFindingLines != null) {
            LineLength = data.admissionReferClinicFindingLines.length;
            for (var dld = 0; dld < LineLength; dld++) {
                datadb = data.admissionReferClinicFindingLines[dld];

                var model = {
                    headerId: datadb.headerId,
                    rowNumber: datadb.rowNumber,
                    ageOfOnset: datadb.ageOfOnset,
                    findingId: datadb.findingId,
                    findingName: datadb.findingId + " - " + datadb.findingName,
                    nillSignificant: datadb.nillSignificant,
                    onsetDurationToPresent: datadb.onsetDurationToPresent,
                    onsetDurationToPresentUnitId: datadb.onsetDurationToPresentUnitId,
                    onsetDurationToPresentUnitName: datadb.onsetDurationToPresentUnitId + " - " + datadb.onsetDurationToPresentUnitName,
                    onsetDurationToPresentUnitDescription: datadb.onsetDurationToPresentUnitDescription,
                    severityId: datadb.severityId,
                    severityName: datadb.severityId + " - " + datadb.severityName,
                    onSetDateTimePersian: datadb.onSetDateTimePersian,
                    description: datadb.description,
                };

                arr_TempClinicFinding.push(model);
                appendTempClinicFinding(model);
                model = {};
            }
        }
        // clinicFinding
        // drugHistory
        if (data.admissionReferDrugHistoryLines != null) {
            LineLength = data.admissionReferDrugHistoryLines.length;
            for (var dld = 0; dld < LineLength; dld++) {
                datadb = data.admissionReferDrugHistoryLines[dld];

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
        if (data.admissionReferDrugOrderedLines != null) {
            
            LineLength = data.admissionReferDrugOrderedLines.length;
            for (var dld = 0; dld < LineLength; dld++) {
                datadb = data.admissionReferDrugOrderedLines[dld];

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
        if (data.admissionReferMedicalHistoryLines != null) {
            LineLength = data.admissionReferMedicalHistoryLines.length;
            for (var dld = 0; dld < LineLength; dld++) {
                datadb = data.admissionReferMedicalHistoryLines[dld];

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
                    onsetDurationToPresentUnitDescription:  datadb.onsetDurationToPresentUnitDescription,

                };

                arr_TempMedicalHistory.push(model);
                appendTempMedicalHistory(model);
                model = {};
            }
        }
        // medicalHistory
    }
};

function fillElementRefer(data) { 
    
    $("#iSQueriable").val(data.isQueriable == true ? "بله" : "خیر");
    $("#referredReasonId").val(data.referredReasonId);
    $("#referredTypeId").val(data.referredTypeId);
    $("#referralDescription").val(data.referredDescription);
    $("#nextEncounterUnitId").val(data.followUpNextEncounterUnitDescription);
    $("#nextEncounter").val(data.followUpNextEncounter);
    $("#nextEncounterDateTimePersian").val(data.followUpDateTimePersian);
    $("#nextEncounterType").val(data.followUpNextEncounterTypeName);
    $("#followUpDescription").val(data.followUpDescription);   
}

// ADMISSIONREFER GetReferAdmissionRefer START *************

var appendTempreferralInfo = (data) => {
    
    var dataOutput = "";
    if (data) {
        var emptyRow = $("#tempreferralInfo").find("#emptyRow");

        if (emptyRow.length > 0)
            $("#tempreferralInfo").html("");

        dataOutput = `<tr id="inT">
                          <td>${data.description}</td>
                          <td>${data.referredDateTime}</td>
                          <td>${data.referredFacility}</td>
                          <td>${data.referredProvider}</td>
                          <td>${data.role}</td>
                          <td>${data.specialty}</td>
                          <td>${data.referredReason}</td>
                          <td>${data.referredType}</td>
                     </tr>`

        $(dataOutput).appendTo("#tempreferralInfo");
    }
}

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

// ADMISSIONREFER GetReferAdmissionRefer  END *************
// ADMISSIONREFER AbuseHistory START *************

function modelAppendAbuseHistory(rowNumber, typeSave) {
    
    var modelAbuseHistory = {
        headerId: 0,
        rowNumber: rowNumber,
        abuseDuration: +$("#abuseDuration").val(),
        abuseDurationUnitId: +$("#abuseDurationUnitId").val(),
        abuseDurationUnitName: $("#abuseDurationUnitId").val(),
        amountOfAbuseDosage: +$("#amountOfAbuseDosage").val(),
        amountOfAbuseUnitId: +$("#amountOfAbuseUnitId").val(),
        amountOfAbuseUnitName: $("#amountOfAbuseUnitId").val(),
        quitDatePersian: $("#quitDate").val(),
        startDatePersian: $("#startDate").val(),
        substanceTypeId: +$("#substanceTypeId").val(),
        substanceTypeName: $("#substanceTypeId").val(),
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
                          <td>${data.amountOfAbuseUnitId != 0 ? `${data.amountOfAbuseUnitName}` : ""}</td>
                          <td>${data.abuseDuration}</td>
                          <td>${data.abuseDurationUnitId != 0 ? `${data.abuseDurationUnitName}` : ""}</td>
                          <td>${data.startDatePersian}</td>
                          <td>${data.quitDatePersian}</td>                          
                     </tr>`

            $(dataOutput).appendTo("#tempabuseHistory");
        }
        resetAdmissionReferForm("abuseHistory");
    }
}

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
        resetAdmissionReferForm("familyHistory");
    }
}

// ADMISSIONREFER FamilyHistory END *************
// ADMISSIONREFER CareAction START *************

function modelAppendCareAction(rowNumber, typeSave) {
    
    var modelCareAction = {
        headerId: 0,
        rowNumber: rowNumber,
        actionDescription: $("#actionDescription").val(),
        actionNameId: +$("#actionNameId").val(),
        actionName: $("#actionNameId").select2('data').length > 0 ? $("#actionNameId").select2('data')[0].text : "",
        startDateTimePersian: $("#startDateTime").val(),
        endDateTimePersian: $("#endDateTime").val(),
        timeTaken: $("#timeTaken").val(),
        timeTakenUnitId: +$("#timeTakenUnitId").val(),
        timeTakenUnitName: $("#timeTakenUnitId").select2('data').length > 0 ? $("#timeTakenUnitId").select2('data')[0].text : "",
    }

    if (typeSave == "INS")
        arr_TempCareAction.push(modelCareAction);

    appendTempCareAction(modelCareAction, typeSaveCareAction);
    typeSaveCareAction = "INS";
}

var appendTempCareAction = (data, tSave = "INS") => {
    
    var dataOutput = "";
    if (data) {
        if (tSave == "INS") {
            var emptyRow = $("#tempcareAction").find("#emptyRow");

            if (emptyRow.length > 0)
                $("#tempcareAction").html("");

            dataOutput = `<tr id="ca_${data.rowNumber}">
                          <td>${data.rowNumber}</td>
                          <td>${data.actionNameId != 0 ? `${data.actionName}` : ""}</td>
                          <td>${data.startDateTimePersian}</td>
                          <td>${data.endDateTimePersian}</td>
                          <td>${data.timeTaken}</td>
                          <td>${data.timeTakenUnitId != 0 ? `${data.timeTakenUnitDescription}` : ""}</td>
                          <td>${data.actionDescription}</td>
                     </tr>`

            $(dataOutput).appendTo("#tempcareAction");
        }
        resetAdmissionReferForm("careAction");
    }
}
// ADMISSIONREFER CareAction END *************
// ADMISSIONREFER ClinicFinding START *************

function modelAppendClinicFinding(rowNumber, typeSave) {
    
    var modelClinicFinding = {
        headerId: 0,
        rowNumber: rowNumber,
        ageOfOnset: $("#ageOfOnset").val(),
        findingId: +$("#findingId").val(),
        findingName: $("#findingId").select2('data').length > 0 ? $("#findingId").select2('data')[0].text : "",
        nillSignificant: $("#nillSignificant").prop("checked"),
        onsetDurationToPresent: $("#onsetDurationToPresent_clinicFinding").val(),
        onsetDurationToPresentUnitId: +$("#onsetDurationToPresentUnitId_clinicFinding").val(),
        onsetDurationToPresentUnitName: $("#onsetDurationToPresentUnitId_clinicFinding").select2('data').length > 0 ? $("#onsetDurationToPresentUnitId_clinicFinding").select2('data')[0].text : "",
        severityId: +$("#severityId").val(),
        severityName: $("#severityId").select2('data').length > 0 ? $("#severityId").select2('data')[0].text : "",
        onSetDateTimePersian: $("#onSetDateTime").val(),
        description: $("#description_clinicFinding").val(),
    }

    if (typeSave == "INS")
        arr_TempClinicFinding.push(modelClinicFinding);

    appendTempClinicFinding(modelClinicFinding, typeSaveClinicFinding);
    typeSaveClinicFinding = "INS";
}

var appendTempClinicFinding = (data, tSave = "INS") => {
    
    var dataOutput = "";
    if (data) {
        if (tSave == "INS") {
            var emptyRow = $("#tempclinicFinding").find("#emptyRow");

            if (emptyRow.length > 0)
                $("#tempclinicFinding").html("");

            dataOutput = `<tr id="cf_${data.rowNumber}">
                          <td>${data.rowNumber}</td>
                          <td>${data.ageOfOnset}</td>
                          <td>${data.onSetDateTimePersian}</td>
                          <td>${data.onsetDurationToPresent}</td>
                          <td>${data.onsetDurationToPresentUnitId != 0 ? `${data.onsetDurationToPresentUnitDescription}` : ""}</td>
                          <td>${data.findingId != 0 ? `${data.findingName}` : ""}</td>
                          <td>${data.severityId != -1 ? `${data.severityName}` : ""}</td>
                          <td>${data.nillSignificant ? "بلی" : "خیر"}</td>
                          <td>${data.description}</td>
                     </tr>`

            $(dataOutput).appendTo("#tempclinicFinding");
        }
        resetAdmissionReferForm("clinicFinding");
    }
}

// ADMISSIONREFER ClinicFinding END *************
// ADMISSIONREFER DrugHistory START *************

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
        resetAdmissionReferForm("drugHistory");
    }
}

// ADMISSIONREFER drugHistory END *************

// ADMISSIONREFER drugOrdered START *************

function modelAppendDrugOrdered(rowNumber, typeSave) {
    
    var modelDrugOrdered = {
        headerId: 0,
        rowNumber: rowNumber,
        administrationDateTimePersian: $("#administrationDateTime").val(),
        description: $("#description_drugOrdered").val(),
        totalNumber: $("#totalNumber").val(),
        dosage: $("#dosage").val(),
        dosageUnitId: +$("#dosageUnitId").val(),
        dosageUnitName: $("#dosageUnitId").select2('data').length > 0 ? $("#dosageUnitId").select2('data')[0].text : "",
        dosageUnitDescription: $("#dosageUnitId").select2('data').length > 0 ? $("#dosageUnitId").select2('data')[0].text : "",
        drugGenericName: $("#drugGenericName").val(),
        frequencyId: +$("#frequencyId").val(),
        frequencyName: $("#frequencyId").select2('data').length > 0 ? $("#frequencyId").select2('data')[0].text : "",
        longTerm: $("#longTerm").val(),
        longTermUnitId: +$("#longTermUnitId").val(),
        longTermUnitName: $("#longTermUnitId").select2('data').length > 0 ? $("#longTermUnitId").select2('data')[0].text : "",
        longTermUnitDescription: $("#longTermUnitId").select2('data').length > 0 ? $("#longTermUnitId").select2('data')[0].text : "",
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
        resetAdmissionReferForm("drugOrdered");
    }
}

// ADMISSIONREFER DrugOrdered END *************

// ADMISSIONREFER medicalHistory START *************

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
        resetAdmissionReferForm("medicalHistory");
    }
}


// ADMISSIONREFER medicalHistory END *************

// ADMISSIONREFER Diagnosis Start *************

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
    resetAdmissionReferForm("diag");
}

// ADMISSIONREFER Diagnosis END *************

function resetAdmissionReferForm(typeBox) {
    
    if (typeBox == "abuseHistory") {

        $("#abuseHistoryBox input.form-control").val("");
        typeSaveAbuseHistory = "INS";
    }
    else if (typeBox == "familyHistory") {
        $("#familyHistoryBox input.form-control").val("");        
        typeSaveFamilyHistory = "INS";
    }
    else if (typeBox == "careAction") {
        $("#careActionBox input.form-control").val("");
        typeSaveCareAction = "INS";
    }
    else if (typeBox == "clinicFinding") {
        $("#clinicFindingBox input.form-control").val("");
        typeSaveClinicFinding = "INS";
    }
    else if (typeBox == "drugHistory") {
        $("#drugHistoryBox input.form-control").val("");
        typeSaveDrugHistory = "INS";
    }
    else if (typeBox == "drugOrdered") {
        $("#drugOrderedBox input.form-control").val("");
        typeSaveDrugOrdered = "INS";
    }
    else if (typeBox == "medicalHistory") {
        $("#medicalHistoryBox input.form-control").val("");
        typeSaveMedicalHistory = "INS";
    }
    else if (typeBox == "diag") {
        $("#diagBox input.form-control").val("");
        typeSaveDiag = "INS";
    }
    else if (typeBox == "admissionReferSendFeedback") {
        arr_TempAbuseHistory = [];
        arr_TempFamilyHistory = [];
        arr_TempCareAction = [];
        arr_TempClinicFinding = [];
        arr_TempDrugHistory = [];
        arr_TempDrugOrdered = [];
        arr_TempMedicalHistory = [];
        arr_TempDiagnosis = [];

        referringDoctorFirstName = "";
        referringDoctorLastName = "";
        referringDoctorSpecialityCode = 0;
        referringDoctorRoleCode = 0;
        referringDoctorMsc = 0;
        referringDoctorMscTypeId = 0;
        checkPatientNationalCode = 0;
        checkReferallNationalCode = 0;
        checkFirsLastName = "";
        checkDatetime = "";

        $("#tempreferralInfo").html(fillEmptyRow(8));
        $("#tempabuseHistoryField").html(fillEmptyRow(8));
        $("#tempfamilyHistoryField").html(fillEmptyRow(5));
        $("#tempadmissionField").html(fillEmptyRow(5));
        $("#tempcareActionField").html(fillEmptyRow(7));
        $("#tempclinicalFindingField").html(fillEmptyRow(9));
        $("#tempdrugHistoryField").html(fillEmptyRow(3));
        $("#tempdrugOrderedField").html(fillEmptyRow(12));
        $("#temppastMedicalHistoryField").html(fillEmptyRow(6));
        $("#tempinsuranceField").html(fillEmptyRow(6));
        $("#tempfollowupPlanField").html(fillEmptyRow(6));  
        $("#tempdiagnosisField").html(fillEmptyRow(5));
        $("#tempreferralInfo").html(fillEmptyRow(8));
        $("#tempabuseHistory").html(fillEmptyRow(8));
        $("#tempfamilyHistory").html(fillEmptyRow(5));
        $("#tempcareAction").html(fillEmptyRow(7));
        $("#tempclinicFinding").html(fillEmptyRow(9));
        $("#tempdrugHistory").html(fillEmptyRow(3));
        $("#tempdrugOrdered").html(fillEmptyRow(12));
        $("#tempmedicalHistory").html(fillEmptyRow(6));
        $("#tempDiag").html(fillEmptyRow(5));
         
        $("#admissionSelected").html("");
        $("#admissionId").val("");
        $("#patientNationalCode").val("");
        $("#patientFullName").val("");
        $("#createDatePersian").val("");
        $("#searchAdmission").val("");

        $("#referralId").val("");
        $("#admissionReferId").val(0);
        admissionReferId = 0;
        $("#userFullName").val("");
        $("#AdmissionReferBox").addClass("displaynone");

        $("#referForm .select2").val("").trigger("change");
        $("#referForm .funkyradio input:checkbox").prop("checked", false).trigger("change");
        $("#referForm input.form-control").val("");

        $("#abuseHistoryBox input.form-control").val("");

        $("#familyHistoryBox input.form-control").val("");

        $("#bloodPerssureBox input.form-control").val("");

        $("#careActionBox input.form-control").val("");

        $("#clinicFindingBox input.form-control").val("");

        $("#drugHistoryBox input.form-control").val("");

        $("#drugOrderedBox input.form-control").val("");

        $("#medicalHistoryBox input.form-control").val("");

        $("#diagBox input.form-control").val("");

    }

}

initAdmissionGetReferForm();

async function initAdmissionGetReferForm() {
    
    ColumnResizeable("tempReferralInfoList");
    ColumnResizeable("tempabuseHistoryFieldList");
    ColumnResizeable("tempfamilyHistoryFieldList");
    ColumnResizeable("tempbloodPerssureTList");
    ColumnResizeable("tempcareActionFieldList");
    ColumnResizeable("tempclinicalFindingFieldList");
    ColumnResizeable("tempdrugHistoryFieldList");
    ColumnResizeable("tempdrugOrderedFieldList");
    ColumnResizeable("tempheightWeightTList");
    ColumnResizeable("temppastMedicalHistoryFieldList");
    ColumnResizeable("tempadmissionFieldList");
    ColumnResizeable("tempinsuranceFieldList");
    ColumnResizeable("temppulseTList");
    ColumnResizeable("tempvitalSingsTList");
    ColumnResizeable("tempwaistHipTList");
    ColumnResizeable("tempdiagnosisTList");
    ColumnResizeable("tempabuseHistoryList");
    ColumnResizeable("tempfamilyHistoryList");
    ColumnResizeable("tempcareActionList");
    ColumnResizeable("tempclinicFindingList");
    ColumnResizeable("tempdrugHistoryList");
    ColumnResizeable("tempdrugOrderedList");
    ColumnResizeable("tempmedicalHistoryList");
    ColumnResizeable("tempdiagnosisList");


    bindAdmissionReferElement();
    inputMask();
    $(".card-body").fadeIn(1000);
}

$("#list_adm").on("click", function () {

    navigation_item_click('/MC/AdmissionRefer', 'لیست نظام ارجاع')
});
