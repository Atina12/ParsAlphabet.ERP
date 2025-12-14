var viewData_form_title = "حساب‌های مشتریان";
var viewData_controllername = "CustomerAccountApi";
var viewData_getrecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getrecordbyid`;
var viewData_getpagetable_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getpage`;
var viewData_deleterecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/delete`;
var viewData_insrecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/insert`;
var viewData_updrecord_url = `${viewData_baseUrl_SM}/${viewData_controllername}/update`;
var viewData_filter_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getfilteritems`;
var viewData_csv_url = `${viewData_baseUrl_SM}/${viewData_controllername}/csv`;
var customerAccountTypeId = 1;
var viewData_print_file_url = `${stimulsBaseUrl.SM.Prn}CustomerAccount.mrt`;
var viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 };
var viewData_print_tableName = "";

inputMask();

pagetable_formkeyvalue = [0, customerAccountTypeId];
fill_select2(`${viewData_baseUrl_SM}/CustomerApi/getdropdown`, "personId", true, 0, false);
fill_select2(`${viewData_baseUrl_FM}/BankApi/getdropdownisactive`, "bankId", true, 0, false);

get_NewPageTableV1();

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

$("#exportCSV")[0].onclick = null;
$("#exportCSV").click(function () {
    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    let index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id);

    csvModel = {
        Filters: arrSearchFilter[index].filters,
        Form_KeyValue: [0, customerAccountTypeId]
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

    var reportParameters = [
        { Item: "PageNo", Value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "PageRowsCount", value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "KeyId", Value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "PersonTypeId", Value: 2, SqlDbType: dbtype.TinyInt, Size: 0 },
        //{ Item: `${p_id}`, Value: p_value, SqlDbType: p_type, Size: p_size },
    ]

    stimul_report(reportParameters);
});

function saveCustomerAccount() {

    var form = $(`#AddEditModal div.modal-body`).parsley();
    var validate = form.validate();
    validateSelect2(form);
    if (!validate) return;
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

    saveCustomerAccountAjax(url, model).then(function (result) {
        if (result.successfull) {
            alertify.success(message).delay(alertify_delay);
            modal_close("AddEditModal");
            get_NewPageTableV1();
        }
        else
            alertify.error(result.statusMessage).delay(alertify_delay);
    });
}

async function saveCustomerAccountAjax(url, model) {
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
            return result;
        },
        error: function (xhr) {
            setTimeout(() => {
                $("#modal-save").removeAttr("disabled")
            }, 500)

            error_handler(xhr, url);

            return {
                successfull: false,
                statusMessage: "شرح خطا در کنسول درج شد"
            };
        }
    });
    return output.responseJSON;
}