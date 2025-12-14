var arrayHeaderCols = [], arrayHeaderColsIsPrimary = [], arraySumCols = [], arrayCounts = [50, 100],
    dataOrder = { colId: "", sort: "", index: 0 },
    scrolls = { current: 0, prev: 0 }, endData = false, pagenoAfterLoad = false, callbackPerRequest = undefined,
    sumProperties = { viewData_SumValue_url: "", isSumDynamic: false }, isPageNumalMode = false, handlerIsWheeled = false, handlerInserted = false;

window.addEventListener("keydown", function (e) {
    if ([KeyCode.ArrowUp, KeyCode.ArrowDown].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

function fillOption(pg_id = null, forPagination) {
    if (forPagination)
        handlerInserted = false

    handlerIsWheeled = false;
    if (!handlerInserted) {
        handlerInsert(pg_id, forPagination);
    }
    createPageCounters();
}

async function appendDataColumns(data, onLoad = true, hasRowNumber = false, pg_id = "mainReport") {

    sumProperties.isSumDynamic = data.sumDynamic;
    sumProperties.viewData_SumValue_url = data.getSumApi;

    createheader(data.dataColumns, data.hasRowNumber);
    resetSummeryReport();
    createSumfooter(data.dataColumns, data.hasRowNumber);

    if (onLoad) {
        createPageCounters();
        $("#dataRowsReport").html(fillEmptyRow(+$("#headerColumnReport th").length));
    }
}

function createheader(data, hasRowNumber) {

    resetheaderReport();

    let tempHead = "<tr>", value;
    if (hasRowNumber) tempHead += `<th  style="width:${8}rem;">ردیف</th>`;

    for (var index = 0; index < data.length; index++) {
        value = data[index];
        if (value.isDtParameter) {
            tempHead += `<th style="width:${value.width}rem;">${value.title}</th>`;
            arrayHeaderCols.push(value);
        }
        if (value.isPrimary)
            arrayHeaderColsIsPrimary.push(value);
    }

    tempHead += "</tr>";
    $(tempHead).appendTo("#headerColumnReport");
    ColumnResizeable("pagetableReportList");
}

function createSumfooter(data, hasRowNumber, pg_id = "mainReport") {

    let tempSumBody = "<tr>", value;

    if (hasRowNumber)
        tempSumBody += `<td class="summary-title">تعداد سطر : <span id="rowsCountfooter"></span></td>`;

    for (var index = 0; index < data.length; index++) {
        value = data[index];
        if (value.isDtParameter) {
            if (value.hasSumValue) {
                arraySumCols.push({ id: value.id, hasRounding: value.hasRounding, decimalRounding: value.decimalRounding, isCommaSep: value.isCommaSep });
                tempSumBody += `<td id="sumFild_${value.id}" class="font-weight-bold col-width-percent-5 sum-border">0</td>`;
            }
            else {
                if (hasRowNumber) {
                    if (index == 0)
                        tempSumBody += `<td class="summary-title" id="summeryLabel"></td>`;
                    else
                        tempSumBody += `<td></td>`;
                }
                else {
                    if (index == 0)
                        tempSumBody += `<td class="summary-title">تعداد سطر : <span id="rowsCountfooter"></span></td>`;
                    else if (index == 1)
                        tempSumBody += `<td class="summary-title" id="summeryLabel"></td>`;
                    else
                        tempSumBody += `<td></td>`;
                }
            }
        }


    }

    tempSumBody += "</tr>";
    $("#summaryRowReport").html("");
    $(tempSumBody).appendTo("#summaryRowReport");


    if (arraySumCols.length > 0) $("#summeryLabel").text("جمع");
}

function resetheaderReport() {

    $("#headerColumnReport").html("");
    arrayHeaderCols = [];
    arrayHeaderColsIsPrimary = [];
}

function resetSummeryReport() {

    $("#summaryRowReport").html("");
    arraySumCols = [];
}

function upDateRowsCountFooter(pg_id = "mainReport") {
    $("#rowsCountfooter").text($(`#${pg_id} #dataRowsReport tr:not(#emptyRow)`).length);
}

function main_getReport(isFile = 2) {
    reportParameters.isFile = isFile
    var isLoadingData = $("#loaderSReaport").hasClass("fa-spinner");
    initialPageing();
    createPageFooterInfo(0, 0, 0, false);
    if (!isLoadingData) {
        getReportAsync(reportParameters, () => {
            $(`#dataRowsReport tr:eq(0)`).addClass("highlight").focus();
            checkSumDynamic(reportParameters);
        });
    }
}

function initialPageing() {

    $("#dataRowsReport").html("");
    $("#summaryRowReport").addClass("displaynone");
    scrolls.current = 0;
    scrolls.prev = 0;
    endData = false;
    pagenoAfterLoad = 0;
    loaderAppendTable(false);
}

async function appendDataRow(result, callBack = undefined, pg_id = "mainReport", forPagination = false) {

    if (!endData) {
        let conditions = { conditionAnswer: {}, conditionTools: [], conditionResult: "", conditionElseAnswer: "" }

        conditionResult = result.columns.conditionOn;
        if (conditionResult != "") {
            conditions.conditionTools = result.columns.condition;
            conditions.conditionAnswer = result.columns.answerCondition;
            conditions.conditionElseAnswer = result.columns.elseAnswerCondition;
        }
        else conditions.conditionResult = "noCondition";

        appendHandler(result, callBack, conditions, "mainReport", forPagination);
    }
    else {
        await loadingAsync(false, "getReport", "fas fa-sticky-note");
        if (typeof callBack !== "undefined") callBack();
    }

}

async function appendHandler(result, callBack, conditions, pg_id = "mainReport", forPagination) {

    let data = result.data, dataColumns = result.columns.dataColumns, hasRowNumber = result.columns.hasRowNumber,
        pagerCount = $(`#${pg_id} .pagerowscount #dropDownCountersName`).text(), sumModel = {}, idByLength = $(`#${pg_id} #dataRowsReport tr:not(#emptyRow)`).length;

    if (data == null || data.length == 0) {
        if (idByLength == 0) {

            await loadingAsync(false, "getReport", "fas fa-sticky-note");

            if (pagenoAfterLoad == 0 && dataColumns != null)
                appendDataColumns(result.columns, false, hasRowNumber);

            $("#dataRowsReport").html(fillEmptyRow(+$("#headerColumnReport th").length));

            $("#summaryRowReport").addClass("displaynone");

            createPageFooterInfo(0, 0, 0, isPageNumalMode);
        }
        endData = true

        if (typeof callBack !== "undefined") callBack();
    }
    else {
        if (dataColumns == null) sumModel = createTable(data, hasRowNumber, idByLength, conditions);
        else {
            if (pagenoAfterLoad == 0)
                appendDataColumns(result.columns, false, hasRowNumber);

            sumModel = createTable(data, hasRowNumber, idByLength, conditions);
        }

        if (!sumProperties.isSumDynamic)
            createTableSummery(sumModel);

        var nextPage = +$("#currentPage").text() + 1;
        createPageFooterInfo(1, $(`#${pg_id} #dataRowsReport tr`).length, nextPage, isPageNumalMode);

        if (typeof callBack !== "undefined") callBack();

        if (isPageNumalMode)
            endData = true;
        else if (data.length < +pagerCount)
            endData = true;
        else
            endData = false;

        await loadingAsync(false, "getReport", "fas fa-sticky-note");
    }
    pagenoAfterLoad = $(`#${pg_id} #dataRowsReport tr:not(#emptyRow)`).length;

    upDateRowsCountFooter();

    if (typeof callbackPerRequest !== "undefined")
        callbackPerRequest();


    if (+$("#currentPage").text() == 1) {

        fillOption("mainReport", forPagination);
    }
}

function createTable(data, hasRowNumber, idByLength, conditions, pg_id = "mainReport") {

    let fieldSum = "", output = "", sumModel = {}, value = "", item = {}, listForCondition = {}, columns = {}, isMainas = false, primaries = "";

    for (let i = 0; i < data.length; i++) {
        item = data[i];
        listForCondition = data[i];
        primaries = "";

        for (var k = 0; k < arrayHeaderColsIsPrimary.length; k++) {
            var v = arrayHeaderColsIsPrimary[k];
            if (v["isPrimary"])
                primaries += ' data-' + v["id"] + '="' + item[v["id"]] + '"';
        }

        if (conditions.conditionResult != "noCondition") {

            output = `<tr ${primaries} onclick="onClickRowReport(this)" onkeydown="onkeyDownRowReport(event)" tabindex="-1" 
                    style="${eval(`${listForCondition[conditions.conditionTools[0].fieldName]} ${conditions.conditionTools[0].operator} ${conditions.conditionTools[0].fieldValue}`) ?
                    conditions.conditionAnswer : conditions.conditionElseAnswer}">`;
        }


        else
            output = `<tr ${primaries} onclick="onClickRowReport(this)" onkeydown="onkeyDownRowReport(event)" tabindex="-1">`;



        if (hasRowNumber) output += `<td class="">` + (idByLength + +(+i + 1)) + '</td>';

        for (let j = 0; j < arrayHeaderCols.length; j++) {

            value = item[arrayHeaderCols[j].id], columns = arrayHeaderCols[j];

            if (columns.hasLink) {
                if (+value !== 0)
                    output += `<td><span onclick="click_link_report(this)" class="itemLink">${value}</span></td>`;
                else
                    output += `<td>${value}</td>`;
            }
            else if (columns.type === 0 || columns.type === 5 || columns.type === 6 || columns.type === 8 || columns.type === 9 ||
                     columns.type === 13 || columns.type === 16 || columns.type === 17 || columns.type === 20 ) {

                if (value != null && value != "") {

                    if (!isNaN(+value)) {
                        isMainas = value < 0;
                        value = Math.abs(value);
                    }
                    else
                        isMainas = false;

                    if (value && columns.isCommaSep)
                        value = transformNumbers.toComma(value)


                    if (isMainas) {
                        value = `(${value})`;
                    }

                    output += `<td>` + value + '</td>';
                }
                else {
                    output += `<td></td>`;
                }
            }
            else if (columns.type == 2) {
                if (value == true)
                    output += '<td><i class="fas fa-check"></i></td>';
                else
                    output += '<td><i></i></td>';
            }
            else
                output += `<td>${value == null ? "" : value}</td>`;
        }

        output += `</tr>`;
        $(output).appendTo("#dataRowsReport");

        for (let x = 0; x < arraySumCols.length; x++) {

            var sumRow = arraySumCols[x];
            fieldSum = parseFloat(item[sumRow.id]) || 0;

            if (sumRow.hasRounding) fieldSum = roundNumber(fieldSum, sumRow.decimalRounding);

            if (i == 0) sumModel[arraySumCols[x].id] = fieldSum;
            else sumModel[arraySumCols[x].id] += fieldSum;
        }
    }
    return sumModel;
}

async function createTableSummery(sumModel, pg_id = "mainReport") {

    let column = {}, sumValue = 0;

    for (let y = 0; y < arraySumCols.length; y++) {

        column = arraySumCols[y];

        sumValue = sumModel[column.id];

        if (column.hasRounding) sumValue = sumValue >= 0 ? roundNumber(sumValue, column.decimalRounding) : `(${roundNumber(Math.abs(sumValue), column.decimalRounding)})`;;
        if (column.isCommaSep) sumValue = sumValue >= 0 ? transformNumbers.toComma(sumValue) : `(${transformNumbers.toComma(Math.abs(sumValue))})`;

        $(`#sumFild_${column.id}`).text(sumValue);
    }
    $("#summaryRowReport").removeClass("displaynone");
}

function onClickRowReport(element) {

    $(`#dataRowsReport tr`).removeClass("highlight");
    $(element).addClass("highlight").focus();
}

function onkeyDownRowReport(e) {

    if ([KeyCode.ArrowUp, KeyCode.ArrowDown, KeyCode.Enter].indexOf(e.keyCode) < 0) return;


    if (e.keyCode === KeyCode.ArrowUp)
        if ($(e.target).prev().length != 0) {
            $(`#dataRowsReport tr`).removeClass("highlight");
            $(e.target).prev().focus().addClass("highlight");
        }

    if (e.keyCode === KeyCode.ArrowDown)
        if ($(e.target).next().length != 0) {
            $(`#dataRowsReport tr`).removeClass("highlight");
            $(e.target).next().focus().addClass("highlight");
        }
}

function getHeaderColumns() {
    $.ajax({
        url: viewData_PreviewReport_GetHeader,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: {},
        success: function (data) {
            appendDataColumns(data);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_PreviewReport_GetHeader);
            return "";
        }
    });

}

function checkSumDynamic(parameters) {

    if (sumProperties.isSumDynamic)
        getDataSumValues(parameters);
}

function click_link_report(elm) {

}

function getDataSumValues(parameters) {
    $.ajax({
        url: sumProperties.viewData_SumValue_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(parameters),
        success: function (data) {
            createTableSummery(data);
        },
        error: function (xhr) {
            error_handler(xhr, sumProperties.viewData_SumValue_url);
        }
    });
}

function changePageRowsCount(count, pagetable_id = "mainReport") {
    $(`#${pagetable_id} .pagerowscount #dropDownCountersName`).text(count);
}

async function nextPageReport(pg_id = "mainReport") {

    await loaderAppendTable()
    let pageNo = $(`#${pg_id} #dataRowsReport tr`).length,
        pageRowscount = +$(`#${pg_id} #dropDownCountersName`).text();


    if (!endData && pagenoAfterLoad == pageNo && pagenoAfterLoad > 0)
        getDataAfterPageChange(pageNo, pageRowscount);
    else
        await loaderAppendTable(false);

}

function handlerInsert(pg_id = "mainReport", forPagination) {

    let elmenet = $(`#${pg_id} #parentTableReport`);

    if (!forPagination) {

        elmenet.on('wheel', (e) => {
            if (!handlerIsWheeled) {
                if (((elmenet[0].scrollHeight + ((elmenet[0].scrollWidth + 17) > elmenet.width() ? 17 : 0)) - elmenet.scrollTop() == elmenet.outerHeight()) && !$("#loaderSReaport").hasClass("fa-spinner")) {
                    insertfirstPage(event);
                    handlerIsWheeled = true;
                }
            }
        });

        elmenet.on('scroll', (e) => {
            if (((elmenet[0].scrollHeight + ((elmenet[0].scrollWidth + 17) > elmenet.width() ? 17 : 0)) - elmenet.scrollTop() == elmenet.outerHeight()) && !$("#loaderSReaport").hasClass("fa-spinner")) {
                nextPageReport();
            }
        });

        handlerInserted = true;
    }
    else {
        $(elmenet).unbind('wheel')
        $(elmenet).unbind('scroll')
        handlerIsWheeled = false
        handlerInserted = false;
    }
}

function createPageFooterInfo(first, last, pageNo, IsNormalMode = false, pg_id = "mainReport") {
    $(`#${pg_id} #firstRow`).text(first);
    $(`#${pg_id} #lastRow`).text(last);
    $(`#${pg_id} #currentPage`).text(pageNo);

    if (IsNormalMode) {
        isPageNumalMode = true;
        $(`#${pg_id} #footerPageing`).addClass("displaynone");

    }
    else {
        isPageNumalMode = false;
        $(`#${pg_id} #footerPageing`).removeClass("displaynone");

    }
}

async function getReportAsync(model, callBack = undefined) {

    let pageRowscount = +$(`#mainReport #dropDownCountersName`).text();

    model.pageRowsCount = pageRowscount;

    $.ajax({
        url: viewData_PreviewReport_GetReport,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (result) {

            appendDataRow(result, callBack);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_PreviewReport_GetReport);
            loadingAsync(false, "getReport", "fas fa-sticky-note");
            refreshBackData(model.pageno, model.pagerowscount);
            return null;
        }
    });
}

async function loadingAsync(loading, elementId, iconClass) {
    if (loading) {
        $(`#${elementId} i`).removeClass(iconClass);
        $(`#${elementId} i`).addClass(`fa fa-spinner fa-spin`);
    }
    else {
        $(`#${elementId} i`).removeClass("fa fa-spinner fa-spin");
        $(`#${elementId} i`).addClass(iconClass);
    }
}

function getDataAfterPageChange(pageno, pagerowscount, pg_id = "mainReport") {

    let parameters = reportParameters, nextPage = +$("#currentPage").text() + 1;
    parameters.PageNo = pageno;
    parameters.pageRowsCount = pagerowscount;

    getReportAsync(parameters, () => {
        loaderAppendTable(false);
    });
}

function createPageCounters(pagetable_id = "mainReport") {

    $("#dropDownCounters").html("");
    let length = arrayCounts.length, outPut = "";
    for (var i = 0; i < length; i++)
        outPut += `<a class="dropdown-item" onclick="changePageRowsCount(${arrayCounts[i]},'${pagetable_id}'); return false;">${arrayCounts[i]}</a>`;

    $(outPut).appendTo("#dropDownCounters");

    if ($("#dropDownCountersName").text() == null || $("#dropDownCountersName").text() == "")
        $("#dropDownCountersName").text(arrayCounts[0]);
    else
        $("#dropDownCountersName").text($("#dropDownCountersName").text())
}

function modal_closePreviewRepor(modal_name) {
    var form = $(`#${modal_name} div.modal-body`).parsley();
    $(`#${modal_name} div.modal-body *`).removeClass("parsley-error");
    form.reset();

    modal_close(modal_name);
    $(`#${modal_name} .pagerowscount`).removeClass("dropup");
};

function refreshBackData(pageno, pagerowscount) {
    loaderAppendTable(true, pageno, pagerowscount)
}

function refreshBackbutton(element) {

    if (+$(element).data().pageno == 0) {
        let parameters = parameter();
        initialPageing();
        getReportAsync(parameters, () => {
            $(`#dataRowsReport tr:eq(0)`).addClass("highlight").focus();
            createPageFooterInfo(1, +parameters.pageRowsCount, 1);
            checkSumDynamic(parameters);
        });

    }
    else
        getDataAfterPageChange($(element).data().pageno, $(element).data().pagerowscount);
}

async function loaderAppendTable(loaderOn = true, pageno = null, pagerowscount = null, pg_id = "mainReport") {
    if (loaderOn) {
        $(`#${pg_id} i#loaderSReaport`).removeClass("fa fa-spinner  fa-pulse");
        $(`#${pg_id} .loadin-div button`).addClass("displaynone");

        if (pageno === null) {
            $(`#${pg_id} #parentTableReport`).removeClass("disabled-box-report");
            $(`#${pg_id} #countRowButton`).removeClass("not-click");
            $(`#${pg_id} .loadin-div`).addClass("displaynone");
            $(`#${pg_id} i#loaderSReaport`).addClass("fa fa-spinner fa-pulse");
        }
        else {
            $(`#${pg_id} #parentTableReport`).addClass("disabled-box-report");
            $(`#${pg_id} #countRowButton`).addClass("not-click");
            $(`#${pg_id} .loadin-div`).removeClass("displaynone");
            $(`#${pg_id} .loadin-div button`).removeClass("displaynone");
            $(`#${pg_id} .loadin-div button`).data().pageno = pageno;
            $(`#${pg_id} .loadin-div button`).data().pagerowscount = pagerowscount;
        }
    }
    else {
        $(`#${pg_id} #parentTableReport`).removeClass("disabled-box-report");
        $(`#${pg_id} #countRowButton`).removeClass("not-click");
        $(`#${pg_id} .loadin-div`).addClass("displaynone");
        $(`#${pg_id} i#loaderSReaport`).removeClass("fa fa-spinner fa-pulse");
        $(`#${pg_id} .loadin-div button`).addClass("displaynone");
    }
}

var resetFilterForms = async todayDate => {

    $(".card-body select.form-control:not([multiple]),.card-body select.select2:not([multiple])").prop("selectedIndex", 0).trigger("change");
    $(".card-body select[multiple]").val("").trigger("change");

    $(".card-body input.form-control:not(.persian-date,[placeholder='__:__'])").val("");
    $(".card-body input.form-control.persian-date").val(todayDate);
    $(".card-body input.form-control[placeholder='__:__']:eq(0)").val("00:00");
    $(".card-body input.form-control[placeholder='__:__']:eq(1)").val("23:59");


    $(".card-body .funkyradio input:checkbox").prop("checked", false).trigger("change");

    if (typeof customeresetFilterForms != "undefined")
        customeresetFilterForms();
}

function getToDay() {

    let url = `${viewData_baseUrl_PB}/PublicApi/gettoday`,
        output = $.ajax({
            url: url,
            type: "post",
            dataType: "text",
            cache: false,
            async: false,
            success: function (result) {
                return result;
            },
            error: function (xhr) {
                error_handler(xhr, url);
                return "";
            }
        });

    return output.responseText;
}

$(".persian-date,.persian-datepicker,.double-input,.double-inputsearch").on("keydown", function (e) {

    if ([KeyCode.Enter].indexOf(e.keyCode) < 0) return;

    var valThis = $(this).val(), elmAfter;

    if ($(this).hasClass("persian-date") || $(this).hasClass("persian-datepicker")) {

        if ($(this).hasClass("persian-datepicker"))
            elmAfter = $(this).parent().parent().next().find("input");
        else if ($(this).hasClass("persian-date"))
            elmAfter = $(this).parent().next().find("input");

        if (elmAfter.hasClass("persian-date") || elmAfter.hasClass("persian-datepicker"))
            elmAfter.val(valThis);

    }
    else if ($(this).hasClass("double-input")) {

        elmAfter = $(this).next();
        if (elmAfter.hasClass("double-input"))
            elmAfter.val(valThis);
    }
    else if ($(this).hasClass("double-inputsearch")) {

        elmAfter = $(this).parent().next().next().find("input");
        if (elmAfter.hasClass("double-inputsearch"))
            elmAfter.val(valThis);
    }

});

$("#resetfilds").on("click", async () => { let todayDate = await getToDay(); await resetFilterForms(todayDate); });

window.Parsley._validatorRegistry.validators.comparedate = undefined;
window.Parsley.addValidator('comparedate', {
    validateString: function (value, requirement) {
        var value2 = $(`#${requirement}`).val();

        if (value === "" || value2 === "")
            return true;

        var compareResult = compareShamsiDate(value, value2);
        return compareResult;
    },
    messages: {
        en: 'تاریخ شروع از تاریخ پایان بزرگتر است.',
    }
});

function insertfirstPage(e) {
    if (e.deltaY > 0) {
        pagetable_currentpage = +$("#currentPage").text();
        if (pagetable_currentpage == 1) {
            nextPageReport();
        }
    }
}