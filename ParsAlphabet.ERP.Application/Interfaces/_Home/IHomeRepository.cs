using ParsAlphabet.ERP.Application.Dtos._Home;

namespace ParsAlphabet.ERP.Application.Interfaces._Home;

public interface IHomeRepository
{
    Task<List<Navigation>> GetNavigationByUserId(int userid, string lang);
}