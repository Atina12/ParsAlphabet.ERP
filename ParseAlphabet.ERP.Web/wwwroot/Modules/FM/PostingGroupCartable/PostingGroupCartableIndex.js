var viewData_controllername = "PostingGroupCartableApi",
    viewData_getpagetable_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getpagecartable`,
    viewData_getrecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getrecordbyid`,
    viewData_request_list = `${viewData_baseUrl_FM}/NewTreasuryApi/treasuryrequest_getdropdown`,
    viewData_filter_url = `${viewData_baseUrl_FM}/NewTreasuryApi/getfilteritems`,
    viewData_get_accountDetail_by_gl = `${viewData_baseUrl_FM}/AccountSGLApi/getaccountdetailbygl`,
    viewData_journalStepList_url = `${viewData_baseUrl_FM}/JournalApi/getjournalsteplist`,
    arraySend = [], arrayUndo = [], headerModel = {}, statusId = 0,
    pageName = null,
    stageId = 0,
    stageIdJournal = 56,
    selectedRowId = 0,
    pageTableModel = {}, saveIdForTabs = "", idForStepAction2 = "", stepLogModalTreasuryForCloseModal = true, stepLogModalJournalForCloseModal = true,
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
        .html('<button title="ctrl+m" type="button" onClick="openQuickSearchForm(false)" class="btn btn-success waves-effect ml-2">جستجوی سریع</button>'));

}

function getPostingGroupTab() {

    var byUser = pagetable_formkeyvalue[2];

    let url = `${viewData_baseUrl_FM}/${viewData_controllername}/treasurypostinggroupsection/3/${byUser}`;

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
   
    if (id == 56)
        viewData_deleterecord_url = `${viewData_baseUrl_FM}/JournalApi/delete`;
    else
        viewData_deleterecord_url = `${viewData_baseUrl_FM}/NewTreasuryApi/delete`;

    stageId_PostingGroupCartableParameter = saveIdForTabs = +id;

    let switchUser = ""

    if ($("#userType").prop("checked")) {
        switchUser = "my"
    } else {
        switchUser = "all"
    }


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

function run_button_printJournal(rowNumbers) {

    var check = controller_check_authorize("JournalApi", "PRN");
    if (!check)
        return;

    $("#modal_keyid_journal_value").text(rowNumbers);
    rowNumberJournal = rowNumbers;
    modal_show(`PrnJournal`);
}

function run_button_displaySimpleTreasury(id, rowNo, elm) {

    var check = controller_check_authorize("NewTreasuryApi", "VIW");
    if (!check)
        return;

    var stageId = +$(`#row${rowNo}`).data("stageid");
    var requestId = +$(`#row${rowNo}`).data("requestid");
    var workflowId = +$(`#row${rowNo}`).data("workflowid");
    navigateToModalTreasury(`/FM/NewTreasuryLine/display/${id}/${requestId}/1/${stageId}/${workflowId}`);
}

function run_button_displayAdvanceTreasury(id, rowNo, elm) {

    var check = controller_check_authorize("NewTreasuryApi", "VIW");
    if (!check)
        return;

    var stageId = +$(`#row${rowNo}`).data("stageid");
    var requestId = +$(`#row${rowNo}`).data("requestid");
    var workflowid = +$(`#row${rowNo}`).data("workflowid");
    navigateToModalTreasury(`/FM/NewTreasuryLine/display/${id}/${requestId}/0/${stageId}/${workflowid}`);
}

function run_button_displaySimpleJournal(id, rowNo, elm) {

    var check = controller_check_authorize("JournalApi", "VIW");
    if (!check)
        return;

    navigateToModalJournal(`/FM/journal/journaldisplay/${id}/${$(`#row${rowNo} #col_${rowNo}_3`).text()}/1`, "سند حسابداری - ریالی");
}

function run_button_displayAdvanceJournal(id, rowNo, elm) {

    var check = controller_check_authorize("JournalApi", "VIW");
    if (!check)
        return;

    navigateToModalJournal(`/FM/journal/journaldisplay/${id}/${$(`#row${rowNo} #col_${rowNo}_3`).text()}/2`, "سند حسابداری - ارزی");
}

function run_button_journalDetailSimple(lineId, rowNo, elm, ev) {

    var check = controller_check_authorize("JournalApi", "UPD");
    if (!check)
        return;

    ev.stopPropagation();

    var bySystem = $(`#row${rowNo}`).data("bysystem");

    if (bySystem) {
        var msg = alertify.warning("امکان تخصیص متغیر سند سیستمی وجود ندارد");
        msg.delay(alertify_delay);
        return;
    }

    var stageId = $(`#row${rowNo}`).data("stageid");
    navigation_item_click(`/FM/JournalLine/${lineId}/${stageId}/1`, "سند حسابداری - ریالی");
    conditionalProperties.isCartable = true;
}

function run_button_journalDetailAdvance(lineId, rowNo) {

    var check = controller_check_authorize("JournalApi", "UPD");
    if (!check)
        return;

    var bySystem = $(`#row${rowNo}`).data("bysystem");

    if (bySystem) {
        var msg = alertify.warning("امکان تخصیص متغیر سند سیستمی وجود ندارد");
        msg.delay(alertify_delay);
        return;
    }
    var stageId = $(`#row${rowNo}`).data("stageid");
    navigation_item_click(`/FM/JournalLine/${lineId}/${stageId}/2`, "سند حسابداری - ارزی");
    conditionalProperties.isCartable = true;
}


function run_button_treasuryDetailSimple(lineId, rowNo, elm, ev) {

    var check = controller_check_authorize("NewTreasuryApi", "INS");
    if (!check)
        return;

    navigation_item_click(`/FM/NewTreasuryLine/${lineId}/1`);
    conditionalProperties.isCartable = true;
}

function run_button_treasuryDetailAdvance(lineId, rowNo, elm, ev) {

    var check = controller_check_authorize("NewTreasuryApi", "INS");
    if (!check)
        return;

    navigation_item_click(`/FM/NewTreasuryLine/${lineId}/0`);
    conditionalProperties.isCartable = true;
}

function run_button_printTreasury(rowId, rowNo, elm) {

    var check = controller_check_authorize("NewTreasuryApi", "PRN");
    if (!check)
        return;

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

function tableOnKeyDown(pagetableId, e) {

    if (pagetableId === "pagetable_p_56") {

        if (([KeyCode.key_General_1, KeyCode.key_General_2, KeyCode.key_General_3, KeyCode.key_General_4].indexOf(e.which) == -1) && e.ctrlKey) return;
        switchPrint(e)
    }
}

function switchPrint(e) {

    //چاپ دفتر تفصیل
    var printType = ""

    if (e.ctrlKey && e.keyCode === KeyCode.key_General_1) {
        e.preventDefault();
        printType = 1
        printJournalSetting(printType, $(`#pagetable_p_56 .pagetablebody tr.highlight`));
        //چاپ سند حسابداری تاریخ ثبت
    }
    else if (e.ctrlKey && e.keyCode === KeyCode.key_General_2) {
        e.preventDefault();
        printType = 2;
        printJournalSetting(printType, $(`#pagetable_p_56 .pagetablebody tr.highlight`));
        //چاپ دفتر حسابداری کل معین تفصیل
    }
    else if (e.ctrlKey && e.keyCode === KeyCode.key_General_3) {
        e.preventDefault();
        printType = 3
        printJournalSetting(printType, $(`#pagetable_p_56 .pagetablebody tr.highlight`));
        //چاپ دفتر معین
    }
    else if (e.ctrlKey && e.keyCode === KeyCode.key_General_4) {
        e.preventDefault();
        printType = 4
        printJournalSetting(printType, $(`#pagetable_p_56 .pagetablebody tr.highlight`));
        //چاپ در سطح تفضیل
    }


}

function printJournalSetting(type, rowElmn) {

    let reportParameters = [], repUrl = "", id = rowElmn.data("id"), documentNo = rowElmn.data("documentno"), reportModel = {}, reportName = "";
    let documentDate = rowElmn.data("documentdatepersian");
    if (type == 1) {
        repUrl = `${stimulsBaseUrl.FM.Prn}journalByDateReportPreview.mrt`;
        reportName = `چاپ حسابداری مرتب سازی بر اساس تاریخ ثبت`
    }
    else if (type == 2) {
        repUrl = `${stimulsBaseUrl.FM.Prn}journalByGlSGLReportPreview.mrt`;
        reportName = `چاپ حسابداری مرتب سازی بر اساس کل - معین - تفصیل`
    }
    else if (type == 3) {
        repUrl = `${stimulsBaseUrl.FM.Prn}journalLevelSglReportPreview.mrt`;
        reportName = `چاپ در سطح معین`;
    }
    else if (type == 4) {
        repUrl = `${stimulsBaseUrl.FM.Prn}journalLevelAccountDetailsReportPreview.mrt`;
        reportName = `چاپ در سطح تفصیل`;
    }
    reportParameters = [
        { Item: "journalId", Value: id, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "journalId", Value: id, itemType: "Var" },
        { Item: "journalId", Value: id, itemType: "Var" },
        { Item: "documentNo", Value: documentNo, itemType: "Var" },
        { Item: "documentDate", Value: documentDate, itemType: "Var" },
    ];

    reportModel = {
        reportName: reportName,
        reportUrl: repUrl,
        parameters: reportParameters,
        reportSetting: reportSettingModel
    }

    window.open(`${viewData_report_url}?strReportModel=${JSON.stringify(reportModel)}`, '_blank');
}

function run_button_showStepLogsjournal(id, rowno) {
    
    $("#actionJo").empty();

    activePageTableId = `pagetable_p_${stageId_PostingGroupCartableParameter}`;

    selectedRowId = `row${rowno}`;
    
    var stageId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("stageid");
    fill_dropdown(`${viewData_baseUrl_FM}/JournalStageActionApi/list`, "id", "name", "actionJo", true, stageId);
    identityIdCurrent = +$(`#${activePageTableId}  tbody tr.highlight`).data("id");
    stepLogJournal(id);
    var currentActionId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("actionid");
    var bySystem = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("bysystem");
    $(`#actionJo`).val(currentActionId).trigger("change").prop("disabled", bySystem);
    $("#updateStatusBtn").prop("disabled", bySystem);
    modal_show("stepLogModalJournal");
    idForStepAction2 = id
}

function run_button_showStepLogsTreasury(id, rowno) {
    
    $("#actionTr").empty();

    activePageTableId = `pagetable_p_${stageId_PostingGroupCartableParameter}`

    selectedRowId = `row${rowno}`;

    var currentStageId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("stageid");
    var currentActionId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("actionid");
    var currentBranchId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("branchid");
    var currentWorkFlowId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("workflowid");
    var currentIdentityId = id;
    var currentrequestId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("requestid");
    var currentparentworkflowcategoryid = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("parentworkflowcategoryid");
    stageActionLogCurrent = { identityId: currentIdentityId, stageId: currentStageId, actionId: currentActionId, workFlowId: currentWorkFlowId, parentworkflowcategoryid: currentparentworkflowcategoryid, requestId: currentrequestId }

   
    let stageClassIds = "3";
    fill_dropdown(`${viewData_baseUrl_WF}/StageActionApi/getdropdownactionlistbystage`, "id", "name", "actionTr", true, `${currentStageId}/${currentWorkFlowId}/1/0/${currentBranchId}/${workflowCategoryIds.treasury.id}/true/${stageClassIds}`);
    $(`#actionTr`).val(currentActionId).trigger("change");

    stepLogTreasury(stageActionLogCurrent.identityId, stageActionLogCurrent.stageId, stageActionLogCurrent.workFlowId);
    modal_show("stepLogModalTreasury");
}

function run_button_editjo(p_keyvalue, rowNo, elem) {

    conditionalProperties.isCartable = true;
    modal_open_state = "Edit";

    var check = controller_check_authorize("JournalApi", "UPD");
    if (!check)
        return;

    var bySystem = $(`#row${rowNo}`).data("bysystem");
    if (bySystem) {
        var msg = alertify.warning("امکان ویرایش سند سیستمی وجود ندارد");
        msg.delay(alertify_delay);
        return;
    }

    var modal_name = "AddEditModalJu";
    $(".modal").find("#modal_title").text("ویرایش سند حسابداری");



    $(`#${modal_name} #rowKeyId`).removeClass("d-none");
    $(`#${modal_name} #modal_keyid_value`).text(p_keyvalue);
    $(`#${modal_name} #modal_keyid_caption`).text("شناسه : ");

    $("#documentNoContainer").removeClass("d-none");
    $("#documentNoJo").prop("disabled", false);

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

    $.ajax({
        url: viewData_getrecord_url_journal,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(p_keyvalue),
        async: false,
        cache: false,
        success: function (response) {
            modal_open_state = 'Edit';
            modal_clear_items(modal_name);

            var result = response.data;

            $("#modal_keyid_value").text(result.id);
            $("#modal_keyid_caption").text("شناسه :");

            $("#branchIdJo").val(result.branchId).trigger("change");
            $("#documentNoJo").val(result.documentNo);
            $("#documentTypeIdJo").val(result.documentTypeId).trigger("change");
            $("#documentDatePersianJo").val(result.documentDatePersian);

            modal_show(modal_name);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getrecord_url_journal)
        }
    });
}

function run_button_edittr(treasuryId, rowNo, elem) {

    conditionalProperties.isCartable = true;
    var check = controller_check_authorize("NewTreasuryApi", "UPD");
    if (!check)
        return;

    var treasuryAction = getTreasuryStageActionConfig(treasuryId);
    if (treasuryAction.isDataEntry == 0) {
        alertify.error('برگه جاری امکان ویرایش ندارد').delay(alertify_delay);
        return;
    }


    var viewData_form_title = "اسناد خزانه";
    var modal_name = "AddEditModalTreasury";

    $("#rowKeyId").removeClass("d-none");

    $(".modal").find("#modal_title").text("ویرایش " + viewData_form_title);

    $("#modal_keyid_value").text(treasuryId);
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


    viewData_getrecord_url_tr = `/api/FM/NewTreasuryApi/getrecordbyid`;


    $.ajax({
        url: viewData_getrecord_url_tr,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(treasuryId),
        async: false,
        cache: false,
        success: function (response) {

            modal_open_state = 'Edit';
            modal_clear_items(modal_name);
            result = response.data
            if (checkResponse(result)) {
                if (result.isDataEntry !== 0) {
                    fillEditTreasury(result);
                    modal_show(modal_name);
                }
                else {
                    alertify.error('برگه جاری امکان ویرایش ندارد').delay(alertify_delay);
                    return;
                }
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getrecord_url_tr)
        }
    });


}

function clickModalJounal(type) {
    printJournalSetting(type, $(`#${activePageTableId} .pagetablebody tr.highlight`));
}

function printJournalSetting(type, rowElmn) {
    let reportParameters = [], repUrl = "", id = rowElmn.data("id"), documentNo = rowElmn.data("documentno"), reportModel = {}, reportName = "";
    let documentDate = rowElmn.data("documentdatepersian");
    if (type == 1) {
        repUrl = `${stimulsBaseUrl.FM.Prn}journalByDateReportPreview.mrt`;
        reportName = `چاپ حسابداری مرتب سازی بر اساس تاریخ ثبت`
    }
    else if (type == 2) {
        repUrl = `${stimulsBaseUrl.FM.Prn}journalByGlSGLReportPreview.mrt`;
        reportName = `چاپ حسابداری مرتب سازی بر اساس کل - معین - تفصیل`
    }
    else if (type == 3) {
        repUrl = `${stimulsBaseUrl.FM.Prn}journalLevelSglReportPreview.mrt`;
        reportName = `چاپ در سطح معین`;
    }
    else if (type == 4) {
        repUrl = `${stimulsBaseUrl.FM.Prn}journalLevelAccountDetailsReportPreview.mrt`;
        reportName = `چاپ در سطح تفصیل`
    }
    reportParameters = [
        { Item: "journalId", Value: id, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "journalId", Value: id, itemType: "Var" },
        { Item: "journalId", Value: id, itemType: "Var" },
        { Item: "documentNo", Value: documentNo, itemType: "Var" },
        { Item: "documentDate", Value: documentDate, itemType: "Var" },
    ];

    reportModel = {
        reportName: reportName,
        reportUrl: repUrl,
        parameters: reportParameters,
        reportSetting: reportSettingModel
    }

    window.open(`${viewData_report_url}?strReportModel=${JSON.stringify(reportModel)}`, '_blank');
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
    if (modalName === "displayTreasuryLineModel")
        activePageTableId = `pagetable_p_${stageId_PostingGroupCartableParameter}`;
    //journal
    else
        activePageTableId = `pagetable_p_${stageId_PostingGroupCartableParameter}`;

    modal_close(modalName);
}

$("#stepLogModalTreasury").on("hidden.bs.modal", async function () {
    stageActionLogCurrent = { identityId: 0, stageId: 0, actionId: 0 };
});

$("#stepLogModalJournal").on("hidden.bs.modal", async function () {
    idForStepAction2 = ""
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