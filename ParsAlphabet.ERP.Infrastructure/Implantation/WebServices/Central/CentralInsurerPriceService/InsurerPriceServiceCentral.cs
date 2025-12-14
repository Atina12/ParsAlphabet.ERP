using System.Net;
using ERPCentral.Interface.App.Application.Medical.InsurerPrice;
using ParsAlphabet.Central.ObjectModel.MedicalCare.InsurerPrice;
using ParsAlphabet.Central.ObjectModel.Requests;
using ParsAlphabet.ERP.Application.Interfaces.GN.Token;
using ParsAlphabet.ERP.Application.Interfaces.WebServices.Central;
using OperationType = ParsAlphabet.ERP.Application.Enums.Enum.OperationType;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.WebServices.Central.CentralInsurerPriceService;

public class InsurerPriceServiceCentral : IInsurerPriceServiceCentral
{
    private readonly ICentralTokenService _centralTokenService;
    private readonly IInsurerPriceService _insurerPriceService;
    private readonly ITokenRepository _tokenRepository;

    public InsurerPriceServiceCentral(IInsurerPriceService insurerPriceService, ICentralTokenService centralTokenService
        , ITokenRepository tokenRepository)
    {
        _insurerPriceService = insurerPriceService;
        _centralTokenService = centralTokenService;
        _tokenRepository = tokenRepository;
    }

    public async Task<HttpResult<ResultQuery>> InsurerPriceCentral(CentralInsurerPriceModel model)
    {
        var result = new HttpResult<ResultQuery>();

        var validation = await ValidationInsurerPrice(model);

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
            result = await _insurerPriceService.SendInsurerPriceService(model, token.Token);

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

    public async Task<HttpResult<List<ResultBulkSaveInsurerPrice>>> InsurerPriceBulkCentral(
        List<CentralInsurerPriceModel> model, OperationType operation)
    {
        var result = new HttpResult<List<ResultBulkSaveInsurerPrice>>();

        var validation = await ValidationBulkInsurerPrice(model, operation);

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
            result = await _insurerPriceService.SendInsurerPriceBulkService(model, token.Token);

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

    private async Task<List<string>> ValidationInsurerPrice(CentralInsurerPriceModel model)
    {
        var errors = new List<string>();

        if (model == null)
        {
            errors.Add("موردی برای ارسال وجود ندارد");
            return errors;
        }

        await Task.Run(() =>
        {
            if (model.ItemId == 0)
                errors.Add(" شناسه خدمت برای ارسال الزامی است");

            if (model.InsurerId == 0)
                errors.Add(" بیمه برای ارسال  الزامی است");

            if (model.InsurerLineId == 0)
                errors.Add(" صندوق  بیمه برای ارسال الزامی است");

            if (model.InsurerPriceCalculationMethodId == 0)
                errors.Add(" روش محاسبه برای ارسال الزامی است");
        });
        return errors;
    }

    private async Task<List<string>> ValidationBulkInsurerPrice(List<CentralInsurerPriceModel> model,
        OperationType operation)
    {
        var errors = new List<string>();
        if (!model.ListHasRow())
            errors.Add("موردی برای ارسال وجود ندارد");
        else
            await Task.Run(() =>
            {
                if (operation != OperationType.Delete)
                {
                    var itemList = model.Where(x => x.ItemId == 0).ToList();
                    var insurerList = model.Where(x => x.InsurerId == 0).ToList();
                    var insurerLineList = model.Where(x => x.InsurerLineId == 0).ToList();
                    var insurerPriceCalculationMethodList =
                        model.Where(x => x.InsurerPriceCalculationMethodId == 0).ToList();

                    if (itemList.ListHasRow() || insurerList.ListHasRow() || insurerLineList.ListHasRow() ||
                        insurerPriceCalculationMethodList.ListHasRow())
                        errors.Add("مقادیر ورودی معتبر نمی باشد");
                }
            });

        return errors;
    }
}