
var viewData_controllername = "VendorItemPriceLineApi",
    url_Api = `${viewData_baseUrl_MC}/${viewData_controllername}/vendoritemlist`;


function modal_vendor_info(modalName, vendorId) {

    var url = `${viewData_baseUrl_PU}/VendorApi/getrecordbyid`;

    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(vendorId),
        cache: false,
        async: false,
        success: function (result) {

            var item = result.data;

            if (item.id)
                $(`#${modalName}`).find("#vendorIdTitle").html(vendorId);
            else
                $(`#${modalName}`).find("#vendorIdTitle").html("");

            if (item.firstName || item.lastName)
                $(`#${modalName}`).find("#vendorfullName").html(`${item.firstName !== null ? item.firstName : ""} ${item.lastName !== null ? item.lastName : ""}`);
            else
                $(`#${modalName}`).find("#vendorfullName").html("");
        },
        error: function (xhr) {
            error_handler(xhr, url)
        }
    });
}

function vendorItemList_init(vendorId) {

    $.ajax({
        url: url_Api,
        type: "post",
        dataType: "json",
        data: JSON.stringify(vendorId),
        contentType: "application/json",
        success: function (res) {
            let output = '', data = null, resultLen = res.length;
            $("#itemCount").text(resultLen)
            if (resultLen == 0) {
                $("#tbVendorItemList").html("")

                let emptyStr = `
                        <tr>
                             <td colspan="2" style="text-align:center">سطری وجود ندارد</td>
                        </tr>
                        `
                $("#tbVendorItemList").append(emptyStr)

                emptyStr = ``;
            }
            else {

                for (var i = 0; i < resultLen; i++) {
                    data = res[i];
                    output += `
                        <tr id="tr_${i}" onclick="tr_onclickVendorItemList(${i})" onkeydown="tr_onkeydownVendorItemList(event,${i},${resultLen})" tabindex="-1">
                         <td class="text-center">${i + 1}</td>
                         <td>${data.contractType} / مبنای حق الزحمه: ${data.priceTypeName} (${data.vendorCommissionValueName})</td>
                         <td>${data.item}</td>
                        </tr>`;
                }

                $("#tbVendorItemList").html("").html(output);
            }
        },
        error: function (xhr) {
            error_handler(xhr, url_Api);
        }
    });


}

function tr_onclickVendorItemList(rowNo) {
    TrHighlight(rowNo)

}

function tr_onkeydownVendorItemList(ev, rowNo, rowCount) {

    if (ev.which === KeyCode.ArrowDown && rowNo < rowCount) {
        ev.preventDefault();
        TrHighlight(rowNo + 1)
    }
    else if (ev.which === KeyCode.ArrowUp && rowNo > 0) {
        ev.preventDefault();
        $(`#tbVendorItem > tbody > tr.highlight`).removeClass("highlight");
        $(`#tbVendorItem > tbody > tr#tr_${rowNo - 1}`).addClass("highlight");
        $(`#tbVendorItem > tbody > tr#tr_${rowNo - 1}`).focus();
    }
}

function TrHighlight(rowNo) {
    $(`#tbVendorItem > tbody > tr.highlight`).removeClass("highlight");
    $(`#tbVendorItem > tbody > tr#tr_${rowNo}`).addClass("highlight");
    $(`#tbVendorItem > tbody > tr#tr_${rowNo}`).focus();
}

function export_vendorItemcsv() {

    var check = controller_check_authorize("VendorItemPriceApi", "PRN");
    if (!check)
        return;

    let csvModel = +printInfo.vendorId

    var urlCSV = `${viewData_baseUrl_MC}/VendorItemPriceLineApi/csvvendoritemlist/${csvModel}`;
    loadingAsync(true, "exportVendorItemcsv", "fa fa-file-excel");


    let csvTitle = `کالاهای تامین کننده_${csvModel}`

    $.ajax({
        url: urlCSV,
        type: "get",
        datatype: "text",
        contentType: "text/csv",
        xhrFields: {
            responseType: 'blob'
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
            loadingAsync(false, "exportVendorItemcsv", "fa fa-file-excel");
        },
        error: function (xhr) {
            error_handler(xhr)
            loadingAsync(false, "exportVendorItemcsv", "fa fa-file-excel");
        }
    });
}

function print_vendorItem() {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    var reportUrl = `${stimulsBaseUrl.MC.Prn}VendoritemPriceList.mrt`;

    var repParameters = [
        { Item: "VendorId", Value: printInfo.vendorId, SqlDbType: dbtype.Int },
        { Item: "PatientFullName", Value: printInfo.patientfullName, itemType: "Var" },
        { Item: "NationalCode", Value: printInfo.nationalCode, itemType: "Var" },
    ]

    var reportModel = {
        reportName: `لیست آیتم قرارداد`,
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