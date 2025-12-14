
var viewData_controllername = "AdmissionImagingApi",
    viewData_save_AdmissionImaging = `${viewData_baseUrl_MC}/${viewData_controllername}/save`,
    viewData_get_SearchAdmission = `${viewData_baseUrl_MC}/AdmissionApi/searchinbound`,  /*searchinboundimaging*/
    viewData_get_AdmissionSearch = `${viewData_baseUrl_MC}/AdmissionApi/search`,
    viewData_get_AdmissionImaging = `${viewData_baseUrl_MC}/${viewData_controllername}/getpage`,
    viewData_getrecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getrecordbyid`,
    viewData_getrecordTemplate_url = `${viewData_baseUrl_MC}/AdmissionImagingTemplateApi/getTemplate`,
    viewData_getrecordPageTemplate_url = `${viewData_baseUrl_MC}/AdmissionPageImagingApi/getpagebody`,
    viewData_dropdownTemplate_url = `${viewData_baseUrl_MC}/AdmissionImagingTemplateApi/dropdown`,
    viewData_dropdownPageTemplate_url = `${viewData_baseUrl_MC}/AdmissionPageImagingApi/dropdown`,
    viewData_getAdmissionImagingCheckExist = `${viewData_baseUrl_MC}/${viewData_controllername}/checkexist`,
    emptyRow = `<tr id="emptyRow"><td colspan="thlength" class="text-center">سطری وجود ندارد</td></tr>`,
    currenUser = { name: "", id: getUserId() },
    arr_TempAdmImg = [],
    admissionIdentity = 0, admissionImagingId = +$("#admissionImagingId").val(),
    admSelected = {
        admissionId: 0,
        branchId: 0,
        workflowId: 0,
        workflowName: "",
        stageId: 0,
        stageName: "",
        actionId: 0,
        actionName: "",
        basicInsurerId: 0,
        basicInsurerLineId: 0,
        compInsurerId: 0,
        compInsurerLineId: 0,
        thirdPartyId: 0,
        discountId: 0,
        hID: 0,
        basicInsurerNo: 0,
        basicInsurerExpirationDatePersian: "",
        patientFullName: "",
        patientNationalCode: "",
        basicInsurerName: "",
        basicInsuranceBoxName: "",
        compInsuranceBoxName: "",
        attenderFullName: "",
    },
    viewData_compare_date_url = `/api/SetupApi/comparetime`,
    printContentForSaveButtun = "",
    setContentEditorByTemp = false,
    arrayOfIdTemplate = [],
    arrayCounts = [50, 100];

var pagetable = {
    pagetable_id: "searchAdmissionModal_pagetable",
    pagerowscount: 50,
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
    getpagetable_url: viewData_get_SearchAdmission,
};

arr_pagetables.push(pagetable);

async function initAdmissionImagingForm() {
    $("#searchAdmissionModal_pagetable .filterBox").addClass("d-none");

    loadDropdown()

    setThelastAttenderId()

    if ($("#admissionImagingId").val() != '')
        $("#choiceOfAdmission").css("display", "none")

    inputMask();
    tinyInit(admissionImagingId);
    currenUser.name = uFullName;

}

function headerindexChoose(e) {
    let elm = $(e.target);
    if (e.keyCode === KeyCode.Enter) {
        let checkExist = false;
        checkExist = checkExistAdmissionImagingId(+elm.val());
        if (checkExist)
            navigation_item_click(`/MC/AdmissionImaging/form/${+elm.val()}`);
        else
            alertify.warning("این کد در سیستم وجود ندارد").delay(alertify_delay);
    }
}

function checkExistAdmissionImagingId(id) {

    let outPut = $.ajax({
        url: viewData_getAdmissionImagingCheckExist,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getAdmissionImagingCheckExist);
        }
    });
    return outPut.responseJSON;
}

function display_pagination(opr) {
    var elemId = $("#admissionImagingId").val();
    display_paginationAsync(opr, elemId);
}

async function display_paginationAsync(opr, elemId) {

    headerPagination = 0;
    switch (opr) {
        case "first":
            headerPagination = 1;
            break;
        case "previous":
            headerPagination = 2;
            break;
        case "next":
            headerPagination = 3;
            break;
        case "last":
            headerPagination = 4;
            break;
    }
    getAdmissionImagingById(elemId, headerPagination);

}

function loadDropdown() {


    var newOption1 = new Option("انتخاب کنید", 0, true, true);

    $('#attenderId').append(newOption1).trigger('change');
    $('#workflowId').append(newOption1).trigger('change');
    $('#actionId').append(newOption1).trigger('change');

    let stageClassId = "17,22,28";

    fill_select2(viewData_dropdownTemplate_url, "templateId");
    fill_select2(`${viewData_baseUrl_MC}/Attender_AssistantApi/getdropdown`, "attenderId", true, 0, false, 0, "انتخاب داکتر...");

    fill_select2(`${viewData_baseUrl_WF}/WorkflowApi/getdropdown`, "workflowId", true, `0/10,14/${stageClassId}`, false, 3, "", () => { $("#workflowId").val(0).trigger("change") });



    fill_select2(`${viewData_baseUrl_WF}/StageActionApi/getdropdownactionlistbystage`, "actionId", true, `null/null/2/2/null/10,14/true/${stageClassId}`, false, 3);

}

async function tinyInit(id = 0) {
    tinymce.init({
        selector: 'textarea#attenderInstruction',
        directionality: 'rtl',
        menubar: ' view file edit insert format tools table help ',
        plugins: ' print pagebreak preview powerpaste casechange importcss tinydrive searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen image link media mediaembed template codesample table charmap hr export  nonbreaking anchor insertdatetime advlist lists checklist wordcount tinymcespellchecker a11ychecker textpattern noneditable help formatpainter permanentpen pageembed charmap tinycomments mentions quickbars linkchecker emoticons advtable export',
        toolbar: '  pagebreak  redo undo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | ltr rtl alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | export  | charmap emoticons | fullscreen  preview save addImageBtn printContentBtn | insertfile image media pageembed template link anchor codesample | a11ycheck | showcomments addcomment',
        language: 'fa',
        fontsize_formats: "7pt 8pt 9pt 10pt 11pt 12pt 13pt 14pt 15pt 16pt 18pt 19pt 24pt 27pt 36pt",
        height: 600,
        pagebreak_split_block: true,
        help_tabs: [
            'shortcuts', // the default shortcuts tab
            'keyboardnav', // the default keyboard navigation tab
            'plugins', // the default plugins tab
            {
                name: 'custom1', // new tab called custom1
                title: 'میانبرهای سفارشی',
                items: [
                    {
                        type: 'htmlpanel',
                        html:
                            `
                            <table data-alloy-tabstop="true" class="tox-dialog__table">
                                <thead>
                                    <tr>
                                        <th>اقدام</th>
                                        <th>میانبر</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>راست چین</td>
                                        <td>Ctrl + shift (right)</td>
                                    </tr>
                                    <tr>
                                        <td>چپ چین</td>
                                        <td>Ctrl + shift (left)</td>
                                    </tr>
                                    <tr>
                                        <td>تراز بندی از چپ</td>
                                        <td>Ctrl + L</td>
                                    </tr>
                                    <tr>
                                        <td>ترازبندی از راست</td>
                                        <td>Ctrl + R</td>
                                    </tr>
                                    <tr>
                                        <td>ترازبندی از وسط</td>
                                        <td>Ctrl + E</td>
                                    </tr>
                                </tbody>
                            </table >
                        `,
                    }
                ]
            },

        ],
        setup: function (editor) {
            printContentForSaveButtun = editor

            editor.ui.registry.addButton('addImageBtn', {
                icon: "image",
                onAction: _ => modal_show('addPictureModal')
            });

            editor.ui.registry.addButton('printContentBtn', {
                icon: 'print',
                onAction: _ => printContent2(editor)
                //onAction: _ => PrintContent(editor)
            });

            editor.on('init', e => {
                configInitTiny(id)
            });

            editor.on('keydown', e => {
                if (e.ctrlKey && e.shiftKey && e.code == "ShiftLeft") {
                    e.preventDefault();
                    tinymce.activeEditor.execCommand('mceDirectionLTR')
                }
                if (e.ctrlKey && e.shiftKey && e.code == "ShiftRight") {
                    e.preventDefault();
                    tinymce.activeEditor.execCommand('mceDirectionRTL');
                }
                if (e.ctrlKey && e.keyCode == 76) {
                    e.preventDefault();
                    tinymce.activeEditor.execCommand('JustifyLeft');
                }
                if (e.ctrlKey && e.keyCode == 82) {
                    e.preventDefault();
                    tinymce.activeEditor.execCommand('JustifyRight');
                }
                if (e.ctrlKey && e.keyCode == 69) {
                    e.preventDefault();
                    tinymce.activeEditor.execCommand('JustifyCenter');
                }
            });
        },

        quickbars_selection_toolbar: 'bold italic | quicklink h2  | h3 blockquote quickimage  | quicktable',
        font_formats: "ایران سنس=iransans;لوتوس=BLotus; تیتر=BTitr",
        content_style: `body {font-family: 'iransans';}
                        @font-face {font-family: 'iransans';src: url('/Content/fonts/ttf/IRANSansXFaNum-Regular.ttf')}
                        @font-face {font-family: 'BTitr';src: url('/Content/fonts/ttf/BTitr.ttf')}
                        @font-face {font-family: 'BLotus';src: url('/Content/fonts/ttf/BLotus.ttf')}`,
        toolbar_mode: 'sliding',
    });
    return id;
}

function decodeContentOfPageTemp(encodedString) {
    var div = document.createElement('div');
    div.innerHTML = encodedString;
    let newContent = div.textContent;
    let currentContent = tinymce.get("attenderInstruction").getContent();
    let result = ""

    if (checkResponse(currentContent) && currentContent == "") {
        result = newContent
    } else {
        result = `${currentContent} <br/> ${newContent}`;
    }

    return result;
}

function configInitTiny(id) {
    if (id !== 0)
        getAdmissionImagingById(id);
    else
        $("#userFullName").val(currenUser.id + " - " + currenUser.name);

    $(".preloader").addClass("hidePreloader");
}

function printContent2(editor) {
    let body = editor.dom.doc.body.innerHTML;
    let date = $("#createDateTime").val().split(' ')[0];

    printTinyContent2(body, date);
}

async function printTinyContent2(data, createDate) {

    let content = "", contentHeader = "", tinycontent = data;

    contentHeader = await $.get("/Report/NewGetHeaderPrint").then(result => result);
    content = contentHeader
        .replace("SRCIMAGE", "data:image/png;base64,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")
        .replace("@companyName@", "مجتمع بهداشتی درمانی شهید شوریده")
        .replace("@craeteDate@", moment().format('jYYYY/jMM/jDD'))
        .replace("@admissionDate@", admSelected.admissionDate == undefined ? "" : admSelected.admissionDate)
        .replace("@prescriptionDatePersian@", admSelected.prescriptionDatePersian == undefined ? "" : admSelected.prescriptionDatePersian)
        .replace("@username@", userId)
        .replace("@patientFullName@", admSelected.patientFullName == undefined ? "" : admSelected.patientFullName)
        .replace("@referringDoctorName@", admSelected.referringDoctorName == undefined ? "" : admSelected.referringDoctorName)
        .replace("@content@", tinycontent)
        .replace("@patientBirthDate@", admSelected.patientBirthDate == undefined ? "" : admSelected.patientBirthDate)
        .replace("@admissionId@", admSelected.admissionId == undefined ? "" : admSelected.admissionId)

    document.querySelector("#frmDirectPrint").contentDocument.children[0].innerHTML = content;
    $('#frmDirectPrint').contents().find("body").html($('#frmDirectPrint').contents().find("body").html() + footerBodyPrintIfrem);
}

function PrintContent(editor) {

    let body = editor.dom.doc.body.innerHTML;
    let date = $("#createDateTime").val().split(' ')[0];

    printTinyContent(body, date);
}

async function printTinyContent(data, createDate) {

    let content = "", contentHeader = "", tableAdm = "", tinycontent = data;

    tableAdm = `<table style="border-bottom: 1px solid;width: 100%;direction:rtl; border-spacing:0px;margin-bottom:5px;font-size:12px">
            <thead>
                <tr>
                    <th style="border-style: solid; border-width: 1px 1px 0px 1px;">شناسه پذیرش</th>
                    <th style="border-style: solid; border-width: 1px 0px 0px 1px;">مراجعه کننده</th>
                    <th style="border-style: solid; border-width: 1px 0px 0px 1px;">رادیولوژیست</th>
                    <th style="border-style: solid; border-width: 1px 0px 0px 1px;">داکتر ارجاع دهنده</th>
                    <th style="border-style: solid; border-width: 1px 0px 0px 1px;">تاریخ نسخه</th>    
                    <th style="border-style: solid; border-width: 1px 0px 0px 1px;">بیمه پایه</th>     
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="border-style: solid; border-width: 1px 1px 0px 1px; text-align: center">${admSelected.admissionId == 0 ? "" : admSelected.admissionId}</td>
                    <td style="border-style: solid; border-width: 1px 0px 0px 1px; text-align: center">${admSelected.patientFullName}</td>
                    <td style="border-style: solid; border-width: 1px 0px 0px 1px; text-align: center">${admSelected.attenderFullName}</td>
                    <td style="border-style: solid; border-width: 1px 0px 0px 1px; text-align: center">${admSelected.referringDoctorId == 0 || !checkResponse(admSelected.referringDoctorId) ? "" : `${admSelected.referringDoctorId} - ${admSelected.referringDoctorName}`}</td>
                    <td style="border-style: solid; border-width: 1px 0px 0px 1px; text-align: center">${admSelected.prescriptionDatePersian == null ? "" : admSelected.prescriptionDatePersian}</td>   
                    <td style="border-style: solid; border-width: 1px 0px 0px 1px; text-align: center">${admSelected.basicInsurerName}</td>
                </tr>
            </tbody>
        </table>`;

    contentHeader = await $.get("/Report/GetHeaderPrint").then(result => result);

    content = contentHeader.replace("SRCIMAGE", "data:image/png;base64,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")
        .replace("@craeteDate@", moment().format('jYYYY/jMM/jDD'))
        .replace("@companyName@", "مجتمع بهداشتی درمانی شهید شوریده")
        .replace("@reportName@", "تصویربرداری")
        .replace("@content@", tinycontent)
        .replace("@headerContent@", tableAdm)
        .replace("@otherOption2@", "")
        .replace("@otherOptionValue2@", "")
        .replace("@otherOption1@", "")
        .replace("@otherOptionValue1@", "")
        .replace("@reportDatePersian@", createDate)

    document.querySelector("#frmDirectPrint").contentDocument.children[0].innerHTML = content;
    $('#frmDirectPrint').contents().find("body").html($('#frmDirectPrint').contents().find("body").html() + footerBodyPrintIfrem);
}

async function getAdmissionImagingById(admImgId, headerPagination = 0) {
    let model = {
        admissionImagingId: admImgId,
        headerPagination: headerPagination
    }
    if (admImgId !== 0) {
        $.ajax({
            url: viewData_getrecord_url,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(model),
            success: function (data) {

                fillAdmissionImaging(data.data);
            },
            error: function (xhr) {
                error_handler(xhr, viewData_getrecord_url);
                return {
                    status: -100,
                    statusMessage: "عملیات با خطا مواجه شد",
                    successfull: false
                };
            }
        });
    }

};

function fillAdmissionImaging(admImg) {

    if (admImg !== null) {
        $("#admissionImagingId").val(admImg.id);
        $("#userFullName").val(admImg.createUserId + " - " + admImg.createUserFullName);
        $("#createDateTime").val(admImg.createDatePersian);
        $("#admissionImagingBox").removeClass("displaynone");
        $("#headerFirst").removeClass("displaynone");
        $("#headerPrevious").removeClass("displaynone");
        $("#headerIndex").removeClass("displaynone");
        $("#headerNext").removeClass("displaynone");
        $("#headerLast").removeClass("displaynone");

        run_button_setAdmissionInfo(admImg.admissionId, 0, admImg.actionId);
        tinymce.get("attenderInstruction").setContent(admImg.content);
    }
}

function appendTempAdmImg(admImg, tSave = "INS") {
    var admImgOutput = "";
    if (admImg) {
        if (tSave == "INS") {
            admImgOutput = tinymce.get("attenderInstruction").getContent();
            $(admImgOutput).appendTo("#attenderInstruction");
        }
        else {
            arr_TempAdmImg[0] = admImg;
            admImgOutput = tinymce.get("attenderInstruction").setContent();
            $(admImgOutput).appendTo("#attenderInstruction");

        }
    }
};

function disableSaveButtonAsync(disable) {
    $("#saveForm").prop("disabled", disable);
}

function saveAdmissionImagingForm(saveAndPrint = "save") {

    disableSaveButtonAsync(true);

    if (admissionIdentity == 0) {
        var msg_temp_srv = alertify.warning(prMsg.selectAdmission);
        msg_temp_srv.delay(prMsg.delay);
        $("#saveForm").removeAttr("disabled");
        return;
    }

    if (tinymce.get("attenderInstruction").getContent() == null || tinymce.get("attenderInstruction").getContent() == undefined || tinymce.get("attenderInstruction").getContent() == "") {
        var msg_temp_srv = alertify.warning("لطفا قالب را انتخاب نمایید");
        msg_temp_srv.delay(prMsg.delay);
        $("#saveForm").removeAttr("disabled");
        return;
    }

    
    var modelSave = {
        id: admissionImagingId,
        actionId: admSelected.actionId,
        workflowId: admSelected.workflowId,
        branchId: admSelected.branchId,
        stageId: admSelected.admissionWorkflowCategory == 14 ? 221 : 169,
        admissionWorkflowCategoryId: admSelected.admissionWorkflowCategory,
        admissionId: admissionIdentity,
        admissionWorkflowId: admSelected.workflowId,
        admissionStageId: admSelected.stageId,
        patientId: admSelected.patientId,
        attenderId: admSelected.attenderId,
        content: tinymce.get("attenderInstruction").getContent(),
        createUserId: +$("#userFullName").text(),
        basicInsurerId: admSelected.basicInsurerId,
        basicInsurerLineId: admSelected.basicInsurerLineId,
        compInsurerId: admSelected.compInsurerId,
        compInsurerLineId: admSelected.compInsurerLineId,
        thirdPartyId: admSelected.thirdPartyId,
        hID: admSelected.hID,
        basicInsurerExpirationDatePersian: admSelected.basicInsurerExpirationDatePersian,
        basicInsurerNo: admSelected.basicInsurerNo,
        templates: arrayOfIdTemplate
    }

    saveTheLastAttenderId(admSelected.attenderId)

    saveAdmissionImagingAsync(modelSave)
        .then(async (data) => {

            var resultSave = data.successfull;
            if (resultSave) {
                var messageSuccessAlert = alertify.success(admImgMsg.insert_success);
                messageSuccessAlert.delay(admImgMsg.delay);

                if (saveAndPrint == "saveAndPrint") {
                    printContent2(printContentForSaveButtun)

                    setTimeout(() => {
                        navigation_item_click("/MC/AdmissionImaging", "لیست تصویربرداری");
                    }, 500);
                } else {
                    setTimeout(() => {
                        navigation_item_click("/MC/AdmissionImaging", "لیست تصویربرداری");
                    }, 500);
                }

            }
            else {
                var messageSuccessAlert = alertify.warning(data.statusMessage);
                messageSuccessAlert.delay(admImgMsg.delay);


            }
            disableSaveButtonAsync(!resultSave);

        }).then(async () => {
            disableSaveButtonAsync(false);
        })
}

function saveTheLastAttenderId(attenderId) {
    let url = `${viewData_baseUrl_MC}/${viewData_controllername}/setcacheselectedattender/${attenderId}`
    $.ajax({
        url: url,
        type: "get",
    });
}

function setThelastAttenderId() {
    let url = `${viewData_baseUrl_MC}/${viewData_controllername}/getcacheselectedattender`

    $.ajax({
        url: url,
        type: "get",
        success: function (result) {
            if (checkResponse(result))
                $("#attenderId").val(result).trigger("change")
        },
        error: function (xhr) {
            //error_handler(xhr, url);
        }
    });
}

async function saveAdmissionImagingAsync(model) {

    let result = await $.ajax({
        url: viewData_save_AdmissionImaging,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (data) {
            return data;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_save_AdmissionImaging);
            return {
                status: -100,
                statusMessage: "عملیات با خطا مواجه شد",
                successfull: false
            };
        }
    });

    return result;
}

function admissionSearch() {

    let pg_id = "searchAdmissionModal_pagetable";
    get_NewPageTable(pg_id);

}

function get_NewPageTable(pg_id = null, isInsert = false, callBack = undefined) {

    if (pg_id == null)
        pg_id = "pagetable";

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

    if (!configFilterRes)
        return;


    var id = +$("#admissionId").val() == 0 ? null : +$("#admissionId").val()
    var attenderId = +$("#attenderId").val()
    var attenders = ""

    if (attenderId != 0 && checkResponse(attenderId)) {
        var attender = $("#attenderId option:selected").text().split("-")
        attenders = [{ id: +attender[0].trim(), name: attender[1].trim() }]
    }
    else
        attenders = []


    let pageViewModel = {
        workflowId: +$("#workflowId").val() == "" || +$("#workflowId").val() == 0 ? null : $("#workflowId").val(),
        stageId: +$("#stageId").val() == "" || +$("#stageId").val() == 0 ? null : $("#stageId").val(),
        actionId: +$("#actionId").val() == "" || +$("#actionId").val() == 0 ? null : $("#actionId").val(),
        id: id,
        reserveDate: $("#reserveDate").val() == "" ? null : $("#reserveDate").val(),
        patientFullName: $("#PatientFullName").val() == "" ? null : $("#PatientFullName").val(),
        patientNationalCode: $("#PatientNationalCode").val() == "" ? null : $("#PatientNationalCode").val(),
        attenderId: ((attenders != null && attenders.length > 0) ? attenders[0].id : null),
        headerTableName: "mc.AdmissionImaging",
        pageNo: pagetable_pageNo,
        pageRowsCount: pagetable_pagerowscount,
    }

    pageViewModel.form_KeyValue = pagetable_formkeyvalue;

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

            if (pagetable_currentpage == 1)
                fillOption(result, pg_id);

            fill_NewPageTable(result, pg_id, callBack);

            refreshBackPageTable(false, pg_id);
        },
        error: function (xhr) {
            error_handler(xhr, url);
            refreshBackPageTable(true, pg_id);
        }
    });

}

function run_button_setAdmissionInfo(admissionId, rowno, currentActionId) {

    let stageId = 0
    let workflowId = 0
    let actionId = 0

    
    if (rowno > 0) {
        selectedRowId = `row${rowno}`;
        stageId = +$(`#searchAdmissionModal_pagetable  tbody tr#${selectedRowId}`).data("stageid");
        workflowId = +$(`#searchAdmissionModal_pagetable  tbody tr#${selectedRowId}`).data("workflowid");
        actionId = +$(`#searchAdmissionModal_pagetable  tbody tr#${selectedRowId}`).data("actionid");
        currentActionId = 0
        admSelected.admissionWorkflowCategory = $(`#searchAdmissionModal_pagetable  tbody tr#${selectedRowId}`).data("workflowcategoryid")
    }
    else {
        stageId = null;
        workflowId = null
        actionId = null
    }

    admissionIdentity = +admissionId;

    let data = getfeildByAdmissionId(admissionId, workflowId, stageId, actionId)

    fillAdmissionInfo(data.admissionId, data.patientId, data.patientFullName, data.workflowId, data.workflowName, data.stageId, data.stageName, data.actionId, data.actionName,
        data.patientNationalCode, data.basicInsurerId, data.basicInsurerName, data.basicInsurerLineId, data.basicInsurerLineName, data.compInsurerId, data.compInsurerName,
        data.admissionHID, data.basicInsurerExpirationDatePersian, data.attenderId, data.attenderFullName, data.admissionTypeId, data.thirdPartyInsurerId, data.thirdPartyInsurerName, data.referringDoctorId,
        data.referringDoctorName, data.prescriptionDatePersian);

    admSelected.attenderFullName = data.attenderFullName;
    admSelected.attenderGenderId = data.attenderGenderId;
    admSelected.basicInsurerLineName = data.basicInsurerLineName;
    admSelected.compInsurerLineName = data.compInsurerLineName;
    admSelected.basicInsurerName = data.basicInsurerName;
    admSelected.patientNationalCode = data.patientNationalCode;
    admSelected.patientFullName = data.patientFullName;
    admSelected.admissionId = +data.admissionId;
    admSelected.basicInsurerId = +data.basicInsurerId;
    admSelected.basicInsurerLineId = +data.basicInsurerLineId;
    admSelected.compInsurerId = +data.compInsurerId;
    admSelected.compInsurerLineId = +data.compInsurerLineId;
    admSelected.thirdPartyId = +data.thirdPartyInsurerId;
    admSelected.hID = data.admissionHID;
    admSelected.basicInsurerExpirationDatePersian = data.basicInsurerExpirationDatePersian;
    admSelected.basicInsurerNo = data.basicInsurerNo;
    admSelected.prescriptionDatePersian = data.prescriptionDatePersian;
    admSelected.referringDoctorId = data.referringDoctorId;
    admSelected.referringDoctorName = data.referringDoctorName;
    admSelected.patientId = data.patientId;
    admSelected.attenderId = data.attenderId
    admSelected.createDatePersian = data.createDatePersian
    admSelected.admissionDate = data.admissionDate
    admSelected.patientGenderId = data.patientGenderId
    admSelected.patientBirthDate = data.patientBirthDate
    admSelected.branchId = +data.branchId
    admSelected.workflowId = data.workflowId
    admSelected.stageId = data.stageId
    admSelected.actionId = +actionId > 0 ? +data.actionId : currentActionId
    admSelected.workflowName = data.workflowName
    admSelected.stageName = data.stageName
    admSelected.actionName = data.actionName


}

function fillAdmissionInfo(admissionId, patientId, patientFullName, workflowId, workflowName, stageId, stageName, actionId, actionName,
    patientNationalCode, basicInsurerId, basicInsurerName, basicInsurerLineId, basicInsurerLineName, compInsurerId, compInsurerName,
    admissionHID, basicInsurerExpirationDatePersian, attenderId, attenderFullName, admissionType, thirdPartyInsurerId, thirdPartyInsurerName, referringDoctorId,
    referringDoctorName, prescriptionDatePersian) {
    $("#admissionSelected").html("");

    var admissionOutput = `<tr data-admissionid="${admissionId}" data-admissionworkflowid="${workflowId}" data-admissionstageid="${stageId}">
                               <td>${admissionId}</td> 
                               <td>${patientId} - ${patientFullName}</td> 
                               <td>${workflowId == 0 || workflowId == null ? "" : `${workflowId} - ${workflowName}`}</td>
                               <td>${stageId == 0 || stageId == null ? "" : `${stageId} - ${stageName}`}</td>
                               <td>${attenderId} - ${attenderFullName}</td> 
                               <td>${referringDoctorId == 0 || referringDoctorId == null ? "" : `${referringDoctorId} - ${referringDoctorName}`}</td>
                               <td>${prescriptionDatePersian == "" || prescriptionDatePersian == null ? "" : prescriptionDatePersian}</td>
                               <td>${patientNationalCode}</td>
                               <td>${basicInsurerId == 0 || basicInsurerId == null ? "" : `${basicInsurerId} - ${basicInsurerName}`}</td>
                               <td>${basicInsurerLineId == 0 || basicInsurerLineId == null ? "" : `${basicInsurerLineId} - ${basicInsurerLineName}`}</td>
                               <td>${compInsurerId == 0 || compInsurerId == null ? "" : `${compInsurerId} - ${compInsurerName}`}</td>
                               <td>${thirdPartyInsurerId == 0 || thirdPartyInsurerId == null ? "" : `${thirdPartyInsurerId} - ${thirdPartyInsurerName}`}</td>
                               <td>${admissionHID == 0 || admissionHID == null ? "" : admissionHID}</td>
                               <td>${basicInsurerExpirationDatePersian == "" || basicInsurerExpirationDatePersian == null ? "" : basicInsurerExpirationDatePersian}</td>
                               <td>${actionId == 0 || actionId == null ? "" : `${actionId} - ${actionName}`}</td>
                               <td><button type="button" onclick="displayAdmission(${admissionId},this)" class="btn blue_outline_1" data-toggle="tooltip" data-placement="bottom" title="نمایش مراجعه کننده">
                                    <i class="fa fa-list"></i>
                                    </button></td> 
                           </tr>`

    $("#admissionSelected").html(admissionOutput);

    modal_close("searchAdmissionModal");
}

function displayAdmission(id, elm) {

    let row = $(elm).parent().parent()
    let admissionId = row.data("admissionid")
    let workflowId = row.data("admissionworkflowid");
    let stageId = row.data("admissionstageid");

    let workflowStage = getAdmissionTypeId(stageId, workflowId)
    let admissionTypeId = workflowStage.admissionTypeId

    if (admissionTypeId == 1)
        getRequestData(`${viewData_baseUrl_MC}/AdmissionItemApi/display`, admissionTypeId, admissionId);
    else if (admissionTypeId == 2 || admissionTypeId == 3 || admissionTypeId == 4)
        getRequestData(`${viewData_baseUrl_MC}/AdmissionApi/display`, admissionTypeId, admissionId);

    $("#attenderNameSection").parent().parent().children("label").text("رادیولوژیست")
}

function getfeildByAdmissionId(admId, workflowId, stageId, actionId) {

    var modelSearch = {
        workflowId: +workflowId == "" || +workflowId == 0 ? null : +workflowId,
        stageId: +stageId == "" || +stageId == 0 ? null : +stageId,
        actionId: +actionId == "" || +actionId == 0 ? null : +actionId,
        id: +admId,
        createDatePersian: null,
        patientFullName: null,
        patientNationalCode: null
    }

    var result = $.ajax({
        url: viewData_get_AdmissionSearch,
        async: false,
        cache: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(modelSearch),
        success: function (data) {
            return data;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_get_AdmissionSearch);
            return null;
        }
    });
    return result.responseJSON;
}

function modal_save() {
    let input = document.querySelector("#fileTest");
    if (!input.files[0] || !input.files)
        return;
    let image_holder = ("#imageHolder");
    let reader = new FileReader();
    reader.onload = e => tinymce.get("attenderInstruction").insertContent(`<img src="${e.target.result}" height="100" />`);
    reader.readAsDataURL(input.files[0]);
    modal_close("addPictureModal");
}

function resetAdmissionImagingForm() {
    arr_TempAdmImg = [];
    tinymce.get("attenderInstruction").setContent("");
}

function resetFormAdmissionImaging() {
    alertify.confirm('بازنشانی', "آیا اطمینان دارید؟",
        function () {
            arr_TempAdmImg = [];
            $("#admissionImagingId").val("");
            $("#userFullName").val("");
            $("#createDateTime").val("");
            $("#tempAdmission").html(fillEmptyRow(15));
            $("#admissionSelected").html("");
            $("#templateId").val(0).trigger("change");
            $("#admissionId").val("");
            $("#PatientNationalCode").val("");
            $("#PatientFullName").val("");
            $("#createDateTime").val("");
            $("#searchAdmission").val("");
            $("#admissionImagingBox").addClass("displaynone");
            $("#headerFirst").addClass("displaynone");
            $("#headerPrevious").addClass("displaynone");
            $("#headerIndex").addClass("displaynone");
            $("#headerNext").addClass("displaynone");
            $("#headerLast").addClass("displaynone");
            tinymce.get("attenderInstruction").setContent("");
            $("#choiceOfAdmission").css("display", "inline");

            arr_TempAdmImg = [];
            admissionIdentity = 0; admissionImagingId = 0;
            $("#admissionImagingId").val("0");
            admSelected = {
                admissionId: 0,
                basicInsurerId: 0,
                compInsurerId: 0,
                basicInsurerLineId: 0,
                compInsurerLineId: 0,
                thirdPartyId: 0,
                hID: 0,
                basicInsurerNo: 0,
                basicInsurerExpirationDatePersian: "",
                patientFullName: "",
                patientNationalCode: "",
                basicInsurerName: "",
                basicInsurerLineName: "",
                compInsurerLineName: "",
                attenderFullName: "",
                workflowId: 0,
                workflowName: "",
                stageId: 0,
                stageName: "",
                actionId: 0,
                actionName: ""
            }

        },
        function () {
            return;
        }
    ).set('labels', { ok: 'بله', cancel: 'خیر' });
}

function focusSearchedRow(i) {
    $("#tempAdmission tr").removeClass("highlight");
    $(`#tempAdmission #adm_${i}`).addClass("highlight");
    $(`#tempAdmission #adm_${i} > td > button`).focus();
}

function admissionRowKeyDown(index, event) {

    if (event.which === KeyCode.ArrowDown) {
        event.preventDefault();
        if ($(`#tempAdmission #adm_${index + 1}`).length > 0) {
            $("#tempAdmission tr").removeClass("highlight");
            $(`#tempAdmission #adm_${index + 1}`).addClass("highlight");
            $(`#tempAdmission #adm_${index + 1} > td > button`).focus();
        }
    }

    if (event.which === KeyCode.ArrowUp) {
        event.preventDefault();
        if ($(`#tempAdmission #adm_${index - 1}`).length > 0) {
            $("#tempAdmission tr").removeClass("highlight");
            $(`#tempAdmission #adm_${index - 1}`).addClass("highlight");
            $(`#tempAdmission #adm_${index - 1} > td > button`).focus();
        }
    }

}

async function setContent(id, Template) {
    let content = ""
    content = await getContentById(id, viewData_getrecordTemplate_url);
    let contentDecoded = decodeEntities(content);
    tinymce.get("attenderInstruction").setContent(contentDecoded);
    modal_close('choosePatternModal');
}

function getContentById(id, url) {
    var result = $.ajax({
        url: `${url}/${id}`,
        type: "get",
        dataType: "text",
        contentType: "html/text",
        data: JSON.stringify(id),
        success: data => data,
        error: function (xhr) {
            error_handler(xhr, `${url}/${id}`);
            return null;
        }
    });
    return result;
}

function decodeEntities(encodedString) {

    var div = document.createElement('div');
    div.innerHTML = encodedString;
    let newContent = div.textContent;

    let currentContent = tinymce.get("attenderInstruction").getContent();

    let result = `${currentContent} <br/> ${newContent}`;

    return result;
}

document.onkeydown = function (e) {
    if (e.ctrlKey && e.keyCode === KeyCode.key_s) {
        e.preventDefault();
        saveAdmissionImagingForm()
    }
}

$("#list_adm").on("click", function () {

    navigation_item_click('/MC/AdmissionImaging', 'لیست تصویر برداری')
});

$("#choosePattern").on("click", function () {

    let templateId = $("#templateId").val()

    if (templateId == 0 || templateId == null) {
        var msg_temp_srv = alertify.warning("قالب را انتخاب کنید");
        msg_temp_srv.delay(prMsg.delay);
        return
    }

    let id = +$("#templateId").val();
    if (id !== 0) {
        let countOfRepetitiousid = arrayOfIdTemplate.find((item) => item.id == id)
        if (!checkResponse(countOfRepetitiousid)) {
            arrayOfIdTemplate.push({ id: id })
        }
        setContent(id, "templateId")
    }
    $("#templateId").val("0").trigger("change")

});

$("#searchAdmissionModal").on("hidden.bs.modal", async function () {
    //$("#admissionId").val("")
    //$("#patientNationalCode").val("")
    //$("#patientFullName").val("")
    //$("#reserveDate").val("")
    //$("#tempAdmission tr").removeClass("highlight");
});

$("#workflowId").on("change", function () {

    var workflowId = +$(this).val() !== 0 ? +$(this).val() : null

    $("#stageId").empty();
    var newOption1 = new Option("انتخاب کنید", 0, true, true);

    $('#stageId').append(newOption1)
    var stageClassId = "17,22,28";

    fill_select2(`${viewData_baseUrl_WF}/StageApi/getstagedropdownbyworkflowid`, "stageId", true, `null/${workflowId}/10,14/${stageClassId}/0/2`, false, 3);
});

$('#stageId').on('change', function () {

    let stageId = +$("#stageId").val() == 0 ? null : $("#stageId").val(),
        workflowId = +$("#workflowId").val() == 0 ? null : $("#workflowId").val(),
        stageClassId = "17,22,28",
        workFlowCategoryId = workflowCategoryIds.medicalCare.id;

    $("#actionId").empty();

    fill_select2(`${viewData_baseUrl_WF}/StageActionApi/getdropdownactionlistbystage`, "actionId", true, `${stageId}/${workflowId}/2/2/null/${workFlowCategoryId}/true/${stageClassId}`, false, 3);
})

$("#searchAdmission").on("click", function () {
    admissionSearch();
});

initAdmissionImagingForm();