var viewData_insrecord_url_cu = `${viewData_baseUrl_SM}/CustomerApi/insert`;
var viewData_controllername = "CustomerApi";
var viewData_check_nationalCode_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getnationalcode`;
var flgCheckvalidateCustomer = false;

fill_select2(`${viewData_baseUrl_SM}/CustomerGroupApi/getdropdown`, "personGroupIdCu", true, 1);
fill_select2(`${viewData_baseUrl_GN}/IndustryGroupApi/getdropdownbytype`, "industryIdCu", false, true);

fill_select2("/api/GN/LocCountryApi/getdropdown", "locCountryIdCu", true);
fill_select2("/api/GN/LocStateApi/getdropdown", "locStateIdCu", true);
fill_dropdown("/api/FM/BankApi/getdropdown", "id", "name", "bankIdCu");
fill_dropdown(`/api/FMApi/vatArea_getdropdown`, "id", "name", "vatAreaIdCu", true);
fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getlistbytypeid`, "insurerIdCu", true, "1/false/1/false");

$("#idDateCu").inputmask();
$("#idDatePersianCu").inputmask();

window.Parsley._validatorRegistry.validators.existnationalcode = undefined;

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


function checkExistNationalCode(nationalCode, id) {
    var model = { id: id, name: nationalCode }
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



//////////////////////////////////////////////////////////////////////////////////////////////////////
$("#locCountryIdCu").on("change", function () {
    if (+$(this).val() != 0) {
        $("#locStateIdCu").html('');
        fill_select2("/api/GN/LocStateApi/getdropdown", "locStateIdCu", true);
    }

    if (($('#locCountryIdCu :selected').length == 0) || ($('#locCountryIdCu :selected').val() != 101)) {
        $('#locStateIdCu').val('0').prop('disabled', true).prop('required', false).trigger("change");
    }
    else {
        $('#locStateIdCu').prop('disabled', false).prop("required", true).trigger("change");
    }
});

$("#locStateIdCu").on("change", function () {
    if (+$(this).val() != 0) {
        $("#locCityIdCu").html('');
        fill_select2(`${viewData_baseUrl_GN}/LocCityApi/getdropdown`, "locCityIdCu", true, +$(this).val());
    }

    if (($('#locStateIdCu :selected').length == 0) || ($('#locStateIdCu :selected').val() == 0)) {
        $('#locCityIdCu').val('0').prop('disabled', true).prop('required', false).trigger("change");
    }
    else {
        $('#locCityIdCu').prop('disabled', false).prop("required", true).trigger("change");
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////

$("#vatIncludeCu").change(function () {
    if ($(this).prop("checked")) {
        $("#vatAreaIdCu").attr("required", true).prop("disabled", false);
        $("#vatAreaIdCu").attr("data-parsley-selectvalzero", true).val(0).trigger("change");
        $("#vatEnableCu").attr("required", true).prop("disabled", false).prop("checked", false).trigger("change");
    }
    else {
        $("#vatAreaIdCu").removeAttr("required").prop("disabled", true);
        $("#vatAreaIdCu").removeAttr("data-parsley-selectvalzero").val(0).trigger("change");
        $("#vatEnableCu").removeAttr("required").prop("disabled", true).prop("checked", false).trigger("change");
    }
})

$("#partnerTypeIdCu").on("change", function () {

    $("#personGroupIdCu").prop("selectedIndex", 0).trigger("change");
    $("#industryIdCu").prop("selectedIndex", 0).trigger("change");

    $("#personTitleIdCu").html("<option value=\"0\">انتخاب کنید</option>");
    fill_select2(`/api/GNApi/personTitle_GetDropDown`, "personTitleIdCu", true, +$(this).val());
    $("#personTitleIdCu").prop("selectedIndex", 0).trigger("change");

    $("#agentFullNameCu").val("");
    $("#brandNameCu").val("");

    $("#isActiveCu").prop("checked", true).trigger("change");

    if ($(this).val() === "1") {

        $(".comp").addClass("displaynone");
        $(".indiv").removeClass("displaynone");

        $("#firstNameCu").attr("required");
        $("#firstNameCu").val("");

        $("#partnerNameCu").text(" تخلص");
        $("#lastNameCu").val("");

        $("#genderIdCu").attr("required");
        $("#genderIdCu").prop("selectedIndex", 0).trigger("change");


        $(($("#nationalCodeCu").parent().parent().children())[0]).text("نمبر تذکره");
        $("#nationalCodeCu").attr("maxlength", 10);
        $("#nationalCodeCu").attr("data-parsley-nationalcode", "");
        $("#nationalCodeCu").val("");


        $(($("#idDatePersianCu").parent().parent().children())[0]).text("تاریخ تولد");
        $("#idDatePersianCu").val("");

        $(($("#idNumberCu").parent().parent().children())[0]).text("تذکره کاغذی");
        $("#idNumberCu").parent().parent().addClass("displaynone");

       
        
        $("#jobTitleContainerCu").removeClass("displaynone");
        $("#jobTitleCu").val("");
               
        $("#taxCodeCu").val("");
    }
    else {

        $(".indiv").addClass("displaynone");
        $(".comp").removeClass("displaynone");
        $("#firstNameCu").removeAttr("required");

        $("#partnerNameCu").text("نام شرکت");
        $("#lastNameCu").val("");

        $("#genderIdCu").removeAttr("required");

        $(($("#nationalCodeCu").parent().parent().children())[0]).text("شناسه ملی");
        $("#nationalCodeCu").attr("maxlength", 11);
        $("#nationalCodeCu").removeAttr("data-parsley-nationalcode");
        $("#nationalCodeCu").val("");

        $(($("#idDatePersianCu").parent().parent().children())[0]).text("تاریخ");
        $("#idDatePersianCu").val("");

        $(($("#idNumberCu").parent().parent().children())[0]).text("شماره ثبت");
        $("#idNumberCu").parent().parent().removeClass("displaynone");
        $("#idNumberCu").val("");
       
        $("#jobTitleContainerCu").addClass("displaynone");

        $("#taxCodeCu").val("");

    }
});

$("#insurerIdCu").on("change", function () {
    if (+$(this).val() != 0) {

        $("#insuranceNoCu").val('').prop('disabled', false);
        $("#insuranceNoCu").prop('required', true);
        $("#insuranceNoCu").attr("data-parsley-existinsuranceno", true);
    }

    else {
        $('#insuranceNoCu').val('').prop('disabled', true);
        $("#insuranceNoCu").removeAttr('required');
        $("#insuranceNoCu").removeAttr("data-parsley-existinsuranceno");
    }

});
$("#insurerIdCu").trigger("change");


window.Parsley._validatorRegistry.validators.existinsuranceno = undefined
window.Parsley.addValidator("existinsuranceno", {
    validateString: function (value) {
        var insurerId = +$("#insurerIdCu").val();
        if (value == "" || value == "0" && insurerId > 0)
            return false;

        return true;
    },
    messages: {
        en: 'شماره بیمه معتبر نمی باشد'
    }
});

$(".modal").on("shown.bs.modal", function () {
    if (modal_open_state == 'Add') {
        $('#insuranceNoCu').prop('disabled', true);
        $("#partnerTypeIdCu").focus();
        $("#partnerTypeIdCu").val("1").trigger("change");

        $("#isActiveCu").prop("checked", "checked");
        funkyradio_onchange($("#isActiveCu"));
        $("#vatIncludeCu").trigger("change");
        $("#locCountryIdCu").val("").trigger("change");
        $("#locStateIdCu").val("").prop("disabled", true).trigger("change");
        $("#locCityIdCu").val("").prop("disabled", true).trigger("change");
        $('#insuranceNoCu').prop('disabled', true);
    }
    else {
        $('#insuranceNoCu').prop('disabled', false);
        $("#personGroupIdCu").focus();

    }
    $("#firstTab").click();
});

$("select").val(0);
$("#partnerTypeIdCu").val(1);
$("#genderIdCu").val(1);
$("#AddEditModalCu select").trigger("change");

modal_default_name = "AddEditModalCu";
$("#readyforadd").on("click", function () {
    modal_ready_for_add("AddEditModalCu");
});


function modal_record_update(modal_name = null, pageVersion) {
    if (modal_name == null)
        modal_name = modal_default_name;
    var form = $(`#${modal_name} div.modal-body`).parsley();


    if (flgCheckvalidateCustomer) {

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

function checkCustomerInput() {

    if (modal_open_state == "Edit")
        flgCheckvalidateCustomer = true;
}
