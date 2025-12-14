var viewData_form_title = "خدمت";
var viewData_controllername = "ServiceApi";
var viewData_getrecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getrecordbyid`;
var viewData_get_servicename_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getservicename`;
var viewData_getpagetable_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getpage`;
var viewData_deleterecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/delete`;
var viewData_insrecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/insert`;
var viewData_updrecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/update`;
var viewData_filter_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getfilteritems`;
var viewData_check_nationalCode_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getnationalcode`;
var viewData_check_terminology_url = `${viewData_baseUrl_MC}/${viewData_controllername}/checkexisttaminterminology`;
var viewData_print_file_url = `${stimulsBaseUrl.MC.Prn}Service.mrt`, serviceId = 0, centralId = 0;
var viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 }
var viewData_print_tableName = "";
var viewData_csv_url = `${viewData_baseUrl_MC}/${viewData_controllername}/csv`;
var viewData_rvu_kparameter = `${viewData_baseUrl_MC}/${viewData_controllername}/getparameter`;
var viewData_taminParameter = `${viewData_baseUrl_MC}/${viewData_controllername}/gettaminparameter`;
var viewData_cdt_parameter = `${viewData_baseUrl_MC}/${viewData_controllername}/getcdtparameter`;
var viewData_sendcentral_url = `${viewData_baseUrl_MC}/${viewData_controllername}/sendcentralservice`;

arr_pagetables = [
    {
        pagetable_id: "pagetable",
        editable: false,
        pagerowscount: 15,
        endData: false,
        pageNo: 0,
        currentpage: 1,
        currentrow: 1,
        currentcol: 0,
        highlightrowid: 0,
        trediting: false,
        pagetablefilter: false,
        filteritem: "",
        filtervalue: ""
    }
];

function initServiceIndex() {
    pagetable_formkeyvalue = ["service"]
    get_NewPageTableV1();
    loadDropdown()
}

function loadDropdown() {
    fill_select2("/api/MC/ServiceTypeApi/getdropdown", "serviceTypeId", true, 1);
    fill_select2(`/api/AdmissionsApi/getthrservicedropdown`, "terminologyId", false, 0, true, 4);
    fill_select2(`/api/AdmissionsApi/getthrcdtservicedropdown`, "cdtTerminologyId", false, 0, true, 4);
    fill_select2(`/api/AdmissionsApi/gettaminservicedropdown`, "taminTerminologyId", false, 0, true, 4);
}

function checkExistNationalCode(nationalCode, id) {

    var model = { id, nationalCode }
    var output = $.ajax({
        url: viewData_check_nationalCode_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(model),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_check_nationalCode_url);
            return JSON.parse(false);
        }
    });

    return output.responseJSON;
}

function checkExistTerminology(id, no) {
    var model = { id: id, name: no }
    var output = $.ajax({
        url: viewData_check_terminology_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(model),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_check_terminology_url);
            return JSON.parse(false);
        }
    });
    return output.responseJSON;
}

function parameter() {

    let index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id);
    let parameters = {
        pageNo: 0,
        pageRowsCount: 0,
        fieldItem: "",
        fieldValue: "",
        form_KeyValue: [],
        filters: arrSearchFilter[index].filters,
        sortModel: null
    }

    return parameters;
}

function run_button_edit(p_keyvalue) {
    var check = controller_check_authorize(viewData_controllername, "UPD")
    if (!check)
        return;

    var modal_name = null

    $("#rowKeyId").removeClass("d-none");
    if (modal_name == null)
        modal_name = modal_default_name;

    $(".modal").find("#modal_title").text("ویرایش " + viewData_form_title);

    $("#modal_keyid_value").text(p_keyvalue);
    $("#modal_keyid_caption").text("شناسه : ");

    let url = `${viewData_baseUrl_MC}/${viewData_controllername}/getrecordbyid`
    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(p_keyvalue),
        async: false,
        cache: false,
        success: function (result) {

            modal_open_state = 'Edit';
            modal_clear_items(modal_name);
            modal_fill_items(result.data, modal_name);
            modal_show(modal_name);
        },
        error: function (xhr) {
            error_handler(xhr, url)
        }
    });
}

function modal_fill_items(item, modal_name) {

    if (!item) return;
    if (modal_name == null)
        modal_name = modal_default_name;

    $("#name").val(item.name);
    $("#onlineName").val(item.onlineName);
    $("#serviceTypeId").val(item.serviceTypeId == null ? 0 : item.serviceTypeId).trigger("change");
    $("#printDescription").val(item.printDescription);
    $("#isActive").prop("checked", item.isActive).trigger("change");

    if (item.terminologyId != 0 && item.terminologyId != null) {
        var cdtVal = `${item.terminologyId} - ${item.terminologyName}`;
        var newOption = new Option(cdtVal, item.terminologyId, true, true);
        $("#terminologyId").append(newOption).trigger('change');
    }

    if (item.cdtTerminologyId != 0 && item.cdtTerminologyId != null) {
        var cdtVal = `${item.cdtTerminologyId} - ${item.cdtTerminologyName}`;
        var newOptionC = new Option(cdtVal, item.cdtTerminologyId, true, true);
        $("#cdtTerminologyId").append(newOptionC).trigger('change');
    }

    if (item.taminTerminologyId != 0 && item.taminTerminologyId != null) {
        var taminVal = `${item.taminTerminologyId} - ${item.taminTerminologyName}`;
        var newOptionT = new Option(taminVal, item.taminTerminologyId, true, true);
        $("#taminTerminologyId").append(newOptionT).trigger('change');
    }
    
    centralId = item.centralId;
}


async function saveService() {
    var url = "", opr = "";

    if (modal_open_state == "Add") {
        opr = "Ins";
        url = viewData_insrecord_url;
    }
    else if (modal_open_state == "Edit") {
        opr = "Upd";
        url = viewData_updrecord_url;
    }
    if ($("#name").val() == "") {
        var msgError = alertify.warning("نام خدمت را وارد نمایید");
        msgError.delay(alertify_delay);
        return
    }
    if ($("#onlineName").val() == "") {
        var msgError = alertify.warning("نام آنلاین خدمت را وارد نمایید");
        msgError.delay(alertify_delay);
        return
    }
    if ($("#serviceTypeId").val() == 0 || $("#serviceTypeId").val() == null) {
        var msgError = alertify.warning(" نوع خدمت را انتخاب نمایید");
        msgError.delay(alertify_delay);
        return
    }


    var model = {
        id: +$("#modal_keyid_value").text(),
        name: $("#name").val(),
        onlineName: $("#onlineName").val(),
        serviceTypeId: $("#serviceTypeId").val(),
        isActive: $("#isActive").prop("checked"),
        printDescription: $("#printDescription").val(),
        terminologyId: $("#terminologyId").val(),
        taminTerminologyId: $("#taminTerminologyId").val(),
        cdtTerminologyId: $("#cdtTerminologyId").val(),
        centralId: centralId,
        opr:opr
    };

    saveServiceAsync(model, url)
        .then(async (data) => {
            if (data.successfull) {
                var msgError = alertify.success(data.statusMessage);
                msgError.delay(alertify_delay);
                modal_close()
                centralId = 0;
                //setTimeout(() => {
                //    $("#saveForm").removeAttr("disabled")
                //}, 500)

                get_NewPageTableV1()
            }
            else {

                if (data.validationErrors.length > 0)
                    generateErrorValidation(data.validationErrors)
                if (data.statusMessage != null) {
                    var msgError = alertify.warning(data.statusMessage);
                    msgError.delay(alertify_delay);
                }
            }
        })
}

async function saveServiceAsync(model, url) {

   // $("#saveForm").prop("disabled", true)

    let result = await $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (data) {
            return data;
        },
        error: function (xhr) {

            //setTimeout(() => {
            //    $("#saveForm").removeAttr("disabled")
            //}, 500)
            error_handler(xhr, url);
            return {
                status: -100,
                statusMessage: "عملیات با خطا مواجه شد",
                successfull: false
            };
        }
    });

    return result;
}

function export_csv() {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;


    let csvModel = parameter();
    csvModel.pageNo = null;
    csvModel.pageRowsCount = null;
    var urlCSV = "";
    let title = "خدمات"
    urlCSV = viewData_csv_url
    csvModel.Form_KeyValue = ["service"]

    title = "خدمات"
    $.ajax({
        url: urlCSV,
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
                element.setAttribute('download', `${title}.csv`);
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
                window.URL.revokeObjectURL(urlCSV);
            }
        },
        error: function (xhr) {
            error_handler(xhr)
        }
    });

}

$("#terminologyId").on("change", function () {

    var terminologyId = +$(this).val()

    $.ajax({
        url: viewData_rvu_kparameter,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(terminologyId),
        success: function (result) {
            $("#professionalCodeK").val("");
            $("#technicalCodeK").val("");
            $("#anesthesiaBaseK").val("");
            $("#tarefCodeterminology").val("");

            $("#tarefCodeterminology").val(result.code);
            $("#professionalCodeK").val(result.professionalCode);
            $("#technicalCodeK").val(result.technicalCode);
            $("#anesthesiaBaseK").val(result.anesthesiaBase);

        },
        error: function (xhr) {
            error_handler(xhr, viewData_rvu_kparameter);
        }
    });
});

$("#cdtTerminologyId").on("change", function () {

    var cdtTerminologyId = +$(this).val()

    $.ajax({
        url: viewData_cdt_parameter,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(cdtTerminologyId),
        success: function (result) {
            $("#codeCdtTerminology").val("");
            $("#descriptionCdtTerminology").val("");
            $("#codeCdtTerminology").val(result.code);
            $("#descriptionCdtTerminology").val(result.description);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_cdt_parameter);
        }
    });
});

$("#taminTerminologyId").on("change", function () {

    var terminologyId = +$(this).val()

    if (terminologyId == 0)
        return

    $.ajax({
        url: viewData_taminParameter,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(terminologyId),
        success: function (result) {
            $("#tarefCode").val("");
            $("#govermentPrice").val("");
            $("#freePrice").val("");
            $("#techPrice").val("");
            $("#minAge").val("");
            $("#maxAge").val("");
            $("#acceptableGender").val("");

            $("#tarefCode").val(result.tarefCode);
            $("#govermentPrice").val(transformNumbers.toComma(result.govermentPrice));
            $("#freePrice").val(transformNumbers.toComma(result.freePrice));
            $("#techPrice").val(transformNumbers.toComma(result.techPrice));
            $("#minAge").val(result.minAge);
            $("#maxAge").val(result.maxAge);
            $("#acceptableGender").val(result.acceptableGender);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_rvu_kparameter);
        }
    });
});

$("#AddEditModal").on("show.bs.modal", function () {
    $("#sepasBox,#sepasFormLink").addClass("active");
    $("#attenderBox,#attenderFormLink").removeClass("active");
    $("#cdtBox,#cdtFormLink").removeClass("active");
    setDefaultActiveCheckbox($("#isActive"));
});

function run_button_sendToCentral(p_keyvalue) {

    sendServiceToCentral(p_keyvalue);
}

function sendServiceToCentral(p_keyvalue) {

    $.ajax({
        url: viewData_sendcentral_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(p_keyvalue),
        success: function (result) {

            if (result.successfull == true) {
                alertify.success(result.statusMessage);
                get_NewPageTableV1();
            }
            else {
                if (checkResponse(result.validationErrors) && result.validationErrors.length > 0) {
                    let messages = generateErrorString(result.validationErrors);
                    alertify.error(messages).delay(alertify_delay);
                    return;
                }
                else {
                    alertify.error(result.statusMessage).delay(alertify_delay);

                }
            }

        },
        error: function (xhr) {
            error_handler(xhr, viewData_sendcentral_url);
        }
    });

}
window.Parsley._validatorRegistry.validators.existterminology = undefined
window.Parsley.addValidator("existterminology", {
    validateString: value => {
        if (+value !== 0)
            return checkExistTerminology(+$("#modal_keyid_value").text(), value);
        return true;
    },
    messages: {
        en: 'شناسه ملی قبلا ثبت شده است'
    }
});

window.Parsley._validatorRegistry.validators.existnationalcode = undefined
window.Parsley.addValidator("existnationalcode", {
    validateString: function (value) {
        if (value !== "") {
            return checkExistNationalCode(value, +$("#modal_keyid_value").text());
        }

        return true;
    },
    messages: {
        en: 'نمبر تذکره قبلا ثبت شده است'
    }
});

initServiceIndex()
