var viewData_form_title = "کارتابل درخواست انبار",
    viewData_controllername = "ItemRequestCartableApi",
    viewData_getpagetable_url = `${viewData_baseUrl_WH}/${viewData_controllername}/getpageitemrequestcartable`,
    viewData_getrecord_url = `${viewData_baseUrl_WH}/ItemRequestApi/getrecordbyid`,
    viewData_deleterecord_url = `${viewData_baseUrl_WH}/WarehouseTransactionApi/delete`,
    stageId = 0,
    pageName = null,
    pageTableModel = {};

var stageId_ItemRequestCartable = +$("#stageIdItemRequestParameter").val();

pagetable_formkeyvalue = ["", "", "my", null];


function initItemRequestGroup() {

    var check = controller_check_authorize(viewData_controllername, "VIWALL");

    if (check)
        $("#userType").prop('disabled', false);
    else
        $("#userType").prop('disabled', true);

    $('#userType').bootstrapToggle();

    if ($("#userType").prop("checked")) {
        pagetable_formkeyvalue = [stageId_ItemRequestCartable, "stageId", "my", 0];
    } else {
        pagetable_formkeyvalue = [stageId_ItemRequestCartable, "stageId", "all", 0];
    }

    getItemRequestTab();

    $(document).ready(() => $("#quickSearchContainer")
        .html('<button title="ctrl+m" type="button" onClick="openQuickSearchForm()" class="btn btn-success waves-effect ml-2">جستجوی سریع</button>'));


}

function callBackSearche() {
    return stageId_ItemRequestCartable > 0
}

function getItemRequestTab() {
    var byUser = pagetable_formkeyvalue[2];

    let url = `${viewData_baseUrl_WH}/${viewData_controllername}/itemrequestcartablesection/1/${byUser}`;

    $.ajax({
        url: url,
        type: "get",
        dataType: "json",
        contentType: "application/json",
        data: {},
        async: false,
        success: function (result) {
            handlerPageLoding(result);
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });
}

function handlerPageLoding(result) {
    resetCartable();
    fillTab(result);
    fillLinkTab(result);
}

function resetCartable() {
    $("#tabLinkBoxes").html("");
    $("#tabBoxes").html("");
}

function fillTab(result) {

    let resultLen = result.length,
        outPut = "",
        pagetableString = getPageTableString(),
        saveId = "";

    if (resultLen > 0) {

        for (var i = 0; i < resultLen; i++) {

            outPut = `<div class="tab-pane p-3" data-id="p_${result[i].id}" id="p_${result[i].id}Box" role="tabpanel">
                     <div class="" id="p_${result[i].id}Form" data-parsley-validate>
                          <div class="card-body " id="pagetable_p_${result[i].id}" onkeydown="tableOnKeyDown('pagetable_p_${result[i].id}',event)">${pagetableString}</div>
                     </div>
                 </div>`;


            $(outPut).appendTo("#tabBoxes");
        }


        let index = result.findIndex((item) => item.id === stageId_ItemRequestCartable)
        if (index == -1) {
            $(`#p_${result[0].id}Box`).addClass("active")
            saveId = result[0].id
        }
        else {
            $(`#p_${result[index].id}Box`).addClass("active")
            saveId = result[index].id
        }

        if (resultLen != 0) {
            $("#tabBoxes").addClass("group-box")
            changeTabByClick(`pagetable_p_${saveId}`, saveId);
        }
        else
            $("#tabBoxes").removeClass("group-box")
    }

}

function fillLinkTab(result) {
    let reasultLen = result.length, outPut = "";

    for (var i = 0; i < reasultLen; i++) {
        if (checkResponse(stageId_ItemRequestCartable) && stageId_ItemRequestCartable > 0)
            active = (result[i].id == stageId_ItemRequestCartable ? "active" : "");
        else
            active = (i == 0 ? "active" : "");

        outPut = `<li class="nav-item waves-effect waves-light" id="p_${result[i].id}Item">
                    <a class="nav-link ${active}" data-toggle="tab" onclick="changeTabByClick('pagetable_p_${result[i].id}','${result[i].id}')" data-id="p_${result[i].id}" id="p_${result[i].id}Link" href="#p_${result[i].id}Box" role="tab">
                        <span class="d-md-block"> ${result[i].id} - ${result[i].name}</span>
                    </a>
                </li>`;

        $("#tabLinkBoxes").append(outPut);
    }
}

function changeTabByClick(namePage, id) {

    stageId_ItemRequestCartable = saveIdForTabs = +id;

    let switchUser = ""

    if ($("#userType").prop("checked")) {
        switchUser = "my"
    } else {
        switchUser = "all"
    }


    pagetable_formkeyvalue = [stageId_ItemRequestCartable, "stageId", switchUser, 0];

    pageTableModel = {
        pagetable_id: `pagetable_p_${id}`,
        editable: false,
        pagerowscount: 15,
        pageNo: 0,
        currentpage: 1,
        currentrow: 1,
        currentcol: 0,
        highlightrowid: 0,
        trediting: false,
        pagetablefilter: false,
        endData: false,
        filteritem: "",
        filtervalue: ""
    };

    let index = arr_pagetables.findIndex(v => v.pagetable_id == pageTableModel.pagetable_id);
    if (index == -1) {
        arr_pagetables.push(pageTableModel);
    } else {
        arr_pagetables[index].pagetable_id = `pagetable_p_${id}`
        arr_pagetables[index].editable = false
        arr_pagetables[index].pagerowscount = 15
        arr_pagetables[index].pageNo = 0
        arr_pagetables[index].currentpage = 1
        arr_pagetables[index].currentrow = 1
        arr_pagetables[index].currentcol = 0
        arr_pagetables[index].highlightrowid = 0
        arr_pagetables[index].trediting = false
        arr_pagetables[index].pagetablefilter = false
        arr_pagetables[index].endData = false
        arr_pagetables[index].filteritem = ""
        arr_pagetables[index].filtervalue = ""
    }


    pageName = namePage;
    pageTableModel.pagetable_id = pageName;

    get_NewPageTableV1(pageName);
}

async function run_button_printRequestQuantity(rowId, rowNo, elm) {

    let trElement = $(`#row${rowNo}`)
    let stageQuantity = true;
    let reportTitle = `چاپ تعدادی`;
    let transactionId = trElement.data("id")
    let branch = trElement.data("branch")
    let documentTypeName = ""
    let journalId = 0
    let documentDatePersian = trElement.data("transactiondatepersian")

    printDocumentItemTransactionQuantity(stageQuantity, transactionId, branch, documentTypeName, journalId, reportTitle, documentDatePersian);

}

function tableOnKeyDown(pagetableId, e) {

    if (pagetableId === "pagetable_p_56") {

        if (([KeyCode.key_General_1, KeyCode.key_General_2, KeyCode.key_General_3, KeyCode.key_General_4].indexOf(e.which) == -1) && e.ctrlKey) return;
        switchPrint(e)
    }
}

function filtervalue_onChangeNew(fltvalue, type) {

    let pagetableId = $(fltvalue).closest("div").closest("div.card-body").attr("id"),
        index = arr_pagetables.findIndex(v => v.pagetable_id == pagetableId);
    arr_pagetables[index].filtervalue = $(fltvalue).val();
    if (type === "select2" || type === "select2static") {
        if (+$(fltvalue).val() !== 0)
            get_NewPageTableV1(pagetableId, false, () => callbackAfterFilter(pagetableId));
    }
}

function filtervalue_onkeypressNew(e, fltvalue) {

    if (e.which == 13) {
        if ($(fltvalue).hasClass("text-filter-value") && $(fltvalue).val().length < 3) {
            alertify.error('حداقل سه حرف وارد کنید').delay(alertify_delay);
            return false;
        }

        if (fltvalue == "next") {
            $(e.currentTarget).next().val(e.currentTarget.value).focus();
            return;
        }
        e.preventDefault();

        let pagetableId = $(fltvalue).parents("div.card-body").attr("id");
        let index = arr_pagetables.findIndex(v => v.pagetable_id == pagetableId);
        arr_pagetables[index].filtervalue = $(fltvalue).hasClass("double-input") ? genarateValueFilter($(fltvalue)) : $(fltvalue).val();

        get_NewPageTableV1(pagetableId, false, () => callbackAfterFilter(pagetableId));
    }
}

function pagetable_change_filteritemNew(itemid, title, type, size, pg_name, elmDrop = null) {
    let index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);

    let elm = $(`#${pg_name} .btnfilter`);
    elm.text(title);
    elm.attr("data-id", itemid);
    elm.attr("data-type", type);
    elm.attr("data-size", size);
    arr_pagetables[index].filteritem = itemid;

    let elm_v = $(`#${pg_name} .filtervalue`);
    elm_v.val("");

    if (elmDrop == null) {

        resetFilterInputNew(elm_v.parents(".app-search"), pg_name);
        arr_pagetables[index].filtervalue = "";

        if (itemid.toLowerCase().indexOf("date") >= 0)
            elm_v.inputmask({ "mask": "9999/99/99" }).attr("placeholder", "____/__/__").attr("dir", "ltr");
        else
            elm_v.inputmask("remove").attr("placeholder", "عبارت فیلتر").removeAttr("dir");

    }
    else {
        let type = $(elmDrop).data("input"),
            api = $(elmDrop).data("api"),
            inputMask = $(elmDrop).data("inputmask"),
            filterItems = $(elmDrop).data("filteritems"),
            parentfilterVal = elm_v.parents(".app-search"),
            outPut = "";


        if (!elm_v.hasClass("select2") && !elm_v.hasClass("double-input"))
            elm_v.inputmask("remove").attr("placeholder", "عبارت فیلتر").removeAttr("dir").attr("class", "form-control filtervalue");
        else
            resetFilterInputNew(parentfilterVal, pg_name);


        switch (type) {
            case "text":
                elm_v.addClass("text-filter-value");
                if (checkResponse(inputMask))
                    elm_v.inputmask({ "mask": inputMask });
                break;
            case "number":
            case "money":
            case "decimal":
                elm_v.addClass(type);
                if (checkResponse(inputMask))
                    elm_v.inputmask({ "mask": inputMask });
                break;

            case "strnumber":
                elm_v.addClass("str-number");
                if (checkResponse(inputMask))
                    elm_v.inputmask({ "mask": inputMask });
                break;

            case "persiandate":
                elm_v.inputmask({ "mask": "9999/99/99" }).attr("placeholder", "____/__/__").attr("dir", "ltr");
                break;

            case "doublepersiandate":
                $(parentfilterVal).find(".filtervalue").remove();
                outPut = `
                    <div class="double-input-box">
                        <input type="text" class="form-control filtervalue double-input" onkeypress="filtervalue_onkeypressNew(event, 'next')" oninput="filtervalue_onInputNew(event, this)"   data-inputmask="'mask':'9999/99/99'" placeholder="عبارت فیلتر" autocomplete="off">
                        <input type="text" class="form-control filtervalue double-input" onkeypress="filtervalue_onkeypressNew(event, this)" oninput="filtervalue_onInputNew(event, this)"  data-inputmask="'mask':'9999/99/99'" placeholder="عبارت فیلتر" autocomplete="off">
                            <a onclick="filtervalue_onsearchclickNew(this)"><i class="fa fa-search"></i></a>
                    <div>`;

                $(parentfilterVal).html(outPut);
                $(`#${pg_name} .filtervalue`).inputmask();
                $(`#${pg_name} .filtervalue.double-input:eq(0)`).focus();
                break;

            case "select2":
                $(parentfilterVal).find(".filtervalue").remove();
                outPut = `<select id="filterValueSelect2" class="form-control select2 filtervalue" onChange="filtervalue_onChangeNew(this,'select2')"></select>`;
                $(parentfilterVal).html(outPut);
                fill_select2(api, `${pg_name} #filterValueSelect2`, true, 0, false, 0, "انتخاب کنید",
                    () => {
                        $(`#${pg_name} #filterValueSelect2`).select2();
                    }
                );

                break;

            case "select2static":

                $(parentfilterVal).find(".filtervalue").remove();
                outPut = `<select id="filterValueSelect2" class="form-control select2 filtervalue" onChange="filtervalue_onChangeNew(this,'select2static')">`;
                if (filterItems != null) {
                    for (let i = 0; i < filterItems.length; i++) {
                        outPut += `<option value="${filterItems[i].id}">${filterItems[i].text}</option>`;
                    }
                }
                outPut += `</select>`;
                $(parentfilterVal).html(outPut);
                $(`#${pg_name} #filterValueSelect2`).select2()
                $(`#${pg_name} #filterValueSelect2`).val(-1).trigger('change')
                break;

            default:
                break;
        }
    }

    if (itemid === "filter-non") {
        resetFilterInputNew(elm_v.parents(".app-search"), pg_name);
        get_NewPageTableV1(pageName);
    }
    else {
        $(`#${pg_name} .btnOpenFilter`).addClass('d-none');
        $(`#${pg_name} .btnRemoveFilter`).removeClass('d-none');
        elm_v.focus();
    }
}

function getPageTableString() {

    let output =
        $.ajax({
            url: `PB/Public/newpagetablev1`,
            type: "get",
            datatype: "html",
            contentType: "application/html; charset=utf-8",
            async: false,
            cache: false,
            dataType: "html",
            success: function (result) {
                return result;
            },
            error: function (xhr) {
                error_handler(xhr, `PB/Public/newpagetablev1`);
            }
        }), strReturn = "";

    strReturn = output.responseText

    return strReturn;
}

function changeAll(elem, pageId) {
    var index = arr_pagetables.findIndex(v => v.pagetable_id == pageId);
    var selectedItems = arr_pagetables[index].selectedItems == undefined ? [] : arr_pagetables[index].selectedItems;

    var validCount = 0;
    var primaryCount = 0;

    if ($(elem).prop("checked") == true) {


        $(`#${pageId} tbody`).find("input[type='checkbox']").prop("checked", true);

        var rowsCount = +$(`#${pageId} .pagetablebody > tbody > tr`).length;
        for (var i = 1; i <= rowsCount; i++) {
            var primaryData = $(`#${pageId} .pagetablebody > tbody > #row${i}`).data();
            var item = "{ ";
            $.each(primaryData, function (k, v) {
                item += `"${k}": "${v}",`;
            })
            item += "}";
            item = item.replace(",}", "}");

            var itemRes = JSON.parse(item);

            $.each(selectedItems, function (k, v) {
                $.each(v, function (key, val) {
                    primaryCount += 1;
                    if (itemRes[key].toString() == val.toString())
                        validCount += 1;
                })
                if (validCount == primaryCount) {
                    selectedItems = jQuery.grep(selectedItems, function (value) {
                        return value != v;
                    });
                }
                primaryCount = 0;
                validCount = 0;
            })

            selectedItems.push(itemRes);
        }
    }
    else {

        $(`#${pageId} tbody`).find("input[type='checkbox']").prop("checked", false);

        var rowsCount = +$(`#${pageId} .pagetablebody > tbody > tr`).length;
        for (var i = 1; i <= rowsCount; i++) {
            var primaryData = $(`#${pageId} .pagetablebody > tbody > #row${i}`).data();
            var item = "{ ";
            $.each(primaryData, function (k, v) {
                item += `"${k}": "${v}",`;
            })
            item += "}";
            item = item.replace(",}", "}");

            var itemRes = JSON.parse(item);

            $.each(selectedItems, function (k, v) {
                $.each(v, function (key, val) {
                    primaryCount += 1;
                    if (itemRes[key].toString() == val.toString())
                        validCount += 1;
                })
                if (validCount == primaryCount) {
                    selectedItems = jQuery.grep(selectedItems, function (value) {
                        return value != v;
                    });
                }
                primaryCount = 0;
                validCount = 0;
            })
        }
    }

    arr_pagetables[index].selectedItems = selectedItems;

}

function run_button_displaySimple(id, rowNo, elm) {

    var check = controller_check_authorize("ItemRequestApi", "VIW");
    if (!check)
        return;

    var stageId = +$(elm).parents("tr").first().data("stageid");
    var workflowId = +$(elm).parents("tr").first().data("workflowid");
    navigateToModalItemRequest(`/WH/ItemRequestLine/display/${id}/1/${stageId}/${workflowId}`);

}

function navigateToModalItemRequest(href) {
    initialPage();
    $("#contentdisplayItemRequestLine #content-page").addClass("displaynone");
    $("#contentdisplayItemRequestLine #loader").removeClass("displaynone");
    if ($("#userType").prop("checked"))
        lastpagetable_formkeyvalue = ["my", 0];
    else
        lastpagetable_formkeyvalue = ["all", null];
    $.ajax({
        url: href,
        type: "get",
        datatype: "html",
        contentType: "application/html; charset=utf-8",
        async: false,
        cache: false,
        dataType: "html",
        success: function (result) {

            $(`#contentdisplayItemRequestLine`).html(result);
        },
        error: function (xhr) {
            error_handler(xhr, href);
        }
    });
    $("#contentdisplayItemRequestLine #loader,#contentdisplayItemRequestLine #formHeaderLine #header-div .button-items").addClass("displaynone");
    $("#contentdisplayItemRequestLine #content-page").fadeIn().removeClass("displaynone").css("margin", 0);
    $("#contentdisplayItemRequestLine #form,#contentdisplayItemRequestLine .content").css("margin", 0);
    $("#contentdisplayItemRequestLine .itemLink").css("pointer-events", " none");
}

function run_button_editItemRequest(id, rowNo, elem) {

    var check = controller_check_authorize("ItemRequestApi", "UPD");
    if (!check)
        return;

    var isDataEntry = $(`#row${rowNo}`).data("isdataentry");

    if (isDataEntry == false) {
        alertify.error('برگه جاری امکان ویرایش ندارد').delay(alertify_delay);
        return;
    }
    var bySystem = $(`#row${rowNo}`).data("bysystem");
    if (bySystem) {
        var msg = alertify.warning("امکان ویرایش سند سیستمی وجود ندارد");
        msg.delay(alertify_delay);
        return;
    }

    var modal_name = "AddEditModalItemRequest";
    $(".modal").find("#modal_title").text("ویرایش درخواست انبار");


    $("#rowKeyId").removeClass("d-none");
    if (modal_name == null)
        modal_name = modal_default_name;

    $("#modal_keyid_value").text(id);
    $("#modal_keyid_caption").text("شناسه : ");

    $(`#${modal_name} div [hidden-on-edit=true]`).each(function () {
        var elm = $(this);
        elm.addClass("displaynone");
        elm.find("input,select,img").each(function () {
            var subelm = $(this);
            subelm.attr("data-parsley-excluded", "true");
        })
    });

    $(`#${modal_name} div [hidden-on-add=true]`).each(function () {
        var elm = $(this);
        elm.removeClass("displaynone");
        elm.find("input,select,img").each(function () {
            var subelm = $(this);
            subelm.attr("data-parsley-excluded", "false");
        })
    });

    let viewData_getrecord_url = `${viewData_baseUrl_WH}/WarehouseTransactionApi/getrecordbyid`;
    $.ajax({
        url: viewData_getrecord_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        async: false,
        cache: false,
        success: function (response) {

            modal_open_state = 'Edit';
            modal_clear_items(modal_name);
            result = response.data
            if (checkResponse(result)) {
                if (result.isDataEntry == 1 || result.isDataEntry == 2) {
                    fillEditItemRequest(result);
                    modal_show(modal_name);
                }
                else {
                    alertify.error('برگه جاری امکان ویرایش ندارد').delay(alertify_delay);
                    return;
                }
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getrecord_url)
        }
    });


}

function run_button_itemTransactionDetailSimple(lineId, rowNo, elm, ev) {

    var check = controller_check_authorize("ItemRequestApi", "INS");
    if (!check)
        return;

    ev.stopPropagation();
    navigation_item_click(`/WH/ItemRequestLine/${lineId}/1`);
    conditionalProperties.isCartable = true;
}

function run_button_showStepLogsItemRequset(id, rowno, elm, ev) {
    
    ev.stopPropagation();
    activePageTableId = `pagetable_p_${stageId_ItemRequestCartable}`;
    let selectedRowId = `row${rowno}`;
    var currentStageId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("stageid");
    var currentBranchId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("branchid");
    var currentActionId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("actionid");
    var currentWorkFlowId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("workflowid");
    var documentDatePersian = $(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("transactiondatepersian");
    var currentIdentityId = id;
    stageActionLogCurrent = { identityId: currentIdentityId, stageId: currentStageId, branchId: currentBranchId, actionId: currentActionId, workFlowId: currentWorkFlowId, documentDatePersian: documentDatePersian }


    $("#actionItemWarehouse").empty();
    let stageClassIds = "1";
    fill_dropdown(`${viewData_baseUrl_WF}/StageActionApi/getdropdownactionlistbystage`, "id", "name", "actionItemWarehouse", true, `${currentStageId}/${currentWorkFlowId}/1/0/${currentBranchId}/${workflowCategoryIds.warehouse.id}/true/${stageClassIds}`);
    $("#actionItemWarehouse").val(currentActionId).trigger("change");
    stepLogWarehouse(stageActionLogCurrent.identityId, stageActionLogCurrent.stageId, stageActionLogCurrent.workFlowId);
    currentdentityId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("actionid");
    modal_show("stepLogModalWarehouseTransaction");
}

function run_button_deleteItemRequest(p_keyvalue, rowNo) {

    var check = controller_check_authorize(viewData_controllername, "DEL");
    if (!check)
        return;

    var warehouseInfo = getWarehouseTransactionInfo(p_keyvalue);
    warehouseInfo.parentWorkflowCategoryId = workflowCategoryIds.warehouse.id;
    warehouseInfo.stageClass = "1";
    var resultValidate = checkHeaderDeletePermission(warehouseInfo);


    if (resultValidate) {
        return;
    }
    else {
        let viewData_deleterecord_url = `${viewData_baseUrl_WH}/WarehouseTransactionApi/delete`;
        alertify.confirm('', msg_delete_row,
            function () {
                $.ajax({
                    url: viewData_deleterecord_url,
                    type: "post",
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify(p_keyvalue),
                    async: false,
                    cache: false,
                    success: function (result) {
                        if (result.successfull == true) {

                            get_NewPageTableV1();

                            let messages = generateErrorString(result.validationErrors);
                            alertify.success(messages).delay(alertify_delay);
                        }
                        else {
                            let messages = generateErrorString(result.validationErrors);
                            alertify.error(messages).delay(alertify_delay);
                        }
                    },
                    error: function (xhr) {

                        error_handler(xhr, viewData_deleterecord_url)
                    }
                });

            },
            function () { var msg = alertify.error('انصراف از حذف'); msg.delay(alertify_delay); }
        ).set('labels', { ok: 'بله', cancel: 'خیر' });
    }
}

function cartableModalClose(modalName) {

    let switchUser = ""

    if ($("#userType").prop("checked")) {
        switchUser = "my"
    } else {
        switchUser = "all"
    }

    pagetable_formkeyvalue = [stageId_ItemRequestCartable, "stageId", switchUser, 0];

    stageId_ItemRequestCartable = saveIdForTabs;

    if (modalName === "displayItemRequestLineModel")
        activePageTableId = `pagetable_p_${stageId_ItemRequestCartable}`;


    modal_close(modalName);
}

$("#userType").on("change", function () {
    var check = controller_check_authorize(viewData_controllername, "VIWALL");
    if (!check)
        return;

    if ($(this).prop("checked"))
        pagetable_formkeyvalue = ["", "", "my", null];
    else
        pagetable_formkeyvalue = ["", "", "all", null];


    getItemRequestTab();

});

initItemRequestGroup();