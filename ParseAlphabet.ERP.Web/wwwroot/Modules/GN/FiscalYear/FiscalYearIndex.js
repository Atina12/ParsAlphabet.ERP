
var viewData_form_title = "دوره مالی",
    viewData_controllername = "FiscalYearApi",
    viewData_getrecord_url = `${viewData_baseUrl_GN}/${viewData_controllername}/getrecordbyid`,
    viewData_getpagetable_url = `${viewData_baseUrl_GN}/${viewData_controllername}/getpage`,
    viewData_insrecord_url = `${viewData_baseUrl_GN}/${viewData_controllername}/insert`,
    viewData_updrecord_url = `${viewData_baseUrl_GN}/${viewData_controllername}/update`,
    viewData_filter_url = `${viewData_baseUrl_GN}/${viewData_controllername}/getfilteritems`,
    viewData_print_file_url = `${stimulsBaseUrl.GN.Prn}FiscalYear.mrt`,
    viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 },
    viewData_print_tableName = "",
    isSecondLang = true,
    viewData_csv_url = `${viewData_baseUrl_GN}/${viewData_controllername}/csv`,
    formFiscalYearLine = $('#fiscalYearLine_pagetable').parsley(),
    fiscalYearId = 0;

var pgt_fiscalYearLine = {
    pagetable_id: "fiscalyearline_pagetable",
    editable: true,
    pagerowscount: 15,
    endData: false,
    pageNo: 0,
    currentpage: 1,
    lastpage: 1,
    currentrow: 1,
    currentcol: 0,
    highlightrowid: 0,
    trediting: false,
    filteritem: "",
    filtervalue: "",
    pagetablefilter: false,
}
arr_pagetables.push(pgt_fiscalYearLine);

function initFiscalYear() {
    get_NewPageTableV1();

    $("#startDatePersian").inputmask();
    $("#endDatePersian").inputmask();

    kamaDatepicker('startDatePersian', { withTime: false, position: "bottom" });
    kamaDatepicker('endDatePersian', { withTime: false, position: "bottom" });
}

function fiscalYearInit() {
    viewData_getpagetable_url = `${viewData_baseUrl_GN}/${viewData_controllername}/getpage`;
    viewData_filter_url = `${viewData_baseUrl_GN}/${viewData_controllername}/getfilteritems`;
    viewData_getrecord_url = `${viewData_baseUrl_GN}/${viewData_controllername}/getrecordbyid`;
}

function run_button_fiscalyearline(fId) {


    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    pagetable_id = "fiscalyearline_pagetable";
    var index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id);

    arr_pagetables[index].pagerowscount = 15;
    arr_pagetables[index].currentpage = 1;
    arr_pagetables[index].lastpage = 1;
    arr_pagetables[index].currentrow = 1;
    arr_pagetables[index].currentcol = 0;
    arr_pagetables[index].highlightrowid = 0;
    arr_pagetables[index].trediting = false;
    arr_pagetables[index].filteritem = "";
    arr_pagetables[index].filtervalue = "";

    fiscalYearId = fId;

    $(`#${pagetable_id} .filtervalue`).val('').inputmask("remove").attr("placeholder", "عبارت فیلتر").removeAttr("dir");
    $(`#${pagetable_id} .btnfilter`).text("مورد فیلتر");

    fiscalYearLine_init(fId, pagetable_id);

    var indexPageTable = arr_pagetables.findIndex(v => v.pagetable_id == "pagetable");
    var pagetableCurrentrow = arr_pagetables[indexPageTable].currentrow

    viewData_modal_title = "ماه‌های دوره مالی";
    $("#fy_yearTitle").text($(`#pagetable .pagetablebody > tbody > #row${pagetableCurrentrow} > #col_${pagetableCurrentrow}_2`).text());
    $("#fy_startDateTitle").text($(`#pagetable .pagetablebody > tbody > #row${pagetableCurrentrow} > #col_${pagetableCurrentrow}_3`).text());
    $("#fy_endDateTitle").text($(`#pagetable .pagetablebody > tbody > #row${pagetableCurrentrow} > #col_${pagetableCurrentrow}_4`).text());

    modal_show(`fiscalYearLineModal`);
}

function tr_object_onchange(pg_name, selectObject, rowno, colno) {

}

function tr_object_onblur(pg_name, selectObject, rowno, colno) {
    if (selectObject.localName == "div")
        $(`#${pagetable_id} .pagetablebody > tbody > #row${rowno} > #col_${rowno}_5 > .funkyradio label`).removeClass("border-thin");
}

function tr_save_row(pg_name, keycode) {

    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_pagetables[index].pagetable_id;
    var pagetable_currentrow = arr_pagetables[index].currentrow;

    if (pg_name == "fiscalyearline_pagetable") {
        
        let id = +$(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_1`).text(),
            monthId = $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_2`).text(),
            startDateElm = $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_4 > input`),
            endDateElm = $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_5 > input`),
            locked = $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_6 > .funkyradio > input:checkbox`).prop("checked");

       
            var fiscalYearLine_model = {
                headerId: fiscalYearId,
                monthId: +monthId,
                startDatePersian: startDateElm.val(),
                endDatePersian: endDateElm.val(),
                locked: locked
            }
            if (!isValidShamsiDate(fiscalYearLine_model.startDatePersian)) {
                var msg = alertify.error("تاریخ شروع نامعتبر می باشد");
                msg.delay(alertify_delay);
                $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_4 > input`).focus()
                return;
            }
            else if (!isValidShamsiDate(fiscalYearLine_model.endDatePersian)) {
                var msg = alertify.error("تاریخ پایان نامعتبر می باشد");
                msg.delay(alertify_delay);
                $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_5 > input`).focus()
                return;
            }
            else if (!compareShamsiDate(fiscalYearLine_model.startDatePersian, fiscalYearLine_model.endDatePersian)) {
                var msg = alertify.error("تاریخ پایان باید بزرگتر از تاریخ شروع باشد");
                msg.delay(alertify_delay);
                return;
            }
            var viewData_save_url = `${viewData_baseUrl_GN}/fiscalYearLineApi/save`;

            // save
            $.ajax({
                url: viewData_save_url,
                type: "post",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(fiscalYearLine_model),
                async: false,
                cache: false,
                success: function (result) {
                    if (result.successfull) {
                        var msg = alertify.success(msg_row_edited);
                        msg.delay(alertify_delay);
                        getrecord(pg_name);
                        after_save_row(pg_name, "success", keycode, false);
                    }
                    else {
                        if (result.statusMessage != null && result.statusMessage != undefined && result.statusMessage != '') {
                            var msg = alertify.error(result.statusMessage);
                            msg.delay(alertify_delay);
                        }
                        else {
                            var msg = alertify.error(msg_row_edit_error);
                            msg.delay(alertify_delay);
                        }

                        getrecord(pg_name);
                        after_save_row(pg_name, "error", keycode, false);
                    }
                    return result;
                },
                error: function (xhr) {
                    error_handler(xhr, viewData_save_url);
                    getrecord(pg_name)
                    after_save_row(pg_name, "error", keycode, false);

                    return false;
                }
            });
        

    }
};

function getrecord(pg_name) {

    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_pagetables[index].pagetable_id;
    var currentrow = arr_pagetables[index].currentrow;

    var url = "";

    if (pg_name == "fiscalyearline_pagetable") {

        var model = {
            headerId: fiscalYearId,
            monthId: +$(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_2`).text()
        }

        url = `${viewData_baseUrl_GN}/FiscalYearLineApi/getrecordbyid`;

        $.ajax({
            url: url,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(model),
            async: false,
            cache: false,
            success: function (result) {
                var fiscalyearline = result.data;

                if (fiscalyearline != null) {
                    $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_4 > input`).val(fiscalyearline.startDatePersian);
                    $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_5 > input`).val(fiscalyearline.endDatePersian);
                    $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_6 > .funkyradio > input`).prop("checked", fiscalyearline.locked);
                }
                else {
                    $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_4 > input`).val("");
                    $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_5 > input`).val("");
                    $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_6 > .funkyradio > input`).prop("checked", false);
                }
            },
            error: function (xhr) {
                error_handler(xhr, url)
            }
        });

    }
}

$("#AddEditModal").on("show.bs.modal", function () {
    if (modal_open_state == 'Add') {
        resetFiscalForm()
    }
    else {
        $("#name").prop("disabled", true);
        $("#startDatePersian").prop("disabled", true);
        $("#endDatePersian").prop("disabled", true);
    }
});

function resetFiscalForm() {
    $("#name").prop("disabled", false);
    $("#startDatePersian").prop("disabled", false);
    $("#endDatePersian").prop("disabled", false);
}

initFiscalYear()

