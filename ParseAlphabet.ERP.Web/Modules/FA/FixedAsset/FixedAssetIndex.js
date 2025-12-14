var viewData_form_title = "دارایی ثابت";
var viewData_controllername = "FixedAssetApi";
var viewData_getrecord_url = `${viewData_baseUrl_FA}/${viewData_controllername}/getrecordbyid`;
var viewData_getpagetable_url = `${viewData_baseUrl_FA}/${viewData_controllername}/getpage`;
var viewData_deleterecord_url = `${viewData_baseUrl_FA}/${viewData_controllername}/delete`;
var viewData_insrecord_url = `${viewData_baseUrl_FA}/${viewData_controllername}/insert`;
var viewData_updrecord_url = `${viewData_baseUrl_FA}/${viewData_controllername}/update`;
var viewData_filter_url = `${viewData_baseUrl_FA}/${viewData_controllername}/getfilteritems`;
var viewData_print_file_url = `${stimulsBaseUrl.FA.Prn}FixedAsset.mrt`;
var viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 }
var viewData_print_tableName = "";
var viewData_csv_url = `${viewData_baseUrl_FA}/${viewData_controllername}/csv`;


function initFixedAssetIndex() {
    $("#depreciationStartDatePersian").inputmask();
    $("#depreciationEndDatePersian").inputmask();
    get_NewPageTableV1();
    loadDropdown()
}

function loadDropdown() {
    fill_select2(`${viewData_baseUrl_WH}/ItemUnitApi/getdropdown`, "unitId", true, 0);
    fill_dropdown(`/api/FAApi/classIdgetdropdown`, "id", "name", "fixedAssetClassId", true);
    fill_dropdown(`/api/FAApi/depreciationMethodgetdropdown`, "id", "name", "depreciationMethodId", true);

}

$("#fixedAssetClassId").on("change", function () {
    if (+$(this).val() != 0) {
        $("#fixedAssetSubClassId").html("");
        fill_select2(`${viewData_baseUrl_FA}/FixedAssetSubClassApi/subclassidgetdropdown`, "fixedAssetSubClassId", true, +$(this).val());
    }

    if (($('#fixedAssetClassId :selected').length == 0) || ($('#fixedAssetClassId :selected').val() == 0)) {
        $('#fixedAssetSubClassId').attr('disabled', 'disabled');
        $("#fixedAssetSubClassId").val('0').trigger('change');
    }
    else {
        $('#fixedAssetSubClassId').removeAttr('disabled');
    }
});

$("#mainAssetComponent").on("change", function () {   
    if ($(this).val() == "1") {
        $(".fixed").addClass("displaynone");
        $("#fixedAssetId").html("");
    }
    else if ($(this).val() == "2") {
        $(".fixed").removeClass("displaynone");
        fill_select2(`${viewData_baseUrl_FA}/FixedAssetApi/getDropDownByType`, "fixedAssetId", true, +$(this).val());
    }
});

$("#AddEditModal").on("shown.bs.modal", function () {
    if (modal_open_state == 'Edit') {
        $("#mainAssetComponent").prop("disabled", true);
        $("#name").focus();
    }
    else {
        $("#mainAssetComponent").prop("disabled", false);
        $("#mainAssetComponent").val("1").trigger("change");
        $("#depreciationPeriodType").val("1").trigger("change");
        $("#mainAssetComponent").focus();
    }
});

$("#vatEnable").on('change', function () {
    if ($(this).prop("checked") == true) {
        $("#vatId").prop("disabled", false);
        $("#vatId").attr("required");
    }
    else {
        $("#vatId").prop('disabled', true);
        $("#vatId").removeAttr("required");
        $("#vatId").val('').trigger('change');
    }
});

$("#AddEditModal").on("shown.bs.modal", function () {
    setDefaultActiveCheckbox($("#isActive"));
});

initFixedAssetIndex()

