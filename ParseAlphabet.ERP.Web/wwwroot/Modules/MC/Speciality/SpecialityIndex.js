var viewData_form_title = "تخصص";


var viewData_controllername = "SpecialityApi";
var viewData_getrecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getrecordbyid`;
var viewData_getpagetable_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getpage`;
var viewData_deleterecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/delete`;
var viewData_insrecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/insert`;
var viewData_updrecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/update`;
var viewData_filter_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getfilteritems`;
var viewData_check_TerminologyIdentity_url = `${viewData_baseUrl_MC}/${viewData_controllername}/checkterminologyid`;
var viewData_print_file_url = `${stimulsBaseUrl.MC.Prn}Speciality.mrt`, serviceId = 0;
var viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 }
var viewData_print_tableName = "";
var viewData_csv_url = `${viewData_baseUrl_MC}/${viewData_controllername}/csv`;

fill_select2(`/api/AdmissionsApi/getthrspecialitydropdown`, "terminologyId", true, 0, true);

get_NewPageTableV1();

$('#AddEditModal').on('shown.bs.modal', function (e) {
    if (modal_open_state == "Add") {
        $('#terminologyId').prop("selectedIndex", 0).trigger("change");
        setDefaultActiveCheckbox($("#isActive"));
    }
    else {

    }
})

function checkExistTerminologyIdentity(terminologyId) {

    var model = {
        id: +$("#modal_keyid_value").text(),
        terminologyId: terminologyId
    };

    var output = $.ajax({
        url: viewData_check_TerminologyIdentity_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(model),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_check_TerminologyIdentity_url);
            return JSON.parse(false);
        }
    });

    return output.responseJSON;
}

window.Parsley._validatorRegistry.validators.checkterminologyid = undefined;
window.Parsley.addValidator("checkterminologyid", {
    validateString: function (value) {
        if (value !== "") {
            let result = checkExistTerminologyIdentity(value);
            return result;
        }

        return true;
    },
    messages: {
        en: 'نمبر تذکره قبلا ثبت شده است'
    }
});
