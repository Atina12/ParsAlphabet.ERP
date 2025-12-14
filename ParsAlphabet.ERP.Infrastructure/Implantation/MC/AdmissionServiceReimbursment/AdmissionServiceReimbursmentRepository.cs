using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionServiceReimbursment;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionServiceReimbursment;

public class AdmissionServiceReimbursmentRepository :
    BaseRepository<AdmissionServiceLineReimbursementModel, int, string>,
    IBaseRepository<AdmissionServiceLineReimbursementModel, int, string>
{
    public AdmissionServiceReimbursmentRepository(IConfiguration config) : base(config)
    {
    }

    public GetColumnsViewModel GetColumns(byte insurerTypeId)
    {
        var list = new GetColumnsViewModel
        {
            IsEditable = true,
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", IsPrimary = true, Type = (int)SqlDbType.DateTime, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number", Width = 3
                },
                new()
                {
                    Id = "admissionMasterId", Title = "شناسه پرونده", IsPrimary = true, Type = (int)SqlDbType.DateTime,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "number", Width = 3
                },
                new() { Id = "stageId", IsPrimary = true },
                new() { Id = "workflowId", IsPrimary = true },
                new() { Id = "serviceId", IsPrimary = true },
                new() { Id = "actionId", IsPrimary = true },
                new()
                {
                    Id = "attender", Title = "طبیب", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, Width = 4
                },
                new()
                {
                    Id = "patient", Title = "مراجعه کننده", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 4
                },
                new()
                {
                    Id = "nationalCode", Title = "نمبر تذکره", Type = (int)SqlDbType.VarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "strnumber", Width = 4
                },
                new()
                {
                    Id = "reserveDatePersian", Title = "تاریخ رزرو", Type = (int)SqlDbType.VarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "persiandate", Width = 4
                },

                new()
                {
                    Id = "basicInsurerBookletPageNo", Title = "شماره صفحه دفترچه", Type = (int)SqlDbType.VarChar,
                    Size = 50, IsDtParameter = insurerTypeId == 1, IsFilterParameter = true, FilterType = "strnumber",
                    Width = 4
                },
                new()
                {
                    Id = "basicInsurerNo", Title = "شماره بیمه", Type = (int)SqlDbType.VarChar, Size = 50,
                    IsDtParameter = insurerTypeId == 1, IsFilterParameter = true, FilterType = "strnumber", Width = 5
                },
                new()
                {
                    Id = "basicInsurerExpirationDatePersian", Title = "تاریخ انقضا دفترچه",
                    Type = (int)SqlDbType.VarChar, Size = 50, IsDtParameter = insurerTypeId == 1,
                    IsFilterParameter = true, FilterType = "persiandate", Width = 4
                },

                new()
                {
                    Id = "code", Title = "نمبر تذکره خدمت", Type = (int)SqlDbType.VarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "strnumber", Width = 4
                },
                new()
                {
                    Id = "taminCode", Title = "نمبر تذکره تامین", Type = (int)SqlDbType.VarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "strnumber", Width = 4
                },
                new()
                {
                    Id = "service", Title = "خدمت", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, Width = 11
                },

                new()
                {
                    Id = "basicInsurer", Title = "نام بیمه اجباری", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = insurerTypeId == 1, IsFilterParameter = true, Width = 9
                },
                new()
                {
                    Id = "compInsurer", Title = "نام بیمه تکمیلی", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = insurerTypeId != 1, IsFilterParameter = true, Width = 11
                },

                new()
                {
                    Id = "serviceActualAmount", Title = "مبلغ واقعی خدمت", Type = (int)SqlDbType.Money,
                    IsCommaSep = true, Size = 50, IsDtParameter = true, Width = 4
                },
                new()
                {
                    Id = "basicShareAmount", Title = "سهم بیمه اجباری", Type = (int)SqlDbType.Decimal,
                    IsCommaSep = true, Size = 50, IsDtParameter = insurerTypeId == 1, Width = 3
                },
                new()
                {
                    Id = "compShareAmount", Title = "سهم بیمه تکمیلی", Type = (int)SqlDbType.Float, IsCommaSep = true,
                    Size = 50, IsDtParameter = insurerTypeId != 1, Width = 3
                },
                new()
                {
                    Id = "confirmedBySystem", Title = "وضعیت ارسال نسخ", Type = (int)SqlDbType.SmallInt,
                    IsDtParameter = insurerTypeId == 1, Editable = true, InputType = "select", Size = 50, Width = 6,
                    Inputs = new List<MyDropDownViewModel>
                    {
                        new() { Name = "آفلاین", Id = 1 },
                        new() { Name = "آنلاین", Id = 2 }
                    }
                },
                new()
                {
                    Id = "confirmedBasicSharePriceValue", Title = "کسور بیمه اجباری", Type = (int)SqlDbType.Bit,
                    Editable = true, InputType = "checkbox", Size = 50, IsDtParameter = insurerTypeId == 1, Width = 4
                },
                new()
                {
                    Id = "confirmedCompSharePriceValue", Title = "کسور بیمه تکمیلی", Type = (int)SqlDbType.Bit,
                    Editable = true, InputType = "checkbox", Size = 50, IsDtParameter = insurerTypeId != 1, Width = 4
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 5 }
            },
            ActionType = "inline",
            Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "edit", Title = "ویرایش", ClassName = "btn green_outline_1", IconName = "fa fa-edit" }
            }
        };

        return list;
    }

    public async Task<MyResultPage<List<AdmissionServiceLineReimbursementGetPage>>> GetPage(
        NewGetAdmissionServiceReimbursmentGetPage model, byte roleId)
    {
        var result = new MyResultPage<List<AdmissionServiceLineReimbursementGetPage>>
        {
            Data = new List<AdmissionServiceLineReimbursementGetPage>()
        };

        DateTime? p_FromReserveDate = null, p_ToReserveDate = null;

        p_FromReserveDate = model.FromReserveDatePersian.ToMiladiDateTime();
        p_ToReserveDate = model.ToReserveDatePersian.ToMiladiDateTime();

        result.Columns = GetColumns(model.InsurerTypeId);

        var sQuery = "mc.Spc_AdmissionServiceLineReimbursement_GetPage";

        using (var conn = Connection)
        {
            conn.Open();
            result.Data = (await Connection.QueryAsync<AdmissionServiceLineReimbursementGetPage>(sQuery, new
            {
                model.PageNo,
                model.PageRowsCount,
                model.Id,
                model.AdmissionMasterId,
                model.WorkflowId,
                model.StageId,
                model.ActionId,
                model.BasicInsurerId,
                model.BasicInsurerLineId,
                model.CompInsurerId,
                model.CompInsurerLineId,
                model.PatientFullName,
                FromReserveDate = p_FromReserveDate,
                ToReserveDate = p_ToReserveDate,
                model.AttenderId,
                model.ServiceId,
                model.ServiceTypeId,
                RoleId = roleId,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<MyResultStatus> Save(SaveAdmissionReimbursement model)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionServiceLineReimbursement_InsUpd]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                AdmissionServiceReimbursement = JsonConvert.SerializeObject(model.ReimbursementModel),
                model.InsurerTypeId,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.Successfull = result.Status == 100;
            return result;
        }
    }

    public async Task<MyResultPage<ReimburesmentInsurerInfo>> GetInsuranceByAdmissionId(int admissionId, int CompanyId)
    {
        var result = new MyResultPage<ReimburesmentInsurerInfo>();
        result.Data = new ReimburesmentInsurerInfo();
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionService_InsurerInfo_Get]";
            conn.Open();
            result.Data = await conn.QueryFirstOrDefaultAsync<ReimburesmentInsurerInfo>(sQuery, new
            {
                AdmissionId = admissionId,
                CompanyId
            }, commandType: CommandType.StoredProcedure);
        }

        return result;
    }

    public virtual async Task<MyResultStatus> DeleteLine(DeleteAdmissionServiceLineReimbursement model)
    {
        var result = new MyResultStatus();

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_DelRecordWithFilter";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(
                sQuery, new
                {
                    TableName = "mc.AdmissionServiceReimbursement",
                    Filter = $"HeaderId={model.AdmissionId} AND ServiceId={model.ServiceId}"
                }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        return result;
    }
}