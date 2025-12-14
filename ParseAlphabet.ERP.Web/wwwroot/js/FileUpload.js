var formData = new FormData(),
    fr, img, maxFiles = 10, errMessage = 0, dataArray = [], error = 0, success = 0, counter = 0,
    flagFile = 0, idList = [], idSet = 0, filterMonth = ``, filterType = ``, filterText = '', selectedFile = 0;

$(`#file`).on(`change`, function (e) {
    var input = document.getElementById(`file`);

    if (input.files.length)
        validateUpload(input.files);
});

function validateUpload(files) {
    var output = ``, width = 0, height = 0;

    $(`#resultSuccessOrError`).html("");
    $(`#totalUploaded`).html("");

    $.each(files, function (index, file) {

        counter++;

        var resultValidate = validateFile(file);

        if (resultValidate === `undefined` || resultValidate === `null` || resultValidate === `ext` || resultValidate === `size`) {

            error++;

            output += `<label class="result-label error-label">`;

            var fileName = file.name;

            output += `<span class="col-lg-12 title-result">${fileName}</span>`;

            if (resultValidate === `undefined`)
                output += `<span class="col-lg-12">لطفا فایل را انتخاب نمایید</span>`;
            else if (resultValidate === `null`)
                output += `<label class="col-lg-12">لطفا فایل را انتخاب نمایید</label>`;
            else if (resultValidate === `ext`)
                output += `<label class="col-lg-12">فایل انتخاب شده نامعتبر می باشد</label>`;
            else if (resultValidate === `size`)
                output += `<label class="col-lg-12">حجم فایل زیاد می باشد (حداکثر حجم مجاز 50 مگابایت می باشد)</label>`;

            output += `</label>`;

            $(output).appendTo(`#resultSuccessOrError`);
        }
        else {

            success++;

            var fileReader = new FileReader();

            fileReader.onload = (function (file) {
                return function (e) {

                    // dataArray.push({ name: file.name, value: this.result });

                    if (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg") {

                        var image = new Image();
                        image.src = this.result;
                        image.onload = function () {
                            uploadFile(files[index], this.width, this.height, files[index].name);
                        };
                    }
                    else {
                        uploadFile(file, 0, 0, file.name);
                    }
                };
            })(files[index]);
            fileReader.readAsDataURL(file);
        }
    });
}

function validateFile(file) {

    if (file === null)
        return "null";
    else if (file === undefined)
        return "undefined";
    else if (file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/jpg" ||
        file.type === "audio/mp3" ||
        file.type === "application/pdf" ||
        file.type === "application/vnd.ms-excel" ||
        file.type.toLowerCase().includes("application/vnd.openxmlformats-officedocument.wordprocessingml.document") ||
        file.type === "video/mp4" ||
        file.type === "video/x-matroska" ||
        file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/x-zip-compressed" ||
        file.type === "application/vnd.ms-visio.viewer"
    ) {
        if (file.size > 52428800)
            return "size";
        else return "ok";
    }
    else return "ext";
}

function uploadFile(file, widthFile, heightFile, fileName) {


    formData = new FormData();

    formData.append("File", file);
    formData.append("IdentityType", $(`#identityType`).val());
    formData.append("Width", widthFile);
    formData.append("Height", heightFile);
    formData.append("AliasName", fileName);

    addFile(formData).then(function (result) {
        if (result.httpStatusCode === 200) {
            
            $(`#totalUploaded`).html(`<label class="result-label success-label"><span class="col-lg-12 title-result">تعداد فایل آپلود شده : ${counter - error} / ${counter}</span></label>`);
        }
        else
            console.log("error");
    });
}

async function addFile(model) {
    let r = await $.ajax({
        url: `/Api/Admin/File/Upload`,
        type: `POST`,
        contentType: false,
        processData: false,
        data: model,
        success: function (data) {
            
            return data;
        },
        error: function (data) {

            return data;
        }
    });
    return r;
}

$(`#addFiles`).on(`click`, function (event) {
    $(`#closeFileManager`).click();
});
