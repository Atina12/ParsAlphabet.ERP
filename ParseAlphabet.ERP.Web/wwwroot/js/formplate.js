var viewData_print_url = `/Report/Print`;
var viewData_print_url1 = `/Report/NewPrint`;
var viewData_print_direct_url = `/Report/DirectPrint`;
var viewData_report_url = `/Report/Index`;
var viewData_printpdf_url = `/Report/PrintPdf`;
var viewData_exportpdf_url = `/Report/ExportPdf`;
var modal_default_name = `AddEditModal`;
var modal_open_state = ``;
$("input").attr("autocomplete", "off");
var reportSettingModel = { newPageAfter: false, resetPageNumber: false, showLogo: true, showReportDate: true };
var csvModel = null;
var isSecondLang = false;
var activePageTableId = "";

function focusFirstInput(item) {
    var firstInput = $(item).find("[tabindex]:not(:disabled)").first();
    if (firstInput.hasClass("select2"))
        $(`#${firstInput.attr("id")}`).select2('focus');
    else
        firstInput.focus();
}

$(document).ready(function () {
    focusFirstInput(this);
});

function funkyradio_keydown(e, elmentid) {

    if (e.keyCode === KeyCode.Space) {
        e.preventDefault();
        var elm = $(`#${elmentid}`);

        if ($(elm).prop("disabled")) {
            return;
        }

        var switchValue = elm.attr("switch-value").split(',');

        if (elm.prop("checked") == false) {
            elm.prop("checked", true);
            $(elm).nextAll().remove();
            $(elm).after(`<label class="border-thin" for="${$(elm).attr("id")}">${switchValue[0]}</label>`);
            $(elm).trigger("change");

        }
        else {
            elm.prop("checked", false);
            $(elm).nextAll().remove();
            $(elm).after(`<label class="border-thin" for="${$(elm).attr("id")}">${switchValue[1]}</label>`);
            $(elm).trigger("change");

        }
    }
}

function setDefaultActiveCheckbox(elm) {
    if ($("#modal_keyid_value").text() == "") {
        var switchValue = $(elm).attr("switch-value").split(',');
        if (!$(elm).prop("checked")) {
            $(elm).prop("checked", true);
            var lbl_funkyradio1 = $(elm).siblings("label");
            $(lbl_funkyradio1).attr("for", $(elm).attr("id"));
            $(lbl_funkyradio1).text(switchValue[0]);
        }
    }
}

function funkyradio_onchange(elm) {

    var switchValue = $(elm).attr("switch-value").split(',');
    if ($(elm).prop("checked")) {
        var lbl_funkyradio1 = $(elm).siblings("label");
        $(lbl_funkyradio1).attr("for", $(elm).attr("id"));
        $(lbl_funkyradio1).text(switchValue[0]);
    }
    else {
        var lbl_funkyradio0 = $(elm).siblings("label");
        $(lbl_funkyradio0).attr("for", $(elm).attr("id"));
        $(lbl_funkyradio0).text(switchValue[1]);
    }
}

function funkyradio_switchvalue() {
    if ($("div > .funkyradio ").length > 0) {
        $("div > .funkyradio ").each(function (index) {

            $("div > .funkyradio ")[index].onfocus = function () {
                var lbl_funkyradio = $(this).find("label");
                lbl_funkyradio.addClass("border-thin");
            };

            $("div > .funkyradio ")[index].onblur = function () {
                var lbl_funkyradio = $(this).find("label");
                lbl_funkyradio.removeClass("border-thin");
            };

            var funkyradio_elm = $("div > .funkyradio ")[index];
            var funkyradio_chk = $(funkyradio_elm).find("input:checkbox");
            var switchValue = funkyradio_chk.attr("switch-value").split(',');

            $(funkyradio_elm).find("label").remove();
            $(funkyradio_elm).append(`<label for="${funkyradio_chk.attr("id")}">${funkyradio_chk.prop("checked") ? switchValue[0] : switchValue[1]}</label >`);
        });
    }
}
funkyradio_switchvalue();
$(document).off("keydown");
$(document).on('keydown', `.row .form-control:not(.filtervalue),
                            #header-div table .form-control:not(.filtervalue),
                            .row .funkyradio:not(.filtervalue),
                            .row .select2-selection:not(.filtervalue),
                            .pagetablebody .select2-selection,
                            .row span:not(.filtervalue),
                            .row img:not(.filtervalue)`, function (e) {

    if (e.keyCode === KeyCode.Enter) {

        var elm = $(this);
        var tabindex = parseInt(elm.attr("tabindex"));
        if (tabindex) {
            e.preventDefault();
            var tabindexNext = parseInt(elm.attr("tabindex")) + 1;
            var nextElement = $(elm).closest(`.card-body,.modal,.pagetablebody,#header-div table`).find(`[tabindex='${tabindexNext}']:not(".displaynone")`);
            while (nextElement.attr("disabled") === "disabled" || nextElement.hasClass("displaynone") || nextElement.closest("div.form-group").hasClass("displaynone") || nextElement.parent().parent().hasClass("select2-container--disabled")) {
                tabindexNext += 1;
                nextElement = $(elm).closest(`.card-body,.modal,.pagetablebody,#header-div table`).find(`[tabindex='${tabindexNext}']`);
            }

            if (nextElement.hasClass("select2-selection select2-selection--single")) {
                nextElement = nextElement.parent().parent().parent().find("select");
                $(`#${nextElement.attr('id')}`).select2('focus');
            }
            else if (nextElement.hasClass("funkyradio")) {
                nextElement.focus();

                var lbl_funkyradio = nextElement.find("label");
                lbl_funkyradio.addClass("border-thin");
            }
            else {
                $(nextElement).focus();

            }

        }
    }

}).on("keydown", function (e) {
    //insert
    if (e.ctrlKey && e.keyCode === KeyCode.Insert) {
        e.preventDefault();

        if (typeof modal_ready_for_add !== "undefined")
            modal_ready_for_add();


    }
    //save
    else if (e.ctrlKey && e.shiftKey && e.keyCode === KeyCode.key_s) {
        e.preventDefault();
        modal_save();
    }
    else if (e.ctrlKey && e.keyCode === KeyCode.key_f) {
        e.preventDefault();
        modal_show('searchAdmissionModal')
    }

    //pgup
    //else if (e.keyCode === KeyCode.Page_Up) {
    //    e.preventDefault();

    //    if (activePageTableId != "")
    //        pagetable_prevpage(activePageTableId);
    //}
    //pgdn
    //else if (e.keyCode === KeyCode.Page_Down) {
    //    e.preventDefault();

    //    if (activePageTableId != "")
    //        pagetable_nextpage(activePageTableId);
    //}
});

$(".modal-header").on("mousedown", function (mousedownEvt) {
    var $draggable = $(this);
    var x = mousedownEvt.pageX - $draggable.offset().left,
        y = mousedownEvt.pageY - $draggable.offset().top;
    $("body").on("mousemove.draggable", function (mousemoveEvt) {
        $draggable.closest(".modal-dialog").offset({
            "left": mousemoveEvt.pageX - x,
            "top": mousemoveEvt.pageY - y
        });
    });
    $("body").one("mouseup", function () {

        $("body").off("mousemove.draggable");
    });
    $draggable.closest(".modal").one("bs.modal.hide", function () {
        $("body").off("mousemove.draggable");
    });
});

function modal_onkeydown(e, elm) {

    if (e.keyCode == KeyCode.Esc || (e.ctrlKey && e.keyCode == KeyCode.key_s)) {
        e.stopPropagation();
        let close_button = $(elm).find(".modal-footer > button:last"),
            save_button = $(elm).find(".modal-footer > button:first");
        e.preventDefault();
        if (e.keyCode == KeyCode.Esc)
            close_button.click();

        if (e.ctrlKey && e.keyCode == KeyCode.key_s)
            save_button.click();
    }
};

function selectText(elm) {
    if ($(elm).prop("tagName").toLowerCase() == "input")
        elm.select();
}

function stimul_preview(pagetable_id = null) {
    if (pagetable_id == null) pagetable_id = "pagetable";

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;
    var p_id = $(`#${pagetable_id} .btnfilter`).attr("data-id");

    if (p_id == "filter-non")
        p_id = "";

    var p_value = $(`#${pagetable_id} .filtervalue`).val();
    var p_type = $(`#${pagetable_id} .btnfilter`).attr("data-type");
    var p_size = $(`#${pagetable_id} .btnfilter`).attr("data-size");
    var p_url = viewData_print_file_url;
    var p_isPageTable = true;
    var p_tableName = viewData_print_tableName;
    var p_keyValue = +$("#form_keyvalue").val();
    var secondLang = isSecondLang;
    window.open(`${viewData_print_url}?pUrl=${p_url}&pName=${p_id}&pValue=${p_value}&pType=${p_type}&pSize=${p_size}&isPageTable=${p_isPageTable}&tableName=${p_tableName}&keyValue=${p_keyValue}&isSecondLang=${secondLang}`, '_blank');
}

function stimul_previewNew(pagetable_id = null) {

    if (pagetable_id == null)
        pagetable_id = "pagetable";

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    var currentPageTableStatus = $(`#${pagetable_id} .pagetablebody `).hasClass("new-page-tableV1")

    var p_id = $(`#${pagetable_id} .btnfilter`).attr("data-id");

    p_id = currentPageTableStatus ? "" : p_id == "filter-non" ? "" : p_id

    var p_value = currentPageTableStatus ? "" : $(`#${pagetable_id} .filtervalue`).val();
    var p_type = currentPageTableStatus ? "" : $(`#${pagetable_id} .btnfilter`).attr("data-type");
    var p_size = currentPageTableStatus ? "" : $(`#${pagetable_id} .btnfilter`).attr("data-size");
    var p_url = viewData_print_file_url;
    var p_isPageTable = true;
    var p_tableName = viewData_print_tableName;
    var p_keyValue = currentPageTableStatus ? 0 : +$("#form_keyvalue").val();
    var secondLang = isSecondLang;
    window.open(`${viewData_print_url1}?pUrl=${p_url}&pName=${p_id}&pValue=${p_value}&pType=${p_type}&pSize=${p_size}&isPageTable=${p_isPageTable}&tableName=${p_tableName}&keyValue=${p_keyValue}&isSecondLang=${secondLang}`, '_blank');
}

function stimul_report(reportParameters) {

    var reportModel = {
        reportUrl: viewData_print_file_url,
        parameters: reportParameters,
        reportSetting: reportSettingModel,
        reportName: viewData_form_title
    }

    window.open(`${viewData_report_url}?strReportModel=${JSON.stringify(reportModel)}`, '_blank');
}

function stimul_print() {
    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    $.ajax({
        url: viewData_print_direct_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(viewData_print_model),
        async: false,
        cache: false,
        success: function (result) {
            $('#frmDirectPrint').contents().find("body").html("");
            $('#frmDirectPrint')[0].contentWindow.document.write(result);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_print_direct_url)
        }
    });
}

function export_csv(elemId = undefined, value = undefined) {
    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    $(`#${elemId == undefined || elemId == null ? "exportCSV" : elemId}`).prop("disabled", true);

    setTimeout(function () {

        let index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id);

        var currentPageTableStatus = $(`#${pagetable_id} .pagetablebody `).hasClass("new-page-tableV1")

        if (csvModel == null) {

            if (currentPageTableStatus) {
                csvModel = {
                    filters: arrSearchFilter[index].filters,
                    Form_KeyValue: pagetable_formkeyvalue
                }
            }
            else {
                csvModel = {
                    FieldItem: currentPageTableStatus ? "" : $(`#${pagetable_id} .btnfilter`).attr("data-id"),
                    FieldValue: currentPageTableStatus ? "" : arr_pagetables[index].filtervalue,
                    Form_KeyValue: currentPageTableStatus ? [0] : [+$("#form_keyvalue").val()]
                }
            }

        }

        if (typeof value !== "undefined") {
            if (typeof value == "object")
                csvModel.Form_KeyValue = value;
            else
                csvModel.Form_KeyValue.push(value);
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

function export_csv_report(csvModel) {
    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;
    if (csvModel == null) {
        var msg = alertify.warning("پارامترهای گزارش مقدار دهی نشده");
        msg.delay(alertify_delay);
    }
    else {
        $.ajax({
            url: viewData_csv_url,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(csvModel),
            cache: false,
            success: function (result) {
                generateCsv(result);
            },
            error: function (xhr) {
                error_handler(xhr, viewData_csv_url)
            }
        });
    }

}

function addForm() {
    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    var check1 = checkCounter();
    if (!check1.successfull) {
        var msg = alertify.warning(check1.statusMessage);
        msg.delay(admission.delay);
        return;
    }


    if (typeof viewData_add_form_title == "string")
        navigation_item_click(viewData_add_page_url, viewData_add_form_title);
    else
        navigation_item_click(viewData_add_page_url, "");
}

function modal_close(modal_name = null) {

    if (modal_name === null)
        modal_name = modal_default_name;

    try {

        var form = $(`#${modal_name} div.modal-body`).parsley();
        $(`#${modal_name} div.modal-body *`).removeClass("parsley-error");
        if (typeof form !== "undefined" && form !== undefined)
            if (form.length > 1)
                form[0].reset();
            else
                form.reset();


    } catch (e) {

    }

    $(`#${modal_name}`).modal("hide");
    $(`#${modal_name} .pagerowscount`).removeClass("dropup");
    $(`#${modal_name} .modal-dialog`).removeAttr("style");

    pagetable_id = "pagetable";

    if (typeof arr_pagetables != "undefined") {

        var index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id);

        if (index >= 0) {

            var pagetable_currentrow = arr_pagetables[index].currentrow;

            $(`#pagetable .pagetablebody > tbody > #row${pagetable_currentrow}`).focus();
        }

    }
}

function modal_show(modal_name = null) {
    if (modal_name === null)
        modal_name = modal_default_name;

    var firstRowsCountItem = $(`#${modal_name} .pagerowscount .dropdown-menu .dropdown-item:first`).text();
    $(`#${modal_name} .pagerowscount button:first`).text(firstRowsCountItem);

    $("input").attr("autocomplete", "off");

    $(`#${modal_name}`).modal({ backdrop: "static", show: true });
}

function modal_clear_items(modal_name = null, expectedItem = null) {
    if (modal_name == null)
        modal_name = modal_default_name;

    var element = $(`#${modal_name}`);

    if (element.find(".nav-item a").length > 0) //reset Tabs
        $($(`#${"AddEditModalVe"}`).find(".nav-item a")[0]).click();

    element.find("input,select,img,textarea").each(function () {
        var elm = $(this);
        var elmid = elm.attr("id");


        if (!elmid)
            return;

        var sw = 1;

        if ((expectedItem != null) && (elmid == expectedItem))
            sw = 0;
        if (sw == 1) {
            var elmtag = elm.prop("tagName").toLowerCase();

            var resetElm = elm.attr("notreset");

            if (typeof resetElm == "undefined") {

                if (elmtag === `input`) {
                    var type = elm.attr("type").toLowerCase();
                    if (type === `text` || type === `number` || type === `password`)
                        elm.val('');
                    else
                        if (type === `checkbox`)
                            elm.prop("checked", false);
                }
                else if (elmtag === "textarea")
                    elm.val('');
                else
                    if (elmtag === `select`) {

                        if ($(elm).hasClass("select2"))
                            $(`#${$(elm).prop("id")} option:eq(0)`).prop('selected', true).trigger("change.select2");
                        else
                            elm.val($(elm).prop("selectedIndex", 0).val());
                    }
                    else if (elmtag === `img`)
                        elm.attr("src", "/content/images/blank-person.png");
            }
        }
    });
}

$(".form-control:not(.notFocusSelect)").on("focus", function () {
    selectText($(this));
});

function displayCountRowModal(count, modalId) {
    let length = count > 50 ? "50+" : count,
        btnDisplay = `<button id="modalRowCountBtn" class="btn btn-secondary" disabled>تعداد سطر : <span id="modalRowCount">${length}</span></button>`;

    if ($(`#${modalId} .modal-content .modal-footer #modalRowCountBtn`).length > 0)
        $(`#${modalId} .modal-content .modal-footer #modalRowCountBtn #modalRowCount`).text(length);
    else
        $(`#${modalId} .modal-content .modal-footer`).prepend(btnDisplay);
}