var viewData_form_title = "کارتابل طرح درمان",
    viewData_controllername = "AdmissionMasterCartableApi",
    switchTimer = "off", timer = "", minutes = 0, seconds = 0, printUrl = "", rowNumberAdmission = 0,
    selectLineInfo = [], actionErr = [], saveCurrentTabAction = null, isSetActionAccess = true;

var form3 = $('#filterInputBox').parsley()

async function initForminboundl() {

    var interval = null;
    clearInterval(interval);


    $("#stageId").select2()
    $("#workflowId").select2()
    $("#isSettled").select2()

    $(".tab-content").show();
    $("#toWorkDayDatePersian,#fromWorkDayDatePersian").val(getTodayPersianDate());

    kamaDatepicker('fromWorkDayDatePersian', { withTime: false, position: "bottom" });
    kamaDatepicker('toWorkDayDatePersian', { withTime: false, position: "bottom" });



    inputMask();
    inboundLoadDropdown();
    timerInbound();
    setTimeout(() => {
        $("#fromWorkDayDatePersian").focus();
    }, 1000)
}

function inboundLoadDropdown() {

    $("#patientId,#branchId,#workflowId,#stageId").empty()

    var brachOption = new Option("انتخاب کنید", 0, true, true);
    $("#branchId").append(brachOption)



    fill_select2("api/MC/PatientApi/filter/2", "patientId", true, 0, true, 3, "انتخاب", undefined, "", false, true, false, true);

    fill_select2(`${viewData_baseUrl_GN}/branchApi/getdropdown`, "branchId", true, "", false, 3, "");

    var workflowOption = new Option("انتخاب کنید", 0, true, true);
    $("#workflowId").append(workflowOption)
    fill_select2(`${viewData_baseUrl_WF}/WorkflowApi/getdropdown`, "workflowId", true, `null/10,14/26`, false, 3, "");

    var stageOption = new Option("انتخاب کنید", 0, true, true);
    $("#stageId").append(stageOption);
    fill_select2(`${viewData_baseUrl_WF}/StageApi/getdropdown`, "stageId", true, `14/26/2/2`, false, 3, "");
}


function expandAdmissionMaster(item) {
    if ($(item).nextAll(".slideToggle").hasClass("open")) {
        $(item).nextAll(".slideToggle").slideUp().removeClass("open");
        $(item).children(".fas").removeClass("fa-minus").addClass("fa-plus");
    }
    else {
        $(item).nextAll(".slideToggle").addClass("current");

        $(item).nextAll(".slideToggle").slideToggle().toggleClass("open");

        if ($(item).nextAll(".slideToggle").hasClass("open")) {
            $(item).children(".fas").removeClass("fa-plus").addClass("fa-minus");
            $(item).nextAll(".open").css("display", "block");
        }
        else
            $(item).children(".fas").removeClass("fa-minus").addClass("fa-plus");

        $(item).nextAll(".slideToggle").removeClass("current");

        let firstInput = $(item).nextAll(".slideToggle").find("[tabindex]:not(:disabled)").first();

        firstInput.hasClass("select2") ? $(`#${firstInput.attr("id")}`).select2('focus') : firstInput.focus();
    }

}

$("#branchId").on("change", function () {

    var branchId = $(this).val() == "" ? null : $(this).val();
    let workFlowCategoryId = "10,14";//+workflowCategoryIds.medicalMaster.id;
    let stageClassId = "26"

    $("#workflowId").empty();

    var workflowOption = new Option("انتخاب کنید", 0, true, true);

    $("#workflowId").append(workflowOption)

    fill_select2(`${viewData_baseUrl_WF}/WorkflowApi/getdropdown`, "workflowId", true, `${branchId}/${workFlowCategoryId}/${stageClassId}`, false, 3, "", () => { $("#workflowId").trigger("change") });

});

$("#workflowId").on("change", function () {

    let workflowId = +$(this).val() == 0 ? null : $(this).val();
    var branchId = +$("#branchId").val() == 0 ? null : $("#branchId").val();
    let workFlowCategoryId = "10,14";//+workflowCategoryIds.medicalMaster.id;
    let stageClassId = "26"
    let bySystem = 0
    let isActive = 1

    $("#stageId").empty();

    var stageOption = new Option("انتخاب کنید", 0, true, true);

    $("#stageId").append(stageOption)

    fill_select2(`${viewData_baseUrl_WF}/StageApi/getstagedropdownbyworkflowid`, "stageId", true,
        `${branchId}/${workflowId}/${workFlowCategoryId}/${stageClassId}/${bySystem}/${isActive}`, false, 3, "");


});

$("#isSettled").on("change", function () {
    let result = validateBoxInputs()
    if (!result)
        return

    getAdmissionMasterCartableTabAction();
});

$("#fromWorkDayDatePersian").on("keydown", function (e) {

    if (e.keyCode === KeyCode.Enter) {
        $("#toWorkDayDatePersian").val($("#fromWorkDayDatePersian").val());

        $("#refreshAdmissionMasterPagetable").click();

    }
});

$("#toWorkDayDatePersian").on("keydown", function (ev) {

    if (ev.keyCode === KeyCode.Enter) {
        
        if (!isValidShamsiDate($("#toWorkDayDatePersian").val())) {
            var msg = alertify.error("قرمت تاریخ صحیح نیست");
            msg.delay(alertify_delay);
            return;
        }
        else
            $("#refreshAdmissionMasterPagetable").click();
    }
});

$("#refreshlist").on("click", function () {
    $("#refreshAdmissionMasterPagetable").click();
})

$("#resetList").on("click", function () {
    $("#cartableAdmissionMasterId").val("")
    $("#isSettled").val("-1").trigger("change");
    $("#fromWorkDayDatePersian").val(moment().format("jYYYY/jMM/jDD"))
    $("#toWorkDayDatePersian").val(moment().format("jYYYY/jMM/jDD"))
    $("#tabActionBox").html("")
    $("#tabBoxByAction").addClass("d-none")
    $("#tabBoxByAction").html("")
    inboundLoadDropdown()
})

$("#refreshAdmissionMasterPagetable").on("click", function () {

    let result = validateBoxInputs()
    if (!result)
        return

    getAdmissionMasterCartableTabAction();
});


$("#stopTimerInterval").on("click", function () {

    if (switchTimer == "on") {
        emptyInterval();
        switchTimer = "off";
        $(this).removeClass("btn-danger").addClass("btn-success");
        $(this).html(`<i class="fa fa-play"></i>`);
    }
    else {
        switchTimer = "on";
        timerInbound();

        interval = null;
        clearInterval(interval);

        $(this).removeClass("btn-success").addClass("btn-danger");
        $(this).html(`<i class="fa fa-stop"></i>`)
    }
});


function timerInbound() {

    var timer2 = "00:30";

    emptyInterval();

    interval = setInterval(function () {

        if (switchTimer == "off") return;

        timer = timer2.split(':');

        minutes = +timer[0];
        seconds = +timer[1];
        --seconds;

        if (seconds < 10)
            $("#timerBox").addClass("highlight-danger");
        else
            $("#timerBox").removeClass("highlight-danger");

        if (!seconds) {

            if (seconds === 0) {

            }

            timerInbound();
            interval = null;

            clearInterval(interval);

            $("#refreshAdmissionMasterPagetable").click();
        }
        else {

            minutes = (seconds < 0) ? --minutes : minutes;

            if (minutes <= 0) clearInterval(interval);

            seconds = (seconds < 0) ? 30 : seconds;
            seconds = (seconds < 10) ? '0' + seconds : seconds;

            timer2 = zeroPad(minutes, "00") + ':' + seconds;
            $('#timerBox').html(timer2);
        }

    }, 1000);
}

function emptyInterval() {
    var maxInterval = setTimeout(function () { }, 10);
    for (var i = 0; i < maxInterval; i++) {
        clearInterval(i);
    }
}

function validateBoxInputs() {

    let from = moment.from($("#fromWorkDayDatePersian").val(), 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD');
    let to = moment.from($("#toWorkDayDatePersian").val(), 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD');

    var diffDay = moment(to).diff(moment(from), 'day');

    if (diffDay > 30) {
        alertify.warning("بازه تاریخ مجاز 30 روز می باشد").delay(alertify_delay);
        resetPageTable_waitingInbound()
        return false;
    }

    if (!isValidShamsiDate($("#fromWorkDayDatePersian").val())) {
        var msg = alertify.error("قرمت تاریخ صحیح نیست");
        msg.delay(alertify_delay);
        return;
    }
    if (!isValidShamsiDate($("#toWorkDayDatePersian").val())) {
        var msg = alertify.error("قرمت تاریخ صحیح نیست");
        msg.delay(alertify_delay);
        return;
    }
    return true
}

function resetPageTable_waitingInbound() {
    $("#tabBoxByAction").html("")
    $("#tabActionBox").html("")
    $("#tabBoxByAction").addClass("d-none")
}

function getAdmissionMasterCartableTabAction() {

    let pageViewModel = {
        pageno: 0,
        pagerowscount: 50,
        fieldItem: "",
        fieldValue: "",
        form_KeyValue: [],
        sortModel: {
            colId: "",
            sort: ""
        }
    }

    pageViewModel.form_KeyValue = [
        +$("#cartableAdmissionMasterId").val() == 0 ? null : +$("#cartableAdmissionMasterId").val(),
        +$("#stageId").val() == 0 ? null : +$("#stageId").val(),
        +$("#workflowId").val() == 0 ? null : +$("#workflowId").val(),
        +$("#patientId").val() == 0 ? null : $("#patientId").val(),
        +$("#branchId").val() == 0 ? null : +$("#branchId").val(),
        $("#fromWorkDayDatePersian").val() == "" ? null : $("#fromWorkDayDatePersian").val(),
        $("#toWorkDayDatePersian").val() == "" ? null : $("#toWorkDayDatePersian").val(),
        +$("#isSettled").val() == -1 ? null : +$("#isSettled").val(),
    ]



    let countModel = {
        id: +$("#cartableAdmissionMasterId").val() == 0 ? null : +$("#cartableAdmissionMasterId").val(),
        stageId: +$("#stageId").val() == 0 ? null : +$("#stageId").val(),
        workflowId: +$("#workflowId").val() == 0 ? null : +$("#workflowId").val(),
        patientId: +$("#patientId").val() == 0 ? null : $("#patientId").val(),
        branchId: +$("#branchId").val() == 0 ? null : +$("#branchId").val(),
        fromWorkDayDatePersian: $("#fromWorkDayDatePersian").val() == "" ? null : $("#fromWorkDayDatePersian").val(),
        toWorkDayDatePersian: $("#toWorkDayDatePersian").val() == "" ? null : $("#toWorkDayDatePersian").val(),
        actionId: null,
        isSettled: +$("#isSettled").val() == -1 ? null : +$("#isSettled").val(),
    }

    let url = `${viewData_baseUrl_MC}/${viewData_controllername}/getsectioncartable`;
    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(pageViewModel),
        async: false,
        success: function (result) {
            fillCartableTabSection(result, countModel);
            getCartable(result);
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });
}

function fillCartableTabSection(result, countModel) {

    let reasultLen = result.length,
        outPut = "",
        active = "";

    let isLastActionExist = false

    if (reasultLen > 0) {

        let currentIndex = result.findIndex(item => item.id == saveCurrentTabAction)

        if (currentIndex != -1)
            isLastActionExist = true
    }

    $("#tabActionBox").html("");
    for (var i = 0; i < reasultLen; i++) {


        if (isLastActionExist) {
            if (checkResponse(saveCurrentTabAction) && saveCurrentTabAction > 0)
                active = (result[i].id == saveCurrentTabAction ? "active" : "");
            else
                active = (i == 0 ? "active" : "");
        }
        else
            active = (i == 0 ? "active" : "");


        outPut = `<li class="nav-item waves-effect waves-light" id="p_${result[i].id}Item">
                      <a class="nav-link ${active}" data-toggle="tab" onclick="changeCartableTabByClick('pagetable_p_${result[i].id}','${result[i].id}')" data-id="p_${result[i].id}" id="p_${result[i].id}Link" href="#p_${result[i].id}Box" role="tab">
                          <div class="d-flex justify-content-center align-items-center w-100" style="font-size: 11px!important;">
                             <span class="d-md-block"> ${result[i].id} - ${result[i].name}</span>
                             <div id="countOfListWaiting_${result[i].id}" resetstyle="true" class="countOfListWaiting  ${(i == 0 ? "elementActive" : "elementInActive")} mr-2 d-flex justify-content-center align-items-center"></div>
                          </div>
                      </a>
                   </li>`;

        $("#tabActionBox").append(outPut);

        countModel.actionId = result[i].id

        fillCartableCount(`countOfListWaiting_${result[i].id}`, countModel)
    }

    if ($("#tabActionBox").html() == '')
        $("#tabBoxByAction").addClass("d-none")
    else
        $("#tabBoxByAction").removeClass("d-none")

}

function getPageTableString() {

    let output =
        $.ajax({
            url: `PB/Public/newpagetable`,
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
                error_handler(xhr, `PB/Public/newpagetable`);
            }
        });

    var strReturn = "";


    strReturn = output.responseText

    return strReturn;
}

function getCartable(result) {

    let resultLen = result.length,
        outPut = "",
        pagetableString = getPageTableString(),
        saveId = "";


    $("#tabBoxByAction").html("")

    if (resultLen != 0) {

        for (var i = 0; i < resultLen; i++) {

            outPut += `
                      <div class="tab-pane p-3" data-id="p_${result[i].id}" id="p_${result[i].id}Box" role="tabpanel">
                        <div class="" id="p_${result[i].id}Form" data-parsley-validate>
                          <div class="card-body " id="pagetable_p_${result[i].id}" >${pagetableString}</div>
                        </div>
                      </div>        
                  `;
        }

        $(outPut).appendTo("#tabBoxByAction");
        $(".filterBox").html("");


        /////////////////////////////////

        let index = result.findIndex((item) => item.id === saveCurrentTabAction)

        if (index == -1) {
            $(`#p_${result[0].id}Box`).addClass("active")
            saveId = result[0].id
        }
        else {
            $(`#p_${result[index].id}Box`).addClass("active")
            saveId = result[index].id
        }


        if (resultLen != 0) {
            $("#tabPersonOrderBoxes").addClass("group-box")
            changeCartableTabByClick(`pagetable_p_${saveId}`, saveId);
        }
        else
            $("#tabPersonOrderBoxes").removeClass("group-box")
    }
    else {
        alertify.warning("گامی برای نمایش وجود ندارد").delay(admission.delay);
    }


}

function fillCartableCount(pg_id, countModel) {

    let url = `/api/MC/AdmissionMasterCartableApi/getworklistcount`

    $.ajax({
        url: url,
        type: "POST",
        data: JSON.stringify(countModel),
        dataType: "json",
        contentType: "application/json",
        cache: false,
        success: function (result) {

            $(`#${pg_id}`).html(result)
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });

}

function changeCartableTabByClick(pg_id, actionId) {
    saveCurrentTabAction = +actionId
    configStyleCartableCountBox(pg_id, actionId)

    var pageTableModel = {
        pagetable_id: `pagetable_p_${actionId}`,
        editable: false,
        pagerowscount: 15,
        endData: false,
        pageNo: 0,
        currentpage: 1,
        currentrow: 1,
        currentcol: 0,
        highlightrowid: 0,
        trediting: false,
        pagetablefilter: false,
        filteritem: "",
        filtervalue: "",
        selectedItems: [],
        getpagetable_url: `${viewData_baseUrl_MC}/AdmissionMasterCartableApi/getcartable`,
        lastPageloaded: 0
    };

    let index = arr_pagetables.findIndex(v => v.pagetable_id == pageTableModel.pagetable_id);
    if (index == -1) {
        arr_pagetables.push(pageTableModel);
    } else {
        arr_pagetables[index].pagetable_id = `pagetable_p_${actionId}`
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
        arr_pagetables[index].getpagetable_url = `${viewData_baseUrl_MC}/AdmissionMasterCartableApi/getcartable`
        arr_pagetables[index].selectedItems = []
        arr_pagetables[index].lastPageloaded = 0

    }

    var validateResult = validateBoxInputs()
    if (!validateResult)
        return

    pagetable_formkeyvalue = [
        +$("#cartableAdmissionMasterId").val() == 0 ? null : +$("#cartableAdmissionMasterId").val(),
        +$("#stageId").val() == 0 ? null : +$("#stageId").val(),
        +$("#workflowId").val() == 0 ? null : +$("#workflowId").val(),
        +$("#patientId").val() == 0 ? null : $("#patientId").val(),
        +$("#branchId").val() == 0 ? null : +$("#branchId").val(),
        $("#fromWorkDayDatePersian").val() == "" ? null : $("#fromWorkDayDatePersian").val(),
        $("#toWorkDayDatePersian").val() == "" ? null : $("#toWorkDayDatePersian").val(),
        +actionId,
        +$("#isSettled").val() == -1 ? null : +$("#isSettled").val(),
    ]
    lastFormKeyValue = pagetable_formkeyvalue

    configCartablePageTable(pg_id)
}

function configCartablePageTable(pg_id) {

    get_NewPageTable(pg_id, false, () => {

        $(`#${pg_id} .filterBox`).html("");
        $(`#${pg_id} .filterBox`).removeClass("col-lg-7").removeClass("col-md-7").addClass("col-md-12")
        $(`#${pg_id} .filterBox`)
            .append(`
                        <div class="d-flex justify-content-end mb-2 step-app">
                            <div class="ml-2"><button class="step-btn waves-effect" onclick=runButtonMasterPreviousOrNextActionSelect('${pg_id}',1)>قبلی</button></div>
                            <div><button class="step-btn waves-effect" onclick=runButtonMasterPreviousOrNextActionSelect('${pg_id}',2)>بعدی</button></div>
                        </div>
            
                    `);

    })
}

function configStyleCartableCountBox(pg_id, actionId) {

    if ($(`#countOfListWaiting_${actionId}`).hasClass("elementActive"))
        return

    $(".countOfListWaiting").removeClass("elementActive").addClass("elementInActive")

    $(`#countOfListWaiting_${actionId}`).removeClass("elementInActive").addClass("elementActive")

}

function runButtonMasterPreviousOrNextActionSelect(pg_id, direction) {
    
    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_id);
    if (index == -1)
        return


    let selectedItems = arr_pagetables[index].selectedItems
    if (selectedItems.length == 0) {
        alertify.warning("حداقل یک سطر را انتخاب کنید").delay(admission.delay);
        return
    }


    let model = []
    let actionId = +pg_id.split("_")[2]
    selectLineInfo = []
    actionErr = []

    for (let i = 0; i < selectedItems.length; i++) {
        selectLineInfo.push({
            direction,
            admissionMasterId: +selectedItems[i].id,
            branchId: +selectedItems[i].branchid,
            workflowId: +selectedItems[i].workflowid,
            stageId: +selectedItems[i].stageid,
            actionId: null
        })

        model.push({
            direction,
            branchId: +selectedItems[i].branchid,
            workflowId: +selectedItems[i].workflowid,
            stageId: +selectedItems[i].stageid,
            actionId
        })
    }


    model = _.uniqWith(model, (a, b) => a.stageId == b.stageId && a.workflowId == b.workflowId && a.branchId == b.branchId)

    let previousActionUrl = `${viewData_baseUrl_MC}/${viewData_controllername}/checkupdatebulkactioncartable`
    loaderOnPageTable(true, "tabBoxByAction")


    $.ajax({
        url: previousActionUrl,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (result) {

            if (checkResponse(result))
                buildMasterActionListModal(result)
            else {
                loaderOnPageTable(false, "tabBoxByAction")
                alertify.error("خطای سیستمی دوباره تلاش کنید").delay(admission.delay);
            }


        },
        error: function (xhr) {
            error_handler(xhr, previousActionUrl);
        }
    });
}

function buildMasterActionListModal(result, patientId) {

    let actionListInfo = []

    for (let i = 0; i < result.length; i++) {
        actionListInfo.push({
            actionList: result[i].actionList,
            workflowId: result[i].workflowId,
            workflowName: result[i].workflowName,
            stageId: result[i].stageId,
            stageName: result[i].stageName,
            branchId: result[i].branchId,
            patientId: patientId,
            statusMessage: result[i].statusMessage,
            successfull: result[i].successfull
        })
    }

    //allUnsuccessfull
    actionErr = []
    for (let i = 0; i < actionListInfo.length; i++) {
        let info = actionListInfo[i]
        if (!info.successfull) {
            for (let j = 0; j < selectLineInfo.length; j++) {
                let lineInfo = selectLineInfo[j]
                
                if (info.stageId == lineInfo.stageId && info.workflowId == lineInfo.workflowId) {
                    actionErr.push({
                        admissionId: lineInfo.admissionMasterId,
                        err: info.statusMessage
                    })
                }
            }
        }
    }

    if (actionErr.length != 0) {
        loaderOnPageTable(false, "tabBoxByAction")
        showActionErrors()
        actionErr = []
        return
    }

    let checkAllActionsBeSame = true
    let lastActionList = actionListInfo[0].actionList

    if (lastActionList == null)
        checkAllActionsBeSame = actionListInfo.every(item => item.actionList == lastActionList)
    else if (lastActionList.length > 1)
        checkAllActionsBeSame = false
    else {
        for (let i = 0; i < actionListInfo.length; i++) {
            let actionList = actionListInfo[i].actionList

            if (actionList == null) {
                checkAllActionsBeSame = false
                break
            }
            else if (actionList.length != lastActionList.length) {
                checkAllActionsBeSame = false
                break
            }
            else if (actionList[0].id != lastActionList[0].id) {
                checkAllActionsBeSame = false
                break
            }
        }
    }

    if (checkAllActionsBeSame && checkResponse(lastActionList))
        modal_saveMasterActions(null, null, lastActionList[0].id)
    else
        selectAllMasterActionsConfig(actionListInfo)

}

function selectAllMasterActionsConfig(actionListInfo) {

    loaderOnPageTable(false, "tabBoxByAction")
    loadingAsync(false, "modal_saveMasterActions", "fa fa-check-circle");

    $("#modal_saveMasterActions").prop("disabled", false)
    $("#actionsMadterModal #modal-close").prop("disabled", false)

    $("#actionsMasterModalTable").html("")

    let str = ""

    for (let i = 0; i < actionListInfo.length; i++) {

        let countAdmissison = selectLineInfo.filter((item) => item.workflowId == actionListInfo[i].workflowId && item.stageId == actionListInfo[i].stageId).length
        let lastBtnInRow = {}

        str = `<tr id="actionIds${i + 1}" onclick="newTrOnclick(${i + 1})" 
                        onkeydown="tr_onkeydownDisplay(${i + 1},this,event)"
                        data-workflowid="${actionListInfo[i].workflowId}" 
                        data-stageid="${actionListInfo[i].stageId}"
                        tabindex="-1"
                        >

                    <td style="text-align:center">${i + 1}</td>
                    <td>${actionListInfo[i].workflowId} - ${actionListInfo[i].workflowName}</td>
                    <td>${actionListInfo[i].stageId} - ${actionListInfo[i].stageName}</td>
                    <td>${countAdmissison}</td>
                `

        if (checkResponse(actionListInfo[i].actionList)) {
            str += `<td><div class="btn-group btn-group-toggle" data-toggle="buttons">`
            let currentActionList = actionListInfo[i].actionList

            for (let j = 0; j < currentActionList.length; j++) {
                str += `<label id="actionIds${i + 1}_action${j + 1}" class="btn btn-light ml-2" style="cursor:pointer;text-wrap: nowrap;" onclick="setActions(${i + 1},${currentActionList[j].id},event)">
                            <input type="radio" name="options" id="option1" checked="" style="font-size:11px !important" > 
                            <span>${currentActionList[j].text}</span>
                        </label>
                `

                if (currentActionList[j + 1] == undefined)
                    lastBtnInRow = `#actionIds${i + 1}_action${j + 1}`

            }
            str += "</div></td>"
        }
        else
            str += `<td style="text-align:center">${actionListInfo[i].statusMessage}</td>`

        str += `</tr>`

        $("#actionsMasterModalTable").append(str)

        $(lastBtnInRow).click()

    }


    $("#actionsMasterModalTable #actionIds1").click();

    let checkAllActionListIsNull = actionListInfo.every(item => item.actionList == null)
    checkAllActionListIsNull ? $("#modal_saveMasterActions").addClass("d-none") : $("#modal_saveMasterActions").removeClass("d-none")

    modal_show("actionsMadterModal")

}

function tr_onkeydownDisplay(rowNo, elm, e) {

    if (e.keyCode == KeyCode.ArrowUp) {
        e.preventDefault();
        if ($(`#actionsModalTable > tr#actionIds${rowNo - 1}`).length > 0) {
            $(`#actionsModalTable > tr.highlight`).removeClass("highlight");
            $(`#actionsModalTable > tr#actionIds${rowNo - 1}`).addClass("highlight");
            $(`#actionsModalTable > tr#actionIds${rowNo - 1}`).focus();
        }
    }
    else if (e.keyCode == KeyCode.ArrowDown) {
        e.preventDefault();
        if ($(`#actionsModalTable > tr#actionIds${rowNo + 1}`).length > 0) {
            $(`#actionsModalTable > tr.highlight`).removeClass("highlight");
            $(`#actionsModalTable > tr#actionIds${rowNo + 1}`).addClass("highlight");
            $(`#actionsModalTable > tr#actionIds${rowNo + 1}`).focus();
        }
    }

}

async function modal_saveMasterActions(modalName, elm, lastId = null) {

    loadingAsync(true, "modal_saveMasterActions", "fa fa-check-circle");
    $("#actionsMasterModal #modal-close").prop("disabled", true)

    admissionMasterSaveActions(modalName, elm, lastId)
}

async function admissionMasterSaveActions(modalName, elm, lastId) {
    
    await setMasterLastActionId(lastId)

    let AllActionsIsSet = await checkAllActionsIsSet()
    if (!AllActionsIsSet)
        return

    let modelList = []

    for (let i = 0; i < selectLineInfo.length; i++) {

        let model = {
            patientId: selectLineInfo[i].patientId,
            requestActionId: selectLineInfo[i].actionId,
            stageId: selectLineInfo[i].stageId,
            branchId: selectLineInfo[i].branchId,
            identityId: selectLineInfo[i].admissionMasterId,
            admissionMasterId: selectLineInfo[i].admissionMasterId,
            workFlowId: selectLineInfo[i].workflowId,
            workflowCategoryId: +workflowCategoryIds.medicalMaster.id,
            currentActionId: selectLineInfo[i].actionId,
        }

        modelList.push(model)

        if (modelList[i].requestActionId == 0) {
            actionErr.push({
                admissionId: model.identityId,
                err: "گام برای این شناسه مشخص نشده است"
            })
        }

        let response = await admissionMasterValidateStageActionLog(model)

        if (response.length != 0)
            actionErr.push({
                admissionId: model.identityId,
                err: generateErrorString(response)
            })
    }

    if (actionErr.length != 0)
        showActionErrors()
    else
        updateActionAdmissionsMaster(modelList)

}


function checkAllActionsIsSet() {

    for (let i = 0; i < selectLineInfo.length; i++) {
        if (selectLineInfo[i].actionId == null) {
            alertify.warning("تعدادی از سطر ها ، گام انتخاب نشده است").delay(admission.delay);
            loadingAsync(false, "modal_saveMasterActions", "fa fa-check-circle");
            $("#modal_saveMasterActions").prop("disabled", false)
            $("#actionsMadterModal #modal-close").prop("disabled", false)
            return false
        }
    }

    return true
}

function setMasterLastActionId(lastId) {
    if (checkResponse(lastId))
        for (let i = 0; i < selectLineInfo.length; i++) {
            selectLineInfo[i].actionId = lastId
        }
    else
        selectLineInfo = selectLineInfo.filter(item => item.actionList == null)
}

async function admissionMasterValidateStageActionLog(model) {

   let viewData_validateupdatestep_url = `/api/MC/AdmissionMasterApi/validationadmissionmaster`
    var promise = new Promise(function (resolve, reject) {

        $.ajax({
            url: viewData_validateupdatestep_url,
            cache: false,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(model),
            success: function (result) {
                resolve(result)
            },
            error: function (xhr) {
                reject(null)
                error_handler(xhr, viewData_validateupdatestep_url);
            }
        });
    });

    return promise;

}

function run_button_inboundMasterservicelist(id, rowNo) {
    var admissionMasterId = +$(`#row${rowNo}`).data("id");

    var check = controller_check_authorize(viewData_controllername, "VIW");
    if (!check)
        return;

    admissionMasterDisplay(admissionMasterId)
};

function updateActionAdmissionsMaster(modelList) {

    actionErr = []
    let theLast = false
    for (let i = 0; i < modelList.length; i++) {
        if (modelList[i + 1] == undefined)
            theLast = true
        updateStatusAdmissionMaster(modelList[i], theLast);
    }

}

function updateStatusAdmissionMaster(model, theLast = null) {

    let viewData_updateAdmissionStep_url = `${viewData_baseUrl_WF}/StageActionLogApi/insertlog`

    $.ajax({
        url: viewData_updateAdmissionStep_url,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (result) {

            if (result.successfull) {
                if (theLast == null) {
                    alertify.success(result.statusMessage).delay(alertify_delay);
                    updateMasterlastaction(model.requestActionId, null, model.admissionMasterId)
                }
                else
                    updateMasterlastaction(model.requestActionId, theLast, model.admissionMasterId)
            }
            else {

                if (theLast == null) {
                    let errorText = generateErrorString(result.validationErrors);
                    alertify.error(errorText).delay(alertify_delay);
                    isSetActionAccess = true

                }
                else {
                    actionErr.push({
                        admissionId: model.identityId,
                        err: generateErrorString(result.validationErrors)
                    })
                    if (theLast)
                        showActionErrors()

                }
            }

        },
        error: function (xhr) {
            error_handler(xhr, viewData_updateTreasuryStep_url);
            isSetActionAccess = true
        }
    });
}

function updateMasterlastaction(actionId, theLast, admissionMasterId) {

    let updatelastaction_url = `/api/MC/AdmissionMasterApi/updatelastaction/${admissionMasterId}/${actionId}`

    $.ajax({
        url: updatelastaction_url,
        async: false,
        type: "get",
        dataType: "json",
        contentType: "application/json",
        success: function (result) {

            if (theLast == null) {
                $("#refreshAdmissionMasterPagetable").click();
                modal_close("actionMasterModal")
                modal_close("actionsMadterModal")
                isSetActionAccess = true
            }
            else {
                if (theLast) {
                    $("#refreshAdmissionMasterPagetable").click();
                    showActionErrors()
                }
            }
        },
        error: function (xhr) {
            error_handler(xhr, updatelastaction_url);
            isSetActionAccess = true
        }
    });
}

async function showActionErrors() {
    
    let messageSeparation = _.uniqWith(actionErr, (a, b) => a.err.trim().split(" ").join("") == b.err.trim().split(" ").join(""))
    let errorsModel = []

    for (let i = 0; i < messageSeparation.length; i++) {
        let message = messageSeparation[i].err
        let currentIds = ""

        for (let j = 0; j < actionErr.length; j++) {
            let currentActionErr = actionErr[j].err

            if (message == currentActionErr) {
                if (j == 0)
                    currentIds += `${actionErr[j].admissionId}`
                else
                    currentIds += `<span style="color:red !important"> , </span> ${actionErr[j].admissionId}`
            }
        }

        errorsModel.push({
            ids: currentIds,
            err: message
        })
    }



    if (errorsModel.length == 0)
        alertify.success("تمام سطر ها با موفقیت ذخیره شده اند");
    else {
        let str = ""

        for (let i = 0; i < errorsModel.length; i++) {

            str += `<tr>
                        <td style="text-align:center" rowspan="2">${i + 1}</td>
                        <td>
                            <div class="d-flex justify-content-between w-100">
                                <div id="showIds${i}" class="showIds">${errorsModel[i].ids}</div>
                                <div class="mr-2 d-flex">
                                    <div>
                                        <button class="btn btn-light border-orange mr-2" title="دریافت شناسه ها" onclick="copyIdsToClipboard(${i})"><i class="fas fa-copy"></i></button>
                                    </div>
                                    <div>
                                        <button id="loadMoreIds${i}" class="btn btn-light border-orange mr-1" title="نمایش بیشتر" onclick="loadMoreIds(${i} ,this,event)"><i class="fas fa-plus"></i></button>
                                    </div>
                                </div>
                            </div>               
                        </td>
                    </tr>
                    <tr>
                        <td>${errorsModel[i].err}</td>
                    </tr>
                `
        }

        $("#actionErrTable").html(str)
        modal_show("actionErrModal")
    }



    loaderOnPageTable(false, "tabBoxByAction")
    modal_close("actionMasterModal")
    modal_close("actionsMadterModal")
    isSetActionAccess = true

}

function copyIdsToClipboard(rowNo) {
    navigator.clipboard.writeText($(`#showIds${rowNo}`).text());
}

async function loadingAsync(loading, elementId, iconClass) {
    if (loading) {
        $(`#${elementId} i`).addClass(`fa-spinner fa-spin`);
        $(`#${elementId}`).prop("disabled", true)
    }
    else {
        $(`#${elementId} i`).removeClass("fa-spinner fa-spin");
        $(`#${elementId}`).prop("disabled", false)
    }
}

function loadMoreIds(rowNo, elm, e) {

    let showIdsElm = $(`#showIds${rowNo}`)

    if (showIdsElm.hasClass("showAllIds")) {
        showIdsElm.removeClass("showAllIds")
        $(`#loadMoreIds${rowNo} i`).removeClass("fa-minus").addClass("fa-plus")
    }

    else {
        showIdsElm.addClass("showAllIds")
        $(`#loadMoreIds${rowNo} i`).removeClass("fa-plus").addClass("fa-minus")
    }


}

function run_button_previousMasterAction(admissionId, rowNo, elm, e) {

    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return

    runButtonMasterPreviousOrNextAction(admissionId, rowNo, elm, e, 1)
}

function run_button_nextMasterAction(admissionId, rowNo, elm, e) {

    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;

    runButtonMasterPreviousOrNextAction(admissionId, rowNo, elm, e, 2)
}

function runButtonMasterPreviousOrNextAction(admissionId, rowNo, elm, e, direction)
{

    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;
    
    let element = $(elm).parent().parent();
    let branchId = element.data("branchid");
    let workflowId = element.data("workflowid");
    let stageId = element.data("stageid");
    let admissionWorkflowCategoryId = +workflowCategoryIds.medicalMaster.id;
    let workflow = element.data("workflow");
    let stage = element.data("stage");
    let admissionMasterId = element.data("id");
    let patientId = element.data("patientid");
    let actionId = +element.parents(".card-body").prop("id").split("_")[2]

    let model = {
        direction,
        admissionId,
        branchId,
        workflowId,
        stageId,
        admissionWorkflowCategoryId,
        actionId,
        currentActionId: actionId,
        admissionMasterId,
        patientId
    }

    let previousActionUrl = `${viewData_baseUrl_MC}/${viewData_controllername}/checkupdateactioncartable`
    loaderOnPageTable(true, "tabBoxByAction")
    $.ajax({
        url: previousActionUrl,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (result) {
            loaderOnPageTable(false, "tabBoxByAction")

            if (result.successfull)
                selectActionsConfig(result.actionList, model.patientId, model.admissionId, model.workflowId, model.stageId, model.admissionWorkflowCategoryId, model.branchId, model.actionId, workflow, stage, model.admissionMasterId)
            else
                alertify.error(result.statusMessage).delay(admission.delay);
        },
        error: function (xhr) {
            error_handler(xhr, previousActionUrl);
        }
    });
}

function selectActionsConfig(actionList, patientId, admissionId, workflowId, stageId, admissionWorkflowCategoryId, branchId, actionId, workflow, stage, admissionMasterId) {

    let str = ""

    if (actionList.length > 1) {

        str +=
            `<tr class="highlight" data-admissionid="${admissionId}" data-workflowid="${workflowId}" data-branchid="${branchId}" data-admissionmasterid=${admissionMasterId} data-admissionworkflowcategoryid="${admissionWorkflowCategoryId}"  data-stageid="${stageId}" data-previousactionid="${actionId}">
                 <td style="text-align:center">1</td>
                 <td>${admissionId}</td>
                 <td>${workflow}</td>
                 <td>${stage}</td>
                 <td><div class="btn-group btn-group-toggle" data-toggle="buttons">
             `

        for (let i = 0; i < actionList.length; i++) {
            str += `<label class="btn btn-light ml-2" onclick="setAction('actionsModalTable',this,event,${actionList[i].id},${actionId},${patientId})" style="cursor:pointer;text-wrap: nowrap;">
                         <input type="radio" name="options" id="option1" checked="" style="font-size:11px !important" > 
                         <span>${actionList[i].text}</span>
                    </label>
                `
        }

        str += `</div></td></tr>`

        $("#actionModalTable").html(str)
        $("#actionModalTable #actionId1").addClass("highlight");
        modal_show("actionMasterModal")
    }
    else {
        let modelAction = {
            requestActionId: actionList[0].id,
            actionId: actionId,
            patientId: patientId,
            admissionId: admissionId,
            workflowId: workflowId,
            stageId: stageId,
            admissionWorkflowCategoryId: admissionWorkflowCategoryId,
            branchId: branchId,
            admissionMasterId: admissionMasterId
        }

        updateActionAdmissionMaster(modelAction)
    }
        
}

function setAction(modalName, elm, e, actionId, currentActionId, patientId) {

    let trParent = $(elm).parent().parent().parent();
  
    let modelAction = {
        requestActionId: actionId,
        actionId: currentActionId,
        patientId: patientId,
        admissionId: trParent.data("admissionmasterid"),
        workflowId: trParent.data("workflowid"),
        stageId: trParent.data("stageid"),
        admissionWorkflowCategoryId: +workflowCategoryIds.medicalMaster.id,
        branchId: trParent.data("branchid"),
        admissionMasterId: trParent.data("admissionmasterid")
    }

    updateActionAdmission(modelAction);
}

async function updateActionAdmissionMaster(modelAction) {

    var model = {
        currentActionId: modelAction.actionId,
        requestActionId: modelAction.requestActionId,
        patientId: modelAction.patientId,
        stageId: modelAction.stageId,
        branchId: modelAction.branchId,
        identityId: modelAction.admissionMasterId,
        workFlowId: modelAction.workflowId,
        workflowCategoryId: modelAction.admissionWorkflowCategoryId,
        admissionMasterId: modelAction.admissionMasterId
    }

    if (isSetActionAccess) {
        isSetActionAccess = false

        let resultValidate = await admissionMasterValidateStageActionLog(model);

        if (resultValidate.length == 0)
            updateStatusAdmissionMaster(model);
        else {
            alertify.error(generateErrorString(resultValidate)).delay(alertify_delay);
            modal_close("actionMasterModal")
            isSetActionAccess = true
        }
    }


}


$(".group-box").on("keydown", function (e) {
    if ([KeyCode.key_General_1,KeyCode.key_General_4].indexOf(e.which) == -1) return;

    if (e.ctrlKey && e.keyCode === KeyCode.key_General_1) {
        e.preventDefault();
        printAdmissionMasterShortcut(1);
    }
    
    else if (e.ctrlKey && e.keyCode === KeyCode.key_General_4) {
        e.preventDefault();
        printAdmissionMasterShortcut(4);
    }
});

window.Parsley._validatorRegistry.validators.shamsidate = undefined
window.Parsley.addValidator('shamsidate', {
    validateString: function (value) {
        if (+value !== 0) return isValidShamsiDate(value);
        else return true;
    },
    messages: {
        en: 'فرمت تاریخ صحیح نیست .',
    }
});


initForminboundl();