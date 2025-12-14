using ParsAlphabet.ERP.Application.Dtos.GN.Company;

namespace ParsAlphabet.ERP.Application.Interfaces.GN.Company;

public interface ICompanyRepository
{
    Task<CompanyInfo> GetCompanyInfo();
    Task<byte> GetDefaultCurrency(int companyId);
    Task<CompanyKeyInfo> GetCompanyKeyInfo();
    Task<short> GetCompanyCentralId();
}