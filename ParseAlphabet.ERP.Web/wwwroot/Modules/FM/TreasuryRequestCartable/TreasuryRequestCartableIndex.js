var viewData_form_title = "درخواست خزانه",
    viewData_controllername = "TreasuryRequestCartableApi",
    viewData_getpagetable_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getpagecartable`,
    viewData_deleterecord_url = `${viewData_baseUrl_FM}/TreasuryRequestApi/delete`,
    viewData_updrecord_url = `${viewData_baseUrl_FM}/TreasuryRequestApi/update`,
    viewData_getrecord_url = `${viewData_baseUrl_FM}/TreasuryRequestApi/getrecordbyid`,
    viewData_request_list = `${viewData_baseUrl_FM}/TreasuryRequestApi/treasuryrequest_getdropdown`,
    viewData_filter_url = `${viewData_baseUrl_FM}/TreasuryRequestApi/getfilteritems`,
    viewData_get_accountDetail_by_gl = `${viewData_baseUrl_FM}/AccountSGLApi/getaccountdetailbygl`,
    arraySend = [], arrayUndo = [], headerModel = {}, statusId = 0,
    pageName = null,
    stageId = 0,
    selectedRowId = 0,
    pageTableModel = {}, saveIdForTabs = "", stepLogModalTreasuryForCloseModal = true,
    stageId_PostingGroupCartableParameter = +$("#stageIdPostingGroupCartableParameter").val();

conditionalProperties = {
    isRequest: false,
    isAfterChange: false,
    isTreasurySubject: false,
    isPreviousStage: false,
    isCartable: false,
    isBank: false,
    isDataEntry: false
};



function initPostingGroup() {

    var check = controller_check_authorize(viewData_controllername, "VIWALL");
    if (check)
        $("#userType").prop('disabled', false);
    else
        $("#userType").prop('disabled', true);

    if ($("#userType").prop("checked")) {
        pagetable_formkeyvalue = [stageId_PostingGroupCartableParameter, "stageId", "my", 0];
    }
    else {
        pagetable_formkeyvalue = [stageId_PostingGroupCartableParameter, "stageId", "all", 0];
    }

    $('#userType').bootstrapToggle();

    getPostingGroupTab();

    $(document).ready(() => $("#quickSearchContainer")
        .html('<button title="ctrl+m" type="button" onClick="openQuickSearchForm()" class="btn btn-success waves-effect ml-2">جستجوی سریع</button>'));

}

function getPostingGroupTab() {

    var byUser = pagetable_formkeyvalue[2];

    let url = `${viewData_baseUrl_FM}/${viewData_controllername}/treasuryrequestgroupsection/1/${byUser}`;

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
                          <div class="card-body" id="pagetable_p_${result[i].id}">${pagetableString}</div>
                     </div>
                 </div>`;

            $(outPut).appendTo("#tabBoxes");
        }


        let index = result.findIndex((item) => item.id === stageId_PostingGroupCartableParameter)
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
        if (checkResponse(stageId_PostingGroupCartableParameter) && stageId_PostingGroupCartableParameter > 0)
            active = (result[i].id == stageId_PostingGroupCartableParameter ? "active" : "");
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

    stageId_PostingGroupCartableParameter = saveIdForTabs = +id;

    let switchUser = ""

    if ($("#userType").prop("checked"))
        switchUser = "my"
    else
        switchUser = "all"


    pagetable_formkeyvalue = [stageId_PostingGroupCartableParameter, "stageId", switchUser, 0];

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


    var filterIndex = arrSearchFilter.findIndex(v => v.pagetable_id == pageTableModel.pagetable_id);
    if (filterIndex != -1) {
        arrSearchFilter[filterIndex].filters = []
        arrSearchFilterSelect2ajax[filterIndex].filters = []
    }


    get_NewPageTableV1(pageName);
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

function navigateToModalTreasuryRequest(href) {

    initialPage();
    $("#contentdisplayTreasuryRequestLine #content-page").addClass("displaynone");
    $("#contentdisplayTreasuryRequestLine #loader").removeClass("displaynone");
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
            $(`#contentdisplayTreasuryRequestLine`).html(result);
        },
        error: function (xhr) {
            error_handler(xhr, href);
        }
    });
    $("#contentdisplayTreasuryRequestLine #loader,#contentdisplayTreasuryRequestLine #formHeaderLine #header-div .button-items").addClass("displaynone");
    $("#contentdisplayTreasuryRequestLine #content-page").fadeIn().removeClass("displaynone").css("margin", 0);
    $("#contentdisplayTreasuryRequestLine #form,#contentdisplayTreasuryRequestLine .content").css("margin", 0);
    $("#contentdisplayTreasuryRequestLine .itemLink").css("pointer-events", " none");
}

function run_button_printTreasury(rowId, rowNo, elm) {

    let stageClass = +$(`#row${rowNo}`).data("stageclassid"),
        id = $(`#row${rowNo}`).data("id"),
        currentInOut = $(`#${activePageTableId} .pagetablebody tr.highlight`).data("currentinout"),
        stage = $(`#row${rowNo} #col_${rowNo}_4`).text().split('-')[1],
        reportTitle = `خزانه - ${stage}`;

    printDocumentTreasury(stageClass, currentInOut, id, reportTitle);
}

function run_button_printRequestTreasury(identity, rowNo, elm) {

    var check = controller_check_authorize("TreasuryRequestApi", "PRN");
    if (!check)
        return;

    let stageClass = +$(`#row${rowNo}`).data("stageclassid"),
        currentInOut = +$(`#row${rowNo}`).data("currentinout"),
        id = $(`#row${rowNo}`).data("id"),
        stage = $(`#row${rowNo} #col_${rowNo}_4`).text().split('-')[1],
        reportTitle = `خزانه - ${stage}`;

    printDocumentTreasury(stageClass, currentInOut, id, reportTitle);
}


function run_button_treasuryRequestDetailSimple(lineId, rowNo) {

    var check = controller_check_authorize("TreasuryRequestApi", "INS");
    if (!check)
        return;

    navigation_item_click(`/FM/TreasuryRequestLine/${lineId}/1`);
    conditionalProperties.isCartable = true;
}

function run_button_treasuryRequestDetailAdvance(lineId, rowNo) {

    var check = controller_check_authorize("TreasuryRequestApi", "INS");
    if (!check)
        return;

    navigation_item_click(`/FM/TreasuryRequestLine/${lineId}/0`);
    conditionalProperties.isCartable = true;
}
function run_button_showStepLogsTreasury(id, rowno) {

    activePageTableId = `pagetable_p_${stageId_PostingGroupCartableParameter}`;

    selectedRowId = `row${rowno}`;
    
    var currentStageId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("stageid");
    var currentActionId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("actionid");
    var currentIdentityId = id;
    var currentworkFlowId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("workflowid");
    var currentBranchId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("branchid");
    stageActionLogCurrent = { identityId: currentIdentityId, stageId: currentStageId, actionId: currentActionId, workFlowId: currentworkFlowId }


    $("#actionTreasuryRequest").empty();
    let stageClassIds = "1";
    fill_dropdown(`${viewData_baseUrl_WF}/StageActionApi/getdropdownactionlistbystage`, "id", "name", "actionTreasuryRequest", true, `${currentStageId}/${currentworkFlowId}/1/0/${currentBranchId}/${workflowCategoryIds.treasury.id}/true/${stageClassIds}`);
    $("#actionTreasuryRequest").val(currentActionId).trigger("change");
    stepLogTreasuryRequest(stageActionLogCurrent.identityId, stageActionLogCurrent.stageId, stageActionLogCurrent.workFlowId);
    currentdentityId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("actionid");
    modal_show("stepLogModalTreasuryRequest");
}

function cartableModalClose(modalName) {

    let switchUser = ""

    if ($("#userType").prop("checked")) {
        switchUser = "my"
    } else {
        switchUser = "all"
    }

    pagetable_formkeyvalue = [stageId_PostingGroupCartableParameter, "stageId", switchUser, 0];

    stageId_PostingGroupCartableParameter = saveIdForTabs;

    //treasury
    if (modalName === "displayTreasuryRequestLineModel")
        activePageTableId = `pagetable_p_${stageId_PostingGroupCartableParameter}`;

    modal_close(modalName);
}

$("#stepLogModalTreasuryRequest").on("hidden.bs.modal", async function () {
    stageActionLogCurrent = { identityId: 0, stageId: 0, actionId: 0, workFlowId: 0 };
});

$("#userType").on("change", function () {

    var check = controller_check_authorize(viewData_controllername, "VIWALL");
    if (!check)
        return;

    if ($(this).prop("checked"))
        pagetable_formkeyvalue = [stageId_PostingGroupCartableParameter, "stageId", "my", 0];
    else
        pagetable_formkeyvalue = [stageId_PostingGroupCartableParameter, "stageId", "all", 0];


    getPostingGroupTab();

});

initPostingGroup();
