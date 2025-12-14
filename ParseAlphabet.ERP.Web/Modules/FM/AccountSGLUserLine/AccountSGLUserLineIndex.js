var viewData_form_title = `${$("#id").val()} - ${$("#userFullName").val()}`;

var viewData_controllername = "AccountSGLUserLineApi";

var viewData_getPageTableDiAssign_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getPageDiAssign`,
    viewData_getPageTableAssign_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getPageAssign`,
    viewData_filterItemDiAssign_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getfilterusersdiassign`,
    viewData_filterItemAssign_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getfilterusersassign`,

    viewData_assign_api_url = `${viewData_baseUrl_FM}/${viewData_controllername}/insert`,
    viewData_diassign_api_url = `${viewData_baseUrl_FM}/${viewData_controllername}/delete`,
    viewData_csv_url = `${viewData_baseUrl_FM}/${viewData_controllername}/csv`;

$("#form_keyvalue").addClass("d-none");
$("#head-title").append(`<span class="float-right">دسترسی کدینگ حسابداری</span>`);


function assign_ins() {
    modelAssing = {
        UserId: +$("#id").val(),
    }
    ins_del_assign(viewData_assign_api_url, "Ins", modelAssing, insert_assign_validate)
}

function assign_del() {
    modelAssing = {
        UserId: +$("#id").val(),
    }
    ins_del_assign(viewData_diassign_api_url, "Del", modelAssing, delete_assign_validate)

}

function assigned_excel() {

    var check = controller_check_authorize("AccountSGLUserApi", "PRN");
    if (!check)
        return;

    let index = arr_pagetables2.findIndex(v => v.pagetable_id == "pagetable2");

    var csvModel = {
        FieldItem: $(`#${pagetable_id} .btnfilter`).attr("data-id"),
        FieldValue: arr_pagetables2[index].filtervalue,
        Form_KeyValue: [
            +$("#id").val(),
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
    navigation_item_click('/FM/AccountSGLUser', 'تخصیص کاربران به کدینگ حسابداری')
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
    var formKeyValue = [];
    formKeyValue.push(+$("#id").val());

    var modelBind2 = {
        arrFormkeyValue: formKeyValue,
        url1_Pagetable: viewData_getPageTableDiAssign_url,
        url2_Pagetable: viewData_getPageTableAssign_url,
        url_Filter1: viewData_filterItemDiAssign_url,
        url_Filter2: viewData_filterItemAssign_url
    };
    bind_formPlate2(modelBind2);
}

bind_model();


