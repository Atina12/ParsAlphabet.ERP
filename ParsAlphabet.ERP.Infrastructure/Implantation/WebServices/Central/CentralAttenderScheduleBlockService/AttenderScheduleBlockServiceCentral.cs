using System.Net;
using ERPCentral.Interface.App.Application.Medical.AttenderScheduleBlock;
using ParsAlphabet.Central.ObjectModel.MedicalCare;
using ParsAlphabet.Central.ObjectModel.Requests;
using ParsAlphabet.ERP.Application.Interfaces.GN.Token;
using ParsAlphabet.ERP.Application.Interfaces.WebServices.Central;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.WebServices.Central.CentralAttenderScheduleBlockService;

public class AttenderScheduleBlockServiceCentral : IAttenderScheduleBlockServiceCentral
{
    private readonly IAttenderScheduleBlockService _attenderScheduleBlockService;
    private readonly ICentralTokenService _centralTokenService;
    private readonly ITokenRepository _tokenRepository;

    public AttenderScheduleBlockServiceCentral(IAttenderScheduleBlockService attenderScheduleBlockService,
        ICentralTokenService centralTokenService
        , ITokenRepository tokenRepository)
    {
        _attenderScheduleBlockService = attenderScheduleBlockService;
        _centralTokenService = centralTokenService;
        _tokenRepository = tokenRepository;
    }

    public async Task<HttpResult<IEnumerable<ResultSaveAttenderScheduleBlock>>> Save(List<AttenderScheduleModel> model,
        int companyId)
    {
        var result = new HttpResult<IEnumerable<ResultSaveAttenderScheduleBlock>>();

        var tokenModel = await _centralTokenService.GetTokenModel();

        var token = await _centralTokenService.GetToken(tokenModel);

        if (!string.IsNullOrEmpty(token.Token))
        {
            result = await _attenderScheduleBlockService.AttenderScheduleBlockSaveService(model, token.Token,
                companyId);

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

    public async Task<HttpResult<IEnumerable<ResultValidateAttenderScheduleBlock>>> Delete(string centralIds)
    {
        var result = new HttpResult<IEnumerable<ResultValidateAttenderScheduleBlock>>();

        var tokenModel = await _centralTokenService.GetTokenModel();

        var token = await _centralTokenService.GetToken(tokenModel);

        if (!string.IsNullOrEmpty(token.Token))
        {
            result = await _attenderScheduleBlockService.AttenderScheduleBlockDeleteService(centralIds, token.Token);

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

    public async Task<HttpResult<ResultQuery>> UpdateRangeTime(List<UpdateRangeTimeScheduleBlock> model, int companyId)
    {
        var result = new HttpResult<ResultQuery>();

        var tokenModel = await _centralTokenService.GetTokenModel();

        var token = await _centralTokenService.GetToken(tokenModel);

        if (!string.IsNullOrEmpty(token.Token))
        {
            result = await _attenderScheduleBlockService.AttenderScheduleBlockUpdateRangeTimeService(model, token.Token,
                companyId);

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

    //public async Task<HttpResult<IEnumerable<ResultSaveAttenderScheduleBlock>>> UpdateMedicalShift(List<AttenderScheduleModel> model, int companyId)
    //{
    //    var result = new HttpResult<IEnumerable<ResultSaveAttenderScheduleBlock>>();

    //    var tokenModel = await _centralTokenService.GetTokenModel();

    //    var token = await _centralTokenService.GetToken(tokenModel);

    //    if (!(string.IsNullOrEmpty(token.Token)))
    //    {
    //        result = await _attenderScheduleBlockService.AttenderScheduleBlockUpdateMedicalShiftService(model, token.Token.ToString(), companyId);

    //        if (result.HttpStatus == HttpStatusCode.Unauthorized)
    //        {
    //            await _tokenRepository.DeleteToken(token.Id);

    //            result.StatusMessage = "error";
    //            result.HttpStatus = HttpStatusCode.Unauthorized;
    //            result.Successfull = false;
    //            result.Data = null;
    //        }
    //        else if (result.HttpStatus == HttpStatusCode.Forbidden)
    //        {
    //            result.StatusMessage = "unauthorize";
    //            result.HttpStatus = HttpStatusCode.Unauthorized;
    //            result.Successfull = false;
    //            result.Data = null;
    //        }
    //    }
    //    else
    //    {
    //        result.StatusMessage = "error";
    //        result.HttpStatus = HttpStatusCode.Unauthorized;
    //        result.Successfull = false;
    //        result.Data = null;
    //    }

    //    return result;
    //}

    //public async Task<HttpResult<ResultQuery>> UpdateShiftName(List<UpdateShiftNameInputModel> model, int companyId)
    //{
    //    var result = new HttpResult<ResultQuery>();

    //    var tokenModel = await _centralTokenService.GetTokenModel();

    //    var token = await _centralTokenService.GetToken(tokenModel);

    //    if (!(string.IsNullOrEmpty(token.Token)))
    //    {
    //        result = await _attenderScheduleBlockService.AttenderScheduleBlockUpdateShiftNameService(model, token.Token.ToString(), companyId);
    //        if (result.HttpStatus == HttpStatusCode.Unauthorized)
    //        {
    //            await _tokenRepository.DeleteToken(token.Id);

    //            result.StatusMessage = "error";
    //            result.HttpStatus = HttpStatusCode.Unauthorized;
    //            result.Successfull = false;
    //            result.Data = null;
    //        }
    //        else if (result.HttpStatus == HttpStatusCode.Forbidden)
    //        {
    //            result.StatusMessage = "unauthorize";
    //            result.HttpStatus = HttpStatusCode.Unauthorized;
    //            result.Successfull = false;
    //            result.Data = null;
    //        }
    //    }
    //    else
    //    {
    //        result.StatusMessage = "error";
    //        result.HttpStatus = HttpStatusCode.Unauthorized;
    //        result.Successfull = false;
    //        result.Data = null;
    //    }

    //    return result;
    //}

    public async Task<HttpResult<ResultQuery>> ChangeLock(ChangeLockScheduleBlock model)
    {
        var result = new HttpResult<ResultQuery>();

        var tokenModel = await _centralTokenService.GetTokenModel();

        var token = await _centralTokenService.GetToken(tokenModel);

        if (!string.IsNullOrEmpty(token.Token))
        {
            result = await _attenderScheduleBlockService.AttenderScheduleBlockcChangeLock(model, token.Token);

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
}