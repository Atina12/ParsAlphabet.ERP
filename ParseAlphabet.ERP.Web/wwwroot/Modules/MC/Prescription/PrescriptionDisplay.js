$(".tab-content").show();
$(".select2").select2();
//$("input:text").focus(function () { $(this).select(); });

var viewData_controllername = "PrescriptionApi",
    viewData_get_selectType_service = `/api/AdmissionsApi/selecttypeservcie_getdropdown`,
    viewData_get_ServiceByType = `/api/AdmissionsApi/getservicebytype_getdropdown`,
    viewData_get_SearchAdmission = `${viewData_baseUrl_MC}/AdmissionApi/searchinbound`,
    viewData_get_AdmissionGetDiagnosis = `${viewData_baseUrl_MC}/AdmissionApi/getdiagnosis`,
    viewData_get_PrescriptionByAdmissionId = `${viewData_baseUrl_MC}/${viewData_controllername}/getprescriptionbyid`,
    viewData_getPrescriptionCheckExist = `${viewData_baseUrl_MC}/${viewData_controllername}/checkexist`,
    emptyRow = `<tr id="emptyRow"><td colspan="thlength" class="text-center">سطری وجود ندارد</td></tr>`,
    currentDrugRowNumber = 0, currentDrugRowNumberE = 0, currentDrugDetailsRowNumber = 0, currentImageRowNumber = 0, currentImageRowNumberE = 0, currentLabRowNumber = 0, currentDiagRowNumber = 0,
    prescriptionDrugId = 0, prescriptionImageId = 0, prescriptionLabId = 0, prescriptiongDaigId = 0,
    drugInserted = false, imageInserted = false, labInserted = false, typeSaveDrug = "INS", typeSaveImage = "INS", typeSaveDrugC = "INS", typeSaveLab = "INS", typeSaveDiag = "INS",
    arr_TempDrug = [], arr_TempDrugDetail = [], arr_TempImage = [], arr_TempImageDetail = [], arr_TempLab = [], arr_TempDiagnosis = [],
    admissionIdentity = 0, prescriptionId = +$("#prescriptionId").val(), prescriptionType = 0;
    



function headerindexChoose(e) {
    let elm = $(e.target);

    if (e.keyCode === KeyCode.Enter) {
        let checkExist = false;
        checkExist = checkExistPrescriptionId(+elm.val());
        if (checkExist) {
            getPrescription(+elm.val(), 0);
            elm.val("");
        }
        else
            alertify.warning("این کد در سیستم وجود ندارد").delay(alertify_delay);
    }
}


function checkExistPrescriptionId(id) {

    let outPut = $.ajax({
        url: viewData_getPrescriptionCheckExist,
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
    //var elemId = $(this).prop("id");
    var elemId = $("#prescriptionId").val();
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
    getPrescription(elemId, headerPagination);

}

var getPrescription = (elemId, headerPagination = 0) => {

    let nextPrescriptionModel = {
        prescriptionId: elemId,
        headerPagination: headerPagination
    }

    $.ajax({
        url: viewData_get_PrescriptionByAdmissionId,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(nextPrescriptionModel),
        success: function (data) {
            resetPrescriptionForm("tablePrescription");
            fillPrescription(data);
            $(`#prescriptionLink${data.prescriptionTypeId}`).click();
        },
        error: function (xhr) {
            error_handler(xhr, viewData_get_PrescriptionByAdmissionId);
            return {
                status: -100,
                statusMessage: "عملیات با خطا مواجه شد",
                successfull: false
            };
        }
    });

};

async function initPrescriptionForm() {

    inputMask();

    ColumnResizeable("tempDrugList");
    ColumnResizeable("tempImageList");
    ColumnResizeable("tempLabList");
    ColumnResizeable("tempdiagList");

    if (prescriptionId !== 0)
        getPrescription(prescriptionId);
}

var fillPrescription = (pr) => {
    if (pr !== null) {

        $("#prescriptionId").val(pr.id);
        $("#userFullName").val(`${pr.createUserId} - ${pr.userFullName}`);
        $("#creatDateTime").val(pr.createDatePersian);
        $("#prescriptionBox").removeClass("displaynone");
        $("#printPrsescription").remove();
        if (pr.prescriptionTypeId == 1)
            $("#prescriptionForm .button-items").append(`<button type="button" id="printPrsescription" onclick="prescriptionPrintDrug(${pr.id})" class="btn btn-print waves-effect"><i class="fa fa-print"></i>چاپ</button>`)

        fillAdmissionInfo(pr.admissionId, pr.patientId, pr.patientFullName,
            pr.patientNationalCode, pr.basicInsurerName, pr.insuranceBoxName, pr.compInsuranceBoxName,
            pr.admissionHID, pr.insurExpDatePersian, pr.attenderFullName, pr.thirdPartyId, pr.thirdPartyName)


        admissionIdentity = pr.admissionId;

        prescriptionDrugId = pr.prescriptionDrugId;
        prescriptionImageId = pr.prescriptionImageId;
        prescriptionLabId = pr.prescriptionLabId;
        prescriptiongDaigId = pr.prescriptiongDaigId;
        $("#expiryDatePersian").val(pr.expiryDatePersian);
        $("#repeatCount").val(pr.repeatCount);
        $("#priorityId").val(pr.priorityId == 0 ? "" : `${pr.priorityId} - ${pr.priorityName}`);
        $("#note").val(pr.note);
        $("#intentId").val(`${pr.intentId} - ${pr.intentName}`);
        $("#adequacyForTestingId").val(`${pr.adequacyForTestingId} - ${pr.adequacyForTestingName}`);
        $("#collectionProcedureId").val(`${pr.collectionProcedureId} - ${pr.collectionProcedureName}`);
        $("#dateTimeCollection").val(pr.collectionDateTimePersian);
        $("#speciementIdentifier").val(pr.specimenIdentifier);
        $("#speciementTissueTypeId").val(`${pr.specimenTissueTypeId} - ${pr.specimenTissueTypeName}`);
        $("#prescriptionTypeName").val(`${pr.prescriptionTypeId} - ${pr.prescriptionTypeName}`);
        $("#prescriptionTypeBox").removeClass("d-none");
        prescriptionType = pr.prescriptionTypeId;
        fillLinePrescription(pr.prescriptionTypeId, pr);

    }
};

function prescriptionPrintDrug(id) {

    var reportModel = {
        reportName: viewData_form_title,
        reportUrl: viewData_drugPrint_file_url,
        parameters: [
            { Item: "Id", Value: id, SqlDbType: dbtype.Int, Size: 0 },
        ],
        reportSetting: reportSettingModel
    }
    window.open(`${viewData_report_url}?strReportModel=${JSON.stringify(reportModel)}`, '_blank');

}

function fillLinePrescription(type, pr) {
    switch (type) {
        case 1://Drug
            if (pr.prescriptionDrugLines != null) {
                if (pr.prescriptionDrugLineDetails != null) {

                    var drugLineDetailLength = pr.prescriptionDrugLineDetails.length;

                    for (var dld = 0; dld < drugLineDetailLength; dld++) {
                        var drugCdb = pr.prescriptionDrugLineDetails[dld];

                        var drugC = {
                            headerID: drugCdb.headerID,
                            rowNumber: drugCdb.rowNumber,
                            detailRowNumber: drugCdb.detailRowNumber,
                            productId: drugCdb.productId,
                            productName: drugCdb.productId + " - " + drugCdb.productName,
                            qty: drugCdb.qty,
                            qtyMax: drugCdb.qtyMax,
                            unitId: drugCdb.unitId,
                            unitName: drugCdb.unitId + " - " + drugCdb.unitName,
                            roleId: drugCdb.roleId,
                            roleName: drugCdb.roleId + " - " + drugCdb.roleName
                        };

                        arr_TempDrugDetail.push(drugC);
                        drugC = {};
                    }
                }


                var drugLineLength = pr.prescriptionDrugLines.length;

                for (var dld = 0; dld < drugLineLength; dld++) {
                    var drugdb = pr.prescriptionDrugLines[dld];

                    var drug = {
                        headerId: drugdb.headerId,
                        rowNumber: drugdb.rowNumber,
                        productId: drugdb.productId,
                        productName: drugdb.productId + " - " + drugdb.productName,
                        dosageUnitId: drugdb.dosageUnitId,
                        dosageUnitName: drugdb.dosageUnitId + " - " + drugdb.dosageUnitName,
                        priorityId: drugdb.priorityId,
                        priorityName: drugdb.priorityId + " - " + drugdb.priorityName,
                        reasonId: drugdb.reasonId,
                        reasonName: drugdb.reasonId + " - " + drugdb.reasonName,
                        asNeedId: drugdb.asNeedId,
                        asNeedName: drugdb.asNeedId + " - " + drugdb.asNeedName,
                        dosage: drugdb.dosage,
                        frequencyId: drugdb.frequencyId,
                        frequencyName: drugdb.frequencyId + " - " + drugdb.frequencyName,
                        routeId: drugdb.routeId,
                        routeName: drugdb.routeId + " - " + drugdb.routeName,
                        methodId: drugdb.methodId,
                        methodName: drugdb.methodId + " - " + drugdb.methodName,
                        bodySiteId: drugdb.bodySiteId,
                        bodySiteName: drugdb.bodySiteId + " - " + drugdb.bodySiteName,
                        isCompounded: drugdb.isCompounded,
                        totalNumber: drugdb.totalNumber,
                        totalNumberUnitId: drugdb.totalNumberUnitId,
                        totalNumberUnitName: drugdb.totalNumberUnitId + " - " + drugdb.totalNumberUnitName,
                        maxNumber: drugdb.maxNumber,
                        patientInstruction: drugdb.patientInstruction,
                        description: drugdb.description,
                        drugDetail: arr_TempDrugDetail.filter(a => a.rowNumber === drugdb.rowNumber)
                    };

                    arr_TempDrug.push(drug);
                    appendTempDrug(drug);
                    drug = {};
                }
            }

            break;
        case 2://LAb
            if (pr.prescriptionLabLines != null) {
                var labLineLength = pr.prescriptionLabLines.length;

                for (var lb = 0; lb < labLineLength; lb++) {

                    var labdb = pr.prescriptionLabLines[lb];
                    var lab = {
                        headerId: labdb.headerId,
                        rowNumber: labdb.rowNumber,
                        serviceId: labdb.serviceId,
                        serviceName: labdb.serviceId + " - " + labdb.serviceName,
                        asNeedId: labdb.asNeedId,
                        asNeedName: labdb.asNeedId + " - " + labdb.asNeedName,
                        reasonId: labdb.reasonId,
                        reasonName: labdb.reasonId + " - " + labdb.reasonName,
                        bodySiteId: labdb.bodySiteId,
                        bodySiteName: labdb.bodySiteId + " - " + labdb.bodySiteName,
                        note: labdb.note,
                        patientInstruction: labdb.patientInstruction,
                        doNotPerform: labdb.doNotPerform,
                    }

                    arr_TempLab.push(lab);
                    appendTempLab(lab);
                    lab = {};
                }
            }
            break;
        case 3://Image
            if (pr.prescriptionImageLineDetails != null) {
                var imageLineDetailLength = pr.prescriptionImageLineDetails.length;

                for (var ild = 0; ild < imageLineDetailLength; ild++) {

                    var imageCdb = pr.prescriptionImageLineDetails[ild];

                    var imageC = {
                        headerId: imageCdb.headerId,
                        rowNumber: imageCdb.rowNumber,
                        detailRowNumber: imageCdb.detailRowNumber,
                        serviceId: imageCdb.serviceId,
                        serviceName: imageCdb.serviceId + " - " + imageCdb.serviceName,
                    }

                    arr_TempImageDetail.push(imageC);
                    imageC = {};
                }
            }
            if (pr.prescriptionImageLines != null) {
                var imageLineLength = pr.prescriptionImageLines.length;

                for (var i = 0; i < imageLineLength; i++) {

                    var imagedb = pr.prescriptionImageLines[i];

                    var isCompounded = typeof arr_TempImageDetail.find(dll => dll.rowNumber == imagedb.rowNumber) !== "undefined";


                    var image = {
                        headerId: imagedb.headerId,
                        rowNumber: imagedb.rowNumber,
                        serviceId: imagedb.serviceId,
                        serviceName: imagedb.serviceId + " - " + imagedb.serviceName,
                        bodySiteId: imagedb.bodySiteId,
                        bodySiteName: imagedb.bodySiteId + " - " + imagedb.bodySiteName,
                        note: imagedb.note,
                        patientInstruction: imagedb.patientInstruction,
                        compounded: isCompounded,
                        lateralityId: imagedb.lateralityId,
                        lateralityName: imagedb.lateralityId + " - " + imagedb.lateralityName,
                        imageDetail: arr_TempImageDetail.filter(a => a.rowNumber === imagedb.rowNumber)
                    }

                    arr_TempImage.push(image);
                    appendTempImage(image);
                    image = {};
                }
            }

            break;
        default:
            break;
    }


}

// PRESCRIPTION DRUG START *************

var appendTempDrug = (drug, tSave = "INS") => {
    var drugOutput = "";
    if (drug) {
        if (tSave == "INS") {

            var emptyRow = $("#tempDrug").find("#emptyRow");

            if (emptyRow.length > 0)
                $("#tempDrug").html("");

            var compoundButton = "";

            if (drug.isCompounded)
                compoundButton = `<button type="button" onclick="addCompoundDrug(${drug.rowNumber})" class="btn blue_outline_1 ml-2" title="داروی ترکیبی">
                                   <i class="fa fa-list"></i>
                                  </button>`

            drugOutput = `<tr id="dr_${drug.rowNumber}">
                             <td>${drug.rowNumber}</td>
                             <td>${drug.productId != 0 ? `${drug.productName}` : ""}</td>
                             <td>${drug.asNeedId != 0 ? `${drug.asNeedName}` : ""}</td>
                             <td>${drug.totalNumber}</td>
                             <td>${drug.totalNumberUnitName}</td>
                             <td>${drug.dosage != 0 ? drug.dosage : ""}</td>
                             <td>${drug.dosageUnitId != 0 ? `${drug.dosageUnitName}` : ""}</td>
                             <td>${drug.frequencyId != 0 ? `${drug.frequencyName}` : ""}</td>
                             <td>${drug.routeId != 0 ? `${drug.routeName}` : ""}</td>
                             <td>${drug.methodId != 0 ? `${drug.methodName}` : ""}</td>
                             <td>${drug.priorityId != 0 ? `${drug.priorityName}` : ""}</td>
                             <td>${drug.reasonId != 0 ? `${drug.reasonName}` : ""}</td>
                             <td>${drug.bodySiteId != 0 ? `${drug.bodySiteName}` : ""}</td>
                             <td>${drug.isCompounded ? "بلی" : "خیر"}</td>
                             <td>${drug.patientInstruction}</td>
                             <td>${drug.description}</td>
                             <td id="operationdr_${drug.rowNumber}">${compoundButton}</td>                     
                          </tr>`

            $(drugOutput).appendTo("#tempDrug");
        }
    }
}

var appendTempDrugC = (drugC, tSave = "INS", drugRowNumber = 0) => {

    var drugOutputC = "";

    if (drugC) {
        if (tSave == "INS") {

            var emptyRow = $("#tempDrugC").find("#emptyRow");

            if (emptyRow.length > 0)
                $("#tempDrugC").html("");

            drugOutputC = `<tr id="drC_${drugC.detailRowNumber}">
                          <td>${drugC.detailRowNumber}</td>
                          <td>${drugC.productId != 0 ? `${drugC.productName}` : ""}</td>
                          <td>${drugC.unitId != 0 ? `${drugC.unitName}` : ""}</td>
                          <td>${drugC.qty}</td>
                          <td>${drugC.qtyMax}</td>
                          <td>${drugC.roleId != 0 ? `${drugC.roleName}` : ""}</td>
                     </tr>`

            $(drugOutputC).appendTo("#tempDrugC");
        }
    }
}



var addCompoundDrug = (rowNumber) => {

    $("#tempDrug tr").removeClass("highlight");
    $(`#dr_${rowNumber}`).addClass("highlight");

    currentDrugRowNumber = rowNumber;



    var detailDrug = arr_TempDrug[currentDrugRowNumber - 1].drugDetail;
    if (detailDrug != null && detailDrug.length > 0) {
        for (var d = 0; d < detailDrug.length; d++) {
            var currentDrugC = arr_TempDrug[currentDrugRowNumber - 1].drugDetail[d];
            appendTempDrugC(currentDrugC);
        }
    }
    else {
        var colspan = $("#tempDrugListC thead th").length;
        $("#tempDrugC").html(emptyRow.replace("thlength", colspan));
    }


    modal_show(`DrugModalC`);
}

$("#modalCloseDrugC").on("click", function () {

    modal_close(`DrugModalC`);
});

// PRESCRIPTION DRUG END *************


// PRESCRIPTION IMAGE START *************

var appendTempImage = (image, tSave = "INS") => {
    var imageOutput = "";

    if (image) {
        if (tSave == "INS") {

            var emptyRow = $("#tempImage").find("#emptyRow");

            if (emptyRow.length > 0)
                $("#tempImage").html("");

            var compoundButton = "";

            if (image.compounded)
                compoundButton = `<button type="button" onclick="addCompoundImage(${image.rowNumber})" class="btn blue_outline_1 ml-2" title="جزئیات">
                                   <i class="fa fa-list"></i>
                              </button>`
            else
                compoundButton = `<span id="operationdr" style="color : red">جزئیات تصویربرداری ندارد</span>`

            imageOutput = `<tr id="im_${image.rowNumber}">
                          <td>${image.rowNumber}</td>
                          <td>${image.serviceId != 0 ? image.serviceName : ""}</td>
                          <td>${image.bodySiteId != 0 ? image.bodySiteName : ""}</td>
                          <td>${image.lateralityId != 0 ? image.lateralityName : ""}</td>
                          <td>${image.note}</td>
                          <td>${image.patientInstruction}</td>
                          <td>${image.compounded ? "بلی" : "خیر"}</td>
                          <td id="operationim_${image.rowNumber}">${compoundButton}</td>
                     </tr>`

            $(imageOutput).appendTo("#tempImage");
        }
    }
}

var appendTempImageC = (imageC) => {

    var imageOutputC = "";

    if (imageC) {

        var emptyRow = $("#tempImageC").find("#emptyRow");

        if (emptyRow.length > 0)
            $("#tempImageC").html("");

        imageOutputC = `<tr id="imC_${imageC.detailRowNumber}">
                          <td>${imageC.detailRowNumber}</td>
                          <td>${imageC.serviceId != 0 ? imageC.serviceName : ""}</td>
                     </tr>`

        $(imageOutputC).appendTo("#tempImageC");
    }
}


var addCompoundImage = (rowNumber) => {

    $("#tempImage tr").removeClass("highlight");
    $(`#im_${rowNumber}`).addClass("highlight");

    currentImageRowNumber = rowNumber;
    let arr_imagedet = arr_TempImage[rowNumber - 1].imageDetail;

    if (arr_imagedet.length > 0) {

        for (var d = 0; d < arr_imagedet.length; d++) {

            var currentImageC = arr_imagedet[d];

            if (currentImageC.rowNumber == currentImageRowNumber)
                appendTempImageC(currentImageC);
        }
    }
    else {
        var colspan = $("#tempImageListC thead th").length;
        $("#tempImageC").html(emptyRow.replace("thlength", colspan));
    }



    modal_show(`ImageModalC`);
}

function modelImageAppend(rowNumberImage) {
    modelImage = {
        headerId: 0,
        rowNumber: rowNumberImage,
        serviceId: +$("#imageServiceId").val(),
        serviceName: $("#imageServiceId").select2('data').length > 0 ? $("#imageServiceId").select2('data')[0].text : "",
        bodySiteId: +$("#imageBodySiteId").val(),
        bodySiteName: $("#imageBodySiteId").select2('data').length > 0 ? $("#imageBodySiteId").select2('data')[0].text : "",
        note: $("#note_Image").val(),
        patientInstruction: $("#patientInstruction").val(),
        lateralityId: +$("#lateralityId").val(),
        lateralityName: $("#lateralityId").select2('data').length > 0 ? $("#lateralityId").select2('data')[0].text : "",
        compounded: $("#imageCompounded").prop("checked"),
        imageDetail: arr_TempImage[rowNumberImage - 1].imageDetail
    }
    appendTempImage(modelImage, typeSaveImage);
    typeSaveImage = "INS";
}

$("#modalCloseImageC").on("click", function () {

    modal_close("ImageModalC");
});

// PERESCRIPTION IMAGE END *************


// PRESCRIPTION LAB START *************

var appendTempLab = (lab, tSave = "INS") => {

    var labOutput = "";

    if (lab) {
        if (tSave == "INS") {

            var emptyRow = $("#tempLab").find("#emptyRow");

            if (emptyRow.length > 0)
                $("#tempLab").html("");

            labOutput = `<tr id="lb_${lab.rowNumber}">
                          <td>${lab.rowNumber}</td>
                          <td>${lab.serviceId != 0 ? `${lab.serviceName}` : ""}</td>
                          <td>${lab.asNeedId != 0 ? `${lab.asNeedName}` : ""}</td>
                          <td>${lab.reasonId != 0 ? `${lab.reasonName}` : ""}</td>
                          <td>${lab.bodySiteId != 0 ? `${lab.bodySiteName}` : ""}</td>
                          <td>${lab.note}</td>
                          <td>${lab.patientInstruction}</td>
                          <td>${lab.doNotPerform ? "بلی" : "خیر"}</td>
                     </tr>`

            $(labOutput).appendTo("#tempLab");
        }
    }
}

// PRESCRIPTION Diag START *************
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
    resetPrescriptionForm("diag");


}

function resetPrescriptionForm(typeBox) {
    if (typeBox == "drug") {

        $("#drugBox .select2").val("").trigger("change");
        $("#drugBox .funkyradio input:checkbox").prop("checked", false).trigger("change");
        $("#drugBox input.form-control").val("");
        $("#productId").select2("focus");
        typeSaveDrug = "INS";
    }
    else if (typeBox == "drugC") {
        $("#drugBoxC .select2").val("").trigger("change");
        $("#drugBoxC input.form-control").val("");
        $("#productIdC").select2("focus");
        typeSaveDrugC = "INS";
    }
    else if (typeBox == "image") {
        $("#imageBox .select2").val("").trigger("change");
        $("#imageBox .funkyradio input:checkbox").prop("checked", false).trigger("change");
        $("#imageBox input.form-control").val("");
        $("#imageServiceId").select2("focus");
        typeSaveImage = "INS";
    }
    else if (typeBox == "imageC") {
        $("#imageBoxC .select2").val("").trigger("change");
        $("#imageServiceIdC").select2("focus");
    }
    else if (typeBox == "lab") {
        $("#labBox #labForm .select2").val("").trigger("change");
        $("#labBox #labForm .funkyradio input:checkbox").prop("checked", false).trigger("change");
        $("#labBox #labForm input.form-control").val("");
        $("#labServiceId").select2("focus");
        typeSaveLab = "INS";
    }
    else if (typeBox == "diag") {
        $("#diagBox .select2").val("").trigger("change");
        $("#diagBox .funkyradio input:checkbox").prop("checked", false).trigger("change");
        $("#diagBox input.form-control").val("");
        $("#statusId").select2("focus");
        typeSaveDiag = "INS";
    }
    else if (typeBox == "tablePrescription") {
        arr_TempDrug = [];
        arr_TempDrugDetail = [];
        arr_TempImageDetail = [];
        arr_TempImage = [];
        arr_TempLab = [];
        arr_TempDiagnosis = [];

        $("#tempDrug").html(fillEmptyRow(16));
        $("#tempDrugC").html(fillEmptyRow(6));
        $("#tempImage").html(fillEmptyRow(8));
        $("#tempImageC").html(fillEmptyRow(2));
        $("#tempLab").html(fillEmptyRow(8));
        $("#tempDiag").html(fillEmptyRow(5));
    }
}

function admissionSearch() {

    var id = +$("#admissionId").val()

    var modelSearch = {
        stateId: 3,
        id: id,
        createDatePersian: $("#createDatePersian").val(),
        patientFullName: $("#patientFullName").val(),
        patientNationalCode: $("#patientNationalCode").val()
    }

    $.ajax({
        url: viewData_get_SearchAdmission,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(modelSearch),
        success: function (result) {
            $("#tempAdmission").html("");
            if (result != null) {
                if (result.length > 0) {
                    if (result.length === 1)
                        setAdmissionInfo(result[0].admissionId);
                    else {

                        var output = "";

                        var len = result.length;

                        for (var a = 0; a < len; a++) {
                            var item = result[a];
                            output = `<tr id="adm_${a}" onclick="focusSearchedRow(${a})" onkeydown="admissionRowKeyDown(${a},event)">
                                    <td>${item.admissionId}</td>
                                    <td>${item.patientId} - ${item.patientFullName}</td>
                                    <td>${item.patientNationalCode}</td>
                                    <td>${item.basicInsurerName}</td>
                                    <td>${item.insuranceBoxName}</td>
                                    <td>${item.compInsuranceBoxName}</td>
                                    <td>${item.admissionHID}</td>
                                    <td>${item.insurExpDatePersian}</td>
                                    <td>${item.attenderFullName}</td>
                                    <td>
                                        <button type="button" onclick="setAdmissionInfo(${item.admissionId})" class="btn btn-info"  data-toggle="tooltip" data-placement="top" data-original-title="انتخاب">
                                              <i class="fa fa-check"></i>
                                        </button>
                                    </td>
                               </tr>`;
                            focusSearchedRow(0);
                            $(output).appendTo("#tempAdmission");
                        }
                    }
                }
                else {
                    output = fillEmptyRow(10);
                    $(output).appendTo("#tempAdmission");
                    return;
                }
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_get_SearchAdmission);
        }
    });

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

function setAdmissionInfo(admissionId) {

    admissionIdentity = +admissionId;
    let data = getfeildByAdmissionId(admissionId)
    
    fillAdmissionInfo(data.admissionId, data.patientId, data.patientFullName,
        data.patientNationalCode, data.basicInsurerName, data.insuranceBoxName, data.compInsuranceBoxName,
        data.admissionHID, data.insurExpDatePersian, data.attenderFullName, data.thirdPartyId, data.thirdPartyName)
}

function fillAdmissionInfo(...data) {
    getDiagnosis(+data[0]);
    $("#admissionSelected").html("");

    var admissionOutput = `<tr>
                               <td>${data[0]}</td> 
                               <td>${data[1]} - ${data[2]}</td> 
                               <td>${data[3]}</td> 
                               <td>${data[4]}</td> 
                               <td>${data[5]}</td> 
                               <td>${data[6]}</td>
                               <td>${data[10] == 0 ? "" : `${data[10]} - ${data[11]}`}</td> 
                               <td>${data[7]}</td> 
                               <td>${data[8]}</td> 
                               <td>${data[9]}</td> 
                           </tr>`

    $("#admissionSelected").html(admissionOutput);
    modal_close("searchAdmissionModal");
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

function prescriptionPrint(prescriptionId) {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    viewData_print_model.value = prescriptionId;
    viewData_print_model.url = `${stimulsBaseUrl.MC.Prn}Prescription.mrt`;

    $.ajax({
        url: viewData_print_direct_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(viewData_print_model),
        async: false,
        cache: false,
        success: function (result) {
            $('#frmDirectPrint').contents().find("body").html("");
            $('#frmDirectPrint')[0].contentWindow.document.write(result);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_print_direct_url);
        }
    });
}

initPrescriptionForm();

$("#list_adm").on("click", function () {

    navigation_item_click('/MC/Prescription', 'لیست نسخه نویسی')
});
