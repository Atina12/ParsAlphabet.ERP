var settingReportModule = () => {
    document.querySelector('#showSettingModal').addEventListener('click', function () {

        //$("#setNewPageAfter").prop("checked", false);
        //$("#setPageNumberReset").prop("checked", false);
        //$("#setShowLogo").prop("checked", true);
        //$("#setReportDate").prop("checked", true);

        modal_show("reportSettingModal");
    });

    document.querySelector('#settingReport').addEventListener('click', function () {

        reportSettingModel.newPageAfter = $("#setNewPageAfter").prop("checked");
        reportSettingModel.resetPageNumber = $("#setPageNumberReset").prop("checked");
        reportSettingModel.showLogo = $("#setShowLogo").prop("checked");
        reportSettingModel.showReportDate = $("#setReportDate").prop("checked");
        modal_close("reportSettingModal");
    });

    document.querySelector('#closeSettingModal').addEventListener('click', function () {
        modal_show("reportSettingModal");
    });

    $("#reportSettingModal").on("shown.bs.modal", function () {
        funkyradio_onchange($("#setShowLogo"));
        funkyradio_onchange($("#setReportDate"));
        $(this).find(`[tabindex='100']`).focus();
    });
};

