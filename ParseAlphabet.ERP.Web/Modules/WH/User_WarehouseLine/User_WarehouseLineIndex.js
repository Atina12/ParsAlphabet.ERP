var viewData_form_title = `${$("#warehouseId").val()} - ${$("#warehouseName").val()}`;

var viewData_controllername = "User_WarehouseLineApi";

var viewData_getPageTableDiAssign_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getPageDiAssign`,
    viewData_getPageTableAssign_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getPageAssign`,
    viewData_filterItemDiAssign_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getfilterusersdiassign`,
    viewData_filterItemAssign_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getfilterusersassign`,

    viewData_assign_api_url = `${viewData_baseUrl_WH}/${viewData_controllername}/insert`,
    viewData_diassign_api_url = `${viewData_baseUrl_WH}/${viewData_controllername}/delete`,
    viewData_csv_url = `${viewData_baseUrl_WH}/${viewData_controllername}/csv`;

$("#form_keyvalue").addClass("d-none");
$("#head-title").removeClass("col-md-2 form-group mb-0");
$("#head-info").removeClass("col-md-6");
$("#head-info").addClass("col-md-12");
$("#formplate2HeaderInfo").attr("data-parsley-validate", "");


$("#head-info").append(`<div class='row' style='margin-left: 5px'>                           
                            <div class= 'col-md-3 form-group' >
                                <label>بخش</label>
                                <select id='zoneId' type='text' class='form-control select2'  required data-parsley-selectvalzero  tabindex='2'  data-parsley-errors-container="#zoneIdError"> 
                                     <option value="0">انتخاب کنید</option></select>
                                <div id="zoneIdError"></div>
                            </div>
                            <div class='col-md-3 form-group'>
                                <label>پالت</label>
                                <select id='binId' type='text' class='form-control select2'  required data-parsley-selectvalzero  tabindex='3' data-parsley-errors-container="#binIdError">
                                    <option value="0">انتخاب کنید</option></select>
                                <div id="binIdError"></div>
                            </div>
                        </div>`);

function fillZone() {
    let warehouseId = +$("#warehouseId").val();
    $("#zoneId").html("<option value=\"0\">انتخاب کنید</option>");
    fill_select2(`/api/WH/ZoneApi/getdropdownbywarehouse`, "zoneId", true, warehouseId, false, 3, "انتخاب بخش...");
}

function fillBin() {

    let warehouseId = +$("#warehouseId").val();
    let zoneId = +$("#zoneId").val();
    if (zoneId > 0) {
        $("#binId").html("<option value=\"0\">انتخاب کنید</option>");
        fill_select2(`/api/WH/WBinApi/getdropdownbywarehouse`, "binId", true, `${warehouseId}/${zoneId}`, false, 3, "انتخاب پالت...");
    }

}


$("#form_keyvalue").on("change", function () {
    fillZone();
    fillBin();
    bind_model();
});

$("#zoneId").on("change", function () {
    $('#binId').empty();
    fillBin();
    bind_model();
});

$("#binId").on("change", function () {
    bind_model();
});

function assign_ins() {

    modelAssing = {
        WarehouseId: $("#warehouseId").val(),
        ZoneId: $("#zoneId").val(),
        BinId: $("#binId").val()
    }
    var form = $("#formplate2HeaderInfo").parsley();
    var validate = form.validate();
    validateSelect2(form);
    if (!validate) return;
    ins_del_assign(viewData_assign_api_url, "Ins", modelAssing, insert_assign_validate)
}

function assign_del() {

    var index = arr_pagetables2.findIndex(v => v.pagetable_id == 'pagetable2');
    var pagetable_currentrow = arr_pagetables2[index].currentrow;
    let zoneId = $("#zoneId").val();
    let binId = $("#binId").val();

    modelAssing = {
        WarehouseId: $("#warehouseId").val(),
        ZoneId: zoneId,
        BinId: binId
    }
    ins_del_assign(viewData_diassign_api_url, "Del", modelAssing, delete_assign_validate)

}

function assigned_excel() {

    var check = controller_check_authorize("User_WarehouseApi", "PRN");
    if (!check)
        return;

    let index = arr_pagetables2.findIndex(v => v.pagetable_id == "pagetable2");

    var csvModel = {
        FieldItem: $(`#${pagetable_id} .btnfilter`).attr("data-id"),
        FieldValue: arr_pagetables2[index].filtervalue,
        Form_KeyValue: [
            +$("#warehouseId").val(),
            +$("#zoneId").val(),
            +$("#binId").val()
        ]
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
        },
        error: function (xhr) {
            error_handler(xhr, viewData_csv_url);
        }
    });
}

function backToList_overrided() {
    navigation_item_click('/WH/User_Warehouse', 'تخصیص کاربران به انبار')
}

function insert_assign_validate() {
    var result = {
        successfull: true
    }
    return result;
}

function delete_assign_validate() {
    var result = {
        successfull: true
    }
    return result;
}

function bind_model() {

    //if (+$("#zoneId").val() == 0 || +$("#binId").val() == 0) {
    //    $("#pagetable1 .pagetablebody tbody").html('<tr id="emptyRow" tabindex="-1"><td colspan="4" style="text-align:center">سطری وجود ندارد</td></tr>');
    //    $("#pagetable2 .pagetablebody tbody").html('<tr id="emptyRow" tabindex="-1"><td colspan="6" style="text-align:center">سطری وجود ندارد</td></tr>');

    //    return;
    //}


    var formKeyValue = [];
    formKeyValue.push(+$("#warehouseId").val());
    formKeyValue.push(+$("#zoneId").val());
    formKeyValue.push(+$("#binId").val());
    var modelBind2 = {
        arrFormkeyValue: formKeyValue,
        NoSeriesId: 0,
        url1_Pagetable: viewData_getPageTableDiAssign_url,
        url2_Pagetable: viewData_getPageTableAssign_url,
        url_Filter1: viewData_filterItemDiAssign_url,
        url_Filter2: viewData_filterItemAssign_url
    };
    bind_formPlate2(modelBind2, after_bind_formPlate2);
}

function after_bind_formPlate2() {
    $("#filter_itemTypeDiAssign").data("api", 'api/WF/StageFundItemTypeApi/stagefunditemtype_getdropdown/null/11');
    $("#filter_itemTypeAssign").data("api", 'api/WF/StageFundItemTypeApi/stagefunditemtype_getdropdown/null/11');
}

$("#warehouseId").on("change", function () {
    $("#segment_line_ins").prop("disabled", false);
    $("#segment_line_del").prop("disabled", false);

    bind_model()
});

