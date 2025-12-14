var arrayExcelHeaderTemp = [], sumIds = [], arrayDrops = [], arraySearchs = [], headerId = 0, ImportExcel = "", insertExcelUrl = "", fillTimeOut, cansleType = "INS", modelSummery = {},
    balancHeightTable = () => { $("#tableExcel").attr("style", `height: ${+$(".modal-body-ex").height() - +$("#headerElmentsHeigth").height()}px`); },
    emptyInputFile = () => { $("#inputFile").val("").trigger("change") }, checkBoxEXOnfocus = elm => { $(elm).find("label").addClass("border-thin"); },
    workbook = [], excelRows = [], checkBoxEXOnblur = elm => { $(elm).find("label").removeClass("border-thin"); }, _spinnerDiv = document.getElementById('spinnerDiv'),
    confirmForClosed = false;

var excel_arrPage = {
    pagetable_id: "tempimportExcelbody",
    editable: true,
    selectable: true,
    pagerowscount: 15,
    currentpage: 1,
    lastpage: 1,
    currentrow: 1,
    currentcol: 0,
    highlightrowid: 0,
    trediting: false,
    filteritem: "",
    filtervalue: "",
    filterPageType: "0",//0 All 1 Erorrs  2 Trues
    datarows: [],
    columns: [],
    errors: [],
    getfilter_url: `${viewData_baseUrl_MC}/inboundgetfilteritems`,
    getColumns_url: `${viewData_baseUrl_FM}/JournalLineApi/getjournallineimportexcelcolumns`
};
excel_pagetables.push(excel_arrPage);

$(document).on("change", "#tempimportExcelbody tbody tr td input[type=checkbox]", function () {
    refreshSummaryValues();
});

function refreshSummaryValues() {
    var rows = $("#tempimportExcelbody tbody tr").find("td:first input:checked").length == 0 ? $("#tempimportExcelbody tbody tr").find("td:first input").parents("tr") : $("#tempimportExcelbody tbody tr").find("td:first input:checked").parents("tr");

    var columns = $(rows[0]).find("td[data-col]");
    for (var i = 0; i < columns.length; i++) {

        if (arrayExcelHeaderTemp[i].inputType == "number" || arrayExcelHeaderTemp[i].inputType == "money" || arrayExcelHeaderTemp[i].inputType == "decimal") {
            var sumCol = 0;
            $(rows).find(`td[data-col=${i}]`).each(function () {
                sumCol += +removeSep($(this).find("input").val().toString());
            });
            var cellIndex = $(rows[0]).find(`td[data-col=${i}]`).prop("cellIndex");
            $("#tempimportExcelsummery tr td").each(function () {
                if ($(this).prop("cellIndex") == cellIndex) {

                    $(this).find("span").first().text(sumCol);
                }
            })
        }
    }
    showAmountDifference();
}

function tr_object_oninput(ev, elm) {

    var elem = $(elm);
    var elemIndex = $(elem).attr("id").split("_")[1];
    var elemId = $(elem).attr("id").split("_")[0];
    switch (elemId) {
        case "accountGLId":
            $(`#accountSGLId_${elemIndex},#accountDetailId_${elemIndex}`).val("");
            $(`#accountSGLName_${elemIndex},#accountDetailName_${elemIndex}`).text("");
            break;
        case "accountSGLId":
            $(`#accountDetailId_${elemIndex}`).val("");
            $(`#accountDetailName_${elemIndex}`).text("");
            break;
        default:
            break;
    }
}

function containsNumber(elems, isMoney) {

    var res = true;
    var regex = /^\d+$/;
    for (var i = 0; i < elems.length; i++) {
        var val = isMoney ? removeSep($(elems[i]).val()) : $(elems[i]).val();
        if (!(regex.test(val))) {
            res = false;
            $(elems[i]).css("border", "1px solid red")
        }

    }
    return res;
}

async function verifyData(fromClick = true) {
    let form = {},
        rows = $("#tempimportExcelbody tbody tr"),
        errorRowCounts = 0, valdtionInForm = 0, differenceResult = false, rowLength = rows.length;


    for (var i = 0; i < rowLength; i++) {
        cansleType = "VRF";

        form = $(rows[i]).parsley();
        form.validate();
        validateSelect2(form);


        var numberElemsNotValid = true;
        var moneyElemsNotValid = true;
        if ($(rows[i]).find(".number").length > 0)
            numberElemsNotValid = containsNumber($(rows[i]).find(".number"));

        if ($(rows[i]).find(".money").length > 0)
            moneyElemsNotValid = containsNumber($(rows[i]).find(".money"), true);

        if (($(rows[i]).find(".number").length > 0 && !numberElemsNotValid) || ($(rows[i]).find(".money").length > 0 && !moneyElemsNotValid)) {
            ++errorRowCounts;
            masterArrayNoneFilter[i].hasError = true;
        }

        if (i == 0) {
            refreshSummaryValues();
            if (typeof valdtionFormFunction === "function") valdtionInForm = valdtionFormFunction(masterArrayNoneFilter);
            differenceResult = showAmountDifference();
        }

        if (i + 1 == rowLength) {

            if (errorRowCounts > 0) {
                $("#importData").prop("disabled", true);
                loadingVerifyData(false);
            }
            else if (valdtionInForm > 0) {
                if (fromClick)
                    alertify.warning("تعدادی از سطرها دارای خطا هستند، لطفا بررسی کنید").delay(alertify_delay);
                loadingVerifyData(false);
                $("#importData").prop("disabled", true);
            }
            else if (!differenceResult) {
                if (fromClick)
                    alertify.warning("اختلاف مبلغ وجود دارد").delay(alertify_delay);
                loadingVerifyData(false);
                $("#importData").prop("disabled", true);
            }
            else {
                $("#importData").prop("disabled", false);
                loadingVerifyData(false);
            }
        }

    }
    if (typeof valdtionFormFunction === "function") {

        var errorCount = valdtionFormFunction(masterArrayNoneFilter);
        $("#successRows").text(masterArrayNoneFilter.length - (errorCount));
        $("#errorRows").text(errorCount);
        $(`#errorRowsCheck,#successRowsCheck`).prop("disabled", false);
    }

    if (errorCount > 0 && fromClick && !($("#errorRowsCheck").prop("checked") && !$("#successRowsCheck").prop("checked")))
        showErrorRowsInfo();

}

function showErrorRowsInfo() {
    $("#errorRowInfo").html("");
    var errorPageNoList = [];
    var errorList = [];
    let index = excel_pagetables.findIndex(v => v.pagetable_id == "tempimportExcelbody");
    var pagetable_pagerowscount = excel_pagetables[index].pagerowscount;

    var errorRows = masterArray.filter(a => a.hasError);
    for (var i = 0; i < errorRows.length; i++) {
        var rowNo = masterArray.findIndex(a => a.index == errorRows[i].index) + 1;
        var pageNo = Math.floor((rowNo - 1) / pagetable_pagerowscount) + 1;
        errorList.push({ "pageNo": pageNo, "rowNo": rowNo });
        errorPageNoList.push(Math.floor((rowNo - 1) / pagetable_pagerowscount) + 1);
    }
    errorPageNoList = errorPageNoList.filter(unique);
    for (var i = 0; i < errorPageNoList.length; i++) {
        var rowNoList = errorList.filter(a => a.pageNo == errorPageNoList[i]).map(function (itm) { return itm.rowNo }).toLocaleString();
        $("#errorRowInfo").append(`<tr><td>${errorPageNoList[i]}</td><td>${rowNoList}</td></tr>`);
    }

    modal_show("errorRowsModal");

}

var unique = (value, index, self) => {
    return self.indexOf(value) === index
}

function updateNumberError() {
    if (typeof valdtionFormFunction === "function") {

        var errorCount = valdtionFormFunction(masterArrayNoneFilter);
        $("#successRows").text(masterArrayNoneFilter.length - errorCount);
        $("#errorRows").text(errorCount);
        $(`#errorRowsCheck,#successRowsCheck`).prop("disabled", false);
        let index = excel_pagetables.findIndex(v => v.pagetable_id == "tempimportExcelbody");
        let currentrow = excel_pagetables[index].currentrow;
        get_excelpagetable("tempimportExcelbody", () => {
            $(`#tempimportExcelbody tr`).removeClass("highlight");
            $(`#tempimportExcelbody #row${currentrow}`).addClass("highlight").focus();
            excel_pagetables[index].currentrow = currentrow;
        });


    }
}

function importDataExcel(pg_name) {
    let masterArrayLen = masterArrayNoneFilter.length
    for (i = 0; i < masterArrayLen; i++) {
        if (typeof masterArrayNoneFilter[i].amountCredit == "string") {
            masterArrayNoneFilter[i].amountCredit = +removeSep(masterArrayNoneFilter[i].amountCredit.toString())
        }
        if (typeof masterArrayNoneFilter[i].amountDebit == "string") {
            masterArrayNoneFilter[i].amountDebit = +removeSep(masterArrayNoneFilter[i].amountDebit.toString())
        }
    }

    var modelSaveFainal = {};
    if (headerId !== 0) modelSaveFainal["headerId"] = headerId;
    modelSaveFainal["journalLines"] = masterArrayNoneFilter;

    insertExcelRows(modelSaveFainal, pg_name);

}

function insertExcelRows(data, pg_name) {
    $.ajax({
        url: insertExcelUrl,
        type: "post",
        dataType: "json",
        async: false,
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (result) {
            resetFormAfterImport();
            loadingImportData(false);
            if (!result.successfull)
                showErrorValidtion(result.data.validationErrors, pg_name);
            else {
                alertify.success("با موفقیت انجام شد.").delay(alertify_delay);
                emptyInputFile();
                resetFormPageTable();
                modal_close("importExcelModal");
            }
        },
        error: function (xhr) {
            error_handler(xhr, ImportExcel);
        }
    });
}

function summeryUpdate(finalSummry = null, modelSummery = null) {

    if (modelSummery == null) {
        let sumLength = sumIds.length, value = 0;

        for (var ix = 0; ix < sumLength; ix++) {
            value = +removeSep($(`#sum_${sumIds[ix]} .text-sum`).text()) - finalSummry[sumIds[ix]];
            $(`#sum_${sumIds[ix]} .text-sum`).text(transformNumbers.toComma(value));
        }
    }
    else {
        let sumLength = sumIds.length, value = 0;

        for (var ix = 0; ix < sumLength; ix++) {
            value = +removeSep($(`#sum_${sumIds[ix]} .text-sum`).text()) - modelSummery[sumIds[ix]] + finalSummry[sumIds[ix]];
            $(`#sum_${sumIds[ix]} .text-sum`).text(transformNumbers.toComma(value));
        }

    }
    showAmountDifference();
}

function sheetToRow() {
    if ($("#inputFile").val() !== "") {
        var fileExtension = ['xlsx', 'xls', 'csv'];
        if (fileExtension.includes($('#inputFile').val().split('.').pop().toLowerCase())) {

            balancHeightTable();
            var selectedFile;
            selectedFile = $('#inputFile')[0].files[0];
            if (selectedFile) {
                excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[$("#sheetsFile").val()], { header: 1, blankRows: false, defval: '' });
                return excelRows;
            }
            else {
                var msg = alertify.error(msg_error_file_type);
                msg.delay(alertify_delay);
                loadingExcel(false, false);
                return null;
            }
        }
        else {
            var msg = alertify.error("فایلی وجود ندارد ابتدا فایل را انتخاب کنید");
            msg.delay(alertify_delay);
            loadingExcel(false, false);
            return null;
        }

    }
}

/**
 * loadingExcel
 * 
 * @param {any} loading اسپینر برای دکمه نمایش
 * @param {any} trueData ایا اطلاعات ورودی اطلاعات نمایش است یا خیر (برای فکوس کردن روی اولین سطر)
 * @param {any} callBack 
 */
function loadingExcel(loading, trueData = true, callBack = undefined) {
    //
    if (!confirmForClosed) {
        if (loading) {
            $(`#loaderExelPage`).addClass(`fa-spinner  fa-pulse`).removeClass("fa-arrow-down", 10, callBack);
            //$(`#cansleFunction`).prop(`disabled`, false);
        }
        else {
            $(`#loaderExelPage`).addClass("fa-arrow-down").removeClass("fa-spinner  fa-pulse ", 10, callBack);
            //$(`#cansleFunction`).prop(`disabled`, true);
        }

        if (trueData) {
            $("#tempimportExcelbody tbody tr").removeClass("highlight");
            $(`#row1`).focus().addClass("highlight");
            $(`#verifyData,#deleteRows`).prop("disabled", false);
        }
        else
            $(`#verifyData`).prop("disabled", true);
    }
    else
        confirmForClosed = false;
}

function disEnbCheckbox(mode) {
    $(".checkEx").prop("disabled", mode);
}

async function loadingVerifyData(loading, callBack = undefined, disabled = true) {

    if (loading)
        $(`#loaderVerifyData`).addClass(`fa-spinner  fa-pulse`, 1, callBack);
    else
        $(`#loaderVerifyData`).removeClass("fa-spinner  fa-pulse ", 1, callBack);

    disEnbCheckbox(loading);

    $(`#tempimportExcelbody tbody tr`).removeClass("highlight");
    $(`#tempimportExcelbody tbody tr#row1`).focus().addClass("highlight");

    var index = excel_pagetables.findIndex(v => v.pagetable_id == "tempimportExcelbody");
    excel_pagetables[index].currentrow = 1;

}

function loadingImportData(loading, validtionHeader = false) {

    if (loading) $(`#loaderImportData`).addClass(`fa-spinner  fa-pulse`);
    else $(`#loaderImportData`).removeClass("fa-spinner  fa-pulse");

    disEnbCheckbox(loading);

    if (!validtionHeader)
        $(`#importData`).prop("disabled", true);
    else
        $(`#importData`).prop("disabled", false);

}

function createValdtion(data) {

    if (data !== null) {

        let valdtionValue = "", dataLength;
        dataLength = data.length;
        if (+dataLength !== 0) {

            for (var i = 0; i < dataLength; i++)
                valdtionValue += data[i].validationName + '="" ';

            return valdtionValue.toString();
        }
        else
            return "";
    }
    else
        return "";
}

function eventClickTrTable(row, elm) {

    if ($(elm).data().disabled) {

        if ($(`#tempimportExcelbody tbody tr.edited-row`).length) enabledDisabledRow(+$(`#tempimportExcelbody tbody tr.edited-row`).attr("id"), "DIS");

        $(`#tempimportExcelbody tbody tr`).removeClass("highlight");
        $(elm).focus().addClass("highlight");
    }
}

function resetForm() {

    $("#successRows").text("");
    $("#errorRows").text("");
    $("#allRows").text("");
    $(`#errorRowsCheck,#successRowsCheck`).prop("disabled", true);

    sumIds = [];
    arrayDrops = [];
    arraySearchs = [];
    breakFunction = false;
}

function resetFormValdtion() {
    let tempResetForm = {}, tempResetFormLn = $('#tempimportExcelbody tbody tr').length;

    $("#successRows").text("");
    $("#errorRows").text("");
    $(".differentError-ex").html("");
    $(`#errorRowsCheck,#successRowsCheck`).prop("disabled", true);

    for (var i = 0; i < tempResetFormLn; i++) {
        tempResetForm = $(`#tempimportExcelbody tbody tr:eq(${i})`).parsley();
        tempResetForm.reset();
        validateSelect2(tempResetForm);
    }

}

function resetFormAfterImport() {

    resetForm();

    $("#headerElm select").val("0").trigger("change");
    $("#headerElm input:checkbox").prop("checked", false);
    $("#headerElm input:text").val("");
    $("#successRows").text("");
    $("#errorRows").text("");
    $("#importData").prop("disabled", true);
    $(`#errorRowsCheck,#successRowsCheck`).prop("disabled", true);

    let form = $('#headerElm').parsley();
    form.reset();
    validateSelect2(form);
}

$("#sheetsFile").change(() => $("#btnCreate").prop("disabled", $("#sheetsFile option").length == 0));

function fillDropSheets(hasValue) {
    $("#sheetsFile").html("").trigger("change");
    if (hasValue) {
        let selectedFile = $('#inputFile')[0].files[0], options = "";

        if (selectedFile) {
            let fileReader = new FileReader();
            fileReader.readAsBinaryString(selectedFile);

            fileReader.onload = (event) => {
                var data = event.target.result;
                sheetjsw(data, { type: 'binary' });
            }
        }
    }
}

var _workstart = function () {
    $(`#nameFileExcelIcon`).addClass("fa-spinner  fa-pulse").removeClass("fa fa-check")
}
var _workend = function () {
    $(`#nameFileExcelIcon`).removeClass("fa-spinner  fa-pulse").addClass("fa fa-check")
}

function sheetjsw(data, readtype) {
    _workstart();

    var worker = new Worker('/js/sheetjsw.js');
    worker.onmessage = function (e) {
        switch (e.data.typeResult) {
            case 'ready': break;
            case 'e': break;
            case 'xlsx':
                _workend();
                workbook = JSON.parse(e.data.data);
                var options = "";
                workbook.SheetNames.forEach((sheet, i) => {
                    options += `<option value="${sheet}" ${i == 0 ? "selected" : ""}>${sheet}</option>`;
                });

                $("#sheetsFile").append(options).trigger("change");
                break;
        }
    };
    worker.postMessage({ data: data, readtype: readtype, typeResult: 'xlsx' });
}

function initExcel(createButton = true) {

    if (createButton)
        $(".button-items").prepend(`<button type="button" onclick="importExcel()" class="btn btn-excel waves-effect"><i class="fa fa-file-import"></i>انتقال اطلاعات از فایل اکسل</button>`);

    window.onresize = typeof balancHeightTable !== "undefined" ? balancHeightTable : null;
}

function importExcel(id = 0, callBack = undefined) {

    arrayExcelHeaderTemp = getColsExels(id);

    headerId = id;

    if (typeof callBack !== "undefined") callBack();
    modal_show("importExcelModal");
    loadingExcel(false, false);
}

function getColsExels(id) {
    var data = [];
    $.ajax({
        url: ImportExcel,
        type: "post",
        dataType: "json",
        async: false,
        contentType: "application/json",
        data: JSON.stringify(id),
        success: function (result) {
            data = result.dataColumns;
        },
        error: function (xhr) {
            error_handler(xhr, ImportExcel);
        }
    });

    return data;
}

function showAmountDifference() {
    var result = true;
    if (typeof showAmountDifferenceInForm != "undefined")
        result = showAmountDifferenceInForm();
    return result;
}

async function focusElementExcel(row, col) {

    let element = typeof $(`#ex_${row}_${col} .form-control`) !== "undefined" ? $(`#ex_${row}_${col} .form-control`) : 0;


    if (element == 0 || element.length === 0) {
        await enabledDisabledRow(row, "DIS").then((row) => {
            if (!$(`#ex_${row}`).is(":last-child"))
                $(`#ex_${row}`).next().addClass("highlight").focus();
            else
                $(`#ex_${row}`).addClass("highlight").focus();
        });
    }
    else if (element.length === 1) {

        if (element[0].disabled)
            focusElementExcel(row, col + 1);

        var id = element.attr("id");

        if (element.hasClass("select2"))
            $(`#${id}`).select2("focus");
        else if (element.hasClass("check-exl"))
            $(`#${id}`).parent().focus();
        else
            $(`#${id}`).focus().select();

    }
}

function checkAll(elm) {

    $(".checkEx").prop("checked", $(elm).prop("checked"));
}

function clickCheck(e) {
    e.stopPropagation();
    $("#checkExAll").prop("checked", $(`.checkEx`).toArray().every(x => x.checked == true));

}

function confirmForClose() {
    if ($(".pagetablebodyEx tbody tr").length > 0) {
        $(".alertify").removeClass("ajs-hidden");
        alertify.confirm('بستن', `<h4>امکان از دست رفتن اطلاعات وجود دارد آیا اطمینان دارید؟</h4> <br/>`, closeWithReset, () => { })
            .set('labels', { ok: 'بستن', cancel: 'انصراف' });

        $(".alertify").removeAttr("style");
        $(".ajs-ok").addClass("ajs-ok-ex");
    }
    else
        modal_close("importExcelModal");
}

function closeWithReset(e) {
    emptyInputFile();
    resetFormPageTable();
    modal_close("importExcelModal");
    $(".ajs-button .ajs-cancel-ex").parent().remove();
    $(".ajs-ok").removeClass("ajs-ok-ex");
}

function closeWithOutReset(e) {
    confirmForClosed = true;
    modal_close("importExcelModal");
    //alertify.confirm().destroy();
    $(".alertify.ajs-movable.ajs-closable.ajs-pinnable.ajs-pulse").fadeOut(10).remove();
    $(".ajs-button .ajs-cancel-ex").parent().remove();
    $(".ajs-ok").removeClass("ajs-ok-ex");
}

$("#verifyData").on("click", async function () {
    await loadingVerifyData(true, async () => {
        await verifyData();
    });
});

$("#deleteRows").on("click", async function () {
    let pageTableId = $(this).parents("#headerElmentsHeigth").next().attr("id");
    let index = excel_pagetables.findIndex(v => v.pagetable_id == pageTableId);

    if (index < 0)
        return;

    let items = excel_pagetables[index].selectedItems;
    let itemsLn = items.length;

    if (itemsLn != 0) {
        for (var i = 0; i < itemsLn; i++) {
            removeRowFromArray(masterArray, "index", +items[i].index);
            removeRowFromArray(masterArrayNoneFilter, "index", +items[i].index);
        }

        excel_pagetables[index].selectedItems = [];
        get_excelpagetable("tempimportExcelbody");
    }
    else
        alertify.error(`موردی برای حذف وجود ندارد`).delay(alertify_delay);

});

$("#importData").on("click", function () {
    loadingImportData(true);

    let form = $('#headerElm').parsley(),
        validate = form.validate();
    validateSelect2(form);


    setTimeout(() => {
        if (!validate) {
            loadingImportData(false, true);
            balancHeightTable();
            return;
        }

        balancHeightTable();
        importDataExcel("tempimportExcelbody");
    }, 1);
});

$("#btnCreate").on("click", function () {

    loadingExcel(true, false,
        () => {
            resetForm();
            let res = sheetToRow();
            if (res !== null) {
                res.shift()
                var index = excel_pagetables.findIndex(v => v.pagetable_id == "tempimportExcelbody");
                excel_pagetables[index].datarows = res;
                excel_pagetables[index].verifyDataFunc = verifyData;
                excel_pagetables[index].selectedItems = [];
                excelPageInit = true;
                excelpagetable_formkeyvalue.push(headerId);
                get_excelpagetable("tempimportExcelbody");
                $(`#verifyData,#deleteRows`).prop("disabled", false);
            }
        }
    );

});

$("#tempExcelFile").on("click", function () {
    let arrayTempExcel = [], model = {}, arrayLength = arrayExcelHeaderTemp.length;

    for (var i = 0; i < arrayLength; i++) {
        let value = arrayExcelHeaderTemp[i];

        if (value.id !== "index") {
            if (arrayExcelHeaderTemp[i].validations !== null) {

                let validationsLen = arrayExcelHeaderTemp[i].validations.length, arrayValidation = [];

                for (var j = 0; j < validationsLen; j++)
                    arrayValidation.push(arrayExcelHeaderTemp[i].validations[j].validationName)

                if (arrayValidation.indexOf("required") !== -1)
                    model[value.title + "*"] = "";
                else
                    model[value.title] = "";
            }
            else
                model[value.title] = "";
        }

    }
    arrayTempExcel.push(model);

    filename = viewData_form_title + '.xlsx';
    var ws = XLSX.utils.json_to_sheet(arrayTempExcel);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws);
    XLSX.writeFile(wb, filename);

});

$("#inputFile")
    .on("change", function () {
        if ($(this).val() == "") {
            $("#nameFileExcelIcon").removeClass("fa-check").removeClass("fa-times").addClass("fa-upload");
            $("#nameFileExcel").text("بارگذاری");
            $("#inputFile").prev().removeClass("btnInput-error");
            fillDropSheets(false);
            resetFormAfterImport();
        }
        else {
            let fullNameFile = $(this)[0].files[0].name, typeFile = fullNameFile.split(".").pop(), nameFile = fullNameFile.split(`.${typeFile}`)[0],
                sizeName = ($(this)[0].files[0].size / 1024 / 1024).toFixed(3) > 0.000 ? ($(this)[0].files[0].size / 1024 / 1024).toFixed(3) : " < 1";
            let fainalName = nameFile.length >= 4 ? `${nameFile.substr(0, 4)}..(${typeFile}) | ${sizeName.replace(".", "/")} MB` : fullNameFile;

            var fileExtension = ['xlsx', 'xls', 'csv'];
            if (fileExtension.includes($('#inputFile').val().split('.').pop().toLowerCase())) {
                $("#nameFileExcelIcon").addClass("fa-check").removeClass("fa-upload");
                $("#nameFileExcel").text(fainalName);
                $("#inputFile").prev().removeClass("btnInput-error");
                fillDropSheets(true);
            }
            else {
                $("#nameFileExcelIcon").addClass("fa-times").removeClass("fa-upload");
                $("#nameFileExcel").text(fainalName);
                $("#inputFile").prev().addClass("btnInput-error");
                fillDropSheets(false);
            }
        }
    })
    .on("click", emptyInputFile);

$(document).ready(function (e) {
    if (e.keyCode === KeyCode.Esc) confirmForClose();
});

function tr_save_row(pg_name, keycode) {
    let index = excel_pagetables.findIndex(a => a.pagetable_id == pg_name), rowElmenet = null, elementValue = "";

    if (index<0) {
        return;
    }

    let pagetable_id = excel_pagetables[index].pagetable_id,
        pagetable_currentrow = excel_pagetables[index].currentrow,
        pagetable_currentpage = excel_pagetables[index].currentpage,
        pagetable_pagerowscount = excel_pagetables[index].pagerowscount,
        columns = excel_pagetables[index].columns;
    let rowindex = pagetable_currentrow - 1, columnsLn = columns.length;

    let form = $(`#${pg_name} #row${pagetable_currentrow}`).parsley();
    let validtion = form.validate();
    validateSelect2(form);
    if (!validtion) {
        $("#importData").prop("disabled", true);
        updateNumberError();
        return;
    }

    for (var i = 0; i < columnsLn; i++) {

        if (!columns[i].isDtParameter) break;

        rowElmenet = $(`#${columns[i].id}_${pagetable_currentrow}`);

        if (rowElmenet.prop("type") === "checkbox")
            elementValue = rowElmenet.prop("checked");
        else if (rowElmenet.prop("tagName").toLowerCase() === "select")
            elementValue = rowElmenet.val() == null ? 0 : +rowElmenet.val();
        else if (rowElmenet.hasClass("number") || rowElmenet.hasClass("money") || rowElmenet.hasClass("decimal"))
            elementValue = rowElmenet.val() == null ? 0 : +removeSep(rowElmenet.val());
        else
            elementValue = rowElmenet.val() ?? "";

        masterArray[rowindex + ((pagetable_currentpage - 1) * pagetable_pagerowscount)][columns[i].id] = elementValue;
        masterArrayNoneFilter[rowindex + ((pagetable_currentpage - 1) * pagetable_pagerowscount)][columns[i].id] = elementValue;
    }

    updateNumberError();
    refreshSummaryValues()
    after_save_rowEx(pg_name, "success", keycode, false);
}

function resetFormPageTable() {
    excel_pagetables = [{ pagetable_id: "pagetable", editable: false, pagerowscount: 15, currentpage: 1, lastpage: 1, currentrow: 1, currentcol: 0, highlightrowid: 0, trediting: false, pagetablefilter: false, filteritem: "", filtervalue: "" }];
    let excel_arrPage = { pagetable_id: "tempimportExcelbody", editable: true, selectable: true, pagerowscount: 15, currentpage: 1, lastpage: 1, currentrow: 1, currentcol: 0, highlightrowid: 0, trediting: false, filteritem: "", filtervalue: "", datarows: [], getfilter_url: `${viewData_baseUrl_MC}/inboundgetfilteritems`, getColumns_url: `${viewData_baseUrl_FM}/JournalLineApi/getjournallineimportexcelcolumns` };
    excel_pagetables.push(excel_arrPage);

    $(`#tempimportExcelbody .pagetablebody,#tempimportExcelbody .pagination ,#tempimportExcelbody .pagetablefooterinfo `).html("");
}

function showErrorValidtion(errors, pg_name) {

    if (errors !== null && errors.length > 0) {
        const errorsLn = errors.length, index = excel_pagetables.findIndex(a => a.pagetable_id == pg_name);
        let output = "", errorVal = "", errorStr = "";

        excel_pagetables[index].errors = errors;

        for (var i = 0; i < errorsLn; i++) {
            errorVal = errors[i];
            errorStr = errorVal.length <= 30 ? errorVal : `${errors[i].slice(0, 50)} <span class="ml-2"><button class="btn btn-secondary waves-effect" onclick="getMoreError(${i},'${pg_name}')"> <i class="ml-1 fas fa-plus"></i></button></span>`

            output += `<tr><td id="error_${i}">${errorStr}</td></tr>`;
        }

        $(`#tempExcelError`).html(output);


        modal_show("excelErrorResult");
    }
}

function getMoreError(index, pg_name) {
    const ind = excel_pagetables.findIndex(a => a.pagetable_id == pg_name);

    if (ind<0) {
        return;
    }

    const arrayError = excel_pagetables[ind].errors;

    $(`#error_${index}`).html(arrayError[index]);
}

function getrecord(pg_name) {
    let index = excel_pagetables.findIndex(v => v.pagetable_id == pg_name);

    if (index < 0)
        return;


    let pagetable_id = excel_pagetables[index].pagetable_id,
        pagetable_currentrow = excel_pagetables[index].currentrow;
    let indexRow = $(`#${pagetable_id} #row${pagetable_currentrow}`).data().index;
    let data = masterArray[indexRow];

    Object.keys(data)
        .map(item =>
            $(`#${pagetable_id} #row${pagetable_currentrow} #${item}_${pagetable_currentrow}`).val(data[item])
        );
}

window.Parsley._validatorRegistry.validators.reqprices = undefined
window.Parsley.addValidator('reqprices', {
    validateString: (value, valueAttr, resElment) => {

        let row = resElment.$element[0].id.split("_")[1],
            amountDebit = +removeSep($(`#amountDebit_${row}`).val()),
            amountCredit = +removeSep($(`#amountCredit_${row}`).val());

        return !handlerfunction("reqprices", amountDebit, amountCredit);
    },
    messages: {
        en: 'یکی از مبالغ را وارد کنید',
    }
});


window.Parsley._validatorRegistry.validators.bothprices = undefined;
window.Parsley.addValidator('bothprices', {
    validateString: (value, valueAttr, resElment) => {

        let row = resElment.$element[0].id.split("_")[1],
            amountDebit = +removeSep($(`#amountDebit_${row}`).val()),
            amountCredit = +removeSep($(`#amountCredit_${row}`).val());

        return !handlerfunction("bothprices", amountDebit, amountCredit);
    },
    messages: {
        en: 'هر دو مبالغ نمیتواند مقدار داشته باشد',
    }
});
