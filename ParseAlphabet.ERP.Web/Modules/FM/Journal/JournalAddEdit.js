var viewData_controllername = "JournalApi";
var viewData_insrecord_url_journal = `${viewData_baseUrl_FM}/${viewData_controllername}/insert`;
var viewData_updrecord_url_journal = `${viewData_baseUrl_FM}/${viewData_controllername}/update`;
var viewData_deleterecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/delete`;
var viewData_getrecord_url_journal = `${viewData_baseUrl_FM}/${viewData_controllername}/getrecordbyid`;
var viewData_getpagetable_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getpage`;
var viewData_journalStepList_url = `${viewData_baseUrl_FM}/JournalApi/getjournalsteplist`;
var modal_open_state = "",
    selectedRowId = "",
    conditionalProperties = {
        isCartable: false
    };

fill_select2(`${viewData_baseUrl_FM}/DocumentTypeApi/getactivedropdown`, "documentTypeIdJo", true, 0, false);
fill_select2(`${viewData_baseUrl_GN}/BranchApi/getactivedropdown`, "branchIdJo", true, 0, false);

$(`#documentDatePersianJo`).inputmask();
kamaDatepicker('documentDatePersianJo', { withTime: false, position: "bottom" });

$('#AddEditModalJu').on("shown.bs.modal", function (evt) {
    $("#branchIdJo").select2("focus");
});

function modal_show(modal_name = null) {
    
    if (modal_name === null)
        modal_name = modal_default_name;

    $(".modal-dialog").css("height", "auto");

    var firstRowsCountItem = $(`#${modal_name} .pagerowscount .dropdown-menu .dropdown-item:first`).text();
    $(`#${modal_name} .pagerowscount button:first`).text(firstRowsCountItem);

    $("input").attr("autocomplete", "off");
    $("#documentNoContainer").addClass('displaynone');

    if (modal_open_state == "Add") {
        $("#documentNoJo").prop('required', false).prop('disabled', true);
        $(`#${modal_name} select`).prop("selectedIndex", 0).trigger("change");
        
    }

    $(`#${modal_name}`).modal({ "backdrop": "static" });
}

function modal_saveJournal(modal_name = null, enter_toline = false) {

    if (modal_name == null)
        modal_name = modal_default_name;

    if (modal_open_state == "Add")
        modal_record_insertJournal(modal_name, enter_toline);
    else
        if (modal_open_state == "Edit")
            modal_record_updateJournal(modal_name, enter_toline);
}

function modal_record_insertJournal(modal_name = null, enter_toline) {
    
    if (modal_name == null)
        modal_name = modal_default_name;

    var form = $(`#${modal_name} div.modal-body`).parsley();

    var validate = form.validate();
    validateSelect2(form);
    if (!validate) return;

    
    let newModel = {
        id: 0,
        branchId: +$("#branchIdJo").val(),
        documentNo: 0,
        documentTypeId: +$("#documentTypeIdJo").val(),
        documentDatePersian: $("#documentDatePersianJo").val(),

    }

    recordInsertUpdate(viewData_insrecord_url_journal, newModel, modal_name, msg_row_created, function (result) {
        if (result.successfull && result.id > 0 && enter_toline) {
            $(".modal-backdrop.fade.show").remove();
            navigation_item_click(`/FM/JournalLine/${result.id}/56/1`, "سند حسابداری");
        }
        else
            get_NewPageTableV1();
    }, undefined);
}

function modal_record_updateJournal(modal_name = null, enter_toline) {

    if (modal_name == null)
        modal_name = modal_default_name;
    var form = $(`#${modal_name} div.modal-body`).parsley();
    var validate = form.validate();
    validateSelect2(form);
    if (!validate) return;
    let journalId = +$("#modal_keyid_value").text();
    let newModel = {
        id: journalId,
        branchId: +$("#branchIdJo").val(),
        documentNo: +$("#documentNoJo").val(),
        documentTypeId: +$("#documentTypeIdJo").val(),
        documentDatePersian: $("#documentDatePersianJo").val()
    }

    recordInsertUpdate(viewData_updrecord_url_journal, newModel, modal_name, msg_row_edited, function (result) {
        if (result.successfull && enter_toline) {
            $(".modal-backdrop.fade.show").remove();
            navigation_item_click(`/FM/JournalLine/${newModel.id}/56/1`, "سند حسابداری - ارزی");

        }
        else
            get_NewPageTableV1();
    }, undefined);
}

function run_button_journalDetailSimple(lineId, rowNo, elm, ev) {

    var check = controller_check_authorize("JournalApi", "UPD");
    if (!check)
        return;

    ev.stopPropagation();

    var bySystem = $(`#row${rowNo}`).data("bysystem");

    if (bySystem) {
        var msg = alertify.warning("امکان تخصیص متغیر سند سیستمی وجود ندارد");
        msg.delay(alertify_delay);
        return;
    }

    var stageId = $(`#row${rowNo}`).data("stageid");
    navigation_item_click(`/FM/JournalLine/${lineId}/${stageId}/1`, "سند حسابداری - ریالی");
    conditionalProperties.isCartable = false;
}

function run_button_journalDetailAdvance(lineId, rowNo) {

    var check = controller_check_authorize("JournalApi", "UPD");
    if (!check)
        return;

    var bySystem = $(`#row${rowNo}`).data("bysystem");

    if (bySystem) {
        var msg = alertify.warning("امکان تخصیص متغیر سند سیستمی وجود ندارد");
        msg.delay(alertify_delay);
        return;
    }
    var stageId = $(`#row${rowNo}`).data("stageid");
    navigation_item_click(`/FM/JournalLine/${lineId}/${stageId}/2`, "سند حسابداری - ارزی");
    conditionalProperties.isCartable = false;
}

function run_button_editjournal(p_keyvalue, rowNo, elem) {

    var check = controller_check_authorize("JournalApi", "UPD");
    if (!check)
        return;
   
    conditionalProperties.isCartable = false;
    modal_open_state = "Edit";

    var bySystem = $(`#row${rowNo}`).data("bysystem");
    if (bySystem) {
        var msg = alertify.warning("امکان ویرایش سند سیستمی وجود ندارد");
        msg.delay(alertify_delay);
        return;
    }

    var modal_name = "AddEditModalJu";
    $(".modal").find("#modal_title").text("ویرایش سند حسابداری");



    $(`#${modal_name} #rowKeyId`).removeClass("d-none");
    $(`#${modal_name} #modal_keyid_value`).text(p_keyvalue);
    $(`#${modal_name} #modal_keyid_caption`).text("شناسه : ");

    $("#documentNoJo").prop("disabled", false);

    $(`#${modal_name} div [hidden-on-edit=true]`).each(function () {
        var elm = $(this);
        elm.addClass("displaynone");
        elm.find("input,select,img").each(function () {
            var subelm = $(this);
            subelm.attr("data-parsley-excluded", "true");
        })
    });
    $(`#${modal_name} div [hidden-on-add=true]`).each(function () {
        var elm = $(this);
        elm.removeClass("displaynone");
        elm.find("input,select,img").each(function () {
            var subelm = $(this);
            subelm.attr("data-parsley-excluded", "false");
        })
    });

    $.ajax({
        url: viewData_getrecord_url_journal,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(p_keyvalue),
        async: false,
        cache: false,
        success: function (response) {
            modal_open_state = 'Edit';
            modal_clear_items(modal_name);

            var result = response.data;

            $("#modal_keyid_value").text(result.id);
            $("#modal_keyid_caption").text("شناسه :");

            $("#branchIdJo").val(result.branchId).trigger("change");
            $("#documentNoJo").val(result.documentNo).prop("disabled", true);
            $("#documentTypeIdJo").val(result.documentTypeId).trigger("change");
            $("#documentDatePersianJo").val(result.documentDatePersian);

            modal_show(modal_name);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getrecord_url_journal)
        }
    });
}

function run_button_displaySimple(id, rowNo, elm) {

    var check = controller_check_authorize("JournalApi", "VIW");
    if (!check)
        return;

    navigateToModalJournal(`/FM/journal/journaldisplay/${id}/${$(`#row${rowNo} #col_${rowNo}_3`).text()}/1`, "سند حسابداری - ریالی");
}

function run_button_displayAdvance(id, rowNo, elm) {

    var check = controller_check_authorize("JournalApi", "VIW");
    if (!check)
        return;

    navigateToModalJournal(`/FM/journal/journaldisplay/${id}/${$(`#row${rowNo} #col_${rowNo}_3`).text()}/2`, "سند حسابداری - ارزی");
}

function navigateToModalJournal(href) {

    initialPage();

    $("#contentdisplayJournalLine #content-page").addClass("displaynone");
    $("#contentdisplayJournalLine #loader").removeClass("displaynone");

    if ($("#userType").prop("checked"))
        lastpagetable_formkeyvalue = ["my", 0];
    else
        lastpagetable_formkeyvalue = ["all", null];

    $.ajax({
        url: href,
        type: "get",
        datatype: "html",
        contentType: "application/html; charset=utf-8",
        async: false,
        cache: false,
        dataType: "html",
        success: function (result) {
            $(`#contentdisplayJournalLine`).html(result);
        },
        error: function (xhr) {
            error_handler(xhr, href);
        }
    });

    $("#contentdisplayJournalLine #loader,#contentdisplayJournalLine #formHeaderLine #header-div .button-items").addClass("displaynone");
    $("#contentdisplayJournalLine #content-page").fadeIn().removeClass("displaynone").css("margin", 0);
    $("#contentdisplayJournalLine #form,#contentdisplayJournalLine .content").css("margin", 0);
    $("#contentdisplayJournalLine .itemLink").css("pointer-events", " none");
}




