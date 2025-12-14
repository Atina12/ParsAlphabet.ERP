

//$(document).on("keydown",function (e) {
//    //insert
//    if (e.ctrlKey && e.keyCode === KeyCode.Insert) {
//        e.preventDefault();
//        modal_ready_for_add();
//    }
//    //save
//    if (e.ctrlKey && e.shiftKey && e.keyCode === KeyCode.key_s) {
//        e.preventDefault();
//        modal_save();
//    }
//    //pgup
//    else if (e.keyCode === KeyCode.Page_Up) {



//        e.preventDefault();
//        pagetable_prevpage(activePageTableId);
//    }
//    //pgdn
//    else if (e.keyCode === KeyCode.Page_Down) {

//        e.preventDefault();
//        pagetable_nextpage(activePageTableId);
//    }
//});

$('.modal').on('shown.bs.modal', function () {

    if (pagetable_id === "pagetable" || pagetable_id === "") {

        $(`.modal-body #${pagetable_id} .filtervalue`).val('').inputmask("remove").attr("placeholder", "عبارت فیلتر").removeAttr("dir");
        $(`.modal-body #${pagetable_id} .btnfilter`).text("مورد فیلتر");
        $(`.modal-body #${pagetable_id} .btnRemoveFilter`).addClass("d-none");
        $(`.modal-body #${pagetable_id} .btnOpenFilter`).removeClass("d-none");

        var firstInput = $(this).find(".modal-body [tabindex]:first");

        if (firstInput.is(':disabled') && firstInput.filter(':disabled')) {
            var inputEnable = $(this).find(".modal-body [tabindex]:enabled:first");

            if (inputEnable.hasClass("select2"))
                $(`#${inputEnable.attr("id")}`).select2('focus');
            else
                inputEnable.focus();
        }

        else if (firstInput.hasClass("select2"))
            $(`#${firstInput.attr("id")}`).select2('focus');
        else
            firstInput.focus();
    }
    else {

        $(`.modal-body #${pagetable_id} .filtervalue`).val('').inputmask("remove").attr("placeholder", "عبارت فیلتر").removeAttr("dir");
        $(`.modal-body #${pagetable_id} .btnfilter`).text("مورد فیلتر");
        $(`.modal-body #${pagetable_id} .btnRemoveFilter`).addClass("d-none");
        $(`.modal-body #${pagetable_id} .btnOpenFilter`).removeClass("d-none");

        $(`#${pagetable_id} .pagerowscount`).addClass("dropup");

        var elm_pbody = $(`#${pagetable_id} .pagetablebody`);

        elm_pbody.find(`tbody > #row1`).addClass("highlight");
        elm_pbody.find(`tbody > #row1`).focus();
    }

    if (modal_open_state === "Add")
        funkyradio_switchvalue();

});

function modal_save(modal_name = null, pageVersion = "pagetable") {

    if (modal_name == null)
        modal_name = modal_default_name;

    if (modal_open_state == "Add")
        modal_record_insert(modal_name, pageVersion);
    else
        if (modal_open_state == "Edit")
            modal_record_update(modal_name, pageVersion);
}

function modal_fill_items(item, modal_name = null) {
    if (!item) return;
    if (modal_name == null)
        modal_name = modal_default_name;

    var element = $(`#${modal_name}`);
    element.find("input,select,img,textarea").each(function () {

        var elm = $(this);
        var elmid = elm.attr("id");
        if (!elmid)
            return;
        var tag = elm.prop("tagName").toLowerCase();
        var val = item[elmid];
        if (tag === `input`) {
            var type = elm.attr("type").toLowerCase();
            if (type === `text` || type === `number`) {
                if (val) {
                    if (elm.hasClass("money"))
                        elm.val(transformNumbers.toComma(val));
                    else if (elm.hasClass("decimal")) {

                        let valueSplited = val.toString().split('.');

                        if (valueSplited.length === 1)
                            elm.val(`${val}/000`);
                        else
                            elm.val(val.toString().split('.').join("/"));
                    }
                    else
                        elm.val(val);
                }
            }
            else
                if (type === `checkbox`)
                    elm.prop("checked", val).trigger("change");
        }
        else if (tag === "textarea") {
            if (val)
                elm.val(val);
        }
        else if (tag === `select`) {
            if (val == null) val = 0;
            if (elm.hasClass(`select2`)) {
                var attrTitleId = elm.attr('titleId');

                if (typeof attrTitleId !== typeof undefined && attrTitleId !== false) {
                    if (item[attrTitleId] !== null) {
                        var newOption = new Option(`${val} - ${item[attrTitleId]}`, val, true, true);
                        elm.append(newOption).trigger('change');
                    }
                }
                else
                    elm.val(val).trigger('change');
            }
            else
                elm.val(val).trigger('change');
        }
        else if (tag === `img`) {
            if (!val)
                elm.attr("src", "/content/images/blank-person.png")
            else
                elm.attr("src", "data:image/png;base64," + val);
        }
    });
}

function modal_ready_for_add(modal_name = null) {
    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;
    $("#rowKeyId").addClass("d-none");
    modal_open_state = 'Add';

    if (modal_name == null)
        modal_name = `AddEditModal`

    $(`#${modal_name} div [hidden-on-add=true]`).each(function () {
        var elm = $(this);
        elm.addClass("displaynone");
        ele.find("input,select,img").each(function () {
            var subelm = $(this);
            subelm.attr("data-parsley-excluded", "true");
        })
    });
    $(`#${modal_name} div [hidden-on-edit=true]`).each(function () {
        var elm = $(this);
        elm.removeClass("displaynone");
        elm.find("input,select,img").each(function () {
            var subelm = $(this);
            subelm.attr("data-parsley-excluded", "false");
        })
    });

    modal_clear_items(modal_name);

    $(".modal").find("#modal_title").text("افزودن " + viewData_form_title);

    $("#modal_keyid_value").text("");
    $("#modal_keyid_caption").text("");
    modal_show(modal_name);
}

function modal_record_insert(modal_name = null, pageVersion) {

    if (modal_name == null)
        modal_name = modal_default_name;

    var form = $(`#${modal_name} div.modal-body`).parsley();

    var validate = form.validate();

    validateSelect2(form);

    if (!validate)
        return;

    var newModel = {};
    var swReturn = false;

    var elements = $(`#${modal_name}`);
    elements.find("input,select,img,textarea").each(function () {

        var elm = $(this);
        var elmid = elm.attr("id");
        var val = '';
        if (elm.hasClass("money"))
            val = +removeSep(elm.val()) !== 0 ? +removeSep(elm.val()) : 0;
        else if (elm.hasClass("decimal"))
            val = +removeSep(elm.val()) !== 0 ? removeSep(elm.val().replace(/\//g, ".")) : 0;
        else if (elm.hasClass("number"))
            val = +removeSep(elm.val()) !== 0 ? +elm.val() : 0;
        else if (elm.hasClass("str-number"))
            val = +removeSep(elm.val()) !== 0 ? elm.val() : "";
        else if (elm.attr("type") == "checkbox")
            val = elm.prop("checked");
        else if (elm.hasClass("select2") || elm.prop("tagName").toLowerCase() == "select")
            val = elm.val();
        else
            if (val !== null) {
                val = myTrim(elm.val());
            }

        var tag = elm.prop("tagName").toLowerCase();
        if (tag === `img`) {
            var src = elm.attr("src");
            var pos = src.indexOf("base64,");
            if (pos != -1) {
                val = src.substring(pos + 7);
                var decoded = atob(val);
                if (decoded.length >= 51200) {
                    alertify.alert("کنترل حجم", msg_picturesize_limit_50);
                    swReturn = true;
                    return;
                }
                elmid = elmid + "_base64";
            }
        }

        newModel[elmid] = val;
    });

    if (swReturn)
        return;

    //موقت
    var definePageTable = null;

    if (pageVersion == "pagetable")
        definePageTable = get_NewPageTableV1;
    else
        definePageTable = get_NewPageTable

    if (pageVersion != "pagetable") {
        let index = arr_pagetables.findIndex(v => v.pagetable_id == "pagetable");
        arr_pagetables[index].pageNo = 0;
        arr_pagetables[index].currentrow = 1;

    }

    recordInsertUpdate(viewData_insrecord_url, newModel, modal_name, msg_row_created, undefined, definePageTable)
}

function modal_record_update(modal_name = null, pageVersion) {
    
    if (modal_name == null)
        modal_name = modal_default_name;

    var form = $(`#${modal_name} div.modal-body`).parsley();

    var validate = form.validate();
    validateSelect2(form);
    if (!validate)
        return;

    var newModel = {};

    newModel["Id"] = +$("#modal_keyid_value").text();

    var swReturn = false;
    var element = $(`#${modal_name}`);
    element.find("input,select,img,textarea").each(function () {
        var elm = $(this);
        var elmid = elm.attr("id");

        var val = elm.val();
        if (elm.hasClass("money"))
            val = +removeSep(elm.val()) !== 0 ? +removeSep(elm.val()) : 0;
        else if (elm.hasClass("decimal"))
            val = +removeSep(elm.val()) !== 0 ? removeSep(elm.val().replace(/\//g, ".")) : 0;
        else if (elm.hasClass("number"))
            val = +removeSep(elm.val()) !== 0 ? +elm.val() : 0;
        else if (elm.hasClass("str-number"))
            val = +removeSep(elm.val()) !== 0 ? elm.val() : "";
        else if (elm.attr("type") == "checkbox")
            val = elm.prop("checked");
        else if (elm.hasClass("select2") || elm.prop("tagName").toLowerCase() == "select")
            val = elm.val();
        else
            if (val !== null) {
                val = myTrim(elm.val());
            }

        var tag = elm.prop("tagName").toLowerCase();
        if (tag === `img`) {
            var src = elm.attr("src");
            var pos = src.indexOf("base64,");
            if (pos != -1) {
                val = src.substring(pos + 7);
                var decoded = atob(val);
                if (decoded.length >= 51200) {
                    alertify.alert("کنترل حجم", msg_picturesize_limit_50);
                    swReturn = true;
                    return;
                }
                elmid = elmid + "_base64";
            }
        }

        newModel[elmid] = val;
    });

    if (swReturn)
        return;


    //موقت
    var definePageTable = null;

    if (pageVersion == "pagetable")
        definePageTable = get_NewPageTableV1;
    else
        definePageTable = get_NewPageTable

    //definePageTable = pageVersion == "pagetable" ? get_pagetable : pageVersion == 'newpagetable' ? get_NewPageTable : get_NewPageTableV1;

    if (pageVersion != "pagetable") {
        let index = arr_pagetables.findIndex(v => v.pagetable_id == "pagetable");
        arr_pagetables[index].pageNo = 0;
        arr_pagetables[index].currentrow = 1;
    }

    recordInsertUpdate(viewData_updrecord_url, newModel, modal_name, msg_row_edited, undefined, definePageTable);
}

function recordInsertUpdate(url, insertModel, modalName, message, callBack = undefined, callBackPageTable = undefined) {

    $(`#${modalName} .modal-footer button:not(#modal-close)`).prop("disabled", true)

    $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(insertModel),
        async: false,
        cache: false,
        success: function (result) {

            if (result.successfull == true) {

                var msg = alertify.success(message);
                msg.delay(alertify_delay);
                modal_close(modalName);

                if (callBack != undefined)
                    callBack(result);

                //موقت
                if (callBackPageTable != undefined)
                    callBackPageTable();
            }
            else {
                if (result.statusMessage !== undefined && result.statusMessage !== null) {
                    var msg = alertify.error(result.statusMessage);
                    msg.delay(alertify_delay);
                }
                else if (result.validationErrors !== undefined) {
                    generateErrorValidation(result.validationErrors);
                }
                else {
                    var msg = alertify.error(msg_row_create_error);
                    msg.delay(2);
                }
            }

            setTimeout(() => {
                $(`#${modalName} .modal-footer button:not(#modal-close)`).prop("disabled", false)
            },500)
         
        },
        error: function (xhr) {
            setTimeout(() => {
                $(`#${modalName} .modal-footer button:not(#modal-close)`).prop("disabled", false) 
            }, 500)
            error_handler(xhr, url)
        }
    });
}