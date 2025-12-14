document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        $("#loader").addClass("displaynone");
        $("div .content-page").removeClass("displaynone");
    }
};

$(document).on('keypress', 'input.persian-date', function (e) {
    if (![KeyCode.key_f, KeyCode.key_t, KeyCode.key_l, 108, 102, 116].includes(e.which)) { return }

    if (e.which == KeyCode.key_f || e.which == 102) {
        $(this).val(moment().format("jYYYY/01/01"));
    }
    if (e.which == KeyCode.key_l || e.which == 108) {
        $(this).val(moment().endOf('jyear').format("jYYYY/jMM/jDD"));
    }
    if (e.which == KeyCode.key_t || e.which == 116) {
        $(this).val(moment().format("jYYYY/jMM/jDD"));
    }
})

$(document).on('input', '.atoz-valid', function (e) {

    if (e.which >= KeyCode.ArrowLeft && e.which <= KeyCode.ArrowDown)
        return "";
    $(this).val(function (index, value) {
        return value.replace(/[^a-zA-Zئ آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی]/g, "");
    });
});

$(document).on('input', '.atoz0t9-valid', function (e) {

    if (e.which >= KeyCode.ArrowLeft && e.which <= KeyCode.ArrowDown)
        return "";
    $(this).val(function (index, value) {
        return value.replace(/[^a-z0-9A-Zئ ي آابپتثجچحخدذرزژسشصضطظعغفقکگل ك منويهی-]/g, "");
    });
});

$(document).on('input', '.atoz0t9-dash-valid', function (e) {

    if (e.which >= KeyCode.ArrowLeft && e.which <= KeyCode.ArrowDown)
        return "";

    $(this).val(function (index, value) {
        return value.replace(/[^a-z0-9A-Zئ ي آابپتثجچحخدذرزژسشصضطظعغفقکگل ك منويهی-]/g, "");
    });
});

$(document).on('input', '.atoz0t9-dash-underline-plus-valid', function (e) {

    if (e.which >= KeyCode.ArrowLeft && e.which <= KeyCode.ArrowDown)
        return "";
    $(this).val(function (index, value) {
        return value.replace(/[^a-z0-9A-Z+ئ آابپتثجچحخدذرزژسشصضطظعغفقکگلكمنويهی_-]/g, "");
    });
});

$(document).on('input', '.atoz0t9-dash-underline-valid', function (e) {

    if (e.which >= KeyCode.ArrowLeft && e.which <= KeyCode.ArrowDown)
        return "";
    $(this).val(function (index, value) {
        return value.replace(/[^a-z0-9A-Zئ آابپتثجچحخدذرزژسشصضطظعغفقکگلكمنويهی_-]/g, "");
    });
});

$(document).on('input', '.atoz-en-valid', function (e) {

    if (e.which >= KeyCode.ArrowLeft && e.which <= KeyCode.ArrowDown)
        return "";
    $(this).val(function (index, value) {
        return value.replace(/[^a-zA-Z0-9]/g, "");
    });
});

$(document).on('input', '.str-number', function (e) {

    if (e.which >= KeyCode.ArrowLeft && e.which <= KeyCode.ArrowDown)
        return "";

    $(this).val(function (index, value) {

        return value.replace(/\D/g, "");
    });
});

$(document).on('input', '.number', function (e) {

    if (e.which >= KeyCode.ArrowLeft && e.which <= KeyCode.ArrowDown)
        return;
    $(this).val(function (index, value) {
        if (value.startsWith("0")) {
            value = "0";
            return value;
        }
        return value.replace(/\D/g, "");
    });
});

$(document).on('input', '.negetive-number', function (e) {
    if (e.which >= KeyCode.ArrowLeft && e.which <= KeyCode.ArrowDown)
        return;
    $(this).val(function (index, value) {
        if (value.startsWith("0")) {
            value = "";
            return value;
        }
        if (value.startsWith("-")) {
            return "-" + value.replace(/\D/g, "");
        }
        return value.replace(/\D/g, "")
    });
});

$(document).on('input', '.barcode', function (e) {

    if (e.which >= KeyCode.ArrowLeft && e.which <= KeyCode.ArrowDown)
        return;

    $(this).val(function (index, value) {
        return value.replace(/[^0-9\-]/g, "");
    });
});

$(document).on('input', '.money', function (e) {
    $(this).val(function (index, value) {
        if (value.startsWith("0")) {
            value = "0";
            return value;
        }
        return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    });
});

$(document).on('input', '.money-decimal', function (e) {
    $(this).val(function (index, value) {

        if (value.startsWith("0")) {
            value = "0";
            return value;
        }

        let decimalPart = "";
        let intPart = "";

        var regexMoney = /^[0-9.,]*$/;
        if (value.match(regexMoney) == undefined) {

            decimalPart = value.split(".")[1] !== undefined ? "." + (value.split(".")[1]).replace(/\D/g, "") : "";
            intPart = value.split(".")[0];
            intPart = intPart.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return intPart + decimalPart;
        }

        if (value.indexOf(".") != -1) {

            if (value.replace(/[^.]/g, "").length == 1) {
                decimalPart = "." + value.split(".")[1];
                intPart = value.split(".")[0];
                intPart = intPart.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                return intPart + decimalPart;
            }
            else {
                let lastDotIndex = value.lastIndexOf(".");
                value = value.substr(0, lastDotIndex)
                return value;
            }
        }

        value = value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return value;
    });
});

$(document).on('blur', 'input.persian-date , input.persian-datepicker', function (e) {
    $(this).prop("data-parsley-validate", true);
    $(this).prop("data-parsley-shamsidate", true);

    let elm = $(this).parsley();
    elm.validate();
});

var comparisonStartEnd = (start, end) => start > end;

var transformNumbers = (function () {
    var numerals = {
        persian: ["٠", "۱", "٢", "۳", "۴", "۵", "۶", "۷", "۸", "۹"],
    };

    function fromEnglish(str) {
        var i, val, len = str.length, result = "";
        for (i = 0; i < len; i++) {
            val = numerals["persian"][str[i]];
            if (val != undefined)
                result += numerals["persian"][str[i]];
            else
                result += str[i];
        }
        return result;
    }

    return {
        toNormal: function (str) {
            if (str == "" || str == undefined) return "0";
            str = str.replace(/,/g, "");
            var num, pos, i, len = str.length, result = "";


            for (i = 0; i < len; i++) {
                pos = numerals["persian"].indexOf(str[i]);
                if (pos == -1)
                    num = str[i];
                else
                    num = pos;
                result += num;
            }

            return result;
        },

        toComma: function (inpstr) {

            var inputstr = inpstr.toString();

            if (typeof inputstr == "undefined" && inputstr == null) {
                return "";
            }

            var arrInput = inputstr.split(".");


            if (arrInput.length === 0) {
                return "";
            }
            if (arrInput.length === 1) {
                return arrInput[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
            }

            var integer = arrInput[0];
            var decimal = arrInput[1];

            var str = integer.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + (decimal !== "" ? "." + decimal : "");

            return str;
        },

        toPersian: function (inpstr) {
            var str = String(inpstr)
            return fromEnglish(str);
        },

        toPersianComma: function (inpstr) {
            var str = String(inpstr)
            var strSeprated = str.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
            return strSeprated;
        },
    }
})();

var alertNotify = (() => {
    return {
        errorNotify: function (inOut, position, msg, duration = 5) {
            var durationMiliSecondErr = duration * 1000;

            var alertMsg = `<div id="ajs-msg" class="ajs-message ajs-visible  ${inOut == "in" ? "ajs-success" : "ajs-error"}">
                    ${msg}<button type="button" onclick="removeNotify(this)" class="close">×</button></div>`;

            var boxFind = $("body").find(`#alert-${inOut}`);

            if (boxFind.length > 0)
                $(`#alert-${inOut}`).append(alertMsg);
            else {
                $("#form").append(`<div id="alert-${inOut}" class="alert-notifier ajs-${position}"></div>`);
                $(`#alert-${inOut}`).append(alertMsg);
            }

            $(".ajs-message").fadeIn("show", function () {
                $(this).addClass("ajs-visible");
            });

            $(".ajs-message").delay(durationMiliSecondErr).animate({
                opacity: '0',
                right: '-200px'
            }, 'slide', 'linear', function () {
                $(this).remove();
            });

        },
        successNotify: function (inOut, position, msg, duration = 5) {

            var durationMiliSecondSuc = duration * 1000;

            var alertMsg = `<div id="ajs-msg" class="ajs-message ajs-visible  ${inOut == "in" ? "ajs-success" : "ajs-error"}">
                    ${msg}<button type="button" onclick="removeNotify(this)" class="close">×</button></div>`;

            var boxFind = $("body").find(`#alert-${inOut}`);

            if (boxFind.length > 0)
                $(`#alert-${inOut}`).append(alertMsg);
            else {
                $("#form").append(`<div id="alert-${inOut}" class="alert-notifier ajs-${position}"></div>`);
                $(`#alert-${inOut}`).append(alertMsg);
            }


            $(".ajs-message").fadeIn("show", function () {
                $(this).addClass("ajs-visible");
            });

            $(".ajs-message").delay(durationMiliSecondSuc).animate({
                opacity: '0',
                right: '-200px'
            }, 'slide', 'linear', function () {
                $(this).remove();
            });

        }
    }

})();

function removeNotify(btn) {
    var parent = $(btn).parent()[0];
    $(parent).remove();
}

function tooltipLoading(elem, title) {

    $(`${elem}`).tooltip({
        show: null, // show immediately 
        items: 'input',
        hide: {
            effect: "", // fadeOut
        },
        content: function () {
            if (!finishTimeout)
                return false;
            //ajax call here 
            return title;
        },
        open: function (event, ui) {
            ui.tooltip.animate({ top: ui.tooltip.position().top + 10 }, "fast");
        },
        close: function (event, ui) {
            ui.tooltip.hover(
                function () {
                    $(this).stop(true).fadeTo(400, 1);
                    //.fadeIn("slow"); // doesn't work because of stop()
                },
                function () {
                    $(this).fadeOut("400", function () { $(this).remove(); })
                }
            );
        }
    });
    $(`${elem}`).mouseover(function () {

    });
    $(`${elem}`).mouseout(function () {
        clearTimeout(timeout);
    });
}


window.Parsley.addValidator('dateisonemonth', {
    validateString: function (value, requirement) {

        let toDateValue = $(`#${requirement}`).val();
        let fromDateValue = value;
        return checkDateIsOnMonth(fromDateValue, toDateValue);

    },
    messages: {
        en: 'بازه تاریخ نمیتواند بیشتر از یک ماه باشد.',
    }
});




window.Parsley.addValidator('validatecurrentdate', {
    validateString: function (value) {

        return checkcurrentdate(value);

    },
    messages: {
        en: 'تاریخ نمیتواند از ماه جاری کوچکتر باشد.',
    }
});


function checkDateIsOnMonth(fromDateValue, toDateValue) {

    if (toDateValue === "" || fromDateValue === "")
        return true;

    var date1 = moment(fromDateValue, "jYYYY/jMM/jDD");
    var date2 = moment(toDateValue, "jYYYY/jMM/jDD");
    var diff = date2.diff(date1, 'day');
    resultDiff = diff < 31;

    return resultDiff;
}

window.Parsley.addValidator('nationalcode', {
    validateString: function (value) {
        if (value !== '')
            return isValidIranianNationalCode(value);
    },
    messages: {
        en: 'فرمت نمبر تذکره صحیح نیست .',
    }
});

window.Parsley.addValidator('compnationalcode', {
    validateString: function (value) {
        return isValidIranianCompNationalCode(value);
    },
    messages: {
        en: 'فرمت شناسه ملی صحیح نیست .',
    }
});

window.Parsley.addValidator('mobileno', {
    validateString: function (value) {
        return isValidMobileNo(value);
    },
    messages: {
        en: 'فرمت شماره موبایل صحیح نیست .',
    }
});

window.Parsley.addValidator('phoneno', {
    validateString: function (value) {
        return isValidPhoneNo(value);
    },
    messages: {
        en: 'فرمت شماره تلفن صحیح نیست .',
    }
});

window.Parsley.addValidator('postalcode', {
    validateString: function (value) {
        return isValidPostalCode(value);
    },
    messages: {
        en: 'فرمت نمبر خانه (Postal Code) صحیح نیست .',
    }
});

window.Parsley.addValidator('email', {
    validateString: function (value) {
        return isValidEmail(value);
    },
    messages: {
        en: 'فرمت ایمیل صحیح نیست .',
    }
});

window.Parsley.addValidator('shamsidate', {
    validateString: function (value) {
        return isValidShamsiDate(value);
    },
    messages: {
        en: 'فرمت تاریخ صحیح نیست .',
    }
});

window.Parsley.addValidator('accontno', {
    validateString: function (value) {
        return isValidAccountNo(value);
    },
    messages: {
        en: 'فرمت شماره حساب صحیح نیست',
    }
});

window.Parsley.addValidator('shebano', {
    validateString: function (value) {
        return isValidShebaNo(value);
    },
    messages: {
        en: 'فرمت شماره شبا صحیح نیست',
    }
});

window.Parsley.addValidator('cardno', {
    validateString: function (value) {
        return isValidcardNo(value);
    },
    messages: {
        en: 'فرمت شماره کارت صحیح نیست',
    }
});

window.Parsley.addValidator('ipv4', {
    validateString: function (value) {
        return isValidIpv4(value);
    },
    messages: {
        en: 'فرمت آی پی صحیح نیست .',
    }
});

window.Parsley.addValidator('englishcode', {
    validateString: function (value) {
        return isValidEnglishCode(value);
    },
    messages: {
        en: 'فرمت کد صحیح نیست .',
    }
});

window.Parsley.addValidator('time', {
    validateString: function (value) {
        return isValidTime(value);
    },
    messages: {
        en: 'فرمت زمان صحیح نیست.',
    }
});

window.Parsley.addValidator('percentage', {
    validateString: function (value) {
        return isValidPercentage(value);
    },
    messages: {
        en: 'درصد باید کوچکتر یا مساوی 100 باشد .',
    }
});

window.Parsley.addValidator('notequalnumber', {
    validateString: function (value, requirement) {
        if (value != requirement)
            return true;
        return false;
    },
    messages: {
        en: 'مقدار وارد شده صحیح نیست',
    }
});

window.Parsley.addValidator('comparetimeelm', {
    validateString: function (value, requirement) {
        var value2 = $(`#${requirement}`).val();
        return compareTimeElm(value, value2);
    },
    messages: {
        en: 'زمان شروع باید کوچکتر مساوی زمان پایان باشد.',
    }

});
window.Parsley.addValidator('diffminutes', {
    validateString: function (value, requirement) {

        var value2 = $(`#${requirement}`).val();
        if (value2 != "") {
            return diffMinutes(value, value2);
        }
        else
            return false;

    },
    messages: {
        en: 'فاصله ی زمانی نمیتواند کمتر از 15 دقیقه باشد',
    }

});
window.Parsley.addValidator('shamsidatetime', {
    validateString: function (value) {
        return isValidShamsiDateWithTime(value);
    },
    messages: {
        en: 'فرمت تاریخ صحیح نیست .',
    }
});

window.Parsley.addValidator('compareshamsidate', {
    validateString: function (value, requirement) {
        var value2 = $(`#${requirement}`).val();
        if (value !== "" && value2 !== "" && requirement !== "")
            return compareShamsiDate(value, value2);
        else
            return true;
    },
    messages: {
        en: 'تاریخ شروع باید کوچکتر از تاریخ پایان باشد.',
    }
});

window.Parsley.addValidator('compareshamsidateyear', {
    validateString: function (value, requirement) {
        var value2 = $(`#${requirement}`).val();
        if (value !== "" && value2 !== "" && requirement !== "") {
            return compareShamsiDateYear(value, value2);
        }
        else
            return true;
    },
    messages: {
        en: 'تاریخ شروع و پایان باید در یک سال باشند.',
    }

});


window.Parsley.addValidator('chekdoubledate', {
    validateString: function (value, requirement) {

        var value2 = $(`#${requirement}`).val();
        if ((+value == 0 || +value2 == 0)) return false;
        if (value !== "" && value2 !== "" && requirement !== "") {
            return chekdoubledate(value, value2);
        }
        else
            return true;
    },
    messages: {
        en: 'تاریخ شروع و پایان یکسان نیستند.',
    }

});

window.Parsley.addValidator("selectvalzero", {
    validateString: function (value) {


        if (+value == 0)
            return false;

        return true;
    },
    messages: {
        en: 'ورود اطلاعات الزامي است'
    }
});

window.Parsley.addValidator('accountnumber', {
    validateString: function (value) {

        return isValidAccountNumber(value);
    },
    messages: {
        en: 'فرمت شماره حساب صحیح نیست .',
    }
});

window.Parsley.addValidator('validdecimal', {
    validateString: function (value) {
        return validDecimal(value);
    },
    messages: {
        en: 'مقدار اعشار  را  به صورت صحیح وارد کنید',
    }
});

function loaderOnPageTable(activeLoader, pageId) {

    if (activeLoader)
        $(`#${pageId}`).append("<div id='loadingOnPageTable'><i class='fa fa-spinner fa-spin'></i></div>");
    else
        $("#loadingOnPageTable").remove()
}

function validDecimal(val) {
    val = val.replace("/", ".")
    let regex = /^\d+(\.\d{1,3})?$/
    return regex.test(val)
}

function isValidAccountNumber(input) {
    if (!isNaN(input.replaceAll("-", "")) && input.indexOf("--") == -1 && input.substr(0, 1) != "-" && input.substr(input.length - 1, input.length - 1) != "-")
        return true;
    else
        return false;
}

function isValidIranianNationalCode(input) {
 
        var digits = String(input).replace(/\D/g, '');

        // باید دقیقاً 13 رقم باشد
        if (!/^\d{13}$/.test(digits)) {
            return false;
        }

        // جدا کردن بخش‌ها روی نسخه‌ی بدون خط تیره
        var year = parseInt(digits.slice(0, 4), 10); // YYYY
        var month = parseInt(digits.slice(4, 6), 10); // دو رقم اول بعد از سال
        var rest = digits.slice(8);                  // پنج رقم آخر

        // اعتبارسنجی سال (بازه‌ی تقریبی، به دلخواه خودت تنظیم کن)
        if (year < 1390 || year > 1500) {
            return false;
        }

        // ماه باید بین 1 تا 12 باشد
        if (month < 1 || month > 12) {
            return false;
        }

        // پنج رقم آخر عددی (در عمل همین الان هست، ولی برای خوانایی)
        if (!/^\d{5}$/.test(rest)) {
            return false;
        }

        return true;
    }


function isValidIranianCompNationalCode(input) {
    var allDigitEqual =
        [
            "0000000000", "1111111111", "2222222222", "3333333333", "4444444444",
            "5555555555", "6666666666", "7777777777", "8888888888", "9999999999"
        ];

    var definition =
        [
            29, 27, 23, 19, 17, 29, 27, 23, 19, 17
        ];

    if (allDigitEqual.includes(input))
        return false;

    if (!/^\d{11}$/.test(input))
        return false;

    var check = parseInt(input[10]);
    var sum = 0;
    var d = parseInt(input[10]) + 2
    var i;
    for (i = 0; i < 10; ++i) {
        sum += (d + parseInt(input[i])) * definition[i];
    }
    sum %= 11;

    return (sum < 2 && check == sum) || (sum >= 2 && check + sum == 11);
}

function isValidMobileNo(input) {
    var regex = /^(?:\+93|0093|0)7[01278]\d{7}$/;
    return regex.test(input);
}





function isValidShebaNo(input) {
    var allDigitEqual =
        [
            "000000000000000000000000", "111111111111111111111111", "222222222222222222222222", "333333333333333333333333", "444444444444444444444444",
            "555555555555555555555555", "666666666666666666666666", "777777777777777777777777", "888888888888888888888888", "999999999999999999999999"
        ];
    if (allDigitEqual.includes(input.replaceAll("-", "").replaceAll("IR", "")))
        return false;
    var regex = /^(?:IR)(?=.{24}$)[0-9]*$/;
    return regex.test(input.replaceAll("-", ""));
}

function isValidAccountNo(input) {
    var regex = /^(\d+-?)+\d+$/;
    return regex.test(input);
}

function isValidcardNo(input) {
    var allDigitEqual =
        [
            "0000000000000000", "1111111111111111", "2222222222222222", "3333333333333333", "4444444444444444",
            "5555555555555555", "6666666666666666", "7777777777777777", "8888888888888888", "9999999999999999"
        ];

    if (allDigitEqual.includes(input.replaceAll("-", "")))
        return false;

    var regex = /(?=.{16}$)[0-9]*$/;
    return regex.test(input.replaceAll("-", ""));
}

function isValidPostalCode(input) {
    var regex = /\b(?!(\d)\1{3})[13-9]{4}[1346-9][013-9]{5}\b/;
    return regex.test(input);
}

function isValidPhoneNo(input) {
    var regex = /^0\d{2,3}\d{5,8}$/;
    return regex.test(input);
}

function isValidEmail(input) {
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(input).toLowerCase());
}

function isValidShamsiDate(input) {

    var regex = /^(\d{4})\/(0?[1-9]|1[012])\/(0?[1-9]|[12][0-9]|3[01])$/;
    var resultValid = regex.test(input);

    if (resultValid) {
        var dateArray = input.split('/');
        var month = dateArray[1];
        var year = dateArray[0];
        let lastDay = getMonthDaysCount(year, month)

        var day = dateArray[2];

        if (day > lastDay)
            return false
    }

    return resultValid;

}

function isValidShamsiDateWithTime(input) {
    var regex = /^[1-4]\d{3}\/((0[1-6]\/((3[0-1])|([1-2][0-9])|(0[1-9])))|((1[0-2]|(0[7-9]))\/(30|31|([1-2][0-9])|(0[1-9]))))(\s{1,4})?(([0-1][0-9]|[2][0-3]):([0-5][0-9]))?$/;
    return regex.test(input);
}

function isValidIpv4(input) {
    var regex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
    return regex.test(input);
}

function isValidPercentage(input) {
    var rgx = /(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,3})?$)/;
    return rgx.test(input);
}

function isValidEnglishCode(input) {
    var rgx = /^[a-zA-Z][a-zA-Z\d]*$/;
    return rgx.test(input);
}

function isValidTime(input) {
    var rgx = /^([0-1][0-9]|[2][0-3]):([0-5][0-9])$/;
    return rgx.test(input);
}

function compareShamsiDate(miladi1, miladi2) {
    var mdate1 = +miladi1.replace(/\//g, "");
    var mdate2 = +miladi2.replace(/\//g, "");

    if (mdate1 > mdate2)
        return false;
    else
        return true;
    //return mdate1 < mdate2
}

function compareShamsiDateYear(miladi1, miladi2) {

    var mdate1 = miladi1.replace(/\//g, "").substr(0, 4);
    var mdate2 = miladi2.replace(/\//g, "").substr(0, 4);
    if (mdate1 != mdate2)
        return false;
    else
        return true;

    //return mdate1 < mdate2
}
function chekdoubledate(miladi1, miladi2) {
    var mdate1 = miladi1.replace(/\//g, "");
    var mdate2 = miladi2.replace(/\//g, "");
    if (mdate1 != mdate2)
        return false;
    else
        return true;

}
function dateisonemonth(miladi1, miladi2) {
    var mdate1 = miladi1.replace(/\//g, "").substr(0, 6);
    var mdate2 = miladi2.replace(/\//g, "").substr(0, 6);
    if (mdate1 != mdate2)
        return false;
    else
        return true;

}

function checkcurrentdate(miladi1, selectYear, currentYear) {

    var miladi2 = selectYear > currentYear ? moment().format(`${selectYear}/01/01`) : moment().format('jYYYY/jMM/jDD');
    var mdate1 = miladi1.replace(/\//g, "").substr(0, 8);
    var mdate2 = miladi2.replace(/\//g, "").substr(0, 8);
    if (mdate1 < mdate2)
        return false;
    else
        return true;

}
function checkcurrentyear(miladi1, miladi2) {

    var mdate1 = miladi1.replace(/\//g, "").substr(0, 4);

    if (mdate1 != miladi2)
        return false;
    else
        return true;

}



function getMonthDaysCount(year, month) {

    var getHalf = gethalfYear(month, year);

    if (getHalf === 1)
        return 31
    else if (getHalf === 2)
        return 30
    else
        return 29;

}

function gethalfYear(month, year) {
    var half1 = ["01", "02", "03", "04", "05", "06"];
    var half2 = ["07", "08", "09", "10", "11"];

    if (half1.findIndex(x => x === month) > -1)
        return 1
    else if (half2.findIndex(x => x === month) > -1)
        return 2
    else {
        if (checkIsLeapYear(year) != -1)
            return 2;
        else
            return 3;
    }
}

function checkIsLeapYear(year) {
    var leapYears = [
        4, 37, 66, 99, 132, 165, 198, 231, 264, 297, 326
        , 359, 392, 425, 458, 491, 524, 553, 586, 619, 656, 685, 718, 751, 784, 817
        , 850, 883, 916, 949, 978, 1011, 1044, 1077, 1110, 1143, 1176, 1209, 1238
        , 1275, 1308, 1343, 1370, 1401, 1403, 1408, 1412, 1416, 1420, 1424, 1428, 1432, 1436, 1440, 1473, 1502
    ];

    return leapYears.findIndex(x => x == year)
}

function detect_Mobile() {
    var check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

function detect_MobileAndTablet() {
    var check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

function controller_check_authorize(controllerName, oprType, withAlert = true) {
    var p_url = "/api/LoginApi/checkauthorize"
    var check = false;

    $.ajax({
        url: p_url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        async: false,
        cache: false,
        data: JSON.stringify({ controllername: controllerName, oprtype: oprType }),
        success: function (result) {

            if (result.statusMessage == "LoginExpired") {
                var msg = alertify.error(msg_loginexp_error);
                msg.delay(alertify_delay);
                setTimeout(() => {
                    window.location.pathname = "/";
                }, 500);
            }
            else {
                if (!result.successfull) {
                    if (oprType == "VIWALL") {
                        withAlert = false;
                        check = false;
                    }
                    if (withAlert) {
                        var msg = alertify.error(msg_access_error);
                        msg.delay(alertify_delay);
                    }
                }
                else
                    check = true;
            }
        },
        error: function (xhr) {
            error_handler(xhr, p_url)
        }
    });
    return check;
}

var fetchManager = (url, option, tValue = null, didTimeOut = false) => new Promise(function (resolve, reject) {
    let timeout = null;
    if (+tValue > 0)
        timeout = setTimeout(() => { didTimeOut = true; reject(); }, tValue);
    fetch(url, option).then(r => {
        if (+tValue > 0)
            clearTimeout(timeout);
        if (!didTimeOut)
            resolve(r);
    });
})
    .then(respond => respondHandler(respond))
    .then(result => result)
    .catch(() => null);

function respondHandler(respond) {
    let content = respond.headers.get('Content-Type');
    if (content == null)
        return respond.text();

    if (respond.status !== 200)
        error_handler_fetch(respond, respond.url);

    return respond.json();
}

function error_handler_fetch(respond, url) {

    if (respond.status == 500) {
        var msg_error = msg_system_error;

        alertify.alert('خطای سرور', msg_error);
    }
    else if (respond.status == 401) {
        alertify.alert('خطای دسترسی', msg_loginexp_error);
        window.location.pathname = "/";
    }
    else if (respond.status == 403) {
        alertify.alert('خطای دسترسی', msg_access_error);
    }
    else {
        alertify.alert('خطای کنسول', msg_java_error);
        console.log(respond.status + ' ' + respond.statusText + ' ' + url);
    }
}

function error_handler(xhr, url) {

    if (xhr.status == 500) {

        var msg_error = msg_system_error;

        if (xhr.responseText != "")
            msg_error = xhr.responseText;

        alertify.alert('خطای سرور', msg_error);
    }
    else if (xhr.status == 401) {
        alertify.alert('خطای دسترسی', msg_loginexp_error);
        window.location.pathname = "/";
    }
    else if (xhr.status == 403) {
        alertify.alert('خطای دسترسی', msg_access_error);
    }
    else {
        alertify.alert('خطای کنسول', msg_java_error);
        console.log(xhr.status + ' ' + xhr.responseText + ' ' + url);
    }
}

function fill_companyinfo(item) {
    if (item == null) return "";
    $("#corpname").html("");
    var str = "";


    if (item.logo != null)
        str += '<img src="data:image/png;base64, ' + item.logo + '" alt="" height="50">'
    str += '<label class="logo-admin">' + item.name + '</label>'
    $("#corpname").append(str);
}

function checkCookie() {
    if (!navigator.cookieEnabled)
        alertify.alert('خطای کوکی', msg_cookie_disable);
}
checkCookie();

function quote(text) {
    return '"' + text.replace('"', '""') + '"';
}

function generateCsv(data) {

    var csv = "\ufeff";
    csv += data.columns + "\r\n";
    var rows = data.rows;
    rows.forEach(function (currentRow) {
        for (var item in currentRow) {
            var value = currentRow[item] != null ? currentRow[item].toString() : "";
            value = value.replace(/"/g, "");
            csv += quote(value) + ",";
        }
        csv += "\r\n";
    });

    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', `${viewData_form_title.trim()}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function generateTxtFile(data, fileName) {
    var element = document.createElement('a');

    element.setAttribute('href', 'data:text/octet-stream;base64,' + btoa(unescape(encodeURIComponent(data))));
    element.setAttribute('download', `${fileName.trim()}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function checkNotExistValueInArray(arr, param, value) {

    if (arr.length === 0) return true;

    var item = "";

    for (var i = 0, len = arr.length; i < len; i++) {
        item = arr[i];

        if (item[param] === value) {
            return false;
            break;
        }
    }

    return true;
}

function checkNotExistValueInArrayUpd(arr, param, value, index) {

    if (arr.length === 0) return true;

    var item = "";

    for (var i = 0, len = arr.length; i < len; i++) {
        item = arr[i];

        if (item[param] === value && i !== index) {
            return false;
            break;
        }
    }

    return true;
}

function checkExistValueInArray(arr, value) {
    if (arrayHasValue(arr))
        return arr.some(e => e === value);
    else
        return false;
}

var arrayHasValue = (arr) => arr != undefined && arr != null && arr.length !== 0;

function removeRowFromArray(arr, param, value) {

    var statusMessage = "failed";

    if (arr.length === 0) return { value: arr, status: 100, statusMessage: statusMessage };

    var item = null;

    for (var i = 0, len = arr.length; i < len; i++) {
        item = arr[i];
        if (item[param] === value) {
            arr.splice(i, 1);
            statusMessage = "removed";
            break;
        }
    }

    return { value: arr, status: 100, statusMessage: statusMessage };
}

function removeChildwithParentIdArray(arr, param, value) {
    if (arr.length === 0) return { value: arr, status: 100, statusMessage: "failed" };
    var arrFinal = [];

    var item = null,
        len = arr.length;

    for (var i = 0; i < len; i++) {
        item = arr[i];
        if (item[param] !== value) {
            arrFinal.push(item);
        }
    }

    //for (var j = 0; j < arrFinal.length; j++) {
    //    var currentRow = arrFinal[j];

    //    if (arrFinal[j]) {

    //    }

    //    arr.splice(currentRow.idx, 1);
    //}

    return { value: arrFinal, status: 100, statusMessage: "removed" };
}

function toNumber(value) {
    var num = Number(removeSep(value));
    return num !== NaN ? num : 0;
}

function removeSep(value) {

    if (value === undefined)
        return "";

    return value !== "" ? value.replace(/(\d+),(?=\d{3}(\D|$))/g, "$1") : "";
}

// mid between from and to
function isBetween(from, mid, to) {
    return (mid - from) * (mid - to) <= 0
}

function zeroPad(r, zeroPad) {
    var str = "" + r;
    var pad = zeroPad;
    var ans = pad.substring(0, pad.length - str.length) + str;
    return ans;
}

function compareTimeElm(time1, time2) {

    if (!time1 || !time2) {
        return true
    }



    var startTime = new Date().setHours(getHours(time1), getMinutes(time1), 0);
    var endTime = new Date().setHours(getHours(time2), getMinutes(time2), 0);


    if ((startTime < '00:00') && (endTime > '23:59'))
        return false;

    if (startTime > endTime)
        return false;


    return true;

    function getHours(d) {

        var h = parseInt(d.split(':')[0]);
        if (d.split(':')[1].split(' ')[1] == "PM") {
            h = h + 12;
        }
        return h;
    }
    function getMinutes(d) {
        return parseInt(d.split(':')[1].split(' ')[0]);
    }

}

function diffMinutes(time1, time2) {

    var startTime = new Date().setHours(getHours(time1), getMinutes(time1), 0);
    var endTime = new Date().setHours(getHours(time2), getMinutes(time2), 0);


    var diff = (startTime - endTime) / 1000;
    diff /= 60;
    var diffMin = Math.abs(Math.round(diff));

    return diffMin > 15;

    function getHours(d) {
        var h = parseInt(d.split(':')[0]);
        if (d.split(':')[1].split(' ')[1] == "PM") {
            h = h + 12;
        }
        return h;
    }
    function getMinutes(d) {

        return parseInt(d.split(':')[1].split(' ')[0]);
    }
}

function compareTimeWithOpr(time1, time2, operation) {

    // l - le - e - g - ge
    if (!time1 || !time2) {
        return true
    }


    var startTime = new Date().setHours(getHours(time1), getMinutes(time1), 0);
    var endTime = new Date().setHours(getHours(time2), getMinutes(time2), 0);

    if (operation === "l") {
        if (startTime < endTime)
            return true
        return false;
    }
    else if (operation === "le") {
        if (startTime <= endTime)
            return true;
        return false;
    }
    else if (operation === "e") {
        if (startTime === endTime)
            return true;
        return false;
    }
    else if (operation === "g") {
        if (startTime > endTime)
            return true;
        return false;
    }
    else if (operation === "ge") {
        if (startTime >= endTime)
            return true;
        return false;
    }

    function getHours(d) {
        if (typeof d != "undefined") {
            var h = parseInt(d.split(':')[0]);
            if (d.split(':')[1].split(' ')[1] == "PM") {
                h = h + 12;
            }
            return h;
        }
    }
    function getMinutes(d) {
        if (typeof d != "undefined")
            return parseInt(d.split(':')[1].split(' ')[0]);
    }
}

function modalIsOpen(modalName) {
    return $(`#${modalName}`).hasClass('show');
}

function generateErrorString(errors) {

    if (errors !== null && errors.length > 0) {

        var len = errors.length;

        if (len == 1)
            return errors[0];

        var msg = "";
        for (var i = 0; i < len; i++) {
            msg += errors[i] + "<br>"
        }
        return msg;
    }
    else
        return "";
}

function generateErrorStringWithHeader(errors, header = null) {

    if (errors !== null && errors.length > 0) {

        let len = errors.length;
        let msg = "";

        if (header !== null)
            msg += header + "<br>";

        if (len == 1) {
            msg += errors[0];
            return msg;
        }

        for (var i = 0; i < len; i++) {
            if (errors[i] !== "")
                msg += errors[i] + "<br>";
        }
        return msg;
    }
    else
        return "";
}

function generateErrorStringTamin(errors, id = 0, isRowTable = false) {

    if (errors !== null && errors.length > 0) {

        let message = "", valueProblems = {},
            messageCode = "", messageDescription = "", messageProblemType = "",
            messageSection = "", messageTechnicalInfo = "", messageNewLine = "", messageFainal = "";
        let errorsDistinced = _.uniqBy(errors, (res) => `${res.code}${res.problemType}${res.technicalInfo}`);
        let len = errorsDistinced.length;
        for (var i = 0; i < len; i++) {

            valueProblems = errorsDistinced[i];

            messageCode = valueProblems.code == "" ? "" : valueProblems.code == null ? "" : " | " + valueProblems.code;
            messageDescription = valueProblems.description == "" ? "" : valueProblems.description == null ? "" : " | " + valueProblems.description;
            messageProblemType = typeof taminError.ProblemTypes[valueProblems.problemType] == "undefined" ? "" : " | " + taminError.ProblemTypes[valueProblems.problemType];
            messageSection = typeof taminError.SoftwareParts[valueProblems.section] == "undefined" ? "" : " | " + taminError.SoftwareParts[valueProblems.section];
            messageTechnicalInfo = valueProblems.technicalInfo == "" ? "" : valueProblems.technicalInfo == null ? "" : " | " + valueProblems.technicalInfo;
            messageNewLine = i + 1 == len ? "" : "<br>";
            messageFainal = messageCode + messageDescription + messageProblemType + messageSection + messageTechnicalInfo + messageNewLine;

            if (!isRowTable)
                if (id !== 0)
                    message += `${id} : ${messageFainal}`;
                else
                    message += `${messageFainal}`;
            else
                if (id !== 0)
                    message += `<tr><td>${id}</td><td>${messageFainal}</td></tr>`;
                else
                    message += `<tr><td>${messageFainal}</td></tr>`;
        }
        return message;
    }
    else
        return "";
}

function generateErrorValidation(errors) {

    let msg = generateErrorString(errors);

    if (msg !== "") {
        var err = alertify.warning(msg);
        err.delay(alertify_delay);
        return;
    }

}

function getTodayPersianDate() {
    var url = `/api/GNApi/todaypersiandate`;

    var output = $.ajax({
        url: url,
        type: "get",
        dataType: "text",
        async: false,
        cache: false,
        success: function (result) {


            return result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return "";
        }
    });

    return output.responseText;
}

function getLastDayOfYear() {
    var url = `${viewData_baseUrl_PB}/PublicApi/getlastdayyear`;

    var output = $.ajax({
        url: url,
        type: "POST",
        dataType: "text",
        async: false,
        cache: false,
        success: function (result) {

            return result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return "";
        }
    });

    return output.responseText;
}


function getLastDayOfCurrentMonth(month) {

    var url = `${viewData_baseUrl_PB}/PublicApi/getlastdayofcurrentmonth`;
    var output = $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(month),
        async: false,
        cache: false,
        success: function (result) {

            return result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return "";
        }
    });
    return output.responseText;
}



function getDefaultCurrency() {
    var url = "/api/CompanyApi/getdefaultcurrency";

    var result = $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: {},
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return 0;
        }
    });

    return result.responseJSON;
}

function convertToMiladiDate(persianDate) {

    var url = `${viewData_baseUrl_PB}/PublicApi/getmiladidate`;

    var result = $.ajax({
        url: url,
        type: "POST",
        dataType: "text",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(persianDate),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return null;
        }
    });

    return result.responseText;
}

function convertToMiladiDateTime(date, time, isFrom) {

    let model = { date, time, isFrom }

    var url = `${viewData_baseUrl_PB}/PublicApi/getmiladidatetime`;

    var result = $.ajax({
        url: url,
        type: "POST",
        dataType: "text",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(model),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return null;
        }
    });

    return result.responseText;
}

var shamsiToMiladi = function (sh_date) {

    if (!isValidShamsiDate(sh_date))
        return null;

    let g_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        j_days_in_month = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29]

    dateSplitted = myDate.split("/");
    var j_y = parseInt(dateSplitted[0]),
        j_m = parseInt(dateSplitted[1]),
        j_d = parseInt(dateSplitted[2]),
        jy = j_y - 979,
        jm = j_m - 1,
        jd = j_d - 1;

    var j_day_no = 365 * jy + parseInt(jy / 33) * 8 + parseInt((jy % 33 + 3) / 4);
    for (var i = 0; i < jm; ++i) j_day_no += j_days_in_month[i];

    j_day_no += jd;

    var g_day_no = j_day_no + 79;

    var gy = 1600 + 400 * parseInt(g_day_no / 146097); /* 146097 = 365*400 + 400/4 - 400/100 + 400/400 */
    g_day_no = g_day_no % 146097;

    var leap = true;
    if (g_day_no >= 36525) /* 36525 = 365*100 + 100/4 */ {
        g_day_no--;
        gy += 100 * parseInt(g_day_no / 36524); /* 36524 = 365*100 + 100/4 - 100/100 */
        g_day_no = g_day_no % 36524;

        if (g_day_no >= 365) g_day_no++;
        else leap = false;
    }

    gy += 4 * parseInt(g_day_no / 1461); /* 1461 = 365*4 + 4/4 */
    g_day_no %= 1461;

    if (g_day_no >= 366) {
        leap = false;

        g_day_no--;
        gy += parseInt(g_day_no / 365);
        g_day_no = g_day_no % 365;
    }

    for (var i = 0; g_day_no >= JalaliDate.g_days_in_month[i] + (i == 1 && leap); i++)
        g_day_no -= g_days_in_month[i] + (i == 1 && leap);
    var gm = i + 1;
    var gd = g_day_no + 1;

    gm = gm < 10 ? "0" + gm : gm;
    gd = gd < 10 ? "0" + gd : gd;

    return [gy, gm, gd];
}

function momentShamsitoMiladi(date) {
    if (!isValidShamsiDate(date))
        return "";

    return moment.from(date, 'fa', 'YYYY/MM/DD').format("YYYY/MM/DD");
}

function getUserId() {


    var url = `${viewData_baseUrl_PB}/PublicApi/getuserId`;

    var result = $.ajax({
        url: url,
        type: "get",
        dataType: "text",
        contentType: "application/json",
        async: false,
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return null;
        }
    });

    return result.responseText;
}

function markMatch(text, term, itemOption, setColorCondition, setColor) {
    // Find where the match is
    var match = text.toUpperCase().indexOf(term.toUpperCase());

    var $result = ""

    if (setColorCondition === "/") {

        let checkByCondition = text.split("/").length == 1

        if (text != "انتخاب کنید")
            if (checkByCondition)
                $result = $(`<span ${setColor !== "" ? `class="${setColor}"` : ""}></span>`);
            else
                $result = $('<span></span>')
        else
            $result = $('<span></span>')

    }
    else
        $result = $('<span></span>')


    // If there is no match, move on
    if (match < 0) {
        return $result.text(text);
    }

    // Put in whatever text is before the match
    $result.text(text.substring(0, match));

    // Mark the match
    var $match = $('<span class="select2-rendered__match"></span>');
    $match.text(text.substring(match, match + term.length));

    // Append the matching text
    $result.append($match);

    // Put in whatever is after the match
    $result.append(text.substring(match + term.length));

    return $result;
}

function fill_dropdown(p_url, itemid, itemname, elementid, idandtitle = false, param = 0) {
    p_url = param == 0 ? p_url : `${p_url}/${param}`;
    $.ajax({
        url: p_url,
        type: "get",
        async: false,
        success: function (result) {
            if (result) {
                var list = result;
                var str = "";
                for (var i = 0; i < list.length; i++) {
                    var item = list[i];
                    var text = idandtitle ? `${item[itemid]} - ${item[itemname]}` : `${item[itemname]}`;

                    if (i !== 0)
                        str += `<option value="${item[itemid]}">${text}</option>`;
                    else
                        str += `<option value="${item[itemid]}" selected>${text}</option>`;
                }
                $("#" + elementid).append(str);
            }
        },
        error: function (xhr) {
            error_handler(xhr, p_url)
        }
    })
}

var counter = 0;
function fill_select2(p_url, elementid, idandtitle = false, param = 0, isAjax = false, p_minimumInputLength = 3, placeholder = " انتخاب ",
    callback = undefined, addUrl = "", initial = false, isNotMultipel = true, selectabel = false, async = false, setDefault = true, setColorCondition = "", setColor = "") {
    p_url = param == 0 ? p_url : `${p_url}/${param}`;
    var query = {}, arrayIds = [];

    if (initial)
        $(`#${elementid}`).empty();

    if (isAjax)
        $(`#${elementid}`).select2({
            placeholder: placeholder,
            templateResult: function (item) {
                if (item.loading) {
                    return item.text;
                }
                var term = query.term || '';
                var $result = markMatch(item.text, term, item.option, setColorCondition, setColor);
                return $result;
            },
            language: {
                searching: function (params) {
                    query = params;
                    return 'در حال جستجو...';
                }
            },
            minimumInputLength: p_minimumInputLength,
            closeOnSelect: true,
            selectOnClose: true,
            allowClear: isNotMultipel,
            ajax: {
                delay: 500,
                url: p_url,
                async: false,
                type: "get",
                quietMillis: select2_delay,
                processResults: function (data) {
                    return {
                        results: $.map(data, function (item) {

                            arrayIds.push(item.id);
                            return {
                                text: idandtitle ? `${item.id} - ${item.name}` : `${item.name}`,
                                id: item.id,
                                option: item
                            }
                        })
                    };

                    if ((callback !== void 0) && (typeof callback === "function"))
                        callback();
                }
            }
        });
    else {
        $.ajax({
            url: p_url,
            async: async,
            type: "get",
            success: function (result) {
                if (result) {
                    var data = result.map(function (item) {
                        arrayIds.push(item.id);
                        return {
                            id: item.id,
                            text: idandtitle ? `${item.id} - ${item.name}` : `${item.name}`,
                            option: item
                        };
                    });
                    $(`#${elementid}`).select2({
                        templateResult: function (item) {
                            if (item.loading) {
                                return item.text;
                            }
                            var term = query.term || '';

                            var $result = markMatch(item.text, term, item.option, setColorCondition, setColor);
                            return $result;
                        },
                        language: {
                            searching: function (params) {
                                query = params;
                                return 'در حال جستجو...';
                            }
                        },
                        placeholder: placeholder,
                        data: data,
                        closeOnSelect: true,
                        selectOnClose: true,
                        allowClear: isNotMultipel,
                        escapeMarkup: function (markup) {
                            return markup;
                        }
                    });

                    if (setDefault) {
                        $(`#${elementid}`).val(0).trigger('change.select2');

                    }
                }
            },
            error: function (xhr) {
                if (callback != undefined)
                    callback();
                error_handler(xhr, p_url);
            }
        });
    }

    if (!isNotMultipel) {
        $(`#${elementid}`).parent().find(".btn-multipel-more").remove();
        $(`#${elementid}`).on("change", function () { onchangeMultipel(this) });
        $(`#${elementid}`).parent().addClass("multiple-maxheight").removeClass("multiple-maxheight-md");
    }

    if (selectabel) {
        fillselect2MultiPle(elementid, arrayIds, ++counter, setColorCondition, setColor);
        if (arrayIds.length !== 0)
            $(`#${elementid}`).prepend("<optgroup></optgroup>");

    }

    if (addUrl !== "") {
        setTimeout(function () {
            $(`#${elementid}`).attr("qa-addurl", addUrl);
        }, 100);
    }

    if (callback != undefined)
        callback();

}

function onchangeMultipel(elm) {

    if (elm.value === "")
        $(`#more_${elm.id}`).addClass('d-none');
    else
        $(`#more_${elm.id}`).removeClass('d-none');

}

function fillselect2MultiPle(elementid, arrayIds, headerValue, setColorCondition, setColor) {

    const arrayAll = arrayIds, arrayAllLength = arrayIds.length;
    var query = {};

    function formatResult(state) {

        if (typeof state.element !== "undefined") {

            if (state.element.localName == "optgroup") {

                var btn = $(`<div class="text-right"><button id="all_${elementid}" onclick="allSelect('${elementid}',event)" style="margin-left: 1em;" class="btn-secondary btn-multipel-checkbox">انتخاب همه</button><button id="clear_${elementid}" class="btn-secondary btn-multipel-checkbox">حذف همه</button></div>`);
                return btn;
            }
            else {
                var term = query.term || "";
                var checkBoxId = `state${elementid}_${state.id}`;
                var $result = $(markMatch(state.text, term, null, setColorCondition, setColor)).html();
                var checkbox = $(`<div class="checkbox"><input id="${checkBoxId}" type="checkbox" ${state.element.selected ? 'checked' : ''} onclick="clickCheckBox('${checkBoxId}','${state.element.id}')"><span for="checkbox1"> ${$result}</span></div>`, { id: checkBoxId });
                return checkbox;
            }
        }
    }

    let optionSelect2 = {
        templateResult: formatResult,
        language: { searching: function (params) { query = params; return 'در حال جستجو...'; } },
        closeOnSelect: false,
        width: '100%'
    };
    let $select2 = $(`#${elementid}`).select2(optionSelect2);

    $select2.on("select2:select", function (event) {

        var value = $(this).val(), valLen = $(this).val().length;
        for (var i = 0; i < valLen; i++)
            document.getElementById(`state${elementid}_${value[i]}`).checked = true;

        $(this).next().find(".select2-search__field").val("");
    });

    $select2.on("select2:unselect", function (event) {

        var branch = $(this).val() ? $(this).val() : [];
        $(`[id^=state${elementid}]`).prop("checked", false);
        var value = branch, valLen = branch.length;
        for (var i = 0; i < valLen; i++) {

            if (checkResponse(document.getElementById(`state${elementid}_${value[i]}`)))
                document.getElementById(`state${elementid}_${value[i]}`).checked = true;

        };
    })

    $(document).on("click", `#clear_${elementid}`, function () {

        $(`#${elementid}` + " > option").prop("selected", false);
        $(`#${elementid}`).trigger("change");
        $(".select2-results__option").attr("aria-selected", false);
        $(`[id^=state${elementid}]`).prop("checked", false);
        $(window).scroll();
    });
    var val;
    for (var i = 0; i < arrayAllLength; i++) {

        if (checkResponse(document.getElementById(`select2Opt_${elementid}_${arrayAll[i]}`)))
            document.getElementById(`select2Opt_${elementid}_${arrayAll[i]}`).remove()

        $(`#${elementid} option:eq(${i})`).attr("id", `select2Opt_${elementid}_${headerValue}_${arrayAll[i]}`, "");
    }

}

function allSelect(elementid, ev) {

    $(`#${elementid}` + "> option").prop("selected", true);
    $(`#${elementid}`).trigger("change");
    $(".select2-results__option").attr("aria-selected", true);
    $(`[id^=state${elementid}]`).click();
    $(window).scroll();
}

function clickCheckBox(elmCheckBoxId, optionId) {

    let elmCheckBox = document.getElementById(elmCheckBoxId)
    let selectedOption = document.getElementById(optionId).selected

    if (selectedOption) {

        if (elmCheckBox !== null) {
            elmCheckBox.checked = true;
        }
    }
    else {
        if (elmCheckBox !== null) {
            elmCheckBox.checked = false;
        }
    }

}

function QuickAccess(item) {
    let attributeUrl = $(item).siblings().attr("qa-addurl");
    let str = `<span onclick="addQuickAccess(${attributeUrl})" class="quick-access">+</span>`;
    $(".select2-results__option").append(str);
    $(".select2-dropdown").css("z-index", "1040");
}

function addQuickAccess(url) {
    $.ajax({
        url: url,
        success: function (result) {
            let modal = $(result).filter("#AddEditModal");
            let link = $(result).filter("script")[$(result).filter("script").length - 1];
            $("#addQuickAccessModal").html(modal);
            $("#content").append(link);
            modal_ready_for_add();
            modal_show(modal);
        }
    });
};

function formatSelect2(repo) {
    if (repo.loading) {
        return repo.text;
    }

    var $container = $(
        "<div class='select2-result-repository clearfix'>" +
        "<div class='select2-result-repository__title'></div>" +
        "<div class='select2-result-repository__id'></div>" +
        "</div>"
    );

    $container.find(".select2-result-repository__title").text(repo.text);
    $container.find(".select2-result-repository__description").text(repo.id);

    return $container;
}

function getSetupInfo() {
    let url = "/api/SetupApi/getsetupinfo";

    let output = $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        async: false,
        contentType: "application/json",
        success: function (result) {

            return result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return null;
        }
    });
    return output.responseJSON;
}

function formatSelect2Selection(repo) {
    return repo.id || repo.text;
}

function inputMask() {
    $(":input").inputmask();
}

function getJsonData(p_url, dataType, object) {
    var output = $.ajax({
        url: p_url,
        type: "post",
        dataType: dataType,
        contentType: "application/json",
        async: false,
        cache: false,
        data: JSON.stringify(object),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, p_url);
            return JSON.parse(null);
        }
    });

    return output;
}

function callApi(parameterAjaxModel) {

    if (parameterAjaxModel === null) return;

    var outputList = $.ajax({
        url: parameterAjaxModel.apiUrl,
        type: parameterAjaxModel.type,
        dataType: parameterAjaxModel.dataType,
        contentType: parameterAjaxModel.contentType,
        data: JSON.stringify(parameterAjaxModel.data),
        async: parameterAjaxModel.isAsync,
        cache: parameterAjaxModel.cache,
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, parameterAjaxModel.apiUrl);
            return JSON.parse(parameterAjaxModel.failValue);
        }
    });

    return outputList;
}

function plus(item) {
    if ($(item).nextAll(".slideToggle").hasClass("open")) {
        $(item).nextAll(".slideToggle").slideUp().removeClass("open");
        $(item).children(".fas").removeClass("fa-minus").addClass("fa-plus");
    }
    else {
        $(item).nextAll(".slideToggle").addClass("current");
        $(".slideToggle:not(.current)").slideUp().removeClass("open");
        $(".slideToggle:not(.current)").siblings(".btn").html("<i class='fas fa-plus'></i>");

        $(item).nextAll(".slideToggle").slideToggle().toggleClass("open");

        if ($(item).nextAll(".slideToggle").hasClass("open")) {
            $(item).children(".fas").removeClass("fa-plus").addClass("fa-minus");
            $(item).nextAll(".open").css("display", "block");
        }
        else
            $(item).children(".fas").removeClass("fa-minus").addClass("fa-plus");

        let firstInput = $(item).nextAll(".slideToggle").find("[tabindex]:not(:disabled)").first();

        firstInput.hasClass("select2") ? $(`#${firstInput.attr("id")}`).select2('focus') : firstInput.focus();

        $(item).nextAll(".slideToggle").removeClass("current");
    }
}

function ColumnResizeable(tableId) {

    var ColumnLength = $(`#${tableId} thead th`).length;
    for (var j = 0; j < ColumnLength; j++)
        $(`#${tableId} thead th:eq(${j + 1})`).attr("id", j + 1).append(`<div class="${j + 1}-sizer"></div>`);

    $($(`#${tableId} thead th`)).resizable({
        handles: "w",
        animateDuration: "fast",
        minWidth: 30
    });
};

function myTrim(x) {
    if (typeof x !== "undefined" && x !== null)
        return x.replace(/^\s+|\s+$/gm, '');
    else
        return "";
}

function focusInput(tabNo) {
    let firstInput = $(`.tabToggle${tabNo}`).find("[tabindex]:not(:disabled)").first();
    setTimeout(() => {

        if ($(firstInput).length > 0 && $(firstInput).hasClass("select2"))
            $(`#${firstInput.attr("id")}`).select2("focus");
        else
            firstInput.focus();
    }, 10);
};

function roundNumber(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

function validateSelect2(form) {
    if (typeof form.fields != "undefined") {
        var lenFields = form.fields.length;
        for (var i = 0; i < lenFields; i++) {

            var field = form.fields[i];

            var element = $(field)[0].$element;

            if ($(element).hasClass("select2") && $(element).hasClass("parsley-error")) {
                if ($(element).siblings(".select2-container").length > 0)
                    if ($(element).siblings(".select2-container")[0].children.length > 0)
                        if ($($(element).siblings(".select2-container")[0].children[0].children).length > 0)
                            $($(element).siblings(".select2-container")[0].children[0].children[0]).addClass("parsley-error");
            }
            else {
                if ($(element).siblings(".select2-container").length > 0)
                    if ($(element).siblings(".select2-container")[0].children.length > 0)
                        if ($($(element).siblings(".select2-container")[0].children[0].children).length > 0)
                            $($(element).siblings(".select2-container")[0].children[0].children[0]).removeClass("parsley-error");
            }
        }
    }
}

function loginApp(on) {

    var url = `${viewData_baseUrl_GN}/UserApi/${on ? "useronline" : "useroffline"}`;

    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: {},
        success: function (result) {
            return JSON.parse(result);
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return 0;
        }
    });
}

//function checkResponse(res) {
//    if (res != null && res !== undefined) {
//        if (Array.isArray(res))
//            return res.length > 0;
//        else if (typeof (res) === "string")
//            return true;
//        else if (typeof (res) === "number")
//            return !isNaN(res);
//        else
//            return true;
//    }

//    return false;
//}

var checkResponse = (res) => res !== null && res !== undefined;
var canSplit = (txt, seprator) => (txt || '').split(seprator).length > 1;

function getPing() {
    var getping = new Ping();

    let api = $("#inputPing").val();
    if (api) {
        $("#textPingUrl").text(`loading...`);
        $("#textPingMassage").text("");
        showPing(api);
    } else {
        $("#textPingMassage").text("enter domain or ip");
    }

    function showPing(api) {
        if (api) {
            let checkProtocol = api.startsWith('http://')

            if (checkProtocol === true) {
                let apiSlice = api.slice(7)
                getData(apiSlice);
            } else {
                getData(`http://${api}`);
            }
        }
    }

    function getData(api) {
        getping.ping(api)
            .then((data) => {
                $("#textPingUrl").text(`${api}`);
                $("#textPingMassage").text(`Successful ping:  ${data} `);
            })
            .catch((data) => {
                $("#textPingUrl").text(`${api}`);
                $("#textPingMassage").text(`Ping failed: ${data} `);
            });
    }
}

function getModuleListByNoSeriesIdUrl(noSeriesId, elmId) {
    var url = "";

    if (noSeriesId === 0) {
        return;
    }
    else if (noSeriesId === 102) {
        fill_select2(`${viewData_baseUrl_PU}/VendorApi/getdropdown`, elmId, true, 0);
    }
    else if (noSeriesId === 103) {
        fill_select2(`${viewData_baseUrl_SM}/CustomerApi/getdropdown`, elmId, true, 0);
    }
    else if (noSeriesId === 104) {
        fill_select2(`${viewData_baseUrl_HR}/EmployeeApi/getdropdown`, elmId, true, 0);
    }
    else if (noSeriesId === 105) {
        fill_select2(`${viewData_baseUrl_CR}/ContactApi/getdropdown`, elmId, true, 0);
    }
    else if (noSeriesId === 106) {
        fill_select2(`${viewData_baseUrl_FM}/ShareHolderApi/getdropdown`, elmId, true, 0);
    }
    else if (noSeriesId === 108) {
        fill_select2(`${viewData_baseUrl_FM}/BankAccountApi/getdropdown`, elmId, true, 0);
    }
    else if (noSeriesId === 109) {
        fill_select2(`${viewData_baseUrl_FM}/CostCenterApi/getdropdown`, elmId, true, "1");
    }
    else if (noSeriesId === 110) {
        fill_select2(`${viewData_baseUrl_WH}/WarehouseApi/getdropdown`, elmId, true, 0);
    }
    else if (noSeriesId === 201) {
        fill_select2(`${viewData_baseUrl_MC}/AttenderApi/getdropdown`, elmId, true, "1/");
    }
    else if (noSeriesId === 202) {
        fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getinsurerlistbytype`, elmId, true, "1,2");

    }
    else if (noSeriesId === 203) {
        fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getinsurerlistbytype`, elmId, true, "4");
    }
    else if (noSeriesId === 204) {
        fill_select2(`${viewData_baseUrl_MC}/PatientApi/getdropdown`, elmId, true, "1/", true);
    }
    else if (noSeriesId === 205) {
        fill_select2(`${viewData_baseUrl_GN}/BranchApi/getactivedropdown`, elmId, true, 0);
    }
    else if (noSeriesId === 206) {
        fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getinsurerlistbytype`, elmId, true, "2");
    }
    // insurer -discount
    else {
        fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getinsurerlistbytype`, elmId, true, "5");
    }

}

function compareTime(modelCompare) {

    let viewData_compare_date_url = `/api/SetupApi/comparetime`;

    var result = $.ajax({
        url: viewData_compare_date_url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(modelCompare),
        success: function (result) {
            return JSON.parse(result);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_has_insurer_url);
            return -2;
        }
    });

    return result.responseJSON;
}

//تبدیل عدد صحیح به اعشاری
function convertToParseFloat(value) {
    if (value === undefined)
        return "";
    return value !== "" ? parseFloat(value).toFixed(3) : 0.000;
}

String.prototype.countDecimals = function () {
    if (Math.floor(this.valueOf()) === this.valueOf())
        return 0;

    return (this.toString().split(".")[1] !== undefined && this.toString().split(".")[1].length) || 0;
}



//بدست آوردن تعداد اعشار ارز پیش فرض سیستم
function getRounding(id) {

    var url = `${viewData_baseUrl_GN}/CurrencyApi/getnumOfRud`;
    var result = $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(id),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return 0;
        }
    });
    return result.responseJSON;
}
//بدست آوردن قسمت اعشار عدد
function getIntegerAndDecimalNumber(num, numOfRud) {

    let int_part = Math.trunc(num);
    let float_part = Number((num - int_part).toFixed(numOfRud));
    return [int_part, float_part];

}

function apiLoader(showAndHide = false) {

    if (showAndHide)
        $(".apiLoader").removeClass("d-none")
    else
        $(".apiLoader").addClass("d-none")

}

//بدست آوردن RoleId براساس UserId
function getRoleId() {
    var url = `api/GNApi/getroleid`;
    var result = $.ajax({
        url: url,
        type: "Get",
        dataType: "json",
        contentType: "application/json",
        async: false,
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return 0;
        }
    });
    return result.responseJSON;
}

function getCurrentDateTime() {

    let currentdateTimeUrl = `/api/PB/PublicApi/getcurrentdatetime`

    let currentdateTime = $.ajax({
        url: currentdateTimeUrl,
        async: false,
        type: "get",
        success: function (result) {
            return result
        },
        error: function (xhr) {
            error_handler(xhr, currentdateTimeUrl);
            return null
        }
    });

    if (currentdateTime != null) {
        let newCurrentdateTime = currentdateTime.responseText.split(" ")
        return { currentDate: newCurrentdateTime[0], currentTime: newCurrentdateTime[1], currentDateTime: currentdateTime.responseText }
    }
    else {
        return currentdateTime.responseText
    }

}
