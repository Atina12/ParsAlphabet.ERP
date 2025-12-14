var viewData_controllername = "AdmissionReportApi",
    viewData_form_title = "گزارش خلاصه بیمه گرها",
    reportUrl = `${stimulsBaseUrl.MC.Rep}AadmissionInsuranceCompulsoryContributionReportPreview.mrt`,
    reportTiltle = "",
    arrayIdsAS = [],
    roleId = getRoleId(),
    form = $('.card-body').parsley(),
    valueDate = { from: "", to: "" },
    viewData_PreviewReport_GetReport = `${viewData_baseUrl_MC}/${viewData_controllername}/repinsurersummarypreviewgetpage`,
    viewData_PreviewReport_GetHeader = `${viewData_baseUrl_MC}/${viewData_controllername}/admissionInsurancePreviewColumns`,
    fill_dataSelectAdmissionV1 = `${viewData_baseUrl_MC}/AdmissionApi/getlistadmissioninsurerthirdpartystatev1`;


function initRepAdmissionSummaryInsurerSearchReport() {

    settingReportModule();
    getHeaderColumns();

    $(".select2").select2();
    $("#fromInsurerReserveDate").inputmask();
    $("#toInsurerReserveDate").inputmask();


    fill_select2(`${viewData_baseUrl_GN}/BranchApi/getdropdown`, "branchId", true, 0, false, 3, "", () => { $("#branchId").trigger("change") }, "", false, false, true);

    fill_select2Stage("stageId");

    $("#basicInsurerLineId").attr("disabled", true);
    $("#compInsurerLineId").attr("disabled", true);


    if ($("#fromInsurerReserveDate").val() !== "" && $("#toInsurerReserveDate").val() !== "")
        fillElmntInsurer()
    focusInput(1);

}

async function fillElmntInsurer(callback) {

    let isValid = checkDateIsOnMonth($("#fromInsurerReserveDate").val(), $("#toInsurerReserveDate").val())

    if (isValid) {
        valueDate.from = $("#fromInsurerReserveDate").val();
        valueDate.to = $("#toInsurerReserveDate").val();
        fillElmntInsurerOneByOne(callback);
    }
    else
        emptyElmntInsurerOneByOne(callback);
}

async function fill_select2WithData(result, elementid, isNotMultipel = true, selectabel = false, callBack = undefined) {
    var query = {}, arrayIds = [], placeholder = "";
    $(`#${elementid}`).html("");

    if (result) {
        var data = result.map(function (item) {
            arrayIds.push(item.id);
            return {
                id: item.id, text: `${item.id} - ${item.name}`
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
            allowClear: isNotMultipel,
            escapeMarkup: function (markup) {
                return markup;
            }
        });

        $(`#${elementid}`).val(0).trigger('change.select2');
    }
    if (!isNotMultipel) {
        $(`#${elementid}`).parent().find(".btn-multipel-more").remove();
        $(`#${elementid}`).on("change", function () { onchangeMultipel(this) });
        $(`#${elementid}`).parent().addClass("multiple-maxheight").removeClass("multiple-maxheight-md");
    }

    if (selectabel) {
        fillselect2MultiPle(elementid, arrayIds, ++counter);
        if (arrayIds.length !== 0)
            $(`#${elementid}`).prepend("<optgroup></optgroup>");
    }
    $(`#${elementid}`).prop("disabled", false);

    if (typeof callBack !== "undefined") callBack();
}

async function fillElmntInsurerOneByOne(callback) {

    let modelFill = {
        type: 8,
        basicInsurerIds: "",
        compInsurerIds: "",
        fromReserveDatePersian: $("#fromInsurerReserveDate").val(),
        toReserveDatePersian: $("#toInsurerReserveDate").val()
    }

    data = getDataDropDown(modelFill);

    await fill_select2WithData(data.workflowList, "workflowId", false, true);
    await fill_select2WithData(data.stageList, "stageId", false, true);
    await fill_select2WithData(data.actionList, "actionId", false, true);
    await fill_select2WithData(data.basicInsurerList, "basicInsurerId", false, true);
    await fill_select2WithData(data.compInsurerList, "compInsurerId", false, true);
    await fill_select2WithData(data.thirdPartyList, "thirdPartyId", false, true);
    await fill_select2WithData(data.discountList, "discountId", false, true);
    await fill_select2WithData(data.serviceTypeList, "serviceTypeId", false, true);

    if (checkResponse(callback))
        callback()
}

async function emptyElmntInsurerOneByOne(callback) {

    await fill_select2WithData([], "workflowId", false, true);
    await fill_select2WithData([], "stageId", false, true);
    await fill_select2WithData([], "actionId", false, true);
    await fill_select2WithData([], "basicInsurerId", false, true);
    await fill_select2WithData([], "compInsurerId", false, true);
    await fill_select2WithData([], "thirdPartyId", false, true);
    await fill_select2WithData([], "discountId", false, true);
    await fill_select2WithData([], "serviceTypeId", false, true);

    if (checkResponse(callback))
        callback()
}

function getDataDropDown(modelFill) {

    let res = $.ajax({
        url: fill_dataSelectAdmissionV1,
        type: "post",
        dataType: "json",
        async: false,
        contentType: "application/json",
        data: JSON.stringify(modelFill),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, fill_dataSelectAdmissionV1);
        }
    });

    return res.responseJSON;
}

function fill_select2Stage(elementid) {
    $(`#${elementid}`).html(`<option value="0">انتخاب کنید</option>`);
    let data = Object.keys(admissionStage).map(function (item) {
        return {
            id: admissionStage[item].id, text: admissionStage[item].id + " - " + admissionStage[item].name
        };
    });
    $(`#${elementid}`).select2({
        templateResult: function (item) {
            return item.text;
        },
        placeholder: "انتخاب",
        data: data,
        allowClear: true,
    });
}

$("#exportCSV")[0].onclick = null;
$("#exportCSV").click(function () {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;
    var validate = validationPrint();
    if (!validate)
        return;

    viewData_csv_url = `${viewData_baseUrl_MC}/${viewData_controllername}/repinsurersummarypreviewcsv`;
    let csvModel = parameter();
    csvModel.pageno = null;
    csvModel.pagerowscount = null;
    viewData_form_title = "گزارش خلاصه بیمه گر ";

    loadingAsync(true, "exportCSV", "fa fa-file-excel");

    $.ajax({
        url: viewData_csv_url,
        type: "get",
        datatype: "text",
        contentType: "text/csv",
        xhrFields: {
            responseType: 'blob'
        },
        data: { stringedModel: JSON.stringify(csvModel) },
        success: function (result) {
            if (result) {
                let element = document.createElement('a');
                element.setAttribute('href', window.URL.createObjectURL(result));
                element.setAttribute('download', `${viewData_form_title}.csv`);
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
                window.URL.revokeObjectURL(viewData_csv_url);

            }
            loadingAsync(false, "exportCSV", "fa fa-file-excel");
        },
        error: function (xhr) {
            error_handler(xhr)
            loadingAsync(false, "exportCSV", "fa fa-file-excel");
        }
    });
});

$("#fromInsurerReserveDate,#toInsurerReserveDate").on("input", function (e, callback) {

    if ($("#fromInsurerReserveDate").val() !== "" && $("#toInsurerReserveDate").val() !== "" && isValidShamsiDate($("#fromInsurerReserveDate").val()) && isValidShamsiDate($("#toInsurerReserveDate").val())) {

        setTimeout(function () {

            fillElmntInsurer(callback);

        }, 100);
    }
    else {
        $("#branchId").val("");
        $("#workflowId").val("");
        $("#stageId").val("");
        $("#actionId").val("");
        $("#basicInsurerId").val("");
        $("#compInsurerId").val("");
        $("#thirdPartyId").val("");
        $("#discountId").val("");
        $("#serviceTypeId").val("");
        $(`#workflowId,#stageId,#actionId,#basicInsurerId,#compInsurerId,#thirdPartyId,#discountId,#serviceTypeId`).prop("disabled", true);

    }

});

$("#basicInsurerId").on("change", async function () {

    var insurerIds = $("#basicInsurerId").val().toString();
    
    if (+$('#reportType').val() >= 5 || insurerIds == "") {
        $('#basicInsurerLineId').val("").trigger("change");
        $('#basicInsurerLineId').prop("disabled", true);
    }

    else {
        $('#basicInsurerLineId').prop("disabled", false).trigger("change");


        if (insurerIds != "") {
            let modelFill = {
                type: 2,
                basicInsurerIds: insurerIds,
                compInsurerIds: "",
                fromReserveDatePersian: $("#fromInsurerReserveDate").val(),
                toReserveDatePersian: $("#toInsurerReserveDate").val()
            }

            var data = getDataDropDown(modelFill);
            await fill_select2WithData(data.basicInsurerLineList, "basicInsurerLineId", false, true);
        }
    }
        
});

$("#compInsurerId").on("change", async function () {

    var insurerIds = $("#compInsurerId").val().toString();
 
    if (+$('#reportType').val() >= 5 || insurerIds == "") {
        $('#compInsurerLineId').val("").trigger("change");
        $('#compInsurerLineId').prop("disabled", true);
    }
    else {

        $('#compInsurerLineId').prop("disabled", false).trigger("change");
        if (insurerIds != "") {
            let modelFill = {
                type: 3,
                basicInsurerIds: "",
                compInsurerIds: insurerIds,
                fromReserveDatePersian: $("#fromInsurerReserveDate").val(),
                toReserveDatePersian: $("#toInsurerReserveDate").val()
            }

            data = getDataDropDown(modelFill);



            await fill_select2WithData(data.compInsurerLineList, "compInsurerLineId", false, true);
        }

    }
});

$("#workflowId").on("change", function () {

    let workflowId = $(this).val().toString() == "" ? null : $(this).val().join(","),
        workFlowCategoryId = "10,14";//workflowCategoryIds.medicalCare.id,
        stageClassId = "17,22,28",
        bySystem = 0,
        isActive = 2;

    $("#stageId").empty();

    fill_select2(`${viewData_baseUrl_WF}/StageApi/getstagedropdownbyworkflowid`, "stageId", true, `null/${workflowId}/${workFlowCategoryId}/${stageClassId}/${bySystem}/${isActive}`, false, 3, "",
        () => { $("#stageId").trigger("change") }, "", false, false, true);

});

$('#stageId').on('change', function () {

    let stageId = $("#stageId").val().toString() == "" ? null : $("#stageId").val().join(","),
        workflowId = $("#workflowId").val().toString() == "" ? null : $("#workflowId").val().join(","),
        workFlowCategoryId = "10,14";//workflowCategoryIds.medicalCare.id,
        stageClassId = "17,22,28";

    $("#actionId").empty();


    fill_select2(`${viewData_baseUrl_WF}/StageActionApi/getdropdownactionlistbystage`, "actionId", true, `${stageId}/${workflowId}/2/2/null/${workFlowCategoryId}/false/${stageClassId}`, false, 3, "", undefined, "", false, false, true);


});

async function resetFilterForms(todayDate) {

    if (todayDate != null) {
        $("#filterItemsContentBox ul > li > div:nth-child(2) ").css("color", "black")
        $(".card-body input.form-control.persian-date").val(todayDate);
    }


    $(".card-body select.form-control:not([multiple]),.card-body select.select2:not([multiple])").prop("selectedIndex", 0).trigger("change");
    $(".card-body select[multiple]").val("").trigger("change");

    $(".card-body input.form-control:not(.persian-date,[placeholder='__:__'])").val("");


    $(".card-body .funkyradio input:checkbox").prop("checked", false).trigger("change");


}

$('#reportType').on('change', function () {
    let reportType = +$(this).val();
    if (reportType >= 5) {
        $('#confirmedBasicSharePrice').val("-1").prop("disabled", true)
        $('#confirmedCompSharePrice').val("-1").prop("disabled", true)
        $('#isBasicSharePrice').val("-1").prop("disabled", true)
        $('#isCompSharePrice').val("-1").prop("disabled", true)

        $('#basicInsurerLineId').val("").trigger("change");
        $('#compInsurerLineId').val("").trigger("change");

        $('#basicInsurerLineId').prop("disabled", true)
        $('#compInsurerLineId').prop("disabled", true)
      


    }
    else {
        $('#confirmedBasicSharePrice').prop("disabled", false)
        $('#confirmedCompSharePrice').prop("disabled", false)
        $('#isBasicSharePrice').prop("disabled", false)
        $('#isCompSharePrice').prop("disabled", false)
        $('#basicInsurerLineId').prop("disabled", false)
        $('#compInsurerLineId').prop("disabled", false)
    }

    if ($("#fromInsurerReserveDate").val() !== "" && $("#toInsurerReserveDate").val() !== "" && isValidShamsiDate($("#fromInsurerReserveDate").val()) && isValidShamsiDate($("#toInsurerReserveDate").val())) {
        var check = controller_check_authorize(viewData_controllername, "VIW");
        if (!check)
            return;

    }


});

async function loadingAsync(loading, elementId, iconClass) {
    if (loading) {
        $(`#${elementId} i`).removeClass(iconClass);
        $(`#${elementId} i`).addClass(`fa fa-spinner fa-spin`);
        $(`#${elementId}`).prop("disabled", true)
    }
    else {
        $(`#${elementId} i`).removeClass("fa fa-spinner fa-spin");
        $(`#${elementId} i`).addClass(iconClass);
        $(`#${elementId}`).prop("disabled", false)
    }
}

$("#getReport").on("click", async function () {
    

    var check = controller_check_authorize(viewData_controllername, "VIW");
    if (!check)
        return;

    var validate = validationPrint();
    if (!validate)
        return;

    await getReport();

});

async function getReport() {
    
    if ($("#fromInsurerReserveDate").val() !== "" && $("#toInsurerReserveDate").val() !== "" && isValidShamsiDate($("#fromInsurerReserveDate").val()) && isValidShamsiDate($("#toInsurerReserveDate").val())) {
        var check = controller_check_authorize(viewData_controllername, "VIW");
        if (!check)
            return;

        await loadingAsync(true, "getReport", "fas fa-sticky-note");
        reportParameters = parameter();
        main_getReport();
    }
    
};

function parameter() {

    let parameters =
    {
        type: +$("#reportType").val() == 0 ? null : +$("#reportType").val(),
        fromReserveDatePersian: $("#fromInsurerReserveDate").val() == "" ? null : $("#fromInsurerReserveDate").val(),
        toReserveDatePersian: $("#toInsurerReserveDate").val() == "" ? null : $("#toInsurerReserveDate").val(),
        branchIds: $("#branchId").val() == "" ? null : $("#branchId").val().toString(),
        workflowIds: $("#workflowId").val() == "" ? null : $("#workflowId").val().toString(),
        stageIds: $("#stageId").val() == "" ? null : $("#stageId").val().toString(),
        actionIds: $("#actionId").val() == "" ? null : $("#actionId").val().toString(),
        basicInsurerIds: $("#basicInsurerId").val() == "" ? null : $("#basicInsurerId").val().toString(),
        basicInsurerLineIds: $("#basicInsurerLineId").val() == "" ? null : $("#basicInsurerLineId").val().toString(),
        compInsurerIds: $("#compInsurerId").val() == "" ? null : $("#compInsurerId").val().toString(),
        compInsurerLineIds: $("#compInsurerLineId").val() == "" ? null : $("#compInsurerLineId").val().toString(),
        thirdPartyInsurerIds: $("#thirdPartyId").val() == "" ? null : $("#thirdPartyId").val().toString(),
        discountInsurerIds: $("#discountId").val() == "" ? null : $("#discountId").val().toString(),
        serviceTypeIds: +$("#serviceTypeId").val() == 0 ? null : $("#serviceTypeId").val().toString(),
        confirmedBasicSharePrice: +$("#confirmedBasicSharePrice").val() == -1 ? null : +$("#confirmedBasicSharePrice").val(),
        confirmedCompSharePrice: +$("#confirmedCompSharePrice").val() == -1 ? null : +$("#confirmedCompSharePrice").val(),
        isBasicShareAmount: +$("#isBasicSharePrice").val() == -1 ? null : +$("#isBasicSharePrice").val(),
        isCompShareAmount: +$("#isCompSharePrice").val() == -1 ? null : +$("#isCompSharePrice").val(),
        isThirdPartyAmount: +$("#isThirdParty").val() == -1 ? null : +$("#isThirdParty").val(),
        isDiscountAmount: +$("#isDiscount").val() == -1 ? null : +$("#isDiscount").val(),
        pageNo: 0,
        pageRowsCount: +$(`#dropDownCountersName`).text()
    };
    return parameters;
}

$("#showReport").on("click", function () {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    var validate = validationPrint();
    if (!validate)
        return;


    reportUrl = `${stimulsBaseUrl.MC.Rep}AadmissionInsuranceCompulsoryContributionReportPreview.mrt`;

    var reportType = +$('#reportType').val();
    if (reportType === 1)
        reportTiltle = "گزارش خلاصه وضعیت مطالبات به تفکیک بیمه اجباری"
    else if (reportType === 2)
        reportTiltle = "گزارش سهم بیمه اجباری به تفکیک نوع خدمت"
    else if (reportType === 3)
        reportTiltle = "گزارش سهم بیمه تکمیلی"
    else if (reportType === 4)
        reportTiltle = "گزارش سهم بیمه تکمیلی به تفکیک نوع خدمت"
    else if (reportType === 5)
        reportTiltle = "گزارش سهم طرف قرارداد"
    else if (reportType === 6)
        reportTiltle = "گزارش  سهم طرف قرارداد به تفکیک نوع خدمت"
    else if (reportType === 7)
        reportTiltle = "گزارش سهم تخفیف"
    else if (reportType === 8)
        reportTiltle = "گزارش سهم تخفیف به تفکیک نوع خدمت"
    else if (reportType === 9)
        reportTiltle = "گزارش سهم مراجعه کننده"
    else if (reportType === 10)
        reportTiltle = "گزارش سهم مراجعه کننده به تفکیک نوع خدمت"

    let reportModel = createPrintModel();

    window.open(`${viewData_report_url}?strReportModel=${JSON.stringify(reportModel)}`, '_blank');

});

function validationPrint() {

    let validate = form.validate();
    validateSelect2(form);
    if (!validate) return false;

    if ($("#fromInsurerReserveDate").val() !== "" && $("#toInsurerReserveDate").val() !== "")
        if (!compareShamsiDate($("#fromInsurerReserveDate").val(), $("#toInsurerReserveDate").val())) {
            var msg = alertify.error("تاریخ شروع از تاریخ پایان بزرگتر است");
            msg.delay(alertify_delay);
            return false;
        }

    return true;
}

function createPrintModel() {

    let reportParameterStimul = [], reportModel = {};

    reportParameterStimul = createReportParameter()

    reportModel = { reportName: `${reportTiltle} `, reportUrl: reportUrl, parameters: reportParameterStimul, reportSetting: reportSettingModel };

    return reportModel;
}

function createReportParameter() {

    let repParameters = [
        { Item: "FromReserveDate", Value: $(`#fromInsurerReserveDate`).val() != "" ? convertToMiladiDate($(`#fromInsurerReserveDate`).val()) : "", SqlDbType: dbtype.Date, Size: 10 },
        { Item: "ToReserveDate", Value: $(`#toInsurerReserveDate`).val() != "" ? convertToMiladiDate($(`#toInsurerReserveDate`).val()) : "", SqlDbType: dbtype.Date, Size: 10 },
        { Item: "Type", Value: +$(`#reportType`).val() == 0 ? null : +$(`#reportType`).val(), SqlDbType: dbtype.Int },
        { Item: "branchIds", Value: $(`#branchId`).val().toString() == "" ? null : $(`#branchId`).val().toString(), SqlDbType: dbtype.VarChar, Size: 500 },
        { Item: "StageIds", Value: $(`#stageId`).val().toString() == "" ? null : $(`#stageId`).val().toString(), SqlDbType: dbtype.VarChar, Size: 500 },
        { Item: "WorkflowIds", Value: $(`#workflowId`).val().toString() == "" ? null : $(`#workflowId`).val().toString(), SqlDbType: dbtype.VarChar, Size: 500 },
        { Item: "ActionIds", Value: $(`#actionId`).val().toString() == "" ? null : $(`#actionId`).val().toString(), SqlDbType: dbtype.VarChar, Size: 500 },
        { Item: "BasicInsurerIds", Value: $(`#basicInsurerId`).val().toString() == "" ? null : $(`#basicInsurerId`).val().toString(), SqlDbType: dbtype.VarChar, Size: 1000 },
        { Item: "BasicInsurerLineIds", Value: $(`#basicInsurerLineId`).val().toString() == "" ? null : $(`#basicInsurerLineId`).val().toString(), SqlDbType: dbtype.VarChar, Size: 1000 },
        { Item: "CompInsurerIds", Value: $(`#compInsurerId`).val().toString() == "" ? null : $(`#compInsurerId`).val().toString(), SqlDbType: dbtype.VarChar, Size: 1000 },
        { Item: "CompInsurerLineIds", Value: $(`#compInsurerLineId`).val().toString() == "" ? null : $(`#compInsurerLineId`).val().toString(), SqlDbType: dbtype.VarChar, Size: 1000 },
        { Item: "ThirdPartyInsurerIds", Value: $(`#thirdPartyId`).val().toString() == "" ? null : $(`#thirdPartyId`).val().toString(), SqlDbType: dbtype.VarChar, Size: 1000 },
        { Item: "DiscountInsurerIds", Value: $(`#discountId`).val().toString() == "" ? null : $(`#discountId`).val().toString(), SqlDbType: dbtype.VarChar, Size: 1000 },
        { Item: "ServiceTypeIds", Value: $(`#serviceTypeId`).val().toString() == "" ? null : $(`#serviceTypeId`).val().toString(), SqlDbType: dbtype.NVarChar, Size: 500 },
        { Item: "ConfirmedBasicSharePrice", Value: +$(`#confirmedBasicSharePrice`).val() == -1 ? null : +$(`#confirmedBasicSharePrice`).val(), SqlDbType: dbtype.SmallInt, Size: 0 },
        { Item: "ConfirmedCompSharePrice", Value: +$(`#confirmedCompSharePrice`).val() == -1 ? null : +$(`#confirmedCompSharePrice`).val(), SqlDbType: dbtype.SmallInt, Size: 0 },
        { Item: "IsBasicShareAmount", Value: +$(`#isBasicSharePrice`).val() == -1 ? null : +$(`#isBasicSharePrice`).val(), SqlDbType: dbtype.Int, Size: 0 },
        { Item: "IsCompShareAmount", Value: +$(`#isCompSharePrice`).val() == -1 ? null : +$(`#isCompSharePrice`).val(), SqlDbType: dbtype.Int, Size: 0 },
        { Item: "BasicInsurer", Value: $(`#basicInsurerId`).val().toString() != "" && $(`#basicInsurerId`).val().length == 1 ? $("#basicInsurerId").select2('data')[0].text : 0, itemType: "Var" },
        { Item: "BasicInsurerBox", Value: $(`#basicInsurerLineId`).val().toString() != "" && $(`#basicInsurerLineId`).val().length == 1 ? $("#basicInsurerLineId").select2('data')[0].text : 0, itemType: "Var" },
        { Item: "CompInsurer", Value: $(`#compInsurerLineId`).val().toString() != "" && $(`#compInsurerLineId`).val().length == 1 ? $("#compInsurerLineId").select2('data')[0].text : 0, itemType: "Var" },
        { Item: "FromDatePersian", Value: $(`#fromInsurerReserveDate`).val() != "" ? $(`#fromInsurerReserveDate`).val() : "", itemType: "Var" },
        { Item: "ToDatePersian", Value: $(`#toInsurerReserveDate`).val() != "" ? $(`#toInsurerReserveDate`).val() : "", itemType: "Var" },
        { Item: "RoleId", Value: roleId, SqlDbType: dbtype.TinyInt, Size: 0 },
        { Item: "PageNo", Value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "PageRowsCount", Value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "ColumnType", Value: +$(`#reportType`).val(), itemType: "Var" },
    ];


    return repParameters;
}

window.Parsley._validatorRegistry.validators.comparedate = undefined
window.Parsley.addValidator('comparedate', {
    validateString: function (value, requirement) {
        var value2 = $(`#${requirement}`).val();

        if (value === "" || value2 === "")
            return true;

        var compareResult = compareShamsiDate(value, value2);
        return compareResult;
    },
    messages: {
        en: 'تاریخ شروع از تاریخ پایان بزرگتر است.',
    }

});

initRepAdmissionSummaryInsurerSearchReport();