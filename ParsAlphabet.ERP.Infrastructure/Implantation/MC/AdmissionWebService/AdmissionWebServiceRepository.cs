using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionWebService;
using ParsAlphabet.ERP.Application.Interfaces.MC.AdmissionWebService;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionWebService;

public class AdmissionWebServiceRepository : IAdmissionWebServiceRepository
{
    private readonly IConfiguration _config;

    public AdmissionWebServiceRepository(IConfiguration config)
    {
        _config = config;
    }

    public IDbConnection Connection => new SqlConnection(_config.GetConnectionString("DefaultConnection"));

    public GetColumnsViewModel GetColumnSale()
    {
        var list = new GetColumnsViewModel
        {
            IsSelectable = true,
            ActionType = "inline",
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه ثبت", Type = (int)SqlDbType.Int, IsDtParameter = true, IsPrimary = true,
                    Width = 5, IsFilterParameter = true, FilterType = "number"
                },
                new()
                {
                    Id = "patient", Title = "مراجعه کننده", Type = (int)SqlDbType.VarChar, Size = 10,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "patientNationalCode", Title = "کدملی مراجعه کننده", Type = (int)SqlDbType.VarChar, Size = 11,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ/زمان ثبت", Type = (int)SqlDbType.VarChar, Size = 11,
                    IsDtParameter = true, Width = 6
                },
                new()
                {
                    Id = "hid", Title = "شناسه شباد", Type = (int)SqlDbType.VarChar, Size = 11, IsDtParameter = true,
                    Width = 7
                },
                new()
                {
                    Id = "state", Title = "وضعیت", Type = (int)SqlDbType.VarChar, Size = 11, IsDtParameter = true,
                    Width = 6
                },
                new()
                {
                    Id = "fullDate", Title = "تاریخ", Type = (int)SqlDbType.Date, IsFilterParameter = true,
                    FilterType = "doublepersiandate"
                },
                //new DataColumnsViewModel { Id = "fromDate", Title = "از تاریخ", Type = (int)SqlDbType.Date,IsFilterParameter=true, FilterType="persiandate"},
                //new DataColumnsViewModel { Id = "toDate", Title = "تا تاریخ", Type = (int)SqlDbType.Date,IsFilterParameter=true, FilterType="persiandate"},
                new()
                {
                    Id = "updateHID", Title = "مجوز بروزرسانی شباد", Type = (int)SqlDbType.Bit, IsDtParameter = false,
                    IsPrimary = true, Width = 8, Align = "center"
                },
                new()
                {
                    Id = "updateHIDResultName", Title = "وضعیت شباد", Type = (int)SqlDbType.NVarChar, Size = 11,
                    IsDtParameter = true, Width = 5, Align = "center"
                },
                new()
                {
                    Id = "savePatientBill", Title = "مجوز ارسال صورتحساب", Type = (int)SqlDbType.Bit,
                    IsDtParameter = false, IsPrimary = true, Width = 8, Align = "center"
                },
                new()
                {
                    Id = "saveBillResultName", Title = "وضعیت صورتحساب", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, Width = 8, Align = "center"
                },
                new()
                {
                    Id = "reimbursement", Title = "مجوز کسور بیمه", Type = (int)SqlDbType.Bit, IsDtParameter = false,
                    IsPrimary = true, Width = 6, Align = "center"
                },
                new()
                {
                    Id = "rembResultName", Title = "وضعیت کسور بیمه", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, Width = 7, Align = "center"
                },
                new()
                {
                    Id = "hidOnline", Title = "آنلاین/آفلاین", Type = (int)SqlDbType.Bit, IsDtParameter = true,
                    Width = 5, Align = "center"
                },
                new()
                {
                    Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 9,
                    Align = "center"
                }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "showServiceLines", Title = "نمایش", ClassName = "btn green_outline_1",
                    IconName = "far fa-file-alt"
                },
                new()
                {
                    Name = "listinsurerreimbursement", Title = "لیست شناسه شباد بر اساس نمبر تذکره",
                    ClassName = "btn btn-info btn-listM", IconName = "fa fa-list"
                },
                new() { Name = "edit", Title = "ویرایش", ClassName = "btn blue_outline_1", IconName = "fa fa-edit" }
            }
        };

        return list;
    }

    public GetColumnsViewModel GetColumnReturn()
    {
        var list = new GetColumnsViewModel
        {
            IsSelectable = true,
            ActionType = "inline",
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه ثبت", Type = (int)SqlDbType.Int, IsDtParameter = true, IsPrimary = true,
                    Width = 5, IsFilterParameter = true, FilterType = "number"
                },
                new()
                {
                    Id = "returnId", Title = "شناسه مرجوع", Type = (int)SqlDbType.Int, Size = 50, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "patient", Title = "مراجعه کننده", Type = (int)SqlDbType.VarChar, Size = 10,
                    IsDtParameter = true, Width = 18
                },
                new()
                {
                    Id = "patientNationalCode", Title = "کدملی مراجعه کننده", Type = (int)SqlDbType.VarChar, Size = 11,
                    IsDtParameter = true, Width = 15
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ/زمان ثبت", Type = (int)SqlDbType.VarChar, Size = 11,
                    IsDtParameter = true, Width = 12
                },
                new()
                {
                    Id = "hid", Title = "شناسه شباد", Type = (int)SqlDbType.VarChar, Size = 11, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "state", Title = "وضعیت", Type = (int)SqlDbType.VarChar, Size = 11, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "fullDate", Title = "تاریخ", Type = (int)SqlDbType.Date, IsFilterParameter = true,
                    FilterType = "doublepersiandate"
                },
                //new DataColumnsViewModel { Id = "fromDate", Title = "از تاریخ", Type = (int)SqlDbType.Date,IsFilterParameter=true, FilterType="persiandate"},
                //new DataColumnsViewModel { Id = "toDate", Title = "تا تاریخ", Type = (int)SqlDbType.Date,IsFilterParameter=true, FilterType="persiandate"},
                new()
                {
                    Id = "eliminateHID", Title = "مجوز ابطال", Type = (int)SqlDbType.Bit, IsDtParameter = false,
                    IsPrimary = true, Width = 10, Align = "center"
                },
                new()
                {
                    Id = "eliminateHIDResultName", Title = "وضعیت ابطال", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, Width = 10, Align = "center"
                }
            }
        };

        return list;
    }

    public async Task<CSVViewModel<IEnumerable>> Csv(int admissionId, int CompanyId)
    {
        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                GetServiceLineColumn().DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title))
        };
        var getPage = await GetAdmissionServiceLines(admissionId, CompanyId);
        result.Rows = from p in getPage
            select new
            {
                p.ServiceId,
                p.ServiceCode,
                p.ServiceName,
                p.ServiceQuantity,
                p.BasicSharePrice,
                p.CompSharePrice,
                p.PatientSharePrice,
                p.ConfirmedDeduction
            };
        return result;
    }

    public async Task<MyResultPage<List<AdmissionReimbursment>>> GetPage(GetPageViewModel model, int saleTypeId)
    {
        var result = new MyResultPage<List<AdmissionReimbursment>>
        {
            Data = new List<AdmissionReimbursment>()
        };

        int? p_id = 0, p_saleTypeId = saleTypeId;
        string p_fromDate = "", p_toDate = "";

        switch (model.FieldItem)
        {
            case "id":
                p_id = Convert.ToInt32(model.FieldValue);
                break;
            case "saleTypeName":
                p_saleTypeId = model.FieldValue.Contains("مرجوع") || model.FieldValue.Contains("برگشت") ? 2 : 1;
                break;
            //case "fromDate":
            //    p_fromDate = model.FieldValue.ToString();
            //    break;
            //case "toDate":
            //    p_toDate = model.FieldValue.ToString();
            //    break;
            case "fullDate":
                p_fromDate = model.FieldValue.Split("     ")[1];
                p_toDate = model.FieldValue.Split("     ")[0];
                break;
        }

        var fromDateMiladi = p_fromDate.ToMiladiDateTime();
        var toDateMiladi = p_toDate.ToMiladiDateTime();

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("SaleTypeId", p_saleTypeId == 0 ? null : p_saleTypeId);
        parameters.Add("Id", p_id);
        parameters.Add("FromDate", fromDateMiladi != null ? fromDateMiladi : null);
        parameters.Add("ToDate", toDateMiladi != null ? toDateMiladi : null);
        if (model.CompanyId == 0)
            parameters.Add("CompanyId");
        else
            parameters.Add("CompanyId", model.CompanyId);


        result.Columns = saleTypeId == 1 ? GetColumnSale() : GetColumnReturn();

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionService_Reimbursement_BySystem_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<AdmissionReimbursment>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<List<ServiceLines>> GetAdmissionServiceLines(int admissionId, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].Spc_AdmissionServiceLine_GetList";
            conn.Open();

            var result = await conn.QueryAsync<ServiceLines>(sQuery,
                new
                {
                    AdmissionId = admissionId,
                    CompanyId = companyId
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result.ToList();
        }
    }

    public async Task<List<ServiceByCode>> GetAdmissionServiceByCode(string rvuCodes, int CompanyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].Spc_GetAdmissionServiceByRvuCode";
            conn.Open();

            var result = await conn.QueryAsync<ServiceByCode>(sQuery,
                new
                {
                    RvuCodes = rvuCodes,
                    CompanyId
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result.ToList();
        }
    }

    //public async Task<MyResultQuery> SavePatientBill(SavePatientBill_Result model, bool resultServise, int admissionServiceId, int userId)
    //{
    //    MyResultQuery result = new MyResultQuery();
    //    using (IDbConnection conn = Connection)
    //    {
    //        string sQuery = "mc.Spc_AdmissionService_Upd_SavePatientBill";
    //        conn.Open();

    //        await conn.ExecuteAsync(sQuery, new
    //        {
    //            Id = admissionServiceId,
    //            SaveCompositionUID = model.CompositionUID,
    //            SaveMessageUID = model.MessageUID,
    //            PersonUID = model.PatientUID,
    //            Status = resultServise ? AdmissionSendStatusResult.SuccsessFull : AdmissionSendStatusResult.Error,
    //            UserId = userId
    //        }, commandType: CommandType.StoredProcedure);
    //        conn.Close();
    //    }
    //    result.Successfull = true;
    //    return result;
    //}

    public async Task UpdateResultSavePatientBill(int admissionId, byte saveBillResult)
    {
        var result = new MyResultStatus();
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_UpdItem_Number]";
            conn.Open();

            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                TableName = "mc.AdmissionWebServiceResult",
                ColumnName = "SaveBillResult",
                Value = saveBillResult.ToString(),
                Filter = $"HeaderId={admissionId}"
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }
    }

    //public async Task<MyResultQuery> SaveInsurerReimbursement(GetInsurerReimbursement_Result model, bool resultServise, int admissionServiceId, int userId)
    //{
    //    var listRemb = new List<TestUpdateRemb>();

    //    if (model.ReimbServices != null)
    //    {
    //        foreach (var item in model.ReimbServices)
    //        {
    //            var rembModel = new TestUpdateRemb();

    //            rembModel.ServiceId = item.ServiceId;
    //            rembModel.ServiceName = item.ServiceName;
    //            rembModel.ServiceTerminologyId = item.ServiceTerminologyId;
    //            rembModel.ServiceCount = item.ServiceCount;
    //            rembModel.PatientPrice = Convert.ToDecimal(item.PatientPrice);
    //            rembModel.DeducationPrice = Convert.ToDecimal(item.DeducationPrice);
    //            rembModel.CompInsurerPrice = Convert.ToDecimal(item.CompInsurerPrice);
    //            listRemb.Add(rembModel);
    //        }
    //    }


    //    MyResultQuery result = new MyResultQuery();
    //    using (IDbConnection conn = Connection)
    //    {
    //        string sQuery = "mc.Spc_AdmissionService_Reimbursement_BySystem_Upd";
    //        conn.Open();
    //        await conn.ExecuteAsync(sQuery, new
    //        {
    //            Id = admissionServiceId,
    //            PatientUID = model != null ? model.PatientUID : null,
    //            CompositionUID = model != null && model.CompositionUID!=null ? model.CompositionUID : null,
    //            ReimbServices = model == null ? null : JsonConvert.SerializeObject(listRemb),
    //            Status = resultServise ? AdmissionSendStatusResult.SuccsessFull : AdmissionSendStatusResult.Error,
    //            UserId = userId
    //        }, commandType: CommandType.StoredProcedure);
    //        conn.Close();
    //    }
    //    result.Successfull = true;
    //    return result;
    //}

    public async Task<MyResultQuery> UpdateAdmissionServiceHidUpdate(int admissionServiceId, bool resultServise,
        int userId)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "mc.Spc_AdmissionService_Upd_HidUpdate";
            conn.Open();
            await conn.ExecuteAsync(sQuery, new
            {
                Id = admissionServiceId,
                Status = resultServise ? AdmissionSendStatusResult.SuccsessFull : AdmissionSendStatusResult.Error,
                UpdateDateTime = DateTime.Now,
                UserId = userId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = true;
        return result;
    }

    public async Task<MyResultQuery> SaveEliminateHid(int admissionServiceId, bool resultServise, int userId)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "mc.Spc_AdmissionService_Upd_EliminateUpdate";
            conn.Open();
            await conn.ExecuteAsync(sQuery, new
            {
                Id = admissionServiceId,
                Status = resultServise ? AdmissionSendStatusResult.SuccsessFull : AdmissionSendStatusResult.Error,
                UserId = userId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = true;
        return result;
    }

    public async Task<List<ServiceStack.Service>> GetAdmissionServiceLineWcf(int admissionId, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].Spc_AdmissionServiceLine_GetList_Wcf";
            conn.Open();

            var result = await conn.QueryAsync<ServiceStack.Service>(sQuery,
                new
                {
                    AdmissionId = admissionId,
                    CompanyId = companyId
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result.ToList();
        }
    }

    public GetColumnsViewModel GetServiceLineColumn()
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "ServiceId", Title = "شناسه خدمت", Type = (int)SqlDbType.Int, Size = 10, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "ServiceCode", Title = "نمبر تذکره خدمت", Type = (int)SqlDbType.Int, Size = 10,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "ServiceName", Title = "نام خدمت", Type = (int)SqlDbType.NVarChar, Size = 11,
                    IsDtParameter = true, Width = 15
                },
                new()
                {
                    Id = "ServiceQuantity", Title = "تعداد", Type = (int)SqlDbType.Int, Size = 11, IsDtParameter = true,
                    Width = 7
                },
                new()
                {
                    Id = "BasicSharePrice", Title = "سهم بیمه اجباری", Type = (int)SqlDbType.Int, Size = 11,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "CompSharePrice", Title = "سهم بیمه تکمیلی", Type = (int)SqlDbType.Int,
                    IsFilterParameter = true, IsDtParameter = true
                },
                new()
                {
                    Id = "PatientSharePrice", Title = "سهم مراجعه کننده", Type = (int)SqlDbType.Int, Size = 11,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "ConfirmedBasicSharePrice", Title = "سهم تایید شده بیمه اجباری", Type = (int)SqlDbType.Int,
                    IsFilterParameter = true
                },
                new()
                {
                    Id = "ConfirmedCompSharePrice", Title = "سهم تایید شده بیمه تکمیلی", Type = (int)SqlDbType.Int,
                    IsPrimary = true, Width = 13
                },
                new()
                {
                    Id = "ConfirmedServiceCount", Title = "تعداد تایید شده", Type = (int)SqlDbType.Int, Size = 11,
                    Width = 10
                },
                new()
                {
                    Id = "ConfirmedPatientSharePrice", Title = "سهم تایید شده مراجعه کننده", Type = (int)SqlDbType.Int,
                    IsPrimary = true, Width = 10
                },
                new()
                {
                    Id = "ConfirmedDeduction", Title = "مبلغ تایید شده کسورات بیمه", Type = (int)SqlDbType.Int,
                    IsDtParameter = true, Width = 10
                }
            }
        };

        return list;
    }
}