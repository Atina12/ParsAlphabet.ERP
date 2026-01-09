var viewData_form_title = "تقویم استاندارد";
var isSearcheModalOpen = false;
var viewData_controllername = "StandardTimeSheetApi";
var viewData_getrecord_url = `${viewData_baseUrl_HR}/${viewData_controllername}/getrecordbyid`;
var viewData_getpagetable_url = `${viewData_baseUrl_HR}/${viewData_controllername}/getpage`;
var viewData_deleterecord_url = `${viewData_baseUrl_HR}/${viewData_controllername}/delete`;
var viewData_insrecord_url = `${viewData_baseUrl_HR}/${viewData_controllername}/insert`;
var viewData_updrecord_url = `${viewData_baseUrl_HR}/${viewData_controllername}/update`;
var viewData_filter_url = `${viewData_baseUrl_HR}/${viewData_controllername}/getfilteritems`;
var viewData_filter_calculationBasedTypegetDropDown = `${viewData_baseUrl_HR}/${viewData_controllername}/calculationBasedTypegetDropDown`;
var viewData_csv_url = `${viewData_baseUrl_HR}/${viewData_controllername}/csv`;
var viewData_print_file_url = `${stimulsBaseUrl.HR.Prn}StandardTimeSheet.mrt`, identityIdCurrent = 0;
var viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 }
var viewData_print_tableName = "";
var rowNumberJournal = 0, lastpagetable_formkeyvalue = [], saveYearRowForLine = "", fromTimeSheetDepartmentId = null, toTimeSheetDepartmentId = null;
var standardTimeSheetId = "";
var departmentIdLine = "";
modal_open_state = "Add"



function initStandarWorkingIndexForm() {

    fill_select2(`${viewData_baseUrl_GN}/FiscalYearApi/getdropdown/0`, "fiscalYearId", true);
    fill_select2(`${viewData_baseUrl_HR}/OrganizationalDepartmentApi/getdropdown`, "departmentId", true);


    var check = controller_check_authorize(viewData_controllername, "VIWALL");

    if (check)
        $("#userType").prop('disabled', false);
    else
        $("#userType").prop('disabled', true);

    $('#userType').bootstrapToggle();
    pagetable_formkeyvalue = ["", "", "my", 0];

    get_NewPageTableV1();
}

function modal_show(modal_name = null) {
    if (modal_name === null)
        modal_name = modal_default_name;

    $(".modal-dialog").css("height", "auto");

    var firstRowsCountItem = $(`#${modal_name} .pagerowscount .dropdown-menu .dropdown-item:first`).text();
    $(`#${modal_name} .pagerowscount button:first`).text(firstRowsCountItem);

    $("input").attr("autocomplete", "off");


    if (modal_open_state == "Add") {
        $("#fiscalYearId").prop("disabled", false);
        $("#departmentId").prop("disabled", false);
        $("select").prop("selectedIndex", 0).trigger("change");
    }
    else {
        $("#fiscalYearId").prop("disabled", true);
        $("#departmentId").prop("disabled", true);
    }

    $(`#${modal_name}`).modal({ "backdrop": "static" });
}

function modal_save(modal_name = null, enter_toline = false) {
    if (modal_name == null)
        modal_name = modal_default_name;

    if (modal_open_state == "Add")
        modal_record_insert(modal_name, enter_toline, pageVersion = 'pagetable');
    else
        if (modal_open_state == "Edit")
            modal_record_update(modal_name, enter_toline, pageVersion = 'pagetable');
}

function modal_record_insert(modal_name = null, enter_toline, pageVersion) {

    $(".modal").find("#modal_title").text("افزودن  " + viewData_form_title);

    if (modal_name == null)
        modal_name = modal_default_name;
    var form = $(`#${modal_name} div.modal-body`).parsley();

    var validate = form.validate();
    validateSelect2(form);
    if (!validate) return;

    var newModel = {};
    var swReturn = false;

    var elements = $(`#${modal_name}`);
    elements.find("input,select,img,textarea").each(function () {

        var elm = $(this);
        var elmid = elm.attr("id");
        var val = '';
        if (elm.hasClass("money"))
            val = +removeSep(elm.val()) !== 0 ? +removeSep(elm.val()) : 0;
        else if (elm.hasClass("decimal"))
            val = +removeSep(elm.val()) !== 0 ? removeSep(elm.val().replace(/\//g, ".")) : 0;
        else if (elm.hasClass("number"))
            val = +removeSep(elm.val()) !== 0 ? +elm.val() : 0;
        else if (elm.hasClass("str-number"))
            val = +removeSep(elm.val()) !== 0 ? elm.val() : "";
        else if (elm.attr("type") == "checkbox")
            val = elm.prop("checked");
        else if (elm.hasClass("select2") || elm.prop("tagName").toLowerCase() == "select")
            val = elm.val();
        else
            if (val !== null) {
                val = myTrim(elm.val());
            }

        var tag = elm.prop("tagName").toLowerCase();
        if (tag === `img`) {
            var src = elm.attr("src");
            var pos = src.indexOf("base64,");
            if (pos != -1) {
                val = src.substring(pos + 7);
                var decoded = atob(val);
                if (decoded.length >= 51200) {
                    alertify.alert("کنترل حجم", msg_picturesize_limit_50);
                    swReturn = true;
                    return;
                }
                elmid = elmid + "_base64";
            }
        }

        newModel[elmid] = val;
    });

    if (swReturn)
        return;


    if (pageVersion != "pagetable") {
        let index = arr_pagetables.findIndex(v => v.pagetable_id == "pagetable");
        arr_pagetables[index].pageNo = 0;
        arr_pagetables[index].currentrow = 1;

    }

    recordInsertUpdate(viewData_insrecord_url, newModel, modal_name, msg_row_created, function (result) {

        if (result.successfull && result.id > 0 && enter_toline) {
            //modal_close();
            $(".modal-backdrop.fade.show").remove();
            navigation_item_click(`/HR/StandardTimeSheetHoliday/${result.id}`, "ساعت کاری استاندارد ماهانه");
        }
        else
            get_NewPageTableV1();
    }, undefined);
}

function modal_record_update(modal_name = null, enter_toline, pageVersion) {
    if (modal_name == null)
        modal_name = modal_default_name;
    var form = $(`#${modal_name} div.modal-body`).parsley();
    var validate = form.validate();
    validateSelect2(form);
    if (!validate) return;
    var newModel = {};

    newModel["Id"] = +$("#modal_keyid_value").text();

    var swReturn = false;
    var element = $(`#${modal_name}`);
    element.find("input,select,img,textarea").each(function () {
        var elm = $(this);
        var elmid = elm.attr("id");
        var val = elm.val();

        if (elm.hasClass("money"))
            val = +removeSep(elm.val()) !== 0 ? +removeSep(elm.val()) : 0;
        else if (elm.hasClass("decimal"))
            val = +removeSep(elm.val()) !== 0 ? removeSep(elm.val().replace(/\//g, ".")) : 0;
        else if (elm.hasClass("number"))
            val = +removeSep(elm.val()) !== 0 ? +elm.val() : 0;
        else if (elm.hasClass("str-number"))
            val = +removeSep(elm.val()) !== 0 ? elm.val() : "";
        else if (elm.attr("type") == "checkbox")
            val = elm.prop("checked");
        else if (elm.hasClass("select2") || elm.prop("tagName").toLowerCase() == "select")
            val = elm.val();
        else
            if (val !== null) {
                val = myTrim(elm.val());
            }

        var tag = elm.prop("tagName").toLowerCase();
        if (tag === `img`) {
            var src = elm.attr("src");
            var pos = src.indexOf("base64,");
            if (pos != -1) {
                val = src.substring(pos + 7);
                var decoded = atob(val);
                if (decoded.length >= 51200) {
                    alertify.alert("کنترل حجم", msg_picturesize_limit_50);
                    swReturn = true;
                    return;
                }
                elmid = elmid + "_base64";
            }
        }

        newModel[elmid] = val;
    });

    if (swReturn)
        return;



    if (pageVersion != "pagetable") {
        let index = arr_pagetables.findIndex(v => v.pagetable_id == "pagetable");
        arr_pagetables[index].pageNo = 0;
        arr_pagetables[index].currentrow = 1;
    }

    recordInsertUpdate(viewData_updrecord_url, newModel, modal_name, msg_row_edited, function (result) {
        if (result.successfull && enter_toline) {
            //modal_close();
            $(".modal-backdrop.fade.show").remove();
            navigation_item_click(`/HR/StandardTimeSheetHoliday/${newModel.Id}`, "ساعت کاری استاندارد ماهانه");
        }
        else
            get_NewPageTableV1();
    }, undefined);
}

function export_csv(elemId = undefined, value = undefined) {
    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    $(`#${elemId == undefined || elemId == null ? "exportCSV" : elemId}`).prop("disabled", true);

    setTimeout(function () {
        let index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id);

        if ($("#userType").prop("checked"))
            pagetable_formkeyvalue = ["", "", "my", 0];
        else
            pagetable_formkeyvalue = ["", "", "all", null];

        if (csvModel == null) {
            csvModel = {
                filters: arrSearchFilter[index].filters,
                Form_KeyValue: pagetable_formkeyvalue
            }
        }

        if (typeof value !== "undefined")
            csvModel.Form_KeyValue.push(value);

        $.ajax({
            url: viewData_csv_url,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(csvModel),
            cache: false,
            success: function (result) {
                generateCsv(result);

                $(`#${elemId == undefined || elemId == null ? "exportCSV" : elemId}`).prop("disabled", false);
            },
            error: function (xhr) {
                error_handler(xhr, viewData_csv_url);
                $(`#${elemId == undefined || elemId == null ? "exportCSV" : elemId}`).prop("disabled", false);
            }
        });
    }, 500);
}

function run_button_edit(p_keyvalue, rowNo, elem) {

    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;

    var bySystem = $(`#row${rowNo}`).data("bysystem");
    if (bySystem) {
        var msg = alertify.warning("امکان ویرایش سند سیستمی وجود ندارد");
        msg.delay(alertify_delay);
        return;
    }

    var modal_name = null;

    $("#rowKeyId").removeClass("d-none");
    if (modal_name == null)
        modal_name = modal_default_name;

    $(".modal").find("#modal_title").text("ویرایش  " + viewData_form_title);

    $("#modal_keyid_value").text(p_keyvalue);
    $("#modal_keyid_caption").text("شناسه : ");

    $(`#${modal_name} div [hidden-on-edit=true]`).each(function () {
        var elm = $(this);
        elm.addClass("displaynone");
        elm.find("input,select,img").each(function () {
            var subelm = $(this);
            subelm.attr("data-parsley-excluded", "true");
        })
    });
    $(`#${modal_name} div [hidden-on-add=true]`).each(function () {
        var elm = $(this);
        elm.removeClass("displaynone");
        elm.find("input,select,img").each(function () {
            var subelm = $(this);
            subelm.attr("data-parsley-excluded", "false");
        })
    });

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
            modal_clear_items(modal_name);
            modal_fill_items(result.data, modal_name);
            modal_show(modal_name);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getrecord_url)
        }
    });
}

function run_button_display(id, rowNo, elm) {
    saveYearRowForLine = $(elm).closest("tr").data("fiscalyear")
    standardTimeSheetId = $(elm).closest("tr").data("id")
    $("#modal_keyid_caption_personnelCalendarDisplay").text("شناسه")
    $("#modal_keyid_value_personnelCalendarDisplay").text(id)
    modal_show('employeeStandardTimeSheetDisplay')
}

function navigateToModalJournal(href) {

    initialPage();
    $("#contentdisplayEmployeeStandardTimeSheet #content-page").addClass("displaynone");
    $("#contentdisplayEmployeeStandardTimeSheet #loader").removeClass("displaynone");
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
            $(`#contentdisplayEmployeeStandardTimeSheet`).html(result);
        },
        error: function (xhr) {
            error_handler(xhr, href);
        }
    });
    $("#contentdisplayEmployeeStandardTimeSheet #loader,#contentdisplayStandardWorkingHourLine #formHeaderLine #header-div .button-items").addClass("displaynone");
    $("#contentdisplayEmployeeStandardTimeSheet #content-page").fadeIn().removeClass("displaynone").css("margin", 0);
    $("#contentdisplayEmployeeStandardTimeSheet #form,#contentdisplayStandardWorkingHourLine .content").css("margin", 0);
    $("#contentdisplayEmployeeStandardTimeSheet .itemLink").css("pointer-events", " none");
}

function run_button_standardTimeSheetHoliday(lineId, rowNo, elm, ev) {

    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    saveYearRowForLine = $(elm).closest("tr").data("fiscalyear")
    standardTimeSheetId = $(elm).closest("tr").data("id")
    departmentIdLine = $(elm).closest("tr").data("departmentid")
    $("#modal_keyid_caption_personnelCalendar").text("شناسه")
    $("#modal_keyid_value_personnelCalendar").text(lineId)
    modal_show('AddEditModalPersonnelCalendar')
}

function timeSheetTransfer() {

    var check = controller_check_authorize(viewData_controllername, "INS");

    if (!check)
        return;

    fill_select2(`${viewData_baseUrl_HR}/StandardTimeSheetApi/getdropdown`, "fromTimeSheet", true);
    fill_select2(`${viewData_baseUrl_HR}/StandardTimeSheetApi/getdropdown`, "toTimeSheet", true);
    $(".modal").find("#modal_title").text("انتقال تقویم داکتران" );
    modal_show(`timeSheetTransferModal`);
}

function resetTimeSheetTransfer() {

    $("#fromFiscalYearName").text("-");
    $("#toFiscalYearName").text("-");

    $("#fromStartDatePersian").text("-");
    $("#toStartDatePersian").text("-");

    $("#fromEndDatePersian").text("-");
    $("#toEndDatePersian").text("-");

    $("#fromHolidayCount").text("-");
    $("#toHolidayCount").text("-");

    $("#fromTimeSheet").val("0").trigger("change");
    $("#toTimeSheet").val("0").trigger("change");

    fromTimeSheetDepartmentId = null;
    toTimeSheetDepartmentId = null;
}

async function timeSheetTranferSave() {

    let fromTimeSheet = +$("#fromTimeSheet").val()
    let toTimeSheet = +$("#toTimeSheet").val()
    let model = {
        FromTimeSheetId: fromTimeSheet,
        ToTimeSheetId: toTimeSheet,
        FromMonthId: 0,
        ToMonthId: 0,
        type: 1
    }

    let url = `${viewData_baseUrl_HR}/StandardTimeSheetApi/duplicate`

    $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(model),
        success: function (result) {
            if (result.successfull) {
                var msgResult = alertify.success(result.statusMessage);
                msgResult.delay(alertify_delay);
                $("#fromTimeSheet").trigger("change");
                $("#toTimeSheet").trigger("change");
            }
            else {
                var msgResult = alertify.warning(result.statusMessage);
                msgResult.delay(alertify_delay);
            }
            $("#fromTimeSheet").select2("focus");
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return 0;
        }
    });
}

function run_button_standardTimeSheetPerMonth(lineId, rowNo, elm, ev) {

    initStandardTimeSheetPerMonth(lineId, rowNo, elm)
}

$("#userType").on("change", function () {

    if ($(this).prop("checked"))
        pagetable_formkeyvalue = ["", "", "my", 0];
    else
        pagetable_formkeyvalue = ["", "", "all", null];

    get_NewPageTableV1();
});

$("#stimul_preview")[0].onclick = null;

$("#stimul_preview").click(function () {
    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;
    var p_id = $(`#${pagetable_id} .btnfilter`).attr("data-id");
    if (p_id == "filter-non")
        p_id = "";

    var p_value = $(`#${pagetable_id} .filtervalue`).val();
    var p_type = $(`#${pagetable_id} .btnfilter`).attr("data-type");
    var p_size = $(`#${pagetable_id} .btnfilter`).attr("data-size");

    var userId = getUserId();

    var reportParameters = [
        { Item: "PageNo", Value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "PageRowsCount", value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "CreateUserId", Value: $("#userType").prop("checked") ? userId : null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "Id", Value: null, SqlDbType: p_type, Size: p_size },
        { Item: "Name", Value: null, SqlDbType: p_type, Size: p_size },
        { Item: "FiscalYearId", Value: null, SqlDbType: p_type, Size: p_size },
    ]

    stimul_report(reportParameters);
});

$("#employeeStandardTimeSheetModel").on("hidden.bs.modal", async function () {
    if ($("#userType").prop("checked")) {
        pagetable_formkeyvalue = ["", "", "my", 2];
    } else {
        pagetable_formkeyvalue = ["", "", "all", 2];
    }
   
});

$("#timeSheetTransferModal").on("hidden.bs.modal", function () {
    resetTimeSheetTransfer()
});

$("#fromTimeSheet").on("change", function () {

    let fromTimeSheet = +$(this).val()

    let url = `${viewData_baseUrl_HR}/StandardTimeSheetApi/getinfo`

    if (checkResponse(fromTimeSheet) && fromTimeSheet != 0) {
        $.ajax({
            url: url,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(fromTimeSheet),
            success: function (result) {
                if (checkResponse(result)) {
                    fromTimeSheetDepartmentId = result.departmentId
                    $("#fromFiscalYearName").text(result.fiscalYearName)
                    $("#fromStartDatePersian").text(result.startDatePersian)
                    $("#fromEndDatePersian").text(result.endDatePersian)
                    $("#fromHolidayCount").text(result.holidayCount)
                    $("#fromShiftCount").text(result.shiftCount)
                }
            },
            error: function (xhr) {
                error_handler(xhr, url)
            }
        });
    }
    else {
        $("#fromFiscalYearName").text("-")
        $("#fromStartDatePersian").text("-")
        $("#fromEndDatePersian").text("-")
        $("#fromHolidayCount").text("-")
        $("#fromShiftCount").text("-")
    }
})

$("#toTimeSheet").on("change", function () {

    let toTimeSheet = +$(this).val();
   
    let url = `${viewData_baseUrl_HR}/StandardTimeSheetApi/getinfo`

    if (checkResponse(toTimeSheet) && toTimeSheet != 0) {
     
        $.ajax({
            url: url,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(toTimeSheet),
            success: function (result) {
                if (checkResponse(result)) {
                    toTimeSheetDepartmentId = result.departmentId
                    $("#toFiscalYearName").text(result.fiscalYearName)
                    $("#toStartDatePersian").text(result.startDatePersian)
                    $("#toEndDatePersian").text(result.endDatePersian)
                    $("#toHolidayCount").text(result.holidayCount)
                    $("#toShiftCount").text(result.shiftCount)
                }
            },
            error: function (xhr) {
                error_handler(xhr, url)
            }
        });
    }
    else {
        $("#toFiscalYearName").text("-")
        $("#toStartDatePersian").text("-")
        $("#toEndDatePersian").text("-")
        $("#toHolidayCount").text("-")
        $("#toShiftCount").text("-")
    }
})

$("#saveTransformTimeSheet").on("click", function () {

    var form = $('#timeSheetTransferForm').parsley();

    var validate = form.validate();
    validateSelect2(form);
    if (!validate)
        return;

    let fromTimeSheet = +$("#fromTimeSheet").val()
    let toTimeSheet = +$("#toTimeSheet").val()

    if (fromTimeSheet == toTimeSheet) {
        var msgResult = alertify.warning("تقویم مبدا و مقصد نمی تواند یکی باشد");
        msgResult.delay(alertify_delay);
        $("#fromTimeSheet").select2("focus");
        return
    }

    timeSheetTranferSave();
});






initStandarWorkingIndexForm()

