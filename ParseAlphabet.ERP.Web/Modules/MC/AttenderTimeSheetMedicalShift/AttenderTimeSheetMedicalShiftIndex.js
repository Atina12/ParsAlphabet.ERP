
function displayAssignAttenderTimesheetLine(rowno) {

    var medicalTimeShiftAssignPagetable = {
        pagetable_id: "attenderTimesheetLineAssign_pagetable",
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
        getpagetable_url: `/api/AdmissionsApi/dispalyscheduleblock`,
    };



    let curentIndex = arr_pagetables.findIndex((item) => item.pagetable_id == "attenderTimesheetLineAssign_pagetable")

    if (curentIndex == -1)
        arr_pagetables.push(medicalTimeShiftAssignPagetable);
    else
        arr_pagetables[curentIndex] = medicalTimeShiftAssignPagetable

    rowNo = rowno;



    pagetable_formkeyvalue = [
    attenderTimesheetCurrent.attenderTimeSheetIds,
    attenderTimesheetCurrent.medicalShiftTimeSheetIds,
    attenderTimesheetCurrent.standardTimeSheetIds,
    attenderTimesheetCurrent.departmentTimeShiftIds,
    attenderTimesheetCurrent.attenderId,
    attenderTimesheetCurrent.fiscalYearId,
    attenderTimesheetCurrent.branchId,
    attenderTimesheetCurrent.dayInWeek,
    attenderTimesheetCurrent.hasPatient,
    attenderTimesheetCurrent.fromAppointmentDate,
    attenderTimesheetCurrent.toAppointmentDate,
    attenderTimesheetCurrent.departmentId,
    attenderTimesheetCurrent.fromTime,
    formType,
    ];


    isfromTime = attenderTimesheetCurrent.fromTime != null ? true : false;

    lastFormKeyValue = pagetable_formkeyvalue;


    get_NewPageTableV1("attenderTimesheetLineAssign_pagetable", false, showAssignList);

}