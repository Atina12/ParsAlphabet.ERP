
var saveCountMonth = []
var currentMonth = "";


$("#employeeStandardTimeSheetDisplay").on("show.bs.modal", function () {
    $("#dispalyCalenderBasedOn").select2()
    $("#checkBeInYearMonthDay").val(1)
    getDaysAndMonthForDisplay()
})

$("#employeeStandardTimeSheetDisplay").on("hidden.bs.modal", function () {
    $("#newShowMonthListInYear").html("")
    $("#newShowDaysWeekLine").html("")
    $("#newShowSelectDay").text("")
    $("#getbackToMonthOrYear").addClass("d-none")
    $("#inYear").removeClass("d-none")
    $("#inMonth").addClass("d-none")
    $("#checkBeInYearMonthDay").val(1)
    $("#headerIndex").val("")
    saveCountMonth = []

});

function getDaysAndMonthForDisplay(lineId = 0, headerPagination = 0) {

    lineId = lineId == 0 ? +$("#modal_keyid_value_personnelCalendarDisplay").text() : +lineId
    let url = `${viewData_baseUrl_HR}/StandardTimeSheetApi/display/${lineId}/${headerPagination}`;

    $.ajax({
        url: url,
        type: "get",
        dataType: "json",
        contentType: "application/json",
        cache: false,
        success: function (result) {
            $("#departmentIdShow").text(result[0].departmentId)
            $("#modal_keyid_value_personnelCalendarDisplay").text(result[0].standardTimeSheetId)
            $("#fiscalYearDisplay").text(`سال مالی ${result[0].dayList[0].fiscalYear}`)
            setMonthInYearForDisplay(result)
            buildStandarTimeSheetBodyDisplay(result)
        },
        error: function (xhr) {
            error_handler(xhr, url)
        }
    });
}

async function setMonthInYearForDisplay(newArrOfDaysInMonth) {

    $("#newShowMonthListInYear").html("")
    let strMonth = ""
    let monthLength = newArrOfDaysInMonth.length
    saveCountMonth = []
    for (let i = 0; i < monthLength; i++) {
        let month = newArrOfDaysInMonth[i]
        let standardMonthWorkingHours = checkResponse(month.month) ? month.month.standardMonthWorkingHours : ""
        saveCountMonth.push({ monthId: month.id, monthName: month.name, standardMonthWorkingHours })

        strMonth = `<li >
                        <div id="newMonthInYear_${month.id}" class="d-flex flex-column" onclick="newGetDaysInMonth(${month.id},'${month.name}','${standardMonthWorkingHours}')" currentmonthname="${month.name}">
                            <div class="d-flex justify-content-start align-items-center text-dark mt-1 mb-1" style="border-bottom:1px solid rgba(2,197,141,.7)">
                                <span class="monthTitle">${month.name}</span>
                            </div>
                            <div id="newShowDaysInYear_${month.id}" class="w-100">
                                <ul id="newShowDaysWeekHeaderInYear_${month.id}" style="font-size:9px !important; list-style: none;margin-bottom: 0px !important;color: white" class="d-flex w-100">
                                    <li style="width:14.28%;text-align:center" class="text-dark"><div class="w-100 p-1">ش</div></li>
                                    <li style="width:14.28%;text-align:center" class="text-dark"><div class="w-100 p-1">ی</div></li>
                                    <li style="width:14.28%;text-align:center" class="text-dark"><div class="w-100 p-1">د</div></li>
                                    <li style="width:14.28%;text-align:center" class="text-dark"><div class="w-100 p-1">س</div></li>
                                    <li style="width:14.28%;text-align:center" class="text-dark"><div class="w-100 p-1">چ</div></li>
                                    <li style="width:14.28%;text-align:center" class="text-dark"><div class="w-100 p-1">پ</div></li>
                                    <li style="width:14.28%;text-align:center" class="text-dark"><div class="w-100 text-danger  p-1">ج</div></li>
                                </ul>
                                <ul id="newShowDaysWeekLineInYear_${month.id}" style="list-style: none" class='d-flex flex-wrap w-100'></ul>
                            </div>
                        </div>
                     </li>`
        $("#newShowMonthListInYear").append(strMonth)

        setDayInYearForDisplay(month.id, newArrOfDaysInMonth[i].dayList)
    }
}

function setDayInYearForDisplay(monthId, newArrOfDaysInMonth) {

    let days = newArrOfDaysInMonth

    $(`#newShowDaysWeekLineInYear_${monthId}`).html("")
    let monthLenth = days.length
    let strDays = ""

    for (let i = -1; i < monthLenth; i++) {

        let day = days[i]

        if (i == -1) {
            let startDayWeek = days[i + 1].dayOfWeek
            for (let j = 0; j < startDayWeek; j++) {
                strDays += `<li class="d-flex align-items-center justify-content-center neWshowDaysWeekLineLiExistFirstDiv" style="visibility:hidden"></li>`
            }
        }
        else {

            strDays += `<li class="d-flex align-items-center justify-content-center neWshowDaysWeekLineLiExistFirstDiv">
                            <div id="newDaysInYear_${i + 1}" selectprop="false" isholiday="${day.isHoliday}" propdayid="${day.id}" style="height:20px" class="w-100 d-flex flex-column justify-content-center">
                                <div id="newIsHolidayInYear_${i + 1}" class="isHoliday" style="background-color:${day.isHoliday ? "rgba(255, 0, 0,0.2)" : "unset"}"></div>                                   
                                <div class="d-flex justify-content-between align-items-center">
                                    <div id="newDayIdInYear_${i + 1}" class="d-flex justify-content-center align-items-center w-100" >
                                        <span class="d-flex justify-content-center align-items-center w-100" >${day.dayId}</span>
                                    </div>
                                </div>       
                            </div>
                        </li>`
        }
    }
    $(`#newShowDaysWeekLineInYear_${monthId}`).html(strDays)
    modal_show("employeeStandardTimeSheetModel")
}

function newGetDaysInMonth(monthId, monthName, standardMonthWorkingHours) {

    currentMonth = monthId
    $("#headerIndex").val("")
    $("#checkBeInYearMonthDay").val(2)
    $("#newShowSelectDay").text("")
    $("#newTableLineShowShiftOfDay tbody").html('<tr><td style="text-align:center" colspan="10">سطری وجود ندارد</td></tr>')
    $("#newYearOfCelender").text(`${monthName} (ساعت کار موظف : ${standardMonthWorkingHours == "" ? "-" : standardMonthWorkingHours} ساعت)`)

    let lineId = $("#modal_keyid_value_personnelCalendarDisplay").text()

    let url = `${viewData_baseUrl_HR}/StandardTimeSheetHolidayApi/gettimesheetholidays/${lineId}/${monthId}`;

    $.ajax({
        url: url,
        type: "get",
        dataType: "json",
        contentType: "application/json",
        cache: false,
        success: function (result) {
            newSetDays(result)
        },
        error: function (xhr) {
            error_handler(xhr, url)
        }
    });

}

function newSetDays(arrDays) {

    let days = arrDays
    $("#newShowDaysWeekLine").html("")
    let monthLenth = days.length
    let strDays = ""
    

    for (let i = -1; i < monthLenth; i++) {

        let day = days[i]

        if (i == -1) {
            let startDayWeek = days[i + 1].dayOfWeek
            for (let j = 0; j < startDayWeek; j++) {
                strDays += `<li class="d-flex align-items-center justify-content-center" style="width: 14.28%;visibility:hidden; text-align: center;height:30px"></li>`
            }
        }
        else {

            var shiftCount = `<span id="showShiftId_${i + 1}" style="font-size:12px;color:#30419b" class="${day.medicalShiftCount != 0 ? '' : 'd-none'}"> - ${day.medicalShiftCount != 0  ? `شیفت : (${day.medicalShiftCount})` : "" }</span>`

            strDays += `<li class="d-flex align-items-center justify-content-center showDaysWeekLineLiExist">
                            <div id="newDays_${i + 1}" selectprop="false" isholiday="${day.isHoliday}" propdayid="${day.id}" class="newtooltip w-100 d-flex flex-column justify-content-center showDaysWeekLineLiExistFirstDiv" >
                                <div id="newIsHoliday_${i + 1}" class="isHoliday" style="background-color:${day.isHoliday ? "rgba(255, 0, 0,0.2)" : "unset"}"></div>                                   
                                <div class="d-flex justify-content-between align-items-center">
                                    <div id="newDayId_${i + 1}" style="width:100%">
                                        <span>${day.dayId}</span>
                                        ${shiftCount}
                                    </div>
                                    <span class="dayClicked"><i id="newSelectDay_${i + 1}" class="fas fa-check" style="color:white"></i></span>
                                </div>
                                <div class="newtooltiptext">
                                    <div id="createUser_${i + 1}" style="overflow: hidden;white-space: nowrap;">${day.createUser == null ? "" : day.createUser}</div>
                                    <div id="createDateTimePersian_${i + 1}">${day.createDateTimePersian == null ? "" : day.createDateTimePersian}</div>
                                </div>    
                            </div>
                        </li>`
        }
    }

    $("#newShowDaysWeekLine").html(strDays)

    $(".newtooltip").hover(function () {
        let id = $(this).prop("id")
        let isHolidayCheck = $(this).attr("isholiday")
        if (isHolidayCheck == "true")
            $(`#${id} .newtooltiptext`).css("visibility", "visible")
    }, function () {
        let id = $(this).prop("id")
        $(`#${id} .newtooltiptext`).css("visibility", "hidden")
    });

    $("#headerIndex").val("")
    $("#inYear").addClass("d-none")
    $("#inMonth").removeClass("d-none")
    $("#getbackToMonthOrYear").removeClass("d-none")
}

function newSetHoliDay(elm, dayId, monthId, yearId) {

    let workDayDate = makeFullYear(yearId, monthId, dayId);

    $("#newShowSelectDay").text(workDayDate)

    if (lastItemClickForDay[0] == dayId && lastItemClickForDay[1] == monthId)
        return;

    let selectprop = $(elm).attr("selectprop")

    if (selectprop != 'true') {
        $(`#newShowDaysWeekLine li div[selectprop='${!(selectprop == 'true')}'] span i`).css("color", "white")
        $(`#newShowDaysWeekLine li div[selectprop='${!(selectprop == 'true')}']`).attr("selectprop", 'false')
        $(elm).attr("selectprop", `${!(selectprop == 'true')}`)
    }
    $(`#newSelectDay_${dayId}`).css("color", "#59c6fb")

    lastItemClickForDay = [dayId, monthId]
    
}



function getbackToMonthOrYear() {
    $("#headerIndex").val("")
    $("#inYear").removeClass("d-none")
    $("#inMonth").addClass("d-none")
    $("#newShowDaysWeekLine").html("")
    $("#newShowSelectDay").text("")
    $("#getbackToMonthOrYear").addClass("d-none")
    $("#checkBeInYearMonthDay").val(1)
}

function getYearMonthWeekByInput(elm, e) {
    if (e.which == KeyCode.Enter) {
        let checkBeInYearMonthDay = $("#checkBeInYearMonthDay").val()

        if (checkBeInYearMonthDay == 1) {
            let yearId = $(elm).val()
            getYearByInput(yearId)
        }
        else if (checkBeInYearMonthDay == 2) {
            let monthId = $(elm).val()
            getMonthByInput(monthId)
        }
        else {

        }
    }
}

async function getYearByInput(yearId) {
    let validExistYearId = await checkexistYearId(yearId)

    if (validExistYearId)
        getDaysAndMonthForDisplay(yearId)
    else {
        var msg = alertify.warning("تقویم با این شناسه موجود نیست");
        msg.delay(alertify_delay);
    }
}

function getMonthByInput(monthIdFromInput) {
    let valExist = null

    for (let i = 0; i < saveCountMonth.length; i++) {
        let month = saveCountMonth[i]
        if (month.monthId == monthIdFromInput) {
            valExist = { monthId: month.monthId, monthName: month.monthName, standardMonthWorkingHours: month.standardMonthWorkingHours }
        }
    }

    if (checkResponse(valExist)) {
        if (currentMonth != valExist.monthId)
            newGetDaysInMonth(valExist.monthId, valExist.monthName, valExist.standardMonthWorkingHours)
        else {
            var msg = alertify.warning("این ماه انتخاب شده");
            msg.delay(alertify_delay);
        }
    }
    else {
        var msg = alertify.warning("این ماه وجود ندارد");
        msg.delay(alertify_delay);
    }
}

function getYearMonthWeekByBtn(paginationSign) {
    let checkBeInYearMonthDay = $("#checkBeInYearMonthDay").val()

    if (checkBeInYearMonthDay == 1)
        getYearByBtn(paginationSign)
    else if (checkBeInYearMonthDay == 2)
        getMonthByBtn(paginationSign)
}

async function getYearByBtn(paginationSign) {

    if (paginationSign == 'first')
        getDaysAndMonthForDisplay(0, headerPagination = 1)
    else if (paginationSign == 'previous')
        getDaysAndMonthForDisplay(0, headerPagination = 2)
    else if (paginationSign == 'next')
        getDaysAndMonthForDisplay(0, headerPagination = 3)
    else
        getDaysAndMonthForDisplay(0, headerPagination = 4)

}

function getMonthByBtn(paginationSign) {

    if (paginationSign == 'first') {
        let monthId = saveCountMonth[0].monthId
        let monthName = saveCountMonth[0].monthName
        let standardMonthWorkingHours = saveCountMonth[0].standardMonthWorkingHours

        newGetDaysInMonth(monthId, monthName, standardMonthWorkingHours)
    }
    else if (paginationSign == 'previous') {
        if (checkResponse(saveCountMonth[currentMonth - 2])) {
            let monthId = saveCountMonth[currentMonth - 2].monthId
            let monthName = saveCountMonth[currentMonth - 2].monthName
            let standardMonthWorkingHours = saveCountMonth[currentMonth - 2].standardMonthWorkingHours
            newGetDaysInMonth(monthId, monthName, standardMonthWorkingHours)
        }
    }
    else if (paginationSign == 'next') {
        if (checkResponse(saveCountMonth[currentMonth])) {
            let monthId = saveCountMonth[currentMonth].monthId
            let monthName = saveCountMonth[currentMonth].monthName
            let standardMonthWorkingHours = saveCountMonth[currentMonth].standardMonthWorkingHours
            newGetDaysInMonth(monthId, monthName, standardMonthWorkingHours)
        }
    }
    else {
        let arrLength = saveCountMonth.length
        let monthId = saveCountMonth[arrLength - 1].monthId
        let monthName = saveCountMonth[arrLength - 1].monthName
        let standardMonthWorkingHours = saveCountMonth[arrLength - 1].standardMonthWorkingHours
        newGetDaysInMonth(monthId, monthName, standardMonthWorkingHours)
    }
}

async function checkexistYearId(yearId) {

    let url = `${viewData_baseUrl_HR}/StandardTimeSheetApi/checkexist`;

    let valid = await $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        cache: false,
        data: JSON.stringify(yearId),
        success: function (result) {
            return result
        },
        error: function (xhr) {
            error_handler(xhr, url)
        }
    });

    return valid
}

function buildStandarTimeSheetBodyDisplay(monthInfo) {

    let month = []
    for (let i = 0; i < monthInfo.length; i++) {
        month.push(monthInfo[i].month == null ? [] : monthInfo[i].month)
    }


    let strBody = ""
    let monthName = ['حمل', 'ثور', 'جوزا', 'سرطان', 'اسد', 'سنبله', 'میزان', 'قوس', 'عقرب', 'جدی', 'دلو', 'حوت']

    strBody += `
                <thead>
                  <tr>
                    <th style="width:15%">ماه</th>
                    <th style="width:20%">ساعت کار موظف ماهانه</th>
                    <th style="width:35%">کاربر ثبت کننده</th>
                    <th style="width:30%">تاریخ ثبت</th>
                  </tr>
                </thead>
                <tbody>`

    if (month.length == 0) {
        strBody += '<tr><td style="text-align:center" colspan="4">سطری وجود ندارد</td></tr>'
    }
    else {
        for (let i = 0; i < month.length; i++) {
            strBody += ` <tr tabindex="-1">
                         <td>${monthName[i]}</td>
                         <td>${checkResponse(month[i].standardMonthWorkingHours) ? month[i].standardMonthWorkingHours : ""}</td>
                         <td>${checkResponse(month[i].createUserId) && month[i].createUserId != 0 ? `${month[i].createUserId} - ${month[i].createUserFullName}` : ""}</td>
                         <td>${checkResponse(month[i].createDateTimePersian) && month[i].createDateTimePersian != "" ? month[i].createDateTimePersian : ""}</td>
                     </tr>`
        }
    }

    strBody += "</tbody>"
    $("#standardTimeSheetPerMontDisplay table").html(strBody)

    $("#standardTimeSheetPerMontDisplay #standardTimeSheetPerMonthRow_1").addClass("highlight").focus()

}




