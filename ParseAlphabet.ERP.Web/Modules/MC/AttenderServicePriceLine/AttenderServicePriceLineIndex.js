
var viewData_form_title = `${$("#attenderId").val()} - ${$("#userFullName").val()}`,
    viewData_controllername = "AttenderServicePriceLineApi",
    viewData_getPageTableDiAssign_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getpagediassign`,
    viewData_getPageTableAssign_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getpageassign`,
    viewData_filterItemDiAssign_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getfilterdiassign`,
    viewData_filterItemAssign_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getfilterassign`,
    viewData_assign_api_url = `${viewData_baseUrl_MC}/${viewData_controllername}/insert`,
    viewData_diassign_api_url = `${viewData_baseUrl_MC}/${viewData_controllername}/delete`,
    viewData_csv_url = `${viewData_baseUrl_MC}/${viewData_controllername}/csv`;


function init() {

   
    $("#form_keyvalue").addClass("d-none");

    $("#head-title").append(`<span class="float-right">تخصیص کمیسون داکتران</span>`);

    fill_select2(`${viewData_baseUrl_MC}/AttenderMarginBracketApi/getmarginbracketdropdown`, "bracket", true, `1`);

    bind_model();

}

function assign_ins() {

    let bracket = $("#bracket").val()

    if (!checkResponse(bracket) || bracket == 0) {
        var msgItem = alertify.warning("کمیسون داکتران را وارد کنید")
        msgItem.delay(alertify_delay);
        $("#bracket").select2("focus")
        return
    }

    modelAssing = {
        attenderId: +$("#attenderId").val(),
        attenderMarginBracketId: $("#bracket").val(),
    }

    ins_del_assign(viewData_assign_api_url, "Ins", modelAssing, insert_assign_validate)
}

function assign_del() {


    modelAssing = {
        attenderId: +$("#attenderId").val(),
        attenderMarginBracketId: 0/*$("#bracket").val()*/
    }

    ins_del_assign(viewData_diassign_api_url, "Del", modelAssing, delete_assign_validate)
}

function assigned_excel() {

    let index = arr_pagetables2.findIndex(v => v.pagetable_id == "pagetable2");

    var csvModel = {
        FieldItem: $(`#pagetable2 .btnfilter`).attr("data-id"),
        FieldValue: arr_pagetables2[index].filtervalue,
        Form_KeyValue: [
            +$("#attenderId").val(),
        ],
        pageno: null,
        pagerowscount: null
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

function backToList() {
    navigation_item_click('/MC/AttenderServicePrice', 'حق  حق الزحمه طبابین')
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

    var modelBind2 = {
        arrFormkeyValue: [+$("#attenderId").val()],
        url1_Pagetable: viewData_getPageTableDiAssign_url,
        url2_Pagetable: viewData_getPageTableAssign_url,
        url_Filter1: viewData_filterItemDiAssign_url,
        url_Filter2: viewData_filterItemAssign_url,
        pageTableId1: "pagetable1",
        pageTableId2: "pagetable2"
    };

    bind_formPlate2(modelBind2);
}

init()
