
$(".tab-content").show();
$(".select2").select2();
$("input:text").focus(function () { $(this).select(); });
$(".card-body").hide(1);


var viewData_controllername = "AdmissionReferApi",
    viewData_get_FollowUpPlaneTypeId = `${viewData_baseUrl_MC}/${viewData_controllername}/getthrfollowUpplanetypedropdown/`,
    viewData_get_ReferredReasonId = `${viewData_baseUrl_MC}/${viewData_controllername}/getreferredreasoniddropdown/`,
    viewData_get_ReferredTypeId = `${viewData_baseUrl_MC}/${viewData_controllername}/getreferredtypeiddropdown`,
    viewData_get_abuseDurationUnitId = `${viewData_baseUrl_MC}/${viewData_controllername}/getabusedurationunitiddropdown`,
    viewData_get_amountOfAbuseUnitId = `${viewData_baseUrl_MC}/${viewData_controllername}/getamountofabuseunitiddropdown`,
    viewData_get_substanceTypeId = `${viewData_baseUrl_MC}/${viewData_controllername}/getsubstancetypeiddropdown`,
    viewData_get_causativeAgentCategoryId = `${viewData_baseUrl_MC}/${viewData_controllername}/getcausativeagentcategoryiddropdown`,
    viewData_get_causativeAgentId = `${viewData_baseUrl_MC}/${viewData_controllername}/getcausativeagentiddropdown`,
    viewData_get_diagnosisSeverityId = `${viewData_baseUrl_MC}/${viewData_controllername}/getdiagnosisseverityiddropdown`,
    viewData_get_reactionCategoryId = `${viewData_baseUrl_MC}/${viewData_controllername}/getreactioncategoryiddropdown`,
    viewData_get_reactionId = `${viewData_baseUrl_MC}/${viewData_controllername}/getreactioniddropdown`,
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
    viewData_get_methodId = `${viewData_baseUrl_MC}/${viewData_controllername}/getmethodiddropdown`,
    viewData_get_lateralityId = `${viewData_baseUrl_MC}/${viewData_controllername}/getlateralityiddropdown`,
    viewData_get_SearchAdmission = `${viewData_baseUrl_MC}/AdmissionApi/searchinbound`, /*searchinboundadmissionreffer*/
    viewData_get_AdmissionGet = `${viewData_baseUrl_MC}/${viewData_controllername}/getfeedback`,
    viewData_get_referPatientRecord = `${viewData_baseUrl_MC}/${viewData_controllername}/getreferpatientrecord`,
    viewData_get_AdmissionGetDiagnosis = `${viewData_baseUrl_MC}/AdmissionApi/getdiagnosis`,
    viewData_get_AdmissionSearch = `${viewData_baseUrl_MC}/AdmissionApi/search`,
    viewData_get_StatusId = `${viewData_baseUrl_MC}/PrescriptionApi/diagnosisstatusid`,
    viewData_get_DiagnosisReasonId = `${viewData_baseUrl_MC}/PrescriptionApi/diagnosisreasonid`,
    viewData_get_Serverity = `${viewData_baseUrl_MC}/PrescriptionApi/serverityid`,
    emptyRow = `<tr id="emptyRow"><td colspan="thlength" class="text-center">سطری وجود ندارد</td></tr>`,
    viewData_save_AdmissionRefer = `${viewData_baseUrl_MC}/${viewData_controllername}/savefeedback`,
    admissionIdentity = 0, admissionReferId = +$("#admissionReferId").val(), referralHID = "",
    currentAbuseHistoryRowNumber = 0, currentFamilyHistoryRowNumber = 0, currentCareActionRowNumber = 0,
    currentClinicFindingRowNumber = 0, currentDrugHistoryRowNumber = 0, currentDrugOrderedRowNumber = 0, currentMedicalHistoryRowNumber = 0, currentDiagRowNumber = 0,
    typeSaveAbuseHistory = "INS", typeSaveFamilyHistory = "INS", typeSaveCareAction = "INS",
    typeSaveClinicFinding = "INS", typeSaveDrugHistory = "INS", typeSaveDrugOrdered = "INS", typeSaveMedicalHistory = "INS", typeSaveDiag = "INS",
    arr_TempAbuseHistory = [], arr_TempFamilyHistory = [], arr_TempCareAction = [], arr_TempClinicFinding = [],
    arr_TempDrugHistory = [], arr_TempDrugOrdered = [], arr_TempMedicalHistory = [], arr_TempDiagnosis = [],
    FormAbuseHistory = $('#abuseHistoryForm').parsley(), FormFamilyHistory = $('#familyHistoryForm').parsley(),
    FormCareAction = $('#careActionForm').parsley(), FormClinicFinding = $('#clinicFindingForm').parsley(),
    FormDrugHistory = $('#drugHistoryForm').parsley(), FormDrugOrdered = $('#drugOrderedForm').parsley(),
    FormMedicalHistory = $('#medicalHistoryForm').parsley(), diagForm = $('#diagForm').parsley(), formRefer = $('#referForm').parsley(),
    referringDoctorId = 0, referringDoctorFirstName = "", referringDoctorLastName = "", referringDoctorSpecialityCode = 0, referringDoctorRoleCode = 0,
    referringDoctorMsc = 0, referringDoctorMscTypeId = 0, checkPatientNationalCode = 0, checkReferallNationalCode = 0,
    checkFirsLastName = "", checkDatetime = "";

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

$("#admissionReferFormBox").on("keydown", function (ev) {
    if (ev.ctrlKey && ev.shiftKey && ev.keyCode === KeyCode.Insert) {
        ev.preventDefault();
        $("#saveForm").click();
    }
});

document.onkeydown = function (e) {
    if (e.ctrlKey && e.keyCode === KeyCode.key_s) {
        e.preventDefault();
        saveAdmissionReferForm();
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

async function saveAdmissionReferForm() {

    await disableSaveButtonAsync(true);

    if (validateReferForm()) {
        await disableSaveButtonAsync(false);
        return;
    }
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

    //var status = arr_TempDiagnosis.findIndex(item => item.statusId == 3);
    if ((arr_TempDiagnosis.findIndex(item => item.statusId == 3)) == -1) {
        var msg_temp_srv = alertify.warning("تشخیص نهایی را وارد کنید");
        msg_temp_srv.delay(prMsg.delay);
        await disableSaveButtonAsync(false);
        return;
    }

    if (checkFirsLastName == "" && checkDatetime == "") {
        var msg_temp_srv = alertify.warning("برای ثبت بازخورد نیاز به دریافت ارجاع میباشد");
        msg_temp_srv.delay(prMsg.delay);
        await disableSaveButtonAsync(false);
        return;
    }

    if (checkPatientNationalCode != checkReferallNationalCode) {
        var msg_temp_srv = alertify.warning("نمبر تذکره مراجعه کننده با نمبر تذکره ارجاع شده همخوانی ندارد");
        msg_temp_srv.delay(prMsg.delay);
        await disableSaveButtonAsync(false);
        return;
    }

    for (var i = 0; i < arr_TempDiagnosis.length; i++)
        arr_TempDiagnosis[i].admissionId = admissionIdentity;

    var model = {
        id: admissionReferId,
        admissionId: admissionIdentity,
        admissionReferTypeId: 3,
        relatedHID: referralHID,
        lifeCycleStateId: 0,
        iSQueriable: $('#iSQueriable').prop("checked"),
        //referredReasonId: +$('#referredReasonId').val(),
        //referredTypeId: +$('#referredTypeId').val(),
        //referredDescription: $('#referralDescription').val(),
        referringDoctorId: referringDoctorId,
        referringDoctorFirstName: referringDoctorFirstName,
        referringDoctorLastName: referringDoctorLastName,
        referringDoctorSpecialityCode: referringDoctorSpecialityCode,
        referringDoctorRoleCode: referringDoctorRoleCode,
        referringDoctorMsc: referringDoctorMsc,
        referringDoctorMscTypeId: referringDoctorMscTypeId,
        followUpNextEncounterType: +$('#nextEncounterType').val(),
        followUpNextEncounterUnitId: $('#nextEncounterUnitId').val(),
        followUpNextEncounter: $('#nextEncounter').val(),
        followUpDateTimePersian: $('#nextEncounterDateTimePersian').val(),
        followUpDescription: $('#followUpDescription').val(),
        admissionReferAbuseHistoryLines: arr_TempAbuseHistory,
        admissionReferalFamilyHisotryLines: arr_TempFamilyHistory,
        admissionReferCareActionLines: arr_TempCareAction,
        admissionReferClinicFindingLines: arr_TempClinicFinding,
        admissionReferDrugHistoryLines: arr_TempDrugHistory,
        admissionReferDrugOrderedLines: arr_TempDrugOrdered,
        admissionReferMedicalHistoryLines: arr_TempMedicalHistory,
        admissionReferDiagnosisLines: arr_TempDiagnosis
    };
    saveAdmissionReferAsync(model).then(async (data) => {
        if (data.successfull) {
            setTimeout(() => {
                navigation_item_click("/MC/AdmissionRefer", "لیست ارجاع");
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

function validateReferForm() {

    var validate = formRefer.validate();
    validateSelect2(formRefer);
    return !validate;
}

function validateAllTab() {
    if (arr_TempAbuseHistory.length === 0 && arr_TempFamilyHistory.length === 0 && arr_TempCareAction.length === 0 && arr_TempClinicFinding.length === 0 &&
        arr_TempDrugHistory.length === 0 && arr_TempDrugOrdered.length === 0 && arr_TempMedicalHistory.length === 0) {
        return true;
    }
    return false;
}

async function saveAdmissionReferAsync(AdmissionRefer) {
    let result = await $.ajax({
        url: viewData_save_AdmissionRefer,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(AdmissionRefer),
        success: function (data) {
            return data;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_save_AdmissionRefer);
            return {
                status: -100,
                statusMessage: "عملیات با خطا مواجه شد",
                successfull: false
            };
        }
    });

    return result;
}

async function bindAdmissionReferElement() {

    fill_select2(viewData_get_FollowUpPlaneTypeId, "nextEncounterType", true);
    //fill_select2(viewdata_get_referredreasonid, "referredreasonid", true);
    fill_select2(viewData_get_ReferredTypeId, "referredTypeId", true);

    fill_select2(viewData_get_abuseDurationUnitId, "abuseDurationUnitId", true);
    fill_select2(viewData_get_abuseDurationUnitId, "nextEncounterUnitId", true);
    fill_select2(viewData_get_amountOfAbuseUnitId, "amountOfAbuseUnitId", true);
    fill_select2(viewData_get_substanceTypeId, "substanceTypeId", true);

    fill_select2(viewData_get_causativeAgentCategoryId, "causativeAgentCategoryId", true, 0, true);
    fill_select2(viewData_get_causativeAgentId, "causativeAgentId", true, 0, true);
    fill_select2(viewData_get_diagnosisSeverityId, "diagnosisSeverityId", true);
    fill_select2(viewData_get_reactionCategoryId, "reactionCategoryId", true, 0, true);
    fill_select2(viewData_get_reactionId, "reactionId", true, 0, true);

    fill_select2(viewData_get_conditionId, "conditionId_familyHistory", true, 0, true);
    fill_select2(viewData_get_relatedPersonId, "relatedPersonId", true);

    fill_select2(viewData_get_actionNameId, "actionNameId", true, 0, true);
    fill_select2(viewData_get_timeTakenUnitId, "timeTakenUnitId", true);

    fill_select2(viewData_get_findingId, "findingId", true, 0, true);
    fill_select2(viewData_get_onsetDurationToPresentUnitId_clinicFinding, "onsetDurationToPresentUnitId_clinicFinding", true);
    fill_select2(viewData_get_severityId, "severityId", true);

    fill_select2(viewData_get_erxId, "medicationId", true, 0, true);
    fill_select2(viewData_get_routeId, "routeId_drugHistory", true);

    fill_select2(viewData_get_dosageUnitId, "dosageUnitId", true);
    fill_select2(viewData_get_frequencyId, "frequencyId", true);
    fill_select2(viewData_get_longTermUnitId, "longTermUnitId", true);
    fill_select2(viewData_get_erxId, "productId", true, 0, true);
    fill_select2(viewData_get_routeId, "routeId_drugOrdered", true);

    fill_select2(viewData_get_conditionId, "conditionId_medicalHistory", true, 0, true);
    fill_select2(viewData_get_onsetDurationToPresentUnitId_medicalHistory, "onsetDurationToPresentUnitId_medicalHistory", true);

    fill_select2(viewData_get_StatusId, "statusId", true);
    fill_select2(viewData_get_DiagnosisReasonId, "diagnosisResonId", true, 0, true);
    fill_select2(viewData_get_Serverity, "serverityId", true);


    if (admissionReferId !== 0)
        getAdmissionReferData(admissionReferId);
}

var focusSearchedRow = (i) => {
    $("#tempAdmission tr").removeClass("highlight");
    $(`#tempAdmission #adm_${i}`).addClass("highlight");
    $(`#tempAdmission #adm_${i} > td > button`).focus();
}

function admissionRowKeyDown(index, event) {
    if (event.which === KeyCode.ArrowDown) {

        if ($(`#tempAdmission #adm_${index + 1}`).length > 0) {
            $("#tempAdmission tr").removeClass("highlight");
            $(`#tempAdmission #adm_${index + 1}`).addClass("highlight");
            $(`#tempAdmission #adm_${index + 1} > td > button`).focus();
        }
    }

    if (event.which === KeyCode.ArrowUp) {
        if ($(`#tempAdmission #adm_${index - 1}`).length > 0) {
            $("#tempAdmission tr").removeClass("highlight");
            $(`#tempAdmission #adm_${index - 1}`).addClass("highlight");
            $(`#tempAdmission #adm_${index - 1} > td > button`).focus();
        }
    }

}

function setAdmissionInfo_otherConfig(data) {
    admissionIdentity = +data.admissionId;
    referringDoctorId = data.attenderId;
    checkPatientNationalCode = data.patientNationalCode;
    getDiagnosis(+data.admissionId);
    $("#referralId").val(data.referredHID);
    $("#admissionSelected tr td:eq(6)").addClass("d-none")
    if ($("#referralId").val() !== "")
        $("#getreferral").click();
}

function displayAdmission(id, elm) {
    
    let row = $(elm).parent().parent()
    let admissionId = row.data("admissionid")
    let workflowId = row.data("workflowid");
    let stageId = row.data("stageid");

    let workflowStage = getAdmissionTypeId(stageId, workflowId)
    let admissionTypeId = workflowStage.admissionTypeId

    //if (admissionTypeId == 1)
    //    getRequestData(`${viewData_baseUrl_MC}/AdmissionItemApi/display`, admissionTypeId, admissionId);
    //else if (admissionTypeId == 2 || admissionTypeId == 3 || admissionTypeId == 4)
        getRequestData(`${viewData_baseUrl_MC}/AdmissionApi/display`, admissionTypeId, admissionId);
}

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
                    diagnosisDateTimePersian: datadb.diagnosisDateTimePersian,
                    comment: datadb.comment,
                };

                arr_TempDiagnosis.push(model);
                appendTempDiagnosis(model);
                model = {};
            }
            rebuildDaigRow()
        }
        // Diagnosis
    }
};

var fillDiagnosisT = (data) => {
    if (data !== null) {
        // DiagnosisT
        if (data != null) {
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
                    diagnosisDateTimePersian: datadb.diagnosisDateTimePersian,
                    comment: datadb.comment,
                };
                appendTempDiagnosisT(model);
                model = {};
            }
        }
        // DiagnosisT
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
        $("#userFullName").val(`${data.userId} - ${data.userFullName}`);
        $("#AdmissionReferBox").removeClass("displaynone");
        
        //setAdmissionInfo(data.admissionId);
        fillAdmission(data)
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
                    timeTakenUnitName: datadb.timeTakenUnitId + " - " + datadb.timeTakenUnitDescription,
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
                    onsetDurationToPresentUnitDescription:  datadb.onsetDurationToPresentUnitDescription,
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

function fillElementRefer(data) {
    
    var elm = $(`#${'iSQueriable'}`);
    var switchValue = elm.attr("switch-value").split(',');
    if (data.isQueriable == true) {
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
    $(`#iSQueriable`).blur();

    //$("#referredReasonId").val(data.referredReasonId).trigger('change');
    //$("#referredTypeId").val(data.referredTypeId).trigger('change');
    //$("#referralDescription").val(data.referredDescription);
    $("#nextEncounterUnitId").val(data.followUpNextEncounterUnitId).trigger('change');
    $("#nextEncounter").val(data.followUpNextEncounter);
    $("#nextEncounterDateTimePersian").val(data.followUpDateTimePersian);
    $("#nextEncounterType").val(data.followUpNextEncounterType).trigger('change');
    $("#followUpDescription").val(data.followUpDescription);

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

$("#getreferral").on("click", async function () {
    await loadingAsync(true, "getreferral");

    if ($("#referralId").val() === "") {
        await loadingAsync(false, "getreferral");
        var msgRequired = alertify.warning("کد ارجاع را وارد نمایید");
        msgRequired.delay(alertify_delay);
        return;
    }
    var referralId = $("#referralId").val();
    await resetAdmissionReferT();
    $.ajax({
        url: viewData_get_referPatientRecord,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(referralId),
        success: async function (data) {
            if (+data.status == 100) {
                fillAdmissionReferT(data);
            }
            else {
                var msgGetFeedBack = alertify.error(data.statusMessage);
                msgGetFeedBack.delay(alertify_delay);
                await loadingAsync(false, "getreferral");

            }

        },
        error: async function (xhr) {
            error_handler(xhr, viewData_get_referPatientRecord);
            await loadingAsync(false, "getreferral");
        }
    });
});

var resetAdmissionReferT = async () => {
    $("#tempGetRefer").html("");
    $("#tempabuseHistoryField").html(fillEmptyRow(8));
    $("#tempadmissionField").html(fillEmptyRow(5));
    $("#tempcareActionField").html(fillEmptyRow(7));
    $("#tempclinicalFindingField").html(fillEmptyRow(9));
    $("#tempadverseReactionField").html(fillEmptyRow(7));
    $("#tempdiagnosisField").html(fillEmptyRow(5));
    $("#tempdrugHistoryField").html(fillEmptyRow(3));
    $("#tempdrugOrderedField").html(fillEmptyRow(12));
    $("#tempfamilyHistoryField").html(fillEmptyRow(5));
    $("#tempinsuranceField").html(fillEmptyRow(6));
    $("#tempreferralInfo").html(fillEmptyRow(8));
    $("#temppastMedicalHistoryField").html(fillEmptyRow(6));
    $("#tempbloodPerssureT").html(fillEmptyRow(6));
    $("#tempheightWeightT").html(fillEmptyRow(4));
    $("#temppulseT").html(fillEmptyRow(8));
    $("#tempvitalSingsT").html(fillEmptyRow(6));
    $("#tempwaistHipT").html(fillEmptyRow(4));

}

var fillAdmissionReferT = async (res) => {
    var data = res.data;
    var datadb, lineLength, model, rFirstName, rLastName, aFirstName, aLastName, cunter, dateField, dateFieldResult, timeField, timeFieldResult, sDateField, sDateFieldResult, sTimeField, sTimeFieldResult, eDateField, eDateFieldResult, eTimeField, eTimeFieldResult;
    if (data !== null) {
        
        // GetfeedBackRefer
        if (data.person != null) {
            var dld = 0; model = {};
            datadb = data.person;
            dateField = datadb.birthDate;
            dateFieldResult = dateField == null ? "" : dateField.year + "/" + dateField.month + "/" + dateField.day;
            var personFirsName = datadb.firstName == null ? "" : datadb.firstName;
            var personLastName = datadb.lastName == null ? "" : datadb.lastName;

            checkFirsLastName = personFirsName + personLastName;
            checkFirsLastName = checkFirsLastName.trim();

            model = {
                personFirsLastName: personFirsName + " " + personLastName,
                gender: datadb.gender == null ? "" : datadb.gender.value,
                mobileNumber: datadb.mobileNumber == null ? "" : datadb.mobileNumber,
                fullAddress: datadb.fullAddress == null ? "" : datadb.fullAddress,
                birthDate: dateFieldResult,
                nationality: datadb.nationality == null ? "" : datadb.nationality.value,
                nationalCode: datadb.nationalCode == null ? "" : datadb.nationalCode,
                maritalStatus: datadb.maritalStatus == null ? "" : datadb.maritalStatus.value,
            };

            checkReferallNationalCode = datadb.nationalCode == null ? "" : datadb.nationalCode;

            appendTempGetRefer(model);
            model = {};
        }

        // abuseHistoryField
        if (data.abuseHistory != null) {
            cunter = 0; model = {};
            lineLength = data.abuseHistory.length;
            for (var dld = 0; dld < lineLength; dld++) {
                datadb = data.abuseHistory[dld];
                sDateField = datadb.startDate;
                sDateFieldResult = sDateField == null ? "" : sDateField.year + "/" + sDateField.month + "/" + sDateField.day;
                eDateField = datadb.quitDate;
                eDateFieldResult = eDateField == null ? "" : eDateField.year + "/" + eDateField.month + "/" + eDateField.day;
                model = {
                    rowNumber: ++cunter,
                    abuseDuration: datadb.abuseDuration == null ? "" : datadb.abuseDuration.magnitude,
                    abuseDurationUnitId: datadb.abuseDuration == null ? "" : datadb.abuseDuration.unit,
                    amountOfAbuseDosage: datadb.amountOfAbuse == null ? "" : datadb.amountOfAbuse.magnitude,
                    amountOfAbuseUnitId: datadb.amountOfAbuse == null ? "" : datadb.amountOfAbuse.unit,
                    startDate: sDateFieldResult,
                    quitDate: eDateFieldResult,
                    substanceTypeId: datadb.substanceType == null ? "" : datadb.substanceType.value,
                };
                appendTempAbuseHistoryT(model);
                model = {};
            }
        }

        // admissionField
        if (data.admission != null) {
            var dld = 0; model = {};
            datadb = data.admission;
            dateField = datadb.admissionDate;
            dateFieldResult = dateField == null ? "" : dateField.year + "/" + dateField.month + "/" + dateField.day;
            timeField = datadb.admissionTime;
            timeFieldResult = timeField == null ? "" : timeField.hour + ":" + timeField.minute;
            rFirstName = datadb.referringDoctor == null ? "" : datadb.referringDoctor.firstName == null ? "" : datadb.referringDoctor.firstName;
            rLastName = datadb.referringDoctor == null ? "" : datadb.referringDoctor.lastName == null ? "" : datadb.referringDoctor.lastName;
            aFirstName = datadb.attendingDoctor == null ? "" : datadb.attendingDoctor.firstName == null ? "" : datadb.attendingDoctor.firstName;
            aLastName = datadb.attendingDoctor == null ? "" : datadb.attendingDoctor.lastName == null ? "" : datadb.attendingDoctor.lastName;

            checkDatetime = dateFieldResult + timeFieldResult;
            checkDatetime = checkDatetime.trim();

            model = {
                admissionDateTime: dateFieldResult + " " + timeFieldResult,
                admissionType: datadb.admissionType == null ? "" : datadb.admissionType.value,
                institute: datadb.institute == null ? "" : datadb.institute.name,
                referringDoctor: rFirstName + " " + rLastName,
                attendingDoctor: aFirstName + " " + aLastName,
            };

            var attendingDoctor = datadb.attendingDoctor;
            if (attendingDoctor != null) {
                referringDoctorFirstName = attendingDoctor.firstName;
                referringDoctorLastName = attendingDoctor.lastName;
                referringDoctorSpecialityCode = attendingDoctor.specialty == null ? 0 : attendingDoctor.specialty.coded_string == null ? 0 : attendingDoctor.specialty.coded_string;
                referringDoctorRoleCode = attendingDoctor.role == null ? 0 : attendingDoctor.role.coded_string == null ? 0 : attendingDoctor.role.coded_string;
                var identifier = attendingDoctor.identifier;
                if (identifier != null) {
                    referringDoctorMsc = identifier.id;

                    var type = identifier.type;
                    if (type != null) {
                        tempType = type.toLowerCase();

                        if (tempType == "med_id")
                            referringDoctorMscTypeId = 1;
                        else if (tempType == "nursing_id")
                            referringDoctorMscTypeId = 2;
                        else
                            referringDoctorMscTypeId = 3;
                    }
                }
            }

            appendTempadmissionField(model);
            model = {};
        }

        // careActionField
        if (data.careAction != null) {
            cunter = 0; model = {};
            lineLength = data.careAction.length;
            for (var dld = 0; dld < lineLength; dld++) {
                datadb = data.careAction[dld];
                sDateField = datadb.startDate;
                sDateFieldResult = sDateField == null ? "" : sDateField.year + "/" + sDateField.month + "/" + sDateField.day;
                sTimeField = datadb.startTime;
                sTimeFieldResult = sTimeField == null ? "" : sTimeField.hour + ":" + sTimeField.minute;
                eDateField = datadb.endDate;
                eDateFieldResult = eDateField == null ? "" : eDateField.year + "/" + eDateField.month + "/" + eDateField.day;
                eTimeField = datadb.endTime;
                eTimeFieldResult = eTimeField == null ? "" : eTimeField.hour + ":" + eTimeField.minute;
                model = {
                    rowNumber: ++cunter,
                    actionDescription: datadb.actionDescription == null ? "" : datadb.actionDescription,
                    actionNameId: datadb.actionName == null ? "" : datadb.actionName.value,
                    startDateTime: sDateFieldResult + " " + sTimeFieldResult,
                    endDateTime: eDateFieldResult + " " + eTimeFieldResult,
                    timeTaken: datadb.timeTaken == null ? "" : datadb.timeTaken.magnitude,
                    timeTakenUnitId: datadb.timeTaken == null ? "" : datadb.timeTaken.unit,
                };
                appendTempCareActionT(model);
                model = {};
            }
        }

        // clinicalFindingField
        if (data.clinicalFinding != null) {
            cunter = 0; model = {};
            lineLength = data.clinicalFinding.length;
            for (var dld = 0; dld < lineLength; dld++) {
                datadb = data.clinicalFinding[dld];
                dateField = datadb.dateofOnset;
                dateFieldResult = dateField == null ? "" : dateField.year + "/" + dateField.month+ "/" + dateField.day;
                timeField = datadb.timeofOnset;
                timeFieldResult = timeField == null ? "" : timeField.hour + ":" + timeField.minute;
                model = {
                    rowNumber: ++cunter,
                    ageOfOnset: datadb.ageOfOnset == null ? "" : datadb.ageOfOnset.magnitude + "-" + datadb.ageOfOnset.unit,
                    findingId: datadb.finding == null ? "" : datadb.finding.value,
                    nillSignificant: datadb.nillSignificant == null ? "" : datadb.nillSignificant == true ? "بلی" : "خیر",
                    onsetDurationToPresent: datadb.onsetDuration2Present == null ? "" : datadb.onsetDuration2Present.magnitud,
                    onsetDurationToPresentUnitId: datadb.onsetDuration2Present == null ? "" : datadb.onsetDuration2Present.unit,
                    severityId: datadb.severity == null ? "" : datadb.severity.symbol == null ? "" : datadb.severity.symbol.value,
                    onSetDateTime: dateFieldResult + " " + timeFieldResult,
                    description: datadb.description == null ? "" : datadb.description,
                };
                appendTempClinicFindingT(model);
                model = {};
            }
        }
        // adversreactionField
        if (data.adverseReaction != null) {
            cunter = 0; model = {};
            lineLength = data.adverseReaction.length;
            for (var dld = 0; dld < lineLength; dld++) {
                datadb = data.adverseReaction[dld];                
                model = {
                    rowNumber: ++cunter,
                    causativeAgentCategoryId: datadb.causativeAgentCategory == null ? "" : datadb.causativeAgentCategory.value,
                    causativeAgentId: datadb.causativeAgent == null ? "" : datadb.causativeAgent.value,
                    reactionCategoryId: datadb.reactionCategory == null ? "" : datadb.reactionCategory.value,
                    reactionId: datadb.reaction == null ? "" : datadb.reaction.value,
                    diagnosisSeverityId: datadb.severity == null ? "" : datadb.severity.symbol == null ? "" : datadb.severity.symbol.value,
                    description: datadb.description == null ? "" : datadb.description,
                };
                appendTempAdverseReactionT(model);
                model = {};
            }
        }
      
        // diagnosisField
        if (data.diagnosis != null) {
            cunter = 0; model = {};
            lineLength = data.diagnosis.length;
            for (var dld = 0; dld < lineLength; dld++) {
                datadb = data.diagnosis[dld];
                model = {
                    rowNumber: ++cunter,
                    statusId: datadb.status == null ? "" : datadb.status.value,
                    diagnosisResonId: datadb.diagnosis == null ? "" : datadb.diagnosis.value,
                    serverityId: datadb.severity == null ? "" : datadb.severity.symbol == null ? "" : datadb.severity.symbol.value,
                    diagnosisDateTimePersian: datadb.diagnosisDateTimePersian,
                    comment: datadb.comment == null ? "" : datadb.comment,
                };
                appendTempDiagnosisT(model);
                model = {};
            }
        }

        // drugHistoryField
        if (data.drugHistory != null) {
            cunter = 0; model = {};
            lineLength = data.drugHistory.length;
            for (var dld = 0; dld < lineLength; dld++) {
                datadb = data.drugHistory[dld];
                model = {
                    rowNumber: ++cunter,
                    medicationId: datadb.medication == null ? "" : datadb.medication.value,
                    routeId: datadb.routeofadministration == null ? "" : datadb.routeofadministration.value,
                };
                appendTempDrugHistoryT(model);
                model = {};
            }
        }
        // drugHistoryField

        // drugOrderedField
        if (data.drugOrdered != null) {
            cunter = 0; model = {};
            lineLength = data.drugOrdered.length;
            for (var dld = 0; dld < lineLength; dld++) {
                datadb = data.drugOrdered[dld];
                dateField = datadb.administrationDate;
                dateFieldResult = dateField == null ? "" : dateField.year + "/" + dateField.month + "/" + dateField.day;
                timeField = datadb.administrationTime;
                timeFieldResult = timeField == null ? "" : timeField.hour + ":" + timeField.minute;
                model = {
                    rowNumber: ++cunter,
                    administrationDateTime: dateFieldResult + " " + timeFieldResult,
                    description: datadb.description == null ? "" : datadb.description,
                    dosage: datadb.dosage == null ? "" : datadb.dosage.magnitude,
                    dosageUnitId: datadb.dosage == null ? "" : datadb.dosage.unit,
                    drugGenericName: datadb.drugGenericName == null ? "" : datadb.drugGenericName,
                    frequencyId: datadb.frequency == null ? "" : datadb.frequency.value,
                    longTerm: datadb.longTerm == null ? "" : datadb.longTerm.magnitude,
                    longTermUnitId: datadb.longTerm == null ? "" : datadb.longTerm.unit,
                    productName: datadb.drugName == null ? "" : datadb.drugName.value,
                    productId: datadb.drugName == null ? "" : datadb.drugName.coded_string,
                    routeId: datadb.route == null ? "" : datadb.route.value,
                    qty: datadb.totalNumberField == null ? "" : datadb.totalNumberField,
                };
                appendTempDrugOrderedT(model);
                model = {};
            }
        }

        // familyHistoryField
        if (data.familyHistory != null) {
            cunter = 0; model = {};
            lineLength = data.familyHistory.length;
            for (var dld = 0; dld < lineLength; dld++) {
                datadb = data.familyHistory[dld];
                model = {
                    rowNumber: ++cunter,
                    conditionId: datadb.condition == null ? "" : datadb.condition.value,
                    description: datadb.description == null ? "" : datadb.description,
                    isCauseofDeath: datadb.is_CauseofDeath == null ? "" : datadb.is_CauseofDeath == true ? "بلی" : "خیر",
                    relatedPersonId: datadb.relatedPerson == null ? "" : datadb.relatedPerson.value,
                };
                appendTempFamilyHistoryT(model);
                model = {};
            }
        }
              
        // insuranceField
        if (data.insurance != null) {
            var dld = 0; model = {};
            datadb = data.insurance;
            dateField = datadb.insuranceExpirationDate;
            dateFieldResult = dateField == null ? "" : dateField.year + "/" + dateField.month + "/" + dateField.day;
            model = {
                insurer: datadb.insurer == null ? "" : datadb.insurer.value,
                insuranceBox: datadb.insuranceBox== null ? "" : datadb.insuranceBox.value,
                insuranceBookletSerialNumber: datadb.insuranceBookletSerialNumber == null ? "" : datadb.insuranceBookletSerialNumber,
                insuranceExpirationDate: dateFieldResult,
                insuredNumber: datadb.insuredNumber == null ? "" : datadb.insuredNumber,
                sHEBAD: datadb.sHEBAD == null ? "" : datadb.sHEBAD.id,
            };
            appendTempinsuranceField(model);
            model = {};
        }

        // pastMedicalHistoryField
        if (data.pastMedicalHistory != null) {
            cunter = 0; model = {};
            lineLength = data.pastMedicalHistory.length;
            for (var dld = 0; dld < lineLength; dld++) {
                datadb = data.pastMedicalHistory[dld];
                dateField = datadb.dateofOnset;
                dateFieldResult = dateField == null ? "" : dateField.year + "/" + dateField.month + "/" + dateField.day;
                model = {
                    rowNumber: ++cunter,
                    conditionId: datadb.condition == null ? "" : datadb.condition.value,
                    description: datadb.description == null ? "" : datadb.description,
                    dateOfOnSet: dateFieldResult,
                    onsetDurationToPresent: datadb.onsetDurationToPresent == null ? "" : datadb.onsetDurationToPresent.magnitude,
                    onsetDurationToPresentUnitId: datadb.onsetDurationToPresent == null ? "" : datadb.onsetDurationToPresent.unit,
                };
                appendTempMedicalHistoryT(model);
                model = {};
            }
        }

        // referralInfo
        if (data.referralInfo != null) {
            var dld = 0; model = {};
            datadb = data.referralInfo;
            dateField = datadb.referredDate;
            dateFieldResult = dateField == null ? "" : dateField.year + "/" + dateField.month + "/" + dateField.day;
            timeField = datadb.referredTime;
            timeFieldResult = timeField == null ? "" : timeField.hour + ":" + timeField.minute;

            var referredProvider, firsName = "", lastName = "", role = "", specialty = "";
            referredProvider = datadb.referredProvider;
            if (referredProvider != null) {
                firsName = referredProvider.firstName == null ? "" : referredProvider.firstName;
                lastName = referredProvider.lastName == null ? "" : referredProvider.lastName;
                role = referredProvider.role == null ? "" : referredProvider.role == null ? "" : referredProvider.role.value == null ? "" : referredProvider.role.value;
                specialty = referredProvider.specialty == null ? "" : referredProvider.specialty == null ? "" : referredProvider.specialty.value == null ? "" : referredProvider.specialty.value;
            }

            model = {
                description: datadb.description == null ? "" : datadb.description,
                referredDateTime: dateFieldResult + " " + timeFieldResult,
                referredFacility: datadb.referredFacility == null ? "" : datadb.referredFacility.name,
                referredProvider: firsName + " " + lastName,
                role: role,
                specialty: specialty,
                referredReason: datadb.referredReason == null ? "" : datadb.referredReason.value,
                referredType: datadb.referredType == null ? "" : datadb.referredType.value,
            };
            appendTempreferralInfo(model);
            model = {};
        }
      
        // bloodPerssureT
        if (data.bloodPressure != null) {
            cunter = 0; model = {};
            lineLength = data.bloodPressure.length;
            for (var dld = 0; dld < lineLength; dld++) {
                datadb = data.bloodPressure[dld];
                dateField = datadb.observationDate;
                dateFieldResult = dateField == null ? "" : dateField.year + "/" + dateField.month+ "/" + dateField.day;
                timeField = datadb.observationTime;
                timeFieldResult = timeField == null ? "" : timeField.hour + ":" + timeField.minute;
                model = {
                    rowNumber: ++cunter,
                    positionId: datadb.position == null ? "" : datadb.position.value,
                    diastolicBP: datadb.diastolicBP == null ? "" : datadb.diastolicBP.magnitude + "-" + datadb.diastolicBP.unit,
                    systolicBP: datadb.systolicBP == null ? "" : datadb.systolicBP.magnitude + "-" + datadb.systolicBP.unit,
                    observationDateTime: dateFieldResult + " " + timeFieldResult,
                };
                appendTempBloodPerssureT(model);
                model = {};
            }
        }
               
        // heightWeightT
        if (data.heightWeight != null) {
            cunter = 0; model = {};
            lineLength = data.heightWeight.length;
            for (var dld = 0; dld < lineLength; dld++) {
                datadb = data.heightWeight[dld];
                dateField = datadb.observationDate;
                dateFieldResult = dateField == null ? "" : dateField.year + "/" + dateField.month + "/" + dateField.day;
                timeField = datadb.observationTime;
                timeFieldResult = timeField == null ? "" : timeField.hour + ":" + timeField.minute;
                model = {
                    rowNumber: ++cunter,
                    height: datadb.height == null ? "" : datadb.height.magnitude + "-" + datadb.height.unit,
                    weight: datadb.weight == null ? "" : datadb.weight.magnitude + "-" + datadb.weight.unit,
                    observationDateTime: dateFieldResult + " " + timeFieldResult,
                };
                appendTempHeightWeightT(model);
                model = {};
            }
        }
        // pulseT
        if (data.pulse != null) {
            cunter = 0; model = {};
            lineLength = data.pulse.length;
            for (var dld = 0; dld < lineLength; dld++) {
                datadb = data.pulse[dld];
                dateField = datadb.observationDate;
                dateFieldResult = dateField == null ? "" : dateField.year + "/" + dateField.month + "/" + dateField.day;
                timeField = datadb.observationTime;
                timeFieldResult = timeField == null ? "" : timeField.hour + ":" + timeField.minute;
                model = {
                    rowNumber: ++cunter,
                    clinicalDescription: datadb.clinicalDescription == null ? "" : datadb.clinicalDescription,
                    isPulsePresent: datadb.is_Pulse_Present == null ? "" : datadb.is_Pulse_Present == true ? "بلی" : "خیر",
                    methodId: datadb.method == null ? "" : datadb.method.value,
                    positionId: datadb.position == null ? "" : datadb.position.value,
                    pulseRate: datadb.pulseRate == null ? "" : datadb.pulseRate.magnitude + "-" + datadb.pulseRate.unit,
                    observationDateTime: dateFieldResult + " " + timeFieldResult,
                    characterId: datadb.character == null ? "" : datadb.character.value,
                    locationOfMeasurmentId: datadb.locationOfMeasurement == null ? "" : datadb.locationOfMeasurement.value,

                    regularityId: datadb.regularity == null ? "" : datadb.regularity.value,
                    volumeId: datadb.volume == null ? "" : datadb.volume.value
                };
                appendTempPulseT(model);
                model = {};
            }
        }

        // waistHipT
        if (data.waist_HipVO != null) {
            cunter = 0; model = {};
            lineLength = data.waist_HipVO.length;
            for (var dld = 0; dld < lineLength; dld++) {
                datadb = data.waist_HipVO[dld];
                dateField = datadb.observationDate;
                dateFieldResult = dateField == null ? "" : dateField.year + "/" + dateField.month + "/" + dateField.day;
                timeField = datadb.observationTime;
                timeFieldResult = timeField == null ? "" : timeField.hour + ":" + timeField.minute;
                model = {
                    rowNumber: ++cunter,
                    hipCircumference: datadb.hipCircumference == null ? "" : datadb.hipCircumference.magnitude + "-" + datadb.hipCircumference.unit,
                    waistCircumference: datadb.waistCircumference == null ? "" : datadb.waistCircumference.magnitude + "-" + datadb.waistCircumference.unit,
                    observationDateTime: dateFieldResult + " " + timeFieldResult,
                };
                appendTempWaistHipT(model);
                model = {};
            }
        }

        // vitalSingsT
        if (data.vitalSignsVO != null) {
            cunter = 0; model = {};
            lineLength = data.vitalSignsVO.length;
            for (var dld = 0; dld < lineLength; dld++) {
                datadb = data.vitalSignsVO[dld];
                dateField = datadb.observationDate;
                dateFieldResult = dateField == null ? "" : dateField.year + "/" + dateField.month + "/" + dateField.day;
                timeField = datadb.observationTime;
                timeFieldResult = timeField == null ? "" : timeField.hour + ":" + timeField.minute;
                model = {
                    rowNumber: ++cunter,
                    pulseRate: datadb.pulseRate == null ? "" : datadb.pulseRate.magnitude + "-" + datadb.pulseRate.unit,
                    respiratoryRate: datadb.respiratoryRate == null ? "" : datadb.respiratoryRate.magnitude + "-" + datadb.respiratoryRate.unit,
                    temperature: datadb.temperature == null ? "" : datadb.temperature.magnitude + "-" + datadb.temperature.unit,
                    temperatureLocationId: datadb.temperatureLocation == null ? "" : datadb.temperatureLocation.value,
                    observationDateTime: dateFieldResult + " " + timeFieldResult,
                };
                appendTempVitalSingsT(model);
                model = {};
            }
        }
    } 
    await loadingAsync(false, "getreferral");
    referralHID = $("#referralId").val();
};

// ADMISSIONREFER GetReferAdmissionRefer START *************

var appendTempVitalSingsT = (data) => {
    var dataOutput = "";
    if (data) {
        var emptyRow = $("#tempvitalSingsT").find("#emptyRow");

        if (emptyRow.length > 0)
            $("#tempvitalSingsT").html("");

        dataOutput = `<tr id="vsT_${data.rowNumber}">
                          <td>${data.rowNumber}</td>
                          <td>${data.pulseRate}</td>
                          <td>${data.respiratoryRate}</td>
                          <td>${data.temperature}</td>
                          <td>${data.temperatureLocationId}</td>
                          <td>${data.observationDateTime}</td>
                     </tr>`

        $(dataOutput).appendTo("#tempvitalSingsT");
    }
}

var appendTempWaistHipT = (data) => {
    var dataOutput = "";
    if (data) {
        var emptyRow = $("#tempwaistHipT").find("#emptyRow");

        if (emptyRow.length > 0)
            $("#tempwaistHipT").html("");

        dataOutput = `<tr id="whT_${data.rowNumber}">
                          <td>${data.rowNumber}</td>
                          <td>${data.hipCircumference}</td>
                          <td>${data.waistCircumference}</td>
                          <td>${data.observationDateTime}</td>
                     </tr>`

        $(dataOutput).appendTo("#tempwaistHipT");
    }
}

var appendTempPulseT = (data) => {
    var dataOutput = "";
    if (data) {
        var emptyRow = $("#temppulseT").find("#emptyRow");

        if (emptyRow.length > 0)
            $("#temppulseT").html("");

        dataOutput = `<tr id="puT_${data.rowNumber}">
                          <td>${data.rowNumber}</td>                         
                          <td>${data.pulseRate}</td>
                          <td>${data.isPulsePresent}</td>
                          <td>${data.methodId}</td>
                          <td>${data.locationOfMeasurmentId}</td>
                          <td>${data.characterId}</td>
                          <td>${data.volumeId}</td>
                          <td>${data.regularityId}</td>
                          <td>${data.observationDateTime}</td>
                          <td>${data.clinicalDescription}</td>
                     </tr>`

        $(dataOutput).appendTo("#temppulseT");
    }
}

var appendTempHeightWeightT = (data) => {
    var dataOutput = "";
    if (data) {
        var emptyRow = $("#tempheightWeightT").find("#emptyRow");

        if (emptyRow.length > 0)
            $("#tempheightWeightT").html("");

        dataOutput = `<tr id="hwT_${data.rowNumber}">
                          <td>${data.rowNumber}</td>
                          <td>${data.height}</td>
                          <td>${data.weight}</td>
                          <td>${data.observationDateTime}</td>
                     </tr>`

        $(dataOutput).appendTo("#tempheightWeightT");
    }
}

var appendTempBloodPerssureT = (data) => {
    var dataOutput = "";
    if (data) {
        var emptyRow = $("#tempbloodPerssureT").find("#emptyRow");

        if (emptyRow.length > 0)
            $("#tempbloodPerssureT").html("");

        dataOutput = `<tr id="bpT_${data.rowNumber}">
                          <td>${data.rowNumber}</td>
                          <td>${data.positionId}</td>
                          <td>${data.diastolicBP}</td>
                          <td>${data.systolicBP}</td>
                          <td>${data.observationDateTime}</td>
                     </tr>`

        $(dataOutput).appendTo("#tempbloodPerssureT");
    }
}

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

var appendTempAbuseHistoryT = (data) => {
    var dataOutput = "";
    if (data) {
        var emptyRow = $("#tempabuseHistoryField").find("#emptyRow");

        if (emptyRow.length > 0)
            $("#tempabuseHistoryField").html("");

        dataOutput = `<tr id="ahT_${data.rowNumber}">
                    <td>${data.rowNumber}</td>
                    <td>${data.substanceTypeId}</td>
                    <td>${data.amountOfAbuseDosage}</td>
                    <td>${data.amountOfAbuseUnitId}</td>
                    <td>${data.abuseDuration}</td>
                    <td>${data.abuseDurationUnitId}</td>
                    <td>${data.startDate}</td>
                    <td>${data.quitDate}</td>
                     </tr>`

        $(dataOutput).appendTo("#tempabuseHistoryField");
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

var appendTempFamilyHistoryT = (data) => {
    var dataOutput = "";
    if (data) {
        var emptyRow = $("#tempfamilyHistoryField").find("#emptyRow");

        if (emptyRow.length > 0)
            $("#tempfamilyHistoryField").html("");

        dataOutput = `<tr id="fhT_${data.rowNumber}">
                    <td>${data.rowNumber}</td>
                    <td>${data.relatedPersonId}</td>
                    <td>${data.conditionId}</td>
                    <td>${data.isCauseofDeath}</td>
                    <td>${data.description}</td>
                     </tr>`

        $(dataOutput).appendTo("#tempfamilyHistoryField");
    }
}

var appendTempCareActionT = (data) => {
    var dataOutput = "";
    if (data) {
        var emptyRow = $("#tempcareActionField").find("#emptyRow");

        if (emptyRow.length > 0)
            $("#tempcareActionField").html("");

        dataOutput = `<tr id="caT_${data.rowNumber}">
                          <td>${data.rowNumber}</td>
                          <td>${data.actionNameId}</td>
                          <td>${data.startDateTime}</td>
                          <td>${data.endDateTime}</td>
                          <td>${data.timeTaken}</td>
                          <td>${data.timeTakenUnitId}</td>
                          <td>${data.actionDescription}</td>
                     </tr>`

        $(dataOutput).appendTo("#tempcareActionField");
    }
}

var appendTempClinicFindingT = (data) => {
    var dataOutput = "";
    if (data) {
        var emptyRow = $("#tempclinicalFindingField").find("#emptyRow");

        if (emptyRow.length > 0)
            $("#tempclinicalFindingField").html("");

        dataOutput = `<tr id="cfT_${data.rowNumber}">
                    <td>${data.rowNumber}</td>
                    <td>${data.ageOfOnset}</td>
                    <td>${data.onSetDateTime}</td>
                    <td>${data.onsetDurationToPresent}</td>
                    <td>${data.onsetDurationToPresentUnitId}</td>
                    <td>${data.findingId}</td>
                    <td>${data.severityId}</td>
                    <td>${data.nillSignificant}</td>
                    <td>${data.description}</td>
                     </tr>`

        $(dataOutput).appendTo("#tempclinicalFindingField");
    }
}

var appendTempAdverseReactionT = (data) => {
    var dataOutput = "";
    if (data) {
        var emptyRow = $("#tempadverseReactionField").find("#emptyRow");

        if (emptyRow.length > 0)
            $("#tempadverseReactionField").html("");

        dataOutput = `<tr id="cfT_${data.rowNumber}">
                    <td>${data.rowNumber}</td>
                    <td>${data.causativeAgentCategoryId}</td>
                    <td>${data.causativeAgentId}</td>
                    <td>${data.reactionCategoryId}</td>
                    <td>${data.reactionId}</td>
                    <td>${data.diagnosisSeverityId}</td>
                    <td>${data.description}</td>
                     </tr>`

        $(dataOutput).appendTo("#tempadverseReactionField");
    }
}

var appendTempDiagnosisT = (diag) => {
    var diagOutput = "";
    if (diag) {

        var emptyRow = $("#tempdiagnosisField").find("#emptyRow");

        if (emptyRow.length > 0)
            $("#tempdiagnosisField").html("");

        diagOutput = `<tr id="dgT_${diag.rowNumber}">
                          <td>${diag.rowNumber}</td>
                          <td>${diag.statusId}</td>
                          <td>${diag.diagnosisResonId}</td>
                          <td>${diag.serverityId}</td>
                          <td>${diag.diagnosisDateTimePersian}</td>
                          <td>${diag.comment}</td>
                     </tr>`

        $(diagOutput).appendTo("#tempdiagnosisField");
    }
}

var appendTempDrugHistoryT = (data) => {
    var dataOutput = "";
    if (data) {
        var emptyRow = $("#tempdrugHistoryField").find("#emptyRow");

        if (emptyRow.length > 0)
            $("#tempdrugHistoryField").html("");

        dataOutput = `<tr id="dhT_${data.rowNumber}">
                          <td>${data.rowNumber}</td>
                          <td>${data.medicationId}</td>
                          <td>${data.routeId}</td>
                     </tr>`

        $(dataOutput).appendTo("#tempdrugHistoryField");
    }
}

var appendTempDrugOrderedT = (data) => {
    var dataOutput = "";
    if (data) {
        var emptyRow = $("#tempdrugOrderedField").find("#emptyRow");

        if (emptyRow.length > 0)
            $("#tempdrugOrderedField").html("");

        dataOutput = `<tr id="doT_${data.rowNumber}">
                          <td>${data.rowNumber}</td>
                          <td>${data.productId} - ${data.productName}</td>
                          <td>${data.drugGenericName}</td>
                          <td>${data.routeId}</td>
                          <td>${data.frequencyId}</td>
                          <td>${data.dosage}</td>
                          <td>${data.dosageUnitId}</td>
                          <td>${data.longTerm}</td>
                          <td>${data.longTermUnitId}</td>
                          <td>${data.qty}</td>
                          <td>${data.administrationDateTime}</td>
                          <td>${data.description}</td>
                     </tr>`

        $(dataOutput).appendTo("#tempdrugOrderedField");
    }
}

var appendTempGetRefer = (data) => {
    var dataOutput = "";
    if (data) {
        var emptyRow = $("#tempGetRefer").find("#emptyRow");

        if (emptyRow.length > 0)
            $("#tempGetRefer").html("");

        dataOutput = `<tr id="pr">
                          <td>${data.personFirsLastName}</td>
                          <td>${data.gender}</td>
                          <td>${data.mobileNumber}</td>
                          <td>${data.fullAddress}</td>
                          <td>${data.birthDate}</td>
                          <td>${data.nationality}</td>
                          <td>${data.nationalCode}</td>
                          <td>${data.maritalStatus}</td>
                     </tr>`

        $(dataOutput).appendTo("#tempGetRefer");
    }
}

var appendTempMedicalHistoryT = (data) => {
    var dataOutput = "";
    if (data) {
        var emptyRow = $("#temppastMedicalHistoryField").find("#emptyRow");

        if (emptyRow.length > 0)
            $("#temppastMedicalHistoryField").html("");

        dataOutput = `<tr id="mhT_${data.rowNumber}">
                          <td>${data.rowNumber}</td>
                          <td>${data.conditionId}</td>
                          <td>${data.dateOfOnSet}</td>
                          <td>${data.onsetDurationToPresent}</td>
                          <td>${data.onsetDurationToPresentUnitId}</td>
                          <td>${data.description}</td>
                     </tr>`

        $(dataOutput).appendTo("#temppastMedicalHistoryField");
    }
}

// ADMISSIONREFER GetReferAdmissionRefer  END *************


// ADMISSIONREFER AbuseHistory START *************

$("#addabuseHistory").on("click", function () {

    var validate = FormAbuseHistory.validate();
    validateSelect2(FormAbuseHistory);
    if (!validate) return;
    var start = $("#startDate").val();
    var end = $("#quitDate").val();
    var resComparison = comparisonStartEnd(start, end);

    ////if (resComparison) {
    ////    var msgError = alertify.warning("تاریخ شروع نمیتواند از تاریخ پایان بیشتر باشد");
    ////    msgError.delay(alertify_delay);
    ////    return;
    ////}

    var notEmptyElm = checkEmptyElement("abuseHistoryForm");
    if (notEmptyElm) {
        if (typeSaveAbuseHistory == "INS") {
            var rowNumberAbuseHistory = arr_TempAbuseHistory.length + 1;
            modelAppendAbuseHistory(rowNumberAbuseHistory, typeSaveAbuseHistory)
        }
        else {
            var rowNumberAbuseHistory = currentAbuseHistoryRowNumber;
            modelAppendAbuseHistory(rowNumberAbuseHistory, typeSaveAbuseHistory);
        }
    }
    else {
        var msgError = alertify.warning("لطفاً آیتمی را وارد نمائید.");
        msgError.delay(alertify_delay);
        return;
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
            arr_TempAbuseHistory[i].abuseDurationUnitDescription = data.abuseDurationUnitDescription;
            arr_TempAbuseHistory[i].amountOfAbuseDosage = data.amountOfAbuseDosage;
            arr_TempAbuseHistory[i].amountOfAbuseUnitId = data.amountOfAbuseUnitId;
            arr_TempAbuseHistory[i].amountOfAbuseUnitName = data.amountOfAbuseUnitName;
            arr_TempAbuseHistory[i].amountOfAbuseUnitDescription = data.amountOfAbuseUnitDescription;
            arr_TempAbuseHistory[i].quitDatePersian = data.quitDatePersian;
            arr_TempAbuseHistory[i].startDatePersian = data.startDatePersian;
            arr_TempAbuseHistory[i].substanceTypeId = data.substanceTypeId;
            arr_TempAbuseHistory[i].substanceTypeName = data.substanceTypeName;

            $(`#ah_${data.rowNumber} td:eq(0)`).text(`${data.rowNumber}`);
            $(`#ah_${data.rowNumber} td:eq(1)`).text(`${data.substanceTypeId != 0 ? data.substanceTypeName : ""}`);
            $(`#ah_${data.rowNumber} td:eq(2)`).text(`${data.amountOfAbuseDosage}`);
            $(`#ah_${data.rowNumber} td:eq(3)`).text(`${data.amountOfAbuseUnitId != 0 ? data.amountOfAbuseUnitDescription : ""}`);
            $(`#ah_${data.rowNumber} td:eq(4)`).text(`${data.abuseDuration}`);
            $(`#ah_${data.rowNumber} td:eq(5)`).text(`${data.abuseDurationUnitId != 0 ? `${data.abuseDurationUnitDescription}` : ""}`);
            $(`#ah_${data.rowNumber} td:eq(6)`).text(`${data.startDatePersian}`);
            $(`#ah_${data.rowNumber} td:eq(7)`).text(`${data.quitDatePersian}`);

        }
        resetAdmissionReferForm("abuseHistory");
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

// ADMISSIONREFER AbuseHistory END *************

// ADMISSIONREFER FamilyHistory START *************

$("#addfamilyHistory").on("click", function () {

    var validate = FormFamilyHistory.validate();
    validateSelect2(FormFamilyHistory);
    if (!validate) return;

    var notEmptyElm = checkEmptyElement("familyHistoryForm");
    if (notEmptyElm) {
        if (typeSaveFamilyHistory == "INS") {
            var rowNumberFamilyHistory = arr_TempFamilyHistory.length + 1;
            modelAppendFamilyHistory(rowNumberFamilyHistory, typeSaveFamilyHistory)
        }
        else {
            var rowNumberFamilyHistory = currentFamilyHistoryRowNumber;
            modelAppendFamilyHistory(rowNumberFamilyHistory, typeSaveFamilyHistory);
        }
    }
    else {
        var msgError = alertify.warning("لطفاً آیتمی را وارد نمائید.");
        msgError.delay(alertify_delay);
        return;
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
        resetAdmissionReferForm("familyHistory");
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

// ADMISSIONREFER FamilyHistory END *************

// ADMISSIONREFER careAction START *************

$("#addcareAction").on("click", function () {

    var validate = FormCareAction.validate();
    validateSelect2(FormCareAction);
    if (!validate) return;
    var start = $("#startDateTime").val();
    var end = $("#endDateTime").val();
    var resComparison = comparisonStartEnd(start, end);

    if (resComparison) {
        var msgError = alertify.warning("تاریخ شروع نمیتواند از تاریخ پایان بیشتر باشد");
        msgError.delay(alertify_delay);
        return;
    }

    var notEmptyElm = checkEmptyElement("careActionForm");
    if (notEmptyElm) {
        if (typeSaveCareAction == "INS") {
            var rowNumberCareAction = arr_TempCareAction.length + 1;
            modelAppendCareAction(rowNumberCareAction, typeSaveCareAction)
        }
        else {
            var rowNumberCareAction = currentCareActionRowNumber;
            modelAppendCareAction(rowNumberCareAction, typeSaveCareAction);
        }
    }
    else {
        var msgError = alertify.warning("لطفاً آیتمی را وارد نمائید.");
        msgError.delay(alertify_delay);
        return;
    }
});

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
        timeTakenUnitDescription: $("#timeTakenUnitId").select2('data').length > 0 ? $("#timeTakenUnitId").select2('data')[0].text : "",
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
                          <td id="operationca_${data.rowNumber}">
                              <button type="button" id="deleteca_${data.rowNumber}" onclick="removeFromTempCareAction(${data.rowNumber})" class="btn maroon_outline" data-original-title="حذف سطر" style="margin-left:7px">
                                   <i class="fa fa-trash"></i>
                              </button>
                              <button type="button" id="Editca_${data.rowNumber}" onclick="EditFromTempCareAction(${data.rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                   <i class="fa fa-pen"></i>
                              </button>
                          </td>
                     </tr>`

            $(dataOutput).appendTo("#tempcareAction");
        }
        else {
            var i = arr_TempCareAction.findIndex(x => x.rowNumber == data.rowNumber);
            arr_TempCareAction[i].headerId = data.headerId;
            arr_TempCareAction[i].rowNumber = data.rowNumber;
            arr_TempCareAction[i].actionDescription = data.actionDescription;
            arr_TempCareAction[i].actionNameId = data.actionNameId;
            arr_TempCareAction[i].actionName = data.actionName;
            arr_TempCareAction[i].startDateTimePersian = data.startDateTimePersian;
            arr_TempCareAction[i].endDateTimePersian = data.endDateTimePersian;
            arr_TempCareAction[i].timeTaken = data.timeTaken;
            arr_TempCareAction[i].timeTakenUnitId = data.timeTakenUnitId;
            arr_TempCareAction[i].timeTakenUnitName = data.timeTakenUnitName;
            arr_TempCareAction[i].timeTakenUnitDescription = data.timeTakenUnitDescription;
            $(`#ca_${data.rowNumber} td:eq(0)`).text(`${data.rowNumber}`);
            $(`#ca_${data.rowNumber} td:eq(1)`).text(`${data.actionNameId != 0 ? `${data.actionName}` : ""}`);
            $(`#ca_${data.rowNumber} td:eq(2)`).text(`${data.startDateTimePersian}`);
            $(`#ca_${data.rowNumber} td:eq(3)`).text(`${data.endDateTimePersian}`);
            $(`#ca_${data.rowNumber} td:eq(4)`).text(`${data.timeTaken}`);
            $(`#ca_${data.rowNumber} td:eq(5)`).text(`${data.timeTakenUnitId != 0 ? `${data.timeTakenUnitDescription}` : ""}`);
            $(`#ca_${data.rowNumber} td:eq(6)`).text(`${data.actionDescription}`);

        }
        resetAdmissionReferForm("careAction");
    }
}

var EditFromTempCareAction = (rowNumber) => {

    $("#tempcareAction tr").removeClass("highlight");
    $(`#ca_${rowNumber}`).addClass("highlight");
    var detailCareAction = "";

    var arr_TempCareActionE = arr_TempCareAction.filter(line => line.rowNumber === rowNumber)[0];

    $("#actionDescription").val(arr_TempCareActionE.actionDescription);

    $("#actionNameId").val(arr_TempCareActionE.actionNameId);
    detailCareAction = new Option(`${arr_TempCareActionE.actionName}`, arr_TempCareActionE.actionNameId, true, true);
    $("#actionNameId").append(detailCareAction).trigger('change');
    detailCareAction = "";

    $("#startDateTime").val(arr_TempCareActionE.startDateTimePersian);
    $("#endDateTime").val(arr_TempCareActionE.endDateTimePersian);
    $("#timeTaken").val(arr_TempCareActionE.timeTaken);

    $("#timeTakenUnitId").val(arr_TempCareActionE.timeTakenUnitId).trigger('change');


    $("#actionNameId").select2("focus");
    typeSaveCareAction = "UPD";
    currentCareActionRowNumber = arr_TempCareActionE.rowNumber;
}

$("#canceledcareAction").on("click", function () {

    $("#careActionBox .select2").val("").trigger("change");
    $("#careActionBox input.form-control").val("");
    $("#actionNameId").select2("focus");
    typeSaveCareAction = "INS";
});

var removeFromTempCareAction = (rowNumber) => {
    currentCareActionRowNumber = rowNumber;

    $("#tempcareAction tr").removeClass("highlight");
    $(`#ca_${rowNumber}`).addClass("highlight");

    var removeRowResult = removeRowFromArray(arr_TempCareAction, "rowNumber", rowNumber);

    if (removeRowResult.statusMessage == "removed")
        $(`#ca_${rowNumber}`).remove();

    if (arr_TempCareAction.length == 0) {
        var colspan = $("#tempcareActionList thead th").length;
        $("#tempcareAction").html(emptyRow.replace("thlength", colspan));
    }

    rebuildCareActionRow();
}

function rebuildCareActionRow() {
    var arr = arr_TempCareAction;

    var table = "tempcareAction";

    if (arr.length === 0)
        return;

    for (var b = 0; b < arr.length; b++) {
        var newRowNumber = b + 1;
        arr[b].rowNumber = newRowNumber;

        $(`#${table} tr`)[b].children[0].innerText = arr[b].rowNumber;
        $(`#${table} tr`)[b].setAttribute("id", `ca_${arr[b].rowNumber}`);
        $(`#${table} tr`)[b].children[0].innerText = arr[b].rowNumber;

        if ($(`#${table} tr`)[b].children[7].innerHTML !== "") {


            $(`#${table} tr`)[b].children[7].innerHTML = `<button type="button" onclick="removeFromTempCareAction(${arr[b].rowNumber})" class="btn maroon_outline" data-toggle="tooltip" data-placement="bottom" title="حذف سطر" style="margin-left:7px">
                                                                     <i class="fa fa-trash"></i>
                                                           </button>
                                                           <button type="button" onclick="EditFromTempCareAction(${arr[b].rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                                                <i class="fa fa-pen"></i>
                                                           </button>
                                                           `;
        }

    }
    arr_TempCareAction = arr;
}

// ADMISSIONREFER careAction END *************

// ADMISSIONREFER clinicFinding START *************

$("#addclinicFinding").on("click", function () {

    var validate = FormClinicFinding.validate();
    validateSelect2(FormClinicFinding);
    if (!validate) return;

    var notEmptyElm = checkEmptyElement("clinicFindingForm");
    if (notEmptyElm) {
        if (typeSaveClinicFinding == "INS") {
            var rowNumberClinicFinding = arr_TempClinicFinding.length + 1;
            modelAppendClinicFinding(rowNumberClinicFinding, typeSaveClinicFinding)
        }
        else {
            var rowNumberClinicFinding = currentClinicFindingRowNumber;
            modelAppendClinicFinding(rowNumberClinicFinding, typeSaveClinicFinding);
        }
    }
    else {
        var msgError = alertify.warning("لطفاً آیتمی را وارد نمائید.");
        msgError.delay(alertify_delay);
        return;
    }
});

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
        onsetDurationToPresentUnitDescription: $("#onsetDurationToPresentUnitId_clinicFinding").select2('data').length > 0 ? $("#onsetDurationToPresentUnitId_clinicFinding").select2('data')[0].text : "",
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
                          <td id="operationcf_${data.rowNumber}">
                              <button type="button" id="deletecf_${data.rowNumber}" onclick="removeFromTempClinicFinding(${data.rowNumber})" class="btn maroon_outline" data-original-title="حذف سطر" style="margin-left:7px">
                                   <i class="fa fa-trash"></i>
                              </button>
                              <button type="button" id="Editcf_${data.rowNumber}" onclick="EditFromTempClinicFinding(${data.rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                   <i class="fa fa-pen"></i>
                              </button>
                          </td>
                     </tr>`

            $(dataOutput).appendTo("#tempclinicFinding");
        }
        else {
            var i = arr_TempClinicFinding.findIndex(x => x.rowNumber == data.rowNumber);
            arr_TempClinicFinding[i].headerId = data.headerId;
            arr_TempClinicFinding[i].rowNumber = data.rowNumber;
            arr_TempClinicFinding[i].ageOfOnset = data.ageOfOnset;
            arr_TempClinicFinding[i].findingId = data.findingId;
            arr_TempClinicFinding[i].findingName = data.findingName;
            arr_TempClinicFinding[i].nillSignificant = data.nillSignificant;
            arr_TempClinicFinding[i].onsetDurationToPresent = data.onsetDurationToPresent;
            arr_TempClinicFinding[i].onsetDurationToPresentUnitId = data.onsetDurationToPresentUnitId;
            arr_TempClinicFinding[i].onsetDurationToPresentUnitName = data.onsetDurationToPresentUnitName;
            arr_TempClinicFinding[i].onsetDurationToPresentUnitDescription = data.onsetDurationToPresentUnitDescription;
            arr_TempClinicFinding[i].severityId = data.severityId;
            arr_TempClinicFinding[i].severityName = data.severityName;
            arr_TempClinicFinding[i].onSetDateTimePersian = data.onSetDateTimePersian;
            arr_TempClinicFinding[i].description = data.description;

            $(`#cf_${data.rowNumber} td:eq(0)`).text(`${data.rowNumber}`);
            $(`#cf_${data.rowNumber} td:eq(1)`).text(`${data.ageOfOnset}`);
            $(`#cf_${data.rowNumber} td:eq(2)`).text(`${data.onSetDateTimePersian}`);
            $(`#cf_${data.rowNumber} td:eq(3)`).text(`${data.onsetDurationToPresent}`);
            $(`#cf_${data.rowNumber} td:eq(4)`).text(`${data.onsetDurationToPresentUnitId != 0 ? `${data.onsetDurationToPresentUnitDescription}` : ""}`);
            $(`#cf_${data.rowNumber} td:eq(5)`).text(`${data.findingId != 0 ? `${data.findingName}` : ""}`);
            $(`#cf_${data.rowNumber} td:eq(6)`).text(`${data.severityId != -1 ? `${data.severityName}` : ""}`);
            $(`#cf_${data.rowNumber} td:eq(7)`).text(`${data.nillSignificant ? "بلی" : "خیر"}`);
            $(`#cf_${data.rowNumber} td:eq(8)`).text(`${data.description}`);
        }
        resetAdmissionReferForm("clinicFinding");
    }
}

var EditFromTempClinicFinding = (rowNumber) => {

    $("#tempclinicFinding tr").removeClass("highlight");
    $(`#cf_${rowNumber}`).addClass("highlight");
    var detailClinicFinding = "";

    var arr_TempClinicFindingE = arr_TempClinicFinding.filter(line => line.rowNumber === rowNumber)[0];

    $("#ageOfOnset").val(arr_TempClinicFindingE.ageOfOnset);

    $("#findingId").val(arr_TempClinicFindingE.findingId);
    detailClinicFinding = new Option(`${arr_TempClinicFindingE.findingName}`, arr_TempClinicFindingE.findingId, true, true);
    $("#findingId").append(detailClinicFinding).trigger('change');
    detailClinicFinding = "";

    var elm = $(`#${'nillSignificant'}`);
    var switchValue = elm.attr("switch-value").split(',');
    if (arr_TempClinicFindingE.nillSignificant == true) {
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
    $(`#nillSignificant`).blur();

    $("#onsetDurationToPresent_clinicFinding").val(arr_TempClinicFindingE.onsetDurationToPresent);

    $("#onsetDurationToPresentUnitId_clinicFinding").val(arr_TempClinicFindingE.onsetDurationToPresentUnitId).trigger('change');

    $("#severityId").val(arr_TempClinicFindingE.severityId).trigger('change');

    $("#onSetDateTime").val(arr_TempClinicFindingE.onSetDateTimePersian);
    $("#description_clinicFinding").val(arr_TempClinicFindingE.description);

    $("#ageOfOnset").focus();
    typeSaveClinicFinding = "UPD";
    currentClinicFindingRowNumber = arr_TempClinicFindingE.rowNumber;
}

$("#canceledclinicFinding").on("click", function () {

    $("#clinicFindingBox .select2").val("").trigger("change");
    $("#clinicFindingBox input.form-control").val("");
    $("#clinicFindingBox .funkyradio input:checkbox").prop("checked", false).trigger("change");
    $("#ageOfOnset").focus();
    typeSaveClinicFinding = "INS";
});

var removeFromTempClinicFinding = (rowNumber) => {
    currentClinicFindingRowNumber = rowNumber;

    $("#tempclinicFinding tr").removeClass("highlight");
    $(`#cf_${rowNumber}`).addClass("highlight");

    var removeRowResult = removeRowFromArray(arr_TempClinicFinding, "rowNumber", rowNumber);

    if (removeRowResult.statusMessage == "removed")
        $(`#cf_${rowNumber}`).remove();

    if (arr_TempClinicFinding.length == 0) {
        var colspan = $("#tempclinicFindingList thead th").length;
        $("#tempclinicFinding").html(emptyRow.replace("thlength", colspan));
    }

    rebuildClinicFindingRow();
}

function rebuildClinicFindingRow() {
    var arr = arr_TempClinicFinding;

    var table = "tempclinicFinding";

    if (arr.length === 0)
        return;

    for (var b = 0; b < arr.length; b++) {
        var newRowNumber = b + 1;
        arr[b].rowNumber = newRowNumber;

        $(`#${table} tr`)[b].children[0].innerText = arr[b].rowNumber;
        $(`#${table} tr`)[b].setAttribute("id", `cf_${arr[b].rowNumber}`);
        $(`#${table} tr`)[b].children[0].innerText = arr[b].rowNumber;

        if ($(`#${table} tr`)[b].children[9].innerHTML !== "") {


            $(`#${table} tr`)[b].children[9].innerHTML = `<button type="button" onclick="removeFromTempClinicFinding(${arr[b].rowNumber})" class="btn maroon_outline" data-toggle="tooltip" data-placement="bottom" title="حذف سطر" style="margin-left:7px">
                                                                     <i class="fa fa-trash"></i>
                                                           </button>
                                                           <button type="button" onclick="EditFromTempClinicFinding(${arr[b].rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                                                <i class="fa fa-pen"></i>
                                                           </button>
                                                           `;
        }

    }
    arr_TempClinicFinding = arr;
}

// ADMISSIONREFER clinicFinding END *************

// ADMISSIONREFER drugHistory START *************

$("#adddrugHistory").on("click", function () {

    var validate = FormDrugHistory.validate();
    validateSelect2(FormDrugHistory);
    if (!validate) return;

    var notEmptyElm = checkEmptyElement("drugHistoryForm");
    if (notEmptyElm) {
        if (typeSaveDrugHistory == "INS") {
            var rowNumberDrugHistory = arr_TempDrugHistory.length + 1;
            modelAppendDrugHistory(rowNumberDrugHistory, typeSaveDrugHistory)
        }
        else {
            var rowNumberDrugHistory = currentDrugHistoryRowNumber;
            modelAppendDrugHistory(rowNumberDrugHistory, typeSaveDrugHistory);
        }
    }
    else {
        var msgError = alertify.warning("لطفاً آیتمی را وارد نمائید.");
        msgError.delay(alertify_delay);
        return;
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
        resetAdmissionReferForm("drugHistory");
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

// ADMISSIONREFER drugHistory END *************

// ADMISSIONREFER drugOrdered START *************

$("#adddrugOrdered").on("click", function () {

    var validate = FormDrugOrdered.validate();
    validateSelect2(FormDrugOrdered);
    if (!validate) return;

    var notEmptyElm = checkEmptyElement("drugOrderedForm");
    if (notEmptyElm) {
        if (typeSaveDrugOrdered == "INS") {
            var rowNumberDrugOrdered = arr_TempDrugOrdered.length + 1;
            modelAppendDrugOrdered(rowNumberDrugOrdered, typeSaveDrugOrdered)
        }
        else {
            var rowNumberDrugOrdered = currentDrugOrderedRowNumber;
            modelAppendDrugOrdered(rowNumberDrugOrdered, typeSaveDrugOrdered);
        }
    }
    else {
        var msgError = alertify.warning("لطفاً آیتمی را وارد نمائید.");
        msgError.delay(alertify_delay);
        return;
    }
});

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
        resetAdmissionReferForm("drugOrdered");
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
    detailDrugOrdered = new Option(`${arr_TempDrugOrderedE.longTermUnitName}`, arr_TempDrugOrderedE.longTermUnitId, true, true);
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

        if ($(`#${table} tr`)[b].children[12].innerHTML !== "") {


            $(`#${table} tr`)[b].children[12].innerHTML = `<button type="button" onclick="removeFromTempDrugOrdered(${arr[b].rowNumber})" class="btn maroon_outline" data-toggle="tooltip" data-placement="bottom" title="حذف سطر" style="margin-left:7px">
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

// ADMISSIONREFER DrugOrdered END *************

// ADMISSIONREFER medicalHistory START *************

$("#addmedicalHistory").on("click", function () {

    var validate = FormMedicalHistory.validate();
    validateSelect2(FormMedicalHistory);
    if (!validate) return;

    var notEmptyElm = true;// checkEmptyElement("heightWeightForm");
    if (notEmptyElm) {
        if (typeSaveMedicalHistory == "INS") {
            var rowNumberMedicalHistory = arr_TempMedicalHistory.length + 1;
            modelAppendMedicalHistory(rowNumberMedicalHistory, typeSaveMedicalHistory)
        }
        else {
            var rowNumberMedicalHistory = currentMedicalHistoryRowNumber;
            modelAppendMedicalHistory(rowNumberMedicalHistory, typeSaveMedicalHistory);
        }
    }
    else {
        var msgError = alertify.warning("لطفاً آیتمی را وارد نمائید.");
        msgError.delay(alertify_delay);
        return;
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
            arr_TempMedicalHistory[i].onsetDurationToPresentUnitDescription = data.onsetDurationToPresentUnitDescription;
            $(`#mh_${data.rowNumber} td:eq(0)`).text(`${data.rowNumber}`);
            $(`#mh_${data.rowNumber} td:eq(1)`).text(`${data.conditionId != 0 ? `${data.conditionName}` : ""}`);
            $(`#mh_${data.rowNumber} td:eq(2)`).text(`${data.dateOfOnsetPersian}`);
            $(`#mh_${data.rowNumber} td:eq(3)`).text(`${data.onsetDurationToPresent}`);
            $(`#mh_${data.rowNumber} td:eq(4)`).text(`${data.onsetDurationToPresentUnitId != 0 ? `${data.onsetDurationToPresentUnitDescription}` : ""}`);
            $(`#mh_${data.rowNumber} td:eq(5)`).text(`${data.description}`);
        }
        resetAdmissionReferForm("medicalHistory");
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

// ADMISSIONREFER medicalHistory END *************

// ADMISSIONREFER Diagnosis Start *************

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
    $("#diagnosisDateTime").val("");

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
            arr_TempDiagnosis[i].diagnosisDateTimePersian = diag.diagnosisDateTimePersian;
            arr_TempDiagnosis[i].comment = diag.comment;

            $(`#dg_${diag.rowNumber} td:eq(0)`).text(`${diag.rowNumber}`);
            $(`#dg_${diag.rowNumber} td:eq(1)`).text(`${diag.statusId != 0 ? `${diag.statusName}` : ""}`);
            $(`#dg_${diag.rowNumber} td:eq(2)`).text(`${diag.diagnosisResonId != 0 ? `${diag.diagnosisResonName}` : ""}`);
            $(`#dg_${diag.rowNumber} td:eq(3)`).text(`${diag.serverityId != -1 ? `${diag.serverityName}` : ""}`);
            $(`#dg_${diag.rowNumber} td:eq(4)`).text(`${diag.diagnosisDateTimePersian}`);
            $(`#dg_${diag.rowNumber} td:eq(5)`).text(`${diag.comment}`);
        }
    }
    resetAdmissionReferForm("diag");


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
    $("#diagnosisDateTime").val(arr_TempDiagE.diagnosisDateTimePersian);

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

function resetAdmissionReferForm(typeBox) {

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
    else if (typeBox == "careAction") {
        $("#careActionBox .select2").val("").trigger("change");
        $("#careActionBox input.form-control").val("");
        $("#actionNameId").select2("focus");
        typeSaveCareAction = "INS";
    }
    else if (typeBox == "clinicFinding") {
        $("#clinicFindingBox .select2").val("").trigger("change");
        $("#clinicFindingBox input.form-control").val("");
        $("#clinicFindingBox .funkyradio input:checkbox").prop("checked", false).trigger("change");
        $("#ageOfOnset").focus();
        typeSaveClinicFinding = "INS";
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
        $("#diagnosisDateTime").val("");
        typeSaveDiag = "INS";
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

function resetFormAdmissionRefer() {
    alertify.confirm('بازنشانی', "ایا ااطمینان دارید؟",
        function () {
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
            $("#tempbloodPerssureT").html(fillEmptyRow(5));
            $("#tempcareActionField").html(fillEmptyRow(7));
            $("#tempclinicalFindingField").html(fillEmptyRow(9));
            $("#tempdrugHistoryField").html(fillEmptyRow(3));
            $("#tempdrugOrderedField").html(fillEmptyRow(12));
            $("#tempheightWeightT").html(fillEmptyRow(4));
            $("#temppastMedicalHistoryField").html(fillEmptyRow(6));
            $("#tempinsuranceField").html(fillEmptyRow(6));
            $("#tempfollowupPlanField").html(fillEmptyRow(6));
            $("#temppulseT").html(fillEmptyRow(7));
            $("#tempvitalSingsT").html(fillEmptyRow(5));
            $("#tempwaistHipT").html(fillEmptyRow(4));
            $("#tempdiagnosisField").html(fillEmptyRow(5));
            $("#tempreferralInfo").html(fillEmptyRow(8));
            $("#tempabuseHistory").html(fillEmptyRow(9));
            $("#tempfamilyHistory").html(fillEmptyRow(6));
            $("#tempcareAction").html(fillEmptyRow(8));
            $("#tempclinicFinding").html(fillEmptyRow(10));
            $("#tempdrugHistory").html(fillEmptyRow(4));
            $("#tempdrugOrdered").html(fillEmptyRow(13));
            $("#tempmedicalHistory").html(fillEmptyRow(7));
            $("#tempDiag").html(fillEmptyRow(6));

            $("#tempGetRefer").html("");
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

            $("#abuseHistoryBox .select2").val("").trigger("change");
            $("#abuseHistoryBox input.form-control").val("");

            $("#familyHistoryBox .select2").val("").trigger("change");
            $("#familyHistoryBox input.form-control").val("");
            $("#familyHistoryBox .funkyradio input:checkbox").prop("checked", false).trigger("change");

            $("#bloodPerssureBox .select2").val("").trigger("change");
            $("#bloodPerssureBox input.form-control").val("");

            $("#careActionBox .select2").val("").trigger("change");
            $("#careActionBox input.form-control").val("");

            $("#clinicFindingBox .select2").val("").trigger("change");
            $("#clinicFindingBox input.form-control").val("");
            $("#clinicFindingBox .funkyradio input:checkbox").prop("checked", false).trigger("change");

            $("#drugHistoryBox .select2").val("").trigger("change");
            $("#drugHistoryBox input.form-control").val("");

            $("#drugOrderedBox .select2").val("").trigger("change");
            $("#drugOrderedBox input.form-control").val("");

            $("#medicalHistoryBox .select2").val("").trigger("change");
            $("#medicalHistoryBox input.form-control").val("");

            $("#diagBox .select2").val("").trigger("change");
            $("#diagBox .funkyradio input:checkbox").prop("checked", false).trigger("change");
            $("#diagBox input.form-control").val("");

        },
        function () {
            return;
        }
    ).set('labels', { ok: 'بله', cancel: 'خیر' });
}

$("#list_adm").on("click", function () {

    navigation_item_click('/MC/AdmissionRefer', 'لیست نظام ارجاع')
});

function checkEmptyElement(formName) {
    let inputs = $(`#${formName} .form-control`);
    //let inputs = $("#" + formName + " .form-control");
    let inputLength = inputs.length;

    for (var i = 0; i < inputLength; i++)
        if (+$(inputs[i]).val() != 0)
            return true;

    return false;
}