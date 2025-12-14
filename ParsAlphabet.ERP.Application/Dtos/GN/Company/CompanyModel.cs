namespace ParsAlphabet.ERP.Application.Dtos.GN.Company;

public class CompanyInfo
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string ManagerFirstName { get; set; }
    public string ManagerLastName { get; set; }
    public string Address { get; set; }
    public string PostalCode { get; set; }
    public int CityId { get; set; }
    public int CountryId { get; set; }
    public byte[] Logo { get; set; }
    public string LogoBase64 => Logo.NotNull() ? Convert.ToBase64String(Logo) : null;

    public string PhoneNo { get; set; }
    public string Email { get; set; }
    public string Website { get; set; }
    public byte DefaultCurrencyId { get; set; }
    public string NationCode { get; set; }
    public string TaxCode { get; set; }
    public bool VATEnable { get; set; }
    public byte IncomeTaxPer { get; set; }
    public string WebServiceGuid { get; set; }
    public byte TerminologyId { get; set; }
    public string ArmedInsuranceIdentity { get; set; }
    public string ArmedInsuranceName { get; set; }
    public byte IndustryGroup { get; set; }
    public string SiamId { get; set; }
}

public class CompanyKeyInfo
{
    public string PublicKey { get; set; }
    public string EncryptionKey { get; set; }
    public string UserName { get; set; }
    public string Password { get; set; }
}