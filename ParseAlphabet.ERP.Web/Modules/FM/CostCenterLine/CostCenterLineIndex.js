var viewData_form_title = `${$("#costCenterId").val()} - ${$("#costCenterName").val()}`;
var viewData_controllername = "CostCenterLineApi";


var displayFormKeyValue = true;
var viewData_getpagetable1_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getcostcenterlinediassign`,
    viewData_getpagetable2_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getcostcenterlineassign`,
    viewData_filter_url1 = `${viewData_baseUrl_FM}/${viewData_controllername}/getfilteritems`,
    viewData_filter_url2 = `${viewData_baseUrl_FM}/${viewData_controllername}/getfilteritems2`,
    viewData_assign_api_url = `${viewData_baseUrl_FM}/${viewData_controllername}/costcenterlineassign`,
    viewData_diassign_api_url = `${viewData_baseUrl_FM}/${viewData_controllername}/costcenterlinediassign`,
    viewData_csv_url = `${viewData_baseUrl_FM}/${viewData_controllername}/csv`;



$("#form_keyvalue").addClass("d-none");
$("#head-title").removeClass("col-md-2 form-group mb-0");
$("#head-info").removeClass("col-md-6");
$("#head-info").addClass("col-md-12");
$("#formplate2HeaderInfo").attr("data-parsley-validate", "");

$("#head-info").append(`<div class='row' style='margin-left: 5px'>                           
                            <div class= 'col-md-3 form-group' >
                                <select id='itemTypeId' type='text'  class='form-control select2'  required data-parsley-selectvalzero  tabindex='2'  data-parsley-errors-container="#itemTypeIdError"> 
                                </select>
                                <div id="itemTypeIdError"></div>
                            </div>
                            <div class='col-md-3 form-group'>
                                <select id='stageId' type='text' class='form-control select2'   required   data-parsley-selectvalzero  disabled tabindex='3' data-parsley-errors-container="#stageIdError">
                                    <option>انتخاب کنید</option></select>
                                <div id="stageIdError"></div>
                            </div>
                            <div class='col-md-3 form-group'>
                                <select id='costRelationId' type='text' class='form-control select2'   required  disabled  data-parsley-selectvalzero  tabindex='4' data-parsley-errors-container="#costRelationIdError">
                                    <option>انتخاب کنید</option></select>
                                <div id="costRelationIdError"></div>
                            </div>                           
                           <div class='col-md-2 form-group'>
                              <div>
                                <input type="text" id="allocationPercentage"   class="form-control number" disabled data-parsley-min="1" data-parsley-max="100"  maxlength="3"  tabindex="5" placeholder="درصد"required  />
                              </div>
                           </div>
                        </div>`);



$("#form_keyvalue").on("change", function () {
  
    fill_select2("/api/WHApi/itemTypeIsItem_getDropDown", "itemTypeId", true, 0, false, 0,"انتخاب نوع آیتم..."); 
    $("#itemTypeId").val($("#itemTypeId option:first")).select2('focus');
});
$("#itemTypeId").on("change", function () {
    $("#allocationPercentage").val('');
    var itemType = $("#itemTypeId").val();

    $("#costRelationId").prop("disabled", false);
    $("#stageId").prop("disabled", false);
    $("#allocationPercentage").prop("disabled", false);

    $("#costRelationId").empty();

    fill_select2(`${viewData_baseUrl_FM}/CostOfGoodsTemplateLineApi/getcostrelationdropdown`, "costRelationId", true, `1/${+itemType}`, false, 0, "انتخاب موضوع/نوع (هزینه)...");

    fill_select2(`${viewData_baseUrl_WF}/StageApi/getalldropdown`, "stageId", true,0, false, 0, "انتخاب  مرحله...");

});

$("#stageId").on("change", function () {

    bind_model();
});

//insert costCenter line

function backToList_overrided() {
    navigation_item_click('/FM/CostCenter', 'مراکز هزینه');
}

function assign_ins() {
    modelAssing = {
        headerId: +$("#costCenterId").val(),
        costRelationId: +$("#costRelationId").val(),
        stageId: +$("#stageId").val(),
        allocationPercentage: +$("#allocationPercentage").val(),
    }
    var form = $("#formplate2HeaderInfo").parsley();
    var validate = form.validate();
    validateSelect2(form);
    if (!validate) return;

    ins_del_assign(viewData_assign_api_url, "Ins", modelAssing, insert_assign_validate)
}

//delete costCenter line

function assign_del() {
    
    var index = arr_pagetables2.findIndex(v => v.pagetable_id == 'pagetable2');
    var pagetable_currentrow = arr_pagetables2[index].currentrow;
    let costRelationId = $(`#pagetable2 .pagetablebody > tbody > #row${pagetable_currentrow}`).data("costrelationid");
    let stageId = $(`#pagetable2 .pagetablebody > tbody > #row${pagetable_currentrow}`).data("stageid");
    let allocationPercentage = $(`#pagetable2 .pagetablebody > tbody > #row${pagetable_currentrow}`).data("allocationpercentage");
    modelAssing = {
        headerId: +$("#costCenterId").val(),
        costRelationId: +costRelationId,
        stageId: +stageId,
        allocationPercentage: +allocationPercentage,
    }
    ins_del_assign(viewData_diassign_api_url, "Del", modelAssing, delete_assign_validate)
}


function bind_model() {
    var formKeyValue = [];
    formKeyValue.push(+$("#costCenterId").val());
    formKeyValue.push(+$("#itemTypeId").val());
    formKeyValue.push(+$("#stageId").val());
    var modelBind2 = {
        arrFormkeyValue: formKeyValue,
        url1_Pagetable: viewData_getpagetable1_url,
        url2_Pagetable: viewData_getpagetable2_url,
        url_Filter1: viewData_filter_url1,
        url_Filter2: viewData_filter_url2
    };

    bind_formPlate2(modelBind2);
};

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

function assigned_excel() {

    var check = controller_check_authorize("CostCenterLineApi", "PRN");
    if (!check)
        return;
    
    let index = arr_pagetables2.findIndex(v => v.pagetable_id == "pagetable2");
    var csvModel = {
        FieldItem: $(`#${pagetable_id} .btnfilter`).attr("data-id"),
        FieldValue: arr_pagetables2[index].filtervalue,
        Form_KeyValue: [
            +$("#costCenterId").val(),
            +$("#costRelationId").val(),
            +$("#stageId").val(),
            +$("#allocationPercentage").val()
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
    



