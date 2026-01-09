
viewData_controllername = "AttenderApi"
viewData_getpagetable_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getadmissionattenderschedulepage`
viewData_filter_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getadmissionattenderschedulefilteritems`
viewData_print_file_url = `${stimulsBaseUrl.MC.Rep}AttenderSchedule.mrt`
viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 }
viewData_print_tableName = ""


$("#content-page").fadeIn().removeClass("displaynone");
$("#exportCSV").remove();
$("#readyforadd").remove();
$("#stimul_preview").remove();
$(".button-items").append(`<div class='atenderschedule-settting-box'><button id='previousDay' class='btn btn-info waves-effect waves-light attenderDayBtn'>روز قبل</button><div id='attenderScheduleForm'><input id='reserveDate' onkeydown='reserveDate_keyDown(event)' class='form-control mask persian-date' required placeholder = '____/__/__' data-parsley-shamsidate data-inputmask="'mask':'9999/99/99'" type='text'/></div><button id='nextDay' class='btn btn-info waves-effect waves-light attenderDayBtn'>روز بعد</button></div>`);
$(".button-items").prepend(`<button onclick="refreshData()" type="button" class="btn btn_green_1 waves-effect"><i class="fa fa-sync-alt"></i>بروز رسانی</button>`);


$(document).ready(function () {
    kamaDatepicker('reserveDate', { withTime: false, position: "bottom" });
    $(`#reserveDate`).inputmask();
    $("#reserveDate").val($("#nowDate").val());
    pagetable_formkeyvalue = [];
    var reserveEnDate = $("#reserveDate").val();
    var mlDate = moment.from(reserveEnDate, 'fa', 'YYYY/MM/DD');
    var miladiDate = mlDate.format('YYYY/MM/DD');
    pagetable_formkeyvalue.push(miladiDate);
    get_NewPageTableV1();
})

$(document).on("click", "#previousDay", function () {
    if (!validateReserveDate())
        return;
    var reserveEnDate = $("#reserveDate").val();
    var mlDate = moment.from(reserveEnDate, 'fa', 'YYYY/MM/DD');
    if (mlDate.isValid()) {
        var miladiDate = mlDate.add(-1, 'day').format('YYYY/MM/DD');
        var shamsiDate = moment(miladiDate, 'YYYY/MM/DD').locale('fa');
        if (shamsiDate.isValid()) {
            shamsiDate.locale('fa');
            $("#reserveDate").val(shamsiDate.format('YYYY/MM/DD'));
            pagetable_formkeyvalue = [];
            pagetable_formkeyvalue.push(miladiDate);
            get_NewPageTableV1();
        }
    }
});

function reserveDate_keyDown(ev) {
    if (ev.which === KeyCode.Enter) {
        refreshData();
    }
}

function refreshData() {
    var reserveEnDate = $("#reserveDate").val();
    var mlDate = moment.from(reserveEnDate, 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD');
    pagetable_formkeyvalue = [];
    pagetable_formkeyvalue.push(mlDate);
    get_NewPageTableV1();

}

$("#nextDay").on("click", function () {
    if (!validateReserveDate())
        return;
    var reserveEnDate = $("#reserveDate").val();
    var mlDate = moment.from(reserveEnDate, 'fa', 'YYYY/MM/DD');

    if (mlDate.isValid()) {
        var miladiDate = mlDate.add(1, 'day').format('YYYY/MM/DD');
        var shamsiDate = moment(miladiDate, 'YYYY/MM/DD').locale('fa');
        if (shamsiDate.isValid()) {
            shamsiDate.locale('fa');
            $("#reserveDate").val(shamsiDate.format('YYYY/MM/DD'));
            pagetable_formkeyvalue = [];

            pagetable_formkeyvalue.push(miladiDate);
            get_NewPageTableV1();
        }
    }
});

function validateReserveDate() {
    form = $('#attenderScheduleForm').parsley();
    validate = form.validate();
    return validate;
}


function stimul_preview() {
    var p_id = $(`#${pagetable_id} .btnfilter`).attr("data-id");
    var p_value = $(`#${pagetable_id} .filtervalue`).val();
    var pageViewModel = {
        fieldItem: p_id,
        fieldValue: p_value
    }
    pageViewModel.Form_KeyValue = pagetable_formkeyvalue;

    $.ajax({
        url: `${viewData_baseUrl_MC}/${viewData_controllername}/getadmissionattenderschedulepreparejsonlist`,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(pageViewModel),
        cache: false,
        async: false,
        success: function (result) {
            if (result) {
                viewData_print_url = `/Report/JsonPrint`;
                var p_url = viewData_print_file_url;
                window.open(`${viewData_print_url}?pUrl=${p_url}`);
            }
        }
    });

}

