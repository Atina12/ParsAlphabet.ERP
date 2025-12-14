
var viewData_controllername = "MedicalLaboratoryApi",
    viewData_get_MedicalLaboratoryGet = `${viewData_baseUrl_MC}/${viewData_controllername}/get`,
    viewData_getMedicalLaboratoryCheckExist = `${viewData_baseUrl_MC}/${viewData_controllername}/checkexist`,
    emptyRow = `<tr id="emptyRow"><td colspan="thlength" class="text-center">سطری وجود ندارد</td></tr>`,
    medicalLaboratoryItem = {
        medicalLaboratoryRequests: []
    },
    mdDiagnosisId = 0, mdRequestSelectedId = 0, mdRequestMethodSelectedId = 0, mdResultSelectedId = 0, mdReferenceSelectedId = 0,
    requestEdited = false, requestMethodEdited = false, requestResultEdited = false, referenceEdited = false, diagnosisEdited = false,
    requestRemoved = false, requestMethodRemoved = false, resultRemoved = false, referenceRemoved = false, diagRemoved = false,
    admissionIdentity = 0, medicalLaboratoryId = +$("#medicalLaboratoryId").val(), medicalLaboratoryHID = "",
    currentLabRequestRowNumber = 0, currentReferenceNumber = 0, currentResultRowNumber = 0, currentLabTestDetailRowNumber = 0, currentResultRowDetailRowNumber = 0,
    typeSaveLabRequest = "INS", typeSaveResultRow = "INS", typeSaveReferenceRange = "INS",
    typeSaveDiag = "INS", typeSavelabTestResult = "INS",
    arr_TempLabRequest = [], arr_TempLabTestResult = [],
    arr_TempResultRow = [], arr_TempResultRowBoolean = [], arr_TempResultRowCoded = [],
    arr_TempResultRowCount = [], arr_TempResultRowOrdinal = [], arr_TempResultRowProportion = [], arr_TempResultRowQuantity = [],
    arr_TempReferenceRange = [], arr_TempDiagnosis = [], referringDoctorId = 0;


async function bindMedicalLaboratoryElement() {
    if (medicalLaboratoryId !== 0)
        getMedicalLaboratoryData(medicalLaboratoryId);
}

function headerindexChoose(e) {

    let elm = $(e.target);

    if (e.keyCode === KeyCode.Enter) {
        let checkExist = false;
        checkExist = checkExistMedicalLaboratoryId(+elm.val());
        if (checkExist) {
            getMedicalLaboratoryData(+elm.val(), 0);
            elm.val("");
        }
        else
            alertify.warning("این کد در سیستم وجود ندارد").delay(alertify_delay);
    }
}

function checkExistMedicalLaboratoryId(id) {

    let outPut = $.ajax({
        url: viewData_getMedicalLaboratoryCheckExist,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getMedicalLaboratoryCheckExist);
        }
    });
    return outPut.responseJSON;
}

function display_pagination(opr) {

    var elemId = $("#medicalLaboratoryId").val();
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
    getMedicalLaboratoryData(elemId, headerPagination);
}

function getMedicalLaboratoryData(elemId, headerPagination = 0) {

    let model = {
        labId: elemId,
        headerPagination : headerPagination
    };

    $.ajax({
        url: viewData_get_MedicalLaboratoryGet,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (data) {
            resetMedicalLaboratoryForm("tableMedicalLaboratory");
            medicalLaboratoryItem = data;
            fillMedicalLaboratoryDetails(medicalLaboratoryItem);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_get_MedicalLaboratoryGet);
        }
    });
};

var fillMedicalLaboratoryDetails = (data) => {

    if (data !== null) {
        $("#medicalLaboratoryId").val(data.id);
        $("#userFullName").val(`${data.userId} - ${data.userFullName}`);
        $("#createDate").val(data.medicalLaboratoryCreateDatePersian);
        $("#labRequestBox").removeClass("displaynone");

        $("#resultRowBox #resultType").val("0").trigger("change");

        medicalLaboratoryHID = data.relatedHID;
        if (+data.admissionId > 0) {
            setAdmissionInfo(data);
            admissionIdentity = data.admissionId;
        }
        var requests = data.medicalLaboratoryRequests == undefined ? [] : data.medicalLaboratoryRequests.filter(a => !a.isRemoved || a.isRemoved == undefined);
        var diagnosises = data.medicalLaboratoryDiagnosises == undefined ? [] : data.medicalLaboratoryDiagnosises.filter(a => !a.isRemoved || a.isRemoved == undefined);

        $("#medicalLaboratoryRequests").html($("#emptyRowRequests").html());
        $("#medicalLaboratoryRequestMethods").html($("#emptyRowRequestMethods").html());
        $("#subMedicalLaboratoryRequestMethods").html($("#emptyRowSubRequestMethods").html());
        $("#medicalLaboratoryResults").html($("#emptyRowResults").html());
        $("#subMedicalLaboratoryResults").html($("#emptyRowSubResults").html());
        $("#medicalLaboratoryReferences").html($("#emptyRowReferences").html());

        if (requests != null && requests.length > 0) {
            fillMedicalLaboratoryRequests(requests);
        }

        $("#medicalLaboratoryDiagnosises").html($("#emptyRowDiagnosises").html());
        if (diagnosises != null && diagnosises.length > 0) {
            fillMedicalLaboratoryDiagnosis(diagnosises);
        }
    }
};

function setAdmissionInfo(dataAdm) {
    admissionIdentity = +dataAdm.admissionId;

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
                               <td>${dataAdm.thirdPartyId == 0 ? "" : `${dataAdm.thirdPartyId} -  ${dataAdm.thirdPartyName}`}</td>
                               <td>${dataAdm.admissionHID}</td> 
                               <td>${dataAdm.insurExpDatePersian}</td> 
                               <td>${dataAdm.attenderFullName}</td> 
                           </tr>`

    $("#admissionSelected").html(admissionOutput);
    modal_close("searchAdmissionModal");
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

var fillMedicalLaboratoryRequests = (medicalLaboratoryRequests, tSave = "INS") => {

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

    resetMedicalLaboratoryForm("LabRequest");
}

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

var fillMedicalLaboratoryDiagnosis = (medicalLaboratoryDiagnosises, tSave = "INS") => {
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
                     </tr>`

        $(output).appendTo("#medicalLaboratoryDiagnosises");
    }
    resetMedicalLaboratoryForm("diag");
}

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

var fillMedicalLaboratoryRequestMethods = (medicalLaboratoryRequestMethods) => {

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

        var mainRequestOutPut = `<tr id="drCR_${item.id}" onclick="tr_onclick('medicalLaboratoryRequestMethods',${item.id})" rowid="${item.id}">
                          <td>${i + 1}</td>
                          <td>${item.resultDateTimePersian}</td>
                          <td>${item.processDateTimePersian}</td>
                          <td>${item.receiptDateTimePersian}</td>
                          <td>${item.methodId != 0 ? `${item.methodName}` : ""}</td>
                          <td>${item.laboratoryPanelId != 0 ? `${item.laboratoryPanelName}` : ""}</td>
                          <td>${item.methodDescription}</td>
                     </tr>`

        var subRequestOutPut = `<tr id="drCR_${item.id}" onclick="addCompoundResultRow(${item.id})" rowid="${item.id}">
                          <td>${i + 1}</td>
                          <td>${item.resultDateTimePersian}</td>
                          <td>${item.processDateTimePersian}</td>
                          <td>${item.receiptDateTimePersian}</td>
                          <td>${item.methodId != 0 ? `${item.methodName}` : ""}</td>
                          <td>${item.laboratoryPanelId != 0 ? `${item.laboratoryPanelName}` : ""}</td>
                          <td>${item.methodDescription}</td>
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

function tr_onclick(tableId, rowid) {
    $(`#${tableId} tr`).removeClass("highlight");
    $(`#${tableId} tr[rowid='${rowid}']`).addClass("highlight");
}

$("#canceledlabTestResult").on("click", function () {

    $("#toothBoxC .select2").val("").trigger("change");
    $("#toothBoxC input.form-control").val("");
    $("#toothStatusId").select2("focus");

    typeSavelabTestResult = "INS";
});

var addCompoundResultRow = (id) => {

    $("#subMedicalLaboratoryRequests tr").removeClass("highlight");
    $(`#drCR_${id}`).addClass("highlight");
    mdRequestMethodSelectedId = id;
    mdResultSelectedId = 0;
    mdReferenceSelectedId = 0;
    fillMedicalLaboratoryDetails(medicalLaboratoryItem);
}

var fillMedicalLaboratoryResults = (medicalLaboratoryResults, tSave = "INS") => {

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

        var mainResultBtns = `<button type="button" id="showResultRow_${item.id}" onclick="showResultTypeDetail(${item.id})" class="btn blue_outline_1 ml-2" data-original-title="نمایش جزییات نوع جواب" style="margin-left:7px">
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
                     </tr>`;
        var subResultsOutPut = `<tr id="dtrR_${item.id}" onclick="addCompoundReferenceRange(${item.id})" rowid="${item.id}">
                          <td>${i + 1}</td>
                          <td>${item.resultStatusId != 0 ? `${item.resultStatusName}` : ""}</td>
                          <td>${item.testNameId != 0 ? `${item.testNameName}` : ""}</td>
                          <td>${item.testPanelId != 0 ? `${item.testPanelName}` : ""}</td>
                          <td>${item.testSequence}</td>
                          <td>${item.comment}</td>
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
            //fill_select2(viewData_get_testResultType, "resultTypeDetailModal #testResultTypeId", true, 0);
            //fill_select2(viewData_get_testResultId, "resultTypeDetailModal #testResultOrdinal", true);

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

$("#canceledResultRow").on("click", function () {

    $("#resultRowBox .select2").val("").trigger("change");
    $("#resultRowBox input.form-control").val("");
    $("#resultStatusId").select2("focus");

    typeSaveResultRow = "INS";
});

var addCompoundReferenceRange = (id) => {

    $("#subMedicalLaboratoryResults tr").removeClass("highlight");
    $(`#dtrR_${id}`).addClass("highlight");
    mdResultSelectedId = id;
    mdReferenceSelectedId = 0;
    fillMedicalLaboratoryDetails(medicalLaboratoryItem);
}

var fillMedicalLaboratoryReferences = (medicalLaboratoryReferences, tSave = "INS") => {

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
                     </tr>`
        $(output).appendTo("#medicalLaboratoryReferences");

    }  
    resetMedicalLaboratoryForm("referenceRange");
}

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
    else if (typeBox == "tableMedicalLaboratory") {
        arr_TempDiagnosis = [];
        arr_TempLabRequest = [];
        arr_TempLabTestResult = [];
        arr_TempReferenceRange = [];
        arr_TempResultRow = [];

        $("#medicalLaboratoryResults").html(fillEmptyRow(5));
        $("#medicalLaboratoryRequests").html(fillEmptyRow(8));
        $("#subMedicalLaboratoryResults").html(fillEmptyRow(7));
        $("#medicalLaboratoryReferences").html(fillEmptyRow(11));
        $("#medicalLaboratoryDiagnosises").html(fillEmptyRow(5));
    }
}

initSendMedicalLaboratoryForm();

async function initSendMedicalLaboratoryForm() {

    ColumnResizeable("temlabRequestFieldList");
    ColumnResizeable("temptestResultFieldList");
    ColumnResizeable("tempResultRowFieldList");
    ColumnResizeable("tempdiagnosisFieldList");
    ColumnResizeable("tempdrugHistoryFieldList");
    ColumnResizeable("tempdrugOrderedFieldList");
    ColumnResizeable("tempinsuranceFieldList");
    ColumnResizeable("temppastMedicalHistoryFieldList");
    ColumnResizeable("tempLabRequestList");
    ColumnResizeable("tempfamilyHistoryList");
    ColumnResizeable("tempdrugHistoryList");
    ColumnResizeable("tempdrugOrderedList");
    ColumnResizeable("tempmedicalHistoryList");
    ColumnResizeable("tempdiagnosisList");
    ColumnResizeable("tempToothList");
    ColumnResizeable("tempTreatmentList");

    bindMedicalLaboratoryElement();
    inputMask();
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
        fill_select2(viewData_get_testResultUnit, "resultRowBox #testResultUnitId", true, 0, true);
        if (resultTypeDetail != null)
            $("#testResultUnitId").val(resultTypeDetail.testResultUnitId).trigger("change");

        $("#resultRowQuantityBox3").show();
        $("#resultRowQuantityBox4").show();
    }
    else {
        $("#resultRowQuantityBox3").hide();
        $("#resultRowQuantityBox4").hide();
    };
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

$("#list_adm").on("click", function () {
    navigation_item_click('/MC/MedicalLaboratory', 'لیست دندانداکتری')
});
