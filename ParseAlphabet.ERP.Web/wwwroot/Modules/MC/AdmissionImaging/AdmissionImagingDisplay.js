var viewData_controllername = "AdmissionImagingApi",
    viewData_get_AdmissionImaging = `${viewData_baseUrl_MC}/${viewData_controllername}/getpage`,
    viewData_getrecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getrecordbyid`,
    viewData_get_AdmissionSearch = `${viewData_baseUrl_MC}/AdmissionApi/search`,
    viewData_getAdmissionImagingCheckExist = `${viewData_baseUrl_MC}/${viewData_controllername}/checkexist`,
    emptyRow = `<tr id="emptyRow"><td colspan="thlength" class="text-center">سطری وجود ندارد</td></tr>`,
    arr_TempAdmImg = [],
    admissionIdentity = 0, admissionImagingId = +$("#admissionImagingId").val(), stage = $("#stage").val();

async function initAdmissionImagingForm() {
    tinyInit(admissionImagingId);
}

function headerindexChoose(e) {
    let elm = $(e.target);

    if (e.keyCode === KeyCode.Enter) {
        let checkExist = false;
        checkExist = checkExistAdmissionImagingId(+elm.val());
        if (checkExist) {
            getAdmissionImagingById(+elm.val(), 0);
            elm.val("");
        }
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

async function tinyInit(id = 0) {
    tinymce.init({
        selector: 'textarea#attenderInstruction',
        directionality: 'rtl',
        menubar: ' view file edit insert format tools table help',
        plugins: ' print preview powerpaste casechange importcss tinydrive searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen image link media mediaembed template codesample table charmap hr export pagebreak nonbreaking anchor insertdatetime advlist lists checklist wordcount tinymcespellchecker a11ychecker textpattern noneditable help formatpainter permanentpen pageembed charmap tinycomments mentions quickbars linkchecker emoticons advtable export',
        toolbar: ' redo undo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | export pagebreak | charmap emoticons | fullscreen  preview save print customInsertButton | insertfile image media pageembed template link anchor codesample | a11ycheck ltr rtl | showcomments addcomment',
        language: 'fa',
        height: 550,
        setup: function (editor) {
            editor.ui.registry.addButton('customInsertButton', {
                icon : "image",
                onAction: function (_) {
                    modal_show('addPictureModal');
                }
            });
            editor.on('init', function (e) {
                if (id !== 0)
                    getAdmissionImagingById(id);
            });
        },
        readonly: 1,
        quickbars_selection_toolbar: 'bold italic | quicklink h2  | h3 blockquote quickimage  | quicktable',
        font_formats: "Andale Mono=andale mono;iran sans=iran sans;",
        content_style: `font-face {font-family: 'iran sans';src: url('IRANSansXFaNum-Regular.ttf')}`,
        toolbar_mode: 'sliding',
    });
    return id;
}

async function getAdmissionImagingById(admImgId, headerPagination) {
    let model = {
        headerPagination: headerPagination,
        admissionImagingId: admImgId
    }
    if (admImgId !== 0) {
        $.ajax({
            url: viewData_getrecord_url,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(model),
            success: function (data) {
                resetAdmissionImagingForm();
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
        $("#userFullName").val(`${admImg.createUserId} - ${admImg.createUserFullName}`);
        $("#createDateTime").val(admImg.createDatePersian);
        $("#admissionImagingBox").removeClass("displaynone");
        $("#refDoctorName").val(`${admImg.referringDoctorId == 0 ? "" : `${admImg.referringDoctorId} - ${admImg.referringDoctorName}`}`);    
        $("#prescriptionDatePersian").val(admImg.prescriptionDatePersian);

        setAdmissionInfo(admImg.admissionId, admImg.content);
        arr_TempAdmImg.push(admImg);
        appendTempAdmImg(admImg);
        admImg = {};
    }
}

function appendTempAdmImg(admImg, tSave = "INS"){
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
}

function admissionSearch() {

    var id = +$("#admissionId").val()

    var modelSearch = {
        stateId: 3,
        id: id,
        createDatePersian: $("#createDatePersian").val(),
        patientFullName: $("#patientFullName").val(),
        patientNationalCode: $("#patientNationalCode").val()
    }

    $.ajax({
        url: viewData_get_SearchAdmission,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(modelSearch),
        success: function (result) {
            $("#tempAdmission").html("");
            if (result != null) {
                if (result.length > 0) {
                    if (result.length === 1)
                        setAdmissionInfo(result[0].admissionId);
                    else {

                        var output = "";

                        var len = result.length;

                        for (var a = 0; a < len; a++) {
                            var item = result[a];
                            output = `<tr id="adm_${a}" onclick="focusSearchedRow(${a})" onkeydown="admissionRowKeyDown(${a},event)">
                                    <td>${item.admissionId}</td>
                                    <td>${item.patientId} - ${item.patientFullName}</td>
                                    <td>${item.attenderFullName}</td>
                                    <td>${item.patientNationalCode}</td>
                                    <td>${item.basicInsurerName}</td>
                                    <td>${item.insuranceBoxName}</td>
                                    <td>${item.compInsuranceBoxName}</td>
                                    <td>${item.admissionHID}</td>
                                    <td>${item.insurExpDatePersian}</td>
                                    <td>
                                        <button type="button" onclick="setAdmissionInfo(${item.admissionId})" class="btn btn-info"  data-toggle="tooltip" data-placement="top" data-original-title="انتخاب">
                                              <i class="fa fa-check"></i>
                                        </button>
                                    </td>
                               </tr>`;
                            focusSearchedRow(0);
                            $(output).appendTo("#tempAdmission");
                        }
                    }
                }
                else {
                    output = fillEmptyRow(10);
                    $(output).appendTo("#tempAdmission");
                    return;
                }
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_get_SearchAdmission);
        }
    });
}

function setAdmissionInfo(admissionId, tinyContent = "") {

    admissionIdentity = +admissionId;
    let data = getfeildByAdmissionId(admissionId)

    fillAdmissionInfo(data.admissionId, data.patientId, data.patientFullName,
        data.patientNationalCode, data.basicInsurerId, data.basicInsurerName, data.basicInsurerLineName, data.compInsurerId, data.compInsurerName,
        data.admissionHID, data.basicInsurerExpirationDatePersian, data.attenderId, data.attenderFullName, data.thirdPartyInsurerId, data.thirdPartyInsurerName, data.referringDoctorId,
        data.referringDoctorName, data.prescriptionDatePersian, data.basicInsurerLineId, data.workflowId, data.workflowName, data.stageId, data.stageName, data.actionId, data.actionName);

    tinymce.get("attenderInstruction").setContent(tinyContent);
}

var getfeildByAdmissionId = (admId) => {
    var modelSearch = {
        stateId: 0,
        id: +admId,
        createDatePersian: "",
        patientFullName: "",
        patientNationalCode: ""
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
};

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

function fillAdmissionInfo(...data) {
    $("#admissionSelected").html("");

    var admissionOutput = `<tr>
                               <td>${data[0]}</td> 
                               <td>${data[1]} - ${data[2]}</td>
                               <td>${data[19] == 0 ? "" : `${data[19]} - ${data[20]}`}</td>
                               <td>${data[21] == 0 ? "" : `${data[21]} - ${data[22]}`}</td>
                               <td>${data[11]} - ${data[12]}</td> 
                               <td>${data[15] == 0 ? "" : `${data[15]} - ${data[16]}`}</td> 
                               <td>${data[17]}</td> 
                               <td>${data[3]}</td> 
                               <td>${data[4] == 0 || data[4] == null ? "" : `${data[4]} - ${data[5]}`}</td> 
                               <td>${data[18] == 0 || data[18] == null ? "" : `${data[18]} - ${data[6]}`}</td>
                               <td>${data[7] == 0 || data[7] == null ? "" : `${data[7]} - ${data[8]}`}</td>
                               <td>${data[13] == 0 || data[13] == null ? "" : `${data[13]} - ${data[14]}`}</td>
                               <td>${data[9] == 0 || data[9] == null ? "" : data[9]}</td>
                               <td>${data[23] == 0 ? "" : `${data[23]} - ${data[24]}`}</td>
                               <td>${data[10] == null ? "" : data[10] }</td>                           
                           </tr>`

    $("#admissionSelected").html(admissionOutput);

    modal_close("searchAdmissionModal");
}

$("#list_adm").on("click", function () {

    navigation_item_click('/MC/AdmissionImaging', 'لیست تصویر برداری')
});

$("#searchAdmission").on("click", function () {
    admissionSearch();
});

initAdmissionImagingForm();