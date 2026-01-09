var viewData_form_title = "نقش";
var viewData_controllername = "RoleApi";
var viewData_getrecord_url = `${viewData_baseUrl_GN}/${viewData_controllername}/getrecordbyid`;
var viewData_getpagetable_url = `${viewData_baseUrl_GN}/${viewData_controllername}/getpage`;
var viewData_deleterecord_url = `${viewData_baseUrl_GN}/${viewData_controllername}/delete`;
var viewData_insrecord_url = `${viewData_baseUrl_GN}/${viewData_controllername}/insert`;
var viewData_updrecord_url = `${viewData_baseUrl_GN}/${viewData_controllername}/update`;
var viewData_filter_url = `${viewData_baseUrl_GN}/${viewData_controllername}/getfilteritems`;
var viewData_print_file_url = `${stimulsBaseUrl.GN.Prn}Role.mrt`;
var viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 }
var viewData_print_tableName = "";
isSecondLang = true;
var viewData_csv_url = `${viewData_baseUrl_GN}/${viewData_controllername}/csv`;




function roleWorkflow_init() {
    $("#stimul_preview")[0].onclick = null;
    get_NewPageTableV1();

    fill_select2(`/api/WFApi/WorkflowCategory_getdropdown`, "workflowCategoryId", true);
    fill_select2(`${viewData_baseUrl_GN}/BranchApi/getdropdown`, "branchId", true);
    $("#workflowCategoryId").prop("selectedIndex", 0).trigger("change");
    $("#branchId").prop("selectedIndex", 0).trigger("change");
}

$("#checkAll").click(function () {
    $("#treeview").hummingbird("checkAll");
});

$("#uncheckAll").click(function () {
    $("#treeview").hummingbird("uncheckAll");
});

$("#collapseAll").click(function () {
    $("#treeview").hummingbird("collapseAll");
});

$("#expandAll").click(function () {
    $("#treeview").hummingbird("expandAll");
});

$("#AddEditModal").on("shown.bs.modal", function () {
    setDefaultActiveCheckbox($("#isActive"));
});

$('#modal-authen-save').on("click", function () {
    save_authen(true);
});

$("#stimul_preview").click(function () {
    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;


    if ($("#userType").prop("checked"))
        userId = getUserId();
    else
        userId = null;

    var reportParameters = [
        { Item: "PageNo", Value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "PageRowsCount", value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "name", value: null, SqlDbType: dbtype.VarChar, Size: 0 },
    ]

    stimul_report(reportParameters);
});

function run_button_authen(p_keyvalue) {
    //$("#AuthenModal").modal({ "backdrop": "static" });

    modal_show('AuthenModal');
    $("#modal1_keyid_value").text(p_keyvalue);
    $("#modal1_keyid_caption").text("شناسه : ");
    loaderOnPageTable(true, "AuthenModal .modal-content")
    setTimeout(() => {
        get_authenitems(p_keyvalue);
    },500)
}

function run_button_workflowAuthen(p_keyvalue) {
    roleWorkflowPermission_init(p_keyvalue);
    modal_show("roleWorkflowPermissionModal");
}

function run_button_roleBrancPermission(p_keyvalue) {
    roleBranchPermission_init(p_keyvalue);
    modal_show("roleBranchPermissionModal");
}

function run_button_roleFiscalYearPermission(p_keyvalue) {
    roleFiscalYearPermission_init(p_keyvalue);
    modal_show("roleFiscalYearPermissionModal");
}

function get_authenitems(roleid) {
    $("#treeview").html("");
    var newModel = {};
    newModel["roleId"] = roleid;

    let get_authenitemsUrl = '/api/GN/RoleApi/getauthenitems'

    $.ajax({
        url: get_authenitemsUrl,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        async: true,
        cache: false,
        data: JSON.stringify(newModel),
        success: function (result) {
   
            var str = generate_treeview(result.data);
            $("#treeview").append(str);
            $("#treeview").hummingbird();
            $("#treeview").hummingbird("collapseAll");
            fill_treeview_checked(result.data);
            loaderOnPageTable(false, "AuthenModal .modal-content")
        },
        error: function (xhr) {
            error_handler(xhr, get_authenitemsUrl)
            loaderOnPageTable(false, "AuthenModal .modal-content")
        }
    });
}

function generate_treeview(list) {
    if (list == null) return "";
    var str = "";
    for (var i in list) {
        var item = list[i];
        var idname = "";
        var datatype = "";

        if (item.childCount != 0) {
            idname = "node-" + item.id;
            str += '<li>';
            str += '<i class="fa fa-plus"></i>';
            str += '<label><input id="' + idname + '" data-id="" type="checkbox"></label>';
            str += '<span>' + item.title + '</span>';
            str += '<ul style="display: block;">';
            str += generate_treeview(item.children);
            str += "</ul>";
            str += '</li>';
        }
        else {
            idname = "node-" + item.id;
            str += '<li>';
            str += '<i class="fa fa-plus"></i>';
            str += '<label><input id="' + idname + '" data-id="" type="checkbox"></label>';
            str += '<span>' + item.title + '</span>';

            if (item.controllerName != "") {
                str += '<ul style="padding-right: 30px;">';


                datatype = "1";
                idname = "node-" + item.id + "-" + datatype;
                str += '<li>';
                str += '<label><input class="hummingbird-end-node" id="' + idname + '" data-id="' + item.id + '" data-type="' + datatype + '" type="checkbox"></label>';
                str += '<span style="font-weight: 300">لیست</span>';
                str += '</li>';


                if (item.auth_VIWALL != 2) {
                    datatype = "2";
                    idname = "node-" + item.id + "-" + datatype;
                    str += `<li>`;
                    str += '<label><input class="hummingbird-end-node" id="' + idname + '" data-id="' + item.id + '" data-type="' + datatype + '" type="checkbox"></label>';
                    str += '<span style="font-weight: 300">لیست تمام کاربران</span>';
                    str += '</li>';
                }



                datatype = "3";
                idname = "node-" + item.id + "-" + datatype;
                str += '<li>';
                str += '<label><input class="hummingbird-end-node" id="' + idname + '" data-id="' + item.id + '" data-type="' + datatype + '" type="checkbox"></label>';
                str += '<span style="font-weight: 300">نمایش</span>';
                str += '</li>';


                datatype = "4";
                idname = "node-" + item.id + "-" + datatype;
                str += '<li>';
                str += '<label><input class="hummingbird-end-node" id="' + idname + '" data-id="' + item.id + '" data-type="' + datatype + '" type="checkbox"></label>';
                str += '<span style="font-weight: 300">درج</span>';
                str += '</li>';


                datatype = "5";
                idname = "node-" + item.id + "-" + datatype;
                str += '<li>';
                str += '<label><input class="hummingbird-end-node" id="' + idname + '" data-id="' + item.id + '" data-type="' + datatype + '" type="checkbox"></label>';
                str += '<span style="font-weight: 300">ویرایش</span>';
                str += '</li>';

                datatype = "6";
                idname = "node-" + item.id + "-" + datatype;
                str += '<li>';
                str += '<label><input class="hummingbird-end-node" id="' + idname + '" data-id="' + item.id + '" data-type="' + datatype + '" type="checkbox"></label>';
                str += '<span style="font-weight: 300">حذف</span>';
                str += '</li>';

                datatype = "7";
                idname = "node-" + item.id + "-" + datatype;
                str += '<li>';
                str += '<label><input class="hummingbird-end-node" id="' + idname + '" data-id="' + item.id + '" data-type="' + datatype + '" type="checkbox"></label>';
                str += '<span style="font-weight: 300">چاپ</span>';
                str += '</li>';

                datatype = "8";
                idname = "node-" + item.id + "-" + datatype;
                str += '<li>';
                str += '<label><input class="hummingbird-end-node" id="' + idname + '" data-id="' + item.id + '" data-type="' + datatype + '" type="checkbox"></label>';
                str += '<span style="font-weight: 300">فایل</span>';
                str += '</li>';

                str += "</ul>";
            }
            str += '</li>';
        }
    }
    return str;
};

function fill_treeview_checked(list) {
    if (list == null) return "";
    for (var i in list) {
        var item = list[i];
        var idname = "";


        if (item.auth_VIW) {
            idname = "node-" + item.id + "-1";
            $("#treeview").hummingbird("checkNode", { attr: "id", name: idname, expandParents: false });
        }
        if (item.auth_VIWALL == 1 || item.auth_VIWALL == 2) {
            idname = "node-" + item.id + "-2";
            $("#treeview").hummingbird("checkNode", { attr: "id", name: idname, expandParents: false });
        }
        if (item.auth_DIS) {
            idname = "node-" + item.id + "-3";
            $("#treeview").hummingbird("checkNode", { attr: "id", name: idname, expandParents: false });
        }
        if (item.auth_INS) {
            idname = "node-" + item.id + "-4";
            $("#treeview").hummingbird("checkNode", { attr: "id", name: idname, expandParents: false });
        }
        if (item.auth_UPD) {
            idname = "node-" + item.id + "-5";
            $("#treeview").hummingbird("checkNode", { attr: "id", name: idname, expandParents: false });
        }
        if (item.auth_DEL) {
            idname = "node-" + item.id + "-6";
            $("#treeview").hummingbird("checkNode", { attr: "id", name: idname, expandParents: false });
        }
        if (item.auth_PRN) {
            idname = "node-" + item.id + "-7";
            $("#treeview").hummingbird("checkNode", { attr: "id", name: idname, expandParents: false });
        }
        if (item.auth_FIL) {
            idname = "node-" + item.id + "-8";
            $("#treeview").hummingbird("checkNode", { attr: "id", name: idname, expandParents: false });
        }
        if (item.childCount != 0)
            fill_treeview_checked(item.children);
    }
};

function save_authen(close = true) {

    var checkedList = "";

    var roleNavigationList = []

    $("#treeview").find('input:checkbox.hummingbird-end-node:checked').each(function () {
        var elm = $(this);

        if ($(elm).closest("li").css("display") !== "none") {

            var navigationId = elm.attr("data-id");
            var operationTypeId = elm.attr("data-type");


            var roleNavigation = {
                navigationId: navigationId,
                operationTypeId: operationTypeId
            }

            roleNavigationList.push(roleNavigation);

            checkedList += elm.attr("data-id") + ",";
            checkedList += elm.attr("data-type") + ";";

        }
    });

    var roleid = $("#modal1_keyid_value").text();
    var newModel = {
        roleId: roleid,
        itemsList: checkedList,
        roleNavigation: roleNavigationList
    };

    $(`#AuthenModal .modal-footer button:not(#modal-close)`).prop("disabled", true)

    $.ajax({
        url: '/api/GN/RoleApi/setauthenitems',
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        async: false,
        cache: false,
        data: JSON.stringify(newModel),
        success: function (result) {
            setTimeout(() => {
                $(`#AuthenModal .modal-footer button:not(#modal-close)`).prop("disabled", false)
            }, 500)
            var msg = alertify.success(msg_row_edited);

            if (close)
                modal_close('AuthenModal');
            else {
                loaderOnPageTable(true, "AuthenModal .modal-content")
                get_authenitems($("#modal1_keyid_value").text());
            }

        },
        error: function (xhr) {
            setTimeout(() => {
                $(`#AuthenModal .modal-footer button:not(#modal-close)`).prop("disabled", false)
            }, 500)
            error_handler(xhr, '/api/GN/RoleApi/saveauthenitems')
        }
    });


};

roleWorkflow_init()