using ParsAlphabet.Central.ObjectModel.General.Token;
using ParsAlphabet.Central.ObjectModel.Requests;

namespace ParsAlphabet.ERP.Application.Interfaces.WebServices.Central;

public interface ICentralTokenService
{
    Task<TokenModel> GetToken(TokenInputModel model);
    Task<TokenInputModel> GetTokenModel();
    Task<ResultQuery> DeleteToken(int id);
    Task<bool> CheckToken(string token);
}