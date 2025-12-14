using System.ComponentModel.DataAnnotations;

namespace ParsAlphabet.ERP.Application.Dtos.MC.AdmissionClose;

public class AdmissionCloseGetPage
{
    public int Id { get; set; }

    public DateTime? CreateDate { get; set; }
    public string CreateDateTimePersian => CreateDate.ToPersianDateStringNull();

    public DateTime? WorkDayDate { get; set; }
    public string WorkDayDatePersian => WorkDayDate.ToPersianDateStringNull("{0}/{1}/{2}");

    public DateTime? CloseDate { get; set; }
    public string CloseDatePersian => CloseDate.ToPersianDateStringNull("{0}/{1}/{2}");

    public int CreateUserId { get; set; }
    public string CreateUserName { get; set; }
    public string CreateUser => $"{CreateUserId} - {CreateUserName}";

    public string BranchId { get; set; }
    public string BranchName { get; set; }
    public string Branch => $"{BranchId} - {BranchName}";

    public string AnnouncementAmount { get; set; }
    public string RealAmount { get; set; }
    public byte Status { get; set; }
    public string StatusName { get; set; }
    public int TreasuryId { get; set; }
    public int JournalId { get; set; }
}

public class GetAdmissionCloseWorkday : CompanyViewModel
{
    public string Opr { get; set; }

    [Display(Name = "کد شعبه")]
    [Required(ErrorMessage = "{0} را انتخاب کنید")]
    [Range(1, short.MaxValue, ErrorMessage = "مقدار وارد شده برای {0} معتبر نمی باشد")]
    public short BranchId { get; set; }

    public long Id { get; set; }

    public DateTime CreateDateTime { get; set; } = DateTime.Now;


    public DateTime? WorkDayDate { get; set; }

    [Display(Name = "تاریخ")]
    public string WorkDayDatePersian
    {
        get => WorkDayDate.ToPersianDateStringNull("{0}/{1}/{2}");
        set
        {
            var str = value.ToMiladiDateTime();
            WorkDayDate = str == null ? null : str.Value;
        }
    }

    public int UserId { get; set; }

    public byte DirectPaging { get; set; }
}

public class AdmissionCashDifference
{
    public int RequestId { get; set; }
    public int AdmissionTypeId { get; set; }
    public string AdmissionTypeName { get; set; }
    public DateTime? CreateDateTime { get; set; }

    public string CreateDateTimePersian
    {
        get => CreateDateTime.ToPersianDateStringNull("{0}/{1}/{2}");
        set
        {
            var str = value.ToMiladiDateTime();
            CreateDateTime = str == null ? null : str.Value;
        }
    }

    public string UserFullName { get; set; }
    public decimal NetAmount { get; set; }
}

public class GetCloseLine : CompanyViewModel
{
    public int CloseId { get; set; }
    public DateTime CloseDateTime { get; set; } = DateTime.Now;
    public string CloseDateTimePersian => CloseDateTime.ToPersianDateString("{0}/{1}/{2} {3}/{4}/{5}");

    public int UserId { get; set; }
    public bool Confirm { get; set; }
}

public class GetSettlement
{
    public int CloseId { get; set; }
    public int LineId { get; set; }
    public int UserId { get; set; }
}

public class SettlementResult
{
    public byte Settled { get; set; }

    public string SettledName
    {
        get
        {
            if (Settled == 1)
                return "1 - تسویه نشده";
            if (Settled == 2)
                return "2 - در جریان تسویه";
            return "3 - تسویه شده";
        }
    }
}

public class GetRealAnnouncementDetail : CompanyViewModel
{
    public int CloseId { get; set; }

    public int LineId { get; set; }
    //public int DetailAccountTypeId { get; set; }
}

public class RealDetailCloseLine : MyResultStatus
{
    public int CloseId { get; set; }

    public int LineId { get; set; }

    //public int DetailAccountTypeId { get; set; }
    public short InOut { get; set; }
    public string InOutName { get; set; }
    public byte FundTypeId { get; set; }
    public string FundTypeName { get; set; }

    public int DetailAccountId { get; set; }
    public string DetailAccountName { get; set; }
    public decimal Amount { get; set; }
    public byte CurrencyId { get; set; }
    public string CurrencyName { get; set; }
    public decimal ExchangeRate { get; set; }
    public decimal AmountExchangeRate { get; set; }
}

public class AnnouncementDetailCloseLine : RealDetailCloseLine
{
    public byte Settled { get; set; }

    public string SettledName
    {
        get
        {
            if (Settled == 1)
                return "1 - تسویه نشده";
            if (Settled == 2)
                return "2 - در جریان تسویه";
            return "3 - تسویه شده";
        }
    }
}

public class AdmissionCloseLineSave
{
    public int Id { get; set; }
    public int CloseId { get; set; }
    public int LineId { get; set; }
    public int AdmissionUserId { get; set; }

    //[Range(0, int.MaxValue, ErrorMessage = "مقدار وارد شده برای detailAccountId نامعتبر می باشد")]
    //public int DetailAccountTypeId { get; set; }

    [Display(Name = "وجه")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [Range(1, byte.MaxValue, ErrorMessage = "مقدار {0} معتبر نمی باشد")]
    public byte InOut { get; set; }

    public byte FundTypeId { get; set; }
    public int DetailAccountId { get; set; }
    public byte CurrencyId { get; set; }

    [Display(Name = "مبلغ")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [Range(1, long.MaxValue, ErrorMessage = "مقدار {0} معتبر نمی باشد")]
    public decimal Amount { get; set; }

    [Display(Name = "نرخ تسعیر ارز")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [Range(1, int.MaxValue, ErrorMessage = "مقدار {0} معتبر نمی باشد")]
    public decimal ExchangeRate { get; set; }
    //public List<AdmissionCloseLineAccountList> AdmissionCloseLineAccountList { get; set; }
}

public class AdmissionCloseWorkDay
{
    public int Id { get; set; }
    public decimal AmountRemain { get; set; }
    public DateTime? CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateStringNull();

    public DateTime? WorkDayDate { get; set; }
    public string WorkDayDatePersian => WorkDayDate.ToPersianDateStringNull("{0}/{1}/{2}");

    public DateTime? CloseDateTime { get; set; }
    public string CloseDateTimePersian => CloseDateTime.ToPersianDateStringNull();

    public int HeaderUserId { get; set; }
    public string HeaderUserFullName { get; set; }
    public string CreateUser => $"{HeaderUserId} - {HeaderUserFullName}";


    public short BranchId { get; set; }
    public string BranchName { get; set; }
    public string Branch => $"{BranchId} - {BranchName}";

    public decimal RemainAmount { get; set; }

    public int CloseId { get; set; }
    public int LineId { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; }
    public string createUserName => $"{UserId} - {UserName}";
    public decimal Amount { get; set; }
    public byte Settled { get; set; }

    public string SettledName
    {
        get
        {
            if (Settled == 1)
                return "1 - تسویه نشده";
            if (Settled == 2)
                return "2 - در جریان تسویه";
            return "3 - تسویه شده";
        }
    }

    public int Status { get; set; }
    public string StatusMessage { get; set; }

    public bool IsClose { get; set; }
    //public IEnumerable<AdmissionCloseWorkDayLine> AdmissionCloseWorkDayLine { get; set; }

    public int TreasuryId { get; set; }
    public int JournalId { get; set; }
}

public class SaveAdmissionCloseLine : MyResultQuery
{
    public decimal SumAdmissionClose { get; set; }
}

public class AdmissionCloseCSV
{
    public int Id { get; set; }
    public string UserName { get; set; }
    public string DataType { get; set; }
    public string FundTypeName { get; set; }
    public string OpenAccTypeName { get; set; }
    public int DetailAccountId { get; set; }
    public string DetailAccountName { get; set; }
    public decimal Amount { get; set; }
    public string StatusName { get; set; }
}

public class GetRevenueAllocation : CompanyViewModel
{
    public short BranchId { get; set; }
    public DateTime Date { get; set; }
}

public class RevenueAllocation
{
    public string UserFullName { get; set; }
    public string CounterName { get; set; }
    public int RequestId { get; set; }
    public int CashId { get; set; }
    public string CreateDatePersian { get; set; }
    public decimal NetAmount { get; set; }
    public string StateName { get; set; }
}

public class GetAdmissionClose : CompanyViewModel
{
    public int Id { get; set; }
    public DateTime CreateDateTime { get; set; }
    public DateTime WorkDayDate { get; set; }
    public DateTime CloseDateTime { get; set; }
    public short BranchId { get; set; }
    public int UserId { get; set; }
}

public class AdmissionCloseRequestSearchModel : NewGetPageViewModel
{
    [Display(Name = "کد شعبه")]
    [Required(ErrorMessage = "{0} را انتخاب کنید")]
    [Range(1, byte.MaxValue, ErrorMessage = "مقدار وارد شده برای {0} معتبر نمی باشد")]
    public short BranchId { get; set; }

    public DateTime? FromWorkDayDate => FromWorkDayDatePersian.ToMiladiDateTime();
    public string FromWorkDayDatePersian { get; set; }

    public DateTime? ToWorkDayDate => ToWorkDayDatePersian.ToMiladiDateTime();
    public string ToWorkDayDatePersian { get; set; }
}

public class AdmissionCloseRequest
{
    public DateTime CreateDate { get; set; }
    public string CreateDatePersian => CreateDate.ToPersianDateString("{0}/{1}/{2}");
    public double SumAmountReceived { get; set; }
    public double SumAmountPayment { get; set; }
    public double SumAmount => SumAmountReceived > 0 ? SumAmountReceived - SumAmountPayment : -SumAmountPayment;
}

public class AdmissionCloseInsertResult : MyResultStatus
{
    public List<MyResultStatus> ValidationMessageError { get; set; }
}