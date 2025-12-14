namespace ParsAlphabet.ERP.Application.Interfaces.MC.Insurer;

public interface IInsurerRepository
{
    Task<byte> GetInsurerIdByBoxId(string boxId, int CompanyId);
}