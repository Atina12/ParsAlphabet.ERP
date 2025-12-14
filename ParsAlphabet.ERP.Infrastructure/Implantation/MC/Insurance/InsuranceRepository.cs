using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.MC.Insurance;
using ParsAlphabet.ERP.Infrastructure.Implantation.PB;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.Insurance;

public class InsuranceRepository :
    BaseRepository<InsuranceModel, int, string>,
    IBaseRepository<InsuranceModel, int, string>
{
    private readonly ManageRedisRepository _manageRedisRepository;

    public InsuranceRepository(IConfiguration config, ManageRedisRepository manageRedisRepository) : base(config)
    {
        _manageRedisRepository = manageRedisRepository;
    }

    public new GetColumnsViewModel GetColumns()
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number", FillType = "number", Width = 6, IsPrimary = true
                },
                new() { Id = "insurerTypeId", IsPrimary = true },
                new()
                {
                    Id = "name", Title = "نام", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    IsFilterParameter = true, Width = 25, IsPrimary = true
                },
                new()
                {
                    Id = "insurerType", Title = "نوع بیمه", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/MC/InsuranceApi/getinsurertypedropdown", Width = 8, IsPrimary = true
                },
                new()
                {
                    Id = "terminology", Title = "ترمینولوژی", Type = (int)SqlDbType.VarChar, Size = 5,
                    IsDtParameter = true, Width = 13
                },
                //new DataColumnsViewModel { Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.NVarChar, Size = 5, IsDtParameter = true, Width=8 },
                //new DataColumnsViewModel { Id = "createUserFullName", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.NVarChar, Size = 5, IsDtParameter = true, Width=12 },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, Size = 1, IsDtParameter = true,
                    Width = 6, Align = "center"
                },
                new()
                {
                    Id = "isDetail", Title = "تفصیل", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 5,
                    Align = "center"
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 37 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "edit", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green" },
                new()
                {
                    Name = "insurerPatient", Title = "تخصیص بیمار", ClassName = "", IconName = "fa fa-edit color-green",
                    ConditionOperand = "||",
                    Condition = new List<ConditionPageTable>
                    {
                        new() { FieldName = "insurerTypeId", FieldValue = "4", Operator = "==" },
                        new() { FieldName = "insurerTypeId", FieldValue = "5", Operator = "==" }
                    }
                },
                new()
                {
                    Name = "accountDetail", Title = "ایجاد تفصیل", ClassName = "", IconName = "fas fa-plus color-blue"
                }
            }
        };

        return list;
    }

    public async Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model)
    {
        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                GetColumns().DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title))
        };
        var getPage = await GetPage(model);
        result.Rows = from p in getPage.Data
            select new
            {
                p.Id,
                p.Name,
                p.InsurerTypeName,
                p.InsurerTerminologyName,
                IsActive = p.IsActive ? "فعال" : "غیر فعال",
                IsDetail = p.IsDetail ? "دارد" : "ندارد"
            };
        return result;
    }

    public async Task<MyResultPage<List<InsuranceGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<InsuranceGetPage>>
        {
            Data = new List<InsuranceGetPage>()
        };
        if (model.Filters == null) model.Filters = new List<FormKeyValue>();
        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("Name",
            model.Filters.Any(x => x.Name == "name")
                ? model.Filters.FirstOrDefault(x => x.Name == "name").Value
                : null);
        parameters.Add("InsurerTypeId",
            model.Filters.Any(x => x.Name == "insurerType")
                ? model.Filters.FirstOrDefault(x => x.Name == "insurerType").Value
                : null);

        if (model.CompanyId == 0)
            parameters.Add("CompanyId");
        else
            parameters.Add("CompanyId", model.CompanyId);


        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "mc.Spc_Insurer_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<InsuranceGetPage>(sQuery, parameters, commandType: CommandType.StoredProcedure))
                .ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<MyResultPage<InsuranceGetRecord>> GetRecordById(int insurerId)
    {
        var result = new MyResultPage<InsuranceGetRecord>();
        result.Data = new InsuranceGetRecord();


        using (var conn = Connection)
        {
            var sQuery = "mc.Spc_Insurer_GetRecord";
            conn.Open();
            var resultData = await conn.QueryFirstAsync<InsuranceGetRecord>(sQuery,
                new
                {
                    Id = insurerId
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            resultData.Id = insurerId;

            #region ویرایش تفضیل :accountDetailInsurerList

            var accountDetailViewModel = new
            {
                resultData.InsurerTypeId,
                InsurerType = resultData.InsurerTypeId > 0 ? await InsurerType_GetName(resultData.InsurerTypeId) : ""
            };
            resultData.JsonAccountDetailList = JsonConvert.SerializeObject(accountDetailViewModel);

            #endregion

            resultData.InsuranceBoxList = resultData.InsuranceBoxJson != null
                ? JsonConvert.DeserializeObject<List<InsuranceBoxListViewModel>>(resultData.InsuranceBoxJson)
                : null;

            result.Data = resultData;

            return result;
        }
    }

    public async Task<InsurerLineGetRecord> GetInsurerLineRecordById(int id)
    {
        using (var conn = Connection)
        {
            conn.Open();
            var sQuery = "pb.Spc_Tables_GetRecord";
            var result = await conn.QueryFirstOrDefaultAsync<InsurerLineGetRecord>(sQuery, new
            {
                TableName = "mc.InsurerLine",
                Filter = $"Id={id}"
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetDropDown(int CompanyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.Insurer",
                    Filter = $"CompanyId={CompanyId}"
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetInsurerTerminology(string Value)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrInsurer",
                    TitleColumnName = "ISNULL(Value,'')",
                    Filter = " IsActive=1 "
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetInsuranceDropdown(byte insurerTypeId, byte isActive)
    {
        var filter = $"InsurerTypeId={insurerTypeId}";

        if (isActive != 2) filter += $" AND IsActive={(isActive == 1 ? 1 : 0)}";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.Insurer",
                    IdColumnName = "Id",
                    TitleColumnName = "Name",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetInsuranceBoxTerminology(string Value)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrInsuranceBox",
                    TitleColumnName = "ISNULL(Value,'')",
                    Filter = " IsActive=1 "
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetInsurerType()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.Insurertype",
                    TitleColumnName = "ISNULL(Name,'')",
                    Filter = " IsActive=1 "
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<MyResultStatus> Save(InsuranceModel model)
    {
        var result = new MyResultStatus();

        #region ویرایش تفضیل :accountDetailInsurerList

        var accountDetailViewModel = new
        {
            model.InsurerTypeId,
            InsurerType = model.InsurerTypeId > 0 ? await InsurerType_GetName(model.InsurerTypeId) : ""
        };

        #endregion

        using (var conn = Connection)
        {
            var sQuery = "mc.Spc_Insurer_InsUpd";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                model.Opr,
                model.Id,
                model.Name,
                model.InsurerTypeId,
                model.InsurerTerminologyId,
                model.IsActive,
                model.CompanyId,
                AccountDetailInsurerJson = JsonConvert.SerializeObject(accountDetailViewModel),
                InsuranceBoxJson = JsonConvert.SerializeObject(model.InsuranceBoxList)
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = result.Status == 100;

        if (result.Successfull)

        {
            if (model.InsurerTypeId == 1)
            {
                await _manageRedisRepository.UpDatedropDownCacheByType(DropDownCache.Discount, model.InsurerTypeId);
            }
            else if (model.InsurerTypeId == 2)
            {
                await _manageRedisRepository.UpDatedropDownCacheByType(DropDownCache.CompInsurerLine,
                    model.InsurerTypeId);
                await _manageRedisRepository.UpDatedropDownCacheByType(DropDownCache.CompInsurerLineThirdParty,
                    model.InsurerTypeId);
            }
            else if (model.InsurerTypeId == 4)
            {
                await _manageRedisRepository.UpDatedropDownCacheByType(DropDownCache.ThirdParty, model.InsurerTypeId);
                await _manageRedisRepository.UpDatedropDownCacheByType(DropDownCache.CompInsurerLineThirdParty,
                    model.InsurerTypeId);
            }
            else
            {
                await _manageRedisRepository.UpDatedropDownCacheByType(DropDownCache.Discount, model.InsurerTypeId);
            }
        }
        else
        {
            result.ValidationErrors.Add(result.StatusMessage);
        }

        return result;
    }

    public async Task<List<string>> ValidationInsurance(InsuranceModel model, int CompanyId)
    {
        var error = new List<string>();

        if (model.InsurerTypeId == 1)
        {
            // بررسی تکراری نبودن ترمینولوژی بیمه
            var resultCheckInsurance = await ExistByInsuranceTerminology(model, CompanyId);
            if (!resultCheckInsurance)
                error.Add("ترمینولوژی بیمه قبلا ثبت شده است");

            // بررسی تکراری نبودن ترمینولوژی صندوق بیمه
            if (model.InsuranceBoxList.ListHasRow())
                for (var i = 0; i < model.InsuranceBoxList.Count; i++)
                    if (!model.InsuranceBoxList[i].InsuranceBoxTerminologyId.IsNullOrEmptyOrWhiteSpace())
                    {
                        var resultCheckInsuranceBox = await ExistByInsuranceBoxTerminology(model.InsuranceBoxList[i].Id,
                            model.InsuranceBoxList[i].InsuranceBoxTerminologyId, CompanyId);
                        if (!resultCheckInsuranceBox)
                            error.Add("ترمینولوزی صندوق بیمه قبلا ثبت شده است");
                    }
        }

        // الزامی بودن ثبت صندوق برای بیمه های اجباری و تکمیلی
        if ((model.InsurerTypeId == 1 || model.InsurerTypeId == 2) && model.InsuranceBoxList.NotNull() &&
            model.InsuranceBoxList.Count == 0) error.Add("برای بیمه های اجباری و تکمیلی ثبت صندوق بیمه الزامی است");

        return error;
    }

    public async Task<bool> ExistByInsuranceTerminology(InsuranceModel model, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";

            conn.Open();

            var result = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                TableName = "mc.Insurer",
                ColumnName = "Id",
                Filter =
                    $"InsurerTerminologyId ={model.InsurerTerminologyId} AND CompanyId={companyId} AND Id<>{model.Id}",
                OrderBy = ""
            }, commandType: CommandType.StoredProcedure);

            return result == 0;
        }
    }

    public async Task<bool> ExistByInsuranceBoxTerminology(short id, string insuranceBoxTerminologyId, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";

            conn.Open();

            var result = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                TableName = "mc.InsurerLine",
                ColumnName = "Id",
                Filter =
                    $"InsuranceBoxTerminologyId ={insuranceBoxTerminologyId} AND CompanyId={companyId} AND Id<>{id}",
                OrderBy = ""
            }, commandType: CommandType.StoredProcedure);

            return result == 0;
        }
    }

    public async Task<string> InsurerType_GetName(int? id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    TableName = "mc.InsurerType",
                    ColumnName = "Name",
                    Filter = $"Id={id}"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetInsurerListByType(string insurerTypeId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.Insurer",
                    TitleColumnName = "ISNULL(Name,'')",
                    Filter = $" IsActive=1 AND InsurerTypeId IN({insurerTypeId})"
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetInsurerLine(int insurerId, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.InsurerLine",
                    TitleColumnName = "ISNULL(Name,'')",
                    Filter = $" IsActive=1 AND CompanyId={companyId} AND InsurerId={insurerId}"
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetListByTypeId(int insurerTypeId, int CompanyId, bool freeType,
        byte? isActive, bool bothType)
    {
        var filter = $"CompanyId=1 AND InsurerTypeId={insurerTypeId}";

        if (isActive != null && isActive != 2)
            filter += $" AND IsActive = {(isActive == 1 ? 1 : 0)}";

        if (bothType)
            filter += " OR InsurerTypeId=3";

        if (!freeType)
            filter += " AND Id<>8036";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.Insurer",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();

            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetInsurerLineByIds(string insurerId, byte? isActive)
    {
        var filter = "CompanyId=1";

        if (isActive != null && isActive != 2)
            filter += $" AND IsActive = {(isActive == 1 ? 1 : 0)}";


        filter += $" AND InsurerId IN({insurerId})";

        var insurerList = new List<MyDropDownViewModel>();

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.InsurerLine",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();

            insurerList = result;
            return insurerList;
        }
    }

    public async Task<string> GetInsurerCodeById(int id, int CompanyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    TableName = "mc.Insurer",
                    ColumnName = "InsurerInsuranceModel",
                    Filter = $"Id={id} AND CompanyId={CompanyId}"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<int> GetInsurerIdByCode(string code, int CompanyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<int>(sQuery,
                new
                {
                    TableName = "mc.Insurer",
                    ColumnName = "Id",
                    Filter = $"Code='{code}' AND CompanyId={CompanyId} AND IsActive = 1"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<string> GetCompInsurerCodeById(int id, int CompanyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    TableName = "mc.InsurerLine",
                    ColumnName = "ISNULL(InsuranceBoxInsuranceModel,'0')",
                    Filter = $"Id={id} AND CompanyId={CompanyId}"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<InsurerCode> GetInsurerInfo(GetInsuranceCode model)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_Get_InsurerInfo]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<InsurerCode>(sQuery,
                new
                {
                    model.InsurerId,
                    model.InsurerLineId,
                    model.InsurerCode,
                    model.InsurerLineCode,
                    model.CompanyId
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel2>> GetDropDownInsuranceListByType(DropDownCache dropDownCache,
        byte referralTypeId)
    {
        return await _manageRedisRepository.GetDataListByCacheType(dropDownCache, referralTypeId);
    }
}