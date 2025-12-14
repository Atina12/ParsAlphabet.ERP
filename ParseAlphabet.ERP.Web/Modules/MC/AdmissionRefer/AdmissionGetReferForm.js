var viewData_controllername = "AdmissionReferApi",

    
    
    
    
    viewData_get_conditionId = `${viewData_baseUrl_MC}/${viewData_controllername}/getconditioniddropdown`,
    viewData_get_relatedPersonId = `${viewData_baseUrl_MC}/${viewData_controllername}/getrelatedpersoniddropdown`,
    viewData_get_positionId = `${viewData_baseUrl_MC}/${viewData_controllername}/getpositioniddropdown`,
    viewData_get_actionNameId = `${viewData_baseUrl_MC}/${viewData_controllername}/getactionnameiddropdown`,
    viewData_get_timeTakenUnitId = `${viewData_baseUrl_MC}/${viewData_controllername}/gettimetakenunitiddropdown`,
    viewData_get_findingId = `${viewData_baseUrl_MC}/${viewData_controllername}/getfindingdropdown`,
    viewData_get_onsetDurationToPresentUnitId_clinicFinding = `${viewData_baseUrl_MC}/${viewData_controllername}/getonsetdurationtopresentunitidclinicaldropdown`,
    viewData_get_severityId = `${viewData_baseUrl_MC}/${viewData_controllername}/getseverityiddropdown`,
    viewData_get_pulseCharacter = `${viewData_baseUrl_MC}/${viewData_controllername}/getpulsecharacterdropdown`,
    viewData_get_locationOfMeasurment = `${viewData_baseUrl_MC}/${viewData_controllername}/getlocationofmeasurmentdropdown`,
    viewData_get_PulseVolume = `${viewData_baseUrl_MC}/${viewData_controllername}/getpulsevolumedropdown`,
    viewData_get_PulseRegularity = `${viewData_baseUrl_MC}/${viewData_controllername}/getpulseregularitydropdown`,
    viewData_get_temperatureLocation = `${viewData_baseUrl_MC}/${viewData_controllername}/gettemperaturelocationdropdown`,
    viewData_get_erxId = `${viewData_baseUrl_MC}/${viewData_controllername}/geterxiddropdown`,
    viewData_get_routeId = `${viewData_baseUrl_MC}/${viewData_controllername}/getrouteiddropdown`,
    viewData_get_dosageUnitId = `${viewData_baseUrl_MC}/${viewData_controllername}/getdosageunitiddropdown`,
    viewData_get_frequencyId = `${viewData_baseUrl_MC}/${viewData_controllername}/getfrequencyiddropdown`,
    viewData_get_longTermUnitId = `${viewData_baseUrl_MC}/${viewData_controllername}/getlongtermunitiddropdown`,
    viewData_get_onsetDurationToPresentUnitId_medicalHistory = `${viewData_baseUrl_MC}/${viewData_controllername}/getonsetdurationtopresentunitidmedicaldropdown`,
    viewData_get_methodId = `${viewData_baseUrl_MC}/${viewData_controllername}/getmethodiddropdown`,
    viewData_get_lateralityId = `${viewData_baseUrl_MC}/${viewData_controllername}/getlateralityiddropdown`,
    //viewData_get_SearchAdmission = `${viewData_baseUrl_MC}/AdmissionApi/searchinbound`,
    viewData_get_SearchAdmission = `${viewData_baseUrl_MC}/AdmissionApi/searchinbound`,/*searchinboundadmissionreffer*/
    viewData_get_AdmissionReferGet = `${viewData_baseUrl_MC}/${viewData_controllername}/get`,
    viewData_get_AdmissionReferFeedbackGet = `${viewData_baseUrl_MC}/${viewData_controllername}/getfeedbackpatientrecord`,
    viewData_get_AdmissionGetDiagnosis = `${viewData_baseUrl_MC}/AdmissionApi/getdiagnosis`,
    viewData_get_AdmissionSearch = `${viewData_baseUrl_MC}/AdmissionApi/search`,
    viewData_get_StatusId = `${viewData_baseUrl_MC}/PrescriptionApi/diagnosisstatusid`,
    viewData_get_DiagnosisReasonId = `${viewData_baseUrl_MC}/PrescriptionApi/diagnosisreasonid`,
    viewData_get_Serverity = `${viewData_baseUrl_MC}/PrescriptionApi/serverityid`,
    emptyRow = `<tr id="emptyRow"><td colspan="thlength" class="text-center">سطری وجود ندارد</td></tr>`,
    viewData_save_AdmissionRefer = `${viewData_baseUrl_MC}/${viewData_controllername}/save`,
    admissionIdentity = 0, admissionReferId = +$("#admissionReferId").val(), referralHID = "",
    currentAbuseHistoryRowNumber = 0, currentFamilyHistoryRowNumber = 0, currentBloodPerssureRowNumber = 0, currentCareActionRowNumber = 0, currentAdverseReactionRowNumber = 0,
    currentClinicFindingRowNumber = 0, currentDrugHistoryRowNumber = 0, currentDrugOrderedRowNumber = 0, currentHeightWeightRowNumber = 0, currentMedicalHistoryRowNumber = 0,
    currentPulseRowNumber = 0, currentVitalSingsRowNumber = 0, currentWaistHipRowNumber = 0, currentDiagRowNumber = 0,
    typeSaveAbuseHistory = "INS", typeSaveFamilyHistory = "INS", typeSaveBloodPerssure = "INS", typeSaveCareAction = "INS",
    typeSaveClinicFinding = "INS", typeSaveAdverseReaction = "INS", typeSaveDrugHistory = "INS", typeSaveDrugOrdered = "INS", typeSaveHeightWeight = "INS", typeSaveMedicalHistory = "INS",
    typeSavePulse = "INS", typeSaveVitalSings = "INS", typeSaveWaistHip = "INS", typeSaveDiag = "INS",
    arr_TempAbuseHistory = [], arr_TempFamilyHistory = [], arr_TempBloodPerssure = [], arr_TempCareAction = [], arr_TempClinicFinding = [], arr_TempAdverseReaction = [],
    arr_TempDrugHistory = [], arr_TempDrugOrdered = [], arr_TempHeightWeight = [], arr_TempMedicalHistory = [], arr_TempPulse = [], arr_TempVitalSings = [],
    arr_TempWaistHip = [], arr_TempDiagnosis = [], referringDoctorId = 0, admitingDoctorId = 0, speciality = "", mscId = 0,
    FormAbuseHistory = $('#abuseHistoryForm').parsley(), FormFamilyHistory = $('#familyHistoryForm').parsley(), FormAdverseReaction = $("#adverseReactionForm").parsley(),
    FormBloodPerssure = $('#bloodPerssureForm').parsley(), FormCareAction = $('#careActionForm').parsley(), FormClinicFinding = $('#clinicFindingForm').parsley(),
    FormDrugHistory = $('#drugHistoryForm').parsley(), FormDrugOrdered = $('#drugOrderedForm').parsley(), FormHeightWeight = $('#heightWeightForm').parsley(),
    FormMedicalHistory = $('#medicalHistoryForm').parsley(), FormPulse = $('#pulseForm').parsley(), FormVitalSings = $('#vitalSingsForm').parsley(),
    FormWaistHip = $('#waistHipForm').parsley(), diagForm = $('#diagForm').parsley(), formRefer = $('#referForm').parsley();

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

    // await disableSaveButtonAsync(true);

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

    for (var i = 0; i < arr_TempDiagnosis.length; i++)
        arr_TempDiagnosis[i].admissionId = admissionIdentity;

    var model = {
        id: admissionReferId,
        admissionId: admissionIdentity,
        admissionReferTypeId: 1,
        relatedHID: referralHID,
        lifeCycleStateId: 0,
        referringDoctorId: referringDoctorId,
        iSQueriable: $('#iSQueriable').prop("checked"),
        referredReasonId: +$('#referredReasonId').val(),
        referredTypeId: +$('#referredTypeId').val(),
        referredDescription: $('#referralDescription').val(),
        referredDateTimePersian: $('#referredDateTime').val(),
        admitingDoctorId: $('#admitingDoctorId').val(),
        admitingDoctorMscId: mscId,
        AdmitingDoctorSpecialityId: $('#specialityId').val(),
        admissionReferAbuseHistoryLines: arr_TempAbuseHistory,
        admissionReferalFamilyHisotryLines: arr_TempFamilyHistory,
        admissionReferBloodPressureLines: arr_TempBloodPerssure,
        admissionReferCareActionLines: arr_TempCareAction,
        admissionReferClinicFindingLines: arr_TempClinicFinding,
        admissionReferAdverseReactionLines: arr_TempAdverseReaction,
        admissionReferDrugHistoryLines: arr_TempDrugHistory,
        admissionReferDrugOrderedLines: arr_TempDrugOrdered,
        admissionReferHeightWeightLines: arr_TempHeightWeight,
        admissionReferMedicalHistoryLines: arr_TempMedicalHistory,
        admissionReferPulseLines: arr_TempPulse,
        admissionReferVitalSignsLines: arr_TempVitalSings,
        admissionReferWaistHipLines: arr_TempWaistHip,
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
    if (arr_TempAbuseHistory.length === 0 && arr_TempFamilyHistory.length === 0 && arr_TempBloodPerssure.length === 0 && arr_TempCareAction.length === 0 && arr_TempClinicFinding.length === 0 &&
        arr_TempDrugHistory.length === 0 && arr_TempDrugOrdered.length === 0 && arr_TempHeightWeight.length === 0 && arr_TempMedicalHistory.length === 0 && arr_TempPulse.length === 0 && arr_TempVitalSings.length === 0 &&
        arr_TempWaistHip.length === 0) {
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


    fill_select2(`${viewData_baseUrl_MC}/${viewData_controllername}/getreferredreasoniddropdown/`, "referredReasonId", true, 0, false);
    fill_select2(`${viewData_baseUrl_MC}/${viewData_controllername}/getreferredtypeiddropdown`, "referredTypeId", true, 0, false);
    fill_select2(`${viewData_baseUrl_MC}/${viewData_controllername}/getabusedurationunitiddropdown`, "abuseDurationUnitId", true, 0, false);
    fill_select2(`${viewData_baseUrl_MC}/${viewData_controllername}/getamountofabuseunitiddropdown`, "amountOfAbuseUnitId", true, 0, false);
    fill_select2(`${viewData_baseUrl_MC}/${viewData_controllername}/getsubstancetypeiddropdown`, "substanceTypeId", true, 0, false);
    fill_select2(`${viewData_baseUrl_MC}/${viewData_controllername}/getcausativeagentcategoryiddropdown`, "causativeAgentCategoryId", true, 0, false);
    fill_select2(`${viewData_baseUrl_MC}/${viewData_controllername}/getcausativeagentiddropdown`, "causativeAgentId", true, 0, true);
    fill_select2(`${viewData_baseUrl_MC}/${viewData_controllername}/getdiagnosisseverityiddropdown`, "diagnosisSeverityId", true);
    fill_select2(`${viewData_baseUrl_MC}/${viewData_controllername}/getreactioncategoryiddropdown`, "reactionCategoryId", true, 0, false);



    fill_select2(`${viewData_baseUrl_MC}/${viewData_controllername}/getreactioniddropdown`, "reactionId", true, 0, false);

    fill_select2(viewData_get_conditionId, "conditionId_familyHistory", true, 0, true);
    fill_select2(viewData_get_relatedPersonId, "relatedPersonId", true, 0, false);

    fill_select2(viewData_get_positionId, "positionId_bloodPerssure", true, 0, false);

    fill_select2(viewData_get_actionNameId, "actionNameId", true, 0, true);
    fill_select2(viewData_get_timeTakenUnitId, "timeTakenUnitId", true, 0, false);

    fill_select2(viewData_get_findingId, "findingId", true, 0, true);
    fill_select2(viewData_get_onsetDurationToPresentUnitId_clinicFinding, "onsetDurationToPresentUnitId_clinicFinding", true, 0, false);
    fill_select2(viewData_get_severityId, "severityId", true, 0, false);

    fill_select2(viewData_get_erxId, "medicationId", true, 0, true);
    fill_select2(viewData_get_routeId, "routeId_drugHistory", true, 0, false);

    fill_select2(viewData_get_dosageUnitId, "dosageUnitId", true, 0, false);
    fill_select2(viewData_get_frequencyId, "frequencyId", true, 0, false);
    fill_select2(viewData_get_longTermUnitId, "longTermUnitId", true, 0, false);
    fill_select2(viewData_get_erxId, "productId", true, 0, true);
    fill_select2(viewData_get_routeId, "routeId_drugOrdered", true, 0, false);

    fill_select2(viewData_get_conditionId, "conditionId_medicalHistory", true, 0, true);
    fill_select2(viewData_get_onsetDurationToPresentUnitId_medicalHistory, "onsetDurationToPresentUnitId_medicalHistory", true, 0, false);

    fill_select2(viewData_get_methodId, "methodId", true, 0, false);
    //fill_select2(viewData_get_positionId, "positionId_pulse", true, 0, true);

    fill_select2(viewData_get_StatusId, "statusId", true, 0, false);
    fill_select2(viewData_get_DiagnosisReasonId, "diagnosisResonId", true, 0, true, 5);
    fill_select2(viewData_get_Serverity, "serverityId", true, 0, false);

    fill_select2(viewData_get_temperatureLocation, "temperatureLocationId", true, 0, false);
    fill_select2(viewData_get_locationOfMeasurment, "locationOfMeasurment", true, 0, false);
    fill_select2(viewData_get_pulseCharacter, "characterId", true, 0, false);
    fill_select2(viewData_get_PulseRegularity, "regularityId", true, 0, false);
    fill_select2(viewData_get_PulseVolume, "volumeId", true, 0, false);

    fill_select2(`${viewData_baseUrl_MC}/SpecialityApi/getdropdown`, "specialityId", true, "1", true);
    fill_select2(`${viewData_baseUrl_MC}/referringDoctorApi/getdropdown`, "admitingDoctorId", true, 1, true);

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

$("#admitingDoctorId").on("change", function () {
    mscId = $(this).text().split('-')[2];
});

function setAdmissionInfo_otherConfig(data) {
    admissionIdentity = +data.admissionId;
    referringDoctorId = data.attenderId;
    checkPatientNationalCode = data.patientNationalCode;
    getDiagnosis(+data.admissionId);
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
            //("#tempDiag").html("");
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

function getAdmissionReferData(admId) {

    $.ajax({
        url: viewData_get_AdmissionReferGet,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(admId),
        success: function (data) {

            fillAdmissionRefer(data);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_get_AdmissionReferGet);
        }
    });
};

var fillAdmissionRefer = (data) => {
    if (data !== null) {
        $("#userFullName").val(`${data.userId} - ${data.userFullName}`);
        $("#AdmissionReferBox").removeClass("displaynone");
        $("#AdmissionSentRerferStatus").val(`${data.sentStatus ? 'ارسال ارجاع انجام شده برای نمایش باز خورد روی دکمه   "دریافت بازخورد"    کلیک نمایید' : 'ارسال ارجاع انجام نشده'}`);
        if (data.sentStatus) {
            $("#getFeedBackReferbox").removeClass("displaynone");
            $("#AdmissionSentRerferStatus").css("background-color", "green");
        }


        referralHID = data.relatedHID;
        //  speciality = data.relatedHID;
        admitingDoctorId = data.admitingDoctorId;

        $("#referralId").val(referralHID);
        // $("#admitingDoctorId").val(admitingDoctorId);

        var admitingSpecial = new Option(`${data.admitingSpecialtyName}`, data.admitingSpecialtyId, true, true);

        $("#specialityId").append(admitingSpecial).trigger("change");

        var admitingData = new Option(`${data.admitingDoctorName}`, admitingDoctorId, true, true);
        $("#admitingDoctorId").append(admitingData).trigger("change");

        /*, data.referralHID*/
        //setAdmissionInfo(data.admissionId, data.patientId, data.patientFullName, data.patientNationalCode, data.basicInsurerName,
        //    data.insuranceBoxName, data.compInsuranceBoxName, data.admissionHID, data.insurExpDatePersian);

        fillAdmission(data)

        admissionIdentity = data.admissionId;
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
        // AdverseReaction
        if (data.admissionReferAdverseReactionLines != null) {
            LineLength = data.admissionReferAdverseReactionLines.length;
            for (var dld = 0; dld < LineLength; dld++) {
                datadb = data.admissionReferAdverseReactionLines[dld];

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
        // bloodPerssure
        if (data.admissionReferBloodPressureLines != null) {
            LineLength = data.admissionReferBloodPressureLines.length;
            for (var dld = 0; dld < LineLength; dld++) {
                datadb = data.admissionReferBloodPressureLines[dld];

                var model = {
                    headerId: datadb.headerId,
                    rowNumber: datadb.rowNumber,
                    positionId: datadb.positionId,
                    positionName: datadb.positionId + " - " + datadb.positionName,
                    diastolicBP: datadb.diastolicBP,
                    systolicBP: datadb.systolicBP,
                    observationDateTimePersian: datadb.observationDateTimePersian,
                };

                arr_TempBloodPerssure.push(model);
                appendTempBloodPerssure(model);
                model = {};
            }
        }
        // bloodPerssure
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
                    timeTakenUnitDescription: datadb.timeTakenUnitDescription
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
        // heightWeight
        if (data.admissionReferHeightWeightLines != null) {
            LineLength = data.admissionReferHeightWeightLines.length;
            for (var dld = 0; dld < LineLength; dld++) {
                datadb = data.admissionReferHeightWeightLines[dld];

                var model = {
                    headerId: datadb.headerId,
                    rowNumber: datadb.rowNumber,
                    height: datadb.height,
                    weight: datadb.weight,
                    observationDateTimePersian: datadb.observationDateTimePersian,
                };

                arr_TempHeightWeight.push(model);
                appendTempHeightWeight(model);
                model = {};
            }
        }
        // heightWeight
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
                    ageOfOnset: datadb.ageOfOnset,
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
        // pulse
        if (data.admissionReferPulseLines != null) {
            LineLength = data.admissionReferPulseLines.length;
            for (var dld = 0; dld < LineLength; dld++) {
                datadb = data.admissionReferPulseLines[dld];

                var model = {
                    headerId: datadb.headerId,
                    rowNumber: datadb.rowNumber,
                    clinicalDescription: datadb.clinicalDescription,
                    isPulsePresent: datadb.isPulsePresent,
                    methodId: datadb.methodId,
                    methodName: datadb.methodId + " - " + datadb.methodName,
                    positionId: datadb.positionId,
                    positionName: datadb.positionId + " - " + datadb.positionName,
                    pulseRate: datadb.pulseRate,
                    observationDateTimePersian: datadb.observationDateTimePersian,
                    locationOfMeasurmentId: datadb.locationOfMeasurmentId,
                    locationOfMeasurmentName: datadb.locationOfMeasurmentId + " - " + datadb.locationOfMeasurmentName,
                    characterId: datadb.characterId,
                    characterName: datadb.characterId + " - " + datadb.characterName,
                    regularityId: datadb.regularityId,
                    regularityName: datadb.regularityId + " - " + datadb.regularityName,
                    volumeId: datadb.volumeId,
                    volumeName: datadb.volumeId + " - " + datadb.volumeName
                };

                arr_TempPulse.push(model);
                appendTempPulse(model);
                model = {};
            }
        }
        // pulse
        // vitalSings
        if (data.admissionReferVitalSignsLines != null) {
            LineLength = data.admissionReferVitalSignsLines.length;
            for (var dld = 0; dld < LineLength; dld++) {
                datadb = data.admissionReferVitalSignsLines[dld];

                var model = {
                    headerId: datadb.headerId,
                    rowNumber: datadb.rowNumber,
                    pulseRate: datadb.pulseRate,
                    respiratoryRate: datadb.respiratoryRate,
                    temperature: datadb.temperature,
                    observationDateTimePersian: datadb.observationDateTimePersian,
                    temperatureLocationId: datadb.temperatureLocationId,
                    temperatureLocationName: datadb.temperatureLocationId + " - " + datadb.temperatureLocationName
                };

                arr_TempVitalSings.push(model);
                appendTempVitalSings(model);
                model = {};
            }
        }
        // vitalSings
        // waistHip
        if (data.admissionReferWaistHipLines != null) {
            LineLength = data.admissionReferWaistHipLines.length;
            for (var dld = 0; dld < LineLength; dld++) {
                datadb = data.admissionReferWaistHipLines[dld];

                var model = {
                    headerId: datadb.headerId,
                    rowNumber: datadb.rowNumber,
                    hipCircumference: datadb.hipCircumference,
                    waistCircumference: datadb.waistCircumference,
                    observationDateTimePersian: datadb.observationDateTimePersian,
                };

                arr_TempWaistHip.push(model);
                appendTempWaistHip(model);
                model = {};
            }
        }
        // waistHip

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

    $("#referredReasonId").val(data.referredReasonId).trigger('change');
    $("#referredTypeId").val(data.referredTypeId).trigger('change');
    $("#referralDescription").val(data.referredDescription);
    $("#referredDateTime").val(data.referredCreateDatePersian + " " + data.referredCreateTime);

}

$("#getFeedBackadmissionRefer").on("click", function () {
    loadingAsync(true, "getFeedBackadmissionRefer");

    if (admissionReferId == 0) {
        loadingAsync(false, "getFeedBackadmissionRefer");
        return;
    }
    resetAdmissionReferT();
    $.ajax({
        url: viewData_get_AdmissionReferFeedbackGet,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(admissionReferId),
        success: function (data) {
            if (+data.status == 100) {
                fillAdmissionReferT(data);
            }
            else {
                var msgGetFeedBack = alertify.error(data.statusMessage);
                msgGetFeedBack.delay(alertify_delay);
                loadingAsync(false, "getFeedBackadmissionRefer");

            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_get_AdmissionReferFeedbackGet);
            loadingAsync(false, "getFeedBackadmissionRefer");
            return {
                status: -100,
                statusMessage: "عملیات با خطا مواجه شد",
                successfull: false
            };
        }
    });
});

async function loadingAsync(loading, elementId) {

    if (loading)
        $(`#${elementId} i`).addClass(`fa fa-spinner fa-spin`);
    else
        $(`#${elementId} i`).removeClass("fa fa-spinner fa-spin")
}

var resetAdmissionReferT = async () => {
    $("#tempGetfeedBackRefer").html("");
    $("#tempabuseHistoryField").html(fillEmptyRow(8));
    $("#tempadmissionField").html(fillEmptyRow(5));
    $("#tempcareActionField").html(fillEmptyRow(7));
    $("#tempclinicalFindingField").html(fillEmptyRow(9));
    $("#tempdiagnosisField").html(fillEmptyRow(5));
    $("#tempdrugHistoryField").html(fillEmptyRow(3));
    $("#tempdrugOrderedField").html(fillEmptyRow(12));
    $("#tempfamilyHistoryField").html(fillEmptyRow(5));
    $("#tempfollowupPlanField").html(fillEmptyRow(5));
    $("#tempinsuranceField").html(fillEmptyRow(6));
    $("#temppastMedicalHistoryField").html(fillEmptyRow(6));
    $("#iSQueriableT").prop("checked", false).trigger("change");
}

var fillAdmissionReferT = (res) => {
    var response = res.data;

    var dateField, dateFieldResult, model;
    if (response !== null) {

        var composition = response.composition,
            person = response.person,
            msgID = response.msgID;


        // GetFeedbackRefer-Person
        if (person != null) {
            var dld = 0; model = {};
            dateField = person.birthDate;
            dateFieldResult = dateField == null ? "" : dateField.year + "/" + dateField.month + "/" + dateField.day;
            var personFirsName = person.firstName == null ? "" : person.firstName;
            var personLastName = person.lastName == null ? "" : person.lastName;

            model = {
                personFirsLastName: personFirsName + " " + personLastName,
                gender: person.gender == null ? "" : person.gender.value,
                mobileNumber: person.mobileNumber == null ? "" : person.mobileNumber,
                fullAddress: person.fullAddress == null ? "" : person.fullAddress,
                birthDate: dateFieldResult,
                nationality: person.nationality == null ? "" : person.nationality.value,
                nationalCode: person.nationalCode == null ? "" : person.nationalCode,
                maritalStatus: person.maritalStatus == null ? "" : person.maritalStatus.value,
            };
            appendTempGetfeedBackRefer(model);
            model = {};
        }

        // GetFeedbackRefer-Composition Tab
        if (composition !== null) {
            var datadb, lineLength, cunter, timeField, timeFieldResult, sDateField, sDateFieldResult, sTimeField, sTimeFieldResult, eDateField, eDateFieldResult, eTimeField, eTimeFieldResult;

            // abuseHistoryField
            if (composition.abuseHistory != null) {
                cunter = 0; model = {};
                lineLength = composition.abuseHistory.length;
                for (var dld = 0; dld < lineLength; dld++) {
                    datadb = composition.abuseHistory[dld];
                    sDateField = datadb.startDate;
                    sDateFieldResult = sDateField == null ? "" : sDateField.year + "/" + sDateField.month + "/" + sDateField.day;
                    eDateField = datadb.quitDate;
                    eDateFieldResult = eDateField == null ? "" : eDateField.year + "/" + eDateField.month + "/" + eDateField.day
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
            if (composition.admission != null) {
                var dld = 0; model = {};
                datadb = composition.admission;
                dateField = datadb.admissionDate;
                dateFieldResult = dateField == null ? "" : dateField.year + "/" + dateField.month + "/" + dateField.day;
                timeField = datadb.admissionTime;
                timeFieldResult = timeField == null ? "" : timeField.hour + ":" + timeField.minute;
                model = {
                    admissionDateTime: dateFieldResult + " " + timeFieldResult,
                    admissionType: datadb.admissionType == null ? "" : datadb.admissionType.value,
                    institute: datadb.institute == null ? "" : datadb.institute.name,
                    referringDoctor: datadb.referringDoctor == null ? "" : datadb.referringDoctor.firstName + " " + datadb.referringDoctor.lastName,
                    attendingDoctor: datadb.attendingDoctor == null ? "" : datadb.attendingDoctor.firstName + " " + datadb.attendingDoctor.lastName,
                };
                appendTempadmissionField(model);
                model = {};
            }

            // careActionField
            if (composition.careAction != null) {
                cunter = 0; model = {};
                lineLength = composition.careAction.length;
                for (var dld = 0; dld < lineLength; dld++) {
                    datadb = composition.careAction[dld];
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
            if (composition.clinicalFinding != null) {
                cunter = 0; model = {};
                lineLength = composition.clinicalFinding.length;
                for (var dld = 0; dld < lineLength; dld++) {
                    datadb = composition.clinicalFinding[dld];
                    dateField = datadb.dateofOnset;
                    dateFieldResult = dateField == null ? "" : dateField.year + "/" + dateField.month + "/" + dateField.day;
                    timeField = datadb.timeofOnset;
                    timeFieldResult = timeField == null ? "" : timeField.hour + ":" + timeField.minute;
                    model = {
                        rowNumber: ++cunter,
                        ageOfOnset: datadb.ageOfOnset == null ? "" : datadb.ageOfOnset.magnitude + "-" + datadb.ageOfOnset.unit,
                        findingId: datadb.finding == null ? "" : datadb.finding.value,
                        nillSignificant: datadb.nillSignificant == null ? "" : datadb.nillSignificant == true ? "بلی" : "خیر",
                        onsetDurationToPresent: datadb.onsetDuration2Present == null ? "" : datadb.onsetDuration2Present.magnitude,
                        onsetDurationToPresentUnitId: datadb.onsetDuration2Present == null ? "" : datadb.onsetDuration2Present.unit,
                        severityId: datadb.severity == null ? "" : datadb.severity.symbol == null ? "" : datadb.severity.symbol.value,
                        onSetDateTime: dateFieldResult + " " + timeFieldResult,
                        description: datadb.description == null ? "" : datadb.description,
                    };
                    appendTempClinicFindingT(model);
                    model = {};
                }
            }

            // diagnosisField
            if (composition.diagnosis != null) {
                cunter = 0; model = {};
                lineLength = composition.diagnosis.length;
                for (var dld = 0; dld < lineLength; dld++) {
                    datadb = composition.diagnosis[dld];
                    dateField = datadb.diagnosisDate;
                    dateFieldResult = dateField == null ? "" : dateField.year + "/" + dateField.month + "/" + dateField.day;
                    timeField = datadb.diagnosisTime;
                    timeFieldResult = timeField == null ? "" : timeField.hour + ":" + timeField.minute;
                    model = {
                        rowNumber: ++cunter,
                        statusId: datadb.status == null ? "" : datadb.status.value,
                        diagnosisResonId: datadb.diagnosis == null ? "" : datadb.diagnosis.value,
                        serverityId: datadb.severity == null ? "" : datadb.severity.symbol == null ? "" : datadb.severity.symbol.value,
                        diagnosisDateTimePersian: dateFieldResult + " " + timeFieldResult,
                        comment: datadb.comment == null ? "" : datadb.comment,
                    };
                    appendTempDiagnosisT(model);
                    model = {};
                }
            }

            // drugHistoryField
            if (composition.drugHistory != null) {
                cunter = 0; model = {};
                lineLength = composition.drugHistory.length;
                for (var dld = 0; dld < lineLength; dld++) {
                    datadb = composition.drugHistory[dld];
                    model = {
                        rowNumber: ++cunter,
                        medicationId: datadb.medication == null ? "" : datadb.medication.value,
                        routeId: datadb.routeofadministration == null ? "" : datadb.routeofadministration.value,
                    };
                    appendTempDrugHistoryT(model);
                    model = {};
                }
            }

            // drugOrderedField
            if (composition.drugOrdered != null) {
                cunter = 0; model = {};
                lineLength = composition.drugOrdered.length;
                for (var dld = 0; dld < lineLength; dld++) {
                    datadb = composition.drugOrdered[dld];
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
                        productId: datadb.drugName == null ? "" : datadb.drugName.value,
                        routeId: datadb.route == null ? "" : datadb.route.value,
                        qty: datadb.totalNumber == null ? "" : datadb.totalNumber,
                    };
                    appendTempDrugOrderedT(model);
                    model = {};
                }
            }

            // familyHistoryField
            if (composition.familyHistory != null) {
                cunter = 0; model = {};
                lineLength = composition.familyHistory.length;
                for (var dld = 0; dld < lineLength; dld++) {
                    datadb = composition.familyHistory[dld];
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

            // followupPlanField
            if (composition.followupPlan != null) {
                var dld = 0; model = {};
                datadb = composition.followupPlan;
                dateField = datadb.nextEncounterDate;
                dateFieldResult = dateField == null ? "" : dateField.year + "/" + dateField.month + "/" + dateField.day;
                timeField = datadb.nextEncounterTime;
                timeFieldResult = timeField == null ? "" : timeField.hour + ":" + timeField.minute;
                model = {
                    type: datadb.type == null ? "" : datadb.type.value,
                    nextEncounter: datadb.nextEncounter == null ? "" : datadb.nextEncounter.magnitude,
                    nextEncounterUnit: datadb.nextEncounter == null ? "" : datadb.nextEncounter.unit,
                    nextEncounterDateTime: dateFieldResult + " " + timeFieldResult,
                    description: datadb.descriptionField == null ? "" : datadb.description,
                };
                appendTempfollowupPlanField(model);
                model = {};
            }

            // insuranceField
            if (composition.insurance != null) {
                var dld = 0; model = {};
                datadb = composition.insurance;
                dateField = datadb.insuranceExpirationDate;
                dateFieldResult = dateField == null ? "" : dateField.year + "/" + dateField.month + "/" + dateField.day;
                model = {
                    insurer: datadb.insurer == null ? "" : datadb.insurer.value,
                    insuranceBox: datadb.insuranceBox == null ? "" : datadb.insuranceBox.value,
                    insuranceBookletSerialNumber: datadb.insuranceBookletSerialNumber == null ? "" : datadb.insuranceBookletSerialNumber,
                    insuranceExpirationDate: dateFieldResult,
                    insuredNumber: datadb.insuredNumber == null ? "" : datadb.insuredNumber,
                    sHEBAD: datadb.sHEBAD == null ? "" : datadb.sHEBAD.id,
                };
                appendTempinsuranceField(model);
                model = {};
            }

            // pastMedicalHistoryField
            if (composition.pastMedicalHistory != null) {
                cunter = 0; model = {};
                lineLength = composition.pastMedicalHistory.length;
                for (var dld = 0; dld < lineLength; dld++) {
                    datadb = composition.pastMedicalHistory[dld];
                    dateField = datadb.dateofOnset;
                    dateFieldResult = dateField == null ? "" : dateField.year + "/" + dateField.month + "/" + dateField.day;
                    model = {
                        rowNumber: ++cunter,
                        conditionId: datadb.condition == null ? "" : datadb.condition.value,
                        description: datadb.description == null ? "" : datadb.description,
                        ageOfOnset: datadb.ageOfOnset == null ? "" : datadb.ageOfOnset,
                        dateOfOnSet: dateFieldResult,
                        onsetDurationToPresent: datadb.onsetDurationToPresent == null ? "" : datadb.onsetDurationToPresent.magnitude,
                        onsetDurationToPresentUnitId: datadb.onsetDurationToPresent == null ? "" : datadb.onsetDurationToPresent.unit,
                    };
                    appendTempMedicalHistoryT(model);
                    model = {};
                }
            }

        }

        // GetFeedbackRefer-MsgID
        if (msgID != null) {
            var elm = $(`#${'iSQueriableT'}`);
            var switchValue = elm.attr("switch-value").split(',');
            if (msgID.iS_Queriable != null) {
                if (msgID.iS_Queriable == true) {
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
            }
        }
    }
    loadingAsync(false, "getFeedBackadmissionRefer");
};

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

var appendTempGetfeedBackRefer = (data) => {
    var dataOutput = "";
    if (data) {
        var emptyRow = $("#tempGetfeedBackRefer").find("#emptyRow");

        if (emptyRow.length > 0)
            $("#tempGetfeedBackRefer").html("");

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

        $(dataOutput).appendTo("#tempGetfeedBackRefer");
    }
}

// ADMISSIONREFER GetFeedBackAdmissionRefer START *************

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
                          <td>${data.productId}</td>
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

var appendTempfollowupPlanField = (data) => {
    var dataOutput = "";
    if (data) {
        var emptyRow = $("#tempfollowupPlanField").find("#emptyRow");

        if (emptyRow.length > 0)
            $("#tempfollowupPlanField").html("");

        dataOutput = `<tr id="fpT">
                          <td>${data.type}</td>
                          <td>${data.nextEncounter}</td>
                          <td>${data.nextEncounterUnit}</td>
                          <td>${data.nextEncounterDateTime}</td>
                          <td>${data.description}</td>
                     </tr>`

        $(dataOutput).appendTo("#tempfollowupPlanField");
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

// ADMISSIONREFER GetFeedBackAdmissionRefer START *************

// ADMISSIONREFER AbuseHistory START *************

$("#addabuseHistory").on("click", function () {

    var validate = FormAbuseHistory.validate();
    validateSelect2(FormAbuseHistory);
    if (!validate) return;
    var start = $("#startDate").val();
    var end = $("#quitDate").val();
    var resComparison = comparisonStartEnd(start, end);

    if (end != "") {
        if (resComparison) {
            var msgError = alertify.warning("تاریخ شروع نمیتواند از تاریخ پایان بیشتر باشد");
            msgError.delay(alertify_delay);
            return;
        }
    }

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

// ADMISSIONREFER bloodPerssure START *************

$("#addbloodPerssure").on("click", function () {

    var validate = FormBloodPerssure.validate();
    validateSelect2(FormBloodPerssure);
    if (!validate) return;


    var notEmptyElm = checkEmptyElement("bloodPerssureForm");
    if (notEmptyElm) {
        if (typeSaveBloodPerssure == "INS") {
            var rowNumberBloodPerssure = arr_TempBloodPerssure.length + 1;
            modelAppendBloodPerssure(rowNumberBloodPerssure, typeSaveBloodPerssure)
        }
        else {
            var rowNumberBloodPerssure = currentBloodPerssureRowNumber;
            modelAppendBloodPerssure(rowNumberBloodPerssure, typeSaveBloodPerssure);
        }
    }
    else {
        var msgError = alertify.warning("لطفاً آیتمی را وارد نمائید.");
        msgError.delay(alertify_delay);
        return;
    }

});

function modelAppendBloodPerssure(rowNumber, typeSave) {

    var modelBloodPerssure = {
        headerId: 0,
        rowNumber: rowNumber,
        positionId: +$("#positionId_bloodPerssure").val(),
        positionName: $("#positionId_bloodPerssure").select2('data').length > 0 ? $("#positionId_bloodPerssure").select2('data')[0].text : "",
        diastolicBP: $("#diastolicBP").val(),
        systolicBP: $("#systolicBP").val(),
        observationDateTimePersian: $("#observationDateTime_bloodPerssure").val(),
    }

    if (typeSave == "INS")
        arr_TempBloodPerssure.push(modelBloodPerssure);

    appendTempBloodPerssure(modelBloodPerssure, typeSaveBloodPerssure);
    typeSaveBloodPerssure = "INS";
}

var appendTempBloodPerssure = (data, tSave = "INS") => {
    var dataOutput = "";
    if (data) {
        if (tSave == "INS") {
            var emptyRow = $("#tempbloodPerssure").find("#emptyRow");

            if (emptyRow.length > 0)
                $("#tempbloodPerssure").html("");

            dataOutput = `<tr id="bp_${data.rowNumber}">
                          <td>${data.rowNumber}</td>
                          <td>${data.positionId != 0 ? `${data.positionName}` : ""}</td>
                          <td>${data.diastolicBP}</td>
                          <td>${data.systolicBP}</td>
                          <td>${data.observationDateTimePersian}</td>
                          <td id="operationbp_${data.rowNumber}">
                              <button type="button" id="deletebp_${data.rowNumber}" onclick="removeFromTempBloodPerssure(${data.rowNumber})" class="btn maroon_outline" data-original-title="حذف سطر" style="margin-left:7px">
                                   <i class="fa fa-trash"></i>
                              </button>
                              <button type="button" id="Editbp_${data.rowNumber}" onclick="EditFromTempBloodPerssure(${data.rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                   <i class="fa fa-pen"></i>
                              </button>
                          </td>
                     </tr>`

            $(dataOutput).appendTo("#tempbloodPerssure");
        }
        else {
            var i = arr_TempBloodPerssure.findIndex(x => x.rowNumber == data.rowNumber);
            arr_TempBloodPerssure[i].headerId = data.headerId;
            arr_TempBloodPerssure[i].rowNumber = data.rowNumber;
            arr_TempBloodPerssure[i].positionId = data.positionId;
            arr_TempBloodPerssure[i].positionName = data.positionName;
            arr_TempBloodPerssure[i].diastolicBP = data.diastolicBP;
            arr_TempBloodPerssure[i].systolicBP = data.systolicBP;
            arr_TempBloodPerssure[i].observationDateTimePersian = data.observationDateTimePersian;

            $(`#bp_${data.rowNumber} td:eq(0)`).text(`${data.rowNumber}`);
            $(`#bp_${data.rowNumber} td:eq(1)`).text(`${data.positionId != 0 ? `${data.positionName}` : ""}`);
            $(`#bp_${data.rowNumber} td:eq(2)`).text(`${data.diastolicBP}`);
            $(`#bp_${data.rowNumber} td:eq(3)`).text(`${data.systolicBP}`);
            $(`#bp_${data.rowNumber} td:eq(4)`).text(`${data.observationDateTimePersian}`);

        }
        resetAdmissionReferForm("bloodPerssure");
    }
}

var EditFromTempBloodPerssure = (rowNumber) => {

    $("#tempbloodPerssure tr").removeClass("highlight");
    $(`#bp_${rowNumber}`).addClass("highlight");

    var arr_TempBloodPerssureE = arr_TempBloodPerssure.filter(line => line.rowNumber === rowNumber)[0];

    $("#positionId_bloodPerssure").val(arr_TempBloodPerssureE.positionId).trigger('change');

    $("#diastolicBP").val(arr_TempBloodPerssureE.diastolicBP);

    $("#systolicBP").val(arr_TempBloodPerssureE.systolicBP);
    $("#observationDateTime_bloodPerssure").val(arr_TempBloodPerssureE.observationDateTimePersian);

    $("#positionId_bloodPerssure").select2("focus");
    typeSaveBloodPerssure = "UPD";
    currentBloodPerssureRowNumber = arr_TempBloodPerssureE.rowNumber;
}

$("#canceledbloodPerssure").on("click", function () {

    $("#bloodPerssureBox .select2").val("").trigger("change");
    $("#bloodPerssureBox input.form-control").val("");
    $("#positionId_bloodPerssure").select2("focus");
    typeSaveBloodPerssure = "INS";
});

var removeFromTempBloodPerssure = (rowNumber) => {
    currentBloodPerssureRowNumber = rowNumber;

    $("#tempbloodPerssure tr").removeClass("highlight");
    $(`#bp_${rowNumber}`).addClass("highlight");

    var removeRowResult = removeRowFromArray(arr_TempBloodPerssure, "rowNumber", rowNumber);

    if (removeRowResult.statusMessage == "removed")
        $(`#bp_${rowNumber}`).remove();

    if (arr_TempBloodPerssure.length == 0) {
        var colspan = $("#tempbloodPerssureList thead th").length;
        $("#tempbloodPerssure").html(emptyRow.replace("thlength", colspan));
    }

    rebuildBloodPerssureRow();
}

function rebuildBloodPerssureRow() {
    var arr = arr_TempBloodPerssure;

    var table = "tempbloodPerssure";

    if (arr.length === 0)
        return;

    for (var b = 0; b < arr.length; b++) {
        var newRowNumber = b + 1;
        arr[b].rowNumber = newRowNumber;

        $(`#${table} tr`)[b].children[0].innerText = arr[b].rowNumber;
        $(`#${table} tr`)[b].setAttribute("id", `bp_${arr[b].rowNumber}`);
        $(`#${table} tr`)[b].children[0].innerText = arr[b].rowNumber;

        if ($(`#${table} tr`)[b].children[5].innerHTML !== "") {


            $(`#${table} tr`)[b].children[5].innerHTML = `<button type="button" onclick="removeFromTempBloodPerssure(${arr[b].rowNumber})" class="btn maroon_outline" data-toggle="tooltip" data-placement="bottom" title="حذف سطر" style="margin-left:7px">
                                                                     <i class="fa fa-trash"></i>
                                                           </button>
                                                           <button type="button" onclick="EditFromTempBloodPerssure(${arr[b].rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                                                <i class="fa fa-pen"></i>
                                                           </button>
                                                           `;
        }

    }
    arr_TempBloodPerssure = arr;
}

// ADMISSIONREFER bloodPerssure END *************

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

// ADMISSIONREFER ADVERSEREACTION START ***********
$("#addadverseReaction").on("click", function () {

    var validate = FormAdverseReaction.validate();
    validateSelect2(FormAdverseReaction);
    if (!validate) return;

    var notEmptyElm = checkEmptyElement("adverseReactionForm");
    if (notEmptyElm) {
        if (typeSaveAdverseReaction == "INS") {
            var rowNumberAdverseReaction = arr_TempAdverseReaction.length + 1;
            modelAppendAdverseReaction(rowNumberAdverseReaction, typeSaveAdverseReaction)
        }
        else {
            var rowNumberAdverseReaction = currentAdverseReactionRowNumber;
            modelAppendAdverseReaction(rowNumberAdverseReaction, typeSaveAdverseReaction);
        }
    }
    else {
        var msgError = alertify.warning("لطفاً آیتمی را وارد نمائید.");
        msgError.delay(alertify_delay);
        return;
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
        resetAdmissionReferForm("adverseReaction");
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
// ADMISSIONREFER ADVERSEREACTION END *************

// ADMISSIONREFER drugHistory START *************

$("#adddrugHistory").on("click", function () {

    var validate = FormDrugHistory.validate();
    validateSelect2(FormDrugHistory);
    if (!validate) return;

    var notEmptyElm = checkEmptyElement("bloodPerssureForm");
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

// ADMISSIONREFER DrugOrdered END *************

// ADMISSIONREFER heightWeight START *************

$("#addheightWeight").on("click", function () {

    var validate = FormHeightWeight.validate();
    validateSelect2(FormHeightWeight);
    if (!validate) return;

    var notEmptyElm = checkEmptyElement("heightWeightForm");
    if (notEmptyElm) {
        if (typeSaveHeightWeight == "INS") {
            var rowNumberHeightWeight = arr_TempHeightWeight.length + 1;
            modelAppendHeightWeight(rowNumberHeightWeight, typeSaveHeightWeight)
        }
        else {
            var rowNumberHeightWeight = currentHeightWeightRowNumber;
            modelAppendHeightWeight(rowNumberHeightWeight, typeSaveHeightWeight);
        }
    }
    else {
        var msgError = alertify.warning("لطفاً آیتمی را وارد نمائید.");
        msgError.delay(alertify_delay);
        return;
    }
});

function modelAppendHeightWeight(rowNumber, typeSave) {

    var modelHeightWeight = {
        headerId: 0,
        rowNumber: rowNumber,
        height: $("#height").val(),
        weight: $("#weight").val(),
        observationDateTimePersian: $("#observationDateTime_heightWeight").val(),
    }

    if (typeSave == "INS")
        arr_TempHeightWeight.push(modelHeightWeight);

    appendTempHeightWeight(modelHeightWeight, typeSaveHeightWeight);
    typeSaveHeightWeight = "INS";
}

var appendTempHeightWeight = (data, tSave = "INS") => {
    var dataOutput = "";
    if (data) {
        if (tSave == "INS") {
            var emptyRow = $("#tempheightWeight").find("#emptyRow");

            if (emptyRow.length > 0)
                $("#tempheightWeight").html("");

            dataOutput = `<tr id="hw_${data.rowNumber}">
                          <td>${data.rowNumber}</td>
                          <td>${data.height}</td>
                          <td>${data.weight}</td>
                          <td>${data.observationDateTimePersian}</td>
                          <td id="operationhw_${data.rowNumber}">
                              <button type="button" id="deletehw_${data.rowNumber}" onclick="removeFromTempHeightWeight(${data.rowNumber})" class="btn maroon_outline" data-original-title="حذف سطر" style="margin-left:7px">
                                   <i class="fa fa-trash"></i>
                              </button>
                              <button type="button" id="Edithw_${data.rowNumber}" onclick="EditFromTempHeightWeight(${data.rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                   <i class="fa fa-pen"></i>
                              </button>
                          </td>
                     </tr>`

            $(dataOutput).appendTo("#tempheightWeight");
        }
        else {
            var i = arr_TempHeightWeight.findIndex(x => x.rowNumber == data.rowNumber);
            arr_TempHeightWeight[i].headerId = data.headerId;
            arr_TempHeightWeight[i].rowNumber = data.rowNumber;
            arr_TempHeightWeight[i].height = data.height;
            arr_TempHeightWeight[i].weight = data.weight;
            arr_TempHeightWeight[i].observationDateTimePersian = data.observationDateTimePersian;

            $(`#hw_${data.rowNumber} td:eq(0)`).text(`${data.rowNumber}`);
            $(`#hw_${data.rowNumber} td:eq(1)`).text(`${data.height}`);
            $(`#hw_${data.rowNumber} td:eq(2)`).text(`${data.weight}`);
            $(`#hw_${data.rowNumber} td:eq(3)`).text(`${data.observationDateTimePersian}`);
        }
        resetAdmissionReferForm("heightWeight");
    }
}

var EditFromTempHeightWeight = (rowNumber) => {

    $("#tempheightWeight tr").removeClass("highlight");
    $(`#hw_${rowNumber}`).addClass("highlight");
    var arr_TempHeightWeightE = arr_TempHeightWeight.filter(line => line.rowNumber === rowNumber)[0];

    $("#height").val(arr_TempHeightWeightE.height);
    $("#weight").val(arr_TempHeightWeightE.weight);
    $("#observationDateTime_heightWeight").val(arr_TempHeightWeightE.observationDateTimePersian);

    $("#height").focus();
    typeSaveHeightWeight = "UPD";
    currentHeightWeightRowNumber = arr_TempHeightWeightE.rowNumber;
}

$("#canceledheightWeight").on("click", function () {

    $("#heightWeightBox input.form-control").val("");
    $("#height").focus();
    typeSaveHeightWeight = "INS";
});

var removeFromTempHeightWeight = (rowNumber) => {
    currentHeightWeightRowNumber = rowNumber;

    $("#tempheightWeight tr").removeClass("highlight");
    $(`#hw_${rowNumber}`).addClass("highlight");

    var removeRowResult = removeRowFromArray(arr_TempHeightWeight, "rowNumber", rowNumber);

    if (removeRowResult.statusMessage == "removed")
        $(`#hw_${rowNumber}`).remove();

    if (arr_TempHeightWeight.length == 0) {
        var colspan = $("#tempheightWeightList thead th").length;
        $("#tempheightWeight").html(emptyRow.replace("thlength", colspan));
    }

    rebuildHeightWeightRow();
}

function rebuildHeightWeightRow() {
    var arr = arr_TempHeightWeight;

    var table = "tempheightWeight";

    if (arr.length === 0)
        return;

    for (var b = 0; b < arr.length; b++) {
        var newRowNumber = b + 1;
        arr[b].rowNumber = newRowNumber;

        $(`#${table} tr`)[b].children[0].innerText = arr[b].rowNumber;
        $(`#${table} tr`)[b].setAttribute("id", `hw_${arr[b].rowNumber}`);
        $(`#${table} tr`)[b].children[0].innerText = arr[b].rowNumber;

        if ($(`#${table} tr`)[b].children[4].innerHTML !== "") {


            $(`#${table} tr`)[b].children[4].innerHTML = `<button type="button" onclick="removeFromTempHeightWeight(${arr[b].rowNumber})" class="btn maroon_outline" data-toggle="tooltip" data-placement="bottom" title="حذف سطر" style="margin-left:7px">
                                                                     <i class="fa fa-trash"></i>
                                                           </button>
                                                           <button type="button" onclick="EditFromTempHeightWeight(${arr[b].rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                                                <i class="fa fa-pen"></i>
                                                           </button>
                                                           `;
        }

    }
    arr_TempHeightWeight = arr;
}

// ADMISSIONREFER heightWeight END *************

// ADMISSIONREFER medicalHistory START *************

$("#addmedicalHistory").on("click", function () {

    var validate = FormMedicalHistory.validate();
    validateSelect2(FormMedicalHistory);
    if (!validate) return;

    var notEmptyElm = checkEmptyElement("medicalHistoryForm");
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

        ageOfOnset: $("#ageOfOnset_medicalHistory").val(),
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
                          <td>${data.ageOfOnset}</td>
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
            arr_TempMedicalHistory[i].ageOfOnset = data.ageOfOnset;
            arr_TempMedicalHistory[i].description = data.description;
            arr_TempMedicalHistory[i].dateOfOnsetPersian = data.dateOfOnsetPersian;
            arr_TempMedicalHistory[i].onsetDurationToPresent = data.onsetDurationToPresent;
            arr_TempMedicalHistory[i].onsetDurationToPresentUnitId = data.onsetDurationToPresentUnitId;
            arr_TempMedicalHistory[i].onsetDurationToPresentUnitName = data.onsetDurationToPresentUnitName;
            arr_TempMedicalHistory[i].onsetDurationToPresentUnitDescription = data.onsetDurationToPresentUnitDescription;

            $(`#mh_${data.rowNumber} td:eq(0)`).text(`${data.rowNumber}`);
            $(`#mh_${data.rowNumber} td:eq(1)`).text(`${data.conditionId != 0 ? `${data.conditionName}` : ""}`);
            $(`#mh_${data.rowNumber} td:eq(2)`).text(`${data.ageOfOnset}`);
            $(`#mh_${data.rowNumber} td:eq(3)`).text(`${data.dateOfOnsetPersian}`);
            $(`#mh_${data.rowNumber} td:eq(4)`).text(`${data.onsetDurationToPresent}`);
            $(`#mh_${data.rowNumber} td:eq(5)`).text(`${data.onsetDurationToPresentUnitId != 0 ? `${data.onsetDurationToPresentUnitDescription}` : ""}`);
            $(`#mh_${data.rowNumber} td:eq(6)`).text(`${data.description}`);
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
    $("#ageOfOnset_medicalHistory").val(arr_TempMedicalHistoryE.ageOfOnset);
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

        if ($(`#${table} tr`)[b].children[7].innerHTML !== "") {


            $(`#${table} tr`)[b].children[7].innerHTML = `<button type="button" onclick="removeFromTempMedicalHistory(${arr[b].rowNumber})" class="btn maroon_outline" data-toggle="tooltip" data-placement="bottom" title="حذف سطر" style="margin-left:7px">
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

// ADMISSIONREFER pulse START *************

$("#addpulse").on("click", function () {
    var validate = FormPulse.validate();
    validateSelect2(FormPulse);
    if (!validate) return;

    var notEmptyElm = checkEmptyElement("pulseForm");
    if (notEmptyElm) {
        if (typeSavePulse == "INS") {
            var rowNumberPulse = arr_TempPulse.length + 1;
            modelAppendPulse(rowNumberPulse, typeSavePulse)
        }
        else {
            var rowNumberPulse = currentPulseRowNumber;
            modelAppendPulse(rowNumberPulse, typeSavePulse);
        }
    }
    else {
        var msgError = alertify.warning("لطفاً آیتمی را وارد نمائید.");
        msgError.delay(alertify_delay);
        return;
    }
});

function modelAppendPulse(rowNumber, typeSave) {
    var modelPulse = {
        headerId: 0,
        rowNumber: rowNumber,
        clinicalDescription: $("#clinicalDescription").val(),
        isPulsePresent: $("#isPulsePresent").prop("checked"),
        methodId: +$("#methodId").val(),
        methodName: $("#methodId").select2('data').length > 0 ? $("#methodId").select2('data')[0].text : "",
        //positionId: +$("#positionId_pulse").val(),
        //positionName: $("#positionId_pulse").select2('data').length > 0 ? $("#positionId_pulse").select2('data')[0].text : "",
        pulseRate: +$("#pulseRate_pulse").val(),
        observationDateTimePersian: $("#observationDateTime_pulse").val(),
        locationOfMeasurmentId: +$("#locationOfMeasurment").val(),
        locationOfMeasurmentName: $("#locationOfMeasurment").select2('data').length > 0 ? $("#locationOfMeasurment").select2('data')[0].text : "",
        characterId: +$("#characterId").val(),
        characterName: $("#characterId").select2('data').length > 0 ? $("#characterId").select2('data')[0].text : "",
        volumeId: +$("#volumeId").val(),
        volumeName: $("#volumeId").select2('data').length > 0 ? $("#volumeId").select2('data')[0].text : "",
        regularityId: +$("#regularityId").val(),
        regularityName: $("#regularityId").select2('data').length > 0 ? $("#regularityId").select2('data')[0].text : ""
    }
    if (typeSave == "INS")
        arr_TempPulse.push(modelPulse);

    appendTempPulse(modelPulse, typeSavePulse);
    typeSavePulse = "INS";
}

var appendTempPulse = (data, tSave = "INS") => {
    var dataOutput = "";
    if (data) {
        if (tSave == "INS") {
            var emptyRow = $("#temppulse").find("#emptyRow");

            if (emptyRow.length > 0)
                $("#temppulse").html("");

            dataOutput = `<tr id="pu_${data.rowNumber}">
                          <td>${data.rowNumber}</td>
                          <td>${data.pulseRate}</td>
                          <td>${data.isPulsePresent ? "بلی" : "خیر"}</td>
                          <td>${data.methodId != 0 ? `${data.methodName}` : ""}</td>
                          <td>${data.locationOfMeasurmentId != 0 ? `${data.locationOfMeasurmentName}` : ""}</td>
                          <td>${data.characterId != 0 ? `${data.characterName}` : ""}</td>
                          <td>${data.volumeId != 0 ? `${data.volumeName}` : ""}</td>
                          <td>${data.regularityId != 0 ? `${data.regularityName}` : ""}</td>
                          <td>${data.observationDateTimePersian}</td>
                          <td>${data.clinicalDescription}</td>
                          <td id="operationpu_${data.rowNumber}">
                              <button type="button" id="deletepu_${data.rowNumber}" onclick="removeFromTempPulse(${data.rowNumber})" class="btn maroon_outline" data-original-title="حذف سطر" style="margin-left:7px">
                                   <i class="fa fa-trash"></i>
                              </button>
                              <button type="button" id="Editpu_${data.rowNumber}" onclick="EditFromTempPulse(${data.rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                   <i class="fa fa-pen"></i>
                              </button>
                          </td>
                     </tr>`

            $(dataOutput).appendTo("#temppulse");
        }
        else {
            var i = arr_TempPulse.findIndex(x => x.rowNumber == data.rowNumber);
            arr_TempPulse[i].headerId = data.headerId;
            arr_TempPulse[i].rowNumber = data.rowNumber;
            arr_TempPulse[i].clinicalDescription = data.clinicalDescription;
            arr_TempPulse[i].isPulsePresent = data.isPulsePresent;
            arr_TempPulse[i].methodId = data.methodId;
            arr_TempPulse[i].methodName = data.methodName;
            //arr_TempPulse[i].positionId = data.positionId;
            //arr_TempPulse[i].positionName = data.positionName;
            arr_TempPulse[i].pulseRate = data.pulseRate;
            arr_TempPulse[i].observationDateTimePersian = data.observationDateTimePersian;
            arr_TempPulse[i].locationOfMeasurmentId = data.locationOfMeasurmentId;
            arr_TempPulse[i].locationOfMeasurmentName = data.locationOfMeasurmentName;
            arr_TempPulse[i].characterId = data.characterId;
            arr_TempPulse[i].characterName = data.characterName;
            arr_TempPulse[i].volumeId = data.volumeId;
            arr_TempPulse[i].volumeName = data.volumeName;
            arr_TempPulse[i].regularityId = data.regularityId;
            arr_TempPulse[i].regularityName = data.regularityName;

            $(`#pu_${data.rowNumber} td:eq(0)`).text(`${data.rowNumber}`);
            //$(`#pu_${data.rowNumber} td:eq(1)`).text(`${data.positionId != 0 ? `${data.positionName}` : ""}`);
            $(`#pu_${data.rowNumber} td:eq(1)`).text(`${data.pulseRate}`);
            $(`#pu_${data.rowNumber} td:eq(2)`).text(`${data.isPulsePresent ? "بلی" : "خیر"}`);
            $(`#pu_${data.rowNumber} td:eq(3)`).text(`${data.methodId != 0 ? `${data.methodName}` : ""}`);
            $(`#pu_${data.rowNumber} td:eq(4)`).text(`${data.locationOfMeasurmentId != 0 ? `${data.locationOfMeasurmentName}` : ""}`);
            $(`#pu_${data.rowNumber} td:eq(5)`).text(`${data.characterId != 0 ? `${data.characterName}` : ""}`);
            $(`#pu_${data.rowNumber} td:eq(6)`).text(`${data.volumeId != 0 ? `${data.volumeName}` : ""}`);
            $(`#pu_${data.rowNumber} td:eq(7)`).text(`${data.regularityId != 0 ? `${data.regularityName}` : ""}`);
            $(`#pu_${data.rowNumber} td:eq(8)`).text(`${data.observationDateTimePersian}`);
            $(`#pu_${data.rowNumber} td:eq(9)`).text(`${data.clinicalDescription}`);
        }
        resetAdmissionReferForm("pulse");
    }
}

var EditFromTempPulse = (rowNumber) => {

    $("#temppulse tr").removeClass("highlight");
    $(`#pu_${rowNumber}`).addClass("highlight");
    var detailPulse = "";
    var arr_TempPulseE = arr_TempPulse.filter(line => line.rowNumber === rowNumber)[0];


    $("#clinicalDescription").val(arr_TempPulseE.clinicalDescription);

    var elm = $(`#${'isPulsePresent'}`);
    var switchValue = elm.attr("switch-value").split(',');
    if (arr_TempPulseE.isPulsePresent == true) {
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
    $(`#isPulsePresent`).blur();

    $("#methodId").val(arr_TempPulseE.methodId).trigger('change');
    //$("#positionId_pulse").val(arr_TempPulseE.positionId).trigger('change');
    $("#locationOfMeasurment").val(arr_TempPulseE.locationOfMeasurmentId).trigger('change');
    $("#characterId").val(arr_TempPulseE.characterId).trigger('change');
    $("#pulseRate_pulse").val(arr_TempPulseE.pulseRate);
    $("#regularityId").val(arr_TempPulseE.regularityId).trigger('change');
    $("#volumeId").val(arr_TempPulseE.volumeId).trigger('change');
    $("#observationDateTime_pulse").val(arr_TempPulseE.observationDateTimePersian);

    $("#pulseRate_pulse").focus();
    typeSavePulse = "UPD";
    currentPulseRowNumber = arr_TempPulseE.rowNumber;
}

$("#canceledpulse").on("click", function () {
    $("#pulseBox .select2").val("").trigger("change");
    $("#pulseBox input.form-control").val("");
    $("#pulseRate_pulse").focus();
    typeSavePulse = "INS";
});

var removeFromTempPulse = (rowNumber) => {
    currentPulseRowNumber = rowNumber;

    $("#temppulse tr").removeClass("highlight");
    $(`#pu_${rowNumber}`).addClass("highlight");

    var removeRowResult = removeRowFromArray(arr_TempPulse, "rowNumber", rowNumber);

    if (removeRowResult.statusMessage == "removed")
        $(`#pu_${rowNumber}`).remove();

    if (arr_TempPulse.length == 0) {
        var colspan = $("#temppulseList thead th").length;
        $("#temppulse").html(emptyRow.replace("thlength", colspan));
    }

    rebuildPulseRow();
}

function rebuildPulseRow() {
    var arr = arr_TempPulse;

    var table = "temppulse";

    if (arr.length === 0)
        return;

    for (var b = 0; b < arr.length; b++) {
        var newRowNumber = b + 1;
        arr[b].rowNumber = newRowNumber;

        $(`#${table} tr`)[b].children[0].innerText = arr[b].rowNumber;
        $(`#${table} tr`)[b].setAttribute("id", `pu_${arr[b].rowNumber}`);
        $(`#${table} tr`)[b].children[0].innerText = arr[b].rowNumber;

        if ($(`#${table} tr`)[b].children[10].innerHTML !== "") {


            $(`#${table} tr`)[b].children[10].innerHTML = `<button type="button" onclick="removeFromTempPulse(${arr[b].rowNumber})" class="btn maroon_outline" data-toggle="tooltip" data-placement="bottom" title="حذف سطر" style="margin-left:7px">
                                                                     <i class="fa fa-trash"></i>
                                                           </button>
                                                           <button type="button" onclick="EditFromTempPulse(${arr[b].rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                                                <i class="fa fa-pen"></i>
                                                           </button>
                                                           `;
        }

    }
    arr_TempPulse = arr;
}

// ADMISSIONREFER pulse END *************

// ADMISSIONREFER vitalSings START *************

$("#addvitalSings").on("click", function () {

    var validate = FormVitalSings.validate();
    validateSelect2(FormVitalSings);
    if (!validate) return;

    var notEmptyElm = checkEmptyElement("vitalSingsForm");
    if (notEmptyElm) {
        if (typeSaveVitalSings == "INS") {
            var rowNumberVitalSings = arr_TempVitalSings.length + 1;
            modelAppendVitalSings(rowNumberVitalSings, typeSaveVitalSings)
        }
        else {
            var rowNumberVitalSings = currentVitalSingsRowNumber;
            modelAppendVitalSings(rowNumberVitalSings, typeSaveVitalSings);
        }
    }
    else {
        var msgError = alertify.warning("لطفاً آیتمی را وارد نمائید.");
        msgError.delay(alertify_delay);
        return;
    }
});

function modelAppendVitalSings(rowNumber, typeSave) {

    var modelVitalSings = {
        headerId: 0,
        rowNumber: rowNumber,
        pulseRate: $("#pulseRate_vitalSings").val(),
        respiratoryRate: $("#respiratoryRate").val(),
        temperature: $("#temperature").val(),
        temperatureLocationId: +$("#temperatureLocationId").val(),
        temperatureLocationName: $("#temperatureLocationId").select2('data').length > 0 ? $("#temperatureLocationId").select2('data')[0].text : "",
        observationDateTimePersian: $("#observationDateTime_vitalSings").val(),
    }

    if (typeSave == "INS")
        arr_TempVitalSings.push(modelVitalSings);

    appendTempVitalSings(modelVitalSings, typeSaveVitalSings);
    typeSaveVitalSings = "INS";
}

var appendTempVitalSings = (data, tSave = "INS") => {
    var dataOutput = "";
    if (data) {
        if (tSave == "INS") {
            var emptyRow = $("#tempvitalSings").find("#emptyRow");

            if (emptyRow.length > 0)
                $("#tempvitalSings").html("");

            dataOutput = `<tr id="vs_${data.rowNumber}">
                          <td>${data.rowNumber}</td>
                          <td>${data.pulseRate}</td>
                          <td>${data.respiratoryRate}</td>
                          <td>${data.temperature}</td>
                          <td>${data.temperatureLocationId != 0 ? `${data.temperatureLocationName}` : ""}</td>
                          <td>${data.observationDateTimePersian}</td>
                          <td id="operationvs_${data.rowNumber}">
                              <button type="button" id="deletevs_${data.rowNumber}" onclick="removeFromTempVitalSings(${data.rowNumber})" class="btn maroon_outline" data-original-title="حذف سطر" style="margin-left:7px">
                                   <i class="fa fa-trash"></i>
                              </button>
                              <button type="button" id="Editvs_${data.rowNumber}" onclick="EditFromTempVitalSings(${data.rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                   <i class="fa fa-pen"></i>
                              </button>
                          </td>
                     </tr>`

            $(dataOutput).appendTo("#tempvitalSings");
        }
        else {
            var i = arr_TempVitalSings.findIndex(x => x.rowNumber == data.rowNumber);
            arr_TempVitalSings[i].headerId = data.headerId;
            arr_TempVitalSings[i].rowNumber = data.rowNumber;
            arr_TempVitalSings[i].pulseRate = data.pulseRate;
            arr_TempVitalSings[i].respiratoryRate = data.respiratoryRate;
            arr_TempVitalSings[i].temperature = data.temperature;
            arr_TempVitalSings[i].temperatureLocationId = data.temperatureLocationId;
            arr_TempVitalSings[i].temperatureLocationName = data.temperatureLocationName;
            arr_TempVitalSings[i].observationDateTimePersian = data.observationDateTimePersian;

            $(`#vs_${data.rowNumber} td:eq(0)`).text(`${data.rowNumber}`);
            $(`#vs_${data.rowNumber} td:eq(1)`).text(`${data.pulseRate}`);
            $(`#vs_${data.rowNumber} td:eq(2)`).text(`${data.respiratoryRate}`);
            $(`#vs_${data.rowNumber} td:eq(3)`).text(`${data.temperature}`);
            $(`#vs_${data.rowNumber} td:eq(4)`).text(`${data.temperatureLocationId != 0 ? `${data.temperatureLocationName}` : ""}`);
            $(`#vs_${data.rowNumber} td:eq(5)`).text(`${data.observationDateTimePersian}`);
        }
        resetAdmissionReferForm("vitalSings");
    }
}

var EditFromTempVitalSings = (rowNumber) => {

    $("#tempvitalSings tr").removeClass("highlight");
    $(`#vs_${rowNumber}`).addClass("highlight");
    var arr_TempVitalSingsE = arr_TempVitalSings.filter(line => line.rowNumber === rowNumber)[0];

    $("#pulseRate_vitalSings").val(arr_TempVitalSingsE.pulseRate);
    $("#respiratoryRate").val(arr_TempVitalSingsE.respiratoryRate);
    $("#temperature").val(arr_TempVitalSingsE.temperature);
    $("#temperatureLocationId").val(arr_TempVitalSingsE.temperatureLocationId).trigger('change');
    $("#observationDateTime_vitalSings").val(arr_TempVitalSingsE.observationDateTimePersian);

    $("#pulseRate_vitalSings").focus();
    typeSaveVitalSings = "UPD";
    currentVitalSingsRowNumber = arr_TempVitalSingsE.rowNumber;
}

$("#canceledvitalSings").on("click", function () {
    $("#vitalSingsBox .select2").val("").trigger("change");
    $("#vitalSingsBox input.form-control").val("");
    $("#pulseRate_vitalSings").focus();
    typeSaveVitalSings = "INS";
});

var removeFromTempVitalSings = (rowNumber) => {
    currentVitalSingsRowNumber = rowNumber;

    $("#tempvitalSings tr").removeClass("highlight");
    $(`#vs_${rowNumber}`).addClass("highlight");

    var removeRowResult = removeRowFromArray(arr_TempVitalSings, "rowNumber", rowNumber);

    if (removeRowResult.statusMessage == "removed")
        $(`#vs_${rowNumber}`).remove();

    if (arr_TempVitalSings.length == 0) {
        var colspan = $("#tempvitalSingsList thead th").length;
        $("#tempvitalSings").html(emptyRow.replace("thlength", colspan));
    }

    rebuildVitalSingsRow();
}

function rebuildVitalSingsRow() {
    var arr = arr_TempVitalSings;

    var table = "tempvitalSings";

    if (arr.length === 0)
        return;

    for (var b = 0; b < arr.length; b++) {
        var newRowNumber = b + 1;
        arr[b].rowNumber = newRowNumber;

        $(`#${table} tr`)[b].children[0].innerText = arr[b].rowNumber;
        $(`#${table} tr`)[b].setAttribute("id", `vs_${arr[b].rowNumber}`);
        $(`#${table} tr`)[b].children[0].innerText = arr[b].rowNumber;

        if ($(`#${table} tr`)[b].children[6].innerHTML !== "") {


            $(`#${table} tr`)[b].children[6].innerHTML = `<button type="button" onclick="removeFromTempVitalSings(${arr[b].rowNumber})" class="btn maroon_outline" data-toggle="tooltip" data-placement="bottom" title="حذف سطر" style="margin-left:7px">
                                                                     <i class="fa fa-trash"></i>
                                                           </button>
                                                           <button type="button" onclick="EditFromTempVitalSings(${arr[b].rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                                                <i class="fa fa-pen"></i>
                                                           </button>
                                                           `;
        }

    }
    arr_TempVitalSings = arr;
}

// ADMISSIONREFER vitalSings END *************

// ADMISSIONREFER waistHip START *************

$("#addwaistHip").on("click", function () {

    var validate = FormWaistHip.validate();
    validateSelect2(FormWaistHip);
    if (!validate) return;

    var notEmptyElm = checkEmptyElement("waistHipForm");
    if (notEmptyElm) {
        if (typeSaveWaistHip == "INS") {
            var rowNumberWaistHip = arr_TempWaistHip.length + 1;
            modelAppendWaistHip(rowNumberWaistHip, typeSaveWaistHip)
        }
        else {
            var rowNumberWaistHip = currentWaistHipRowNumber;
            modelAppendWaistHip(rowNumberWaistHip, typeSaveWaistHip);
        }
    }
    else {
        var msgError = alertify.warning("لطفاً آیتمی را وارد نمائید.");
        msgError.delay(alertify_delay);
        return;
    }
});

function modelAppendWaistHip(rowNumber, typeSave) {

    var modelWaistHip = {
        headerId: 0,
        rowNumber: rowNumber,
        hipCircumference: $("#hipCircumference").val(),
        waistCircumference: $("#waistCircumference").val(),
        observationDateTimePersian: $("#observationDateTime_waistHip").val(),
    }

    if (typeSave == "INS")
        arr_TempWaistHip.push(modelWaistHip);

    appendTempWaistHip(modelWaistHip, typeSaveWaistHip);
    typeSaveWaistHip = "INS";
}

var appendTempWaistHip = (data, tSave = "INS") => {
    var dataOutput = "";
    if (data) {
        if (tSave == "INS") {
            var emptyRow = $("#tempwaistHip").find("#emptyRow");

            if (emptyRow.length > 0)
                $("#tempwaistHip").html("");

            dataOutput = `<tr id="wh_${data.rowNumber}">
                          <td>${data.rowNumber}</td>
                          <td>${data.hipCircumference}</td>
                          <td>${data.waistCircumference}</td>
                          <td>${data.observationDateTimePersian}</td>
                          <td id="operationwh_${data.rowNumber}">
                              <button type="button" id="deletewh_${data.rowNumber}" onclick="removeFromTempWaistHip(${data.rowNumber})" class="btn maroon_outline" data-original-title="حذف سطر" style="margin-left:7px">
                                   <i class="fa fa-trash"></i>
                              </button>
                              <button type="button" id="Editwh_${data.rowNumber}" onclick="EditFromTempWaistHip(${data.rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                   <i class="fa fa-pen"></i>
                              </button>
                          </td>
                     </tr>`

            $(dataOutput).appendTo("#tempwaistHip");
        }
        else {
            var i = arr_TempWaistHip.findIndex(x => x.rowNumber == data.rowNumber);
            arr_TempWaistHip[i].headerId = data.headerId;
            arr_TempWaistHip[i].rowNumber = data.rowNumber;
            arr_TempWaistHip[i].hipCircumference = data.hipCircumference;
            arr_TempWaistHip[i].waistCircumference = data.waistCircumference;
            arr_TempWaistHip[i].observationDateTimePersian = data.observationDateTimePersian;

            $(`#wh_${data.rowNumber} td:eq(0)`).text(`${data.rowNumber}`);
            $(`#wh_${data.rowNumber} td:eq(1)`).text(`${data.hipCircumference}`);
            $(`#wh_${data.rowNumber} td:eq(2)`).text(`${data.waistCircumference}`);
            $(`#wh_${data.rowNumber} td:eq(3)`).text(`${data.observationDateTimePersian}`);
        }
        resetAdmissionReferForm("waistHip");
    }
}

var EditFromTempWaistHip = (rowNumber) => {

    $("#tempwaistHip tr").removeClass("highlight");
    $(`#wh_${rowNumber}`).addClass("highlight");
    var arr_TempWaistHipE = arr_TempWaistHip.filter(line => line.rowNumber === rowNumber)[0];

    $("#hipCircumference").val(arr_TempWaistHipE.hipCircumference);
    $("#waistCircumference").val(arr_TempWaistHipE.waistCircumference);
    $("#observationDateTime_waistHip").val(arr_TempWaistHipE.observationDateTimePersian);

    $("#hipCircumference").focus();
    typeSaveWaistHip = "UPD";
    currentWaistHipRowNumber = arr_TempWaistHipE.rowNumber;
}

$("#canceledwaistHip").on("click", function () {
    $("#waistHipBox input.form-control").val("");
    $("#hipCircumference").focus();
    typeSaveWaistHip = "INS";
});

var removeFromTempWaistHip = (rowNumber) => {
    currentWaistHipRowNumber = rowNumber;

    $("#tempwaistHip tr").removeClass("highlight");
    $(`#wh_${rowNumber}`).addClass("highlight");

    var removeRowResult = removeRowFromArray(arr_TempWaistHip, "rowNumber", rowNumber);

    if (removeRowResult.statusMessage == "removed")
        $(`#wh_${rowNumber}`).remove();

    if (arr_TempWaistHip.length == 0) {
        var colspan = $("#tempwaistHipList thead th").length;
        $("#tempwaistHip").html(emptyRow.replace("thlength", colspan));
    }

    rebuildWaistHipRow();
}

function rebuildWaistHipRow() {
    var arr = arr_TempWaistHip;

    var table = "tempwaistHip";

    if (arr.length === 0)
        return;

    for (var b = 0; b < arr.length; b++) {
        var newRowNumber = b + 1;
        arr[b].rowNumber = newRowNumber;

        $(`#${table} tr`)[b].children[0].innerText = arr[b].rowNumber;
        $(`#${table} tr`)[b].setAttribute("id", `wh_${arr[b].rowNumber}`);
        $(`#${table} tr`)[b].children[0].innerText = arr[b].rowNumber;

        if ($(`#${table} tr`)[b].children[4].innerHTML !== "") {


            $(`#${table} tr`)[b].children[4].innerHTML = `<button type="button" onclick="removeFromTempWaistHip(${arr[b].rowNumber})" class="btn maroon_outline" data-toggle="tooltip" data-placement="bottom" title="حذف سطر" style="margin-left:7px">
                                                                     <i class="fa fa-trash"></i>
                                                           </button>
                                                           <button type="button" onclick="EditFromTempWaistHip(${arr[b].rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                                                <i class="fa fa-pen"></i>
                                                           </button>
                                                           `;
        }

    }
    arr_TempWaistHip = arr;
}

// ADMISSIONREFER waistHip END *************

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
        comment: $("#comment").val(),
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

var focusInput = (tabNo) => {
    let firstInput = $(`.tabToggle${tabNo}`).find("[tabindex]:not(:disabled)").first();
    setTimeout(() => {
        if ($(firstInput).hasClass("select2"))
            $(`#${firstInput.attr("id")}`).next().find('.select2-selection').focus();
        else
            firstInput.focus();
    }, 10);
};

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
    else if (typeBox == "bloodPerssure") {
        $("#bloodPerssureBox .select2").val("").trigger("change");
        $("#bloodPerssureBox input.form-control").val("");
        $("#positionId_bloodPerssure").select2("focus");
        typeSaveBloodPerssure = "INS";
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
    else if (typeBox == "heightWeight") {
        $("#heightWeightBox input.form-control").val("");
        $("#height").focus();
        typeSaveHeightWeight = "INS";
    }
    else if (typeBox == "medicalHistory") {
        $("#medicalHistoryBox .select2").val("").trigger("change");
        $("#medicalHistoryBox input.form-control").val("");
        $("#conditionId_medicalHistory").select2("focus");
        typeSaveMedicalHistory = "INS";
    }
    else if (typeBox == "pulse") {
        $("#pulseBox .select2").val("").trigger("change");
        $("#pulseBox input.form-control").val("");
        $("#pulseBox .funkyradio input:checkbox").prop("checked", false).trigger("change");
        $("#pulseRate_pulse").focus();
        typeSavePulse = "INS";
    }
    else if (typeBox == "vitalSings") {
        $("#vitalSingsBox .select2").val("").trigger("change");
        $("#vitalSingsBox input.form-control").val("");
        $("#pulseRate_vitalSings").focus();
        typeSaveVitalSings = "INS";
    }
    else if (typeBox == "waistHip") {
        $("#waistHipBox input.form-control").val("");
        $("#hipCircumference").focus();
        typeSaveWaistHip = "INS";
    }
    else if (typeBox == "diag") {
        $("#diagBox .select2").val("").trigger("change");
        $("#diagBox .funkyradio input:checkbox").prop("checked", false).trigger("change");
        $("#diagBox input.form-control").val("");
        $("#statusId").select2("focus");
        $("#diagnosisDateTime").val("");
        typeSaveDiag = "INS";
    }
    else if (typeBox == "adverseReaction") {
        $("#adverseReactionBox .select2").val("").trigger("change");
        $("#adverseReactionBox .funkyradio input:checkbox").prop("checked", false).trigger("change");
        $("#adverseReactionBox input.form-control").val("");
        $("#causativeAgentCategoryId").select2("focus");
        typeSaveDiag = "INS";
    }

}

initAdmissionSendReferForm();

async function initAdmissionSendReferForm() {
    var newOption = new Option("انتخاب کنید", 0, true, true);

    $('#attenderId').append(newOption).trigger('change');
    fill_select2(`${viewData_baseUrl_MC}/Attender_AssistantApi/getdropdown`, "attenderId", true, 0, false, 0, "انتخاب داکتر...");

    ColumnResizeable("tempabuseHistoryFieldList");
    ColumnResizeable("tempfamilyHistoryFieldList");
    ColumnResizeable("tempadmissionFieldList");
    ColumnResizeable("tempclinicalFindingFieldList");
    ColumnResizeable("tempdiagnosisFieldList");
    ColumnResizeable("tempdrugHistoryFieldList");
    ColumnResizeable("tempdrugOrderedFieldList");
    ColumnResizeable("tempfollowupPlanFieldList");
    ColumnResizeable("tempinsuranceFieldList");
    ColumnResizeable("temppastMedicalHistoryFieldList");
    ColumnResizeable("tempabuseHistoryList");
    ColumnResizeable("tempfamilyHistoryList");
    ColumnResizeable("tempbloodPerssureList");
    ColumnResizeable("tempcareActionList");
    ColumnResizeable("tempclinicFindingList");
    ColumnResizeable("tempdrugHistoryList");
    ColumnResizeable("tempdrugOrderedList");
    ColumnResizeable("tempheightWeightList");
    ColumnResizeable("tempmedicalHistoryList");
    ColumnResizeable("temppulseList");
    ColumnResizeable("tempvitalSingsList");
    ColumnResizeable("tempcareActionFieldList");
    ColumnResizeable("tempwaistHipList");
    ColumnResizeable("tempdiagnosisList");

    if (admissionReferId != '') {
        $("#choiceOfAdmission").css("display", "none")
    }

    bindAdmissionReferElement();
    inputMask();
    $("#isPulsePresent").trigger("change");

    $(".card-body").fadeIn(1000);
    focusInput(1);
}

function resetFormAdmissionRefer() {
    alertify.confirm('بازنشانی', "ایا اطمینان دارید؟",
        function () {
            $("#getFeedBackReferbox").addClass("displaynone");
            arr_TempAbuseHistory = [];
            arr_TempFamilyHistory = [];
            arr_TempBloodPerssure = [];
            arr_TempCareAction = [];
            arr_TempClinicFinding = [];
            arr_TempDrugHistory = [];
            arr_TempDrugOrdered = [];
            arr_TempHeightWeight = [];
            arr_TempMedicalHistory = [];
            arr_TempPulse = [];
            arr_TempVitalSings = [];
            arr_TempWaistHip = [];
            arr_TempDiagnosis = [];

            $("#choiceOfAdmission").css("display", "inline")
            $("#tempabuseHistoryField").html(fillEmptyRow(8));
            $("#tempadmissionField").html(fillEmptyRow(5));
            $("#tempcareActionField").html(fillEmptyRow(7));
            $("#tempclinicalFindingField").html(fillEmptyRow(9));
            $("#tempdiagnosisField").html(fillEmptyRow(5));
            $("#tempAdverseReactionField").html(fillEmptyRow(6));
            $("#tempdrugHistoryField").html(fillEmptyRow(3));
            $("#tempdrugOrderedField").html(fillEmptyRow(12));
            $("#tempfamilyHistoryField").html(fillEmptyRow(5));
            $("#tempfollowupPlanField").html(fillEmptyRow(5));
            $("#tempinsuranceField").html(fillEmptyRow(6));
            $("#temppastMedicalHistoryField").html(fillEmptyRow(6));

            $("#tempabuseHistory").html(fillEmptyRow(9));
            $("#tempfamilyHistory").html(fillEmptyRow(6));
            $("#tempbloodPerssure").html(fillEmptyRow(6));
            $("#tempcareAction").html(fillEmptyRow(8));
            $("#tempclinicFinding").html(fillEmptyRow(10));
            $("#tempAdverseReaction").html(fillEmptyRow(7));
            $("#tempdrugHistory").html(fillEmptyRow(4));
            $("#tempdrugOrdered").html(fillEmptyRow(13));
            $("#tempheightWeight").html(fillEmptyRow(5));
            $("#tempmedicalHistory").html(fillEmptyRow(7));
            $("#temppulse").html(fillEmptyRow(10));
            $("#tempvitalSings").html(fillEmptyRow(7));
            $("#tempwaistHip").html(fillEmptyRow(5));
            $("#tempDiag").html(fillEmptyRow(6));

            $("#admissionSelected").html("");
            $("#tempGetfeedBackRefer").html("");
            $("#admissionId").val("");
            $("#patientNationalCode").val("");
            $("#patientFullName").val("");
            $("#createDatePersian").val("");
            $("#searchAdmission").val("");

            $("#admissionReferId").val(0);
            admissionReferId = 0;
            $("#userFullName").val("");
            $("#AdmissionReferBox").addClass("displaynone");

            $("#referForm .select2").val("").trigger("change");
            $("#referForm .funkyradio input:checkbox").prop("checked", false).trigger("change");
            $("#referForm input.form-control").val("");

            $("#referFormT .select2").val("").trigger("change");
            $("#referFormT .funkyradio input:checkbox").prop("checked", false).trigger("change");
            $("#referFormT input.form-control").val("");

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

            $("#adverseReactionBox .select2").val("").trigger("change");
            $("#adverseReactionBox input.form-control").val("");

            $("#drugHistoryBox .select2").val("").trigger("change");
            $("#drugHistoryBox input.form-control").val("");

            $("#drugOrderedBox .select2").val("").trigger("change");
            $("#drugOrderedBox input.form-control").val("");

            $("#heightWeightBox input.form-control").val("");

            $("#medicalHistoryBox .select2").val("").trigger("change");
            $("#medicalHistoryBox input.form-control").val("");

            $("#pulseBox .select2").val("").trigger("change");
            $("#pulseBox input.form-control").val("");
            $("#pulseBox .funkyradio input:checkbox").prop("checked", false).trigger("change");

            $("#vitalSingsBox .select2").val("").trigger("change");
            $("#vitalSingsBox input.form-control").val("");

            $("#waistHipBox input.form-control").val("");

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