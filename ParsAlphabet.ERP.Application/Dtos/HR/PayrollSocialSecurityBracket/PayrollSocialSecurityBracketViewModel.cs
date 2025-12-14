namespace ParsAlphabet.ERP.Application.Dtos.HR.PayrollSocialSecurityBracket;

public class PayrollSocialSecurityBracketGetPage
{
    public int Id { get; set; }
    public int FiscalYearId { get; set; }
    public string FiscalYearName { get; set; }
    public string FiscalYear => IdAndTitle(FiscalYearId, FiscalYearName);
    public string Name { get; set; }
    public int InsurerId { get; set; }
    public string Insurername { get; set; }
    public string Insurer => IdAndTitle(InsurerId, Insurername);
    public string WorkshopCode { get; set; }
    public string WorkshopName { get; set; }
    public short ContractNo { get; set; }
    public byte SocialSecurityTypeId { get; set; }
    public string SocialSecurityTypeName => SocialSecurityTypeId == 1 ? "1-خویش فرما" : "2-پرسنلی";
    public byte EmployerSCPercentage { get; set; }
    public byte EmployeeSCPercentage { get; set; }
    public byte UnEmploymentSCPercentage { get; set; }
    public long MaxPensionableAmount { get; set; }
    public string CreateDateTimePersian { get; set; }
    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public string UserFullName => IdAndTitle(CreateUserId, CreateUserFullName);
    public bool IsActive { get; set; }
}

public class PayrollSocialSecurityBracketGetRecord
{
    public int Id { get; set; }
    public int FiscalYearId { get; set; }
    public string Name { get; set; }
    public int InsurerId { get; set; }
    public string WorkshopCode { get; set; }
    public string WorkshopName { get; set; }
    public string ContractNo { get; set; }
    public byte SocialSecurityTypeId { get; set; }
    public string EmployerSCPercentage { get; set; }
    public string EmployeeSCPercentage { get; set; }
    public string UnEmploymentSCPercentage { get; set; }
    public string MaxPensionableAmount { get; set; }
    public DateTime? CreateDateTime { get; set; }
    public int CreateUserId { get; set; }
    public bool IsActive { get; set; }
}