using System.Net;
using ERPCentral.Interface.App.Application.Medical.Branch;
using ParsAlphabet.Central.ObjectModel.MedicalCare;
using ParsAlphabet.Central.ObjectModel.Requests;
using ParsAlphabet.ERP.Application.Interfaces.GN.Token;
using ParsAlphabet.ERP.Application.Interfaces.WebServices.Central;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.WebServices.Central.CentralBranchServices;

public class BranchServiceCentral : IBranchServiceCentral
{
    private readonly IBranchService _branchService;
    private readonly ICentralTokenService _centralTokenService;
    private readonly ITokenRepository _tokenRepository;

    public BranchServiceCentral(IBranchService branchService, ICentralTokenService centralTokenService
        , ITokenRepository tokenRepository)
    {
        _branchService = branchService;
        _centralTokenService = centralTokenService;
        _tokenRepository = tokenRepository;
    }

    public async Task<HttpResult<ResultQuery>> BranchCentral(CentralBranch model)
    {
        var result = new HttpResult<ResultQuery>();

        var validation = await BranchValidation(model);

        if (validation.Count > 0)
        {
            result.ValidationErrors = validation;
            result.HttpStatus = HttpStatusCode.NotAcceptable;
            return result;
        }

        var tokenModel = await _centralTokenService.GetTokenModel();

        var token = await _centralTokenService.GetToken(tokenModel);

        if (!string.IsNullOrEmpty(token.Token))
        {
            result = await _branchService.SendBranch(model, token.Token);

            if (result.HttpStatus == HttpStatusCode.Unauthorized)
            {
                await _tokenRepository.DeleteToken(token.Id);

                result.StatusMessage = "error";
                result.HttpStatus = HttpStatusCode.Unauthorized;
                result.Successfull = false;
                result.Data = null;
            }
            else if (result.HttpStatus == HttpStatusCode.Forbidden)
            {
                result.StatusMessage = "unauthorize";
                result.HttpStatus = HttpStatusCode.Unauthorized;
                result.Successfull = false;
                result.Data = null;
            }
        }
        else
        {
            result.StatusMessage = "error";
            result.HttpStatus = HttpStatusCode.Unauthorized;
            result.Successfull = false;
            result.Data = null;
        }

        return result;
    }

    private async Task<List<string>> BranchValidation(CentralBranch model)
    {
        var errors = new List<string>();

        if (!model.NotNull())
        {
            errors.Add("موردی برای ارسال وجود ندارد");
            return errors;
        }

        await Task.Run(() =>
        {
            if (model.Name.IsNullOrEmptyOrWhiteSpace())
                errors.Add("نام شعبه الزامی است");

            if (model.CompanyId == 0)
                errors.Add("مرکز معتبر نمی باشد");

            if (model.Address.IsNullOrEmptyOrWhiteSpace())
                errors.Add("آدرس الزامی است");

            if (model.StateId == 0)
                errors.Add("اطلاعات ولایت معتبر نمی باشد");

            if (model.CityId == 0)
                errors.Add("اطلاعات شهر معتبر نمی باشد");

            if (!model.BranchLineList.ListHasRow())
                errors.Add("اطلاعات تماس شعبه الزامی است");
        });

        return errors;
    }
}