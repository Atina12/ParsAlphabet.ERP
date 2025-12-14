const msg_row_created = "سطر جدید ایجاد شد .";
const msg_row_create_error = "ایجاد سطر جدید با خطا مواجه شد .";
const msg_row_edited = "تغییرات ثبت شد .";
const msg_row_edit_error = "ثبت تغییرات با خطا مواجه شد .";
const msg_row_deleted = "سطر حذف شد .";
const msg_row_delete_error = "حذف سطر با خطا مواجه شد .";
const msg_system_error = "شرح خطا به جدول لاگ ارسال شد .";
const msg_java_error = "شرح خطا در کنسول درج شد .";
const msg_sql_error = "خطا در ارتباط با بانک اطلاعاتی .";
const msg_access_error = "دسترسی به این قسمت برای کاربری شما امکان پذیر نمی باشد .";
const msg_loginexp_error = "زمان دسترسی شما به سیستم به اتمام رسیده است";
const msg_cookie_disable = "کوکی سیستم شما خاموش می باشد";
const msg_picturesize_limit_50 = "حجم تصویر نمی تواند بیشتر از ۵۰ کیلوبایت باشد .";
const msg_confirm_new_page = "آیا برای ایجاد برگه جدید اطمینان دارید؟";
const msg_confirm_edit = "آیا برای ثبت تغییرات اطمینان دارید؟";
const msg_confirm_row = "آیا برای ثبت تغییرات در سطر اطمینان دارید؟";
const msg_delete_row = "برای حذف این سطر اطمینان دارید ؟";
const msg_incorrect_percentage = "درصد وارد شده باید کوچکتر یا مساوی 100 باشد";
const msg_nothing_found = "سطری وجود ندارد";
const msg_error_file_type = "فرمت فایل صحیح نمیباشد";


const admission = {
    delay: 6, // second
    netPriceError: "قابل دریافت نمی تواند صفر می باشد",
    hasService: "خدمت مورد نظر قبلا ثبت شده",
    hasOpenAccType: "حساب باز قبلا ثبت شده",
    hasbankAccount: "حساب بانکی قبلا ثبت شده",
    notHasService: "خدمت را انتخاب نمایید",
    notHasQty: "تعداد را وارد نمایید",
    notHasService_Ret: "خدمت را جهت ثبت مرجوعی انتخاب نمایید",
    notHasAttender: "داکتر را انتخاب نمایید",
    fundTypeError: "نوع پرداخت را مشخص نمایید",
    payAmountError: "مبلغ نمی تواند صفر باشد",
    conflictAmountErrorAdm: "قابل دریافت با دریافتی مغایرت دارد ، مجاز به ثبت نمی باشید",
    conflictSumError_Ret: "قابل پرداخت با پرداختی مغایرت دارد ، مجاز به ثبت نمی باشید",
    sumCashOrServiceError_Ret: "قابل پرداخت نمی تواند کوچکتر از صفر باشد",
    select_attender: "داکتر و شیفت را انتخاب نمایید",
    setReserveInfo: "اطلاعات نوبت را وارد نمایید",
    insert_success: "پذیرش با موفقیت ثبت شد",
    insert_error: "ثبت پذیرش با خطا مواجه شد",
    insert_success_Ret: "مرجوعی با موفقیت ثبت شد",
    insert_error_Ret: "ثبت مرجوعی با خطا مواجه شد",
    notDefinedCashId: "شناسه صندوق پذیرش برای این پایانه مشخص نشده است",
    notValidResDate: "نوبت مورد نظر به اتمام رسیده",
    notAllowedOpenAcc: "صندوق جاری مجاز به ثبت حساب باز نمی باشد",
    defineAdmission: "نوبت را مشخص نمایید",
    notValidDiscountPrice: "مبلغ تخفیف نمی تواند بیشتر از سهم مراجعه کننده باشد",
    inOutAttOREmpNotValid: "امکان پرداخت به پرسنل و داکتر مجاز نمی باشد",
    inOutFromCardNotValid: "امکان پرداخت از محل کارت مجاز نمی باشد",
    notDefinedOpenAccType: "نوع حساب باز را مشخص نمایید",
    notDefinedEmployee: "پرسنل را انتخاب نمایید",
    insurExpDateNotValid: "تاریخ انقضاء دفترچه معتبر نمی باشد",
    priscriptionDateNotValid: "تاریخ نسخه معتبر نمی باشد",
    deActiveService: "وضعیت خدمت غیر فعال می باشد",
    notServiceType: "نوع خدمت مشخص نشده است",
    notCsvAdmissionClose: "سطری یافت نشد",
    reserve: {
        "msg-1": "زمانبدی حضور داکتر دارای اشکال می باشد",
        "msg-2": "زمان حضور داکتر به پایان رسیده است",
        "msg-3": "تعداد پذیرش تکمیل شده است . مایل به رزرو نوبت اضافه می باشید ؟",
        "msg-4": "تعداد پذیرش به انضمام نوبت اضافه تکمیل شده است"
    }

}

const prMsg = {
    delay: 6, //second
    notValidExpireDate: "تاریخ اعتبار معتبر نمی باشد",
    repeatCount: "تعداد تکرار نسخه را وارد نمایید",
    notHasItem: "هیچ نسخه ای ثبت نشده",
    insert_success: "نسخه با موفقیت ثبت شد",
    insert_error: "ثبت نسخه با خطا مواجه شد",
    pleaseFillSearchItem: "شناسه پذیرش یا مشخصات مراجعه کننده را وارد نمایید",
    selectDrugProductId: "لطفا دارو را مشخص نمایید",
    selectDrugNameId: "لطفا نام دارو را مشخص نمایید",
    existItem: "آیتم قبلا اضافه شده",
    selectService: "لطفا خدمت را مشخص نمایید",
    selectStatusIdDiagnosis: "لطفا وضعیت تشخیص را مشخص نمایید",
    selectAdmission: "لطفا پذیرش را مشخص نمایید",
    existService: "خدمت قبلا اضافه شده",
    existStatusIdDiagnosis: "وضعیت تشخیص قبلا اضافه شده",
    checkQtyMaxDrug: "تعداد از حداکثر تعداد نمیتواند بیشتر باشد",
    errorDrug: "ثبت نسخه دارو با خطا مواجه شد",
    errorImage: "ثبت تصویربرداری با خطا مواجه شد",
    errorLab: "ثبت آزمایش با خطا مواجه شد",
}

const admImgMsg = {
    delay: 6, //second
    insert_success: "جواب تصویر برداری با موفقیت ثبت شد",
}

const admissionItem = {
    notHasItem: "کالا را انتخاب نمایید",
    notHasItem_Ret: "کالا را جهت ثبت مرجوعی انتخاب نمایید",
}

const admissionSale = {
    delay: 5,
    netPriceError: "قابل دریافت نمی تواند صفر می باشد",
    hasItem: "کالا مورد نظر قبلا ثبت شده",
    notHasItem: "کالا را انتخاب نمایید",
    conflictAmountErrorAdm: "قابل دریافت با دریافتی مغایرت دارد ، مجاز به ثبت نمی باشید",
    insert_success: "سفارش جدید با موفقیت ثبت شد",
    insert_error: "ثبت سفارش با خطا مواجه شد",
    notDefinedCashId: "شناسه صندوق پذیرش برای این پایانه مشخص نشده است",
    notAllowedOpenAcc: "صندوق جاری مجاز به ثبت حساب باز نمی باشد",
    inOutAttOREmpNotValid: "امکان پرداخت به پرسنل و داکتر مجاز نمی باشد",
    inOutFromCardNotValid: "امکان پرداخت از محل کارت مجاز نمی باشد",
    notDefinedOpenAccType: "نوع حساب باز را مشخص نمایید",
    notDefinedEmployee: "پرسنل را انتخاب نمایید"
}

const cashStandMessage = {
    notPossiblePayment: "امکان پرداخت درخواست پذیرش میسر نمی باشد به غرفه پذیرش مراجعه کنید",
    min10000: "حداقل مبلغ 10,000 ریال می باشد",
    errorSystem: "خطای سیستمی به مدیر سیستم اطلاع دهید"
}