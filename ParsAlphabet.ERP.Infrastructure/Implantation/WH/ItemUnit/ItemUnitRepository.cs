using System.Collections;
using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.WH.ItemUnit;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.WH.ItemUnit;

public class ItemUnitRepository :
    BaseRepository<ItemUnitModel, int, string>,
    IBaseRepository<ItemUnitModel, int, string>
{
    private readonly IHttpContextAccessor _accessor;

    public ItemUnitRepository(IConfiguration config, IHttpContextAccessor accessor)
        : base(config)
    {
        _accessor = accessor;
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
                    IsFilterParameter = true, Width = 6, FilterType = "number"
                },
                new()
                {
                    Id = "name", Title = "نام", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, Width = 40
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 6,
                    Align = "center"
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 54 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "edit", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green" },
                new() { Name = "delete", Title = "حذف", ClassName = "", IconName = "fa fa-trash color-maroon" },
                new()
                {
                    Name = "additem", Title = " افزودن واحدهای فرعی", ClassName = "",
                    IconName = "fas fa-plus color-blue"
                }
            }
        };

        return list;
    }

    public GetColumnsViewModel GetLineColumns()
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "unitId", Title = "شناسه", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, Width = 6
                },
                new()
                {
                    Id = "unitName", Title = "واحد شمارش", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 12
                },
                new()
                {
                    Id = "unitIsActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 6,
                    Align = "center"
                },
                new()
                {
                    Id = "subUnitId", Title = "شناسه سطر", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, Width = 6
                },
                new()
                {
                    Id = "subUnitName", Title = "نام سطر واحد شمارش ", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 12
                },
                new()
                {
                    Id = "subUnitRatio", Title = "درصدسطر واحد شمارش  ", Type = (int)SqlDbType.Int,
                    IsDtParameter = true, IsFilterParameter = true, Width = 6
                },
                new()
                {
                    Id = "subUnitIsActive", Title = "وضعیت سطر واحد شمارش ", Type = (int)SqlDbType.Bit,
                    IsDtParameter = true, Width = 6, Align = "center"
                }
            }
        };

        return list;
    }

    public async Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model)
    {
        var getPage = await GetExcellPage(model);

        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',', GetLineColumns().DataColumns.Where(x => x.IsDtParameter).Select(z => z.Title))
        };

        result.Rows = from p in getPage.Data
            select new
            {
                p.UnitId,
                p.UnitName,
                UnitIsActive = p.UnitIsActive ? "فعال" : "غیر فعال",
                p.SubUnitId,
                p.SubUnitName,
                p.SubUnitRatio,
                SubUnitIsActive = p.SubUnitIsActive ? "فعال" : "غیر فعال"
            };


        return result;
    }

    public async Task<MyResultPage<List<ItemUnitGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<ItemUnitGetPage>>();
        result.Data = new List<ItemUnitGetPage>();


        int? p_id = null;
        var p_name = "";

        switch (model.FieldItem)
        {
            case "id":
                p_id = Convert.ToInt32(model.FieldValue);
                break;
            case "name":
                p_name = model.FieldValue;
                break;
        }

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("Name",
            model.Filters.Any(x => x.Name == "name")
                ? model.Filters.FirstOrDefault(x => x.Name == "name").Value
                : null);
        parameters.Add("CompanyId", model.CompanyId);

        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "wh.Spc_ItemUnit_GetPage";
            conn.Open();

            result.Data =
                (await conn.QueryAsync<ItemUnitGetPage>(sQuery, parameters, commandType: CommandType.StoredProcedure))
                .ToList();

            conn.Close();
        }

        return result;
    }

    public async Task<MyResultStatus> Insert(ItemUnitModel model)
    {
        var result = new MyResultStatus();

        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_ItemUnit_InsUpd]";
            conn.Open();

            var outPut = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                model.Id,
                Name = model.Name.ConvertArabicAlphabet(),
                model.IsActive,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.Successfull = outPut > 0 ? true : false;
            result.Status = outPut > 0 ? 100 : -99;
            result.StatusMessage = "عملیات ثبت  با موفقیت انجام پذیرفت";
        }

        return result;
    }

    public async Task<MyResultStatus> Update(ItemUnitModel model)
    {
        var result = new MyResultStatus();

        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_ItemUnit_InsUpd]";
            conn.Open();

            var outPut = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                model.Id,
                Name = model.Name.ConvertArabicAlphabet(),
                model.IsActive,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.Successfull = outPut > 0 ? true : false;
            result.Status = outPut > 0 ? 100 : -99;
            result.StatusMessage = "عملیات ثبت  با موفقیت انجام پذیرفت";
        }

        return result;
    }

    public async Task<MyResultStatus> ItemSubUnitSave(ItemSubUnitModel model)
    {
        var result = new MyResultStatus();
        var validateResult = "";
        validateResult = await ValidationItemSubUnit(model);
        if (validateResult.Length > 0)
        {
            result.Successfull = false;
            result.StatusMessage = validateResult;
            return result;
        }

        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_ItemSubUnit_InsUpd]";
            conn.Open();

            var outPut = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                Opr = "Ins",
                model.HeaderId,
                model.UnitId,
                model.Ratio,
                model.IsActive
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.Successfull = outPut > 0 ? true : false;
            result.Status = outPut > 0 ? 100 : -99;
            result.StatusMessage = "عملیات ثبت  با موفقیت انجام پذیرفت";
        }

        return result;
    }


    public async Task<MyResultStatus> ItemSubUnitUpdate(ItemSubUnitModel model)
    {
        var result = new MyResultStatus();

        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_ItemSubUnit_InsUpd]";
            conn.Open();

            var outPut = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                Opr = "Upd",
                model.HeaderId,
                model.UnitId,
                model.Ratio,
                model.IsActive
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.Successfull = outPut > 0 ? true : false;
            result.Status = outPut > 0 ? 100 : -99;
            result.StatusMessage = "عملیات ویرایش با موفقیت انجام پذیرفت";
        }

        return result;
    }

    public async Task<MyResultPage<ItemUnitGetRecord>> GetRecordByIdItemSubUnit(int id, int itemId, int companyId)
    {
        var result = new MyResultPage<ItemUnitGetRecord>
        {
            Data = new ItemUnitGetRecord()
        };

        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_ItemUnit_GetRecord]";
            result.Data = await conn.QueryFirstOrDefaultAsync<ItemUnitGetRecord>(sQuery, new
            {
                Id = id,
                ItemId = itemId,
                CompanyId = companyId
            }, commandType: CommandType.StoredProcedure);
        }

        return result;
    }

    public async Task<ItemSubUnitGetRecord> GetRecordItemSubUnitById(int id, int unitId, decimal ratio)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetRecord";
            var result = await conn.QueryFirstOrDefaultAsync<ItemSubUnitGetRecord>(sQuery, new
            {
                IsSecondLang = 0,
                TableName = "wh.ItemSubUnit",
                Filter = $"HeaderId={id} AND UnitId={unitId} AND Ratio={ratio}"
            }, commandType: CommandType.StoredProcedure);

            return result;
        }
    }


    public async Task<string> ValidationItemSubUnit(ItemSubUnitModel model)
    {
        var error = "";
        if (model == null)
        {
            error = "درخواست معتبر نمی باشد";
            return error;
        }

        await Task.Run(async () =>
        {
            var existItem = await ExistByItemId(model);
            if (existItem != null) error = $"واحد شمارش {existItem} قبلا ثبت شده است، مجاز به ثبت تکراری نیستید";
        });

        return error;
    }

    public async Task<string> ExistByItemId(ItemSubUnitModel model)
    {
        var existResult = "";
        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_ItemSubUnit_GetRecord]";
            conn.Open();

            existResult = await conn.ExecuteScalarAsync<string>(sQuery, new
            {
                Filter =
                    $"HeaderId = N'{model.HeaderId}'  AND UnitId = N'{model.UnitId}' AND Ratio = N'{model.Ratio}'  "
            }, commandType: CommandType.StoredProcedure);

            conn.Close();
        }

        return existResult;
    }

    public async Task<MyResultPage<List<ItemUnitGetExcellPage>>> GetExcellPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<ItemUnitGetExcellPage>>();

        var parameters = new DynamicParameters();
        parameters.Add("CompanyId", model.CompanyId);
        result.Columns = GetLineColumns();

        using (var conn = Connection)
        {
            var sQuery = "wh.Spc_ItemUnit_GetExcellPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<ItemUnitGetExcellPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }

    public async Task<MyResultStatus> Delete(int id, int companyId)
    {
        var result = new MyResultStatus();
        var validationDelete = await DeleteValidation(id, "wh", "ItemUnit", companyId);
        if (validationDelete.ListHasRow())
        {
            result.Successfull = false;
            result.ValidationErrors = validationDelete;
        }
        else
        {
            using (var conn = Connection)
            {
                conn.Open();

                var sQuery1 = "pb.Spc_Tables_DelRecordWithFilter";

                result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery1, new
                {
                    TableName = "wh.ItemSubUnit",
                    Filter = $"HeaderId = {id}"
                }, commandType: CommandType.StoredProcedure);


                if (result.Status == 100)
                {
                    var sQuery = "pb.Spc_Tables_DelRecordWithFilter";
                    result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(
                        sQuery, new
                        {
                            TableName = "wh.ItemUnit",
                            Filter = $"Id = {id} And CompanyId= {companyId}"
                        }, commandType: CommandType.StoredProcedure);
                }

                conn.Close();
            }

            result.Successfull = result.Status == 100;
        }

        return result;
    }


    public async Task<MyResultStatus> ItemSubUnitDelete(ItemSubUnitModel model)
    {
        var result = new MyResultStatus();
        var validationDelete = await ExistCheck_ItemSubunit(model);
        if (validationDelete != null)
        {
            result.Successfull = false;
            result.StatusMessage = $"واحد شمارش {validationDelete} استفاده شده است، مجاز به حذف نیستید";
        }
        else
        {
            using (var conn = Connection)
            {
                var sQuery = "pb.Spc_Tables_DelRecordWithFilter";
                conn.Open();
                result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(
                    sQuery, new
                    {
                        TableName = "wh.ItemSubUnit",
                        Filter =
                            $"HeaderId = N'{model.HeaderId}'  AND UnitId = N'{model.UnitId}' AND Ratio = N'{model.Ratio}' "
                    }, commandType: CommandType.StoredProcedure);


                conn.Close();
            }

            result.Successfull = result.Status == 100;
            result.StatusMessage = " حذف با موفقیت انجام شد";
        }

        return result;
    }

    public async Task<string> ExistCheck_ItemSubunit(ItemSubUnitModel model)
    {
        var resultCheckExist = "";
        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_ItemSubUnit_ExistCheck]";
            resultCheckExist = await conn.QueryFirstOrDefaultAsync<string>(sQuery, new
            {
                model.HeaderId,
                model.UnitId,
                model.Ratio
            }, commandType: CommandType.StoredProcedure);
        }

        return resultCheckExist;
    }

    public async Task<List<MyDropDownViewModel2>> UnitItem_GetDropDown(string unitIds, int itemId, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_DropDown_ItemUnit]";
            conn.Open();
            var result = (await conn.QueryAsync<UnitItemInfo>(sQuery, new
            {
                Ids = unitIds == "null" ? null : unitIds,
                ItemId = itemId,
                CompanyId = companyId
            }, commandType: CommandType.StoredProcedure)).ToList();

            var dropDownViewModel = new List<MyDropDownViewModel2>();
            for (var i = 0; i < result.Count; i++)
            {
                var drop = new MyDropDownViewModel2
                {
                    Id = result[i].SubUnitId > 0 ? result[i].SubUnitId.ToString() : result[i].UnitId.ToString(),
                    Name = result[i].SubUnitRatio > 0
                        ? result[i].UnitName + '_' + result[i].SubUnitRatio
                        : result[i].UnitName
                };

                dropDownViewModel.Add(drop);
            }

            return dropDownViewModel.ToList();
        }
    }

    public async Task<ItemUnitDetailInfo> GetRatio(int subUnitId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetTable";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<ItemUnitDetailInfo>(sQuery,
                new
                {
                    IsSecondLang = false,
                    TableName = "wh.ItemUnitDetail",
                    IdColumnName = "Id",
                    ColumnNameList = "Ratio,SubUnitId IdSubUnit",
                    IdList = "",
                    OrderBy = "",
                    Filter = $"Id={subUnitId}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> UnitGetDropDown(int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "wh.ItemUnit",
                    Filter = $" CompanyId={companyId} AND IsActive=1",
                    OrderBy = "Name ASC"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> SubUnitGetDropDown(string unitId, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "wh.ItemUnit",
                    Filter =
                        $" Id  IN (SELECT isu.UnitId FROM wh.ItemSubUnit isu WHERE isu.HeaderId in ({unitId})) AND CompanyId={companyId} AND IsActive=1"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }
}