var viewData_form_title = "بستن صندوق",
    viewData_modal_title = "",
    viewData_controllername = "AdmissionCloseApi",
    viewData_get_closeData = `${viewData_baseUrl_MC}/${viewData_controllername}/getclosedate`,
    viewData_getpagetable_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getpage`,
    viewData_calculate = `${viewData_baseUrl_MC}/${viewData_controllername}/insert`,
    viewData_deleterecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/deleteheader`,
    viewData_difference = `${viewData_baseUrl_MC}/${viewData_controllername}/admissioncashdifference`,
    viewData_add_page_url = "/MC/AdmissionClose/form",
    viewData_admclose_form_page_url = "/MC/AdmissionClose/form",
    viewData_check_update_url = `${viewData_baseUrl_MC}/${viewData_controllername}/checkupdate`,
    viewData_admissionclosecsv_url = `${viewData_baseUrl_MC}/${viewData_controllername}/admissionclosecsv`,
    viewData_difference_csv_url = `${viewData_baseUrl_MC}/${viewData_controllername}/differencecsv`,
    viewData_search_admissionCloseRequest = `${viewData_baseUrl_MC}/${viewData_controllername}/admissionclosesearch`,
    reportUrl = `${stimulsBaseUrl.MC.Rep}AdmissionClose_Summary.mrt`, lastpagetable_formkeyvalue = [],
    viewData_print_url = `/Report/Print`, rowNumberAdmissionClose = 0;

var pagetable = {
    pagetable_id: "pagetableAdd",
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
    getpagetable_url: viewData_search_admissionCloseRequest,
};
arr_pagetables.push(pagetable);

function initadmissionClose() {
    
    var check = controller_check_authorize(viewData_controllername, "VIWALL");

    if (check)
        $("#userType").prop('disabled', false);
    else
        $("#userType").prop('disabled', true);

    loadingDropDown()

    $('#userType').bootstrapToggle();

    $("#branchId").prop("selectedIndex", 0).trigger("change");

    $("#fromWorkDayDatePersian").inputmask();
    $("#toWorkDayDatePersian").inputmask();

    kamaDatepicker('fromWorkDayDatePersian', { withTime: false, position: "bottom" });
    kamaDatepicker('toWorkDayDatePersian', { withTime: false, position: "bottom" });

    pagetable_formkeyvalue = ["myadm", 0];
    get_NewPageTableV1();
}

function loadingDropDown() {
    fill_select2(`${viewData_baseUrl_GN}/BranchApi/getactivedropdown`, "branchId", true);
}

function checkCounter() {
    return true;
}

function get_NewPageTable(pg_id = null, isInsert = false, callBack = undefined) {
    if (pg_id == null) pg_id = "pagetable";
    activePageTableId = pg_id;
    let index = arr_pagetables.findIndex(v => v.pagetable_id == pg_id);

    if (!isInsert) {
        arr_pagetables[index].pageNo = 0;
        arr_pagetables[index].currentpage = 1;
    }

    let pagetable_url = arr_pagetables[index].getpagetable_url,
        pagetable_pagerowscount = arr_pagetables[index].pagerowscount,
        pagetable_pageNo = arr_pagetables[index].pageNo,
        pagetable_currentpage = arr_pagetables[index].currentpage,
        configFilterRes = configFilterNewPageTable(pg_id);

    if (!configFilterRes) return;

    let pagetable_filteritem = arr_pagetables[index].filteritem,
        pagetable_filtervalue = arr_pagetables[index].filtervalue;

    let pageViewModel = {
        pageno: pagetable_pageNo,
        pagerowscount: pagetable_pagerowscount,
        fieldItem: pagetable_filteritem,
        fieldValue: pagetable_filtervalue,
        form_KeyValue: [0],
        sortModel: {
            colId: dataOrder.colId,
            sort: dataOrder.sort
        }
    }
    pageViewModel.form_KeyValue = pagetable_formkeyvalue;

    if (pg_id == "pagetableAdd") {
        pageViewModel.branchId = $("#branchId").val();
        pageViewModel.fromWorkDayDatePersian = $("#fromWorkDayDatePersian").val();
        pageViewModel.toWorkDayDatePersian = $("#toWorkDayDatePersian").val();
    }

    let url = "";

    if (pagetable_url === undefined)
        url = viewData_getpagetable_url;
    else
        url = pagetable_url;

    $.ajax({
        url: url,
        type: "POST",
        data: JSON.stringify(pageViewModel),
        dataType: "json",
        contentType: "application/json",
        cache: false,
        success: function (result) {
            if (pagetable_currentpage == 1) fillOption(result, pg_id);

            fill_NewPageTable(result, pg_id, callBack);
            refreshBackPageTable(false, pg_id);
        },
        error: function (xhr) {
            error_handler(xhr, url);
            refreshBackPageTable(true, pg_id);
        }
    });

}

function run_button_showServiceLines(id, rowElem) {

    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    var formValidate = $("#admCloseForm").parsley();
    var validate = formValidate.validate();
    validateSelect2(formValidate);
    if (!validate) return;


    var differenceModel = {
        branchId: $("#branchId").val(),
        workDayDatePersian: $(`#pagetableAdd #row${rowElem} td:eq(0)`).text()
    }

    $.ajax({
        url: viewData_difference,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        async: false,
        cache: false,
        data: JSON.stringify(differenceModel),
        success: function (response) {
            if (response.length == 0) {

                var model = {
                    opr: "Ins",
                    branchId: $("#branchId").val(),
                    workDayDatePersian: $(`#pagetableAdd #row${rowElem} td:eq(0)`).text()
                }
                $.ajax({
                    url: viewData_calculate,
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json",
                    async: false,
                    cache: false,
                    data: JSON.stringify(model),
                    success: function (response) {
                        if (response !== null) {
                            if (response.successfull) {
                                modal_close("addAdmissionClose");
                                var closeUrl = `${viewData_admclose_form_page_url}/${response.id}/${model.branchId}`;

                                $.when(admcloseModal()).done(function () {
                                    navigation_item_click(closeUrl, `${viewData_form_title} - افزودن`);
                                });
                            }
                            else {
                                if (response.statusMessage !== null) {
                                    $("#branchId").focus();
                                    var msgcl = alertify.warning(response.statusMessage);
                                    msgcl.delay(alertify_delay);
                                    return;
                                }
                                generateErrorValidation(response.validationErrors);
                            }
                        }
                    },
                    error: function (xhr) {
                        error_handler(xhr, viewData_calculate);

                    }
                });
            }
            else {
                var msgcl = alertify.warning(`${response.length} سطر باز وجود دارد`);
                msgcl.delay(alertify_delay);
                $("#rowCountAdmissionClose").html(+response.length);

                var admissionServiceCount = 0, admissionSaleCount = 0;

                $("#rowCountAdmissionService").text(admissionServiceCount);
                $("#rowCountAdmissionSale").text(admissionSaleCount);

                $("#differenceItems_row").html("");
                $("#differenceItems_row").data("date", differenceModel.workDayDatePersian);
                var str = "", sumNetPrice = 0;

                let responseLength = response.length, value;

                for (var i = 0; i < responseLength; i++) {
                    value = response[i];
                    str += `<tr tabindex="-1" id="rowClose_${+i + 1}" onkeydown="eventTrTable(${+i + 1},event,${+response.length})" onclick="eventReferralRow(${+i + 1})">
                            <td>${i + 1}</td>
                            <td>${value.userFullName}</td>
                            <td>${value.requestId}</td>
                            <td>${value.admissionTypeName}</td>
                            <td>${value.createDateTimePersian}</td>
                            <td>${transformNumbers.toComma(value['netAmount'])}</td >
                            </tr>`;

                    sumNetPrice += +value.netAmount;

                    if (+value.admissionTypeId == 1)
                        admissionSaleCount += 1;
                    else
                        admissionServiceCount += 1;
                }

                $("#rowCountAdmissionService").text(admissionServiceCount);
                $("#rowCountAdmissionSale").text(admissionSaleCount);

                $("#summeryAdmissionClose").html(transformNumbers.toComma(+sumNetPrice));
                fillRowClose(str)
                    .then(id => {

                        modal_show(`addAdmissionCashDifference`);
                        return id;
                    });
                return;
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_calculate);

        }
    });
}

function run_button_delete(p_keyvalue, rowno, elem, ev) {

    var check = controller_check_authorize(viewData_controllername, "DEL");
    if (!check)
        return;

        alertify.confirm('', msg_delete_row,
            function () {

                $.ajax({
                    url: viewData_deleterecord_url,
                    type: "post",
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify(p_keyvalue),
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
function run_button_editAdm(id, rowNo, elm) {
    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;

    var workDayDatePersian = "";
    var branchId = $(`#row${rowNo}`).data("branchid");
    var id = $(`#row${rowNo}`).data("id");

    var href = `${viewData_admclose_form_page_url}/${id}/${branchId}`;
    navigation_item_click(href, `${viewData_form_title} - محسابه مجدد`);
}

function run_button_prn(admissionCloseId) {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    viewData_print_model.value = admissionCloseId;

    viewData_print_model.url = `${stimulsBaseUrl.MC.Prn}AdmissionClose.mrt`;
    stimul_print();
}

function admcloseModal() {
    $(".modal-backdrop.fade.show").remove();
    modal_close("addAdmissionClose");
}

async function fillRowClose(str) {
    $("#differenceItems_row").append(str); return 1;
}

function eventTrTable(row, e, countRow) {

    if ([KeyCode.ArrowUp, KeyCode.ArrowDown].indexOf(e.keyCode) < 0) return;

    $(`#differenceItems_row tr`).removeClass("highlight");

    if (e.keyCode === KeyCode.ArrowUp)
        if (row > 1)
            $(`#rowClose_${row - 1}`).addClass("highlight").focus();
        else
            $(`#rowClose_${row}`).addClass("highlight").focus();


    if (e.keyCode === KeyCode.ArrowDown)
        if (row < countRow)
            $(`#rowClose_${row + 1}`).focus().addClass("highlight");
        else
            $(`#rowClose_${row}`).focus().addClass("highlight");

}

function eventReferralRow(row) {
    $(`#differenceItems_row tr`).removeClass("highlight"); $(`#rowClose_${row}`).focus().addClass("highlight");
}

function export_difference_csv_report(csvModel) {
    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    if (csvModel == null) {
        var msg = alertify.warning("پارامترهای گزارش مقدار دهی نشده");
        msg.delay(alertify_delay);
    }
    else {
        $.ajax({
            url: viewData_difference_csv_url,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(csvModel),
            cache: false,
            success: function (result) {
                generateCsv(result);
                viewData_form_title = "بستن صندوق"
            },
            error: function (xhr) {
                error_handler(xhr, viewData_csv_url)
            }
        });
    }

}

function run_button_excell(id) {
    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    $.ajax({
        url: viewData_admissionclosecsv_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        cache: false,
        success: function (result) {
            if (result.rows.length != 0) {
                generateCsv(result);
            } else {
                var msg = alertify.warning(msg_nothing_found);
                msg.delay(admission.delay);
                return;
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_admissionclosecsv_url)
        }
    });

}

function run_button_print(id) {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    var p_id = "CloseId";
    var p_value = id;
    var p_type = dbtype.Int;
    var p_size = 0;
    var p_url = `${stimulsBaseUrl.MC.Prn}AdmissionClose1.mrt`;
    var p_isPageTable = false;
    var p_tableName = "";
    var p_keyValue = 0;
    var secondLang = false;

    window.open(`${viewData_print_url}?pUrl=${p_url}&pName=${p_id}&pValue=${p_value}&pType=${p_type}&pSize=${p_size}&isPageTable=${p_isPageTable}&tableName=${p_tableName}&keyValue=${p_keyValue}&isSecondLang=${secondLang}`, '_blank');
}

function admissionCloseRequestSearch() {

    var form = $("#admissionRequestModal").parsley();
    var validate = form.validate();

    validateSelect2(form);

    if (!validate)
        return;

    $("#requestCheckAll").prop("checked", false);

    get_NewPageTable("pagetableAdd");
    return 1;
};

function resetAddModal() {
    $(`#pagetableAdd .pagetablebody tbody`).html(fillEmptyRow(5));
    $("#branchId").prop('selectedIndex', '0').trigger("change");
    $("#fromWorkDayDatePersian").val(moment.from(getTodayPersianDate(), 'fa', 'YYYY/MM/DD').format('jYYYY/jMM/jDD'));
    $("#fromWorkDayDatePersian").val(moment.from(getTodayPersianDate(), 'fa', 'YYYY/MM/DD').format('jYYYY/jMM/01'));
}

function setHighlightTr(rowNumber, id) {

    $("#tempRequests tr").removeClass("highlight");

    $(`#trs_${id}_${rowNumber}`).addClass("highlight");
}

function setHighlightTrKeyDown(rowNumber, e, id, value) {

    if ([KeyCode.ArrowUp, KeyCode.ArrowDown, KeyCode.Enter].indexOf(e.keyCode) < 0) return;
    $("#tempRequests tr").removeClass("highlight");
    var countRow = $("#tempRequests tr").length;
    if (e.keyCode === KeyCode.ArrowUp)
        if (rowNumber > 1)
            $(`#trs_${id}_${rowNumber - 1}`).addClass("highlight").focus();
        else
            $(`#trs_${id}_${rowNumber}`).addClass("highlight").focus();


    if (e.keyCode === KeyCode.ArrowDown)
        if (rowNumber < countRow)
            $(`#trs_${id}_${rowNumber + 1}`).addClass("highlight").focus();
        else
            $(`#trs_${id}_${rowNumber}`).addClass("highlight").focus();


    if (e.keyCode === KeyCode.Enter)
        selectRequest(value)
}

function reset_toParentForm() {
    pagetable_formkeyvalue = [0];
    viewData_form_title = "بستن صندوق";
    viewData_controllername = "AdmissionCloseApi";
}

function click_link_treasuryId(elm, ev) {
    navigateToModalTreasury(`/FM/NewTreasuryLine/display/${$(elm).text()}/${0}/1`);
}

function navigateToModalTreasury(href) {

    initialPage();
    $("#contentdisplayTreasuryLine #content-page").addClass("displaynone");
    $("#contentdisplayTreasuryLine #loader").removeClass("displaynone");
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
            $(`#contentdisplayTreasuryLine`).html(result);
        },
        error: function (xhr) {
            error_handler(xhr, href);
        }
    });
    $("#contentdisplayTreasuryLine #loader,#contentdisplayTreasuryLine #formHeaderLine #header-div .button-items").addClass("displaynone");
    $("#contentdisplayTreasuryLine #content-page").fadeIn().removeClass("displaynone").css("margin", 0);
    $("#contentdisplayTreasuryLine #form,#contentdisplayTreasuryLine .content").css("margin", 0);
    $("#contentdisplayTreasuryLine .itemLink").css("pointer-events", " none");
}

$(document).on("keydown", function (e) {
    if ([KeyCode.Insert].indexOf(e.which) == -1)
        return;


    if (e.ctrlKey && e.keyCode === KeyCode.Insert) {
        e.preventDefault();
        modal_show(`addAdmissionClose`);
    }

});

function modal_ready_for_add() {
    modal_show(`addAdmissionClose`);
}

window.Parsley._validatorRegistry.validators.comparedate = undefined;
window.Parsley.addValidator('comparedate', {
    validateString: function (value, requirement) {
        var value2 = $(`#${requirement}`).val();

        if (value === "" || value2 === "")
            return true;

        var compareResult = compareShamsiDate(value, value2);
        return compareResult;
    },
    messages: {
        en: 'تاریخ شروع از تاریخ پایان بزرگتر است.',
    }
});

function export_csv(elemId = undefined, value = undefined) {
    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    $(`#${elemId == undefined || elemId == null ? "exportCSV" : elemId}`).prop("disabled", true);

    setTimeout(function () {
        let index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id);

        if (csvModel == null) {
            csvModel = {
                Filters: arrSearchFilter[index].filters,
                Form_KeyValue: [0]
            }
        }

        if (typeof value !== "undefined") {
            if (typeof value == "object")
                csvModel.Form_KeyValue = value;
            else {
                csvModel.Form_KeyValue.push(value);
                csvModel.Form_KeyValue.reverse()
            }

        }

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

$("#readyforadd").on("click", function () {
    modal_ready_for_add("addAdmissionClose");
});

$("#userType").on("change", function () {

    var check = controller_check_authorize(viewData_controllername, "VIWALL");
    if (!check)
        return;

    if ($(this).prop("checked"))
        pagetable_formkeyvalue = ["myadm", 0];
    else
        pagetable_formkeyvalue = ["alladm", 0];

    get_NewPageTableV1();

});

$("#formPlateListAdd")[0].onclick = null;

$("#formPlateListAdd").click(function () {

    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    modal_show(`addAdmissionClose`);

});

$("#addAdmissionClose").on("shown.bs.modal", function () {
    $("#branchId").select2("focus");
});

$("#differenceItemsClose").click(function () {
    modal_close("addAdmissionCashDifference");
});

$("#addAdmissionCashDifference").on('shown.bs.modal', function () {
    $(`#rowClose_1`).addClass("highlight");
    $(`#rowClose_1`).focus();
});

$("#differenceItemsExportCSV").click(function () {

    $(this).prop("disabled", true);

    viewData_form_title = "لیست سطرهای باز";
    var csvModel = {
        branchId: $("#branchId").val(),
        workDayDatePersian: $("#differenceItems_row").data("date")
    }

    setTimeout(function () {
        export_difference_csv_report(csvModel);
        $("#differenceItemsExportCSV").prop("disabled", false);
    }, 700);
});

$("#addAdmissionClose").on("hidden.bs.modal", resetAddModal);

initadmissionClose();


