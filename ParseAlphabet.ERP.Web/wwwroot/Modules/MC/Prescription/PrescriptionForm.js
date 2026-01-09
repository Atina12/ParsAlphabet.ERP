$(".tab-content").show();
$(".select2").select2();
//$("input:text").focus(function () { $(this).select(); });

var viewData_controllername = "PrescriptionApi",
    viewData_get_SearchAdmission = `${viewData_baseUrl_MC}/AdmissionApi/searchinbound`,
    viewData_get_productId = `${viewData_baseUrl_MC}/${viewData_controllername}/productid/`,
    viewData_get_asNeedId = `${viewData_baseUrl_MC}/${viewData_controllername}/asneedid/`,
    viewData_get_totalnumberunitid = `${viewData_baseUrl_MC}/${viewData_controllername}/totalnumberunitid`,
    viewData_get_dosageUnitId = `${viewData_baseUrl_MC}/${viewData_controllername}/dosageunitid`,
    viewData_get_frequencyId = `${viewData_baseUrl_MC}/${viewData_controllername}/frequencyid`,
    viewData_get_routeId = `${viewData_baseUrl_MC}/${viewData_controllername}/routeid`,
    viewData_get_methodId = `${viewData_baseUrl_MC}/${viewData_controllername}/methodid`,
    viewData_get_priorityId = `${viewData_baseUrl_MC}/${viewData_controllername}/priorityid`,
    viewData_get_priority = `${viewData_baseUrl_MC}/${viewData_controllername}/prescriptionpriorityid`,
    viewData_get_reasonId = `${viewData_baseUrl_MC}/${viewData_controllername}/reasonid`,
    viewData_get_bodySiteId = `${viewData_baseUrl_MC}/${viewData_controllername}/bodysiteid`,
    viewData_get_lateralityId = `${viewData_baseUrl_MC}/${viewData_controllername}/lateralityId`,
    viewData_get_specimentissuetypeid = `${viewData_baseUrl_MC}/${viewData_controllername}/specimentissuetypeid`,
    viewData_get_specimenAdequacy = `${viewData_baseUrl_MC}/MedicalLaboratoryApi/getspecimenadequacyiddropdown`,
    viewData_get_collectionProcedureId = `${viewData_baseUrl_MC}/MedicalLaboratoryApi/getcollectionprocedureiddropdown`,
    viewData_get_intentid = `${viewData_baseUrl_MC}/${viewData_controllername}/intentid`,
    viewData_get_roleId = `${viewData_baseUrl_MC}/${viewData_controllername}/roleid`,
    viewData_get_iamgeServiceId = `${viewData_baseUrl_MC}/${viewData_controllername}/imageserviceid`,
    viewData_get_iamgeDetailServiceId = `${viewData_baseUrl_MC}/${viewData_controllername}/imagedetailserviceid`,
    viewData_get_labServiceId = `${viewData_baseUrl_MC}/${viewData_controllername}/labserviceid`,
    viewData_get_selectType_service = `/api/AdmissionsApi/selecttypeservcie_getdropdown`,
    viewData_get_ServiceByType = `/api/AdmissionsApi/getservicebytype_getdropdown`,
    viewData_save_Prescription = `${viewData_baseUrl_MC}/${viewData_controllername}/save`,
    viewData_get_AdmissionGetDiagnosis = `${viewData_baseUrl_MC}/AdmissionApi/getdiagnosis`,
    viewData_get_PrescriptionByAdmissionId = `${viewData_baseUrl_MC}/${viewData_controllername}/getprescriptionbyid`,
    viewData_get_StatusId = `${viewData_baseUrl_MC}/${viewData_controllername}/diagnosisstatusid`,
    viewData_get_DiagnosisReasonId = `${viewData_baseUrl_MC}/${viewData_controllername}/diagnosisreasonid`,
    viewData_get_Serverity = `${viewData_baseUrl_MC}/${viewData_controllername}/serverityid`,
    viewData_get_favoritelist = `${viewData_baseUrl_MC}/FavoritePrescriptionApi/getfavoritelist`,
    emptyRow = `<tr id="emptyRow"><td colspan="thlength" class="text-center">سطری وجود ندارد</td></tr>`,
    currentDrugRowNumber = 0, currentDrugRowNumberE = 0, currentDrugDetailsRowNumber = 0, currentImageRowNumber = 0, currentImageRowNumberE = 0, currentLabRowNumber = 0, currentDiagRowNumber = 0,
    prescriptionDrugId = 0, prescriptionImageId = 0, prescriptionLabId = 0, prescriptiongDaigId = 0,
    drugInserted = false, imageInserted = false, labInserted = false, typeSaveDrug = "INS", typeSaveImage = "INS", typeSaveDrugC = "INS", typeSaveLab = "INS", typeSaveDiag = "INS",
    arr_TempDrug = [], arr_TempDrugDetail = [], arr_TempImage = [], arr_TempImageDetail = [], arr_TempLab = [], arr_TempDiagnosis = [],
    admissionIdentity = 0, admissionAttenderId = "", prescriptionId = +$("#prescriptionId").val(), prescriptionType = 0,
    formDrug = $('#drugForm').parsley(), formImage = $('#imageForm').parsley(), formLab = $('#labForm').parsley(),
    diagForm = $('#diagForm').parsley(), formDrugC = $('#drugBoxC').parsley(), formImageC = $('#imageBoxC').parsley();

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

async function initPrescriptionForm() {


    var newOption = new Option("انتخاب کنید", 0, true, true);

    $('#attenderId').append(newOption).trigger('change');
    fill_select2(`${viewData_baseUrl_MC}/Attender_AssistantApi/getdropdown`, "attenderId", true, 0, false, 0, "انتخاب داکتر...");

    inputMask();

    ColumnResizeable("tempDrugList");
    ColumnResizeable("tempImageList");
    ColumnResizeable("tempLabList");
    ColumnResizeable("tempdiagList");

    $("#switchList").bootstrapToggle();
    await bindPrescriptionElement();


    if (prescriptionId !== 0) {
        $("#choiceOfAdmission").css("display", "none")
        getPrescription(prescriptionId);
    }

}

$("#switchList").on("change", async function () {

    var checkStatus = $(this).prop("checked");

    if (!checkStatus && admissionIdentity == 0) {
        let msg = alertify.warning(prMsg.selectAdmission);
        msg.delay(prMsg.delay);
        $('#switchList').bootstrapToggle('on')
        return;
    }

});

$("#prescriptionForm").on("keydown", async (ev) => {

    if (ev.keyCode === KeyCode.F4) {
        ev.preventDefault();
        var check = $("#switchList").prop("checked");
        await loadingFavoriteList(check);
        setTimeout(function () {
            $(".toggle-group").click();
        }, 5);
    }
});

function get_NewPageTable(pg_id = null, isInsert = false, callBack = undefined) {

    if (pg_id == null) pg_id = "pagetable";

    activePageTableId = pg_id;

    let index = arr_pagetables.findIndex(v => v.pagetable_id == pg_id);

    if (!isInsert) {
        arr_pagetables[index].pageNo = 0;
        arr_pagetables[index].currentpage = 1;
    }

    let pagetable_url = arr_pagetables[index].getpagetable_url,
        pagetable_pagerowscount = arr_pagetables[index].pagerowscount,
        pagetable_pageNo = arr_pagetables[index].pageNo,
        pagetable_currentpage = arr_pagetables[index].currentpage,
        configFilterRes = configFilterNewPageTable(pg_id);

    if (!configFilterRes) return;

    var attenderId = +$("#attenderId").val()
    var attenders = ""

    if (attenderId != 0 && checkResponse(attenderId)) {
        var attender = $("#attenderId option:selected").text().split("-")
        attenders = [{ id: +attender[0].trim(), name: attender[1].trim() }]
    } else {
        attenders = []
    }

    let pageViewModel = {
        stateId: 3,
        id: +$("#admissionId").val() == 0 ? null : +$("#admissionId").val(),
        createDatePersian: $("#createDatePersian").val() == "" ? null : $("#createDatePersian").val(),
        patientFullName: $("#patientFullName").val() == "" ? null : $("#patientFullName").val(),
        patientNationalCode: $("#patientNationalCode").val() == "" ? null : $("#patientNationalCode").val(),
        isParaclinic: false,
        attenders,

        pageNo: pagetable_pageNo,
        pageRowsCount: pagetable_pagerowscount,
    }

    pageViewModel.form_KeyValue = pagetable_formkeyvalue;

    let url = "";

    if (pagetable_url === undefined)
        url = viewData_getpagetable_url;
    else
        url = pagetable_url;

    $.ajax({
        url: url,
        type: "POST",
        data: JSON.stringify(pageViewModel),
        dataType: "json",
        contentType: "application/json",
        cache: false,
        success: function (result) {

            if (pagetable_currentpage == 1) fillOption(result, pg_id);

            fill_NewPageTable(result, pg_id, callBack);
            refreshBackPageTable(false, pg_id);
        },
        error: function (xhr) {
            error_handler(xhr, url);
            refreshBackPageTable(true, pg_id);
        }
    });

}

var loadingFavoriteList = async (check) => $(`<i class="fa fa-spinner fa-spin"></i>`).appendTo(`.toggle-group .toggle-${check ? "on" : "off"}`);

async function bindPrescriptionElement() {

    await fill_select2Favorite(1, "productId", true, 0, true);
    await fill_select2Favorite(1, "productIdC", true, 0, true);
    await fill_select2Favorite(2, "asNeedId", true, 0, true);
    await fill_select2Favorite(2, "labAsNeedId", true, 0, true);
    await fill_select2Favorite(3, "dosageUnitId", true, 0, true);
    await fill_select2Favorite(3, "dosageUnitIdC", true, 0, true);
    await fill_select2Favorite(4, "frequencyId", true, 0, true);
    await fill_select2Favorite(5, "routeId", true, 0, true);
    await fill_select2Favorite(6, "methodId", true, 0, true);
    await fill_select2Favorite(7, "priorityId_drug", true, 0, true);
    await fill_select2Favorite(8, "reasonId", true, 0, true);
    await fill_select2Favorite(8, "labReasonId", true, 0, true);
    await fill_select2Favorite(9, "bodySiteId", true, 0, true);
    await fill_select2Favorite(9, "imageBodySiteId", true, 0, true);
    await fill_select2Favorite(9, "labBodySiteId", true, 0, true);
    await fill_select2Favorite(10, "imageServiceId", true, 0, true);
    await fill_select2Favorite(11, "labServiceId", true, 0, true);

    prescriptionElementSelect2Share();
}

async function prescriptionElementSelect2Share() {
    await fill_select2(viewData_get_totalnumberunitid, "totalNumberUnitId", true);
    await fill_select2(viewData_get_priority, "priorityId", true);
    await fill_select2(viewData_get_intentid, "intentId", true);
    await fill_select2(viewData_get_specimenAdequacy, "adequacyForTestingId", true);
    await fill_select2(viewData_get_collectionProcedureId, "collectionProcedureId", true, 0);
    await fill_select2(viewData_get_specimentissuetypeid, "speciementTissueTypeId", true, 0);
    await fill_select2(viewData_get_lateralityId, "lateralityId", true);
    await fill_select2(viewData_get_roleId, "roleIdC", true);
    await fill_select2(viewData_get_iamgeDetailServiceId, "imageServiceIdC", true);
    await fill_select2(viewData_get_StatusId, "statusId", true);
    await fill_select2(viewData_get_DiagnosisReasonId, "diagnosisResonId", true, 0, true);
    await fill_select2(viewData_get_Serverity, "serverityId", true);
    $(".toggle-group .toggle-on .fa-spinner").remove();
}

function getselect2Url(favoriteCategory) {
    if ($("#switchList").prop("checked")) {

        return viewData_get_favoritelist;

    }
    else {
        if (favoriteCategory === 1) {
            return `${viewData_baseUrl_MC}/${viewData_controllername}/productid`
        }
    }
}

function fill_select2Favorite(favoriteCategory, elementid, idandtitle = false, param = 0, isAjax = false, p_minimumInputLength = 3, placeholder = " انتخاب ", callback = undefined, addUrl = "") {

    viewData_get_favoritelist = param == 0 ? viewData_get_favoritelist : `${viewData_get_favoritelist}/${param}`;
    var dataModel = {
        id: admissionAttenderId,
        favoriteCategory: favoriteCategory,
        Term: "",
    }
    var query = {};


    if (isAjax) {
        $(`#${elementid}`).select2({
            placeholder: placeholder,
            templateResult: function (item) {
                if (item.loading) {
                    return item.text;
                }
                var term = query.term || '';
                var $result = markMatch(item.text, term);
                return $result;
            },
            language: {
                searching: function (params) {
                    query = params;
                    return 'در حال جستجو...';
                }
            },
            minimumInputLength: p_minimumInputLength,
            closeOnSelect: true,
            selectOnClose: true,
            allowClear: true,
            ajax: {
                delay: 500,
                url: function () {

                    var favoriteCategory = $(this).attr("favoritecategory");

                    if (!$("#switchList").prop("checked")) {

                        return viewData_get_favoritelist;

                    }
                    else {
                        if (favoriteCategory === "1")
                            return `${viewData_baseUrl_MC}/${viewData_controllername}/productid`
                        else if (favoriteCategory === "2")
                            return `/api/MC/PrescriptionApi/asneedid/`
                        else if (favoriteCategory === "3")
                            return `/api/MC/PrescriptionApi/dosageunitid/`
                        else if (favoriteCategory === "4")
                            return `/api/MC/PrescriptionApi/frequencyid/`
                        else if (favoriteCategory === "5")
                            return `/api/MC/PrescriptionApi/routeid/`
                        else if (favoriteCategory === "6")
                            return `/api/MC/PrescriptionApi/methodid/`
                        else if (favoriteCategory === "7")
                            return `/api/MC/PrescriptionApi/priorityid/`
                        else if (favoriteCategory === "8")
                            return `/api/MC/PrescriptionApi/reasonid/`
                        else if (favoriteCategory === "9")
                            return `/api/MC/PrescriptionApi/bodySiteId/`
                        else if (favoriteCategory === "10")
                            return `/api/MC/PrescriptionApi/imageserviceid/`
                        else  /*if (favoriteCategory === "11")*/
                            return `/api/MC/PrescriptionApi/labServiceId/`
                    }
                },
                async: false,
                data: function (params) {
                    var query = {
                        id: admissionAttenderId,
                        favoriteCategory: favoriteCategory,
                        term: params.term,
                    }
                    return JSON.stringify(query);
                },
                type: "POST",
                dataType: "json",
                contentType: 'application/json',
                quietMillis: select2_delay,
                processResults: function (data) {
                    return {
                        results: $.map(data, function (item) {
                            return {
                                text: idandtitle ? `${item.id} - ${item.name}` : `${item.name}`,
                                id: item.id
                            }
                        })
                    };

                    if ((callback !== void 0) && (typeof callback === "function"))
                        callback();
                }
            }
            //, formatResult: formatSelect2(repo)
        });
    }
    else {
        $.ajax({
            url: viewData_get_favoritelist,
            async: false,
            data: JSON.stringify(dataModel),
            type: "POST",
            dataType: "json",
            contentType: 'application/json',
            success: function (result) {
                if (result) {
                    var data = result.map(function (item) {
                        return {
                            id: item.id, text: idandtitle ? `${item.id} - ${item.name}` : `${item.name}`
                        };
                    });
                    $(`#${elementid}`).select2({
                        templateResult: function (item) {
                            if (item.loading) {
                                return item.text;
                            }
                            var term = query.term || '';
                            var $result = markMatch(item.text, term);
                            return $result;
                        },
                        language: {
                            searching: function (params) {
                                query = params;
                                return 'در حال جستجو...';
                            }
                        },
                        placeholder: placeholder,
                        data: data,
                        closeOnSelect: true,
                        allowClear: true,
                        escapeMarkup: function (markup) {
                            return markup;
                        }
                        //,formatResult: function (res) {
                        //    return $(`<div style="font-size:14px;direction:rtl;margin-right:5px;text-align:right">${item.text}</div>
                        //    <div style="font-size:10px;direction:rtl;margin-right:5px;text-align:right">${item.id}</div>`);
                        //}
                    });

                    $(`#${elementid}`).val(0).trigger('change.select2');
                }
                if (callback != undefined)
                    callback();
            },
            error: function (xhr) {
                if (callback != undefined)
                    callback();
                error_handler(xhr, viewData_get_favoritelist);
            }
        });
    }

    if (addUrl !== "") {
        setTimeout(function () {
            $(`#${elementid}`).attr("qa-addurl", addUrl);
        }, 100);
    }
}

function getPrescription(admId, headerPagination = 0) {

    let nextPrescriptionModel = {
        prescriptionId: admId,
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

function fillPrescription(pr) {

    if (pr !== null) {

        $("#userFullName").val(`${pr.createUserId} - ${pr.userFullName}`);
        $("#creatDateTime").val(pr.createDatePersian);
        $("#prescriptionBox").removeClass("displaynone");

        //$("#reasonEncounter").val(pr.reasonEncounter);

        //fillAdmissionInfo(pr.admissionId, pr.patientId, pr.patientFullName,
        //    pr.patientNationalCode, pr.basicInsurerName, pr.insuranceBoxName, pr.compInsuranceBoxName,
        //    pr.admissionHID, pr.insurExpDatePersian, pr.attenderFullName, pr.thirdPartyId, pr.thirdPartyName)

        fillAdmission(pr)

        admissionIdentity = pr.admissionId;

        prescriptionDrugId = pr.prescriptionDrugId;
        prescriptionImageId = pr.prescriptionImageId;
        prescriptionLabId = pr.prescriptionLabId;
        prescriptiongDaigId = pr.prescriptiongDaigId;
        $("#expiryDatePersian").val(pr.expiryDatePersian);
        $("#repeatCount").val(pr.repeatCount);
        $("#note").val(pr.note);
        $("#intentId").val(pr.intentId).trigger("change");
        $("#adequacyForTestingId").val(pr.adequacyForTestingId).trigger("change");
        $("#collectionProcedureId").val(pr.collectionProcedureId).trigger("change");
        $("#dateTimeCollection").val(pr.collectionDateTimePersian);
        $("#speciementIdentifier").val(pr.specimenIdentifier);
        $("#speciementTissueTypeId").val(pr.specimenTissueTypeId).trigger("change");
        $("#priorityId").val(pr.priorityId).trigger("change");
        $("#prescriptionTypeName").val(`${pr.prescriptionTypeId} - ${pr.prescriptionTypeName}`);
        $("#prescriptionTypeBox").removeClass("d-none");
        prescriptionType = pr.prescriptionTypeId;
        fillLinePrescription(pr.prescriptionTypeId, pr);
    }
};

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

function appendTempDrug(drug, tSave = "INS") {
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
                             <td id="operationdr_${drug.rowNumber}">
                                 <button type="button" id="deleteDrug_${drug.rowNumber}" onclick="removeFromTempDrug(${drug.rowNumber})" class="btn maroon_outline" data-original-title="حذف سطر" style="margin-left:7px">
                                      <i class="fa fa-trash"></i>
                                 </button>
                                 <button type="button" id="EditDrug_${drug.rowNumber}" onclick="EditFromTempDrug(${drug.rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                      <i class="fa fa-pen"></i>
                                 </button>${compoundButton}
                             </td>
                          </tr>`

            $(drugOutput).appendTo("#tempDrug");
        }
        else {
            var i = arr_TempDrug.findIndex(x => x.rowNumber == drug.rowNumber);
            arr_TempDrug[i] = drug;

            $(`#dr_${drug.rowNumber} td:eq(0)`).text(`${drug.rowNumber}`);
            $(`#dr_${drug.rowNumber} td:eq(1)`).text(`${drug.productId != 0 ? `${drug.productName}` : ""}`);
            $(`#dr_${drug.rowNumber} td:eq(2)`).text(`${drug.asNeedId != 0 ? `${drug.asNeedName}` : ""}`);
            $(`#dr_${drug.rowNumber} td:eq(3)`).text(`${drug.totalNumber}`);
            $(`#dr_${drug.rowNumber} td:eq(4)`).text(`${drug.totalNumberUnitName}`);
            //$(`#dr_${drug.rowNumber} td:eq(5)`).text(`${drug.maxNumber}`);
            $(`#dr_${drug.rowNumber} td:eq(5)`).text(`${drug.dosage != 0 ? drug.dosage : ""}`);
            $(`#dr_${drug.rowNumber} td:eq(6)`).text(`${drug.dosageUnitId != 0 ? `${drug.dosageUnitName}` : ""}`);
            $(`#dr_${drug.rowNumber} td:eq(7)`).text(`${drug.frequencyId != 0 ? `${drug.frequencyName}` : ""}`);
            $(`#dr_${drug.rowNumber} td:eq(8)`).text(`${drug.routeId != 0 ? `${drug.routeName}` : ""}`);
            $(`#dr_${drug.rowNumber} td:eq(9)`).text(`${drug.methodId != 0 ? `${drug.methodName}` : ""}`);
            $(`#dr_${drug.rowNumber} td:eq(10)`).text(`${drug.priorityId != 0 ? `${drug.priorityName}` : ""}`);
            $(`#dr_${drug.rowNumber} td:eq(11)`).text(`${drug.reasonId != 0 ? `${drug.reasonName}` : ""}`);
            $(`#dr_${drug.rowNumber} td:eq(12)`).text(`${drug.bodySiteId != 0 ? `${drug.bodySiteName}` : ""}`);
            $(`#dr_${drug.rowNumber} td:eq(13)`).text(`${drug.isCompounded ? "بلی" : "خیر"}`);
            $(`#dr_${drug.rowNumber} td:eq(14)`).text(`${drug.patientInstruction}`);
            $(`#dr_${drug.rowNumber} td:eq(15)`).text(`${drug.description}`);

            var compoundButton = "";
            if (drug.isCompounded)
                compoundButton = `<button type="button" onclick="addCompoundDrug(${drug.rowNumber})" class="btn blue_outline_1 ml-2" title="داروی ترکیبی">
                                   <i class="fa fa-list"></i>
                              </button>`
            $(`#operationdr_${drug.rowNumber}`).html(`<button type="button" id="deleteDrug_${drug.rowNumber}" onclick="removeFromTempDrug(${drug.rowNumber})" class="btn maroon_outline" data-original-title="حذف سطر" style="margin-left:7px">
                                   <i class="fa fa-trash"></i>
                              </button>
                              <button type="button" id="EditDrug_${drug.rowNumber}" onclick="EditFromTempDrug(${drug.rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                   <i class="fa fa-pen"></i>
                              </button>${compoundButton}`);

        }
        resetPrescriptionForm("drug");
    }
}

function appendTempDrugC(drugC, tSave = "INS", drugRowNumber = 0) {

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
                          <td id="operationdrC_${drugC.detailRowNumber}">
                              <button type="button" id="deleteDrugC_${drugC.detailRowNumber}" onclick="removeFromTempDrugC(${drugC.detailRowNumber})" class="btn maroon_outline" data-original-title="حذف سطر" style="margin-left:7px">
                                   <i class="fa fa-trash"></i>
                              </button>
                              <button type="button" id="EditDrugC_${drugC.detailRowNumber}" onclick="EditFromTempDrugC(${drugC.detailRowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                   <i class="fa fa-pen"></i>
                              </button>
                          </td>
                     </tr>`

            $(drugOutputC).appendTo("#tempDrugC");
        }
        else {
            var i = arr_TempDrug[currentDrugRowNumber - 1].drugDetail.findIndex(x => x.detailRowNumber == drugC.detailRowNumber);
            arr_TempDrug[currentDrugRowNumber - 1].drugDetail[i] = drugC;

            $(`#drC_${drugC.detailRowNumber} td:eq(0)`).text(`${drugC.detailRowNumber}`);
            $(`#drC_${drugC.detailRowNumber} td:eq(1)`).text(`${drugC.productId != 0 ? `${drugC.productName}` : ""}`);
            $(`#drC_${drugC.detailRowNumber} td:eq(2)`).text(`${drugC.unitId != 0 ? `${drugC.unitName}` : ""}`);
            $(`#drC_${drugC.detailRowNumber} td:eq(3)`).text(`${drugC.qty}`);
            $(`#drC_${drugC.detailRowNumber} td:eq(4)`).text(`${drugC.qtyMax}`);
            $(`#drC_${drugC.detailRowNumber} td:eq(5)`).text(`${drugC.roleId != 0 ? `${drugC.roleName}` : ""}`);

            $(`#operationdrC_${drugC.detailRowNumber}`).html(` <button type="button" id="deleteDrugC_${drugC.detailRowNumber}" onclick="removeFromTempDrugC(${drugC.detailRowNumber})" class="btn maroon_outline" data-original-title="حذف سطر" style="margin-left:7px">
                                   <i class="fa fa-trash"></i>
                              </button>
                              <button type="button" id="EditDrugC_${drugC.detailRowNumber}" onclick="EditFromTempDrugC(${drugC.detailRowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                   <i class="fa fa-pen"></i>
                              </button>`);

        }
    }
    resetPrescriptionForm("drugC");
}

function EditFromTempDrug(rowNumber) {

    $("#tempDrug tr").removeClass("highlight");
    $(`#dr_${rowNumber}`).addClass("highlight");
    var detailDrug = "";
    $("#productId").select2("focus");

    var arr_TempDrugE = arr_TempDrug.filter(line => line.rowNumber === rowNumber)[0];
    $("#productId").val(arr_TempDrugE.productId);
    detailDrug = new Option(`${arr_TempDrugE.productName}`, arr_TempDrugE.productId, true, true);
    $("#productId").append(detailDrug).trigger('change');
    detailDrug = "";

    $("#asNeedId").val(arr_TempDrugE.asNeedId);
    detailDrug = new Option(`${arr_TempDrugE.asNeedName}`, arr_TempDrugE.asNeedId, true, true);
    $("#asNeedId").append(detailDrug).trigger('change');
    detailDrug = "";

    $("#totalNumber").val(arr_TempDrugE.totalNumber);

    $("#totalNumberUnitId").val(arr_TempDrugE.totalNumberUnitId).trigger('change');

    //$("#maxNumber").val(arr_TempDrugE.maxNumber);

    $("#dosage").val(arr_TempDrugE.dosage);

    $("#dosageUnitId").val(arr_TempDrugE.dosageUnitId).trigger('change');

    $("#frequencyId").val(arr_TempDrugE.frequencyId).trigger('change');

    $("#routeId").val(arr_TempDrugE.routeId).trigger('change');

    $("#methodId").val(arr_TempDrugE.methodId).trigger('change');

    $("#priorityId_drug").val(arr_TempDrugE.priorityId).trigger('change');

    if (arr_TempDrugE.reasonId != 0) {
        $("#reasonId").val(arr_TempDrugE.reasonId);
        detailDrug = new Option(`${arr_TempDrugE.reasonName}`, arr_TempDrugE.reasonId, true, true);
        $("#reasonId").append(detailDrug).trigger('change');
        detailDrug = "";
    }

    $("#bodySiteId").val(arr_TempDrugE.bodySiteId).trigger('change');
    $("#patientInstruction").val(arr_TempDrugE.patientInstruction);
    $("#description").val(arr_TempDrugE.description);
    //$("#patientInstruction_drug").val(arr_TempDrugE.patientInstruction);*/

    var elm = $(`#${'isCompounded'}`);
    var switchValue = elm.attr("switch-value").split(',');
    if (arr_TempDrugE.isCompounded == true) {
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
    $(`#isCompounded`).blur();
    typeSaveDrug = "UPD";
    currentDrugRowNumberE = arr_TempDrugE.rowNumber;
}

function EditFromTempDrugC(detailRowNumber) {

    $("#tempDrugC tr").removeClass("highlight");
    $(`#drC_${detailRowNumber}`).addClass("highlight");
    $("#productIdC").select2("focus");

    var detailDrugC = "";
    var arr_TempDrugDetailE = arr_TempDrug[currentDrugRowNumber - 1].drugDetail.filter(line => line.detailRowNumber === detailRowNumber)[0];

    $("#productIdC").val(arr_TempDrugDetailE.productId);
    detailDrugC = new Option(`${arr_TempDrugDetailE.productName}`, arr_TempDrugDetailE.productId, true, true);
    $("#productIdC").append(detailDrugC).trigger('change');
    detailDrugC = "";

    $("#dosageUnitIdC").val(arr_TempDrugDetailE.unitId).trigger('change');

    $("#qtyC").val(arr_TempDrugDetailE.qty);
    $("#qtyMaxC").val(arr_TempDrugDetailE.qtyMax);

    $("#roleIdC").val(arr_TempDrugDetailE.roleId).trigger('change');

    typeSaveDrugC = "UPD";
    currentDrugDetailsRowNumber = arr_TempDrugDetailE.detailRowNumber;
}

function removeFromTempDrug(rowNumber) {
    currentDrugRowNumber = rowNumber;

    $("#tempDrug tr").removeClass("highlight");
    $(`#dr_${rowNumber}`).addClass("highlight");

    var removeRowResult = removeRowFromArray(arr_TempDrug, "rowNumber", rowNumber);

    if (removeRowResult.statusMessage == "removed")
        $(`#dr_${rowNumber}`).remove();

    if (arr_TempDrug.length == 0) {
        var colspan = $("#tempDrugList thead th").length;
        $("#tempDrug").html(emptyRow.replace("thlength", colspan));
    }

    rebuildDrugRow();
}

function removeFromTempDrugC(detailRowNumber) {
    currentDrugDetailsRowNumber = detailRowNumber;

    $("#tempDrugC tr").removeClass("highlight");
    $(`#drC_${currentDrugDetailsRowNumber}`).addClass("highlight");

    var removeRowResultC = removeRowFromArray(arr_TempDrug[currentDrugRowNumber - 1].drugDetail, "detailRowNumber", currentDrugDetailsRowNumber);

    if (removeRowResultC.statusMessage == "removed")
        $(`#drC_${detailRowNumber}`).remove();

    if (arr_TempDrug[currentDrugRowNumber - 1].drugDetail.length == 0) {
        var colspan = $("#tempDrugListC thead th").length;
        $("#tempDrugC").html(emptyRow.replace("thlength", colspan));
    }

    rebuildDrugRowC();
}

function rebuildDrugRow() {
    var arr = arr_TempDrug;

    var table = "tempDrug";

    if (arr.length === 0)
        return;

    for (var b = 0; b < arr.length; b++) {
        var newRowNumber = b + 1;
        var arrC = arr_TempDrug[b].drugDetail;

        arr[b].rowNumber = newRowNumber;

        $(`#${table} tr`)[b].children[0].innerText = arr[b].rowNumber;
        $(`#${table} tr`)[b].setAttribute("id", `dr_${arr[b].rowNumber}`);

        if ($(`#${table} tr`)[b].children[16].innerHTML !== "") {
            var compoundButton = "";

            if (arr[b].isCompounded)
                compoundButton = `<button type="button" onclick="addCompoundDrug(${arr[b].rowNumber})" class="btn blue_outline_1 ml-2" title="داروی ترکیبی">
                                   <i class="fa fa-list"></i>
                              </button>`

            $(`#${table} tr`)[b].children[16].innerHTML = `<button type="button" onclick="removeFromTempDrug(${arr[b].rowNumber})" class="btn maroon_outline" data-toggle="tooltip" data-placement="bottom" title="حذف سطر" style="margin-left:7px">
                                                                     <i class="fa fa-trash"></i>
                                                           </button>
                                                           <button type="button" onclick="EditFromTempDrug(${arr[b].rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                                                <i class="fa fa-pen"></i>
                                                           </button>
                                                           ${compoundButton}`;
        }

        for (var bc = 0; bc < arrC.length; bc++) {
            arr_TempDrug[b].drugDetail[bc].rowNumber = newRowNumber;
        }
    }

    arr_TempDrug = arr;
}

function rebuildDrugRowC() {
    var arr = arr_TempDrug;

    if (arr.length === 0)
        return;

    for (var i = 0; i < arr.length; i++) {

        var arrC = arr[i].drugDetail;
        var table = "tempDrugC";

        if (arrC.length === 0)
            continue;

        for (var b = 0; b < arrC.length; b++) {
            arrC[b].detailRowNumber = b + 1;

            if (typeof $(`#${table} tr`)[b] !== "undefined") {

                $(`#${table} tr`)[b].children[0].innerText = arrC[b].detailRowNumber;
                $(`#${table} tr`)[b].setAttribute("id", `drC_${arrC[b].detailRowNumber}`);

                if ($(`#${table} tr`)[b].children[6].innerHTML !== "") {

                    $(`#${table} tr`)[b].children[6].innerHTML = `<button type="button" onclick="removeFromTempDrugC(${arrC[b].detailRowNumber})" class="btn maroon_outline" data-toggle="tooltip" data-placement="bottom" title="حذف دارو ترکیبی">
                                                                     <i class="fa fa-trash"></i>
                                                           </button> <button type="button" onclick="EditFromTempDrugC(${arrC[b].detailRowNumber})" class="btn green_outline_1" data-original-title="ویرایش دارو ترکیبی" style="margin-left:7px">
                                   <i class="fa fa-pen"></i>
                              </button>`;
                }
            }
        }

        arr_TempDrug[i].drugDetail = arrC;
    }
}

function addCompoundDrug(rowNumber) {

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

$("#addDrug").on("click", function () {

    var validate = formDrug.validate();
    validateSelect2(formDrug);
    if (!validate) return;

    var checkExist = false;

    if (+$("#productId").val() == 0) {
        var msgNotDefined = alertify.warning(prMsg.selectDrugProductId);
        msgNotDefined.delay(prMsg.delay);
        $("#productId").select2("focus");
        return;
    }
    //if (+$("#totalNumber").val() > +$("#maxNumber").val()) {
    //    var msgNotDefined = alertify.warning(prMsg.checkQtyMaxDrug);
    //    msgNotDefined.delay(prMsg.delay);
    //    $("#productId").select2("focus");
    //    return;
    //}

    var modelDrug = {};

    if (typeSaveDrug == "INS") {
        checkExist = checkNotExistValueInArray(arr_TempDrug, 'productId', +$("#productId").val());

        if (!checkExist) {
            var msgExist = alertify.warning(prMsg.existItem);
            msgExist.delay(prMsg.delay);
            return;
        }

        var rowNumberDrug = arr_TempDrug.length + 1;

        modelDrug = {
            headerId: 0,
            rowNumber: rowNumberDrug,
            productId: +$("#productId").val(),
            productName: $("#productId").select2('data').length > 0 ? $("#productId").select2('data')[0].text : "",
            dosageUnitId: +$("#dosageUnitId").val(),
            dosageUnitName: $("#dosageUnitId").select2('data').length > 0 ? $("#dosageUnitId").select2('data')[0].text : "",
            priorityId: +$("#priorityId_drug").val(),
            priorityName: $("#priorityId_drug").select2('data').length > 0 ? $("#priorityId_drug").select2('data')[0].text : "",
            reasonId: +$("#reasonId").val(),
            reasonName: $("#reasonId").select2('data').length > 0 ? $("#reasonId").select2('data')[0].text : "",
            asNeedId: +$("#asNeedId").val(),
            asNeedName: $("#asNeedId").select2('data').length > 0 ? $("#asNeedId").select2('data')[0].text : "",
            dosage: +$("#dosage").val(),
            frequencyId: +$("#frequencyId").val(),
            frequencyName: $("#frequencyId").select2('data').length > 0 ? $("#frequencyId").select2('data')[0].text : "",
            routeId: +$("#routeId").val(),
            routeName: $("#routeId").select2('data').length > 0 ? $("#routeId").select2('data')[0].text : "",
            methodId: +$("#methodId").val(),
            methodName: $("#methodId").select2('data').length > 0 ? $("#methodId").select2('data')[0].text : "",
            bodySiteId: +$("#bodySiteId").val(),
            bodySiteName: $("#bodySiteId").select2('data').length > 0 ? $("#bodySiteId").select2('data')[0].text : "",
            isCompounded: $("#isCompounded").prop("checked"),
            totalNumber: +$("#totalNumber").val(),
            maxNumber: 0,
            totalNumberUnitId: +$("#totalNumberUnitId").val(),
            totalNumberUnitName: $("#totalNumberUnitId").select2('data').length > 0 ? $("#totalNumberUnitId").select2('data')[0].text : "",
            patientInstruction: $("#patientInstruction").val(),
            description: $("#description").val(),
            patientInstruction: $("#patientInstruction_drug").val(),
            drugDetail: []
        }
        arr_TempDrug.push(modelDrug);
        appendTempDrug(modelDrug, typeSaveDrug);
        typeSaveDrug = "INS";
    }
    else {
        var rowNumberDrug = currentDrugRowNumberE;
        if ($("#isCompounded").prop("checked") == false) {
            var tmpChek = arr_TempDrug[rowNumberDrug - 1].drugDetail;

            if (tmpChek == undefined)
                tmpChek = [];

            if (tmpChek.length > 0) {
                alertify.confirm('اخطار', "دارای داروی ترکیبی می باشد در صورت عدم انتخاب داروهای ترکیبی حذف میشوند",
                    function () {
                        arr_TempDrug[rowNumberDrug - 1].drugDetail = [];
                        modelDrugAppend(rowNumberDrug);
                    },
                    function () {
                        return;
                    }
                ).set('labels', { ok: 'بله', cancel: 'خیر' });
            }
            else {
                modelDrugAppend(rowNumberDrug)
            }
        }
        else {
            modelDrugAppend(rowNumberDrug)
        }
    }
});

$("#canceledDrug").on("click", function () {

    $("#drugBox .select2").val("").trigger("change");
    $("#drugBox .funkyradio input:checkbox").prop("checked", false).trigger("change");
    $("#drugBox input.form-control").val("");
    $("#productId").select2("focus");

    typeSaveDrug = "INS";

});

function modelDrugAppend(rowNumberDrug) {

    var modelDrug = {
        headerId: 0,
        rowNumber: rowNumberDrug,
        productId: +$("#productId").val(),
        productName: $("#productId").select2('data').length > 0 ? $("#productId").select2('data')[0].text : "",
        totalNumber: +$("#totalNumber").val(),
        maxNumber: 0,
        totalNumberUnitId: +$("#totalNumberUnitId").val(),
        totalNumberUnitName: $("#totalNumberUnitId").select2('data').length > 0 ? $("#totalNumberUnitId").select2('data')[0].text : "",
        dosageUnitId: +$("#dosageUnitId").val(),
        dosageUnitName: $("#dosageUnitId").select2('data').length > 0 ? $("#dosageUnitId").select2('data')[0].text : "",
        priorityId: +$("#priorityId_drug").val(),
        priorityName: $("#priorityId_drug").select2('data').length > 0 ? $("#priorityId_drug").select2('data')[0].text : "",
        reasonId: +$("#reasonId").val(),
        reasonName: $("#reasonId").select2('data').length > 0 ? $("#reasonId").select2('data')[0].text : "",
        asNeedId: +$("#asNeedId").val(),
        asNeedName: $("#asNeedId").select2('data').length > 0 ? $("#asNeedId").select2('data')[0].text : "",
        dosage: +$("#dosage").val(),
        frequencyId: +$("#frequencyId").val(),
        frequencyName: $("#frequencyId").select2('data').length > 0 ? $("#frequencyId").select2('data')[0].text : "",
        routeId: +$("#routeId").val(),
        routeName: $("#routeId").select2('data').length > 0 ? $("#routeId").select2('data')[0].text : "",
        methodId: +$("#methodId").val(),
        methodName: $("#methodId").select2('data').length > 0 ? $("#methodId").select2('data')[0].text : "",
        bodySiteId: +$("#bodySiteId").val(),
        bodySiteName: $("#bodySiteId").select2('data').length > 0 ? $("#bodySiteId").select2('data')[0].text : "",
        isCompounded: $("#isCompounded").prop("checked"),
        description: $("#description").val(),
        patientInstruction: $("#patientInstruction_drug").val(),
        drugDetail: arr_TempDrug[rowNumberDrug - 1].drugDetail
    }

    appendTempDrug(modelDrug, typeSaveDrug);
    typeSaveDrug = "INS";
}

$("#addDrugC").on("click", function () {


    var validate = formDrugC.validate();
    validateSelect2(formDrugC);
    if (!validate) return;
    if (+$("#qtyC").val() > +$("#qtyMaxC").val()) {
        var msgNotDefined = alertify.warning(prMsg.checkQtyMaxDrug);
        msgNotDefined.delay(prMsg.delay);
        $("#productIdC").select2("focus");
        return;
    }

    if (typeSaveDrugC == "INS") {
        if (typeof arr_TempDrug[currentDrugRowNumber - 1].drugDetail.find(f => f.productId == +$("#productIdC").val()) !== "undefined") {
            var msgExist = alertify.warning(prMsg.existItem);
            msgExist.delay(prMsg.delay);
            return;
        }

        var drugC = {
            headerID: 0,
            rowNumber: currentDrugRowNumber,
            detailRowNumber: arr_TempDrug[currentDrugRowNumber - 1].drugDetail.length + 1,
            productId: +$("#productIdC").val(),
            productName: $("#productIdC").select2('data').length > 0 ? $("#productIdC").select2('data')[0].text : "",
            qty: +$("#qtyC").val(),
            qtyMax: +$("#qtyMaxC").val(),
            unitId: +$("#dosageUnitIdC").val(),
            unitName: $("#dosageUnitIdC").select2('data').length > 0 ? $("#dosageUnitIdC").select2('data')[0].text : "",
            roleId: +$("#roleIdC").val(),
            roleName: $("#roleIdC").select2('data').length > 0 ? $("#roleIdC").select2('data')[0].text : "",
        }

        arr_TempDrug[currentDrugRowNumber - 1].drugDetail.push(drugC);
    }
    else {
        var drugC = {
            headerID: 0,
            rowNumber: currentDrugRowNumber,
            detailRowNumber: currentDrugDetailsRowNumber,
            productId: +$("#productIdC").val(),
            productName: $("#productIdC").select2('data').length > 0 ? $("#productIdC").select2('data')[0].text : "",
            qty: +$("#qtyC").val(),
            qtyMax: +$("#qtyMaxC").val(),
            unitId: +$("#dosageUnitIdC").val(),
            unitName: $("#dosageUnitIdC").select2('data').length > 0 ? $("#dosageUnitIdC").select2('data')[0].text : "",
            roleId: +$("#roleIdC").val(),
            roleName: $("#roleIdC").select2('data').length > 0 ? $("#roleIdC").select2('data')[0].text : "",
        }
    }
    appendTempDrugC(drugC, typeSaveDrugC, currentDrugRowNumber - 1);
    typeSaveDrugC = "INS";
});

$("#canceledDrugC").on("click", function () {

    $("#drugBoxC .select2").val("").trigger("change");
    $("#drugBoxC input.form-control").val("");
    $("#productIdC").select2("focus");

    typeSaveDrugC = "INS";

});

$("#DrugModalC").on("shown.bs.modal", function () {


    $("#productIdC").select2("focus");

    formDrugC.reset();

});

$("#DrugModalC").on("hidden.bs.modal", function () {
    currentDrugRowNumber = 0;
    $("#tempDrugC").html("");
});

$("#modalCloseDrugC").on("click", function () {

    modal_close("DrugModalC");
});

// PRESCRIPTION DRUG END *************


// PRESCRIPTION IMAGE START *************

function appendTempImage(image, tSave = "INS") {
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

            imageOutput = `<tr id="im_${image.rowNumber}">
                          <td>${image.rowNumber}</td>
                          <td>${image.serviceId != 0 ? image.serviceName : ""}</td>
                          <td>${image.bodySiteId != 0 ? image.bodySiteName : ""}</td>
                          <td>${image.lateralityId != 0 ? image.lateralityName : ""}</td>
                          <td>${image.note}</td>
                          <td>${image.patientInstruction}</td>
                          <td>${image.compounded ? "بلی" : "خیر"}</td>
                          <td id="operationim_${image.rowNumber}">
                              <button type="button" id="deleteImage_${image.rowNumber}" onclick="removeFromTempImage(${image.rowNumber})" class="btn maroon_outline" data-original-title="حذف سطر" style="margin-left:7px">
                                   <i class="fa fa-trash"></i>
                              </button><button type="button" id="deleteImage_${image.rowNumber}" onclick="EditFromTempImage(${image.rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                   <i class="fa fa-pen"></i>
                              </button>${compoundButton}
                          </td>
                     </tr>`

            $(imageOutput).appendTo("#tempImage");
        }
        else {
            var i = arr_TempImage.findIndex(x => x.rowNumber == image.rowNumber);
            arr_TempImage[i] = image;

            $(`#im_${image.rowNumber} td:eq(0)`).text(`${image.rowNumber}`);
            $(`#im_${image.rowNumber} td:eq(1)`).text(`${image.serviceId != 0 ? image.serviceName : ""}`);
            $(`#im_${image.rowNumber} td:eq(2)`).text(`${image.bodySiteId != 0 ? image.bodySiteName : ""}`);
            $(`#im_${image.rowNumber} td:eq(3)`).text(`${image.lateralityId != 0 ? image.lateralityName : ""}`);
            $(`#im_${image.rowNumber} td:eq(4)`).text(`${image.note}`);
            $(`#im_${image.rowNumber} td:eq(5)`).text(`${image.patientInstruction}`);
            $(`#im_${image.rowNumber} td:eq(6)`).text(`${image.compounded ? "بلی" : "خیر"}`);

            var compoundButton = "";
            if (image.compounded)
                compoundButton = `<button type="button" onclick="addCompoundImage(${image.rowNumber})" class="btn blue_outline_1 ml-2" title="جزئیات">
                                   <i class="fa fa-list"></i>
                              </button>`

            $(`#operationim_${image.rowNumber}`).html(` <button type="button" id="deleteImage_${image.rowNumber}" onclick="removeFromTempImage(${image.rowNumber})" class="btn maroon_outline" data-original-title="حذف سطر" style="margin-left:7px">
                                   <i class="fa fa-trash"></i>
                              </button><button type="button" id="deleteImage_${image.rowNumber}" onclick="EditFromTempImage(${image.rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                   <i class="fa fa-pen"></i>
                              </button>${compoundButton}`);
        }
    }
    resetPrescriptionForm("image");
}

function appendTempImageC(imageC) {

    var imageOutputC = "";

    if (imageC) {

        var emptyRow = $("#tempImageC").find("#emptyRow");

        if (emptyRow.length > 0)
            $("#tempImageC").html("");

        imageOutputC = `<tr id="imC_${imageC.detailRowNumber}">
                          <td>${imageC.detailRowNumber}</td>
                          <td>${imageC.serviceId != 0 ? imageC.serviceName : ""}</td>
                          <td id="operationimC_${imageC.detailRowNumber}">
                              <button type="button" id="deleteImageC_${imageC.detailRowNumber}" onclick="removeFromTempImageC(${imageC.detailRowNumber})" class="btn maroon_outline" data-original-title="حذف سطر" style="margin-left:7px">
                                   <i class="fa fa-trash"></i>
                              </button>
                          </td>
                     </tr>`

        $(imageOutputC).appendTo("#tempImageC");
    }

    resetPrescriptionForm("imageC");

}

function EditFromTempImage(rowNumber) {

    $("#imageServiceId").select2("focus");

    $("#tempImage tr").removeClass("highlight");
    $(`#im_${rowNumber}`).addClass("highlight");
    var TempImage = "";
    var arr_TempImageE = arr_TempImage.filter(line => line.rowNumber === rowNumber)[0];
    $("#imageServiceId").val(arr_TempImageE.serviceId);
    TempImage = new Option(`${arr_TempImageE.serviceName}`, arr_TempImageE.serviceId, true, true);
    $("#imageServiceId").append(TempImage).trigger('change');
    TempImage = "";

    $("#imageBodySiteId").val(arr_TempImageE.bodySiteId).trigger('change');
    $("#lateralityId").val(arr_TempImageE.lateralityId).trigger('change');

    $("#note_Image").val(arr_TempImageE.note);
    $("#patientInstruction").val(arr_TempImageE.patientInstruction);

    var elm = $(`#${'imageCompounded'}`);
    var switchValue = elm.attr("switch-value").split(',');
    if (arr_TempImageE.compounded == true) {
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
    $(`#imageCompounded`).blur();

    typeSaveImage = "UPD";
    currentImageRowNumberE = arr_TempImageE.rowNumber;
}

function removeFromTempImageC(detailRowNumber) {

    $("#tempImageC tr").removeClass("highlight");
    $(`#imC_${detailRowNumber}`).addClass("highlight");
    var removeRowResultC = removeRowFromArray(arr_TempImage[currentImageRowNumber - 1].imageDetail, "detailRowNumber", detailRowNumber);

    if (removeRowResultC.statusMessage == "removed")
        $(`#imC_${detailRowNumber}`).remove();

    if (arr_TempImage[currentImageRowNumber - 1].imageDetail.length == 0) {
        var colspan = $("#tempImageListC thead th").length;
        $("#tempImageC").html(emptyRow.replace("thlength", colspan));
    }
    rebuildImageRowC();
}

function removeFromTempImage(rowNumber) {
    currentImageRowNumber = rowNumber;

    $("#tempImage tr").removeClass("highlight");
    $(`#im_${rowNumber}`).addClass("highlight");
    let removeRowResult = removeRowFromArray(arr_TempImage, "rowNumber", rowNumber);

    if (removeRowResult.statusMessage == "removed")
        $(`#im_${rowNumber}`).remove();

    if (arr_TempImage.length == 0) {
        var colspan = $("#tempImageList thead th").length;
        $("#tempImage").html(emptyRow.replace("thlength", colspan));
    }

    rebuildImageRow();
}

function rebuildImageRow() {

    let arrImage = arr_TempImage, table = "tempImage";

    if (arrImage.length === 0)
        return;

    for (var m = 0; m < arrImage.length; m++) {

        var newRowNumber = m + 1;
        var arrC = arrImage[m].imageDetail;

        arrImage[m].rowNumber = m + 1;

        if (typeof $(`#${table} tr`)[m].children[7] !== "undefined") {

            $(`#${table} tr`)[m].children[0].innerText = arrImage[m].rowNumber;
            $(`#${table} tr`)[m].setAttribute("id", `mi_${arrImage[m].rowNumber}`);

            if ($(`#${table} tr`)[m].children[7].innerHTML !== "") {
                var compoundButton = "";
                if (arrImage[m].compounded)
                    compoundButton = `<button type="button" onclick="addCompoundImage(${arrImage[m].rowNumber})" class="btn blue_outline_1 ml-2" title="جزئیات">
                                   <i class="fa fa-list"></i>
                              </button>`
                $(`#${table} tr`)[m].children[7].innerHTML = `<button type="button" onclick="removeFromTempImage(${arrImage[m].rowNumber})" class="btn maroon_outline" data-toggle="tooltip" data-placement="bottom" title="حذف سطر" style="margin-left:7px">
                                                                     <i class="fa fa-trash"></i>
                                                           </button>
                                                        <button type="button" onclick="EditFromTempImage(${arrImage[m].rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                                               <i class="fa fa-pen"></i>
                                                          </button>
                                                          ${compoundButton}`;
            }
        }

        for (var bc = 0; bc < arrC.length; bc++)
            arrImage[m].imageDetail[bc].rowNumber = newRowNumber;

    }

    arr_TempImage = arrImage;
}

function rebuildImageRowC() {

    if (arr_TempImage.length === 0)
        return;

    for (var i = 0; i < arr_TempImage.length; i++) {
        var arrImC = arr_TempImage[i].imageDetail;
        var table = "tempImageC";

        if (arrImC.length === 0)
            continue;

        for (var mc = 0; mc < arrImC.length; mc++) {
            arrImC[mc].detailRowNumber = mc + 1;
            if (typeof $(`#${table} tr`)[mc] !== "undefined") {

                $(`#${table} tr`)[mc].children[0].innerText = arrImC[mc].detailRowNumber;
                $(`#${table} tr`)[mc].setAttribute("id", `imC_${arrImC[mc].detailRowNumber}`);

                if ($(`#${table} tr`)[mc].children[2].innerHTML !== "") {

                    $(`#${table} tr`)[mc].children[2].innerHTML = `<button type="button" onclick="removeFromTempImageC(${arrImC[mc].detailRowNumber})" class="btn maroon_outline" data-toggle="tooltip" data-placement="bottom" title="حذف جزئیات">
                                                                     <i class="fa fa-trash"></i>
                                                           </button>`;
                }
            }
        }

        arr_TempImage[i].imageDetail = arrImC;
    }
}

function addCompoundImage(rowNumber) {

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

$("#addImage").on("click", function () {

    var validate = formImage.validate();
    validateSelect2(formImage);
    if (!validate) return;

    if (+$("#imageServiceId").val() == 0) {
        var msgNotDefined = alertify.warning(prMsg.selectService);
        msgNotDefined.delay(prMsg.delay);

        return;
    }
    var modelImage = {};

    if (typeSaveImage == "INS") {
        var checkExist = false;
        checkExist = checkNotExistValueInArray(arr_TempImage, 'serviceId', +$("#imageServiceId").val());
        if (!checkExist) {
            var msgExist = alertify.warning(prMsg.existService);
            msgExist.delay(prMsg.delay);
            $("#imageServiceId").select2("focus");
            return;
        }
        var rowNumberImage = arr_TempImage.length + 1;
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
            imageDetail: []
        }
        arr_TempImage.push(modelImage);
        appendTempImage(modelImage, typeSaveImage);
        typeSaveImage = "INS";

    }
    else {
        var rowNumberImage = currentImageRowNumberE;
        if ($("#imageCompounded").prop("checked") == false) {

            var arrCheckCompounded = arr_TempImage[rowNumberImage - 1].imageDetail;

            if (typeof arrCheckCompounded === "undefined") {
                modelImageAppend(rowNumberImage)
            }
            else if (arrCheckCompounded.length === 0) {
                modelImageAppend(rowNumberImage)
            }
            else {
                alertify.confirm('اخطار', "دارای  جزئیات تصویربرداری می باشد در صورت عدم انتخاب  جزئیات تصویربرداری حذف میشوند",
                    function () {
                        arr_TempImage[rowNumberImage - 1].imageDetail = [];
                        modelImageAppend(rowNumberImage);
                    },
                    function () {
                        return;
                    }
                ).set('labels', { ok: 'بله', cancel: 'خیر' });
            }
        }
        else {
            modelImageAppend(rowNumberImage)
        }
    }
});

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

$("#addImageC").on("click", function () {

    var validate = formImageC.validate();
    validateSelect2(formImageC);
    if (!validate) return;


    if (typeof arr_TempImage[currentImageRowNumber - 1].imageDetail.find(f => f.serviceId == +$("#imageServiceIdC").val()) !== "undefined") {
        var msgExistImageC = alertify.warning(prMsg.existService);
        msgExistImageC.delay(prMsg.delay);
        $("#imageServiceIdC").select2("focus");
        return;
    }

    var imageC = {
        headerId: 0,
        rowNumber: currentImageRowNumber,
        detailRowNumber: arr_TempImage[currentImageRowNumber - 1].imageDetail.length + 1,
        serviceId: +$("#imageServiceIdC").val(),
        serviceName: $("#imageServiceIdC").select2('data').length > 0 ? $("#imageServiceIdC").select2('data')[0].text : "",
    }
    arr_TempImage[currentImageRowNumber - 1].imageDetail.push(imageC);
    appendTempImageC(imageC);
});

$("#canceledImage").on("click", function () {

    $("#imageBox .select2").val("").trigger("change");
    $("#imageBox .funkyradio input:checkbox").prop("checked", false).trigger("change");
    $("#imageBox input.form-control").val("");
    $("#imageServiceId").select2("focus");

    typeSaveImage = "INS";

});

$("#ImageModalC").on("shown.bs.modal", function () {
    $("#imageServiceIdC").select2("focus");
    formImageC.reset();
});

$("#ImageModalC").on("hidden.bs.modal", function () {
    currentImageRowNumber = 0;
    $("#tempImageC").html("");
});

$("#modalCloseImageC").on("click", function () {

    modal_close("ImageModalC");
});

// PERESCRIPTION IMAGE END *************


// PRESCRIPTION LAB START *************

$("#addLab").on("click", function () {

    var validate = formLab.validate();
    validateSelect2(formLab);
    if (!validate) return;

    var checkExist = false;
    var modelLab = {};

    if (+$("#labServiceId").val() == 0) {
        var msgNotDefined = alertify.warning(prMsg.selectService);
        msgNotDefined.delay(prMsg.delay);
        return;
    }

    var typeSaveF = typeSaveLab;
    if (typeSaveF == "INS") {

        checkExist = checkNotExistValueInArray(arr_TempLab, 'serviceId', +$("#labServiceId").val());

        if (!checkExist) {
            var msgExist = alertify.warning(prMsg.existService);
            msgExist.delay(prMsg.delay);
            $("#labServiceId").select2("focus");
            return;
        }

        var rowNumberLab = arr_TempLab.length + 1;


        modelLab = {
            headerId: 0,
            rowNumber: rowNumberLab,
            serviceId: +$("#labServiceId").val(),
            serviceName: $("#labServiceId").select2('data').length > 0 ? $("#labServiceId").select2('data')[0].text : "",
            asNeedId: +$("#labAsNeedId").val(),
            asNeedName: $("#labAsNeedId").select2('data').length > 0 ? $("#labAsNeedId").select2('data')[0].text : "",
            reasonId: +$("#labReasonId").val(),
            reasonName: $("#labReasonId").select2('data').length > 0 ? $("#labReasonId").select2('data')[0].text : "",
            bodySiteId: +$("#labBodySiteId").val(),
            bodySiteName: $("#labBodySiteId").select2('data').length > 0 ? $("#labBodySiteId").select2('data')[0].text : "",
            note: $("#labNote").val(),
            patientInstruction: $("#labPatientInstruction").val(),
            doNotPerform: $("#doNotPerform").prop("checked")
        }

        arr_TempLab.push(modelLab);

    }
    else {
        var rowNumberLab = currentLabRowNumber;


        modelLab = {
            headerId: 0,
            rowNumber: rowNumberLab,
            serviceId: +$("#labServiceId").val(),
            serviceName: $("#labServiceId").select2('data').length > 0 ? $("#labServiceId").select2('data')[0].text : "",
            asNeedId: +$("#labAsNeedId").val(),
            asNeedName: $("#labAsNeedId").select2('data').length > 0 ? $("#labAsNeedId").select2('data')[0].text : "",
            reasonId: +$("#labReasonId").val(),
            reasonName: $("#labReasonId").select2('data').length > 0 ? $("#labReasonId").select2('data')[0].text : "",
            bodySiteId: +$("#labBodySiteId").val(),
            bodySiteName: $("#labBodySiteId").select2('data').length > 0 ? $("#labBodySiteId").select2('data')[0].text : "",
            note: $("#labNote").val(),
            patientInstruction: $("#labPatientInstruction").val(),
            doNotPerform: $("#doNotPerform").prop("checked")
        }
    }
    appendTempLab(modelLab, typeSaveF);
    typeSaveLab = "INS";
});

$("#canceledLab").on("click", function () {

    $("#labBox #labForm .select2").val("").trigger("change");
    $("#labBox #labForm .funkyradio input:checkbox").prop("checked", false).trigger("change");
    $("#labBox #labForm input.form-control").val("");
    $("#labServiceId").select2("focus");

    typeSaveLab = "INS";

});

function appendTempLab(lab, tSave = "INS") {

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
                          <td id="operationlb_${lab.rowNumber}">
                              <button type="button" id="deleteLab_${lab.rowNumber}" onclick="removeFromTempLab(${lab.rowNumber})" class="btn maroon_outline" data-original-title="حذف سطر" style="margin-left:7px">
                                   <i class="fa fa-trash"></i>
                              </button><button type="button" id="EditLab_${lab.rowNumber}" onclick="EditFromTempLab(${lab.rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                   <i class="fa fa-pen"></i>
                              </button>
                          </td>
                     </tr>`

            $(labOutput).appendTo("#tempLab");
        }
        else {
            var i = arr_TempLab.findIndex(x => x.rowNumber == lab.rowNumber);
            arr_TempLab[i].headerId = lab.headerId;
            arr_TempLab[i].rowNumber = lab.rowNumber;
            arr_TempLab[i].serviceId = lab.serviceId;
            arr_TempLab[i].serviceName = lab.serviceName;
            arr_TempLab[i].asNeedId = lab.asNeedId;
            arr_TempLab[i].asNeedName = lab.asNeedName;
            arr_TempLab[i].reasonId = lab.reasonId;
            arr_TempLab[i].reasonName = lab.reasonName;
            arr_TempLab[i].bodySiteId = lab.bodySiteId;
            arr_TempLab[i].bodySiteName = lab.bodySiteName;
            arr_TempLab[i].note = lab.note;
            arr_TempLab[i].patientInstruction = lab.patientInstruction;
            arr_TempLab[i].doNotPerform = lab.doNotPerform;

            $(`#lb_${lab.rowNumber} td:eq(0)`).text(`${lab.rowNumber}`);
            $(`#lb_${lab.rowNumber} td:eq(1)`).text(`${lab.serviceId != 0 ? `${lab.serviceName}` : ""}`);
            $(`#lb_${lab.rowNumber} td:eq(2)`).text(`${lab.asNeedId != 0 ? `${lab.asNeedName}` : ""}`);
            $(`#lb_${lab.rowNumber} td:eq(3)`).text(`${lab.reasonId != 0 ? `${lab.reasonName}` : ""}`);
            $(`#lb_${lab.rowNumber} td:eq(4)`).text(`${lab.bodySiteId != 0 ? `${lab.bodySiteName}` : ""}`);
            $(`#lb_${lab.rowNumber} td:eq(5)`).text(`${lab.note}`);
            $(`#lb_${lab.rowNumber} td:eq(6)`).text(`${lab.patientInstruction}`);
            $(`#lb_${lab.rowNumber} td:eq(7)`).text(`${lab.doNotPerform ? "بلی" : "خیر"}`);
        }
    }
    resetPrescriptionForm("lab");

}

function EditFromTempLab(rowNumber) {

    $("#labServiceId").select2("focus");

    $("#tempLab tr").removeClass("highlight");
    $(`#lb_${rowNumber}`).addClass("highlight");
    var arr_TempLabAppend = "";
    var arr_TempLabE = arr_TempLab.filter(line => line.rowNumber === rowNumber)[0];

    $("#labServiceId").val(arr_TempLabE.serviceId);
    arr_TempLabAppend = new Option(`${arr_TempLabE.serviceName}`, arr_TempLabE.serviceId, true, true);
    $("#labServiceId").append(arr_TempLabAppend).trigger('change');
    arr_TempLabAppend = "";

    $("#labAsNeedId").val(arr_TempLabE.asNeedId);
    arr_TempLabAppend = new Option(`${arr_TempLabE.asNeedName}`, arr_TempLabE.asNeedId, true, true);
    $("#labAsNeedId").append(arr_TempLabAppend).trigger('change');
    arr_TempLabAppend = "";

    if (arr_TempLabE.reasonId != 0) {
        $("#labReasonId").val(arr_TempLabE.reasonId);
        arr_TempLabAppend = new Option(`${arr_TempLabE.reasonName}`, arr_TempLabE.reasonId, true, true);
        $("#labReasonId").append(arr_TempLabAppend).trigger('change');
        arr_TempLabAppend = "";
    }

    $("#labBodySiteId").val(arr_TempLabE.bodySiteId).trigger('change');

    $("#labPatientInstruction").val(arr_TempLabE.patientInstruction);

    $("#labNote").val(arr_TempLabE.note);

    var elm = $(`#${'doNotPerform'}`);
    var switchValue = elm.attr("switch-value").split(',');
    if (arr_TempLabE.doNotPerform == true) {
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
    $(`#doNotPerform`).blur();
    typeSaveLab = "UPD";
    currentLabRowNumber = arr_TempLabE.rowNumber;
}

function removeFromTempLab(rowNumber) {

    currentLabRowNumber = rowNumber;
    $("#tempLab tr").removeClass("highlight");
    $(`#lb_${rowNumber}`).addClass("highlight");

    var removeRowResult = removeRowFromArray(arr_TempLab, "rowNumber", rowNumber);

    if (removeRowResult.statusMessage == "removed")
        $(`#lb_${rowNumber}`).remove();

    if (arr_TempLab.length == 0) {
        var colspan = $("#tempLabList thead th").length;
        $("#tempLab").html(emptyRow.replace("thlength", colspan));
    }

    rebuildLabRow();
}

function rebuildLabRow() {
    var arrLab = arr_TempLab;
    var table = "tempLab";

    if (arrLab.length === 0)
        return;

    for (var l = 0; l < arrLab.length; l++) {
        arrLab[l].rowNumber = l + 1;
        $(`#${table} tr`)[l].children[0].innerText = arrLab[l].rowNumber;
        $(`#${table} tr`)[l].setAttribute("id", `lb_${arrLab[l].rowNumber}`);
        $(`#${table} tr`)[l].children[0].innerText = arrLab[l].rowNumber;

        if ($(`#${table} tr`)[l].children[8].innerHTML !== "") {

            $(`#${table} tr`)[l].children[8].innerHTML = `<button type="button" onclick="removeFromTempLab(${arrLab[l].rowNumber})" class="btn maroon_outline" data-toggle="tooltip" data-placement="bottom" title="حذف سطر" style="margin-left:7px">
                                                                     <i class="fa fa-trash"></i>
                                                           </button></button><button type="button" onclick="EditFromTempLab(${arrLab[l].rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                                               <i class="fa fa-pen"></i>
                                                          </button>`;
        }
    }

    arr_TempLab = arrLab;
}

// PERESCRIPTION LAB END *************

// PERESCRIPTION Diagnosis Start *************

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
        modelDiag = {
            admissionId: 0,
            rowNumber: rowNumberDiag,
            statusId: +$("#statusId").val(),
            statusName: $("#statusId").select2('data').length > 0 ? $("#statusId").select2('data')[0].text : "",
            diagnosisResonId: +$("#diagnosisResonId").val(),
            diagnosisResonName: $("#diagnosisResonId").select2('data').length > 0 ? $("#diagnosisResonId").select2('data')[0].text : "",
            serverityId: +$("#serverityId").val(),
            serverityName: $("#serverityId").select2('data').length > 0 ? $("#serverityId").select2('data')[0].text : "",
            comment: $("#comment").val()
        };
        arr_TempDiagnosis.push(modelDiag);
    }
    else {
        var rowNumberDiag = currentDiagRowNumber;
        modelDiag = {
            admissionId: 0,
            rowNumber: rowNumberDiag,
            statusId: +$("#statusId").val(),
            statusName: $("#statusId").select2('data').length > 0 ? $("#statusId").select2('data')[0].text : "",
            diagnosisResonId: +$("#diagnosisResonId").val(),
            diagnosisResonName: $("#diagnosisResonId").select2('data').length > 0 ? $("#diagnosisResonId").select2('data')[0].text : "",
            serverityId: +$("#serverityId").val(),
            serverityName: $("#serverityId").select2('data').length > 0 ? $("#serverityId").select2('data')[0].text : "",
            comment: $("#comment").val()
        };
    }

    appendTempDiagnosis(modelDiag, typeSaveDiag);
    typeSaveDiag = "INS";
});

$("#canceledDiagnosis").on("click", function () {

    $("#diagBox .select2").val("").trigger("change");
    $("#diagBox .funkyradio input:checkbox").prop("checked", false).trigger("change");
    $("#diagBox input.form-control").val("");
    $("#statusId").select2("focus");

    typeSaveDiag = "INS";

});

function appendTempDiagnosis(diag, tSave = "INS") {

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
            arr_TempDiagnosis[i].comment = diag.comment;

            $(`#dg_${diag.rowNumber} td:eq(0)`).text(`${diag.rowNumber}`);
            $(`#dg_${diag.rowNumber} td:eq(1)`).text(`${diag.statusId != 0 ? `${diag.statusName}` : ""}`);
            $(`#dg_${diag.rowNumber} td:eq(2)`).text(`${diag.diagnosisResonId != 0 ? `${diag.diagnosisResonName}` : ""}`);
            $(`#dg_${diag.rowNumber} td:eq(3)`).text(`${diag.serverityId != 0 ? `${diag.serverityName}` : ""}`);
            $(`#dg_${diag.rowNumber} td:eq(4)`).text(`${diag.comment}`);
        }
    }
    resetPrescriptionForm("diag");


}

function EditFromTempDiag(rowNumber) {

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

    $("#comment").val(arr_TempDiagE.comment);

    typeSaveDiag = "UPD";
    currentDiagRowNumber = arr_TempDiagE.rowNumber;
}

function removeFromTempDiag(rowNumber) {

    currentDiagRowNumber = rowNumber;
    $("#tempDiag tr").removeClass("highlight");
    $(`#dg_${rowNumber}`).addClass("highlight");

    var removeRowResult = removeRowFromArray(arr_TempDiagnosis, "rowNumber", rowNumber);

    if (removeRowResult.statusMessage == "removed")
        $(`#dg_${rowNumber}`).remove();

    if (arr_TempDiagnosis.length == 0) {
        var colspan = $("#tempDaigList thead th").length;
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

        if ($(`#${table} tr`)[l].children[5].innerHTML !== "") {

            $(`#${table} tr`)[l].children[5].innerHTML = `<button type="button" onclick="removeFromTempDiag(${arrDiag[l].rowNumber})" class="btn maroon_outline" data-toggle="tooltip" data-placement="bottom" title="حذف سطر" style="margin-left:7px">
                                                                     <i class="fa fa-trash"></i>
                                                           </button></button><button type="button" onclick="EditFromTempDiag(${arrDiag[l].rowNumber})" class="btn green_outline_1" data-original-title="ویرایش سطر" style="margin-left:7px">
                                                               <i class="fa fa-pen"></i>
                                                          </button>`;
        }
    }

    arr_TempDiagnosis = arrDiag;
}

// PERESCRIPTION Diagnosis END *************

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

        $("#tempDrug").html(fillEmptyRow(15));
        $("#tempDrugC").html(fillEmptyRow(7));
        $("#tempImage").html(fillEmptyRow(7));
        $("#tempImageC").html(fillEmptyRow(3));
        $("#tempLab").html(fillEmptyRow(9));
    }
}

function admissionSearch() {

    let pg_id = "searchAdmissionModal_pagetable";
    get_NewPageTable(pg_id);

}

function get_NewPageTable(pg_id = null, isInsert = false, callBack = undefined) {

    if (pg_id == null) pg_id = "pagetable";

    activePageTableId = pg_id;

    let index = arr_pagetables.findIndex(v => v.pagetable_id == pg_id);

    if (!isInsert) {
        arr_pagetables[index].pageNo = 0;
        arr_pagetables[index].currentpage = 1;
    }

    let pagetable_url = arr_pagetables[index].getpagetable_url,
        pagetable_pagerowscount = arr_pagetables[index].pagerowscount,
        pagetable_pageNo = arr_pagetables[index].pageNo,
        pagetable_currentpage = arr_pagetables[index].currentpage,
        configFilterRes = configFilterNewPageTable(pg_id);

    if (!configFilterRes) return;

    //let pagetable_filteritem = arr_pagetables[index].filteritem,
    //    pagetable_filtervalue = arr_pagetables[index].filtervalue;

    var id = +$("#admissionId").val() == 0 ? null : +$("#admissionId").val()
    var attenderId = +$("#attenderId").val()
    var attenders = [];


    if (attenderId != 0 && checkResponse(attenderId)) {
        var attender = $("#attenderId option:selected").text().split("-")
        attenders = [{ id: +attender[0].trim(), name: attender[1].trim() }]
    } else {
        attenders = []
    }

    let pageViewModel = {
        stateId: 3,
        id: id,
        createDatePersian: $("#createDatePersian").val() == "" ? null : $("#createDatePersian").val(),
        patientFullName: $("#patientFullName").val() == "" ? null : $("#patientFullName").val(),
        patientNationalCode: $("#patientNationalCode").val() == "" ? null : $("#patientNationalCode").val(),
        isParaclinic: false,
        attenders,
        headerTableName: "mc.Prescription",

        pageno: pagetable_pageNo,
        pagerowscount: pagetable_pagerowscount,
        fieldItem: "",
        fieldValue: "",
        form_KeyValue: [0],
        sortModel: {
            colId: dataOrder.colId,
            sort: dataOrder.sort
        }
    }

    pageViewModel.form_KeyValue = pagetable_formkeyvalue;

    let url = "";

    if (pagetable_url === undefined)
        url = viewData_getpagetable_url;
    else
        url = pagetable_url;

    $.ajax({
        url: url,
        type: "POST",
        data: JSON.stringify(pageViewModel),
        dataType: "json",
        contentType: "application/json",
        cache: false,
        success: function (result) {

            if (pagetable_currentpage == 1) fillOption(result, pg_id);

            fill_NewPageTable(result, pg_id, callBack);
            refreshBackPageTable(false, pg_id);
        },
        error: function (xhr) {
            error_handler(xhr, url);
            refreshBackPageTable(true, pg_id);
        }
    });

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
    admissionAttenderId = +data.attenderId
    getDiagnosis(+data.admissionId);
}

function displayAdmission(id, elm) {

    let row = $(elm).parent().parent()
    let admissionId = row.data("admissionid")
    let workflowId = row.data("workflowid")
    let stageId = row.data("stageid")

    let workflowStage = getAdmissionTypeId(stageId, workflowId)
    let admissionTypeId = workflowStage.admissionTypeId

    //if (admissionTypeId == 1)
    //    getRequestData(`${viewData_baseUrl_MC}/AdmissionItemApi/display`, admissionTypeId, admissionId);
    //else if (admissionTypeId == 2 || admissionTypeId == 3 || admissionTypeId == 4)
    getRequestData(`${viewData_baseUrl_MC}/AdmissionApi/display`, admissionTypeId, admissionId);
}

function getDiagnosis(admId) {
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

function fillDiagnosis(data) {
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
            rebuildDaigRow()
        }
        // Diagnosis
    }
};

async function savePrescriptionForm() {

    await disableSaveButtonAsync(true);

    if ((arr_TempLab.length > 0 || arr_TempImage.length > 0) && prescriptionType != 1) {
        let from = $("#headerForm").parsley();
        let validtion = from.validate();
        validateSelect2(from);
        if (!validtion) {
            $("#saveForm").removeAttr("disabled");
            return;
        }
    }

    if (arr_TempLab.length > 0) {
        let from = $("#labHeader").parsley();
        let validtion = from.validate();
        validateSelect2(from);
        if (!validtion) {
            $("#saveForm").removeAttr("disabled");
            return;
        }

    }

    if (!isValidShamsiDate($("#expiryDatePersian").val())) {
        var notValidExpireDate = alertify.error(prMsg.notValidExpireDate);
        notValidExpireDate.delay(prMsg.delay);
        $("#saveForm").removeAttr("disabled");
        $("#expiryDatePersian").focus();
        return;
    }

    if (+$("#repeatCount").val() === 0) {
        var notValidExpireDate = alertify.error(prMsg.repeatCount);
        notValidExpireDate.delay(prMsg.delay);
        $("#saveForm").removeAttr("disabled");
        $("#repeatCount").focus();
        return;
    }

    if (admissionIdentity == 0) {
        var msg_temp_srv = alertify.error(prMsg.selectAdmission);
        msg_temp_srv.delay(prMsg.delay);
        $("#saveForm").removeAttr("disabled");
        return;
    }

    if (arr_TempDrug.length === 0 && arr_TempImage.length === 0 && arr_TempLab.length === 0) {
        var msg_temp_srv = alertify.error(prMsg.notHasItem);
        msg_temp_srv.delay(prMsg.delay);
        $("#saveForm").removeAttr("disabled");
        return;
    }

    if (arr_TempDiagnosis.length === 0) {
        var msg_temp_srv = alertify.error("لطفا تشخیص را وارد کنید");
        msg_temp_srv.delay(prMsg.delay);
        $("#saveForm").removeAttr("disabled");
        return;
    }

    var drugError = [];
    var imageError = [];

    for (var i = 0; i < arr_TempDrug.length; i++) {
        var cdr = arr_TempDrug[i];

        if (cdr.isCompounded) {

            var hasDetail = arr_TempDrug[i].drugDetail.length == 0;
            if (hasDetail) {
            }
            if (hasDetail) {
                $(`#dr_${cdr.rowNumber}`).addClass("highlight");
                drugError.push(cdr.rowNumber);
            } else {
                var hasLenght = arr_TempDrug[i].drugDetail.length;
                if (hasLenght < 2) {
                    $(`#dr_${cdr.rowNumber}`).addClass("highlight");
                    drugError.push(cdr.rowNumber);
                }
            }
        }
    }

    if (drugError.length !== 0) {
        var error = `برای سطرهای ${drugError.join(',')} داروی ترکیبی کمتر از دو سطر مشخص شده`;
        var msgdrugError = alertify.error(error);
        msgdrugError.delay(prMsg.delay);
        await disableSaveButtonAsync(false);
        return;
    }

    for (var i = 0; i < arr_TempImage.length; i++) {
        var cdi = arr_TempImage[i];

        if (cdi.compounded) {


            var hasDetail = arr_TempImage[i].imageDetail.length == 0;
            if (hasDetail) {
                $(`#im_${cdi.rowNumber}`).addClass("highlight");
                imageError.push(cdi.rowNumber);
            }
        }
    }

    if (imageError.length !== 0) {
        var error = `برای سطرهای ${imageError.join(',')} جزئیات تصویربرداری مشخص نشده`;
        var msgImageError = alertify.error(error);
        msgImageError.delay(prMsg.delay);
        await disableSaveButtonAsync(false);
        return;
    }

    for (var i = 0; i < arr_TempDiagnosis.length; i++)
        arr_TempDiagnosis[i].admissionId = admissionIdentity;

    getDetailsOfDrugAndIMage();

    var model = {
        fromPrescriptionId: prescriptionId,
        prescriptionDrugId: prescriptionDrugId,
        prescriptionImageId: prescriptionImageId,
        prescriptionLabId: prescriptionLabId,
        prescriptiongDaigId: prescriptiongDaigId,
        admissionId: admissionIdentity,
        reasonEncounter: /*$("#reasonEncounter").val()*/"",
        expiryDatePersian: $("#expiryDatePersian").val(),
        repeatCount: +$("#repeatCount").val(),
        priorityId: +$("#priorityId").val(),
        note: $("#note").val(),
        intentId: +$("#intentId").val(),
        adequacyForTestingId: +$("#adequacyForTestingId").val(),
        collectionProcedureId: +$("#collectionProcedureId").val(),
        collectionDateTimePersian: $("#dateTimeCollection").val(),
        specimenIdentifier: $("#speciementIdentifier").val(),
        specimenTissueTypeId: +$("#speciementTissueTypeId").val(),
        prescriptionDrugLineList: arr_TempDrug,
        prescriptionDrugLineDetailList: arr_TempDrugDetail,
        prescriptionImageLineList: arr_TempImage,
        prescriptionImageLineDetailList: arr_TempImageDetail,
        prescriptionLabLineList: arr_TempLab,
        prescriptionDiagnoses: arr_TempDiagnosis
    }
    let modelSave = configModelSave(prescriptionType, model);
    savePrescriptionAsync(modelSave).then(async (data) => {

        drugInserted = data.data.item1.id != 0;
        imageInserted = data.data.item2.id != 0;
        labInserted = data.data.item3.id != 0;

        var drugResult = data.data.item1;
        var imageResult = data.data.item2;
        var labResult = data.data.item3;

        var resultSave = drugResult.successfull && imageResult.successfull && labResult.successfull;

        if (resultSave) {


            var messageSuccessAlert = alertify.success(prMsg.insert_success);
            messageSuccessAlert.delay(prMsg.delay);

            setTimeout(() => {
                navigation_item_click("/MC/Prescription", "لیست نسخه نویسی");
            }, 500);
        }
        else {

            if (!drugResult.successfull) {
                if (drugResult.status !== -99) {
                    var msgDrug = alertify.error(prMsg.errorDrug);
                    msgDrug.delay(prMsg.delay);
                    $("#drugBox .select2,#drugBox input.form-control,#drugBox .funkyradio,#drugBox button").prop("disabled", false);
                }
            }
            else if (drugResult.successfull) {
                $("#drugBox .select2,#drugBox input.form-control,#drugBox .funkyradio").prop("disabled", true);
                // prescriptionPrint(drugResult.id, `${stimulsBaseUrl.MC.Prn}PrescriptionDrug.mrt`);

                setTimeout(() => {
                    navigation_item_click("/MC/Prescription", "لیست نسخه نویسی");
                }, 500);
            }

            if (!imageResult.successfull) {
                if (imageResult.status !== -99) {
                    var msgImage = alertify.error(prMsg.errorImage);
                    msgImage.delay(prMsg.delay);
                    $("#imageBox .select2,#imageBox input.form-control,#imageBox .funkyradio,#imageBox button").prop("disabled", false);
                }
            }
            else if (imageResult.successfull) {
                $("#imageBox .select2,#imageBox input.form-control,#imageBox .funkyradio").prop("disabled", true);
                //prescriptionPrint(imageResult.id, `${stimulsBaseUrl.MC.Prn}PrescriptionImage.mrt`);

                setTimeout(() => {
                    navigation_item_click("/MC/Prescription", "لیست نسخه نویسی");
                }, 500);
            }

            if (!labResult.successfull) {
                if (labResult.status !== -99) {
                    var msgLab = alertify.error(prMsg.errorLab);
                    msgLab.delay(prMsg.delay);
                    $("#labBox .select2,#labBox input.form-control,#labBox .funkyradio,#labBox button").prop("disabled", false);
                }
            }
            else if (labResult.successfull) {
                $("#labBox .select2,#labBox input.form-control,#labBox .funkyradio").prop("disabled", true);
                //prescriptionPrint(labResult.id, `${stimulsBaseUrl.MC.Prn}PrescriptionLab.mrt`);

                setTimeout(() => {
                    navigation_item_click("/MC/Prescription", "لیست نسخه نویسی");
                }, 500);
            }
        }

        await disableSaveButtonAsync(!resultSave);

    }).then(async () => {
        await disableSaveButtonAsync(false);
    });

};

function getDetailsOfDrugAndIMage() {
    arr_TempImageDetail = [];
    let arr_Idetails = [];
    for (var i = 0; i < arr_TempImage.length; i++) {
        arr_Idetails = arr_TempImage[i].imageDetail;
        for (var j = 0; j < arr_Idetails.length; j++) {
            arr_TempImageDetail.push(arr_Idetails[j]);
        }
    }

    arr_TempDrugDetail = [];
    let arr_Ddetails = [];
    for (var i = 0; i < arr_TempDrug.length; i++) {
        arr_Ddetails = arr_TempDrug[i].drugDetail;
        for (var j = 0; j < arr_Ddetails.length; j++) {
            arr_TempDrugDetail.push(arr_Ddetails[j]);
        }
    }

}

function configModelSave(type, model) {
    if (type == 0)
        return model;
    else {
        switch (type) {
            case 1://Drug
                model.prescriptionImageLineList = null;
                model.prescriptionImageLineDetailList = null;
                model.prescriptionLabLineList = null;
                break;
            case 2://LAb
                model.prescriptionDrugLineList = null;
                model.prescriptionDrugLineDetailList = null;
                model.prescriptionImageLineList = null;
                model.prescriptionImageLineDetailList = null;
                break;
            case 3://Image
                model.prescriptionDrugLineList = null;
                model.prescriptionDrugLineDetailList = null;
                model.prescriptionLabLineList = null;
                break;
            default:
                break;

        }
        return model;
    }
}

async function disableSaveButtonAsync(disable) {
    $("#saveForm").prop("disabled", disable);
}

async function savePrescriptionAsync(prescription) {
    let result = await $.ajax({
        url: viewData_save_Prescription,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(prescription),
        success: function (data) {
            return data;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_save_Prescription);
            return {
                status: -100,
                statusMessage: "عملیات با خطا مواجه شد",
                successfull: false
            };
        }
    });

    return result;
}

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

function resetFormPrescription() {
    alertify.confirm('بازنشانی', "آیا اطمینان دارید؟",
        function () {
            //switchListAccess = true
            admissionIdentity = 0
            admissionAttenderId = ""
            arr_TempDrug = [];
            arr_TempDrugDetail = [];
            arr_TempImage = [];
            arr_TempImageDetail = [];
            arr_TempLab = [];
            arr_TempDiagnosis = [];

            $("#tempDrug").html(fillEmptyRow(15));
            $("#tempImage").html(fillEmptyRow(7));
            $("#tempLab").html(fillEmptyRow(9));
            $("#tempDiag").html(fillEmptyRow(6));
            $("#tempAdmission").html(fillEmptyRow(10));
            $("#admissionSelected").html("");
            $("#tempDrugC").html(fillEmptyRow(8));
            $("#tempImageC").html(fillEmptyRow(8));
            $("#admissionId").val("");
            $("#PatientNationalCode").val("");
            $("#PatientFullName").val("");
            $("#createDatePersian").val("");
            $("#searchAdmission").val("");
            //$("#reasonEncounter").val("");

            $("#prescriptionId").val(0);
            prescriptionId = 0;
            $("#userFullName").val("");
            $("#note").val("");
            $("#priorityId").val("").trigger("change");

            $("#prescriptionBox").addClass("displaynone");

            $("#prescriptionTypeBox").addClass("d-none");
            $("#prescriptionTypeName").val("");

            $("#drugBox .select2").val("").trigger("change");
            $("#drugBox .funkyradio input:checkbox").prop("checked", false).trigger("change");
            $("#drugBox input.form-control").val("");

            $("#drugBoxC .select2").val("").trigger("change");
            $("#drugBoxC input.form-control").val("");

            $("#imageBox .select2").val("").trigger("change");
            $("#imageBox .funkyradio input:checkbox").prop("checked", false).trigger("change");
            $("#imageBox input.form-control").val("");

            $("#imageBoxC .select2").val("").trigger("change");

            $("#labBox .select2").val("").trigger("change");
            $("#labBox .funkyradio input:checkbox").prop("checked", false).trigger("change");
            $("#labBox input.form-control").val("");

            $("#diagBox .select2").val("").trigger("change");
            $("#diagBox .funkyradio input:checkbox").prop("checked", false).trigger("change");
            $("#diagBox input.form-control").val("");

            $("#choiceOfAdmission").css("display", "inline")
            $("#switchList").bootstrapToggle('on')
        },
        function () {
            return;
        }
    ).set('labels', { ok: 'بله', cancel: 'خیر' });
}

initPrescriptionForm();

$("#list_adm").on("click", function () {

    navigation_item_click('/MC/Prescription', 'لیست نسخه نویسی')
});
