var viewData_form_title = "محاسبات ریالی انبار",
    viewData_controllername = "UnitCostCalculationLineApi",
    viewData_print_file_url = `${stimulsBaseUrl.WH.Prn}UnitCostCalculationLineDetail.mrt`,
    header_pgnation = 0,
    activePageId = "unitCostCalculationLinePage",
    unitCostCalculation = [],
    modelWarehouse = [],
    fiscalYear = "",
    currentWorkFlowId = 0,
    currentStageId = 0,
    currentBranchId = 0,
    currentIdMonth = 0,
    currentIdRow = 0,
    branchId = 0,
    islockMonth = false,
    currentActionId = 0,
    requestActionId = 0,
    currentCostingMethodId = 0,
    unitcostcalculationlinesid = 0,
    stageActionLogCurrent = { identityId: 0, actionId: 0, currentActionId: 0, stageId: 0, workFlowId: 0, fromDate: null, toDate: null, branchId: 0 };



async function init() {

    let unitCostCalculationId = +$("#unitCostCalculationId").val()
    currentCostingMethodId = +$("#currentCostingMethodId").val()
    viewData_form_title += "-" + fiscalYear
    fiscalYear = $("#fiscalYear").val()
    $("#showId").text(unitCostCalculationId)

    let url = `${viewData_baseUrl_WH}/${viewData_controllername}/getlist`;
    await $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(unitCostCalculationId),
        cache: false,
        success: function (result) {

            if (result.data.length > 0) {
                $("#tableLineTheadColumns").html("")
                $("#tableLineTheadFields").html("")
                fillTableUnitCostCalculationLineTheadColumns()
                fillTableUnitCostCalculationLineTheadFields(result.data, unitCostCalculationId, 1)
            }
            else {
                let emptyStr = `
                        <tr>
                             <td colspan="5" style="text-align:center">سطری وجود ندارد</td>
                        </tr>
                        `
                $("#tableLineTbodyLines").append(emptyStr)

                $("#tableDetailLineTbodyLines").html("")
            }

        },
        error: function (xhr) {
            error_handler(xhr, url)
        }
    });
}

function printUnitCostCalculationLine() {


    var p_id = $(`#${pagetable_id} .btnfilter`).attr("data-id");
    if (p_id == "filter-non")
        p_id = "";

    var p_size = $(`#${pagetable_id} .btnfilter`).attr("data-size");
    viewData_form_title = "محاسبات ریالی ماه های انبار"


    var reportParameters = [
        { Item: "PageNo", Value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "PageRowsCount", value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "UnitCostCalculationLineId", Value: +$(`#tableLineTbodyLines .highlight`).data("unitcostcalculationid"), SqlDbType: dbtype.Int, Size: p_size },
        { Item: "BranchId", Value: currentBranchId, SqlDbType: dbtype.Int, Size: p_size },
        { Item: "Id", value: null, SqlDbType: dbtype.Int, Size: 0 },

    ]

    stimul_report(reportParameters);
}

function unitCostCalculationLineExcel() {



    var csvModel = {
        id: +$(`#tableLineTbodyLines .highlight`).data("unitcostcalculationid"),
        branchId: +currentBranchId,
    }
    let viewData_csvUnitCostCalculationLineDetail_url = `${viewData_baseUrl_WH}/${viewData_controllername}/csv`;
    $.ajax({
        url: viewData_csvUnitCostCalculationLineDetail_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(csvModel),
        cache: false,
        success: function (result) {
            generateCsv(result);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_csvUnitCostCalculationLineDetail_url);
        }
    });
}

function fillTableUnitCostCalculationLineTheadColumns() {
    let strTableLineTheadColumns = ""
    strTableLineTheadColumns += "<tr id=formPlateHeaderTHead>"
    strTableLineTheadColumns += "<th text-align=center>شناسه</th>"
    strTableLineTheadColumns += "<th text-align=center>شعبه</th>"
    strTableLineTheadColumns += "<th text-align=center>جریان کار</th>"
    strTableLineTheadColumns += "<th text-align=center>مرحله</th>"
    strTableLineTheadColumns += "<th text-align=center >عملیات</th>"
    strTableLineTheadColumns += "</tr>"
    $("#tableLineTheadColumns").html(strTableLineTheadColumns)
}

function fillTableUnitCostCalculationLineTheadFields(unitCostCalculation, id, currentlineIdRow) {

    let strtableUnitCostCalculationLineTheadFields = "";

    $("#tableLineTbodyLines").html("")

    for (let i = 0; i < unitCostCalculation.length; i++) {

        id = unitCostCalculation[0].id > 0 ? unitCostCalculation[0].id : id;
        branchId = +stageActionLogCurrent.branchId > 0 ? +stageActionLogCurrent.branchId : +unitCostCalculation[0].branch.split('-')[0]
        currentWorkFlowId = +unitCostCalculation[0].workflow.split('-')[0]
        currentStageId = +unitCostCalculation[0].stage.split('-')[0]

        strtableUnitCostCalculationLineTheadFields += `<tr id="rowItem_${i + 1}" 
                                                               data-unitcostcalculationid="${unitCostCalculation[i].id}" 
                                                               data-branchid="${+unitCostCalculation[i].branch.split('-')[0]}" 
                                                               onclick="newTrOnclick(${i + 1},${unitCostCalculation[i].id},
                                                                                       ${+unitCostCalculation[i].branch.split('-')[0]},
                                                                                       ${+unitCostCalculation[i].workflow.split('-')[0]},
                                                                                       ${+unitCostCalculation[i].stage.split('-')[0]})"
                                                               onkeydown="newTrOnkeydown(event,${i + 1})"
                                                               tabindex="${i + 1}">`

        strtableUnitCostCalculationLineTheadFields += `<td style="width:5%"><div id="id_${i + 1}" type="text" >${unitCostCalculation[i].id}</td>`
        strtableUnitCostCalculationLineTheadFields += `<td style="width:5%"><div id="branchId_${i + 1}" type="text" >${unitCostCalculation[i].branch}</td>`
        strtableUnitCostCalculationLineTheadFields += `<td style="width:5%"><div id="workflowId_${i + 1}" type="text" >${unitCostCalculation[i].workflow}</td>`
        strtableUnitCostCalculationLineTheadFields += `<td style="width:5%"><div id="stageId_${i + 1}" type="text" >${unitCostCalculation[i].stage}</td>`
        strtableUnitCostCalculationLineTheadFields += `<td style="width:5%">
                                                            <div style="display:flex;width:100%">
                                                                <button id="selectRow" type="button"
                                                                    onclick="selectRow(${unitCostCalculation[i].id},
                                                                                       ${+unitCostCalculation[i].branch.split('-')[0]},
                                                                                       ${+unitCostCalculation[i].workflow.split('-')[0]},
                                                                                       ${+unitCostCalculation[i].stage.split('-')[0]})" 
                                                                    class="btn blue_outline_1"><i class="fa fa-check" aria-hidden="true"></i>
                                                                </button>                                                                  
                                                            </div>
                                                           </td>`

        strtableUnitCostCalculationLineTheadFields += "</tr>"
    }

    $("#tableLineTbodyLines").html(strtableUnitCostCalculationLineTheadFields)

    $(`#tableLineTbodyLines #rowItem_1`).addClass("highlight");

    selectRow(id, branchId, currentWorkFlowId, currentStageId, currentlineIdRow)

}

function selectRow(id, branchid, workflowId, stageId, currentlineIdRow) {

    if (id > 0) {
        currentWorkFlowId = workflowId;
        currentStageId = stageId;
        currentBranchId = +branchid
        let model = {
            Id: id,
            BranchId: branchid,
        }

        let url = `${viewData_baseUrl_WH}/${viewData_controllername}/getlinedetailpage`;

        $.ajax({
            url: url,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(model),
            cache: false,
            success: function (result) {

                $("#tableDetailLineTheadColumns").html("")
                $("#tableDetailLineTheadFields").html("")

                fillTableUnitCostCalculationDetailLineTheadColumns()
                fillTableUnitCostCalculationDetailLineTheadFields(result.data, currentlineIdRow)

            },
            error: function (xhr) {
                error_handler(xhr, url)
            }
        });

    }
}

function newTrOnclick(row, id, branchId, workflowId, stageId, currentlineIdRow) {

    selectRow(id, branchId, workflowId, stageId, currentlineIdRow);

    new_tr_Highlight(row);
}

function new_tr_Highlight(row) {
    $(`#tableLineTbodyLines .highlight`).removeClass("highlight");
    $(`#tableLineTbodyLines #rowItem_${row}`).addClass("highlight");
    $(`#tableLineTbodyLines #rowItem_${row}`).focus();
}

function newTrOnkeydown(ev, row) {

    if (ev.which === KeyCode.ArrowUp) {
        ev.preventDefault();
        if ($(`#tableLineTbodyLines #rowItem_${row - 1}`).length != 0) {
            $(`#tableLineTbodyLines .highlight`).removeClass("highlight");
            $(`#tableLineTbodyLines #rowItem_${row - 1}`).addClass("highlight");
            $(`#tableLineTbodyLines #rowItem_${row - 1}`).focus();
        }

    } else if (ev.which === KeyCode.ArrowDown) {
        ev.preventDefault();
        if ($(`#tableLineTbodyLines #rowItem_${row + 1}`).length != 0) {
            $(`#tableLineTbodyLines .highlight`).removeClass("highlight");
            $(`#tableLineTbodyLines #rowItem_${row + 1}`).addClass("highlight");
            $(`#tableLineTbodyLines #rowItem_${row + 1}`).focus();
        }
    }


    let unitcostcalculationid = $(`#tableLineTbodyLines .highlight`).data("unitcostcalculationid")
    let branchid = $(`#tableLineTbodyLines .highlight`).data("branchid")

    //selectRow(unitcostcalculationid, branchid, currentWorkFlowId, currentStageId)
}

function fillTableUnitCostCalculationDetailLineTheadFields(unitCostCalculationDetail, currentlineIdRow) {

    $("#tableLineDetailTbodyLineslegend").text("ماه های -" + fiscalYear)

    $("#tableDetailLineTbodyLines").html("")

    let strtableUnitCostCalculationDetailLineTheadFields = ""

    let locked = "";
    let month = "";
    let startDatePersian = "";
    let endDatePersian = "";
    for (let i = 0; i < unitCostCalculationDetail.length; i++) {

        locked = (unitCostCalculationDetail[i].locked == 1 ? "fas fa-check" : "");
        month = unitCostCalculationDetail[i].month;

        startDatePersian = "";
        endDatePersian = "";

        startDatePersian = unitCostCalculationDetail[i].startDatePersian
        endDatePersian = unitCostCalculationDetail[i].endDatePersian

        strtableUnitCostCalculationDetailLineTheadFields += `<tr id="rowDetailItem_${i + 1}"
                                                                 data-month="${unitCostCalculationDetail[i].month}" 
                                                                 data-action="${unitCostCalculationDetail[i].action}"
                                                                 onclick="newTrLineDetailOnclick(${i + 1})"
                                                                 onkeydown="newTrLineDetailOnkeydown(event,${i + 1})" 
                                                                 tabindex=${i + 1}>`
        strtableUnitCostCalculationDetailLineTheadFields += `<td style="width:13%"><div id="month_${i + 1}" type="text" >${unitCostCalculationDetail[i].month}</td>`
        strtableUnitCostCalculationDetailLineTheadFields += `<td style="width:13%"><div id="startDatePersian_${i + 1}" type="text" >${unitCostCalculationDetail[i].startDatePersian}</td>`
        strtableUnitCostCalculationDetailLineTheadFields += `<td style="width:13%"><div id="endDatePersian_${i + 1}" type="text" >${unitCostCalculationDetail[i].endDatePersian}</td>`
        strtableUnitCostCalculationDetailLineTheadFields += `<td style="width:9%"><div id="locked_${i + 1}" type="text" class="${locked}" ></td>`
        strtableUnitCostCalculationDetailLineTheadFields += `<td style="width:13%"><div id="action_${i + 1}" type="text" >${unitCostCalculationDetail[i].action}</td>`
        strtableUnitCostCalculationDetailLineTheadFields += `<td style="width:13%"><div id="userFullName_${i + 1}" type="text" >${unitCostCalculationDetail[i].userFullName}</td>`
        strtableUnitCostCalculationDetailLineTheadFields += `<td style="width:13%"><div id="createDateTimePersian_${i + 1}" type="text" >${unitCostCalculationDetail[i].createDateTimePersian}</td>`
        strtableUnitCostCalculationDetailLineTheadFields += `<td style="width:13%">
                                                                <div style="display:flex;width:100%">
                                                                  <button id="selectStep" type="button"
                                                                     onclick="run_button_showStepLogsUnitCostCalculationDetail(
                                                                        ${i + 1},${unitCostCalculationDetail[i].id},${+unitCostCalculationDetail[i].action.split('-')[0]},${+unitCostCalculationDetail[i].month.split('-')[0]},${+unitCostCalculationDetail[i].locked == 1 ? false : true},'${startDatePersian}','${endDatePersian}')" 
                                                                     class="btn blue_1 waves-effect"><i class="fas fa-history"></i>گام ها</button>
                                                                </div>
                                                             </td>`
        strtableUnitCostCalculationDetailLineTheadFields += "</tr>"
    }


    $("#tableDetailLineTbodyLines").html(strtableUnitCostCalculationDetailLineTheadFields)

    currentlineIdRow = currentlineIdRow == 0 ? 1 : currentlineIdRow;

    $(`#tableDetailLineTbodyLines #rowDetailItem_1`).addClass("highlight");
}

function fillTableUnitCostCalculationDetailLineTheadColumns() {
    let strTableDetailLineTheadColumns = ""
    strTableDetailLineTheadColumns += "<tr>"
    strTableDetailLineTheadColumns += "<th>ماه</th>"
    strTableDetailLineTheadColumns += "<th>تاریخ شروع</th>"
    strTableDetailLineTheadColumns += "<th>تاریخ پایان</th>"
    strTableDetailLineTheadColumns += "<th>بستن دوره ی مالی</th>"
    strTableDetailLineTheadColumns += "<th>گام</th>"
    strTableDetailLineTheadColumns += "<th>کاربر ثبت کننده</th>"
    strTableDetailLineTheadColumns += "<th>تاریخ ثبت</th>"
    strTableDetailLineTheadColumns += "<th>عملیات</th>"
    strTableDetailLineTheadColumns += "</tr>"
    $("#tableDetailLineTheadColumns").html(strTableDetailLineTheadColumns)
}

function newTrLineDetailOnclick(row) {
    new_trLineDetail_Highlight(row)
}

function new_trLineDetail_Highlight(row) {

    $("#itemUnitCostUpdateStepPageTablefieldset").addClass("displaynone");
    $("#tempUnitCostErrorUpdateStepResultLines").html("");

    $("#itemUnitCostCalculationTablefieldset").addClass("displaynone");
    $("#tempErrorUnitCostCalculationResultLines").html("");

    $(`#tableDetailLineTbodyLines .highlight`).removeClass("highlight");
    $(`#tableDetailLineTbodyLines #rowDetailItem_${row}`).addClass("highlight");
    $(`#tableDetailLineTbodyLines #rowDetailItem_${row}`).focus();

}

function newTrLineDetailOnkeydown(ev, row) {


    if (ev.which === KeyCode.ArrowUp) {
        ev.preventDefault();
        if ($(`#tableDetailLineTbodyLines #rowItem_${row - 1}`).length != 0) {
            $(`#tableDetailLineTbodyLines .highlight`).removeClass("highlight");
            $(`#tableDetailLineTbodyLines #rowItem_${row - 1}`).addClass("highlight");
            $(`#tableDetailLineTbodyLines #rowItem_${row - 1}`).focus();
        }

    } else if (ev.which === KeyCode.ArrowDown) {
        ev.preventDefault();
        if ($(`#tableDetailLineTbodyLines #rowItem_${row + 1}`).length != 0) {
            $(`#tableDetailLineTbodyLines .highlight`).removeClass("highlight");
            $(`#tableDetailLineTbodyLines #rowItem_${row + 1}`).addClass("highlight");
            $(`#tableDetailLineTbodyLines #rowItem_${row + 1}`).focus();
        }
    }

}

function display_pagination_display(opr) {
    var elemId = +$("#unitCostCalculationId").val();
    display_paginationAsync_display(opr, elemId);
}

async function display_paginationAsync_display(opr, elemId) {

    headerPagination = 0;
    switch (opr) {
        case "first":
            headerPagination = 1;
            break;
        case "previous":
            headerPagination = 2;
            break;
        case "next":
            headerPagination = 3;
            break;
        case "last":
            headerPagination = 4;
            break;
    }

    initDisplayUnitCostCalculationFrom(headerPagination, elemId)
}

function initDisplayUnitCostCalculationFrom(headerPagination = 0, id = 0) {

    callbackForFillTableLineTbodyLines(headerPagination, id);
}

function callbackForFillTableLineTbodyLines(headerPagination, id, currentlineIdRow) {

    let model = {
        id: id,
        directPaging: headerPagination,
    }
    let url = `${viewData_baseUrl_WH}/${viewData_controllername}/display`;
    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        async: false,
        cache: false,
        success: function (result) {

            if (result.data.length > 0) {
                $("#tableLineTheadColumns").html("")
                $("#tableLineTheadFields").html("")
                fillTableUnitCostCalculationLineTheadColumns()

                fillTableUnitCostCalculationLineTheadFields(result.data, id, currentlineIdRow)
            }
            else
                alertify.warning("این کد در سیستم وجود ندارد").delay(alertify_delay);
        },
        error: function (xhr) {
            error_handler(xhr, url)
        }
    });
}

function headerindexChoose_display(e) {

    let elm = $(e.target);
    if (e.keyCode === KeyCode.Enter)
        initDisplayUnitCostCalculationFrom(0, +elm.val());
}

function run_button_showStepLogsUnitCostCalculationDetail(row, id, currentactionid, monthid, islock, startDate, endDate) {

    if (!islock)
        alertify.warning(`ماه انتخابی بسته است امکان تغییر گام ندارید`).delay(alertify_delay);

    else {

        currentIdmonth = monthid;
        currentIdRow = +row;

        stageActionLogCurrent.fromDate = startDate;
        stageActionLogCurrent.toDate = endDate;

        stageActionLogCurrent = { identityId: +id, actionId: +currentactionid, stageId: currentStageId, workFlowId: currentWorkFlowId, fromDate: startDate, toDate: endDate, branchId: currentBranchId }


        $("#actionUnitCostCalculationLine").empty();

        fill_dropdown(`${viewData_baseUrl_WF}/StageActionApi/getdropdownactionlistbystage`, "id", "name", "actionUnitCostCalculationLine", true, `${stageActionLogCurrent.stageId}/${stageActionLogCurrent.workFlowId}/1/0/${stageActionLogCurrent.branchId}/${workflowCategoryIds.warehouse.id}/true/null`);


        $("#actionUnitCostCalculationLine").val(stageActionLogCurrent.actionId);

        stepLogModalUnitCostCalculationLine(stageActionLogCurrent.identityId, stageActionLogCurrent.stageId, stageActionLogCurrent.workFlowId);

        modal_show("stepLogModalUnitCostCalculationLine");
    }
}

function stepLogModalUnitCostCalculationLine(id, stageId, workFlowId) {

    let url = `${viewData_baseUrl_WF}/StageActionLogApi/getsteplist`;

    $("#stepLogRowsUnitCostCalculationLine").html("");
    $.ajax({
        url: `${url}/${id}/${stageId}/${workFlowId}`,
        async: false,
        type: "get",
        dataType: "json",
        contentType: "application/json",
        success: function (result) {

            var dataList = result.data;
            var listlen = dataList == null ? 0 : dataList.length, trString;
            for (var i = 0; i < listlen; i++) {
                var data = dataList[i];
                trString = `<tr ${i == 0 ? `style="color: green;"` : ""}><td>${data.action}</td><td>${data.userFullName}</td><td>${data.createDateTimePersian}</td></tr>`;
                $("#stepLogRowsUnitCostCalculationLine").append(trString);
            }
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });
}

function update_actionUnitCostCalculationLine() {

    var requestActionId = $("#actionUnitCostCalculationLine").val();
    var monthId = $(`#tableDetailLineTbodyLines #rowDetailItem_${currentIdRow}`).data("month").split('-')[0];

    let model = {
        id: +$(`#tableLineTbodyLines .highlight`).data("unitcostcalculationid"),
        monthId: +monthId,
        requestActionId: +requestActionId
    }

    let url = `api/WH/UnitCostCalculationLineApi/getunitcostcalculationlinedetailinfo`;

    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        cache: false,
        success: function (result) {

            var listMonth = ""
            if (result.data.length > 0) {
                for (var i = 0; i < result.data.length; i++) {
                    listMonth += result.data[i].month + ","
                }
                alertify.warning(`ابتدا وضعیت گام های ماه : ${listMonth}  را مشخص نمایید!`).delay(alertify_delay);
                $("#actionUnitCostCalculationLine").val(stageActionLogCurrent.actionId).trigger("change.select2");
            }
            else
                updateaction(currentIdRow);
        },
        error: function (xhr) {
            error_handler(xhr, url)
        }
    });
}

function updateaction(currentIdRow) {

    requestActionId = +$("#actionUnitCostCalculationLine").val();
    $("#itemUnitCostUpdateStepPageTablefieldset").addClass("displaynone");
    $("#tempUnitCostErrorUpdateStepResultLines").html("");

    $("#itemUnitCostCalculationTablefieldset").addClass("displaynone");
    $("#tempErrorUnitCostCalculationResultLines").html("");

    unitcostcalculationlinesid = $(`#tableLineTbodyLines .highlight`).data("unitcostcalculationid")

    var model = {
        requestActionId: +$("#actionUnitCostCalculationLine").val(),
        currentActionId: stageActionLogCurrent.actionId,
        stageId: stageActionLogCurrent.stageId,
        workflowId: stageActionLogCurrent.workFlowId,
        identityId: stageActionLogCurrent.identityId,
        branchId: +stageActionLogCurrent.branchId,
        workflowCategoryId: 11,
        fromDatePersian: stageActionLogCurrent.fromDate,
        toDatePersian: stageActionLogCurrent.toDate,
        unitCostCalculationLineId: unitcostcalculationlinesid,
        costingMethodId: +$("#currentCostingMethodId").val()
    }
    var stepPermissionid = GetRoleWorkflowStageStepPermission(model.workflowId, model.stageId, model.requestActionId);
    if (stepPermissionid > 0) {
        if (model.requestActionId != model.currentActionId)
            checkValidateUpdateStep(model, currentIdRow);

        else {
            var msgItem = alertify.warning("لطفا گام را مشخص کنید");
            msgItem.delay(alertify_delay);
        }
    }
    else {
        var msgItem = alertify.warning("دسترسی به گام انتخابی ندارید");
        msgItem.delay(alertify_delay);
        $("#actionUnitCostCalculationLine").val(model.currentActionId)
    }
}

function checkValidateUpdateStep(model, currentIdRow) {

    let url = `${viewData_baseUrl_WH}/UnitCostCalculationLineApi/validateupdatestep`;
    $.ajax({
        url: url,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (result) {

            if (result.successfull) {
                // گام 2 به 29 و یا گام 29 به 30 مانده باید چک شود
                if (result.currentPriority < result.requestPriority) {

                    //گام 2 به 29
                    if (model.requestActionId == 29 && result.unitCostCalculationWarehouse)
                        getLastCostOfItem(model, true);

                    //گام 29 به 30
                    else if (model.requestActionId == 30 && result.unitCostCalculationWarehouse)
                        getLastCostOfItem(model, false);

                    else
                        sendDocument(model, () => {
                            updateStatus(model, currentIdRow);
                        });
                }
                //برگشت گام 
                else {

                    if (model.requestActionId == 2)
                        updatepurchasedprice(model, true)

                    else if (model.requestActionId == 29)
                        updatelineprice(model, true)

                    else {
                        sendDocument(model, () => {
                            updateStatus(model, currentIdRow);

                        });
                    }

                }
            }
            else {
                if (checkResponse(result.validationErrors)) {
                    let messages = generateErrorString(result.validationErrors);
                    alertify.error(messages).delay(alertify_delay);

                    $("#actionUnitCostCalculationLine").val(model.currentActionId).trigger("change.select2");
                }
            }
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });

}

function getLastCostOfItem(model, isCostOfItemInvoice) {

    var p_url = `${viewData_baseUrl_WH}/UnitCostCalculationLineApi/getlastcostOfitem`;

    let newmodel = {
        fromDatePersian: model.fromDatePersian,
        toDatePersian: model.toDatePersian,
        isCostOfItemInvoice: isCostOfItemInvoice
    }

    $.ajax({
        url: p_url,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(newmodel),
        success: function (result) {

            if (result.data.length > 0) {
                alertify.warning("وضعیت لیست را مشخص کنید");
                $("#actionUnitCostCalculationLine").val(stageActionLogCurrent.actionId).trigger("change.select2");
                showErrorValidtionUpdateStep(result.data);
            }

            else {
                if (isCostOfItemInvoice)
                    updatepurchasedprice(model, false)
                else
                    updatelineprice(model, false)
            }

        },
        error: function (xhr) {
            error_handler(xhr, p_url);
        }
    });
}

function export_csvUnitCostUpdateStep() {
    let unitCostUpdateStepModel = null;

    let csv_UnitCostUpdateStep = [];
    csv_UnitCostUpdateStep[0] = stageActionLogCurrent.fromDate;
    csv_UnitCostUpdateStep[1] = stageActionLogCurrent.toDate;
    csv_UnitCostUpdateStep[2] = requestActionId == 29 ? true : false;
    csv_UnitCostUpdateStep[3] = true;

    setTimeout(function () {

        if (unitCostUpdateStepModel == null) {
            unitCostUpdateStepModel = {
                Filters: [],
                Form_KeyValue: csv_UnitCostUpdateStep
            }
        }
        viewData_form_title = "لیست سفارشات تعیین وضعیت نشده";
        let url = `${viewData_baseUrl_WH}/UnitCostCalculationLineApi/csvunitcostupdatestep`;
        $.ajax({
            url: url,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(unitCostUpdateStepModel),
            cache: false,
            success: function (result) {

                $("#actionUnitCostCalculationLine").val(stageActionLogCurrent.actionId).trigger("change")
                generateCsv(result);

            },
            error: function (xhr) {
                error_handler(xhr, url);
            }
        });
    }, 500);
}

function export_csvUnitCost() {

    let unitCostModel = null;

    let csv_UnitCost = [];
    csv_UnitCost[0] = stageActionLogCurrent.fromDate;
    csv_UnitCost[1] = stageActionLogCurrent.toDate;
    csv_UnitCost[2] = requestActionId == 29 ? true : false;
    csv_UnitCost[3] = false;
    setTimeout(function () {

        if (unitCostModel == null) {
            unitCostModel = {
                Filters: [],
                Form_KeyValue: csv_UnitCost
            }
        }
        viewData_form_title = "لیست انبارهای تعیین وضعیت نشده";
        let url = `${viewData_baseUrl_WH}/UnitCostCalculationLineApi/csvunitcostupdatestep`;
        $.ajax({
            url: url,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(unitCostModel),
            cache: false,
            success: function (result) {

                $("#actionUnitCostCalculationLine").val(stageActionLogCurrent.actionId).trigger("change")
                generateCsv(result);

            },
            error: function (xhr) {
                error_handler(xhr, url);
            }
        });
    }, 500);
}

function updatepurchasedprice(model, isReturn) {

    var p_url = `${viewData_baseUrl_WH}/UnitCostCalculationLineApi/updatepurchasedprice`;
    let newmodel = {
        fromDatePersian: model.fromDatePersian,
        toDatePersian: model.toDatePersian,
        isReturn: isReturn,
        branchId: model.branchId
    }

    $.ajax({
        url: p_url,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(newmodel),
        success: function (result) {

            if (result.successfull) {
                if (model.requestActionId == 2)
                    updateStatus(model, currentIdRow);
                else {
                    sendDocument(model, () => {
                        updateStatus(model, currentIdRow);
                    });

                }
            }

            else {

                $("#actionUnitCostCalculationLine").val(stageActionLogCurrent.actionId).trigger("change.select2");
                alertify.error(result.statusMessage).delay(alertify_delay);
            }

        },
        error: function (xhr) {
            error_handler(xhr, p_url);
        }
    });
}

function updatelineprice(model, isReturn) {

    var p_url = `${viewData_baseUrl_WH}/UnitCostCalculationLineApi/updatelineprice`;

    let newmodel = {
        fromDatePersian: model.fromDatePersian,
        toDatePersian: model.toDatePersian,
        isReturn: isReturn,
        branchId: model.branchId,
        costingMethodId: model.costingMethodId
    }

    $.ajax({
        url: p_url,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(newmodel),
        success: function (result) {

            if (result.successfull)
                sendDocument(model,
                    () => {
                        updateStatus(model, currentIdRow);
                    });

            else {

                $("#actionUnitCostCalculationLine").val(stageActionLogCurrent.actionId).trigger("change.select2");
                alertify.error(result.statusMessage).delay(alertify_delay);
            }
        },
        error: function (xhr) {
            error_handler(xhr, p_url);
        }
    });
}

function showErrorValidtionUpdateStep(errors) {
    $("#itemUnitCostUpdateStepPageTablefieldset").removeClass("displaynone");
    $("#tempUnitCostErrorUpdateStepResultLines").html("");

    $("#itemUnitCostCalculationTablefieldset").removeClass("displaynone");
    $("#tempErrorUnitCostCalculationResultLines").html("");

    if (errors !== null) {
        let strPurchacetableLineTheadFields = "";
        let strtableLineTheadFields = "";

        for (var i = 0; i < errors.length; i++) {
            if (errors[i].workflowCategoryId == 1) {
                strPurchacetableLineTheadFields += `<tr id="row_${i + 1}" tabindex=${i + 1}>`
                strPurchacetableLineTheadFields += `<td style="width:13%"><div id="id_${i + 1}"  type="text" >${errors[i].id}</td>`
                strPurchacetableLineTheadFields += `<td style="width:13%"><div id="workflow_${i + 1}" type="text" >${errors[i].workflow}</td>`
                strPurchacetableLineTheadFields += `<td style="width:13%"><div id="stage_${i + 1}" type="text" >${errors[i].stage}</td>`
                strPurchacetableLineTheadFields += `<td style="width:13%"><div id="action_${i + 1}" type="text" >${errors[i].action}</td>`
                strPurchacetableLineTheadFields += `<td style="width:13%"><div id="date_${i + 1}" type="text" >${errors[i].documentDatePersian}</td>`
                strPurchacetableLineTheadFields += "</tr>"
            }
            else {
                strtableLineTheadFields += `<tr id="row_${i + 1}" tabindex=${i + 1}>`
                strtableLineTheadFields += `<td style="width:13%"><div id="id_${i + 1}"  type="text" >${errors[i].id}</td>`
                strtableLineTheadFields += `<td style="width:13%"><div id="workflow_${i + 1}" type="text" >${errors[i].workflow}</td>`
                strtableLineTheadFields += `<td style="width:13%"><div id="stage_${i + 1}" type="text" >${errors[i].stage}</td>`
                strtableLineTheadFields += `<td style="width:13%"><div id="action_${i + 1}" type="text" >${errors[i].action}</td>`
                strtableLineTheadFields += `<td style="width:13%"><div id="date_${i + 1}" type="text" >${errors[i].documentDatePersian}</td>`
                strtableLineTheadFields += "</tr>"
            }
        }

        if (strPurchacetableLineTheadFields != "")
            $(`#tempErrorUnitCostCalculationUpdateStepResultLines`).html(strPurchacetableLineTheadFields);

        else
            $("#itemUnitCostUpdateStepPageTablefieldset").addClass("displaynone");

        if (strtableLineTheadFields != "")
            $(`#tempErrorUnitCostCalculationResultLines`).html(strtableLineTheadFields);
        else
            $("#itemUnitCostCalculationTablefieldset").addClass("displaynone");

        modal_show("stepLogModalUnitCostCalculationLine");
    }


}

function sendDocument(model, callBack) {

    let obj = {
        stageId: model.stageId,
        actionId: model.requestActionId,
        workflowId: model.workflowId
    }

    let newmodel = {
        identityId: +model.identityId,
        stageId: +model.stageId,
        fromDatePersian: stageActionLogCurrent.fromDate,
        toDatePersian: stageActionLogCurrent.toDate

    }

    let requestedStageStep = checkIsSendActionId(obj), viewModelSend = {};
    if (requestedStageStep.isPostedGroup) {

        let isPostGroupList = hasPostGroup(newmodel);
        if (isPostGroupList.length === 0) {
            viewModelSend = {
                model: {
                    id: +model.identityId,
                    stageId: +model.stageId,
                    workflowId: +model.workflowId,
                    fromDatePersian: stageActionLogCurrent.fromDate,
                    toDatePersian: stageActionLogCurrent.toDate,
                    currentActionId: +model.currentActionId
                },
                url: `${viewData_baseUrl_FM}/FinanceOperation/PostGroupSystemApi/warehouseTransactionpost`
            };

            sendDocPostingGroup(viewModelSend,
                () => {

                    $("#actionUnitCostCalculationLine").val(model.requestActionId).trigger("change.select2")
                }, callBack,
                () => {

                    $("#actionUnitCostCalculationLine").val(model.currentActionId).trigger("change.select2")
                });
        }
        else
            updateStatus(model);
    }
    else {

        let isPostGroupList = hasPostGroup(newmodel);

        if (isPostGroupList.length !== 0) {

            var listIds = getDocPostingGroupIds();
            viewModelSend = [];
            modelWarehouse = [];
            for (var i = 0; i < listIds.length; i++) {
                viewModelSend.push({
                    identityId: listIds[i].id,
                    stageId: listIds[i].stageId
                });

                modelWarehouse.push({
                    requestActionId: 0,
                    identityId: listIds[i].id,
                    stageId: listIds[i].stageId,
                    workflowId: listIds[i].workflowId,
                    isLine: false,
                    isItemRequestLine: false,
                    workflowCategoryId: listIds[i].workflowCategoryId,
                    documentDatePersian: listIds[i].documentDatePersian,
                    actionId: listIds[i].actionId,
                    priority: listIds[i].priority
                });
            }
            undoDocPostingGroup(viewModelSend,
                () => {

                    $("#actionUnitCostCalculationLine").val(model.requestActionId).trigger("change.select2")
                }, callBack,
                () => {

                    $("#actionUnitCostCalculationLine").val(model.currentActionId).trigger("change.select2")
                });

            updateactionwarehouse(modelWarehouse);

        }
        else
            updateStatus(model);
    }

}

function updateactionwarehouse(modelWarehouse) {

    let url = `${viewData_baseUrl_WH}/WarehouseTransactionApi/updatestep`;

    for (var i = 0; i < modelWarehouse.length; i++) {

        var currentAction = getStageAction(modelWarehouse[i].workflowId, modelWarehouse[i].stageId, 0, modelWarehouse[i].priority - 1);
        modelWarehouse[i].requestActionId = currentAction.actionId;

        $.ajax({
            url: url,
            async: false,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(modelWarehouse[i]),
            success: function (result) {
                if (result.successfull) {

                }
                else {
                    let errorText = generateErrorString(result.validationErrors);
                    alertify.error(errorText).delay(alertify_delay);

                }
            },
            error: function (xhr) {
                error_handler(xhr, url);

            }
        });
    }

}

function getDocPostingGroupIds() {
    let model = {
        fromDatePersian: stageActionLogCurrent.fromDate,
        toDatePersian: stageActionLogCurrent.toDate
    }

    let url = `${viewData_baseUrl_WH}/WarehouseTransactionApi/getheaderwarehousepostinggroupids`;
    var result = $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(model),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return false;
        }
    });

    return result.responseJSON;

}

function checkIsSendActionId(obj) {
    let model = {
        stageId: obj.stageId,
        actionId: obj.actionId,
        workflowId: obj.workflowId
    }

    var url = `${viewData_baseUrl_WF}/StageActionApi/getaction`;

    var result = $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(model),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return false;
        }
    });

    return result.responseJSON;
}

function getLastConfirmHeader(fromDatePersian, toDatePersian) {

    var p_url = `${viewData_baseUrl_WH}/UnitCostCalculationLineApi/getnolastconfirmheader`;
    var model = {
        fromDatePersian: fromDatePersian,
        toDatePersian: toDatePersian
    }

    $.ajax({
        url: p_url,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (result) {

            if (result.data.length > 0)
                showErrorValidtionUpdateStep(result.data);
            else {
                sendDocument(model, () => {
                    updateStatus(model, currentIdRow);

                });
            }
        },
        error: function (xhr) {
            error_handler(xhr, p_url);
        }
    });
}

function updateStatus(model, currentIdRow) {

    let url = `${viewData_baseUrl_WH}/UnitCostCalculationLineApi/updatestep`;

    $.ajax({
        url: url,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (result) {

            if (result.successfull) {
                alertify.success(result.statusMessage);

                stageActionLogCurrent.actionId = model.requestActionId;

                stepLogModalUnitCostCalculationLine(stageActionLogCurrent.identityId, stageActionLogCurrent.stageId, stageActionLogCurrent.workFlowId);

                callbackForFillTableLineTbodyLines(1, unitcostcalculationlinesid, currentIdRow);

                $("#actionUnitCostCalculationLine").val(stageActionLogCurrent.actionId)
            }
            else {
                let errorText = generateErrorString(result.validationErrors);
                alertify.error(errorText).delay(alertify_delay);

                $("#actionUnitCostCalculationLine").val(model.currentActionId)
            }
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });
}

function unitCostCalculationLinelist() {
    navigation_item_click('/WH/UnitCostCalculation', 'محاسبات ریالی انبار');
}

init();
