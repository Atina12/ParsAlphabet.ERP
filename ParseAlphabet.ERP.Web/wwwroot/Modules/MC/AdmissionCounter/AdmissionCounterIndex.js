var viewData_form_title = "غرفه ها",
    viewData_controllername = "AdmissionCounterApi",
    viewData_getrecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getrecordbyid`,
    viewData_getpagetable_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getpage`,
    viewData_deleterecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/delete`,
    viewData_insrecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/insert`,
    viewData_updrecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/update`,
    viewData_filter_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getfilteritems`,
    viewData_hasfilter = true,
    viewData_print_file_url = `${stimulsBaseUrl.MC.Prn}AdmissionCounter.mrt`,
    viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 },
    viewData_print_tableName = "",
    viewData_csv_url = `${viewData_baseUrl_MC}/${viewData_controllername}/csv`,
    viewData_check_Casier_url = `${viewData_baseUrl_MC}/${viewData_controllername}/cashierexist`,
    viewData_check_CounterUser_url = `${viewData_baseUrl_MC}/${viewData_controllername}/counteruserexist`,
    viewData_getpagetablePos_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getpage`,
    arrayIdsPos = [];


function initCounter() {
    $("#cashierId").select2()

    loadDropDown()

    get_NewPageTableV1();
}

function loadDropDown() {
    fill_select2(`${viewData_baseUrl_GN}/BranchApi/getactivedropdown`, "branchId", true);
    fill_select2(`/api/AdmissionsApi/admissioncountertype_getdropdown`, "counterTypeId", true);
    fill_select2(`/api/GN/UserApi/getdropdown`, "counterUserId", true, "1/false/false", false);
}

function checkExistCashier(id, cashierId) {
    var model = { id: id, name: cashierId }

    var output = $.ajax({
        url: viewData_check_Casier_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(model),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_check_Casier_url);
            return JSON.parse(false);
        }
    });
    return output.responseJSON;
}

function checkExistCounterUser(id, userId) {
    var model = { id: id, name: userId }

    var output = $.ajax({
        url: viewData_check_CounterUser_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(model),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_check_CounterUser_url);
            return JSON.parse(false);
        }
    });
    return output.responseJSON;
}

window.Parsley._validatorRegistry.validators.existcashir = undefined;
window.Parsley.addValidator("existcashir", {
    validateString: function (value) {
        if (+value !== 0)
            return checkExistCashier(+$("#modal_keyid_value").text(), value);

        return true;
    },
    messages: {
        en: 'صندوق قبلا ثبت شده است'
    }
});

window.Parsley._validatorRegistry.validators.existcounteruser = undefined;
window.Parsley.addValidator("existcounteruser", {
    validateString: function (value) {
        if (+value !== 0)
            return checkExistCounterUser(+$("#modal_keyid_value").text(), value);

        return true;
    },
    messages: {
        en: 'کاربر قبلا ثبت شده است'
    }
});

$("#branchId").on("change", function () {
    $("#cashierId").html(`<option value="0">انتخاب کنید</option>`);
    if (+$(this).val() !== 0)
        fill_select2(`${viewData_baseUrl_FM}/CashierApi/getdropdown`, "cashierId", true, $(this).val());
});

$("#AddEditModal").on("shown.bs.modal", function () {

    if (modal_open_state == "Edit") {
        $("#counterUserId").prop("disabled", true)
        $("#branchId").select2("focus")
    }
    else {
        $("#counterUserId").prop("disabled", false)
    }
});

$("#AddEditModal").on("hidden.bs.modal", function () {
    $("#counterUserId").prop("disabled", false)
    setDefaultActiveCheckbox($("#isActive"));
});

initCounter()
