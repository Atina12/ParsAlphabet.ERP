namespace ParsAlphabet.ERP.Application.Dtos.MC.Service;

public class ServiceGetPage
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string OnlineName { get; set; }
    public int ServiceTypeId { get; set; }
    public string ServiceTypeName { get; set; }
    public string ServiceType => IdAndTitle(ServiceTypeId, ServiceTypeName);
    public string NationalCode { get; set; }
    public string Attribute { get; set; }
    public int TerminologyId { get; set; }
    public string CdtTerminologyId { get; set; }
    public string TaminTerminologyId { get; set; }

    public bool IsActive { get; set; }
    public decimal TechnicalCode { get; set; }
    public decimal ProfessionalCode { get; set; }
    public decimal AnesthesiaBase { get; set; }
    public int CentralId { get; set; }
    public string SendResult => CentralId > 0 ? "ارسال شده" : "ارسال نشده";
}

public class ServiceGetRecord
{
    public int Id { get; set; }
    public int? CentralId { get; set; }
    public string Name { get; set; }
    public string OnlineName { get; set; }
    public string ServiceTypeId { get; set; }
    public string ServiceTypeName { get; set; }
    public string ServiceType => IdAndTitle(ServiceTypeId, ServiceTypeName);
    public int? TerminologyId { get; set; }
    public string TerminologyName { get; set; }
    public int? CdtTerminologyId { get; set; }
    public string CdtTerminologyName { get; set; }
    public int? TaminTerminologyId { get; set; }
    public string TaminTerminologyName { get; set; }
    public string PrintDescription { get; set; }
    public bool IsActive { get; set; }
}

public class CheckAttenderNationalCode : CompanyViewModel
{
    public int Id { get; set; }
    public string NationalCode { get; set; }
}

public class TerminologyInfoService
{
    public string NationalCode { get; set; }
    public string ServiceName { get; set; }
    public string ServiceTypeId { get; set; }
    public string ServiceTypeName { get; set; }
}

public class ServiceGroupDropDown
{
    public string Id { get; set; }
    public string Name { get; set; }
}

public class UpdateThirdPartyPrice : CompanyViewModel
{
    public int ThirdPartyId { get; set; }
    public string Attribute { get; set; }
    public string ServiceTypeId { get; set; }
    public decimal DiscountPer { get; set; }
    public byte PriceType { get; set; }
    public DateTime LastModified { get; set; } = DateTime.Now;
    public int FromNationalCode { get; set; }
    public int ToNationalCode { get; set; }
    public int FromServiceId { get; set; }
    public int ToServiceId { get; set; }
    public bool HasNationalCode { get; set; }
    public bool IsPreview { get; set; }
}

public class KParameter
{
    public int Code { get; set; }
    public double ProfessionalCode { get; set; }
    public double TechnicalCode { get; set; }
    public double AnesthesiaBase { get; set; }
}

public class TaminTermonologyParameter
{
    public string TarefCode { get; set; }
    public int GovermentPrice { get; set; }
    public int FreePrice { get; set; }
    public int TechPrice { get; set; }
    public int MinAge { get; set; }
    public int MaxAge { get; set; }
    public string AcceptableGender { get; set; }
}

public class CdtTermonologyParameter
{
    public string Code { get; set; }
    public string Description { get; set; }
}

public class GetServiceAdmissionDropDown : CompanyViewModel
{
    public DateTime? FromReserveDate { get; set; }

    public string FromReserveDatePersian
    {
        get => FromReserveDate.ToPersianDateStringNull("{0}/{1}/{2}");
        set
        {
            var str = value.ToMiladiDateTime();
            FromReserveDate = str == null ? null : str.Value;
        }
    }

    public DateTime? ToReserveDate { get; set; }

    public string ToReserveDatePersian
    {
        get => ToReserveDate.ToPersianDateStringNull("{0}/{1}/{2}");
        set
        {
            var str = value.ToMiladiDateTime();
            ToReserveDate = str == null ? null : str.Value;
        }
    }

    public int? ServiceId { get; set; }
    public int? ServiceCode { get; set; }
    public string ServiceName { get; set; }
}

public class ServiceAdmissionDropDown
{
    public int Id { get; set; }
    public int Code { get; set; }
    public string Name { get; set; }
}

public class ServiceTaminId
{
    public int? ServiceId { get; set; }
    public string ServiceName { get; set; }
    public string TaminCode { get; set; }
}

public class ServiceSendHistoryGetRecord
{
    public int Id { get; set; }
    public string CentralId { get; set; }
    public Guid SendHistoryId { get; set; }
    public string OnlineName { get; set; }
    public int ServiceTypeId { get; set; }
    public bool IsActive { get; set; }
    public string Description { get; set; }
    public short CompanyId { get; set; }
}