using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionServiceTamin;
using ParsAlphabet.ERP.Application.Interfaces.MC.AdmissionServiceTamin;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.Service;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionServiceTamin;

public class AdmissionServiceTaminRepository : IAdmissionServiceTaminRepository
{
    private readonly IConfiguration _config;
    private readonly ServiceRepository _serviceRepository;

    public AdmissionServiceTaminRepository(IConfiguration admissionTaminConfiguration,
        ServiceRepository serviceRepository)
    {
        _config = admissionTaminConfiguration;
        _serviceRepository = serviceRepository;
    }

    public IDbConnection connection => new SqlConnection(_config.GetConnectionString("DefaultConnection"));

    public async Task<PrescriptionTaminInfo> PrescriptionTaminInfo(int id)
    {
        using (var conn = connection)
        {
            var sQuery = "[mc].[Spc_PrescriptionTaminInfo_Get]";

            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<PrescriptionTaminInfo>(sQuery, new
            {
                PrescriptionId = id
            }, commandType: CommandType.StoredProcedure);

            return result;
        }
    }

    public async Task<AdmissionServiceTaminDisplay> AdmissionServiceTaminDisplay(int id)
    {
        using (var conn = connection)
        {
            var sQuery = "[mc].[Spc_AdmissionService_Display]";

            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<AdmissionServiceTaminDisplay>(sQuery, new
            {
                Id = id
            }, commandType: CommandType.StoredProcedure);

            return result;
        }
    }

    public async Task<MyResultDataStatus<List<CalAdmissionTaminPrice>>> CalAdmissionTaminPrice(
        GetCalAdmissionTaminPrice model)
    {
        var codes = model.Services.Select(x => x.ServiceTaminCode).Distinct().ToList();
        var serviceCodeList = await _serviceRepository.GetTaminServiceId(codes);
        var result = new MyResultDataStatus<List<CalAdmissionTaminPrice>>();
        result.Data = new List<CalAdmissionTaminPrice>();

        if (serviceCodeList.Any(x => x.ServiceId == null))
        {
            var codeWithoutPrice = serviceCodeList.Where(x => x.ServiceId == null).Select(z => z.TaminCode).ToList();
            var validationError = string.Join(',', codeWithoutPrice);

            return new MyResultDataStatus<List<CalAdmissionTaminPrice>>
            {
                Successfull = false,
                Status = -101,
                ValidationErrors = new List<string> { validationError }
            };
        }

        using (var conn = connection)
        {
            var codeLen = serviceCodeList.Count;
            var sQuery = "[mc].[Spc_AdmissionService_CalPrice]";
            conn.Open();

            for (var i = 0; i < codeLen; i++)
            {
                var currentService = serviceCodeList[i];
                var qty = model.Services.FirstOrDefault(v => v.ServiceTaminCode == currentService.TaminCode).Qty;
                var resultCalPrice = await conn.QueryFirstOrDefaultAsync<CalAdmissionTaminPrice>(sQuery,
                    new
                    {
                        currentService.ServiceId,
                        Qty = qty,
                        model.BasicInsurerLineId,
                        model.CompInsurerLineId,
                        model.ThirdPartyId,
                        model.DiscountInsurerId,
                        model.AttenderId,
                        HealthClaim = 1,
                        model.MedicalSubjectId,
                        model.CompanyId
                    }, commandType: CommandType.StoredProcedure);

                resultCalPrice.ServiceId = currentService.ServiceId.Value;
                resultCalPrice.ServiceName = currentService.ServiceName;
                resultCalPrice.Qty = qty;
                result.Data.Add(resultCalPrice);
            }

            result.Successfull = true;

            conn.Close();
            return result;
        }
    }

    public async Task<List<InsurerAttenderServiceTamin>> GetInsurerAttenderService(GetInsurerAttenderServiceTamin model)
    {
        using (var conn = connection)
        {
            var sQuery = "[mc].[Spc_Check_InsurerAttenderService]";
            conn.Open();
            var result = await conn.QueryAsync<InsurerAttenderServiceTamin>(sQuery,
                new
                {
                    model.AttenderId,
                    model.MedicalSubjectId,
                    TaminCode = string.Join(',', model.TaminCode)
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result.ToList();
        }
    }

    public async Task<int> GetRequestEPrescriptionId(string eprescriptionId, int taminId, int companyId)
    {
        using (var conn = connection)
        {
            var sQuery = "[mc].[Spc_CheckExist_EPrescriptionIdTamin]";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<int>(sQuery, new
            {
                Id = taminId,
                EPrescriptionId = eprescriptionId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();


            return result;
        }
    }

    public async Task<TaminRegisterIdParaclinic> GetRegisterPrescriptionId(int admissionTaminId, int companyId)
    {
        using (var conn = connection)
        {
            var sQuery = "pb.Spc_Tables_GetTable";
            conn.Open();

            var result = await conn.QueryFirstAsync<TaminRegisterIdParaclinic>(sQuery, new
            {
                TableName = "mc.AdmissionService ",
                IdColumnName = "Id",
                ColumnNameList = @"Id,
                                       (SELECT ElementValue FROM mc.AdmissionServiceExtraProperty WHERE ElementId = 12 AND AdmissionServiceId =mc.AdmissionService.Id) RegisterPrescriptionId,
                                       (SELECT ElementValue FROM mc.AdmissionServiceExtraProperty WHERE ElementId = 14 AND AdmissionServiceId =mc.AdmissionService.Id) ParaClinicTypeCode",
                IdList = "",
                Filter = $"Id={admissionTaminId} AND CompanyId={companyId}",
                OrderBy = ""
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }

    public async Task<bool> CheckParaclinicTypeIsAcceptable(string paraclinicTypeCodes)
    {
        using (var conn = connection)
        {
            var sQuery = "mc.Spc_Check_AdmissionService_AcceptableParaClinic";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<int>(sQuery,
                new
                {
                    AcceptableService = paraclinicTypeCodes
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result > 0;
        }
    }
}