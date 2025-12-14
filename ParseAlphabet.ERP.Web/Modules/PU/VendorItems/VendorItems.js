var viewData_form_title = "سطرهای تخصیص آیتم به ذینفعان";
var viewData_modal_title = "سطرهای تخصیص آیتم به ذینفعان";
var tabNo = 1;
var viewData_controllername = "VendorItemsApi";

var viewData_getPageTableDiAssign_url = `${viewData_baseUrl_PU}/${viewData_controllername}/getPageDiAssign`,
    viewData_getPageTableAssign_url = `${viewData_baseUrl_PU}/${viewData_controllername}/getPageAssign`,
    viewData_filterItemDiAssign_url = `${viewData_baseUrl_PU}/${viewData_controllername}/getfilteritemsdiassign`,
    viewData_filterItemAssign_url = `${viewData_baseUrl_PU}/${viewData_controllername}/getfilteritemsassign`,

    viewData_assign_api_url = `${viewData_baseUrl_PU}/${viewData_controllername}/insert`,
    viewData_diassign_api_url = `${viewData_baseUrl_PU}/${viewData_controllername}/delete`,
    viewData_get_itemType = `${viewData_baseUrl_WH}Api/itemTypeIsItem_getDropDown`,
    viewData_get_Vendor = `${viewData_baseUrl_PU}/VendorApi/getdropdown`;

$(".tab-content").show();
tabLazyLoad("vendor");

$(".relationalbox").remove();

function get_modelAssign() {

    var formKeyValueId = "", identityId = "";
    var noSeriesId = 0;
    switch (tabNo) {
        case 1:
            formKeyValueId = "form_keyvalue1";
            identityId = "vendorId";
            personGroupTypeId = 1;
            noSeriesId = 102;
            break;
        case 2:
            formKeyValueId = "form_keyvalue2";
            identityId = "customerId";
            personGroupTypeId = 2;
            noSeriesId = 103;
            break;

        case 3:
            formKeyValueId = "form_keyvalue3";
            identityId = "employeeId";
            personGroupTypeId = 3;
            noSeriesId = 104;
            break;



    }
    var modelAssing = {
        ItemTypeId: $(`#${formKeyValueId}`).val(),
        IdentityId: $(`#${identityId}`).val(),
        PersonGroupTypeId: +personGroupTypeId,
        NoSeriesId: +noSeriesId
    }

    return modelAssing;
}

function assign_ins() {

    ins_del_assign(viewData_assign_api_url, "Ins", get_modelAssign(), insert_assign_validate)
}

function assign_del() {

    ins_del_assign(viewData_diassign_api_url, "Del", get_modelAssign(), delete_assign_validate)

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

function bind_model(pageTableId_1, pageTableId_2, formKeyValueId, identityId, noSeriesId) {
    var formKeyValue = [];
    formKeyValue.push(+$(`#${formKeyValueId}`).val());
    formKeyValue.push(+$(`#${identityId}`).val());
    formKeyValue.push(noSeriesId);

    var modelBind2 = {
        pageTableId1: pageTableId_1,
        pageTableId2: pageTableId_2,
        arrFormkeyValue: formKeyValue,
        NoSeriesId: noSeriesId,
        url1_Pagetable: viewData_getPageTableDiAssign_url,
        url2_Pagetable: viewData_getPageTableAssign_url,
        url_Filter1: viewData_filterItemDiAssign_url,
        url_Filter2: viewData_filterItemAssign_url
    };
    bind_formPlate2(modelBind2, after_bind_formPlate2);
}

$("#form_keyvalue1").on("change", function () {
    bind_model("vendorPageTableDiAssign", "vendorPageTableAssign", "form_keyvalue1", "vendorId", 102);
});

$("#form_keyvalue2").on("change", function () {
    bind_model("customerPageTableDiAssign", "customerPageTableAssign", "form_keyvalue2", "customerId", 103);
});

$("#form_keyvalue3").on("change", function () {
    bind_model("employeePageTableDiAssign", "employeePageTableAssign", "form_keyvalue3", "employeeId", 104);
});

function after_bind_formPlate2() {
    var pageTableNameDiAssign = "";
    var pageTableNameAssign = "";
    var itemTypeElemId = "";
    switch (tabNo) {
        case 1:
            itemTypeElemId = "form_keyvalue1";
            pageTableNameDiAssign = "vendorPageTableDiAssign";
            pageTableNameAssign = "vendorPageTableAssign";
            break;
        case 2:
            itemTypeElemId = "form_keyvalue2";
            pageTableNameDiAssign = "customerPageTableDiAssign";
            pageTableNameAssign = "customerPageTableAssign";
            break;

        case 3:
            itemTypeElemId = "form_keyvalue3";
            pageTableNameDiAssign = "employeePageTableDiAssign";
            pageTableNameAssign = "employeePageTableAssign";
            break;
    }

    var itemTypeId = +$(`#${itemTypeElemId}`).val();

    $(`#${pageTableNameDiAssign} #filter_categoryDiAssign`).data("api", `/api/WH/ItemCategoryApi/getalldatadropdownbytype/${itemTypeId}`);
    $(`#${pageTableNameAssign} #filter_categoryAssign`).data("api", `/api/WH/ItemCategoryApi/getalldatadropdownbytype/${itemTypeId}`);
}

$("#vendorId").on("change", function () {
    bind_model("vendorPageTableDiAssign", "vendorPageTableAssign", "form_keyvalue1", "vendorId", 102);
});

$("#customerId").on("change", function () {
    bind_model("customerPageTableDiAssign", "customerPageTableAssign", "form_keyvalue2", "customerId", 103);
});

$("#employeeId").on("change", function () {
    bind_model("employeePageTableDiAssign", "employeePageTableAssign", "form_keyvalue3", "employeeId", 104);
});


var focusInput = (tab_no, pageTableName) => {

    tabNo = tab_no;
    let firstInput = $(`.tabToggle${tabNo}`).find("[tabindex]:not(:disabled)").first();
    setTimeout(() => {
        $(firstInput).hasClass("select2") ? $(`#${firstInput.attr("id")}`).select2('focus') : firstInput.focus();
    }, 10);

    tabLazyLoad(pageTableName);
};

function refresh_assignListCount_func(count) {

    switch (tabNo) {
        case 1:
            $("#vendor #assign-list-count").html("تعداد انتخاب شده: " + count);
            break;
        case 2:
            $("#customer #assign-list-count").html("تعداد انتخاب شده: " + count);
            break;
        case 3:
            $("#employee #assign-list-count").html("تعداد انتخاب شده: " + count);
            break;

    }
}

function refresh_diAssignListCount_func(count) {

    switch (tabNo) {
        case 1:
            $("#vendor #deassign-list-count").html("تعداد انتخاب شده: " + count);
            break;
        case 2:
            $("#customer #deassign-list-count").html("تعداد انتخاب شده: " + count);
            break;
        case 3:
            $("#employee #deassign-list-count").html("تعداد انتخاب شده: " + count);
            break;

    }
}

function tabLazyLoad(pageTableName) {

    switch (pageTableName) {
        case 'vendor':
            $("#vendor #deassign-list-count").html("تعداد انتخاب شده: 0");
            $("#vendor #assign-list-count").html("تعداد انتخاب شده: 0");

            $("#vendorId").empty();
            $("#form_keyvalue1").empty();
            getModuleListByNoSeriesIdUrl(102, "vendorId");
            fill_select2(viewData_get_itemType, "form_keyvalue1", true, 0, false);

            setTimeout(function () {
                $('#vendorId').val($('#vendorId option:eq(0)').val()).trigger('change.select2');
                $('#form_keyvalue1').val($('#form_keyvalue1 option:eq(0)').val()).trigger('change');
            }, 100);

            break;
        case 'customer':
            $("#customer #deassign-list-count").html("تعداد انتخاب شده: 0");
            $("#customer #assign-list-count").html("تعداد انتخاب شده: 0");

            $("#customerId").empty();
            $("#form_keyvalue2").empty();
            getModuleListByNoSeriesIdUrl(103, "customerId");
            fill_select2(viewData_get_itemType, "form_keyvalue2", true, 0, false);

            setTimeout(function () {
                $('#customerId').val($('#customerId option:eq(0)').val()).trigger('change.select2');
                $('#form_keyvalue2').val($('#form_keyvalue2 option:eq(0)').val()).trigger('change');
            }, 100);

            break;
        case 'employee':
            $("#employee #deassign-list-count").html("تعداد انتخاب شده: 0");
            $("#employee #assign-list-count").html("تعداد انتخاب شده: 0");

            $("#employeeId").empty();
            $("#form_keyvalue3").empty();
            getModuleListByNoSeriesIdUrl(104, "employeeId");
            fill_select2(viewData_get_itemType, "form_keyvalue3", true, 0, false);

            setTimeout(function () {
                $('#employeeId').val($('#employeeId option:eq(0)').val()).trigger('change.select2');
                $('#form_keyvalue3').val($('#form_keyvalue3 option:eq(0)').val()).trigger('change');
            }, 100);

            break;


    }
}