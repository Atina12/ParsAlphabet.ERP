var viewData_form_title = "گروه تفصیل",
    viewData_controllername = "NoSeriesLineApi",
    viewData_getrecord_url = `${viewData_baseUrl_GN}/${viewData_controllername}/getrecordbyid`,
    viewData_getpagetable_url = `${viewData_baseUrl_GN}/${viewData_controllername}/getpage`,
    viewData_deleterecord_url = `${viewData_baseUrl_GN}/${viewData_controllername}/delete`,
    viewData_insrecord_url = `${viewData_baseUrl_GN}/${viewData_controllername}/insert`,
    viewData_updrecord_url = `${viewData_baseUrl_GN}/${viewData_controllername}/update`,
    viewData_filter_url = `${viewData_baseUrl_GN}/${viewData_controllername}/getfilteritems`,
    viewData_print_file_url = `${stimulsBaseUrl.GN.Prn}NoSeriesLine.mrt`,
    viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 },
    viewData_csv_url = `${viewData_baseUrl_GN}/${viewData_controllername}/csv`,
    viewData_print_tableName = "",
    reportSettingModel = { newPageAfter: false, resetPageNumber: false, showLogo: true, showReportDate: true };


$("#AddEditModal").on("show.bs.modal", function () {
    if (modal_open_state == "Edit") {
        $("#headerId").prop("disabled", true);
        $("#headerId").prop("required", false);
    }
    else {
        $("#headerId").val(0).trigger("change");
        $("#headerId").prop("disabled", false);
        $("#headerId").prop("required", true);
    }
})

$("#exportCSV")[0].onclick = null;

$("#exportCSV").click(function () {
    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    let index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id);

    csvModel = {
        Filters: arrSearchFilter[index].filters,
        Form_KeyValue: [0]
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
        },
        error: function (xhr) {
            error_handler(xhr, viewData_csv_url)
        }
    });


});

function modal_save(modal_name = null, pageVersion = "pagetable") {
    pageVersion = "pagetable"
    if (modal_name == null)
        modal_name = modal_default_name;

    if (modal_open_state == "Add")
        modal_record_insert(modal_name, pageVersion);
    else
        if (modal_open_state == "Edit")
            modal_record_update(modal_name, pageVersion);
}

function initNoSeriesLineIndex() {
    $(".relational-caption").text("گروه");
    $(".relationalbox").removeClass("displaynone");
    $("#headerId").select2()

    loadDropDown()

    pagetable_formkeyvalue = [0];

    get_NewPageTableV1();
}

function loadDropDown() {
    //fill_select2(`api/GNApi/noseries_getdropdown`, "form_keyvalue", true);
    fill_select2(`api/GNApi/noseries_getdropdown`, "headerId", true, 0, false);
    //fill_dropdown("/api/FMApi/bankaccountcategory_getdropdown", "id", "name", "bankAccountCategoryId", true, 0);
}

function run_button_deleteNoSeriesLine(p_keyvalue, rowno, elem) {

    var check = controller_check_authorize(viewData_controllername, "DEL");
    if (!check)
        return;
    var model = {
        LineNo: p_keyvalue,
        HeaderId: 0
    }

    alertify.confirm('', msg_delete_row,
        function () {
            $.ajax({
                url: viewData_deleterecord_url,
                type: "post",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(model),
                async: false,
                cache: false,
                success: function (result) {
                    if (result.successfull == true) {

                        var pagetableid = $(elem).closest("td").parent().parent().parent().parent().parent().attr("id");

                        get_NewPageTable(pagetableid);

                        var msg = alertify.success('حذف سطر انجام شد');
                        msg.delay(alertify_delay);
                    }
                    else {
                        if (result.statusMessage !== undefined && result.statusMessage !== null) {
                            var msg = alertify.error(result.statusMessage);
                            msg.delay(alertify_delay);
                        }
                        else if (result.validationErrors !== undefined) {
                            generateErrorValidation(result.validationErrors);
                        }
                        else {
                            var msg = alertify.error(msg_row_create_error);
                            msg.delay(2);
                        }
                    }
                },
                error: function (xhr) {
                    error_handler(xhr, viewData_deleterecord_url)
                }
            });

        },
        function () { var msg = alertify.error('انصراف از حذف'); msg.delay(alertify_delay); }
    ).set('labels', { ok: 'بله', cancel: 'خیر' });
}

function run_button_editNoSeriesLine(p_keyvalue, rowno, elem) {

    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;

    var modal_name = null

    $("#rowKeyId").removeClass("d-none");

    if (modal_name == null)
        modal_name = modal_default_name;

    viewData_modal_title = "ویرایش " + viewData_form_title;
    $("#modal_keyid_value").text(p_keyvalue);
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

    $("#branchId").prop("disabled", true);
    $("#stageId").prop("disabled", true);
    $("#currencyId").prop("disabled", true);
    $("#officialInvoice").prop("disabled", true);

    var model = {
        LineNo: p_keyvalue,
        HeaderId: 0
    }


    $.ajax({
        url: viewData_getrecord_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        async: false,
        cache: false,
        success: function (result) {
            modal_open_state = 'Edit';
            modal_clear_items(modal_name);
            modal_fill_items(result.data, modal_name);
            modal_show(modal_name);

        },
        error: function (xhr) {
            error_handler(xhr, viewData_getrecord_url)
        }
    });
}

function modal_record_insert(modal_name = null, pageVersion) {

    if (modal_name == null)
        modal_name = modal_default_name;
    var form = $(`#${modal_name} div.modal-body`).parsley();

    var validate = form.validate();
    validateSelect2(form);
    if (!validate) return;

    var newModel = {};

    newModel = {
        lineNo: +$("#lineNo").val(),
        startNo: $("#startNo").val() == "" ? null : $("#startNo").val(),
        endNo: $("#endNo").val() == "" ? null : $("#endNo").val(),
        headerId: $("#headerId").val(),
    }

    if (newModel.startNo == null || newModel.startNo == 0) {
        var msg = alertify.warning('نقطه شروع نمی تواند صفر یا خالی بماند');
        msg.delay(alertify_delay);
        $("#startNo").focus()
        return
    }

    if (newModel.endNo == null || newModel.endNo == 0) {
        var msg = alertify.warning('نقطه پایان نمی تواند صفر یا خالی بماند');
        msg.delay(alertify_delay);
        $("#endNo").focus()
        return
    }

    if (newModel.endNo <= newModel.startNo) {
        var msg = alertify.warning('نقطه پایان باید بزرگتر از نقطه شروع باشد');
        msg.delay(alertify_delay);
        $("#startNo").focus()
        return
    }

    recordInsertUpdate(viewData_insrecord_url, newModel, modal_name, msg_row_created, undefined, get_NewPageTableV1)
}

function modal_record_update(modal_name = null, pageVersion) {
    if (modal_name == null)
        modal_name = modal_default_name;
    var form = $(`#${modal_name} div.modal-body`).parsley();
    var validate = form.validate();
    validateSelect2(form);
    if (!validate) return;
    var newModel = {};



    newModel = {
        lineNo: +$("#lineNo").val(),
        startNo: $("#startNo").val() == "" ? null : $("#startNo").val(),
        endNo: $("#endNo").val() == "" ? null : $("#endNo").val(),
        headerId: $("#headerId").val(),
    }

    newModel["Id"] = +$("#modal_keyid_value").text();

    if (newModel.startNo == null || newModel.startNo == 0) {
        var msg = alertify.warning('نقطه شروع نمی تواند صفر یا خالی بماند');
        msg.delay(alertify_delay);
        $("#startNo").focus()
        return
    }

    if (newModel.endNo == null || newModel.endNo == 0) {
        var msg = alertify.warning('نقطه پایان نمی تواند صفر یا خالی بماند');
        msg.delay(alertify_delay);
        $("#endNo").focus()
        return
    }

    if (newModel.endNo <= newModel.startNo) {
        var msg = alertify.warning('نقطه پایان باید بزرگتر از نقطه شروع باشد');
        msg.delay(alertify_delay);
        $("#startNo").focus()
        return
    }



    //موقت

    if (pageVersion != "pagetable") {
        let index = arr_pagetables.findIndex(v => v.pagetable_id == "pagetable");
        arr_pagetables[index].pageNo = 0;
        arr_pagetables[index].currentrow = 1;
    }

    recordInsertUpdate(viewData_updrecord_url, newModel, modal_name, msg_row_edited, undefined, get_NewPageTableV1);
}

$("#stimul_preview")[0].onclick = null;
$("#stimul_preview").click(function () {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    var reportParameters = [
        { Item: "PageNo", Value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "PageRowsCount", value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "HeaderId", value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "StartNo", value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "EndNo", value: null, SqlDbType: dbtype.Int, Size: 0 },
    ]

    stimul_report(reportParameters);
});

initNoSeriesLineIndex()


