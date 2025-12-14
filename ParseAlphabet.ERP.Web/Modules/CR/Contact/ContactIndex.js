var viewData_form_title = "اشخاص";
var viewData_controllername = "ContactApi";
var viewData_getrecord_url = `${viewData_baseUrl_CR}/${viewData_controllername}/getrecordbyid`;
var viewData_getpagetable_url = `${viewData_baseUrl_CR}/${viewData_controllername}/getpage`;
var viewData_deleterecord_url = `${viewData_baseUrl_CR}/${viewData_controllername}/delete`;
var viewData_insrecord_url = `${viewData_baseUrl_CR}/${viewData_controllername}/insert`;
var viewData_updrecord_url = `${viewData_baseUrl_CR}/${viewData_controllername}/update`;
var viewData_filter_url = `${viewData_baseUrl_CR}/${viewData_controllername}/getfilteritems`;
var viewData_get_user_bynationalCode_url = `${viewData_baseUrl_GN}/UserApi/getrecordbynationalcode`;
var viewData_print_file_url = `${stimulsBaseUrl.CR.Prn}Contact.mrt`;
var viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 }
var viewData_print_tableName = "";
var viewData_csv_url = `${viewData_baseUrl_CR}/${viewData_controllername}/csv`;
var flgCheckvalidateContact = false;



function initContactIndex() {
    get_NewPageTableV1()
    $("#idDate").inputmask();
    $(`#idDatePersian`).inputmask();
    kamaDatepicker('idDatePersian', { withTime: false, position: "bottom" });

    loadDropdownContactIndex()
}

function loadDropdownContactIndex() {
    fill_select2("/api/GN/LocCountryApi/getdropdown", "locCountryId", true);
    fill_select2("/api/GN/LocStateApi/getdropdown", "locStateId", true);
    fill_dropdown("/api/GNApi/IndustryGroup_GetDropDown", "id", "name", "industryId");
    fill_dropdown(`/api/FMApi/vatArea_getdropdown`, "id", "name", "vatAreaId", true);
    fill_select2(`/api/GNApi/personTitle_GetDropDown`, "personTitleId", true, 1);
    fill_select2(`${viewData_baseUrl_CR}/ContactGroupApi/getdropdown`, "personGroupId", true, 1);
}

function Funcexistnationalcode(id, code) {

    var viewData_check_nationalcode_url = `${viewData_baseUrl_CR}/ContactApi/getnationalcode`;

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
    if (flgCheckvalidateContact) {
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

function checkContactInput(ev) {
    if (modal_open_state == "Edit")
        flgCheckvalidateContact = true;
}

function run_button_accountDetail(id, rowNo, elm) {

    addAccountDetail(id, "cr.Contact", viewData_getrecord_url, "id", "fullName", "isActive", "", get_NewPageTableV1);
}

$("#locCountryId").on("change", function () {

    if (+$(this).val() != 0) {
        $("#locStateId").html("");
        fill_select2("/api/GN/LocStateApi/getdropdown", "locStateId", true);
    }

    if (($('#locCountryId :selected').length == 0) || ($('#locCountryId :selected').val() != 101)) {
        $('#locStateId').val('0').prop('disabled', true).prop('required', false).trigger("change");
    }
    else {
        $('#locStateId').prop('disabled', false).prop("required", true).trigger("change");
    }
})

$("#locStateId").on("change", function () {
    if (+$(this).val() != 0) {
        $("#locCityId").html("");
        fill_select2(`${viewData_baseUrl_GN}/LocCityApi/getdropdown`, "locCityId", true, +$(this).val());
    }

    if (($('#locStateId :selected').length == 0) || ($('#locStateId :selected').val() == 0)) {
        $('#locCityId').attr('disabled', 'disabled').prop('required', false);
        $("#locCityId").val('0').trigger('change');
    }
    else {
        $('#locCityId').removeAttr('disabled').prop('required', true);
    }
});

$("#partnerTypeId").on("change", function () {

    $("#personTitleId").html("<option value=\"0\">انتخاب کنید</option>");
    fill_select2(`/api/GNApi/personTitle_GetDropDown`, "personTitleId", true, +$(this).val());
    $("#personTitleId").prop("selectedIndex", 0).trigger("change");
    $("#locCountryId").val("101").trigger("change")
    $("#agentFullName").val("");
    $("#brandName").val("");

    $("#isActive").prop("checked", true).trigger("change");
    if ($(this).val() === "1") {
        modal_clear_items("AddEditModal", $(this).attr("id"));
        $(".comp").addClass("displaynone");
        $(".indiv").removeClass("displaynone");

        $("#firstName").attr("required");
        $("#firstName").val("");


        $("#partnerName").text(" تخلص");
        $("#lastName").val("");

        $("#idNumber").parent().parent().addClass("displaynone");

        $("#jobTitleContainer").removeClass("displaynone");

        $("#genderId").attr("required");

        $(($("#nationalCode").parent().parent().children())[0]).text("نمبر تذکره");
        $("#nationalCode").attr("maxlength", 10);
        $("#nationalCode").attr("data-parsley-nationalcode", "");

        $("#taxCode").parents(".form-group").first().addClass("displaynone");
        $("#taxCode").val("")

        $(($("#idDate").parent().parent().children())[0]).text("تاریخ تولد");




    }
    else {
        modal_clear_items("AddEditModal", $(this).attr("id"));
        $(".indiv").addClass("displaynone");
        $(".comp").removeClass("displaynone");

        $("#firstName").removeAttr("required");
        $("#firstName").val("");

        $("#partnerName").text("نام شرکت");
        $("#lastName").val("");

        $(($("#idNumber").parent().parent().children())[0]).text("شماره ثبت");
        $("#idNumber").parent().parent().removeClass("displaynone");

        $("#jobTitleContainer").addClass("displaynone");

        $("#genderId").removeAttr("required");

        $(($("#nationalCode").parent().parent().children())[0]).text("شناسه ملی");
        $("#nationalCode").attr("maxlength", 11);
        $("#nationalCode").removeAttr("data-parsley-nationalcode");

        $("#taxCode").parents(".form-group").first().removeClass("displaynone");
        $("#taxCode").val("");

        $(($("#idDate").parent().parent().children())[0]).text("تاریخ ثبت");


    }
});

$(".modal").on("shown.bs.modal", function () {

    if (modal_open_state == 'Add') {
    }
    else
        if (modal_open_state == 'Edit') {
            flgCheckvalidateContact = true;
            $("#personGroupId").focus();
        }
});

$("#AddEditModal").on("shown.bs.modal", function () {
    setDefaultActiveCheckbox($("#isActive"));
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

initContactIndex()



