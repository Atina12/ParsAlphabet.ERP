var viewData_form_title = "وب سرویس تامین اجتماعی",
    viewData_controllername = "AdmissionTaminWebServiceApi",
    viewData_getpagetable_eprescription_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getpageeprescription`,
    viewData_getpagetable_delRquesteprescription_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getpagereturneprescription`,
    viewData_getpagetable_requesteprescription_url = `${viewData_baseUrl_MC}/${viewData_controllername}/requesteprescriptiontamin`,
    viewData_send_ePrescription_url = `${viewData_baseUrl_MC}/tamin/sendeprescription`,
    viewData_sendRequest_ePrescription_url = `${viewData_baseUrl_MC}/requestPrescriptionTamin/sendrequestprescription`,
    viewData_DelRequest_ePrescription_url = `${viewData_baseUrl_MC}/tamin/deleteprescription`,
    strResultRequestEPrescriptionTamin = "",
    admissionTaminId = 0;

function initWebServiceTamin() {

    $(".tab-content").show();
    let pagetable = {};

    pagetable = {
        pagetable_id: "eprescriptionPageTable",
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
        getpagetable_url: viewData_getpagetable_eprescription_url,
    };
    arr_pagetables.push(pagetable);

    pagetable = {
        pagetable_id: "delRquestEPrescriptionPageTable",
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
        getpagetable_url: viewData_getpagetable_delRquesteprescription_url,
    };
    arr_pagetables.push(pagetable);

    pagetable = {
        pagetable_id: "requestEPresctionPageTable",
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
        getpagetable_url: viewData_getpagetable_requesteprescription_url,
    };
    arr_pagetables.push(pagetable);

    tabLazyLoad("requestEPresctionPageTable");
};

async function loadingAsync(loading, elementId, classes = "fa fa-save") {
    if (loading)
        $(`#${elementId} i`).removeClass(classes).addClass(`fa fa-spinner fa-spin`);
    else
        $(`#${elementId} i`).removeClass("fa fa-spinner fa-spin").addClass(classes)
}

//#region eprescriptionPageTable

$("#sendEPrescriptionBtn").click(async function () {
    await loadingAsync(true, $(this).prop("id"));
    await sendEPrescription();
});

function run_button_getPrescriptionInfoDetails(id, rowNo) {

    let ePrescriptionId = $(`#row${rowNo}`).data("requesteprescriptionid"),
        paraClinicTypeCode = $(`#row${rowNo}`).data("paraclinictypecode");

    getPrescriptionInfoDetails(ePrescriptionId, paraClinicTypeCode, rowNo, 'eprescriptionPageTable');
}

function run_button_displayRequestPrescriptionTamin(prescriptionId, rowNo, elm) {
    var href = `/MC/PrescriptionTamin/display/${prescriptionId}`;
    navigateToModalDisplay(href, "نمایش نسخه تامین");
}

function navigateToModalDisplay(href) {

    initialPage();
    $("#contentdisplayForm #content-page").addClass("displaynone");
    $("#contentdisplayForm #loader").removeClass("displaynone");
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
            $(`#contentdisplayForm`).html(result);
            modal_show("displayFormModal");
        },
        error: function (xhr) {
            error_handler(xhr, href);
        }
    });
    $("#contentdisplayForm #loader,#contentdisplayForm #formHeaderLine #header-div .button-items").addClass("displaynone");
    $("#contentdisplayForm #content-page").fadeIn().removeClass("displaynone").css("margin", 0);
    $("#contentdisplayForm #form,#contentdisplayForm .content").css("margin", 0);
    $("#contentdisplayForm .itemLink").css("pointer-events", " none");
}

async function sendEPrescription() {

    var index = arr_pagetables.findIndex(v => v.pagetable_id == "eprescriptionPageTable");
    var selectedItems = arr_pagetables[index].selectedItems;

    if (selectedItems.length > 0) {
        var data = [];

        selectedItems.forEach(function (item) {
            if (item.sendeprescription == "true")
                data.push(+item.id);
        });

        if (data.length > 0) {

            sendEPrescriptionTamin(data).then(result => {

                loadingAsync(false, $("#sendEPrescriptionBtn").prop("id"));

                if (result.successfull) {
                    arr_pagetables[index].selectedItems = [];
                    get_NewPageTableV1("eprescriptionPageTable");
                }
                else if (checkResponse(result.data) && result.data.length > 0) {

                    $("#result_row").html("");
                    let str = "", newSelecteds = [];

                    for (var ix = 0; ix < result.data.length; ix++) {
                        let dataRes = result.data[ix].item2;
                        let id = result.data[ix].item1;

                        newSelecteds.push(arr_pagetables[index].selectedItems.filter(item => item.id.toString() == id)[0]);

                        dataRes.problems = dataRes.problems == null ? [] : dataRes.problems;
                        if (typeof dataRes.problems !== "undefined" && dataRes.problems.length == 0)
                            str += `<tr><td>${id}</td><td>${dataRes.status} - ${dataRes.statusDesc}</td></tr>`
                        else
                            str += generateErrorStringTamin(dataRes.problems, id, true);
                    }

                    arr_pagetables[index].selectedItems = [];
                    arr_pagetables[index].selectedItems = newSelecteds;

                    get_NewPageTableV1("eprescriptionPageTable");

                    $("#result_row").append(str);

                    modal_show(`wcf_tamin_error_result`);
                }
                else if (!result.successfull && result.status === 401) {
                    var msgItem = alertify.warning(result.statusMessage);
                    msgItem.delay(alertify_delay);
                }

            }, result => loadingAsync(false, $("#sendEPrescriptionBtn").prop("id")));
        }
        else {
            loadingAsync(false, $("#sendEPrescriptionBtn").prop("id"));
            var msgItem = alertify.warning("موردی برای ارسال وجود ندارد");
            msgItem.delay(alertify_delay);

            return;
        }
    }
    else {
        loadingAsync(false, $("#sendEPrescriptionBtn").prop("id"));
        var msgItem = alertify.warning("حداقل یک مورد انتخاب نمایید");
        msgItem.delay(alertify_delay);
    }
}

async function sendEPrescriptionTamin(data) {
    let response = await $.ajax({
        url: viewData_send_ePrescription_url,
        type: "PUT",
        dataType: "JSON",
        contentType: "application/json",
        cache: false,
        data: JSON.stringify(data),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_send_ePrescription_url);
            return "";
        }
    });

    return response;
}

$(document).on("change", "#eprescriptionPageTable tbody input[type='checkbox']", function () {
    ePrescriptionListCheck();
})

function ePrescriptionListCheck() {
    var index = arr_pagetables.findIndex(v => v.pagetable_id == "eprescriptionPageTable");
    var selectedItems = arr_pagetables[index].selectedItems;

    if (selectedItems.length > 0) {
        var notValidCount = 0;
        selectedItems.forEach(function (item) {
            if (item.sendEPrescription == "false")
                notValidCount += 1;
        })
        if (notValidCount == selectedItems.length) {
            var msgItem = alertify.warning("موارد انتخابی قابلیت ارسال ندارند");
            msgItem.delay(alertify_delay);
        }
    }
}

//#endregion 

//#region requestEPrescriptionTamin
$("#sendRequestEPrescription").click(async function () {

    await loadingAsync(true, $(this).prop("id"));
    await sendRequestEPrescriptionTamin();
    //فلا به عنوان نمونه فقط نوشتم تا API زده بشه
});

function sendRequestEPrescriptionTamin() {
    
    var index = arr_pagetables.findIndex(v => v.pagetable_id == "requestEPresctionPageTable");
    var selectedItems = arr_pagetables[index].selectedItems;

    if (selectedItems.length > 0) {
        var data = [], editData = [];
        selectedItems.forEach(function (item) {
            if (item.sendresult != "false")
                data.push(+item.id);
        });

        var editindex = 0;
        for (var i = 0; i < selectedItems.length; i++) {
            if (selectedItems[i].editflg == true || selectedItems[i].editflg == 'true') {
                editData.push(selectedItems[i].id);
                editindex = data.indexOf(parseInt(selectedItems[i].id));
                if (editindex > -1)
                    data.splice(editindex, 1);

            }
        }
        if (data.length == 0 && editData.length == 0) {
            loadingAsync(false, $("#sendRequestEPrescription").prop("id"));
            var msgItem = alertify.warning("موردی برای ارسال وجود ندارد");
            msgItem.delay(alertify_delay);

            return;
        }
        if (data.length > 0) {
            sendETaminPrescription(data);
        }

        if (editData.length > 0) {
            editRequestEPrescriptionTamin(editData);
        }
    }
    else {
        loadingAsync(false, $("#sendRequestEPrescription").prop("id"));
        var msgItem = alertify.warning("حداقل یک مورد انتخاب نمایید");
        msgItem.delay(alertify_delay);
    }
}

async function editRequestEPrescriptionTamin(data) {

    var model = {
        ids: data,
        otpCode: null
    }
    if (data.length > 0) {
        let url = `${viewData_baseUrl_MC}/requestPrescriptionTamin/deleterequestprescription`;
        await fetchManager(url, {
            method: 'POST',
            body: JSON.stringify(model),
            headers: { 'Content-Type': 'application/json' },
        }).then((result) => {

            if (result != null && result.status == 200) {
                if (result.data.errMessage == null || result.data.errMessage == "")
                    sendETaminPrescription(data);
                else {
                    alertify.warning(result.data.errMessage, 6);
                }
            }

            else {

                alertify.warning("پاسخی از وب سرویس دریافت نشد دوباره تلاش نمایید", 6);
            }
        });
    }
    else {
        loadingAsync(false, $("#sendRequestEPrescription").prop("id"));
        var msgItem = alertify.warning("موردی برای ارسال وجود ندارد");
        msgItem.delay(alertify_delay);

        return;
    }
    //var index = arr_pagetables.findIndex(v => v.pagetable_id == "delRquestEPrescriptionPageTable");

    //if (data.length > 0) {

    //    getEditResultRequestEPrescriptionTamin(data).then(result => {

    //        loadingAsync(false, $("#sendRequestEPrescription").prop("id"));

    //        if (result.family == "SUCCESSFUL" && result.status === 200 && (result.data.errMessage == null || result.data.errMessage == "")) {
    //            arr_pagetables[index].selectedItems = [];
    //            get_NewPageTableV1("requestEPresctionPageTable");
    //        }
    //        else if (checkResponse(result.data) && result.data.length > 0) {

    //            $("#result_row").html("");
    //            let str = "", newSelecteds = [];

    //            for (var ix = 0; ix < result.data.length; ix++) {
    //                let dataRes = result.data[ix].item2;
    //                let id = result.data[ix].item1;

    //                newSelecteds.push(arr_pagetables[index].selectedItems.filter(a => a.id.toString() == id)[0]);

    //                dataRes.problems = dataRes.validationErrors == null ? [] : dataRes.validationErrors;
    //                if (typeof dataRes.validationErrors !== "undefined" && dataRes.validationErrors.length == 0)
    //                    str += `<tr><td>${id}</td><td>${result.data[ix].item2.status}</td></tr>`
    //                else
    //                    /*str += generateErrorStringTamin(dataRes.validationErrors, id, true);*/
    //                    str += `<tr><td>${result.data[ix].item1}</td><td>${result.data[ix].item2.status} | ${result.data[ix].item2.validationErrors}</td></tr>`;
    //            }
    //            arr_pagetables[index].selectedItems = [];
    //            arr_pagetables[index].selectedItems = newSelecteds;

    //            get_NewPageTableV1("requestEPresctionPageTable");

    //            $("#result_row").append(str);

    //            modal_show(`wcf_tamin_error_result`);
    //        }
    //        else if (result.status === 401) {
    //            var msgItem = alertify.warning("درخواست شما انجام نشد لطفا دوباره تلاش نمایید");
    //            msgItem.delay(alertify_delay);
    //        }
    //        else if (result.family == "SUCCESSFUL" && result.status === 200 && result.data.errMessage != null && result.data.errMessage != "") {
    //            var msgItem = alertify.warning(result.data.errMessage);
    //            msgItem.delay(alertify_delay);
    //        }
    //        else if (result.data == null && result.status === 400) {
    //            var msgItem = alertify.warning(result.data.errMessage);
    //            msgItem.delay(alertify_delay);
    //        }
    //        else if (result.status === 500) {
    //            var msgItem = alertify.warning("خطای نامشخص وب سرویس تامین اجتماعی ; به مدیر سیستم اطلاع دهید");
    //            msgItem.delay(alertify_delay);
    //        }
    //    }, result => loadingAsync(false, $("#sendRequestEPrescription").prop("id")));

    //}
    //else {
    //    loadingAsync(false, $("#sendRequestEPrescription").prop("id"));
    //    var msgItem = alertify.warning("موردی برای ارسال وجود ندارد");
    //    msgItem.delay(alertify_delay);

    //    return;
    //}

    //else {
    //    loadingAsync(false, $("#sendRequestEPrescription").prop("id"));
    //    var msgItem = alertify.warning("حداقل یک مورد انتخاب نمایید");
    //    msgItem.delay(alertify_delay);
    //}
}

async function sendETaminPrescription(data) {

    var index = arr_pagetables.findIndex(v => v.pagetable_id == "requestEPresctionPageTable");

    loadingAsync(true, $("#sendRequestEPrescription").prop("id"));

    $("#result_row").html("");

    for (var i = 0; i < data.length; i++) {
        let id = +data[i];        
        await getResultRequestEPrescriptionTamin(id, index);
    }

    if (strResultRequestEPrescriptionTamin != "")
        modal_show(`wcf_tamin_error_result`);


    loadingAsync(false, $("#sendRequestEPrescription").prop("id"));
}

async function getResultRequestEPrescriptionTamin(id, index) {

    

    let response = await $.ajax({
        url: viewData_sendRequest_ePrescription_url,
        type: "POST",
        dataType: "JSON",
        contentType: "application/json",
        cache: false,
        data: JSON.stringify(id),
        success: function (result) {
            showResultRequestEPrescriptionTamin(result, index);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_sendRequest_ePrescription_url);
            return "";
        }


    });

    return response;
}

function showResultRequestEPrescriptionTamin(result, index) {
    
    if (result.successfull) {
        arr_pagetables[index].selectedItems = [];
        get_NewPageTableV1("requestEPresctionPageTable");
    }
    else if (checkResponse(result.data) && result.data.length > 0) {

        strResultRequestEPrescriptionTamin = "";

       
        for (var ix = 0; ix < result.data.length; ix++) {
            let dataRes = result.data[ix].item2;
            let id = result.data[ix].item1;

           
            dataRes.problems = dataRes.validationErrors == null ? [] : dataRes.validationErrors;
            if (typeof dataRes.validationErrors !== "undefined" && dataRes.validationErrors.length == 0)
                strResultRequestEPrescriptionTamin += `<tr><td>${id}</td><td>${result.data[ix].item2.status}</td></tr>`
            else
                /*str += generateErrorStringTamin(dataRes.validationErrors, id, true);*/
                strResultRequestEPrescriptionTamin += `<tr><td>${result.data[ix].item1}</td><td>${result.data[ix].item2.status} | ${result.data[ix].item2.validationErrors}</td></tr>`;
        }
       get_NewPageTableV1("requestEPresctionPageTable");

        $("#result_row").append(strResultRequestEPrescriptionTamin);

       
    }
    else if (!result.successfull && result.status === 401) {
        var msgItem = alertify.warning(result.statusMessage);
        msgItem.delay(alertify_delay);
    }

}

async function getEditResultRequestEPrescriptionTamin(data) {

    //let url = `${viewData_baseUrl_MC}/requestPrescriptionTamin/editrequestprescription`;

    //let response = await $.ajax({
    //    url: url,
    //    type: "POST",
    //    dataType: "JSON",
    //    contentType: "application/json",
    //    cache: false,
    //    data: JSON.stringify(data),
    //    success: function (result) {
    //        return result;
    //    },
    //    error: function (xhr) {
    //        error_handler(xhr, url);
    //        return "";
    //    }


    //});

    //return response;

    //delete


}
//#endregion 

//#region delRquestEPrescriptionTamin
$("#sendDelRequestEPrescription").click(async function () {
    await loadingAsync(true, $(this).prop("id"), "fas fa-times");
    await sendDelEPrescriptionTamin();
});

function sendDelEPrescriptionTamin() {
    var index = arr_pagetables.findIndex(v => v.pagetable_id == "delRquestEPrescriptionPageTable");
    var selectedItems = arr_pagetables[index].selectedItems;


    if (selectedItems.length > 0) {
        var data = [];
        selectedItems.forEach(function (item) {
            if (item.sendeprescription == "true")
                data.push(+item.id);
        });
        if (data.length > 0) {

            getResultDelEPrescriptionTamin(data).then(result => {
                loadingAsync(false, $("#sendDelRequestEPrescription").prop("id"), "fas fa-times");
                
                if (result.successfull) {
                    arr_pagetables[index].selectedItems = [];
                    get_NewPageTableV1("delRquestEPrescriptionPageTable");
                }
                else if (checkResponse(result.data) && result.data.length > 0) {

                    $("#result_row").html("");
                    let str = "", newSelecteds = [];

                    for (var ix = 0; ix < result.data.length; ix++) {
                        let dataRes = result.data[ix].item2;
                        let id = result.data[ix].item1;

                        newSelecteds.push(arr_pagetables[index].selectedItems.filter(a => a.id.toString() == id)[0]);

                        dataRes.problems = dataRes.problems == null ? [] : dataRes.problems;
                        if (typeof dataRes.problems !== "undefined" && dataRes.problems.length == 0)
                            str += `<tr><td>${id}</td><td>${dataRes.status} - ${dataRes.statusDesc}</td></tr>`
                        else
                            str += generateErrorStringTamin(dataRes.problems, id, true);
                    }
                    arr_pagetables[index].selectedItems = [];
                    arr_pagetables[index].selectedItems = newSelecteds;
                    get_NewPageTableV1("delRquestEPrescriptionPageTable");

                    $("#result_row").append(str);

                    modal_show(`wcf_tamin_error_result`);
                }
                else if (!result.successfull && result.status === 401) {
                    var msgItem = alertify.warning(result.statusMessage);
                    msgItem.delay(alertify_delay);

                }
            }, result => loadingAsync(false, $("#sendDelRequestEPrescription").prop("id"), "fas fa-times"));
        }
        else {
            loadingAsync(false, $("#sendDelRequestEPrescription").prop("id"), "fas fa-times");
            var msgItem = alertify.warning("موردی برای ارسال وجود ندارد");
            msgItem.delay(alertify_delay);

            return;
        }
    }
    else {
        loadingAsync(false, $("#sendDelRequestEPrescription").prop("id"), "fas fa-times");
        var msgItem = alertify.warning("حداقل یک مورد انتخاب نمایید");
        msgItem.delay(alertify_delay);
    }

}

async function getResultDelEPrescriptionTamin(data) {
    
    let response = await $.ajax({
        url: viewData_DelRequest_ePrescription_url,
        type: "POST",
        dataType: "JSON",
        contentType: "application/json",
        cache: false,
        data: JSON.stringify(data),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_DelRequest_ePrescription_url);
        }
    });

    return response;
}

$(document).on("change", "#delRquestEPrescriptionPageTable tbody input[type='checkbox']", function () {
    ePrescriptionListCheck();
})

function ePrescriptionListCheck() {
    var index = arr_pagetables.findIndex(v => v.pagetable_id == "delRquestEPrescriptionPageTable");
    var selectedItems = arr_pagetables[index].selectedItems;

    if (selectedItems.length > 0) {
        var notValidCount = 0;
        selectedItems.forEach(function (item) {
            if (item.sendEPrescription == "false")
                notValidCount += 1;
        })
        if (notValidCount == selectedItems.length) {
            var msgItem = alertify.warning("موارد انتخابی قابلیت ارسال ندارند");
            msgItem.delay(alertify_delay);
        }
    }
}

//#endregion 

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
                str += `<th style="width:${(+$(`#${pageId} .pagetablebody `).width() / 101) * 2}px;text-align:center !important"><input class="checkall selectedItem-checkbox-all" onchange="changeAll(this,'${pageId}')" ${typeof pagetable_selectedItems == "undefined" ?
                    "" : pagetable_selectedItems.length == list.length && list.length > 0 ? "checked" : ""}  type="checkbox" ></th >`;
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
                            str += `<td id="col_${rowno}_1" class="selectedItem-checkbox" style="width:2%;text-align:center"><input onchange="itemChange(this)" type="checkbox"`;

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
                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? value.toString() : ""}" class="form-control decimal" onfocus="tr_onfocus('${pageId}',${colno})"  autocomplete="off" readonly>`;
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


                                        else if (value == "ارسال موفق" && columns[j].id == "sendEPrescriptionResultName")
                                            cls = "td-success1-light";

                                        else if (value == "ارسال موفق" && columns[j].id == "sendResultName")
                                            cls = "td-success1-light";


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

var selectTab = (tabNo, pageTableName) => {

    let firstInput = $(`.tabToggle${tabNo}`).find("[tabindex]:not(:disabled)").first();
    setTimeout(() => $(firstInput).hasClass("select2") ? $(`#${firstInput.attr("id")}`).select2('focus') : firstInput.focus(), 10);
    tabLazyLoad(pageTableName);
};

function tabLazyLoad(pageTableName) {
    var tableSelected = arr_pagetables.filter(a => a.pagetable_id == pageTableName)[0];

    if (typeof tableSelected != "undefined") {
        if (!tableSelected.loaded) {
            $(`#${pageTableName}`).prepend('<div class="box loader"><img src = "/Content/images/heart.png" id = "heartbeat" /></div >');

            get_NewPageTableV1(pageTableName, false, function () { $(`#${pageTableName} .loader`).remove(); });
            tableSelected.loaded = true;

        }
    }
}

$("#wcfresultmodal-close").click(() => modal_close("wcf_tamin_error_result"));

function run_button_showServiceLines(id, row) {
    var check = controller_check_authorize(viewData_controllername, "VIW");
    if (!check)
        return;

    getRequestData(`${viewData_baseUrl_MC}/AdmissionApi/display`, 3, id);
}

initWebServiceTamin();
