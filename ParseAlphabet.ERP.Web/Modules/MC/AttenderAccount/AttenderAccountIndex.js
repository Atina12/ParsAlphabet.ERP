var viewData_form_title = "حساب بانکی داکتران";
var viewData_controllername = "C";
var viewData_getrecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getrecordbyid`;
var viewData_getpagetable_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getpage`;
var viewData_deleterecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/delete`;
var viewData_insrecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/insert`;
var viewData_updrecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/update`;
var viewData_filter_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getfilteritems`;
var viewData_csv_url = `${viewData_baseUrl_MC}/${viewData_controllername}/csv`;
var AttenderAccountTypeId = 6;
var viewData_print_file_url = `${stimulsBaseUrl.MC.Prn}AttenderAccount.mrt`;
var viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 }
var viewData_print_tableName = "";


function initAttenderAcount() {
    inputMask();
    loadDropDown()
    pagetable_formkeyvalue = [0, AttenderAccountTypeId];
    get_NewPageTableV1();
}

function loadDropDown() {
    fill_select2(`${viewData_baseUrl_MC}/AttenderApi/getdropdown`, "personId", true, "1", false);
    fill_select2(`${viewData_baseUrl_FM}/BankApi/getdropdownisactive`, "bankId", true, 0, false);
}

function getPageTableFinished() {
    $("#filter_person").data("api", `${viewData_baseUrl_MC}/AttenderApi/getdropdown`);
}

after_getPageTableCallBack = getPageTableFinished;

function run_button_getaccount(p_keyvalue, rowNo, elem) {
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

    var getRow = $(`#row${rowNo}`);

    $.ajax({
        url: viewData_getrecord_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(+getRow.find(`#col_${rowNo}_2`).text()),
        async: false,
        cache: false,
        success: function (result) {
            modal_open_state = 'Edit';
            modal_clear_items(modal_name);
            modal_fill_items(result.data, modal_name);
            modal_show(modal_name);
            //mask region
            $("#shebaNoStr").val(result.data.shebaNo);

        },
        error: function (xhr) {
            error_handler(xhr, viewData_getrecord_url)
        }
    });
}

function saveAttenderAccount() {

    var form = $(`#AddEditModal div.modal-body`).parsley();

    var validate = form.validate();
    validateSelect2(form);
    if (!validate)
        return;

    let url = viewData_insrecord_url, message = msg_row_created;
    let isEdit = +$("#modal_keyid_value").text() > 0;
    var model = {
        id: +$("#modal_keyid_value").text(),
        personId: +$("#personId").val(),
        personTypeId: +$("#personTypeId").val(),
        bankId: +$("#bankId").val(),
        accountNo: $("#accountNo").val(),
        cardNo: $("#cardNo").val(),
        shebaNo: $("#shebaNoStr").val(),
        isActive: $("#isActive").prop("checked"),
        isDefualt: $("#isDefualt").prop("checked")
    }
    if (isEdit) {
        url = viewData_updrecord_url;
        message = msg_row_edited;
    }

    saveAttenderAccountAjax(url, model).then(function (result) {
        if (result.successfull) {
            alertify.success(message).delay(alertify_delay);
            modal_close("AddEditModal");
            get_NewPageTableV1();
        }
        else
            alertify.error(result.statusMessage).delay(alertify_delay);
    });
}

async function saveAttenderAccountAjax(url, model) {

    $("#modal-save").prop("disabled", true)

    let output = $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        cache: false,
        async: false,
        success: function (result) {
            setTimeout(() => {
                $("#modal-save").removeAttr("disabled")
            }, 500)
        },
        error: function (xhr) {
            setTimeout(() => {
                $("#modal-save").removeAttr("disabled")
            }, 500)
            error_handler(xhr, url)
        }
    });
    return output.responseJSON;
}

$("#exportCSV")[0].onclick = null;
$("#exportCSV").click(function () {
    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    let index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id);

    csvModel = {
        filters: arrSearchFilter[index].filters,
        Form_KeyValue: [0, AttenderAccountTypeId]
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

$("#stimul_preview")[0].onclick = null;
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

    p_id = ""
    p_value = ""
    p_type = ""
    p_size = ""


    var reportParameters = [
        { Item: "PageNo", Value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "PageRowsCount", value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "KeyId", Value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "PersonTypeId", Value: 6, SqlDbType: dbtype.TinyInt, Size: 0 },
        //{ Item: `${p_id}`, Value: p_value, SqlDbType: p_type, Size: p_size },
    ]

    stimul_report(reportParameters);
});

$("#AddEditModal").on("show.bs.modal", function () {
    if (modal_open_state == "Edit") {
        $("#personId").prop("disabled", true);
        $("#personId").prop("required", false);
    }
    else {
        $("#personId").val(0).trigger("change");
        $("#personId").prop("disabled", false);
        $("#personId").prop("required", true);
    }

})

$("#AddEditModal").on("shown.bs.modal", function () {
    setDefaultActiveCheckbox($("#isActive"));
});

initAttenderAcount()