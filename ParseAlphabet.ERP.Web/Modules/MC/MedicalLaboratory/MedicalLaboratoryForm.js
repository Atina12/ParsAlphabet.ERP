var viewData_controllername = "MedicalLaboratoryApi",
    viewData_get_specimenTypeId = `${viewData_baseUrl_MC}/${viewData_controllername}/getspecimentypetddropdown`,
    viewData_get_collectionProcedureId = `${viewData_baseUrl_MC}/${viewData_controllername}/getcollectionprocedureiddropdown`,
    viewData_get_snomedctMethodId = `${viewData_baseUrl_MC}/${viewData_controllername}/getsnomedctmethodiddropdown`,
    viewData_get_laboratoryPanelId = `${viewData_baseUrl_MC}/${viewData_controllername}/getlaboratorypaneliddropdown`,
    viewData_get_resultStatusId = `${viewData_baseUrl_MC}/${viewData_controllername}/getresultstatusiddropdown`,
    viewData_get_testNameId = `${viewData_baseUrl_MC}/${viewData_controllername}/gettestnameiddropdown`,
    viewData_get_testPanelId = `${viewData_baseUrl_MC}/${viewData_controllername}/getreactioncategoryiddropdown`,
    viewData_get_testResultId = `${viewData_baseUrl_MC}/${viewData_controllername}/gettestresultiddropdown`,
    viewData_get_ageRangeId = `${viewData_baseUrl_MC}/${viewData_controllername}/getagerangeiddropdown`,
    viewData_get_gestationAgeRangeId = `${viewData_baseUrl_MC}/${viewData_controllername}/getgestationagerangeiddropdown`,
    viewData_get_hormonalPhaseId = `${viewData_baseUrl_MC}/${viewData_controllername}/gethormonalphaseiddropdown`,
    viewData_get_referenceStatusId = `${viewData_baseUrl_MC}/${viewData_controllername}/getreferencestatusiddropdown`,
    viewData_get_speciesId = `${viewData_baseUrl_MC}/${viewData_controllername}/getspeciesiddropdown`,
    viewData_get_diagnosisReasonId = `${viewData_baseUrl_MC}/${viewData_controllername}/getdiagnosisreasoniddropdown`,
    viewData_get_severityId = `${viewData_baseUrl_MC}/${viewData_controllername}/getseverityiddropdown`,
    viewData_get_diagnosisStatusId = `${viewData_baseUrl_MC}/${viewData_controllername}/getdiagnosisstatusiddropdown`,
    viewData_get_specimenAdequacy = `${viewData_baseUrl_MC}/${viewData_controllername}/getspecimenadequacyiddropdown`,
    viewData_get_testResultType = `${viewData_baseUrl_MC}/${viewData_controllername}/gettestresulttypeiddropdown`,
    viewData_get_testResultCodedType = `${viewData_baseUrl_MC}/${viewData_controllername}/getcodedtypetddropdown`,
    viewData_get_testResultUnit = `${viewData_baseUrl_MC}/${viewData_controllername}/gettestresultunitiddropdown`,
    viewData_get_testResultUnit_resultType = `${viewData_baseUrl_MC}/${viewData_controllername}/gettestresultunitidresulttypedropdown`,
    viewData_get_morphologyId = `${viewData_baseUrl_MC}/${viewData_controllername}/getmorphologyiddropdown`,
    viewData_get_morphologyDifferentiationId = `${viewData_baseUrl_MC}/${viewData_controllername}/getmorphologydifferentiationiddropdown`,
    viewData_get_topographyId = `${viewData_baseUrl_MC}/${viewData_controllername}/gettopographyiddropdown`,
    viewData_get_topographyLateralityId = `${viewData_baseUrl_MC}/${viewData_controllername}/gettopographylateralityiddropdown`,
    viewData_get_MedicalLaboratoryGet = `${viewData_baseUrl_MC}/${viewData_controllername}/get`,
    viewData_get_SearchAdmission = `${viewData_baseUrl_MC}/AdmissionApi/searchinbound`, /*searchinboundmedicallabrotary*/
    viewData_get_Serverity = `${viewData_baseUrl_MC}/PrescriptionApi/serverityid`,
    //viewData_get_SearchAdmission = `${viewData_baseUrl_MC}/AdmissionApi/searchinbound`,
    viewData_get_AdmissionSearch = `${viewData_baseUrl_MC}/AdmissionApi/search`,
    emptyRow = `<tr id="emptyRow"><td colspan="thlength" class="text-center">سطری وجود ندارد</td></tr>`,
    viewData_save_MedicalLaboratory = `${viewData_baseUrl_MC}/${viewData_controllername}/save`,
    viewData_get_PathologyDiagnosis = `${viewData_baseUrl_MC}/PrescriptionApi/diagnosisreasonid`,
    medicalLaboratoryItem = {
        medicalLaboratoryRequests: [],
        medicalLaboratoryDiagnosises: []
    },
    mdDiagnosisId = 0, mdPathologyId = 0, mdRequestSelectedId = 0, mdRequestMethodSelectedId = 0, mdResultSelectedId = 0, mdReferenceSelectedId = 0, mdPathologySelectedId = 0,
    requestEdited = false, requestMethodEdited = false, requestResultEdited = false, referenceEdited = false, diagnosisEdited = false,
    requestRemoved = false, requestMethodRemoved = false, resultRemoved = false, referenceRemoved = false, diagRemoved = false,
    pathologyEdited = false, pathologyRemoved = false,
    admissionIdentity = 0, medicalLaboratoryId = +$("#medicalLaboratoryId").val(), medicalLaboratoryHID = "",
    currentLabRequestRowNumber = 0, currentReferenceNumber = 0, currentResultRowNumber = 0, currentLabTestDetailRowNumber = 0, currentResultRowDetailRowNumber = 0,
    typeSaveLabRequest = "INS", typeSaveResultRow = "INS", typeSaveReferenceRange = "INS",
    typeSaveDiag = "INS", typeSavelabTestResult = "INS",
    arr_TempLabRequest = [], arr_TempLabTestResult = [],
    arr_TempResultRow = [], arr_TempResultRowBoolean = [], arr_TempResultRowCoded = [],
    arr_TempResultRowCount = [], arr_TempResultRowOrdinal = [], arr_TempResultRowProportion = [], arr_TempResultRowQuantity = [],
    arr_TempReferenceRange = [], arr_TempDiagnosis = [],
    referringDoctorId = 0,
    FormLabRequest = $('#requestBox').parsley(), FormLabTestResult = $('#requestMethodBox').parsley(),
    FormResultRow = $('#resultRowBox').parsley(), FormResultRowBoolean = $('#resultRowBooleanForm').parsley(),
    FormPathology = $("#resultPathologyRowBox").parsley(),
    FormResultRowCoded = $('#resultRowCodedForm').parsley(), FormResultRowCount = $('#resultRowCountForm').parsley(),
    FormResultRowOrdinal = $('#resultRowOrdinalForm').parsley(), FormResultRowProportion = $('#resultRowProportionForm').parsley(),
    FormResultRowQuantity = $('#resultRowQuantityForm').parsley(), FormReferenceRange = $('#referenceRangeBox').parsley(),
    FormDiagnosis = $('#diagnosisForm').parsley(), FormMedicalLaboratory = $('#medicalLaboratoryForm').parsley(),
    arr_TempPathology = [], currentPathologyRowNumber = 0,
    typeSavePathology = "INS";


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

async function saveMedicalLaboratoryForm() {

    //await disableSaveButtonAsync(true);

    //if (validateAllTab()) {
    //    var msg_temp_srv = alertify.warning("حتما یک بخش را کامل نمایید");
    //    msg_temp_srv.delay(prMsg.delay);
    //    await disableSaveButtonAsync(false);
    //    return;
    //}

    if (admissionIdentity == 0) {
        var msg_temp_srv = alertify.warning(prMsg.selectAdmission);
        msg_temp_srv.delay(prMsg.delay);
        await disableSaveButtonAsync(false);
        return;
    }

    //بررسی خالی نبودن نمونه ها
    if (medicalLaboratoryItem.medicalLaboratoryRequests.filter(a => !a.isRemoved).length === 0) {
        var msg_temp_srv = alertify.warning("اطلاعات نمونه درخواستی را وارد کنید");
        msg_temp_srv.delay(prMsg.delay);
        await disableSaveButtonAsync(false);
        return;
    }

    //بررسی خالی نبودن روش انجام نمونه در لیست نمونه ها
    var requests = medicalLaboratoryItem.medicalLaboratoryRequests;
    var reuestMethodEmptyError = 0;
    for (var i = 0; i < requests.length; i++) {
        if (requests[i].medicalLaboratoryRequestMethods == null || requests[i].medicalLaboratoryRequestMethods.length == 0 || requests[i].medicalLaboratoryRequestMethods.filter(a => !a.isRemoved).length == 0)
            reuestMethodEmptyError++;
    }
    if (reuestMethodEmptyError > 0) {
        var msg_temp_srv = alertify.warning("روش انجام نمونه را وارد کنید");
        msg_temp_srv.delay(prMsg.delay);
        await disableSaveButtonAsync(false);
        return;
    }

    //بررسی خالی نبودن تشخیص ها

    if (medicalLaboratoryItem.medicalLaboratoryDiagnosises.filter(a => !a.isRemoved).length === 0) {
        var msg_temp_srv = alertify.warning("تشخیص را وارد کنید");
        msg_temp_srv.delay(prMsg.delay);
        await disableSaveButtonAsync(false);
        return;
    }

    for (var i = 0; i < arr_TempDiagnosis.length; i++)
        arr_TempDiagnosis[i].admissionId = admissionIdentity;

    var model = {
        id: medicalLaboratoryId,
        admissionId: admissionIdentity,
        relatedHID: medicalLaboratoryHID,
        lifeCycleStateId: 0,
        referringDoctorId: referringDoctorId,
        medicalLaboratoryRequests: medicalLaboratoryItem.medicalLaboratoryRequests,
        medicalLaboratoryDiagnosises: medicalLaboratoryItem.medicalLaboratoryDiagnosises,
        pathology: medicalLaboratoryItem.medicalLaboratoryPathology
    };

    saveMedicalLaboratoryAsync(model).then(async (data) => {
        if (data.successfull) {
            setTimeout(() => {
                navigation_item_click("/MC/MedicalLaboratory", "لیست آزمایشگاه");
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

function validateMedicalLaboratoryForm() {

    var validate = formMedicalLaboratory.validate();
    validateSelect2(formMedicalLaboratory);
    return !validate;
}

function validateAllTab() {
    if (arr_TempLabRequest.length === 0 && arr_TempLabTestResult.length === 0 &&
        arr_TempResultRow.length === 0 && arr_TempResultRowBoolean.length === 0 && arr_TempResultRowCoded.length === 0 && arr_TempResultRowCount.length === 0 &&
        arr_TempResultRowOrdinal.length === 0 && arr_TempResultRowProportion.length === 0 && arr_TempResultRowQuantity.length === 0 &&
        arr_TempReferenceRange.length === 0 && arr_TempDiagnosis.length === 0
    ) {
        return true;
    }
    return false;
}

async function saveMedicalLaboratoryAsync(medicalLaboratory) {

    let result = await $.ajax({
        url: viewData_save_MedicalLaboratory,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(medicalLaboratory),
        success: function (data) {
            return data;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_save_MedicalLaboratory);
            return {
                status: -100,
                statusMessage: "عملیات با خطا مواجه شد",
                successfull: false
            };
        }
    });

    return result;
}

async function bindMedicalLaboratoryElement() {

    vizibleResultRow();

    $("#resultType").select2();
    fill_select2(viewData_get_specimenTypeId, "specimenTypeId", true, 0);
    fill_select2(viewData_get_collectionProcedureId, "collectionProcedureId", true, 0);
    fill_select2(viewData_get_snomedctMethodId, "methodId", true, 0, true);
    fill_select2(viewData_get_specimenAdequacy, "adequacyForTestingId", true);

    fill_select2(viewData_get_testResultCodedType, "resultTypeDetailModal #testResultCoded", true, 0, true);
    fill_select2(viewData_get_testResultUnit, "resultTypeDetailModal #testResultUnitId", true, 0, true);
    fill_select2(viewData_get_testResultId, "resultTypeDetailModal #testResultOrdinal", true);

    fill_select2(viewData_get_testResultType, "resultRowBox #testResultTypeId", true, 0);
    fill_select2(viewData_get_testResultCodedType, "resultRowBox #testResultCoded", true, 0, true);
    fill_select2(viewData_get_testResultUnit_resultType, "resultRowBox #testResultUnitId", true, 0, true);
    fill_select2(viewData_get_testResultId, "resultRowBox #testResultOrdinal", true);


    fill_select2(viewData_get_laboratoryPanelId, "laboratoryPanelId", true, 0, true);
    fill_select2(viewData_get_resultStatusId, "resultStatusId", true);
    fill_select2(viewData_get_testNameId, "testNameId", true, 0, true);
    fill_select2(viewData_get_testPanelId, "testPanelId", true, 0, true);

    fill_select2(viewData_get_ageRangeId, "ageRangeId", true);
    fill_select2(viewData_get_gestationAgeRangeId, "gestationAgeRangeId", true);

    fill_select2(viewData_get_hormonalPhaseId, "hormonalPhaseId", true);

    fill_select2(viewData_get_referenceStatusId, "referenceStatusId", true);
    fill_select2(viewData_get_speciesId, "speciesId", true);

    fill_select2(viewData_get_diagnosisReasonId, "diagnosisReasonId", true, 0, true);

    fill_select2(viewData_get_diagnosisStatusId, "pathologyDiagnosisStatusId", true, 0, false);
    fill_select2(viewData_get_diagnosisStatusId, "diagnosisStatusId", true, 0, false);

    fill_select2(viewData_get_morphologyId, "morphologyId", true, 0, false);
    fill_select2(viewData_get_morphologyDifferentiationId, "morphologyDifferentiationId", true, 0, false);
    fill_select2(viewData_get_topographyId, "topographyId", true, 0, false);
    fill_select2(viewData_get_topographyLateralityId, "topographyLateralityId", true, 0, false);
    fill_select2(viewData_get_Serverity, "serverityId", true);
    fill_select2(viewData_get_PathologyDiagnosis, "pathologyDiagnosis", true, 0, true, 4);

    setTimeout(function () {
        $("#resultRowBox #resultType").val("0").trigger("change");
    }, 100);

    if (medicalLaboratoryId != 0) {
        $("#choiceOfAdmission").css("display", "none")
        getMedicalLaboratoryData(medicalLaboratoryId);
    }

}

function focusSearchedRow(i) {
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
    admissionIdentity = +data.admissionId;
    referringDoctorId = data.attenderId;
    checkPatientNationalCode = data.patientNationalCode;
}

function displayAdmission(id,elm) {
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

function getMedicalLaboratoryData(admId, headerPagination = 0) {

    let model = {
        labId: admId,
        headerPagination: headerPagination
    };

    $.ajax({
        url: viewData_get_MedicalLaboratoryGet,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (data) {
            medicalLaboratoryItem = data;
            fillMedicalLaboratoryDetails(medicalLaboratoryItem);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_get_MedicalLaboratoryGet);
        }
    });
};

function fillMedicalLaboratoryDetails(data) {

    if (data !== null) {
        $("#userFullName").val(`${data.userId} - ${data.userFullName}`);
        $("#labRequestBox").removeClass("displaynone");

        $("#resultRowBox #resultType").val("0").trigger("change");

        medicalLaboratoryHID = data.relatedHID;
        $("#medicalLaboratoryId").val(medicalLaboratoryHID);
        if (+data.admissionId > 0) {
            fillAdmission(data);
            admissionIdentity = data.admissionId;
        }
        var requests = data.medicalLaboratoryRequests == undefined ? [] : data.medicalLaboratoryRequests.filter(a => !a.isRemoved || a.isRemoved == undefined);
        var diagnosises = data.medicalLaboratoryDiagnosises == undefined ? [] : data.medicalLaboratoryDiagnosises.filter(a => !a.isRemoved || a.isRemoved == undefined);
        var pathology = data.medicalLaboratoryPathology == undefined ? [] : data.medicalLaboratoryPathology.filter(a => !a.isRemoved || a.isRemoved == undefined);

        $("#medicalLaboratoryRequests").html($("#emptyRowRequests").html());
        $("#medicalLaboratoryRequestMethods").html($("#emptyRowRequestMethods").html());
        $("#subMedicalLaboratoryRequestMethods").html($("#emptyRowSubRequestMethods").html());
        $("#medicalLaboratoryResults").html($("#emptyRowResults").html());
        $("#subMedicalLaboratoryResults").html($("#emptyRowSubResults").html());
        $("#medicalLaboratoryThopologyResults").html($("#emptyRowPathology").html());
        $("#medicalLaboratoryReferences").html($("#emptyRowReferences").html());
        $("#pathologyResults").html($("#emptyRow").html());

        if (requests != null && requests.length > 0) {
            fillMedicalLaboratoryRequests(requests);
        }

        $("#medicalLaboratoryDiagnosises").html($("#emptyRowDiagnosises").html());
        if (diagnosises != null && diagnosises.length > 0) {
            fillMedicalLaboratoryDiagnosis(diagnosises);
        }

        if (pathology != null && pathology.length > 0) {
            fillMedicalLaboratoryPathology(pathology);
        }

    }
};


////

async function loadingAsync(loading, elementId) {

    if (loading)
        $(`#${elementId} i`).addClass(`fa fa-spinner fa-spin`);
    else
        $(`#${elementId} i`).removeClass("fa fa-spinner fa-spin")
}

function appendTempadmissionField(data) {
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

function appendTempinsuranceField(data) {
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

$("#addMedicalLaboratoryRequest").on("click", function () {

    if (!requestEdited && $("#medicalLaboratoryRequests tr").length >= 1) {
        var msgNotDefined = alertify.warning("بیشتر از یک سطر نمیتوانید ثبت کنید");
        msgNotDefined.delay(prMsg.delay);
        return;
    }

    var validate = FormMedicalLaboratory.validate();
    validateSelect2(FormMedicalLaboratory);
    if (!validate) return;

    var idLabRequest = 1;

    var requestItem = {
        medicalLaboratoryId: medicalLaboratoryId,
        rowNumber: 0,
        id: 0,
        specimenCode: +$("#specimenCode").val(),
        specimenDateTimePersian: $("#specimenDateTime").val(),
        specimenTypeId: +$("#specimenTypeId").val(),
        specimenTypeName: $("#specimenTypeId").select2('data').length > 0 ? $("#specimenTypeId").select2('data')[0].text : "",
        adequacyForTestingId: +$("#adequacyForTestingId").val(),
        adequacyForTestingName: $("#adequacyForTestingId").select2('data').length > 0 ? $("#adequacyForTestingId").select2('data')[0].text : "",
        collectionProcedureId: +$("#collectionProcedureId").val(),
        collectionProcedureName: $("#collectionProcedureId").select2('data').length > 0 ? $("#collectionProcedureId").select2('data')[0].text : "",
        specimenIdentifier: $("#specimenIdentifier").val(),
    }

    if (!requestEdited) {
        if (medicalLaboratoryItem.medicalLaboratoryRequests != undefined && medicalLaboratoryItem.medicalLaboratoryRequests != null && medicalLaboratoryItem.medicalLaboratoryRequests.length != 0)
            idLabRequest = Math.max.apply(null,
                Object.keys(medicalLaboratoryItem.medicalLaboratoryRequests).map(function (e) {
                    return medicalLaboratoryItem.medicalLaboratoryRequests[e]['id'];
                })) + 1;
        else
            medicalLaboratoryItem.medicalLaboratoryRequests = [];
        requestItem.id = idLabRequest;
        requestItem.isAdded = true;
        medicalLaboratoryItem.medicalLaboratoryRequests.push(requestItem);
    }
    else {
        for (var i = 0; i < medicalLaboratoryItem.medicalLaboratoryRequests.length; i++) {
            if (medicalLaboratoryItem.medicalLaboratoryRequests[i].id == mdRequestSelectedId) {
                medicalLaboratoryItem.medicalLaboratoryRequests[i].specimenCode = requestItem.specimenCode;
                medicalLaboratoryItem.medicalLaboratoryRequests[i].specimenDateTimePersian = requestItem.specimenDateTimePersian;
                medicalLaboratoryItem.medicalLaboratoryRequests[i].specimenTypeId = requestItem.specimenTypeId;
                medicalLaboratoryItem.medicalLaboratoryRequests[i].specimenTypeName = requestItem.specimenTypeName;
                medicalLaboratoryItem.medicalLaboratoryRequests[i].adequacyForTestingId = requestItem.adequacyForTestingId;
                medicalLaboratoryItem.medicalLaboratoryRequests[i].adequacyForTestingName = requestItem.adequacyForTestingName;
                medicalLaboratoryItem.medicalLaboratoryRequests[i].collectionProcedureId = requestItem.collectionProcedureId;
                medicalLaboratoryItem.medicalLaboratoryRequests[i].collectionProcedureName = requestItem.collectionProcedureName;
                medicalLaboratoryItem.medicalLaboratoryRequests[i].specimenIdentifier = requestItem.specimenIdentifier;
            }
        }
        requestEdited = false;
    }

    resetMedicalLaboratoryForm("LabRequest");
    fillMedicalLaboratoryDetails(medicalLaboratoryItem);

});

function fillMedicalLaboratoryRequests(medicalLaboratoryRequests, tSave = "INS") {

    $("#medicalLaboratoryRequests").html("");
    for (var i = 0; i < medicalLaboratoryRequests.length; i++) {
        var item = medicalLaboratoryRequests[i];
        var emptyRow = $("#medicalLaboratoryRequests").find("#emptyRow");


        if (emptyRow.length > 0)
            $("#medicalLaboratoryRequests").html("");

        var compoundButton = "";

        compoundButton = `<button type="button" onclick="addCompoundLabTestResult(${item.id})" class="btn blue_outline_1 ml-2" title="روش های آزمایش">
                                   <i class="fa fa-list"></i>
                                  </button>`

        dataOutput = `<tr id="ah_${item.id}"  onclick="addCompoundLabTestResult(${item.id})" rowid="${item.id}">
                          <td>${i + 1}</td>
                          <td>${item.specimenCode != 0 ? item.specimenCode : ""}</td>
                          <td>${item.specimenDateTimePersian}</td>
                          <td>${item.specimenTypeId != 0 ? `${item.specimenTypeName}` : ""}</td>
                          <td>${item.adequacyForTestingId != 0 ? `${item.adequacyForTestingName}` : ""}</td>
                          <td>${item.collectionProcedureId != 0 ? `${item.collectionProcedureName}` : ""}</td>
                          <td>${item.specimenIdentifier}</td>
                          <td id="operationah_${item.rowNumber}">
                              <button type="button" id="deleteah_${item.id}" onclick="removeItemByModelName('medicalLaboratoryRequests',${item.id})" class="btn maroon_outline" data-original-title="حذف سطر" style="margin-left:7px">
                                   <i class="fa fa-trash"></i>
                              </button>
                              <button type="button" id="Editah_${item.id}" onclick="EditFromtempLabRequest(${item.id})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                   <i class="fa fa-pen"></i>
                              </button>${compoundButton}
                          </td>
                     </tr>`

        $(dataOutput).appendTo("#medicalLaboratoryRequests");

    }
    if (mdRequestSelectedId == 0)
        $("#medicalLaboratoryRequests tr:first").addClass("highlight");
    else
        $(`#medicalLaboratoryRequests tr[rowid='${mdRequestSelectedId}']`).addClass("highlight");


    var medicalLaboratoryRequestMethods = mdRequestSelectedId == 0 ? medicalLaboratoryRequests[0].medicalLaboratoryRequestMethods : medicalLaboratoryRequests.filter(a => a.id == mdRequestSelectedId)[0].medicalLaboratoryRequestMethods;
    var requestMethods = medicalLaboratoryRequestMethods != null ? medicalLaboratoryRequestMethods.filter(a => !a.isRemoved || a.isRemoved == undefined) : null;
    if (requestMethods != null && requestMethods.length > 0)
        fillMedicalLaboratoryRequestMethods(requestMethods)
}




function removeItemByModelName(modelName, id) {

    switch (modelName) {
        case "medicalLaboratoryRequests":
            for (var i = 0; i < medicalLaboratoryItem.medicalLaboratoryRequests.length; i++) {
                var item = medicalLaboratoryItem.medicalLaboratoryRequests[i];
                if (item.id == id)
                    item.isRemoved = true;
            }
            resetMedicalLaboratoryForm("LabRequest");
            requestRemoved = true;
            fillMedicalLaboratoryDetails(medicalLaboratoryItem);

            break;
        case "medicalLaboratoryRequestMethods":
            var requestSelectedId = +$('#medicalLaboratoryRequests tr.highlight').attr("rowid");
            var requestSelected = medicalLaboratoryItem.medicalLaboratoryRequests.filter(a => a.id == requestSelectedId)[0];
            for (var i = 0; i < requestSelected.medicalLaboratoryRequestMethods.length; i++) {
                var item = requestSelected.medicalLaboratoryRequestMethods[i];
                if (item.id == id)
                    item.isRemoved = true;
            }
            resetMedicalLaboratoryForm("labTestResult");
            requestMethodRemoved = true;
            fillMedicalLaboratoryDetails(medicalLaboratoryItem);
            break;
        case "medicalLaboratoryResults":
            var requestSelectedId = +$('#medicalLaboratoryRequests tr.highlight').attr("rowid");
            var requestSelected = medicalLaboratoryItem.medicalLaboratoryRequests.filter(a => a.id == requestSelectedId)[0];
            var requestMethodSelectedId = +$('#subMedicalLaboratoryRequestMethods tr.highlight').attr("rowid");
            var requestMethodSelected = requestSelected.medicalLaboratoryRequestMethods.filter(a => a.id == requestMethodSelectedId)[0];
            for (var i = 0; i < requestMethodSelected.medicalLaboratoryResults.length; i++) {
                var item = requestMethodSelected.medicalLaboratoryResults[i];
                if (item.id == id)
                    item.isRemoved = true;
            }
            resetMedicalLaboratoryForm("resultRow");
            resultRemoved = true;
            fillMedicalLaboratoryDetails(medicalLaboratoryItem);
            break;
        case "medicalLaboratoryReferences":
            var requestSelectedId = +$('#medicalLaboratoryRequests tr.highlight').attr("rowid");
            var requestSelected = medicalLaboratoryItem.medicalLaboratoryRequests.filter(a => a.id == requestSelectedId)[0];
            var requestMethodSelectedId = +$('#subMedicalLaboratoryRequestMethods tr.highlight').attr("rowid");
            var requestMethodSelected = requestSelected.medicalLaboratoryRequestMethods.filter(a => a.id == requestMethodSelectedId)[0];
            var requestResultSelectedId = +$('#subMedicalLaboratoryResults tr.highlight').attr("rowid");
            var requestResultSelected = requestMethodSelected.medicalLaboratoryResults.filter(a => a.id == requestResultSelectedId)[0];

            for (var i = 0; i < requestResultSelected.medicalLaboratoryReferences.length; i++) {
                var item = requestResultSelected.medicalLaboratoryReferences[i];
                if (item.id == id)
                    item.isRemoved = true;
            }
            resetMedicalLaboratoryForm("referenceRange");
            referenceRemoved = true;
            fillMedicalLaboratoryDetails(medicalLaboratoryItem);
            break;
        case "medicalLaboratoryDiagnosises":
            for (var i = 0; i < medicalLaboratoryItem.medicalLaboratoryDiagnosises.length; i++) {
                var item = medicalLaboratoryItem.medicalLaboratoryDiagnosises[i];
                if (item.id == id)
                    item.isRemoved = true;
            }
            diagRemoved = true;
            fillMedicalLaboratoryDetails(medicalLaboratoryItem);
            break;
        case "medicalLaboratoryPathology":

            for (var i = 0; i < medicalLaboratoryItem.medicalLaboratoryPathology.length; i++) {
                for (var j = 0; j < medicalLaboratoryItem.medicalLaboratoryPathology[i].pathologyDiagnosis.length; j++) {
                    var item = medicalLaboratoryItem.medicalLaboratoryPathology[i];
                    var itemD = medicalLaboratoryItem.medicalLaboratoryPathology[i].pathologyDiagnosis[j];
                    if (itemD.id == id) {
                        itemD.isRemoved = true;
                        //item.isRemoved = true;
                        medicalLaboratoryItem.medicalLaboratoryPathology[i].pathologyDiagnosis.splice(j, 1);

                    }
                }


            }

            resetMedicalLaboratoryForm("pathology");
            pathologyRemoved = true;
            fillMedicalLaboratoryDetails(medicalLaboratoryItem);
            break;
    }
}

function EditFromtempLabRequest(id) {

    $("#medicalLaboratoryRequests tr").removeClass("highlight");
    $(`#ah_${id}`).addClass("highlight");
    $(`#ah_${id}`).attr("rowid", id);
    requestEdited = true;

    var item = medicalLaboratoryItem.medicalLaboratoryRequests.filter(a => a.id === id)[0];

    $("#specimenTypeId").val(item.specimenTypeId);
    detailC = new Option(`${item.specimenTypeName}`, item.specimenTypeId, true, true);
    $("#specimenTypeId").append(detailC).trigger('change');
    detailC = "";

    $("#adequacyForTestingId").val(item.adequacyForTestingId).trigger('change');


    $("#collectionProcedureId").val(item.collectionProcedureId);
    detailC = new Option(`${item.collectionProcedureName}`, item.collectionProcedureId, true, true);
    $("#collectionProcedureId").append(detailC).trigger('change');
    detailC = "";

    $("#specimenCode").val(item.specimenCode);

    $("#specimenDateTime").val(item.specimenDateTimePersian);

    $("#specimenIdentifier").val(item.specimenIdentifier);

    $("#specimenCode").focus();
}

$("#canceledLabRequest").on("click", function () {

    $("#labRequestBox .select2").val("").trigger("change");
    $("#labRequestBox input.form-control").val("");
    $("#specimenCode").focus();
    requestEdited = false;

});

$("#canceledLabRequestMethod").on("click", function () {

    $("#requestMethodBox .select2").val("").trigger("change");
    $("#requestMethodBox input.form-control").val("");
    $("#resultDateTime").focus();
    requestMethodEdited = false;

});

$("#canceledLabResult").on("click", function () {

    $("#resultRowBox #resultType").val("0").trigger("change");
    $("#resultRowBox .select2").val("").trigger("change");
    $("#resultRowBox input.form-control").val("");
    $("#resultDateTime").focus();
    requestResultEdited = false;

});

$("#canceledLabReference").on("click", function () {

    $("#referenceRangeBox .select2").val("").trigger("change");
    $("#referenceRangeBox input.form-control").val("");
    $("#ageRangeId").select2('focus');
    referenceEdited = false;

});

$("#addDiagnosis").on("click", function () {

    var validate = $("#medicalLaboratoryDiagnosisForm").parsley().validate();
    validateSelect2($("#medicalLaboratoryDiagnosisForm").parsley());
    if (!validate) return;

    var idDiagItem = 1;
    var diagnosisItem = {
        medicalLaboratoryId: medicalLaboratoryId,
        statusId: +$("#diagnosisStatusId").val(),
        diagnosisStatusName: $("#diagnosisStatusId").select2('data').length > 0 ? $("#diagnosisStatusId").select2('data')[0].text : "",
        diagnosisReasonId: +$("#diagnosisReasonId").val(),
        diagnosisReasonName: $("#diagnosisReasonId").select2('data').length > 0 ? $("#diagnosisReasonId").select2('data')[0].text : "",
        serverityId: +$("#serverityId").val(),
        serverityName: $("#serverityId").select2('data').length > 0 ? $("#serverityId").select2('data')[0].text : "",
        comment: $("#comment").val()
    }

    if (+$("#diagnosisStatusId").val() == 0) {
        var msgNotDefined = alertify.warning(prMsg.selectStatusIdDiagnosis);
        msgNotDefined.delay(prMsg.delay);
        return;
    }

    if (!diagnosisEdited) {
        checkExist = medicalLaboratoryItem.medicalLaboratoryDiagnosises != undefined && medicalLaboratoryItem.medicalLaboratoryDiagnosises != null && medicalLaboratoryItem.medicalLaboratoryDiagnosises.length > 0 ? checkNotExistValueInArray(medicalLaboratoryItem.medicalLaboratoryDiagnosises, 'statusId', +$("#diagnosisStatusId").val()) : true;

        if (!checkExist) {
            var msgExist = alertify.warning(prMsg.existStatusIdDiagnosis);
            msgExist.delay(prMsg.delay);
            $("#diagnosisStatusId").select2("focus");
            return;
        }

        if (medicalLaboratoryItem.medicalLaboratoryDiagnosises != undefined && medicalLaboratoryItem.medicalLaboratoryDiagnosises != null && medicalLaboratoryItem.medicalLaboratoryDiagnosises.length != 0)
            idDiagItem = Math.max.apply(null,
                Object.keys(medicalLaboratoryItem.medicalLaboratoryDiagnosises).map(function (e) {
                    return medicalLaboratoryItem.medicalLaboratoryDiagnosises[e]['id'];
                })) + 1;
        else
            medicalLaboratoryItem.medicalLaboratoryDiagnosises = [];

        diagnosisItem.id = idDiagItem;
        diagnosisItem.isAdded = true;
        medicalLaboratoryItem.medicalLaboratoryDiagnosises.push(diagnosisItem);
    }
    else {
        for (var i = 0; i < medicalLaboratoryItem.medicalLaboratoryDiagnosises.length; i++) {
            if (medicalLaboratoryItem.medicalLaboratoryDiagnosises[i].id == mdDiagnosisId) {
                medicalLaboratoryItem.medicalLaboratoryDiagnosises[i].statusId = diagnosisItem.statusId;
                medicalLaboratoryItem.medicalLaboratoryDiagnosises[i].diagnosisStatusName = diagnosisItem.diagnosisStatusName;
                medicalLaboratoryItem.medicalLaboratoryDiagnosises[i].diagnosisReasonId = diagnosisItem.diagnosisReasonId;
                medicalLaboratoryItem.medicalLaboratoryDiagnosises[i].diagnosisReasonName = diagnosisItem.diagnosisReasonName;
                medicalLaboratoryItem.medicalLaboratoryDiagnosises[i].serverityId = diagnosisItem.serverityId;
                medicalLaboratoryItem.medicalLaboratoryDiagnosises[i].serverityName = diagnosisItem.serverityName;
                medicalLaboratoryItem.medicalLaboratoryDiagnosises[i].comment = diagnosisItem.comment;
            }
        }
        diagnosisEdited = false;
    }

    resetMedicalLaboratoryForm("diag");
    fillMedicalLaboratoryDetails(medicalLaboratoryItem);
});

function modelAppendDiagnosis(rowNumber, typeSave) {

    var modelDiag = {
        admissionId: 0,
        rowNumber: rowNumber,
        statusId: +$("#diagnosisStatusId").val(),
        statusName: $("#diagnosisStatusId").select2('data').length > 0 ? $("#diagnosisStatusId").select2('data')[0].text : "",
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

    $("#diagnosisBox .select2").val("").trigger("change");
    $("#diagnosisBox .funkyradio input:checkbox").prop("checked", false).trigger("change");
    $("#diagnosisBox input.form-control").val("");
    $("#diagnosisStatusId").select2("focus");

    typeSaveDiag = "INS";

});

function fillMedicalLaboratoryDiagnosis(medicalLaboratoryDiagnosises, tSave = "INS") {
    $("#medicalLaboratoryDiagnosises").html("");

    for (var i = 0; i < medicalLaboratoryDiagnosises.length; i++) {
        var item = medicalLaboratoryDiagnosises[i];

        var emptyRow = $("#medicalLaboratoryDiagnosises").find("#emptyRow");

        if (emptyRow.length > 0)
            $("#medicalLaboratoryDiagnosises").html("");

        var output = `<tr id="dg_${item.id}" rowid="${item.id}" ">
                          <td>${i + 1}</td>
                          <td>${item.statusId != 0 ? `${item.diagnosisStatusName}` : ""}</td>
                          <td>${item.diagnosisReasonId != 0 ? `${item.diagnosisReasonName}` : ""}</td>
                          <td>${item.serverityId != -1 ? `${item.serverityName}` : ""}</td>
                          <td>${item.comment}</td>
                          <td id="operationdg_${item.id}">
                              <button type="button" id="deleteDiag_${item.id}" onclick="removeItemByModelName('medicalLaboratoryDiagnosises',${item.id})" class="btn maroon_outline" data-original-title="حذف سطر" style="margin-left:7px">
                                   <i class="fa fa-trash"></i>
                              </button><button type="button" id="EditDiag_${item.id}" onclick="EditFromTempDiag(${item.id})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                   <i class="fa fa-pen"></i>
                              </button>
                          </td>
                     </tr>`

        $(output).appendTo("#medicalLaboratoryDiagnosises");
    }
    resetMedicalLaboratoryForm("diag");
}

function EditFromTempDiag(id) {

    $("#diagnosisStatusId").select2("focus");
    $("#medicalLaboratoryDiagnosises tr").removeClass("highlight");
    $(`#dg_${id}`).addClass("highlight");
    mdDiagnosisId = id;
    diagnosisEdited = true;
    var arr_TempDiagAppend = "";
    var item = medicalLaboratoryItem.medicalLaboratoryDiagnosises.filter(a => a.id === id)[0];

    $("#diagnosisStatusId").val(item.statusId).trigger('change');

    $("#diagnosisReasonId").val(item.diagnosisReasonId);
    arr_TempDiagAppend = new Option(`${item.diagnosisReasonName}`, item.diagnosisReasonId, true, true);
    $("#diagnosisReasonId").append(arr_TempDiagAppend).trigger('change');
    arr_TempDiagAppend = "";

    $("#serverityId").val(item.serverityId).trigger('change');

    $("#comment").val(item.comment);
}



//**

$("#addTopologyResultRow").on("click", function () {

    var validate = $("#pathologyDiagnosisResultForm").parsley().validate();
    validateSelect2($("#pathologyDiagnosisResultForm").parsley());
    if (!validate) return;

    var idPathItem = 1;
    var pathology = {
        clinicalInformation: $("#clinicalInformation").val(),
        macroscopicExamination: $("#macroscopicExamination").val(),
        microscopicExamination: $("#microscopicExamination").val(),
        pathologyDiagnosis: [{
            id: 0,
            rowNumber: 0,
            diagnosisStatusId: +$("#pathologyDiagnosisStatusId").val(),
            diagnosisStatusName: $("#pathologyDiagnosisStatusId").select2('data').length > 0 ? $("#pathologyDiagnosisStatusId").select2('data')[0].text : "",
            diagnosisId: +$("#pathologyDiagnosis").val(),
            diagnosisName: $("#pathologyDiagnosis").select2('data').length > 0 ? $("#pathologyDiagnosis").select2('data')[0].text : "",

            morphology: +$("#morphologyId").val(),
            morphologyName: $("#morphologyId").select2('data').length > 0 ? $("#morphologyId").select2('data')[0].text : "",
            morphologyDifferentiationId: +$("#morphologyDifferentiationId").val(),
            morphologyDifferentiationName: $("#morphologyDifferentiationId").select2('data').length > 0 ? $("#morphologyDifferentiationId").select2('data')[0].text : "",
            topographyId: +$("#topographyId").val(),
            topographyName: $("#topographyId").select2('data').length > 0 ? $("#topographyId").select2('data')[0].text : "",
            topographyLateralityId: +$("#topographyLateralityId").val(),
            topographyLateralityName: $("#topographyLateralityId").select2('data').length > 0 ? $("#topographyLateralityId").select2('data')[0].text : "",
            description: $("#pathologyDiagnosisDescription").val()
        }]
    }

    var pItem = {
        id: 0,
        rowNumber: 0,
        diagnosisStatusId: +$("#pathologyDiagnosisStatusId").val(),
        diagnosisStatusName: $("#pathologyDiagnosisStatusId").select2('data').length > 0 ? $("#pathologyDiagnosisStatusId").select2('data')[0].text : "",
        diagnosisId: +$("#pathologyDiagnosis").val(),
        diagnosisName: $("#pathologyDiagnosis").select2('data').length > 0 ? $("#pathologyDiagnosis").select2('data')[0].text : "",

        morphology: +$("#morphologyId").val(),
        morphologyName: $("#morphologyId").select2('data').length > 0 ? $("#morphologyId").select2('data')[0].text : "",
        morphologyDifferentiationId: +$("#morphologyDifferentiationId").val(),
        morphologyDifferentiationName: $("#morphologyDifferentiationId").select2('data').length > 0 ? $("#morphologyDifferentiationId").select2('data')[0].text : "",
        topographyId: +$("#topographyId").val(),
        topographyName: $("#topographyId").select2('data').length > 0 ? $("#topographyId").select2('data')[0].text : "",
        topographyLateralityId: +$("#topographyLateralityId").val(),
        topographyLateralityName: $("#topographyLateralityId").select2('data').length > 0 ? $("#topographyLateralityId").select2('data')[0].text : "",
        description: $("#pathologyDiagnosisDescription").val()
    }

    if (!pathologyEdited) {

        if (medicalLaboratoryItem.medicalLaboratoryPathology != undefined
            && medicalLaboratoryItem.medicalLaboratoryPathology != null && medicalLaboratoryItem.medicalLaboratoryPathology.length != 0)
            idPathItem = Math.max.apply(null,
                Object.keys(medicalLaboratoryItem.medicalLaboratoryPathology[0].pathologyDiagnosis).map(function (e) {
                    return medicalLaboratoryItem.medicalLaboratoryPathology[0].pathologyDiagnosis[e]['id'];
                })) + 1;
        else {
            medicalLaboratoryItem.medicalLaboratoryPathology = [];
            medicalLaboratoryItem.medicalLaboratoryPathology.pathologyDiagnosis = [];
        }

        pathology.pathologyDiagnosis[0].id = idPathItem;
        pItem.id = idPathItem;
        pathology.isAdded = true;
        if (medicalLaboratoryItem.medicalLaboratoryPathology.length > 0)
            medicalLaboratoryItem.medicalLaboratoryPathology[0].pathologyDiagnosis.push(pItem);
        else
            medicalLaboratoryItem.medicalLaboratoryPathology.push(pathology);
    }
    else {
        var pathologyItem;
        for (var i = 0; i < medicalLaboratoryItem.medicalLaboratoryPathology.length; i++) {
            for (var j = 0; j < medicalLaboratoryItem.medicalLaboratoryPathology[0].pathologyDiagnosis.length; j++) {
                if (medicalLaboratoryItem.medicalLaboratoryPathology[i].pathologyDiagnosis[j].id == mdPathologyId) {
                    pathologyItem = medicalLaboratoryItem.medicalLaboratoryPathology[0].pathologyDiagnosis[j];

                    medicalLaboratoryItem.medicalLaboratoryPathology[i].clinicalInformation = pathology.clinicalInformation;
                    medicalLaboratoryItem.medicalLaboratoryPathology[i].macroscopicExamination = pathology.macroscopicExamination;
                    medicalLaboratoryItem.medicalLaboratoryPathology[i].microscopicExamination = pathology.microscopicExamination;
                    medicalLaboratoryItem.medicalLaboratoryPathology[i].pathologyDiagnosis[j].morphology = pathology.pathologyDiagnosis[0].morphology;
                    medicalLaboratoryItem.medicalLaboratoryPathology[i].pathologyDiagnosis[j].morphologyName = pathology.pathologyDiagnosis[0].morphologyName;
                    medicalLaboratoryItem.medicalLaboratoryPathology[i].pathologyDiagnosis[j].morphologyDifferentiationId = pathology.pathologyDiagnosis[0].morphologyDifferentiationId;
                    medicalLaboratoryItem.medicalLaboratoryPathology[i].pathologyDiagnosis[j].morphologyDifferentiationName = pathology.pathologyDiagnosis[0].morphologyDifferentiationName;
                    medicalLaboratoryItem.medicalLaboratoryPathology[i].pathologyDiagnosis[j].topographyId = pathology.pathologyDiagnosis[0].topographyId;
                    medicalLaboratoryItem.medicalLaboratoryPathology[i].pathologyDiagnosis[j].topographyName = pathology.pathologyDiagnosis[0].topographyName;
                    medicalLaboratoryItem.medicalLaboratoryPathology[i].pathologyDiagnosis[j].topographyLateralityId = pathology.pathologyDiagnosis[0].topographyLateralityId;
                    medicalLaboratoryItem.medicalLaboratoryPathology[i].pathologyDiagnosis[j].topographyLateralityName = pathology.pathologyDiagnosis[0].topographyLateralityName;
                    medicalLaboratoryItem.medicalLaboratoryPathology[i].pathologyDiagnosis[j].diagnosisId = pathology.pathologyDiagnosis[0].diagnosisId;
                    medicalLaboratoryItem.medicalLaboratoryPathology[i].pathologyDiagnosis[j].diagnosisName = pathology.pathologyDiagnosis[0].diagnosisName;

                    medicalLaboratoryItem.medicalLaboratoryPathology[i].pathologyDiagnosis[j].diagnosisStatusId = pathology.pathologyDiagnosis[0].diagnosisStatusId;
                    medicalLaboratoryItem.medicalLaboratoryPathology[i].pathologyDiagnosis[j].diagnosisStatusName = pathology.pathologyDiagnosis[0].diagnosisStatusName;
                    medicalLaboratoryItem.medicalLaboratoryPathology[i].pathologyDiagnosis[j].description = pathology.pathologyDiagnosis[0].description;

                }
            }
        }
        pathologyEdited = false;
    }

    resetMedicalLaboratoryForm("pathology");
    fillMedicalLaboratoryDetails(medicalLaboratoryItem);

});


var fillMedicalLaboratoryPathology = (data, tSave = "INS") => {

    $("#pathologyResults").html("");

    var emptyRow = $("#pathologyResults").find("#emptyRow");

    if (emptyRow.length > 0)
        $("#pathologyResults").html("");

    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        $("#collapseOne").addClass(`show`);
        $("#clinicalInformation").val(item.clinicalInformation);
        $("#macroscopicExamination").val(item.macroscopicExamination);
        $("#microscopicExamination").val(item.microscopicExamination);

        for (var j = 0; j < item.pathologyDiagnosis.length; j++) {
            var itemDiagnosis = item.pathologyDiagnosis[j];

            var output = `<tr id="dg_${itemDiagnosis.id}" rowid="${itemDiagnosis.id}" ">
                          <td>${j + 1}</td>
                          <td>${item.clinicalInformation}</td>
                          <td>${item.macroscopicExamination}</td>
                          <td>${item.microscopicExamination}</td>
                          <td>${itemDiagnosis.morphology != 0 ? itemDiagnosis.morphologyName : ""}</td>
                          <td>${itemDiagnosis.morphologyDifferentiationId != 0 ? itemDiagnosis.morphologyDifferentiationName : ""}</td>
                          <td>${itemDiagnosis.topographyId != 0 ? itemDiagnosis.topographyName : ""}</td>
                          <td>${itemDiagnosis.topographyLateralityId != 0 ? itemDiagnosis.topographyLateralityName : ""}</td>
                          <td>${itemDiagnosis.diagnosisId != 0 ? itemDiagnosis.diagnosisName : ""}</td>
                          <td>${itemDiagnosis.diagnosisStatusId != 0 ? itemDiagnosis.diagnosisStatusName : ""}</td>
                          <td>${itemDiagnosis.description}</td>
                          <td id="operationp_${data.rowNumber}">
                              <button type="button" id="deletep_${item.id}" onclick="removeItemByModelName('medicalLaboratoryPathology',${itemDiagnosis.id})" class="btn maroon_outline" data-original-title="حذف سطر" style="margin-left:7px">
                                    <i class="fa fa-trash"></i>
                              </button>
                              <button type="button" id="Editp_${item.id}" onclick="EditFromTempPathology(${itemDiagnosis.id},${item.id})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                    <i class="fa fa-pen"></i>
                              </button>
                        </td>

                     </tr>`

            $(output).appendTo("#pathologyResults");
        }
        resetMedicalLaboratoryForm("pathology");
    }
}

$("#canceledTopologyResult").on("click", function () {

    $("#pathologyDiagnosisResultForm .select2").val("").trigger("change");
    $("#pathologyDiagnosisResultForm .funkyradio input:checkbox").prop("checked", false).trigger("change");
    $("#pathologyDiagnosisResultForm input.form-control").val("");
    $("#pathologyDiagnosis").focus();
    typeSavePathology = "INS";

});


var EditFromTempPathology = (itemId, id) => {

    $("#pathologyDiagnosis").select2("focus");
    $("#pathologyResults tr").removeClass("highlight");
    $(`#dg_${id}`).addClass("highlight");
    mdPathologyId = itemId;
    pathologyEdited = true;
    var path = medicalLaboratoryItem.medicalLaboratoryPathology.filter(a => a.id === id)[0];
    var pathItem = medicalLaboratoryItem.medicalLaboratoryPathology[0].pathologyDiagnosis.filter(a => a.id === itemId)[0];


    $("#clinicalInformation").val(path.clinicalInformation);
    $("#macroscopicExamination").val(path.macroscopicExamination);
    $("#microscopicExamination").val(path.microscopicExamination);
    $("#morphologyId").val(pathItem.morphology).trigger('change');
    $("#topographyId").val(pathItem.topographyId).trigger('change');
    $("#pathologyDiagnosisStatusId").val(pathItem.diagnosisStatusId).trigger('change');
    $("#morphologyDifferentiationId").val(pathItem.morphologyDifferentiationId).trigger('change');
    $("#topographyLateralityId").val(pathItem.topographyLateralityId).trigger('change');
    var pathologyDiagnosisVal = new Option(`${pathItem.diagnosisName}`, pathItem.diagnosisId, true, true);
    $("#pathologyDiagnosis").append(pathologyDiagnosisVal).trigger('change');
    $("#pathologyDiagnosisDescription").val(pathItem.description);


}

//**
var addCompoundLabTestResult = (id) => {
    $("#medicalLaboratoryRequests tr").removeClass("highlight");
    $(`#ah_${id}`).addClass("highlight");
    if (!requestRemoved)
        mdRequestSelectedId = id;
    else {
        mdRequestSelectedId = 0;
        requestRemoved = false;
    }

    mdRequestMethodSelectedId = 0;
    mdResultSelectedId = 0;
    mdReferenceSelectedId = 0;
    $("#labTestResultBox").prop("disabled", false);
    fillMedicalLaboratoryDetails(medicalLaboratoryItem);
}

$("#addLabTestResult").on("click", function () {
    var validate = $("#medicalLaboratoryRequestMethodForm").parsley().validate();
    validateSelect2($("#medicalLaboratoryRequestMethodForm").parsley());
    if (!validate) return;

    var idLabRequest = 1;

    var requestSelectedId = +$('#medicalLaboratoryRequests tr.highlight').attr("rowid");


    if (medicalLaboratoryItem.medicalLaboratoryRequests.length == 0) {
        var msg_temp_srv = alertify.warning("نمونه را وارد کنید");
        msg_temp_srv.delay(prMsg.delay);
        return
    }

    var requestSelected = medicalLaboratoryItem.medicalLaboratoryRequests.filter(a => a.id == requestSelectedId)[0];

    var requestMethodItem = {
        resultDateTimePersian: $("#resultDateTime").val(),
        processDateTimePersian: $("#processDateTime").val(),
        receiptDateTimePersian: $("#receiptDateTime").val(),
        methodId: +$("#methodId").val(),
        methodName: $("#methodId").select2('data').length > 0 ? $("#methodId").select2('data')[0].text : "",
        laboratoryPanelId: +$("#laboratoryPanelId").val(),
        laboratoryPanelName: $("#laboratoryPanelId").select2('data').length > 0 ? $("#laboratoryPanelId").select2('data')[0].text : "",
        methodDescription: $("#methodDescription").val()
    }

    if (!requestMethodEdited) {

        if (requestSelected.medicalLaboratoryRequestMethods != undefined && requestSelected.medicalLaboratoryRequestMethods != null && requestSelected.medicalLaboratoryRequestMethods.length != 0)
            idLabRequest = Math.max.apply(null,
                Object.keys(requestSelected.medicalLaboratoryRequestMethods).map(function (e) {
                    return requestSelected.medicalLaboratoryRequestMethods[e]['id'];
                })) + 1;
        else
            requestSelected.medicalLaboratoryRequestMethods = [];

        requestMethodItem.id = idLabRequest;
        requestMethodItem.medicalLaboratoryRequestId = requestSelectedId;
        requestMethodItem.isAdded = true;
        requestSelected.medicalLaboratoryRequestMethods.push(requestMethodItem);
    }
    else {

        for (var i = 0; i < requestSelected.medicalLaboratoryRequestMethods.length; i++) {
            if (requestSelected.medicalLaboratoryRequestMethods[i].id == mdRequestMethodSelectedId) {
                requestSelected.medicalLaboratoryRequestMethods[i].resultDateTimePersian = requestMethodItem.resultDateTimePersian;
                requestSelected.medicalLaboratoryRequestMethods[i].processDateTimePersian = requestMethodItem.processDateTimePersian;
                requestSelected.medicalLaboratoryRequestMethods[i].receiptDateTimePersian = requestMethodItem.receiptDateTimePersian;
                requestSelected.medicalLaboratoryRequestMethods[i].methodId = requestMethodItem.methodId;
                requestSelected.medicalLaboratoryRequestMethods[i].methodName = requestMethodItem.methodName;
                requestSelected.medicalLaboratoryRequestMethods[i].laboratoryPanelId = requestMethodItem.laboratoryPanelId;
                requestSelected.medicalLaboratoryRequestMethods[i].laboratoryPanelName = requestMethodItem.laboratoryPanelName;
                requestSelected.medicalLaboratoryRequestMethods[i].methodDescription = requestMethodItem.methodDescription;
            }
        }
        requestMethodEdited = false;
    }

    resetMedicalLaboratoryForm("labTestResult");
    fillMedicalLaboratoryDetails(medicalLaboratoryItem);

});

function fillMedicalLaboratoryRequestMethods(medicalLaboratoryRequestMethods) {

    $("#medicalLaboratoryRequestMethods").html("");
    $("#subMedicalLaboratoryRequestMethods").html("");
    for (var i = 0; i < medicalLaboratoryRequestMethods.length; i++) {
        var item = medicalLaboratoryRequestMethods[i];
        var mainRequestsEmptyRow = $("#medicalLaboratoryRequestMethods").find("#emptyRow");
        var subRequestsEmptyRow = $("#subMedicalLaboratoryRequestMethods").find("#emptyRow");

        if (mainRequestsEmptyRow.length > 0)
            $("#medicalLaboratoryRequestMethods").html("");
        if (subRequestsEmptyRow.length > 0)
            $("#subMedicalLaboratoryRequestMethods").html("");


        var compoundButton = `<button type="button" id="deletelabTestResultR_${item.id}" onclick="removeItemByModelName('medicalLaboratoryRequestMethods',${item.id})" class="btn maroon_outline" data-original-title="حذف سطر" style="margin-left:7px">
                           <i class="fa fa-trash"></i>
                          </button>
                          <button type="button" id="EditlabTestResultR_${item.id}" onclick="EditFromtempLabTestResult(${item.id})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                               <i class="fa fa-pen"></i>
                          </button>`;
        var mainRequestOutPut = `<tr id="drCR_${item.id}" onclick="tr_onclick('medicalLaboratoryRequestMethods',${item.id})" rowid="${item.id}">
                          <td>${i + 1}</td>
                          <td>${item.resultDateTimePersian}</td>
                          <td>${item.processDateTimePersian}</td>
                          <td>${item.receiptDateTimePersian}</td>
                          <td>${item.methodId != 0 ? `${item.methodName}` : ""}</td>
                          <td>${item.laboratoryPanelId != 0 ? `${item.laboratoryPanelName}` : ""}</td>
                          <td>${item.methodDescription}</td>
                          <td id="operationdrCR_${item.rowNumber}">
                              ${compoundButton} 
                          </td>
                     </tr>`

        var subRequestOutPut = `<tr id="drCR_${item.id}" onclick="addCompoundResultRow(${item.id})" rowid="${item.id}">
                          <td>${i + 1}</td>
                          <td>${item.resultDateTimePersian}</td>
                          <td>${item.processDateTimePersian}</td>
                          <td>${item.receiptDateTimePersian}</td>
                          <td>${item.methodId != 0 ? `${item.methodName}` : ""}</td>
                          <td>${item.laboratoryPanelId != 0 ? `${item.laboratoryPanelName}` : ""}</td>
                          <td>${item.methodDescription}</td>
                          <td id="operationdrCR_${item.id}">
                              <button type="button" onclick="addCompoundResultRow(${item.id})" class="btn blue_outline_1 ml-2" title="جواب های آزمایش">
                                   <i class="fa fa-list"></i>
                              </button>
                          </td>
                     </tr>`

        $(mainRequestOutPut).appendTo("#medicalLaboratoryRequestMethods");
        $(subRequestOutPut).appendTo("#subMedicalLaboratoryRequestMethods");

    }

    if (mdRequestMethodSelectedId == 0)
        $("#subMedicalLaboratoryRequestMethods tr:first").addClass("highlight");
    else
        $(`#subMedicalLaboratoryRequestMethods tr[rowid='${mdRequestMethodSelectedId}']`).addClass("highlight");

    var medicalLaboratoryResults = mdRequestMethodSelectedId == 0 ? medicalLaboratoryRequestMethods[0].medicalLaboratoryResults : medicalLaboratoryRequestMethods.filter(a => a.id == mdRequestMethodSelectedId)[0].medicalLaboratoryResults;
    var results = medicalLaboratoryResults != null ? medicalLaboratoryResults.filter(a => !a.isRemoved || a.isRemoved == undefined) : null;
    if (results != null && results.length > 0)
        fillMedicalLaboratoryResults(results);
    resetMedicalLaboratoryForm("labTestResultR");

}

function EditFromtempLabTestResult(id) {

    $("#medicalLaboratoryRequestMethods tr").removeClass("highlight");
    $(`#drC_${id}`).addClass("highlight");
    mdRequestMethodSelectedId = id;
    requestMethodEdited = true;

    var requestSelectedId = $("#medicalLaboratoryRequests tr.highlight").attr("rowid");
    var item = medicalLaboratoryItem.medicalLaboratoryRequests.filter(a => a.id == requestSelectedId)[0].medicalLaboratoryRequestMethods.filter(a => a.id === id)[0];

    $("#resultDateTime").val(item.resultDateTimePersian);
    $("#processDateTime").val(item.processDateTimePersian);
    $("#receiptDateTime").val(item.receiptDateTimePersian);

    $("#methodId").val(item.methodId);
    detailC = new Option(`${item.methodName}`, item.methodId, true, true);
    $("#methodId").append(detailC).trigger('change');
    detailC = "";

    $("#laboratoryPanelId").val(item.laboratoryPanelId);
    detailC = new Option(`${item.laboratoryPanelName}`, item.laboratoryPanelId, true, true);
    $("#laboratoryPanelId").append(detailC).trigger('change');
    detailC = "";

    $("#methodDescription").val(item.methodDescription);

    $("#resultDateTime").focus();
}

function tr_onclick(tableId, rowid) {
    $(`#${tableId} tr`).removeClass("highlight");
    $(`#${tableId} tr[rowid='${rowid}']`).addClass("highlight");
}

function rebuilLabTestResult() {

    var arrlabTestResult = arr_TempLabTestResult;
    var table = "tempLabTestResult";
    var tableR = "tempLabTestResultR";

    if (arrlabTestResult.length === 0)
        return;

    for (var b = 0; b < arrlabTestResult.length; b++) {
        arrlabTestResult[b].detailRowNumber = b + 1;

        if (typeof $(`#${table} tr`)[b] !== "undefined") {

            $(`#${table} tr`)[b].children[0].innerText = arrlabTestResult[b].detailRowNumber;
            $(`#${table} tr`)[b].setAttribute("id", `drCR_${arrlabTestResult[b].detailRowNumber}`);
            $(`#${table} tr`)[b].children[0].innerText = arrlabTestResult[b].detailRowNumber;

            if ($(`#${table} tr`)[b].children[5].innerHTML !== "") {

                $(`#${table} tr`)[b].children[5].innerHTML = `<button type="button" onclick="removeFromtempLabTestResult(${arrlabTestResult[b].detailRowNumber})" class="btn maroon_outline" data-toggle="tooltip" data-placement="bottom" title="حذف تشخیص">
                                                                     <i class="fa fa-trash"></i>
                                                           </button> <button type="button" onclick="EditFromTempLabTestResult(${arrlabTestResult[b].detailRowNumber})" class="btn green_outline_1" data-original-title="ویرایش تشخیص" style="margin-left:7px">
                                   <i class="fa fa-pen"></i>
                              </button>`;
            }
        }

        if (typeof $(`#${tableR} tr`)[b] !== "undefined") {

            $(`#${tableR} tr`)[b].children[0].innerText = arrlabTestResult[b].detailRowNumber;
            $(`#${tableR} tr`)[b].setAttribute("id", `drCR_${arrlabTestResult[b].detailRowNumber}`);
            $(`#${tableR} tr`)[b].children[0].innerText = arrlabTestResult[b].detailRowNumber;

            if ($(`#${tableR} tr`)[b].children[5].innerHTML !== "") {

                $(`#${tableR} tr`)[b].children[5].innerHTML = `<button type="button" onclick="removeFromtempLabTestResult(${arrlabTestResult[b].detailRowNumber})" class="btn maroon_outline" data-toggle="tooltip" data-placement="bottom" title="حذف تشخیص">
                                                                     <i class="fa fa-trash"></i>
                                                           </button> <button type="button" onclick="EditFromTempLabTestResult(${arrlabTestResult[b].detailRowNumber})" class="btn green_outline_1" data-original-title="ویرایش تشخیص" style="margin-left:7px">
                                   <i class="fa fa-pen"></i>
                              </button>`;
            }
        }
    }
    arr_TempLabRequest = arr_TempLabTestResult;
}

$("#canceledlabTestResult").on("click", function () {

    $("#toothBoxC .select2").val("").trigger("change");
    $("#toothBoxC input.form-control").val("");
    $("#toothStatusId").select2("focus");

    typeSavelabTestResult = "INS";

});

$("#labTestResultModal").on("shown.bs.modal", function () {


    $("#resultDateTime").focus();

    FormLabTestResult.reset();

});

$("#labTestResultModal").on("hidden.bs.modal", function () {

    currentLabRequestRowNumber = 0;

    $("#medicalLaboratoryRequests").html("");
});

$("#modalCloseLabTestResult").on("click", function () {

    modal_close("labTestResultModal");
});

function addCompoundResultRow(id) {

    $("#subMedicalLaboratoryRequests tr").removeClass("highlight");
    $(`#drCR_${id}`).addClass("highlight");
    mdRequestMethodSelectedId = id;
    mdResultSelectedId = 0;
    mdReferenceSelectedId = 0;
    fillMedicalLaboratoryDetails(medicalLaboratoryItem);

}

$("#addResultRow").on("click", function () {

    var validate = $("#medicalLaboratoryResultForm").parsley().validate();
    validateSelect2($("#medicalLaboratoryResultForm").parsley());
    if (!validate) return;

    var idResRequest = 1;

    var requestSelectedId = +$('#medicalLaboratoryRequests tr.highlight').attr("rowid");

    if (medicalLaboratoryItem.medicalLaboratoryRequests.length == 0) {
        var msg_temp_srv = alertify.warning("روش انجام نمونه را ثبت کنید");
        msg_temp_srv.delay(prMsg.delay);
        return
    }

    var requestSelected = medicalLaboratoryItem.medicalLaboratoryRequests.filter(a => a.id == requestSelectedId)[0];
    var requestMethodSelectedId = +$('#subMedicalLaboratoryRequestMethods tr.highlight').attr("rowid");
    var requestMethodSelected = requestSelected.medicalLaboratoryRequestMethods.filter(a => a.id == requestMethodSelectedId)[0];
    
    var resultTypeDetail = {
        testResultBoolean: +$("#resultType").val() == 1 ? $("#testResultBoolean").prop("checked") : false,
        testResultCount: +$("#resultType").val() == 3 ? +$("#testResultCount").val() : 0,
        testResultCoded: +$("#resultType").val() == 2 ? +$("#testResultCoded").val() : 0,
        testResultCodedName: +$("#resultType").val() == 2 ? $("#select2-testResultCoded-container").prop("title") : "",
        testResultOrdinal: +$("#resultType").val() == 4 ? +$("#testResultOrdinal").val() : 0,
        testResultNumerator: +$("#resultType").val() == 5 ? +$("#testResultNumerator").val() : 0,
        testResultDenominator: +$("#resultType").val() == 5 ? +$("#testResultDenominator").val() : 0,
        testResultTypeId: +$("#resultType").val() == 5 ? +$("#testResultTypeId").val() : 0,
        testResultIdQuantity: +$("#resultType").val() == 6 ? +$("#testResultIdQuantity").val() : 0,
        testResultUnitId: +$("#resultType").val() == 6 ? +$("#testResultUnitId").val() : 0,
        testResultUnitName: +$("#resultType").val() == 6 ? $("#select2-testResultUnitId-container").prop("title") : 0,
    };
    if (resultTypeDetail.testResultUnitName != "")
        resultTypeDetail.testResultUnitName = resultTypeDetail.testResultUnitName.split('-')[1].trim();

    var requestResultItem = {
        medicalLaboratoryId: medicalLaboratoryId,
        resultStatusId: +$("#resultStatusId").val(),
        resultStatusName: $("#resultStatusId").select2('data').length > 0 ? $("#resultStatusId").select2('data')[0].text : "",
        testNameId: +$("#testNameId").val(),
        testNameName: $("#testNameId").select2('data').length > 0 ? $("#testNameId").select2('data')[0].text : "",
        testPanelId: +$("#testPanelId").val(),
        testPanelName: $("#testPanelId").select2('data').length > 0 ? $("#testPanelId").select2('data')[0].text : "",
        testSequence: +$("#testSequence").val(),
        comment: $("#commentResult").val(),
        resultType: +$("#resultType").val(),
        resultTypeDetail: JSON.stringify(resultTypeDetail),
    }

    if (!requestResultEdited) {

        if (requestMethodSelected.medicalLaboratoryResults != undefined && requestMethodSelected.medicalLaboratoryResults != null && requestMethodSelected.medicalLaboratoryResults.length != 0)
            idResRequest = Math.max.apply(null,
                Object.keys(requestSelected.medicalLaboratoryRequestMethods).map(function (e) {
                    return requestSelected.medicalLaboratoryRequestMethods[e]['id'];
                })) + 1;
        else
            requestMethodSelected.medicalLaboratoryResults = [];


        requestResultItem.id = idResRequest;
        requestResultItem.isAdded = true;
        requestMethodSelected.medicalLaboratoryResults.push(requestResultItem);
    }
    else {

        for (var i = 0; i < requestMethodSelected.medicalLaboratoryResults.length; i++) {
            if (requestMethodSelected.medicalLaboratoryResults[i].id == mdResultSelectedId) {
                requestMethodSelected.medicalLaboratoryResults[i].resultStatusId = requestResultItem.resultStatusId;
                requestMethodSelected.medicalLaboratoryResults[i].resultStatusName = requestResultItem.resultStatusName;
                requestMethodSelected.medicalLaboratoryResults[i].testNameId = requestResultItem.testNameId;
                requestMethodSelected.medicalLaboratoryResults[i].testNameName = requestResultItem.testNameName;
                requestMethodSelected.medicalLaboratoryResults[i].testPanelId = requestResultItem.testPanelId;
                requestMethodSelected.medicalLaboratoryResults[i].testPanelName = requestResultItem.testPanelName;
                requestMethodSelected.medicalLaboratoryResults[i].testSequence = requestResultItem.testSequence;
                requestMethodSelected.medicalLaboratoryResults[i].comment = requestResultItem.comment;
                requestMethodSelected.medicalLaboratoryResults[i].resultType = requestResultItem.resultType;
                requestMethodSelected.medicalLaboratoryResults[i].resultTypeDetail = requestResultItem.resultTypeDetail;
            }
        }
        requestResultEdited = false;
    }

    resetMedicalLaboratoryForm("resultRow");
    fillMedicalLaboratoryDetails(medicalLaboratoryItem);
    vizibleResultRow();
});

function vizibleResultRow() {
    $("#resultRowBooleanBox").hide();
    $("#resultRowCountBox").hide();
    $("#resultRowOrdinalBox").hide();
    $("#resultRowProportionBox4").hide();
    $("#resultRowProportionBox5").hide();
    $("#resultRowProportionBox6").hide();
    $("#resultRowQuantityBox3").hide();
    $("#resultRowQuantityBox4").hide();
}

function fillMedicalLaboratoryResults(medicalLaboratoryResults, tSave = "INS") {

    $("#medicalLaboratoryResults").html("");
    $("#subMedicalLaboratoryResults").html("");

    for (var i = 0; i < medicalLaboratoryResults.length; i++) {
        var item = medicalLaboratoryResults[i];
        var mainResultsEmptyRow = $("#medicalLaboratoryResults").find("#emptyRow");
        var subResultsEmptyRow = $("#subMedicalLaboratoryResults").find("#emptyRow");

        if (mainResultsEmptyRow.length > 0)
            $("#medicalLaboratoryResults").html("");
        if (subResultsEmptyRow.length > 0)
            $("#subMedicalLaboratoryResults").html("");

        var mainResultBtns = `<button type="button" id="deleteResultRow_${item.id}" onclick="removeItemByModelName('medicalLaboratoryResults',${item.id})" class="btn maroon_outline" data-original-title="حذف سطر" style="margin-left:7px">
                                   <i class="fa fa-trash"></i>
                              </button>
                              <button type="button" id="EditResultRow_${item.id}" onclick="EditFromTempResultRow(${item.id})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                   <i class="fa fa-pen"></i>
                              </button>
                              <button type="button" id="showResultRow_${item.id}" onclick="showResultTypeDetail(${item.id})" class="btn blue_outline_1 ml-2" data-original-title="نمایش جزییات نوع جواب" style="margin-left:7px">
                                   <i class="fa fa-info"></i>
                              </button>`;
        var subResultBtns = `<button type="button" id="showResultRow_${item.id}" onclick="showResultTypeDetail(${item.id})" class="btn blue_outline_1 ml-2" data-original-title="نمایش جزییات نوع جواب" style="margin-left:7px">
                                   <i class="fa fa-info"></i>
                              </button>
                              <button type="button" onclick="addCompoundReferenceRange(${item.id})" class="btn blue_outline_1 ml-2" title="محدوده طبیعی جواب">
                                   <i class="fa fa-list"></i>
                              </button>`;

        var mainResultsOutPut = `<tr id="dtrR_${item.id}" onclick="tr_onclick('medicalLaboratoryResults',${item.id})" rowid="${item.id}">
                          <td>${i + 1}</td>
                          <td>${item.resultStatusId != 0 ? `${item.resultStatusName}` : ""}</td>
                          <td>${item.testNameId != 0 ? `${item.testNameName}` : ""}</td>
                          <td>${item.testPanelId != 0 ? `${item.testPanelName}` : ""}</td>
                          <td>${item.testSequence}</td>
                          <td>${item.comment}</td>
                          <td id="operationdtrR_${item.detailRowNumber}">                              
                            ${mainResultBtns}
                          </td>
                     </tr>`;
        var subResultsOutPut = `<tr id="dtrR_${item.id}" onclick="addCompoundReferenceRange(${item.id})" rowid="${item.id}">
                          <td>${i + 1}</td>
                          <td>${item.resultStatusId != 0 ? `${item.resultStatusName}` : ""}</td>
                          <td>${item.testNameId != 0 ? `${item.testNameName}` : ""}</td>
                          <td>${item.testPanelId != 0 ? `${item.testPanelName}` : ""}</td>
                          <td>${item.testSequence}</td>
                          <td>${item.comment}</td>
                          <td id="operationdtrR_${item.id}">                              
                            ${subResultBtns}
                          </td>
                     </tr>`;
        $(mainResultsOutPut).appendTo("#medicalLaboratoryResults");
        $(subResultsOutPut).appendTo("#subMedicalLaboratoryResults");

    }

    if (mdResultSelectedId == 0)
        $("#subMedicalLaboratoryResults tr:first").addClass("highlight");
    else
        $(`#subMedicalLaboratoryResults tr[rowid='${mdResultSelectedId}']`).addClass("highlight");

    var medicalLaboratoryReferences = mdResultSelectedId == 0 ? medicalLaboratoryResults[0].medicalLaboratoryReferences : medicalLaboratoryResults.filter(a => a.id == mdResultSelectedId)[0].medicalLaboratoryReferences;
    var references = medicalLaboratoryReferences != null ? medicalLaboratoryReferences.filter(a => !a.isRemoved || a.isRemoved == undefined) : null;
    if (references != null && references.length > 0)
        fillMedicalLaboratoryReferences(references);
    resetMedicalLaboratoryForm("resultRowR");

}

function showResultTypeDetail(id) {

    var requestSelectedId = +$('#medicalLaboratoryRequests tr.highlight').attr("rowid");
    var requestSelected = medicalLaboratoryItem.medicalLaboratoryRequests.filter(a => a.id == requestSelectedId)[0];
    var requestMethodSelectedId = +$('#subMedicalLaboratoryRequestMethods tr.highlight').attr("rowid");
    var requestMethodSelected = requestSelected.medicalLaboratoryRequestMethods.filter(a => a.id == requestMethodSelectedId)[0];
    var resultSelected = requestMethodSelected.medicalLaboratoryResults.filter(a => a.id == id)[0];
    var resultTypeDetail = resultSelected.resultTypeDetail != null && resultSelected.resultTypeDetail != "" && resultSelected.resultTypeDetail != undefined ? JSON.parse(resultSelected.resultTypeDetail) : null;
    if (resultTypeDetail != null) {
        setTimeout(function () {
            fill_select2(viewData_get_testResultType, "resultTypeDetailModal #testResultTypeId", true, 0);
            fill_select2(viewData_get_testResultId, "resultTypeDetailModal #testResultOrdinal", true);

            $("#resultTypeDetailModal #testResultBoolean").prop("checked", resultTypeDetail.testResultBoolean).trigger("change");
            $("#resultTypeDetailModal #testResultCount").val(resultTypeDetail.testResultCount);
            $("#resultTypeDetailModal #testResultCoded").val(resultTypeDetail.testResultCoded);
            testResultCodedVal = new Option(`${resultTypeDetail.testResultCodedName}`, resultTypeDetail.testResultCoded, true, true);
            $("#resultTypeDetailModal #testResultCoded").append(testResultCodedVal).trigger('change');
            testResultCodedVal = "";

            $("#resultTypeDetailModal #testResultOrdinal").val(resultTypeDetail.testResultOrdinal).trigger("change");
            $("#resultTypeDetailModal #testResultNumerator").val(resultTypeDetail.testResultNumerator);
            $("#resultTypeDetailModal #testResultDenominator").val(resultTypeDetail.testResultDenominator);
            $("#resultTypeDetailModal #testResultTypeId").val(resultTypeDetail.testResultTypeId).trigger("change");

            $("#resultTypeDetailModal #testResultIdQuantity").val(resultTypeDetail.testResultIdQuantity);

            $("#resultTypeDetailModal #testResultUnitId").val(resultTypeDetail.testResultUnitId);
            testResultUnitVal = new Option(`${resultTypeDetail.testResultUnitName}`, resultTypeDetail.testResultUnitId, true, true);
            $("#resultTypeDetailModal #testResultUnitId").append(testResultUnitVal).trigger('change');
            testResultUnitVal = "";
            $("#resultTypeDetailModal #resultType").val(+resultSelected.resultType).trigger('change');
        }, 100);
    }


    if (resultSelected.resultType == 1) {
        $("#resultTypeDetailModal #resultRowBooleanBox").show();
    }
    else {
        $("#resultTypeDetailModal #resultRowBooleanBox").hide();
    }

    if (resultSelected.resultType == 2) {
        $("#resultTypeDetailModal #resultRowCodedBox").show();
    }
    else {
        $("#resultTypeDetailModal #resultRowCodedBox").hide();
    }

    if (resultSelected.resultType == 3) {
        $("#resultTypeDetailModal #resultRowCountBox").show();
    }
    else {
        $("#resultTypeDetailModal #resultRowCountBox").hide();
    }


    if (resultSelected.resultType == 4) {
        $("#resultTypeDetailModal #resultRowOrdinalBox").show();
    }
    else {
        $("#resultTypeDetailModal #resultRowOrdinalBox").hide();
    }

    if (resultSelected.resultType == 5) {
        $("#resultTypeDetailModal #resultRowProportionBox4").show();
        $("#resultTypeDetailModal #resultRowProportionBox5").show();
        $("#resultTypeDetailModal #resultRowProportionBox6").show();
    }
    else {

        $("#resultTypeDetailModal #resultRowProportionBox4").hide();
        $("#resultTypeDetailModal #resultRowProportionBox5").hide();
        $("#resultTypeDetailModal #resultRowProportionBox6").hide();
    }


    if (resultSelected.resultType == 6) {
        $("#resultTypeDetailModal #resultRowQuantityBox3").show();
        $("#resultTypeDetailModal #resultRowQuantityBox4").show();
    }
    else {
        $("#resultTypeDetailModal #resultRowQuantityBox3").hide();
        $("#resultTypeDetailModal #resultRowQuantityBox4").hide();
    }


    modal_show(`resultTypeDetailModal`);
}

function EditFromTempResultRow(id) {

    $("#medicalLaboratoryResults tr").removeClass("highlight");
    $(`#dtr_${id}`).addClass("highlight");
    $(`#dtr_${id}`).attr("rowid", id);
    mdResultSelectedId = id;
    requestResultEdited = true;


    var requestSelectedId = +$('#medicalLaboratoryRequests tr.highlight').attr("rowid");
    var requestSelected = medicalLaboratoryItem.medicalLaboratoryRequests.filter(a => a.id == requestSelectedId)[0];
    var requestMethodSelectedId = +$('#subMedicalLaboratoryRequestMethods tr.highlight').attr("rowid");
    var requestMethodSelected = requestSelected.medicalLaboratoryRequestMethods.filter(a => a.id == requestMethodSelectedId)[0];
    var resultSelected = requestMethodSelected.medicalLaboratoryResults.filter(a => a.id == id)[0];

    var detailResultRow = "";

    $("#testSequence").val(resultSelected.testSequence);

    $("#resultStatusId").val(resultSelected.resultStatusId);
    detailResultRow = new Option(`${resultSelected.resultStatusName}`, resultSelected.resultStatusId, true, true);
    $("#resultStatusId").append(detailResultRow).trigger('change');
    detailResultRow = "";

    $("#testNameId").val(resultSelected.testNameId);
    detailResultRow = new Option(`${resultSelected.testNameName}`, resultSelected.testNameId, true, true);
    $("#testNameId").append(detailResultRow).trigger('change');
    detailResultRow = "";

    $("#testPanelId").val(resultSelected.testPanelId);
    detailResultRow = new Option(`${resultSelected.testPanelName}`, resultSelected.testPanelId, true, true);
    $("#testPanelId").append(detailResultRow).trigger('change');
    detailResultRow = "";

    $("#commentResult").val(resultSelected.comment);

    $("#resultStatusId").select2("focus");

    var resultTypeDetail = resultSelected.resultTypeDetail != null && resultSelected.resultTypeDetail != "" && resultSelected.resultTypeDetail != undefined ? JSON.parse(resultSelected.resultTypeDetail) : null;
    if (resultTypeDetail != null) {
        setTimeout(function () {
            $("#testResultBoolean").prop("checked", resultTypeDetail.testResultBoolean).trigger("change");
            $("#testResultCount").val(resultTypeDetail.testResultCount);

            $("#testResultCoded").val(resultTypeDetail.testResultCoded);
            testResultCodedVal = new Option(`${resultTypeDetail.testResultCodedName}`, resultTypeDetail.testResultCoded, true, true);
            $("#testResultCoded").append(testResultCodedVal).trigger('change');
            testResultCodedVal = "";

            $("#testResultCoded").val(resultTypeDetail.testResultCoded).trigger("change");
            $("#testResultOrdinal").val(resultTypeDetail.testResultOrdinal);
            $("#testResultNumerator").val(resultTypeDetail.testResultNumerator);
            $("#testResultDenominator").val(resultTypeDetail.testResultDenominator);
            $("#testResultTypeId").val(resultTypeDetail.testResultTypeId);
            $("#testResultIdQuantity").val(resultTypeDetail.testResultIdQuantity);

            $("#testResultUnitId").val(resultTypeDetail.testResultUnitId);
            testResultUnitVal = new Option(`${resultTypeDetail.testResultUnitName}`, resultTypeDetail.testResultUnitId, true, true);
            $("#testResultUnitId").append(testResultUnitVal).trigger('change');
            testResultUnitVal = "";
        }, 10);
    }
    $("#resultType").val(+resultSelected.resultType).trigger('change');

}

function fillElementRefer(data) {

    var elm = $(`#${'testResultBoolean'}`);
    var switchValue = elm.attr("switch-value").split(',');
    if (data.testResult == true) {
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
    $(`#testResultBoolean`).blur();


}

function editResultRow(detailRowNumber) {


    //start
    var arr_TempResultRowBooleanLineE = arr_TempResultRowBoolean.filter(line => line.detailRowNumber === detailRowNumber);
    if (arr_TempResultRowBooleanLineE.length !== 0) {
        var arr_TempResultRowBooleanE = arr_TempResultRowBoolean.filter(line => line.detailRowNumber === detailRowNumber)[0];
        fillElementRefer(arr_TempResultRowBooleanE)
    }
    //END

    //start
    var arr_TempResultRowOrdinalLineE = arr_TempResultRowOrdinal.filter(line => line.detailRowNumber === detailRowNumber);

    if (arr_TempResultRowOrdinalLineE.length !== 0) {
        var arr_TempResultRowOrdinalE = arr_TempResultRowOrdinal.filter(line => line.detailRowNumber === detailRowNumber)[0]
        $("#testResultOrdinal").val(arr_TempResultRowOrdinalE.testResultId).trigger('change');
    }
    //END 

    //start
    var arr_TempResultRowQuantityLineE = arr_TempResultRowQuantity.filter(line => line.detailRowNumber === detailRowNumber);
    if (arr_TempResultRowQuantityLineE.length !== 0) {
        var arr_TempResultRowQuantityE = arr_TempResultRowQuantity.filter(line => line.detailRowNumber === detailRowNumber)[0];
        $("#testResultIdQuantity").val(arr_TempResultRowQuantityE.testResultId);

        $("#testResultUnitId").val(arr_TempResultRowQuantityE.testResultUnitId);
        detailResultRow = new Option(`${arr_TempResultRowQuantityE.testResultUnitName}`, arr_TempResultRowQuantityE.testResultUnitId, true, true);
        $("#testResultUnitId").append(detailResultRow).trigger('change');
        detailResultRow = "";
    }
    //END

    //start
    var arr_TempResultRowCountLineE = arr_TempResultRowCount.filter(line => line.detailRowNumber === detailRowNumber);
    if (arr_TempResultRowCountLineE.length !== 0) {
        var arr_TempResultRowCountE = arr_TempResultRowCount.filter(line => line.detailRowNumber === detailRowNumber)[0];
        $("#testResultCount").val(arr_TempResultRowCountE.testResult);
    }
    //end

    //start
    var arr_TempResultRowProportionLineE = arr_TempResultRowProportion.filter(line => line.detailRowNumber === detailRowNumber);
    if (arr_TempResultRowProportionLineE.length !== 0) {
        var arr_TempResultRowProportionE = arr_TempResultRowProportion.filter(line => line.detailRowNumber === detailRowNumber)[0];
        $("#testResultNumerator").val(arr_TempResultRowProportionE.testResultNumerator);
        $("#testResultDenominator").val(arr_TempResultRowProportionE.testResultDenominator);
        $("#testResultTypeId").val(arr_TempResultRowProportionE.testResultTypeId).trigger('change');
    }
    //end

}

function rebuildResultRow() {

    var arrResultRow = arr_TempResultRow;
    var arrRowBoolean = arr_TempResultRowBoolean;
    var arrRowCoded = arr_TempResultRowCoded;
    var arrRowCount = arr_TempResultRowCount;
    var arrRowOrdinal = arr_TempResultRowOrdinal;
    var arrRowProportion = arr_TempResultRowProportion;
    var arrRowQuantity = arr_TempResultRowQuantity;
    var arrReferenceRange = arr_TempReferenceRange;

    var table = "tempResultRow";

    if (arrResultRow.length === 0)
        return;

    for (var l = 0; l < arrResultRow.length; l++) {
        var oldRowNumber = currentLabTestResultRowNumber;

        var newRowNumber = l + 1;
        arrResultRow[l].rowNumber = newRowNumber;

        arrResultRow[l].rowNumber = l + 1;
        $(`#${table} tr`)[l].children[0].innerText = arrResultRow[l].rowNumber;
        $(`#${table} tr`)[l].setAttribute("id", `dt_${arrResultRow[l].rowNumber}`);
        $(`#${table} tr`)[l].children[0].innerText = arrResultRow[l].rowNumber;

        if ($(`#${table} tr`)[l].children[8].innerHTML !== "") {
            var compoundButton = "";


            compoundButton = `<button type="button" onclick="addCompoundReferenceRange(${arrResultRow[l].detailRowNumber})" class="btn blue_outline_1 ml-2" title="محدوده طبیعی جواب">
                                   <i class="fa fa-list"></i>
                              </button>`


            $(`#${table} tr`)[l].children[8].innerHTML = `<button type="button" onclick="removeFromTempTooth(${arrResultRow[l].detailRowNumber})" class="btn maroon_outline" data-toggle="tooltip" data-placement="bottom" title="حذف سطر" style="margin-left:7px">
                                                                     <i class="fa fa-trash"></i>
                                                           </button></button><button type="button" onclick="EditFromTempTooth(${arrResultRow[l].detailRowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                                               <i class="fa fa-pen"></i>
                                                          </button>
                                                            ${compoundButton}`;
        }



        for (var bc = 0; bc < arrRowBoolean.length; bc++) {
            if (arrRowBoolean[bc].rowNumber !== oldRowNumber)
                arr_TempResultRowBoolean[bc].rowNumber = newRowNumber;
        }
        for (var bc = 0; bc < arrRowCoded.length; bc++) {
            if (arrRowCoded[bc].rowNumber !== oldRowNumber)
                arr_TempResultRowCoded[bc].rowNumber = newRowNumber;
        }
        for (var bc = 0; bc < arrRowCount.length; bc++) {
            if (arrRowCount[bc].rowNumber !== oldRowNumber)
                arr_TempResultRowCount[bc].rowNumber = newRowNumber;
        }
        for (var bc = 0; bc < arrRowOrdinal.length; bc++) {
            if (arrRowOrdinal[bc].rowNumber !== oldRowNumber)
                arr_TempResultRowOrdinal[bc].rowNumber = newRowNumber;
        }
        for (var bc = 0; bc < arrRowProportion.length; bc++) {
            if (arrRowProportion[bc].rowNumber !== oldRowNumber)
                arr_TempResultRowProportion[bc].rowNumber = newRowNumber;
        }
        for (var bc = 0; bc < arrRowQuantity.length; bc++) {
            if (arrRowQuantity[bc].rowNumber !== oldRowNumber)
                arr_TempResultRowQuantity[bc].rowNumber = newRowNumber;
        }
        for (var bc = 0; bc < arrRowQuantity.length; bc++) {
            if (arrRowQuantity[bc].rowNumber !== oldRowNumber)
                arr_TempResultRowQuantity[bc].rowNumber = newRowNumber;
        }
        for (var bc = 0; bc < arrReferenceRange.length; bc++) {
            if (arrReferenceRange[bc].rowNumber !== oldRowNumber)
                arr_TempReferenceRange[bc].rowNumber = newRowNumber;
        }
    }
    //rebuildToothRowC();
    //rebuildTreatmentRowC();
    arr_TempResultRow = arrResultRow;
}

$("#canceledResultRow").on("click", function () {

    $("#resultRowBox .select2").val("").trigger("change");
    $("#resultRowBox input.form-control").val("");
    $("#resultStatusId").select2("focus");

    typeSaveResultRow = "INS";
});

$("#resultRowModal").on("shown.bs.modal", function () {
    $("#resultStatusId").select2("focus");

    FormResultRow.reset();
});

$("#resultRowModal").on("hidden.bs.modal", function () {

    currentResultRowNumber = 0;
    $("#medicalLaboratoryResults").html("");
});

$("#modalCloseResultRow").on("click", function () {

    modal_close("resultRowModal");
});

$("#addReferenceRange").on("click", function () {

    var validate = $("#medicalLaboratoryReferenceForm").parsley().validate();
    validateSelect2($("#medicalLaboratoryReferenceForm").parsley());
    if (!validate) return;

    var idRefItem = 1;

    var requestSelectedId = +$('#medicalLaboratoryRequests tr.highlight').attr("rowid");

    if (medicalLaboratoryItem.medicalLaboratoryRequests.length == 0) {
        var msg_temp_srv = alertify.warning("جواب های آزمایش را ثبت کنید");
        msg_temp_srv.delay(prMsg.delay);
        return
    }

    var requestSelected = medicalLaboratoryItem.medicalLaboratoryRequests.filter(a => a.id == requestSelectedId)[0];
    var requestMethodSelectedId = +$('#subMedicalLaboratoryRequestMethods tr.highlight').attr("rowid");
    var requestMethodSelected = requestSelected.medicalLaboratoryRequestMethods.filter(a => a.id == requestMethodSelectedId)[0];
    var requestResultSelectedId = +$('#subMedicalLaboratoryResults tr.highlight').attr("rowid");
    var requestResultSelected = requestMethodSelected.medicalLaboratoryResults.filter(a => a.id == requestResultSelectedId)[0];
    var requestReferenceItem = {
        ageRangeId: +$("#ageRangeId").val(),
        ageRangeName: $("#ageRangeId").select2('data').length > 0 ? $("#ageRangeId").select2('data')[0].text : "",
        gestationAgeRangeId: +$("#gestationAgeRangeId").val(),
        gestationAgeRangeName: $("#gestationAgeRangeId").select2('data').length > 0 ? $("#gestationAgeRangeId").select2('data')[0].text : "",
        hormonalPhaseId: +$("#hormonalPhaseId").val(),
        hormonalPhaseName: $("#hormonalPhaseId").select2('data').length > 0 ? $("#hormonalPhaseId").select2('data')[0].text : "",
        referenceStatusId: +$("#referenceStatusId").val(),
        referenceStatusName: $("#referenceStatusId").select2('data').length > 0 ? $("#referenceStatusId").select2('data')[0].text : "",
        speciesId: +$("#speciesId").val(),
        speciesName: $("#speciesId").select2('data').length > 0 ? $("#speciesId").select2('data')[0].text : "",
        genderId: +$("#genderId").val(),
        genderName: $("#genderId option:selected").text(),
        lowRangeDescriptive: $("#lowRangeDescriptive").val(),
        highRangeDescriptive: $("#highRangeDescriptive").val(),
        condition: $("#condition").val(),
        description: $("#referenceRangeDescription").val()
    }


    if (!referenceEdited) {

        if (requestResultSelected.medicalLaboratoryReferences != undefined && requestResultSelected.medicalLaboratoryReferences != null && requestResultSelected.medicalLaboratoryReferences.length != 0)
            idRefItem = Math.max.apply(null,
                Object.keys(requestResultSelected.medicalLaboratoryReferences).map(function (e) {
                    return requestResultSelected.medicalLaboratoryReferences[e]['id'];
                })) + 1;
        else
            requestResultSelected.medicalLaboratoryReferences = [];

        requestReferenceItem.id = idRefItem;
        requestReferenceItem.isAdded = true;
        requestResultSelected.medicalLaboratoryReferences.push(requestReferenceItem);
    }
    else {
        for (var i = 0; i < requestResultSelected.medicalLaboratoryReferences.length; i++) {
            if (requestResultSelected.medicalLaboratoryReferences[i].id == mdReferenceSelectedId) {
                requestResultSelected.medicalLaboratoryReferences[i].ageRangeId = requestReferenceItem.ageRangeId;
                requestResultSelected.medicalLaboratoryReferences[i].ageRangeName = requestReferenceItem.ageRangeName;
                requestResultSelected.medicalLaboratoryReferences[i].gestationAgeRangeId = requestReferenceItem.gestationAgeRangeId;
                requestResultSelected.medicalLaboratoryReferences[i].gestationAgeRangeName = requestReferenceItem.gestationAgeRangeName;
                requestResultSelected.medicalLaboratoryReferences[i].hormonalPhaseId = requestReferenceItem.hormonalPhaseId;
                requestResultSelected.medicalLaboratoryReferences[i].hormonalPhaseName = requestReferenceItem.referenceStatusId;
                requestResultSelected.medicalLaboratoryReferences[i].referenceStatusId = requestReferenceItem.referenceStatusId;
                requestResultSelected.medicalLaboratoryReferences[i].referenceStatusName = requestReferenceItem.referenceStatusName;
                requestResultSelected.medicalLaboratoryReferences[i].speciesId = requestReferenceItem.speciesId;
                requestResultSelected.medicalLaboratoryReferences[i].speciesName = requestReferenceItem.speciesName;
                requestResultSelected.medicalLaboratoryReferences[i].genderId = requestReferenceItem.genderId;
                requestResultSelected.medicalLaboratoryReferences[i].genderName = requestReferenceItem.genderName;
                requestResultSelected.medicalLaboratoryReferences[i].lowRangeDescriptive = requestReferenceItem.lowRangeDescriptive;
                requestResultSelected.medicalLaboratoryReferences[i].highRangeDescriptive = requestReferenceItem.highRangeDescriptive;
                requestResultSelected.medicalLaboratoryReferences[i].condition = requestReferenceItem.condition;
                requestResultSelected.medicalLaboratoryReferences[i].description = requestReferenceItem.description;
            }
        }
        referenceEdited = false;
    }

    resetMedicalLaboratoryForm("referenceRange");
    fillMedicalLaboratoryDetails(medicalLaboratoryItem);

    //var arr_TempResultRowLineE = arr_tempResultRow.filter(line => line.rowNumber === currentLabRequestRowNumber);



    if (typeSaveReferenceRange == "INS") {
        if (arr_TempReferenceRange.length != 0)
            var detailRowNumber = Math.max.apply(null,
                Object.keys(arr_TempReferenceRange).map(function (e) {
                    return arr_TempReferenceRange[e]['detailRowNumber'];
                })) + 1;
        else
            var detailRowNumber = arr_TempReferenceRange.length + 1;

        //var detailRowNumber = arr_TempReferenceRange.length + 1;

        var referenceRange = {
            headerId: 0,
            rowNumber: currentResultRowNumber,
            detailRowNumber: detailRowNumber,
            ageRangeId: +$("#ageRangeId").val(),
            ageRangeName: $("#ageRangeId").select2('data').length > 0 ? $("#ageRangeId").select2('data')[0].text : "",
            gestationAgeRangeId: +$("#gestationAgeRangeId").val(),
            gestationAgeRangeName: $("#gestationAgeRangeId").select2('data').length > 0 ? $("#gestationAgeRangeId").select2('data')[0].text : "",
            hormonalPhaseId: +$("#hormonalPhaseId").val(),
            hormonalPhaseName: $("#hormonalPhaseId").select2('data').length > 0 ? $("#hormonalPhaseId").select2('data')[0].text : "",
            referenceStatusId: +$("#referenceStatusId").val(),
            referenceStatusName: $("#referenceStatusId").select2('data').length > 0 ? $("#referenceStatusId").select2('data')[0].text : "",
            speciesId: +$("#speciesId").val(),
            speciesName: $("#speciesId").select2('data').length > 0 ? $("#speciesId").select2('data')[0].text : "",
            genderId: +$("#genderId").val(),
            genderName: +$("#genderId option:selected").text(),
            lowRangeDescriptive: $("#lowRangeDescriptive").val(),
            highRangeDescriptive: $("#highRangeDescriptive").val(),
            condition: $("#condition").val(),
            description: $("#referenceRangeDescription").val(),
        }
        arr_TempReferenceRange.push(referenceRange);


    }
    else {
        if (arr_TempReferenceRange.length != 0)
            var detailRowNumber = Math.max.apply(null,
                Object.keys(arr_TempReferenceRange).map(function (e) {
                    return arr_TempReferenceRange[e]['detailRowNumber'];
                })) + 1;
        else
            var detailRowNumber = arr_TempReferenceRange.length + 1;

        var referenceRange = {
            headerId: 0,
            rowNumber: currentResultRowNumber,
            detailRowNumber: currentReferenceRangeDetailsRowNumber,
            resultStatusId: +$("#resultStatusId").val(),
            ageRangeId: +$("#ageRangeId").val(),
            ageRangeName: $("#ageRangeId").select2('data').length > 0 ? $("#ageRangeId").select2('data')[0].text : "",
            gestationAgeRangeId: +$("#gestationAgeRangeId").val(),
            gestationAgeRangeName: $("#gestationAgeRangeId").select2('data').length > 0 ? $("#gestationAgeRangeId").select2('data')[0].text : "",
            hormonalPhaseId: +$("#hormonalPhaseId").val(),
            hormonalPhaseName: $("#hormonalPhaseId").select2('data').length > 0 ? $("#hormonalPhaseId").select2('data')[0].text : "",
            referenceStatusId: +$("#referenceStatusId").val(),
            referenceStatusName: $("#referenceStatusId").select2('data').length > 0 ? $("#referenceStatusId").select2('data')[0].text : "",
            speciesId: +$("#speciesId").val(),
            speciesName: $("#speciesId").select2('data').length > 0 ? $("#speciesId").select2('data')[0].text : "",
            genderId: +$("#genderId").val(),
            genderName: +$("#genderId option:selected").text(),
            lowRangeDescriptive: $("#lowRangeDescriptive").val(),
            highRangeDescriptive: $("#highRangeDescriptive").val(),
            condition: $("#condition").val(),
            description: $("#referenceRangeDescription").val(),
        }
    }

    //appendTempReferenceRange(referenceRange, typeSaveReferenceRange);

    typeSaveReferenceRange = "INS";
});

function addCompoundReferenceRange(id) {

    $("#subMedicalLaboratoryResults tr").removeClass("highlight");
    $(`#dtrR_${id}`).addClass("highlight");
    mdResultSelectedId = id;
    mdReferenceSelectedId = 0;
    fillMedicalLaboratoryDetails(medicalLaboratoryItem);

}

function fillMedicalLaboratoryReferences(medicalLaboratoryReferences, tSave = "INS") {

    $("#medicalLaboratoryReferences").html("");
    for (var i = 0; i < medicalLaboratoryReferences.length; i++) {
        var item = medicalLaboratoryReferences[i];

        var emptyRow = $("#medicalLaboratoryReferences").find("#emptyRow");

        if (emptyRow.length > 0)
            $("#medicalLaboratoryReferences").html("");

        var output = `<tr id="drf_${item.id}" rowid="${item.id}" onclick="tr_onclick('medicalLaboratoryReferences',${item.id})">
                          <td>${i + 1}</td>
                          <td>${item.ageRangeId != 0 ? `${item.ageRangeName}` : ""}</td>
                          <td>${item.gestationAgeRangeId != 0 ? `${item.gestationAgeRangeName}` : ""}</td>
                          <td>${item.hormonalPhaseId != 0 ? `${item.hormonalPhaseName}` : ""}</td>
                          <td>${item.referenceStatusId != 0 ? `${item.referenceStatusName}` : ""}</td>
                          <td>${item.speciesId != 0 ? `${item.speciesName}` : ""}</td>
                          <td>${item.genderId != 0 ? `${item.genderName}` : ""}</td>
                          <td>${item.lowRangeDescriptive}</td>
                          <td>${item.highRangeDescriptive}</td>
                          <td>${item.condition}</td>
                          <td>${item.description}</td>
                          <td id="operationdrf_${item.id}">
                              <button type="button" id="deleteReferenceRange_${item.id}" onclick="removeItemByModelName('medicalLaboratoryReferences',${item.id})" class="btn maroon_outline" data-original-title="حذف سطر" style="margin-left:7px">
                                   <i class="fa fa-trash"></i>
                              </button><button type="button" id="EditReferenceRange_${item.id}" onclick="EditFromTempReferenceRange(${item.id})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                   <i class="fa fa-pen"></i>
                              </button>
                          </td>
                     </tr>`
        $(output).appendTo("#medicalLaboratoryReferences");

    }

    //if (referenceRange) {
    //    if (tSave == "INS") {

    //        var emptyRow = $("#tempReferenceRangeRow").find("#emptyRow");

    //        if (emptyRow.length > 0)
    //            $("#tempReferenceRangeRow").html("");

    //        ReferenceRangeOutputC = `<tr id="drf_${referenceRange.detailRowNumber}">
    //                      <td>${referenceRange.detailRowNumber}</td>
    //                      <td>${referenceRange.ageRangeId != 0 ? `${referenceRange.ageRangeName}` : ""}</td>
    //                      <td>${referenceRange.gestationAgeRangeId != 0 ? `${referenceRange.gestationAgeRangeName}` : ""}</td>
    //                      <td>${referenceRange.hormonalPhaseId != 0 ? `${referenceRange.hormonalPhaseName}` : ""}</td>
    //                      <td>${referenceRange.referenceStatusId != 0 ? `${referenceRange.referenceStatusName}` : ""}</td>
    //                      <td>${referenceRange.speciesId != 0 ? `${referenceRange.speciesName}` : ""}</td>
    //                      <td>${referenceRange.genderId != 0 ? `${referenceRange.genderName}` : ""}</td>
    //                      <td>${referenceRange.lowRangeDescriptive}</td>
    //                      <td>${referenceRange.highRangeDescriptive}</td>
    //                      <td>${referenceRange.condition}</td>
    //                      <td>${referenceRange.description}</td>
    //                      <td id="operationdrf_${referenceRange.detailRowNumber}">
    //                          <button type="button" id="deleteReferenceRange_${referenceRange.detailRowNumber}" onclick="removeFromTempReferenceRange(${referenceRange.detailRowNumber})" class="btn maroon_outline" data-original-title="حذف سطر" style="margin-left:7px">
    //                               <i class="fa fa-trash"></i>
    //                          </button><button type="button" id="EditReferenceRange_${referenceRange.detailRowNumber}" onclick="EditFromTempReferenceRange(${referenceRange.detailRowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
    //                               <i class="fa fa-pen"></i>
    //                          </button>
    //                      </td>
    //                 </tr>`
    //        $(ReferenceRangeOutputC).appendTo("#tempReferenceRangeRow");
    //    }
    //    else {
    //        var i = arr_TempResultRow.findIndex(x => x.detailRowNumber == referenceRange.detailRowNumber);
    //        arr_TempReferenceRange[i].rowNumber = referenceRange.rowNumber;
    //        arr_TempReferenceRange[i].detailRowNumber = referenceRange.detailRowNumber;
    //        arr_TempReferenceRange[i].ageRangeId = referenceRange.ageRangeId;
    //        arr_TempReferenceRange[i].ageRangeName = referenceRange.ageRangeName;
    //        arr_TempReferenceRange[i].gestationAgeRangeId = referenceRange.gestationAgeRangeId;
    //        arr_TempReferenceRange[i].gestationAgeRangeName = referenceRange.gestationAgeRangeName;
    //        arr_TempReferenceRange[i].hormonalPhaseId = referenceRange.hormonalPhaseId;
    //        arr_TempReferenceRange[i].hormonalPhaseName = referenceRange.hormonalPhaseName;
    //        arr_TempReferenceRange[i].referenceStatusId = referenceRange.referenceStatusId;
    //        arr_TempReferenceRange[i].referenceStatusName = referenceRange.referenceStatusName;
    //        arr_TempReferenceRange[i].speciesId = referenceRange.speciesId;
    //        arr_TempReferenceRange[i].speciesName = referenceRange.speciesName;
    //        arr_TempReferenceRange[i].genderId = referenceRange.genderId;
    //        if (referenceRange.genderId == 1)
    //            referenceRange.genderName = "1 - مرد";
    //        else
    //            referenceRange.genderName = "2 - زن";

    //        arr_TempReferenceRange[i].genderName = referenceRange.genderName;
    //        arr_TempReferenceRange[i].lowRangeDescriptive = referenceRange.lowRangeDescriptive;
    //        arr_TempReferenceRange[i].highRangeDescriptive = referenceRange.highRangeDescriptive;
    //        arr_TempReferenceRange[i].condition = referenceRange.condition;
    //        arr_TempReferenceRange[i].description = referenceRange.description;


    //        $(`#drf_${referenceRange.detailRowNumber} td:eq(0)`).text(`${referenceRange.detailRowNumber}`);
    //        $(`#drf_${referenceRange.detailRowNumber} td:eq(1)`).text(`${referenceRange.ageRangeId != 0 ? `${referenceRange.ageRangeName}` : ""}`);
    //        $(`#drf_${referenceRange.detailRowNumber} td:eq(2)`).text(`${referenceRange.gestationAgeRangeId != 0 ? `${referenceRange.gestationAgeRangeName}` : ""}`);
    //        $(`#drf_${referenceRange.detailRowNumber} td:eq(3)`).text(`${referenceRange.hormonalPhaseId != 0 ? `${referenceRange.hormonalPhaseName}` : ""}`);
    //        $(`#drf_${referenceRange.detailRowNumber} td:eq(4)`).text(`${referenceRange.referenceStatusId != 0 ? `${referenceRange.referenceStatusName}` : ""}`);
    //        $(`#drf_${referenceRange.detailRowNumber} td:eq(5)`).text(`${referenceRange.speciesId != 0 ? `${referenceRange.speciesName}` : ""}`);
    //        $(`#drf_${referenceRange.detailRowNumber} td:eq(6)`).text(`${referenceRange.genderId != 0 ? `${referenceRange.genderName}` : ""}`);
    //        $(`#drf_${referenceRange.detailRowNumber} td:eq(7)`).text(`${referenceRange.lowRangeDescriptive}`);
    //        $(`#drf_${referenceRange.detailRowNumber} td:eq(8)`).text(`${referenceRange.highRangeDescriptive}`);
    //        $(`#drf_${referenceRange.detailRowNumber} td:eq(9)`).text(`${referenceRange.condition}`);
    //        $(`#drf_${referenceRange.detailRowNumber} td:eq(10)`).text(`${referenceRange.description}`);

    //        $(`#operationdrf_${referenceRange.detailRowNumber}`).html(` <button type="button" id="deleteReferenceRange_${referenceRange.detailRowNumber}" onclick="removeFromTempReferenceRange(${referenceRange.detailRowNumber})" class="btn maroon_outline" data-original-title="حذف سطر" style="margin-left:7px">
    //                               <i class="fa fa-trash"></i>
    //                          </button>
    //                          <button type="button" id="EditReferenceRange_${referenceRange.detailRowNumber}" onclick="EditFromTempReferenceRange(${referenceRange.detailRowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
    //                               <i class="fa fa-pen"></i>
    //                          </button>`);

    //    }
    //}
    resetMedicalLaboratoryForm("referenceRange");

}

function rebuildReferenceRange() {

    var arrC = arr_TempReferenceRange;
    var table = "tempReferenceRange";

    if (arrC.length === 0)
        return;

    for (var b = 0; b < arrC.length; b++) {
        arrC[b].detailRowNumber = b + 1;

        if (typeof $(`#${table} tr`)[b] !== "undefined") {

            $(`#${table} tr`)[b].children[0].innerText = arrC[b].detailRowNumber;
            $(`#${table} tr`)[b].setAttribute("id", `drf_${arrC[b].detailRowNumber}`);
            $(`#${table} tr`)[b].children[0].innerText = arrC[b].detailRowNumber;

            if ($(`#${table} tr`)[b].children[10].innerHTML !== "") {

                $(`#${table} tr`)[b].children[10].innerHTML = `<button type="button" onclick="removeFromTempReferenceRange(${arrC[b].detailRowNumber})" class="btn maroon_outline" data-toggle="tooltip" data-placement="bottom" title="حذف محدوده">
                                                                     <i class="fa fa-trash"></i>
                                                           </button> <button type="button" onclick="EditFromTempReferenceRange(${arrC[b].detailRowNumber})" class="btn green_outline_1" data-original-title="ویرایش محدوده" style="margin-left:7px">
                                   <i class="fa fa-pen"></i>
                              </button>`;
            }
        }
    }

    arr_TempReferenceRange = arrC;
}

function EditFromTempReferenceRange(id) {

    $("#medicalLaboratoryReferences tr").removeClass("highlight");
    $(`#drf_${id}`).addClass("highlight");
    $(`#drf_${id}`).attr("rowid", id);
    mdReferenceSelectedId = id;
    referenceEdited = true;

    var requestSelectedId = +$('#medicalLaboratoryRequests tr.highlight').attr("rowid");
    var requestSelected = medicalLaboratoryItem.medicalLaboratoryRequests.filter(a => a.id == requestSelectedId)[0];
    var requestMethodSelectedId = +$('#subMedicalLaboratoryRequestMethods tr.highlight').attr("rowid");
    var requestMethodSelected = requestSelected.medicalLaboratoryRequestMethods.filter(a => a.id == requestMethodSelectedId)[0];
    var requestResultSelectedId = +$('#subMedicalLaboratoryResults tr.highlight').attr("rowid");
    var requestResultSelected = requestMethodSelected.medicalLaboratoryResults.filter(a => a.id == requestResultSelectedId)[0];
    var requestReferenceSelectedId = +$('#medicalLaboratoryReferences tr.highlight').attr("rowid");
    var requestReferenceSelected = requestResultSelected.medicalLaboratoryReferences.filter(a => a.id == requestReferenceSelectedId)[0];

    $("#ageRangeId").val(requestReferenceSelected.ageRangeId).trigger('change');

    $("#gestationAgeRangeId").val(requestReferenceSelected.gestationAgeRangeId).trigger('change');

    $("#hormonalPhaseId").val(requestReferenceSelected.hormonalPhaseId).trigger('change');

    $("#referenceStatusId").val(requestReferenceSelected.referenceStatusId).trigger('change');

    $("#speciesId").val(requestReferenceSelected.speciesId).trigger('change');

    $("#genderId").val(requestReferenceSelected.genderId).trigger('change');

    $("#lowRangeDescriptive").val(requestReferenceSelected.lowRangeDescriptive);

    $("#highRangeDescriptive").val(requestReferenceSelected.highRangeDescriptive);

    $("#condition").val(requestReferenceSelected.condition);

    $("#referenceRangeDescription").val(requestReferenceSelected.description);

}

$("#modalCloseReferenceRange").on("click", function () {

    modal_close("referenceRangeModal");
});

$("#canceledReferenceRange").on("click", function () {

    $("#resultRowBox .select2").val("").trigger("change");
    $("#resultRowBox input.form-control").val("");
    $("#resultStatusId").select2("focus");

    typeSaveResultRow = "INS";

});

$("#resultReferenceRange").on("shown.bs.modal", function () {


    $("#ageRangeId").select2("focus");

    FormReferenceRange.reset();

});

//Pathology Section Start

//Pathology Section End

$("#referenceRangeModal").on("hidden.bs.modal", function () {

    currentResultRowNumber = 0;
    $("#medicalLaboratoryReferences").html("");
});

function resetMedicalLaboratoryForm(typeBox) {


    if (typeBox == "LabRequest") {

        $("#labRequestBox .select2").val("").trigger("change");
        $("#labRequestBox input.form-control").val("");
        $("#specimenCode").focus();
        typeSaveLabRequest = "INS";
    }
    else if (typeBox == "diag") {
        $("#diagnosisBox .select2").val("").trigger("change");
        $("#diagnosisBox .funkyradio input:checkbox").prop("checked", false).trigger("change");
        $("#diagnosisBox input.form-control").val("");
        $("#diagnosisStatusId").select2("focus");
        typeSaveDiag = "INS";
    }
    else if (typeBox == "labTestResult") {
        $("#requestMethodBox .select2").val("").trigger("change");
        $("#requestMethodBox input.form-control").val("");
        $("#resultDateTime").focus();
        typeSavelabTestResult = "INS";
        //$("#labTestResultBox").prop("disabled", true);
    }

    else if (typeBox == "labTestResultR") {
        $("#labTestResultRBox .select2").val("").trigger("change");
        $("#labTestResultRBox .funkyradio input:checkbox").prop("checked", false).trigger("change");
        $("#labTestResultRBox input.form-control").val("");
        //typeSaveResultRow = "INS";
    }
    else if (typeBox == "resultRow") {
        $("#resultRowBox .select2").val("").trigger("change");
        $("#resultRowBox .funkyradio input:checkbox").prop("checked", false).trigger("change");
        $("#resultRowBox input.form-control").val("");
        typeSaveResultRow = "INS";
    }
    else if (typeBox == "referenceRange") {
        $("#referenceRangeBox .select2").val("").trigger("change");
        $("#referenceRangeBox .funkyradio input:checkbox").prop("checked", false).trigger("change");
        $("#referenceRangeBox input.form-control").val("");
        $("#ageRangeId").select2("focus");
        typeSaveReferenceRange = "INS";
    }
    else if (typeBox == "pathology") {
        $("#pathologyDiagnosisResultForm .select2").val("").trigger("change");
        $("#pathologyDiagnosisResultForm .funkyradio input:checkbox").prop("checked", false).trigger("change");
        $("#pathologyDiagnosisResultForm input.form-control").val("");
        $("#pathologyDiagnosis").focus();
        typeSavePathology = "INS";
    }
}

initSendMedicalLaboratoryForm();

async function initSendMedicalLaboratoryForm() {

    var newOption = new Option("انتخاب کنید", 0, true, true);

    $('#attenderId').append(newOption).trigger('change');
    fill_select2(`${viewData_baseUrl_MC}/Attender_AssistantApi/getdropdown`, "attenderId", true, 0, false, 0, "انتخاب داکتر...");
    //ColumnResizeable("temlabRequestFieldList");
    //ColumnResizeable("temptestResultFieldList");
    //ColumnResizeable("tempResultRowFieldList");
    //ColumnResizeable("tempdiagnosisFieldList");
    //ColumnResizeable("tempdrugHistoryFieldList");
    //ColumnResizeable("tempdrugOrderedFieldList");
    //ColumnResizeable("tempinsuranceFieldList");
    //ColumnResizeable("temppastMedicalHistoryFieldList");
    //ColumnResizeable("tempLabRequestList");
    //ColumnResizeable("tempfamilyHistoryList");
    //ColumnResizeable("tempdrugHistoryList");
    //ColumnResizeable("tempdrugOrderedList");
    //ColumnResizeable("tempmedicalHistoryList");
    //ColumnResizeable("tempdiagnosisList");
    //ColumnResizeable("tempToothList");
    //ColumnResizeable("tempTreatmentList");
    ColumnResizeable("pathologyResultsList");
    ColumnResizeable("medicalLaboratoryRequestsList");
    ColumnResizeable("medicalLaboratoryResultsList");
    ColumnResizeable("subMedicalLaboratoryResultsList");
    ColumnResizeable("medicalLaboratoryReferencesList");
    ColumnResizeable("medicalLaboratoryDiagnosisesList");

    bindMedicalLaboratoryElement();
    inputMask();
    $("#isMissing").trigger("change");

    $(".card-body").fadeIn(1000);
}

$("#resultRowBox #resultType").on("change", async function () {

    var resultTypeDetail = null;
    if (mdResultSelectedId > 0) {
        var requestSelectedId = +$('#medicalLaboratoryRequests tr.highlight').attr("rowid");
        var requestSelected = medicalLaboratoryItem.medicalLaboratoryRequests.filter(a => a.id == requestSelectedId)[0];
        var requestMethodSelectedId = +$('#subMedicalLaboratoryRequestMethods tr.highlight').attr("rowid");
        var requestMethodSelected = requestSelected.medicalLaboratoryRequestMethods.filter(a => a.id == requestMethodSelectedId)[0];
        var resultSelected = requestMethodSelected.medicalLaboratoryResults.filter(a => a.id == mdResultSelectedId)[0];
        resultTypeDetail = resultSelected.resultTypeDetail != null && resultSelected.resultTypeDetail != "" && resultSelected.resultTypeDetail != undefined ? JSON.parse(resultSelected.resultTypeDetail) : null;

    }
    resetResultDetail_tabindex();
    $("#addResultRow").prop("tabindex", 24);
    if (+$("#resultType").val() == 1) {
        $("#testResultBooleanfunk").prop("tabindex", 23);
        $("#resultRowBooleanBox").show();
    }
    else {
        $("#resultRowBooleanBox").hide();
    }

    if (+$("#resultType").val() == 2) {
        $("#resultRowCodedBox div").html("<select tabindex='23' id='testResultCoded' class='form-control select2'></select>");
        fill_select2(viewData_get_testResultCodedType, "resultRowBox #testResultCoded", true, 0, true);
        if (resultTypeDetail != null && resultTypeDetail.testResultCoded != null && resultTypeDetail.testResultCoded != 0) {
            $("#resultRowBox #testResultCoded").val(resultTypeDetail.testResultCoded);
            var testResultCodedVal = new Option(`${resultTypeDetail.testResultCodedName}`, resultTypeDetail.testResultCoded, true, true);
            $("#testResultCoded").append(testResultCodedVal).trigger('change');
            testResultCodedVal = "";
        }

        $("#resultRowCodedBox").show();
    }
    else {
        $("#resultRowCodedBox").hide();
    }

    if (+$("#resultType").val() == 3) {
        $("#testResultCount").prop("tabindex", 23);
        $("#resultRowCountBox").show();
    }
    else {
        $("#resultRowCountBox").hide();
    }


    if (+$("#resultType").val() == 4) {
        $("#resultRowOrdinalBox div").html("<select tabindex='23' placeholder='جواب' id='testResultOrdinal' class='form-control select2'></select>");
        fill_select2(viewData_get_testResultId, "resultRowBox #testResultOrdinal", true);
        if (resultTypeDetail != null)
            $("#testResultOrdinal").val(resultTypeDetail.testResultOrdinal).trigger("change");

        $("#resultRowOrdinalBox").show();
    }
    else {
        $("#resultRowOrdinalBox").hide();
    }

    if (+$("#resultType").val() == 5) {
        $("#addResultRow").prop("tabindex", 26);
        $("#testResultNumerator").prop("tabindex", 23);
        $("#testResultDenominator").prop("tabindex", 24);
        $("#resultRowProportionBox6 div").html("<select tabindex='25' placeholder='نوع نسبت' id='testResultTypeId' class='form-control select2'></select>");
        fill_select2(viewData_get_testResultType, "resultRowBox #testResultTypeId", true, 0);
        if (resultTypeDetail != null)
            $("#testResultTypeId").val(resultTypeDetail.testResultTypeId).trigger("change");

        $("#resultRowProportionBox4").show();
        $("#resultRowProportionBox5").show();
        $("#resultRowProportionBox6").show();
    }
    else {

        $("#resultRowProportionBox4").hide();
        $("#resultRowProportionBox5").hide();
        $("#resultRowProportionBox6").hide();
    }


    if (+$("#resultType").val() == 6) {
        $("#addResultRow").prop("tabindex", 25);
        $("#testResultIdQuantity").prop("tabindex", 23);
        $("#resultRowQuantityBox4 div").html("<select tabindex='24' placeholder='واحد' id='testResultUnitId' class='form-control select2'></select>");
        fill_select2(viewData_get_testResultUnit_resultType, "resultRowBox #testResultUnitId", true, 0, true);
        if (resultTypeDetail != null)
            $("#testResultUnitId").val(resultTypeDetail.testResultUnitId).trigger("change");

        $("#resultRowQuantityBox3").show();
        $("#resultRowQuantityBox4").show();
    }
    else {
        $("#resultRowQuantityBox3").hide();
        $("#resultRowQuantityBox4").hide();
    }
    //$("#infantWeightUnitId").prop("disabled", !checkStatus);
    //$("#deliveryNumber").prop("disabled", !checkStatus);
});

function resetResultDetail_tabindex() {
    $("#testResultBooleanfunk").prop("tabindex", -1);

    $("#resultRowCodedBox div").html("<select tabindex='-1' id='testResultCoded' class='form-control select2'></select>");
    $("#resultRowProportionBox6 div").html("<select tabindex='-1' placeholder='نوع نسبت' id='testResultTypeId' class='form-control select2'></select>");
    $("#resultRowOrdinalBox div").html("<select tabindex='-1' placeholder='جواب' id='testResultOrdinal' class='form-control select2'></select>");
    $("#resultRowQuantityBox4 div").html("<select tabindex='-1' placeholder='واحد' id='testResultUnitId' class='form-control select2'></select>");

    $("#testResultIdQuantity").prop("tabindex", -1);
    $("#testResultCount").prop("tabindex", -1);
    $("#testResultNumerator").prop("tabindex", -1);
    $("#testResultDenominator").prop("tabindex", -1);
}

function resetFormMedicalLaboratory() {

    alertify.confirm('بازنشانی', "ایا اطمینان دارید؟",
        function () {
            $("#choiceOfAdmission").css("display", "inline")
            medicalLaboratoryItem = {};
            $("#admissionSelected").html("")
            fillMedicalLaboratoryDetails(medicalLaboratoryItem);
        },
        function () {
            return;
        }
    ).set('labels', { ok: 'بله', cancel: 'خیر' });
}

$("#list_adm").on("click", function () {
    navigation_item_click('/MC/MedicalLaboratory', 'لیست آزمایشگاه')
});
