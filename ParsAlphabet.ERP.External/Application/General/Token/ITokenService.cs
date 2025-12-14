using ParsAlphabet.Central.ObjectModel.General.Token;
using ParsAlphabet.Central.ObjectModel.Requests;

namespace ERPCentral.Interface.App.Application.General.Token;

public interface ITokenService
{
    Task<HttpResult<string>> GetErpToken(TokenInputModel model);
    Task<bool> CheckErpToken(string token);
}