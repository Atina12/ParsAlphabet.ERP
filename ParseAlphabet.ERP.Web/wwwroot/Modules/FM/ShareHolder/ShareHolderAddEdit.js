
var viewData_insrecord_url_ve = `${viewData_baseUrl_FM}/ShareHolderApi/insert`;
var viewData_check_nationalcode_url = `${viewData_baseUrl_FM}/ShareHolderApi/getnationalcode`;
fill_select2("/api/GN/LocCountryApi/getdropdown", "locCountryIdSh", true);
fill_select2("/api/GN/LocStateApi/getdropdown", "locStateIdSh", true);
fill_select2(`${viewData_baseUrl_GN}/IndustryGroupApi/getdropdownbytype`, "industryIdSh", true, true);
fill_dropdown("/api/FM/BankApi/getdropdown", "id", "name", "bankId");
fill_select2(`/api/FMApi/vatArea_getdropdown`, "vatAreaIdSh", true);

fill_select2(`${viewData_baseUrl_FM}/ShareHolderGroupApi/getdropdown`, "shareHolderGroupIdSh", true, 1);
fill_select2(`/api/GNApi/personTitle_GetDropDown`, "personTitleIdSh", true, 1);
var flgCheckvalidateShareHolder = false;

$("#idDatePersianSh").inputmask();
$("#idDate").inputmask();

$("#locCountryIdSh").on("change", function () {
    if (+$(this).val() != 0) {
        $("#locStateIdSh").html("");
        fill_select2("/api/GN/LocStateApi/getdropdown", "locStateIdSh", true);
    }

    if (($('#locCountryIdSh :selected').length == 0) || ($('#locCountryIdSh :selected').val() != 101)) {
        $('#locStateIdSh').val('0').prop('disabled', true).prop('required', false).trigger("change");
    }
    else {
        $('#locStateIdSh').prop('disabled', false).prop("required", true).trigger("change");
    }
});
$("#locCountryIdSh").trigger("change")

$("#locStateIdSh").on("change", function () {
    if (+$(this).val() != 0) {
        $("#locCityIdSh").html("");
        fill_select2(`${viewData_baseUrl_GN}/LocCityApi/getdropdown`, "locCityIdSh", true, +$(this).val());
    }

    if (($('#locStateIdSh :selected').length == 0) || ($('#locStateIdSh :selected').val() == 0)) {
        $('#locCityIdSh').attr('disabled', 'disabled');
        $("#locCityIdSh").prop("required", false);
        $("#locCityIdSh").val('0').trigger('change');
    }
    else {
        $('#locCityIdSh').removeAttr('disabled');
    }
});

$("#partnerTypeIdSh").on("change", function () {

    $("#personTitleIdSh").html("<option value=\"0\">انتخاب کنید</option>");
    fill_select2(`/api/GNApi/personTitle_GetDropDown`, "personTitleIdSh", true, +$(this).val());
    $("#personTitleIdSh").prop("selectedIndex", 0).trigger("change");

    $("#shareHolderGroupIdSh").prop("selectedIndex", 0).trigger("change");
    $("#industryIdSh").prop("selectedIndex", 0).trigger("change");

    $("#agentFullNameSh").val("");
    $("#brandNameSh").val("");



    $("#isActiveSh").prop("checked", true).trigger("change");

    if ($(this).val() == "1") {

        $(".indiv").removeClass("displaynone");

        $("#firstNameSh").attr("required", "");
        $("#firstNameSh").val("")

        $("#partnerNameSh").text(" تخلص");
        $("#lastNameSh").val("");


        $("#genderIdSh").attr("required", "");
        $("#genderIdSh").prop("selectedIndex", 0).trigger("change");

        $(($("#nationalCodeSh").parent().parent().children())[0]).text("نمبر تذکره");
        $("#nationalCodeSh").attr("maxlength", 10);
        $("#nationalCodeSh").attr("data-parsley-nationalcode" , "");
        $("#nationalCodeSh").val("");

        $(($("#idDatePersianSh").parent().parent().children())[0]).text("تاریخ تولد");
        $("#idDatePersianSh").val("");

        $("#idNumberSh").parent().parent().addClass("displaynone");

        $("#jobTitleShContainer").removeClass("displaynone");
        $("#jobTitleSh").val("");

        $("#taxCodeSh").parents(".form-group").first().addClass("displaynone");
        $("#taxCodeSh").val("")

    }
    else {


        $(".indiv").addClass("displaynone");
        $("#firstNameSh").val("");
        $("#firstNameSh").removeAttr("required");

        $("#partnerNameSh").text("نام شرکت");
        $("#lastNameSh").val("");



        $("#genderIdSh").removeAttr("required");

        $(($("#nationalCodeSh").parent().parent().children())[0]).text("شناسه ملی");
        $("#nationalCodeSh").attr("maxlength", 11);
        $("#nationalCodeSh").removeAttr("data-parsley-nationalcode");
        $("#nationalCodeSh").val("");

        $(($("#idDatePersianSh").parent().parent().children())[0]).text("تاریخ ثبت");
        $("#idDatePersianSh").val("");

        $(($("#idNumberSh").parent().parent().children())[0]).text("شماره ثبت");
        $("#idNumberSh").parent().parent().removeClass("displaynone");
        $("#idNumberSh").val("");

        $("#jobTitleShContainer").addClass("displaynone");


        $("#taxCodeSh").parents(".form-group").first().removeClass("displaynone");
        $("#taxCodeSh").val("")


    }
});

$("#vatIncludeSh").change(function () {
    if ($(this).prop("checked")) {
        $("#vatAreaIdSh").attr("required", true).prop("disabled", false);
        $("#vatAreaIdSh").attr("data-parsley-selectvalzero", true).val(0).trigger("change");
        $("#vatEnableSh").attr("required", true).prop("disabled", false).prop("checked", false).trigger("change");;
    }
    else {
        $("#vatAreaIdSh").removeAttr("required").prop("disabled", true);
        $("#vatAreaIdSh").removeAttr("data-parsley-selectvalzero").val(0).trigger("change");
        $("#vatEnableSh").removeAttr("required").prop("disabled", true).prop("checked", false).trigger("change");;
    }
})

$("#AddEditModalSh").on("shown.bs.modal", function () {
    if (modal_open_state == 'Edit') {
        $("#partnerTypeIdSh").prop('disabled', true);
        $("#partnerTypeIdSh").prop("required", false);
        $('#shareHolderGroupIdSh').focus();
        if ($("#vatIncludeSh").prop("checked")) {
            $("#vatAreaIdSh").attr("required", true).prop("disabled", false).attr("data-parsley-selectvalzero", true);
            $("#vatEnableSh").attr("required", true).prop("disabled", false);
        }
        else {
            $("#vatAreaIdSh").removeAttr("required").prop("disabled", true).removeAttr("data-parsley-selectvalzero");
            $("#vatEnableSh").removeAttr("required").prop("disabled", true);
        }
    }
    else {
        $("#partnerTypeIdSh").prop('disabled', false);
        $("#partnerTypeIdSh").prop("required", true);
        $("#partnerTypeIdSh").val("1").trigger("change");
        $('#partnerTypeIdSh').focus();
        $("#isActiveSh").prop("checked", "checked");
        funkyradio_onchange($("#isActiveSh"));
        $("#vatIncludeSh").trigger("change");
    }
    $("#firstTab").click();
});


$("#locCountryIdSh").val(0);
$("#locStateIdSh").val(0);
$("#locCityIdSh").val(0);
$("#vatAreaIdSh").val(0);
$("select").trigger("change");

modal_default_name = "AddEditModalSh";
$("#readyforadd").on("click", function () {
    modal_ready_for_add("AddEditModalSh");
});


window.Parsley._validatorRegistry.validators.existnationalcode = undefined
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
    if (flgCheckvalidateShareHolder) {
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

function checkShareHolderInput(ev) {
    if (modal_open_state == "Edit")
        flgCheckvalidateShareHolder = true;
}