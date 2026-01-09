
var formMove1 = $('#formMoveValidateForModalPatient1').parsley()
var formMove2 = $('#formMoveValidateForModalPatient2').parsley()

function initFormMove() {

    $("#reservedMoveListFrom .loadin-div + .row").css("display", "none")
    $("#reservedMoveListFrom").css("display", "inline")
    $("#reservedMoveListTo .loadin-div + .row").css("display", "none")
    $("#reservedMoveListTo").css("display", "inline")


    $("#fromReserveDateMove").inputmask();
    $("#toReserveDateMove").inputmask();

    $("#fromAppointmentDateMove").inputmask();
    $("#toAppointmentDateMove").inputmask();


    inputMask();
    inboundLoadDropdownMove();
}

function inboundLoadDropdownMove() {

    $(".select2").select2();
    $("#attenderIdMoveModal,#patientIdMove,#branchIdMove").empty()

}

$("#attenderIdMoveModal").on("change", function () {
    
    let attenderId = +$("#attenderIdMoveModal").val();
    let patientId = $("#patientIdMove").val() == "" ? null : $("#patientIdMove").val();
    let fromReserveDateTimePersian1 = $("#fromReserveDateMove").val();
    let toReserveDateTimePersian1 = $("#toReserveDateMove").val();
   
    let isOnlineMove = +$("#typeOnLineMove").val()

    if (isOnlineMove > 0 && attenderId > 0) {

        patientAttenderScheduleBlockMoveSearch(patientId, fromReserveDateTimePersian1, toReserveDateTimePersian1,"reservedMoveListFrom");

        let branchIdMove = $("#branchIdMove").val() == "" ? null : $("#branchIdMove").val()
        let fromAppointmentDateMove = $("#fromAppointmentDateMove").val()
        let toAppointmentDateMove = $("#toAppointmentDateMove").val()

        let startTime = $("#startTime").val()
        let endTime = $("#endTime").val()
        let dayInWeek = $("#dayInWeek").val()

        
        if (+branchIdMove > 0)
        patientAttenderScheduleBlockGetPageForMoveSearch(branchIdMove, fromAppointmentDateMove, toAppointmentDateMove, startTime, endTime, dayInWeek, "reservedMoveListTo");
        else {
            $("#reservedMoveListTo tbody").html(``)
            $("#reservedMoveListTo tbody").html(`<tr id="emptyRow"><td colspan="10" style="text-align:center">سطری وجود ندارد</td></tr>`)
        }
    }
    else {
        $("#reservedMoveListFrom tbody").html(``)
        $("#reservedMoveListFrom tbody").html(`<tr id="emptyRow"><td colspan="10" style="text-align:center">سطری وجود ندارد</td></tr>`)

    }

})

$("#searchReservedMoveListFrom").on("click", function () {
    
    var validate1 = formMove1.validate();
    validateSelect2(formMove1);
    if (!validate1) return;

    var patientId = $("#patientIdMove").val() == "" ? null : $("#patientIdMove").val()
    var fromReserveDateTimePersian1 = $("#fromReserveDateMove").val()
    var toReserveDateTimePersian1 = $("#toReserveDateMove").val()
   
    var reservedMoveListFrom = {
        pagetable_id: "reservedMoveListFrom",
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
        getpagetable_url: `${viewData_baseUrl_MC}/AdmissionApi/patientreservedlist`,
        getfilter_url: ``,
        lastPageloaded: 0,
        selectedItems: []
    };

    let index = arr_pagetables.findIndex(v => v.pagetable_id == reservedMoveListFrom.pagetable_id);
    if (index == -1) {
        arr_pagetables.push(reservedMoveListFrom);
    } else {
        arr_pagetables[index].pagetable_id = "reservedMoveListFrom"
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
        arr_pagetables[index].getpagetable_url = `${viewData_baseUrl_MC}/AdmissionApi/patientreservedlist`
        arr_pagetables[index].selectedItems = []
        arr_pagetables[index].lastPageloaded = 0
    }


    patientAttenderScheduleBlockMoveSearch(patientId, fromReserveDateTimePersian1, toReserveDateTimePersian1, reservedMoveListFrom.pagetable_id);
})

function patientAttenderScheduleBlockMoveSearch(patientMoveId, fromReserveMoveDateTimePersian, toReserveMoveDateTimePersian, pagetablefrom) {

    let attenderIdMoveModal = $("#attenderIdMoveModal").val()
    let isOnlineMove = $("#typeOnLineMove").val()


    if (attenderIdMoveModal == null || attenderIdMoveModal == undefined || attenderIdMoveModal == "") {

        msg_s = alertify.warning("داکتر را انتخاب کنید");
        msg_s.delay(admission.delay);

        $("#attenderIdMoveModal").select2("focus");
        return;
    }
    if (isOnlineMove == null || isOnlineMove == undefined || isOnlineMove == "" || isOnlineMove == 0) {
        msg_s = alertify.warning("نوبت را انتخاب کنید");
        msg_s.delay(admission.delay);

        $("#typeOnLineMove").select2("focus");
        return;
    }
    let modelSearchMoveTo = {
        attenderId: attenderIdMoveModal,
        patientMoveId,
        fromReserveMoveDateTimePersian,
        toReserveMoveDateTimePersian,
        isOnlineMove: +isOnlineMove == 1 ? 1 : 0
    }

    patientReservedMoveList_NewPagetable(pagetablefrom, false, undefined, modelSearchMoveTo);

}

function patientReservedMoveList_NewPagetable(pg_idFrom = null, isInsert = false, callBack = undefined, modelSearchMoveTo) {
    
    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_idFrom);
    arr_pagetables[index].currentpage = 0;
    arr_pagetables[index].selectedItems = [];
    let pagetable_formkeyvalue = []
    pagetable_formkeyvalue[0] = modelSearchMoveTo.attenderId;
    pagetable_formkeyvalue[1] = modelSearchMoveTo.patientMoveId;
    pagetable_formkeyvalue[2] = modelSearchMoveTo.fromReserveMoveDateTimePersian;
    pagetable_formkeyvalue[3] = modelSearchMoveTo.toReserveMoveDateTimePersian;
    pagetable_formkeyvalue[4] = modelSearchMoveTo.isOnlineMove;
    pagetable_formkeyvalue[5] = "Move";

    arr_pagetables[index].pagetable_formkeyvalue = pagetable_formkeyvalue;
    get_NewPageTable(pg_idFrom, isInsert, callBack);



}

$("#searchReservedMoveListTo").on("click", function () {
    
    var validate1 = formMove2.validate();
    validateSelect2(formMove2);
    if (!validate1) return;

    let branchIdMove = $("#branchIdMove").val() == "" ? null : $("#branchIdMove").val()
    let fromAppointmentDateMove = $("#fromAppointmentDateMove").val()
    let toAppointmentDateMove = $("#toAppointmentDateMove").val()


    let startTime = $("#startTime").val()
    let endTime = $("#endTime").val()
    let dayInWeek = $("#dayInWeek").val()

    var reservedMoveListTo = {
        pagetable_id: "reservedMoveListTo",
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
        getpagetable_url: `${viewData_baseUrl_MC}/AdmissionApi/patientMovelist`,
        getfilter_url: ``,
        lastPageloaded: 0,
        selectedItems: []
    };

    let index = arr_pagetables.findIndex(v => v.pagetable_id == reservedMoveListTo.pagetable_id);



    if (index == -1) {
        arr_pagetables.push(reservedMoveListTo);
    } else {
        arr_pagetables[index].pagetable_id = "reservedMoveListTo"
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
        arr_pagetables[index].getpagetable_url = `${viewData_baseUrl_MC}/AdmissionApi/patientMovelist`
        arr_pagetables[index].selectedItems = []
        arr_pagetables[index].lastPageloaded = 0
    }


    patientAttenderScheduleBlockGetPageForMoveSearch(branchIdMove, fromAppointmentDateMove, toAppointmentDateMove, startTime, endTime, dayInWeek, reservedMoveListTo.pagetable_id);
})

function patientAttenderScheduleBlockGetPageForMoveSearch(branchId, fromAppointmentDate, toAppointmentDate, startTime, endTime, dayInWeek, pagetableTo) {
    
    let attenderIdMoveModal = $("#attenderIdMoveModal").val()
    let isOnlineMove = $("#typeOnLineMove").val()

    if (attenderIdMoveModal == null || attenderIdMoveModal == undefined || attenderIdMoveModal == "") {

        msg_s = alertify.warning("داکتر را انتخاب کنید");
        msg_s.delay(admission.delay);

        $("#attenderIdMoveModal").select2("focus");
        return;
    }

    if (isOnlineMove == null || isOnlineMove == undefined || isOnlineMove == "" || isOnlineMove == 0) {
        msg_s = alertify.warning("نوبت را انتخاب کنید");
        msg_s.delay(admission.delay);

        $("#typeOnLineMove").select2("focus");
        return;
    }

    if (branchId == null || branchId == undefined || branchId == "" || branchId == 0) {
        msg_s = alertify.warning("شعبه را انتخاب کنید");
        msg_s.delay(admission.delay);

        $("#branchIdMove").select2("focus");
        return;
    }

    var modelSearchMoveFrom = {
        attenderId: attenderIdMoveModal,
        branchId,
        fromAppointmentDate,
        toAppointmentDate,
        isOnlineMove: +isOnlineMove == 1 ? 1 : 0,
        startTime: (startTime == "") ? null : startTime,
        endTime: (endTime == "") ? null : endTime,
        dayInWeek: +dayInWeek > 0 ? dayInWeek : null
    }

    patientAttenderScheduleBlockGetPageForMoveList_NewPagetable(pagetableTo, isInsert = false, callBack = undefined, modelSearchMoveFrom);

}

function patientAttenderScheduleBlockGetPageForMoveList_NewPagetable(pg_idTo = null, isInsert, callBack, modelSearchMoveFrom) {
    
    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_idTo);
    arr_pagetables[index].currentpage = 0;
    arr_pagetables[index].selectedItems = [];
   
    let pagetable_formkeyvalue = []
    pagetable_formkeyvalue[0] = modelSearchMoveFrom.attenderId;
    pagetable_formkeyvalue[1] = modelSearchMoveFrom.branchId;
    pagetable_formkeyvalue[2] = modelSearchMoveFrom.fromAppointmentDate;
    pagetable_formkeyvalue[3] = modelSearchMoveFrom.toAppointmentDate;
    pagetable_formkeyvalue[4] = modelSearchMoveFrom.isOnlineMove;
    pagetable_formkeyvalue[5] = modelSearchMoveFrom.startTime;
    pagetable_formkeyvalue[6] = modelSearchMoveFrom.endTime;
    pagetable_formkeyvalue[7] = modelSearchMoveFrom.dayInWeek;

    arr_pagetables[index].pagetable_formkeyvalue = pagetable_formkeyvalue;
    get_NewPageTable(pg_idTo, isInsert, callBack);

}

function displacementReserveMoveDate() {


    let index = arr_pagetables.findIndex(v => v.pagetable_id == "reservedMoveListFrom");
    if (index != -1) {
        let attenderScheduleBlockIds = [];
        let attenderScheduleBlockids = [];
        let reservedMoveListItem = arr_pagetables[index].selectedItems;
        if (reservedMoveListItem.length > 0) {
            for (var i = 0; i < reservedMoveListItem.length; i++) {
                attenderScheduleBlockids.push(reservedMoveListItem[i].attenderscheduleblockid);
            }

            attenderScheduleBlockIds = attenderScheduleBlockids.join(",");

            var model = {
                fromAttenderScheduleBlockIds: attenderScheduleBlockIds,
                fromWorkDayDate: $("#fromAppointmentDateMove").val(),
                toWorkDayDate: $("#toAppointmentDateMove").val(),
                departmentTimeShiftId: null,
                attenderId: +$("#attenderIdMoveModal").val(),
                startTime: $("#reservedMoveListTo .highlight").data("starttime"),
                isOnline: +$("#typeOnLineMove").val() == 1 ? 1 : 0

            }
            let url = `${viewData_baseUrl_MC}/AdmissionApi/updatereservemovepatient`;

            $.ajax({
                url: url,
                type: "post",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(model),
                success: function (result) {
                    pagetable_formkeyvalue[5] = null;
                    pagetable_formkeyvalue[6] = null;
                    pagetable_formkeyvalue[7] = null;
                    if (result.successfull) {
                        $("#searchReservedMoveListFrom").click()
                        $("#searchReservedMoveListTo").click()
                        var msg = alertify.success(result.statusMessage.toString());
                        msg.delay(alertify_delay);


                    }
                    else {

                        var msg = alertify.warning(result.statusMessage.toString());
                        msg.delay(alertify_delay);
                    }
                },
                error: function (xhr) {
                    error_handler(xhr, url);
                }
            });
        }
        else {
            var err = alertify.warning("حداقل یک سطر را انتخاب نمایید");
            err.delay(alertify_delay);
        }
    }
    else {
        var err = alertify.warning("حداقل یک سطر را انتخاب نمایید");
        err.delay(alertify_delay);
    }


}

function clearAttenderScheduleBlockMoveTab() {

    $("#attenderIdMoveModal").val("").trigger("change");
    $("#patientIdMove").val("").trigger("change");
    $("#branchIdMove").val("").trigger("change");
    $("#typeOnLineMove").val("0").trigger("change");

    $("#reservedMoveListFrom #parentPageTableBody tbody").html("")
    $("#reservedMoveListTo #parentPageTableBody tbody").html("")


    $("#reservedMoveListFrom #firstRow").html(0)
    $("#reservedMoveListFrom #lastRow").html(0)
    $("#reservedMoveListFrom #currentPage").html(0)
    $("#reservedMoveListFrom #dropCounteresPageTableName").html("")
    $("#reservedMoveListFrom #dropCounteresPageTable").html("")

    $("#reservedMoveListTo #firstRow").html(0)
    $("#reservedMoveListTo #lastRow").html(0)
    $("#reservedMoveListTo #currentPage").html(0)
    $("#reservedMoveListTo #dropCounteresPageTableName").html("")
    $("#reservedMoveListTo #dropCounteresPageTable").html("")

    $("#fromReserveDateMove").val(moment().format('jYYYY/jMM/jDD'));
    $("#toReserveDateMove").val(moment().format('jYYYY/jMM/jDD'));
    $("#fromAppointmentDateMove").val(moment().format('jYYYY/jMM/jDD'));
    $("#toAppointmentDateMove").val(moment().format('jYYYY/jMM/jDD'));


}



initFormMove();