using System.Data;
using System.Net;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionTaminWebService;
using ParsAlphabet.ERP.Application.Dtos.MC.ManageRequestPrescriptionTamin;
using ParsAlphabet.ERP.Application.Interfaces.MC.AdmissionServiceTamin;
using ParsAlphabet.ERP.Application.Interfaces.WebServices.SSO;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionTaminWebService;
using ParsAlphabet.WebService.Api.Model.Tamin.Common;
using ParsAlphabet.WebService.Api.Model.Tamin.EPrescription;
using ParsAlphabet.WebService.Api.Model.Tamin.Public;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.ManageRequestPrescriptionTamin;

public class ManageRequestPrescriptionTaminRepository(IConfiguration config,
    IAuthorizationParaClinicService authorizationParaClinicService,
  
    ICommonParaClinicService commonParaClinicService,
    IEPrescriptionParaClinicService ePrescriptionParaClinicService,
    IAdmissionServiceTaminRepository admissionServiceTaminRepository,
    AdmissionTaminWebServiceRepository admissionTaminWebServiceRepository
    ) :
    BaseRepository<ManageRequestPrescriptionTaminModel, int, string>(config),
    IBaseRepository<ManageRequestPrescriptionTaminModel, int, string>
{
    public async Task Save(ManageRequestPrescriptionTaminModel model)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_TaminToken_Ins]";
            conn.Open();
            await conn.ExecuteAsync(sQuery, new
            {
                model.TokenId,
                model.TokenType,
                model.TokenDateTime,
                model.CompanyId,
                model.ParaClinicTypeId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.Successfull = result.Status == 100;
        }
    }

    public async Task<string> GetToken(int companyId, byte tokenType)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<string>(sQuery, new
            {
                TableName = "mc.TaminToken",
                ColumnName = "TokenId",
                Filter = $"CompanyId={companyId} AND TokenType={tokenType}",
                OrderBy = "TokenDateTime DESC"
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }

    public async Task<string> GetTokenByParaClinicType(int companyId, string paraClinicTypeId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_TaminToken_Get]";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<string>(sQuery, new
            {
                ParaClinicTypeId = paraClinicTypeId,
                CompanyId = companyId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }

    public async Task<string> DeleteToken(byte tokenType, int companyId, string paraClinicTypeCode)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_DelRecordWithFilter";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<string>(sQuery, new
            {
                TableName = "mc.TaminToken",
                Filter = $"TokenType={tokenType} AND CompanyId={companyId} AND ParaClinicTypeId={paraClinicTypeCode}"
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }

    public async Task<ResultRequest<SetDeserveInfo>> GetDeservePatientInfo(string nationalcode)
    {
        var companyId = UserClaims.GetCompanyId();

        var token = await authorizationParaClinicService.GetTokenParaClinic(companyId, "03");

        if (token == "error")
            return new ResultRequest<SetDeserveInfo>
            {
                Data = null,
                Status = -100,
                StatusDesc = "درخواست شما به درستی انجام نشد ، مجدد تلاش فرمایید"
            };

        var responseDeserveInfo = await commonParaClinicService.GetPatientDeserveInfo(nationalcode, token, companyId);

        if (responseDeserveInfo.Status == (int)HttpStatusCode.Unauthorized)
        {
            var deleteTokenResult =
                this.DeleteToken((byte)TaminTokenType.Eprescription, companyId, "03");
            if (responseDeserveInfo.Status != 200)
                responseDeserveInfo.StatusDesc = "درخواست شما به درستی انجام نشد ، مجدد تلاش فرمایید";
        }

        return responseDeserveInfo;
    }

   
    public async Task<ResultRequest<List<SetEPrescriptionHeader>>> GetEprescriptionListByNationalCode(
        string nationalCode, string trackingCode)
    {
        var companyId = UserClaims.GetCompanyId();

        var token = await authorizationParaClinicService.GetTokenParaClinic(companyId, "03");

        var responseEprescriptionList =
            await ePrescriptionParaClinicService.GetEPrescriptionHeaderList(nationalCode, trackingCode, token,
                companyId);

        if (responseEprescriptionList.Status == 401)
        {
            var deleteTokenResult =
                this.DeleteToken((byte)TaminTokenType.Eprescription, companyId, "03");
            responseEprescriptionList.StatusDesc = "درخواست شما به درستی انجام نشد ، مجدد تلاش فرمایید";
        }

        return responseEprescriptionList;
    }

    
    public async Task<ResultRequest<SetEPrescriptionHeaderViewModel>> GetEprescriptionDetailList(
       GetEPrescriptionDetails model)
    {
        var companyId = UserClaims.GetCompanyId();

        var token = await authorizationParaClinicService.GetTokenParaClinic(companyId, model.ParaClinicTypeCode);

        var responseEprescriptionDetailList =
            await ePrescriptionParaClinicService.GetEPrescriptionDetailList(model, token, companyId);

        if (responseEprescriptionDetailList.Status == 401)
        {
            var deleteTokenResult = this.DeleteToken((byte)TaminTokenType.Eprescription,
                companyId, model.ParaClinicTypeCode);
            responseEprescriptionDetailList.StatusDesc = "درخواست شما به درستی انجام نشد ، مجدد تلاش فرمایید";
        }

        return responseEprescriptionDetailList;
    }

   
    public async Task<MyResultDataStatus<List<Tuple<int, ResultRequest<SetResultSendEprescription>>>>>
        SendEprescription( List<int> taminIds)
    {
        var finalResult = new MyResultDataStatus<List<Tuple<int, ResultRequest<SetResultSendEprescription>>>>();
        finalResult.Data = new List<Tuple<int, ResultRequest<SetResultSendEprescription>>>();

        if (!taminIds.ListHasRow())
            return new MyResultDataStatus<List<Tuple<int, ResultRequest<SetResultSendEprescription>>>>
            {
                Data = null,
                Successfull = false,
                Status = -100,
                StatusMessage = "موردی برای ارسال یافت نشد"
            };

        var companyId = UserClaims.GetCompanyId();
        var responseSendEprescription = new ResultRequest<SetResultSendEprescription>();


        foreach (var id in taminIds)
        {
            var resultAdmissionTamin = await admissionServiceTaminRepository.AdmissionServiceTaminDisplay(id);

            // Get Token By ParaclinicTypeCode
            var token = await authorizationParaClinicService.GetTokenParaClinic(companyId,
                resultAdmissionTamin.ParaClinicTypeCode);

            var details = resultAdmissionTamin.AdmissionServiceLineTamin.Select(t => new SetSendEPrescriptionDetail
            {
                ServiceTarefCode = t.ServiceTarefCode,
                TarefPrice = int.Parse(t.TaminServicePrice.ToString()),
                ServiceQuantity = t.Qty,
                ServiceTarefPrice = int.Parse(t.TaminServicePrice.ToString()),
                Is2K = t.Is2K,
                //Spiral = t.Spiral,
                Spiral = false,
                TarefTechPrice = 0,
                SumItemPrice = int.Parse(t.TaminServicePrice.ToString())
            }).ToList();

            var sendEPrescription = new SetSendEPrescription
            {
                EPrescriptionId = long.Parse(resultAdmissionTamin.RequestEPrescriptionId),
                AttenderMSC = resultAdmissionTamin.AttenderMSC,
                Month = resultAdmissionTamin.CreateMonthPersian,
                EPrescriptionPrice = details.Any(dt => dt.SumItemPrice == 0)
                    ? int.Parse(details.Sum(ts => ts.ServiceTarefPrice).ToString())
                    : int.Parse(details.Sum(ts => ts.ServiceTarefPrice).ToString()),
                ParaTypeCode = resultAdmissionTamin.ParaClinicTypeCode,
                PatientMobile = resultAdmissionTamin.PatientMobile,
                PatientNationalCode = resultAdmissionTamin.PatientNationalCode.NotNull()
                    ? resultAdmissionTamin.PatientNationalCode
                    : null,
                ServiceType = resultAdmissionTamin.ServiceTypeId.ToString(),
                TechId = "",
                PrescriptionDate = !string.IsNullOrEmpty(resultAdmissionTamin.PrescriptionDatePersian)
                    ? resultAdmissionTamin.PrescriptionDatePersian.Replace("/", "")
                    : "",
                SumPrice = int.Parse(details.Sum(ts => ts.SumItemPrice).ToString()),
                TechPrice = 0,
                CodingTermin = "",
                PrescriptionInformation =
                    resultAdmissionTamin.ParaClinicTypeCode == "02"
                        ? new SetPrescriptionInformation
                        {
                            DiagnosisCode = int.Parse(resultAdmissionTamin.DiagnosisCode),
                            DiagnosisComment = resultAdmissionTamin.DiagnosisComment,
                            GroupCode = int.Parse(resultAdmissionTamin.AdmissionServiceLineTamin[0].LaboratoryGroupCode)
                        }
                        : null,
                EPrescriptionDetails = details
            };


            responseSendEprescription = new ResultRequest<SetResultSendEprescription>();

            if (sendEPrescription.ParaTypeCode == "02")
                responseSendEprescription =
                    await ePrescriptionParaClinicService.SendLaboratoryEPrescription(sendEPrescription, token,
                        companyId);
            else
                responseSendEprescription =
                    await ePrescriptionParaClinicService.SendEPrescription(sendEPrescription, token, companyId);

            var updateTaminRegister = new UpdateAdmissionTaminResult();
            updateTaminRegister.AdmissionTaminId = id;

            if (responseSendEprescription.Status == 401)
            {
                updateTaminRegister.RegisterTaminResult = 2;

                var deleteTokenResult = this.DeleteToken((byte)TaminTokenType.Eprescription,
                    companyId, resultAdmissionTamin.ParaClinicTypeCode);

                return new MyResultDataStatus<List<Tuple<int, ResultRequest<SetResultSendEprescription>>>>
                {
                    Data = null,
                    Successfull = false,
                    Status = 401,
                    StatusMessage = "درخواست شما به درستی انجام نشد ، مجدد تلاش فرمایید"
                };
            }

            if (responseSendEprescription.Status == 200 && responseSendEprescription.Data.NotNull())
            {
                updateTaminRegister.RegisterPrescriptionId =
                    responseSendEprescription.Data.RegisterEprescriptionId.ToString();
                updateTaminRegister.RegisterTaminResult = 1;
                updateTaminRegister.RegisterTaminDatePersian = responseSendEprescription.Data.RegisterDate;
            }
            else
            {
                updateTaminRegister.RegisterTaminResult = 2;
                updateTaminRegister.RegisterTaminDatePersian = string.Empty;

                var tuple = new Tuple<int, ResultRequest<SetResultSendEprescription>>(id, responseSendEprescription);
                finalResult.Data.Add(tuple);
            }

            var resultUpdate = await admissionTaminWebServiceRepository.UpdateResultSendTamin(updateTaminRegister);
        }

        finalResult.Successfull = finalResult.Data.Count == 0;

        return finalResult;
    }

    public async Task<MyResultDataStatus<List<Tuple<int, ResultRequest<string>>>>> DeleteEPrescription(
        List<int> taminIds)
    {
        var finalResult = new MyResultDataStatus<List<Tuple<int, ResultRequest<string>>>>();
        finalResult.Data = new List<Tuple<int, ResultRequest<string>>>();

        if (!taminIds.ListHasRow())
            return new MyResultDataStatus<List<Tuple<int, ResultRequest<string>>>>
            {
                Data = null,
                Successfull = false,
                Status = -100,
                StatusMessage = "موردی برای ارسال یافت نشد"
            };

        var companyId = UserClaims.GetCompanyId();


        foreach (var id in taminIds)
        {
            var registerPrescription = await admissionServiceTaminRepository.GetRegisterPrescriptionId(id, companyId);

            var token = await authorizationParaClinicService.GetTokenParaClinic(companyId,
                registerPrescription.ParaClinicTypeCode);

            var responseDeletePrescription = new ResultRequest<string>();

            responseDeletePrescription =
                await ePrescriptionParaClinicService.DeleteEPrescriptionId(token,
                    registerPrescription.RegisterPrescriptionId, companyId);

            var deleteTaminRegister = new DeleteAdmissionTaminResult();
            deleteTaminRegister.AdmissionTaminId = id;

            if (responseDeletePrescription.Status == 401)
            {
                var deleteTokenResult = this.DeleteToken((byte)TaminTokenType.Eprescription,
                    companyId, registerPrescription.ParaClinicTypeCode);

                return new MyResultDataStatus<List<Tuple<int, ResultRequest<string>>>>
                {
                    Data = null,
                    Successfull = false,
                    Status = 401,
                    StatusMessage = "پاسخی دریافت نشد ، مجدد تلاش نمایید"
                };
            }

            if (responseDeletePrescription.Status == 200 && responseDeletePrescription.Successfull)
            {
                deleteTaminRegister.DeleteTaminResult = 1;
            }
            else
            {
                deleteTaminRegister.DeleteTaminResult = 2;

                var tuple = new Tuple<int, ResultRequest<string>>(id, responseDeletePrescription);
                finalResult.Data.Add(tuple);
            }

            var resultDelete = await admissionTaminWebServiceRepository.DeleteResultSendTamin(deleteTaminRegister);
        }

        finalResult.Successfull = finalResult.Data.Count == 0;
        return finalResult;
    }
}