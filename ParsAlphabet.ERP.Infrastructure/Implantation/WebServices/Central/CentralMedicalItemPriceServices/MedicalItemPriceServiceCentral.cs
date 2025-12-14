using System.Net;
using ERPCentral.Interface.App.Application.Medical.MedicalItemPrice;
using ParsAlphabet.Central.ObjectModel.MedicalCare;
using ParsAlphabet.Central.ObjectModel.Requests;
using ParsAlphabet.ERP.Application.Interfaces.GN.Token;
using ParsAlphabet.ERP.Application.Interfaces.WebServices.Central;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.WebServices.Central.CentralMedicalItemPriceServices;

public class MedicalItemPriceServiceCentral : IMedicalItemPriceServiceCentral
{
    private readonly ICentralTokenService _centralTokenService;
    private readonly IMedicalItemPriceService _medicalItemPriceService;
    private readonly ITokenRepository _tokenRepository;

    public MedicalItemPriceServiceCentral(IMedicalItemPriceService medicalItemPriceService,
        ICentralTokenService centralTokenService
        , ITokenRepository tokenRepository)
    {
        _medicalItemPriceService = medicalItemPriceService;
        _centralTokenService = centralTokenService;
        _tokenRepository = tokenRepository;
    }

    public async Task<HttpResult<ResultQuery>> MedicalItemPriceCentral(CentralMedicalItemPrice model)
    {
        var result = new HttpResult<ResultQuery>();

        var validation = await ValidationMedicalItemPrice(model);

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
            result = await _medicalItemPriceService.SendMedicalItemPriceService(model, token.Token);

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

    public async Task<HttpResult<List<ResultBulkSaveMedicalItemPrice>>> MedicalItemPriceBulkCentral(
        List<CentralMedicalItemPrice> model)
    {
        var result = new HttpResult<List<ResultBulkSaveMedicalItemPrice>>();

        var validation = await ValidationBulkMedicalItemPrice(model);

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
            result = await _medicalItemPriceService.SendMedicalItemPriceBulkService(model, token.Token);

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

    private async Task<List<string>> ValidationMedicalItemPrice(CentralMedicalItemPrice model)
    {
        var errors = new List<string>();

        if (!model.NotNull())
        {
            errors.Add("موردی برای ارسال وجود ندارد");
            return errors;
        }

        await Task.Run(() =>
        {
            if (model.ItemId == 0)
                errors.Add(" شناسه خدمت برای ارسال الزامی است");

            if (model.MedicalSubjectId == 0)
                errors.Add("موضوع درمان الزامی است");
        });
        return errors;
    }

    private async Task<List<string>> ValidationBulkMedicalItemPrice(List<CentralMedicalItemPrice> model)
    {
        var errors = new List<string>();
        if (!model.ListHasRow())
            errors.Add("موردی برای ارسال وجود ندارد");
        else
            await Task.Run(() =>
            {
                var itemList = model.Where(x => x.ItemId == 0).ToList();
                // var priceList = model.Where(x => x.BeginPrice == 0).AsList();
                var medicalSubjectList = model.Where(x => x.MedicalSubjectId == 0).ToList();
                if (itemList.ListHasRow())
                    errors.Add("شناسه خدمت برای ارسال معتبر نمی باشد");
                if (medicalSubjectList.ListHasRow())
                    errors.Add("موضوع درمان معتبر نمی باشد");
                // if (priceList.ListHasRow())
                //     errors.Add("نرخ معتبر نمی باشد");
            });

        return errors;
    }
}