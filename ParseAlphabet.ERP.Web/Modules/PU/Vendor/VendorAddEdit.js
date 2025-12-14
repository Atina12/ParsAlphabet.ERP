
var viewData_insrecord_url_ve = `${viewData_baseUrl_PU}/VendorApi/insert`;
var viewData_check_nationalcode_url = `${viewData_baseUrl_PU}/VendorApi/getnationalcode`;
var flgCheckvalidateVendor = false;
fill_select2("/api/GN/LocCountryApi/getdropdown", "locCountryIdVe", true);
fill_select2("/api/GN/LocStateApi/getdropdown", "locStateIdVe", true);
fill_select2(`${viewData_baseUrl_GN}/IndustryGroupApi/getdropdownbytype`, "industryIdVe", true, true);
fill_dropdown("/api/FM/BankApi/getdropdown", "id", "name", "bankId");
fill_select2(`/api/FMApi/vatArea_getdropdown`, "vatAreaIdVe", true);
fill_select2(`${viewData_baseUrl_PU}/VendorGroupApi/getdropdown`, "vendorGroupIdVe", true, 1);
fill_select2(`/api/GNApi/personTitle_GetDropDown`, "personTitleIdVe", true, 1);
fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getlistbytypeid`, "insurerIdVe", true, "1/false/1/false");

$("#idDatePersianVe").inputmask();
$("#idDate").inputmask();
/////////////////////////////////////////////////////////////////////////////////////////

$("#locCountryIdVe").on("change", function () {
    if (+$(this).val() != 0) {
        $("#locStateIdVe").html("");
        fill_select2("/api/GN/LocStateApi/getdropdown", "locStateIdVe", true);
    }

    if (($('#locCountryIdVe :selected').length == 0) || ($('#locCountryIdVe :selected').val() != 101)) {
        $('#locStateIdVe').val('0').prop('disabled', true).prop('required', false).trigger("change");
    }
    else {
        $('#locStateIdVe').prop('disabled', false).prop("required", true).trigger("change");
    }
});
$("#locCountryIdVe").trigger("change")

$("#locStateIdVe").on("change", function () {
    if (+$(this).val() != 0) {
        $("#locCityIdVe").html("");
        fill_select2(`${viewData_baseUrl_GN}/LocCityApi/getdropdown`, "locCityIdVe", true, +$(this).val());
    }

    if (($('#locStateIdVe :selected').length == 0) || ($('#locStateIdVe :selected').val() == 0)) {
        $('#locCityIdVe').val('0').prop('disabled', true).prop('required', false).trigger("change");
       
    }
    else
        $('#locCityIdVe').prop('disabled', false).prop("required", true).trigger("change");
    
});
$("#locStateIdVe").trigger("change")

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$("#partnerTypeIdVe").on("change", function () {

    $("#vendorGroupIdVe").prop("selectedIndex", 0).trigger("change");
    $("#industryIdVe").prop("selectedIndex", 0).trigger("change");

    $("#personTitleIdVe").html("<option value=\"0\">انتخاب کنید</option>");

    fill_select2(`/api/GNApi/personTitle_GetDropDown`, "personTitleIdVe", true, +$(this).val() == 0 ? 1 : +$(this).val());
    $("#personTitleIdVe").prop("selectedIndex", 0).trigger("change");

    $("#agentFullNameVe").val("");
    $("#brandNameVe").val("");

    $("#isActiveVe").prop("checked", true).trigger("change");

    if ($(this).val() == "1") {
        $(".indiv").removeClass("displaynone");

        $("#firstNameVe").attr("required", "");
        $("#firstNameVe").val("");

        $("#partnerNameVe").text(" تخلص");
        $("#lastNameVe").val("");

        $("#genderIdVe").attr("required", "");
        $("#genderIdVe").prop("selectedIndex", 0).trigger("change");

        $(($("#nationalCodeVe").parent().parent().children())[0]).text("نمبر تذکره");
        $("#nationalCodeVe").attr("maxlength", 10);
        $("#nationalCodeVe").attr("data-parsley-nationalcode" , "");
        $("#nationalCodeVe").val("");

        $(($("#idDatePersianVe").parent().parent().children())[0]).text("تاریخ تولد");
        $("#idDatePersianVe").val("");

        $(($("#idNumberVe").parent().parent().children())[0]).text("شماره شناسنامه");
        $("#idNumberVe").parent().parent().addClass("displaynone");

        $("#jobTitleVeContainer").removeClass("displaynone");
        $("#jobTitleVe").val("");

        $("#taxCodeVe").parents(".form-group").first().addClass("displaynone");
        $("#taxCodeVe").val("")
    }
    else {

        $(".indiv").addClass("displaynone");
       
        $("#firstNameVe").removeAttr("required");
        $("#firstNameVe").val("");

        $("#partnerNameVe").text("نام شرکت");
        $("#lastNameVe").val("");

        $("#genderIdVe").removeAttr("required");

        $(($("#nationalCodeVe").parent().parent().children())[0]).text("شناسه ملی");
        $("#nationalCodeVe").attr("maxlength", 11);
        $("#nationalCodeVe").removeAttr("data-parsley-nationalcode");
        $("#nationalCodeVe").val("");

        $(($("#idDatePersianVe").parent().parent().children())[0]).text("تاریخ ثبت");
        $("#idDatePersianVe").val("");

        $(($("#idNumberVe").parent().parent().children())[0]).text("شماره ثبت");
        $("#idNumberVe").parent().parent().removeClass("displaynone");
        $("#idNumberVe").val("");        

        $("#jobTitleVeContainer").addClass("displaynone");

        $("#taxCodeVe").parents(".form-group").first().removeClass("displaynone");
        $("#taxCodeVe").val("");
    }
});

$("#vatIncludeVe").change(function () {
    if ($(this).prop("checked")) {
        $("#vatAreaIdVe").attr("required", true).prop("disabled", false);
        $("#vatAreaIdVe").attr("data-parsley-selectvalzero", true).val(0).trigger("change");
        $("#vatEnableVe").prop("disabled", false).prop("checked", false).trigger("change");;
    }
    else {
        $("#vatAreaIdVe").removeAttr("required").prop("disabled", true);
        $("#vatAreaIdVe").removeAttr("data-parsley-selectvalzero").val(0).trigger("change");
        $("#vatEnableVe").removeAttr("required").prop("disabled", true).prop("checked", false).trigger("change");;
    }
})


$("#insurerIdVe").on("change", function () {
    if (+$(this).val() != 0) {

        $("#insuranceNoVe").val('').prop('disabled', false);
        $("#insuranceNoVe").prop('required', true);
        $("#insuranceNoVe").attr("data-parsley-existinsuranceno", true);
    }

    else {
        $('#insuranceNoVe').val('').prop('disabled', true);
        $("#insuranceNoVe").removeAttr('required');
        $("#insuranceNoVe").removeAttr("data-parsley-existinsuranceno");
    }

});
$("#insurerIdVe").trigger("change");


window.Parsley._validatorRegistry.validators.existinsuranceno = undefined
window.Parsley.addValidator("existinsuranceno", {
    validateString: function (value) {

        var insurerId = +$("#insurerIdVe").val();
        if (value == "" || value == "0" && insurerId > 0)
            return false;

        return true;
    },
    messages: {
        en: 'شماره بیمه معتبر نمی باشد'
    }
});

$("#AddEditModalVe").on("shown.bs.modal", function () {
    
    if (modal_open_state == 'Edit') {
        $("#partnerTypeIdSh").prop('disabled', true);
        $("#partnerTypeIdSh").prop("required", false);

        $('#insuranceNoVe').prop('disabled', false);
        $('#vendorGroupIdVe').focus();
        if ($("#vatIncludeVe").prop("checked")) {
            $("#vatAreaIdVe").attr("required", true).prop("disabled", false).attr("data-parsley-selectvalzero", true);
            $("#vatEnableVe").prop("disabled", false);
        }
        else {
            $("#vatAreaIdVe").removeAttr("required").prop("disabled", true).removeAttr("data-parsley-selectvalzero");
            $("#vatEnableVe").removeAttr("required").prop("disabled", true);
        }
    }
    else {
        $("#partnerTypeIdSh").prop('disabled', false);
        $("#partnerTypeIdSh").prop("required", true);
        $("#partnerTypeIdSh").val("1").trigger("change");
        $('#partnerTypeIdVe').focus();
       
        $('#insuranceNoVe').prop('disabled', true);

        $("#isActiveVe").prop("checked", "checked");
        funkyradio_onchange($("#isActiveVe"));

        $("#vatIncludeVe").trigger("change");
        $("#locCountryIdVe").val("").trigger("change")
        $("#locStateIdVe").val("").prop("disabled", true).trigger("change")
        $("#locCityIdVe").val("").prop("disabled", true).trigger("change")
    }
    $("#firstTab").click();
   
});

$("#locCountryIdVe").val(0);
$("#locStateIdVe").val(0);
$("#locCityIdVe").val(0);
$("#vatAreaIdVe").val(0);
$("#AddEditModalVe select").trigger("change");

modal_default_name = "AddEditModalVe";
$("#readyforadd").on("click", function () {
    modal_ready_for_add("AddEditModalVe");
});

window.Parsley._validatorRegistry.validators.existnationalcode = undefined;
window.Parsley.addValidator("existnationalcode", {
    validateString: function (value) {
        if (+value !== 0)
            return Funcexistnationalcode(+$("#modal_keyid_value").text(), value);

        return true;
    },
    messages: {
        en: 'نمبر تذکره قبلا ثبت شده است'
    }
});

function Funcexistnationalcode(id, code) {

    var model = { id: id, name: code }
    var output = $.ajax({
        url: viewData_check_nationalcode_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(model),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_check_nationalcode_url);
            return JSON.parse(false);
        }
    });
    return output.responseJSON;
}

function modal_record_update(modal_name = null, pageVersion) {
   
    if (modal_name == null)
        modal_name = modal_default_name;
    var form = $(`#${modal_name} div.modal-body`).parsley();
    
    if (flgCheckvalidateVendor) {
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

    if (pageVersion != "pagetable") {
        let index = arr_pagetables.findIndex(v => v.pagetable_id == "pagetable");
        arr_pagetables[index].pageNo = 0;
    }

    
    recordInsertUpdate(viewData_updrecord_url, newModel, modal_name, msg_row_edited, undefined, get_NewPageTableV1);
}

function checkVendorInput() {
    if (modal_open_state == "Edit")
        flgCheckvalidateVendor = true;
}
