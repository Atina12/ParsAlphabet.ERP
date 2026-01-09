var viewData_form_title = "سند حسابداری",
    viewData_controllername = "JournalApi",
    viewData_getrecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getrecordbyid`,
    viewData_deleterecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/delete`,
    viewData_filter_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getfilteritems`,
    viewData_getjournaldocumentinfobyid_url = `${viewData_baseUrl_FM}/${viewData_controllername}/journaldocumentinfo`,
    viewData_journalduplicate_url = `${viewData_baseUrl_FM}/${viewData_controllername}/journalduplicate`,
    viewData_csv_url = `${viewData_baseUrl_FM}/${viewData_controllername}/csv`,
    viewData_print_file_url = `${stimulsBaseUrl.FM.Prn}Journal.mrt`,
    identityIdCurrent = 0,
    stageIdJournal = 56,
    viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 },
    viewData_print_tableName = "",
    ImportExcel = `${viewData_baseUrl_FM}/JournalLineApi/getjournallineimportexcelcolumns`,
    insertExcelUrl = `${viewData_baseUrl_FM}/JournalLineApi/AddBulkJournalLine`,
    rowNumberJournal = 0, sumNetAmountRequest = 0, sumNetAmountCash = 0, lastpagetable_formkeyvalue = [],
    activePageTableId = "",
    isSearcheModalOpen = false,
    stepLogModalJournalForCloseModal = false;

function initJournalIndexForm() {
    addDocumentTransfer();

    $("#toDocumentDatePersianJo").inputmask();

    kamaDatepicker('toDocumentDatePersianJo', { withTime: false, position: "bottom" });

    fill_select2(`${viewData_baseUrl_FM}/${viewData_controllername}/getdropdown_documentnolist`, "fromJournal", true, false, 0, "انتخاب");
    fill_select2(`${viewData_baseUrl_FM}/DocumentTypeApi/getactivedropdown`, "documentTypeIdJournal", true, 0, false);
    fill_select2(`${viewData_baseUrl_GN}/BranchApi/getactivedropdown`, "branchIdJournal", true, 0, false);

    var check = controller_check_authorize(viewData_controllername, "VIWALL");

    if (check)
        $("#userType").prop('disabled', false);
    else
        $("#userType").prop('disabled', true);

    $('#userType').bootstrapToggle();

    pagetable_formkeyvalue = ["", "", "my", null];
    get_NewPageTableV1();
}

function addDocumentTransfer() {
    $(".button-items").prepend(`<button type="button" onclick="journalTransform()" class="btn blue_1 waves-effect"><i class="fa fa-file-import"></i>انتقال سند</button>`);
}

function resetFormJournalTransform() {
    $("#fromJournal").val("").trigger("change");
    $("#branchIdJournal").val("").trigger("change");
    $("#documentTypeIdJournal").val("").trigger("change");
    $("#toDocumentDatePersianJo").val(moment().format('jYYYY/jMM/jDD'))
    $("#fromJournalDocumentStatus").text("-");
    $("#fromJournalDocumentDate").text("-");
    $("#fromJournalDocumentAction").text("-");
    $("#fromJournalDocumentType").text("-");
    $("#fromJournalBranchId").text("-");
    $("#fromJournalDocumentQty").text("-");

}

function journalTransform() {

    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    resetFormJournalTransform();
    modal_show(`JournalTransformDocumentModal`);
}

function changeJournalId(journal) {
    var journalrId = $(journal).val();
    if (journalrId != 0 && journalrId != "" && journalrId != null) {
        $.ajax({
            url: viewData_getjournaldocumentinfobyid_url,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(journalrId),
            success: function (result) {
                fillJournalIdDetails(result);
            },
            error: function (xhr) {
                error_handler(xhr, viewData_getrecord_url)
            }
        });
    }
}

function fillJournalIdDetails(data) {
    $("#fromJournalDocumentStatus").text(data.bySystemName);
    $("#fromJournalDocumentDate").text(data.documentDatePersian);
    $("#fromJournalDocumentAction").text(data.actionIdName);
    $("#fromJournalDocumentType").text(data.documentIdName);
    $("#fromJournalBranchId").text(data.branchIdName);
    $("#fromJournalDocumentQty").text(data.journalLineCount);
}

async function run_button_insert_JournalTransformDocument() {

    var form = $(`#JournalTransformDocumentModal div.modal-body`).parsley();

    var validate = form.validate();
    validateSelect2(form);
    if (!validate) return;

    var model = {
        fromJournalId: +$("#fromJournal").val(),
        branchId: +$("#branchIdJournal").val(),
        documentTypeId: +$("#documentTypeIdJournal").val(),
        toDocumentDateJournalPersian: $("#toDocumentDatePersianJo").val()
    }
    await $.ajax({
        url: viewData_journalduplicate_url,
        type: "POST",
        dataType: "JSON",
        contentType: "application/json",
        cache: false,
        data: JSON.stringify(model),
        success: function (result) {
            if (result.successfull == true) {
                alertify.success(result.statusMessage);
                modal_close("JournalTransformDocumentModal");
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
            error_handler(xhr, viewData_journalduplicate_url);
            return "";
        }
    });

}

function switchPrint(e) {

    if (e.ctrlKey && e.keyCode === KeyCode.key_General_1) {
        e.preventDefault();
        //چاپ سند حسابداری تاریخ ثبت
        printJournalSetting(1, $(`#${activePageTableId} .pagetablebody tr.highlight`));
    }
    else if (e.ctrlKey && e.keyCode === KeyCode.key_General_2) {
        e.preventDefault();
        //چاپ دفتر حسابداری کل معین تفصیل
        printJournalSetting(2, $(`#${activePageTableId} .pagetablebody tr.highlight`));
    }
    else if (e.ctrlKey && e.keyCode === KeyCode.key_General_3) {
        e.preventDefault();
        //چاپ دفتر معین
        printJournalSetting(3, $(`#${activePageTableId} .pagetablebody tr.highlight`));
    }
    else if (e.ctrlKey && e.keyCode === KeyCode.key_General_4) {
        e.preventDefault();
        //چاپ دفتر تفصیل
        printJournalSetting(4, $(`#${activePageTableId} .pagetablebody tr.highlight`));
    }
}

function clickModalJounal(type) {
    printJournalSetting(type, $(`#${activePageTableId} .pagetablebody tr.highlight`));
}

async function getSGLRequierdExcelCallBack(id = null) {

    let subId;

    if (id == null) {
        subId = $(".edited-row").attr("id").split("_")[1] + "_";

        var model = {
            glId: +$("#" + subId + "accountGLId").val(),
            id: +$("#" + subId + "accountSGLId").val()
        };

        if (+$("#" + subId + "accountGLId").val() != 0 && +$("#" + subId + "accountSGLId").val() != 0) {
            $.ajax({
                url: "/api/FM/AccountSGLApi/getsetting",
                async: true,
                cache: false,
                type: "post",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(model),
                success: function (result) {

                    if (result != null && result != undefined) {
                        if (result.accountDetailRequired == 1) {
                            $("#" + subId + "accountDetailId").data("parsley-required-message", "تفصیل اجباری است");
                            $("#" + subId + "accountDetailId").prop("required", true);
                            $("#" + subId + "accountDetailId").removeAttr("disabled");
                            $("#btn-search-" + subId + "accountDetailId").removeAttr("disabled");
                        }
                        else if (result.accountDetailRequired == 2) {
                            $("#" + subId + "accountDetailId").removeData("parsley-required-message");
                            $("#" + subId + "accountDetailId").prop("required", false);
                            $("#" + subId + "accountDetailId").removeAttr("disabled");
                            $("#btn-search-" + subId + "accountDetailId").removeAttr("disabled");
                        }
                        else {
                            $("#" + subId + "accountDetailId").removeData("parsley-required-message");
                            $("#" + subId + "accountDetailId").prop("required", false);
                            $("#" + subId + "accountDetailId").attr("disabled", "disabled");
                            $("#btn-search-" + subId + "accountDetailId").attr("disabled", "disabled");
                        }
                    }
                },
                error: function (xhr) {
                    error_handler(xhr, url);
                }
            });
        }

        if ($("#" + subId + "accountDetailId").prop("disabled") == true) {
            $("#" + subId + "accountDetailId").val("");
            $("#" + subId + "accountDetailName").text("");
        }
    }
    else {
        subId = id;

        var model = {
            glId: +$("#" + subId + "accountGLId").val(),
            id: +$("#" + subId + "accountSGLId").val()
        };

        if (+$("#" + subId + "accountGLId").val() != 0 && +$("#" + subId + "accountSGLId").val() != 0) {
            $.ajax({
                url: "/api/FM/AccountSGLApi/getsetting",
                async: false,
                cache: false,
                type: "post",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(model),
                success: function (result) {
                    if (result != null && result != undefined) {
                        if (result.accountDetailRequired == 1)
                            $("#" + subId + "accountDetailId").prop("required", true);
                        else
                            $("#" + subId + "accountDetailId").prop("required", false);
                    }
                },
                error: function (xhr) {
                    error_handler(xhr, url);
                }
            });
        }
    }

}

function chekExistCodes(value, url) {

    var result = $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        async: false,
        cache: false,
        data: JSON.stringify(value),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return 0;
        }
    });

    return result.responseJSON;
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

function valdtionFormFunction(masterArray) {
    var errorCount = 0;


    for (var i = 0; i < masterArray.length; i++) {

        if (
            +masterArray[i].currencyId == 0 ||
            isNaN(+ masterArray[i].currencyId) ||
            +masterArray[i].exchangeRate == 0 ||
            isNaN(+masterArray[i].exchangeRate) ||
            masterArray[i].description == "" ||
            +masterArray[i].accountGLId == 0 ||
            isNaN(+masterArray[i].accountGLId) ||
            +masterArray[i].accountSGLId == 0 ||
            isNaN(+masterArray[i].accountSGLId) ||
            isNaN(+masterArray[i].accountDetailId) ||
            isNaN(+removeSep(masterArray[i].amountDebit.toString())) ||
            isNaN(+removeSep(masterArray[i].amountCredit.toString())) ||
            (+removeSep(masterArray[i].amountCredit.toString()) == 0 && +removeSep(masterArray[i].amountDebit.toString()) == 0) ||
            (+removeSep(masterArray[i].amountCredit.toString()) > 0 && +removeSep(masterArray[i].amountDebit.toString()) > 0)

        ) {
            errorCount++;
            masterArrayNoneFilter[i].hasError = true;
        }
        else
            masterArrayNoneFilter[i].hasError = false;
    }
    return errorCount;
}

function handlerfunction(type, ...values) {
    let returnedvalue = false, model = {};

    switch (type) {
        case "reqprices":
            returnedvalue = +values[0] === 0 && +values[1] === 0;

            break;

        case "bothprices":
            returnedvalue = +values[0] > 0 && +values[1] > 0;

            break;

        default:
            break;
    }
    return returnedvalue;
}

function printJournalSetting(type, rowElmn) {
    let reportParameters = [], repUrl = "", id = rowElmn.data("id"), documentNo = rowElmn.data("documentno"), reportModel = {}, reportName = "";
    let documentDate = rowElmn.data("documentdatepersian");
    if (type == 1) {
        repUrl = `${stimulsBaseUrl.FM.Prn}journalByDateReportPreview.mrt`;
        reportName = `چاپ حسابداری مرتب سازی بر اساس تاریخ ثبت`
    }
    else if (type == 2) {
        repUrl = `${stimulsBaseUrl.FM.Prn}journalByGlSGLReportPreview.mrt`;
        reportName = `چاپ حسابداری مرتب سازی بر اساس کل - معین - تفصیل`
    }
    else if (type == 3) {
        repUrl = `${stimulsBaseUrl.FM.Prn}journalLevelSglReportPreview.mrt`;
        reportName = `چاپ در سطح معین`;
    }
    else if (type == 4) {
        repUrl = `${stimulsBaseUrl.FM.Prn}journalLevelAccountDetailsReportPreview.mrt`;
        reportName = `چاپ در سطح تفصیل`
    }
    reportParameters = [
        { Item: "journalId", Value: id, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "journalId", Value: id, itemType: "Var" },
        { Item: "journalId", Value: id, itemType: "Var" },
        { Item: "documentNo", Value: documentNo, itemType: "Var" },
        { Item: "documentDate", Value: documentDate, itemType: "Var" },
    ];

    reportModel = {
        reportName: reportName,
        reportUrl: repUrl,
        parameters: reportParameters,
        reportSetting: reportSettingModel
    }

    window.open(`${viewData_report_url}?strReportModel=${JSON.stringify(reportModel)}`, '_blank');
}

function afterCreateFooterTable() {

    var sumAmountCredit = sumList(masterArrayNoneFilter, 'amountCredit');
    var sumAmountDebit = sumList(masterArrayNoneFilter, 'amountDebit');
    var result = +sumAmountDebit - sumAmountCredit;
    result = result > 0 ? result : Math.abs(result);

    if (+result !== 0) {
        $("#footerPageTableEx tr:eq(1) td").last().html(`${isNaN(sumAmountCredit) ? 0 : transformNumbers.toComma(sumAmountCredit)} <span class="number-label-alerts mr-1 font-600 highlight-danger"> | ${isNaN(result) ? 0 : transformNumbers.toComma(result)}</span >`);
    }
    else
        $("#footerPageTableEx tr:eq(1) td").last().html(transformNumbers.toComma(sumAmountCredit));
}

function sumList(items, prop) {
    return items.reduce(function (a, b) {
        var a = isNaN(+removeSep(a.toString())) ? 0 : +removeSep(a.toString());
        var b = isNaN(+removeSep(b[prop].toString())) ? 0 : +removeSep(b[prop].toString());
        return (a) + (b);
    }, 0);
}

function showAmountDifferenceInForm() {

    var sumAmountCredit = sumList(masterArray, 'amountCredit');
    var sumAmountDebit = sumList(masterArray, 'amountDebit');
    var result = +sumAmountDebit - sumAmountCredit;
    result = result > 0 ? transformNumbers.toComma(result) : transformNumbers.toComma(Math.abs(result));
    if (+removeSep(result) > 0)
        return false;
    else
        return true;
}

function tr_onkeydownEx(ev, pg_name) {

    if ([KeyCode.ArrowUp, KeyCode.ArrowDown, KeyCode.Enter, KeyCode.Esc, KeyCode.Space, KeyCode.Page_Up, KeyCode.Page_Down].indexOf(ev.which) == -1) return;
    var index = excel_pagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = excel_pagetables[index].pagetable_id;
    var pagetable_currentcol = excel_pagetables[index].currentcol;
    var pagetable_currentrow = excel_pagetables[index].currentrow;
    var pagetable_currentpage = excel_pagetables[index].currentpage;
    var pagetable_lastpage = excel_pagetables[index].lastpage;
    var pagetable_editable = excel_pagetables[index].editable;
    var pagetable_selectable = excel_pagetables[index].selectable;
    var pagetable_tr_editing = excel_pagetables[index].trediting;

    if ($(`#${pagetable_id} .pagetablebody > tbody > tr > td:last-child > .dropdown`).hasClass("show"))
        return;

    if (isSearcheModalOpen) return;

    if (ev.which === KeyCode.ArrowUp) {
        ev.preventDefault();

        if ($(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow - 1}`)[0] !== undefined) {

            if (pagetable_editable && pagetable_tr_editing) {
                // function exist
                if (typeof tr_save_row === "function")
                    tr_save_row(pagetable_id, KeyCode.ArrowUp);

            }
            else {
                pagetable_currentrow--;
                excel_pagetables[index].currentrow = pagetable_currentrow;
                after_change_trEx(pg_name, KeyCode.ArrowUp);
            }
        }
        else {
            if (pagetable_editable && pagetable_tr_editing) {
                // function exist
                if (typeof tr_save_row === "function")
                    tr_save_row(pagetable_id, KeyCode.ArrowUp);

            }
            else if (pagetable_currentpage !== 1)
                pagetable_prevpage(pagetable_id);
        }
    }
    else if (ev.which === KeyCode.ArrowDown) {
        ev.preventDefault();

        if (document.activeElement.className.indexOf("select2") >= 0) // Open when ArrowDone In Select2
            return;

        if ($(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow + 1}`)[0] !== undefined) {

            if (pagetable_editable && pagetable_tr_editing) {
                // function exist
                if (typeof tr_save_row === "function")
                    tr_save_row(pagetable_id, KeyCode.ArrowDown);

            }
            else {
                pagetable_currentrow++;
                excel_pagetables[index].currentrow = pagetable_currentrow;

                after_change_trEx(pg_name, KeyCode.ArrowDown);
            }
        }
        else {
            if (pagetable_editable && pagetable_tr_editing) {
                // function exist
                if (typeof tr_save_row === "function")
                    tr_save_row(pagetable_id, KeyCode.ArrowDown);

            }
            else if (pagetable_currentpage != pagetable_lastpage) {
                excel_pagetables[index].currentrow = 1;
                pagetable_nextpage(pagetable_id);
            }
        }
    }
    else if (ev.which === KeyCode.Enter) {
        if (pagetable_editable) {

            if (pagetable_tr_editing)
                if (+$(`#${pg_name} .editrow`).parents("tr").attr("id").split("row")[1] !== pagetable_currentrow)
                    return;

            if (!pagetable_tr_editing) {
                configSelect2_trEditingEx(pagetable_id, pagetable_currentrow, true);
                configSearchPlugins(pagetable_id, pagetable_currentrow, true);
                pagetable_currentcol = excel_pagetables[index].currentcol = getFirstColIndexHasInputEx(pg_name);
            }
            var currentElm = $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td#col_${pagetable_currentrow}_${pagetable_currentcol}`).find("input:not([type=checkbox]),select,div.funkyradio,.search-modal-container > input").first()
            // ستون فعلی - input یا select وجود داشت
            if (currentElm.length != 0) {

                let elmId = currentElm.attr("id").split("_")[0];
                if (elmId == "currencyId") {
                    if (currentElm.val() == getDefaultCurrency()) {
                        excel_pagetables[index].currentcol = pagetable_currentcol + 1;
                        pagetable_currentcol += 1;
                        $(`#exchangeRate_${pagetable_currentrow}`).val(1).prop("disabled", true);
                    }
                    else
                        $(`#exchangeRate_${pagetable_currentrow}`).prop("disabled", false);
                }

                if (elmId == "accountSGLId") {
                    let res = getSGLRequierdEx(pagetable_currentrow);
                    if ((typeof res !== "undefined" && res.accountDetailRequired == 3) || res == undefined) {

                        excel_pagetables[index].currentcol = pagetable_currentcol + 1;
                        pagetable_currentcol += 1;
                    }
                }

                if (currentElm.attr("disabled") == "disabled") {
                    set_row_editingEx(pg_name);


                    if (currentElm.hasClass("funkyradio")) {
                        currentElm.focus();

                        var td_lbl_funkyradio = currentElm.find("label");
                        td_lbl_funkyradio.addClass("border-thin");
                    }
                    else if (currentElm.hasClass("select2")) {
                        var colno = currentElm.parent().parent().attr("id").split("_")[2];
                        $(`#${pg_name} #${currentElm.attr('id')}`).select2();
                        $(`#${pg_name} #${currentElm.attr('id')}`).select2("focus");
                    }
                    else
                        currentElm.focus();
                }
                else {
                    var nextElm = undefined,
                        nextTds = $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} td`),
                        nextTdsL = nextTds.length;

                    for (var x = 0; x < nextTdsL; x++) {
                        var v = nextTds[x];
                        if (nextElm == undefined) {
                            if ($(v).attr("id") != undefined) {
                                var currentcol = $(v).attr("id").split("_")[2];
                                if (+currentcol > +pagetable_currentcol) {
                                    var nxtElm = $(v).find('input,select,div.funkyradio,button[data-isfocusinline="true"]').first();
                                    if (nxtElm.length > 0 && $(nxtElm).attr("readonly") != "readonly") {
                                        nextElm = nxtElm;
                                    }
                                }
                            }
                        }
                    }
                    // المنت بعدی وجود داشت
                    if (nextElm != undefined && nextElm.length != 0) {
                        if (currentElm.hasClass("funkyradio")) {
                            var td_lbl_funkyradio = currentElm.find("label");
                            td_lbl_funkyradio.removeClass("border-thin");
                        }
                        if (nextElm.hasClass("select2")) {
                            var colno = nextElm.parent().parent().attr("id").split("_")[2];
                            tr_onfocusEx(pg_name, colno);
                            $(`#${pg_name} #${nextElm.attr('id')}`).select2();
                            $(`#${pg_name} #${nextElm.attr('id')}`).select2("focus");
                        }
                        else if (nextElm.hasClass("funkyradio")) {
                            nextElm.focus();

                            var td_lbl_funkyradio = nextElm.find("label");
                            td_lbl_funkyradio.addClass("border-thin");
                        }
                        else
                            nextElm.focus();
                    }
                    else {
                        // سظر بعدی وجود داشت
                        if ($(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow + 1}`)[0] !== undefined) {

                            if (pagetable_editable && pagetable_tr_editing) {
                                // function exist
                                if (typeof tr_save_row === "function")
                                    tr_save_row(pagetable_id, KeyCode.ArrowDown);
                            }
                            else {
                                pagetable_currentrow++;
                                excel_pagetables[index].currentrow = pagetable_currentrow;

                                after_change_trEx(pg_name, KeyCode.ArrowDown);
                            }
                        }
                        else {
                            if (pagetable_editable && pagetable_tr_editing) {
                                // function exist
                                if (typeof tr_save_row === "function")
                                    tr_save_row(pagetable_id, KeyCode.ArrowDown);
                            }
                            else {
                                let index = $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow}`).data("index");
                                if (index + 1 == masterArray.length)
                                    $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow}`).addClass("highlight").focus();
                                else {
                                    pagetable_nextpage(pagetable_id);
                                    $(`#${pagetable_id} .pagetablebody > tbody > #row1`).addClass("highlight").focus();
                                }
                            }
                        }
                    }
                }
            }
            else {
                var nextElm = $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td#col_${pagetable_currentrow}_${pagetable_currentcol + 1}`).find("input:first,select:first,div.funkyradio:first,.search-modal-container > input");
                if (nextElm.length != 0)
                    nextElm[0].focus();
                else {
                    $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).find("input,select,.search-modal-container > input").attr("disabled", true);
                }
            }
        }
    }
    else if (ev.which === KeyCode.Esc) {
        if (pagetable_editable) {

            ev.preventDefault();
            ev.stopPropagation();

            if (pagetable_tr_editing) {
                configSelect2_trEditingEx(pagetable_id, pagetable_currentrow);
                configSearchPlugins(pagetable_id, pagetable_currentrow);
                after_change_trEx(pg_name, KeyCode.Esc);

                if (typeof getrecord == "function") {
                    getrecord(pg_name);
                    pagetable_currentcol = excel_pagetables[index].currentcol = getFirstColIndexHasInputEx(pg_name);
                }
            }
            else
                confirmForClose();

        }
        else confirmForClose();
    }
    else if (ev.which === KeyCode.Space) {



        if (pagetable_editable && pagetable_tr_editing) {

            var elm = $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td#col_${pagetable_currentrow}_${pagetable_currentcol}`).find("select,div.funkyradio").first()

            if (elm.hasClass("funkyradio")) {
                ev.preventDefault();
                var checkbox_funky = $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td#col_${pagetable_currentrow}_${pagetable_currentcol} .funkyradio #btn_${pagetable_currentrow}_${pagetable_currentcol}`);
                checkbox_funky.prop("checked", !checkbox_funky.prop("checked")).trigger("change");
            }

        }

        else if (pagetable_editable === false && pagetable_tr_editing === false || pagetable_selectable) {
            ev.preventDefault();
            pagetable_currentcol = 1;

            var editMode = false;
            $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).find("input", "select").each(function () {
                if ($(this).prop("disabled") == false && $(this).attr("type") != "checkbox")
                    editMode = true;
            })
            var elm = $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td#col_${pagetable_currentrow}_${pagetable_currentcol}`).find("input[type='checkbox']").first();
            if (!editMode) {
                if (elm.prop("checked")) {
                    var pagetable = $(`#${pg_name}`);
                    $(pagetable).find("input[type='checkbox']").first().prop("checked", false);
                }
                elm.prop("checked", !elm.prop("checked"));
                itemChangeEx(elm);
            }
        }
    }
}

function onclickFunctionValidator(id, rowNo) {
    if (id == "accountSGLId") {

        if (+$(`#accountGLId_${rowNo}`).val() == 0) {
            alertify.warning("کد کل وارد نشده").delay(alertify_delay);
            $(`#accountGLId_${rowNo}`).focus();
            return false;
        }

    }
    else if (id == "accountDetailId") {

        if (+$(`#accountGLId_${rowNo}`).val() == 0) {
            alertify.warning("کد کل وارد نشده").delay(alertify_delay);
            $(`#accountGLId_${rowNo}`).focus();
            return false;
        }
        else if (+$(`#accountSGLId_${rowNo}`).val() == 0) {
            alertify.warning("کد معین وارد نشده").delay(alertify_delay);
            $(`#accountSGLId_${rowNo}`).focus();
            return false;
        }

    }
    return true;
}

function selectedCallBackFunction(id, rowNo) {
    if (id == "accountGLId") {
        $(`#accountSGLId_${rowNo}`).val("");
        $(`#accountDetailId_${rowNo}`).val("");
    }
    else if (id == "accountSGLId") {
        getSGLRequierdEx(rowNo);

        $(`#accountDetailId_${rowNo}`).val("");
    }
}

function getSGLRequierdEx(rowNo) {

    var model = {
        glId: +$(`#accountGLId_${rowNo}`).val(),
        id: +$(`#accountSGLId_${rowNo}`).val()
    }, resluteReqStatus = {};

    if (model.glId > 0 && model.id > 0) {
        resluteReqStatus = $.ajax({
            url: "/api/FM/AccountSGLApi/getsetting",
            async: false,
            cache: false,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(model),
            success: function (result) {
                if (result != null && result != undefined) {
                    if (result.accountDetailRequired == 1) {
                        $(`#accountDetailId_${rowNo}`).data("parsley-required-message", "تفصیل اجباری است");
                        $(`#accountDetailId_${rowNo}`).prop("required", true);
                        $(`#accountDetailId_${rowNo}`).removeAttr("disabled");
                        $(`#btn-search-accountDetailId_${rowNo}`).removeAttr("disabled");

                    }
                    else if (result.accountDetailRequired == 2) {
                        $(`#accountDetailId_${rowNo}`).removeData("parsley-required-message");
                        $(`#accountDetailId_${rowNo}`).prop("required", false);
                        $(`#accountDetailId_${rowNo}`).removeAttr("disabled");
                        $(`#btn-search-accountDetailId_${rowNo}`).removeAttr("disabled");
                    }
                    else {
                        $(`#accountDetailId_${rowNo}`).removeData("parsley-required-message");
                        $(`#accountDetailId_${rowNo}`).prop("required", false);
                        $(`#accountDetailId_${rowNo}`).attr("disabled", "disabled");
                        $(`#btn-search-accountDetailId_${rowNo}`).attr("disabled", "disabled");
                    }
                }
                else {
                    $(`#accountDetailId_${rowNo}`).removeData("parsley-required-message");
                    $(`#accountDetailId_${rowNo}`).prop("required", false);
                    $(`#accountDetailId_${rowNo}`).attr("disabled", "disabled");
                    $(`#btn-search-accountDetailId_${rowNo}`).attr("disabled", "disabled");
                }

                if (checkResponse(result))
                    if (typeof result.accountDetailRequired != "undefined")
                        return result.accountDetailRequired;
                    else
                        return {};
                else
                    return {};
            },
            error: function (xhr) {
                error_handler(xhr, url);
                return 0;
            }
        });
    } else {
        var msg = alertify.warning("مقدار معین معتبر نمی باشد");
        msg.delay(alertify_delay);
        return;
    }

    return resluteReqStatus.responseJSON;
}

function run_button_importExcelJournal(lineId, rowNo, Elem) {

    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;

    importExcel(lineId);

    let titleExcle_details = `| ${$(`.pagetablebody.new-page-table #row${rowNo}`).data("id")} | ${$(`.pagetablebody.new-page-table #col_${rowNo}_2`).text()} | ${$(`.pagetablebody.new-page-table #col_${rowNo}_5`).text()} | ${$(`.pagetablebody.new-page-table #col_${rowNo}_6`).text()}`;
    $("#modal_titleExcle_details").html(titleExcle_details);
}

function run_button_print(rowNumbers) {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    $("#modal_keyid_journal_value").text(rowNumbers);
    rowNumberJournal = rowNumbers;
    modal_show(`PrnJournal`);
}

function run_button_showStepLogsjournal(id, rowno) {
    selectedRowId = `row${rowno}`;
    $("#actionJo").empty();
    var stageId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("stageid");
    fill_dropdown(`${viewData_baseUrl_FM}/JournalStageActionApi/list`, "id", "name", "actionJo", true, stageId);
    identityIdCurrent = +$(`#${activePageTableId}  tbody tr.highlight`).data("id");
    stepLogJournal(id);
    idForStepAction2 = id
    var currentActionId = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("actionid");
    var bySystem = +$(`#${activePageTableId}  tbody tr#${selectedRowId}`).data("bysystem");
    $("#actionJo").val(currentActionId).trigger("change").prop("disabled", bySystem);
    $("#update_action_btn").prop("disabled", bySystem);
    modal_show("stepLogModalJournal");
}

$('#displayJournalLineModel').on("hidden.bs.modal", function (evt) {
    let switchUser = ""
    if ($("#userType").prop("checked")) {
        switchUser = "my"
    } else {
        switchUser = "all"
    }
    pagetable_formkeyvalue = ["", "", switchUser, null];
});

$("#stepLogModalJournal").on("hidden.bs.modal", async function () {
    idForStepAction2 = ""
});

$('#importExcelModal').on("hidden.bs.modal", function (evt) {
    get_NewPageTableV1();
});

$(`#pagetable`).on("keydown", function (e) {
    if ([KeyCode.key_General_1, KeyCode.key_General_2, KeyCode.key_General_3, KeyCode.key_General_4].indexOf(e.which) == -1) return;
    switchPrint(e)
});

$(`#PrnJournal`).on("keydown", function (e) {
    if ([KeyCode.key_General_1, KeyCode.key_General_2, KeyCode.key_General_3, KeyCode.key_General_4].indexOf(e.which) == -1) return;
    switchPrint(e)
});

$("#insertJournalTransformDocument").click(async function () {
    await run_button_insert_JournalTransformDocument();
})

$("#addJournal").on("click", function () {
    $("#documentNoContainer").addClass("d-none");
    $("#documentNoJo").val("").prop("disabled", true);
    viewData_insrecord_url = viewData_insrecord_url_journal;
    modal_ready_for_add("AddEditModalJu");
});

$("#stimul_preview").click(function () {
    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;



    let index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id);
    if ($("#userType").prop("checked"))
        pagetable_formkeyvalue = ["", "", "my", 0];
    else
        pagetable_formkeyvalue = ["", "", "all", null];

    if (csvModel == null) {
        csvModel = {
            FieldItem: $(`#${pagetable_id} .btnfilter`).attr("data-id"),
            FieldValue: arr_pagetables[index].filtervalue,
            Form_KeyValue: pagetable_formkeyvalue
        }
    }

    var p_id = $(`#${pagetable_id} .btnfilter`).attr("data-id");
    if (p_id == "filter-non")
        p_id = "";

    var p_value = $(`#${pagetable_id} .filtervalue`).val();
    var p_type = $(`#${pagetable_id} .btnfilter`).attr("data-type");
    var p_size = $(`#${pagetable_id} .btnfilter`).attr("data-size");
    var id = actionId = stageId = null;
    if (p_value != "") {
        if (p_id == "id")
            id = p_value;
        if (p_id == "actionId")
            actionId = p_value;
        if (p_id == "stageId")
            stageId = p_value;
    }
    var userId = getUserId();

    var reportParameters = [
        { Item: "PageNo", Value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "PageRowsCount", value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "Id", Value: null, SqlDbType: dbtype.Int, Size: p_size },
        { Item: "DocumentNo", Value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "FromDocumentDate", Value: null, SqlDbType: dbtype.DateTime2, Size: 0 },
        { Item: "ToDocumentDate", Value: null, SqlDbType: dbtype.DateTime2, Size: 0 },
        { Item: "DocumentTypeId", Value: null, SqlDbType: dbtype.TinyInt, Size: p_size },
        { Item: "BranchId", Value: null, SqlDbType: dbtype.Int, Size: p_size },
        { Item: "CreateUserId", Value: $("#userType").prop("checked") ? userId : null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "FromCreateDateTime", Value: null, SqlDbType: dbtype.DateTime2, Size: p_size },
        { Item: "ToCreateDateTime", Value: null, SqlDbType: dbtype.DateTime2, Size: p_size },
        { Item: "WorkflowId", Value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "ActionName", Value: null, SqlDbType: dbtype.NVarChar, Size: p_size },


    ]

    stimul_report(reportParameters);
});

$("#userType").on("change", function () {

    var check = controller_check_authorize(viewData_controllername, "VIWALL");
    if (!check)
        return;

    if ($(this).prop("checked"))
        pagetable_formkeyvalue = ["", "", "my", null];
    else
        pagetable_formkeyvalue = ["", "", "all", null];

    get_NewPageTableV1();

});

window.Parsley._validatorRegistry.validators.reqprices = undefined;
window.Parsley.addValidator('reqprices', {
    validateString: (value, valueAttr, resElment) => {

        let row = resElment.$element[0].id.split("_")[1],
            amountDebit = +removeSep($(`#amountDebit_${row}`).val()),
            amountCredit = +removeSep($(`#amountCredit_${row}`).val());

        return !handlerfunction("reqprices", amountDebit, amountCredit);
    },
    messages: {
        en: 'یکی از مبالغ را وارد کنید',
    }
});

window.Parsley._validatorRegistry.validators.bothprices = undefined;
window.Parsley.addValidator('bothprices', {
    validateString: (value, valueAttr, resElment) => {
        let row = resElment.$element[0].id.split("_")[1],
            amountDebit = +removeSep($(`#amountDebit_${row}`).val()),
            amountCredit = +removeSep($(`#amountCredit_${row}`).val());

        return !handlerfunction("bothprices", amountDebit, amountCredit);
    },
    messages: {
        en: 'هر دو مبالغ نمیتواند مقدار داشته باشد',
    }
});

initJournalIndexForm();