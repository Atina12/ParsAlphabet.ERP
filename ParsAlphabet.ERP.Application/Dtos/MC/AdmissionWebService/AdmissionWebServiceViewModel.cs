namespace ParsAlphabet.ERP.Application.Dtos.MC.AdmissionWebService;

public class GetAdmissionReimbursment
{
    public int PageNo { get; set; }
    public int PageRowsCount { get; set; }
    public object[] Form_KeyValue { get; set; }
    public byte SaleTypeId { get; set; }
    public int Id { get; set; }
    public DateTime? FromDate { get; set; }

    public string FromDatePersian
    {
        get => FromDate.ToPersianDateStringNull("{0}/{1}/{2}");
        set
        {
            var str = value.ToMiladiDateTime();
            FromDate = str == null ? null : str.Value;
        }
    }

    public DateTime? ToDate { get; set; }

    public string ToDatePersian
    {
        get => ToDate.ToPersianDateStringNull("{0}/{1}/{2}");
        set
        {
            var str = value.ToMiladiDateTime();
            ToDate = str == null ? null : str.Value;
        }
    }
}

public class ServiceByCode
{
    public int Id { get; set; }
    public int Code { get; set; }
}

public class Wcf_Result
{
    public int Id { get; set; }
    public string AdmissionHid { get; set; }
    public string ErrorMessage { get; set; }
}

public class Cis_Result
{
    public int Id { get; set; }
    public string AdmissionHid { get; set; }
    public string ErrorMessage { get; set; }
}

public class ReimbursmentPackage
{
    public List<Wcf_Result> WcfResult { get; set; }
    // public GetInsurerReimbursement_Result ReimbPackage { get; set; }
}

public class AdmissionReimbursment
{
    public int Id { get; set; }
    public byte SaleTypeId { get; set; }
    public string SaleTypeName { get; set; }
    public int ReturnId { get; set; }
    public int PatientId { get; set; }
    public string PatientFullName { get; set; }
    public string Patient => IdAndTitle(PatientId, PatientFullName);
    public string PatientNationalCode { get; set; }
    public string CreateDateTimePersian { get; set; }
    public string HID { get; set; }
    public int StateId { get; set; }
    public string StateName { get; set; }
    public string State => IdAndTitle(StateId, StateName);
    public bool HidOnline { get; set; }
    public bool UpdateHID { get; set; }
    public AdmissionSendStatusResult UpdateHIDResult { get; set; }
    public string UpdateHIDResultName { get; set; }
    public bool SavePatientBill { get; set; }
    public AdmissionSendStatusResult SaveBillResult { get; set; }
    public string SaveBillResultName { get; set; }
    public bool Reimbursement { get; set; }
    public AdmissionSendStatusResult RembResult { get; set; }
    public string RembResultName { get; set; }
    public bool EliminateHID { get; set; }
    public AdmissionSendStatusResult EliminateHIDResult { get; set; }
    public string EliminateHIDResultName { get; set; }
}

public class ServiceLines
{
    public int ServiceId { get; set; }
    public string ServiceName { get; set; }
    public int ServiceCode { get; set; }
    public string ServiceTypeId { get; set; }
    public string ServiceTypeName { get; set; }
    public int ServiceQuantity { get; set; }
    public float BasicSharePrice { get; set; }
    public float? CompSharePrice { get; set; }
    public float? PatientSharePrice { get; set; }
    public int ConfirmedServiceCount { get; set; }
    public float ConfirmedBasicSharePrice { get; set; }
    public float? ConfirmedCompSharePrice { get; set; }
    public float? ConfirmedPatientSharePrice { get; set; }
    public float? ConfirmedDeduction { get; set; }
}

public class TestUpdateRemb
{
    public string ServiceId { get; set; }
    public string ServiceName { get; set; }
    public string ServiceTerminologyId { get; set; }
    public double ServiceCount { get; set; }
    public decimal PatientPrice { get; set; }
    public decimal DeducationPrice { get; set; }
    public decimal CompInsurerPrice { get; set; }
}