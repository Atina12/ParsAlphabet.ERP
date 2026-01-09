var viewData_controllername_fiscalYearLine = "FiscalYearLineApi",
    viewData_getpagetable_url = `${viewData_baseUrl_GN}/${viewData_controllername_fiscalYearLine}/getpage`,
    viewData_save_record_url = `${viewData_baseUrl_GN}/${viewData_controllername_fiscalYearLine}/save`,
    fiscalYearId = 0;

function fiscalYearLine_init(fiscalId, pg_name) {
    viewData_getpagetable_url = `${viewData_baseUrl_GN}/${viewData_controllername_fiscalYearLine}/getpage`;
    viewData_getrecord_url = `${viewData_baseUrl_GN}/${viewData_controllername_fiscalYearLine}/getrecordbyid`;
    viewData_filter_url = `${viewData_baseUrl_GN}/${viewData_controllername_fiscalYearLine}/getfilteritems`;
    pagetable_formkeyvalue = [+fiscalId];
    fiscalYearId = fiscalId;

    $(`#${pg_name} .filterBox`).addClass("d-none");
    pagetable_change_filteritemNew('filter-non', 'مورد فیلتر', '0', '0', "fiscalyearline_pagetable");

}

$("#fiscalYearLineModal")
    .on("hidden.bs.modal", function () {
        fiscalYearInit();
    }).on("shown.bs.modal", function () {
        $(".persian-date").inputmask();
    });



