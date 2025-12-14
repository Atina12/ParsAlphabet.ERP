namespace ParsAlphabet.ERP.Application.Dtos.MC.AdmissionDiscrepancyCartable;

public class GetAdmissionDiscrepancy : NewGetPageViewModel
{
    public string CreateDateTimePersian { get; set; }
    public DateTime CreateDate => CreateDateTimePersian.ToMiladiDateTime().Value;

    public int CreateUserId { get; set; }
    public int? WorkflowId { get; set; }
    public int? StageId { get; set; }
    public int? ActionId { get; set; }

    public int? AdmissionMasterId { get; set; }
    public int? AdmissionId { get; set; }
    public int? AdmissionCashId { get; set; }
    public int? PatientId { get; set; }
    public int? AttenderVendorId { get; set; }
    public int? CashCreateUserId { get; set; }
}

public class AdmissionDiscrepancySummaryViewModel1
{
    public int WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public string Workflow => IdAndTitle(WorkflowId, WorkflowName);

    public short StageId { get; set; }
    public string StageName { get; set; }
    public string Stage => IdAndTitle(StageId, StageName);

    public byte ActionId { get; set; }
    public string ActionName { get; set; }
    public string ActionIdName => IdAndTitle(ActionId, ActionName);

    public int AdmissionCount { get; set; }
    public int SumQty { get; set; }
    public decimal SumAmount { get; set; }

    public int? CashCreateUserId { get; set; }
    public string CashCreateUserFullName { get; set; }
    public string CashCreateUser => IdAndTitle(CashCreateUserId, CashCreateUserFullName);

    public int AdmissionCreateUserId { get; set; }
    public string AdmissionCreateUserFullName { get; set; }
    public string AdmissionCreateUser => IdAndTitle(AdmissionCreateUserId, AdmissionCreateUserFullName);

    public bool IsAdmissionCash { get; set; }
}

public class AdmissionDiscrepancyDetailViewModel2
{
    public int AdmissionId { get; set; }
    public int AdmissionMasterId { get; set; }
    public DateTime? ReserveDate { get; set; }
    public string ReserveDatePersian => ReserveDate.ToPersianDateStringNull("{0}/{1}/{2}");
    public string ReserveTime { get; set; }
    public string ReserveDateTimePersian => ReserveDatePersian + " " + ReserveTime;

    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString();

    public int PatientId { get; set; }
    public string PatientFullName { get; set; }
    public string Patient => IdAndTitle(PatientId, PatientFullName);
    public string PatientNationalCode { get; set; }

    public int VendorAttenderId { get; set; }
    public string VendorAttenderFullName { get; set; }
    public string VendorAttender => IdAndTitle(VendorAttenderId, VendorAttenderFullName);

    public int FirstActionCreateUserId { get; set; }
    public string FirstActionCreateUserFullName { get; set; }
    public string FirstActionCreateUser => IdAndTitle(FirstActionCreateUserId, FirstActionCreateUserFullName);
    public decimal SumPayAmount { get; set; }
}

public class AdmissionDiscrepancyCashDetailViewModel3
{
    public int AdmissionId { get; set; }
    public int AdmissionMasterId { get; set; }
    public int AdmissionCashId { get; set; }

    public int PatientId { get; set; }
    public string PatientFullName { get; set; }
    public string Patient => IdAndTitle(PatientId, PatientFullName);
    public string PatientNationalCode { get; set; }

    public decimal SumAmount { get; set; }

    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString();

    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public string CreateUser => IdAndTitle(CreateUserId, CreateUserFullName);
}

public class AdmissionDiscrepancyCashFundTypeSummaryViewModel4 : MyDropDownViewModel
{
    public byte InOut { get; set; }
    public string InOutName => InOut == 1 ? "1 - دریافت" : "2 - پرداخت";
}

public class SumGetAdmissionDiscrepancy
{
    public int SumPayAmount { get; set; }
}