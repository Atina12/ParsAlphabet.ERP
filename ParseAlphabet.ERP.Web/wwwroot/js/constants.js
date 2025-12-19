const serviceProviderFullTitle = "سیستم برنامه ریزی منابع سازمانی وبسلا";

const viewData_baseUrl_MC = "/api/MC";
const viewData_baseUrl_GN = "/api/GN";
const viewData_baseUrl_HR = "/api/HR";
const viewData_baseUrl_FM = "/api/FM";
const viewData_baseUrl_WH = "/api/WH";
const viewData_baseUrl_SM = "/api/SM";
const viewData_baseUrl_PU = "/api/PU";
const viewData_baseUrl_PB = "/api/PB";
const viewData_baseUrl_CR = "/api/CR";
const viewData_baseUrl_FA = "/api/FA";
const viewData_baseUrl_WF = "/api/WF";

const module_settingReport_src = "/Modules/_Report/_SettingReport.js";
const footerBodyPrintIfrem = "<script type='text/javascript'>window.print();</script>";

const alertify_delay = 5;
const select2_delay = 50;
const interval_Inbound = "00:30";
const spinner = $(`.spinner-border`);

const unlimitedOfflineNumber = 500;

var fillEmptyRow = (colCount) => {
    var result = `<tr id="emptyRow"><td colspan="${colCount}" style="text-align:center">${msg_nothing_found}</td></tr>`;
    return result;
}

const linerAlertify = (content, type, delay = alertify_delay) => {
    let Id = Math.round(Math.random() * 999999);
    let messageContent =
        `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
            <button type="button" id="alert_close_${Id}" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            ${content}
        </div>`;

    $(".alert-content").append(messageContent)
    setTimeout(() => $(`#alert_close_${Id}`).click(), delay * 1000);
};

const stimulsBaseUrl = {
    MC: { Rep: "/Stimuls/MC/Rep_", Prn: "/Stimuls/MC/Prn_" },
    GN: { Rep: "/Stimuls/GN/Rep_", Prn: "/Stimuls/GN/Prn_" },
    HR: { Rep: "/Stimuls/HR/Rep_", Prn: "/Stimuls/HR/Prn_" },
    FM: { Rep: "/Stimuls/FM/Rep_", Prn: "/Stimuls/FM/Prn_" },
    WH: { Rep: "/Stimuls/WH/Rep_", Prn: "/Stimuls/WH/Prn_" },
    SM: { Rep: "/Stimuls/SM/Rep_", Prn: "/Stimuls/SM/Prn_" },
    PU: { Rep: "/Stimuls/PU/Rep_", Prn: "/Stimuls/PU/Prn_" },
    PB: { Rep: "/Stimuls/PB/Rep_", Prn: "/Stimuls/PB/Prn_" },
    CR: { Rep: "/Stimuls/CR/Rep_", Prn: "/Stimuls/CR/Prn_" },
    FA: { Rep: "/Stimuls/FA/Rep_", Prn: "/Stimuls/FA/Prn_" },
    WF: { Rep: "/Stimuls/WF/Rep_", Prn: "/Stimuls/WF/Prn_" }
}
Object.freeze(stimulsBaseUrl);


const posBaseUrl = {
    behPardakht: { payment: `${viewData_baseUrl_FM}/PCPOS/Behpardakht/PcPosBehpardakhtApi/payment` },
}
Object.freeze(posBaseUrl);

const dbtype = {
    BigInt: 0,
    Binary: 1,
    dbtype_Bit: 2,
    dbtype_Char: 3,
    dbtype_DateTime: 4,
    dbtype_Decimal: 5,
    Float: 6,
    Image: 7,
    Int: 8,
    Money: 9,
    NChar: 10,
    NText: 11,
    NVarChar: 12,
    Real: 13,
    UniqueIdentifier: 14,
    SmallDateTime: 15,
    SmallInt: 16,
    SmallMoney: 17,
    Text: 18,
    Timestamp: 19,
    TinyInt: 20,
    VarBinary: 21,
    VarChar: 22,
    Variant: 23,
    Xml: 25,
    Udt: 29,
    Structured: 30,
    Date: 31,
    Time: 32,
    DateTime2: 33,
    DateTimeOffset: 34
}
Object.freeze(dbtype);

const KeyCode = {
    ArrowUp: 38,
    ArrowRight: 39,
    ArrowDown: 40,
    ArrowLeft: 37,
    Page_Up: 33,
    Page_Down: 34,
    Home: 36,
    End: 35,
    Delete: 46,
    Shift: 16,
    Insert: 45,
    Enter: 13,
    Esc: 27,
    Space: 32,
    Tab: 9,
    F1: 112,
    F2: 113,
    F3: 114,
    F4: 115,
    F5: 116,
    F6: 117,
    key_a: 65,
    key_c: 67,
    key_f: 70,
    key_l: 76,
    key_n: 78,
    key_p: 80,
    key_t: 84,
    key_s: 83,
    key_w: 87,
    key_f: 70,
    key_General_0: 48,
    key_General_1: 49,
    key_General_2: 50,
    key_General_3: 51,
    key_General_4: 52,
    comma: 188,
    dot: 110
}
Object.freeze(KeyCode);

const admFillItem = {
    basicInsurer: 1,
    basicInsuranceBox: 2,
    compInsurer: 3,
    thirdParty: 4,
    admissionState: 5,
    attender: 6,
    service: 7,
    serviceType: 8,
    serviceCenter: 9,
    speciality: 10
}
Object.freeze(admFillItem);

const datePart = {
    miliSecond: 1,
    second: 2,
    minute: 3,
    hour: 4,
    day: 5
}
Object.freeze(datePart);

const fileValidation = {
    validSize: 30, // kb
    ValidExt: "xls,xlsx,PNG,jpg,jpeg,bpm"
}
Object.freeze(fileValidation);


const sex = {
    "1": "مردانه",
    "2": "زنانه",
    "3": "بچگانه",
    "4": "پسرانه",
    "5": "دخترانه",
    "6": "مردانه/زنانه"
}
Object.freeze(sex);

const sex1 = {
    "مردانه": "1",
    "زنانه": "2",
    "بچگانه": "3",
    "پسرانه": "4",
    "دخترانه": "5",
    "مردانه/زنانه": "6"
}
Object.freeze(sex1);

const colExpConfig = {
    "1": "collapseAll",
    "2": "expandAll",
    "3": "collapseRoot",
}
Object.freeze(sex);

const maxValue = {
    "0": "32767",
    "8": "2147483647",
    "16": "9223372036854775807"
}
Object.freeze(maxValue);

const admissionStage = {

    admissionService: { id: 52, name: "پذیرش صحت" },
    admissionSaleItem: { id: 54, name: "سفارش کالا" },
    admissionTaminPrescription: { id: 64, name: "پذیرش نسخه نویسی تامین اجتماعی" },
    admissionTaminParaClinic: { id: 65, name: "پذیرش نسخه پیچی تصویربرداری تامین اجتماعی" },
    admissionTaminLaboratory: { id: 211, name: "پذیرش نسخه پیچی آزمایشگاه تامین اجتماعی" },

    admissionServiceMaster: {id: 219, name: "پذیرش نسخه نویسی و نسخه پیچی طرح درمان صحت" },
    admissionSaleItemMaster: {id: 222, name: "سفارش کالا طرح  درمان" },

    admissionCashRecieve: { id: 66, name: "دریافت وجه درمان" },
    admissionCashPayment: { id: 67, name: "پرداخت وجه درمان" },

    prescription: { id: 165, name: "نسخه نویسی صحت" },
    prescriptionTamin: { id: 166, name: "نسخه نویسی تامین اجتماعی" },
    admissionImaging: { id: 169, name: "نسخه پیچی تصویربرداری" },
    refer: { id: 69, name: "ارجاع" },
    feedback: { id: 70, name: "بازخورد" },
    dental: { id: 71, name: "دندانداکتری" },

    admissionMasterOutPatient: { id: 216, name: "پرونده مراجعه کننده سرپایی"},
    admissionMasterMedicalPlan: { id: 218, name: "پرونده مراجعه کننده طرح درمان"}
}
Object.freeze(admissionStage);

const workflowCategoryIds = {
    purchase: { id: 1, name: "خرید" },
    journal: { id: 2, name: "حسابداری" },
    sales: { id: 3, name: "فروش" },
    manufacturing: { id: 4, name: "تولید" },
    humanResource: { id: 5, name: "منابع انسانی" },
    treasury: { id: 6, name: "خزانه" },
    fixedAsset: { id: 7, name: "دارایی ثابت" },
    planning: { id: 8, name: "برنامه ریزی" },
    cRM: { id: 9, name: "مدیریت ارتباط با مشتری" },
    medicalCare: { id: 10, name: "درمان" },
    warehouse: { id: 11, name: "انبار" },
    medicalMaster: { id: 14, name: "طرح درمان" },
}
Object.freeze(workflowCategoryIds);

const medicalSubject = {
    inPersonTariff: { id: 1, name: "تعرفه حضوری" },
    isOnlineTariff: { id: 2, name: "تعرفه آنلاین" },
    inPersonIPDTariff: { id: 3, name: "تعرفه حضوری گردشگری" },
    IsOnlineIPDTariff: { id: 4, name: "تعرفه آنلاین گردشگری" }
}
Object.freeze(medicalSubject);

const dropDownCache =
{
    insurerLine: 1,
    attender: 2,
    compInsurerLine: 3,
    thirdParty: 4,
    discount: 5,
    compInsurerLineThirdParty: 6,
    attenderParaClinic: 7
}

const personTypeIds = {
    customer: { id: 1, name: "مشتری" },
    vendor: { id: 2, name: "تامین کننده" },
    employee: { id: 3, name: "پرسنل" },
    contact: { id: 4, name: "تماس" },
}
Object.freeze(personTypeIds);

const taminPrescriptionTypes = {
    drug: { id: 1, name: " دارویی" },
    lab: { id: 2, name: " آزمایشگاه" },
    radio: { id: 3, name: " رادیولوژی" },
    sono: { id: 4, name: " سونوگرافی" },
    ctScan: { id: 5, name: " سی تی اسکن" },
    mRI: { id: 6, name: " ام آر آی" },
    nuclear: { id: 7, name: " داکتری هسته ای" },
    physiotherapy: { id: 13, name: " فیزیوتراپی" },
    densitometry: { id: 14, name: " سنجش تراکم استخوان" },
    sideways: { id: 17, name: " خدمات جنبی" },
};
Object.freeze(taminPrescriptionTypes);

const admissionTypesArray = [
    {
        id: 1,
        name: "کالا",
        color: "#02c58d"
    },
    {
        id: 2,
        name: "خدمت / صحت",
        color: "#ff89ba"
    },
    {
        id: 3,
        name: "خدمت / تامین",
        color: "#89aaf3"
    }
];
Object.freeze(admissionTypesArray);

const reportCacheParameter = {

    admissionService: 10,
    admissionSale: 20,
    attenderCommission: 30,
    insurance: 40,
    prescription: 50,
    dental: 60,
    admissionUser: 70,
    admissionClose: 80,
    admissionCash: 90,
}

function extractHostname(url) {
    let hostname = "", hostnameWithPort = "", httpWithHostName = "", httpWithHostNameAndPort = "";
    httpWithHostName = httpWithHostNameAndPort = url.split("//")[0] + "//";

    if (url.indexOf("//") > -1)
        hostname = url.split('/')[2];
    else
        hostname = url.split('/')[0];

    hostnameWithPort = hostname;
    hostname = hostname.split(':')[0];
    hostname = hostname.split('?')[0];

    httpWithHostName += hostname;
    httpWithHostNameAndPort += hostnameWithPort;

    return {
        url, // https://www.site.com:1024/page1/12/13/type
        httpWithHostName, // https://www.site.com
        httpWithHostNameAndPort, // https://www.site.com:1024
        hostnameWithPort, // www.site.com:1024
        hostname // www.site.com
    };
}

const hostDataPart = extractHostname(window.location.href);


const admissionExtraProperty = {
    deleteTaminDateTime: 1,
    referredHID: 2,
    referralTypeId: 3,
    inqueryId: 4,
    hID: 5,
    hIDOnline: 6,
    updateHIDDateTime: 7,
    updateHIDResult: 8,
    referralID: 9,
    reasonForEncounterId: 10,
    requestEPrescriptionId: 11,
    registerPrescriptionId: 12,
    serviceTypeId: 13,
    paraClinicTypeCode: 14,
    provinceName: 15,
    paraclinicTypeCodeName: 16,
    patientNationalCode: 17,
    attenderName: 18,
    attenderMSC: 19,
    attenderSpeciality: 20,
    prescriptionDate: 21,
    comments: 22,
    patientMobile: 23,
    referReason: 24,
    serviceLaboratoryGroupId: 25,
    diagnosisCode: 26,
    diagnosisComment: 27,
    registerTaminResult: 28,
    deleteTaminResult: 29,
    responsibleNationalCode: 30,
    responsiblePersonId: 31,
    relationType: 32,
    covered: 33,
    recommendationMessage: 34,
    registerTaminDateTime: 35
}