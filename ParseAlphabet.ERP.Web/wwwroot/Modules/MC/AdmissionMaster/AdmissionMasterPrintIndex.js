var rowNumberAdmissionMaster = 0;

function run_button_admissionMasterBillPatientPrint(rowNumber) {

    var check = controller_check_authorize(viewData_controllername, "PRN");

    if (!check)
        return;

    $("#modal_keyid_value").text(rowNumber);

    rowNumberAdmissionMaster = rowNumber;

    modal_show(`prnAdmissionMaster`);
}



$(`#pagetable`).on("keydown", function (e) {
    if ([KeyCode.key_General_1, KeyCode.key_General_4].indexOf(e.which) == -1) return;
    switchAdmissionMasterPrint(e)
});

$(`#prnAdmissionMaster`).on("keydown", function (e) {
    if ([KeyCode.key_General_1, KeyCode.key_General_4].indexOf(e.which) == -1) return;
    switchAdmissionMasterPrint(e)
});

function switchAdmissionMasterPrint(e) {
    
    if (e.ctrlKey && e.keyCode === KeyCode.key_General_1) {
        e.preventDefault();
        printAdmissionMasterShortcut(1);
    }

    else if (e.ctrlKey && e.keyCode === KeyCode.key_General_4) {
        e.preventDefault();
        printAdmissionMasterShortcut(4);
       
    }
}

function printAdmissionMasterShortcut(type) {
    
    let row = $(`#${activePageTableId} .highlight`);
    rowNumberAdmissionMaster = +row.data("id");
    
    if (type === 1)
        admissionMasterBillPatientPrint();
    else if (type === 4)
        standAdmissionMasterPrint(rowNumberAdmissionMaster);

}

function admissionMasterBillPatientPrint() {


    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    let reportParameters = [];

    reportParameters = [
        { Item: "Id", Value: +rowNumberAdmissionMaster == 0 ? null : +rowNumberAdmissionMaster, SqlDbType: dbtype.Int, Size: 500 },
        { Item: "AdmissionMasterId", Value: +rowNumberAdmissionMaster, itemType: "Var" },

    ];
    let repParameters = reportParameters;

    var reportModel = {
        reportName: "",
        reportUrl: `${stimulsBaseUrl.MC.Rep}AddmissionPlan.mrt`,
        parameters: repParameters,
        reportSetting: reportSettingModel
    }

    window.open(`${viewData_report_url}?strReportModel=${JSON.stringify(reportModel)}`, '_blank');


    modal_close('prnAdmissionMaster')
}

function admissionMasterBillPatientstandprint() {

    standAdmissionMasterPrint(rowNumberAdmissionMaster);

    modal_close('prnAdmissionMaster')
}

function standAdmissionMasterPrint(admissionId) {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    var admissionInfo = `${admissionId}`;

    viewData_standprint_model.url = `${stimulsBaseUrl.MC.Prn}AdmissionStand.mrt`;
    viewData_standprint_model.value = admissionInfo;
    stimul_standprint();

}