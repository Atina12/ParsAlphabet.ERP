
var isReadOnly = false, isReimburesment = false,
    userInfoLogin = {};

async function reserve_init(p_attrId, isReim) {
    userInfoLogin = await getCashIdByUserId()
    $("#attrId").html(p_attrId)
    $("#attrName").html($("#attenderId").find(":selected").text().split("-")[1])
    $("#attrMsc").html(typeof attenderMsc != 'undefined' ? attenderMsc : "")

    isReimburesment = isReim;

    attender_schedule(p_attrId, 'init');
}

async function attender_schedule(p_attrId, funcType) {

    var baseDate = "";

    if (funcType == 'init')
        baseDate = "";
    else if (funcType == 'before')
        baseDate = $("#reserve_weekdays_1 p:first").html();
    else if (funcType == 'next')
        baseDate = $("#reserve_weekdays_7 p:first").html();


    var model = {
        AttenderId: p_attrId,
        BaseDate: baseDate,
        FuncType: funcType
    }

    var firstActiveDate = "";
    var firstActiveWeekDay = 0;

    $("#reserve_weekdays").html("");

    let viewData_get_attenderschedule = `${viewData_baseUrl_MC}/AdmissionApi/getattenderschedule`

    $.ajax({
        url: viewData_get_attenderschedule,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        cache: false,
        async: false,
        success: function (result) {
            var list = result;
            var str = "";
            var activated = false;

            $("#reserve_goto_prev").removeClass("mute");
            $("#reserve_goto_prev").attr("href", "javascript:reserve_goto_prev();");

            for (var i = 0; i < list.length; i++) {
                if (list[i].isToday) {
                    $("#reserve_goto_prev").addClass("mute");
                    $("#reserve_goto_prev").removeAttr("href");
                }

                str += '<li class="nav-item waves-effect waves-light text-center">';

                if (list[i].isActive == true && !activated) {
                    activated = true;
                    firstActiveDate = list[i].shamsiDate;
                    firstActiveWeekDay = list[i].weekDay;
                }

                str += `<a id="reserve_weekdays_${i + 1}" 
                           class="nav-link ${!list[i].isActive ? 'mute' : ''}" 
                            ${list[i].isActive ? `href="javascript:run_reserve_date_select('${p_attrId}','${list[i].weekDay}','${list[i].shamsiDate}')"` : ''}>
                        <span>${list[i].weekDayName}</span>
                        <p>${list[i].shamsiDate}</p>
                        </a></li>`

                if (i == list.length - 1)
                    $("#reserveBox").removeClass("d-none");
            }

            $("#reserve_weekdays").append(str);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_get_attenderschedule)
        }
    });

    run_reserve_date_select(p_attrId, firstActiveWeekDay, firstActiveDate);

    //setCurrentReserving();
}

async function run_reserve_date_select(p_attrId, p_weekDay, resDate) {
    attenderShiftsAndAppointments(p_attrId, p_weekDay, resDate);
}

async function attenderShiftsAndAppointments(p_attrId, p_weekDay, resDate) {

    let miladiPResDate = moment.from(resDate, 'fa', 'YYYY/MM/DD').locale('en').format('YYYY/MM/DD')

    let attenderBranchId = userInfoLogin.branchId

    let attenderTimeShiftList = await getAttenderTimeShiftList(p_attrId, attenderBranchId, miladiPResDate, null, false)

    $("#attenderScedule").html("")

    if (checkResponse(attenderTimeShiftList) && attenderTimeShiftList.length != 0) {

        for (let i = 0; i < attenderTimeShiftList.length; i++) {

            let attenderTimeShiftInfo = attenderTimeShiftList[i]
            let strAttenderSceduleBox = `<div class="attender-scedule-box p-0">
                                             <p id="reserve_shift_title_${attenderTimeShiftInfo.id}" class="text-right m-r-10 m-b-15">${attenderTimeShiftInfo.text}</p>
                                             <ul id="reserve_items_${attenderTimeShiftInfo.id}"></ul>
                                          </div>
                                          `
            $("#attenderScedule").append(strAttenderSceduleBox)
            reserve_date_select(p_attrId, p_weekDay, resDate, attenderTimeShiftInfo.id, attenderTimeShiftInfo.name, attenderBranchId);
        }
    }
    else {
        $("#reserve_weekdays .nav-link").removeClass('active');
        var weekday_id = `#reserve_weekdays_${p_weekDay}`;
        $(weekday_id).addClass('active');
        $("#attenderScedule").html(`<div class="attender-scedule-box p-0"><p id="reserve_shift_title_0" class="text-center m-b-15">شیفت تایین نشده است</p></div>`)
    }
}

async function reserve_date_select(p_attrId, p_weekDay, p_resDate, departmentTimeShiftId, departmentTimeShiftName, attenderBranchId) {
    
    $("#reserve_weekdays .nav-link").removeClass('active');
    var weekday_id = `#reserve_weekdays_${p_weekDay}`;
    $(weekday_id).addClass('active');

    var cur_Shift = $("#reserveShift").val();
    var cur_reserveNo = $("#reserveNo").val();
    var cur_resDate = $("#reserveDate").val();

    $(`#reserve_items_${departmentTimeShiftId}`).html("");

    var model = {
        attenderId: p_attrId,
        departmentTimeShiftId,
        branchId: attenderBranchId,
        appointmentDatePersian: p_resDate,
        isOnline: false,
    }

    var viewData_get_attenderreservelist = `${viewData_baseUrl_MC}/AdmissionApi/getattenderreservelist`

    $.ajax({
        url: viewData_get_attenderreservelist,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        cache: false,
        success: function (result) {//calender 1 2 Data
            var list = result;
            var str = "";
            

            //if (typeof list[0] !== "undefined") {
            //if (typeof list[0].status !== "undefined") {
            //       if (list[0].status == 100) {
            //        }
            //   }
            //}
            if (checkResponse(list) && list.length != 0) {

                for (var i = 0; i < list.length; i++) {
                    setTimeout((i, str) => {

                        str = '';

                        var currentBlock = list[i];

                        if (+currentBlock.reserveState == 1) {
                            str += `<li class="reserved-item">
                                                   <button class="btn btn-time">
                                                        ${currentBlock.reserveTime}
                                                        <span class="badge badge-pill badge-secondary mr-1">${currentBlock.reserveNo}</span>
                                                   </button>
                                                </li>`;
                        }
                        else {


                            if ((departmentTimeShiftId == cur_Shift) && (currentBlock.reserveNo == cur_reserveNo) && (p_resDate == cur_resDate))
                                str += `<li id="reserving-item" class="${+currentBlock.reserveState == 2 ? "reserve-over-item" : ""} reserving-item">`;
                            else
                                str += '<li>';

                            if (!isReadOnly)
                                str += `<button class="btn btn-time" 
                                             onclick="javascript:reserve_item_select(${departmentTimeShiftId},'${departmentTimeShiftName}',${currentBlock.reserveNo},'${p_resDate}','${currentBlock.reserveTime}','${currentBlock.scheduleBlockId}')" 
                                             ${isReimburesment ? "disabled" : ""}>`;
                            else
                                str += `<button class="btn btn-time" ${isReimburesment ? "disabled" : ""}>`;

                            str += `    ${currentBlock.reserveTime}
                                        <span class="badge badge-pill badge-secondary mr-1">${currentBlock.reserveNo}</span>
                                     </button>
                                     </li>`
                        }

                        $(`#reserve_items_${departmentTimeShiftId}`).append(str);

                    }, i * 0.01, i, str);
                }

            }

            $(`#reserve_items_${departmentTimeShiftId}`).append(str);
            setTimeout(() => {
                if ($("#reserving-item").length != 0)
                    document.getElementById("reserving-item").scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
            }, 100)
        },
        error: function (xhr) {
            error_handler(xhr, viewData_get_attenderreservelist)
        }
    });
}

async function reserve_goto_prev() {
    var attr = $("#attrId").html();
    attender_schedule(attr, 'before');
}

async function reserve_goto_next() {
    var attr = $("#attrId").html();
    attender_schedule(attr, 'next');

    $(`#reserve_items_1 > li`).removeClass("reserving-item");
    $(`#reserve_items_2 > li`).removeClass("reserving-item");
}

async function reserve_item_select(medicalTimeShiftId, departmentTimeShiftName, p_resNo, p_resDate, p_resTime, scheduleBlockId) {

    var isvalid_resDate = checkReserveDate(p_resDate, p_resTime);

    if (!isvalid_resDate) {
        msg_s = alertify.error(admission.notValidResDate);
        msg_s.delay(admission.delay);
        return;
    }

    let attenderTimeShiftList = [{
        id: medicalTimeShiftId,
        text: `${medicalTimeShiftId} - ${departmentTimeShiftName}`
    }]

    fillReserveShift(attenderTimeShiftList)

    let reserveDateTime = `${p_resTime} ${p_resDate}`;

    admissionReserveDateTimePersian = reserveDateTime;


    $("#reserveShift").val(medicalTimeShiftId);
    $("#reserveNo").val(p_resNo);
    $("#reserveDate").val(reserveDateTime);
    $("#scheduleBlockId").val(scheduleBlockId);

    let attenderId= +$("#attenderId").find(":selected").text().split("-")[0];
    getTimeShiftDays(attenderId, medicalTimeShiftId);

    if ($("#reserveModal").hasClass("show")) {
        modal_close("reserveModal");
        $("#referringDoctorId").focus();
    }

    const parent = event.target.parentNode

    $("li").removeClass("reserving-item");
    parent.classList.add('reserving-item');

    if (typeof fillShiftdetails == "function")
        fillShiftdetails();
}

function checkReserveDate(reserveDate, reserveTime) {

    let current = moment().format("yyyy/MM/DD"),
        reserve = moment.from(reserveDate, 'fa', 'YYYY/MM/DD').format("YYYY/MM/DD"),
        dateIsValid = moment(reserve).isSameOrAfter(current);

    return dateIsValid;
}

async function setCurrentReserving() {

    var cur_resTime = $("#reserveTime").val();

    if (cur_resTime === "")
        return;

    var item1 = $(`#reserve_items_1 > li`);
    var item2 = $(`#reserve_items_2 > li`);

    var shf_resTime = "";
    var reserveShift = +$("#reserveShift").val();


    $(item2).removeClass("reserving-item");
    $(item1).removeClass("reserving-item");

    if (reserveShift === 1) {
        for (i = 0; i < item1.length; i++) {
            shf_resTime = $(item1[i])[0].childNodes[0].childNodes[1].data;
            if (compareTimeWithOpr(shf_resTime, cur_resTime, "e")) {
                $(item1[i]).addClass("reserving-item");
                return;
            }
            else
                $(item1[i]).removeClass("reserving-item");
        }
    }
    else {
        for (j = 0; j < item2.length; j++) {
            shf_resTime = $(item2[j])[0].childNodes[0].childNodes[1].data;
            if (compareTimeWithOpr(shf_resTime, cur_resTime, "e")) {
                $(item2[j]).addClass("reserving-item");
                return;
            }
            else
                $(item2[j]).removeClass("reserving-item");
        }
    }
}


