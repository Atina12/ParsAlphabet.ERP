
var viewData_form_title = "کسورات بیمه ",
    viewData_controllername = "PayrollSocialSecurityBracketApi",
    viewData_getpagetable_url = `${viewData_baseUrl_HR}/${viewData_controllername}/getpage`,
    viewData_deleterecord_url = `${viewData_baseUrl_HR}/${viewData_controllername}/delete`,
    viewData_getrecord_url = `${viewData_baseUrl_HR}/${viewData_controllername}/getrecordbyid`,
    viewData_csv_url = `${viewData_baseUrl_HR}/${viewData_controllername}/csv`,
    viewData_print_file_url = `${stimulsBaseUrl.HR.Prn}PayrollSocialSecurityBracket.mrt`,
    viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 },
    viewData_print_tableName = "",
    modal_open_state = "Add";


function initForm() {
    $("#stimul_preview")[0].onclick = null;
    fill_select2(`${viewData_baseUrl_GN}/FiscalYearApi/getdropdown`, "fiscalYearId", true);
    $('#userType').bootstrapToggle();
    $(".button-items").prepend($(".toggle"));
    pagetable_formkeyvalue = ["myadm", null];
    get_NewPageTableV1();
}

function modal_save(modal_name = null, enter_toline = false) {

    if (modal_name == null)
        modal_name = modal_default_name;

    if (modal_open_state == "Add")
        modal_record_insert(modal_name, enter_toline);
    else
        if (modal_open_state == "Edit")
            modal_record_update(modal_name, enter_toline);
}

function modal_record_insert(modal_name = null, pageVersion) {

    if (modal_name == null)
        modal_name = modal_default_name;
    var form = $(`#${modal_name} div.modal-body`).parsley();

    var validate = form.validate();
    validateSelect2(form);

    if (!validate) return;
    let employerSCPercentage = +$("#employerSCPercentage").val();
    let employeeSCPercentage = +$("#employeeSCPercentage").val();
    let unEmploymentSCPercentage = +$("#unEmploymentSCPercentage").val();
    let sumSCPercentage = employerSCPercentage + employeeSCPercentage + unEmploymentSCPercentage;
    if (sumSCPercentage > 99) {
        var msg = alertify.warning("جمع درصد های  بیمه بزرگتر از 99 نمی تواند باشد !");
        msg.delay(alertify_delay);
        $("#employerSCPercentage").focus()
        return

    }
    if (sumSCPercentage == 0) {
        var msg = alertify.warning(("درصد بیمه را انتخاب نمایید !"));
        msg.delay(alertify_delay);
        $("#employerSCPercentage").focus()
        return

    }
    let newModel = {
        id: 0,
        name: $("#name").val(),
        insurerId: +$("#insurerId").val(),
        workshopCode: +$("#workshopCode").val(),
        workshopName: $("#workshopName").val(),
        contractNo: (+$("#contractNo").val() > 0 ? +$("#contractNo").val() : 1),
        socialSecurityTypeId: +$("#socialSecurityTypeId").val(),
        employerSCPercentage: +$("#employerSCPercentage").val(),
        employeeSCPercentage: +$("#employeeSCPercentage").val(),
        unEmploymentSCPercentage: +$("#unEmploymentSCPercentage").val(),
        maxPensionableAmount: +removeSep($("#maxPensionableAmount").val()),
        fiscalYearId: + $("#fiscalYearId").val(),
        isActive: $("#isActive").prop("checked")
    }

    var definePageTable = null;

    if (pageVersion == "pagetable")
        definePageTable = get_NewPageTableV1;
    else
        definePageTable = get_NewPageTable

    if (pageVersion != "pagetable") {
        let index = arr_pagetables.findIndex(v => v.pagetable_id == "pagetable");
        arr_pagetables[index].pageNo = 0;
        arr_pagetables[index].currentrow = 1;

    }


    var viewData_insrecord_url = `${viewData_baseUrl_HR}/${viewData_controllername}/insert`;
    recordInsertUpdate(viewData_insrecord_url, newModel, modal_name, undefined)
}

function modal_record_update(modal_name = null, pageVersion) {
    if (modal_name == null)
        modal_name = modal_default_name;
    var form = $(`#${modal_name} div.modal-body`).parsley();
    var validate = form.validate();
    validateSelect2(form);
    if (!validate) return;

    let id = +$("#modal_keyid_value").text();

    let employerSCPercentage = +$("#employerSCPercentage").val();
    let employeeSCPercentage = +$("#employeeSCPercentage").val();
    let unEmploymentSCPercentage = +$("#unEmploymentSCPercentage").val();
    let sumSCPercentage = employerSCPercentage + employeeSCPercentage + unEmploymentSCPercentage;
    if (sumSCPercentage > 99) {
        var msg = alertify.warning("جمع درصد های  بیمه بزرگتر از 99 نمی تواند باشد !");
        msg.delay(alertify_delay);
        $("#employerSCPercentage").focus()
        return

    }
    if (sumSCPercentage == 0) {
        var msg = alertify.warning(("درصد بیمه را انتخاب نمایید !"));
        msg.delay(alertify_delay);
        $("#employerSCPercentage").focus()
        return

    }
    let newModel = {
        id,
        name: $("#name").val(),
        insurerId: +$("#insurerId").val(),
        workshopCode: +$("#workshopCode").val(),
        workshopName: $("#workshopName").val(),
        contractNo: (+$("#contractNo").val() > 0 ? +$("#contractNo").val() : 1),
        socialSecurityTypeId: +$("#socialSecurityTypeId").val(),
        employerSCPercentage: +$("#employerSCPercentage").val(),
        employeeSCPercentage: +$("#employeeSCPercentage").val(),
        unEmploymentSCPercentage: +$("#unEmploymentSCPercentage").val(),
        maxPensionableAmount: +removeSep($("#maxPensionableAmount").val()),
        fiscalYearId: + $("#fiscalYearId").val(),
        isActive: $("#isActive").prop("checked")
    }

    var definePageTable = null;

    if (pageVersion == "pagetable")
        definePageTable = get_NewPageTableV1;
    else
        definePageTable = get_NewPageTable

    if (pageVersion != "pagetable") {
        let index = arr_pagetables.findIndex(v => v.pagetable_id == "pagetable");
        arr_pagetables[index].pageNo = 0;
        arr_pagetables[index].currentrow = 1;

    }


    var viewData_updrecord_url = `${viewData_baseUrl_HR}/${viewData_controllername}/update`;

    recordInsertUpdate(viewData_updrecord_url, newModel, modal_name, undefined);
}

function recordInsertUpdate(url, insertModel, modalName, callBack = undefined) {

    $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(insertModel),
        async: false,
        cache: false,
        success: function (result) {

            if (result.successfull == true) {

                var msg = alertify.success("عملیات با موفقیت انجام شد");
                msg.delay(alertify_delay);
                modal_close(modalName);
                get_NewPageTable("pagetable");

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
            error_handler(xhr, url)
        }
    });
}

function export_csv(elemId = undefined) {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    if ($("#userType").prop("checked"))
        pagetable_formkeyvalue = ["myadm", null];
    else
        pagetable_formkeyvalue = ["alladm", null];


    $(`#${elemId == undefined || elemId == null ? "exportCSV" : elemId}`).prop("disabled", true);

    setTimeout(function () {
        let index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id);

        if (csvModel == null) {
            csvModel = {
                FieldItem: $(`#${pagetable_id} .btnfilter`).attr("data-id"),
                FieldValue: arr_pagetables[index].filtervalue,
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

$("#userType").on("change", function () {
    if ($(this).prop("checked"))
        pagetable_formkeyvalue = ["myadm", 0];
    else
        pagetable_formkeyvalue = ["alladm", null];

    get_NewPageTableV1();

});

$("#AddEditModal").on("shown.bs.modal", function () {
    if (modal_open_state == 'Add') {
        $("select").prop("selectedIndex", 0).trigger("change");
        $("#isActive").prop("checked", "checked");
    }
    else {
        $("#fiscalYearId").prop("disabled", true)
        $("#insurerId").prop("disabled", true)
        $("#socialSecurityTypeId").prop("disabled", true)
        setTimeout(() => {
            $("#name").focus()
        },100)
    }
});

$("#AddEditModal").on("hidden.bs.modal", function () {
    $("#fiscalYearId").removeAttr("disabled")
    $("#insurerId").removeAttr("disabled")
    $("#socialSecurityTypeId").removeAttr("disabled")
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
        { Item: `${p_id}`, Value: p_value, SqlDbType: p_type, Size: p_size },
        { Item: "WorkshopCode", value: null, SqlDbType: dbtype.VarChar, Size: 0 },
        { Item: "WorkshopName", Value: null, SqlDbType: dbtype.NVarChar, Size: 0 },
        { Item: "ContractNo", Value: null, SqlDbType: dbtype.TinyInt, Size: 0 },
        { Item: "CreateUserId", Value: userId, SqlDbType: dbtype.Int, Size: 0 },
    ]

    stimul_report(reportParameters);
});

initForm();