namespace ParsAlphabet.ERP.Application.Dtos.MC.ReportControl;

public class GetServiceControl : CompanyViewModel
{
    public byte Type { get; set; }
}

public class ServiceControl
{
    public int ServiceId { get; set; }
    public int Code { get; set; }
    public string Name { get; set; }
    public string Service => IdAndTitle(ServiceId, Name);
    public float Price { get; set; }
    public float Price_IPD { get; set; }
}

public class InsurerControl
{
    public int BasicInsuerId { get; set; }
    public string BasicInsuerName { get; set; }
    public string BasicInsuer => IdAndTitle(BasicInsuerId, BasicInsuerName);
    public string BasicInsurerCode { get; set; }
    public short BasicInsurerLineId { get; set; }
    public string BasicInsurerLineName { get; set; }
    public string BasicInsurerLine => IdAndTitle(BasicInsurerLineId, BasicInsurerLineName);
    public string BasicInsurerLineCode { get; set; }
    public int CompInsurerId { get; set; }
    public string CompInsurerName { get; set; }
    public string CompInsurer => IdAndTitle(CompInsurerId, CompInsurerName);
    public int CompInsurerCode { get; set; }

    public int CompInsurerLineId { get; set; }
    public string CompInsurerLineName { get; set; }
    public string CompInsurerLine => IdAndTitle(CompInsurerLineId, CompInsurerLineName);


    public int ThridPartyInsurerId { get; set; }
    public string ThridPartyInsurerName { get; set; }
    public string ThridPartyInsurer => IdAndTitle(ThridPartyInsurerId, ThridPartyInsurerName);

    public int DiscountInsurerId { get; set; }
    public string DiscountInsurerName { get; set; }
    public string DiscountInsurer => IdAndTitle(DiscountInsurerId, DiscountInsurerName);
}

public class GetAttenderControl : CompanyViewModel
{
    public byte Type { get; set; }
    public bool IsActive { get; set; }
    public int AttenderId { get; set; }
}

public class AttenderControl
{
    public int Id { get; set; }
    public string FullName { get; set; }
    public string Attender => IdAndTitle(Id, FullName);
    public long SpecialityId { get; set; }
    public string SpecialityName { get; set; }
    public string Speciality => IdAndTitle(SpecialityId, SpecialityName);
    public long DepartmentId { get; set; }
    public string DepartmentName { get; set; }
    public string Department => IdAndTitle(DepartmentId, DepartmentName);
    public string NationalCode { get; set; }
    public string MobileNo { get; set; }
    public int MSC_TypeId { get; set; }
    public int AttenderTaxPer { get; set; }
    public string MSc { get; set; }

    public int ServiceId { get; set; }
    public int ServiceNationalCode { get; set; }
    public string ServiceName { get; set; }
    public int Price { get; set; }
    public int PriceIPD { get; set; }
}