var viewData_check_nationalCode_url_em = `${viewData_baseUrl_HR}/EmployeeApi/getnationalcode`;
var viewData_get_user_bynationalCode_url_em = `${viewData_baseUrl_GN}/UserApi/getrecordbynationalcode`;
var viewData_insrecord_url_em = `${viewData_baseUrl_HR}/EmployeeApi/insert`;

fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getlistbytypeid`, "insurerIdEm", true, "1/false/1/false", false);
fill_select2("/api/GN/LocCountryApi/getdropdown", "locCountryIdEm", true);
fill_select2(`${viewData_baseUrl_HR}/EmployeeGroupApi/getdropdown`, "personGroupId", true, 1);
fill_dropdown("/api/SetupApi/maritalstatus_getdropdown", "id", "name", "maritalStatusIdEm");
//fill_select2(`${viewData_baseUrl_GN}/UserApi/getdropdown`, "userId", true, 0, true);
var flgCheckvalidateEmployee = false;

$("#locCountryIdEm").on("change", function () {

    if (($('#locCountryIdEm :selected').length == 0) || ($('#locCountryIdEm :selected').val() != 101)) {
        $("#locStateIdEm").val("0").prop('disabled', true).prop('required', false).trigger("change")
    }
    else {
        $('#locStateIdEm').prop('disabled', false).prop('required', true).trigger("change");
        fill_select2("/api/GN/LocStateApi/getdropdown", "locStateIdEm", true);
    }
});
$("#locCountryIdEm").trigger("change")

$("#locStateIdEm").on("change", function () {
    if (+$(this).val() != 0) {
        $("#locCityIdEm").html("");
        fill_select2(`${viewData_baseUrl_GN}/LocCityApi/getdropdown`, "locCityIdEm", true, +$(this).val());
    }

    if (($('#locStateIdEm :selected').length == 0) || ($('#locStateIdEm :selected').val() == 0)) {
        $("#locCityIdEm").val(0).prop('disabled', true).prop('required', false).trigger("change");
    }
    else {
        $('#locCityIdEm').removeAttr('disabled').prop('required', true);
    }
});
$("#locStateIdEm").trigger("change")

$("#insurerIdEm").on("change", function () {
    if (+$(this).val() != 0) {
        $("#insurNoEm").val('');
    }

    if (($('#insurerIdEm :selected').length == 0) || ($('#insurerIdEm :selected').val() == 0)) {
        $("#insurNoEm").val(0).prop('disabled', true)
    }
    else {
        $('#insurNoEm').val('').prop('disabled', false)
    }

})
$("#insurerIdEm").trigger("change")

$("#AddEditModalEm").on("shown.bs.modal", function () {
    if (modal_open_state == 'Edit') {
        
    }
    else {
        $("#locCountryIdEm").val("").trigger("change")
        $("#insurNoEm").val(0);
        $("#partnerTypeIdVe").prop('disabled', false);
        $("#partnerTypeIdVe").prop("required", true);
        $("#partnerTypeIdVe").val("1").trigger("change");
        $('#partnerTypeIdVe').focus();
        $("#isActiveEm").prop("checked", "checked")
        funkyradio_onchange($("#isActiveEm"));
    }
});

window.Parsley._validatorRegistry.validators.comparedate = undefined
    window.Parsley.addValidator("existnationalcodeem", {
        validateString: function (value) {

            if (value !== "") {
                return checkExistNationalCodeEm(value, +$("#modal_keyid_value").text());
            }

            return true;
        },
        messages: {
            en: 'نمبر تذکره قبلا ثبت شده است'
        }
    });

function checkExistNationalCodeEm(nationalCode, id) {

    var model = { id: id, name: nationalCode }
    var output = $.ajax({
        url: viewData_check_nationalCode_url_em,
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

kamaDatepicker('idDatePersianEm', { withTime: false, position: "bottom" });
$(`#idDatePersianEm`).inputmask();

modal_default_name = "AddEditModalEm";
$("#readyforadd").on("click", function () {
    modal_ready_for_add("AddEditModalEm");
});

$("#maritalStatusIdEm").val(0);
$("#locStateIdEm").val(0);
$("#AddEditModalEm select").trigger("change");


function modal_record_update(modal_name = null, pageVersion) {
    if (modal_name == null)
        modal_name = modal_default_name;

    var form = $(`#${modal_name} div.modal-body`).parsley();

    if (flgCheckvalidateEmployee) {
        var validate = form.validate();

        validateSelect2(form);
        if (!validate) return;
    }
    var newModel = {};

    newModel["Id"] = +$("#modal_keyid_value").text();

    var swReturn = false;
    var element = $(`#${modal_name}`);

    element.find("input,select,img,textarea").each(function () {
        var elm = $(this);
        var elmid = elm.attr("id");

        var val = elm.val();
        if (elm.hasClass("money"))
            val = +removeSep(elm.val()) !== 0 ? +removeSep(elm.val()) : 0;
        else if (elm.hasClass("decimal"))
            val = +removeSep(elm.val()) !== 0 ? removeSep(elm.val().replace(/\//g, ".")) : 0;
        else if (elm.hasClass("number"))
            val = +removeSep(elm.val()) !== 0 ? +elm.val() : 0;
        else if (elm.hasClass("str-number"))
            val = +removeSep(elm.val()) !== 0 ? elm.val() : "";
        else if (elm.attr("type") == "checkbox")
            val = elm.prop("checked");
        else if (elm.hasClass("select2") || elm.prop("tagName").toLowerCase() == "select")
            val = elm.val();
        else
            if (val !== null) {
                val = myTrim(elm.val());
            }

        var tag = elm.prop("tagName").toLowerCase();
        if (tag === `img`) {
            var src = elm.attr("src");
            var pos = src.indexOf("base64,");
            if (pos != -1) {
                val = src.substring(pos + 7);
                var decoded = atob(val);
                if (decoded.length >= 51200) {
                    alertify.alert("کنترل حجم", msg_picturesize_limit_50);
                    swReturn = true;
                    return;
                }
                elmid = elmid + "_base64";
            }
        }

        newModel[elmid] = val;
    });

    if (swReturn)
        return;

    //موقت
    var definePageTable = null;

    if (pageVersion == "pagetable")
        definePageTable = get_NewPageTableV1;
    else
        definePageTable = get_NewPageTable

    if (pageVersion != "pagetable") {
        let index = arr_pagetables.findIndex(v => v.pagetable_id == "pagetable");
        arr_pagetables[index].pageNo = 0;
    }
    
    recordInsertUpdate(viewData_updrecord_url, newModel, modal_name, msg_row_edited, undefined, definePageTable);
}

function checkEmployeeInput(ev) {
    if (modal_open_state == "Edit")
        flgCheckvalidateEmployee = true;
}
