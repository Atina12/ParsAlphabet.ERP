var viewData_controllername = "attendertimesheetlineapi",
    viewData_form_title = "",
    attenderId = "",
    attenderName = "",
    selectYear = 0,
    sumAllocatedBlocks = 0,
    fiscalYearId = 0,
    branchId = 0,
    currentDepartmentId = "",
    currentDepartmentName = "",
    currentMonth = 0,
    currentSelectedMonth = 0,
    currentYear = 0,
    selectMonth = 0,
    rowDeleteId = 0,
    rowEditId = 0,
    currentDayInWeek = 0,
    headerPagination = 0,
    formType = "departmentTimeShift",
    fiscalStartDate = "",
    fiscalEndDate = "",
    operation = "Ins",
    strShiftName = "",
    isSave = true,
    isEdit = false,
    isDelete = false,
    isSelectedTd = false,
    addAttenderTimeSheetIds = [],
    delAttenderTimeSheetIds = [];


var pgt_medicalTimeShiftDays = {
    pagetable_id: "medicalTimeShiftDays_pagetable",
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
    getpagetable_url: `${viewData_baseUrl_MC}/${viewData_controllername}/getdetailmedicaltimeshift`
}
arr_pagetables.push(pgt_medicalTimeShiftDays);


var pgt_attenderTimeShiftDays = {
    pagetable_id: "attenderTimeShiftDays_pagetable",
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
    getpagetable_url: `${viewData_baseUrl_MC}/${viewData_controllername}/getdetailattenderTimeShiftDays`
}
arr_pagetables.push(pgt_attenderTimeShiftDays);


function initForm() {


    $(".select2").select2();

    attenderId = +$("#attenderId").val();
    attenderName = $("#attenderName").val();
    currentDepartmentId = +$("#departmentId").val();
    currentDepartmentName = $("#departmentName").val().replaceAll("/", "-");

    viewData_form_title = currentDepartmentId + " - " + currentDepartmentName + " / " + attenderId + " - " + attenderName;
    $(`#viewData_form_titleSpan`).text(viewData_form_title);

    $("#fiscalYearId").html("<option value=\"0\">انتخاب کنید</option>");
    fill_select2(`${viewData_baseUrl_GN}/FiscalYearApi/getdropdown`, "fiscalYearId", true);

    $("#branchId").html("<option value=\"0\">انتخاب کنید</option>");
    fill_select2(`${viewData_baseUrl_GN}/BranchApi/getactivedropdown`, "branchId", true);

    $("#attenderChooseId").html("<option value=\"0\">انتخاب کنید</option>");
    fill_select2(`${viewData_baseUrl_MC}/AttenderApi/getdropdown`, "attenderChooseId", true);



    setTimeout(() => {
        $("#fiscalYearId").select2("focus");
    }, 20)
};


//#region  MainPage

$("#fiscalYearId").on("change", function () {
    $("#showMonth").html("");
    $("#divbasicetailMedicalTimeShift").css('display', 'none');
    currentSelectedMonth = 0;
    selectMonth = 0;
    rowDeleteId = 0;
    rowEditId = 0;
    currentDayInWeek = 0;
    operation = "Ins";
    isEdit = false;
    isDelete = false;

})

$("#branchId").on("change", function () {
    $("#showMonth").html("");
    $("#divbasicetailMedicalTimeShift").css('display', 'none');

})

function backToList_overrided() {
    navigation_item_click('/MC/AttenderTimeSheet', 'تخصیص شیفت')
}

async function headerindexChoose_display(e) {

    let elmValue = +$(e).val();

    if (elmValue > 0) {

        let checkExist = false;

        checkExist = await checkExistAttenderId(elmValue);

        if (checkExist) {

            attenderId = elmValue;
            pagetable_formkeyvalue = [attenderId, +$("#fiscalYearId").val(), +$("#branchId").val(), 0, 0, currentDepartmentId, null, null, null];

            var filterIndex = arrSearchFilter.findIndex(v => v.pagetable_id == "medicalTimeShiftDays_pagetable");

            if (filterIndex != -1) {
                arrSearchFilter[filterIndex].filters = [];
                arrSearchFilterSelect2ajax[filterIndex].filters = [];

                await deleteAllFilterValueOnSearchClickV1(e, "medicalTimeShiftDays_pagetable", null);


            }
            else {
                if (+$("#fiscalYearId").val() > 0 && +$("#branchId").val() > 0)
                    selectedAttenderTimesheet(1, 1, 1, null);
            }

            await display_paginationAsync_display(0, elmValue);

        }
        else
            alertify.warning("این داکتر در سیستم وجود ندارد").delay(alertify_delay);

        $("#headerIndex").val("");
    }

}

function checkExistAttenderId(id) {

    let url = `${viewData_baseUrl_MC}/${viewData_controllername}/checkexistsattenderid`;

    let output = $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({ id: id }),
        async: false,
        cache: false,
        success: function (result) {

            return result;

        },
        error: function (xhr) {
            error_handler(xhr, url)
        }


    });
    return output.responseJSON;
}

function display_pagination_display(opr) {
    var elemId = +$("#headerIndex").text();
    display_paginationAsync_display(opr, elemId);
}

function display_paginationAsync_display(opr, elemId) {
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

    initDisplayAttenderTimeSheetFrom(headerPagination, elemId);
}

function initDisplayAttenderTimeSheetFrom(headerPagination, elemId) {


    var model = {
        attenderId: elemId > 0 ? elemId : attenderId,
        directPaging: headerPagination
    };
    let url = `${viewData_baseUrl_MC}/AttenderApi/getattender`;
    $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        async: false,
        cache: false,
        success: function (result) {

            if (result != null && result != undefined && result.id > 0) {

                viewData_form_title = "";

                attenderId = result.id;
                attenderName = result.fullName;

                currentDepartmentId = result.departmentId;
                currentDepartmentName = result.departmentName.replaceAll("/", "-");

                viewData_form_title = currentDepartmentId + " - " + currentDepartmentName + " / " + attenderId + " - " + attenderName;

                $(`#viewData_form_titleSpan`).text(viewData_form_title);
                if (+$("#fiscalYearId").val() > 0 && +$("#branchId").val() > 0)
                    searchShift();
            }
            else {

                $("#attenderChooseId").val("0").trigger("change");

                alertify.warning("این داکتر در سیستم وجود ندارد").delay(alertify_delay);
                return false;
            }

        },
        error: function (xhr) {
            error_handler(xhr, url)
        }
    });
}

function searchShift() {
    if (+$("#fiscalYearId").val() <= 0) {
        alertify.error("سال مالی را انتخاب کنید").delay(alertify_delay);
        $("#fiscalYearId").select2("focus");
        return;
    }

    if (+$("#branchId").val() <= 0) {
        alertify.error("شعبه را انتخاب کنید").delay(alertify_delay);
        $("#branchId").select2("focus");
        return;
    }
    let model = {
        attenderId: attenderId,
        fiscalYearId: +$("#fiscalYearId").val(),
        branchId: +$("#branchId").val(),

    }

    let url = `${viewData_baseUrl_MC}/${viewData_controllername}/getattendertimesheetlist`;
    $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        async: false,
        cache: false,
        success: function (result) {
            setMonthData(result);
        },
        error: function (xhr) {
            error_handler(xhr, url)
        }


    });

}

function setMonthData(data) {

    selectYear = 0;
    currentMonth = 0;
    currentYear = 0;
    selectMonth = 0;
    isSelectedTd = false;
    $("#showMonth").html("");
    $("#divbasicetailMedicalTimeShift").css('display', 'none');
    let currentDate = moment().format('jYYYY/jMM/jDD');

    selectYear = +$("#fiscalYearId").select2('data')[0].text.split("-")[1].split(" ")[3];
    currentYear = +currentDate.split("/")[0];
    currentMonth = +currentDate.split("/")[1];

    if (checkResponse(data)) {

        let dayLength = data.length,
            tablecss = "class=tablecss",
            strBody = "",
            strday = "",
            strdayItem = "",
            strDetailtd = "",
            title = "",
            titlecolor = "",
            monthName = ['حمل', 'ثور', 'جوزا', 'سرطان', 'اسد', 'سنبله', 'میزان', 'عقرب', 'قوس', 'جدی', 'دلو', 'حوت'];

        strBody += `
                <thead>
                  <tr>
                    <th style="width:5%"></th>
                    <th style="width:7.5%;" ${tablecss}>${monthName[0]}</th>
                    <th style="width:7.5%;" ${tablecss}>${monthName[1]}</th>
                    <th style="width:7.5%;" ${tablecss}>${monthName[2]}</th>
                    <th style="width:7.5%;" ${tablecss}>${monthName[3]}</th>
                    <th style="width:7.5%;" ${tablecss}>${monthName[4]}</th>
                    <th style="width:7.5%;" ${tablecss}>${monthName[5]}</th>
                    <th style="width:7.5%;" ${tablecss}>${monthName[6]}</th>
                    <th style="width:7.5%;" ${tablecss}>${monthName[7]}</th>
                    <th style="width:7.5%;" ${tablecss}>${monthName[8]}</th>
                    <th style="width:7.5%;" ${tablecss}>${monthName[9]}</th>
                    <th style="width:7.5%;" ${tablecss}>${monthName[10]}</th>
                    <th style="width:7.5%;" ${tablecss}>${monthName[11]}</th>
                    <th style="width:5%;" ${tablecss}>عملیات</th>
                  </tr>
                </thead>
                <tbody id="tempDetailDayMonth">`

        for (let i = 0; i < dayLength; i++) {

            let dayMonth = data[i]

            let lenMonthList1 = dayMonth.monthListDetail1 != null ? dayMonth.monthListDetail1.monthDetail.length : 0;
            let lenMonthList2 = dayMonth.monthListDetail2 != null ? dayMonth.monthListDetail2.monthDetail.length : 0;
            let lenMonthList3 = dayMonth.monthListDetail3 != null ? dayMonth.monthListDetail3.monthDetail.length : 0;
            let lenMonthList4 = dayMonth.monthListDetail4 != null ? dayMonth.monthListDetail4.monthDetail.length : 0;
            let lenMonthList5 = dayMonth.monthListDetail5 != null ? dayMonth.monthListDetail5.monthDetail.length : 0;
            let lenMonthList6 = dayMonth.monthListDetail6 != null ? dayMonth.monthListDetail6.monthDetail.length : 0;
            let lenMonthList7 = dayMonth.monthListDetail7 != null ? dayMonth.monthListDetail7.monthDetail.length : 0;
            let lenMonthList8 = dayMonth.monthListDetail8 != null ? dayMonth.monthListDetail8.monthDetail.length : 0;
            let lenMonthList9 = dayMonth.monthListDetail9 != null ? dayMonth.monthListDetail9.monthDetail.length : 0;
            let lenMonthList10 = dayMonth.monthListDetail10 != null ? dayMonth.monthListDetail10.monthDetail.length : 0;
            let lenMonthList11 = dayMonth.monthListDetail11 != null ? dayMonth.monthListDetail11.monthDetail.length : 0;
            let lenMonthList12 = dayMonth.monthListDetail12 != null ? dayMonth.monthListDetail12.monthDetail.length : 0;

            strday = `<tr  highlight=${i + 1} id=row_${i + 1} onclick="tr_onclickDetailDayMonth(${i + 1})"  style="border-style: solid; border-width: 1px 1px 1px 1px;"><td  onclick="unselectedAttenderTimesheet()"><div>${dayMonth.dayName}</div></td>`


            //#region حمل

            title = "";
            if (dayMonth.monthListDetail1 != null) {
                if (dayMonth.monthListDetail1.monthDetail.length == 0) {
                    title = "فاقد روزکاری";
                    isSelectedTd = true;
                }
            }
            else {
                title = "فاقد ماه مالی";
                isSelectedTd = false;
            }



            strdayItem = ""
            strdayItem += dayMonth.monthListDetail1 == null ? `<div class=attenderTimeSheetLineDay>${title}</div>` : dayMonth.monthListDetail1.monthDetail.length == 0 ? `<div class=attenderTimeSheetLineDay>${title}</div>` : "";
            titlecolor = "";
            strShiftName = "";
            sumAllocatedBlocks = 0;
            for (var a = 0; a < lenMonthList1; a++) {
                sumAllocatedBlocks = +dayMonth.monthListDetail1.monthDetail[a].allocatedBlocks + sumAllocatedBlocks;

                css = lenMonthList1 > 1 && a + 1 < lenMonthList1 ? "class=attenderTimeSheetLineDayItemAllocated" : "class=attenderTimeSheetLineDayItem";

                strShiftName = `<div ${css} >${dayMonth.monthListDetail1.monthDetail[0].shiftName}</div>`

                title += dayMonth.monthListDetail1.monthDetail[a].shiftName + "-" + dayMonth.monthListDetail1.monthDetail[a].numberOnlineAppointment + "-" + dayMonth.monthListDetail1.monthDetail[a].numberOfflineAppointment + "/";

                titlecolor = dayMonth.monthListDetail1.monthLocked ? "isClosed" : "";

            }

            strDetailtd += `<td title="${title}" class="${setClass(1, isSelectedTd)} ${titlecolor}" onclick="selectedAttenderTimesheet(${dayMonth.dayInWeek},${lenMonthList1},1,this)">`;

            strdayItem += `${strShiftName} </td>`

            strDetailtd += strdayItem;

            //#endregion

            //#region ثور
            sumAllocatedBlocks = 0;

            title = "";
            if (dayMonth.monthListDetail2 != null) {
                if (dayMonth.monthListDetail2.monthDetail.length == 0) {
                    title = "فاقد روزکاری";
                    isSelectedTd = true;
                }
            }
            else {
                title = "فاقد ماه مالی";
                isSelectedTd = false;
            }



            strdayItem = ""
            strdayItem += dayMonth.monthListDetail2 == null ? `<div class=attenderTimeSheetLineDay>${title}</div>` : dayMonth.monthListDetail2.monthDetail.length == 0 ? `<div class=attenderTimeSheetLineDay>${title}</div>` : "";
            titlecolor = "";

            strShiftName = "";
            for (var b = 0; b < lenMonthList2; b++) {
                sumAllocatedBlocks += +dayMonth.monthListDetail2.monthDetail[b].allocatedBlocks + sumAllocatedBlocks;

                css = lenMonthList2 > 1 && b + 1 < lenMonthList2 ? "class=attenderTimeSheetLineDayItemAllocated" : "class=attenderTimeSheetLineDayItem";

                strShiftName = `<div ${css} >${dayMonth.monthListDetail2.monthDetail[0].shiftName}</div>`

                title += dayMonth.monthListDetail2.monthDetail[b].shiftName + "-" + dayMonth.monthListDetail2.monthDetail[b].numberOnlineAppointment + "-" + dayMonth.monthListDetail2.monthDetail[b].numberOfflineAppointment + "/";

                titlecolor = dayMonth.monthListDetail2.monthLocked ? "isClosed" : "";

            }
            strDetailtd += `<td title="${title}" class="${setClass(2, isSelectedTd)} ${titlecolor}"  onclick="selectedAttenderTimesheet(${dayMonth.dayInWeek},${lenMonthList2},2,this)">`;

            strdayItem += `${strShiftName} </td>`

            strDetailtd += strdayItem;
            //#endregion

            //#region جوزا
            sumAllocatedBlocks = 0;

            title = "";
            if (dayMonth.monthListDetail3 != null) {
                if (dayMonth.monthListDetail3.monthDetail.length == 0) {
                    title = "فاقد روزکاری";
                    isSelectedTd = true;
                }
            }
            else {
                title = "فاقد ماه مالی";
                isSelectedTd = false;
            }


            strdayItem = ""
            strdayItem += dayMonth.monthListDetail3 == null ? `<div class=attenderTimeSheetLineDay>${title}</div>` : dayMonth.monthListDetail3.monthDetail.length == 0 ? `<div class=attenderTimeSheetLineDay>${title}</div>` : "";

            titlecolor = "";
            strShiftName = "";
            for (var c = 0; c < lenMonthList3; c++) {
                sumAllocatedBlocks += +dayMonth.monthListDetail3.monthDetail[c].allocatedBlocks + sumAllocatedBlocks;

                css = lenMonthList3 > 1 && c + 1 < lenMonthList3 ? "class=attenderTimeSheetLineDayItemAllocated" : "class=attenderTimeSheetLineDayItem";

                strShiftName = `<div ${css} >${dayMonth.monthListDetail3.monthDetail[0].shiftName}</div>`

                title += dayMonth.monthListDetail3.monthDetail[c].shiftName + "-" + dayMonth.monthListDetail3.monthDetail[c].numberOnlineAppointment + "-" + dayMonth.monthListDetail3.monthDetail[c].numberOfflineAppointment + "/";

                titlecolor = dayMonth.monthListDetail3.monthLocked ? "isClosed" : "";

            }
            strDetailtd += `<td title="${title}" class="${setClass(3, isSelectedTd)} ${titlecolor}"   onclick="selectedAttenderTimesheet(${dayMonth.dayInWeek},${lenMonthList3},3,this)">`;

            strdayItem += `${strShiftName} </td>`

            strDetailtd += strdayItem;
            //#endregion

            //#region سرطان
            sumAllocatedBlocks = 0;

            title = "";
            if (dayMonth.monthListDetail4 != null) {
                if (dayMonth.monthListDetail4.monthDetail.length == 0) {
                    title = "فاقد روزکاری";
                    isSelectedTd = true;
                }
            }
            else {
                title = "فاقد ماه مالی";
                isSelectedTd = false;
            }


            strdayItem = ""
            strdayItem += dayMonth.monthListDetail4 == null ? `<div class=attenderTimeSheetLineDay>${title}</div>` : dayMonth.monthListDetail4.monthDetail.length == 0 ? `<div class=attenderTimeSheetLineDay>${title}</div>` : "";
            titlecolor = "";
            strShiftName = "";

            for (var d = 0; d < lenMonthList4; d++) {
                sumAllocatedBlocks += +dayMonth.monthListDetail4.monthDetail[d].allocatedBlocks + sumAllocatedBlocks;

                css = lenMonthList4 > 1 && d + 1 < lenMonthList4 ? "class=attenderTimeSheetLineDayItemAllocated" : "class=attenderTimeSheetLineDayItem";

                strShiftName = `<div ${css} >${dayMonth.monthListDetail4.monthDetail[0].shiftName}</div>`

                title += dayMonth.monthListDetail4.monthDetail[d].shiftName + "-" + dayMonth.monthListDetail4.monthDetail[d].numberOnlineAppointment + "-" + dayMonth.monthListDetail4.monthDetail[d].numberOfflineAppointment + "/";

                titlecolor = dayMonth.monthListDetail4.monthLocked ? "isClosed" : "";

            }


            strDetailtd += `<td title="${title}" class="${setClass(4, isSelectedTd)}  ${titlecolor}" onclick="selectedAttenderTimesheet(${dayMonth.dayInWeek},${lenMonthList4},4,this)">`;

            strdayItem += `${strShiftName} </td>`

            strDetailtd += strdayItem;
            //#endregion

            //#region اسد
            sumAllocatedBlocks = 0;

            title = "";
            if (dayMonth.monthListDetail5 != null) {
                if (dayMonth.monthListDetail5.monthDetail.length == 0) {
                    title = "فاقد روزکاری";
                    isSelectedTd = true;
                }
            }
            else {
                title = "فاقد ماه مالی";
                isSelectedTd = false;
            }


            strdayItem = ""
            strdayItem = dayMonth.monthListDetail5 == null ? `<div class=attenderTimeSheetLineDay>${title}</div>` : dayMonth.monthListDetail5.monthDetail.length == 0 ? `<div class=attenderTimeSheetLineDay>${title}</div>` : "";

            titlecolor = "";
            strShiftName = "";
            for (var e = 0; e < lenMonthList5; e++) {
                sumAllocatedBlocks += +dayMonth.monthListDetail5.monthDetail[e].allocatedBlocks + sumAllocatedBlocks;

                css = lenMonthList5 > 1 && e + 1 < lenMonthList5 ? "class=attenderTimeSheetLineDayItemAllocated" : "class=attenderTimeSheetLineDayItem";

                strShiftName = `<div ${css} > ${dayMonth.monthListDetail5.monthDetail[0].shiftName}</div>`

                title += dayMonth.monthListDetail5.monthDetail[e].shiftName + "-" + dayMonth.monthListDetail5.monthDetail[e].numberOnlineAppointment + "-" + dayMonth.monthListDetail5.monthDetail[e].numberOfflineAppointment + "/";

                titlecolor = dayMonth.monthListDetail5.monthLocked ? "isClosed" : "";

            }
            strDetailtd += `<td title="${title}" class="${setClass(5, isSelectedTd)}  ${titlecolor}" onclick="selectedAttenderTimesheet(${dayMonth.dayInWeek},${lenMonthList5},5,this)">`;

            strdayItem += `${strShiftName} </td>`

            strDetailtd += strdayItem;
            //#endregion

            //#region سنبله
            sumAllocatedBlocks = 0;

            title = "";
            if (dayMonth.monthListDetail6 != null) {
                if (dayMonth.monthListDetail6.monthDetail.length == 0) {
                    title = "فاقد روزکاری";
                    isSelectedTd = true;
                }
            }
            else {
                title = "فاقد ماه مالی";
                isSelectedTd = false;
            }


            strdayItem = ""
            strdayItem = dayMonth.monthListDetail6 == null ? `<div class=attenderTimeSheetLineDay>${title}</div>` : dayMonth.monthListDetail6.monthDetail.length == 0 ? `<div class=attenderTimeSheetLineDay>${title}</div>` : "";

            titlecolor = "";
            strShiftName = "";
            for (var l = 0; l < lenMonthList6; l++) {

                sumAllocatedBlocks += +dayMonth.monthListDetail6.monthDetail[l].allocatedBlocks + sumAllocatedBlocks;

                css = lenMonthList6 > 1 && l + 1 < lenMonthList6 ? "class=attenderTimeSheetLineDayItemAllocated" : "class=attenderTimeSheetLineDayItem";

                strShiftName = `<div ${css} > ${dayMonth.monthListDetail6.monthDetail[0].shiftName}</div>`

                title += dayMonth.monthListDetail6.monthDetail[l].shiftName + "-" + dayMonth.monthListDetail6.monthDetail[l].numberOnlineAppointment + "-" + dayMonth.monthListDetail6.monthDetail[l].numberOfflineAppointment + "/";

                titlecolor = dayMonth.monthListDetail6.monthLocked ? "isClosed" : "";

            }

            strDetailtd += `<td title="${title}" class="${setClass(6, isSelectedTd)} ${titlecolor}"  onclick="selectedAttenderTimesheet(${dayMonth.dayInWeek},${lenMonthList6},6,this)">`;

            strdayItem += `${strShiftName} </td>`

            strDetailtd += strdayItem;
            //#endregion

            //#region میزان
            sumAllocatedBlocks = 0;

            title = "";
            if (dayMonth.monthListDetail7 != null) {
                if (dayMonth.monthListDetail7.monthDetail.length == 0) {
                    title = "فاقد روزکاری";
                    isSelectedTd = true;
                }
            }
            else {
                title = "فاقد ماه مالی";
                isSelectedTd = false;
            }


            strdayItem = ""
            strdayItem += dayMonth.monthListDetail7 == null ? `<div class=attenderTimeSheetLineDay>${title}</div>` : dayMonth.monthListDetail7.monthDetail.length == 0 ? `<div class=attenderTimeSheetLineDay>${title}</div>` : "";
            titlecolor = "";
            strShiftName = "";

            for (var f = 0; f < lenMonthList7; f++) {
                sumAllocatedBlocks += +dayMonth.monthListDetail7.monthDetail[f].allocatedBlocks + sumAllocatedBlocks;

                css = lenMonthList7 > 1 && f + 1 < lenMonthList7 ? "class=attenderTimeSheetLineDayItemAllocated" : "class=attenderTimeSheetLineDayItem";

                strShiftName = `<div ${css} >${dayMonth.monthListDetail7.monthDetail[0].shiftName}</div>`

                title += dayMonth.monthListDetail7.monthDetail[f].shiftName + "-" + dayMonth.monthListDetail7.monthDetail[f].numberOnlineAppointment + "-" + dayMonth.monthListDetail7.monthDetail[f].numberOfflineAppointment + "/";

                titlecolor = dayMonth.monthListDetail7.monthLocked ? "isClosed" : "";

            }

            strDetailtd += `<td title="${title}" class="${setClass(7, isSelectedTd)} ${titlecolor}" onclick="selectedAttenderTimesheet(${dayMonth.dayInWeek},${lenMonthList7},7,this)">`;

            strdayItem += `${strShiftName} </td>`

            strDetailtd += strdayItem;
            //#endregion

            //#region قوس
            sumAllocatedBlocks = 0;

            title = "";
            if (dayMonth.monthListDetail8 != null) {
                if (dayMonth.monthListDetail8.monthDetail.length == 0) {
                    title = "فاقد روزکاری";
                    isSelectedTd = true;
                }
            }
            else {
                title = "فاقد ماه مالی";
                isSelectedTd = false;
            }


            strdayItem = ""
            strdayItem = dayMonth.monthListDetail8 == null ? `<div class=attenderTimeSheetLineDay>${title}</div>` : dayMonth.monthListDetail8.monthDetail.length == 0 ? `<div class=attenderTimeSheetLineDay>${title}</div>` : "";

            titlecolor = "";
            strShiftName = "";
            for (var h = 0; h < lenMonthList8; h++) {

                sumAllocatedBlocks += +dayMonth.monthListDetail8.monthDetail[h].allocatedBlocks + sumAllocatedBlocks;

                css = lenMonthList8 > 1 && h + 1 < lenMonthList8 ? "class=attenderTimeSheetLineDayItemAllocated" : "class=attenderTimeSheetLineDayItem";

                strShiftName = `<div ${css} > ${dayMonth.monthListDetail8.monthDetail[0].shiftName}</div>`

                title += dayMonth.monthListDetail8.monthDetail[h].shiftName + "-" + dayMonth.monthListDetail8.monthDetail[h].numberOnlineAppointment + "-" + dayMonth.monthListDetail8.monthDetail[h].numberOfflineAppointment + "/";

                titlecolor = dayMonth.monthListDetail8.monthLocked ? "isClosed" : "";

            }

            strDetailtd += `<td title="${title}" class="${setClass(8, isSelectedTd)} ${titlecolor}" onclick="selectedAttenderTimesheet(${dayMonth.dayInWeek},${lenMonthList8},8,this)">`;

            strdayItem += `${strShiftName}</td>`

            strDetailtd += strdayItem;
            //#endregion

            //#region عقرب
            sumAllocatedBlocks = 0;

            title = "";
            if (dayMonth.monthListDetail9 != null) {
                if (dayMonth.monthListDetail9.monthDetail.length == 0) {
                    title = "فاقد روزکاری";
                    isSelectedTd = true;
                }
            }
            else {
                title = "فاقد ماه مالی";
                isSelectedTd = false;
            }


            strdayItem = ""
            strdayItem += dayMonth.monthListDetail9 == null ? `<div class=attenderTimeSheetLineDay>${title}</div>` : dayMonth.monthListDetail9.monthDetail.length == 0 ? `<div class=attenderTimeSheetLineDay>${title}</div>` : "";

            titlecolor = "";
            strShiftName = "";
            for (var n = 0; n < lenMonthList9; n++) {

                sumAllocatedBlocks += +dayMonth.monthListDetail9.monthDetail[n].allocatedBlocks + sumAllocatedBlocks;

                css = lenMonthList9 > 1 && n + 1 < lenMonthList9 ? "class=attenderTimeSheetLineDayItemAllocated" : "class=attenderTimeSheetLineDayItem";

                strShiftName = `<div ${css} >${dayMonth.monthListDetail9.monthDetail[0].shiftName}</div>`

                title += dayMonth.monthListDetail9.monthDetail[n].shiftName + "-" + dayMonth.monthListDetail9.monthDetail[n].numberOnlineAppointment + "-" + dayMonth.monthListDetail9.monthDetail[n].numberOfflineAppointment + "/";

                titlecolor = dayMonth.monthListDetail9.monthLocked ? "isClosed" : "";

            }

            strDetailtd += `<td title="${title}" class="${setClass(9, isSelectedTd)} ${titlecolor}" onclick="selectedAttenderTimesheet(${dayMonth.dayInWeek},${lenMonthList9},9,this)">`;

            strdayItem += `${strShiftName} </td>`

            strDetailtd += strdayItem;
            //#endregion

            //#region جدی
            sumAllocatedBlocks = 0;


            title = "";
            if (dayMonth.monthListDetail10 != null) {
                if (dayMonth.monthListDetail10.monthDetail.length == 0) {
                    title = "فاقد روزکاری";
                    isSelectedTd = true;
                }
            }
            else {
                title = "فاقد ماه مالی";
                isSelectedTd = false;
            }


            strdayItem = ""
            strdayItem += dayMonth.monthListDetail10 == null ? `<div class=attenderTimeSheetLineDay>${title}</div>` : dayMonth.monthListDetail10.monthDetail.length == 0 ? `<div class=attenderTimeSheetLineDay>${title}</div>` : "";
            titlecolor = "";

            strShiftName = "";
            for (var m = 0; m < lenMonthList10; m++) {
                sumAllocatedBlocks += +dayMonth.monthListDetail10.monthDetail[m].allocatedBlocks + sumAllocatedBlocks;

                css = lenMonthList10 > 1 && m + 1 < lenMonthList10 ? "class=attenderTimeSheetLineDayItemAllocated" : "class=attenderTimeSheetLineDayItem";

                strShiftName = `<div ${css} >${dayMonth.monthListDetail10.monthDetail[0].shiftName}</div>`

                title += dayMonth.monthListDetail10.monthDetail[m].shiftName + "-" + dayMonth.monthListDetail10.monthDetail[m].numberOnlineAppointment + "-" + dayMonth.monthListDetail10.monthDetail[m].numberOfflineAppointment + "/";

                titlecolor = dayMonth.monthListDetail10.monthLocked ? "isClosed" : "";

            }

            strDetailtd += `<td title="${title}" class="${setClass(10, isSelectedTd)} ${titlecolor}"  onclick="selectedAttenderTimesheet(${dayMonth.dayInWeek},${lenMonthList10},10,this)">`;

            strdayItem += `${strShiftName}</td>`

            strDetailtd += strdayItem;
            //#endregion

            //#region دلو
            sumAllocatedBlocks = 0;


            title = "";
            if (dayMonth.monthListDetail11 != null) {
                if (dayMonth.monthListDetail11.monthDetail.length == 0) {
                    title = "فاقد روزکاری";
                    isSelectedTd = true;
                }
            }
            else {
                title = "فاقد ماه مالی";
                isSelectedTd = false;
            }

            strdayItem = ""
            strdayItem += dayMonth.monthListDetail11 == null ? `<div class=attenderTimeSheetLineDay>${title}</div>` : dayMonth.monthListDetail11.monthDetail.length == 0 ? `<div class=attenderTimeSheetLineDay>${title}</div>` : "";
            titlecolor = "";

            strShiftName = "";
            for (var o = 0; o < lenMonthList11; o++) {
                sumAllocatedBlocks += +dayMonth.monthListDetail11.monthDetail[o].allocatedBlocks + sumAllocatedBlocks;

                css = lenMonthList11 > 1 && o + 1 < lenMonthList11 ? "class=attenderTimeSheetLineDayItemAllocated" : "class=attenderTimeSheetLineDayItem";

                strShiftName = `<div ${css} >${dayMonth.monthListDetail11.monthDetail[0].shiftName}</div>`

                title += dayMonth.monthListDetail11.monthDetail[0].shiftName + "-" + dayMonth.monthListDetail11.monthDetail[0].numberOnlineAppointment + "-" + dayMonth.monthListDetail11.monthDetail[0].numberOfflineAppointment + "/";

                titlecolor = dayMonth.monthListDetail11.monthLocked ? "isClosed" : "";

            }


            strDetailtd += `<td title="${title}" class="${setClass(11, isSelectedTd)} ${titlecolor}"   onclick="selectedAttenderTimesheet(${dayMonth.dayInWeek},${lenMonthList11},11,this)">`;

            strdayItem += `${strShiftName}</td>`

            strDetailtd += strdayItem;
            //#endregion

            //#region حوت
            sumAllocatedBlocks = 0;

            title = "";
            if (dayMonth.monthListDetail12 != null) {
                if (dayMonth.monthListDetail12.monthDetail.length == 0) {
                    title = "فاقد روزکاری";

                    isSelectedTd = true;
                }
            }
            else {
                title = "فاقد ماه مالی";
                isSelectedTd = false;
            }


            strdayItem = ""
            strdayItem += dayMonth.monthListDetail12 == null ? `<div class=attenderTimeSheetLineDay>${title}</div>` : dayMonth.monthListDetail12.monthDetail.length == 0 ? `<div class=attenderTimeSheetLineDay>${title}</div>` : "";

            titlecolor = "";

            strShiftName = "";

            for (var p = 0; p < lenMonthList12; p++) {
                sumAllocatedBlocks += +dayMonth.monthListDetail12.monthDetail[p].allocatedBlocks + sumAllocatedBlocks;

                css = lenMonthList12 > 1 && p + 1 < lenMonthList12 ? "class=attenderTimeSheetLineDayItemAllocated" : "class=attenderTimeSheetLineDayItem";

                strShiftName = `<div ${css} >${dayMonth.monthListDetail12.monthDetail[0].shiftName}</div>`

                title += dayMonth.monthListDetail12.monthDetail[p].shiftName + "-" + dayMonth.monthListDetail12.monthDetail[p].numberOnlineAppointment + "-" + dayMonth.monthListDetail12.monthDetail[p].numberOfflineAppointment + "/";

                titlecolor = dayMonth.monthListDetail12.monthLocked ? "isClosed" : "";

            }
            strDetailtd += `<td title="${title}" class="${setClass(12, isSelectedTd)} ${titlecolor}" onclick="selectedAttenderTimesheet(${dayMonth.dayInWeek},${lenMonthList12},12,this)">`;

            strdayItem += `${strShiftName}</td>`

            strDetailtd += strdayItem;

            strDetailtd += `<td>            
                               <button type="button" id="saveAttenderTimesheetLineId${i}"  onclick="runBtnSaveAttenderTimesheetLine(${dayMonth.dayInWeek})" class="btn blue_outline_1" data-toggle="tooltip"data-placement="bottom"  title="افزودن شیفت">
                                   <i class="fas fa-plus "></i>
                               </button>
                           </td>
                    </tr>`

            strBody += strday + strDetailtd;
            strDetailtd = ""
            strday = ""
            strdayItem = ""
            //#endregion

        }
        $("#showMonth").html(strBody)
    }
    else {

        $("#fiscalYearId").val("0");
        $("#branchId").val("0");
    }
}

function setClass(month, isselectedTd) {
    let style = "";

    if (month == 1) {

        if (selectYear < currentYear)
            style = isselectedTd ? `attenderTimeSheetLinecssmonth isselectedTd` : `attenderTimeSheetLinecssmonth`

        else if (selectYear == currentYear && currentMonth > month)
            style = isselectedTd ? `attenderTimeSheetLinecssmonth isselectedTd` : `attenderTimeSheetLinecssmonth`

        else if (selectYear == currentYear && currentMonth <= month && sumAllocatedBlocks > 0)
            style = isselectedTd ? `attenderTimeSheetLineAllocatedBlocks isselectedTd` : `attenderTimeSheetLineAllocatedBlocks`

        else if (selectYear >= currentYear && sumAllocatedBlocks == 0)
            style = isselectedTd ? `isselectedTd` : ``

        else if (selectYear >= currentYear && sumAllocatedBlocks > 0)
            style = isselectedTd ? `attenderTimeSheetLineAllocatedBlocks isselectedTd` : `attenderTimeSheetLineAllocatedBlocks`
    }
    else {


        if (selectYear < currentYear)
            style = isselectedTd ? `attenderTimeSheetLinecssmonth isselectedTd` : `attenderTimeSheetLinecssmonth`

        else if (selectYear == currentYear && currentMonth > month)
            style = isselectedTd ? `attenderTimeSheetLinecssmonth isselectedTd` : `attenderTimeSheetLinecssmonth`

        else if (selectYear == currentYear && sumAllocatedBlocks > 0)
            style = isselectedTd ? `attenderTimeSheetLineAllocatedBlocks isselectedTd` : `attenderTimeSheetLineAllocatedBlocks`

        else if (selectYear >= currentYear && sumAllocatedBlocks == 0)
            style = isselectedTd ? `isselectedTd` : ``

        else if (selectYear >= currentYear && sumAllocatedBlocks > 0)
            style = isselectedTd ? `attenderTimeSheetLineAllocatedBlocks  isselectedTd` : `attenderTimeSheetLineAllocatedBlocks`
    }


    return style;
}

function tr_onclickDetailDayMonth(rowNo) {

    let pageName = "#tempDetailDayMonth";

    $(`${pageName} > tr`).removeClass("highlight");
    $(`${pageName} > tr#row_${rowNo}`).addClass("highlight");
}

function unselectedAttenderTimesheet() {

    $("#tempDetailMedicalTimeShift").html("");
    let output = `<tr>
                       <td colspan=7" style="text-align:center">سطری وجود ندارد</td>
                   </tr>
                  `
    $("#tempDetailMedicalTimeShift").html(output);

    $("#tempDetailDayMonth tr td:not(:first-child)").removeClass("cell-selected");
    currentSelectedMonth = 0;
    selectMonth = 0;

}

function selectedAttenderTimesheet(dayInweek, count, monthId, e) {

    currentDayInWeek = dayInweek;
    currentSelectedMonth = monthId;
    $("#divbasicetailMedicalTimeShift").css('display', 'block');
    $("#tempDetailDayMonth tr td:not(:first-child)").removeClass("cell-selected");

    selectMonth = monthId < 10 ? +("0" + monthId) : monthId;

    if (count > 0)
        $(e).addClass("cell-selected");

    else {
        if ($(e).hasClass("isselectedTd"))
            $(e).addClass("cell-selected");
    }


    if (!$(e).hasClass("cell-selected"))
        return;

    let pagetable_id = "medicalTimeShiftDays_pagetable";
    var index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id);


    pagetable_formkeyvalue = [attenderId, +$("#fiscalYearId").val(), +$("#branchId").val(), selectMonth, dayInweek, currentDepartmentId, null, null, null];

    arr_pagetables[index].editable = false;
    arr_pagetables[index].pagerowscount = 15;
    arr_pagetables[index].endData = false;
    arr_pagetables[index].pageNo = 0;
    arr_pagetables[index].currentpage = 1;
    arr_pagetables[index].currentrow = 1;
    arr_pagetables[index].currentcol = 0;
    arr_pagetables[index].highlightrowid = 0;
    arr_pagetables[index].trediting = false;
    arr_pagetables[index].pagetablefilter = false;
    arr_pagetables[index].filteritem = "";
    arr_pagetables[index].filtervalue = "";
    arr_pagetables[index].lastPageloaded = 0;
    arr_pagetables[index].filters = [];


    lastFormKeyValue = pagetable_formkeyvalue;

    var filterIndex = arrSearchFilter.findIndex(v => v.pagetable_id == pagetable_id);

    if (filterIndex != -1) {
        arrSearchFilter[filterIndex].filters = []
        arrSearchFilterSelect2ajax[filterIndex].filters = []
    }
    get_NewPageTableV1(pagetable_id);


}

function run_button_displayDetailMedicalTimeShift(d, rowNo, elm) {

    var departmentId = +$(elm).parents("tr").first().data("departmentid");
    var workDayDatePersian = $(elm).parents("tr").first().data("workdaydatepersian");
    var departmentTimeShiftId = $(elm).parents("tr").first().data("departmenttimeshiftid");
    let yearId = workDayDatePersian.split("/")[0];
    let monthId = workDayDatePersian.split("/")[1];
    let dayId = workDayDatePersian.split("/")[2];

    let date = yearId + "/" + monthId + "/" + dayId;

    isDelete = isEdit = false;

    getDaysloadingAsync(true, elm);

    attenderTimesheetCurrent = {
        attenderTimeSheetIds: null,
        medicalShiftTimeSheetIds: null,
        standardTimeSheetIds: null,
        departmentTimeShiftIds: departmentTimeShiftId > 0 ? departmentTimeShiftId : null,
        attenderId: attenderId,
        fiscalYearId: +$("#fiscalYearId").val(),
        branchId: +$("#branchId").val(),
        dayInWeek: currentDayInWeek,
        hasPatient: null,
        fromAppointmentDate: convertToMiladiDate(date),
        toAppointmentDate: convertToMiladiDate(date),
        departmentId: departmentId,
        fromTime: null
    }

    displayAssignAttenderTimesheetLine(0);


}

function showAssignList(result) {


    if (result.data.length > 0) {
        let str = `<div class=" d-flex justify-content-start">
                     <h4 class="font-16 my-2"><span class="text-gray">داکتر: </span><span>${viewData_form_title}</span></h4>
            </div>  `;
        $(".modal-content #content").html(str);


        if (isDelete || isEdit) {
            var msg = alertify.error("داکتر  دارای نوبت است مجاز به تغییر نمی باشید");
            msg.delay(alertify_delay);
        }

        modal_show(`attenderTimesheetLineAssignModals`);
    }
    else {

        if (isEdit) {

            $("#idNumber").val(+$(`#tableLine tbody tr[id="rowItem${rowEditId}"]`).data('id'));
            $("#departmentShiftId").val(+$(`#tableLine tbody tr[id="rowItem${rowEditId}"]`).data('departmenttimeshiftid')).trigger("change.select2");

            let monthid = +$(`#tableLine tbody tr[id="rowItem${rowEditId}"]`).data('monthid');
            fill_select2(`/api/PB/PublicApi/monthgetdropdown/${monthid}`, "monthId", true);

            $("#monthId").val(monthid).trigger("change");

            $("#dayId").val($(`#tableLine tbody tr[id="rowItem${rowEditId}"]`).data('workdaydatepersian')).trigger("change.select2");
            $("#isOnlineBookingUnLimit").val($(`#tableLine tbody tr[id="rowItem${rowEditId}"]`).data('isonlinebookingunlimit')).trigger("change.select2");

            if (+$("#isOnlineBookingUnLimit").val() == 1) {
                $("#numberOnLineAppointment").prop("disabled", true)
                $("#numberOnLineAppointment").prop("required", false)
            }
            else if (+$("#isOnlineBookingUnLimit").val() == 2) {
                $("#numberOnLineAppointment").prop("disabled", false)
                $("#numberOnLineAppointment").prop("required", true)
            }

            $("#numberOnLineAppointment").val($(`#tableLine tbody tr[id="rowItem${rowEditId}"]`).data('numberonlineappointment'));

            $("#isOfflineBookingUnLimit").val($(`#tableLine tbody tr[id="rowItem${rowEditId}"]`).data('isofflinebookingunlimit')).trigger("change.select2");

            if (+$("#isOfflineBookingUnLimit").val() == 1 || +$("#isOfflineBookingUnLimit").val() == 2) {
                $("#numberOffLineAppointment").prop("disabled", true)
                $("#numberOffLineAppointment").prop("required", false)
            }

            else {
                $("#numberOffLineAppointment").prop("disabled", false)
                $("#numberOffLineAppointment").prop("required", true)
            }


            $("#numberOffLineAppointment").val($(`#tableLine tbody tr[id="rowItem${rowEditId}"]`).data('numberofflineappointment'));

            $("#appointmentDistributionTypeId").val($(`#tableLine tbody tr[id="rowItem${rowEditId}"]`).data('appointmentdistributiontypeid')).trigger("change.select2");
            $("#departmentShiftId").select2("focus");
        }

        else if (isDelete)
            deleteAttenderTimeShift();

        else {
            pagetable_formkeyvalue = lastFormKeyValue;
            lastFormKeyValue = "";
        }

    }

    getDaysloadingAsync(false, "btn_displayDetailMedicalTimeShift");
}

function showErrorAttenderTimeSheetList(data) {

    let output = "";

    for (var i = 0; i < data.length; i++) {
        output += `<tr>
                    <td class="col-width-percent-15">${data[i].attenderId} - ${data[i].attenderFullName}</td>                  
                    <td class="col-width-percent-12">${data[i].patientIdCentral}</td>
                    <td class="col-width-percent-10">${data[i].patientId} - ${data[i].patientFullName}</td>
                    <td class="col-width-percent-8">${data[i].patientNationalCode}</td>
                    <td class="col-width-percent-11">${data[i].admissionIdCentral}</td>
                    <td class="col-width-percent-7">${data[i].admissionId}</td>
                    <td class="col-width-percent-12">${data[i].reserveDateTimeCentralPersian}</td>
                    <td class="col-width-percent-7">${data[i].reserveDateTimePersian}</td>
                    <td class="col-width-percent-20">${data[i].attenderScheduleBlockId}</td>
                   </tr>`;
    }

    $(`#tempErrorAttenderTimeSheetList`).html(output);
    modal_show("errorAttenderTimeSheetList");
}

function showList() {

    if (+$("#fiscalYearId").val() == 0) {
        var msg = alertify.error("سال مالی را انتخاب کنید");
        msg.delay(alertify_delay);
        $("#fiscalYearId").select2("focus");
        return;
    }
    if (+$("#branchId").val() == 0) {
        var msg = alertify.error("شعبه را انتخاب کنید");
        msg.delay(alertify_delay);
        $("#branchId").select2("focus");
        return;
    }

    var attenderTimeSheetLinePagetable = {
        pagetable_id: "attenderTimeSheetLine_pagetable",
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
        lastPageloaded: 0,
        getpagetable_url: `${viewData_baseUrl_MC}/${viewData_controllername}/getpageattendertimesheetline`,
    };

    let curentIndex = arr_pagetables.findIndex((item) => item.pagetable_id == "attenderTimeSheetLine_pagetable")

    if (curentIndex == -1)
        arr_pagetables.push(attenderTimeSheetLinePagetable);
    else
        arr_pagetables[curentIndex] = attenderTimeSheetLinePagetable


    lastFormKeyValue = pagetable_formkeyvalue;

    var filterIndex = arrSearchFilter.findIndex(v => v.pagetable_id == attenderTimeSheetLinePagetable.pagetable_id);
    if (filterIndex != -1) {
        arrSearchFilter[filterIndex].filters = []
        arrSearchFilterSelect2ajax[filterIndex].filters = []
    }



    let model = {
        fiscalYearId: +$("#fiscalYearId").val(),
        branchId: +$("#branchId").val(),
        attenderId: attenderId,
        dayInWeek: null,
        fromWorkDayDate: fiscalStartDate,
        toWorkDayDate: fiscalEndDate,
        departmentId: currentDepartmentId

    }
    pagetable_formkeyvalue = [model.fiscalYearId, model.branchId, model.attenderId, model.dayInWeek, model.fromWorkDayDate, model.toWorkDayDate, departmentId, null, null, null];


    get_NewPageTableV1("attenderTimeSheetLine_pagetable", false, showModelList);

}

function showModelList() {

    modal_show(`attenderTimeSheetLineModals`);

};


//#endregion


//#region  add

function runBtnSaveAttenderTimesheetLine(dayId) {


    if (currentYear > selectYear) {
        alertify.error("امکان ایجاد شیفت کاری برای تاریخ کمتر از سال جاری را ندارید").delay(alertify_delay);
    }

    else {


        operation = "Ins";
        isSave = true;
        $("#tableLine tbody").empty();
        $("#monthId").empty();
        resetattenderTimeShiftDays();

        currentDayInWeek = dayId;

        switch (dayId) {
            case 7:
                $("#span_AttenderTimesheetLinetitle").text(" افزودن شیفت روز کاری شنبه");
                break;
            case 1:
                $("#span_AttenderTimesheetLinetitle").text(" افزودن شیفت روز کاری یک شنبه");
                break;
            case 2:
                $("#span_AttenderTimesheetLinetitle").text(" افزودن شیفت روز کاری دو شنبه");
                break;
            case 3:
                $("#span_AttenderTimesheetLinetitle").text(" افزودن شیفت روز کاری سه شنبه");
                break;
            case 4:
                $("#span_AttenderTimesheetLinetitle").text("افزودن شیفت روز کاری چهار شنبه");
                break;
            case 5:
                $("#span_AttenderTimesheetLinetitle").text("افزودن شیفت روز کاری پنج شنبه");
                break;
            case 6:
                $("#span_AttenderTimesheetLinetitle").text(" افزودن شیفت روز کاری جمعه");
                break;
            default:
                $("#span_AttenderTimesheetLinetitle").text(" افزودن شیفت روز کاری ");
                break;
        }
        $("#tempAddAttenderTimeSheetDayList").html("");

        fiscalYearId = +$("#fiscalYearId").val();
        branchId = +$("#branchId").val();

        $("#departmentShiftId").html("<option value=\"0\">انتخاب کنید</option>");
        fill_select2(`${viewData_baseUrl_HR}/DepartmentTimeShiftApi/getdropdowndepartmentshiftlist/${currentDepartmentId}/${fiscalYearId}/${branchId}/${currentDayInWeek}`, "departmentShiftId", true);


        $("#monthId").html("<option value=\"0\">انتخاب کنید</option>");


        //برای سال مالی های انتخابی بزرگتر از سال جاری تمامی ماهها را نمایش می دهد
        if (currentYear != selectYear) {
            fill_select2(`/api/PB/PublicApi/monthgetdropdown/null`, "monthId", true);
            $("#monthId").val(currentSelectedMonth > 0 ? currentSelectedMonth : null).trigger("change");
        }

        // برای سال مالی جاری فقط ماههای بزرگتریا مساوی با ماه جاری را نمایش می دهد
        else {

            if (currentSelectedMonth > 0) {
                if (currentSelectedMonth < currentMonth) {
                    fill_select2(`/api/PB/PublicApi/monthgetdropdown/${currentMonth}`, "monthId", true);
                    $("#monthId").val(currentMonth).trigger("change");
                }
                else {
                    fill_select2(`/api/PB/PublicApi/monthgetdropdown/${currentSelectedMonth}`, "monthId", true);
                    $("#monthId").val(currentSelectedMonth).trigger("change");
                }
            }

            else {
                fill_select2(`/api/PB/PublicApi/monthgetdropdown/${currentMonth}`, "monthId", true);
                $("#monthId").val(currentMonth).trigger("change");
            }
        }


        attenderTimeShiftDaysGetPage();

        modal_show("addAttenderTimesheetLineModal");
    }
}

$("#departmentShiftId").on("change", function () {


    let departmentShiftId = +$(this).val();

    if (+$("#monthId").val() > 0 && departmentShiftId > 0) {

        $("#dayId").html("<option value=\"0\">انتخاب کنید</option>");

        if (+$("#idNumber").val() > 0)
            fill_select2(`/api/MC/AttenderTimeSheetLineApi/getdropdowndepartmentworkdaylist`, "dayId", false, `${departmentShiftId}/${+$("#monthId").val()}/${currentDayInWeek}/${+$("#idNumber").val()}/${attenderId}`);
        else
            fill_select2(`/api/MC/AttenderTimeSheetLineApi/getdropdowndepartmentworkdaylist`, "dayId", false, `${departmentShiftId}/${+$("#monthId").val()}/${currentDayInWeek}/null/${attenderId}`);
    }
});

$("#monthId").on("change", function () {

    let monthId = +$(this).val();

    let departmentShiftId = +$("#departmentShiftId").val();

    $("#dayId").empty();

    if (monthId > 0 && departmentShiftId > 0) {

        $("#dayId").html("<option value=\"0\">انتخاب کنید</option>");

        if (+$("#idNumber").val() > 0)
            fill_select2(`/api/MC/AttenderTimeSheetLineApi/getdropdowndepartmentworkdaylist`, "dayId", false, `${departmentShiftId}/${monthId}/${currentDayInWeek}/${+$("#idNumber").val()}/${attenderId}`);
        else
            fill_select2(`/api/MC/AttenderTimeSheetLineApi/getdropdowndepartmentworkdaylist`, "dayId", false, `${departmentShiftId}/${monthId}/${currentDayInWeek}/null/${attenderId}`);
    }


    attenderTimeShiftDaysGetPage();
});

$("#isOnlineBookingUnLimit").on("change", function () {

    let val = +$(this).val()
    $("#numberOnLineAppointment").val("")

    if (val == 1) {
        $("#numberOnLineAppointment").prop("disabled", true)
        $("#numberOnLineAppointment").prop("required", false)
    }
    else if (val == 2) {
        $("#numberOnLineAppointment").prop("disabled", false)
        $("#numberOnLineAppointment").prop("required", true)
    }

})

$("#isOfflineBookingUnLimit").on("change", function () {

    let val = +$(this).val()
    $("#numberOffLineAppointment").val("")

    if (val == 1 || val == 2) {
        $("#numberOffLineAppointment").prop("disabled", true)
        $("#numberOffLineAppointment").prop("required", false)
    }

    else {
        $("#numberOffLineAppointment").prop("disabled", false)
        $("#numberOffLineAppointment").prop("required", true)
    }


    if (val == 2) {
        $("#numberOffLineAppointment").val(unlimitedOfflineNumber);
        $("#appointmentDistributionTypeId").empty();
        var isOfflineBookingUnLimitOption = new Option(`1 - آنلاین اول / آفلاین آخر`, 1, true, true);
        $("#appointmentDistributionTypeId").append(isOfflineBookingUnLimitOption);
    }
    else {

        fill_select2("/api/AdmissionsApi/appointmentdistribution_getdropdown", "appointmentDistributionTypeId", true);
        $("#appointmentDistributionTypeId").prop("selectedIndex", 0).trigger("change")
    }
})

function saveUpdateRow() {

    saveTimesheetLine();
}

function validationForm() {
    var result = true;

    let isOnlineBookingUnLimit = +$("#isOnlineBookingUnLimit").val();
    let isOfflineBookingUnLimit = +$("#isOfflineBookingUnLimit").val();
    if (isOnlineBookingUnLimit == 1 && isOfflineBookingUnLimit == 1) {
        alertify.warning("محدودیت ها نمی تواند هر دو غیر فعال باشد").delay(alertify_delay);
        result = false;
    }


    if (+$("#departmentTimeShiftId").val() <= 0) {
        alertify.warning("شیفت کاری را انتخاب نمایید").delay(alertify_delay);
        result = false;
    }

    if (+$("#monthId").val() <= 0) {
        alertify.warning("ماه را انتخاب نمایید").delay(alertify_delay);
        result = false;
    }


    if (+$("#dayId").val() <= 0) {
        alertify.warning("روز را انتخاب نمایید").delay(alertify_delay);
        result = false;
    }


    if (isOnlineBookingUnLimit == 2 && +$("#numberOnLineAppointment").val() == 0) {
        alertify.warning("تعداد ویزیت غیرحضوری را انتخاب نمایید").delay(alertify_delay);
        result = false;
    }


    if (isOfflineBookingUnLimit == 3 && +$("#numberOffLineAppointment").val() == 0) {
        alertify.warning("تعداد ویزیت حضوری را انتخاب نمایید").delay(alertify_delay);
        result = false;
    }

    if (+$("#appointmentDistributionTypeId").val() <= 0) {
        alertify.warning("نوع توزیع را انتخاب نمایید").delay(alertify_delay);
        result = false;
    }

    return result;
}

function saveTimesheetLine() {

    let result = validationForm();
    if (!result) return false;

    var model = {
        opr: operation,
        id: +$("#idNumber").val(),
        departmentTimeShiftId: +$("#departmentShiftId").val(),
        isOfflineBookingUnlimit: +$("#isOfflineBookingUnLimit").val(),
        numberOnLineAppointment: +$("#numberOnLineAppointment").val(),
        numberOffLineAppointment: +$("#numberOffLineAppointment").val(),
        appointmentDistributionTypeId: +$("#appointmentDistributionTypeId").val(),
        workDayDatePersian: $("#dayId").val(),
        attenderId: attenderId,
        startTime: $("#dayId option:selected").text().split('/')[3].split('-')[0],
        endTime: $("#dayId option:selected").text().split('/')[3].split('-')[1],
        dayInweek: +currentDayInWeek > 0 ? +currentDayInWeek : null

    };


    let url = `${viewData_baseUrl_MC}/${viewData_controllername}/insert`;

    loadingAsync(true, "saveRow", "fa fa-plus");


    $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        cache: false,
        success: function (result) {
            switch (result.status) {

                case 100:
                    alertify.success(result.statusMessage).delay(7);
                    attenderTimeShiftDaysGetPage();
                    resetattenderTimeShiftDays();
                    rowEditId = 0;
                    searchShift();
                    break;

                case 101:
                    alertify.warning(result.statusMessage).delay(7);
                    attenderTimeShiftDaysGetPage();
                    resetattenderTimeShiftDays();
                    rowEditId = 0;
                    searchShift();
                    break;

                case 102:
                    alertify.warning(result.statusMessage).delay(7);
                    generateErrorValidation(result.validationErrors);
                    attenderTimeShiftDaysGetPage();
                    resetattenderTimeShiftDays();
                    rowEditId = 0;
                    searchShift();
                    break;

                case -100:
                case -103:
                    generateErrorValidation(result.validationErrors);
                    break;

                case -101:
                case -104:
                    alertify.error(result.statusMessage).delay(7);
                    break;

                case -102:
                    alertify.error(result.statusMessage).delay(7);
                    if (result.data.length > 0)
                        showErrorAttenderTimeSheetList(result.data);
                    break;

            }

            loadingAsync(false, "saveRow", "fa fa-plus");


        },
        error: function (xhr) {
            loadingAsync(false, "modal-save", "fa fa-save");

            error_handler(xhr, url)
        }


    });

}

function attenderTimeShiftDaysGetPage() {


    let model = {
        fiscalYearId: fiscalYearId,
        monthId: +$("#monthId").val() > 0 ? +$("#monthId").val() : null,
        dayInWeek: currentDayInWeek,
        branchId: branchId,
        attenderId: attenderId
    }

    let url = `${viewData_baseUrl_MC}/${viewData_controllername}/getlistattendertimesheet`;

    $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        cache: false,
        success: function (result) {
            $("#tableLine tbody").empty()
            if (result.data.length > 0) {
                fillAttenderTimeShiftDays(result.data);
            }
            else {
                let str = `
                        <tr>
                             <td colspan="10" style="text-align:center">سطری وجود ندارد</td>
                        </tr>
                        `
                $("#tableLine tbody").append(str);
            }


        },
        error: function (xhr) {

            error_handler(xhr, url)
        }


    });
}

function fillAttenderTimeShiftDays(data) {

    let str = "";
    for (var i = 0; i < data.length; i++) {
        str = `<tr id='rowItem${i + 1}' highlight=${i + 1} onclick="newTrOnclickAttenderTimeShiftDays(${i + 1})" onkeydown="newTrOnkeydownAttenderTimeShiftDays(this,event,${i + 1})"
                            data-id = ${data[i].id} data-departmentTimeShiftId = ${data[i].departmentTimeShiftId} data-monthId = ${data[i].monthId} 
                            data-workDayDatePersian = ${data[i].workDayDatePersian} data-isOfflineBookingUnLimit= ${data[i].isOfflineBookingUnLimit} 
                            data-numberOffLineAppointment = ${data[i].numberOffLineAppointment} 
                            data-isOnlineBookingUnLimit=${data[i].isOnlineBookingUnLimit} 
                            data-numberOnLineAppointment=${data[i].numberOnLineAppointment} data-appointmentDistributionTypeId=${data[i].appointmentDistributionTypeId} tabindex="-1">`

        str += `<td  style="width:6%">${data[i].id}</td>`
        str += `<td  style="width:16%">${data[i].departmentTimeShiftName}</td>`
        str += `<td  style="width:8%">${data[i].month}</td>`
        str += `<td  style="width:14%">${data[i].workDayDatePersian} - ${data[i].time}</td>`
        str += `<td  style="width:8%">${data[i].isOnlineBookingUnLimitTitle}</td>`
        str += `<td  style="width:9%">${data[i].numberOnLineAppointment}</td>`
        str += `<td  style="width:8%">${data[i].isOfflineBookingUnLimitTitle}</td>`
        str += `<td  style="width:8%">${data[i].numberOffLineAppointment}</td>`
        str += `<td  style="width:13%">${data[i].appointmentDistributionType}</td>`


        str += `
                <td style="width:8% text-align="center">
                   <div style="display:flex;justify-content :center">
                        <button id='rowItemDelete${i + 1}' type="button" style="margin-left: 4px;padding: 4px 8px 2px 8px  !important;font-size:11px !important" id="btn_delete" onclick="deleteAttenderTimeShiftDays(${i + 1})" class="btn maroon_outline" title="حذف"><i class="fa fa-trash"></i></button>
                        <button type="button" style="padding: 4px 6px 2px 6px !important;font-size:11px !important" id="btn_edit" onclick="editAttenderTimeShiftDays(${i + 1})" class="btn green_outline_1" title="ویرایش"><i class="fa fa-edit"></i></button>
                   </div>
                </td>
                `
        str += `</tr>`
        $("#tableLine tbody").append(str)
    }

    $(`#tableLine tbody tr[highlight=1]`).addClass("highlight");

}

function newTrOnclickAttenderTimeShiftDays(row) {
    new_tr_Highlight(row)
}

function new_tr_Highlight(row) {
    $(`#tableLine .highlight`).removeClass("highlight");
    $(`#tableLine tr[highlight=${row}]`).addClass("highlight");
    $(`#tableLine tr[highlight=${row}]`).focus();
}

function newTrOnkeydownAttenderTimeShiftDays(elm, ev, row) {
    if (ev.which === KeyCode.ArrowUp) {
        ev.preventDefault();
        if ($(`#tableLine tr[highlight = ${row - 1}]`).length != 0) {
            $(`#tableLine .highlight`).removeClass("highlight");
            $(`#tableLine tr[highlight = ${row - 1}]`).addClass("highlight");
            $(`#tableLine tr[highlight = ${row - 1}]`).focus();
        }

    } else if (ev.which === KeyCode.ArrowDown) {
        ev.preventDefault();
        if ($(`#tableLine tr[highlight = ${row + 1}]`).length != 0) {
            $(`#tableLine .highlight`).removeClass("highlight");
            $(`#tableLine tr[highlight = ${row + 1}]`).addClass("highlight");
            $(`#tableLine tr[highlight = ${row + 1}]`).focus();
        }
    }

}

function resetattenderTimeShiftDays() {
    $("#idNumber").val("");
    $("#departmentShiftId").val("").trigger("change");
    $("#departmentShiftId").select2("focus");

    $("#dayId").empty();

    $("#isOnlineBookingUnLimit").val("1").trigger("change");
    $("#numberOnLineAppointment").val("");

    $("#isOfflineBookingUnLimit").val("1").trigger("change");
    $("#numberOffLineAppointment").val("");
    $("#appointmentDistributionTypeId").val("");

}

function deleteAttenderTimeShiftDays(index) {

    isSave = false;
    isEdit = false;
    isDelete = true;
    rowDeleteId = index;
    formKeyValue = [
        attenderId,
        +$("#branchId").val(),
        +$("#fiscalYearId").val()
    ];

    let departmentTimeShiftIds = +$(`#tableLine tbody tr[id="rowItem${index}"]`).data('departmenttimeshiftid');

    let workDayDatePersian = $(`#tableLine tbody tr[id="rowItem${index}"]`).data('workdaydatepersian');


    attenderTimesheetCurrent = {
        attenderTimeSheetIds: null,
        medicalShiftTimeSheetIds: null,
        standardTimeSheetIds: null,
        departmentTimeShiftIds: departmentTimeShiftIds,
        attenderId: attenderId,
        fiscalYearId: +$("#fiscalYearId").val(),
        branchId: +$("#branchId").val(),
        dayInWeek: currentDayInWeek,
        hasPatient: 1,
        fromAppointmentDate: convertToMiladiDate(workDayDatePersian),
        toAppointmentDate: convertToMiladiDate(workDayDatePersian),
        departmentId: currentDepartmentId,
        fromTime: null
    }
    displayAssignAttenderTimesheetLine(0);


}


function deleteAttenderTimeShift() {

    var model = {
        opr: "Del",
        id: +$(`#tableLine tbody tr[id="rowItem${rowDeleteId}"]`).data('id'),
        departmentTimeShiftId: +$(`#tableLine tbody tr[id="rowItem${rowDeleteId}"]`).data('departmenttimeshiftid'),
        numberOnLineAppointment: +$(`#tableLine tbody tr[id="rowItem${rowDeleteId}"]`).data('numberonlineappointment'),
        isOfflineBookingUnlimit: +$(`#tableLine tbody tr[id="rowItem${rowDeleteId}"]`).data('isofflinebookingunlimit'),
        numberOffLineAppointment: +$(`#tableLine tbody tr[id="rowItem${rowDeleteId}"]`).data('numberofflineappointment'),
        appointmentDistributionTypeId: +$(`#tableLine tbody tr[id="rowItem${rowDeleteId}"]`).data('appointmentdistributiontypeid'),
        workDayDatePersian: $(`#tableLine tbody tr[id="rowItem${rowDeleteId}"]`).data('workdaydatepersian'),
        attenderId: attenderId,
        dayInweek: +currentDayInWeek > 0 ? +currentDayInWeek : null
    };


    let url = `${viewData_baseUrl_MC}/${viewData_controllername}/delete`;

    $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        cache: false,
        success: function (result) {


            switch (result.status) {

                case 100:
                    alertify.success(result.statusMessage);
                    attenderTimeShiftDaysGetPage();
                    resetattenderTimeShiftDays();
                    operation = "Ins";
                    isDelete = false;
                    rowDeleteId = 0;
                    searchShift();
                    break;


                case -100:
                case -103:
                    generateErrorValidation(result.validationErrors);
                    break;

                case -101:
                case -104:
                    alertify.error(result.statusMessage).delay(7);
                    break;

                case -102:
                    alertify.error(result.statusMessage).delay(7);
                    if (result.data.length > 0)
                        showErrorAttenderTimeSheetList(result.data);
                    break;

            }

        },
        error: function (xhr) {
            loadingAsync(false, "modal-save", "fa fa-save");

            error_handler(xhr, url)
        }


    });
}

function editAttenderTimeShiftDays(index) {


    rowEditId = index;

    operation = "Upd";
    isEdit = true;

    formKeyValue = [
        attenderId,
        +$("#branchId").val(),
        +$("#fiscalYearId").val()
    ];

    let departmentTimeShiftIds = +$(`#tableLine tbody tr[id="rowItem${index}"]`).data('departmenttimeshiftid');

    let workDayDatePersian = $(`#tableLine tbody tr[id="rowItem${index}"]`).data('workdaydatepersian');

    attenderTimesheetCurrent = {
        attenderTimeSheetIds: null,
        medicalShiftTimeSheetIds: null,
        standardTimeSheetIds: null,
        departmentTimeShiftIds: departmentTimeShiftIds,
        attenderId: attenderId,
        fiscalYearId: +$("#fiscalYearId").val(),
        branchId: +$("#branchId").val(),
        dayInWeek: currentDayInWeek,
        hasPatient: 1,
        fromAppointmentDate: convertToMiladiDate(workDayDatePersian),
        toAppointmentDate: convertToMiladiDate(workDayDatePersian),
        departmentId: currentDepartmentId,
        fromTime: null
    }
    displayAssignAttenderTimesheetLine(0);
}


function resetInputsRowUnits() {
    $("#monthId").empty();
    resetattenderTimeShiftDays();
}
//#endregion


function loadingAsync(loading, elementId, iconClass) {

    if (loading) {
        $(`#${elementId} i`).removeClass(iconClass).addClass(`fa fa-spinner fa-spin`);
        $(`#${elementId}`).prop("disabled", true)

    }
    else {
        $(`#${elementId} i`).removeClass("fa fa-spinner fa-spin").addClass(iconClass);
        $(`#${elementId}`).prop("disabled", false)

    }
}

async function getDaysloadingAsync(loading, elm) {

    $("#medicalTimeShiftDays_pagetable tbody button i").removeClass("fa fa-spinner fa-spin");

    if (loading) {

        $(elm.children[0]).addClass("fa fa-spinner fa-spin");

        $(elm).prop("disabled", true);
    }
    else {
        $("#medicalTimeShiftDays_pagetable tbody button").prop("disabled", false)
    }
}

function parameterAttenderTimeSheetLine() {


    let csv_AttenderTimeSheetLineModel = [];
    csv_AttenderTimeSheetLineModel[0] = +$("#fiscalYearId").val();
    csv_AttenderTimeSheetLineModel[1] = +$("#branchId").val();
    csv_AttenderTimeSheetLineModel[2] = attenderId;
    csv_AttenderTimeSheetLineModel[3] = null;
    csv_AttenderTimeSheetLineModel[4] = fiscalStartDate;
    csv_AttenderTimeSheetLineModel[5] = fiscalEndDate;

    let index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id);
    let parameters = {
        pageNo: 0,
        pageRowsCount: 0,
        fieldItem: "",
        fieldValue: "",
        form_KeyValue: csv_AttenderTimeSheetLineModel,
        filters: arrSearchFilter[index].filters,
        sortModel: null
    }
    return parameters;
}

function export_csvGetAttenderTimeSheetLine() {

    let title = `${viewData_form_title}`;
    let csvModel = null;
    csvModel = parameterAttenderTimeSheetLine();

    csvModel.pageNo = null;
    csvModel.pageRowsCount = null;
    let urlCSV = `${viewData_baseUrl_MC}/${viewData_controllername}/csvgetattendertimesheetline`;

    $.ajax({
        url: urlCSV,
        type: "POST",
        xhrFields: {
            responseType: 'blob'
        },
        data: JSON.stringify(csvModel),
        contentType: "application/json",
        success: function (result) {
            if (result) {

                let element = document.createElement('a')
                element.setAttribute('href', window.URL.createObjectURL(result));
                element.setAttribute('download', `${title}.csv`);
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
                window.URL.revokeObjectURL(urlCSV);
            }
        },
        error: function (xhr) {
            error_handler(xhr)
        }
    });
}

$("#attenderTimesheetLineAssignModals").on("hidden.bs.modal", function () {

    pagetable_formkeyvalue = [attenderId, +$("#fiscalYearId").val(), +$("#branchId").val(), currentMonth, currentDayInWeek, currentDepartmentId, null, null, null];

    loadingAsync(false, "btn_displayDetailMedicalTimeShift", "far fa-file-alt");
})

$("#attenderTimeSheetLineModals").on("hidden.bs.modal", function () {

    pagetable_formkeyvalue = [attenderId, +$("#fiscalYearId").val(), +$("#branchId").val(), currentSelectedMonth, currentDayInWeek, currentDepartmentId, null, null, null];
})

function modal_closeAttenderTimesheetLineModal() {
    pagetable_formkeyvalue = [attenderId, +$("#fiscalYearId").val(), +$("#branchId").val(), currentSelectedMonth, currentDayInWeek, currentDepartmentId, null, null, null];

    modal_close("addAttenderTimesheetLineModal");

}

$("#addAttenderTimesheetLineModal").on("hidden.bs.modal", async function () {

    operation = "Ins";
});


initForm();




