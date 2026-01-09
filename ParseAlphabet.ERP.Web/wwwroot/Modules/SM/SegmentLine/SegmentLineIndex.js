var viewData_form_title = "سطرهای بخش بندی بازار";
var viewData_modal_title = "سطرهای بخش بندی بازار";


var viewData_controllername = "SegmentLineApi";

var viewData_getpagetable1_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getsegmentlinediassign`,
    viewData_getpagetable2_url = `${viewData_baseUrl_SM}/${viewData_controllername}/getsegmentlineassign`,
    viewData_filter_url1 = `${viewData_baseUrl_SM}/${viewData_controllername}/getfilteritems`,
    viewData_filter_url2 = `${viewData_baseUrl_SM}/${viewData_controllername}/getfilteritems`,
    viewData_assign_api_url = `${viewData_baseUrl_SM}/${viewData_controllername}/segmentlineassign`,
    viewData_diassign_api_url = `${viewData_baseUrl_SM}/${viewData_controllername}/segmentlinediassign`;

fill_dropdown("/api/CRApi/PersonGroupType_GetDropDown", "id", "name", "form_keyvalue");

function backToList_overrided() {
    navigation_item_click('/SM/Segment', 'بخش بندی بازار')
}

function assign_ins() {
    modelAssing = {
        personGroupTypeId: $("#form_keyvalue").val(),
        Id: $("#segmentId").val()
    }
    ins_del_assign(viewData_assign_api_url, "Ins", modelAssing, insert_assign_validate)
}

function assign_del() {
    modelAssing = {
        personGroupTypeId: $("#form_keyvalue").val(),
        Id: $("#segmentId").val()
    }
    ins_del_assign(viewData_diassign_api_url, "Del", modelAssing, delete_assign_validate)

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

$("#form_keyvalue").on("change", function () {
    var entityTypeId = +$(this).val();
    var modelBind2 = {
        publicTypeid: entityTypeId,
        Id: $("#segmentId").val(),
        url1_Pagetable: viewData_getpagetable1_url,
        url2_Pagetable: viewData_getpagetable2_url,
        url_Filter1: viewData_filter_url1,
        url_Filter2: viewData_filter_url2
    };

    bind_formPlate2(modelBind2);
});

function fill_header(data) {
    $("#head-info").load(window.location.origin + "/Modules/SM/SegmentLine/assign_header.cshtml", function () {
        $("#head-info #name").text(data.name);
        $("#head-info #note").text(data.note);
        
        var state = data.isActive == true ? "فعال" : "غیر فعال";
        $("#head-info #state").text(state);
    });
}