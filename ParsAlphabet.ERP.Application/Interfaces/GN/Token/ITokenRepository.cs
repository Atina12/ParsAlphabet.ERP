using ParsAlphabet.Central.ObjectModel.General.Token;
using ParsAlphabet.Central.ObjectModel.Requests;

namespace ParsAlphabet.ERP.Application.Interfaces.GN.Token;

public interface ITokenRepository
{
    Task<TokenModel> GetToken(byte transactionTypeId);
    Task<ResultQuery> InsertToken(TokenModel model);
    Task<ResultQuery> DeleteToken(int Id);
}