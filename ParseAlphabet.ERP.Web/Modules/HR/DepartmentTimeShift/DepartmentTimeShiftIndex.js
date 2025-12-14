
var viewData_form_title = "شیفت کاری",
    viewData_controllername = "DepartmentTimeShiftApi",
    viewData_getrecord_url = `${viewData_baseUrl_HR}/${viewData_controllername}/getrecordbyid`,
    viewData_getpagetable_url = `${viewData_baseUrl_HR}/${viewData_controllername}/getpage`,
    viewData_insrecord_url = `${viewData_baseUrl_HR}/${viewData_controllername}/insert`,
    viewData_updrecord_url = `${viewData_baseUrl_HR}/${viewData_controllername}/update`,
    viewData_deleterecord_url = `${viewData_baseUrl_HR}/${viewData_controllername}/delete`,
    viewData_csv_url = `${viewData_baseUrl_HR}/${viewData_controllername}/csv`,
    viewData_print_file_url = `${stimulsBaseUrl.HR.Prn}DepartmentTimeShift.mrt`,
    viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 },
    viewData_print_tableName = "",
    headerDepartmentTimeShiftId = 0,
    isEdit = false,
    formType = "departmentTimeShift",
    timesArr = [],
    rowEditId = 0,
    isvalidatebeforesaveline = true,
    isAfterEdit = true,
    onEnterKeyDown = false,
    toAfterAddList = [],
    operatonTypeConfig = "",
    currentStatdepartmentTimeShiftLine = "",
    currentEnddepartmentTimeShiftLine = "",
    currentDayInWeek = 0,
    currentDepartmentTimeShiftLineId = 0,
    currentKeyCode = "",
    departmentTimeShiftTextModal = "",
    departmentNameTextModal = "",
    shiftNameTextModal = "",
    //currentShiftIsActive = false,
    currentShiftName = "",
    currentShiftDescription = "", medicalShiftId = 0,
    currentDate = "", currentTime = "", currentDateTime = "", deleteModel = {};

var pgt_departmentTimeShiftLineDays = {
    pagetable_id: "departmentTimeShiftLineDays_pagetable",
    editable: true,
    endData: true,
    currentpage: 1,
    currentrow: 1,
    currentcol: 0,
    highlightrowid: 0,
    trediting: false,
    pagetablefilter: false,
    getpagetable_url: `${viewData_baseUrl_HR}/DepartmentTimeShiftApi/linegetpage`,
}

arr_pagetables.push(pgt_departmentTimeShiftLineDays);

function initDepartmentTimeShift() {

    $(".timeMask").inputmask();
    $(".select2").select2()

    fill_select2(`${viewData_baseUrl_GN}/FiscalYearApi/getdropdown/0`, "fiscalYearId", true);
    fill_select2(`${viewData_baseUrl_GN}/BranchApi/getactivedropdown`, "branchId", true);
    fill_select2(`${viewData_baseUrl_HR}/OrganizationalDepartmentApi/getdropdown/1`, "departmentId", true);

    $(".button-items").prepend(`<button type="button" onclick="departmentTimeSheetTransform()" class="btn blue_1 waves-effect"><i class="fa fa-file-import"></i>انتقال شیفت کاری</button>`);


    $("#stimul_preview")[0].onclick = null;
    get_NewPageTableV1();
}

function modal_save(modal_name = null) {

    if (modal_name == null)
        modal_name = modal_default_name;

    if (modal_open_state == "Add")
        modal_record_insert(modal_name, "pagetable");
    else
        if (modal_open_state == "Edit") {
            updateTimeshift();
        }
}

function modal_record_insert() {

    var form = $(`#AddEditModal div.modal-body`).parsley();

    var validate = form.validate();

    validateSelect2(form);

    if (!validate)
        return;



    var newModel = {
        id: 0,
        fiscalYearId: +$("#fiscalYearId").val(),
        branchId: +$("#branchId").val(),
        departmentId: +$("#departmentId").val(),
        shiftName: $("#shiftName").val(),
        description: $("#description").val()
    }

    recordInsertUpdate(viewData_insrecord_url, newModel, "AddEditModal", msg_row_created, undefined, get_NewPageTableV1);

}

function modal_record_update() {

    var form = $(`#AddEditModal div.modal-body`).parsley();

    var validate = form.validate();
    validateSelect2(form);
    if (!validate)
        return;

    //if (currentShiftIsActive) {
    //    headerDepartmentTimeShiftId = +$("#modal_keyid_value").text();
    //    currentDayInWeek = null;
    //    operatonTypeConfig = "updateHeader";
    //    checkAssignAttenderTimesheetLine();
    //}

    //else
    updateHeader();



}

function updateTimeshift() {
    var form = $(`#AddEditModal div.modal-body`).parsley();

    var validate = form.validate();
    validateSelect2(form);
    if (!validate)
        return;


    var newModel = {
        id: +$("#modal_keyid_value").text(),
        fiscalYearId: +$("#fiscalYearId").val(),
        branchId: +$("#branchId").val(),
        departmentId: +$("#departmentId").val(),
        shiftName: $("#shiftName").val(),
        description: $("#description").val(),
        medicalShiftId: medicalShiftId
    }

    loadingAsync(true, "modal-save", "fa fa-save");

    $.ajax({
        url: viewData_updrecord_url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(newModel),
        cache: false,
        success: function (result) {

            if (result.successfull == true) {

                alertify.success(result.statusMessage);
                modal_close("AddEditModal");
                get_NewPageTableV1();
            }
            else {
                if (checkResponse(result.validationErrors) && result.validationErrors.length > 0) {
                    modal_close("AddEditModal");
                    showErrorUpdateShiftNameList(result.validationErrors);
                }
                else {
                    alertify.error(result.statusMessage).delay(alertify_delay);

                }
            }
            loadingAsync(false, "modal-save", "fa fa-save");

        },
        error: function (xhr) {
            loadingAsync(false, "modal-save", "fa fa-save");

            error_handler(xhr, url)
        }


    });
}

function checkTimes(times) {

    if (times.length == 0)
        return false;

    let count = 0
    for (let i = 0; i < times.length; i++) {

        if (times[i].startTime == "" && times[i].endTime == "")
            count++
    }

    if (count == 7)
        return false
    else
        return true
}

function parameter() {

    let parameters = {
        pageNo: 0,
        pageRowsCount: 0,
        fieldItem: "",
        fieldValue: "",
        form_KeyValue: [],
        filters: [],
        sortModel: null
    }
    return parameters;
}

async function loadingAsync(loading, elementId, iconClass) {

    if (loading) {
        $(`#${elementId} i`).removeClass(iconClass).addClass(`fa fa-spinner fa-spin`);
        $(`#${elementId}`).prop("disabled", true)

    }
    else {
        $(`#${elementId} i`).removeClass("fa fa-spinner fa-spin").addClass(iconClass);
        $(`#${elementId}`).prop("disabled", false)

    }
}

function export_csv() {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    let index = arr_pagetables.findIndex(v => v.pagetable_id == "pagetable");
    let csvModel = parameter();


    csvModel.filters = arrSearchFilter[index].filters
    csvModel.pageNo = null;
    csvModel.pageRowsCount = null;
    title = "شیفت کاری"

    var urlCSV = viewData_csv_url;
    loadingAsync(true, "exportCSV", "fa fa-file-excel");
    $.ajax({
        url: urlCSV,
        type: "get",
        datatype: "text",
        contentType: "text/csv",
        xhrFields: {
            responseType: 'blob'
        },
        data: { stringedModel: JSON.stringify(csvModel) },
        success: function (result) {
            if (result) {

                let element = document.createElement('a')
                element.setAttribute('href', window.URL.createObjectURL(result));
                element.setAttribute('download', `${viewData_form_title}.csv`);
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
                window.URL.revokeObjectURL(urlCSV);
            }
            loadingAsync(false, "exportCSV", "fa fa-file-excel");
        },
        error: function (xhr) {
            error_handler(xhr)
            loadingAsync(false, "exportCSV", "fa fa-file-excel");
        }
    });
}


function run_button_delete(p_keyvalue) {

    headerDepartmentTimeShiftId = p_keyvalue;
    currentDayInWeek = null;
    operatonTypeConfig = "deleteHeader";
    var check = controller_check_authorize(viewData_controllername, "DEL");
    if (!check)
        return;

    checkAssignAttenderTimesheetLine();

}

function deleteDepartmentTimeShift(id) {

    alertify.confirm('', msg_delete_row,

        function () {
            $.ajax({
                url: viewData_deleterecord_url,
                type: "post",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(id),
                async: false,
                cache: false,
                success: function (result) {

                    if (result.successfull == true) {
                        get_NewPageTableV1();
                        alertify.success(result.statusMessage).delay(alertify_delay);
                    }
                    else {
                        alertify.error(result.statusMessage).delay(alertify_delay);
                    }
                },
                error: function (xhr) {

                    error_handler(xhr, viewData_deleterecord_url)
                }
            });
        },

        function () { var msg = alertify.error('انصراف از حذف'); msg.delay(alertify_delay); }
    ).set('labels', { ok: 'بله', cancel: 'خیر' });
}

function run_button_edit(p_keyvalue, rowno, elem, ev) {

    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;

    var modal_name = null

    $("#rowKeyId").removeClass("d-none");
    if (modal_name == null)
        modal_name = modal_default_name;

    $(".modal").find("#modal_title").text("ویرایش " + viewData_form_title);

    $("#modal_keyid_value").text(p_keyvalue);
    $("#modal_keyid_caption").text("شناسه : ");


    departmentTimeShiftTextModal = p_keyvalue;
    departmentNameTextModal = $(`#pagetable #parentPageTableBody tbody tr[data-id=${p_keyvalue}]`).data("department");
    shiftNameTextModal = $(`#pagetable #parentPageTableBody tbody tr[data-id=${p_keyvalue}]`).data("shiftname");

    $.ajax({
        url: viewData_getrecord_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(p_keyvalue),
        async: false,
        cache: false,
        success: function (result) {
            modal_open_state = 'Edit';
            modal_fill_items(result, modal_name);
            modal_show(modal_name);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getrecord_url)
        }
    });
}

function modal_fill_items(item, modal_name = null) {

    if (!item) return;
    if (modal_name == null)
        modal_name = modal_default_name;

    var currentShift = item[0];

    $("#fiscalYearId").val(currentShift.fiscalYearId).trigger("change");
    $("#branchId").val(currentShift.branchId).trigger("change");
    $("#departmentId").val(currentShift.departmentId).trigger("change");
    $("#shiftName").val(currentShift.shiftName);
    $("#description").val(currentShift.description);
    $("#dayOfWeeks input").val("");
    currentShiftDescription = currentShift.description;
    currentShiftName = currentShift.shiftName;
    medicalShiftId = currentShift.medicalShiftId;
}

function run_button_addDayInWeek(departmentTimeShiftId, row, elm, event, type) {

    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    let pagetable_id = "departmentTimeShiftLineDays_pagetable";
    var index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id);
    headerDepartmentTimeShiftId = departmentTimeShiftId;
    pagetable_formkeyvalue = [headerDepartmentTimeShiftId];

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


    $(".departmentTimeShiftIdModal").text(departmentTimeShiftId);
    $(".departmentNameModal").text($(`#pagetable #parentPageTableBody tbody tr[data-id=${headerDepartmentTimeShiftId}]`).data("department"));
    $(".shiftNameModal").text($(`#pagetable #parentPageTableBody tbody tr[data-id=${headerDepartmentTimeShiftId}]`).data("shiftname"));


    var filterIndex = arrSearchFilter.findIndex(v => v.pagetable_id == pagetable_id);
    if (filterIndex != -1) {
        arrSearchFilter[filterIndex].filters = []
        arrSearchFilterSelect2ajax[filterIndex].filters = []
    }

    get_NewPageTableV1(pagetable_id, false, () => {
        $("#departmentTimeShiftLineDaysModal input").inputmask();
        departmentTimeShiftTextModal = departmentTimeShiftId;
        departmentNameTextModal = $(".departmentNameModal").text();
        shiftNameTextModal = $(".shiftNameModal").text();
        modal_show("departmentTimeShiftLineDaysModal");
    })

}

function validateDepartmentTime(idValue, start, end) {

    var validate = true;

    if (start != "" && end != "") {

        var compareTime = compareTimeElm(start, end);

        var timeDiff = diffMinutes(start, end);
        var isValidStart = isValidTime(start);
        var isValidEnd = isValidTime(end);

        var validationError = "";

        if (!isValidStart || !isValidEnd)
            validationError += "فرمت زمان صحیح نیست." + "<br/>";

        if (!compareTime)
            validationError += "زمان شروع باید کوچکتر مساوی زمان پایان باشد." + "<br/>";

        if (!timeDiff)
            validationError += "فاصله ی زمانی نمیتواند کمتر از 15 دقیقه باشد";

        if (validationError != "" && +idValue > 0) {

            alertify.warning(validationError);
        }
        else if (validationError != "" && +idValue == 0) {
            alertify.warning(validationError);
        }


        validate = validationError == "";
    }

    return validate;
}

function tr_save_row(pg_name, keycode) {


    currentKeyCode = keycode;
    let index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
    let pagetable_id = arr_pagetables[index].pagetable_id;
    let pagetable_currentrow = arr_pagetables[index].currentrow;
    let id = +$(`#departmentTimeShiftLineDays_pagetable .pagetablebody > tbody > #row${pagetable_currentrow} #col_${pagetable_currentrow}_1`).text();
    let dayInWeek = +$(`#departmentTimeShiftLineDays_pagetable .pagetablebody > tbody > #row${pagetable_currentrow}`).data("dayinweek");

    let startTime = $(`#departmentTimeShiftLineDays_pagetable .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_3 > input`).val();
    let endTime = $(`#departmentTimeShiftLineDays_pagetable .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_4 > input`).val();

    rowNo = pagetable_currentrow;

    currentStatdepartmentTimeShiftLine = startTime;
    currentEnddepartmentTimeShiftLine = endTime;
    currentDayInWeek = dayInWeek;
    currentDepartmentTimeShiftLineId = id;

    let departmentTimeShiftLineModel = {
        id: currentDepartmentTimeShiftLineId,
        headerId: headerDepartmentTimeShiftId,
        dayInWeek: currentDayInWeek,
        startTime: currentStatdepartmentTimeShiftLine,
        endTime: currentEnddepartmentTimeShiftLine,
    }

    // insert / update
    if ((id == 0 && startTime != "" && endTime != "") || (id !== 0 && startTime != "" && endTime != "")) {

        var resultValidation = validateDepartmentTime(id, startTime, endTime);

        if (!resultValidation)
            return;

        if (id > 0) {
            operatonTypeConfig = "update";
            checkAssignAttenderTimesheetLine();
        }
        else {

            operatonTypeConfig = "insert";
            insertItemTime(departmentTimeShiftLineModel, currentKeyCode);
        }



    }
    //delete
    else if (id !== 0 && startTime == "" && endTime == "") {
        operatonTypeConfig = "delete";
        checkAssignAttenderTimesheetLine();
    }
    //reset input
    else {
        if (id == 0) {
            $(`#departmentTimeShiftLineDays_pagetable .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_1`).text("");
            $(`#departmentTimeShiftLineDays_pagetable .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_3 > input`).val("");
            $(`#departmentTimeShiftLineDays_pagetable .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_4 > input`).val("");
        }
        else
            getrecordAjax(pagetable_id, pagetable_currentrow, id);

        after_save_row(pagetable_id, "cancel", keycode, false);
    }

}


function tr_onclick(pg_name, elm, event) {

    after_save_row(pg_name, "cancel", currentKeyCode, false);

    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
    if (index == -1) return;

    var pagetable_currentrow = arr_pagetables[index].currentrow;
    var tr_clicked_rowno = +$(elm).attr("id").replace(/row/g, "");

    if (tr_clicked_rowno == pagetable_currentrow)
        return;

    pagetable_currentrow = +$(elm).attr("id").replace(/row/g, "");
    arr_pagetables[index].currentrow = pagetable_currentrow;
    tr_Highlight(pg_name);
    arr_pagetables[index].currentcol = getFirstColIndexHasInput(pg_name);



}

function getrecord(pg_name) {
    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_pagetables[index].pagetable_id;
    var currentrow = arr_pagetables[index].currentrow;
    let id = +$(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow}`).data("id");
    let startTime = $(`#departmentTimeShiftLineDays_pagetable .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_3 > input`).val();
    let endTime = $(`#departmentTimeShiftLineDays_pagetable .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_4 > input`).val();
    if (id == 0)
        setDefaultRowOnModal(pagetable_id, currentrow)
    else
        getrecordAjax(pagetable_id, currentrow, id)
}

function setDefaultRowOnModal(pagetable_id, currentrow) {

    $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_0`).html("");
    $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_1`).text("");
    $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_3 > input`).val("");
    $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_4 > input`).val("");

}

function getrecordAjax(pagetable_id, currentrow, id) {

    let url = `${viewData_baseUrl_HR}/${viewData_controllername}/getrecordline`;

    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        async: false,
        cache: false,
        success: function (result) {
            getrecord_setValue(result, pagetable_id, currentrow)
        },
        error: function (xhr) {
            error_handler(xhr, url)
        }
    });

}

function getrecord_setValue(result, pagetable_id, currentrow) {

    if (result.data != null) {
        $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_1`).text(result.data.id);
        $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_3 > input`).val(result.data.startTime);
        $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_4 > input`).val(result.data.endTime);

        if (result.data.isLock)
            $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_5 i`).addClass("fas fa-check");
        else
            $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_5 i`).removeClass("fas fa-check")

    }
    else
        setDefaultRowOnModal(pagetable_id, currentrow)

}

async function checkAssignAttenderTimesheetLine() {

    var departmentTimeShiftAssignPagetable = {
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
        arr_pagetables.push(departmentTimeShiftAssignPagetable);
    else
        arr_pagetables[curentIndex] = departmentTimeShiftAssignPagetable


    lastFormKeyValue = pagetable_formkeyvalue;

    var filterIndex = arrSearchFilter.findIndex(v => v.pagetable_id == departmentTimeShiftAssignPagetable.pagetable_id);
    if (filterIndex != -1) {
        arrSearchFilter[filterIndex].filters = []
        arrSearchFilterSelect2ajax[filterIndex].filters = []
    }

    currentDate, currentTime, currentDateTime = await getCurrentDateTime();


    attenderTimesheetCurrent = {
        attenderTimeSheetIds: null,
        medicalShiftTimeSheetIds: null,
        standardTimeSheetIds: null,
        departmentTimeShiftIds: headerDepartmentTimeShiftId,
        attenderId: null,
        fiscalYearId: null,
        branchId: null,
        dayInWeek: currentDayInWeek,
        hasPatient: 1,
        fromAppointmentDate: currentDateTime.currentDate,
        toAppointmentDate: null,
        departmentId: null,
        fromTime: currentDateTime.currentTime
    }
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


    let currentDat = moment().format('jYYYY/jMM/jDD');
    let currentYr = +currentDat.split("/")[0];
    let lastMnth = "12";

    let lastDy = getMonthDaysCount(currentYr, lastMnth)
    let toAppointmntDate = currentYr + "/" + lastMnth + "/" + lastDy;

    deleteModel = {
        id: currentDepartmentTimeShiftLineId,
        departmentShiftId: attenderTimesheetCurrent.departmentTimeShiftIds,
        fromAppointmentDate: attenderTimesheetCurrent.fromAppointmentDate,
        toAppointmentDate: convertToMiladiDate(toAppointmntDate),
        fromTime: attenderTimesheetCurrent.fromTime,
        dayInWeek: attenderTimesheetCurrent.dayInWeek,
        formType: formType
    }
    get_NewPageTableV1("attenderTimesheetLineAssign_pagetable", false, showAssignList);

}

function showAssignList(result) {

    if (result.data.length > 0) {

        let str = `<div class=" d-flex justify-content-start">
                     <p class="d-inline-block pl-2 m-1 border-left font-12">شناسه: <span>${headerDepartmentTimeShiftId}</span></h4>  
                     <p class="d-inline-block pl-2 m-1 border-left font-12"> دپارتمان : <span>${departmentNameTextModal}</span></p>
                     <p class="d-inline-block pl-2 m-1 border-left font-12"> شیفت : <span>${shiftNameTextModal}</span></p>
                   </div>  `;

        var msg = alertify.error("داکتر  دارای نوبت است مجاز به تغییر نمی باشید");
        msg.delay(alertify_delay);

        $(".modal-content #content").html(str);
        modal_show(`attenderTimesheetLineAssignModals`);
    }

    else {

        pagetable_formkeyvalue = lastFormKeyValue;

        lastFormKeyValue = "";

        if (operatonTypeConfig == "updateHeader")
            updateHeader();

        else if (operatonTypeConfig == "deleteHeader")
            deleteDepartmentTimeShift(headerDepartmentTimeShiftId);

        else if (operatonTypeConfig == "update") {

            let departmentTimeShiftLineModel = {
                id: currentDepartmentTimeShiftLineId,
                headerId: headerDepartmentTimeShiftId,
                dayInWeek: currentDayInWeek,
                startTime: currentStatdepartmentTimeShiftLine,
                endTime: currentEnddepartmentTimeShiftLine,
            }
            insertItemTime(departmentTimeShiftLineModel, currentKeyCode);
        }
        else {

            deleteItemTime(deleteModel, currentKeyCode);

        }

    }

};

function updateHeader() {

    var newModel = {
        id: +$("#modal_keyid_value").text(),
        fiscalYearId: +$("#fiscalYearId").val(),
        branchId: +$("#branchId").val(),
        departmentId: +$("#departmentId").val(),
        shiftName: $("#shiftName").val(),
        description: $("#description").val()
    }

    recordInsertUpdate(viewData_updrecord_url, newModel, "AddEditModal", msg_row_created, undefined, get_NewPageTableV1);
}



function setValueDepartmentTimeShiftHeader() {
    $("#shiftName").focus();
    $("#shiftName").val(currentShiftName);
    $("#description").val(currentShiftDescription);
}

function deleteItemTime(model, keycode) {

    let pg_name = "departmentTimeShiftLineDays_pagetable";
    let index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
    let pagetable_id = arr_pagetables[index].pagetable_id;
    let pagetable_currentrow = arr_pagetables[index].currentrow;

    let url = `${viewData_baseUrl_HR}/${viewData_controllername}/deleteLine`;

    $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        async: false,
        cache: false,
        success: async function (result) {

            if (result.successfull) {

                $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow}`).data("id", +result.id)
                $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_5 i`).removeClass("fas fa-check");
                var msg = alertify.success(result.statusMessage)
                msg.delay(alertify_delay)

                setDefaultRowOnModal(pagetable_id, pagetable_currentrow)
                after_save_row(pagetable_id, "success", keycode, false);
            }
            else {


                showErrorDeleteItemTimeList(result.data);

                var msg = alertify.warning(result.validationErrors[0]);
                msg.delay(alertify_delay);

                await getrecord(pagetable_id);

                after_save_row(pagetable_id, "cancel", keycode, false);
            }
        },
        error: function (xhr) {
            error_handler(xhr, url);
            after_save_row(pagetable_id, "cancel", keycode, false);
        }
    });

}

function showErrorDeleteItemTimeList(errorList) {
    let output = "";

    for (var i = 0; i < errorList.length; i++) {
        output += `<tr id="row_${(i + 1)}">
                       <td style="width:15%;">${errorList[i].admissionId}</td>
                       <td style="width:15%;">${errorList[i].patientId + " - " + errorList[i].patientFullName}</td>
                       <td style="width:15%;">${+errorList[i].patientNationalCode > 0 ? +errorList[i].patientNationalCode : " "}</td>
                       <td style="width:15%;">${errorList[i].reserveDateTimePersian}</td>
                   </tr>`;
    }

    $(`#tempErrorDeleteItemTimeList`).html(output);
    $("#tempErrorDeleteItemTimeList > tr#row_1").addClass("highlight");
    modal_show("errorDeleteItemTimeList");
}

function showErrorUpdateShiftNameList(errorList) {
    let output = "";

    for (var i = 0; i < errorList.length; i++) {
        output += `<tr><td >${errorList[i]}</td></tr>`;
    }

    $(`#tempErrorUpdateShiftNameList`).html(output);
    modal_show("errorUpdateShiftNameList");
}

function insertItemTime(model, keycode) {

    let pg_name = "departmentTimeShiftLineDays_pagetable";
    let index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
    let pagetable_id = arr_pagetables[index].pagetable_id;
    let pagetable_currentrow = arr_pagetables[index].currentrow;


    let url = `${viewData_baseUrl_HR}/${viewData_controllername}/insertLine`;

    $.ajax(
        {
            url: url,
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(model),
            async: false,
            cache: false,
            success: function (result) {

                if (result.successfull) {

                    $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow}`).data("id", +result.id)
                    $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} #col_${pagetable_currentrow}_1`).text(+result.id);

                    if (model.id == 0)
                        $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_5 i`).addClass("fas fa-check");

                    var msg = alertify.success(result.statusMessage);
                    msg.delay(alertify_delay);

                    after_save_row(pagetable_id, "success", keycode, false);
                }
                else {
                    var msg = alertify.error(result.statusMessage);
                    msg.delay(alertify_delay);

                    after_save_row(pagetable_id, "cancel", keycode, false);
                }
            },
            error: function (xhr) {
                error_handler(xhr, url);
                after_save_row(pagetable_id, "cancel", keycode, false);
            }
        });

}

function clearTime() {

    for (let i = 0; i < 8; i++) {
        $(`#lineId_${i}`).val("");
        $(`#dayOfWeekId_${i}`).val("");
        $(`#startTime_${i}`).val("");
        $(`#endTime_${i}`).val("");
    }
}

function updateAttenderScheduleBlockList_display() {
    checkAssignAttenderTimesheetLine();
}


function parameterDepartmentTimesheet() {


    let csv_departmentTimesheetLineModel = [];
    csv_departmentTimesheetLineModel[0] = null;
    csv_departmentTimesheetLineModel[1] = null;
    csv_departmentTimesheetLineModel[2] = null;
    csv_departmentTimesheetLineModel[3] = null;
    csv_departmentTimesheetLineModel[4] = headerDepartmentTimeShiftId;
    csv_departmentTimesheetLineModel[5] = null;
    csv_departmentTimesheetLineModel[6] = null;
    csv_departmentTimesheetLineModel[7] = null;
    csv_departmentTimesheetLineModel[8] = currentDayInWeek;
    csv_departmentTimesheetLineModel[9] = 1;
    csv_departmentTimesheetLineModel[10] = null;
    csv_departmentTimesheetLineModel[11] = null;
    csv_departmentTimesheetLineModel[12] = null;
    csv_departmentTimesheetLineModel[13] = null;
    csv_departmentTimesheetLineModel[14] = formType;



    let index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id);
    let parameters = {
        pageNo: 0,
        pageRowsCount: 0,
        fieldItem: "",
        fieldValue: "",
        form_KeyValue: csv_departmentTimesheetLineModel,
        filters: arrSearchFilter[index].filters,
        sortModel: null
    }
    return parameters;
}
function export_csvdisplay() {

    let title = `لیست نوبتهای :${headerDepartmentTimeShiftId}-${shiftNameTextModal}`;

    let csvModel = null;
    csvModel = parameterDepartmentTimesheet();

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
        error: function (xhr) {
            error_handler(xhr)
        }
    });

}

$('#departmentTimeShiftLineDaysModals').on("shown.bs.modal", function () {

    $("#dayOfWeeks tr").removeClass("highlight");
    $("#trTime_1").focus().addClass("highlight");
});

$("#AddEditModal").on({
    "hidden.bs.modal": function () {

        $("#daysInWeek input").prop("required", false);

        $("#fiscalYearId").prop("disabled", false);
        $("#branchId").prop("disabled", false);
        $("#departmentId").prop("disabled", false);
        $("#note").val("");

    },
    "shown.bs.modal": function () {

        if (modal_open_state == "Add") {
            $("#fiscalYearId").prop("disabled", false);
            $("#branchId").prop("disabled", false);
            $("#departmentId").prop("disabled", false);
            $("#note").val("");
        }
        else {

            $("#fiscalYearId").prop("disabled", true);
            $("#branchId").prop("disabled", true);
            $("#departmentId").prop("disabled", true);
            $("#shiftName").focus();

        }

    }
});




$("#stimul_preview").click(function () {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    var reportParameters = [
        { Item: "PageNo", Value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "PageRowsCount", value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "BranchId", value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "ShiftName", value: null, SqlDbType: dbtype.NVarChar, Size: 0 },
        { Item: "FromCreateDate", value: null, SqlDbType: dbtype.Date, Size: 0 },
        { Item: "ToCreateDate", value: null, SqlDbType: dbtype.Date, Size: 0 },
        { Item: "CreateUserId", value: null, SqlDbType: dbtype.Int, Size: 0 },
    ]

    stimul_report(reportParameters);
});

$("#branchId").on("change", function () {
    var branchId = +$(this).val()

    if (branchId === 0) {
        $("#departmentId").empty();
        return;
    }


    fill_select2(`${viewData_baseUrl_HR}/OrganizationalDepartmentApi/getdropdown/1`, "departmentId", true);
});

function departmentTimeSheetTransform() {
    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;

    $("#fromFiscalYearId").html("<option value=\"0\">انتخاب کنید</option>");
    fill_select2(`${viewData_baseUrl_HR}/DepartmentTimeShiftApi/departmenttimeshiftgetproperties`, "fromFiscalYearId", true, "0/0/null/1/0");

    $("departmentShiftDays input").val("");

    $("#fromFiscalYearId").prop("disabled", false);
    $("#fromBranchId").prop("disabled", false);
    $("#fromDepartmentId").prop("disabled", false);
    $("#fromShiftId").prop("disabled", false);

    resetDepartmentTimeSheetTransform();

    modal_show(`DepartmentTimeShiftTransformModal`);
}

$("#fromFiscalYearId").on("change", function () {

    let fromFiscalYearId = +$(this).val();
    resetDepartmentTimeSheetTransform();

    if (fromFiscalYearId > 0) {

        $("#toFiscalYearId").prop("disabled", false);

        $("#toFiscalYearId").html("<option value=\"0\">انتخاب کنید</option>");
        fill_select2(`${viewData_baseUrl_GN}/FiscalYearApi/getdropdown/0`, "toFiscalYearId", true);

        $("#fromBranchId").html("<option value=\"0\">انتخاب کنید</option>");
        fill_select2(`${viewData_baseUrl_HR}/DepartmentTimeShiftApi/departmenttimeshiftgetproperties`, "fromBranchId", true, `${fromFiscalYearId}/0/null/2/0`);
    }
    else {
        $("#toBranchId").prop("disabled", true);
        $("#toDepartmentId").prop("disabled", true);
        $("#toShiftName").prop("disabled", true);
    }
})

$("#fromBranchId").on("change", function () {

    let fromBranchId = +$(this).val();
    let fromFiscalYearId = +$("#fromFiscalYearId").val();
    $("#fromDepartmentId").empty();
    $("#fromShiftId").empty();
    $("#departmentShiftDays input").val("");
    if (fromBranchId > 0) {

        $("#toBranchId").prop("disabled", false);
        $("#toBranchId").html("<option value=\"0\">انتخاب کنید</option>");
        fill_select2(`${viewData_baseUrl_GN}/BranchApi/getactivedropdown`, "toBranchId", true);

        $("#fromDepartmentId").html("<option value=\"0\">انتخاب کنید</option>");
        fill_select2(`${viewData_baseUrl_HR}/DepartmentTimeShiftApi/departmenttimeshiftgetproperties`, "fromDepartmentId", true, `${fromFiscalYearId}/${fromBranchId}/null/3/0`);
    }
    else {
        $("#toBranchId").val("")
        $("#toDepartmentId").val("")
        $("#toShiftName").val("")


        $("#toBranchId").prop("disabled", true);
        $("#toDepartmentId").prop("disabled", true);
        $("#toShiftName").prop("disabled", true);
    }
})

$("#fromDepartmentId").on("change", function () {

    let fromDepartmentId = +$(this).val();
    let fromFiscalYearId = +$("#fromFiscalYearId").val();
    let fromBranchId = +$("#fromBranchId").val();
    $("#fromShiftId").empty();
    $("#departmentShiftDays input").val("");
    if (fromDepartmentId > 0) {

        $("#toDepartmentId").prop("disabled", false);

        $("#toDepartmentId").html("<option value=\"0\">انتخاب کنید</option>");
        fill_select2(`${viewData_baseUrl_HR}/OrganizationalDepartmentApi/getdropdown`, "toDepartmentId", true);

        $("#fromShiftId").html("<option value=\"0\">انتخاب کنید</option>");
        fill_select2(`${viewData_baseUrl_HR}/DepartmentTimeShiftApi/departmenttimeshiftgetproperties`, "fromShiftId", true, `${fromFiscalYearId}/${fromBranchId}/${fromDepartmentId}/4/0`);
    }
    else {
        $("#toDepartmentId").val("")
        $("#toShiftName").val("")
        $("#toDepartmentId").prop("disabled", true);
        $("#toShiftName").prop("disabled", true);
    }
})

$("#fromShiftId").on("change", function () {

    let fromShiftId = +$(this).val();
    $("#toShiftName").val("");
    if (fromShiftId > 0)
        $("#toShiftName").prop("disabled", false);
    else {

        for (var i = 1; i < 8; i++) {
            $(`#startTime${i}`).val("");
            $(`#endTime${i}`).val("");
        }
        $("#toShiftName").val("")
        $("#toShiftName").prop("disabled", true);
    }

    getDetailDays();

})

$("#toDepartmentId").on("change", function () {

    let toDepartmentId = +$(this).val();

    let fromShiftId = +$("#fromShiftId").val();


    if (toDepartmentId > 0 && fromShiftId > 0) {
        let toDepartmentIdText = $("#toDepartmentId option:selected").text();
        $("#toShiftName").val(toDepartmentIdText.split('-')[1]);
    }
    else {
        $("#toShiftName").val("")

    }
})

function getDetailDays() {
    let url = `${viewData_baseUrl_HR}/${viewData_controllername}/display`;
    let id = +$("#fromShiftId").val();
    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        async: false,
        cache: false,
        success: function (result) {
            $("#departmentShiftDays input").val("");
            for (let i = 0; i < result.length; i++) {

                var currentDay = result[i];
                var dayOfWeek = currentDay.dayInWeek;
                $(`#startTime${dayOfWeek}`).val(currentDay.startTime);
                $(`#endTime${dayOfWeek}`).val(currentDay.endTime);
            }

        },
        error: function (xhr) {
            error_handler(xhr, url)
        }
    });
}

function resetDepartmentTimeSheetTransform() {

    $("#tableLine tbody").empty();
    toAfterAddList = [];



    $("#type").val("0").trigger("change");
    $("#fromBranchId").val("").trigger("change");
    $("#fromDepartmentId").val("").trigger("change");
    $("#fromShiftId").val("").trigger("change");
    $("#departmentShiftDays input").val("");

    $("#toFiscalYearId").val("").trigger("change");
    $("#toBranchId").val("").trigger("change");
    $("#toDepartmentId").val("").trigger("change");
    $("#toShiftName").val("");
}

$("#insertDepartmentTimeShiftTransform").click(function () {

    run_button_insert_DepartmentTimeShiftTransform();
})

function run_button_insert_DepartmentTimeShiftTransform() {

    var form = $(`#DepartmentTimeShiftTransformModal div.modal-body`).parsley();
    var validate = form.validate();
    validateSelect2(form);
    if (!validate) return;

    //validatebeforesaveline();
    //if (!isvalidatebeforesaveline) return;

    if (toAfterAddList.length == 0) {
        var msg = alertify.error('مقصد مشخص نیست مجاز به ثبت نمی باشید');
        msg.delay(alertify_delay);
        $("#toFiscalYearId").select2("focus");
        return;
    }
    toDepartmentTimeshiftList = [];

    for (var i = 0; i < toAfterAddList.length; i++) {
        var toDepartmentTimeshift = {
            fiscalYearId: +toAfterAddList[i].toFiscalYearId > 0 ? toAfterAddList[i].toFiscalYearId : 0,
            branchId: +toAfterAddList[i].toBranchId > 0 ? +toAfterAddList[i].toBranchId : 0,
            departmentId: +toAfterAddList[i].toDepartmentId > 0 ? +toAfterAddList[i].toDepartmentId : 0,
            shiftName: toAfterAddList[i].toShiftNameText
        }
        toDepartmentTimeshiftList.push(toDepartmentTimeshift);
    }

    var model = {
        fromFiscalYearId: +$("#fromFiscalYearId").val() > 0 ? +$("#fromFiscalYearId").val() : null,
        fromBranchId: +$("#fromBranchId").val() > 0 ? +$("#fromBranchId").val() : null,
        fromDepartmentId: +$("#fromDepartmentId").val() > 0 ? +$("#fromDepartmentId").val() : null,
        fromId: +$("#fromShiftId").val() > 0 ? +$("#fromShiftId").val() : null,
        toDepartmentTimeshiftModel: toDepartmentTimeshiftList,
        type: 1,

    }


    $.ajax({
        url: `${viewData_baseUrl_HR}/DepartmentTimeShiftApi/insertduplicate`,
        type: "POST",
        dataType: "JSON",
        contentType: "application/json",
        cache: false,
        async: false,
        data: JSON.stringify(model),
        success: function (result) {

            if (result.successfull == true) {

                alertify.success(result.statusMessage);
                modal_close("DepartmentTimeShiftTransformModal");
                get_NewPageTableV1();
            }
            else if (result.statusMessage != null && result.statusMessage != undefined && result.statusMessage != '') {
                var msg = alertify.error(result.statusMessage);
                msg.delay(alertify_delay);
            }
            else if (result.validationErrors !== undefined) {
                generateErrorValidation(result.validationErrors);
            }
        },
        error: function (xhr) {
            error_handler(xhr, `${viewData_baseUrl_HR}/DepartmentTimeShiftApi/insertduplicate`);
            return "";
        }
    });

}

function checkEqual(model) {

    var exist = toAfterAddList.findIndex(x => x.toFiscalYearId == model.toFiscalYearId && x.toBranchId == model.toBranchId && x.toDepartmentId == model.toDepartmentId);

    return exist !== -1;

}

function getMaxRowId() {
    var maxRow = _.maxBy(toAfterAddList, function (o) {
        return o.rowId;
    });


    return maxRow;
}

function sort_by_id() {
    return function (elem1, elem2) {
        if (elem1.rowId < elem2.rowId) {
            return -1;
        } else if (elem1.rowId > elem2.rowId) {
            return 1;
        } else {
            return 0;
        }
    };
}

function saveDepartmentTimeShiftUpdateRow() {


    validatebeforesaveline();
    if (!isvalidatebeforesaveline) return;

    let toFiscalYearIdText = $("#toFiscalYearId option:selected").text();
    let toFiscalYearId = +$("#toFiscalYearId").val();
    let toBranchIdText = $("#toBranchId option:selected").text();
    let toBranchId = +$("#toBranchId").val();
    let toDepartmentIdText = $("#toDepartmentId option:selected").text();
    let toDepartmentId = +$("#toDepartmentId").val();
    let toShiftNameText = $("#toShiftName").val();

    var maxRow = getMaxRowId();

    var newRowId = maxRow !== undefined ? maxRow.rowId + 1 : 1;

    var rowId = isEdit ? rowEditId : newRowId;

    var model = {
        rowId,
        toFiscalYearId,
        toFiscalYearIdText,
        toBranchId,
        toBranchIdText,
        toDepartmentId,
        toDepartmentIdText,
        toShiftNameText
    }
    if (isEdit) {
        isAfterEdit = false;
        var index = toAfterAddList.findIndex(x => x.rowId === rowEditId);
        $(`#rowItem${rowEditId}`).remove();
        toAfterAddList.splice(index, 1);
        toAfterAddList.sort(sort_by_id());
    }

    var isEqual = checkEqual(model);

    if (isEqual) {

        var msg = alertify.error('اطلاعات انتخابی تکراری است');
        msg.delay(alertify_delay);

        $("#toFiscalYearId").focus();

        return;
    }


    toAfterAddList.push(model);

    var htmlRow = getHtmlRow(model);
    $("#tableLine tbody").append(htmlRow);

    isEdit = false;

    $("#toFiscalYearId").val("").trigger("change");
    $("#toBranchId").val("").trigger("change");
    $("#toDepartmentId").val("").trigger("change");
    $("#toShiftName").val("");
    $("#toFiscalYearId").select2("focus")

    checkHasRow()
}

function getHtmlRow(model) {


    let str = `<tr id='rowItem${model.rowId}' 
                    highlight=${model.rowId} 
                    onclick="newTrOnclick(${model.rowId})" 
                    onkeydown="newTrOnkeydown(this,event,${model.rowId})" >                   

                    <td  style="width:4%;text-align:center" tabindex="-1">${model.rowId}</td>
                    <td style="width:18%">${model.toFiscalYearIdText}</td>
                    <td style="width:18%">${model.toBranchIdText}</td>
                    <td style="width:32%">${model.toDepartmentIdText}</td>
                    <td style="width:20%">${model.toShiftNameText}</td>
                    <td style="width:8% text-align="center">
                        <div style="display:flex;justify-content :center">
                                <button id='rowItemDelete' type="button" style="margin-left: 4px;padding: 4px 8px 2px 8px  !important;font-size:11px !important" id="btn_delete" onclick="deleteLine('DepartmentTimeShiftTransformModal',this,${model.rowId},event)" class="btn maroon_outline" title="حذف"><i class="fa fa-trash"></i></button>
                                <button type="button" style="padding: 4px 6px 2px 6px !important;font-size:11px !important" id="btn_edit" onclick="editLine('DepartmentTimeShiftTransformModal',this,${model.rowId},event)" class="btn green_outline_1" title="ویرایش"><i class="fa fa-edit"></i></button>
                        </div>
                    </td>
               </tr>`;


    return str;

}

function validatebeforesaveline() {

    if (+$("#fromFiscalYearId").val() > 0) {
        let fromFiscalYearId = +$("#fromFiscalYearId").val();
        let toFiscalYearId = +$("#toFiscalYearId").val();
        let fromBranchId = +$("#fromBranchId").val();
        let toBranchId = +$("#toBranchId").val();
        let fromDepartmentId = +$("#fromDepartmentId").val();
        let toDepartmentId = +$("#toDepartmentId").val();
        let fromShiftId = +$("#fromShiftId").val();
        let toShiftName = $("#toShiftName").val();
        if (fromFiscalYearId > 0 && toFiscalYearId == 0) {
            var msg = alertify.error('سال مالی  مقصد را انتخاب نمایید');
            msg.delay(alertify_delay);
            isvalidatebeforesaveline = false;
            $("#toFiscalYearId").select2("focus");
        }
        else if (fromFiscalYearId == toFiscalYearId && fromBranchId == 0) {
            var msg = alertify.error('سال مالی  مبدا و مقصد نمیتواند یکسان باشد');
            msg.delay(alertify_delay);
            isvalidatebeforesaveline = false;
            $("#toFiscalYearId").val("").trigger("change");;
            $("#toFiscalYearId").select2("focus");
        }

        else if (fromBranchId > 0 && toBranchId == 0) {
            var msg = alertify.error('شعبه  مقصد را انتخاب نمایید');
            msg.delay(alertify_delay);
            isvalidatebeforesaveline = false;
            $("#toBranchId").select2("focus");
        }
        else if (fromFiscalYearId == toFiscalYearId && fromBranchId == toBranchId && fromDepartmentId == 0) {
            var msg = alertify.error('سال مالی  , شعبه مبدا و مقصد نمیتواند یکسان باشد');
            msg.delay(alertify_delay);
            isvalidatebeforesaveline = false;
            $("#toFiscalYearId").val("").trigger("change");;
            $("#toBranchId").val("").trigger("change");;
            $("#toFiscalYearId").select2("focus");
        }


        else if (fromDepartmentId > 0 && toDepartmentId == 0) {
            var msg = alertify.error('دپارتمان  مقصد را انتخاب نمایید');
            msg.delay(alertify_delay);
            isvalidatebeforesaveline = false;
            $("#toDepartmentId").select2("focus");
        }
        else if (fromFiscalYearId == toFiscalYearId && fromBranchId == toBranchId && fromDepartmentId == toDepartmentId) {
            var msg = alertify.error('سال مالی  , شعبه و دپارتمان مبدا و مقصد نمیتواند یکسان باشد');
            msg.delay(alertify_delay);
            isvalidatebeforesaveline = false;
            $("#toFiscalYearId").val("").trigger("change");;
            $("#toBranchId").val("").trigger("change");;
            $("#toDepartmentId").val("").trigger("change");;
            $("#toFiscalYearId").select2("focus");
        }

        else if (fromShiftId > 0 && toShiftName == "") {
            var msg = alertify.error('شیفت  مقصد را انتخاب نمایید');
            msg.delay(alertify_delay);
            isvalidatebeforesaveline = false;
            $("#toShiftName").focus();
        }
        else
            isvalidatebeforesaveline = true;
    }
    else {
        var msg = alertify.error('سال مالی مبدا را انتخاب نمایید');
        msg.delay(alertify_delay);
        isvalidatebeforesaveline = false;
    }

}

function deleteLine(modal_name, elm, row, e) {

    e.preventDefault()
    e.stopPropagation()

    var index = toAfterAddList.findIndex(x => x.rowId === row);

    $(`#rowItem${row}`).remove();
    toAfterAddList.splice(index, 1);
    toAfterAddList.sort(sort_by_id());
    isEdit = false;
    checkHasRow();

}

function editLine(modal_name, elm, row, e) {
    e.stopPropagation();

    var index = toAfterAddList.findIndex(x => x.rowId === row);
    var currentToAffected = toAfterAddList[index];


    $("#toFiscalYearId").empty();
    $("#toFiscalYearId").html("<option value=\"0\">انتخاب کنید</option>");
    fill_select2(`${viewData_baseUrl_GN}/FiscalYearApi/getdropdown/0`, "toFiscalYearId", true);
    $("#toFiscalYearId").val(+currentToAffected.toFiscalYearId).trigger("change.select2");


    $("#toBranchId").empty();
    $("#toBranchId").html("<option value=\"0\">انتخاب کنید</option>");
    fill_select2(`${viewData_baseUrl_GN}/BranchApi/getactivedropdown`, "toBranchId", true);
    $("#toBranchId").val(+currentToAffected.toBranchId).trigger("change.select2");



    $("#toDepartmentId").empty();
    $("#toDepartmentId").html("<option value=\"0\">انتخاب کنید</option>");
    fill_select2(`${viewData_baseUrl_HR}/OrganizationalDepartmentApi/getdropdown`, "toDepartmentId", true);
    $("#toDepartmentId").val(+currentToAffected.toDepartmentId).trigger("change.select2");

    $("#toShiftName").val(currentToAffected.toShiftNameText);
    isEdit = true;

    rowEditId = row;

    $("#toFiscalYearId").select2("focus");
}

function rebuildRowId() {

    var len = toAfterAddList.length;

    for (var i = 0; i < len; i++) {

    }

}

function checkHasRow() {

    var hasRow = toAfterAddList.length > 0;

    $("#fromFiscalYearId").prop("disabled", hasRow);
    $("#fromBranchId").prop("disabled", hasRow);
    $("#fromDepartmentId").prop("disabled", hasRow);
    $("#fromShiftId").prop("disabled", hasRow);
}

function newTrOnkeydown(elm, ev, row) {
    if (ev.which === KeyCode.ArrowUp) {
        ev.preventDefault();
        if ($(`#DepartmentTimeShiftTransformModal tr[highlight = ${row - 1}]`).length != 0) {
            $(`#DepartmentTimeShiftTransformModal .highlight`).removeClass("highlight");
            $(`#DepartmentTimeShiftTransformModal tr[highlight = ${row - 1}]`).addClass("highlight");
            $(`#DepartmentTimeShiftTransformModal tr[highlight = ${row - 1}]`).focus();
        }

    } else if (ev.which === KeyCode.ArrowDown) {
        ev.preventDefault();
        if ($(`#DepartmentTimeShiftTransformModal tr[highlight = ${row + 1}]`).length != 0) {
            $(`#DepartmentTimeShiftTransformModal .highlight`).removeClass("highlight");
            $(`#DepartmentTimeShiftTransformModal tr[highlight = ${row + 1}]`).addClass("highlight");
            $(`#DepartmentTimeShiftTransformModal tr[highlight = ${row + 1}]`).focus();
        }
    }

}

function resetInputsRowDepartmentTimeShift() {
    $("#toFiscalYearId").val("").trigger("change");
    $("#toBranchId").val("").trigger("change");
    $("#toDepartmentId").val("").trigger("change");
    $("#toShiftName").val("");
    $("#toFiscalYearId").select2("focus");
    isEdit = false;
}

function run_button_displayDepartmentTimeShift(lineId, rowno, elm, ev) {

    displayDepartmentTimeShift(lineId);
    modal_show("departmentTimeShiftModals");

}

function displayDepartmentTimeShift(id) {
    var url = `${viewData_baseUrl_HR}/DepartmentTimeShiftApi/display`;

    var modal_name = "departmentTimeShiftModals"
    $(".modal").find("#modal_title").text("نمایش " + viewData_form_title);
    $("#modal_keyid_valuedisplay").text(id);
    $("#modal_keyid_captiondisplay").text("شناسه : ");


    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        async: false,
        cache: false,
        success: function (result) {
            modal_fill_displayitems(result);
            modal_show(modal_name);
        },
        error: function (xhr) {
            error_handler(xhr, url)
        }
    });


}

function modal_fill_displayitems(item) {

    if (!item) return;
    modal_name = "departmentTimeShiftModals";

    var currentShift = item[0];

    $("#fiscalYear").val(currentShift.fiscalYear);
    $("#branch").val(currentShift.branch);
    $("#department").val(currentShift.department);
    $("#shift").val(currentShift.shiftName);
    $("#descriptiondisplay").val(currentShift.description);

    $("#departmentTimeShiftLineDisplay input").val("");

    for (let i = 0; i < item.length; i++) {

        var currentDay = item[i];
        var dayOfWeek = currentDay.dayInWeek;
        $(`#displaystartTime${dayOfWeek}`).val(currentDay.startTime);
        $(`#displayendTime${dayOfWeek}`).val(currentDay.endTime);
    }
}

$("#standardTimeSheetAssignModals").on("hidden.bs.modal", function () {

    pagetable_formkeyvalue = lastFormKeyValue;
    lastFormKeyValue = "";
})


function run_button_departmentTimeShiftLineChangeLock(lineId, rowno, elm, ev) {

    var isLock = $(elm).parents("tr").first().data("islock");
    var dayInWeek = $(elm).parents("tr").first().data("dayinweek");

    let departmentTimeShiftLineid = +$(`#departmentTimeShiftLineDays_pagetable  .pagetablebody > tbody > #row${rowno} > #col_${rowno}_1`).text();


    currentDate, currentTime, currentDateTime = getCurrentDateTime();


    let currentDat = moment().format('jYYYY/jMM/jDD');
    let currentYr = +currentDat.split("/")[0];
    let lastMnth = "12";

    let lastDy = getMonthDaysCount(currentYr, lastMnth)
    let toAppointmntDate = currentYr + "/" + lastMnth + "/" + lastDy;

    let model = {
        id: +departmentTimeShiftLineid,
        departmentShiftId: headerDepartmentTimeShiftId,
        fromAppointmentDate: currentDateTime.currentDate,
        toAppointmentDate: convertToMiladiDate(toAppointmntDate),
        fromTime: currentDateTime.currentTime,
        dayInWeek: dayInWeek,
        formType: formType,
        isLock: isLock
    }

    if (+departmentTimeShiftLineid > 0) {

        $(`#departmentTimeShiftLineDays_pagetable #row${rowno}`).addClass("highlight");

        let url = `${viewData_baseUrl_HR}/${viewData_controllername}/departmenttimeshiftlinechangelock`;
        $.ajax({
            url: url,
            type: "POST",
            dataType: "JSON",
            contentType: "application/json",
            cache: false,
            async: false,
            data: JSON.stringify(model),
            success: function (result) {

                if (result.successfull == true) {


                    getrecordAjax("departmentTimeShiftLineDays_pagetable", rowno, departmentTimeShiftLineid);

                    alertify.success(result.statusMessage);


                }
                else {
                    var msg = alertify.error(result.statusMessage);
                    msg.delay(alertify_delay);
                }

            },
            error: function (xhr) {
                error_handler(xhr, url);
                return "";
            }
        });
    }
    else {
        var msg = alertify.error("سطر انتخابی فاقد شناسه است");
        msg.delay(alertify_delay);
    }


}


initDepartmentTimeShift();


function tr_onfocus(pg_id, colno, thisElm) {

    if (pg_id != "departmentTimeShiftLineDays_pagetable")
        return;

    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_id);
    arr_pagetables[index].currentcol = colno;
    var pagetable_id = arr_pagetables[index].pagetable_id;
    var currentrow = arr_pagetables[index].currentrow;
    var trediting = arr_pagetables[index].trediting;

    if (trediting) {
        var elm = $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_${colno}`).find("input:first,select:first,div.funkyradio:first");
        if (!elm.hasClass("funkyradio"))
            elm.select();


        if (thisElm !== undefined) {

            attrId = $(thisElm).attr("id");

            if (attrId.startsWith("startTime_")) {
                var currentRowNo = attrId.replace("startTime_", "");

                if (typeof ($(`#startTime_${currentRowNo - 1}`).attr("id")) !== "undefined" && $(thisElm).val() == "") {
                    $(thisElm).val($(`#startTime_${currentRowNo - 1}`).val())
                }
            }

            if (attrId.startsWith("endTime_")) {
                var currentRowNo = attrId.replace("endTime_", "");

                if (typeof ($(`#endTime_${currentRowNo - 1}`).attr("id")) !== "undefined" && $(thisElm).val() == "") {
                    $(thisElm).val($(`#endTime_${currentRowNo - 1}`).val())
                }
            }

        }
    }
}