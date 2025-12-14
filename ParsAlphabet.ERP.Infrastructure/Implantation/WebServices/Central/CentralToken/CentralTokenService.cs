using ERPCentral.Interface.App.Application.General.Token;
using ParsAlphabet.Central.ObjectModel.General.Token;
using ParsAlphabet.Central.ObjectModel.HelperFunctions;
using ParsAlphabet.Central.ObjectModel.Requests;
using ParsAlphabet.ERP.Application.Interfaces.GN.Company;
using ParsAlphabet.ERP.Application.Interfaces.GN.Token;
using ParsAlphabet.ERP.Application.Interfaces.WebServices.Central;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.WebServices.Central;

public class CentralTokenService : ICentralTokenService
{
    private readonly ICompanyRepository _companyRepository;
    private readonly ITokenRepository _tokenRepository;
    private readonly ITokenService _tokenService;

    public CentralTokenService(ITokenRepository tokenRepository, ITokenService tokenService,
        ICompanyRepository companyRepository)
    {
        _tokenRepository = tokenRepository;
        _tokenService = tokenService;
        _companyRepository = companyRepository;
    }

    public async Task<TokenModel> GetToken(TokenInputModel model)
    {
        var strToken = new HttpResult<string>();
        var tokenResult = new TokenModel();
        byte transactionTypeId = 1; //Erp Node Send

        var token = await _tokenRepository.GetToken(transactionTypeId);
        if (token == null)
        {
            strToken = await _tokenService.GetErpToken(model);

            if (!string.IsNullOrEmpty(strToken.Data))
            {
                var tokenModel = new TokenModel
                {
                    Token = strToken.Data,
                    ExpirationDateTime = DateTime.Now,
                    TransactionTypeId = transactionTypeId
                };
                await _tokenRepository.InsertToken(tokenModel);
                tokenResult.Token = strToken.Data;
            }
        }
        else
        {
            tokenResult = token;
        }

        return tokenResult;
    }

    public async Task<bool> CheckToken(string token)
    {
        var result = await _tokenService.CheckErpToken(token);
        return result;
    }

    public async Task<TokenInputModel> GetTokenModel()
    {
        var model = new TokenInputModel();
        var companyKeyInfo = await _companyRepository.GetCompanyKeyInfo();
        var encryptedKey = Encryption_V2_2.Encrypt(companyKeyInfo.EncryptionKey, companyKeyInfo.PublicKey);

        model.UserName = companyKeyInfo.UserName;
        model.Password = companyKeyInfo.Password;
        model.Key = encryptedKey;
        return model;
    }


    public async Task<ResultQuery> DeleteToken(int id)
    {
        var result = await _tokenRepository.DeleteToken(id);
        return result;
    }
}