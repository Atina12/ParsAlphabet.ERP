using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace ParsAlphabet.ERP.Application.Enums;

public static class Enum
{
    public enum AccountNatureTypes : byte
    {
        [Display(Name = "بدهکار")] Debit = 1,
        [Display(Name = "بستانکار")] Credit = 2,
        [Display(Name = "هردو")] Both = 3
    }


    public enum ActionUnitCostCalculationType : byte
    {
        [Display(Name = "تایید نشده")] ActionNoConfirmed = 1,
        [Display(Name = "تایید شده")] ActionConfirmed = 2,

        [Display(Name = " محاسبه ریالی بهای تمام شده خرید")]
        ActionUpdatePurchasedPrice = 29,

        [Display(Name = " محاسبه ریالی رسید و حواله انبار")]
        ActionUpdateLinePrice = 30,
        [Display(Name = " سند حسابداری")] ActionJornul = 31
    }


    public enum AdmissionExtraProperty
    {
        DeleteTaminDateTime = 1,
        ReferredHID = 2,
        ReferralTypeId = 3,
        InqueryId = 4,
        HID = 5,
        HIDOnline = 6,
        UpdateHIDDateTime = 7,
        UpdateHIDResult = 8,
        ReferralID = 9,
        ReasonForEncounterId = 10,
        RequestEPrescriptionId = 11,
        RegisterPrescriptionId = 12,
        ServiceTypeId = 13,
        ParaClinicTypeCode = 14,
        ProvinceName = 15,
        ParaclinicTypeCodeName = 16,
        PatientNationalCode = 17,
        AttenderName = 18,
        AttenderMSC = 19,
        AttenderSpeciality = 20,
        PrescriptionDate = 21,
        Comments = 22,
        PatientMobile = 23,
        ReferReason = 24,
        ServiceLaboratoryGroupId = 25,
        DiagnosisCode = 26,
        DiagnosisComment = 27,
        RegisterTaminResult = 28,
        DeleteTaminResult = 29,
        ResponsibleNationalCode = 30,
        ResponsiblePersonId = 31,
        RelationType = 32,
        Covered = 33,
        RecommendationMessage = 34,
        RegisterTaminDateTime = 35
    }

    public enum AdmissionReimbursmentEnumerator : short
    {
        [Display(Name = "آفلاین")] Offline = 1,
        [Display(Name = "آنلاین")] Online = 2,
        [Display(Name = "سیستمی")] System = 3,
        [Display(Name = "ارسال نشده")] NotSent = 0
    }

    public enum AdmissionSendStatusResult : byte
    {
        [Display(Name = "ارسال نشده")] Unsend = 0,
        [Display(Name = "ارسال موفق")] SuccsessFull = 1,
        [Display(Name = "ارسال نا موفق")] Error = 2
    }

    public enum AttributeType : byte
    {
        [Display(Name = "کد فنی")] TechnicalCode = 1,
        [Display(Name = "رنگ")] Color = 2,
        [Display(Name = "وزن ناخالص")] GrossWeight = 3,
        [Display(Name = "وزن خالص")] NetWeight = 4,
        [Display(Name = "برند")] Brand = 5,
        [Display(Name = "جنسیت")] Sex = 6,
        [Display(Name = "سایز")] Size = 7
    }

    public enum AuthenticateOperationType : byte
    {
        VIW = 1,
        VIWALL = 2,
        DIS = 3,
        INS = 4,
        UPD = 5,
        DEL = 6,
        PRN = 7,
        FIL = 8
    }

    public enum CostCenterAccountDetailType : byte
    {
        [Display(Name = "مرکز هزینه")] IsCostCenter = 1,
        [Display(Name = "تفصیل")] IsAccountDetail = 2
    }

    public enum DatePart : byte
    {
        MiliSecond = 1,
        Second = 2,
        Minute = 3,
        Hour = 4,
        Day = 5
    }


    public enum Days : byte
    {
        [Display(Name = "شنبه")] Saturday = 1,
        [Display(Name = "یک شنبه")] Sunday = 2,
        [Display(Name = "دو شنبه")] Monday = 3,
        [Display(Name = "سه شنبه")] Tuesday = 4,
        [Display(Name = "چهار شنبه")] Wednesday = 5,
        [Display(Name = "پنج شنبه")] Thursday = 6,
        [Display(Name = "جمعه")] Friday = 7
    }

    public enum DdlType : byte
    {
        Fix = 10,
        DropDown = 20,
        Select2 = 30,
        Select2IsAjax = 40
    }

    public enum Direction : byte
    {
        Previous = 1,
        Next = 2
    }


    public enum DropDownCache : byte
    {
        [Display(Name = "بیمه پایه")] InsurerLine = 1,

        [Display(Name = "داکتران")] Attender = 2,

        [Display(Name = "بیمه تکمیلی")] CompInsurerLine = 3,

        [Display(Name = "طرف قرارداد")] ThirdParty = 4,

        [Display(Name = "تخفیف")] Discount = 5,

        [Display(Name = "بیمه تکمیلی با طرف قرارداد")]
        CompInsurerLineThirdParty = 6,

        [Display(Name = "داکتران پاراکلینیک")] AttenderParaClinic = 7
    }

    public enum EnumpriceType
    {
        [Description("نرخ ثابت")] Fix = 1,
        [Description("محدوده نرخ")] Range = 2
    }

    public enum FieldTableTypeKey : byte
    {
        [Display(Name = "نامشخص")] None = 0,
        [Display(Name = "کلید اصلی")] PrimaryKey = 1,
        [Display(Name = "کلید خارجی")] ForiegnKey = 2
    }

    public enum IdentityType : byte
    {
        [Display(Name = "بدون دسته")] None = 99,

        [Display(Name = "دستگاه پوز")] Pos = 100
    }

    public enum IdentityTypePostingGroup : byte
    {
        [Display(Name = "خزانه")] Treasury = 10,
        [Display(Name = "انبار")] Stock = 20,
        [Display(Name = "خرید")] Purchase = 30
    }

    public enum IncomeBalance : byte
    {
        [Display(Name = "دائم")] Permenant = 1,
        [Display(Name = "موقت")] Temporary = 2
    }


    public enum InOut : byte
    {
        [Display(Name = "دریافت")] In = 1,
        [Display(Name = "دریافت")] Out = 2,
        [Display(Name = "دریافت / پرداخت")] InOut = 3
    }

    public enum InOutDirection : byte
    {
        [Display(Name = "سربرگ")] HeaderInOut = 1,
        [Display(Name = "پابرگ")] LineInOut = 2
    }

    public enum InputState : byte
    {
        Editable = 10,
        ReadOnly = 20,
        Disabled = 30
    }

    public enum IsDecimal : byte
    {
        [Display(Name = "صحیح")] Integer = 1,
        [Display(Name = "اعشار")] Decimal = 2
    }


    public enum MainReportType : byte
    {
        [Display(Name = "تراز")] Level = 1,
        [Display(Name = "دفتر")] Note = 2
    }

    public enum MedicalType : byte
    {
        Laboratory = 1,
        Dental = 2,
        Assistant = 3,
        Prescription = 4
    }

    public enum Mounths
    {
        [Display(Name = "حمل")] Farvardin = 1,
        [Display(Name = "ثور")] Ordibehesht = 2,
        [Display(Name = "جوزا")] Khordad = 3,
        [Display(Name = "سرطان")] Tir = 4,
        [Display(Name = "اسد")] Mordad = 5,
        [Display(Name = "سنبله")] Shahrivar = 6,
        [Display(Name = "میزان")] Mehr = 7,
        [Display(Name = "قوس")] Aban = 8,
        [Display(Name = "عقرب")] Azar = 9,
        [Display(Name = "جدی")] Dey = 10,
        [Display(Name = "دلو")] Bahman = 11,
        [Display(Name = "حوت")] Esfand = 12
    }

    public enum NoSeries : byte
    {
        [Display(Name = "تامین کنندگان")] Vendor = 102,
        [Display(Name = "مشتریان")] Customer = 103,
        [Display(Name = "پرسنل")] Employee = 104,
        [Display(Name = "تماس ها")] Contact = 105,
        [Display(Name = "سهامداران")] ShareHolder = 106,
        [Display(Name = "حسابهای بانکی")] BankAccount = 108,
        [Display(Name = "مرکز هزینه")] CostCenter = 109,
        [Display(Name = "انبار")] Warehouse = 110,
        [Display(Name = "پزشکان")] Attender = 201,
        [Display(Name = "شرکت های بیمه")] Insurer = 202,
        [Display(Name = "طرف قراردادها")] ThirdParty = 203,
        [Display(Name = "مراجعه کنندگان")] Patient = 204,
        [Display(Name = "شعب")] Branch = 205,
        [Display(Name = "بیمه های تکمیلی")] ComplementoryInsurer = 206,
        [Display(Name = "تخفیف")] Discount = 206
    }

    public enum OperationType : byte
    {
        Insert = 1,
        Update = 2,
        Delete = 3,
        Response = 4,
        Confirm = 5,
        UnConfirm = 6
    }

    public enum PageOrderByDirection : short
    {
        [Display(Name = "صعودی")] ASC = 1,
        [Display(Name = "نزولی")] DESC = 2
    }

    public enum PageType : byte
    {
        [Display(Name = "صفحه")] Page = 1,
        [Display(Name = "مودال")] Mdal = 2,
        [Display(Name = "پنجره")] Window = 3
    }

    public enum ParametersReport : byte
    {
        AdmissionService = 10,
        AdmissionItem = 20,
        AttenderCommission = 30,
        Insurance = 40,
        Prescription = 50,
        Dental = 60,
        AdmissionUser = 70,
        AdmissionClose = 80,
        AdmissionCash = 90
    }

    public enum PostingGroupType : byte
    {
        [Display(Name = "موضوع حسابداری")] TreasurySubject = 1,
        [Display(Name = "حساب بانکی")] BankAccount = 2,
        [Display(Name = "شعبه")] Branch = 3,

        [Display(Name = "درآمد عملیاتی سربرگ خدمات پذیرش")]
        AdmissionService = 4,

        [Display(Name = "درآمد عملیاتی سربرگ کالای پذیرش")]
        AdmissionItem = 5,
        [Display(Name = "خزانه")] Treasury = 6,

        [Display(Name = "درآمد عملیاتی پابرگ خدمات پذیرش")]
        AdmissionServiceLine = 7,

        [Display(Name = "درآمد عملیاتی پابرگ کالای پذیرش")]
        AdmissionItemLine = 8,
        [Display(Name = "انبار")] Warehouse = 11,
        [Display(Name = "دارایی ثابت")] FixedAsset = 12,
        [Display(Name = "شعبه - خرید")] BranchPurchase = 13,
        [Display(Name = "شعبه - فروش")] BranchSale = 14,
        [Display(Name = "شعبه - انبار")] BranchWahouse = 15
    }

    public enum PrescriptionTaminSendStatusResult : byte
    {
        [Display(Name = "ارسال نشده")] Unsend = 0,
        [Display(Name = "ارسال موفق")] SuccsessFull = 1,
        [Display(Name = "ارسال نا موفق")] Error = 2,

        [Display(Name = "ویرایش و ارسال مجدد")]
        Update = 3,
        [Display(Name = "حذف نسخه")] Delete = 4
    }

    public enum PrevNextDirection
    {
        First = 1,
        Previous = 2,
        Next = 3,
        Last = 4
    }


    public enum ReportItemTransactionTrialBalanceType : byte
    {
        [Display(Name = "تراز انبار")] LevelWarhouse = 1,
        [Display(Name = "تراز انبار بخش")] LevelWarhouseZone = 2,

        [Display(Name = "تراز انبار بخش پالت")]
        LevelWarhouseZoneBin = 3,
        [Display(Name = "کاردکس انبار")] NoteWarhouse = 4,
        [Display(Name = "کاردکس انبار بخش")] NoteWarhouseZone = 5,

        [Display(Name = "کاردکس انبار بخش پالت")]
        NoteWarhouseZoneBin = 6
    }

    public enum ReportType : byte
    {
        [Display(Name = "تراز کل")] LevelGl = 11,
        [Display(Name = "تراز معین")] LevelSgl = 12,
        [Display(Name = "تراز تفضیل")] LevelAccountDetail = 13,
        [Display(Name = "دفتر کل")] NoteGl = 14,
        [Display(Name = "دفتر معین")] NoteSgl = 15,
        [Display(Name = "دفتر تفضیل")] NoteAccountDetail = 16
    }

    public enum Sex : byte
    {
        [Display(Name = "مردانه")] Men = 1,
        [Display(Name = "زنانه")] Women = 2,
        [Display(Name = "بچگانه")] Kids = 3,
        [Display(Name = "پسرانه")] Boys = 4,
        [Display(Name = "دخترانه")] Girls = 5,
        [Display(Name = "مردانه / زنانه")] Unisex = 6
    }

    public enum StageClassType : byte
    {
        [Display(Name = "سفارش")] PurchaceOrder = 1,
        [Display(Name = "صورت حساب")] PurchaceInvoice = 2,
        [Display(Name = "فرم داخلی")] Form = 3,
        [Display(Name = "فرم ما نزد دیگران")] OurFormWithOthers = 4,
        [Display(Name = "فرم دیگران نزد ما")] FormOthersUsWith = 8
    }


    public enum TaminTokenType : byte
    {
        Eprescription = 1,
        Drug = 2,
        RequestPrescription = 3
    }

    public enum ValidationFile : byte
    {
        Ok = 10,
        Extention = 20,
        Size = 30,
        IsNull = 40
    }
}