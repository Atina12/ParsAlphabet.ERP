var viewData_controllername = "AdmissionImagingTemplateApi",
    viewData_save_AdmissionImaging = `${viewData_baseUrl_MC}/${viewData_controllername}/insert`,
    viewData_get_AdmissionImaging = `${viewData_baseUrl_MC}/${viewData_controllername}/getpage`,
    viewData_getrecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getrecordbyid`,
    admissionImagingId = +$("#admissionImagingId").val();


async function initAdmissionImagingForm() {
    inputMask();
    tinyInit(admissionImagingId);
    //fill_select2(`${viewData_baseUrl_MC}/Attender_AssistantApi/getdropdown`, "attenderId", true, 0, false, 0, "انتخاب داکتر...");
    fill_select2(`${viewData_baseUrl_MC}/AttenderApi/getTemplateByAttender`, "attenderId", true, 0, false, 0, "انتخاب رادیولوژیست...");

}

async function tinyInit(id = 0) {

    tinymce.init({
        selector: 'textarea#attenderInstructionTemplate',
        directionality: 'rtl',
        menubar: 'view file edit insert format tools table help',
        plugins: 'print preview powerpaste casechange importcss tinydrive searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen image link media mediaembed template codesample table charmap hr export pagebreak nonbreaking anchor insertdatetime advlist lists checklist wordcount tinymcespellchecker a11ychecker textpattern noneditable help formatpainter permanentpen pageembed charmap tinycomments mentions quickbars linkchecker emoticons advtable export',
        toolbar: 'printContentBtn | redo undo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | ltr rtl alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | export pagebreak | charmap emoticons | fullscreen  preview save print addImageBtn | insertfile image media pageembed template link anchor codesample | a11ycheck | showcomments addcomment',
        language: 'fa',
        fontsize_formats: "7pt 8pt 9pt 10pt 11pt 12pt 13pt 14pt 15pt 16pt 18pt 19pt 24pt 27pt 36pt",
        height: 600,
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
                                        <td>تراز بندی از راست</td>
                                        <td>Ctrl + L</td>
                                    </tr>
                                    <tr>
                                        <td>ترازبندی از چپ</td>
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

            editor.ui.registry.addButton('addImageBtn', {
                icon: "image",
                onAction: _ => modal_show('addPictureModal')
            });

            editor.ui.registry.addButton('printContentBtn', {
                text: 'چاپ',
                onAction: _ => printContent(editor)
            });

            editor.on('init', e => configInitTiny(id));
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
}

function configInitTiny(id) {
    $(".preloader").addClass("hidePreloader");
    $("#attenderId").prop("selectedIndex", 0).trigger("change");

    if (id !== 0)
        getAdmissionImagingById(id);
}

function printContent(editor) {
    let body = editor.dom.doc.body.innerHTML;
    let date = $("#createDateTime").val();

    printTinyContent(body, date);
}

async function printTinyContent(data, createDate) {

    let content = "", contentHeader = "", tableAdm = "", tinycontent = data;

    tableAdm = `<table style="border-bottom: 1px solid;width: 100%;direction:rtl; border-spacing:0px;margin-bottom:5px;font-size:12px">
            <thead>
                <tr>
                    <th style="border-style: solid; border-width: 0px 0px 0px 0px;">داکتر</th>
                    <th style="border-style: solid; border-width: 0px 0px 0px 1px;">عنوان قالب</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="border-style: solid; border-width: 1px 0px 0px 0px; text-align: center">${$("#attenderId").val()}</td>
                    <td style="border-style: solid; border-width: 1px 0px 0px 1px; text-align: center">${$("#subject").val()}</td>
                </tr>
            </tbody>
        </table>`;

    contentHeader = await $.get("/Report/GetHeaderPrint").then(result => result);
    content = contentHeader.replace("@srcImage@", "data:image/png;base64,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")
        .replace("@craeteDate@", moment().format('jYYYY/jM/jD'))
        .replace("@companyName@", "مجتمع بهداشتی درمانی شهید شوریده")
        .replace("@userName@", "")
        .replace("@reportName@", "تصویربرداری")
        .replace("@content@", tinycontent)
        .replace("@headerContent@", tableAdm)
        .replace("@otherOption1@", "تایخ ثبت")
        .replace("@otherOptionValue1@", createDate == "" ? moment().format('jYYYY/jM/jD') : createDate)
        .replace("@otherOption2@", "")
        .replace("@otherOptionValue2@", "");

    document.querySelector("#frmDirectPrint").contentDocument.children[0].innerHTML = content;
    $('#frmDirectPrint').contents().find("body").html($('#frmDirectPrint').contents().find("body").html() + footerBodyPrintIfrem);
}

async function getAdmissionImagingById(admImgId) {
    if (admImgId !== 0) {
        $.ajax({
            url: viewData_getrecord_url,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(admImgId),
            success: function (res) {
                fillAdmissionImaging(res);
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

}

function fillAdmissionImaging(res) {
    
    if (res !== null) {
        $("#admissionImagingId").val(res.id);
        $("#attenderId").val(res.attenderId).trigger("change");
        $("#subject").val(res.subject);
        $("#code").val(res.code);
        $("#admissionImagingTemplateBox").removeClass("displaynone");
        tinymce.get("attenderInstructionTemplate").setContent(res.templateContent);
    }
}

async function disableSaveButtonAsync(disable) {
    $("#saveForm").prop("disabled", disable);
}

async function saveAdmissionImagingForm() {
    await disableSaveButtonAsync(true);
    let form = $("#admissionImagingTemplate").parsley();
    let validate = form.validate();
    validateSelect2(form);
    if (!validate) {
        await disableSaveButtonAsync(false);
        return;
    }

    if (tinymce.get("attenderInstructionTemplate").getContent() == null || tinymce.get("attenderInstructionTemplate").getContent() == undefined || tinymce.get("attenderInstructionTemplate").getContent() == "") {
        var msg_temp_srv = alertify.warning("لطفا قالب را تعریف کنید");
        msg_temp_srv.delay(prMsg.delay);
        $("#saveForm").removeAttr("disabled");
        return;
    }

    var validCode = $("#code").val()

    if (validCode.length < 3) {
        var msg_temp_srv = alertify.warning("مقدار کد نمی تواند کمتر از 3 حرف باشد");
        msg_temp_srv.delay(prMsg.delay);
        $("#saveForm").removeAttr("disabled");
        $("#code").focus()
        return;
    }

    var modelSave = {
        id: admissionImagingId,
        templateContent: tinymce.get("attenderInstructionTemplate").getContent(),
        attenderId: $("#attenderId").val(),
        subject: $("#subject").val(),
        code: $("#code").val()
    }
    saveAdmissionImagingAsync(modelSave).then(async (data) => {
        var resultSave = data.successfull;
        if (resultSave) {
            alertify.success("قالب تصویر با موفقیت ثبت شد").delay(alertify_delay);

            setTimeout(() => {
                navigation_item_click("/MC/AdmissionImagingTemplate", "لیست  قالب تصویربرداری");
            }, 500);
        }
        await disableSaveButtonAsync(!resultSave);

    }).then(async () => {
        await disableSaveButtonAsync(false);
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

function modal_save() {
    let input = document.querySelector("#fileTest");
    if (!input.files[0] || !input.files)
        return;
    let image_holder = ("#imageHolder");
    let reader = new FileReader();
    reader.onload = e => tinymce.get("attenderInstructionTemplate").insertContent(`<img src="${e.target.result}" height="100" />`);
    reader.readAsDataURL(input.files[0]);
    modal_close("addPictureModal");
}

function resetFormAdmissionImaging() {
    alertify.confirm('بازنشانی', "آیا اطمینان دارید؟",
        function () {
            $("#admissionImagingId").val("");
            $("#userFullName").val("");
            $("#createDateTime").val("");
            $("#subject").val("");
            $("#code").val("");
            $("#attenderId").val("").trigger("change")
            $("#admissionImagingTemplateBox").addClass("displaynone");
            tinymce.get("attenderInstructionTemplate").setContent("");

        },
        function () {
        }
    ).set('labels', { ok: 'بله', cancel: 'خیر' });
}

$("#list_adm").on("click", function () {

    navigation_item_click('/MC/AdmissionImagingTemplate', 'لیست تصویر برداری')
});

$(document).on("keydown", function (e) {
    //save
    if (e.ctrlKey && e.keyCode === KeyCode.key_s) {
        e.preventDefault();
        e.stopPropagation();
        saveAdmissionImagingForm();
    }
})

function admissionImagingTemplateCodeRegex(elm) {
    $(elm).val(function (index, value) {
        return value.replace(/[^A-Za-z0-9ا-ی-]+/g, "");
    });
}


initAdmissionImagingForm();

