namespace ParsAlphabet.ERP.Application.Dtos.MC.Insurance;

public class InsuranceGetPage
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Code { get; set; }
    public int InsurerTypeId { get; set; }
    public string InsurerTypeName { get; set; }
    public string InsurerType => IdAndTitle(InsurerTypeId, InsurerTypeName);
    public int InsurerTerminologyId { get; set; }
    public string InsurerTerminologyName { get; set; }
    public string Terminology => IdAndTitle(InsurerTerminologyId, InsurerTerminologyName);

    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public string CreateUser => IdAndTitle(CreateUserId, CreateUserFullName);
    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString();


    public bool IsActive { get; set; }
    public int DetailId { get; set; }
    public bool IsDetail => DetailId != 0;
}

public class InsuranceBoxListViewModel
{
    public short Id { get; set; }
    public string Name { get; set; }
    public string InsuranceBoxTerminologyId { get; set; }
    public string InsuranceBoxTerminologyName { get; set; }
    public string InsuranceBoxTerminology => IdAndTitle(InsuranceBoxTerminologyId, InsuranceBoxTerminologyName);
    public int InsurerId { get; set; }
    public bool IsActive { get; set; }
}

public class InsuranceGetRecord
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string InsurerTerminologyId { get; set; }
    public string InsurerTerminologyName { get; set; }
    public string InsurerTerminology => IdAndTitle(InsurerTerminologyId, InsurerTerminologyName);
    public byte? InsurerTypeId { get; set; }
    public string InsurerTypeName { get; set; }
    public string InsurerType => IdAndTitle(InsurerTypeId, InsurerTypeName);
    public bool IsActive { get; set; }
    public string JsonAccountDetailList { get; set; }
    public string InsuranceBoxJson { get; set; }
    public List<InsuranceBoxListViewModel> InsuranceBoxList { get; set; }
}

public class InsurerLineGetRecord : CompanyViewModel
{
    public int Id { get; set; }
    public int InsurerId { get; set; }
    public string Name { get; set; }
    public string InsuranceBoxTerminologyId { get; set; }
    public bool IsActive { get; set; }
}

public class GetInsuranceCode : CompanyViewModel
{
    public int InsurerId { get; set; }

    public short InsurerLineId { get; set; }
    public string InsurerCode { get; set; }
    public string InsurerLineCode { get; set; }
}

public class InsurerCode
{
    public int InsurerLineId { get; set; }
    public byte InsurerTypeId { get; set; }
    public int InsurerId { get; set; }
    public string InsurerTerminologyCode { get; set; }
    public string InsurerLineName { get; set; }
    public string InsurerLineTerminologyCode { get; set; }
}