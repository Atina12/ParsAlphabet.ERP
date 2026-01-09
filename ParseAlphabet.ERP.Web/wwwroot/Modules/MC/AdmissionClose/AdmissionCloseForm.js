var viewData_controllername = "AdmissionCloseApi";
var viewData_get_announcementData = `${viewData_baseUrl_MC}/${viewData_controllername}/announcementcloseLinedetail`,
    viewData_get_realData = `${viewData_baseUrl_MC}/${viewData_controllername}/realcloseLinedetail`,
    viewData_admissionClose_calculate = `${viewData_baseUrl_MC}/${viewData_controllername}/calculate`,
    viewData_admissionClose_display = `${viewData_baseUrl_MC}/${viewData_controllername}/displaysummary`,
    viewData_admissionClose_documentinsert_save = `${viewData_baseUrl_MC}/${viewData_controllername}/documentinsert`,
    viewData_save_closeLine = `${viewData_baseUrl_MC}/${viewData_controllername}/save`,
    viewData_remove_closeLine = `${viewData_baseUrl_MC}/${viewData_controllername}/delete`,
    viewData_settlement_summary = `${viewData_baseUrl_MC}/${viewData_controllername}/summarysettlement`,
    viewData_admissionClose_sum = `${viewData_baseUrl_MC}/${viewData_controllername}/summarysum`,
    viewData_admissionclosecsv_url = `${viewData_baseUrl_MC}/${viewData_controllername}/admissionclosecsv`,
    viewData_currency_dropdown = `${viewData_baseUrl_GN}/CurrencyApi/getdropdown`,
    viewData_getAdmissionCloseCheckExist = `${viewData_baseUrl_MC}/${viewData_controllername}/checkexist`,
    emptyRow = fillEmptyRow(11), close_form_state = "add", sumAnnouncementRow = 0, sumAnnouncementAll = 0, sumRealRow = 0, sumRealAll = 0,
    confirmed = false, workDayDatePersian = "", selectedId = 0, IsClose = false, defaultCurrency = 0, arrSummary = [], arrayAnnouncmentLine = [],
    arrayRealLine = [], currentAnnouncementId = "", currentLineId, currentCloseId = 0, currentUserId = 0, lastpagetable_formkeyvalue = [];



function initCloseForm(callback) {

    $("footer > span").removeClass("d-none")

    loadGetDropDown()

    if (typeof callback === "function")
        callback();
};

function loadGetDropDown() {

    defaultCurrency = getDefaultCurrency();
    fill_select2(`/api/FMApi/fundtype_getdropdown`, "fundTypeId", true, 'adm', false, 0);
    fill_select2(viewData_currency_dropdown, "currencyId", true, 0, false);
}

function display_pagination(opr) {
    var elemId = $("#tempCloseId").val();
    display_paginationAsync(opr, elemId);
}

async function display_paginationAsync(opr, elemId) {

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
    getAdmissionClose(headerPagination)
}

function headerindexChoose(e) {
    let elm = $(e.target);

    if (e.keyCode === KeyCode.Enter) {
        let checkExist = false;
        checkExist = getAdmissionCloseCheckExist(+elm.val());
        if (checkExist) {
            $("#tempCloseId").val(+elm.val())
            getAdmissionClose(0);
            elm.val('')
        }
        else
            alertify.warning("این کد در سیستم وجود ندارد").delay(alertify_delay);
    }
}

function getAdmissionCloseCheckExist(id) {

    let outPut = $.ajax({
        url: viewData_getAdmissionCloseCheckExist,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getAdmissionCloseCheckExist);
        }
    });
    return outPut.responseJSON;
}

function printFrom(id) {
    var p_id = "CloseId";
    var p_value = id;
    var p_type = dbtype.Int;
    var p_size = 0;
    var p_url = `${stimulsBaseUrl.MC.Prn}AdmissionClose1.mrt`;
    var p_isPageTable = false;
    var p_tableName = "";
    var p_keyValue = 0;
    var secondLang = false;

    window.open(`${viewData_print_url}?pUrl=${p_url}&pName=${p_id}&pValue=${p_value}&pType=${p_type}&pSize=${p_size}&isPageTable=${p_isPageTable}&tableName=${p_tableName}&keyValue=${p_keyValue}&isSecondLang=${secondLang}`, '_blank');
}

function exportCSVFrom(id) {
    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    $.ajax({
        url: viewData_admissionclosecsv_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        cache: false,
        success: function (result) {
            if (result.rows.length != 0) {
                generateCsv(result);
            } else {
                var msg = alertify.warning(msg_nothing_found);
                msg.delay(admission.delay);
                return;
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_admissionclosecsv_url)
        }
    });

}

function calculateAgain(branchId, workDayDatePersian, isRefresh = false) {
    if (!isRefresh) {
        currentCloseId = 0;
        currentUserId = 0
    }

    resetRealCash();
    $("#lineId").val("");

    var modelCalculate = {
        opr: "Upd",
        branchId: branchId,
        workDayDatePersian: workDayDatePersian,
        id: $("#tempCloseId").val()
    }

    $.ajax({
        url: viewData_admissionClose_calculate,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        async: false,
        cache: false,
        data: JSON.stringify(modelCalculate),
        success: function (response) {
            if (response !== null) {
                if (response.successfull) {
                    $.when(resetFormAdmClose()).done(function () {
                        fillSummary(response.data);
                    });
                }
                else {
                    if (response.message !== null) {
                        var msgcl = alertify.warning(response.message);
                        msgcl.delay(alertify_delay);
                        return;
                    }
                    generateErrorValidation(response.validationErrors);
                }
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_admissionClose_calculate);

        }
    });
}

function summaryList(branchId, id, isRefresh = false, headerPagination = 0) {
    
    var modelCal = {
        id: id,
        branchId: branchId,
        workDayDatePersian: "",
        directPaging: headerPagination
    }

    var url = viewData_admissionClose_display;
    $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        async: false,
        cache: false,
        data: JSON.stringify(modelCal),
        success: function (response) {
            if (response !== null) {
                if (response.successfull) {

                    if (response.data.length !== 0) {
                        arrSummary = [];
                        arrayAnnouncmentLine = [];
                        arrayRealLine = [];

                        if (!isRefresh) {
                            currentCloseId = 0;
                            currentUserId = 0
                        }

                        close_form_state = "add";
                        $("#announcementLine").html(fillEmptyRow(11));
                        $("#realLine").html(fillEmptyRow(10));
                        $("#sumRowAnnouncement").addClass("displaynone");
                        $("#sumRowReal").addClass("displaynone");
                        $("#sumAnnouncement").val("0");
                        $("#sumAnnouncement").removeClass("sum-is-same");
                        $("#sumReal").val("0");
                        $("#sumReal").removeClass("sum-is-same");

                        resetRealCash();
                        $("#lineId").val("");
                        fillSummary(response.data);
                    }
                }
                else {
                    if (response.statusMessage !== null) {
                        var msgcl = alertify.warning(response.statusMessage);
                        msgcl.delay(alertify_delay);
                    }
                    generateErrorValidation(response.validationErrors);
                }
            }
        },
        error: function (xhr) {
            error_handler(xhr, url);

        }
    });
}

function changeFormAccess(status) {

    if (status == true) {
        $("#confirm").html(`<i class='fas fa-times'></i> لغو / برگشت خزانه `);
        $("#confirm").addClass('btn-warning');
        $("#confirm").removeClass('btn-success');
        $("#calculate").prop("disabled", true);
        $("#realLine button").prop("disabled", true);
        //$("#closeStatus").text('بسته');

    }
    else {
        $("#confirm").html(`<i class='fas fa-check'></i> تائید / ارسال خزانه `);
        $("#confirm").addClass('btn-success');
        $("#confirm").removeClass('btn-warning');
        $("#calculate").prop("disabled", false);
        $("#realLine button").prop("disabled", false);

    }
}

function fillSummary(result) {


    if (result.length === 0 || result === null) {
        var msgNotfind = alertify.warning(msg_nothing_found);
        msgNotfind.delay(alertify_delay);
        return;
    }
    $("#tempCloseId").val(result[0].closeId);
    workDayDatePersian = result[0].workDayDatePersian;
    $("#admissionClose").html("");
    var admissionClose = `<tr>
                               <td>${result[0].closeId}</td>
                               <td>${result[0].treasuryId > 0 ? `<span onclick="click_link_header(this)" data-id="treasuryId" class="itemLink">${result[0].treasuryId}</span>` : `${result[0].treasuryId}`}</td> 
                               <td>${result[0].journalId}</td> 
                               <td>${result[0].branch}</td> 
                               <td>${result[0].closeDateTimePersian}</td> 
                               <td>${result[0].workDayDatePersian}</td> 
                               <td>${result[0].createDateTimePersian}</td> 
                               <td>${result[0].createUser}</td> 
                               <td>${result[0].isClose ? "بسته" : "باز"}</td> 
                           </tr>`
    $("#admissionClose").html(admissionClose);

    IsClose = result[0].isClose;
    let closeLine = result;
    let closeLineLen = closeLine.length,
        output = ``;

    if (closeLineLen > 0) {
        for (var b = 0; b < closeLineLen; b++) {
            var itm = closeLine[b];

            arrSummary.push({ rowNo: b + 1, closeId: itm.closeId, lineId: itm.lineId, userId: itm.userId });

            var model = {
                CloseId: itm.closeId,
                UserId: itm.userId
            };

            var tdClass = "";

            if (itm.settled === 1)
                tdClass = "color-maroon";
            else if (itm.settled === 2)
                tdClass = "color-orange";
            else
                tdClass = "color-green";

            output += `<tr id="cl_${b + 1}" onkeydown="closeRowKeyDown('tempAdmCloseLine',${b + 1},event,${closeLineLen})" onclick="closeRowClick(${b + 1},event)" tabindex="0">
                           <td>${b + 1}</td>
                           <td>${itm.closeId}</td>
                           <td>${itm.userId} - ${itm.userName}</td>
                           <td class='${tdClass}'>${itm.settledName}</td>
                       </tr>`;
        }

        if (output !== "")
            $("#tempAdmCloseLine").html(output);
        else
            $("#tempAdmCloseLine").html(emptyRow);

        closeRowClick(1, event);
    }
    else {
        $("#tempAdmCloseLine").html(emptyRow);
        let msg_line = alertify.warning("سطری وجود ندارد");
        msg_line.delay(alertify_delay);
    }
}

function closeRowKeyDown(tableName, idx, ev, closeLineLen) {

    var rowNo = 0;
    var newElement = [];
    if (ev.which === KeyCode.ArrowDown) {
        ev.preventDefault()
        newElement = $(`#${tableName} #cl_${idx + 1}`);
        if (newElement.length > 0) {


            rowNo = idx + 1;

            $(`#${tableName} tr`).removeClass("highlight");
            newElement.addClass("highlight").focus();
        }
    }
    else if (ev.which === KeyCode.ArrowUp) {
        ev.preventDefault()

        newElement = $(`#${tableName} #cl_${idx - 1}`);
        if (newElement.length > 0) {

            rowNo = idx - 1;

            $(`#${tableName} tr`).removeClass("highlight");
            newElement.addClass("highlight").focus();
        }
    }


    if (ev.which === KeyCode.ArrowDown || ev.which === KeyCode.ArrowUp) {
        ev.preventDefault()


        if (newElement.length > 0) {

            var model = arrSummary.filter(line => line.rowNo === rowNo)[0];

            var closeId = model.closeId;
            var userId = model.userId;

            getAnnouncementData(closeId, userId);
        }
    }
}

function closeRowClick(idx, ev) {
    if ($(`#tempAdmCloseLine #cl_${idx}`).length > 0) {

        $(`#tempAdmCloseLine tr`).removeClass("highlight");
        $(`#cl_${idx}`).addClass("highlight").focus();

        var model = arrSummary.filter(line => line.rowNo === idx)[0];

        var closeId = model.closeId;
        var userId = model.userId;

        getAnnouncementData(closeId, userId);
    }
}

function announcmentRowClick(idx, ev) {
    ev.stopPropagation();
    if ($(`#announcementLine #al_${idx}`).length > 0) {
        $(`#announcementLine tr`).removeClass("highlight");
        $(`#al_${idx}`).addClass("highlight").focus();
        var announcementLine = arrayAnnouncmentLine.find(k => k.rowNumber === idx);

        sumAnnouncementRow = announcementLine.amountExchangeRate;
        getRealData(announcementLine.closeId, announcementLine.lineId, idx)

        currentLineId = announcementLine.lineId;

        if (announcementLine.closeId !== 0 && announcementLine.lineId !== 0) {
            var sumReal = sumAmountAnnouncement() - calculateSumAmount(arrayRealLine);

            if (sumReal != 0) {
                var modelToReal = {
                    inOut: announcementLine.inOut,
                    closeId: announcementLine.closeId,
                    lineId: announcementLine.lineId,
                    detailAccountTypeId: announcementLine.detailAccountTypeId,
                    fundTypeId: announcementLine.fundTypeId,
                    fundTypeName: announcementLine.fundTypeName,
                    currencyId: announcementLine.currencyId,
                    detailAccountId: announcementLine.detailAccountId,
                    detailAccountName: announcementLine.detailAccountName,
                    amount: Math.abs(announcementLine.amount),
                    exchangeRate: Math.abs(announcementLine.exchangeRate),
                    amountExchangeRate: Math.abs(announcementLine.amountExchangeRate)
                }

                setRowToReal(modelToReal);
            }


        }

        currentAnnouncementId = `al_${idx}`;
        afterAppendReal(false);
        //$("#inOut").focus();
    }
}

function realRowClick(id, ev) {

    if ($(`#realLine #rl_${id}`).length > 0) {
        $(`#realLine tr`).removeClass("highlight");
        $(`#rl_${id}`).addClass("highlight").focus();
    }
}

//==========
function getAnnouncementData(closeId, userId) {

    $("#realLine").html(emptyRow);
    arrayRealLine = [];
    resetRealCash();
    //$("#settlementOperation").slideUp();
    $("#sumRowReal").addClass("displaynone");
    $("#sumReal").val("0");
    //$("#addToReal").text("ثبت");

    var url = viewData_get_announcementData;

    $("#announcementLine").html(emptyRow);
    $("#sumRowAnnouncement").addClass("displaynone");
    $("#sumAnnouncement").val("0");
    $("#sumAnnouncement").removeClass("sum-is-same");

    currentCloseId = closeId;
    currentUserId = userId;


    var model = {
        closeId: closeId,
        userId: userId,
    }

    $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        async: false,
        cache: false,
        data: JSON.stringify(model),
        success: function (response) {
            if (response !== null) {
                var sumA = fillAnnouncement(response);
                sumAnnouncementAll = sumA;
            }
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });
}

function fillAnnouncement(data) {
    var announcementLen = data !== null ? data.length : 0,//*
        announcementOutput = "",
        sumAnnouncement = 0;
    arrayAnnouncmentLine = [];

    if (announcementLen > 0) {
        for (var a = 0; a < announcementLen; a++) {

            let itemAnnouncment = data[a];

            var rowNoA = a + 1;

            itemAnnouncment["rowNumber"] = a + 1;

            arrayAnnouncmentLine.push(itemAnnouncment);

            sumAnnouncement += itemAnnouncment.amountExchangeRate;

            var tdClass = "";;
            var tdClass = "";;

            if (itemAnnouncment.settled === 1)
                tdClass = "color-maroon";
            else if (itemAnnouncment.settled === 2)
                tdClass = "color-orange";
            else
                tdClass = "color-green";

            //`<td ${itemAnnouncment.inOut == 2 ? "class='highlight-danger'" : ""}>${itemAnnouncment.openAccountTypeId === 0 ? "" : `${itemAnnouncment.openAccountTypeId} - ${itemAnnouncment.openAccountTypeName}`}</td>`

            announcementOutput += `<tr id="al_${rowNoA}" onclick="announcmentRowClick(${rowNoA}, event)">
                                                   <td ${itemAnnouncment.inOut == 2 ? "class='highlight-danger'" : ""}>${rowNoA}</td>
                                                   <td ${itemAnnouncment.inOut == 2 ? "class='highlight-danger'" : ""}>${itemAnnouncment.lineId}</td>
                                                   <td class="displaynone">${itemAnnouncment.detailAccountTypeId}</td>
                                                   <td ${itemAnnouncment.inOut == 2 ? "class='highlight-danger'" : ""}>${itemAnnouncment.inOut === 1 ? "1 - دریافت" : "2 - پرداخت"}</td>
                                                   <td ${itemAnnouncment.inOut == 2 ? "class='highlight-danger'" : ""}>${itemAnnouncment.fundTypeId} - ${itemAnnouncment.fundTypeName}</td>
                                                   <td ${itemAnnouncment.inOut == 2 ? "class='highlight-danger'" : ""}>${itemAnnouncment.currencyName}</td>
                                                   <td ${itemAnnouncment.inOut == 2 ? "class='highlight-danger'" : ""}>${itemAnnouncment.detailAccountId === 0 ? "" : `${itemAnnouncment.detailAccountId} - ${itemAnnouncment.detailAccountName}`}</td>
                                                   <td ${itemAnnouncment.inOut == 2 ? "class='highlight-danger'" : ""}>${itemAnnouncment.amount >= 0 ? transformNumbers.toComma(itemAnnouncment.amount) : `(${transformNumbers.toComma(Math.abs(itemAnnouncment.amount))})`}</td>
                                                   <td ${itemAnnouncment.inOut == 2 ? "class='highlight-danger'" : ""}>${itemAnnouncment.exchangeRate >= 0 ? transformNumbers.toComma(itemAnnouncment.exchangeRate) : `${transformNumbers.toComma(Math.abs(itemAnnouncment.exchangeRate))}`}</td>
                                                   <td ${itemAnnouncment.inOut == 2 ? "class='highlight-danger'" : ""}>${itemAnnouncment.amountExchangeRate >= 0 ? transformNumbers.toComma(itemAnnouncment.amountExchangeRate) : `(${transformNumbers.toComma(Math.abs(itemAnnouncment.amountExchangeRate))})`}</td>
                                                   <td ${itemAnnouncment.inOut == 2 ? "class='highlight-danger'" : ""}><div class ='${tdClass}'>${itemAnnouncment.settledName}</div></td>
                                                   <td>
                                                        <button type = "button" onclick="announcmentRowClick(${rowNoA}, event)" class="btn blue_outline_1" title="ثبت">
                                                            <i class="fa fa-arrow-down"></i>
                                                        </button>
                                                   </td>
                                               </tr>`;
        }

        if (sumAnnouncement < 0)
            $("#sumAnnouncement").html(`(${transformNumbers.toComma(Math.abs(sumAnnouncement))})`);
        else
            $("#sumAnnouncement").html(`${transformNumbers.toComma(sumAnnouncement)}`);

        $("#sumRowAnnouncement").removeClass("displaynone");
        $("#announcementLine").html(announcementOutput);

        $(`#announcementLine tr`).removeClass("highlight");

        $(`#announcementLine > #al_${1}`).addClass("highlight").click();

    }

    return sumAnnouncement;
}
//==========

//==========
function getRealData(closeId, lineId, aRowNo) {

    arrayRealLine = [];
    close_form_state = "add";
    $("#sumRowReal").addClass("displaynone");
    $("#sumReal").val("0");
    $("#sumReal").removeClass("sum-is-same");

    var model = {
        closeId: closeId,
        lineId: lineId
    }

    var url = viewData_get_realData;

    $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        async: false,
        cache: false,
        data: JSON.stringify(model),
        success: function (response) {
            if (response !== null)
                sumRealAll = fillReal(response, aRowNo);

            changeFormAccess(IsClose);
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });
}

function fillReal(data, aRowNumber) {

    let realLen = data !== null ? data.length : 0,
        realOutput = "",
        sumReal = 0;
    arrayRealLine = [];

    if (realLen > 0) {

        for (var r = 0; r < realLen; r++) {

            let itemReal = data[r];

            var rowNoR = r + 1;

            itemReal["rowNumber"] = rowNoR;
            itemReal["amount"] = Math.abs(itemReal["amount"]);
            itemReal["amountExchangeRate"] = Math.abs(itemReal["amountExchangeRate"]);
            arrayRealLine.push(itemReal);

            //<td ${itemReal.inOut == 2 ? "class='highlight-danger'" : ""}>${itemReal.openAccountTypeId === 0 ? "" : `${itemReal.openAccountTypeId} - ${itemReal.openAccountTypeName}`}</td>

            realOutput += `<tr id="rl_${itemReal.id}" onclick="realRowClick(${itemReal.id}, event)">
                                           <td ${itemReal.inOut == 2 ? "class='highlight-danger'" : ""}>${rowNoR}</td>
                                           <td ${itemReal.inOut == 2 ? "class='highlight-danger'" : ""}>${itemReal.id}</td>
                                           <td ${itemReal.inOut == 2 ? "class='highlight-danger'" : ""}>${itemReal.inOut === 1 ? "1 - دریافت" : "2 - پرداخت"}</td>
                                           <td ${itemReal.inOut == 2 ? "class='highlight-danger'" : ""}>${itemReal.fundTypeId} - ${itemReal.fundTypeName}</td>
                                           <td ${itemReal.inOut == 2 ? "class='highlight-danger'" : ""}>${itemReal.currencyId !== 0 ? `${itemReal.currencyId} - ${itemReal.currencyName}` : ""}</td>
                                           <td ${itemReal.inOut == 2 ? "class='highlight-danger'" : ""}>${itemReal.detailAccountId === 0 ? "" : `${itemReal.detailAccountId} - ${itemReal.detailAccountName}`}</td>
                                           <td ${itemReal.inOut == 2 ? "class='highlight-danger'" : ""}>${itemReal.amount >= 0 ? transformNumbers.toComma(itemReal.amount) : `(${transformNumbers.toComma(Math.abs(itemReal.amount))})`}</td>
                                           <td ${itemReal.inOut == 2 ? "class='highlight-danger'" : ""}>${itemReal.exchangeRate >= 0 ? transformNumbers.toComma(itemReal.exchangeRate) : `${transformNumbers.toComma(Math.abs(itemReal.exchangeRate))}`}</td>
                                           <td ${itemReal.inOut == 2 ? "class='highlight-danger'" : ""}>${itemReal.amountExchangeRate >= 0 ? transformNumbers.toComma(itemReal.amountExchangeRate) : `(${transformNumbers.toComma(Math, abs(itemReal.amountExchangeRate))})`}</td>
                                           <td>
                                                <button type = "button"  onclick = "editRealItem(${itemReal.id})" class="btn green_outline_1" title="ویرایش">
                                                    <i class="fa fa-edit"></i>
                                                </button>
                                                <button type = "button" onclick = "removeRealItem(${itemReal.id})" class="btn maroon_outline" title="حذف">
                                                    <i class="fa fa-trash"></i>
                                                </button>
                                           </td>
                                        </tr>`;
        }

        sumReal = calculateSumAmount(arrayRealLine);

        if (sumReal > 0 || sumReal < 0) {
            $("#sumReal").text(sumReal >= 0 ? transformNumbers.toComma(sumReal) : `(${transformNumbers.toComma(Math.abs(sumReal))})`);
            $("#sumRowReal").removeClass("displaynone");
        }

        $("#realLine").html(realOutput);
    }
    return sumReal;
}
//==========

function acceptRowToReal(rowNumber, closeId, lineId, detailAccountTypeId, inOut, ev) {
    ev.preventDefault();
    ev.stopPropagation();
    currentLineId = lineId;

    var announcement = arrayAnnouncmentLine.filter(line =>
        line.rowNumber === rowNumber &&
        line.closeId === closeId &&
        line.lineId === lineId &&
        line.detailAccountTypeId === detailAccountTypeId
    )[0];

    //openAccountTypeId: announcement.openAccountTypeId,
    var announcementToReal = {
        closeId: announcement.closeId,
        lineId: announcement.lineId,
        detailAccountTypeId: announcement.detailAccountTypeId,
        fundTypeId: announcement.fundTypeId,
        fundTypeName: announcement.fundTypeName,
        openAccountTypeName: announcement.openAccountTypeName,
        detailAccountId: announcement.detailAccountId,
        detailAccountName: announcement.detailAccountName,
        amount: announcement.amount
    }

    sumAnnouncementRow = announcement.amountExchangeRate;

    getRealData(closeId, lineId, rowNumber);
    isSameSumClose();

    if (announcementToReal.closeId !== 0 && announcementToReal.lineId !== 0)
        setRowToReal(announcementToReal);

    currentAnnouncementId = `al_${rowNumber}`;

    if ($(`#${currentAnnouncementId}`).length > 0) {
        $(`#announcementLine tr`).removeClass("highlight");
        $(`#${currentAnnouncementId}`).addClass("highlight").focus();
    }
}

function appendRowToReal(itemReal) {

    var emptyRowLen = $("#realLine #emptyRow").length

    if (emptyRowLen !== 0) {
        $("#realLine").html("");
    }

    var rowNo = arrayRealLine.length;
    var output = "";

    //<td ${itemReal.inOut == 2 ? "class='highlight-danger'" : ""}>${itemReal.openAccountTypeId === 0 ? "" : `${itemReal.openAccountTypeName}`}</td>

    output = `
        <tr id="rl_${itemReal.id}" onclick="realRowClick(${itemReal.id}, event)">
            <td ${itemReal.inOut == 2 ? "class='highlight-danger'" : ""}>${rowNo}</td>
            <td ${itemReal.inOut == 2 ? "class='highlight-danger'" : ""}>${itemReal.id}</td>
            <td ${itemReal.inOut == 2 ? "class='highlight-danger'" : ""}>${itemReal.inOut === 1 ? "1 - دریافت" : "2 - پرداخت"}</td>
            <td ${itemReal.inOut == 2 ? "class='highlight-danger'" : ""}>${itemReal.fundTypeName}</td>
            <td ${itemReal.inOut == 2 ? "class='highlight-danger'" : ""}>${itemReal.currencyName}</td>
            <td ${itemReal.inOut == 2 ? "class='highlight-danger'" : ""}>${itemReal.detailAccountId === 0 ? "" : `${itemReal.detailAccountName}`}</td>
            <td ${itemReal.inOut == 2 ? "class='highlight-danger'" : ""}>${transformNumbers.toComma(itemReal.amount)}</td>
            <td ${itemReal.inOut == 2 ? "class='highlight-danger'" : ""}>${transformNumbers.toComma(itemReal.exchangeRate)}</td>
            <td ${itemReal.inOut == 2 ? "class='highlight-danger'" : ""}>${transformNumbers.toComma(itemReal.amountExchangeRate)}</td>
            <td>
                <button type = "button" onclick = "editRealItem(${itemReal.id})" class="btn green_outline_1" title="ویرایش"><i class="fa fa-edit"></i> </button>
                <button type = "button" onclick = "removeRealItem(${itemReal.id})" class="btn maroon_outline" title="حذف"><i class="fa fa-trash"></i></button>
            </td>
        </tr>`;

    $(output).appendTo("#realLine");

    resetRealCash();
}

function afterAppendReal(isTrigger) {

    newAmountReal();
    isSameSumClose(isTrigger);

    var sumAmountCash = calculateSumAmount(arrayRealLine);


    if (arrayRealLine.length > 0) {
        $("#sumRowReal").removeClass("displaynone");
    }
    else {
        $("#sumRowReal").addClass("displaynone");
        $("#realLine").html(emptyRow)
    }
    $("#sumReal").text(sumAmountCash >= 0 ? transformNumbers.toComma(sumAmountCash) : `(${transformNumbers.toComma(Math.abs(sumAmountCash))})`);
}

function setRowToReal(itemReal) {

    var newAmount = sumAmountAnnouncement() - calculateSumAmount(arrayRealLine);

    var newInOut = newAmount >= 0 ? 1 : 2;

    var getfundType = {
        saleTypeId: newInOut,
        inOut: newInOut,
        typeId: 0
    };

    $("#fundTypeId").html("");

    fillFundTypeAdmClose(getfundType, "fundTypeId");

    var rowNo = arrayRealLine.length + 1;
    $("#rowNumber").val(rowNo);
    $("#closeId").val(itemReal.closeId);
    $("#lineId").val(itemReal.lineId);

    if (arrayRealLine.length == 0)
        $("#fundTypeId").val(itemReal.fundTypeId).trigger("change.select2");
    else
        $("#fundTypeId").prop("selectedIndex", 0).trigger("change.select2");

    $("#inOut").val(newInOut);
    $("#exchangeRate").val(transformNumbers.toComma(itemReal.exchangeRate));
    $("#currencyId").val(itemReal.currencyId).trigger("change.select2");
    closeConfigDisabledEnable(true, newInOut, +$("#fundTypeId").val(), itemReal.currencyId, itemReal.detailAccountId, itemReal.detailAccountName);

}

function fillFundTypeAdmClose(getModel, elementId) {

    var p_url = `/api/FMApi/fundtypeadm_getdropdown`

    $.ajax({
        url: p_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(getModel),
        success: function (result) {
            if (result) {
                var list = result;
                var str = "";
                for (var i = 0; i < list.length; i++) {
                    var item = list[i];
                    var text = `${item.id} - ${item.name}`;

                    if (i !== 0)
                        str += `<option value="${item.id}">${text}</option>`;
                    else
                        str += `<option value="${item.id}" selected>${text}</option>`;
                }
                $(`#${elementId}`).append(str);
            }
        },
        error: function (xhr) {
            error_handler(xhr, p_url)
        }
    });
}

function resetRealCash() {
    $("#rowNumber").val("");
    $("#realId").val("");
    $("#fundTypeId").val(1).trigger("change");
    $("#detailAccountId").val(0);
    $("#exchangeRate").val(0)
    $("#amount").val("");
    close_form_state = "add";
}

function calculateSumAmount(arr) {
    if (arr === null) return 0;
    var amountIn = 0, amountOut = 0;
    for (var i = 0; i < arr.length; i++) {
        var item = arr[i];

        if (item.inOut === 1)
            amountIn += +item.amountExchangeRate;
        else
            amountOut += +item.amountExchangeRate;
    }

    return amountIn - amountOut;
}

function newAmountReal() {
    var newAmount = sumAmountAnnouncement() - calculateSumAmount(arrayRealLine);
    let exchangeRate = +removeSep($("#exchangeRate").val());
    newAmount < 0 ? $("#amount").addClass("highlight-danger") : $("#amount").removeClass("highlight-danger");
    newAmount = +exchangeRate > 0 ? newAmount / exchangeRate : newAmount;

    $("#amount").val(transformNumbers.toComma(Math.abs(newAmount)));

    if (+$("#currencyId").val() == defaultCurrency) {
        $("#amountExchangeRate").val(transformNumbers.toComma(Math.abs(newAmount)));
    }
    else {
        newAmount = +removeSep($("#amount").val()) * (exchangeRate > 0 ? exchangeRate : 1);
        $("#amountExchangeRate").val(transformNumbers.toComma(Math.abs(newAmount)));
    }
}

var sumAmountAnnouncement = () => sumAnnouncementRow;

function pushItemToReal(itm) {

    var amount = $("#amount").val();
}

function editRealItem(realId) {

    var real = arrayRealLine.filter(line => line.id === realId)[0];
    selectedId = realId;
    if (real === null) return;

    $("#inOut").val(real.inOut);

    var getfundType = {
        saleTypeId: +$("#inOut").val(),
        inOut: +$("#inOut").val(),
        typeId: 0
    };

    $("#fundTypeId").html("");

    fillFundTypeAdmClose(getfundType, "fundTypeId");

    $("#rowNumber").val(real.rowNumber);
    $("#realId").val(real.id);
    $("#currencyId").val(real.currencyId).trigger("change.select2");
    $("#fundTypeId").val(real.fundTypeId).trigger("change.select2");

    closeConfigDisabledEnable(true, real.inOut, real.fundTypeId, real.currencyId, real.detailAccountId, real.detailAccountName, true);

    $("#amount").val(transformNumbers.toComma(real.amount));
    $("#amountExchangeRate").val(transformNumbers.toComma(real.amountExchangeRate));
    $("#exchangeRate").val(transformNumbers.toComma(real.exchangeRate));

    close_form_state = "edit";



    $("#inOut").focus();
}

function removeRealItem(realId) {
    $(`#realLine tr#rl_${realId}`).remove();
    var arrayRealLen = arrayRealLine.length;
    var result = removeRealLine(realId);

    if (result.status === 100) {

        for (var x = 0; x < arrayRealLen; x++) {
            var rl = arrayRealLine[x];
            if (rl.id === realId) {
                arrayRealLine.splice(x, 1);
                break;
            }
        }


        afterAppendReal(false);
        checkSettlement();
        rebuildRowCashReal();
        setSumAdmissionClose(currentCloseId);

        //if (arrayRealLine.length === 0) {
        //    $(`#realLine`).html(emptyRow);
        //}
        //else
        //    $("#inOut").focus();

        $("#announcementLine tr.highlight").click();
        $("#inOut").focus();
    }

}

function rebuildRowCashReal() {
    var arr = arrayRealLine;
    var table = "realLine";
    if (arr.length === 0 || table === "")
        return;

    var arrLen = arr.length;
    for (var j = 0; j < arrLen; j++) {
        var newRowNo = j + 1;
        arr[j].rowNumber = newRowNo;
        $(`#realLine tr`)[j].setAttribute("id", `rl_${arr[j].id}`);
        $(`#realLine tr`)[j].children[0].innerText = arr[j].rowNumber;

        if ($(`#realLine tr`)[j].children[10].innerHTML !== "") {
            $(`#realLine tr`)[j].children[10].innerHTML = `
                                                          <button type = "button" onclick = "editRealItem(${arr[j].id})" class="btn green_outline_1" title="ویرایش">
                                                              <i class="fa fa-edit"></i>
                                                          </button>
                                                          <button type = "button" onclick = "removeRealItem(${arr[j].id})" class="btn maroon_outline" title="حذف">
                                                              <i class="fa fa-trash"></i>
                                                          </button>`;
        }
    }

    return arr;
}

function checkExistOpenAccTypeAdmClose(inOut, fundType, detailAccountId) {
    //openAccType
    var lenRealCash = arrayRealLine.length;
    var existOpenAcc = false;
    for (var a = 0; a < lenRealCash; a++) {
        var lrc = arrayRealLine[a];

        if (fundType === 2) {
            if (lrc.fundTypeId === fundType && lrc.detailAccountId === detailAccountId) {
                existOpenAcc = true;
                break;
            }
        }
        else if (fundType != 1 && fundType != 2) {
            if (lrc.inOut == inOut && lrc.fundTypeId === fundType && lrc.detailAccountId === detailAccountId) {
                existOpenAcc = true;
                break;
            }
        }
    }

    return existOpenAcc;
}

function isSameSumClose(isTrigger = true) {
    var sumAmountCash = calculateSumAmount(arrayRealLine);
    var sumReal = sumAmountAnnouncement() - calculateSumAmount(arrayRealLine);

    $("#sumReal").removeClass("sum-is-same");
    $(`#announcementLine > tr > td`).removeClass("sum-is-same");



    // اگر ته جمع اظهاری با ته جمع واقعی مساوی بود
    if (sumReal === 0) {
        $("#sumReal").addClass("sum-is-same");
        $("#amount").removeClass("highlight-danger")


        var currentAnnouncement = arrayAnnouncmentLine.find(ann => ann.lineId == currentLineId);
        if (typeof currentAnnouncement == "undefined")
            return;
        var announcementAmount = currentAnnouncement.amount;
        var announcementRowNumber = currentAnnouncement.rowNumber;

        if (announcementAmount == sumAmountCash) {
            $("#sumReal").addClass("sum-is-same");
            $(`#al_${announcementRowNumber} td:eq(10)`).addClass("sum-is-same");
        }

        closeConfigDisabledEnable(false);
    }
    else {
        //$("#currencyId").val(defaultCurrency).trigger("change.select2");

        if (+$("#currencyId").val() != defaultCurrency) {
            let exchangeRate = +removeSep($("#exchangeRate").val());
            sumReal = +exchangeRate > 0 ? sumReal / exchangeRate : sumReal;
        }

        $("#amount").val(transformNumbers.toComma(Math.abs(sumReal)));

        if (sumReal < 0) {
            $("#inOut").val(2);
            $("#amount").addClass("highlight-danger");
        }
        else if (sumReal > 0) {
            $("#inOut").val(1);
            $("#amount").removeClass("highlight-danger");
        }

        if (isTrigger) {
            $("#inOut").trigger("change");
            $("#inOut").focus();
        }

    }


}

function getIsSameSum() {
    var sumReal = sumAmountAnnouncement() - calculateSumAmount(arrayRealLine);
    return sumReal;
}

function findSettledRow() {

    if (arrayAnnouncmentLine !== null) {
        if (arrayAnnouncmentLine.length > 0) {

            var annoncementlength = arrayAnnouncmentLine.length;
            currentAnnouncementId = "";

            for (var y = 0; y < annoncementlength; y++) {
                var row = arrayAnnouncmentLine[y];

                if (row.detailSettled === 3) {
                    currentAnnouncementId = `al_${row.rowNumber}`;
                    // sumAnnouncementRow = row.amount;
                    //isSameSumClose();
                    break;
                }
            }
        }
    }
}

function setSumAdmissionClose(closeId) {
    var sumSummary = getJsonData(viewData_admissionClose_sum, "json", closeId);

    $("#remainAmount").val(transformNumbers.toComma(sumSummary.responseJSON));
}

function resetFormAdmClose() {

    arrSummary = [];
    arrayAnnouncmentLine = [];
    arrayRealLine = [];
    currentCloseId = 0;
    currentUserId = 0
    currentLineId = 0;

    $("#tempAdmCloseLine").html(emptyRow);
    $("#announcementLine").html(emptyRow);
    $("#realLine").html(emptyRow);

    //$("#id").val("");
    //$("#remainAmount").val("");
    $("#createDateTimePersian").val("");

    $("#sumRowCash").addClass("displaynone");
    $("#sumCash").val("");

    $("#sumRowAnnouncement").addClass("displaynone");
    $("#sumAnnouncement").val("");

    $("#sumRowReal").addClass("displaynone");
    $("#sumReal").val("");

    $("#sumAnnouncement").removeClass("sum-is-same");
    $("#sumReal").removeClass("sum-is-same");

    close_form_state = "add";

    sumAnnouncementRow = 0;
    sumAnnouncementAll = 0;
    sumRealRow = 0;
    sumRealAll = 0;
    currentAnnouncementId = "";
}

function getAdmissionClose(headerPagination = 0) {
    summaryList(+$("#routBranchId").val(), $("#tempCloseId").val(), false, headerPagination);
}

function SaveRealLine(model) {

    var output = $.ajax({
        url: viewData_save_closeLine,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        async: false,
        cache: false,
        data: JSON.stringify(model),
        success: function (result) {

            // $("#remainAmount").val(transformNumbers.toComma(result.sumAdmissionClose));
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_save_closeLine);
            var model = {
                successfull: false,
                status: -102,
                statusMessage: "عملیات با خطا مواجه شد"
            }
            return JSON.parse(model);
        }
    });

    return output.responseJSON;
}

function removeRealLine(id) {

    var output = $.ajax({
        url: viewData_remove_closeLine,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        async: false,
        cache: false,
        data: JSON.stringify(id),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_remove_closeLine);
            var model = {
                successfull: false,
                status: -100,
                statusMessage: "عملیات با خطا مواجه شد"
            }
            return JSON.parse(model);
        }
    });

    return output.responseJSON;
}

function checkSettlementSummary(closeId, userId) {

    var model = {
        closeId: closeId,
        userId: userId
    }

    var output = $.ajax({
        url: viewData_settlement_summary,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        async: false,
        cache: false,
        data: JSON.stringify(model),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_settlement_summary);
            return 1
        }
    });

    return output.responseJSON;
}

function checkSettlementAnnouncement(closeId, lineId) {

    var model = {
        closeId: closeId,
        lineId: lineId
    }

    url = `${viewData_baseUrl_MC}/${viewData_controllername}/announcementSettlement`;

    var output = $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        async: false,
        cache: false,
        data: JSON.stringify(model),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return 1
        }
    });

    return output.responseJSON;
}

function checkSettlement() {
    var setSummary = checkSettlementSummary(currentCloseId, currentUserId);
    var setAnnouncement = checkSettlementAnnouncement(currentCloseId, currentLineId);

    var summaryRowNo = arrSummary.filter(s => s.closeId === currentCloseId && s.userId === currentUserId)[0].rowNo;
    var announcementRowNo = arrayAnnouncmentLine.filter(s => s.closeId === currentCloseId && s.lineId === currentLineId)[0].rowNumber;

    var summarySett = "";
    var announcementSett = "";

    if (setSummary.settled === 1)
        summarySett = "<div class=\"color-maroon\">1 - تسویه نشده</div>";
    else if (setSummary.settled === 2)
        summarySett = "<div class=\"color-orange\">2 - در جریان تسویه</div>";
    else
        summarySett = "<div class=\"color-green\">3 - تسویه شده</div>";

    $(`#tempAdmCloseLine #cl_${summaryRowNo} td:eq(3)`).html(summarySett);

    if (setAnnouncement.settled === 1)
        announcementSett = "<div class=\"color-maroon\">1 - تسویه نشده</div>";
    else if (setAnnouncement.settled === 2)
        announcementSett = "<div class=\"color-orange\">2 - در جریان تسویه</div>";
    else
        announcementSett = "<div class=\"color-green\">3 - تسویه شده</div>";

    $(`#announcementLine #al_${announcementRowNo} td:eq(10)`).html(announcementSett);

}

function getConflictAmount(rowNo) {

    var announcementAmount = arrayAnnouncmentLine.find(k => k.rowNumber === rowNo).amount;

    var realAmount = 0
    var realLength = arrayRealLine.length

    for (var q = 0; q < realLength; q++) {
        realAmount += arrayRealLine[q].amount;
    }

    return announcementAmount - realAmount;

}

function click_link_header(elm) {
    
    navigateToModalTreasury(`/FM/NewTreasuryLine/display/${$(elm).text()}/0/0/57/6`);
    $("#treasuryLineDisplayPage .button-items").remove()
}

function navigateToModalTreasury(href) {

    initialPage();
    $("#contentdisplayTreasuryLine #content-page").addClass("displaynone");
    $("#contentdisplayTreasuryLine #loader").removeClass("displaynone");
    lastpagetable_formkeyvalue = pagetable_formkeyvalue;
    $.ajax({
        url: href,
        type: "get",
        datatype: "html",
        contentType: "application/html; charset=utf-8",
        async: false,
        cache: false,
        dataType: "html",
        success: function (result) {
            $(`#contentdisplayTreasuryLine`).html(result);
        },
        error: function (xhr) {
            error_handler(xhr, href);
        }
    });
    $("#contentdisplayTreasuryLine #loader,#contentdisplayTreasuryLine #formHeaderLine #header-div .button-items").addClass("displaynone");
    $("#contentdisplayTreasuryLine #content-page").fadeIn().removeClass("displaynone").css("margin", 0);
    $("#contentdisplayTreasuryLine #form,#contentdisplayTreasuryLine .content").css("margin", 0);
    $("#contentdisplayTreasuryLine .itemLink").css("pointer-events", " none");
}

function reset_toParentForm() {
    pagetable_formkeyvalue = [0];
    viewData_form_title = "بستن صندوق";
    viewData_controllername = "AdmissionCloseApi";
}

async function closeConfigDisabledEnable(isEnable, inOut = 0, fundType = 0, currency = defaultCurrency, detailAccount = 0, detailAccountName = "", isEdit = false) {

    if (isEnable) {

        enabledReset();

        if (fundType == 0) {
            fundType = 1;
            $("#fundTypeId").val(1).trigger("change.select2");
        }

        if (+currency == 0) {
            currency = defaultCurrency;
            $("#currencyId").val(defaultCurrency).trigger("change.select2");
        }
        else {
            $("#currencyId").val(currency).trigger("change.select2");
        }

        configOpenAcc(fundType, detailAccount, detailAccountName, isEdit, inOut, currency);

    }
    else {
        $("#inOut").prop("disabled", true).val(1).trigger("change.select2");
        $("#fundTypeId").prop("disabled", true).val(1).trigger("change.select2");
        $("#detailAccountId").prop("disabled", true).val(0).trigger("change.select2");
        $("#currencyId").prop("disabled", true);
        $("#amount").prop("disabled", true).val(0);
        $("#exchangeRate").prop("disabled", true).val("");
        $("#amountExchangeRate").prop("disabled", true).val(0);
        $("#addToReal").prop("disabled", true);
    }
}

function configCurrency(currency) {
    if (currency == defaultCurrency) {
        var newAmount = sumAmountAnnouncement() - calculateSumAmount(arrayRealLine);
        $("#amount").val(transformNumbers.toComma(Math.abs(newAmount)));
        $("#exchangeRate").prop("disabled", true).val(1);
    }
    else {
        $("#amount").val(0);
        $("#exchangeRate").prop("disabled", false);
    }

}

function configOpenAcc(fundType, detailAccount, detailAccountName, isEdit, inOut, currency = defaultCurrency) {

    $("#currencyId").prop("disabled", true);
    $("#exchangeRate").prop("disabled", true);
    $("#detailAccountId").empty();
    //$("#detailAccountId").val(0).trigger("change");

    if (fundType == 1) {

        configCurrency(currency)

        if (inOut == 1) {
            $("#currencyId").prop("disabled", false);
            $("#detailAccountId").prop("disabled", true).val(0).trigger("change.select2");
        }
        else {
            $("#currencyId").prop("disabled", false);
            $("#detailAccountId").prop("disabled", true).val(0).trigger("change.select2");
        }

    }
    else if (fundType == 2) {
        fill_select2(`${viewData_baseUrl_FM}/BankAccountApi/getdropdown`, "detailAccountId", true, 0, false, 0, "انتخاب شماره حساب");
        $("#detailAccountId").val(detailAccount).trigger("change").prop("disabled", false);
        $("#currencyId").val(defaultCurrency).trigger("change.select2").prop("disabled", true);
        $("#exchangeRate").val(1).prop("disabled", true);
    }
    else if (fundType == 11)//fundType == 1
        fill_select2(`${viewData_baseUrl_MC}/PatientApi/getdropdown`, "detailAccountId", true, "1", true, 3, "مراجعه کننده");
    else if (fundType == 12 || fundType == 16)//fundType == 12 || fundType == 16
        fill_select2(`${viewData_baseUrl_MC}/AttenderApi/getdropdown`, "detailAccountId", true, "1", true, 3, "داکتر");
    else if (fundType == 13 || fundType == 10)//fundType == 3 || fundType == 7
        fill_select2(`${viewData_baseUrl_HR}/EmployeeApi/getdropdown`, "detailAccountId", true, 0, true, 3, "پرسنل");
    else if (fundType == 14 || fundType == 15)//fundType == 14 || fundType == 0 || fundType == 15
        $("#detailAccountId").prop("disabled", true).empty().trigger("change");

    //if (detailAccount !== 0 && (fundType == 11 || fundType == 12 || fundType == 13 || fundType == 16 || fundType == 10)) {
    //    let option = null;
    //    var newDetailAccountArray = detailAccountName.split('-');
    //    if (newDetailAccountArray.length == 1)
    //        option = new Option(`${detailAccount} - ${detailAccountName}`, detailAccount, true, true);
    //    else
    //        option = new Option(`${detailAccountName}`, detailAccount, true, true);
    //    $("#detailAccountId").prop("disabled", false).append(option).trigger('change');
    //}
}

function enabledReset() {
    if ($("#inOut").prop("disabled"))
        $("#inOut").prop("disabled", false);
    if ($("#fundTypeId").prop("disabled"))
        $("#fundTypeId").prop("disabled", false);
    if ($("#detailAccountId").prop("disabled"))
        $("#detailAccountId").prop("disabled", false);
    if ($("#currencyId").prop("disabled"))
        $("#currencyId").prop("disabled", false);
    if ($("#amount").prop("disabled"))
        $("#amount").prop("disabled", false);
    if ($("#exchangeRate").prop("disabled"))
        $("#exchangeRate").prop("disabled", false);
    if ($("#addToReal").prop("disabled"))
        $("#addToReal").prop("disabled", false);
}

document.onkeydown = function (e) {

    if (e.ctrlKey && e.keyCode === KeyCode.key_s) {
        e.preventDefault();
        $("#confirm").click();
    }
};

$("#fundTypeId").on("change", function () {
    if (!$(this).prop("disabled"))
        closeConfigDisabledEnable(true, +$("#inOut").val(), +$("#fundTypeId").val(), +$("#currencyId").val(), +$("#detailAccountId").val(), $("#detailAccountId option:selected").text().split("-")[1]);
});

$("#inOut").on("change", function () {

    var getfundType = {
        saleTypeId: +$("#inOut").val(),
        inOut: +$("#inOut").val(),
    };

    $("#fundTypeId").html("");

    fillFundTypeAdmClose(getfundType, "fundTypeId");

    $("#fundTypeId").prop("selectedIndex", 0).trigger("change");

    closeConfigDisabledEnable(true, +$("#inOut").val(), +$("#fundTypeId").val(), defaultCurrency);
});

$("#printForm").on("click", function () {
    let id = +$("#tempCloseId").val();
    if (id !== 0)
        printFrom(id);
});

$("#exportCSV").on("click", function () {
    let id = +$("#tempCloseId").val();
    if (id !== 0)
        exportCSVFrom(id);
});

$("#list").on("click", function () {
    navigation_item_click("/MC/AdmissionClose", "بستن صندوق");
});

$("#currencyId").on("change", function () {

    if (!$(this).prop("disabled"))
        closeConfigDisabledEnable(true, +$("#inOut").val(), +$("#fundTypeId").val(), +$("#currencyId").val(), +$("#detailAccountId").val(), $("#detailAccountId option:selected").text().split("-")[1]);
});

$("#calculate").on("click", function (cl) {

    //alertify.confirm('محاسبه مجدد', "برای محاسبه مجدد اطمینان دارید؟",
    alertify.confirm('محاسبه مجدد', "توجه !!! بعد از اجرای محاسبه مجدد کلیه محاسبات قبلی حذف خواهد شد.",
        function () {
            $(`.spinner-border`).removeClass("displaynone");
            $.when(calculateAgain(+$("#routBranchId").val(), workDayDatePersian, isRefresh = false)).done(function () {
                $(`.spinner-border`).addClass("displaynone");
            });
        },
        function () {
            var msg = alertify.error('انصراف از محاسبه');
            msg.delay(admission.delay);
        }
    ).set('labels', { ok: 'بله', cancel: 'خیر' });
});

$("#confirm").on("click", function () {

    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    var modelConfirm = {
        closeId: $("#tempCloseId").val(),
        closeDateTimePersian: "",
        confirm: !IsClose
    }

    $.ajax({
        url: viewData_admissionClose_documentinsert_save,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        async: false,
        cache: false,
        data: JSON.stringify(modelConfirm),
        success: function (result) {

            if (result.successfull) {
                var msgError = alertify.success(result.statusMessage);
                msgError.delay(alertify_delay);

                IsClose = !IsClose;
                changeFormAccess(IsClose);

                getAdmissionClose();
            }
            else {
                var errors = result.validationMessageError;
                var output = "";
                $("#documentInsertErrror").html(output);

                for (var i = 0; i < errors.length; i++) {
                    var error = errors[i];

                    if (error.id === -100)
                        output += `<tr><td class="col-width-percent-30">برگه</td><td>${error.statusMessage}</td></tr>`;

                    if (error.id === -101)
                        output += `<tr><td class="col-width-percent-30">سال مالی</td><td>${error.statusMessage}</td></tr>`;

                    if (error.id === -102)
                        output += `<tr><td class="col-width-percent-30">تفصیل های تعریف نشده</td><td>${error.statusMessage}</td></tr>`;

                    if (error.id === -103)
                        output += `<tr><td>خطای سند</td><td>${error.statusMessage}</td></tr>`;

                    if (error.id === -104)
                        output += `<tr><td class="col-width-percent-30">خطای دیتابیس</td><td>${error.statusMessage}</td></tr>`;
                }

                $("#documentInsertErrror").html(output);
                modal_show("documentInsertErrorResultModal");
                return false;
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_admissionClose_documentinsert_save);
        }
    });
});

$("#addToReal").on("click", function () {

    if (defaultCurrency !== +$("#currencyId").val())
        if (+removeSep($("#exchangeRate").val()) === 0) {
            var msgExchangeRate = alertify.warning("مقدار نرخ تسعیر در حالت ارزی اجباریست");
            msgExchangeRate.delay(alertify_delay);
            return;
        }


    var newAmount = +removeSep($("#amount").val()) * (+removeSep($("#exchangeRate").val()) > 0 ? +removeSep($("#exchangeRate").val()) : 1);
    $("#amountExchangeRate").val(transformNumbers.toComma(newAmount));

    var model = {
        id: +$("#realId").val(),
        rowNumber: arrayRealLine.length + 1,
        closeId: currentCloseId,
        lineId: currentLineId,
        admissionUserId: currentUserId,
        detailAccountTypeId: 0,
        inOut: +$("#inOut").val(),
        inOutName: +$("#inOut").val() === 1 ? "1 - دریافت" : "2 - پرداخت",
        fundTypeId: +$("#fundTypeId").val(),
        currencyId: +$("#currencyId").val(),
        currencyName: +$("#currencyId").val() !== 0 ? $("#currencyId option:selected").html() : "",
        fundTypeName: +$("#fundTypeId").val() !== 0 ? $("#fundTypeId option:selected").html() : "",
        detailAccountId: +$("#detailAccountId").val(),
        detailAccountName: +$("#detailAccountId").val() !== 0 ? $("#detailAccountId option:selected").html() : "",
        amount: Math.abs(+removeSep($("#amount").val())),
        exchangeRate: +removeSep($("#exchangeRate").val()),
        amountExchangeRate: Math.abs(+removeSep($("#amountExchangeRate").val()))
    }


    if (model.closeId === 0 || model.lineId === 0 || model.amount === 0)
        return;


    if ((model.fundTypeId === 2 || model.fundTypeId == 11 || model.fundTypeId == 12 || model.fundTypeId == 13 || model.fundTypeId == 16 || model.fundTypeId == 10) && model.detailAccountId === 0) {
        var msgExist = alertify.warning("تفصیل را انتخاب نمایید");
        msgExist.delay(alertify_delay);
        $("#detailAccountId").select2("focus");
        return;
    }

    if (model.amount === 0) {
        var msgExist = alertify.warning("مبلغ را وارد نمایید");
        msgExist.delay(alertify_delay);
        $("#amount").focus()
        return;
    }

    if (close_form_state === "add") {

        var existOpenAcc = checkExistOpenAccTypeAdmClose(model.inOut, model.fundTypeId, model.detailAccountId); //&& ((model.openAccountTypeId !== 0 && model.detailAccountId !== 0) || (model.fundTypeId === 2));
        if (existOpenAcc) {
            var msgExist;
            if (model.fundTypeId === 2)
                msgExist = alertify.warning(admission.hasbankAccount);
            else
                msgExist = alertify.warning(admission.hasOpenAccType);

            $("#detailAccountId").select2("focus");

            msgExist.delay(alertify_delay);
            return;
        }

        model.rowNumber = +arrayRealLine.length + 1;

        var result = SaveRealLine(model);
        if (result.successfull) {

            model.id = result.status;
            arrayRealLine.push(model);
            appendRowToReal(model);
            checkSettlement();
        }
        else {
            var msg1 = alertify.warning(result.statusMessage);
            msg1.delay(alertify_delay);
        }
    }
    else {
        resetRealCash();
        var realLen = arrayRealLine.length;

        model.rowNumber = +$("#rowNumber").val();

        for (var z = 0; z < realLen; z++) {
            var real = arrayRealLine[z];

            if (real.id === model.id) {
                var saveResult = SaveRealLine(model);

                if (saveResult.successfull) {
                    checkSettlement();

                    arrayRealLine[z].inOut = model.inOut;
                    arrayRealLine[z].inOutName = model.inOutName;
                    arrayRealLine[z].fundTypeId = model.fundTypeId;
                    arrayRealLine[z].fundTypeName = model.fundTypeName;
                    arrayRealLine[z].currencyId = model.currencyId;
                    arrayRealLine[z].detailAccountId = model.detailAccountId;
                    arrayRealLine[z].detailAccountName = model.detailAccountName;
                    arrayRealLine[z].amount = model.amount;
                    arrayRealLine[z].amountExchangeRate = model.amountExchangeRate;
                    arrayRealLine[z].exchangeRate = model.exchangeRate;

                    var desiredTds = $(`#realLine tr#rl_${model.id} > td`);

                    $(desiredTds[0]).text(model.rowNumber);
                    if (model.inOut == 2) {
                        $(desiredTds[0]).addClass("highlight-danger");
                        $(desiredTds[1]).addClass("highlight-danger");
                        $(desiredTds[2]).addClass("highlight-danger");
                        $(desiredTds[3]).addClass("highlight-danger");
                        $(desiredTds[4]).addClass("highlight-danger");
                        $(desiredTds[5]).addClass("highlight-danger");
                        $(desiredTds[6]).addClass("highlight-danger");
                        $(desiredTds[7]).addClass("highlight-danger");
                        $(desiredTds[8]).addClass("highlight-danger");
                        //$(desiredTds[9]).addClass("highlight-danger");
                    }
                    else {
                        $(desiredTds[0]).removeClass("highlight-danger");
                        $(desiredTds[1]).removeClass("highlight-danger");
                        $(desiredTds[2]).removeClass("highlight-danger");
                        $(desiredTds[3]).removeClass("highlight-danger");
                        $(desiredTds[4]).removeClass("highlight-danger");
                        $(desiredTds[5]).removeClass("highlight-danger");
                        $(desiredTds[6]).removeClass("highlight-danger");
                        $(desiredTds[7]).removeClass("highlight-danger");
                        $(desiredTds[8]).removeClass("highlight-danger");
                        //$(desiredTds[9]).removeClass("highlight-danger");
                    }

                    $(desiredTds[1]).text(model.id);
                    $(desiredTds[2]).text(model.inOutName);
                    $(desiredTds[3]).text(model.fundTypeName);
                    $(desiredTds[4]).text(model.currencyName);
                    //$(desiredTds[5]).text(model.openAccountTypeId !== 0 ? model.openAccountTypeName : "");
                    $(desiredTds[5]).text(model.detailAccountId !== 0 ? model.detailAccountName : "");
                    $(desiredTds[6]).text(transformNumbers.toComma(model.amount));
                    $(desiredTds[7]).text(transformNumbers.toComma(model.exchangeRate));
                    $(desiredTds[8]).text(transformNumbers.toComma(model.amountExchangeRate));
                    break;
                }
                else {
                    var msgUpdate = alertify.warning(saveResult.statusMessage);
                    msgUpdate.delay(alertify_delay);
                }
            }
        }

        resetRealCash();
    }

    afterAppendReal(true);

});

$("#cancelReal").on("click", function () {
    $("#announcementLine .highlight")[0].click();
})

$("#amount").on("keydown", function (e) {
    if (e.which === 13) {
        e.preventDefault();
        //$("#addToReal").click();
    }
})
    .on("focus", function () { selectText($(this)); })
    .on("blur", function () {
        var newAmount = +removeSep($("#amount").val()) * (+removeSep($("#exchangeRate").val()) > 0 ? +removeSep($("#exchangeRate").val()) : 1);
        $("#amountExchangeRate").val(transformNumbers.toComma(newAmount));
    });

$("#exchangeRate")
    .on("focus", function () { selectText($(this)); })
    .on("blur", function () {
        var newAmount = +removeSep($("#amount").val()) * (+removeSep($("#exchangeRate").val()) > 0 ? +removeSep($("#exchangeRate").val()) : 1);
        $("#amountExchangeRate").val(transformNumbers.toComma(newAmount));
    });

initCloseForm(getAdmissionClose);


