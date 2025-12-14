var rowNo = 0;
var isfromTime = false;
var attenderTimesheetCurrent = {
    attenderTimeSheetIds: null,
    medicalShiftTimeSheetIds: null,
    standardTimeSheetIds: null,
    departmentTimeShiftIds: null,
    attenderId: null,
    fiscalYearId: null,
    branchId: null,
    dayInWeek: null,
    hasPatient: null,
    fromAppointmentDate: null,
    toAppointmentDate: null,
    departmentId: null,
    fromTime: null
}


function showAssignList(result) {


    let str = `<div class=" d-flex justify-content-start">
                     <h4 class="font-16 my-2"><span class="text-gray">داکتر: </span><span>${viewData_form_title}</span></h4>
            </div>  `;
    $(".modal-content #content").html(str);
   
    if (result.data.length > 0) {

        var msg = alertify.error("داکتر  دارای نوبت است مجاز به تغییر نمی باشید");
        msg.delay(alertify_delay);
        modal_show(`attenderTimesheetLineAssignModals`);
    }


    else if (result.data.length == 0 && rowNo > 0)
        modal_show(`attenderTimesheetLineAssignModals`);


    else {
        pagetable_formkeyvalue = lastFormKeyValue;
        lastFormKeyValue = "";

        if (rowNo == 0) {
            modelAssing = {
                Opr: "Del",
                AttenderId: attenderId,
                BranchId: +$("#branchId").val()
            }

            ins_del_assign(viewData_assign_api_url, "Del", modelAssing, delete_assign_validate);

            pagetable_formkeyvalue = lastFormKeyValue = [
                attenderId,
                +$("#branchId").val(),
                +$("#fiscalYearId").val()
            ];
        }
    }
};

$("#attenderTimesheetLineAssignModals").on("hidden.bs.modal", function () {

    //if (attenderTimesheetCurrent.medicalTimeShiftIds > 0) {
    //    if (isEdit || isDelete || rowNo > 0) {
    //        //setValueMedivalTimeShift
    //        if ($("#userType").prop("checked"))
    //            pagetable_formkeyvalue = ["myadm", 0];
    //        else
    //            pagetable_formkeyvalue = ["alladm", 0];
    //    }
    //    else {
    //        pagetable_formkeyvalue = lastFormKeyValue;
    //        lastFormKeyValue = "";
    //    }
    //}
    //else
    if (attenderTimesheetCurrent.departmentTimeShiftIds > 0 && attenderTimesheetCurrent.attenderId == null) {

        if (rowNo > 0) {
            if ($("#userType").prop("checked"))
                pagetable_formkeyvalue = ["myadm", 0];
            else
                pagetable_formkeyvalue = ["alladm", 0];
        }
        else {
            pagetable_formkeyvalue = lastFormKeyValue;
            lastFormKeyValue = "";
        }

        let pg_name = "departmentTimeShiftLineDays_pagetable";
        var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
        var pagetable_id = arr_pagetables[index].pagetable_id;
        var currentrow = arr_pagetables[index].currentrow;
        getrecordAjax(pagetable_id, currentrow, currentDepartmentTimeShiftLineId);
        after_save_row(pagetable_id, "cancel", currentKeyCode, false);

        if (operatonTypeConfig == "updateHeader")
            setValueDepartmentTimeShiftHeader();
    }
    else {
        pagetable_formkeyvalue = lastFormKeyValue = [
            attenderId,
            +$("#branchId").val(),
            +$("#fiscalYearId").val()
        ];
    }


    attenderTimesheetCurrent = {
        attenderTimeSheetIds: null,
        medicalShiftTimeSheetIds: null,
        standardTimeSheetIds: null,
        departmentTimeShiftIds: null,
        attenderId: null,
        fiscalYearId: null,
        branchId: null,
        dayInWeek: null,
        hasPatient: null,
        fromAppointmentDate: null,
        toAppointmentDate: null,
        departmentId: null,
        fromTime: null
    }


    var filterIndex = arrSearchFilter.findIndex(v => v.pagetable_id == "attenderTimesheetLineAssign_pagetable");
    if (filterIndex != -1) {
        arrSearchFilter[filterIndex].filters = []
        arrSearchFilterSelect2ajax[filterIndex].filters = []
    }

})

async function updateAttenderScheduleBlockList_display() {

    if (isfromTime) {
        let { currentDate, currentTime, currentDateTime } = await getCurrentDateTime();
        attenderTimesheetCurrent.fromTime = currentTime;
        isFilter = true;
    }
    else
        attenderTimesheetCurrent.fromTime = null;

    displayAssignAttenderTimesheetLine(rowNo);
}


function parameterAttenderTimesheet() {


    let csv_attenderTimesheetLineModel = [];
    csv_attenderTimesheetLineModel[0] = attenderTimesheetCurrent.attenderTimeSheetIds;
    csv_attenderTimesheetLineModel[1] = attenderTimesheetCurrent.medicalShiftTimeSheetIds;
    csv_attenderTimesheetLineModel[2] = attenderTimesheetCurrent.standardTimeSheetIds;
    csv_attenderTimesheetLineModel[3] = attenderTimesheetCurrent.departmentTimeShiftIds;
    csv_attenderTimesheetLineModel[4] = attenderTimesheetCurrent.attenderId;
    csv_attenderTimesheetLineModel[5] = attenderTimesheetCurrent.fiscalYearId;
    csv_attenderTimesheetLineModel[6] = attenderTimesheetCurrent.branchId;
    csv_attenderTimesheetLineModel[7] = attenderTimesheetCurrent.dayInWeek;
    csv_attenderTimesheetLineModel[8] = attenderTimesheetCurrent.hasPatient;
    csv_attenderTimesheetLineModel[9] = attenderTimesheetCurrent.fromAppointmentDate;
    csv_attenderTimesheetLineModel[10] = attenderTimesheetCurrent.toAppointmentDate,
        csv_attenderTimesheetLineModel[11] = attenderTimesheetCurrent.departmentId,
        csv_attenderTimesheetLineModel[12] = attenderTimesheetCurrent.fromTime;
    csv_attenderTimesheetLineModel[13] = formType;

    let index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id);
    let parameters = {
        pageNo: 0,
        pageRowsCount: 0,
        fieldItem: "",
        fieldValue: "",
        form_KeyValue: csv_attenderTimesheetLineModel,
        filters: arrSearchFilter[index].filters,
        sortModel: null
    }
    return parameters;
}

function export_csvdisplay() {

    let title = `${viewData_form_title}`;
    let csvModel = null;
    csvModel = parameterAttenderTimesheet();

    csvModel.pageNo = null;
    csvModel.pageRowsCount = null;

    let urlCSV = `/api/AdmissionsApi/csvscheduleblock`;
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
        error: function (error) {
            console.log(error);
        }
    });



}