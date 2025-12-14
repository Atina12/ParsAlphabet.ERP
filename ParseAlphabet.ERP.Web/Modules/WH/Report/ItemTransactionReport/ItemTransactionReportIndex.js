var viewData_controllername = "ItemTransactionReportApi",
    viewData_form_title = "گزارش جستجوی اسناد انبار",
    viewData_PreviewReport_GetReport = `${viewData_baseUrl_WH}/${viewData_controllername}/repitemtransactionpreview`,
    viewData_PreviewReport_GetHeader = `${viewData_baseUrl_WH}/${viewData_controllername}/repitemtransactioncolumns`,
    viewData_csv_url = `${viewData_baseUrl_WH}/${viewData_controllername}/repitemtransactioncsv`,
    form = $('#ItemTransactionSearch').parsley(),
    reportUrl = "";



function initItemTransactionReportIndex() {
    $(".select2").select2();

    $("#fromDocumentDatePersian").inputmask();
    $("#toDocumentDatePersian").inputmask();

    kamaDatepicker('fromDocumentDatePersian', { withTime: false, position: "bottom" });
    kamaDatepicker('toDocumentDatePersian', { withTime: false, position: "bottom" });

    fillDropDownItemTransactionReport()

    settingReportModule();

    getHeaderColumns();

    setTimeout(() => {
        $("#fiscalId").select2("focus")
    }, 1000)
};

function fillDropDownItemTransactionReport() {

    fill_select2(`${viewData_baseUrl_GN}/BranchApi/getdropdown`, "branchId", true, 0, false, 3, "", () => { $("#branchId").trigger("change") }, "", false, false, true);
    fill_select2(`${viewData_baseUrl_GN}/CurrencyApi/getdropdown`, "currencyId", true, 0, false, 3, "انتخاب", undefined, "", false, false, true);
    fill_select2(`${viewData_baseUrl_GN}/UserApi/getdropdown`, "createUserId", true, "2/false/false");
    fill_select2(`/api/WHApi/itemTypeSalesPrice_getDropDown`, "itemTypeId", true, 0, false, 3, "", () => { $("#itemTypeId").trigger("change") });
    fill_select2(`${viewData_baseUrl_GN}/FiscalYearApi/getdropdown`, "fiscalId", true);
}

function getZoneDropDown() {

    let itemtypeId = +$("#itemTypeId").val();
    let itemId = $("#itemId").val();
    let warehouseId = $("#warehouseId").val();

    if (warehouseId.length > 0 && itemId.length > 0 && itemtypeId > 0)
        fill_select2(`/api/WH/ZoneApi/getdropdownbyitem`, "zoneId", true, `${warehouseId.toString()}/${itemtypeId}/${itemId.toString()}`, false, 3, "",
            () => { $("#zoneId").trigger("change") }, "", false, false, true);
    else
        fill_select2(`${viewData_baseUrl_WH}/ZoneApi/getdropdown`, "zoneId", true, false, false, 3, "", () => { $("#zoneId").trigger("change") }, "", false, false, true);

}

function getBinDropDown(zoneId) {

    let itemtypeId = +$("#itemTypeId").val();
    let itemId = $("#itemId").val();
    let warehouseId = $("#warehouseId").val();

    if (warehouseId.length > 0 && itemId.length > 0 && zoneId.length > 0 && itemtypeId > 0)
        fill_select2(`/api/WH/WBinApi/getdropdownbyitem`, "binId", true, `${warehouseId.toString()}/${itemtypeId}/${itemId.toString()}/${zoneId.toString()}`, false, 3, "انتخاب", undefined, "", false, false, true);
    else
        fill_select2(`${viewData_baseUrl_WH}/WBinApi/getdropdown`, "binId", true, false, false, 3, "انتخاب", undefined, "", false, false, true);

}

function getCategoryIdByitemId(itemTypeId, itemId) {

    let url = `${viewData_baseUrl_WH}/ItemApi/getItemCategoryId`, id = 0;


    if (itemId.length > 0)
        id = getCategoryIdByitemIdAjax(url, itemId.toString(), itemTypeId);

}

function getCategoryIdByitemIdAjax(url, id, itemTypeId) {

    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(id),
        success: function (result) {

            $("#categoryId").empty()
            if (result.id > 0 || result) {
                let categoryId = (result > 0) ? result : result.id;
                fill_select2(`${viewData_baseUrl_WH}/ItemCategoryApi/getdropdownbytype/${itemTypeId}`, "categoryId", true, false, false, 3, "انتخاب", undefined, "", false, false, true);
                $("#categoryId").val(categoryId).trigger("change.select2");
            }


        },
        error: function (xhr) {
            error_handler(xhr, url);
            return null;
        }
    });
}

function getItemAttributeAndUnitWhitCategoryId(id, itemTypeId) {

    $('#atrributeId').empty();
    $('#unitId').empty();
    let itemId = id;
    if (id > 0) {
        $.ajax({
            url: `api/WH/ItemApi/getinfo/${id}`,
            type: "get",
            contentType: "application/json",
            async: false,
            success: function (result) {

                if (result && itemId.length > 0) {
                    $('#categoryId').val(result.categoryIdName).trigger("change");

                    if (+itemTypeId == 1) {

                        fill_select2(`${viewData_baseUrl_WH}/ItemAttributeApi/attributeitem_getdropdown`, "atrributeId", true, result.categoryId, false, 3, "انتخاب", undefined, "", false, false, true);

                        fill_select2(`${viewData_baseUrl_WH}/ItemUnitApi/unititem_getdropdown`, "unitId", true, `${result.unitId}/${itemId.toString()}`, false, 3, "انتخاب", undefined, "", false, false, true);

                        //$("#subUnitId").val(result.unitId).trigger("change");
                    }
                }
            }
        });
    }
}

function documentDateValid(callBack = undefined) {
    let url = `${viewData_baseUrl_GN}/FiscalYearApi/getdaterange`;
    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(+$("#fiscalId").val()),
        success: function (result) {
            var fiscalStartDate = +result.startDatePersian.replace(/\//g, "");
            var fiscalEndDate = +result.endDatePersian.replace(/\//g, "");
            var fromDate = +$("#fromDocumentDatePersian").val().replace(/\//g, "");
            var toDate = +$("#toDocumentDatePersian").val().replace(/\//g, "");
            if ((fromDate <= fiscalEndDate && fromDate >= fiscalStartDate) && (toDate <= fiscalEndDate && toDate >= fiscalStartDate))
                result = true;
            else
                result = false;
            if (typeof callBack == "function")
                callBack(result);
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return "";
        }
    });
}

async function getReport() {

    reportParameters = parameter();
    initialPageing();
    getReportAsync(reportParameters, () => {
        $(`#dataRowsReport tr:eq(0)`).addClass("highlight").focus();
        createPageFooterInfo(1, +reportParameters.pageRowsCount, 1);
        checkSumDynamic(reportParameters);
    });
};

function parameter() {

    var arrAttribute = [];

    if ($(`#atrributeId`).val() !== "") {
        var attrbute = $(`#atrributeId`).val();
        attrbute.forEach(function (x, i) {
            arrAttribute.push({ AttributeIds: x });
        });
    }

    let parameters = {
        fromDocumentDatePersian: $("#fromDocumentDatePersian").val() == "" ? null : $("#fromDocumentDatePersian").val(),
        toDocumentDatePersian: $("#toDocumentDatePersian").val() == "" ? null : $("#toDocumentDatePersian").val(),
        branchId: $("#branchId").val() == "" ? null : $("#branchId").val().toString(),
        warehouseId: $(`#warehouseId`).val().toString() == "" ? null : $(`#warehouseId`).val().toString(),
        zoneId: $(`#zoneId`).val().toString() == "" ? null : $(`#zoneId`).val().toString(),
        binId: $(`#binId`).val().toString() == "" ? null : $(`#binId`).val().toString(),
        itemCategoryId: $(`#categoryId`).val().toString() == "" ? null : $(`#categoryId`).val().toString(),
        workflowId: $(`#workflowId`).val().toString() == "" ? null : $(`#workflowId`).val().toString(),
        stageId: $(`#stageId`).val().toString() == "" ? null : $(`#stageId`).val().toString(),
        actionId: $("#actionId").val() == "" ? null : $("#actionId").val().toString(),
        itemTypeId: +$("#itemTypeId").val() == 0 ? null : +$("#itemTypeId").val(),
        itemIds: $(`#itemId`).val().toString() == "" ? null : $(`#itemId`).val().toString(),
        attributeIdList: arrAttribute.length != 0 ? arrAttribute : null,
        unitIds: $(`#unitId`).val().toString() == "" ? null : $(`#unitId`).val().toString(),
        headerCreateUserId: +$(`#createUserId`).val() == 0 ? null : $(`#createUserId`).val(),
        pageRowsCount: +$(`#dropDownCountersName`).text(),
        pageNo: 0
    };

    return parameters;
}

function export_ItemTransactionSearch_csv() {
    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    let csvModel = parameter();
    csvModel.pageno = null;
    csvModel.pagerowscount = null;
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
        },
        error: function (xhr) {
            error_handler(xhr)
        }
    });

}

function customeresetFilterForms() {
    $("#fromDocumentDatePersian").val(moment().format("jYYYY/01/01"));
    $("#toDocumentDatePersian").val(moment().format("jYYYY/jMM/jDD"));
}

$("#resetFilters").click(function () {
    $("#fiscalId").val("0").trigger("change");
    $("#branchId").val("0").trigger("change");
    $("#workflowId").val("0").trigger("change");
    $("#stageId").val("0").trigger("change");
    $("#actionId").val("0").trigger("change");
    $("#createUserId").val("0").trigger("change");
    $("#itemTypeId").val("0").trigger("change");
    $("#categoryId").val("0").trigger("change");
    $("#itemId").val("0").trigger("change");
    $("#atrributeId").val("0").trigger("change");
    $("#unitId").val("0").trigger("change");
    $("#warehouseId").val("0").trigger("change");
    $("#zoneId").val("0").trigger("change");
    $("#binId").val("0").trigger("change");
    $("#fromDocumentDatePersian").val(moment().format("jYYYY/jMM/jDD"));
    $("#toDocumentDatePersian").val(moment().format("jYYYY/jMM/jDD"));
})

$("#getReport").on("click", async function () {

    var check = controller_check_authorize(viewData_controllername, "VIW");
    if (!check)
        return;


    var validate = form.validate();
    validateSelect2(form);
    if (!validate) return;

    if (+$("#fiscalId").val() != 0) {
        documentDateValid(function (res) {

            if (res) {
                loadingAsync(true, "getReport", "fas fa-sticky-note");
                getReport();
            }
            else {
                var msg = alertify.error('تاریخ سند در بازه معتبر نمیباشد');
                msg.delay(alertify_delay);
                return;
            }
        });
    }
    else {
        await loadingAsync(true, "getReport", "fas fa-sticky-note");
        await getReport();
    }
});

$("#fiscalId").change(function () {
    if (+$(this).val() != 0) {
        let url = `${viewData_baseUrl_GN}/FiscalYearApi/getdaterange`;
        $.ajax({
            url: url,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(+$("#fiscalId").val()),
            success: function (result) {

                var fiscalStartDate = result.startDatePersian;
                var fiscalEndDate = result.endDatePersian
                $("#fromDocumentDatePersian").val(fiscalStartDate);
                $("#toDocumentDatePersian").val(fiscalEndDate);
            },
            error: function (xhr) {
                error_handler(xhr, url);
                return "";
            }
        });
    }
    else {
        $("#fromDocumentDatePersian").val(moment().format("jYYYY/01/01"));
        $("#toDocumentDatePersian").val(moment().format("jYYYY/jMM/jDD"));
    }
})

$("#branchId").change(function () {

    var branchId = $(this).val() == "" ? null : $(this).val().join(","),
        stageclassIds = "1,3,4,8",
        workFlowCategoryId = workflowCategoryIds.warehouse.id;

    $("#warehouseId").empty();
    $("#workflowId").empty();

    fill_select2("/api/WF/WorkflowApi/getdropdown", "workflowId", true, `${branchId}/${workFlowCategoryId}/${stageclassIds}`, false, 3, "", () => { $("#workflowId").trigger("change") }, "", false, false, true);
    fill_select2(`${viewData_baseUrl_WH}/WarehouseApi/getDropDownByUserId`, "warehouseId", true, branchId, false, 3, "", () => { $("#warehouseId").trigger("change") }, "", false, false, true);

   

});

$("#workflowId").change(function () {

    let workflowId = $(this).val() == "" ? null : $(this).val().join(","),
        branchId = $("#branchId").val() == "" ? null : $("#branchId").val().join(","),
        workFlowCategoryId = workflowCategoryIds.warehouse.id,
        stageclassIds = "1,3,4,8,11,14,15,16",
        bySystem = 0,
        isActive = 2;

    $("#stageId").empty();

    fill_select2(`${viewData_baseUrl_WF}/StageApi/getstagedropdownbyworkflowid`, "stageId", true, `${branchId}/${workflowId}/${workFlowCategoryId}/${stageclassIds}/${bySystem}/${isActive}`, false, 3, "", () => { $("#stageId").trigger("change") }, "", false, false, true);

});

$("#stageId").change(function () {
    
    let stageId = $("#stageId").val() == "" ? null : $("#stageId").val().join(","),
        workflowId = $("#workflowId").val() == "" ? null : $("#workflowId").val().join(","),
        workFlowCategoryId = workflowCategoryIds.warehouse.id,
        branchId = $("#branchId").val() == "" ? null : $("#branchId").val().join(","),
        stageclassIds = "1,3,4,8,11,14,15,16";

    $("#actionId").empty();

    fill_select2(`${viewData_baseUrl_WF}/StageActionApi/getdropdownactionlistbystage`, "actionId", true, `${stageId}/${workflowId}/2/2/${branchId}/${workFlowCategoryId}/false/${stageclassIds}`, false, 3, "", () => { $("#actionId").trigger("change") }, "", false, false, true);


});

$("#warehouseId").change(function () {
    let warehouseId = $("#warehouseId").val();
    $("#zoneId").empty();
    $("#binId").empty();
    if (warehouseId.length > 0)
        fill_select2(`/api/WH/ZoneApi/getdropdownbywarehouse`, "zoneId", true, `${warehouseId.toString()}`, false, 3, "", () => { $("#zoneId").trigger("change") }, "", false, false, true);
    else
        fill_select2(`${viewData_baseUrl_WH}/ZoneApi/getdropdown`, "zoneId", true, false, false, 3, "", () => { $("#zoneId").trigger("change") }, "", false, false, true);


});

$("#itemTypeId").change(function () {

    let itemTypeId = +$(this).val();

    $("#itemId").empty();
    $("#categoryId").empty();

    if (itemTypeId !== 0) {

        fill_select2(`${viewData_baseUrl_WH}/ItemApi/getdropdownwithitemtypeid`, "itemId", true, `${itemTypeId}`, false, 3, "انتخاب", () => { $("#itemId").trigger("change") }, "", false, false, true);

        //عدم نمایش انبار ، بخش ، پالت  برای خدمات و هزینه حمل و اشتراک
        if (itemTypeId == 2 || itemTypeId == 3 || itemTypeId == 5) {
            $("#warehouseId").prop("disabled", true);
            $("#zoneId").prop("disabled", true);
            $("#binId").prop("disabled", true);
        }
        else {
            $("#warehouseId").prop("disabled", false);
            $("#zoneId").prop("disabled", false);
            $("#binId").prop("disabled", false);
        }
    }
    else
        fill_select2(`${viewData_baseUrl_WH}/ItemApi/getdropdown`, "itemId", true, 0, false, 3, "انتخاب", () => { $("#itemId").trigger("change") }, "", false, false, true);


});

$("#itemId").change(function () {

    $("#zoneId").empty();
    $("#binId").empty();
    $("#atrributeId").empty();
    $("#unitId").empty();

    let itemId = $(this).val();
    let itemTypeId = +$("#itemTypeId").val();

    if (itemId.length > 0) {
        getZoneDropDown();
        getCategoryIdByitemId(itemTypeId, itemId.toString());
        getItemAttributeAndUnitWhitCategoryId(itemId.toString(), itemTypeId);
    }
    else {
        fill_select2(`${viewData_baseUrl_WH}/ZoneApi/getdropdown`, "zoneId", true, false, false, 3, "انتخاب", () => { $("#zoneId").trigger("change") }, "", false, false, true);
        fill_select2(`${viewData_baseUrl_WH}/ItemAttributeApi/attributeitem_getdropdown`, "atrributeId", true, null, false, 3, "انتخاب", undefined, "", false, false, true);
        fill_select2(`${viewData_baseUrl_WH}/ItemUnitApi/unititem_getdropdown/null/0`, "unitId", true, false, false, 3, "انتخاب", undefined, "", false, false, true);

        $("#categoryId").empty();
        fill_select2(`${viewData_baseUrl_WH}/ItemCategoryApi/getdropdownbytype/${itemTypeId}`, "categoryId", true, false, false, 3, "انتخاب", undefined, "", false, false, true);
    }

});

$("#zoneId").change(function () {

    let zoneId = $(this).val();
    let warehouseId = $("#warehouseId").val();
    $("#binId").empty();
    if (warehouseId.length > 0) {
        if (zoneId.length > 0)
            fill_select2(`/api/WH/WBinApi/getdropdownbywarehouse`, "binId", true, `${warehouseId.toString()}/${zoneId.toString()}`, false, 3, "", undefined, "", false, false, true);
        else
            fill_select2(`/api/WH/WBinApi/getdropdownbywarehouse`, "binId", true, `${warehouseId.toString()}/null`, false, 3, "", undefined, "", false, false, true);
    }
    else
        fill_select2(`${viewData_baseUrl_WH}/WBinApi/getdropdown`, "binId", true, false, false, 3, "", undefined, "", false, false, true);


});

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

window.Parsley._validatorRegistry.validators.compareshamsidateyear = undefined
window.Parsley.addValidator('compareshamsidateyear', {
    validateString: function (value, requirement) {
        var value2 = $(`#${requirement}`).val();
        if (value !== "" && value2 !== "" && requirement !== "") {
            return compareShamsiDateYear(value, value2);
        }
        else
            return true;
    },
    messages: {
        en: 'تاریخ شروع و پایان باید در یک سال باشند.',
    }
});

initItemTransactionReportIndex()