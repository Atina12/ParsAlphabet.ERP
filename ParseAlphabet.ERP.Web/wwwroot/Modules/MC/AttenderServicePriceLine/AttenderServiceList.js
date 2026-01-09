
var viewData_controllername = "AttenderServicePriceLineApi",
    url_Api = `${viewData_baseUrl_MC}/${viewData_controllername}/attenderservicelist`;


function modal_attender_info(modalName, attrId) {

    var url = `${viewData_baseUrl_MC}/AttenderApi/getrecordbyid`;

    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(attrId),
        cache: false,
        async: false,
        success: function (result) {

            var item = result.data;

            if (item.id)
                $(`#${modalName}`).find("#attrId").html(attrId);
            else
                $(`#${modalName}`).find("#attrId").html("");

            if (item.firstName || item.lastName)
                $(`#${modalName}`).find("#attrfullName").html(`${item.firstName !== null ? item.firstName : ""} ${item.lastName !== null ? item.lastName : ""}`);
            else
                $(`#${modalName}`).find("#attrName").html("");

            if (item.serviceCenterName)
                $(`#${modalName}`).find("#attrServiceCenter").html(item.serviceCenterName);
            else
                $(`#${modalName}`).find("#attrServiceCenter").html("");

            if (item.msc)
                $(`#${modalName}`).find("#attrMsc").html(item.msc);
            else
                $(`#${modalName}`).find("#attrMsc").html("");
        },
        error: function (xhr) {
            error_handler(xhr, url)
        }
    });
}

function attenderServiceList_init(attenderId) {

    $.ajax({
        url: url_Api,
        type: "post",
        dataType: "json",
        data: JSON.stringify(attenderId),
        contentType: "application/json",
        success: function (res) {
       
            let output = '', data = null, resultLen = res.length;
            $("#attrCount").text(resultLen)
            if (resultLen == 0) {
                $("#tbAttenderServiceList").html("")

                let emptyStr = `
                        <tr>
                             <td colspan="4" style="text-align:center">سطری وجود ندارد</td>
                        </tr>
                        `
                $("#tbAttenderServiceList").append(emptyStr)

                emptyStr = ``;
            }
            else {
                for (var i = 0; i < resultLen; i++) {
                    data = res[i];
                    output += `
                        <tr id="tr_${i}" onclick="tr_onclickServiceList(${i})" onkeydown="tr_onkeydownServiceList(event,${i},${resultLen})" tabindex="-1">
                         <td class="text-center">${i + 1}</td>
                         <td>${data.attenderMarginBracket} / مبنای حق الزحمه: ${data.priceTypeName} (${data.attenderCommissionValueName}) - (${data.minAmountTitle} - ${data.maxAmountTitle})</td>
                         <td>${data.medicalSubject}</td>
                         <td>${data.service}</td>
                        </tr>`;
                }
                $("#tbAttenderServiceList").html("").html(output);
            }

        },
        error: function (xhr) {
            error_handler(xhr, url_Api);
        }
    });


}

function tr_onclickServiceList(rowNo) {
    TrHighlight(rowNo)

}

function tr_onkeydownServiceList(ev, rowNo, rowCount) {
    if (ev.which === KeyCode.ArrowDown && rowNo < rowCount) {
        ev.preventDefault();
        TrHighlight(rowNo + 1)
    }
    else if (ev.which === KeyCode.ArrowUp && rowNo > 0) {
        ev.preventDefault();
        $(`#tbAttenderService > tbody > tr.highlight`).removeClass("highlight");
        $(`#tbAttenderService > tbody > tr#tr_${rowNo - 1}`).addClass("highlight");
        $(`#tbAttenderService > tbody > tr#tr_${rowNo - 1}`).focus();
    }
}

function TrHighlight(rowNo) {
    $(`#tbAttenderService > tbody > tr.highlight`).removeClass("highlight");
    $(`#tbAttenderService > tbody > tr#tr_${rowNo}`).addClass("highlight");
    $(`#tbAttenderService > tbody > tr#tr_${rowNo}`).focus();
}

function exportServiceListCsv() {

    var check = controller_check_authorize("AttenderServicePriceApi", "PRN");
    if (!check)
        return;


    let csvModel = +printInfo.attenderId

    var urlCSV = `${viewData_baseUrl_MC}/AttenderServicePriceLineApi/csvattenderservicelist/${csvModel}`;
    loadingAsync(true, "exportServiceListCsv", "fa fa-file-excel");

    let csvTitle = `خدمات معالج_${csvModel}`

    $.ajax({
        url: urlCSV,
        type: "get",
        datatype: "text",
        contentType: "text/csv",
        xhrFields: {
            responseType: 'blob',
        },
        success: function (result) {
            if (result) {

                let element = document.createElement('a')
                element.setAttribute('href', window.URL.createObjectURL(result));
                element.setAttribute('download', `${csvTitle}.csv`);
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
                window.URL.revokeObjectURL(urlCSV);
            }
            loadingAsync(false, "exportServiceListCsv", "fa fa-file-excel");
        },
        error: function (xhr) {
            error_handler(xhr)
            loadingAsync(false, "exportServiceListCsv", "fa fa-file-excel");
        }
    });
}

function print_ServiceList() {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    var reportUrl = `${stimulsBaseUrl.MC.Prn}AttenderServicePriceList.mrt`;

    var repParameters = [
        { Item: "AttenderId", Value: printInfo.attenderId, SqlDbType: dbtype.Int },
        { Item: "AttenderFullName", Value: printInfo.attenderFullName, itemType: "Var" },
        { Item: "AttenderNationalCode", Value: printInfo.attenderNationalCode, itemType: "Var" },
    ]

    var reportModel = {
        reportName: `لیست خدمات قرارداد`,
        reportUrl: reportUrl,
        parameters: repParameters,
        reportSetting: reportSettingModel
    }

    window.open(`${viewData_report_url}?strReportModel=${JSON.stringify(reportModel)}`, '_blank');
}

async function loadingAsync(loading, elementId) {
    if (loading) {
        $(`#${elementId} i`).addClass(`fa fa-spinner fa-spin`);
        $(`#${elementId}`).prop("disabled", true)
    }
    else {
        $(`#${elementId} i`).removeClass("fa-spinner fa-spin");
        $(`#${elementId}`).prop("disabled", false)
    }
}