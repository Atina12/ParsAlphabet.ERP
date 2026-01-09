//$(".tab-content").show();
//$(".select2").select2();
//$("input:text").focus(function () { $(this).select(); });
//$(".card-body").hide(1);

var viewData_controllername = "DentalApi",
    viewData_get_abuseDurationUnitId = `${viewData_baseUrl_MC}/${viewData_controllername}/getabusedurationunitiddropdown`,
    viewData_get_amountOfAbuseUnitId = `${viewData_baseUrl_MC}/${viewData_controllername}/getamountofabuseunitiddropdown`,
    viewData_get_substanceTypeId = `${viewData_baseUrl_MC}/${viewData_controllername}/getsubstancetypeiddropdown`,
    viewData_get_causativeAgentCategoryId = `${viewData_baseUrl_MC}/AdmissionReferApi/getcausativeagentcategoryiddropdown`,
    viewData_get_causativeAgentId = `${viewData_baseUrl_MC}/AdmissionReferApi/getcausativeagentiddropdown`,
    viewData_get_diagnosisSeverityId = `${viewData_baseUrl_MC}/AdmissionReferApi/getdiagnosisseverityiddropdown`,
    viewData_get_reactionCategoryId = `${viewData_baseUrl_MC}/AdmissionReferApi/getreactioncategoryiddropdown`,
    viewData_get_reactionId = `${viewData_baseUrl_MC}/AdmissionReferApi/getreactioniddropdown`,
    viewData_get_conditionId = `${viewData_baseUrl_MC}/${viewData_controllername}/getconditioniddropdown`,
    viewData_get_relatedPersonId = `${viewData_baseUrl_MC}/${viewData_controllername}/getrelatedpersoniddropdown`,
    viewData_get_positionId = `${viewData_baseUrl_MC}/${viewData_controllername}/getpositioniddropdown`,
    viewData_get_actionNameId = `${viewData_baseUrl_MC}/${viewData_controllername}/getactionnameiddropdown`,
    viewData_get_timeTakenUnitId = `${viewData_baseUrl_MC}/${viewData_controllername}/gettimetakenunitiddropdown`,
    viewData_get_findingId = `${viewData_baseUrl_MC}/${viewData_controllername}/getfindingdropdown`,
    viewData_get_onsetDurationToPresentUnitId_clinicFinding = `${viewData_baseUrl_MC}/${viewData_controllername}/getonsetdurationtopresentunitidclinicaldropdown`,
    viewData_get_severityId = `${viewData_baseUrl_MC}/${viewData_controllername}/getseverityiddropdown`,
    viewData_get_erxId = `${viewData_baseUrl_MC}/${viewData_controllername}/geterxiddropdown`,
    viewData_get_routeId = `${viewData_baseUrl_MC}/${viewData_controllername}/getrouteiddropdown`,
    viewData_get_dosageUnitId = `${viewData_baseUrl_MC}/${viewData_controllername}/getdosageunitiddropdown`,
    viewData_get_frequencyId = `${viewData_baseUrl_MC}/${viewData_controllername}/getfrequencyiddropdown`,
    viewData_get_longTermUnitId = `${viewData_baseUrl_MC}/${viewData_controllername}/getlongtermunitiddropdown`,
    viewData_get_onsetDurationToPresentUnitId_medicalHistory = `${viewData_baseUrl_MC}/${viewData_controllername}/getonsetdurationtopresentunitidmedicaldropdown`,
    viewData_get_toothName = `${viewData_baseUrl_MC}/${viewData_controllername}/gettoothnamedropdown`,
    viewData_get_toothPart = `${viewData_baseUrl_MC}/${viewData_controllername}/gettoothpartdropdown`,
    viewData_get_toothSegment = `${viewData_baseUrl_MC}/${viewData_controllername}/gettoothsegmentdropdown`,
    viewData_get_treatmentService = `${viewData_baseUrl_MC}/${viewData_controllername}/gettreatmentservicedropdown`,
    viewData_get_treatmentServiceType = `${viewData_baseUrl_MC}/${viewData_controllername}/getservicetypedropdown`,
    viewData_get_treatmentServiceUnit = `${viewData_baseUrl_MC}/${viewData_controllername}/gettreatmentserviceunitdropdown`,
    viewData_get_methodId = `${viewData_baseUrl_MC}/${viewData_controllername}/getmethodiddropdown`,
    viewData_get_lateralityId = `${viewData_baseUrl_MC}/${viewData_controllername}/getlateralityiddropdown`,
    //viewData_get_SearchAdmission = `${viewData_baseUrl_MC}/AdmissionApi/searchinbound`,
    viewData_get_SearchAdmission = `${viewData_baseUrl_MC}/AdmissionApi/searchinbound`,  /*searchinbounddental*/
    viewData_get_DentalGet = `${viewData_baseUrl_MC}/${viewData_controllername}/get`,
    viewData_get_AdmissionGetDiagnosis = `${viewData_baseUrl_MC}/AdmissionApi/getdiagnosis`,
    viewData_get_StatusId = `${viewData_baseUrl_MC}/PrescriptionApi/diagnosisstatusid`,
    viewData_get_DiagnosisReasonId = `${viewData_baseUrl_MC}/${viewData_controllername}/diagnosisreasonid`,
    viewData_get_Serverity = `${viewData_baseUrl_MC}/PrescriptionApi/serverityid`,
    emptyRow = `<tr id="emptyRow"><td colspan="thlength" class="text-center">سطری وجود ندارد</td></tr>`,
    viewData_save_Dental = `${viewData_baseUrl_MC}/${viewData_controllername}/save`,
    admissionIdentity = 0, dentalId = +$("#dentalId").val(), dentalHID = "",
    currentAbuseHistoryRowNumber = 0, currentFamilyHistoryRowNumber = 0, currentAdverseReactionRowNumber = 0,
    typeSaveAbuseHistory = "INS", typeSaveFamilyHistory = "INS",
    typeSaveAdverseReaction = "INS", typeSaveTooth = "INS", typeSaveToothLineDetail = "INS", typeSaveTreatmentC = "INS",
    typeSaveDrugHistory = "INS", typeSaveDrugOrdered = "INS", typeSaveMedicalHistory = "INS",
    typeSaveDiag = "INS", typeSaveToothC = "INS", 
    arr_TempAbuseHistory = [], arr_TempFamilyHistory = [],
    arr_TempDrugHistory = [], arr_TempDrugOrdered = [], arr_TempMedicalHistory = [],
    arr_TempAdverseReaction = [], arr_TempTooth = [], arr_TempToothLineDetail = [], arr_TempTreatmentLine = [],
    arr_TempDiagnosis = [], referringDoctorId = 0,admissionId=0, currentToothRowNumber = 0,
    FormAbuseHistory = $('#abuseHistoryForm').parsley(), FormFamilyHistory = $('#familyHistoryForm').parsley(),
    FormDrugHistory = $('#drugHistoryForm').parsley(), FormDrugOrdered = $('#drugOrderedForm').parsley(),
    FormMedicalHistory = $('#medicalHistoryForm').parsley(),
    diagForm = $('#diagForm').parsley(), formDental = $('#dentalForm').parsley(),
    formTreatmentC = $('#treatmentBoxC').parsley(), formToothC = $('#toothBoxC').parsley(), FormAdverseReaction = $("#adverseReactionForm").parsley();

var pagetable = {
    pagetable_id: "searchAdmissionModal_pagetable",
    pagerowscount: 50,
    currentpage: 1,
    endData: false,
    pageNo: 0,
    lastpage: 1,
    currentrow: 1,
    currentcol: 0,
    highlightrowid: 0,
    trediting: false,
    filteritem: "",
    filtervalue: "",
    headerType: "outline",
    selectedItems: [],
    getpagetable_url: viewData_get_SearchAdmission,
};

arr_pagetables.push(pagetable);

async function disableSaveButtonAsync(disable) {
    $("#saveForm").prop("disabled", disable);
}

$("#mainDentalFormBox").on("keydown", function (ev) {
    if (ev.ctrlKey && ev.shiftKey && ev.keyCode === KeyCode.Insert) {
        ev.preventDefault();
        $("#saveForm").click();
    }
});

document.onkeydown = function (e) {
    if (e.ctrlKey && e.keyCode === KeyCode.key_s) {
        e.preventDefault();
        saveDentalForm();
    }
    else if (e.ctrlKey && e.altKey && e.keyCode === KeyCode.key_n) {
        e.preventDefault();
        e.stopPropagation();
        $("#newForm").click();
    }
    else if (e.ctrlKey && e.shiftKey && e.keyCode === KeyCode.key_l) {
        e.preventDefault();
        e.stopPropagation();
        $("#list_adm").click();
    }
};

async function saveDentalForm() {
    await disableSaveButtonAsync(true);


    if (validateAllTab()) {
        var msg_temp_srv = alertify.warning("حتما یک بخش را کامل نمایید");
        msg_temp_srv.delay(prMsg.delay);
        await disableSaveButtonAsync(false);
        return;
    }

    if (admissionIdentity == 0) {
        var msg_temp_srv = alertify.warning(prMsg.selectAdmission);
        msg_temp_srv.delay(prMsg.delay);
        await disableSaveButtonAsync(false);
        return;
    }


    if (arr_TempDiagnosis.length === 0) {
        var msg_temp_srv = alertify.warning("تشخیص را وارد کنید");
        msg_temp_srv.delay(prMsg.delay);
        await disableSaveButtonAsync(false);
        return;
    }

    for (var i = 0; i < arr_TempDiagnosis.length; i++)
        arr_TempDiagnosis[i].admissionId = admissionIdentity;
    
    var model = {
        id: dentalId,
        admissionId: admissionIdentity,
        relatedHID: dentalHID,
        lifeCycleStateId: 0,
        referringDoctorId: referringDoctorId,
        iSQueriable: $('#iSQueriable').prop("checked"),
        admissionDentalAbuseHistoryLines: arr_TempAbuseHistory,
        admissionDentalFamilyHisotryLines: arr_TempFamilyHistory,
        admissionDentalDrugHistoryLines: arr_TempDrugHistory,
        admissionDentalDrugOrderedLines: arr_TempDrugOrdered,
        admissionDentalMedicalHistoryLines: arr_TempMedicalHistory,
        admissionDentalAdverseReactionLines: arr_TempAdverseReaction,
        admissionDentalDiagnosisLines: arr_TempDiagnosis,
        admissionDentalToothLines: arr_TempTooth,
        admissionDentalToothLineDetails: arr_TempToothLineDetail,
        admissionDentalTreatmentLineDetails: arr_TempTreatmentLine
    };

    saveDentalAsync(model).then(async (data) => {
        if (data.successfull) {            
            setTimeout(() => {
                navigation_item_click("/MC/Dental", "لیست دندانداکتری");
            }, 400);
            var msgError = alertify.success(data.statusMessage);
            msgError.delay(alertify_delay);
        }
        else {
            var msgError = alertify.error(data.statusMessage);
            msgError.delay(alertify_delay);
        }
    }).then(async () => {
        await disableSaveButtonAsync(false);
    });
}

function validateDentalForm() {

    var validate = formDental.validate();
    validateSelect2(formDental);
    return !validate;
}

function validateAllTab() {
    if (arr_TempAbuseHistory.length === 0 && arr_TempFamilyHistory.length === 0 &&
        arr_TempDrugHistory.length === 0 && arr_TempDrugOrdered.length === 0 && arr_TempMedicalHistory.length === 0 && arr_TempTreatmentLine.length === 0 &&
        arr_TempToothLineDetail.length === 0 && arr_TempAdverseReaction.length === 0 && arr_TempTooth.length === 0
    ) {
        return true;
    }
    return false;
}

async function saveDentalAsync(dental) {
    
    let result = await $.ajax({
        url: viewData_save_Dental,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(dental),
        success: function (data) {
            return data;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_save_Dental);
            return {
                status: -100,
                statusMessage: "عملیات با خطا مواجه شد",
                successfull: false
            };
        }
    });

    return result;
}

async function bindDentalElement() {

    fill_select2(viewData_get_toothName, "toothId", true);
    fill_select2(viewData_get_toothPart, "partId", true);
    fill_select2(viewData_get_toothSegment, "segmentId", true);

    fill_select2(viewData_get_substanceTypeId, "substanceTypeId", true);
    fill_select2(viewData_get_amountOfAbuseUnitId, "amountOfAbuseUnitId", true);
    fill_select2(viewData_get_abuseDurationUnitId, "abuseDurationUnitId", true);

    fill_select2(viewData_get_relatedPersonId, "relatedPersonId", true);
    fill_select2(viewData_get_conditionId, "conditionId_familyHistory", true, 0, true);

    fill_select2(viewData_get_erxId, "medicationId", true, 0, true);
    fill_select2(viewData_get_routeId, "routeId_drugHistory", true);

    fill_select2(viewData_get_erxId, "productId", true,0,true);
    fill_select2(viewData_get_routeId, "routeId_drugOrdered", true);
    fill_select2(viewData_get_frequencyId, "frequencyId", true);
    fill_select2(viewData_get_dosageUnitId, "dosageUnitId", true);
    fill_select2(viewData_get_longTermUnitId, "longTermUnitId", true);

    fill_select2(viewData_get_conditionId, "conditionId_medicalHistory", true, 0, true);
    fill_select2(viewData_get_onsetDurationToPresentUnitId_medicalHistory, "onsetDurationToPresentUnitId_medicalHistory", true);

    fill_select2(viewData_get_StatusId, "statusId", true);
    fill_select2(viewData_get_DiagnosisReasonId, "diagnosisResonId", true, 0, true);
    fill_select2(viewData_get_Serverity, "serverityId", true);

    fill_select2(viewData_get_StatusId, "toothStatusId", true);
    fill_select2(viewData_get_DiagnosisReasonId, "toothDiagnosisResonId", true, 0, true);
    fill_select2(viewData_get_Serverity, "toothServerityId", true);

    fill_select2(viewData_get_treatmentServiceType, "serviceTypeId", true,);
    fill_select2(viewData_get_treatmentServiceUnit, "serviceCountUnitId", true,);

    fill_select2(viewData_get_causativeAgentCategoryId, "causativeAgentCategoryId", true, 0, false);
    fill_select2(viewData_get_causativeAgentId, "causativeAgentId", true, 0, true);
    fill_select2(viewData_get_diagnosisSeverityId, "diagnosisSeverityId", true);
    fill_select2(viewData_get_reactionCategoryId, "reactionCategoryId", true, 0, false);
    fill_select2(viewData_get_reactionId, "reactionId", true, 0, false);


    //fill_select2(viewData_get_causativeAgentCategoryId, "causativeAgentCategoryId", true,);

    //fill_select2(viewData_get_causativeAgentId, "causativeAgentId", true,);

    //fill_select2(viewData_get_diagnosisSeverityId, "diagnosisSeverityId", true);

    //fill_select2(viewData_get_reactionCategoryId, "reactionCategoryId", true,);

    ////fill_select2(viewData_get_reactionId, "reactionId", true,);



    //fill_select2(viewData_get_positionId, "positionId_bloodPerssure", true);

    //fill_select2(viewData_get_actionNameId, "actionNameId", true,);

    //fill_select2(viewData_get_timeTakenUnitId, "timeTakenUnitId", true);

    //fill_select2(viewData_get_findingId, "findingId", true,);
    //fill_select2(viewData_get_onsetDurationToPresentUnitId_clinicFinding, "onsetDurationToPresentUnitId_clinicFinding", true);
    //fill_select2(viewData_get_severityId, "severityId", true);

    if (dentalId !== 0)
        getDentalData(dentalId);
}

var focusSearchedRow = (i) => {
    $("#tempAdmission tr").removeClass("highlight");
    $(`#tempAdmission #adm_${i}`).addClass("highlight");
    $(`#tempAdmission #adm_${i} > td > button`).focus();
}

function admissionRowKeyDown(index, event) {
    if (event.which === KeyCode.ArrowDown) {
        event.preventDefault();
        if ($(`#tempAdmission #adm_${index + 1}`).length > 0) {
            $("#tempAdmission tr").removeClass("highlight");
            $(`#tempAdmission #adm_${index + 1}`).addClass("highlight");
            $(`#tempAdmission #adm_${index + 1} > td > button`).focus();
        }
    }

    if (event.which === KeyCode.ArrowUp) {
        event.preventDefault();
        if ($(`#tempAdmission #adm_${index - 1}`).length > 0) {
            $("#tempAdmission tr").removeClass("highlight");
            $(`#tempAdmission #adm_${index - 1}`).addClass("highlight");
            $(`#tempAdmission #adm_${index - 1} > td > button`).focus();
        }
    }

}

function setAdmissionInfo_otherConfig(data) {
    fill_select2(viewData_get_treatmentService, "serviceId", true, data.admissionId);
    admissionId = data.admissionId;
    admissionIdentity = +data.admissionId;
    referringDoctorId = data.attenderId;
    checkPatientNationalCode = data.patientNationalCode;
}

function displayAdmission(id) {
    var saleTypeId = 1;
    let admissionType = 2
    fillRequestHeader(admissionType, saleTypeId);
    getRequestData(`${viewData_baseUrl_MC}/AdmissionApi/display`, admissionType, saleTypeId, id);
}

//var getDiagnosis = (admId) => {
//    $.ajax({
//        url: viewData_get_AdmissionGetDiagnosis,
//        type: "post",
//        dataType: "json",
//        contentType: "application/json",
//        data: JSON.stringify(admId),
//        success: function (data) {
//            fillDiagnosis(data);
//        },
//        error: function (xhr) {
//            error_handler(xhr, viewData_get_AdmissionGetDiagnosis);
//            return {
//                status: -100,
//                statusMessage: "عملیات با خطا مواجه شد",
//                successfull: false
//            };
//        }
//    });
//};

//var fillDiagnosis = (data) => {
//    if (data !== null) {
//        // Diagnosis
//        if (data != null) {
//            //("#tempDiag").html("");
//            var LineLength = data.length;
//            for (var dld = 0; dld < LineLength; dld++) {
//                var datadb = data[dld];
//                var model = {
//                    admissionId: datadb.admissionId,
//                    rowNumber: datadb.rowNumber,
//                    statusId: datadb.statusId,
//                    statusName: datadb.statusId + " - " + datadb.statusName,
//                    diagnosisResonId: datadb.diagnosisReasonId,
//                    diagnosisResonName: datadb.diagnosisReasonId + " - " + datadb.diagnosisReasonName,
//                    serverityId: datadb.serverityId,
//                    serverityName: datadb.serverityId + " - " + datadb.serverityName,
//                    comment: datadb.comment,
//                };

//                arr_TempDiagnosis.push(model);
//                appendTempDiagnosis(model);
//                model = {};
//            }
//            rebuildDaigRow()
//        }
//        // Diagnosis
//    }
//};

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
    var dateField, dateFieldResult = timeFieldResult;
 
    if (checkResponse(data)) {
        $("#userFullName").val(`${data.userId} - ${data.userFullName}`);
        $("#dentalFormBox").removeClass("displaynone");

        dentalHID = data.relatedHID;
        $("#dentalId").val(dentalHID);
        //setAdmissionInfo(data.admissionId, data.patientId, data.patientFullName, data.patientNationalCode,
        //    data.basicInsurerName, data.insuranceBoxName, data.compInsuranceBoxName, data.admissionHID, data.insurExpDatePersian, data.attenderFullName, data.thirdPartyId , data.thirdPartyName);

        fillAdmission(data)
        //setAdmissionInfo(data.admissionId, 9);

        admissionIdentity = data.admissionId;
        
        var datadb, LineLength;
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
                
        // AdverseReaction
        if (data.dentalAdverseReactionLines != null) {
            LineLength = data.dentalAdverseReactionLines.length;
            for (var dld = 0; dld < LineLength; dld++) {
                datadb = data.dentalAdverseReactionLines[dld];

                var model = {
                    headerId: datadb.headerId,
                    rowNumber: datadb.rowNumber,
                    reactionId: datadb.reactionId,
                    reactionName: datadb.reactionId + " - " + datadb.reactionName,
                    description: datadb.description,
                    reactionCategoryId: datadb.reactionCategoryId,
                    reactionCategoryName: datadb.reactionCategoryId + " - " + datadb.reactionCategoryName,
                    diagnosisSeverityId: datadb.diagnosisSeverityId,
                    diagnosisSeverityName: datadb.diagnosisSeverityId + " - " + datadb.diagnosisSeverityName,
                    causativeAgentId: datadb.causativeAgentId,
                    causativeAgentName: datadb.causativeAgentId + " - " + datadb.causativeAgentName,
                    causativeAgentCategoryId: datadb.causativeAgentCategoryId,
                    causativeAgentCategoryName: datadb.causativeAgentCategoryId + " - " + datadb.causativeAgentCategoryName,
                };

                arr_TempAdverseReaction.push(model);
                appendTempAdverseReaction(model);
                model = {};
            }
        }
        // AdverseReaction

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

                var dateField = datadb.diagnosisDateTimePersian;
                var dateFieldResult = dateField == null ? "" : dateField.split(" ")[0];
                var timeFieldResult = dateField == null ? "" : dateField.split(" ")[1];

                var model = {
                    headerId: datadb.headerId,
                    rowNumber: datadb.rowNumber,
                    statusId: datadb.statusId,
                    statusName: datadb.statusId + " - " + datadb.diagnosisStatusName,
                    diagnosisResonId: datadb.diagnosisReasonId,
                    diagnosisResonName: datadb.diagnosisReasonId + " - " + datadb.diagnosisReasonName,
                    serverityId: datadb.serverityId,
                    serverityName: datadb.serverityId + " - " + datadb.severityName,
                    diagnosisDateTimePersian: dateFieldResult + " " + timeFieldResult,
                    comment: datadb.comment,
                };

                arr_TempDiagnosis.push(model);
                appendTempDiagnosis(model);
                model = {};
            }
        }
        // Diagnosis

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
                    diagnosisDateTimePersian: dateFieldResult + " " + timeFieldResult,
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
                dateField = datadb.diagnosisDateTimePersian;
                dateFieldResult = dateField == null ? "" : dateField.split(" ")[0];
                timeFieldResult = dateField == null ? "" : dateField.split(" ")[1];

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
                    diagnosisDateTimePersian: dateFieldResult + " " + timeFieldResult,
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
                    startDateTimePersian: datadb.startDateTimePersian,
                    endDateTimePersian: datadb.endDateTimePersian,

                };

                arr_TempTreatmentLine.push(model);
                model = {};
            }
        }
        // treatment
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
    $("#tempadverseReactionField").html(fillEmptyRow(7));
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

// Dental AbuseHistory START *************

$("#addabuseHistory").on("click", function () {

    var validate = FormAbuseHistory.validate();
    validateSelect2(FormAbuseHistory);
    if (!validate) return;
    var start = $("#startDate").val();
    var end = $("#quitDate").val();
    var resComparison = comparisonStartEnd(start, end);

    //if (resComparison) {
    //    var msgError = alertify.warning("تاریخ شروع نمیتواند از تاریخ پایان بیشتر باشد");
    //    msgError.delay(alertify_delay);
    //    return;
    //}

    if (typeSaveAbuseHistory == "INS") {
        var rowNumberAbuseHistory = arr_TempAbuseHistory.length + 1;
        modelAppendAbuseHistory(rowNumberAbuseHistory, typeSaveAbuseHistory)
    }
    else {
        var rowNumberAbuseHistory = currentAbuseHistoryRowNumber;
        modelAppendAbuseHistory(rowNumberAbuseHistory, typeSaveAbuseHistory);
    }
});

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
                          <td id="operationah_${data.rowNumber}">
                              <button type="button" id="deleteah_${data.rowNumber}" onclick="removeFromTempAbuseHistory(${data.rowNumber})" class="btn maroon_outline" data-original-title="حذف سطر" style="margin-left:7px">
                                   <i class="fa fa-trash"></i>
                              </button>
                              <button type="button" id="Editah_${data.rowNumber}" onclick="EditFromTempAbuseHistory(${data.rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                   <i class="fa fa-pen"></i>
                              </button>
                          </td>
                     </tr>`

            $(dataOutput).appendTo("#tempabuseHistory");
        }
        else {
            var i = arr_TempAbuseHistory.findIndex(x => x.rowNumber == data.rowNumber);
            arr_TempAbuseHistory[i].headerId = data.headerId;
            arr_TempAbuseHistory[i].rowNumber = data.rowNumber;
            arr_TempAbuseHistory[i].abuseDuration = data.abuseDuration;
            arr_TempAbuseHistory[i].abuseDurationUnitId = data.abuseDurationUnitId;
            arr_TempAbuseHistory[i].abuseDurationUnitName = data.abuseDurationUnitName;
            arr_TempAbuseHistory[i].amountOfAbuseDosage = data.amountOfAbuseDosage;
            arr_TempAbuseHistory[i].amountOfAbuseUnitId = data.amountOfAbuseUnitId;
            arr_TempAbuseHistory[i].amountOfAbuseUnitName = data.amountOfAbuseUnitName;
            arr_TempAbuseHistory[i].quitDatePersian = data.quitDatePersian;
            arr_TempAbuseHistory[i].startDatePersian = data.startDatePersian;
            arr_TempAbuseHistory[i].substanceTypeId = data.substanceTypeId;
            arr_TempAbuseHistory[i].substanceTypeName = data.substanceTypeName;

            $(`#ah_${data.rowNumber} td:eq(0)`).text(`${data.rowNumber}`);
            $(`#ah_${data.rowNumber} td:eq(1)`).text(`${data.substanceTypeId != 0 ? data.substanceTypeName : ""}`);
            $(`#ah_${data.rowNumber} td:eq(2)`).text(`${data.amountOfAbuseDosage}`);
            $(`#ah_${data.rowNumber} td:eq(3)`).text(`${data.amountOfAbuseUnitId != 0 ? data.amountOfAbuseUnitName : ""}`);
            $(`#ah_${data.rowNumber} td:eq(4)`).text(`${data.abuseDuration}`);
            $(`#ah_${data.rowNumber} td:eq(5)`).text(`${data.abuseDurationUnitId != 0 ? `${data.abuseDurationUnitName}` : ""}`);
            $(`#ah_${data.rowNumber} td:eq(6)`).text(`${data.startDatePersian}`);
            $(`#ah_${data.rowNumber} td:eq(7)`).text(`${data.quitDatePersian}`);

        }
        resetDentalForm("abuseHistory");
    }
}

var EditFromTempAbuseHistory = (rowNumber) => {

    $("#tempabuseHistory tr").removeClass("highlight");
    $(`#ah_${rowNumber}`).addClass("highlight");

    var arr_TempAbuseHistoryE = arr_TempAbuseHistory.filter(line => line.rowNumber === rowNumber)[0];

    $("#abuseDuration").val(arr_TempAbuseHistoryE.abuseDuration);

    $("#abuseDurationUnitId").val(arr_TempAbuseHistoryE.abuseDurationUnitId).trigger('change');

    $("#amountOfAbuseDosage").val(arr_TempAbuseHistoryE.amountOfAbuseDosage);

    $("#amountOfAbuseUnitId").val(arr_TempAbuseHistoryE.amountOfAbuseUnitId).trigger('change');

    $("#quitDate").val(arr_TempAbuseHistoryE.quitDatePersian);

    $("#startDate").val(arr_TempAbuseHistoryE.startDatePersian);

    $("#substanceTypeId").val(arr_TempAbuseHistoryE.substanceTypeId).trigger('change');

    $("#substanceTypeId").select2("focus");
    typeSaveAbuseHistory = "UPD";
    currentAbuseHistoryRowNumber = arr_TempAbuseHistoryE.rowNumber;
}

$("#canceledabuseHistory").on("click", function () {

    $("#abuseHistoryBox .select2").val("").trigger("change");
    $("#abuseHistoryBox input.form-control").val("");
    $("#substanceTypeId").select2("focus");
    typeSaveAbuseHistory = "INS";
});

var removeFromTempAbuseHistory = (rowNumber) => {
    currentAbuseHistoryRowNumber = rowNumber;

    $("#tempabuseHistory tr").removeClass("highlight");
    $(`#ah_${rowNumber}`).addClass("highlight");

    var removeRowResult = removeRowFromArray(arr_TempAbuseHistory, "rowNumber", rowNumber);

    if (removeRowResult.statusMessage == "removed")
        $(`#ah_${rowNumber}`).remove();

    if (arr_TempAbuseHistory.length == 0) {
        var colspan = $("#tempabuseHistoryList thead th").length;
        $("#tempabuseHistory").html(emptyRow.replace("thlength", colspan));
    }

    rebuildAbuseHistoryRow();
}

function rebuildAbuseHistoryRow() {

    var arr = arr_TempAbuseHistory;

    var table = "tempabuseHistory";

    if (arr.length === 0)
        return;

    for (var b = 0; b < arr.length; b++) {
        var newRowNumber = b + 1;
        arr[b].rowNumber = newRowNumber;

        $(`#${table} tr`)[b].children[0].innerText = arr[b].rowNumber;
        $(`#${table} tr`)[b].setAttribute("id", `ah_${arr[b].rowNumber}`);
        $(`#${table} tr`)[b].children[0].innerText = arr[b].rowNumber;

        if ($(`#${table} tr`)[b].children[8].innerHTML !== "") {


            $(`#${table} tr`)[b].children[8].innerHTML = `<button type="button" onclick="removeFromTempAbuseHistory(${arr[b].rowNumber})" class="btn maroon_outline" data-toggle="tooltip" data-placement="bottom" title="حذف سطر" style="margin-left:7px">
                                                                     <i class="fa fa-trash"></i>
                                                           </button>
                                                           <button type="button" onclick="EditFromTempAbuseHistory(${arr[b].rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                                                <i class="fa fa-pen"></i>
                                                           </button>
                                                           `;
        }

    }
    arr_TempAbuseHistory = arr;
}

// Dental AbuseHistory END *************

// Dental FamilyHistory START *************
$("#addfamilyHistory").on("click", function () {

    var validate = FormFamilyHistory.validate();
    validateSelect2(FormFamilyHistory);
    if (!validate) return;

    if (typeSaveFamilyHistory == "INS") {
        var rowNumberFamilyHistory = arr_TempFamilyHistory.length + 1;
        modelAppendFamilyHistory(rowNumberFamilyHistory, typeSaveFamilyHistory)
    }
    else {
        var rowNumberFamilyHistory = currentFamilyHistoryRowNumber;
        modelAppendFamilyHistory(rowNumberFamilyHistory, typeSaveFamilyHistory);
    }
});

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
                            <td id="operationfh_${data.rowNumber}">
                              <button type="button" id="deletefh_${data.rowNumber}" onclick="removeFromTempFamilyHistory(${data.rowNumber})" class="btn maroon_outline" data-original-title="حذف سطر" style="margin-left:7px">
                                   <i class="fa fa-trash"></i>
                              </button>
                              <button type="button" id="Editfh_${data.rowNumber}" onclick="EditFromTempFamilyHistory(${data.rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                   <i class="fa fa-pen"></i>
                              </button>
                          </td>
                     </tr>`

            $(dataOutput).appendTo("#tempfamilyHistory");
        }
        else {

            var i = arr_TempFamilyHistory.findIndex(x => x.rowNumber == data.rowNumber);
            arr_TempFamilyHistory[i].headerId = data.headerId;
            arr_TempFamilyHistory[i].rowNumber = data.rowNumber;
            arr_TempFamilyHistory[i].conditionId = data.conditionId;
            arr_TempFamilyHistory[i].conditionName = data.conditionName;
            arr_TempFamilyHistory[i].description = data.description;
            arr_TempFamilyHistory[i].isCauseofDeath = data.isCauseofDeath;
            arr_TempFamilyHistory[i].relatedPersonId = data.relatedPersonId;
            arr_TempFamilyHistory[i].relatedPersonName = data.relatedPersonName;

            $(`#fh_${data.rowNumber} td:eq(0)`).text(`${data.rowNumber}`);
            $(`#fh_${data.rowNumber} td:eq(1)`).text(`${data.relatedPersonId != 0 ? `${data.relatedPersonName}` : ""}`);
            $(`#fh_${data.rowNumber} td:eq(2)`).text(`${data.conditionId != 0 ? `${data.conditionName}` : ""}`);
            $(`#fh_${data.rowNumber} td:eq(3)`).text(`${data.isCauseofDeath ? "بلی" : "خیر"}`);
            $(`#fh_${data.rowNumber} td:eq(4)`).text(`${data.description}`);

        }
        resetDentalForm("familyHistory");
    }
}

var EditFromTempFamilyHistory = (rowNumber) => {

    $("#tempfamilyHistory tr").removeClass("highlight");
    $(`#fh_${rowNumber}`).addClass("highlight");
    var detailFamilyHistory = "";

    var arr_TempFamilyHistoryE = arr_TempFamilyHistory.filter(line => line.rowNumber === rowNumber)[0];

    $("#conditionId_familyHistory").val(arr_TempFamilyHistoryE.conditionId);
    detailFamilyHistory = new Option(`${arr_TempFamilyHistoryE.conditionName}`, arr_TempFamilyHistoryE.conditionId, true, true);
    $("#conditionId_familyHistory").append(detailFamilyHistory).trigger('change');
    detailFamilyHistory = "";

    $("#description_familyHistory").val(arr_TempFamilyHistoryE.description);

    var elm = $(`#${'isCauseofDeath'}`);
    var switchValue = elm.attr("switch-value").split(',');
    if (arr_TempFamilyHistoryE.isCauseofDeath == true) {
        elm.prop("checked", true);
        $(elm).nextAll().remove();
        $(elm).after(`<label class="border-thin" for="${$(elm).attr("id")}">${switchValue[0]}</label>`);
        $(elm).trigger("change");
    } else {
        elm.prop("checked", false);
        $(elm).nextAll().remove();
        $(elm).after(`<label class="border-thin" for="${$(elm).attr("id")}">${switchValue[1]}</label>`);
        $(elm).trigger("change");
    }
    $(`#isCauseofDeath`).blur();

    $("#relatedPersonId").val(arr_TempFamilyHistoryE.relatedPersonId).trigger('change');

    $("#relatedPersonId").select2("focus");
    typeSaveFamilyHistory = "UPD";
    currentFamilyHistoryRowNumber = arr_TempFamilyHistoryE.rowNumber;
}

$("#canceledfamilyHistory").on("click", function () {

    $("#familyHistoryBox .select2").val("").trigger("change");
    $("#familyHistoryBox input.form-control").val("");
    $("#familyHistoryBox .funkyradio input:checkbox").prop("checked", false).trigger("change");
    $("#relatedPersonId").select2("focus");
    typeSaveFamilyHistory = "INS";
});

var removeFromTempFamilyHistory = (rowNumber) => {
    currentFamilyHistoryRowNumber = rowNumber;

    $("#tempfamilyHistory tr").removeClass("highlight");
    $(`#fh_${rowNumber}`).addClass("highlight");

    var removeRowResult = removeRowFromArray(arr_TempFamilyHistory, "rowNumber", rowNumber);

    if (removeRowResult.statusMessage == "removed")
        $(`#fh_${rowNumber}`).remove();

    if (arr_TempFamilyHistory.length == 0) {
        var colspan = $("#tempfamilyHistoryList thead th").length;
        $("#tempfamilyHistory").html(emptyRow.replace("thlength", colspan));
    }

    rebuildFamilyHistoryRow();
}

function rebuildFamilyHistoryRow() {
    var arr = arr_TempFamilyHistory;

    var table = "tempfamilyHistory";

    if (arr.length === 0)
        return;

    for (var b = 0; b < arr.length; b++) {
        var newRowNumber = b + 1;
        arr[b].rowNumber = newRowNumber;

        $(`#${table} tr`)[b].children[0].innerText = arr[b].rowNumber;
        $(`#${table} tr`)[b].setAttribute("id", `fh_${arr[b].rowNumber}`);
        $(`#${table} tr`)[b].children[0].innerText = arr[b].rowNumber;

        if ($(`#${table} tr`)[b].children[5].innerHTML !== "") {


            $(`#${table} tr`)[b].children[5].innerHTML = `<button type="button" onclick="removeFromTempFamilyHistory(${arr[b].rowNumber})" class="btn maroon_outline" data-toggle="tooltip" data-placement="bottom" title="حذف سطر" style="margin-left:7px">
                                                                     <i class="fa fa-trash"></i>
                                                           </button>
                                                           <button type="button" onclick="EditFromTempFamilyHistory(${arr[b].rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                                                <i class="fa fa-pen"></i>
                                                           </button>
                                                           `;
        }

    }
    arr_TempFamilyHistory = arr;
}

// Dental FamilyHistory END *************


// Dental drugHistory START *************

$("#adddrugHistory").on("click", function () {

    var validate = FormDrugHistory.validate();
    validateSelect2(FormDrugHistory);
    if (!validate) return;

    if (typeSaveDrugHistory == "INS") {
        var rowNumberDrugHistory = arr_TempDrugHistory.length + 1;
        modelAppendDrugHistory(rowNumberDrugHistory, typeSaveDrugHistory)
    }
    else {
        var rowNumberDrugHistory = currentDrugHistoryRowNumber;
        modelAppendDrugHistory(rowNumberDrugHistory, typeSaveDrugHistory);
    }
});

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
                          <td id="operationdh_${data.rowNumber}">
                              <button type="button" id="deletedh_${data.rowNumber}" onclick="removeFromTempDrugHistory(${data.rowNumber})" class="btn maroon_outline" data-original-title="حذف سطر" style="margin-left:7px">
                                   <i class="fa fa-trash"></i>
                              </button>
                              <button type="button" id="Editdh_${data.rowNumber}" onclick="EditFromTempDrugHistory(${data.rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                   <i class="fa fa-pen"></i>
                              </button>
                          </td>
                     </tr>`

            $(dataOutput).appendTo("#tempdrugHistory");
        }
        else {
            var i = arr_TempDrugHistory.findIndex(x => x.rowNumber == data.rowNumber);
            arr_TempDrugHistory[i].headerId = data.headerId;
            arr_TempDrugHistory[i].rowNumber = data.rowNumber;
            arr_TempDrugHistory[i].medicationId = data.medicationId;
            arr_TempDrugHistory[i].medicationName = data.medicationName;
            arr_TempDrugHistory[i].routeId = data.routeId;
            arr_TempDrugHistory[i].routeName = data.routeName;

            $(`#dh_${data.rowNumber} td:eq(0)`).text(`${data.rowNumber}`);
            $(`#dh_${data.rowNumber} td:eq(1)`).text(`${data.medicationId != 0 ? `${data.medicationName}` : ""}`);
            $(`#dh_${data.rowNumber} td:eq(2)`).text(`${data.routeId != 0 ? `${data.routeName}` : ""}`);
        }
        resetDentalForm("drugHistory");
    }
}

var EditFromTempDrugHistory = (rowNumber) => {

    $("#tempdrugHistory tr").removeClass("highlight");
    $(`#dh_${rowNumber}`).addClass("highlight");
    var detailDrugHistory = "";
    var arr_TempDrugHistoryE = arr_TempDrugHistory.filter(line => line.rowNumber === rowNumber)[0];

    $("#medicationId").val(arr_TempDrugHistoryE.medicationId);
    detailDrugHistory = new Option(`${arr_TempDrugHistoryE.medicationName}`, arr_TempDrugHistoryE.medicationId, true, true);
    $("#medicationId").append(detailDrugHistory).trigger('change');
    detailDrugHistory = "";

    $("#routeId_drugHistory").val(arr_TempDrugHistoryE.routeId);
    $("#routeId_drugHistory").trigger('change');

    $("#medicationId").select2("focus");
    typeSaveDrugHistory = "UPD";
    currentDrugHistoryRowNumber = arr_TempDrugHistoryE.rowNumber;
}

$("#canceleddrugHistory").on("click", function () {

    $("#drugHistoryBox .select2").val("").trigger("change");
    $("#drugHistoryBox input.form-control").val("");
    $("#medicationId").select2("focus");
    typeSaveDrugHistory = "INS";
});

var removeFromTempDrugHistory = (rowNumber) => {

    currentDrugHistoryRowNumber = rowNumber;

    $("#tempdrugHistory tr").removeClass("highlight");
    $(`#dh_${rowNumber}`).addClass("highlight");

    var removeRowResult = removeRowFromArray(arr_TempDrugHistory, "rowNumber", rowNumber);

    if (removeRowResult.statusMessage == "removed")
        $(`#dh_${rowNumber}`).remove();

    if (arr_TempDrugHistory.length == 0) {
        var colspan = $("#tempdrugHistoryList thead th").length;
        $("#tempdrugHistory").html(emptyRow.replace("thlength", colspan));
    }

    rebuildDrugHistoryRow();
}

function rebuildDrugHistoryRow() {
    var arr = arr_TempDrugHistory;

    var table = "tempdrugHistory";

    if (arr.length === 0)
        return;

    for (var b = 0; b < arr.length; b++) {
        var newRowNumber = b + 1;
        arr[b].rowNumber = newRowNumber;

        $(`#${table} tr`)[b].children[0].innerText = arr[b].rowNumber;
        $(`#${table} tr`)[b].setAttribute("id", `dh_${arr[b].rowNumber}`);
        $(`#${table} tr`)[b].children[0].innerText = arr[b].rowNumber;

        if ($(`#${table} tr`)[b].children[3].innerHTML !== "") {


            $(`#${table} tr`)[b].children[3].innerHTML = `<button type="button" onclick="removeFromTempDrugHistory(${arr[b].rowNumber})" class="btn maroon_outline" data-toggle="tooltip" data-placement="bottom" title="حذف سطر" style="margin-left:7px">
                                                                     <i class="fa fa-trash"></i>
                                                           </button>
                                                           <button type="button" onclick="EditFromTempDrugHistory(${arr[b].rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                                                <i class="fa fa-pen"></i>
                                                           </button>
                                                           `;
        }

    }
    arr_TempDrugHistory = arr;
}

// Dental drugHistory END *************

// Dental drugOrdered START *************

$("#adddrugOrdered").on("click", function () {

    var validate = FormDrugOrdered.validate();
    validateSelect2(FormDrugOrdered);
    if (!validate) return;

    if (typeSaveDrugOrdered == "INS") {
        var rowNumberDrugOrdered = arr_TempDrugOrdered.length + 1;
        modelAppendDrugOrdered(rowNumberDrugOrdered, typeSaveDrugOrdered)
    }
    else {
        var rowNumberDrugOrdered = currentDrugOrderedRowNumber;
        modelAppendDrugOrdered(rowNumberDrugOrdered, typeSaveDrugOrdered);
    }
});

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
                          <td id="operationdo_${data.rowNumber}">
                              <button type="button" id="deletedo_${data.rowNumber}" onclick="removeFromTempDrugOrdered(${data.rowNumber})" class="btn maroon_outline" data-original-title="حذف سطر" style="margin-left:7px">
                                   <i class="fa fa-trash"></i>
                              </button>
                              <button type="button" id="Editdo_${data.rowNumber}" onclick="EditFromTempDrugOrdered(${data.rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                   <i class="fa fa-pen"></i>
                              </button>
                          </td>
                     </tr>`

            $(dataOutput).appendTo("#tempdrugOrdered");
        }
        else {
            var i = arr_TempDrugOrdered.findIndex(x => x.rowNumber == data.rowNumber);
            arr_TempDrugOrdered[i].headerId = data.headerId;
            arr_TempDrugOrdered[i].rowNumber = data.rowNumber;
            arr_TempDrugOrdered[i].administrationDateTimePersian = data.administrationDateTimePersian;
            arr_TempDrugOrdered[i].description = data.description;
            arr_TempDrugOrdered[i].dosage = data.dosage;
            arr_TempDrugOrdered[i].dosageUnitId = data.dosageUnitId;
            arr_TempDrugOrdered[i].dosageUnitName = data.dosageUnitName;
            arr_TempDrugOrdered[i].dosageUnitDescription = data.dosageUnitDescription;
            arr_TempDrugOrdered[i].drugGenericName = data.drugGenericName;
            arr_TempDrugOrdered[i].frequencyId = data.frequencyId;
            arr_TempDrugOrdered[i].frequencyName = data.frequencyName;
            arr_TempDrugOrdered[i].totalNumber = data.totalNumber;
            arr_TempDrugOrdered[i].longTerm = data.longTerm;
            arr_TempDrugOrdered[i].longTermUnitId = data.longTermUnitId;
            arr_TempDrugOrdered[i].longTermUnitName = data.longTermUnitName;
            arr_TempDrugOrdered[i].longTermUnitDescription = data.longTermUnitDescription;
            arr_TempDrugOrdered[i].productId = data.productId;
            arr_TempDrugOrdered[i].productName = data.productName;
            arr_TempDrugOrdered[i].routeId = data.routeId;
            arr_TempDrugOrdered[i].routeName = data.routeName;

            $(`#do_${data.rowNumber} td:eq(0)`).text(`${data.rowNumber}`);
            $(`#do_${data.rowNumber} td:eq(1)`).text(`${data.productId != 0 ? `${data.productName}` : ""}`);
            $(`#do_${data.rowNumber} td:eq(2)`).text(`${data.drugGenericName}`);
            $(`#do_${data.rowNumber} td:eq(3)`).text(`${data.routeId != 0 ? `${data.routeName}` : ""}`);
            $(`#do_${data.rowNumber} td:eq(4)`).text(`${data.frequencyId != 0 ? `${data.frequencyName}` : ""}`);
            $(`#do_${data.rowNumber} td:eq(5)`).text(`${data.dosage}`);
            $(`#do_${data.rowNumber} td:eq(6)`).text(`${data.dosageUnitId != 0 ? `${data.dosageUnitDescription}` : ""}`);
            $(`#do_${data.rowNumber} td:eq(7)`).text(`${data.longTerm}`);
            $(`#do_${data.rowNumber} td:eq(8)`).text(`${data.longTermUnitId != 0 ? `${data.longTermUnitDescription}` : ""}`);
            $(`#do_${data.rowNumber} td:eq(9)`).text(`${data.totalNumber}`);
            $(`#do_${data.rowNumber} td:eq(10)`).text(`${data.administrationDateTimePersian}`);
            $(`#do_${data.rowNumber} td:eq(11)`).text(`${data.description}`);
        }
        resetDentalForm("drugOrdered");
    }
}

var EditFromTempDrugOrdered = (rowNumber) => {

    $("#tempdrugOrdered tr").removeClass("highlight");
    $(`#do_${rowNumber}`).addClass("highlight");
    var detailDrugOrdered = "";
    var arr_TempDrugOrderedE = arr_TempDrugOrdered.filter(line => line.rowNumber === rowNumber)[0];

    $("#administrationDateTime").val(arr_TempDrugOrderedE.administrationDateTimePersian);
    $("#description_drugOrdered").val(arr_TempDrugOrderedE.description);
    $("#dosage").val(arr_TempDrugOrderedE.dosage);

    $("#dosageUnitId").val(arr_TempDrugOrderedE.dosageUnitId).trigger('change');

    $("#drugGenericName").val(arr_TempDrugOrderedE.drugGenericName);

    $("#frequencyId").val(arr_TempDrugOrderedE.frequencyId).trigger('change');

    $("#totalNumber").val(arr_TempDrugOrderedE.totalNumber);

    $("#longTerm").val(arr_TempDrugOrderedE.longTerm);

    $("#longTermUnitId").val(arr_TempDrugOrderedE.longTermUnitId);
    detailDrugOrdered = new Option(`${arr_TempDrugOrderedE.longTermUnitDescription}`, arr_TempDrugOrderedE.longTermUnitId, true, true);
    $("#longTermUnitId").append(detailDrugOrdered).trigger('change');
    detailDrugOrdered = "";

    $("#productId").val(arr_TempDrugOrderedE.productId);
    detailDrugOrdered = new Option(`${arr_TempDrugOrderedE.productName}`, arr_TempDrugOrderedE.productId, true, true);
    $("#productId").append(detailDrugOrdered).trigger('change');
    detailDrugOrdered = "";

    $("#routeId_drugOrdered").val(arr_TempDrugOrderedE.routeId).trigger('change');

    $("#productId").select2("focus");
    typeSaveDrugOrdered = "UPD";
    currentDrugOrderedRowNumber = arr_TempDrugOrderedE.rowNumber;
}

$("#canceleddrugOrdered").on("click", function () {

    $("#drugOrderedBox .select2").val("").trigger("change");
    $("#drugOrderedBox input.form-control").val("");
    $("#productId").select2("focus");
    typeSaveDrugOrdered = "INS";
});

var removeFromTempDrugOrdered = (rowNumber) => {
    currentDrugOrderedRowNumber = rowNumber;

    $("#tempdrugOrdered tr").removeClass("highlight");
    $(`#do_${rowNumber}`).addClass("highlight");

    var removeRowResult = removeRowFromArray(arr_TempDrugOrdered, "rowNumber", rowNumber);

    if (removeRowResult.statusMessage == "removed")
        $(`#do_${rowNumber}`).remove();

    if (arr_TempDrugOrdered.length == 0) {
        var colspan = $("#tempdrugOrderedList thead th").length;
        $("#tempdrugOrdered").html(emptyRow.replace("thlength", colspan));
    }

    rebuildDrugOrderedRow();
}

function rebuildDrugOrderedRow() {
    var arr = arr_TempDrugOrdered;

    var table = "tempdrugOrdered";

    if (arr.length === 0)
        return;

    for (var b = 0; b < arr.length; b++) {
        var newRowNumber = b + 1;
        arr[b].rowNumber = newRowNumber;

        $(`#${table} tr`)[b].children[0].innerText = arr[b].rowNumber;
        $(`#${table} tr`)[b].setAttribute("id", `do_${arr[b].rowNumber}`);
        $(`#${table} tr`)[b].children[0].innerText = arr[b].rowNumber;

        if ($(`#${table} tr`)[b].children[11].innerHTML !== "") {


            $(`#${table} tr`)[b].children[11].innerHTML = `<button type="button" onclick="removeFromTempDrugOrdered(${arr[b].rowNumber})" class="btn maroon_outline" data-toggle="tooltip" data-placement="bottom" title="حذف سطر" style="margin-left:7px">
                                                                     <i class="fa fa-trash"></i>
                                                           </button>
                                                           <button type="button" onclick="EditFromTempDrugOrdered(${arr[b].rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                                                <i class="fa fa-pen"></i>
                                                           </button>
                                                           `;
        }

    }
    arr_TempDrugOrdered = arr;
}

// Dental DrugOrdered END *************


// Dental medicalHistory START *************

$("#addmedicalHistory").on("click", function () {

    var validate = FormMedicalHistory.validate();
    validateSelect2(FormMedicalHistory);
    if (!validate) return;

    if (typeSaveMedicalHistory == "INS") {
        var rowNumberMedicalHistory = arr_TempMedicalHistory.length + 1;
        modelAppendMedicalHistory(rowNumberMedicalHistory, typeSaveMedicalHistory)
    }
    else {
        var rowNumberMedicalHistory = currentMedicalHistoryRowNumber;
        modelAppendMedicalHistory(rowNumberMedicalHistory, typeSaveMedicalHistory);
    }
});

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
        onsetDurationToPresentUnitDescription: $("#onsetDurationToPresentUnitId_medicalHistory").select2('data').length > 0 ? $("#onsetDurationToPresentUnitId_medicalHistory").select2('data')[0].text : "",

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
                           <td id="operationmh_${data.rowNumber}">
                              <button type="button" id="deletemh_${data.rowNumber}" onclick="removeFromTempMedicalHistory(${data.rowNumber})" class="btn maroon_outline" data-original-title="حذف سطر" style="margin-left:7px">
                                   <i class="fa fa-trash"></i>
                              </button>
                              <button type="button" id="Editmh_${data.rowNumber}" onclick="EditFromTempMedicalHistory(${data.rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                   <i class="fa fa-pen"></i>
                              </button>
                          </td>
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

var EditFromTempMedicalHistory = (rowNumber) => {

    $("#tempmedicalHistory tr").removeClass("highlight");
    $(`#mh_${rowNumber}`).addClass("highlight");
    var detailMedicalHistory = "";
    var arr_TempMedicalHistoryE = arr_TempMedicalHistory.filter(line => line.rowNumber === rowNumber)[0];

    $("#conditionId_medicalHistory").val(arr_TempMedicalHistoryE.conditionId);
    detailMedicalHistory = new Option(`${arr_TempMedicalHistoryE.conditionName}`, arr_TempMedicalHistoryE.conditionId, true, true);
    $("#conditionId_medicalHistory").append(detailMedicalHistory).trigger('change');
    detailMedicalHistory = "";

    $("#description_medicalHistory").val(arr_TempMedicalHistoryE.description);
    $("#dateOfOnSet").val(arr_TempMedicalHistoryE.dateOfOnsetPersian);
    $("#onsetDurationToPresent_medicalHistory").val(arr_TempMedicalHistoryE.onsetDurationToPresent);

    $("#onsetDurationToPresentUnitId_medicalHistory").val(arr_TempMedicalHistoryE.onsetDurationToPresentUnitId).trigger('change');

    $("#conditionId_medicalHistory").select2("focus");
    typeSaveMedicalHistory = "UPD";
    currentMedicalHistoryRowNumber = arr_TempMedicalHistoryE.rowNumber;
}

$("#canceledmedicalHistory").on("click", function () {
    $("#medicalHistoryBox .select2").val("").trigger("change");
    $("#medicalHistoryBox input.form-control").val("");
    $("#conditionId_medicalHistory").select2("focus");
    typeSaveMedicalHistory = "INS";
});

var removeFromTempMedicalHistory = (rowNumber) => {
    currentMedicalHistoryRowNumber = rowNumber;

    $("#tempmedicalHistory tr").removeClass("highlight");
    $(`#mh_${rowNumber}`).addClass("highlight");

    var removeRowResult = removeRowFromArray(arr_TempMedicalHistory, "rowNumber", rowNumber);

    if (removeRowResult.statusMessage == "removed")
        $(`#mh_${rowNumber}`).remove();

    if (arr_TempMedicalHistory.length == 0) {
        var colspan = $("#tempmedicalHistoryList thead th").length;
        $("#tempmedicalHistory").html(emptyRow.replace("thlength", colspan));
    }

    rebuildMedicalHistoryRow();
}

function rebuildMedicalHistoryRow() {
    var arr = arr_TempMedicalHistory;

    var table = "tempmedicalHistory";

    if (arr.length === 0)
        return;

    for (var b = 0; b < arr.length; b++) {
        var newRowNumber = b + 1;
        arr[b].rowNumber = newRowNumber;

        $(`#${table} tr`)[b].children[0].innerText = arr[b].rowNumber;
        $(`#${table} tr`)[b].setAttribute("id", `mh_${arr[b].rowNumber}`);
        $(`#${table} tr`)[b].children[0].innerText = arr[b].rowNumber;

        if ($(`#${table} tr`)[b].children[6].innerHTML !== "") {


            $(`#${table} tr`)[b].children[6].innerHTML = `<button type="button" onclick="removeFromTempMedicalHistory(${arr[b].rowNumber})" class="btn maroon_outline" data-toggle="tooltip" data-placement="bottom" title="حذف سطر" style="margin-left:7px">
                                                                     <i class="fa fa-trash"></i>
                                                           </button>
                                                           <button type="button" onclick="EditFromTempMedicalHistory(${arr[b].rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                                                <i class="fa fa-pen"></i>
                                                           </button>
                                                           `;
        }

    }
    arr_TempMedicalHistory = arr;
}

// Dental medicalHistory END *************

// Dental ADVERSEREACTION START ***********
$("#addadverseReaction").on("click", function () {

    var validate = FormAdverseReaction.validate();
    validateSelect2(FormAdverseReaction);
    if (!validate) return;

    if (typeSaveAdverseReaction == "INS") {
        var rowNumberAdverseReaction = arr_TempAdverseReaction.length + 1;
        modelAppendAdverseReaction(rowNumberAdverseReaction, typeSaveAdverseReaction)
    }
    else {
        var rowNumberAdverseReaction = currentAdverseReactionRowNumber;
        modelAppendAdverseReaction(rowNumberAdverseReaction, typeSaveAdverseReaction);
    }
});

function modelAppendAdverseReaction(rowNumber, typeSave) {
    var modelAdverseReaction = {
        headerId: 0,
        rowNumber: rowNumber,
        causativeAgentId: $("#causativeAgentId").val(),
        causativeAgentName: $("#causativeAgentId").select2('data').length > 0 ? $("#causativeAgentId").select2('data')[0].text : "",
        causativeAgentCategoryId: $("#causativeAgentCategoryId").val(),
        causativeAgentCategoryName: $("#causativeAgentCategoryId").select2('data').length > 0 ? $("#causativeAgentCategoryId").select2('data')[0].text : "",
        reactionId: $("#reactionId").val(),
        reactionName: $("#reactionId").select2('data').length > 0 ? $("#reactionId").select2('data')[0].text : "",
        reactionCategoryId: $("#reactionCategoryId").val(),
        reactionCategoryName: $("#reactionCategoryId").select2('data').length > 0 ? $("#reactionCategoryId").select2('data')[0].text : "",
        diagnosisSeverityId: $("#diagnosisSeverityId").val(),
        diagnosisSeverityName: $("#diagnosisSeverityId").select2('data').length > 0 ? $("#diagnosisSeverityId").select2('data')[0].text : "",
        description: $("#description").val(),
    }

    if (typeSave == "INS")
        arr_TempAdverseReaction.push(modelAdverseReaction);

    appendTempAdverseReaction(modelAdverseReaction, typeSaveAdverseReaction);
    typeSaveAdverseReaction = "INS";
}

var appendTempAdverseReaction = (data, tSave = "INS") => {
    
    var dataOutput = "";
    if (data) {
        if (tSave == "INS") {
            var emptyRow = $("#tempAdverseReaction").find("#emptyRow");

            if (emptyRow.length > 0)
                $("#tempAdverseReaction").html("");
            dataOutput = `<tr id="ar_${data.rowNumber}">
                          <td>${data.rowNumber}</td>
                          <td>${data.causativeAgentCategoryId != 0 ? `${data.causativeAgentCategoryName}` : ""}</td>
                          <td>${data.causativeAgentId != 0 ? `${data.causativeAgentName}` : ""}</td>
                          <td>${data.reactionCategoryId != 0 ? `${data.reactionCategoryName}` : ""}</td>
                          <td>${data.reactionId != 0 ? `${data.reactionName}` : ""}</td>
                          <td>${data.diagnosisSeverityId != -1 ? `${data.diagnosisSeverityName}` : ""}</td>
                          <td>${data.description}</td>
                          <td id="operationar_${data.rowNumber}">
                              <button type="button" id="deletear_${data.rowNumber}" onclick="removeFromTempAdverseReaction(${data.rowNumber})" class="btn maroon_outline" data-original-title="حذف سطر" style="margin-left:7px">
                                   <i class="fa fa-trash"></i>
                              </button>
                              <button type="button" id="Editar_${data.rowNumber}" onclick="EditFromTempAdverseReaction(${data.rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                   <i class="fa fa-pen"></i>
                              </button>
                          </td>
                     </tr>`

            $(dataOutput).appendTo("#tempAdverseReaction");
        }
        else {
            var i = arr_TempAdverseReaction.findIndex(x => x.rowNumber == data.rowNumber);
            arr_TempAdverseReaction[i].headerId = data.headerId;
            arr_TempAdverseReaction[i].rowNumber = data.rowNumber;
            arr_TempAdverseReaction[i].causativeAgentId = data.causativeAgentId;
            arr_TempAdverseReaction[i].causativeAgentName = data.causativeAgentName;
            arr_TempAdverseReaction[i].causativeAgentCategoryId = data.causativeAgentCategoryId;
            arr_TempAdverseReaction[i].causativeAgentCategoryName = data.causativeAgentCategoryName;
            arr_TempAdverseReaction[i].reactionId = data.reactionId;
            arr_TempAdverseReaction[i].reactionName = data.reactionName;
            arr_TempAdverseReaction[i].reactionCategoryId = data.reactionCategoryId;
            arr_TempAdverseReaction[i].reactionCategoryName = data.reactionCategoryName;
            arr_TempAdverseReaction[i].diagnosisSeverityId = data.diagnosisSeverityId;
            arr_TempAdverseReaction[i].diagnosisSeverityName = data.diagnosisSeverityName;
            arr_TempAdverseReaction[i].description = data.description;

            $(`#ar_${data.rowNumber} td:eq(0)`).text(`${data.rowNumber}`);
            $(`#ar_${data.rowNumber} td:eq(1)`).text(`${data.causativeAgentCategoryId != 0 ? `${data.causativeAgentCategoryName}` : ""}`);
            $(`#ar_${data.rowNumber} td:eq(2)`).text(`${data.causativeAgentId != 0 ? `${data.causativeAgentName}` : ""}`);
            $(`#ar_${data.rowNumber} td:eq(3)`).text(`${data.reactionCategoryId != 0 ? `${data.reactionCategoryName}` : ""}`);
            $(`#ar_${data.rowNumber} td:eq(4)`).text(`${data.reactionId != 0 ? `${data.reactionName}` : ""}`);
            $(`#ar_${data.rowNumber} td:eq(5)`).text(`${data.diagnosisSeverityId != -1 ? `${data.diagnosisSeverityName}` : ""}`);
            $(`#ar_${data.rowNumber} td:eq(6)`).text(`${data.description}`);
        }
        resetDentalForm("adverseReaction");
    }
}

var EditFromTempAdverseReaction = (rowNumber) => {
    $("#tempAdverseReaction tr").removeClass("highlight");
    $(`#ar_${rowNumber}`).addClass("highlight");
    var detailAdverseReaction = "";
    var arr_TempAdverseReactionE = arr_TempAdverseReaction.filter(line => line.rowNumber === rowNumber)[0];

    $("#causativeAgentId").val(arr_TempAdverseReactionE.causativeAgentId);
    detailAdverseReaction = new Option(`${arr_TempAdverseReactionE.causativeAgentName}`, arr_TempAdverseReactionE.causativeAgentId, true, true);
    $("#causativeAgentId").append(detailAdverseReaction).trigger('change');
    detailAdverseReaction = "";

    $("#description").val(arr_TempAdverseReactionE.description);

    $("#causativeAgentCategoryId").val(arr_TempAdverseReactionE.causativeAgentCategoryId);
    detailAdverseReaction = new Option(`${arr_TempAdverseReactionE.causativeAgentCategoryName}`, arr_TempAdverseReactionE.causativeAgentCategoryId, true, true);
    $("#causativeAgentCategoryId").append(detailAdverseReaction).trigger('change');
    detailAdverseReaction = "";

    $("#reactionId").val(arr_TempAdverseReactionE.reactionId);
    detailAdverseReaction = new Option(`${arr_TempAdverseReactionE.reactionName}`, arr_TempAdverseReactionE.reactionId, true, true);
    $("#reactionId").append(detailAdverseReaction).trigger('change');
    detailAdverseReaction = "";

    $("#reactionCategoryId").val(arr_TempAdverseReactionE.reactionCategoryId);
    detailAdverseReaction = new Option(`${arr_TempAdverseReactionE.reactionCategoryName}`, arr_TempAdverseReactionE.reactionCategoryId, true, true);
    $("#reactionCategoryId").append(detailAdverseReaction).trigger('change');
    detailAdverseReaction = "";

    $("#diagnosisSeverityId").val(arr_TempAdverseReactionE.diagnosisSeverityId).trigger('change');

    $("#causativeAgentCategoryId").select2('focus');
    typeSaveAdverseReaction = "UPD";
    currentAdverseReactionRowNumber = arr_TempAdverseReactionE.rowNumber;
}

$("#canceledadverseReaction").on("click", function () {

    $("#adverseReactionBox .select2").val("").trigger("change");
    $("#adverseReactionBox input.form-control").val("");
    $("#causativeAgentCategoryId").focus();
    typeSaveAdverseReaction = "INS";
});

var removeFromTempAdverseReaction = (rowNumber) => {
    currentAdverseReactionRowNumber = rowNumber;

    $("#tempAdverseReaction tr").removeClass("highlight");
    $(`#ar_${rowNumber}`).addClass("highlight");

    var removeRowResult = removeRowFromArray(arr_TempAdverseReaction, "rowNumber", rowNumber);

    if (removeRowResult.statusMessage == "removed")
        $(`#ar_${rowNumber}`).remove();

    if (arr_TempAdverseReaction.length == 0) {
        var colspan = $("#tempAdverseReactionList thead th").length;
        $("#tempAdverseReaction").html(emptyRow.replace("thlength", colspan));
    }

    rebuildAdverseReactionRow();
}

function rebuildAdverseReactionRow() {
    var arr = arr_TempAdverseReaction;

    var table = "tempAdverseReaction";

    if (arr.length === 0)
        return;

    for (var b = 0; b < arr.length; b++) {
        var newRowNumber = b + 1;
        arr[b].rowNumber = newRowNumber;

        $(`#${table} tr`)[b].children[0].innerText = arr[b].rowNumber;
        $(`#${table} tr`)[b].setAttribute("id", `ar_${arr[b].rowNumber}`);
        $(`#${table} tr`)[b].children[0].innerText = arr[b].rowNumber;

        if ($(`#${table} tr`)[b].children[7].innerHTML !== "") {


            $(`#${table} tr`)[b].children[7].innerHTML = `<button type="button" onclick="removeFromTempAdverseReaction(${arr[b].rowNumber})" class="btn maroon_outline" data-toggle="tooltip" data-placement="bottom" title="حذف سطر" style="margin-left:7px">
                                                                     <i class="fa fa-trash"></i>
                                                           </button>
                                                           <button type="button" onclick="EditFromTempAdverseReaction(${arr[b].rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                                                <i class="fa fa-pen"></i>
                                                           </button>
                                                           `;
        }

    }
    arr_TempAdverseReaction = arr;
}
// Dental ADVERSEREACTION END *************

// Dental Diagnosis Start *************

$("#addDiagnosis").on("click", function () {

    if (admissionIdentity == 0) {
        var msg_temp_srv = alertify.warning(prMsg.selectAdmission);
        msg_temp_srv.delay(prMsg.delay);
        return;
    }

    var validate = diagForm.validate();
    validateSelect2(diagForm);
    if (!validate) return;

    var checkExist = false;
    var modelDiag = {};

    if (+$("#statusId").val() == 0) {
        var msgNotDefined = alertify.warning(prMsg.selectStatusIdDiagnosis);
        msgNotDefined.delay(prMsg.delay);
        return;
    }
    if (typeSaveDiag == "INS") {

        checkExist = checkNotExistValueInArray(arr_TempDiagnosis, 'statusId', +$("#statusId").val());

        if (!checkExist) {
            var msgExist = alertify.warning(prMsg.existStatusIdDiagnosis);
            msgExist.delay(prMsg.delay);
            $("#statusId").select2("focus");
            return;
        }
        var rowNumberDiag = arr_TempDiagnosis.length + 1;
        modelAppendDiagnosis(rowNumberDiag, typeSaveDiag)
    }
    else {
        var rowNumberDiag = currentDiagRowNumber;
        modelAppendDiagnosis(rowNumberDiag, typeSaveDiag)
    }
});

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
        diagnosisDateTimePersian: $("#diagnosisDateTime").val(),
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
                           <td>${diag.diagnosisDateTimePersian}</td>
                          <td>${diag.comment}</td>
                          <td id="operationdg_${diag.rowNumber}">
                              <button type="button" id="deleteDiag_${diag.rowNumber}" onclick="removeFromTempDiag(${diag.rowNumber})" class="btn maroon_outline" data-original-title="حذف سطر" style="margin-left:7px">
                                   <i class="fa fa-trash"></i>
                              </button><button type="button" id="EditDiag_${diag.rowNumber}" onclick="EditFromTempDiag(${diag.rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                   <i class="fa fa-pen"></i>
                              </button>
                          </td>
                     </tr>`

            $(diagOutput).appendTo("#tempDiag");
        }
        else {
            var i = arr_TempDiagnosis.findIndex(x => x.rowNumber == diag.rowNumber);
            arr_TempDiagnosis[i].admissionId = diag.admissionId;
            arr_TempDiagnosis[i].rowNumber = diag.rowNumber;
            arr_TempDiagnosis[i].statusId = diag.statusId;
            arr_TempDiagnosis[i].statusName = diag.statusName;
            arr_TempDiagnosis[i].diagnosisResonId = diag.diagnosisResonId;
            arr_TempDiagnosis[i].diagnosisResonName = diag.diagnosisResonName;
            arr_TempDiagnosis[i].serverityId = diag.serverityId;
            arr_TempDiagnosis[i].serverityName = diag.serverityName;
            arr_TempDiagnosis[i].diagnosisDateTimePersian = diag.diagnosisDateTimePersian ;
            arr_TempDiagnosis[i].comment = diag.comment;

            $(`#dg_${diag.rowNumber} td:eq(0)`).text(`${diag.rowNumber}`);
            $(`#dg_${diag.rowNumber} td:eq(1)`).text(`${diag.statusId != 0 ? `${diag.statusName}` : ""}`);
            $(`#dg_${diag.rowNumber} td:eq(2)`).text(`${diag.diagnosisResonId != 0 ? `${diag.diagnosisResonName}` : ""}`);
            $(`#dg_${diag.rowNumber} td:eq(3)`).text(`${diag.serverityId != -1 ? `${diag.serverityName}` : ""}`);
            $(`#dg_${diag.rowNumber} td:eq(4)`).text(`${diag.diagnosisDateTimePersian}`);
            $(`#dg_${diag.rowNumber} td:eq(5)`).text(`${diag.comment}`);
        }
    }
    resetDentalForm("diag");


}

var EditFromTempDiag = (rowNumber) => {

    $("#statusId").select2("focus");

    $("#tempDiag tr").removeClass("highlight");
    $(`#dg_${rowNumber}`).addClass("highlight");
    var arr_TempDiagAppend = "";
    var arr_TempDiagE = arr_TempDiagnosis.filter(line => line.rowNumber === rowNumber)[0];

    $("#statusId").val(arr_TempDiagE.statusId).trigger('change');

    $("#diagnosisResonId").val(arr_TempDiagE.diagnosisResonId);
    arr_TempDiagAppend = new Option(`${arr_TempDiagE.diagnosisResonName}`, arr_TempDiagE.diagnosisResonId, true, true);
    $("#diagnosisResonId").append(arr_TempDiagAppend).trigger('change');
    arr_TempDiagAppend = "";

    $("#serverityId").val(arr_TempDiagE.serverityId).trigger('change');
    $("#diagnosisDateTime").val(arr_TempDiagE.diagnosisDateTimePersian );

    $("#comment").val(arr_TempDiagE.comment);

    typeSaveDiag = "UPD";
    currentDiagRowNumber = arr_TempDiagE.rowNumber;
}

var removeFromTempDiag = (rowNumber) => {

    currentDiagRowNumber = rowNumber;
    $("#tempDiag tr").removeClass("highlight");
    $(`#dg_${rowNumber}`).addClass("highlight");

    var removeRowResult = removeRowFromArray(arr_TempDiagnosis, "rowNumber", rowNumber);

    if (removeRowResult.statusMessage == "removed")
        $(`#dg_${rowNumber}`).remove();

    if (arr_TempDiagnosis.length == 0) {
        var colspan = $("#tempdiagnosisList thead th").length;
        $("#tempDiag").html(emptyRow.replace("thlength", colspan));
    }

    rebuildDaigRow();
}

function rebuildDaigRow() {

    var arrDiag = arr_TempDiagnosis;
    var table = "tempDiag";

    if (arrDiag.length === 0)
        return;

    for (var l = 0; l < arrDiag.length; l++) {
        arrDiag[l].rowNumber = l + 1;
        $(`#${table} tr`)[l].children[0].innerText = arrDiag[l].rowNumber;
        $(`#${table} tr`)[l].setAttribute("id", `dg_${arrDiag[l].rowNumber}`);
        $(`#${table} tr`)[l].children[0].innerText = arrDiag[l].rowNumber;

        if ($(`#${table} tr`)[l].children[6].innerHTML !== "") {

            $(`#${table} tr`)[l].children[6].innerHTML = `<button type="button" onclick="removeFromTempDiag(${arrDiag[l].rowNumber})" class="btn maroon_outline" data-toggle="tooltip" data-placement="bottom" title="حذف سطر" style="margin-left:7px">
                                                                     <i class="fa fa-trash"></i>
                                                           </button></button><button type="button" onclick="EditFromTempDiag(${arrDiag[l].rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                                               <i class="fa fa-pen"></i>
                                                          </button>`;
        }
    }

    arr_TempDiagnosis = arrDiag;
}

// ADMISSIONREFER Diagnosis END *************


// ADMISSIONREFER TothName Start *************

$("#addTooth").on("click", function () {

    if (admissionIdentity == 0) {
        var msg_temp_srv = alertify.warning(prMsg.selectAdmission);
        msg_temp_srv.delay(prMsg.delay);
        return;
    }

    var validate = formDental.validate();
    validateSelect2(formDental);
    if (!validate) return;

    var checkExist = false;
    var modelTooth = {};

    if (+$("#toothId").val() == 0) {
        var msgNotDefined = alertify.warning(prMsg.selectToothId);
        msgNotDefined.delay(prMsg.delay);
        return;
    }


    if (typeSaveTooth == "INS") {
        var checkExist = checkExistTooth(+$("#toothId").val(), +$("#segmentId").val(), +$("#partId").val())
        if (checkExist) {
            var msgExist = alertify.warning(prMsg.existStatusIdDiagnosis);
            msgExist.delay(prMsg.delay);
            $("#toothId").select2("focus");
            return;
        }
        var rowNumberTooth = arr_TempTooth.length + 1;
        modelAppendTooth(rowNumberTooth, typeSaveTooth)
    }
    else {
        var rowNumberTooth = currentToothRowNumber;
        modelAppendTooth(rowNumberTooth, typeSaveTooth)
    }
});

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
        hasDiaganosis: $("#hasDiaganosis").val().length > 0 ? $("#hasDiaganosis").val() : false,
        hasTreatment: $("#hasTreatment").val().length > 0 ? $("#hasTreatment").val() : false
        //hasTreatment: $("ندارد").val()
    };


    if (typeSave == "INS")
        arr_TempTooth.push(modelTooth);

    appendTempTooth(modelTooth, typeSaveTooth);
    typeSaveTooth = "INS";
}

function checkExistTooth(tId, sId, pId) {
    var checkExist = typeof arr_TempTooth.find(x => x.toothId == +tId && x.segmentId == +sId && x.partId == +pId);

    return checkExist == "object";
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
            var compoundButton2 = "";

            compoundButton = `<button type="button" onclick="addCompoundTooth(${tooth.rowNumber})" class="btn blue_outline_1 ml-2" title="تشخیص">
                                   <i class="fa fa-list"></i>
                                  </button>`

            compoundButton2 = `<button type="button" onclick="addCompoundTreatment(${tooth.rowNumber})" class="btn blue_outline_1 ml-2" title="خدمات">
                                   <i class="fa fa-list"></i>
                                  </button>`

            toothOutput = `<tr id="dt_${tooth.rowNumber}">
                          <td>${tooth.rowNumber}</td>
                          <td>${tooth.isMissing ? "بلی" : "خیر"}</td>
                          <td>${tooth.toothId != 0 ? `${tooth.toothName}` : ""}</td>
                          <td>${tooth.partId != 0 ? `${tooth.partName}` : ""}</td>
                          <td>${tooth.segmentId != 0 ? `${tooth.segmentName}` : ""}</td>
                          <td>${tooth.comment}</td>
                          <td>${tooth.hasDiaganosis ? "بلی" : "خیر"}</td>
                          <td>${tooth.hasTreatment ? "بلی" : "خیر"}</td>
                          <td id="operationdt_${tooth.rowNumber}">
                              <button type="button" id="deleteTooth_${tooth.rowNumber}" onclick="removeFromTempTooth(${tooth.rowNumber})" class="btn maroon_outline" data-original-title="حذف سطر" style="margin-left:7px">
                                   <i class="fa fa-trash"></i>
                              </button><button type="button" id="EditTooth_${tooth.rowNumber}" onclick="EditFromTempTooth(${tooth.rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                   <i class="fa fa-pen"></i>
                              </button>${compoundButton}${compoundButton2}
                          </td>
                     </tr>`

            $(toothOutput).appendTo("#tempTooth");
        }
        else {
            var i = arr_TempTooth.findIndex(x => x.rowNumber == tooth.rowNumber);
            arr_TempTooth[i].headerId = tooth.headerId;
            arr_TempTooth[i].rowNumber = tooth.rowNumber;
            arr_TempTooth[i].isMissing = tooth.isMissing;
            arr_TempTooth[i].toothId = tooth.toothId;
            arr_TempTooth[i].toothName = tooth.toothName;
            arr_TempTooth[i].partId = tooth.partId;
            arr_TempTooth[i].partName = tooth.partName;
            arr_TempTooth[i].segmentId = tooth.segmentId;
            arr_TempTooth[i].segmentName = tooth.segmentName;
            arr_TempTooth[i].comment = tooth.comment;
            $(`#dt_${tooth.rowNumber} td:eq(0)`).text(`${tooth.rowNumber}`);
            $(`#dt_${tooth.rowNumber} td:eq(1)`).text(`${tooth.isMissing ? "بلی" : "خیر"}`);
            $(`#dt_${tooth.rowNumber} td:eq(2)`).text(`${tooth.toothId != 0 ? `${tooth.toothName}` : ""}`);
            $(`#dt_${tooth.rowNumber} td:eq(3)`).text(`${tooth.partId != 0 ? `${tooth.partName}` : ""}`);
            $(`#dt_${tooth.rowNumber} td:eq(4)`).text(`${tooth.segmentId != 0 ? `${tooth.segmentName}` : ""}`);
            $(`#dt_${tooth.rowNumber} td:eq(5)`).text(`${tooth.comment}`);            
            $(`#dt_${tooth.rowNumber} td:eq(6)`).text(`${tooth.hasDiaganosis ? "بلی" : "خیر"}`);            
            $(`#dt_${tooth.rowNumber} td:eq(7)`).text(`${tooth.hasTreatment ? "بلی" : "خیر"}`);            
        }
    }
    resetDentalForm("tooth");


}

var editToothDiag = (tooth, tSave = "INS") => {

    var toothOutput = "";

    if (tooth) {

        var i = arr_TempTooth.findIndex(x => x.rowNumber == tooth.rowNumber);
        arr_TempTooth[i].headerId = tooth.headerId;
        arr_TempTooth[i].rowNumber = tooth.rowNumber;
        arr_TempTooth[i].isMissing = tooth.isMissing;
        arr_TempTooth[i].toothId = tooth.toothId;
        arr_TempTooth[i].toothName = tooth.toothName;
        arr_TempTooth[i].partId = tooth.partId;
        arr_TempTooth[i].partName = tooth.partName;
        arr_TempTooth[i].segmentId = tooth.segmentId;
        arr_TempTooth[i].segmentName = tooth.segmentName;
        arr_TempTooth[i].comment = tooth.comment;
        $(`#dt_${tooth.rowNumber} td:eq(0)`).text(`${tooth.rowNumber}`);
        $(`#dt_${tooth.rowNumber} td:eq(1)`).text(`${tooth.isMissing ? "بلی" : "خیر"}`);
        $(`#dt_${tooth.rowNumber} td:eq(2)`).text(`${tooth.toothId != 0 ? `${tooth.toothName}` : ""}`);
        $(`#dt_${tooth.rowNumber} td:eq(3)`).text(`${tooth.partId != 0 ? `${tooth.partName}` : ""}`);
        $(`#dt_${tooth.rowNumber} td:eq(4)`).text(`${tooth.segmentId != 0 ? `${tooth.segmentName}` : ""}`);
        $(`#dt_${tooth.rowNumber} td:eq(5)`).text(`${tooth.comment}`);
        $(`#dt_${tooth.rowNumber} td:eq(6)`).text(`${tooth.hasDiaganosis ? "بلی" : "خیر"}`);
        $(`#dt_${tooth.rowNumber} td:eq(7)`).text(`${tooth.hasTreatment ? "بلی" : "خیر"}`);
    }
    resetDentalForm("tooth");


}

var EditFromTempTooth = (rowNumber) => {
    $("#toothId").select2("focus");

    $("#tempTooth tr").removeClass("highlight");
    $(`#dt_${rowNumber}`).addClass("highlight");
    var arr_TempToothAppend = "";


    var arr_TempToothE = arr_TempTooth.filter(line => line.rowNumber === rowNumber)[0];


    var elm = $(`#${'isMissing'}`);
    
    var switchValue = elm.attr("switch-value").split(',');
    if (arr_TempToothE.isMissing == true) {
        elm.prop("checked", true);
        $(elm).nextAll().remove();
        $(elm).after(`<label class="border-thin" for="${$(elm).attr("id")}">${switchValue[0]}</label>`);
        $(elm).trigger("change");
    } else {
        elm.prop("checked", false);
        $(elm).nextAll().remove();
        $(elm).after(`<label class="border-thin" for="${$(elm).attr("id")}">${switchValue[1]}</label>`);
        $(elm).trigger("change");
    }
    $(`#isMissing`).blur();


    $("#toothId").val(arr_TempToothE.toothId).trigger('change');
    $("#partId").val(arr_TempToothE.partId).trigger('change');
    $("#segmentId").val(arr_TempToothE.segmentId).trigger('change');

    $("#toothComment").val(arr_TempToothE.comment);
    $("#hasDiaganosis").val(arr_TempToothE.hasDiaganosis);
    $("#hasTreatment").val(arr_TempToothE.hasTreatment);


    typeSaveTooth = "UPD";
    currentToothRowNumber = arr_TempToothE.rowNumber;
}

var removeFromTempTooth = (rowNumber) => {
    currentToothRowNumber = rowNumber;
    $("#tempTooth tr").removeClass("highlight");
    $(`#dt_${rowNumber}`).addClass("highlight");

    var removeRowResult = removeRowFromArray(arr_TempTooth, "rowNumber", rowNumber);

    var removeRowResultDetailC = removeChildwithParentIdArray(arr_TempToothLineDetail, "rowNumber", rowNumber);
    arr_TempToothLineDetail = removeRowResultDetailC.value;

    var removeRowResultDetailT = removeChildwithParentIdArray(arr_TempTreatmentLine, "rowNumber", rowNumber);
    arr_TempTreatmentLine = removeRowResultDetailT.value;


    if (removeRowResult.statusMessage == "removed")
        $(`#dt_${rowNumber}`).remove();

    if (arr_TempDiagnosis.length == 0) {
        var colspan = $("#tempToothList thead th").length;
        $("#tempTooth").html(emptyRow.replace("thlength", colspan));
    }

    rebuildToothRow();
}

function rebuildToothRow() {
    var arrTooth = arr_TempTooth;
    var arrC = arr_TempToothLineDetail;
    var arrT = arr_TempTreatmentLine;

    var table = "tempTooth";

    if (arrTooth.length === 0)
        return;

    for (var l = 0; l < arrTooth.length; l++) {
        var oldRowNumber = currentToothRowNumber;

        var newRowNumber = l + 1;
        arrTooth[l].rowNumber = newRowNumber;

        arrTooth[l].rowNumber = l + 1;
        $(`#${table} tr`)[l].children[0].innerText = arrTooth[l].rowNumber;
        $(`#${table} tr`)[l].setAttribute("id", `dt_${arrTooth[l].rowNumber}`);
        $(`#${table} tr`)[l].children[0].innerText = arrTooth[l].rowNumber;

        if ($(`#${table} tr`)[l].children[8].innerHTML !== "") {
            var compoundButton = "";
            var compoundButton2 = "";

            compoundButton = `<button type="button" onclick="addCompoundTooth(${arrTooth[l].rowNumber})" class="btn blue_outline_1 ml-2" title="تشخیص دندان">
                                   <i class="fa fa-list"></i>
                              </button>`

            compoundButton2 = `<button type="button" onclick="addCompoundTreatment(${arrTooth[l].rowNumber})" class="btn blue_outline_1 ml-2" title="خدمات">
                                   <i class="fa fa-list"></i>
                              </button>`

            $(`#${table} tr`)[l].children[8].innerHTML = `<button type="button" onclick="removeFromTempTooth(${arrTooth[l].rowNumber})" class="btn maroon_outline" data-toggle="tooltip" data-placement="bottom" title="حذف سطر" style="margin-left:7px">
                                                                     <i class="fa fa-trash"></i>
                                                           </button></button><button type="button" onclick="EditFromTempTooth(${arrTooth[l].rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                                               <i class="fa fa-pen"></i>
                                                          </button>
                                                            ${compoundButton}${compoundButton2}`;
        }
        for (var bc = 0; bc < arrC.length; bc++) {
            if (arrC[bc].rowNumber !== oldRowNumber)
                arr_TempToothLineDetail[bc].rowNumber = newRowNumber;
        }
        for (var bc = 0; bc < arrT.length; bc++) {
            if (arrT[bc].rowNumber !== oldRowNumber)
                arr_TempTreatmentLine[bc].rowNumber = newRowNumber;
        }
    }
    rebuildToothRowC();
    rebuildTreatmentRowC();
    arr_TempTooth = arrTooth;
}


// ADMISSIONREFER TothName END *************

// ADMISSIONREFER ToothDiag START *************
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

$("#addToothC").on("click", function () {

    var validate = formToothC.validate();
    validateSelect2(formToothC);
    if (!validate) return;

    if (typeSaveToothC == "INS") {

        var arr_TempToothLineDetailE = arr_TempToothLineDetail.filter(line => line.rowNumber === currentToothRowNumber);

        checkExist = checkNotExistValueInArray(arr_TempToothLineDetailE, 'statusId', +$("#toothStatusId").val());

        if (!checkExist) {
            var msgExist = alertify.warning(prMsg.existStatusIdDiagnosis);
            msgExist.delay(prMsg.delay);
            $("#statusId").select2("focus");
            return;
        }


        if (typeof arr_TempToothLineDetail.find(f => f.toothStatusId == +$("#toothStatusId").val() && f.rowNumber == currentToothRowNumber) !== "undefined") {
            var msgExist = alertify.warning(prMsg.existItem);
            msgExist.delay(prMsg.delay);
            return;
        }
        var toothC = {
            headerId: 0,
            rowNumber: currentToothRowNumber,
            detailRowNumber: arr_TempToothLineDetailE.length + 1,
            statusId: +$("#toothStatusId").val(),
            statusName: $("#toothStatusId").select2('data').length > 0 ? $("#toothStatusId").select2('data')[0].text : "",
            diagnosisResonId: +$("#toothDiagnosisResonId").val(),
            diagnosisResonName: $("#toothDiagnosisResonId").select2('data').length > 0 ? $("#toothDiagnosisResonId").select2('data')[0].text : "",
            serverityId: +$("#toothServerityId").val(),
            serverityName: $("#toothServerityId").select2('data').length > 0 ? $("#toothServerityId").select2('data')[0].text : "",
            diagnosisDateTimePersian: $("#toothDiagnosisDateTime").val(),

            comment: $("#toothCommentC").val(),
        }
        arr_TempToothLineDetail.push(toothC);
    }
    else {
        var toothC = {
            headerId: 0,
            rowNumber: currentToothRowNumber,
            detailRowNumber: currentToothDetailsRowNumber,
            statusId: +$("#toothStatusId").val(),
            statusName: $("#toothStatusId").select2('data').length > 0 ? $("#toothStatusId").select2('data')[0].text : "",
            diagnosisResonId: +$("#toothDiagnosisResonId").val(),
            diagnosisResonName: $("#toothDiagnosisResonId").select2('data').length > 0 ? $("#toothDiagnosisResonId").select2('data')[0].text : "",
            serverityId: +$("#toothServerityId").val(),
            serverityName: $("#toothServerityId").select2('data').length > 0 ? $("#toothServerityId").select2('data')[0].text : "",
            diagnosisDateTimePersian: $("#toothDiagnosisDateTime").val(),
            comment: $("#toothCommentC").val(),
        }

    }
    appendTempToothC(toothC, typeSaveToothC);


    for (var i = 0; i < arr_TempTooth.length; i++) {
        if (arr_TempTooth[i].rowNumber === currentToothRowNumber) {
            arr_TempTooth[i].hasDiaganosis = "دارد";
            var currentTooth = arr_TempTooth[i];
            editToothDiag(currentTooth, "UPD");
            break;
        }
    }
    typeSaveToothC = "INS";

});


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
                           <td>${toothC.diagnosisDateTimePersian}</td>
                          <td>${toothC.comment}</td>
                          <td id="operationdrC_${toothC.detailRowNumber}">
                              <button type="button" id="deleteToothC_${toothC.detailRowNumber}" onclick="removeFromTempToothC(${toothC.detailRowNumber})" class="btn maroon_outline" data-original-title="حذف سطر" style="margin-left:7px">
                                   <i class="fa fa-trash"></i>
                              </button><button type="button" id="EditToothC_${toothC.detailRowNumber}" onclick="EditFromTempToothC(${toothC.detailRowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                   <i class="fa fa-pen"></i>
                              </button>
                          </td>
                     </tr>`
            $(toothOutputC).appendTo("#tempToothC");
        }
        else {
            var i = arr_TempToothLineDetail.findIndex(x => x.detailRowNumber == toothC.detailRowNumber);
            arr_TempToothLineDetail[i].headerId = toothC.headerId;
            arr_TempToothLineDetail[i].rowNumber = toothC.rowNumber;
            arr_TempToothLineDetail[i].detailRowNumber = toothC.detailRowNumber;
            arr_TempToothLineDetail[i].statusId = toothC.statusId;
            arr_TempToothLineDetail[i].statusName = toothC.statusName;
            arr_TempToothLineDetail[i].serverityId = toothC.serverityId;
            arr_TempToothLineDetail[i].serverityName = toothC.serverityName;
            arr_TempToothLineDetail[i].diagnosisResonId = toothC.diagnosisResonId;
            arr_TempToothLineDetail[i].diagnosisResonName = toothC.diagnosisResonName;
            arr_TempToothLineDetail[i].diagnosisDateTimePersian = toothC.diagnosisDateTimePersian;
            arr_TempToothLineDetail[i].comment = toothC.comment;


            $(`#drC_${toothC.detailRowNumber} td:eq(0)`).text(`${toothC.detailRowNumber}`);
            $(`#drC_${toothC.detailRowNumber} td:eq(1)`).text(`${toothC.statusId != 0 ? `${toothC.statusName}` : ""}`);
            $(`#drC_${toothC.detailRowNumber} td:eq(2)`).text(`${toothC.diagnosisResonId != 0 ? `${toothC.diagnosisResonName}` : ""}`);
            $(`#drC_${toothC.detailRowNumber} td:eq(3)`).text(`${toothC.serverityId != -1 ? `${toothC.serverityName}` : ""}`);
            $(`#drC_${toothC.detailRowNumber} td:eq(4)`).text(`${toothC.diagnosisDateTimePersian}`);
            $(`#drC_${toothC.detailRowNumber} td:eq(5)`).text(`${toothC.comment}`);

            $(`#operationdrC_${toothC.detailRowNumber}`).html(` <button type="button" id="deleteToothC_${toothC.detailRowNumber}" onclick="removeFromTempToothC(${toothC.detailRowNumber})" class="btn maroon_outline" data-original-title="حذف سطر" style="margin-left:7px">
                                   <i class="fa fa-trash"></i>
                              </button>
                              <button type="button" id="EditToothC_${toothC.detailRowNumber}" onclick="EditFromTempToothC(${toothC.detailRowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                   <i class="fa fa-pen"></i>
                              </button>`);

        }
    }
    resetDentalForm("toothC");

}


var EditFromTempToothC = (detailRowNumber) => {

    $("#tempToothC tr").removeClass("highlight");
    $(`#drC_${detailRowNumber}`).addClass("highlight");

    var arr_TempToothLineDetailE = arr_TempToothLineDetail.filter(line => line.detailRowNumber === detailRowNumber)[0];

    var detailToothC = "";

    $("#toothStatusId").val(arr_TempToothLineDetailE.statusId).trigger('change');

    $("#toothDiagnosisResonId").val(arr_TempToothLineDetailE.diagnosisResonId);
    detailToothC = new Option(`${arr_TempToothLineDetailE.diagnosisResonName}`, arr_TempToothLineDetailE.diagnosisResonId, true, true);
    $("#toothDiagnosisResonId").append(detailToothC).trigger('change');
    detailToothC = "";

    $("#toothServerityId").val(arr_TempToothLineDetailE.serverityId).trigger('change');

    $("#toothDiagnosisDateTime").val(arr_TempToothLineDetailE.diagnosisDateTimePersian);
    $("#toothCommentC").val(arr_TempToothLineDetailE.comment);

    $("#toothStatusId").select2("focus");



    typeSaveToothC = "UPD";
    currentToothDetailsRowNumber = arr_TempToothLineDetailE.detailRowNumber;
}


var removeFromTempToothC = (detailRowNumber) => {

    currentToothDetailsRowNumber = detailRowNumber;

    $("#tempToothC tr").removeClass("highlight");
    $(`#drC_${detailRowNumber}`).addClass("highlight");

    var removeRowResultC = removeRowFromArray(arr_TempToothLineDetail, "detailRowNumber", detailRowNumber);

    if (removeRowResultC.statusMessage == "removed")
        $(`#drC_${detailRowNumber}`).remove();

    if (arr_TempToothLineDetail.length == 0) {
        var colspan = $("#tempToothListC thead th").length;
        $("#tempToothC").html(emptyRow.replace("thlength", colspan));
    }
    rebuildToothRowC();

    var arr_TempToothLineDetailE = arr_TempToothLineDetail.filter(line => line.rowNumber === currentToothRowNumber);

    if (arr_TempToothLineDetailE.length === 0) {
        for (var j = 0; j < arr_TempTooth.length; j++) {
            if (arr_TempTooth[j].rowNumber === currentToothRowNumber) {
                arr_TempTooth[j].hasDiaganosis = "ندارد";
                var currentTooth = arr_TempTooth[j];
                editToothDiag(currentTooth, "UPD");
                break;
            }
        }
    }

}

function rebuildToothRowC() {

    var arrC = arr_TempToothLineDetail;
    var table = "tempToothC";

    if (arrC.length === 0)
        return;

    for (var b = 0; b < arrC.length; b++) {
        arrC[b].detailRowNumber = b + 1;

        if (typeof $(`#${table} tr`)[b] !== "undefined") {

            $(`#${table} tr`)[b].children[0].innerText = arrC[b].detailRowNumber;
            $(`#${table} tr`)[b].setAttribute("id", `drC_${arrC[b].detailRowNumber}`);
            $(`#${table} tr`)[b].children[0].innerText = arrC[b].detailRowNumber;

            if ($(`#${table} tr`)[b].children[6].innerHTML !== "") {

                $(`#${table} tr`)[b].children[6].innerHTML = `<button type="button" onclick="removeFromTempToothC(${arrC[b].detailRowNumber})" class="btn maroon_outline" data-toggle="tooltip" data-placement="bottom" title="حذف تشخیص">
                                                                     <i class="fa fa-trash"></i>
                                                           </button> <button type="button" onclick="EditFromTempToothC(${arrC[b].detailRowNumber})" class="btn green_outline_1" data-original-title="ویرایش تشخیص" style="margin-left:7px">
                                   <i class="fa fa-pen"></i>
                              </button>`;
            }
        }
    }

    arr_TempToothLineDetail = arrC;
}

$("#canceledToothC").on("click", function () {

    $("#toothBoxC .select2").val("").trigger("change");
    $("#toothBoxC input.form-control").val("");
    $("#toothStatusId").select2("focus");

    typeSaveToothC = "INS";

});

$("#ToothModalC").on("shown.bs.modal", function () {


    $("#toothStatusId").select2("focus");

    formToothC.reset();

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

$("#addTreatmentC").on("click", function () {

    var validate = formTreatmentC.validate();
    validateSelect2(formTreatmentC);
    if (!validate) return;

    var arr_TempTreatmentLineE = arr_TempTreatmentLine.filter(line => line.rowNumber === currentToothRowNumber);


    if (typeSaveTreatmentC == "INS") {
        if (typeof arr_TempTreatmentLine.find(f => f.serviceId == +$("#serviceId").val() && f.rowNumber == currentTreatmentRowNumber) !== "undefined") {
            var msgExist = alertify.warning(prMsg.existItem);
            msgExist.delay(prMsg.delay);
            return;
        }

        var treatmentC = {
            headerId: 0,
            rowNumber: currentTreatmentRowNumber,
            detailRowNumber: arr_TempTreatmentLineE.length + 1,
            serviceTypeId: +$("#serviceTypeId").val(),
            serviceTypeName: $("#serviceTypeId").select2('data').length > 0 ? $("#serviceTypeId").select2('data')[0].text : "",
            serviceId: +$("#serviceId").val(),
            serviceName: $("#serviceId").select2('data').length > 0 ? $("#serviceId").select2('data')[0].text : "",
            serviceCountUnitId: +$("#serviceCountUnitId").val(),
            serviceCountUnitName: $("#serviceCountUnitId").select2('data').length > 0 ? $("#serviceCountUnitId").select2('data')[0].text : "",
            serviceCount: $("#serviceCount").val(),
            startDateTimePersian: $("#startDateTime").val(),
            endDateTimePersian: $("#endDateTime").val(),

        }
        arr_TempTreatmentLine.push(treatmentC);
    }
    else {
        var treatmentC = {
            headerId: 0,
            rowNumber: currentTreatmentRowNumber,
            detailRowNumber: currentTreatmentDetailsRowNumber,
            serviceTypeId: +$("#serviceTypeId").val(),
            serviceTypeName: $("#serviceTypeId").select2('data').length > 0 ? $("#serviceTypeId").select2('data')[0].text : "",
            serviceId: +$("#serviceId").val(),
            serviceName: $("#serviceId").select2('data').length > 0 ? $("#serviceId").select2('data')[0].text : "",
            serviceCountUnitId: +$("#serviceCountUnitId").val(),
            serviceCountUnitName: $("#serviceCountUnitId").select2('data').length > 0 ? $("#serviceCountUnitId").select2('data')[0].text : "",
            serviceCount: $("#serviceCount").val(),
            startDateTimePersian: $("#startDateTime").val(),
            endDateTimePersian: $("#endDateTime").val(),
        }

    }
    appendTempTreatmentC(treatmentC, typeSaveTreatmentC);

    for (var i = 0; i < arr_TempTooth.length; i++) {
        if (arr_TempTooth[i].rowNumber === currentTreatmentRowNumber) {
            arr_TempTooth[i].hasTreatment = "دارد";
            arr_TempTooth[i].hasDiaganosis = "دارد";
            var currentTooth = arr_TempTooth[i];
            editToothDiag(currentTooth, "UPD");
            break;
        }
    }
    typeSaveTreatmentC = "INS";
});

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
                          <td>${treatmentC.startDateTimePersian}</td>
                          <td>${treatmentC.endDateTimePersian}</td>
                          <td id="operationdtr_${treatmentC.detailRowNumber}">
                              <button type="button" id="deleteTreatmentC_${treatmentC.detailRowNumber}" onclick="removeFromTempTreatmentC(${treatmentC.detailRowNumber})" class="btn maroon_outline" data-original-title="حذف سطر" style="margin-left:7px">
                                   <i class="fa fa-trash"></i>
                              </button><button type="button" id="EditTreatmentC_${treatmentC.detailRowNumber}" onclick="EditFromTempTreatmentC(${treatmentC.detailRowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                   <i class="fa fa-pen"></i>
                              </button>
                          </td>
                     </tr>`
            $(TreatmentOutputC).appendTo("#tempTreatmentC");
        }
        else {
            var i = arr_TempTreatmentLine.findIndex(x => x.detailRowNumber == treatmentC.detailRowNumber);
            arr_TempTreatmentLine[i].headerId = treatmentC.headerId;
            arr_TempTreatmentLine[i].rowNumber = treatmentC.rowNumber;
            arr_TempTreatmentLine[i].detailRowNumber = treatmentC.detailRowNumber;
            arr_TempTreatmentLine[i].serviceTypeId = treatmentC.serviceTypeId;
            arr_TempTreatmentLine[i].serviceTypeName = treatmentC.serviceTypeName;
            arr_TempTreatmentLine[i].serviceId = treatmentC.serviceId;
            arr_TempTreatmentLine[i].serviceName = treatmentC.serviceName;
            arr_TempTreatmentLine[i].serviceCount = treatmentC.serviceCount;
            arr_TempTreatmentLine[i].serviceCountUnitId = treatmentC.serviceCountUnitId;
            arr_TempTreatmentLine[i].serviceCountUnitName = treatmentC.serviceCountUnitName;
            arr_TempTreatmentLine[i].startDateTimePersian = treatmentC.startDateTimePersian;
            arr_TempTreatmentLine[i].endDateTimePersian = treatmentC.endDateTimePersian;


            $(`#dtr_${treatmentC.detailRowNumber} td:eq(0)`).text(`${treatmentC.detailRowNumber}`);
            $(`#dtr_${treatmentC.detailRowNumber} td:eq(1)`).text(`${treatmentC.serviceTypeId != 0 ? `${treatmentC.serviceTypeName}` : ""}`);
            $(`#dtr_${treatmentC.detailRowNumber} td:eq(2)`).text(`${treatmentC.serviceId != 0 ? `${treatmentC.serviceName}` : ""}`);
            $(`#dtr_${treatmentC.detailRowNumber} td:eq(3)`).text(`${treatmentC.serviceCount}`);
            $(`#dtr_${treatmentC.detailRowNumber} td:eq(4)`).text(`${treatmentC.serviceCountUnitId != 0 ? `${treatmentC.serviceCountUnitName}` : ""}`);
            $(`#dtr_${treatmentC.detailRowNumber} td:eq(5)`).text(`${treatmentC.startDateTimePersian}`);
            $(`#dtr_${treatmentC.detailRowNumber} td:eq(6)`).text(`${treatmentC.endDateTimePersian}`);

            $(`#operationdtr_${treatmentC.detailRowNumber}`).html(` <button type="button" id="deleteTreatmentC_${treatmentC.detailRowNumber}" onclick="removeFromTempTreatmentC(${treatmentC.detailRowNumber})" class="btn maroon_outline" data-original-title="حذف سطر" style="margin-left:7px">
                                   <i class="fa fa-trash"></i>
                              </button>
                              <button type="button" id="EditTreatmentC_${treatmentC.detailRowNumber}" onclick="EditFromTempTreatmentC(${treatmentC.detailRowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                   <i class="fa fa-pen"></i>
                              </button>`);

        }
    }
    resetDentalForm("treatmentC");

}


var EditFromTempTreatmentC = (detailRowNumber) => {

    $("#tempTreatmentC tr").removeClass("highlight");
    $(`#dtr_${detailRowNumber}`).addClass("highlight");

    var arr_TempTreatmentLineE = arr_TempTreatmentLine.filter(line => line.detailRowNumber === detailRowNumber)[0];

    var detailTreatmentC = "";

    $("#serviceTypeId").val(arr_TempTreatmentLineE.serviceTypeId).trigger('change');

    $("#serviceId").val(arr_TempTreatmentLineE.serviceId);
    detailTreatmentC = new Option(`${arr_TempTreatmentLineE.serviceName}`, arr_TempTreatmentLineE.serviceId, true, true);
    $("#serviceId").append(detailTreatmentC).trigger('change');
    detailTreatmentC = "";

    $("#serviceCountUnitId").val(arr_TempTreatmentLineE.serviceCountUnitId).trigger('change');

    $("#serviceCount").val(arr_TempTreatmentLineE.serviceCount);

    $("#serviceTypeId").select2("focus");

    $("#startDateTime").val(arr_TempTreatmentLineE.startDateTimePersian);
    $("#endDateTime").val(arr_TempTreatmentLineE.endDateTimePersian);


    typeSaveTreatmentC = "UPD";
    currentTreatmentDetailsRowNumber = arr_TempTreatmentLineE.detailRowNumber;
}


var removeFromTempTreatmentC = (detailRowNumber) => {

    currentTreatmentDetailsRowNumber = detailRowNumber;

    $("#tempTreatmentC tr").removeClass("highlight");
    $(`#dtr_${detailRowNumber}`).addClass("highlight");

    var removeRowResultC = removeRowFromArray(arr_TempTreatmentLine, "detailRowNumber", detailRowNumber);

    if (removeRowResultC.statusMessage == "removed")
        $(`#dtr_${detailRowNumber}`).remove();

    if (arr_TempTreatmentLine.length == 0) {
        var colspan = $("#tempTreatmentListC thead th").length;
        $("#tempTreatmentC").html(emptyRow.replace("thlength", colspan));
    }
    rebuildTreatmentRowC();

    var arr_TempTreatmentLineE = arr_TempTreatmentLine.filter(line => line.rowNumber === currentTreatmentRowNumber);

    if (arr_TempTreatmentLineE.length === 0) {
        for (var j = 0; j < arr_TempTooth.length; j++) {
            if (arr_TempTooth[j].rowNumber === currentTreatmentRowNumber) {
                arr_TempTooth[j].hasTreatment = "ندارد";
                arr_TempTooth[j].hasDiaganosis = "ندارد";
                var currentTooth = arr_TempTooth[j];
                editToothDiag(currentTooth, "UPD");
                break;
            }
        }
    }

}

function rebuildTreatmentRowC() {

    var arrC = arr_TempTreatmentLine;
    var table = "tempTreatmentC";

    if (arrC.length === 0)
        return;

    for (var b = 0; b < arrC.length; b++) {
        arrC[b].detailRowNumber = b + 1;

        if (typeof $(`#${table} tr`)[b] !== "undefined") {

            $(`#${table} tr`)[b].children[0].innerText = arrC[b].detailRowNumber;
            $(`#${table} tr`)[b].setAttribute("id", `dtr_${arrC[b].detailRowNumber}`);
            $(`#${table} tr`)[b].children[0].innerText = arrC[b].detailRowNumber;

            if ($(`#${table} tr`)[b].children[7].innerHTML !== "") {

                $(`#${table} tr`)[b].children[7].innerHTML = `<button type="button" onclick="removeFromTempTreatmentC(${arrC[b].detailRowNumber})" class="btn maroon_outline" data-toggle="tooltip" data-placement="bottom" title="حذف تشخیص">
                                                                     <i class="fa fa-trash"></i>
                                                           </button> <button type="button" onclick="EditFromTempTreatmentC(${arrC[b].detailRowNumber})" class="btn green_outline_1" data-original-title="ویرایش تشخیص" style="margin-left:7px">
                                   <i class="fa fa-pen"></i>
                              </button>`;
            }
        }
    }

    arr_TempTreatmentLine = arrC;
}

$("#canceledTreatmentC").on("click", function () {

    $("#treatmentBoxC .select2").val("").trigger("change");
    $("#treatmentBoxC input.form-control").val("");
    $("#treatmentStatusId").select2("focus");

    typeSaveTreatmentC = "INS";

});

$("#TreatmentModalC").on("shown.bs.modal", function () {


    $("#toothStatusId").select2("focus");

    formTreatmentC.reset();

});

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
    else if (typeBox == "adverseReaction") {
        $("#adverseReactionBox .select2").val("").trigger("change");
        $("#adverseReactionBox .funkyradio input:checkbox").prop("checked", false).trigger("change");
        $("#adverseReactionBox input.form-control").val("");
        $("#causativeAgentCategoryId").select2("focus");
        typeSaveDiag = "INS";
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
        $("#tempAdverseReaction").html(fillEmptyRow(7));
    }
}

initSendDentalForm();

async function initSendDentalForm() {
   
    var newOption = new Option("انتخاب کنید", 0, true, true);
    $('#attenderId').append(newOption).trigger('change');
    fill_select2(`${viewData_baseUrl_MC}/Attender_AssistantApi/getdropdown`, "attenderId", true, 0, false, 0, "انتخاب داکتر...");

    //if (dentalId != "0") {
    //    $("#choiceOfAdmission").css("display" , "none")
    //}

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
    ColumnResizeable("tempAdverseReaction");

    bindDentalElement();
    inputMask();
    $("#isMissing").trigger("change");

    $(".card-body").fadeIn(1000);
}

function resetFormDental() {

    alertify.confirm('بازنشانی', "ایا اطمینان دارید؟",
        function () {
            arr_TempAbuseHistory = [];
            arr_TempFamilyHistory = [];
            arr_TempDrugHistory = [];
            arr_TempDrugOrdered = [];
            arr_TempAdverseReaction = []
            arr_TempMedicalHistory = [];
            arr_TempDiagnosis = [];
            arr_TempTooth = [];
            arr_TempToothLineDetail = [];
            arr_TempTreatmentLine = [];

            $("#choiceOfAdmission").css("display", "inline")
            $("#tempabuseHistoryField").html(fillEmptyRow(8));
            $("#tempadmissionField").html(fillEmptyRow(5));
            $("#tempdiagnosisField").html(fillEmptyRow(5));
            $("#tempdrugHistoryField").html(fillEmptyRow(3));
            $("#tempdrugOrderedField").html(fillEmptyRow(12));
            $("#tempfamilyHistoryField").html(fillEmptyRow(5));
            $("#tempinsuranceField").html(fillEmptyRow(6));
            $("#temppastMedicalHistoryField").html(fillEmptyRow(6));
            $("#tempabuseHistory").html(fillEmptyRow(9));
            $("#tempfamilyHistory").html(fillEmptyRow(6));
            $("#tempdrugHistory").html(fillEmptyRow(4));
            $("#tempdrugOrdered").html(fillEmptyRow(13));
            $("#tempmedicalHistory").html(fillEmptyRow(7));
            $("#tempDiag").html(fillEmptyRow(6));
            $("#tempTooth").html(fillEmptyRow(6));
            $("#tempToothC").html(fillEmptyRow(6));
            $("#tempTreatmentC").html(fillEmptyRow(6));
            $("#tempAdverseReaction").html(fillEmptyRow(7));

            $("#admissionSelected").html("");
            $("#admissionId").val("");
            $("#patientNationalCode").val("");
            $("#patientFullName").val("");
            $("#createDatePersian").val("");
            $("#searchAdmission").val("");

            $("#dentalId").val(0);
            dentalId = 0;
            $("#userFullName").val("");
            $("#dentalBox").addClass("displaynone");

            $("#dentalForm .select2").val("").trigger("change");
            $("#dentalForm .funkyradio input:checkbox").prop("checked", false).trigger("change");
            $("#dentalForm input.form-control").val("");

            $("#dentalFormT .select2").val("").trigger("change");
            $("#dentalFormT .funkyradio input:checkbox").prop("checked", false).trigger("change");
            $("#dentalFormT input.form-control").val("");

            $("#abuseHistoryBox .select2").val("").trigger("change");
            $("#abuseHistoryBox input.form-control").val("");

            $("#familyHistoryBox .select2").val("").trigger("change");
            $("#familyHistoryBox input.form-control").val("");
            $("#familyHistoryBox .funkyradio input:checkbox").prop("checked", false).trigger("change");

            $("#drugHistoryBox .select2").val("").trigger("change");
            $("#drugHistoryBox input.form-control").val("");

            $("#drugOrderedBox .select2").val("").trigger("change");
            $("#drugOrderedBox input.form-control").val("");

            $("#heightWeightBox input.form-control").val("");

            $("#medicalHistoryBox .select2").val("").trigger("change");
            $("#medicalHistoryBox input.form-control").val("");

            $("#adverseReactionBox .select2").val("").trigger("change");
            $("#adverseReactionBox input.form-control").val("");
        },
        function () {
            return;
        }
    ).set('labels', { ok: 'بله', cancel: 'خیر' });
}

$("#list_adm").on("click", function () {
    navigation_item_click('/MC/Dental', 'لیست دندانداکتری')
});
