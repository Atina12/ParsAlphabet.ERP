
var viewData_form_title = "سفارش فروش",
    viewData_controllername = "SaleOrderApi",
    viewData_getpagetable_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getpage`,
    viewData_deleterecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/delete`,
    viewData_insrecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/insert`,
    viewData_updrecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/update`,
    viewData_getrecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getrecordbyid`,
    viewData_filter_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getfilteritems`,
    viewData_personOrderStageStep_url = `/api/WF/StageActionApi/getaction`,
    viewData_print_file_url = `${stimulsBaseUrl.SM.Prn}SaleOrder.mrt`,
    viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 },
    viewData_print_tableName = "",
    viewData_csv_url = `${viewData_baseUrl_SM}/${viewData_controllername}/csv`,
    isLoadEdit = false,
    isExistStageStep = false,
    idForStepAction = "";

var isDisablenoSeriesId = {
    flg: true,
    edit: false
};

function initForm() {
    $("#stimul_preview")[0].onclick = null;

    $("#orderDatePersian").inputmask();
    kamaDatepicker('orderDatePersian', { withTime: false, position: "bottom" });
    $("#orderDatePersian").val(moment().format('jYYYY/jMM/jDD'))

    $('#userType').bootstrapToggle();
    $(".button-items").prepend($(".toggle"));
    pagetable_formkeyvalue = ["myadm", 0];

    get_NewPageTableV1();

    $("#note").suggestBox({
        api: `${viewData_baseUrl_SM}/SaleDescriptionApi/search`,
        paramterName: "name",
        form_KeyValue: [+$("#stageId").val()],
        callBackSearche: callBackSearche,
        suggestFilter: {
            items: [],
            filter: ""
        }
    });

    $("#stageId").html("<option value='0'>انتخاب کنید...</option>");
    fill_select2(`${viewData_baseUrl_WF}/StageApi/getdropdown`, "stageId", true, '3/1/2/1');

    fill_select2("/api/GN/BranchApi/getactivedropdown", "branchId", true);
    $("#accountDetailId").select2();
    $("#noSeriesId").select2();
}

function callBackSearche() {
    return +$("#stageId").val() > 0
}

function export_csv(elemId = undefined) {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    if ($("#userType").prop("checked"))
        pagetable_formkeyvalue = ["myadm", 0];
    else
        pagetable_formkeyvalue = ["alladm", 0];


    $(`#${elemId == undefined || elemId == null ? "exportCSV" : elemId}`).prop("disabled", true);

    setTimeout(function () {
        let index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id);

        if (csvModel == null) {
            csvModel = {
                Filters: arrSearchFilter[index].filters,
                Form_KeyValue: pagetable_formkeyvalue
            }
        }

        $.ajax({
            url: viewData_csv_url,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(csvModel),
            cache: false,
            success: function (result) {
                generateCsv(result);

                $(`#${elemId == undefined || elemId == null ? "exportCSV" : elemId}`).prop("disabled", false);
            },
            error: function (xhr) {
                error_handler(xhr, viewData_csv_url);
                $(`#${elemId == undefined || elemId == null ? "exportCSV" : elemId}`).prop("disabled", false);
            }
        });
    }, 500);
}

function run_button_editSalesOrders(salesOrderId, rowNo, elem) {

    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;
    var isDataEntry = $(`#row${rowNo}`).data("isdataentry");

    if (isDataEntry == false) {
        alertify.error('برگه جاری امکان ویرایش ندارد').delay(alertify_delay);
        return;
    }


    var modal_name = null

    $("#rowKeyId").removeClass("d-none");
    if (modal_name == null)
        modal_name = modal_default_name;

    $(".modal").find("#modal_title").text("ویرایش " + viewData_form_title);

    $("#modal_keyid_value").text(salesOrderId);
    $("#modal_keyid_caption").text("شناسه : ");

    $(`#${modal_name} div [hidden-on-edit=true]`).each(function () {
        var elm = $(this);
        elm.addClass("displaynone");
        elm.find("input,select,img").each(function () {
            var subelm = $(this);
            subelm.attr("data-parsley-excluded", "true");
        })
    });
    $(`#${modal_name} div [hidden-on-add=true]`).each(function () {
        var elm = $(this);
        elm.removeClass("displaynone");
        elm.find("input,select,img").each(function () {
            var subelm = $(this);
            subelm.attr("data-parsley-excluded", "false");
        })
    });

    $.ajax({
        url: viewData_getrecord_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(salesOrderId),
        async: false,
        cache: false,
        success: function (response) {
            modal_open_state = 'Edit';
            modal_clear_items(modal_name);
            result = response.data
            if (checkResponse(result)) {
                modal_show();
                fillEditSalesOrder(result);
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getrecord_url)
        }
    });
}

function fillEditSalesOrder(saleOrder) {
    
    $("#noSeriesId").empty();
    $("#accountDetailId").empty();
    $("#noSeriesId").prop("disabled", true);
    $("#accountDetailId").prop("disabled", true);

    if (saleOrder.inOut === 2) {
        $("#returnReason").addClass("displaynone");

        $("#returnReasonId").val("").prop('required', false).removeAttr('data-parsley-selectvalzero');
    }

    else if (saleOrder.inOut === 1) {
        fill_select2("/api/SM/ReturnReasonApi/getdropdown", "returnReasonId", true);
        $("#returnReason").removeClass("displaynone");
        $("#returnReasonId").prop('required', true).attr('data-parsley-selectvalzero', "")
    }

    fill_select2(`/api/GN/NoSeriesLineApi/noserieslistnextstage`, "noSeriesId", true, `${+saleOrder.stageId}/${+saleOrder.branchId}`);

    getModuleListByNoSeriesIdUrl(+saleOrder.noSeriesId, "accountDetailId");
    $("#orderDatePersian").val(saleOrder.orderDatePersian);
    $("#actionId").val(saleOrder.actionId);
    $("#branchId").val(saleOrder.branchId).trigger("change.select2");
    $("#stageId").val(saleOrder.stageId).trigger("change.select2");
    $("#inOut").val(saleOrder.inOutName);

    if (saleOrder.treasurySubjectId > 0) {

        $("#treasurySubjectId").prop("disabled", false);
        $("#treasurySubjectId").prop("required", true);
        $("#treasurySubjectId").prop("data-parsley-selectvalzero", true);
        $("#treasurySubjectId").prop("data-parsley-checkglsglrequied", true);

        fill_select2(`${viewData_baseUrl_FM}/TreasurySubjectApi/gettreasurysubjectbystageid`, "treasurySubjectId", true, `${saleOrder.stageId}/3/1`);
        $("#treasurySubjectId").val(saleOrder.treasurySubjectId).trigger("change.select2");

    }
    else {
        $("#treasurySubjectId").empty();
        $("#treasurySubjectId").prop("disabled", true);
        $("#treasurySubjectId").prop("required", false);
        $("#treasurySubjectId").prop("data-parsley-selectvalzero", false);
        $("#treasurySubjectId").prop("data-parsley-checkglsglrequied", false);
    }



    if (saleOrder.noSeriesId > 0) {
        var noSeriesOption = new Option(`${saleOrder.noSeriesId} - ${saleOrder.noSeriesName}`, saleOrder.noSeriesId, true, true);

        $("#noSeriesId").prop("disabled", true);
        $("#noSeriesId").append(noSeriesOption)
        $("#noSeriesId").val(saleOrder.noSeriesId).trigger('change.select2');

        var accountDetailOption = new Option(`${saleOrder.accountDetailId} - ${saleOrder.accountDetailName}`, saleOrder.accountDetailId, true, true);
        $("#accountDetailId").prop("disabled", true);
        $("#accountDetailId").append(accountDetailOption)
        $("#accountDetailId").val(saleOrder.accountDetailId).trigger('change.select2');
    }
    else {
        $("#noSeriesId").empty();
        $("#noSeriesId").prop("disabled", true);
        $("#noSeriesId").prop("required", false);
        $("#noSeriesId").prop("data-parsley-selectvalzero", false);
        $("#noSeriesId").prop("data-parsley-checkglsglrequied", false);

        $("#accountDetailId").empty();
        $("#accountDetailId").prop("disabled", true);
        $("#accountDetailId").prop("required", false);
        $("#accountDetailId").prop("data-parsley-selectvalzero", false);
        $("#accountDetailId").prop("data-parsley-checkglsglrequied", false);
    }



    $("#returnReasonId").val(saleOrder.returnReasonId).trigger("change.select2");
    $("#note").val(saleOrder.note);

    fillStagePreviousInfo(saleOrder.stageId, saleOrder.actionId);
    //IsShownoSeries(saleOrder.id);
}

async function IsShownoSeries(saleOrderId) {

    await $.ajax({
        url: `api/SM/SaleOrderLineApi/getSaleOrderLineQuantity/${saleOrderId}`,
        type: "get",
        contentType: "application/json",
        success: function (result) {

            isDisablenoSeriesId = {
                flg: result,
                edit: true
            };
            if (isDisablenoSeriesId.flg) {
                $("#noSeriesId").prop('disabled', true)
                $("#accountDetailId").prop('disabled', true)
            }
            else {
                $("#noSeriesId").prop("disabled", false)
                $("#accountDetailId").prop("disabled", false)
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getrecord_url)
            return null;
        }
    });


}

function getdataByStageId(stageId) {
    let model = {};
    if (!isLoadEdit) {
        model = {
            stageId: stageId,
            priority: 1
        };
    }
    else {
        model = {
            stageId: stageId,
            actionId: statusId
        };
    }

    clearform();
    getStageStep(model).then((response) => {

        if (checkResponse(response)) {
            isExistStageStep = true;
            //let result = response.logicModel;

            currentIsTreasurySubject = response.isTreasurySubject;
            currentPriority = response.priority;

            fillStagePreviousInfo(stageId, response.actionId);

            $("#stageId").prop("data-parsley-checkglsglrequied", false);

            if (response.isTreasurySubject) {
                $("#treasurySubjectId").empty();
                $("#treasurySubjectId").prop("disabled", false);
                $("#treasurySubjectId").prop("required", true);
                $("#treasurySubjectId").prop("data-parsley-selectvalzero", true);
                $("#treasurySubjectId").prop("data-parsley-checkglsglrequied", true);

                fill_select2(`${viewData_baseUrl_FM}/TreasurySubjectApi/gettreasurysubjectbystageid`, "treasurySubjectId", true, `${stageId}/3/1`, false, 0, 'انتخاب موضوع', undefined, "", true);
            }

            fill_select2(`/api/GN/NoSeriesLineApi/noserieslistnextstage`, "noSeriesId", true, `${stageId}/${+$("#branchId").val()}`);
            $("#noSeriesId").prop("disabled", false).prop("required", true);
        }
        else
            isExistStageStep = false;
    });
}

function fillStagePreviousInfo(stageId, actionId) {
    $(".currentStage").text($("#stageId").select2('data').length > 0 ? $("#stageId").select2('data')[0].text : "")

    $("#stagePreviousList").html("");
    $("#stageFundTypeList").html("");

    getStageFundPreviousList(stageId, actionId);

}

function getStageFundPreviousList(stageId, actionId) {
    var url = `${viewData_baseUrl_WF}/StageFundItemTypeApi/getPreviousStageFundItemTypeListByStageId/${stageId}/${actionId}`;

    $.ajax({
        url: url,
        type: "get",
        dataType: "json",
        contentType: "application/json",
        success: function (result) {
            filStageFundTypePrevious(result);
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });
}

function filStageFundTypePrevious(res) {
    if (res.length > 0) {
        var previous = res.filter(x => x.selectType == 1);
        var fundtype = res.filter(x => x.selectType == 2);

        fillStagePrevious(previous);
        fillFundTypeList(fundtype);
    }
}

function fillFundTypeList(data) {
    var output = ``;
    len = data.length;
    for (var i = 0; i < len; i++) {
        var fundtype = data[i];
        output += `<tr>
                       <td>${fundtype.id}</td>
                       <td>${fundtype.name}</td>
                  </tr>`
    }

    $("#stageFundTypeList").html(output);

}

function fillStagePrevious(data) {
    var output = ``;
    len = data.length;
    for (var i = 0; i < len; i++) {
        var prev = data[i];
        output += `<tr>
                       <td>${prev.id}</td>
                       <td>${prev.name}</td>
                  </tr>`
    }

    $("#stagePreviousList").html(output);

}

function modal_save(modal_name = null, enter_toline = false) {
    save(modal_name, enter_toline);
}

function save(modal_name = null, enter_toline = false) {

    if (modal_name == null)
        modal_name = modal_default_name;

    var form = $(`#${modal_name} div.modal-body`).parsley();
    var validate = form.validate();
    validateSelect2(form);

    if (!validate)
        return;

    var newModel = {
        id: +$("#modal_keyid_value").text(),
        branchId: +$("#branchId").val(),
        stageId: +$("#stageId").val(),
        orderDatePersian: $("#orderDatePersian").val(),
        note: $("#note").val(),
        actionId: +$("#actionId").val(),
        returnReasonId: +$("#returnReasonId").val(),
        accountDetailId: +$("#accountDetailId").val(),
        noSeriesId: +$("#noSeriesId").val(),
        inOut: $('#inOut').data("value"),
        treasurySubjectId: +$("#treasurySubjectId").val()
    }
    if (!isExistStageStep) {// StageActionبررسی وجود 
        alertify.warning('گام تعریف نشده است!').delay(alertify_delay);
        return;
    }
    if (modal_open_state == "Add") {
        recordInsertUpdate(viewData_insrecord_url, newModel, modal_name, msg_row_created, function (result) {
            if (result.successfull) {
                if (result.id > 0) {
                    modal_close();
                    $(".modal-backdrop.fade.show").remove();

                    if (enter_toline)
                        navigation_item_click(`/SM/SaleOrderLine/${result.id}/1`);
                    else
                        get_NewPageTableV1();
                }
                else
                    alertify.error('عملیات ثبت با خطا مواجه شد.').delay(alertify_delay);
            }
            else {
                if (result.validationErrors.length > 0) {
                    generateErrorValidation(result.validationErrors);
                    return;
                }
                else {
                    alertify.error(result.statusMessage).delay(alertify_delay);

                }
            }
        });
    }

    else if (modal_open_state == "Edit") {
        recordInsertUpdate(viewData_updrecord_url, newModel, modal_name, msg_row_edited, function (result) {
            if (result.successfull) {
                if (result.id > 0) {

                    modal_close();
                    $(".modal-backdrop.fade.show").remove();

                    if (enter_toline)
                        navigation_item_click(`/SM/SaleOrderLine/${result.id}/1`);
                    else
                        get_NewPageTableV1();
                }
                else
                    alertify.error('عملیات ویرایش با خطا مواجه شد.').delay(alertify_delay);
            }
            else {
                if (result.validationErrors.length > 0) {
                    generateErrorValidation(result.validationErrors);
                    return;
                }
                else {
                    alertify.error(result.statusMessage).delay(alertify_delay);
                }
            }
        });
    }
}

function run_button_OrderDetailSimple(lineId, rowNo, elm, ev) {


    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    ev.stopPropagation();
    navigation_item_click(`/SM/SaleOrderLine/${lineId}/1`, "ثبت سفارش (ریالی)");
}

function run_button_OrderDetailAdvance(lineId, rowNo, elm, ev) {

    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    ev.stopPropagation();
    navigation_item_click(`/SM/SaleOrderLine/${lineId}/0`, "ثبت سفارش (ارزی)");
}

function run_button_displaySimple(id, rowNo, elm) {

    var check = controller_check_authorize(viewData_controllername, "VIW");
    if (!check)
        return;

    var stageId = +$(elm).parents("tr").first().data("stageid");
    navigateToModalSaleOrder(`/SM/SaleOrderLine/display/${id}/1/${stageId}`);
}

function run_button_displayAdvance(id, rowNo, elm) {

    var check = controller_check_authorize(viewData_controllername, "VIW");
    if (!check)
        return;

    var stageId = +$(elm).parents("tr").first().data("stageid");
    navigateToModalSaleOrder(`/SM/SaleOrderLine/display/${id}/0/${stageId}`);
}

function run_button_printFromPlateHeaderLine(id) {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    var p_id = "id";
    var p_value = id;
    var p_type = 8;
    var p_size = 0;

    var reportParameters = [
        { Item: `${p_id}`, Value: p_value, SqlDbType: p_type, Size: p_size },
        { Item: "StageName", Value: "سفارش فروش", itemType: "Var" },
    ]

    stimul_reportHeaderLine(reportParameters);
}

function stimul_reportHeaderLine(reportParameters) {
    var print_file_url = `${stimulsBaseUrl.SM.Prn}SaleOrderOfficial.mrt`;
    var reportModel = {
        reportUrl: print_file_url,
        parameters: reportParameters,
        reportSetting: reportSettingModel,
        reportName: viewData_form_title,
    }

    window.open(`${viewData_report_url}?strReportModel=${JSON.stringify(reportModel)}`, '_blank');
}

function navigateToModalSaleOrder(href) {

    initialPage();
    $("#contentdisplaySalesOrderLine #content-page").addClass("displaynone");
    $("#contentdisplaySalesOrderLine #loader").removeClass("displaynone");

    $.ajax({
        url: href,
        type: "get",
        datatype: "html",
        contentType: "application/html; charset=utf-8",
        async: false,
        cache: false,
        dataType: "html",
        success: function (result) {
            
            $(`#contentdisplaySalesOrderLine`).html(result);
        },
        error: function (xhr) {
            error_handler(xhr, href);
        }
    });
    $("#contentdisplaySalesOrderLine #loader,#contentdisplaySalesOrderLine #formHeaderLine #header-div .button-items").addClass("displaynone");
    $("#contentdisplaySalesOrderLine #content-page").fadeIn().removeClass("displaynone").css("margin", 0);
    $("#contentdisplaySalesOrderLine #form,#contentdisplaySalesOrderLine .content").css("margin", 0);
    $("#contentdisplaySalesOrderLine .itemLink").css("pointer-events", " none");
}

function run_button_showStepLogsSaleOrder(id, rowno) {

    idForStepAction = id
    activePageTableId = "pagetable"
    selectedRowId = `row${rowno}`;
    currentStageId = +$(`#${activePageTableId} tbody tr#${selectedRowId}`).data("stageid");
    $(`#actionSaleOrder`).empty();
    fill_dropdown(`${viewData_baseUrl_WF}/StageActionApi/getdropdownactionlistbystage`, "id", "name", "actionSaleOrder", true, `${currentStageId}/1`);
    var currentActionId = +$(`#${activePageTableId} tbody tr#${selectedRowId}`).data("actionid");
    $(`#actionSaleOrder`).val(currentActionId).trigger("change");
    stepLogSaleOrder(id);
    currentdentityId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("actionid");
    modal_show("stepLogModalSaleOrder");
}

function clearform() {
    $("#noSeriesId").empty();
    $("#accountDetailId").empty();
    $("#stagePreviousList").empty();
    $("#stageFundTypeList").empty();
    $("#treasurySubjectId").prop("required", false);
    $("#treasurySubjectId").prop("data-parsley-selectvalzero", false);
    $("#treasurySubjectId").prop("data-parsley-checkglsglrequied", false);
    $("#treasurySubjectId").empty().prop("disabled", true);
    $("#noSeriesId").prop("disabled", true).prop("required", false);
    $("#accountDetailId").prop("disabled", true).prop("data-parsley-validate-if-empty", false).prop("required", false);
}

$("#AddEditModal").on({
    "hidden.bs.modal": function () {
        $("#treasurySubjectId").empty();
        $("#noSeriesId").empty();
        $("#accountDetailId").empty();
        $("#noSeriesId").prop("disabled", true).val(0).trigger("change");
        $("#accountDetailId").prop("disabled", true).val(0).trigger("change");
        $("#note").val("").trigger("change");
        $("#stagePreviousList").html("");
        $("#stageItemTypeList").html("");
        $(".currentStage").text("-");

    },
    "shown.bs.modal": function () {

        if (modal_open_state == "Add") {

            isDisablenoSeriesId = {
                flg: false,
                edit: false
            };
            $("#branchId").select2("focus");
            $("#noSeriesId").prop("disabled", false);
            $("#accountDetailId").prop("disabled", false);

            $("#noSeriesId").prop("required", false).val(0).trigger("change")
            $("#accountDetailId").prop("disabled", true).prop("required", false).val(0).trigger("change")


            $("#returnReasonId").val("0").trigger("change");
            $("#branchId").prop('disabled', false);
            $("#stageId").prop('disabled', false);
            $("#note").val("").trigger("change");
        }
        else {

            if (+$("#treasurySubjectId").val() > 0 && +$("#noSeriesId").val() > 0) {//بعدی دارد و موضوع هم دارد
                $("#treasurySubjectId").select2("focus");
            }
            else if (+$("#treasurySubjectId").val() == 0 && +$("#noSeriesId").val() > 0) {//بعدی دارد و موضوع هم ندارد
                $("#noSeriesId").select2("focus");
            }
            else //بعدی ندارد و موضوع هم ندارد
                $("#orderDatePersian").focus();

            $("#branchId").prop("disabled", true);
            $("#stageId").prop("disabled", true);
        }
    }
});

$("#branchId").change(function () {
    let branchId = +$(this).val();
    if (branchId !== 0) {

        $("#noSeriesId").empty();
        $("#accountDetailId").empty();
        if (+$("#stageId").val() > 0) {
            fill_select2(`/api/GN/NoSeriesLineApi/noserieslistnextstage`, "noSeriesId", true, `${+$("#stageId").val()}/${branchId}`);
            $("#noSeriesId").prop("disabled", false).prop("required", true);
        }

    }
});

$("#stageId").change(function () {
    let stageId = +$(this).val();
    if (stageId !== 0) {
        inOutResult = getInOutStage(stageId);

        if (inOutResult != null || inOutResult != NaN) {
            let InOutName = (inOutResult == 1 ? "1-بدهکار" : "2-بستانکار");
            $('#inOut').val(InOutName);
            $('#inOut').data("value", inOutResult);
            if ($('#inOut').data("value") === 1) {
                $("#returnReason").addClass("displaynone");
                $("#returnReasonId").val("").trigger("change");
                $("#returnReasonId").val("").prop('required', false).removeAttr('data-parsley-selectvalzero');
            }
            else {
                $("#returnReason").removeClass("displaynone");
                $("#returnReasonId").html(`<option value="0">انتخاب کنید</option>`);
                fill_select2("/api/SM/ReturnReasonApi/getdropdown", "returnReasonId", true);
                $("#returnReasonId").prop('required', true).attr('data-parsley-selectvalzero', "")
            }
        }
        getdataByStageId(stageId);
    }


    $("#note").suggestBox({
        api: `${viewData_baseUrl_SM}/SaleDescriptionApi/search`,
        paramterName: "name",
        form_KeyValue: [+$("#stageId").val()],
        callBackSearche: callBackSearche,
        suggestFilter: {
            items: [],
            filter: ""
        }
    });

    $("#note").val("").trigger("change");
});

$("#noSeriesId").on("change", function (ev) {

    var noSeriesId = +$(this).val();

    if ((noSeriesId == 0 || noSeriesId == null)) {
        $("#accountDetailId").prop("disabled", true).prop("required", false).val(0).trigger("change")
    }
    else {
        $("#accountDetailId").prop("disabled", false).prop("required", true)
        $("#accountDetailId").empty();
        getModuleListByNoSeriesIdUrl(noSeriesId, "accountDetailId");
    }

});

$("#stimul_preview").click(function () {
    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;
    var p_id = $(`#${pagetable_id} .btnfilter`).attr("data-id");
    if (p_id == "filter-non")
        p_id = "";
    var p_value = $(`#${pagetable_id} .filtervalue`).val();
    var p_type = $(`#${pagetable_id} .btnfilter`).attr("data-type");
    var p_size = $(`#${pagetable_id} .btnfilter`).attr("data-size");

    var userId = null;
    if ($("#userType").prop("checked"))
        userId = getUserId();
    else
        userId = null;

    var reportParameters = [
        { Item: "PageNo", Value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "PageRowsCount", value: null, SqlDbType: dbtype.Int, Size: 0 },
        //{ Item: `${p_id}`, Value: p_value, SqlDbType: p_type, Size: p_size },
        { Item: "StageId", value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "CreateUserId", Value: userId, SqlDbType: dbtype.Int, Size: 0 },
    ]

    stimul_report(reportParameters);
});

$("#userType").on("change", function () {
    if ($(this).prop("checked"))
        pagetable_formkeyvalue = ["myadm", 0];
    else
        pagetable_formkeyvalue = ["alladm", 0];

    get_NewPageTableV1();

});

$('#displaySaleOrderLineModel').on("hidden.bs.modal", function (evt) {
    let switchUser = ""
    if ($("#userType").prop("checked")) {
        switchUser = "myadm"
    } else {
        switchUser = "alladm"
    }
    pagetable_formkeyvalue = [switchUser, 0];
});

initForm();