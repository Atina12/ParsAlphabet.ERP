var viewData_controllername = "Attender_AssistantApi";

//add arr_pagetables ----------------------------------------------------------------------
var pgt_attender = {
    pagetable_id: "physicianToSecretary",
    editable: false,
    pagerowscount: 15,
    endData: false,
    pageNo: 0,
    currentpage: 1,
    currentrow: 1,
    currentcol: 0,
    highlightrowid: 0,
    trediting: false,
    pagetablefilter: false,
    filteritem: "",
    filtervalue: "",
    getpagetable_url: `${viewData_baseUrl_MC}/AttenderApi/getpageattenderforassistant`,
    getfilter_url: ""
}
arr_pagetables.push(pgt_attender);

var pgt_assistant = {
    pagetable_id: "assistant_pagetable",
    editable: true,
    pagerowscount: 15,
    endData: false,
    pageNo: 0,
    currentpage: 1,
    currentrow: 1,
    currentcol: 0,
    highlightrowid: 0,
    trediting: false,
    pagetablefilter: false,
    filteritem: "",
    filtervalue: "",
    getpagetable_url: `${viewData_baseUrl_MC}/Attender_AssistantApi/getpage`,
    getfilter_url: `${viewData_baseUrl_MC}/Attender_AssistantApi/getfilteritems/attenderassistant`
}
arr_pagetables.push(pgt_assistant);

var pgt_users = {
    pagetable_id: "secretaryToThePhysician",
    editable: false,
    pagerowscount: 15,
    endData: false,
    pageNo: 0,
    currentpage: 1,
    currentrow: 1,
    currentcol: 0,
    highlightrowid: 0,
    trediting: false,
    pagetablefilter: false,
    filteritem: "",
    filtervalue: "",
    getpagetable_url: `${viewData_baseUrl_GN}/UserApi/getpage`,
    getfilter_url: `${viewData_baseUrl_GN}/UserApi/getfilteritems`
}
arr_pagetables.push(pgt_users);

var pgt_userAssistant = {
    pagetable_id: "userAssistant_pagetable",
    editable: false,
    pagerowscount: 15,
    endData: false,
    pageNo: 0,
    currentpage: 1,
    currentrow: 1,
    currentcol: 0,
    highlightrowid: 0,
    trediting: false,
    pagetablefilter: false,
    filteritem: "",
    filtervalue: "",
    getpagetable_url: `${viewData_baseUrl_MC}/Attender_AssistantApi/getpageassistant`,
    getfilter_url: `${viewData_baseUrl_MC}/Attender_AssistantApi/getfilteritems/assistantattender`
}
arr_pagetables.push(pgt_userAssistant);
//end of add arr_pagetables ----------------------------------------------------------------------


function initAttenderAssistant() {
    
    $(".button-items button").remove();

    pagetable_formkeyvalue = [0];
    get_NewPageTableV1(pgt_attender.pagetable_id);
}

function run_button_assistant(attrId) {
    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    //pagetable_id = "assistant_pagetable";

    assistant_init(attrId, "assistant_pagetable");

    //modal_show("assistantModal");
}

function run_button_userAssistant(userId, row, elm, event) {
    
    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    //pagetable_id = "userAssistant_pagetable";
    //modal_show("userAssistantModal");

    let userFullName = $(`#secretaryToThePhysician #parentPageTableBody tbody #row${row} td`).eq(1).text()

    user_init(userId, userFullName, "userAssistant_pagetable");

    //modal_show("userAssistantModal");

}

function tr_object_onchange(pg_name, selectObject, rowno, colno) {
    
    var elm = $(`#${pg_name}`).find(`#col_${rowno}_${colno + 1} input:first`);
    elm.val("");

    if (selectObject.value == "1")
        elm.attr("maxlength", "3");
    else
        elm.attr("maxlength", "10");
};

function tr_object_onblur(pg_name, selectObject, rowno, colno) {
    if (pg_name == "assistant_pagetable" || pg_name == "userAssistant_pagetable") {
        if ($(selectObject).hasClass("funkyradio"))
            $(selectObject).find("label").removeClass("border-thin");
    }
}

function tr_save_row(pg_name, keycode) {
    
    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;
    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_pagetables[index].pagetable_id;
    var pagetable_currentrow = arr_pagetables[index].currentrow;
    var url = `${viewData_baseUrl_MC}/Attender_AssistantApi/save`;

    if (pg_name == "assistant_pagetable") {
        var model = {
            attenderId: +$(`#assistantModal`).find("#attrId").text(),
            userId: +$(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow}`).data("id"),
            isActive: $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_5 > .funkyradio > input:checkbox`).prop("checked")
        }
        tr_save_row_ajax(url, model, pg_name, keycode)

    }
    else {
        var model = {
            userId: +$(`#userAssistantModal`).find("#userId").text(),
            attenderId: +$(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow}`).data("id"),
            isActive: $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_5 > .funkyradio > input:checkbox`).prop("checked")

        }
        tr_save_row_ajax(url, model, pg_name, keycode)
    }
};

function tr_save_row_ajax(url, model, pg_name, keycode) {

    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        async: false,
        cache: false,
        success: function (result) {
            if (result.successfull) {
                var msg = alertify.success(msg_row_edited);
                msg.delay(alertify_delay);
                after_save_row(pg_name, "success", keycode, false);
            }
            else {
                var msg = alertify.error(msg_row_edit_error);
                msg.delay(alertify_delay);
                after_save_row(pg_name, "error", keycode, false);
            }
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
            after_save_row(pg_name, "error", keycode, false);
        }
    })
}

function changeTabPostingGroup(currentTabNo) {
    
    switch (currentTabNo) {
        case 1:
            pagetable_formkeyvalue = [0];
            get_NewPageTableV1(pgt_attender.pagetable_id);
            break;
        case 2:
            pagetable_formkeyvalue = [3];
            get_NewPageTableV1(pgt_users.pagetable_id);
            break;
    }
};

$("#assistantModal").on("hidden.bs.modal", function () {
    if ($("#physicianToSecretaryLink").hasClass("active")) 
        pagetable_formkeyvalue = [0];

});

$("#userAssistantModal").on("hidden.bs.modal", function () {
    if ($("#secretaryToThePhysicianLink").hasClass("active"))
        pagetable_formkeyvalue = [3];
});

initAttenderAssistant()
