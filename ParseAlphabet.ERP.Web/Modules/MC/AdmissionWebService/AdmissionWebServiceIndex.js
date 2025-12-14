var viewData_form_title = "اعتبار کسور بیمه",
    viewData_controllername = "AdmissionWebServiceApi",
    viewData_getpagetable_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getpage`,
    viewData_getpagetable2_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getpageReturns`,
    viewData_getpagetable3_url = `${viewData_baseUrl_MC}/AdmissionReferApi/admissionrefersendgetpage`,
    viewData_getpagetable4_url = `${viewData_baseUrl_MC}/AdmissionReferApi/admissionrefersendfeedbackpage`,
    viewData_getpagetable5_url = `${viewData_baseUrl_MC}/PrescriptionApi/sendprescriptiongetpage`,
    viewData_getpagetable6_url = `${viewData_baseUrl_MC}/DentalApi/dentalsendgetpage`,
    viewData_getpagetable7_url = `${viewData_baseUrl_MC}/DeathCertificateApi/deathcertificatesendgetpage`,
    viewData_getpagetable8_url = `${viewData_baseUrl_MC}/MedicalLaboratoryApi/medicallaboratorysendgetpage`,
    viewData_filtersales_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getfilteritemsales`,
    viewData_filterreturns_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getfilteritemreturns`,
    viewData_filterSendRefer_url = `${viewData_baseUrl_MC}/AdmissionReferApi/getfilteritemreferredsend`,
    viewData_filterDental_url = `${viewData_baseUrl_MC}/DentalApi/getfilteritemdentalsend`,
    viewData_filterDeathCertificate_url = `${viewData_baseUrl_MC}/DeathCertificateApi/getfilteritemdeathcertificatesend`,
    viewData_filterMedicalLaboratory_url = `${viewData_baseUrl_MC}/MedicalLaboratoryApi/getfilteritemmedicallaboratorysend`,
    viewData_getactivereferralid_url = `${viewData_baseUrl_MC}/AdmissionReferApi/getactivereferralidbyadmission`,
    viewData_filterAdmissionSendFeedBack_url = `${viewData_baseUrl_MC}/AdmissionReferApi/admissionreferredsendfeedbackcolumns`,
    viewData_filterPrescreption_url = `${viewData_baseUrl_MC}/PrescriptionApi/sendprescriptionfilteritems`,
    viewData_csv_url = `${viewData_baseUrl_MC}/${viewData_controllername}/csv`,
    viewData_get_UpdateHid_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getupdatehid`,
    viewData_get_EliminateHid_url = `${viewData_baseUrl_MC}/${viewData_controllername}/geteliminatehid`,
    viewData_SavepatientBill_url = `${viewData_baseUrl_MC}/${viewData_controllername}/savepatientbill`,
    viewData_SendPrescription_url = `${viewData_baseUrl_MC}/PrescriptionApi/sendwebservice`,
    viewData_GetPrescriptionHid_url = `${viewData_baseUrl_MC}/PrescriptionApi/gethid`,
    viewData_get_AdmissionServiceLines_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getadmissionservicelines`,
    viewData_get_InsurerReimbursement_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getinsurerreimbursementhid`,
    viewData_csv_url = `${viewData_baseUrl_MC}/${viewData_controllername}/csv`,
    viewData_insurerreimbursement_url = `${viewData_baseUrl_MC}/${viewData_controllername}/activeinsurerreimbursement`,
    viewData_sendReferallPatientRecord_url = `${viewData_baseUrl_MC}/AdmissionReferApi/sendreferralpatientrecord`,
    viewData_sendFeedBackPatientRecord_url = `${viewData_baseUrl_MC}/AdmissionReferApi/sendfeedbackpatientrecord`,
    viewData_sendDentalPatientRecord_url = `${viewData_baseUrl_MC}/DentalApi/savedentalcaserecord`,
    viewData_sendDeathCertificatePatientRecord_url = `${viewData_baseUrl_MC}/DeathCertificateApi/savedeathcertificaterecord`,
    viewData_sendMedicalLaboratoryRecord_url = `${viewData_baseUrl_MC}/MedicalLaboratoryApi/send`,
    admissionId = 0, OutPutCssTable = "", moneyTools = { arrayMoneyModal: [], modelSums: {} };


$(".tab-content").show();

var pagetable = {
    pagetable_id: "reimbursment_pagetable",
    editable: false,
    pagerowscount: 15,
    currentpage: 1,
    endData: false,
    pageNo: 0,
    lastpage: 1,
    currentrow: 1,
    currentcol: 0,
    highlightrowid: 0,
    trediting: false,
    filteritem: "",
    filtervalue: "",
    headerType: "outline",
    selectedItems: [],
    getpagetable_url: viewData_getpagetable_url,
    getfilter_url: viewData_filtersales_url
};
arr_pagetables.push(pagetable);

var pagetable2 = {
    pagetable_id: "reimbursment_pagetable2",
    editable: false,
    pagerowscount: 15,
    currentpage: 1,
    endData: false,
    pageNo: 0,
    lastpage: 1,
    currentrow: 1,
    currentcol: 0,
    highlightrowid: 0,
    trediting: false,
    filteritem: "",
    filtervalue: "",
    headerType: "outline",
    selectedItems: [],
    getpagetable_url: viewData_getpagetable2_url,
    getfilter_url: viewData_filterreturns_url
};
arr_pagetables.push(pagetable2);


var pagetable3 = {
    pagetable_id: "reimbursment_pagetable3",
    editable: false,
    pagerowscount: 15,
    currentpage: 1,
    endData: false,
    pageNo: 0,
    lastpage: 1,
    currentrow: 1,
    currentcol: 0,
    highlightrowid: 0,
    trediting: false,
    filteritem: "",
    filtervalue: "",
    headerType: "outline",
    selectedItems: [],
    getpagetable_url: viewData_getpagetable3_url,
    getfilter_url: viewData_filterSendRefer_url
};
arr_pagetables.push(pagetable3);


var pagetable4 = {
    pagetable_id: "reimbursment_pagetable4",
    editable: false,
    pagerowscount: 15,
    currentpage: 1,
    lastpage: 1,
    endData: false,
    pageNo: 0,
    currentrow: 1,
    currentcol: 0,
    highlightrowid: 0,
    trediting: false,
    filteritem: "",
    filtervalue: "",
    headerType: "outline",
    selectedItems: [],
    getpagetable_url: viewData_getpagetable4_url,
    getfilter_url: viewData_filterAdmissionSendFeedBack_url
};
arr_pagetables.push(pagetable4);

var pagetable5 = {
    pagetable_id: "prescreption_pagetable",
    editable: false,
    pagerowscount: 15,
    currentpage: 1,
    endData: false,
    pageNo: 0,
    lastpage: 1,
    currentrow: 1,
    currentcol: 0,
    highlightrowid: 0,
    trediting: false,
    filteritem: "",
    filtervalue: "",
    headerType: "outline",
    selectedItems: [],
    getpagetable_url: viewData_getpagetable5_url,
    getfilter_url: viewData_filterPrescreption_url
};
arr_pagetables.push(pagetable5);

var pagetable6 = {
    pagetable_id: "dental_pagetable",
    editable: false,
    pagerowscount: 15,
    currentpage: 1,
    endData: false,
    pageNo: 0,
    lastpage: 1,
    currentrow: 1,
    currentcol: 0,
    highlightrowid: 0,
    trediting: false,
    filteritem: "",
    filtervalue: "",
    headerType: "outline",
    selectedItems: [],
    getpagetable_url: viewData_getpagetable6_url,
    getfilter_url: viewData_filterDental_url
};
arr_pagetables.push(pagetable6);

var pagetable7 = {
    pagetable_id: "death_pagetable",
    editable: false,
    pagerowscount: 15,
    currentpage: 1,
    endData: false,
    pageNo: 0,
    lastpage: 1,
    currentrow: 1,
    currentcol: 0,
    highlightrowid: 0,
    trediting: false,
    filteritem: "",
    filtervalue: "",
    headerType: "outline",
    selectedItems: [],
    getpagetable_url: viewData_getpagetable7_url,
    getfilter_url: viewData_filterDeathCertificate_url
};
arr_pagetables.push(pagetable7);

var pagetable8 = {
    pagetable_id: "medicallaboratory_pagetable",
    editable: false,
    pagerowscount: 15,
    currentpage: 1,
    endData: false,
    pageNo: 0,
    lastpage: 1,
    currentrow: 1,
    currentcol: 0,
    highlightrowid: 0,
    trediting: false,
    filteritem: "",
    filtervalue: "",
    headerType: "outline",
    selectedItems: [],
    getpagetable_url: viewData_getpagetable8_url,
    getfilter_url: viewData_filterMedicalLaboratory_url
};
arr_pagetables.push(pagetable8);

function tabLazyLoad(pageTableName) {
    var tableSelected = arr_pagetables.filter(a => a.pagetable_id == pageTableName)[0];
    if (typeof tableSelected != "undefined") {
        if (!tableSelected.loaded) {
            $(`#${pageTableName}`).prepend('<div class="box loader"><img src = "/Content/images/heart.png" id = "heartbeat" /></div >');

            get_NewPageTable(pageTableName);
            tableSelected.loaded = true;
        }
    }
}

$("#wcfresultmodal-close").click(function () {
    modal_close("wcf_error_result");
})

//HidUpdate
$("#updateHidBtn").click(async function () {
    await loadingAsync(true, $(this).prop("id"));
    await getHidUpdate();
})

async function getHidUpdate() {
    var index = arr_pagetables.findIndex(v => v.pagetable_id == "reimbursment_pagetable");
    var selectedItems = arr_pagetables[index].selectedItems;

    if (selectedItems.length > 0) {
        var data = [];
        selectedItems.forEach(function (item) {
            if (item.updatehid == "true")
                data.push(+item.id);
        });
        if (data.length > 0) {

            UpdateHidAsync(data).then(
                (result) => {
                    loadingAsync(false, $("#updateHidBtn").prop("id"));
                    if (result.successfull) {
                        arr_pagetables[index].selectedItems = [];
                     
                        arr_pagetables[index].pageNo = 0;
                        arr_pagetables[index].currentpage = 1;
                        get_NewPageTable("reimbursment_pagetable");
                    }
                    else if (result.data.length > 0) {
                        $("#result_row").html("");
                        var newSelecteds = [];
                        var str = "";
                        $.each(result.data, function (k, v) {
                            var id = v["id"];
                            newSelecteds.push(arr_pagetables[index].selectedItems.filter(a => a.id.toString() == id)[0]);

                            str += `<tr><td>${v['admissionHid']}</td><td>${v['errorMessage']}</td></tr>`;
                        });
                        arr_pagetables[index].selectedItems = [];
                        arr_pagetables[index].selectedItems = newSelecteds;
                     
                        arr_pagetables[index].pageNo = 0;
                        arr_pagetables[index].currentpage = 1;
                        get_NewPageTable("reimbursment_pagetable");

                        $("#result_row").append(str);
                        modal_show("wcf_error_result");
                    }
                },
                (result) => {
                    loadingAsync(false, $("#updateHidBtn").prop("id"));
                    return;
                })
        }
        else {
            loadingAsync(false, $("#updateHidBtn").prop("id"));
            var msgItem = alertify.warning("موردی برای ارسال وجود ندارد");
            msgItem.delay(alertify_delay);

            return;
        }
    }
    else {
        loadingAsync(false, $("#updateHidBtn").prop("id"));
        var msgItem = alertify.warning("حداقل یک مورد انتخاب نمایید");
        msgItem.delay(alertify_delay);
    }
}

async function UpdateHidAsync(data) {
    let response = await $.ajax({
        url: viewData_get_UpdateHid_url,
        type: "POST",
        dataType: "JSON",
        contentType: "application/json",
        cache: false,
        data: JSON.stringify(data),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_get_UpdateHid_url);
            return "";
        }
    });

    return response;
}

async function loadingAsync(loading, elementId) {

    if (loading)
        $(`#${elementId} i`).addClass(`fa fa-spinner fa-spin`);
    else
        $(`#${elementId} i`).removeClass("fa fa-spinner fa-spin").addClass("fa fa-save")
}

//EliminateHid
$("#eliminateHidBtn").click(async function () {
    await loadingAsync(true, $(this).prop("id"));
    await getEliminateUpdate();
})

async function getEliminateUpdate() {
    var index = arr_pagetables.findIndex(v => v.pagetable_id == "reimbursment_pagetable2");
    var selectedItems = arr_pagetables[index].selectedItems;
    if (selectedItems.length > 0) {
        var data = [];
        selectedItems.forEach(function (item) {
            if (item.eliminatehid == "true")
                data.push(+item.id);
        })
        if (data.length > 0) {

            EliminateHidAsync(data).then(
                (result) => {
                    loadingAsync(false, $("#eliminateHidBtn").prop("id"));
                    if (result.successfull) {
                        arr_pagetables[index].selectedItems = [];
                        arr_pagetables[index].pageNo = 0;
                        arr_pagetables[index].currentpage = 1;
                        get_NewPageTable("reimbursment_pagetable2");
                    }
                    else if (result.data.length > 0) {
                        $("#result_row").html("");
                        var newSelecteds = [];
                        var str = "";
                        $.each(result.data, function (k, v) {
                            var id = v["id"];
                            newSelecteds.push(arr_pagetables[index].selectedItems.filter(a => a.id.toString() == id)[0]);

                            str += `<tr><td>${v['admissionHid']}</td><td>${v['errorMessage']}</td></tr>`;
                        })
                        arr_pagetables[index].selectedItems = [];
                        arr_pagetables[index].selectedItems = newSelecteds;
                        arr_pagetables[index].pageNo = 0;
                        arr_pagetables[index].currentpage = 1;
                        get_NewPageTable("reimbursment_pagetable2");

                        $("#result_row").append(str);
                        modal_show("wcf_error_result");
                    }
                },
                (result) => {
                    loadingAsync(false, $("#eliminateHidBtn").prop("id"));
                    return;
                })
        }
        else {
            loadingAsync(false, $("#eliminateHidBtn").prop("id"));
            var msgItem = alertify.warning("موردی برای ارسال وجود ندارد");
            msgItem.delay(alertify_delay);
            return;
        }
    }
    else {
        loadingAsync(false, $("#eliminateHidBtn").prop("id"));
        var msgItem = alertify.warning("حداقل یک مورد انتخاب نمایید");
        msgItem.delay(alertify_delay);
    }
}

async function EliminateHidAsync(data) {
    let response = await $.ajax({
        url: viewData_get_EliminateHid_url,
        type: "POST",
        dataType: "JSON",
        contentType: "application/json",
        cache: false,
        data: JSON.stringify(data),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_get_EliminateHid_url);
            return "";
        }
    });

    return response;
}

//SavepatientBill
$("#savePatientBillBtn").click(async function () {
    await loadingAsync(true, $(this).prop("id"));
    await savePatientBill();
})

async function savePatientBill() {

    var index = arr_pagetables.findIndex(v => v.pagetable_id == "reimbursment_pagetable");
    var selectedItems = arr_pagetables[index].selectedItems;
    if (selectedItems.length > 0) {
        var data = [];
        selectedItems.forEach(function (item) {
            if (item.savepatientbill == "true")
                data.push(+item.id);
        })
        if (data.length > 0) {
            SavePatientBillAsync(data).then(
                (result) => {


                    loadingAsync(false, $("#savePatientBillBtn").prop("id"));
                    if (result.successfull) {
                        arr_pagetables[index].selectedItems = [];
                        arr_pagetables[index].pageNo = 0;
                        arr_pagetables[index].currentpage = 1;
                        get_NewPageTable("reimbursment_pagetable");
                    }
                    else if (result.data.length > 0) {
                        $("#result_row").html("");

                        var newSelecteds = [];
                        var str = "";
                        $.each(result.data, function (k, v) {
                            var id = v["id"];
                            newSelecteds.push(arr_pagetables[index].selectedItems.filter(a => a.id.toString() == id)[0]);
                            str += `<tr><td>${v['admissionHid']}</td><td>${v['errorMessage']}</td></tr>`;
                        })
                        arr_pagetables[index].selectedItems = [];
                        arr_pagetables[index].selectedItems = newSelecteds;
           
                        arr_pagetables[index].pageNo = 0;
                        arr_pagetables[index].currentpage = 1;
                        get_NewPageTable("reimbursment_pagetable");
                        $("#result_row").append(str);
                        
                        modal_show("wcf_error_result");
                    }
                },
                (result) => {
                    loadingAsync(false, $("#savePatientBillBtn").prop("id"));
                    return;
                })
        }
        else {
            loadingAsync(false, $("#savePatientBillBtn").prop("id"));
            var msgItem = alertify.warning("موردی برای ارسال وجود ندارد");
            msgItem.delay(alertify_delay);
            return;
        }
    }
    else {
        loadingAsync(false, $("#savePatientBillBtn").prop("id"));
        var msgItem = alertify.warning("حداقل یک مورد انتخاب نمایید");
        msgItem.delay(alertify_delay);
    }

}

async function SavePatientBillAsync(data) {
    let response = await $.ajax({
        url: viewData_SavepatientBill_url,
        type: "POST",
        dataType: "JSON",
        contentType: "application/json",
        cache: false,
        data: JSON.stringify(data),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_SavepatientBill_url);
            return "";
        }
    });

    return response;
}

//InsurerReimbursement
$("#getInsurerReimbursementBtn").click(async function () {
    await loadingAsync(true, $(this).prop("id"));
    await getInsurerReimbursement();
})

async function getInsurerReimbursement() {
    var index = arr_pagetables.findIndex(v => v.pagetable_id == "reimbursment_pagetable");
    var selectedItems = arr_pagetables[index].selectedItems;
    if (selectedItems.length > 0) {
        var data = [];
        selectedItems.forEach(function (item) {
            if (item.reimbursement == "true")
                data.push(+item.id);
        })
        if (data.length > 0) {

            InsurerReimbursementBillAsync(data).then(
                (result) => {
                    loadingAsync(false, $("#getInsurerReimbursementBtn").prop("id"));

                    if (result.successfull) {
                        arr_pagetables[index].selectedItems = [];
                        arr_pagetables[index].pageNo = 0;
                        arr_pagetables[index].currentpage = 1;
                        get_NewPageTable("reimbursment_pagetable");
                        fillReimbPackageResult(result.data.reimbPackage.reimbPackage);

                    }
                    else if (result.data.wcfResult.length > 0) {
                        $("#result_row").html("");
                        var newSelecteds = [];

                        var str = "";
                        $.each(result.data.wcfResult, function (k, v) {
                            var id = v["id"];
                            newSelecteds.push(arr_pagetables[index].selectedItems.filter(a => a.id.toString() == id)[0]);

                            str += `<tr><td>${v['admissionHid']}</td><td>${v['errorMessage']}</td></tr>`;
                        })
                        arr_pagetables[index].selectedItems = [];
                        arr_pagetables[index].selectedItems = newSelecteds;
                        arr_pagetables[index].pageNo = 0;
                        arr_pagetables[index].currentpage = 1;
                        get_NewPageTable("reimbursment_pagetable");
                        $("#result_row").append(str);
                        
                        modal_show("wcf_error_result");
                    }
                },
                (result) => {
                    loadingAsync(false, $("#getInsurerReimbursementBtn").prop("id"));
                    return;
                })
        }
        else {
            loadingAsync(false, $("#getInsurerReimbursementBtn").prop("id"));
            var msgItem = alertify.warning("موردی برای ارسال وجود ندارد");
            msgItem.delay(alertify_delay);

            return;
        }
    }
    else {
        loadingAsync(false, $("#getInsurerReimbursementBtn").prop("id"));
        var msgItem = alertify.warning("حداقل یک مورد انتخاب نمایید");
        msgItem.delay(alertify_delay);
    }

}

async function InsurerReimbursementBillAsync(data) {
    let response = await $.ajax({
        url: viewData_get_InsurerReimbursement_url,
        type: "POST",
        dataType: "JSON",
        contentType: "application/json",
        cache: false,
        data: JSON.stringify(data),
        success: function (result) {

            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_get_InsurerReimbursement_url);
            return "";
        }
    });

    return response;
}

//Prescription
$("#sendPrescriptionBtn").click(async function () {
    await loadingAsync(true, $(this).prop("id"));
    await sendPrescription();
})

async function sendPrescription() {

    var index = arr_pagetables.findIndex(v => v.pagetable_id == "prescreption_pagetable");
    var selectedItems = arr_pagetables[index].selectedItems;
    if (selectedItems.length > 0) {
        var data = [];

        selectedItems.forEach(function (item) {
            if (item.sendprescription == "true")
                data.push(+item.id);
        })
        if (data.length > 0) {

            sendPrescriptionAsync(data).then(
                (result) => {
                    loadingAsync(false, $("#sendPrescriptionBtn").prop("id"));
                    if (result.successfull) {
                        arr_pagetables[index].selectedItems = [];
           
                        arr_pagetables[index].pageNo = 0;
                        arr_pagetables[index].currentpage = 1;
                        get_NewPageTable("prescreption_pagetable");
                    }
                    else if (result.data.length > 0) {
                        $("#result_row").html("");
                        var newSelecteds = [];

                        var str = "";
                        $.each(result.data, function (k, v) {
                            var id = v["id"];
                            newSelecteds.push(arr_pagetables[index].selectedItems.filter(a => a.id.toString() == id)[0]);

                            str += `<tr><td>${v['admissionHid']}</td><td>${v['errorMessage']}</td></tr>`;
                        })
                        arr_pagetables[index].selectedItems = [];
                        arr_pagetables[index].selectedItems = newSelecteds;
                      
                        arr_pagetables[index].pageNo = 0;
                        arr_pagetables[index].currentpage = 1;
                        get_NewPageTable("prescreption_pagetable");
                        $("#result_row").append(str);
                        
                        modal_show("wcf_error_result");
                    }
                },
                (result) => {
                    loadingAsync(false, $("#sendPrescriptionBtn").prop("id"));
                    return;
                })
        }
        else {
            loadingAsync(false, $("#sendPrescriptionBtn").prop("id"));
            var msgItem = alertify.warning("موردی برای ارسال وجود ندارد");
            msgItem.delay(alertify_delay);
            return;
        }
    }
    else {
        loadingAsync(false, $("#sendPrescriptionBtn").prop("id"));
        var msgItem = alertify.warning("حداقل یک مورد انتخاب نمایید");
        msgItem.delay(alertify_delay);
    }

}

async function sendPrescriptionAsync(data) {
    let response = await $.ajax({
        url: viewData_SendPrescription_url,
        type: "POST",
        dataType: "JSON",
        contentType: "application/json",
        cache: false,
        data: JSON.stringify(data),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_SavepatientBill_url);
            return "";
        }
    });

    return response;
}

//Get PrescriptionHid
$("#prescriptionGetHidBtn").click(async function () {
    await loadingAsync(true, $(this).prop("id"));
    await getPrescriptionHid();
})

async function getPrescriptionHid() {

    var index = arr_pagetables.findIndex(v => v.pagetable_id == "prescreption_pagetable");
    var selectedItems = arr_pagetables[index].selectedItems;
    if (selectedItems.length > 0) {
        var data = [];

        selectedItems.forEach(function (item) {
            if (item.updatehid == "true")
                data.push(+item.id);
        })
        if (data.length > 0) {

            getPrescriptionHidAsync(data).then(
                (result) => {
                    loadingAsync(false, $("#prescriptionGetHidBtn").prop("id"));
                    if (result.successfull) {
                        arr_pagetables[index].selectedItems = [];
                        arr_pagetables[index].pageNo = 0;
                        arr_pagetables[index].currentpage = 1;
                        get_NewPageTable("prescreption_pagetable");
                    }
                    else if (result.data.length > 0) {
                        $("#result_row").html("");
                        var newSelecteds = [];

                        var str = "";
                        $.each(result.data, function (k, v) {
                            var id = v["id"];
                            newSelecteds.push(arr_pagetables[index].selectedItems.filter(a => a.id.toString() == id)[0]);

                            str += `<tr><td>${v['admissionHid']}</td><td>${v['errorMessage']}</td></tr>`;
                        })
                        arr_pagetables[index].selectedItems = [];
                        arr_pagetables[index].selectedItems = newSelecteds;
                        arr_pagetables[index].pageNo = 0;
                        arr_pagetables[index].currentpage = 1;
                        get_NewPageTable("prescreption_pagetable");

                        $("#result_row").append(str);
                        
                        modal_show("wcf_error_result");
                    }
                },
                (result) => {
                    loadingAsync(false, $("#prescriptionGetHidBtn").prop("id"));
                    return;
                })
        }
        else {
            loadingAsync(false, $("#prescriptionGetHidBtn").prop("id"));
            var msgItem = alertify.warning("موردی برای ارسال وجود ندارد");
            msgItem.delay(alertify_delay);

            return;
        }
    }
    else {
        loadingAsync(false, $("#prescriptionGetHidBtn").prop("id"));
        var msgItem = alertify.warning("حداقل یک مورد انتخاب نمایید");
        msgItem.delay(alertify_delay);
    }

}

async function getPrescriptionHidAsync(data) {

    let response = await $.ajax({
        url: viewData_GetPrescriptionHid_url,
        type: "POST",
        dataType: "JSON",
        contentType: "application/json",
        cache: false,
        data: JSON.stringify(data),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_GetPrescriptionHid_url);
            return "";
        }
    });

    return response;
}

function fill_NewPageTable(result, pageId = null, callBack = undefined) {

    if (pageId == null) pageId = "pagetable";
    if (!result) return "";

    let columns = result.columns.dataColumns,
        buttons = result.columns.buttons,
        list = result.data,
        columnsL = columns.length,
        listLength = list.length,
        buttonsL = (buttons != null && typeof (buttons) !== "undefined") ? buttons.length : 0,
        index = arr_pagetables.findIndex(v => v.pagetable_id == pageId),
        conditionTools = [],
        conditionAnswer = "",
        conditionElseAnswer = "";


    arr_pagetables[index].editable = result.columns.isEditable;
    arr_pagetables[index].selectable = result.columns.isSelectable;
    arr_pagetables[index].columns = columns;
    arr_pagetables[index].trediting = false;

    let pagetable_editable = arr_pagetables[index].editable,
        pagetable_selectedItems = arr_pagetables[index].selectedItems,
        pagetable_selectable = arr_pagetables[index].selectable,
        pagetable_highlightrowid = arr_pagetables[index].highlightrowid,
        pagetable_pagerowscount = arr_pagetables[index].pagerowscount,
        pagetable_currentpage = arr_pagetables[index].currentpage,
        pagetable_pageNo = arr_pagetables[index].pageNo,
        pagetable_endData = arr_pagetables[index].endData;


    var conditionResult = result.columns.conditionOn;
    if (conditionResult != "") {
        conditionTools = result.columns.condition;
        conditionAnswer = result.columns.answerCondition;
        conditionElseAnswer = result.columns.elseAnswerCondition;
    }
    else
        conditionResult = "noCondition";

    if (!pagetable_endData) {
        arr_pagetables[index].endData = listLength < pagetable_pagerowscount;

        let elm_pbody = $(`#${pageId} .pagetablebody`),
            btn_tbidx = 1000,
            str = "",
            rowLength = $(`#${pageId} .pagetablebody tbody tr:not(#emptyRow)`).length;

        if (pagetable_currentpage == 1) {
            let col = {}, width = 0;
            rowLength = 0;
            elm_pbody.html("");
            str += '<thead class="table-thead-fixed">';
            str += '<tr>';
            if (pagetable_editable == true)
                str += `<th style="width:${(+$(`#${pageId} .pagetablebody `).width() / 101) * 2}px"></th>`;
            if (pagetable_selectable == true)
                str += `<th style="width:${(+$(`#${pageId} .pagetablebody `).width() / 101) * 2}px;text-align:center !important"><input onchange="changeAll(this,'${pageId}')" ${typeof pagetable_selectedItems == "undefined" ?
                    "" : pagetable_selectedItems.length == list.length && list.length > 0 ? "checked" : ""} class="checkall" type = "checkbox" ></th >`;
            for (var i = 0; i < columnsL; i++) {
                col = columns[i];
                width = (+$(`#${pageId} .pagetablebody`).width() / 101) * +col.width;
                if (col.isDtParameter) {
                    str += '<th style="' + ((col.align == "center") ? ' text-align:' + col.align + '!important;' : '') + ((col.width != 0) ? ' width:' + width + 'px;' : '') + '"';
                    if (col.id != "action") {
                        if (col.order)
                            str += `class="headerSorting" id="header_${i}" data-type="" data-col="${col.id}" data-index="${i}" onclick="sortingButtonsByThNew(${result.columns.order},this,'${pageId}')"><span id="sortIconGroup" class="sortIcon-group">
                                <i id="desc_Col_${i}" data-col="${col.id}" data-index="${i}" data-type="desc" title="مرتب سازی نزولی" class="fa fa-long-arrow-alt-down sortIcon"></i>
                                <i id="asc_Col_${i}" data-col="${col.id}" data-index="${i}" data-type="asc" title="مرتب سازی صعودی" class="fa fa-long-arrow-alt-up sortIcon"></i>
                            </span>` + col.title + '</th>';
                        else
                            str += '>' + col.title + '</th>';
                    }
                    else
                        str += '>' + col.title + '</th>';
                }
            }

            str += '</tr>';
            str += '</thead>';
            str += '<tbody>';

        }
        else
            elm_pbody = $(`#${pageId} .pagetablebody tbody`);

        if (list.length == 0) {
            if (rowLength == 0)
                str += fillEmptyRow($(str).find("tr th").length);
        }
        else
            for (var i = 0; i < listLength; i++) {
                var item = list[i];
                var rowno = rowLength + i + 1;
                var colno = 0;
                var colwidth = 0;
                for (var j = 0; j < columnsL; j++) {
                    var primaries = "";


                    for (var k = 0; k < columnsL; k++) {
                        var v = columns[k];
                        if (v["isPrimary"] === true)
                            primaries += ' data-' + v["id"] + '="' + item[v["id"]] + '"';
                    }

                    colwidth = columns[j].width;
                    if (j == 0) {
                        if (conditionResult != "noCondition") {
                            if (pagetable_highlightrowid != 0 && item[columns[j].id] == pagetable_highlightrowid) {
                                str += '<tr' + primaries + ' class="highlight" id="row' + rowno + '" onkeydown="tr_onkeydownNew(`' + pageId + '`,this,event)" onclick="tr_onclick(`' + pageId + '`,this,event)" tabindex="-2"' + `
                             style="${eval(`${item[conditionTools[0].fieldName]} ${conditionTools[0].operator} ${conditionTools[0].fieldValue}`) ? conditionAnswer : conditionElseAnswer}"` + '>';
                            }
                            else {
                                str += '<tr' + primaries + ' id="row' + rowno + '" onkeydown="tr_onkeydownNew(`' + pageId + '`,this,event)" onclick="tr_onclick(`' + pageId + '`,this,event)" tabindex="-1"' + `
                             style="${eval(`${item[conditionTools[0].fieldName]} ${conditionTools[0].operator} ${conditionTools[0].fieldValue}`) ? conditionAnswer : conditionElseAnswer}"` + '>';
                            }
                        }
                        else {
                            if (pagetable_highlightrowid != 0 && item[columns[j].id] == pagetable_highlightrowid) {
                                str += '<tr' + primaries + ' class="highlight" id="row' + rowno + '" onkeydown="tr_onkeydownNew(`' + pageId + '`,this,event)" onclick="tr_onclick(`' + pageId + '`,this,event)" tabindex="-2">';
                            }
                            else {
                                str += '<tr' + primaries + ' id="row' + rowno + '" onkeydown="tr_onkeydownNew(`' + pageId + '`,this,event)" onclick="tr_onclick(`' + pageId + '`,this,event)" tabindex="-1">';
                            }
                        }
                        if (pagetable_editable == true)
                            str += `<td id="col_${rowno}_0" style="width:2%"></td>`;

                        if (pagetable_selectable == true) {
                            str += `<td id="col_${rowno}_1" style="width:2%;text-align:center"><input onchange="itemChange(this)" type="checkbox"`;

                            var validCount = 0;
                            var primaryCount = 0;
                            var isCol = false;

                            //var index = arr_pagetables.findIndex(v => v.pagetable_id == pageId);
                            var selectedItems = arr_pagetables[index].selectedItems;
                            $.each(selectedItems, function (k, v) {
                                $.each(v, function (key, val) {
                                    var column = columns.filter(a => a.id.toLowerCase() == key)[0];
                                    primaryCount += 1;
                                    if (item[column.id].toString() == val.toString())
                                        validCount += 1;
                                })
                                if (validCount == primaryCount)
                                    isCol = true;
                                primaryCount = 0;
                                validCount = 0;
                            })
                            if (isCol) {
                                str += 'checked />';
                            }
                            else {
                                str += '/>';
                            }
                            str += '</td >';

                        }
                    }
                    if (columns[j].isDtParameter) {
                        if (columns[j].id != "action") {
                            colno += 1;
                            var value = item[columns[j].id];
                            if (columns[j].editable) {
                                str += `<td ${columns[j].inputType == "select2" ? "data-select2='true'" : ""} id="col_${rowno}_${colno}" style="width:${colwidth}%;">`;

                                if (columns[j].inputType == "select") {
                                    str += `<select id="${columns[j].id}_${rowno}" class="form-control" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})" onfocus="tr_onfocus('${pageId}',${colno})"  disabled>`;
                                    str += `<option value="0">انتخاب کنید</option>`;

                                    var lenInput = columns[j].inputs != null ? columns[j].inputs.length : 0;

                                    for (var h = 0; h < lenInput; h++) {
                                        var input = columns[j].inputs[h];
                                        if (value != +input.id) {
                                            str += `<option value="${input.id}">${input.id} - ${input.name}</option>`;
                                        }
                                        else {
                                            str += `<option value="${input.id}" selected>${input.id} - ${input.name}</option>`;
                                        }
                                    }

                                    str += "</select>";
                                }
                                else if (columns[j].inputType == "dynamicSelect") {

                                    str += `<select class="form-control" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})" onfocus="tr_onfocus('${pageId}',${colno})"  disabled>`;
                                    str += `<option value="0">انتخاب کنید</option>`;
                                    var inputsName = `${columns[j].id}Inputs`;
                                    var lenInput = item[inputsName] != null ? item[inputsName].length : 0;

                                    for (var h = 0; h < lenInput; h++) {
                                        var input = item[inputsName][h];
                                        if (value != +input.id) {
                                            str += `<option value="${input.id}">${input.id} - ${input.name}</option>`;
                                        }
                                        else {
                                            str += `<option value="${input.id}" selected>${input.id} - ${input.name}</option>`;
                                        }
                                    }
                                    str += "</select>";
                                }
                                else if (columns[j].inputType == "datepersian") {

                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? value : ""}" class="form-control persian-date" data-inputmask="${columns[j].inputMask.mask}" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})"  onfocus="tr_onfocus('${pageId}',${colno})" placeholder="____/__/__" required maxlength="10" autocomplete="off" disabled />`;

                                }
                                else if (columns[j].inputType == "datepicker") {

                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? value : ""}" class="form-control persian-datepicker" data-inputmask="${columns[j].inputMask.mask}" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})"  onfocus="tr_onfocus('${pageId}',${colno})" placeholder="____/__/__" required maxlength="10" autocomplete="off" disabled />`;

                                }
                                else if (columns[j].inputType == "checkbox") {
                                    str += `<div class="funkyradio funkyradio-success" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})" onfocus="tr_onfocus('${pageId}',${colno})" disabled tabindex="-1">
                                            <input type="checkbox" name="checkbox" disabled id="btn_${rowno}_${colno}" ${value ? "checked" : ""} />
                                            <label for="btn_${rowno}_${colno}"></label>
                                        </div>`;
                                }
                                else if (columns[j].inputType == "searchPlugin") {
                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? value : ""}" class="form-control number searchPlugin" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})"  onfocus="tr_onfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" disabled>`;
                                }
                                else if (columns[j].inputType == "select2") {
                                    var onchange = `tr_object_onchange('${pageId}',this,${rowno},${colno})`;
                                    var nameVlue = "";
                                    if (columns[j].id.indexOf("Id") != -1) {
                                        var val = item[columns[j].id.replace("Id", "") + "Name"];
                                        nameVlue = val != null ? val : '';
                                    }
                                    else {
                                        var val = item[columns[j].id + "Name"];
                                        nameVlue = val != null ? val : '';
                                    }

                                    str += `<div>${nameVlue}</div>`
                                    str += `<div class="displaynone"><select data-value='${value}' class="form-control select2" id="${columns[j].id}_${rowno}" onchange="${onchange}" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})" onfocus="tr_onfocus('${pageId}',${colno})"  disabled>`;
                                    str += `<option value="0">انتخاب کنید</option>`;

                                    var lenInput = columns[j].inputs != null ? columns[j].inputs.length : 0;

                                    for (var h = 0; h < lenInput; h++) {
                                        var input = columns[j].inputs[h];
                                        if (value != +input.id) {
                                            str += `<option value="${input.id}">${input.id} - ${input.name}</option>`;
                                        }
                                        else {
                                            str += `<option value="${input.id}" selected>${input.id} - ${input.name}</option>`;
                                        }
                                    }

                                    str += "</select></div>";
                                }
                                else if (columns[j].inputType == "number")
                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? value : ""}" class="form-control number" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})"  onfocus="tr_onfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" disabled>`;
                                else if (columns[j].inputType == "money")
                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? transformNumbers.toComma(value) : ""}" class="form-control money" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})" onfocus="tr_onfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" disabled>`;
                                else if (columns[j].inputType == "decimal")
                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? value.toString() : ""}" class="form-control decimal" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})" onfocus="tr_onfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" disabled>`;
                                else
                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != null ? value : ''}" class="form-control" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})" onfocus="tr_onfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" disabled>`;
                            }
                            else if (columns[j].isReadOnly) {

                                str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%;">`;

                                if (columns[j].inputType == "number")
                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? value : ""}" class="form-control number" onfocus="tr_onfocus('${pageId}',${colno})" autocomplete="off" readonly>`;
                                else if (columns[j].inputType == "money")
                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? transformNumbers.toComma(value) : ""}" class="form-control money" onfocus="tr_onfocus('${pageId}',${colno})" autocomplete="off" readonly>`;
                                else if (columns[j].inputType == "decimal")
                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? value.toString(): ""}" class="form-control decimal" onfocus="tr_onfocus('${pageId}',${colno})"  autocomplete="off" readonly>`;
                                else
                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value}" class="form-control" onfocus="tr_onfocus('${pageId}',${colno})" autocomplete="off" readonly>`;

                                str += "</td>"
                            }
                            else {
                                if (columns[j].id.toLowerCase().indexOf('datetimepersian') >= 0) {
                                    if (value != null && value != "") {
                                        str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + ' width:' + colwidth + '%">' + value.substring(0, 10) + '<p class="mb-0 mt-neg-5">' + value.substring(11, 19); +'</p></td>';
                                    }
                                    else {
                                        str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%"></td>`;
                                    }
                                }
                                else if (columns[j].id.toLowerCase().indexOf('datepersian') >= 0) {
                                    if (value != null && value != "") {
                                        str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;"' : '') + ' width:' + colwidth + '%">' + value + '</td>';
                                    }
                                    else {
                                        str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%"></td>`;
                                    }
                                }
                                else if ((columns[j].type === 0 || columns[j].type === 8 || columns[j].type === 16 || columns[j].type === 20 || columns[j].type === 5 || columns[j].type === 6) || (columns[j].inputType == "ip")) {//number
                                    if (value != null && value != "") {
                                        if (value && columns[j].isCommaSep)
                                            value = transformNumbers.toComma(value)
                                        if (columns[j].type === 5) {
                                            value = value.toString();
                                        }
                                        str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + ' width:' + colwidth + '%">' + value + '</td>';
                                    }
                                    else {
                                        str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%"></td>`;
                                    }
                                }
                                else if (columns[j].type == 2) {//checkbox
                                    if (value == true)
                                        value = '<i class="fas fa-check"></i>';
                                    else
                                        value = '<i></i>';
                                    str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + ' width:' + colwidth + '%;">' + value + '</td>';
                                }
                                else if (columns[j].type == 21) {//img
                                    value = '<a href="javascript:showpicture(' + item[columns[j].id] + ');"><img src="data:image/png;base64,' + value + '" alt="" height="35"></a>'
                                    str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + ' width:' + colwidth + '%;">' + value + '</td>';
                                }
                                else {
                                    if (value != null && value != "") {
                                        let cls = "";

                                        if (value == "ارسال ناموفق")
                                            cls = "td-red-light";
                                        else if (value == "ارسال موفق" && columns[j].id == "updateHIDResultName")
                                            cls = "td-success1-light";
                                        else if (value == "ارسال موفق" && columns[j].id == "saveBillResultName")
                                            cls = "td-success2-light";
                                        else if (value == "ارسال موفق" && columns[j].id == "rembResultName")
                                            cls = "td-success3-light";
                                        else if (value == "ارسال موفق" && columns[j].id == "eliminateHIDResultName")
                                            cls = "td-success4-light";
                                        else if (value == "ارسال موفق" && columns[j].id == "sentResultName")
                                            cls = "td-success5-light";
                                        else if (value == "ارسال موفق" && columns[j].id == "getFeedbackResultName")
                                            cls = "td-success6-light";
                                        else if (value == "ارسال موفق" && columns[j].id == "getResultName")
                                            cls = "td-success7-light";
                                        else if (value == "ارسال موفق" && columns[j].id == "sendPrescriptionResultName")
                                            cls = "td-success7-light";

                                        str += `<td id="col_${rowno}_${colno}" style="${columns[j].align == "center" ? `text-align:${columns[j].align}!important;` : ''} width:${colwidth}%" class="${cls}">${value}</td>`;
                                    }
                                    else
                                        str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%"></td>`;
                                }
                            }
                        }
                        else {
                            colno += 1;

                            if (result.columns.actionType === "dropdown") {
                                str += `<td id="col_${rowno}_${colno}"  style="width:${colwidth}%">`;
                                if (window.innerWidth >= 1680)
                                    str += `<div class="dropdown">
                                    <button class="btn blue_outline_1 dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">عملیات</button>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">`;
                                else
                                    str += `<div class="dropdown">
                                    <button class="btn blue_outline_1 dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">`;

                                for (var k = 0; k < buttonsL; k++) {
                                    var btn = buttons[k];
                                    if (btn.isSeparator == false) {
                                        btn_tbidx++;
                                        str += `<button id="btn_${btn.name}" onclick="run_button_${btn.name}(${item[columns[0].id]},${rowno},this)" class="dropdown-item" title="${btn.title}" tabindex="${btn_tbidx}"><i class="${btn.iconName} ml-2"></i>${btn.title}</button>`;
                                    }
                                    else
                                        str += `<div class="button-seprator-hor"></div>`;
                                }

                                str += `</div>
                                </div>`;
                                str += '</td>';
                            }
                            else if (result.columns.actionType === "inline") {
                                str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%">`;

                                for (var k = 0; k < buttonsL; k++) {
                                    var btn = buttons[k];
                                    if (btn.isSeparator == false) {
                                        btn_tbidx++;
                                        str += `<button type="button" ${btn.isFocusInline == true ? 'data-isfocusinline="true"' : ''}  id="btn_${btn.name}" onclick="run_button_${btn.name}(${item[columns[0].id]},${rowno},this)" class="${btn.className}" data-toggle="tooltip" data-placement="bottom" title="${btn.title}" tabindex="${btn_tbidx}"><i class="${btn.iconName}"></i></button>`;
                                    }
                                    else
                                        str += `<span class="button-seprator-ver"></span>`;
                                }

                                str += '</td>';
                            }
                        }
                    }
                }
                str += '</tr>';
            }

        if (pagetable_currentpage == 1)
            str += '</tbody>';

        elm_pbody.append(str);
        afterFillPageTable(result, index, pagetable_currentpage, elm_pbody, pageId, columns, pagetable_pageNo, callBack);
    }

    //active icon sort
    $(`#${dataOrder.sort}_Col_${dataOrder.index}`).addClass("active-sortIcon");
    if (typeof $(`#header_${dataOrder.index}`).data() != "undefined") {
        $(`#header_${dataOrder.index}`).data().sort = dataOrder.sort;
    }
    $(`#${pageId} .loader`).remove();

}

var focusInputWebSevice = (tabNo, pageTableName) => {

    let firstInput = $(`.tabToggle${tabNo}`).find("[tabindex]:not(:disabled)").first();
    setTimeout(() => {
        $(firstInput).hasClass("select2") ? $(`#${firstInput.attr("id")}`).select2('focus') : firstInput.focus();
    }, 10);

    tabLazyLoad(pageTableName);
};

async function addServiceLinesWaitingAsync(rowNo) {

    $(`#reimbursment_pagetable #row${rowNo}`).addClass("operating-success");
}

async function removeServiceLinesWaitingAsync(rowNo) {

    $(`#reimbursment_pagetable #row${rowNo}`).removeClass("operating-success");
}

function run_button_showServiceLines(id, rowNo) {
    addServiceLinesWaitingAsync(rowNo)
    admissionId = id;
    $.ajax({
        url: viewData_get_AdmissionServiceLines_url,
        type: "POST",
        dataType: "JSON",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(id),
        success: function (result) {
            $("#serviceLine_row").html("");
            if (result != null && result.length > 0) {
                var str = "";
                $.each(result, function (k, v) {
                    str += `<tr>
                                 <td>${k + 1}</td>
                                 <td>${v['serviceId']}</td>
                                 <td>${v['serviceCode']}</td>
                                 <td>${v['serviceName']}</td>
                                 <td>${+v['serviceQuantity']}</td>
                                 <td>${+v['basicSharePrice']}</td>
                                 <td>${+v['compSharePrice']}</td>
                                 <td>${+v['patientSharePrice']}</td>
                                 <td>${+v['confirmedDeduction']}</td>
                            </tr>`;
                });

                $("#serviceLine_row").append(str);
                
                modal_show("wcf_error_result");
                removeServiceLinesWaitingAsync(rowNo)
            }
            else
                removeServiceLinesWaitingAsync(rowNo)
        },
        error: function (xhr) {
            error_handler(xhr, viewData_get_AdmissionServiceLines_url);
            removeServiceLinesWaitingAsync(rowNo)
            return "";
        }
    });
}

$("#serviceline-close").click(function () {
    modal_close("#serviceLine_modal");
})

$("#serviceLineExportCSV").click(function () {
    export_csv_report(admissionId)
})


$("#webSreviceFrom").on("change", "#reimbursment_pagetable tbody input[type='checkbox']", function () {
    saleListCheck();
})

function saleListCheck() {
    var index = arr_pagetables.findIndex(v => v.pagetable_id == "reimbursment_pagetable");
    var selectedItems = arr_pagetables[index].selectedItems;

    if (selectedItems.length > 0) {
        var notValidCount = 0;
        selectedItems.forEach(function (item) {
            if (item.updatehid == "false" && item.savepatientbill == "false" && item.reimbursement == "false")
                notValidCount += 1;
        })
        if (notValidCount == selectedItems.length) {
            var msgItem = alertify.warning("موارد انتخابی قابلیت ارسال ندارند");
            msgItem.delay(alertify_delay);
        }
    }
}

$("#webSreviceFrom").on("change", "#reimbursment_pagetable2 tbody input[type='checkbox']", function () {
    returnListCheck();
})


function returnListCheck() {
    var index = arr_pagetables.findIndex(v => v.pagetable_id == "reimbursment_pagetable2");
    var selectedItems = arr_pagetables[index].selectedItems;

    if (selectedItems.length > 0) {
        var notValidCount = 0;
        selectedItems.forEach(function (item) {
            if (item.eliminatehid == "false")
                notValidCount += 1;
        })
        if (notValidCount == selectedItems.length) {
            var msgItem = alertify.warning("موارد انتخابی قابلیت ارسال ندارند");
            msgItem.delay(alertify_delay);
        }
    }
}

$("#webSreviceFrom").on("change", "#reimbursment_pagetable3 tbody input[type='checkbox']", function () {


    admissionReferListCheck();
})


function admissionReferListCheck() {
    var index = arr_pagetables.findIndex(v => v.pagetable_id == "reimbursment_pagetable3");
    var selectedItems = arr_pagetables[index].selectedItems;
    
    if (selectedItems.length > 0) {
        var notValidCount = 0;
        selectedItems.forEach(function (item) {
            if (item.admissionrefer == "false")
                notValidCount += 1;
        })
        //if (notValidCount == selectedItems.length) {
        //    var msgItem = alertify.warning("موارد انتخابی قابلیت ارسال ندارند");
        //    msgItem.delay(alertify_delay);
        //}
    }
}

$("#webSreviceFrom").on("change", "#reimbursment_pagetable4 tbody input[type='checkbox']", function () {
    admissionFeedBackListCheck();
})


function admissionFeedBackListCheck() {
    var index = arr_pagetables.findIndex(v => v.pagetable_id == "reimbursment_pagetable4");
    var selectedItems = arr_pagetables[index].selectedItems;

    if (selectedItems.length > 0) {
        var notValidCount = 0;
        selectedItems.forEach(function (item) {
            if (item.admissionfeedback == "false")
                notValidCount += 1;
        })
        //if (notValidCount == selectedItems.length) {
        //    var msgItem = alertify.warning("موارد انتخابی قابلیت ارسال ندارند");
        //    msgItem.delay(alertify_delay);
        //}
    }
}


$("#webSreviceFrom").on("change", "#prescreption_pagetable tbody input[type='checkbox']", function () {
    prescreptionListCheck();
})


function prescreptionListCheck() {
    var index = arr_pagetables.findIndex(v => v.pagetable_id == "prescreption_pagetable");
    var selectedItems = arr_pagetables[index].selectedItems;

    if (selectedItems.length > 0) {
        var notValidCount = 0;
        selectedItems.forEach(function (item) {
            if (item.updatehid == "false" && item.sendprescription == "false")
                notValidCount += 1;
        })
        if (notValidCount == selectedItems.length) {
            var msgItem = alertify.warning("موارد انتخابی قابلیت ارسال ندارند");
            msgItem.delay(alertify_delay);
        }
    }
}


$("#webSreviceFrom").on("change", "#dental_pagetable tbody input[type='checkbox']", function () {
    admissionFeedBackListCheck();
})

$("#webSreviceFrom").on("change", "#death_pagetable tbody input[type='checkbox']", function () {
    admissionFeedBackListCheck();
})

$("#webSreviceFrom").on("change", "#medicallaboratory_pagetable tbody input[type='checkbox']", function () {
    admissionFeedBackListCheck();
})

function admissionFeedBackListCheck() {
    var index = arr_pagetables.findIndex(v => v.pagetable_id == "reimbursment_pagetable4");
    var selectedItems = arr_pagetables[index].selectedItems;

    if (selectedItems.length > 0) {
        var notValidCount = 0;
        selectedItems.forEach(function (item) {
            if (item.admissionfeedback == "false")
                notValidCount += 1;
        })
        //if (notValidCount == selectedItems.length) {
        //    var msgItem = alertify.warning("موارد انتخابی قابلیت ارسال ندارند");
        //    msgItem.delay(alertify_delay);
        //}
    }
}

async function addinsurerreimbursementWaitingAsync(rowNo) {
    $(`#reimbursment_pagetable #row${rowNo}`).addClass("operating-info");
}

async function removeinsurerreimbursementWaitingAsync(rowNo) {
    $(`#reimbursment_pagetable #row${rowNo}`).removeClass("operating-info");
}

function run_button_listinsurerreimbursement(Id, rowNo) {
    addinsurerreimbursementWaitingAsync(rowNo)

    $.ajax({
        url: viewData_insurerreimbursement_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(Id),
        success: function (result) {
            if (result.successfull) {
                insurerreimbursement = result.data.hidList;
                fiiarr_insurerreimbursement(insurerreimbursement);
                removeinsurerreimbursementWaitingAsync(rowNo)
            }
            else {
                var msgSend = alertify.warning(result.statusMessage);
                msgSend.delay(alertify_delay);
                removeinsurerreimbursementWaitingAsync(rowNo)
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_insurerreimbursement_url);
            removeinsurerreimbursementWaitingAsync(rowNo)
        }
    });
}

var fiiarr_insurerreimbursement = (insurerreimbursement) => {
    var temparr_insurerreimbursement = {};
    $("#tempInsurerreimbursementList").html("");
    if (insurerreimbursement) {
        for (var i = 0; i < insurerreimbursement.length; i++) {
            temparr_insurerreimbursement = insurerreimbursement[i];
            fillTableInsurerreimbursement(temparr_insurerreimbursement);
        }
    }
}

var fillTableInsurerreimbursement = (arr_Insurerre) => {

    var insurreDataOutput = "";
    if (arr_Insurerre) {
        var typeInsuerre = arr_Insurerre.assigner.toLowerCase();
        if (typeInsuerre == "tamin")
            typeInsuerre = "بیمه تامین اجتماعی";
        else if (typeInsuerre == "bitsa")
            typeInsuerre = "آزاد";
        else if (typeInsuerre == "ihio")
            typeInsuerre = "بیمه سلامت ";
        else
            typeInsuerre = "کد های تخصیص داده شده از سوی وزارت بهداشت";

        var emptyRow = $("#tempInsurerreimbursementList").find("#emptyRow");

        if (emptyRow.length > 0)
            $("#tempInsurerreimbursementList").html("");
        insurreDataOutput = `<tr>
                          <td>${arr_Insurerre.id}</td>
                          <td>${typeInsuerre}</td>
                     </tr>`

        $(insurreDataOutput).appendTo("#tempInsurerreimbursementList");
    }

    
    modal_show(`insurerreimbursementList`);

}

//activeReferallId
async function addactiveReferallIdWaitingAsync(rowNo) {
    $(`#reimbursment_pagetable3 #row${rowNo}`).addClass("operating-success");
}

async function removeactiveReferallIdWaitingAsync(rowNo) {
    $(`#reimbursment_pagetable3 #row${rowNo}`).removeClass("operating-success");
}

function run_button_activeReferallId(Id, rowNo) {
    addactiveReferallIdWaitingAsync(rowNo)

    $.ajax({
        url: viewData_getactivereferralid_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(Id),
        success: function (result) {
            if (result.successfull) {
                resActiveReferallId = result.data.referralIds;
                fiiarr_activeReferallId(resActiveReferallId);
                removeactiveReferallIdWaitingAsync(rowNo)
            }
            else {
                var msgSend = alertify.warning(result.statusMessage);
                msgSend.delay(alertify_delay);
                removeactiveReferallIdWaitingAsync(rowNo)
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getactivereferralid_url);
            removeactiveReferallIdWaitingAsync(rowNo)
        }
    });
}

var fiiarr_activeReferallId = (activeReferallId) => {
    var temparr_activeReferallId = {};
    $("#tempActiveReferallIdList").html("");
    if (activeReferallId) {
        for (var i = 0; i < activeReferallId.length; i++) {
            temparr_activeReferallId = activeReferallId[i];
            fillTableActiveReferallId(temparr_activeReferallId);
        }
    }
}

var fillTableActiveReferallId = (arr) => {

    var insurreDataOutput = "";
    if (arr) {
        var nameAssigner = arr.assigner.toLowerCase();
        if (nameAssigner == "tamin")
            nameAssigner = "بیمه تامین اجتماعی";
        else if (nameAssigner == "bitsa")
            nameAssigner = "آزاد";
        else
            nameAssigner = "بیمه سلامت ";

        var nameType = arr.type.toLowerCase();
        if (nameType == "tamin")
            nameType = "بیمه تامین اجتماعی";
        else if (nameType == "bitsa")
            nameType = "آزاد";
        else
            nameType = "بیمه سلامت ";

        var emptyRow = $("#tempActiveReferallIdList").find("#emptyRow");

        if (emptyRow.length > 0)
            $("#tempActiveReferallIdList").html("");
        insurreDataOutput = `<tr>
                          <td>${nameAssigner}</td>
                          <td>${arr.id}</td>
                          <td>${nameType}</td>
                     </tr>`

        $(insurreDataOutput).appendTo("#tempActiveReferallIdList");
    }
    
    modal_show(`activeReferallIdList`);
}

//sendReferall
$("#sendReferallBtn").click(async function () {
    await loadingAsync(true, $(this).prop("id"));
    await sendReferall();
})

async function sendReferall() {
    

    var index = arr_pagetables.findIndex(v => v.pagetable_id == "reimbursment_pagetable3");
    var selectedItems = arr_pagetables[index].selectedItems;
    if (selectedItems.length > 0) {
        var data = [];
        selectedItems.forEach(function (item) {
            if (item.admissionrefer == "true")
                data.push(+item.id);
        });
       // if (data.length > 0) {

            SendReferallAsync(data).then(
                (result) => {
                    loadingAsync(false, $("#sendReferallBtn").prop("id"));
                    if (result.successfull) {
                        arr_pagetables[index].selectedItems = [];
                        arr_pagetables[index].pageNo = 0;
                        arr_pagetables[index].currentpage = 1;
                        get_NewPageTable("reimbursment_pagetable3");
                    }
                    else if (result.data.length > 0) {
                        $("#result_row").html("");
                        var newSelecteds = [];
                        var str = "";
                        $.each(result.data, function (k, v) {
                            var id = v["id"];
                            newSelecteds.push(arr_pagetables[index].selectedItems.filter(a => a.id.toString() == id)[0]);

                            str += `<tr><td>${v['admissionHid']}</td><td>${v['errorMessage']}</td></tr>`;
                        });
                        arr_pagetables[index].selectedItems = [];
                        arr_pagetables[index].selectedItems = newSelecteds;
                        arr_pagetables[index].pageNo = 0;
                        arr_pagetables[index].currentpage = 1;
                        get_NewPageTable("reimbursment_pagetable3");

                        $("#result_row").append(str);
                        
                        modal_show("wcf_error_result");
                    }
                },
                (result) => {
                    loadingAsync(false, $("#sendReferallBtn").prop("id"));
                    return;
                })
        //}
        //else {
        //    loadingAsync(false, $("#sendReferallBtn").prop("id"));
        //    var msgItem = alertify.warning("موردی برای ارسال وجود ندارد");
        //    msgItem.delay(alertify_delay);

        //    return;
        //}
    }
    else {
        loadingAsync(false, $("#sendReferallBtn").prop("id"));
        var msgItem = alertify.warning("حداقل یک مورد انتخاب نمایید");
        msgItem.delay(alertify_delay);
    }
}

async function SendReferallAsync(data) {
    let response = await $.ajax({
        url: viewData_sendReferallPatientRecord_url,
        type: "POST",
        dataType: "JSON",
        contentType: "application/json",
        cache: false,
        data: JSON.stringify(data),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_sendReferallPatientRecord_url);
            return "";
        }
    });

    return response;
}

//getFeedBack
$("#sendFeedBackBtn").click(async function () {
    await loadingAsync(true, "sendFeedBackBtn");
    await sendFeedBack();
})

async function sendFeedBack() {
    
    var index = arr_pagetables.findIndex(v => v.pagetable_id == "reimbursment_pagetable4");
    var selectedItems = arr_pagetables[index].selectedItems;

    if (selectedItems.length > 0) {
        var data = [];
        selectedItems.forEach(function (item) {
           // if (item.admissionfeedback == "true")
                data.push(+item.id);
        });
      //  if (data.length > 0) {

            SendFeedBackAsync(data).then(
                (result) => {
                    loadingAsync(false, "sendFeedBackBtn");
                    if (result.successfull) {
                        arr_pagetables[index].selectedItems = [];
                        arr_pagetables[index].pageNo = 0;
                        arr_pagetables[index].currentpage = 1;
                        get_NewPageTable("reimbursment_pagetable4");
                    }
                    else if (result.data.length > 0) {
                        $("#result_row").html("");
                        var newSelecteds = [];
                        arr_pagetables[index].pageNo = 0;
                        arr_pagetables[index].currentpage = 1;
                        get_NewPageTable("reimbursment_pagetable4");
                        var str = "";
                        $.each(result.data, function (k, v) {
                            var id = v["id"];
                            newSelecteds.push(arr_pagetables[index].selectedItems.filter(a => a.id.toString() == id)[0]);

                            str += `<tr><td>${v['admissionHid']}</td><td>${v['errorMessage']}</td></tr>`;
                        });
                        arr_pagetables[index].selectedItems = [];
                        arr_pagetables[index].selectedItems = newSelecteds;
                        arr_pagetables[index].pageNo = 0;
                        arr_pagetables[index].currentpage = 1;
                        get_NewPageTable("reimbursment_pagetable4");

                        $("#result_row").append(str);
                        
                        modal_show("wcf_error_result");
                    }
                },
                (result) => {
                    loadingAsync(false, "sendFeedBackBtn");
                    return;
                })
    }
    else {
        loadingAsync(false, "sendFeedBackBtn");
        var msgItem = alertify.warning("حداقل یک مورد انتخاب نمایید");
        msgItem.delay(alertify_delay);
    }
}

async function SendFeedBackAsync(data) {
    let response = await $.ajax({
        url: viewData_sendFeedBackPatientRecord_url,
        type: "POST",
        dataType: "JSON",
        contentType: "application/json",
        cache: false,
        data: JSON.stringify(data),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_sendFeedBackPatientRecord_url);
            return "";
        }
    });

    return response;
}


//sendDental
$("#sendDentalBtn").click(async function () {

    await loadingAsync(true, $(this).prop("id"));
    await sendDental();
})

async function sendDental() {

    var index = arr_pagetables.findIndex(v => v.pagetable_id == "dental_pagetable");
    var selectedItems = arr_pagetables[index].selectedItems;
    if (selectedItems.length > 0) {
        var data = [];
        selectedItems.forEach(function (item) {
            if (item.admissiondental == "true")
                data.push(+item.id);
        });
        //if (data.length > 0) {

            SendDentalAsync(data).then(
                (result) => {
                    loadingAsync(false, $("#sendDentalBtn").prop("id"));
                    if (result.successfull) {
                        arr_pagetables[index].selectedItems = [];
              
                        arr_pagetables[index].pageNo = 0;
                        arr_pagetables[index].currentpage = 1;
                        get_NewPageTable("dental_pagetable");
                    }
                    else if (result.data.length > 0) {
                        $("#result_row").html("");
                        var newSelecteds = [];
                        var str = "";
                        $.each(result.data, function (k, v) {
                            var id = v["id"];
                            newSelecteds.push(arr_pagetables[index].selectedItems.filter(a => a.id.toString() == id)[0]);

                            str += `<tr><td>${v['admissionHid']}</td><td>${v['errorMessage']}</td></tr>`;
                        });
                        arr_pagetables[index].selectedItems = [];
                        arr_pagetables[index].selectedItems = newSelecteds;
                   
                        arr_pagetables[index].pageNo = 0;
                        arr_pagetables[index].currentpage = 1;
                        get_NewPageTable("dental_pagetable");

                        $("#result_row").append(str);
                        
                        modal_show("wcf_error_result");
                    }
                },
                (result) => {
                    loadingAsync(false, $("#sendDentalBtn").prop("id"));
                    return;
                })
        //}
        //else {
        //    loadingAsync(false, $("#sendDentalBtn").prop("id"));
        //    var msgItem = alertify.warning("موردی برای ارسال وجود ندارد");
        //    msgItem.delay(alertify_delay);

        //    return;
        //}
    }
    else {
        loadingAsync(false, $("#sendDentalBtn").prop("id"));
        var msgItem = alertify.warning("حداقل یک مورد انتخاب نمایید");
        msgItem.delay(alertify_delay);
    }
}

async function SendDentalAsync(data) {

    let response = await $.ajax({
        url: viewData_sendDentalPatientRecord_url,
        type: "POST",
        dataType: "JSON",
        contentType: "application/json",
        cache: false,
        data: JSON.stringify(data),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_sendDentalPatientRecord_url);
            return "";
        }
    });

    return response;
}
//sendDental

//sendDeath
//sendDental
$("#sendDeathBtn").click(async function () {

    await loadingAsync(true, $(this).prop("id"));
    await sendDeath();
})

async function sendDeath() {
    var index = arr_pagetables.findIndex(v => v.pagetable_id == "death_pagetable");
    var selectedItems = arr_pagetables[index].selectedItems;
    if (selectedItems.length > 0) {
        var data = [];
        selectedItems.forEach(function (item) {
            if (item.deathcertificate == "true")
                data.push(+item.id);
        });
        if (data.length > 0) {


            SendDeathAsync(data).then(
                (result) => {
                    loadingAsync(false, $("#sendDeathBtn").prop("id"));
                    if (result.successfull) {
                        arr_pagetables[index].selectedItems = [];
                  
                        arr_pagetables[index].pageNo = 0;
                        arr_pagetables[index].currentpage = 1;
                        get_NewPageTable("death_pagetable");
                    }
                    else if (result.data.length > 0) {
                        $("#result_row").html("");
                        var newSelecteds = [];
                        var str = "";
                        $.each(result.data, function (k, v) {
                            var id = v["id"];
                            newSelecteds.push(arr_pagetables[index].selectedItems.filter(a => a.id.toString() == id)[0]);

                            str += `<tr><td>${v['admissionHid']}</td><td>${v['errorMessage']}</td></tr>`;
                        });

                        arr_pagetables[index].selectedItems = [];
                        arr_pagetables[index].selectedItems = newSelecteds;
              
                        arr_pagetables[index].pageNo = 0;
                        arr_pagetables[index].currentpage = 1;
                        get_NewPageTable("death_pagetable");

                        $("#result_row").append(str);
                        
                        modal_show("wcf_error_result");
                    }
                },
                (result) => {
                    loadingAsync(false, $("#sendDeathBtn").prop("id"));
                    return;
                })
        }
        else {
            loadingAsync(false, $("#sendDeathBtn").prop("id"));
            var msgItem = alertify.warning("موردی برای ارسال وجود ندارد");
            msgItem.delay(alertify_delay);

            return;
        }
    }
    else {
        loadingAsync(false, $("#sendDeathBtn").prop("id"));
        var msgItem = alertify.warning("حداقل یک مورد انتخاب نمایید");
        msgItem.delay(alertify_delay);
    }
}

async function SendDeathAsync(data) {

    let response = await $.ajax({
        url: viewData_sendDeathCertificatePatientRecord_url,
        type: "POST",
        dataType: "JSON",
        contentType: "application/json",
        cache: false,
        data: JSON.stringify(data),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_sendDeathCertificatePatientRecord_url);
            return "";
        }
    });

    return response;
}

//sendDeath

//MediacalLaboratory
$("#sendMedicalLaboratoryBtn").click(async function () {

    await loadingAsync(true, $(this).prop("id"));
    await sendMedicalLaboratory();
})

async function sendMedicalLaboratory() {

    var index = arr_pagetables.findIndex(v => v.pagetable_id == "medicallaboratory_pagetable");
    var selectedItems = arr_pagetables[index].selectedItems;
    if (selectedItems.length > 0) {
        var data = [];
        selectedItems.forEach(function (item) {
            if (item.admissionmedicallaboratory == "true")
                data.push(+item.id);
        });
        if (data.length > 0) {

            SendMedicalLaboratoryAsync(data).then(
                (result) => {
                    loadingAsync(false, $("#sendMedicalLaboratoryBtn").prop("id"));
                    if (result.successfull) {
                        arr_pagetables[index].selectedItems = [];
                     
                        arr_pagetables[index].pageNo = 0;
                        arr_pagetables[index].currentpage = 1;
                        get_NewPageTable("medicallaboratory_pagetable");
                    }
                    else if (result.data.length > 0) {
                        $("#result_row").html("");
                        var newSelecteds = [];
                        var str = "";
                        $.each(result.data, function (k, v) {
                            var id = v["id"];
                            newSelecteds.push(arr_pagetables[index].selectedItems.filter(a => a.id.toString() == id)[0]);

                            str += `<tr><td>${v['admissionHid']}</td><td>${v['errorMessage']}</td></tr>`;
                        });
                        arr_pagetables[index].selectedItems = [];
                        arr_pagetables[index].selectedItems = newSelecteds;
                        
                        arr_pagetables[index].pageNo = 0;
                        arr_pagetables[index].currentpage = 1;
                        get_NewPageTable("medicallaboratory_pagetable");

                        $("#result_row").append(str);
                        
                        modal_show("wcf_error_result");
                    }
                },
                (result) => {
                    loadingAsync(false, $("#sendMedicalLaboratoryBtn").prop("id"));
                    return;
                })
        }
        else {
            loadingAsync(false, $("#sendMedicalLaboratoryBtn").prop("id"));
            var msgItem = alertify.warning("موردی برای ارسال وجود ندارد");
            msgItem.delay(alertify_delay);

            return;
        }
    }
    else {
        loadingAsync(false, $("#sendMedicalLaboratoryBtn").prop("id"));
        var msgItem = alertify.warning("حداقل یک مورد انتخاب نمایید");
        msgItem.delay(alertify_delay);
    }
}

async function SendMedicalLaboratoryAsync(data) {

    let response = await $.ajax({
        url: viewData_sendMedicalLaboratoryRecord_url,
        type: "POST",
        dataType: "JSON",
        contentType: "application/json",
        cache: false,
        data: JSON.stringify(data),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_sendMedicalLaboratoryRecord_url);
            return "";
        }
    });

    return response;
}
//sendDental

//End
tabLazyLoad("reimbursment_pagetable");

//NewAdmission
function navigateToModalAdmission(href, titlePage = null) {

    initialPage();
    $("#contentNewAdmission #content-page").addClass("displaynone");
    $("#contentNewAdmission #loader").removeClass("displaynone");
    $.ajax({
        url: href,
        type: "get",
        datatype: "html",
        contentType: "application/html; charset=utf-8",
        async: false,
        cache: false,
        dataType: "html",
        success: function (result) {
            $(`#contentNewAdmission`).html(result);
            modal_show("newAdmFormModal");
        },
        error: function (xhr) {
            error_handler(xhr, href);
        }
    });


    $("#contentNewAdmission #loader").addClass("displaynone");
    $("#contentNewAdmission #content-page").fadeIn().removeClass("displaynone").css("margin", 0);
    $("#contentNewAdmission #form,#contentNewAdmission .content").css("margin", 0);
    $("#contentNewAdmission #form .header-title .button-items #list_adm ,#contentNewAdmission #form .header-title .button-items #newForm").remove();
}

function modal_close_newAdm() {
    modal_close("newAdmFormModal");
    let index = arr_pagetables.findIndex(v => v.pagetable_id == "reimbursment_pagetable");
    arr_pagetables[index].pageNo = 0;
    get_NewPageTable("reimbursment_pagetable");

}

function run_button_edit(id) {
    //var checkIp = checkExistIpCash();
    var cashier = getCashIdByUserId()

    if (cashier !== null) {
        navigateToModalAdmission(`/MC/Admission/newform/${id}`, "پذیرش");
        isReimburesment = true;
    }
    else
        alertify.warning(`شما اجازه دسترسی به این بخش را ندارید`);
}

$("#newAdmFormModal").on("hidden.bs.modal", function () {
    $(`#admission .pagetablebody tr.highlight`).focus()
});
//NewAdmission


//ReimbPackage

function fillReimbPackageResult(result) {
    
    modal_show("getInsurerReimbursementModal");

    resetAllReimbPackageData();

    if (result.compositionField !== null)
        fillReimbCompositionField(result.compositionField);

    if (result.msgIDField !== null)
        fillReimbMsgIDField(result.msgIDField);

    if (result.personField !== null)
        fillReimbPersonField(result.personField);
}

function fillReimbCompositionField(result) {
    let output = "", outputSum = "", tempObject = {}, tempLength = 0, tempSubObject = {}, tempSubLength = 0, modelMony = {};

    //AdmissionField
    if (result.admissionField !== null) {
        tempObject = result.admissionField;
        let tempWardStr = `${tempObject.admissionWardField == null ? "-" : `${tempObject.admissionWardField.nameField == null ? " " : tempObject.admissionWardField.nameField} - ${tempObject.admissionWardField.roomField == null ? " " : tempObject.admissionWardField.roomField} - ${tempObject.admissionWardField.bedField == null ? " " : tempObject.admissionWardField.bedField}`}`;

        output = `<tr onclick="clickTrTable(event)">
                    <td>${createDateTimeString(tempObject.admissionDateField, "date")}</td>
                    <td>${createDateTimeString(tempObject.admissionTimeField, "time")}</td>
                    <td>${createIdinTitleString(tempObject.admissionTypeField)}</td>
                    <td>${tempWardStr}</td>
                    <td>${createFirstLastNameString(tempObject.admittingDoctorField)}</td>
                    <td>${createFirstLastNameString(tempObject.attendingDoctorField)}</td>
                    <td>${tempObject.instituteField == null ? "-" : tempObject.instituteField.nameField == null ? "" : tempObject.instituteField.nameField}</td>
                    <td>${tempObject.medicalRecordNumberField == null ? "-" : tempObject.medicalRecordNumberField}</td>
                    <td>${createIdinTitleString(tempObject.reasonForEncounterField)}</td>
                    <td>${createFirstLastNameString(tempObject.referringDoctorField)}</td>
                  </tr>`;

        $(output).appendTo("#tempAdmissionField");
    }

    //diagnosisField
    if (result.diagnosisField !== null && result.diagnosisField.length > 0) {
        tempLength = result.diagnosisField.length;
        for (var i = 0; i < tempLength; i++) {
            tempObject = result.diagnosisField[i];
            output = `<tr onclick="clickTrTable(event)">
                    <td>${i + 1}</td>
                    <td>${createIdinTitleString(tempObject.statusField)}</td>
                    <td>${createIdinTitleString(tempObject.diagnosisField)}</td>
                    <td>${tempObject.severityField == null ? "-" : createIdinTitleString(tempObject.severityField.symbolField)}</td>
                    <td>${tempObject.commentField == null ? "-" : tempObject.commentField}</td>
                  </tr>`;

            $(output).appendTo("#tempdiagnosisField");
        }
    }

    //dischargeField
    if (result.dischargeField !== null) {
        tempObject = result.dischargeField;
        output = `<tr onclick="clickTrTable(event)">
                    <td>${createDateTimeString(tempObject.dischargeDateField, "date")}</td>
                    <td>${createDateTimeString(tempObject.dischargeTimeField, "time")}</td>
                    <td>${createIdinTitleString(tempObject.conditionOnDischargeField)}</td>
                  </tr>`;

        $(output).appendTo("#tempdischargeField");
    }

    //insuranceField
    if (result.insuranceField !== null && result.insuranceField.length > 0) {
        tempLength = result.insuranceField.length;
        for (var i = 0; i < tempLength; i++) {
            tempObject = result.insuranceField[i];
            output = `<tr onclick="clickTrTable(event)">
                    <td>${i + 1}</td>
                    <td>${createIdinTitleString(tempObject.insurerField)}</td>
                    <td>${createIdinTitleString(tempObject.insuranceBoxField)}</td>
                    <td>${tempObject.insuranceBookletSerialNumberField == null ? "-" : tempObject.insuranceBookletSerialNumberField}</td>
                    <td>${createDateTimeString(tempObject.insuranceExpirationDateField, "date")}</td>
                    <td>${tempObject.insuredNumberField == null ? "-" : tempObject.insuredNumberField}</td>
                    <td>${tempObject.sHEBADField == null ? "-" : tempObject.sHEBADField.idField == null ? "" : tempObject.sHEBADField.idField}</td>
                  </tr>`;

            $(output).appendTo("#tempinsuranceField");
        }
    }

    //reimbursementSummaryField
    if (result.reimbursementSummaryField !== null) {
        tempObject = result.reimbursementSummaryField;
        output = `<tr onclick="clickTrTable(event)">
                    <td>${createIdinTitleString(tempObject.globalPackageField)}</td>
                    <td>${tempObject.hospitalAccreditationField == null ? "-" : tempObject.hospitalAccreditationField}</td>
                    <td>${createIdinTitleString(tempObject.insurerField)}</td>
                    <td>${createIdinTitleString(tempObject.insurerBoxField)}</td>
                    <td>${createIdinTitleString(tempObject.medicalRecordTypeField)}</td>
                    <td>${createMoneyString(tempObject.totalBasicInsuranceContributionField, "Summary_totalBasicInsuranceContributionField")}</td>
                    <td>${createMoneyString(tempObject.totalChargeField, "Summary_totalChargeField")}</td>
                    <td class="highlight-danger">${createMoneyString(tempObject.totalDeductionField.deductionField, "Summary_totalChargeField")}</td>
                    <td><a class="itemLink" onclick="showModelMony('reimbursementSummaryField')">نمایش</a></td>
                    <td>${createMoneyString(tempObject.totalPatientContributionField, "Summary_totalPatientContributionField")}</td>
                  </tr>`;

        $(output).appendTo("#tempreimbursementSummaryField");

        //totalOtherCostsField
        if (tempObject.totalOtherCostsField !== null && tempObject.totalOtherCostsField.length > 0) {
            tempSubLength = tempObject.totalOtherCostsField.length;
            for (var ix = 0; ix < tempSubLength; ix++) {
                tempSubObject = tempObject.totalOtherCostsField[ix];
                modelMony = {
                    id: `reimbursementSummaryField`,
                    name: createIdinTitleString(tempSubObject.nameField),
                    value: createMoneyString(tempSubObject.valueField, `reimbursementSummaryField`)
                };
                moneyTools.arrayMoneyModal.push(modelMony);
            }
        }

        outputSum = `<tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td class="font-weight-bold">${getAllSumSubMoneys("reimbursementSummaryField")}</td>
                    <td></td>
                  </tr>`;

        $(outputSum).appendTo("#tempreimbursementSummaryFieldSum");

        //reimbursementServiceGroupRowField
        if (tempObject.reimbursementServiceGroupRowField !== null && tempObject.reimbursementServiceGroupRowField.length > 0)
            fillReimbursementServiceGroupRowField(tempObject.reimbursementServiceGroupRowField);

    }


    //reimbursementServicesField
    if (result.reimbursementServicesField !== null && result.reimbursementServicesField.length > 0) {
        tempLength = result.reimbursementServicesField.length;
        for (var i = 0; i < tempLength; i++) {
            tempObject = result.reimbursementServicesField[i];
            output = `<tr onclick="clickTrTable(event)">
                    <td>${i + 1}</td>
                    <td>${createIdinTitleString(tempObject.wardTypeField)}</td>
                    <td>${tempObject.wardNameField == null ? "-" : tempObject.wardNameField}</td>
                    <td>${tempObject.roomField == null ? "-" : tempObject.roomField}</td>
                    <td>${tempObject.bedField == null ? "-" : tempObject.bedField}</td>
                    <td>${tempObject.pKIDField == null ? "-" : tempObject.pKIDField}</td>
                    <td>${createDateTimeString(tempObject.startDateField, "date")}</td>
                    <td>${createDateTimeString(tempObject.startTimeField, "time")}</td>
                    <td>${createDateTimeString(tempObject.endTimeField, "date")}</td>
                    <td>${createDateTimeString(tempObject.endDateField, "time")}</td>
                    <td>${createIdinTitleString(tempObject.serviceField)}</td>
                    <td>${createMoneyString(tempObject.serviceCountField, "Sv_serviceCountField")}</td>
                    <td>${createFirstLastNameString(tempObject.serviceProviderField)}</td>
                    <td>${createIdinTitleString(tempObject.serviceTypeField)}</td>
                    <td>${createMoneyString(tempObject.basicInsuranceContributionField, "Sv_basicInsuranceContributionField")}</td>
                    <td><a class="itemLink" onclick="showModelMony('tempreimbursementServicesField_deductionField_${i}',true)">نمایش</a></td>
                    <td><a class="itemLink" onclick="showModelMony('tempreimbursementServicesField_otherCostsField_${i}')">نمایش</a></td>
                    <td>${createMoneyString(tempObject.patientContributionField, "Sv_patientContributionField")}</td>
                    <td>${createMoneyString(tempObject.totalChargeField, "Sv_totalChargeField")}</td>
                  </tr>`;

            $(output).appendTo("#tempreimbursementServicesField");

            //deductionField
            if (tempObject.deductionField !== null && tempObject.deductionField.length > 0) {
                tempSubLength = tempObject.deductionField.length;
                for (var ix = 0; ix < tempSubLength; ix++) {
                    tempSubObject = tempObject.deductionField[ix];
                    modelMony = {
                        id: `tempreimbursementServicesField_deductionField_${i}`,
                        name: createIdinTitleString(tempSubObject.deductionTypeField),
                        value: createMoneyString(tempSubObject.deductionField, `tempreimbursementServicesField_deductionField_${i}`)
                    };
                    moneyTools.arrayMoneyModal.push(modelMony);
                }
            }

            //otherCostsField
            if (tempObject.otherCostsField !== null && tempObject.otherCostsField.length > 0) {
                tempSubLength = tempObject.otherCostsField.length;
                for (var ix = 0; ix < tempSubLength; ix++) {
                    tempSubObject = tempObject.otherCostsField[ix];
                    modelMony = {
                        id: `tempreimbursementServicesField_otherCostsField_${i}`,
                        name: createIdinTitleString(tempSubObject.nameField),
                        value: createMoneyString(tempSubObject.valueField, `tempreimbursementServicesField_otherCostsField_${i}`)
                    };
                    moneyTools.arrayMoneyModal.push(modelMony);
                }
            }

            if (i + 1 == tempLength) {
                outputSum = `<tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td class="font-weight-bold">${createSumString("Sv_serviceCountField")}</td>
                    <td></td>
                    <td></td>
                    <td class="font-weight-bold">${createSumString("Sv_basicInsuranceContributionField")}</td>
                    <td class="font-weight-bold">${getAllSumSubMoneys("tempreimbursementServicesField_deductionField", tempLength)}</td>
                    <td class="font-weight-bold">${getAllSumSubMoneys("tempreimbursementServicesField_otherCostsField", tempLength)}</td>
                    <td class="font-weight-bold">${createSumString("Sv_patientContributionField")}</td>
                    <td class="font-weight-bold">${createSumString("Sv_totalChargeField")}</td>
                  </tr>`;

                $(outputSum).appendTo("#tempreimbursementServicesFieldSum");
            }
        }
    }

}

function fillReimbursementServiceGroupRowField(result) {

    let output = "", outputSum = "", tempObject = {}, tempLength = 0, tempSubObject = {}, tempSubLength = 0, modelMony = {};

    tempLength = result.length;
    for (var j = 0; j < tempLength; j++) {
        tempObject = result[j];
        output = `<tr onclick="clickTrTable(event)">
                    <td>${j + 1}</td>
                    <td>${createIdinTitleString(tempObject.serviceTypeField)}</td>
                    <td>${createMoneyString(tempObject.serviceCountField, "Group_serviceCountField")}</td>
                    <td>${createMoneyString(tempObject.basicInsuranceContributionField, "Group_basicInsuranceContributionField")}</td>
                    <td class="highlight-danger">${createMoneyString(tempObject.deductionField.deductionField, "Group_deductionField")}</td>
                    <td><a class="itemLink" onclick="showModelMony('reimbursementServiceGroupRowField_${j}')">نمایش</a></td>
                    <td>${createMoneyString(tempObject.patientContributionField, "Group_patientContributionField")}</td>
                    <td>${createMoneyString(tempObject.totalChargeField, "Group_totalChargeField")}</td>
                  </tr>`;

        $(output).appendTo("#reimbursementServiceGroupRowField");

        //otherCostsField
        if (tempObject.otherCostsField !== null && tempObject.otherCostsField.length > 0) {
            tempSubLength = tempObject.otherCostsField.length;
            for (var ix = 0; ix < tempSubLength; ix++) {
                tempSubObject = tempObject.otherCostsField[ix];
                modelMony = {
                    id: `reimbursementServiceGroupRowField_${j}`,
                    name: createIdinTitleString(tempSubObject.nameField),
                    value: createMoneyString(tempSubObject.valueField, `reimbursementServiceGroupRowField_${j}`)
                };
                moneyTools.arrayMoneyModal.push(modelMony);
            }
        }

        if (j + 1 == tempLength) {
            outputSum = `<tr>
                    <td></td>
                    <td></td>
                    <td class="font-weight-bold">${createSumString("Group_serviceCountField")}</td>
                    <td class="font-weight-bold">${createSumString("Group_basicInsuranceContributionField")}</td>
                    <td class="font-weight-bold">${createSumString("Group_deductionField")}</td>
                    <td class="font-weight-bold">${getAllSumSubMoneys("reimbursementServiceGroupRowField", tempLength)}</td>
                    <td class="font-weight-bold">${createSumString("Group_patientContributionField")}</td>
                    <td class="font-weight-bold">${createSumString("Group_totalChargeField")}</td>
                  </tr>`;

            $(outputSum).appendTo("#reimbursementServiceGroupRowFieldSum");
        }
    }


}

function fillReimbMsgIDField(result) {
    let output = "", tempObject = {};

    //committerField
    if (result.committerField !== null) {
        tempObject = result.committerField;

        output = `<tr onclick="clickTrTable(event)">
                    <td>${createFirstLastNameString(tempObject)}</td>
                    <td>${tempObject.identifierField == null ? "-" : tempObject.identifierField.idField == null ? "" : tempObject.identifierField.idField}</td>
                  </tr>`;

        $(output).appendTo("#tempCommitterField");
    }

}

function fillReimbPersonField(result) {
    let output = "", tempObject = {};
    tempObject = result;

    output = `<tr onclick="clickTrTable(event)">
                <td>${createFirstLastNameString(tempObject)}</td>
                <td>${tempObject.father_FirstNameField == null ? "-" : tempObject.father_FirstNameField}</td>
                <td>${tempObject.nationalCodeField == null ? "-" : tempObject.nationalCodeField}</td>
                <td>${createDateTimeString(tempObject.birthDateField, "date")}</td>
                <td>${createIdinTitleString(tempObject.educationLevelField)}</td>
                <td>${createIdinTitleString(tempObject.genderField)}</td>
                <td>${tempObject.homeTelField == null ? "-" : tempObject.homeTelField}</td>
                <td>${tempObject.iDCardNumberField == null ? "-" : tempObject.iDCardNumberField}</td>
                <td>${createIdinTitleString(tempObject.jobField)}</td>
                <td>${createIdinTitleString(tempObject.maritalStatusField)}</td>
                <td>${tempObject.mobileNumberField == null ? "-" : tempObject.mobileNumberField}</td>
                <td>${createIdinTitleString(tempObject.livingPlaceAreaField.provinceField)}</td>
                <td>${createIdinTitleString(tempObject.livingPlaceAreaField.cityField)}</td>
                <td>${tempObject.fullAddressField == null ? "-" : tempObject.fullAddressField}</td>
              </tr>`;

    $(output).appendTo("#tempPersonField");
}

function createDateTimeString(value, type) {
    let tempString = "";

    if (type == "date") {
        if (value !== null) {
            tempString =
                `${value.yearField == null ?
                    "--" : value.yearField}/${value.monthField == null ?
                        "--" : value.monthField < 10 ? `0${value.monthField}` : value.monthField}/${value.dayField == null ?
                            "--" : value.dayField < 10 ? `0${value.dayField}` : value.dayField}`;

            return tempString;
        }
        return "-";
    }
    else if (type == "time") {
        if (value !== null) {
            tempString =
                `${value.hourField == null ?
                    "--" : value.hourField < 10 ? `0${value.hourField}` : value.hourField}:${value.minuteField == null ?
                        "--" : value.minuteField < 10 ? `0${value.minuteField}` : value.minuteField}:${value.secondField == null ?
                            "--" : value.secondField < 10 ? `0${value.secondField}` : value.secondField}`;

            return tempString;
        }
        return "-";
    }

}

function getAllSumSubMoneys(id, length = null) {
    let name = "", valueSum = 0;

    if (length == null) {
        valueSum = moneyTools.modelSums[id].value;
        name = moneyTools.modelSums[id].name;
    }
    else {
        for (var i = 0; i < length; i++)
            valueSum += moneyTools.modelSums[`${id}_${i}`].value;

        name = moneyTools.modelSums[`${id}_${0}`].name;
    }

    return `${name} ${transformNumbers.toComma(valueSum)}`;
}

function clickTrTable(e) {
    $("#getInsurerReimbursementModal .highlight").removeClass("highlight");
    $(e.currentTarget).addClass("highlight");
}

function createIdinTitleString(value) {
    let tempString = "";

    if (value !== null) {
        tempString =
            `${value.coded_stringField == null ? " " : value.coded_stringField} - ${value.valueField == null ? " " : value.valueField}`;
        return tempString;
    }
    return "-";
}

function createMoneyString(value, id) {
    let tempString = "";

    if (value !== null) {
        addSums(+value.magnitudeField ?? 0, id, value.unitField);

        tempString =
            `${value.magnitudeField == null ? " " : transformNumbers.toComma(value.magnitudeField)}  ${value.unitField == null ? " " : value.unitField}`;
        return tempString;
    }
    else
        addSums(0, id);

    return "-";
}

function addSums(value, id, name = null) {

    if (typeof moneyTools.modelSums[id] === "undefined") {
        moneyTools.modelSums[id] = { value: value, name: "" };

        if (name !== null)
            moneyTools.modelSums[id].name = name;
    }
    else
        moneyTools.modelSums[id].value += value;
}

function createSumString(id) {
    let tempString = "";
    tempString =
        `${transformNumbers.toComma(moneyTools.modelSums[id].value)} ${moneyTools.modelSums[id].name}`
    return tempString;
}

function createFirstLastNameString(value) {
    let tempString = "";

    if (value !== null) {
        tempString =
            `${value.firstNameField == null ? " " : value.firstNameField}  ${value.lastNameField == null ? " " : value.lastNameField}`;
        return tempString;
    }
    return "-";
}

function showModelMony(id, denger = false) {
    let arrayResult = [], arrayResultLength = 0, output = "", outputSum = "";
    $("#tempMoneyField").html("");
    $("#tempMoneyFieldSum").html("");

    arrayResult = moneyTools.arrayMoneyModal.filter(a => a.id == id);
    arrayResultLength = arrayResult.length;

    for (var i = 0; i < arrayResultLength; i++) {
        output += `<tr onclick="clickTrTable(event)"><td>${arrayResult[i].name}</td><td class="${denger ? "highlight-danger" : ""}">${arrayResult[i].value}</td></tr>`;

        if (i + 1 == arrayResultLength) {
            outputSum = `<tr><td></td><td class="font-weight-bold">${createSumString(id)}</td></tr>`;
        }
    }

    $(output).appendTo("#tempMoneyField");
    $(outputSum).appendTo("#tempMoneyFieldSum");
    
    modal_show(`showMoneyModal`);
}

function resetAllReimbPackageData() {

    $(`#tempAdmissionField,
       #tempdiagnosisField,
       #tempdischargeField,
       #tempinsuranceField,
       #tempreimbursementSummaryField,
       #reimbursementServiceGroupRowField,
       #tempreimbursementServicesField,
       #reimbursementServiceGroupRowFieldSum,
       #tempreimbursementServicesFieldSum,
       #tempCommitterField,
       #tempPersonField`).html("");

    ColumnResizeable("tempAdmissionFieldList");
    ColumnResizeable("tempdiagnosisFieldList");
    ColumnResizeable("tempdischargeFieldList");
    ColumnResizeable("tempinsuranceFieldList");
    ColumnResizeable("tempreimbursementSummaryFieldList");
    ColumnResizeable("reimbursementServiceGroupRowFieldList");
    ColumnResizeable("tempreimbursementServicesFieldList");
    ColumnResizeable("tempCommitterFieldList");
    ColumnResizeable("tempPersonFieldList");
    ColumnResizeable("tempMoneyFieldList");

    moneyTools = {
        arrayMoneyModal: [],
        modelSums: {}
    };
}

//ReimbPackage