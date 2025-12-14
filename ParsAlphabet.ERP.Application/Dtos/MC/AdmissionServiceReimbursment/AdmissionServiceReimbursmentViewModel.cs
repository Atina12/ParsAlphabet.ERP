namespace ParsAlphabet.ERP.Application.Dtos.MC.AdmissionServiceReimbursment;

public class NewGetAdmissionServiceReimbursmentGetPage : NewGetPageViewModel
{
    public int? Id { get; set; }
    public int? AdmissionMasterId { get; set; }
    public int? WorkflowId { get; set; }
    public short? StageId { get; set; }
    public byte? ActionId { get; set; }
    public int? BasicInsurerId { get; set; }
    public int? BasicInsurerLineId { get; set; }
    public int? CompInsurerId { get; set; }
    public short? CompInsurerLineId { get; set; }
    public string PatientFullName { get; set; }
    public string FromReserveDatePersian { get; set; }
    public string ToReserveDatePersian { get; set; }
    public int? AttenderId { get; set; }
    public int? ServiceId { get; set; }
    public string ServiceTypeId { get; set; }
    public byte InsurerTypeId { get; set; }
}

public class AdmissionServiceLineReimbursementModel
{
    public int HeaderId { get; set; }
    public int ServiceId { get; set; }
    public short ConfirmedBySystem { get; set; }
    public int ConfirmedBasicSharePrice { get; set; }
    public int ConfirmedCompSharePrice { get; set; }
}

public class SaveAdmissionReimbursement : CompanyViewModel
{
    public byte InsurerTypeId { get; set; }
    public List<AdmissionServiceLineReimbursementModel> ReimbursementModel { get; set; }
}

public class ReimburesmentInsurerInfo
{
    public int AdmissionId { get; set; }
    public int BasicInsurerId { get; set; }
    public short BasicInsurerLineId { get; set; }
    public int CompInsurerId { get; set; }
    public int CompInsurerLineId { get; set; }
    public string InsurNo { get; set; }
    public DateTime? BasicInsurerExpirationDate { get; set; }

    public string BasicInsurerExpirationDatePersian =>
        BasicInsurerExpirationDate.ToPersianDateStringNull("{0}/{1}/{2}");

    public string BasicInsurerNo { get; set; }
    public string BasicInsurerBookletPageNo { get; set; }
}

public class AdmissionServiceLineReimbursementGetPage
{
    public int Id { get; set; }
    public int AdmissionMasterId { get; set; }
    public short StageId { get; set; }
    public int WorkflowId { get; set; }
    public byte ActionId { get; set; }
    public int AttenderId { get; set; }
    public string AttenderFullName { get; set; }
    public string Attender => IdAndTitle(AttenderId, AttenderFullName);
    public int PatientId { get; set; }
    public string PatientName { get; set; }
    public string Patient => IdAndTitle(PatientId, PatientName);
    public string NationalCode { get; set; }
    public DateTime ReserveDate { get; set; }
    public string ReserveDatePersian => ReserveDate.ToPersianDateString("{0}/{1}/{2}");
    public string BasicInsurerBookletPageNo { get; set; }
    public string BasicInsurerNo { get; set; }
    public DateTime? BasicInsurerExpirationDate { get; set; }

    public string BasicInsurerExpirationDatePersian =>
        BasicInsurerExpirationDate.ToPersianDateStringNull("{0}/{1}/{2}");

    public int Code { get; set; }
    public string TaminCode { get; set; }
    public int ServiceId { get; set; }
    public string ServiceName { get; set; }
    public string Service => IdAndTitle(ServiceId, ServiceName);

    public decimal ServiceActualAmount { get; set; }
    public long BasicInsurerId { get; set; }
    public string BasicInsurerName { get; set; }
    public string BasicInsurer => IdAndTitle(BasicInsurerId, BasicInsurerName);
    public decimal BasicShareAmount { get; set; }
    public int CompInsurerId { get; set; }
    public string CompInsurerName { get; set; }
    public string CompInsurer => IdAndTitle(CompInsurerId, CompInsurerName);
    public decimal CompShareAmount { get; set; }

    public short ConfirmedBySystem { get; set; }

    public int ConfirmedBasicSharePrice { get; set; }
    public bool ConfirmedBasicSharePriceValue => ConfirmedBasicSharePrice != -1;
    public int ConfirmedCompSharePrice { get; set; }
    public bool ConfirmedCompSharePriceValue => ConfirmedCompSharePrice != -1;
}

public class DeleteAdmissionServiceLineReimbursement
{
    public int AdmissionId { get; set; }
    public int ServiceId { get; set; }
}