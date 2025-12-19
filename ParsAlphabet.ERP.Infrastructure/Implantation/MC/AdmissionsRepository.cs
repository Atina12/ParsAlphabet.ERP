using System.Collections;
using System.Data;
using Azure.Core;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.Central.ObjectModel.MedicalCare;
using ParsAlphabet.ERP.Application.Dtos._History;
using ParsAlphabet.ERP.Application.Dtos.MC;
using ParsAlphabet.ERP.Application.Dtos.MC.Admission;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionCash;
using ParsAlphabet.ERP.Application.Dtos.MC.Insurer;
using ParsAlphabet.ERP.Application.Dtos.MC.MedicalShiftTimeSheet;
using ParsAlphabet.ERP.Application.Dtos.MC.Service;
using ParsAlphabet.ERP.Application.Interfaces.MC;
using ParsAlphabet.ERP.Application.Interfaces.MC.AdmissionClose;
using ParsAlphabet.ERP.Application.Interfaces.MC.AdmissionCounter;
using ParsAlphabet.ERP.Application.Interfaces.MC.AdmissionMaster;
using ParsAlphabet.ERP.Application.Interfaces.Redis;
using ParsAlphabet.ERP.Infrastructure.Implantation._History;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.Admission;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionCash;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionMaster;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC;

public class AdmissionsRepository(
    IConfiguration config, IRedisService redisServer,
    AdmissionServiceRepository admissionServiceRepository,
    IHttpContextAccessor accessor,
    IAdmissionCounterRepository admissionCounter,
    HistoryRepository history,
    IAdmissionMasterRepository admissionMasterRepository,
    AdmissionCashRepository admissionCash
    ) : IAdmissionsRepository
{
    public IDbConnection Connection => new SqlConnection(config.GetConnectionString("DefaultConnection"));

    public async Task<List<MyDropDownViewModel>> AdmissionType_GetDropDown()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.AdmissionType"
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> CalculationMethodDropDown(byte itemTypeId, byte insurerTypeId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.InsurerPriceCalculationMethod",
                    Filter = $"ItemTypeId={itemTypeId} and insurerTypeId={insurerTypeId}"
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<string> CalculationMethodName(byte id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    TableName = "mc.InsurerPriceCalculationMethod",
                    ColumnName = "Name",
                    Filter = $"Id={id}"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> MedicalSubjectGetList()
    {
        var cacheMedicalSubject = new List<MyDropDownViewModel>();

        try
        {
            cacheMedicalSubject = redisServer.GetData<List<MyDropDownViewModel>>("MedicalSubjectCIS");

            if (cacheMedicalSubject.NotNull())
                return cacheMedicalSubject;

            var expirationTime = DateTimeOffset.Now.AddHours(100.0);
            cacheMedicalSubject = await GetDataMedicalSubjectGetList();
            redisServer.SetData("MedicalSubjectCIS", cacheMedicalSubject, expirationTime);
        }
        catch (Exception)
        {
            cacheMedicalSubject = await GetDataMedicalSubjectGetList();
        }

        return cacheMedicalSubject;
    }

    public async Task<List<MyDropDownViewModel>> TaminLaboratoryGroup_GetDropDown()
    {
        var cacheData = new List<MyDropDownViewModel>();

        try
        {
            cacheData = redisServer.GetData<List<MyDropDownViewModel>>("AdmissionTaminLabGroupCode");

            if (cacheData.NotNull())
                return cacheData;


            var expirationTime = DateTimeOffset.Now.AddHours(10.0);
            cacheData = await GetDataTaminLaboratoryGroupDropDown();
            redisServer.SetData("AdmissionTaminLabGroupCode", cacheData, expirationTime);
        }
        catch (Exception)
        {
            cacheData = await GetDataTaminLaboratoryGroupDropDown();
        }

        return cacheData;
    }

    public async Task<List<InsurerDropDownViewModel>> InsuranceBox_GetDropDown(int insurerId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = (await conn.QueryAsync<InsurerDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.InsurerLine",
                    Filter = $"ISNULL(InsurerId,0)={insurerId}"
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<List<InsurerDropDownViewModel>> InsuranceBoxList_GetDropDown(string insurerIds)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = (await conn.QueryAsync<InsurerDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.InsurerLine",
                    Filter = $"ISNULL(InsurerId,0) IN({insurerIds})"
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> AdmissionCounterType_GetDropDown()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.AdmissionCounterType",
                    Filter = ""
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel2>> CompInsuranceBox_GetDropDown(int companyId, bool isAlive,
        byte isActive)
    {
        var cacheCompInsurer = new List<MyDropDownViewModel2>();

        try
        {
            cacheCompInsurer = redisServer.GetData<List<MyDropDownViewModel2>>("compInsureradmission");

            if (!isAlive)
            {
                if (cacheCompInsurer.NotNull())
                    return cacheCompInsurer;

                cacheCompInsurer = await GetDataCompInsuranceBox(companyId, isAlive, isActive);

                var expirationTime = DateTimeOffset.Now.AddHours(10.0);
                redisServer.SetData("compInsureradmission", cacheCompInsurer, expirationTime);
            }
            else
            {
                cacheCompInsurer = await GetDataCompInsuranceBox(companyId, isAlive, isActive);
            }
        }
        catch (Exception)
        {
            cacheCompInsurer = await GetDataCompInsuranceBox(companyId, isAlive, isActive);
        }

        return cacheCompInsurer;
    }

    public async Task<List<MyDropDownViewModel>> Speciality_GetDropDown()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.Speciality"
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> Role_GetDropDown()
    {
        var cacheRole = new List<MyDropDownViewModel>();
        try
        {
            cacheRole = redisServer.GetData<List<MyDropDownViewModel>>("Role");
            if (cacheRole.ListHasRow())
                return cacheRole;

            cacheRole = await GetRoleDropDown();

            var expirationTime = DateTimeOffset.Now.AddHours(10.0);
            redisServer.SetData("Role", cacheRole, expirationTime);
        }
        catch (Exception)
        {
            cacheRole = await GetRoleDropDown();
        }

        return cacheRole;
    }

    public async Task<List<MyDropDownViewModel>> GetThrServiceDropDown(string term)
    {
        var filter = string.Empty;

        if (!string.IsNullOrEmpty(term))
            filter =
                $"Code Like N'%{term}%' OR Id={(int.TryParse(term, out _) ? term : "0")} OR Name Like N'%{term}%' AND IsActive=1 ";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrRVU",
                    TitleColumnName = "CAST(ISNULL(Code,'') AS varchar(10)) + '-' + ISNULL(Name,'')",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetThrCdtServiceDropDown(string term)
    {
        var filter = string.Empty;

        if (!string.IsNullOrEmpty(term))
            filter =
                $"Code Like N'%{term}%' OR Id={(int.TryParse(term, out _) ? term : "0")} OR Name Like N'%{term}%' OR Description Like N'%{term}%' AND IsActive=1 ";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrCDT",
                    TitleColumnName = "CAST(ISNULL(Code,'') AS varchar(10)) + '-' + ISNULL(Name,'')",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetTaminServiceDropDown(string term)
    {
        var filter = string.Empty;

        if (!string.IsNullOrEmpty(term))
            filter =
                $"TAREF_CODE Like N'%{term}%' OR Id={(int.TryParse(term, out _) ? term : "0")} OR SERVICE_NAME Like N'%{term}%' AND IsActive=1";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.taminService",
                    TitleColumnName = "CAST(Id AS varchar) + '/' + TAREF_CODE + '-' + ISNULL(SERVICE_NAME,'')",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetThrSpecialityDropDown(string term)
    {
        var filter = string.Empty;

        if (!string.IsNullOrEmpty(term))
            filter = $"Code='{(int.TryParse(term, out _) ? term : "0")}' OR Name Like N'%{term}%' AND IsActive=1 ";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrSPECIALTY",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel2>> GetThrServiceTypeDropDown()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel2>(sQuery,
                new
                {
                    TableName = "mc.thrServiceType",
                    Filter = " IsActive=1 "
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<string> GetThrSpecialityName(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    TableName = "mc.thrSPECIALTY",
                    ColumnName = "Name",
                    Filter = $"Id={id} AND IsActive=1 "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> MSCType_GetDropDown()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.MSCType"
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> PatientRefferalType_GetDropDown()
    {
        var cacheData = new List<MyDropDownViewModel>();

        try
        {
            cacheData = redisServer.GetData<List<MyDropDownViewModel>>("PatientReferralTypeCISList");

            if (cacheData.NotNull())
                return cacheData;


            cacheData = await GetDataPatientRefferalTypeDropDown();

            var expirationTime = DateTimeOffset.Now.AddHours(10.0);
            redisServer.SetData("PatientReferralTypeCISList", cacheData, expirationTime);
        }
        catch (Exception)
        {
            cacheData = await GetDataPatientRefferalTypeDropDown();
        }

        return cacheData;
    }

    public async Task<List<MyDropDownViewModel>> EliminateHIDReason_GetDropDown(string displaymode)
    {
        var cacheEliminateReasonList = new List<MyDropDownViewModel>();

        try
        {
            cacheEliminateReasonList = redisServer.GetData<List<MyDropDownViewModel>>("EliminateReasonCISList");

            if (cacheEliminateReasonList.NotNull())
                return cacheEliminateReasonList;

            cacheEliminateReasonList = await GetDataEliminateHIDReasonDropDown(displaymode);

            var expirationTime = DateTimeOffset.Now.AddHours(10.0);
            redisServer.SetData("EliminateReasonCISList", cacheEliminateReasonList, expirationTime);
        }
        catch (Exception)
        {
            cacheEliminateReasonList = await GetDataEliminateHIDReasonDropDown(displaymode);
        }

        return cacheEliminateReasonList;
    }

    public async Task<List<MyDropDownViewModel>> AppointmentDistributionTypeGetDropDown()
    {
        var cache = new List<MyDropDownViewModel>();

        try
        {
            cache = redisServer.GetData<List<MyDropDownViewModel>>("AppointmentDistributionTypeList");

            if (cache.NotNull())
                return cache;

            cache = await GetDataAppointmentDistributionType();

            var expirationTime = DateTimeOffset.Now.AddHours(100.0);
            redisServer.SetData("AppointmentDistributionTypeList", cache, expirationTime);
        }
        catch (Exception)
        {
            cache = await GetDataAppointmentDistributionType();
        }

        return cache;
    }

    public async Task<IEnumerable<ServiceGroupDropDown>> GetDropDownServiceType(string type)
    {
        string filter = $"[{type}]<>'0' AND IsActive=1 ",
            idColumnName = $"[{type}]",
            titleColumnName = $"[{type}]",
            groupBy = $"[{type}]",
            orderBy = $"[{type}]  ";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList_GroupBy";
            conn.Open();

            var result = (await conn.QueryAsync<ServiceGroupDropDown>(sQuery,
                new
                {
                    TableName = "mc.thrRVU",
                    IdColumnName = idColumnName,
                    TitleColumnName = titleColumnName,
                    Filter = filter,
                    OrderBy = orderBy,
                    GroupBy = groupBy
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> GetServiceByType(string type, string term)
    {
        var typeArray = type.Split('*');

        var filter =
            $"[{typeArray[0]}]=N'{typeArray[1]}' AND (Id='{(short.TryParse(term, out _) ? term : "0")}' OR Name Like N'%{term}%') AND IsActive=1 ";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrRVU",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<MyDropDownViewModel2> GetThrOrganization(byte id)
    {
        var cacheThrOrgList = new List<MyDropDownViewModel2>();
        var cacheThrOrg = new MyDropDownViewModel2();

        try
        {
            cacheThrOrgList = redisServer.GetData<List<MyDropDownViewModel2>>("ThrOrganizationCIS");

            if (cacheThrOrgList.ListHasRow())
            {
                cacheThrOrg = cacheThrOrgList.FirstOrDefault(thr => thr.Id == id.ToString());
                return cacheThrOrg;
            }

            cacheThrOrgList = await GetDataThrOrganization();

            var expirationTime = DateTimeOffset.Now.AddHours(10.0);
            redisServer.SetData("ThrOrganizationCIS", cacheThrOrgList, expirationTime);

            cacheThrOrg = cacheThrOrgList.FirstOrDefault(thr => thr.Id == id.ToString());
        }
        catch (Exception)
        {
            cacheThrOrgList = await GetDataThrOrganization();
            cacheThrOrg = cacheThrOrgList.FirstOrDefault(thr => thr.Id == id.ToString());
        }

        return cacheThrOrg;
    }

    public async Task<SetupClientTamin> GetSetupClientTamin(int companyId, byte clientType, string paraTypeId)
    {
        var setupClientTaminList = new List<SetupClientTamin>();
        var setupClientTamin = new SetupClientTamin();

        try
        {
            setupClientTaminList = redisServer.GetData<List<SetupClientTamin>>("SetupClientTamin");

            if (setupClientTaminList.ListHasRow())
            {
                setupClientTamin = setupClientTaminList.FirstOrDefault(x =>
                    x.AcceptableParaClinicTypeId == paraTypeId && x.ClientType == clientType &&
                    x.CompanyId == companyId);
                return setupClientTamin;
            }

            setupClientTaminList = await GetDataSetupClientTamin(companyId, clientType, paraTypeId);
            var expirationTime = DateTimeOffset.Now.AddHours(10.0);
            redisServer.SetData("SetupClientTamin", setupClientTaminList, expirationTime);

            setupClientTamin = setupClientTaminList.FirstOrDefault(x =>
                x.AcceptableParaClinicTypeId == paraTypeId && x.ClientType == clientType && x.CompanyId == companyId);
            return setupClientTamin;
        }
        catch (Exception)
        {
            setupClientTaminList = await GetDataSetupClientTamin(companyId, clientType, paraTypeId);
            setupClientTamin = setupClientTaminList.FirstOrDefault(x =>
                x.AcceptableParaClinicTypeId == paraTypeId && x.ClientType == clientType && x.CompanyId == companyId);
            return setupClientTamin;
        }
    }

    public async Task<byte> GetAttenderRoleId(string code)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<byte>(sQuery,
                new
                {
                    TableName = "mc.AttenderRole",
                    ColumnName = "Id",
                    Filter = $"Code='{code}'"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<short> GetSpecialityId(string code)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<short>(sQuery,
                new
                {
                    TableName = "mc.thrSPECIALTY",
                    ColumnName = "Id",
                    Filter = $"Code='{code}' AND IsActive=1 "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<string> GetSpecialityName(short id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    TableName = "mc.Speciality",
                    ColumnName = "Name",
                    Filter = $"Id={id}"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<string> GetTaminServiceName(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    TableName = "mc.taminService",
                    ColumnName = "SERVICE_NAME",
                    Filter = $"Id={id} AND IsActive=1 "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<string> GetThrRVUName(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    TableName = "mc.thrRVU",
                    ColumnName = "Name",
                    Filter = $"Id={id} AND IsActive=1 "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<string> GetThrCDTName(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    TableName = "mc.thrCDT",
                    ColumnName = "Name",
                    Filter = $"Id={id} AND IsActive=1 "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<TaminServicePrescription> GetTaminServicePrescription(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetRecord";
            var result = await conn.QueryFirstOrDefaultAsync<TaminServicePrescription>(sQuery, new
            {
                TableName = "mc.taminServicePrescription",
                Filter = $"Id={id} AND IsActive=1 "
            }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<List<TaminServicePrescription>> GetTaminServicePrescriptionList()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetTable";
            var result = await conn.QueryAsync<TaminServicePrescription>(sQuery, new
            {
                IsSecondLang = false,
                TableName = "mc.taminServicePrescription",
                IdColumnName = "Id",
                ColumnNameList =
                    "Id,Name,Code,TaminPrescriptionTypeId ,TaminPrescriptionTypeName ,Status,PrescriptionTypeId,BimSw,GCode,WsCode,ParaclinicTareffCode",
                IdList = "",
                Filter = "  IsActive=1 ",
                OrderBy = ""
            }, commandType: CommandType.StoredProcedure);

            var list = result.AsList();
            return list;
        }
    }

    public async Task<string> GetTaminPlanCode(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            var result = await conn.QueryFirstOrDefaultAsync<string>(sQuery, new
            {
                TableName = "mc.taminPlan",
                ColumnName = "Code",
                Filter = $"Id={id} AND IsActive=1"
            }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<string> GetTaminDrugAmountCode(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            var result = await conn.QueryFirstOrDefaultAsync<string>(sQuery, new
            {
                TableName = "mc.taminDrugAmount",
                ColumnName = "Code",
                Filter = $"Id={id} AND IsActive=1 "
            }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<string> GetTaminDrugInstructionCode(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            var result = await conn.QueryFirstOrDefaultAsync<string>(sQuery, new
            {
                TableName = "mc.taminDrugInstruction",
                ColumnName = "Code",
                Filter = $"Id={id} AND IsActive=1 "
            }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<string> GetTaminDrugUsageCode(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            var result = await conn.QueryFirstOrDefaultAsync<string>(sQuery, new
            {
                TableName = "mc.taminDrugUsage",
                ColumnName = "Code",
                Filter = $"Id={id} AND IsActive=1 "
            }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public List<MyDropDownViewModel> IsOfflineBookingUnLimit_GetDropdown()
    {
        return new List<MyDropDownViewModel>
        {
            new() { Id = 1, Name = "غیرفعال" },
            new() { Id = 2, Name = "نامحدود" },
            new() { Id = 3, Name = "محدود" }
        };
    }

    public List<MyDropDownViewModel> IsOnlineBookingUnLimit_GetDropdown()
    {
        return new List<MyDropDownViewModel>
        {
            new() { Id = 1, Name = "غیرفعال" },
            new() { Id = 2, Name = "محدود" }
        };
    }

    public async Task<MyResultPage<List<MedicalTimeShiftDisplay>>> DisplayScheduleBlock(NewGetPageViewModel model)
    {
        try
        {
            var attenderTimeSheetIds =
                model.Form_KeyValue[0]?.ToString() != null ? model.Form_KeyValue[0]?.ToString() : null;
            var medicalShiftTimeSheetIds =
                model.Form_KeyValue[1]?.ToString() != null ? model.Form_KeyValue[1]?.ToString() : null;
            var standardTimeSheetIds = model.Form_KeyValue[2] != null ? model.Form_KeyValue[2]?.ToString() : null;
            var departmentTimeShiftIds =
                model.Form_KeyValue[3]?.ToString() != null ? model.Form_KeyValue[3]?.ToString() : null;
            var attenderIds = model.Form_KeyValue[4]?.ToString() != null ? model.Form_KeyValue[4]?.ToString() : null;
            var fiscalYearId = model.Form_KeyValue[5]?.ToString() != null ? model.Form_KeyValue[5]?.ToString() : null;
            var branchId = model.Form_KeyValue[6]?.ToString() != null ? model.Form_KeyValue[6]?.ToString() : null;
            var dayInWeek = model.Form_KeyValue[7]?.ToString() != null ? model.Form_KeyValue[7]?.ToString() : null;

            int.TryParse((model.Form_KeyValue[8]?.ToString()) ?? null, out int hasPatient);

            var fromAppointmentDate =
                Convert.ToDateTime(model.Form_KeyValue[9]?.ToString() != null
                    ? model.Form_KeyValue[9]?.ToString()
                    : null);

            DateTime? toAppointmentDate = null;
            var toStr = model.Form_KeyValue[10]?.ToString();

            if (!string.IsNullOrWhiteSpace(toStr) && DateTime.TryParse(toStr, out var td))
                toAppointmentDate = td;

            if (toAppointmentDate.HasValue && toAppointmentDate.Value < new DateTime(1753, 1, 1))
                toAppointmentDate = null;

            var departmentId = model.Form_KeyValue[11]?.ToString() != null ? model.Form_KeyValue[11]?.ToString() : null;
            var fromTime = model.Form_KeyValue[12]?.ToString() != null ? model.Form_KeyValue[12]?.ToString() : null;
            var formType = model.Form_KeyValue[13]?.ToString() != null ? model.Form_KeyValue[13]?.ToString() : null;

            var result = new MyResultPage<List<MedicalTimeShiftDisplay>>();

            byte? dayInWeekFilter = null;

            if (model.Filters.Any(x => x.Name == "dayName"))
                dayInWeekFilter =
                    DayOfWeekToMiladi(Convert.ToByte(model.Filters.FirstOrDefault(x => x.Name == "dayName").Value));

            dayInWeek = Convert.ToString(dayInWeekFilter != null ? dayInWeekFilter : dayInWeek);

            if (model.Filters.Any(x => x.Name == "appointmentDatePersian"))
            {
                fromAppointmentDate =
                    (DateTime)model.Filters.FirstOrDefault(x => x.Name == "appointmentDatePersian").Value.Split('-')[0]
                        .ToMiladiDateTime();
                toAppointmentDate =
                    (DateTime)model.Filters.FirstOrDefault(x => x.Name == "appointmentDatePersian").Value.Split('-')[1]
                        .ToMiladiDateTime();
            }


            if (model.Filters.Any(x => x.Name == "hasPatient"))
                switch (model.Filters.FirstOrDefault(x => x.Name == "hasPatient").Value.ToString())
                {
                    case "1":
                        hasPatient = 1;
                        break;
                    case "2":
                        hasPatient = 0;
                        break;
                    case "3":
                        //hasPatient = null;
                        hasPatient = 0;
                        break;
                }

            var toTime = "";

            if (model.Filters.Any(x => x.Name == "time"))
            {
                fromTime = model.Filters.FirstOrDefault(x => x.Name == "time").Value.Split('-')[0];
                toTime = model.Filters.FirstOrDefault(x => x.Name == "time").Value.Split('-')[1];
            }

            bool? isOnline = null;

            if (model.Filters.Any(x => x.Name == "appointmentTypeName"))
                //1-"آنلاین" ->sp:1
                //2- "حضوری"->sp:0
                isOnline = model.Filters.FirstOrDefault(x => x.Name == "appointmentTypeName").Value == "1";

            using var conn = Connection;
            var sQuery = "[mc].[Spc_AttenderScheduleBlock_Filter_GetPage]";

            var parameters = new DynamicParameters();
            parameters.Add("PageNo", model.PageNo);
            parameters.Add("PageRowsCount", model.PageRowsCount);
            parameters.Add("Id");
            parameters.Add("AttenderTimeSheetIds", attenderTimeSheetIds);
            parameters.Add("DepartmentTimeShiftIds", departmentTimeShiftIds);
            parameters.Add("FiscalYearId", fiscalYearId);
            parameters.Add("BranchId",
                model.Filters.Any(x => x.Name == "branch")
                    ? model.Filters.FirstOrDefault(x => x.Name == "branch").Value
                    : branchId);
            parameters.Add("DepartmentId",
                model.Filters.Any(x => x.Name == "department")
                    ? model.Filters.FirstOrDefault(x => x.Name == "department").Value
                    : departmentId);
            parameters.Add("AttenderIds",
                model.Filters.Any(x => x.Name == "attender")
                    ? model.Filters.FirstOrDefault(x => x.Name == "attender").Value
                    : attenderIds);
            parameters.Add("ShiftName");
            parameters.Add("FromAppointmentDate", fromAppointmentDate);
            parameters.Add("ToAppointmentDate", toAppointmentDate);

            parameters.Add("FromTime", fromTime);
            parameters.Add("ToTime", toTime == "" ? null : toTime);
            parameters.Add("IsOnline", isOnline);
            parameters.Add("AppointmentDistributionTypeId");
            parameters.Add("IsOfflineBookingUnlimit",
                model.Filters.Any(x => x.Name == "offlineBookingUnLimitTitle")
                    ? model.Filters.FirstOrDefault(x => x.Name == "offlineBookingUnLimitTitle").Value
                    : null);
            parameters.Add("IsOnlineBookingUnLimit",
                model.Filters.Any(x => x.Name == "onlineBookingUnLimitTitle")
                    ? model.Filters.FirstOrDefault(x => x.Name == "onlineBookingUnLimitTitle").Value
                    : null);
            parameters.Add("Locked");
            parameters.Add("HasPatient", hasPatient);
            parameters.Add("DayInWeek", Convert.ToByte(dayInWeek) > 0 ? dayInWeek : null);

            conn.Open();
            result.Columns = GetColumnsMedicalTimeShiftDisplay(formType);

            result.Data =
                (await conn.QueryAsync<MedicalTimeShiftDisplay>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();

            conn.Close();

            return result;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    public async Task<List<ConvertAttenderScheduleBlockFromCentral>> ConvertAttenderScheduleBlockFromCentral(
        List<ResultValidateAttenderScheduleBlock> modelList)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AttenderScheduleBlockValidation_ConvertFromCentral]";

            var centralScheduleBlockObjectList = from s in modelList
                select new
                {
                    s.CentralId,
                    s.PatientId,
                    s.PatientFullName,
                    s.PatientNationalCode,
                    s.AdmissionId,
                    s.ReserveDateTime,
                    s.AttenderId,
                    s.AttenderFullName
                };

            conn.Open();

            var result = await conn.QueryAsync<ConvertAttenderScheduleBlockFromCentral>(sQuery,
                new
                {
                    CentralScheduleBlockObjectJson = JsonConvert.SerializeObject(centralScheduleBlockObjectList)
                }, commandTimeout: 180, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result.AsList();
        }
    }

    public async Task<MemoryStream> ExportCsvScheduleBlock(NewGetPageViewModel model)
    {
        var formType = model.Form_KeyValue[14] != null ? model.Form_KeyValue[14].ToString() : "";
        var csvGenerator = new Csv();
        var csvStream = new MemoryStream();

        var getPage = await DisplayScheduleBlock(model);
        var dataColumns = getPage.Columns;

        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                GetColumnsMedicalTimeShiftDisplay(formType).DataColumns.Where(x => x.IsDtParameter)
                    .Select(z => z.Title))
        };


        if (formType == "departmentTimeShift")
            result.Rows = from p in getPage.Data
                select new
                {
                    p.FiscalYear,
                    p.Branch,
                    p.Department,
                    p.Attender,
                    p.DepartmentTimeShift,
                    p.DayName,
                    p.AppointmentDatePersian,
                    p.OfflineBookingUnLimitTitle,
                    p.OnlineBookingUnLimitTitle,
                    p.ReserveNo,
                    p.BookingDatePersian,
                    p.Patient,
                    HasPatient = p.HasPatient ? "دارد" : "ندارد",
                    p.Time,
                    p.RangeTime
                };
        else
            result.Rows = from p in getPage.Data
                select new
                {
                    p.DayName,
                    p.AppointmentDatePersian,
                    p.ReserveNo,
                    p.BookingDatePersian,
                    p.Patient,
                    HasPatient = p.HasPatient ? "دارد" : "ندارد",
                    p.Time,
                    p.RangeTime,
                    p.AppointmentTypeName,
                    p.NationalCode,
                    p.ReserveDateTimePersian
                };

        var columns = dataColumns.DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title)
            .ToList();

        csvStream = await csvGenerator.GenerateCsv(result.Rows, columns);

        return csvStream;
    }

    public List<MyDropDownViewModel> IsPatient_GetDropdown()
    {
        return new List<MyDropDownViewModel>
        {
            new() { Id = 1, Name = "رزرو شده ها" },
            new() { Id = 2, Name = "آزاد" },
            new() { Id = 3, Name = "همه" }
        };
    }


    public async Task<bool> CheckValidation(int? id, bool isMaster)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionMaster_GetSettlement]";
            conn.Open();
            var result = await conn.QueryAsync<AdmissionCashDetailInfo>(sQuery, new
            {
                Id = id
            }, commandType: CommandType.StoredProcedure);

            conn.Close();


            if (isMaster && result.Any(x => x.Type != 1 && x.MedicalRevenue == 1)) return true;

            return result.Any(x =>
                x.AdmissionMasterSettlement == 0 && x.MedicalRevenue != 1 &&
                (x.WorkflowCategoryId == 14 || x.WorkflowCategoryId == 10));
        }
    }

    public async Task<List<MyDropDownViewModel>> GetDataMedicalSubjectGetList()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.MedicalSubject"
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> AdmissionState_GetDropDown()
    {
        var cacheAdmissionState = new List<MyDropDownViewModel>();

        try
        {
            cacheAdmissionState = redisServer.GetData<List<MyDropDownViewModel>>("AdmissionStateCIS");

            if (cacheAdmissionState.NotNull())
                return cacheAdmissionState;

            var expirationTime = DateTimeOffset.Now.AddHours(10.0);
            cacheAdmissionState = await GetDataAdmissionStateDropDown();
            redisServer.SetData("AdmissionStateCIS", cacheAdmissionState, expirationTime);
        }
        catch (Exception)
        {
            cacheAdmissionState = await GetDataAdmissionStateDropDown();
        }

        return cacheAdmissionState;
    }

    public async Task<List<MyDropDownViewModel>> GetDataAdmissionStateDropDown()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.AdmissionState"
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetDataTaminLaboratoryGroupDropDown()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.taminServiceGroup",
                    Filter = " IsActive=1 "
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel2>> GetDataCompInsuranceBox(int companyId, bool isAlive, byte isActive)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].Spc_CompInsurerLine_GetList";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    CompanyId = companyId,
                    Alive = isAlive,
                    IsActive = isActive
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            var list = JsonConvert.DeserializeObject<List<MyDropDownViewModel2>>(result);
            return list;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetRoleDropDown()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.AttenderRole"
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetDataPatientRefferalTypeDropDown()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.PatientReferralType"
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetDataEliminateHIDReasonDropDown(string displaymode)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.EliminateHIDReason",
                    Filter = $"IsAdm={(displaymode == "adm" ? 1 : 0)}"
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetDataAppointmentDistributionType()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.AppointmentDistributionType",
                    Filter = "IsActive=1"
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel2>> GetDataThrOrganization()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = await conn.QueryAsync<MyDropDownViewModel2>(sQuery,
                new
                {
                    TableName = "mc.thrORGANIZATION",
                    IdColumnName = "Code",
                    TitleColumnName = "Value",
                    Filter = " IsActive=1 "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result.AsList();
        }
    }

    public async Task<List<SetupClientTamin>> GetDataSetupClientTamin(int companyId, byte clientType, string paraTypeId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AcceptableSetupClientTamin_List]";
            conn.Open();
            var result = await conn.QueryAsync<SetupClientTamin>(sQuery, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result.AsList();
        }
    }

    public GetColumnsViewModel GetColumnsMedicalTimeShiftDisplay(string formType)
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new() { Id = "id", Title = "شناسه", IsPrimary = true },
                new()
                {
                    Id = "fiscalYear", Title = "سال مالی", IsPrimary = true, Type = (int)SqlDbType.Int,
                    IsDtParameter = formType == "departmentTimeShift", FilterType = "number", Width = 7
                },
                new()
                {
                    Id = "branch", Title = "شعبه", Type = (int)SqlDbType.SmallInt, Size = 30,
                    IsDtParameter = formType == "departmentTimeShift", IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/GN/BranchApi/getdropdown", Width = 7
                },
                new()
                {
                    Id = "department", Title = "دپارتمان", Type = (int)SqlDbType.SmallInt, Size = 30,
                    IsDtParameter = formType == "departmentTimeShift", IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/HR/OrganizationalDepartmentApi/getdropdown", Width = 7
                },
                new()
                {
                    Id = "attender", Title = "طبیب", IsPrimary = true, Type = (int)SqlDbType.Int,
                    IsDtParameter = formType == "departmentTimeShift", IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/MC/AttenderApi/getdropdown", Width = 7
                },
                new()
                {
                    Id = "departmentTimeShift", Title = "شیفت کاری", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = formType == "departmentTimeShift", Width = 9
                },
                new()
                {
                    Id = "dayName", Title = "روزهفته", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/PB/PublicApi/getdropdowndays", Width = 5
                },
                new()
                {
                    Id = "appointmentDatePersian", Title = "تاریخ روزکاری", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 7, IsFilterParameter = true, FilterType = "doublepersiandate"
                },

                new()
                {
                    Id = "offlineBookingUnLimitTitle", Title = " محدودیت  حضوری", Type = (int)SqlDbType.TinyInt,
                    IsFilterParameter = true, IsDtParameter = formType == "departmentTimeShift", Width = 8,
                    FilterType = "select2",
                    FilterTypeApi = "/api/MC/AttenderTimeSheetLineApi/getdropDown_offlinebookingunlimit"
                },
                new()
                {
                    Id = "onlineBookingUnLimitTitle", Title = " محدودیت  غیر حضوری", Type = (int)SqlDbType.TinyInt,
                    IsFilterParameter = true, IsDtParameter = formType == "departmentTimeShift", Width = 8,
                    FilterType = "select2",
                    FilterTypeApi = "/api/MC/AttenderTimeSheetLineApi/getdropDown_onlinebookingunlimit"
                },
                new()
                {
                    Id = "reserveNo", Title = "شماره رزرو نوبت ", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Width = 7
                },
                new()
                {
                    Id = "bookingDatePersian", Title = "بازه مجاز نوبت غیرحضوری", IsPrimary = true,
                    Type = (int)SqlDbType.NVarChar, Size = 10, IsDtParameter = formType != "attenderTimeSheetTransform",
                    Width = 6
                },
                new()
                {
                    Id = "patient", Title = "مراجعه کننده", Type = (int)SqlDbType.NVarChar, Size = 101,
                    IsDtParameter = true, Width = 13
                },
                new()
                {
                    Id = "hasPatient", Title = "رزرو شده ها", Type = (int)SqlDbType.Bit, IsDtParameter = true,
                    Width = 8, Align = "center", IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/AdmissionsApi/ispatient_getdropdown"
                },

                new()
                {
                    Id = "time", Title = "زمان", Type = (int)SqlDbType.Time, Size = 101, IsDtParameter = true,
                    Width = 7, IsFilterParameter = true, FilterType = "time"
                },
                new()
                {
                    Id = "rangeTime", Title = "مدت زمان (دقیقه)", Type = (int)SqlDbType.Time, Size = 101,
                    IsDtParameter = formType != "attenderTimeSheetTransform", Width = 4
                },
                new()
                {
                    Id = "appointmentTypeName", Title = "نوع نوبت", Type = (int)SqlDbType.NVarChar, Size = 101,
                    IsDtParameter = formType != "departmentTimeShift", Width = 6, IsFilterParameter = true,
                    FilterType = "select2",
                    FilterTypeApi = "/api/MC/AttenderTimeSheetLineApi/appointmenttype_getdropdown"
                },
                new()
                {
                    Id = "nationalCode", Title = "کدملی", Type = (int)SqlDbType.NVarChar, Size = 101,
                    IsDtParameter = formType == "attenderTimesheetLine", Width = 10
                },
                new()
                {
                    Id = "reserveDateTimePersian", Title = "تاریخ رزرو", Type = (int)SqlDbType.NVarChar, Size = 101,
                    IsDtParameter = formType == "attenderTimesheetLine", Width = 10
                }
            }
        };

        return list;
    }

    public async Task<MyResultDataQuery<AdmissionResultQuery>> InsertAdmission(ParsAlphabet.ERP.Application.Dtos.MC.Admission.AdmissionModel model)
    {

        var result = new MyResultDataQuery<AdmissionResultQuery>();

        model.CompanyId = UserClaims.GetCompanyId();
        model.CreateUserId = UserClaims.GetUserId(); ;

        var counter = await admissionCounter.GetRecordByUserId(model.CreateUserId, model.CompanyId);
        model.BranchId = counter.Data.BranchId;
        var roleId = UserClaims.GetRoleId(); ;

        #region validateAdmission

        var admissionPermissionModel = new AdmissionCheckPermissionViewModel
        {
            Id = model.Id,
            RoleId = roleId,
            BranchId = model.BranchId,
            WorkflowId = model.WorkflowId,
            StageId = model.StageId,
            ActionId = model.ActionId,
            CompanyId = model.CompanyId
        };
        var validateAdmissionResult =
            await admissionMasterRepository.ValidateCheckAdmissionPermission(admissionPermissionModel);

        #endregion

        #region validateAdmissionMaster

        var masterModel = new AdmissionCheckPermissionViewModel
        {
            Id = model.AdmissionMasterId,
            RoleId = roleId,
            BranchId = model.BranchId,
            WorkflowId = model.AdmissionMasterWorkflowId,
            StageId = model.AdmissionMasterStageId,
            ActionId = model.AdmissionMasterActionId,
            CompanyId = model.CompanyId
        };

        var validateAdmissionMasterResult =
            await admissionMasterRepository.ValidateCheckAdmissionMasterPermission(masterModel);

        #endregion

        if (validateAdmissionResult != "" || validateAdmissionMasterResult != "")
        {
            result.Successfull = false;

            result.ValidationErrors.Add(validateAdmissionResult);
            result.ValidationErrors.Add(validateAdmissionMasterResult);

            result.ValidationErrors.RemoveAll(x => x == "");
            return result;
        }

        result = await admissionServiceRepository.Insert(model, true);

        MyClaim.Init(accessor);
        var ipAdrress = MyClaim.IpAddress;

        var serviceIds = model.AdmissionLineServiceList.Select(x => x.ServiceId.ToString());
        var userAgent = new UserAgent(accessor.HttpContext?.Request.Headers["User-Agent"]);
        var historyModel = new HistoryModel
        {
            ControllerName = "AdmissionApiController",
            ActionName = nameof(InsertAdmission),
            Browser = userAgent.Browser.NameAndVersion,
            CompanyId = model.CompanyId,
            Description = $@"AdmissionId:{result.Data.Id}
                                _AdmissionTypeId:{model.AdmissionTypeId}
                                _UserId:{model.CreateUserId}
                                _AttenderId:{model.AttenderId}
                                _ServiceIds:{string.Join(',', serviceIds)}
                                _PatientId:{model.AdmissionPatient.Id}
                                _PatientFullName:{model.AdmissionPatient.FirstName + " " + model.AdmissionPatient.LastName}
                                _PatientNationalCode:{model.AdmissionPatient.NationalCode}",
            UserId = model.CreateUserId,
            IpAddress = ipAdrress,
            OperatingSystem = userAgent.OS.NameAndVersion
        };

        var resultHistory = await history.Insert(historyModel);
        return result;
    }

    public async Task<MyResultDataQuery<MyResultStatus>> InsertAdmissionCashLine(
       AdmissionCashLineModel model)
    {
       
            var result = new MyResultDataQuery<MyResultStatus>();
            MyClaim.Init(accessor);
            var ipAdrress = MyClaim.IpAddress;


            model.CompanyId = UserClaims.GetCompanyId();
            model.CreateUserId = UserClaims.GetUserId();
        

            var counter = await admissionCounter.GetRecordByUserId(model.CreateUserId, model.CompanyId);
            model.BranchId = counter.Data.BranchId;


            model.AdmissionLineCashList.Where(cl => cl.UserId == 0).AsList()
                .ForEach(u => u.UserId = model.CreateUserId);
            var cashAmount = model.AdmissionLineCashList.Sum(x => x.InOut == 1 ? x.Amount : -x.Amount);
            var roleId = UserClaims.GetRoleId();
            ;

            #region validateAdmissionCashLine

            var admissionCashLinePermissionModel = new AdmissionCheckPermissionViewModel
            {
                Id = model.Id,
                RoleId = roleId,
                BranchId = model.BranchId,
                WorkflowId = model.WorkflowId,
                StageId = model.StageId,
                ActionId = 28,
                CompanyId = model.CompanyId
            };

            var validateAdmissionCadhLineResult =
                await admissionCash.ValidateCashLinePermission(admissionCashLinePermissionModel);

            #endregion

            if (validateAdmissionCadhLineResult != "")
            {
                result.Successfull = false;
                result.Message = validateAdmissionCadhLineResult;
                result.ValidationErrors.Add(validateAdmissionCadhLineResult);
                return result;
            }

            result = await admissionServiceRepository.InsertAdmissionCashLine(model);


            if (result.Successfull)
            {
                var userAgent = new UserAgent(accessor.HttpContext?.Request.Headers["User-Agent"]);
                var historyModel = new HistoryModel
                {
                    ControllerName = "AdmissionApiController",
                    ActionName = nameof(InsertAdmissionCashLine),
                    Browser = userAgent.Browser.NameAndVersion,
                    CompanyId = model.CompanyId,
                    Description = $@"CashId:{result.Data.Id}_UserId:{model.CreateUserId}
                                    _AdmissionMasterId:{model.AdmissionMasterId}
                                    _WorkflowId:{model.WorkflowId}
                                    _StageId:{model.StageId}
                                    _CashAmount:{cashAmount}",
                    UserId = model.CreateUserId,
                    IpAddress = ipAdrress,
                    OperatingSystem = userAgent.OS.NameAndVersion
                };

                await history.Insert(historyModel);
            }


            return result;
        }


    public async Task<MyResultDataQuery<AdmissionResultQuery>> InsertAdmissionByCashLine(
       AdmissionByAdmissionCashLine modelValue,ModelStateDictionary modelState)
    {
        var model = modelValue.Admission;
        var modelCash = modelValue.AdmissionCashLine;
        var resultInsert = new MyResultDataQuery<AdmissionResultQuery>();
        var userId = UserClaims.GetUserId();
        ;
        var companyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;

        if (modelState.IsValid)
        {
            model.CreateUserId = userId;
            model.CompanyId = companyId;

            var counter = await admissionCounter.GetRecordByUserId(model.CreateUserId, model.CompanyId);
            model.BranchId = counter.Data.BranchId;

            #region validateAdmission

            var admissionPermissionModel = new AdmissionCheckPermissionViewModel
            {
                Id = model.Id,
                RoleId = roleId,
                BranchId = model.BranchId,
                WorkflowId = model.WorkflowId,
                StageId = model.StageId,
                ActionId = model.ActionId,
                CompanyId = model.CompanyId
            };
            var validateAdmissionResult =
                await admissionServiceRepository.ValidateCheckAdmissionPermission(admissionPermissionModel);

            #endregion

            #region validateAdmissionMaster

            var masterModel = new AdmissionCheckPermissionViewModel
            {
                Id = model.AdmissionMasterId,
                RoleId = roleId,
                BranchId = model.BranchId,
                WorkflowId = model.AdmissionMasterWorkflowId,
                StageId = model.AdmissionMasterStageId,
                ActionId = model.AdmissionMasterActionId,
                CompanyId = model.CompanyId
            };

            var validateAdmissionMasterResult =
                await admissionMasterRepository.ValidateCheckAdmissionMasterPermission(masterModel);

            #endregion

            #region validateAdmissionCashLine

            var admissionCashLinePermissionModel = new AdmissionCheckPermissionViewModel
            {
                Id = modelCash.Id,
                RoleId = roleId,
                BranchId = model.BranchId,
                WorkflowId = modelCash.WorkflowId,
                StageId = modelCash.StageId,
                ActionId = modelCash.ActionId,
                CompanyId = model.CompanyId
            };

            var validateAdmissionCadhLineResult = "";

            if (admissionCashLinePermissionModel.Id == 0 && admissionCashLinePermissionModel.ActionId == 0)
                validateAdmissionCadhLineResult = "";
            else
                validateAdmissionCadhLineResult =
                    await admissionCash.ValidateCashLinePermission(admissionCashLinePermissionModel);

            #endregion

            if (validateAdmissionResult != "" || validateAdmissionMasterResult != "" ||
                validateAdmissionCadhLineResult != "")
            {
                resultInsert = new MyResultDataQuery<AdmissionResultQuery>
                {
                    Data = new AdmissionResultQuery
                    { Id = 0, AdmissionMasterId = 0, Successfull = false, Status = -100 },
                    ValidationErrors = new List<string>
                    {
                        validateAdmissionResult,
                        validateAdmissionMasterResult,
                        validateAdmissionCadhLineResult
                    },
                    Successfull = false
                };

                resultInsert.ValidationErrors.RemoveAll(x => x == "");
            }

            else
            {
                resultInsert = await admissionServiceRepository.Insert(model, false);
            }
        }
        else
        {
            resultInsert = modelState.ToMyResultDataQuery<AdmissionResultQuery>();
        }

        if (resultInsert.Successfull)
        {
            modelCash.AdmissionLineCashList.Where(cl => cl.UserId == 0).AsList().ForEach(u => u.UserId = userId);

            MyClaim.Init(accessor);
            var ipAdrress = MyClaim.IpAddress;

            var serviceIds = model.AdmissionLineServiceList.Select(x => x.ServiceId.ToString());
            var admissionAmount = model.AdmissionLineServiceList.Sum(x => x.NetAmount);
            var cashAmount = modelCash.AdmissionLineCashList.Sum(x => x.InOut == 1 ? x.Amount : -x.Amount);

            if (cashAmount != 0 && modelCash.Id == 0)
            {
                var validationMaster =
                    await admissionMasterRepository.AdmissionMasterCashValidation(model.AdmissionMasterId, cashAmount);

                if (validationMaster.Count != 0)
                    return new MyResultDataQuery<AdmissionResultQuery>
                    {
                        Successfull = false,
                        Data = new AdmissionResultQuery { Successfull = false, Status = -100 },
                        ValidationErrors = validationMaster
                    };

                var userAgent = new UserAgent(accessor.HttpContext?.Request.Headers["User-Agent"]);
                var historyModel = new HistoryModel
                {
                    ControllerName = "AdmissionApiController",
                    ActionName = nameof(InsertAdmissionByCashLine),
                    Browser = userAgent.Browser.NameAndVersion,
                    CompanyId = model.CompanyId,
                    Description = $@"AdmissionId:{model.Id}
                                    _AdmissionTypeId:{model.AdmissionTypeId}
                                    _UserId:{model.CreateUserId}
                                    _AttenderId:{model.AttenderId}
                                    _ServiceIds:{string.Join(',', serviceIds)}
                                    
                                    _PatientId:{model.AdmissionPatient.Id}
                                    _PatientFullName:{model.AdmissionPatient.FirstName + " " + model.AdmissionPatient.LastName},
                                    _PatientNationalCode:{model.AdmissionPatient.NationalCode}
                                    _AdmissionAmount:{model.AdmissionPatient.NationalCode}
                                    _CashAmount: {model.AdmissionPatient.NationalCode}",
                    UserId = model.CreateUserId,
                    IpAddress = ipAdrress,
                    OperatingSystem = userAgent.OS.NameAndVersion
                };

                var resultHistory = await history.Insert(historyModel);


                if (modelState.IsValid)
                {
                    modelCash.CompanyId = model.CompanyId;
                    modelCash.CreateUserId = model.CreateUserId;
                    modelCash.BranchId = model.BranchId;
                    var result = await admissionServiceRepository.InsertAdmissionCashLine(modelCash);
                    return resultInsert;
                }

                return resultInsert;
            }
        }

        return resultInsert;
    }
}