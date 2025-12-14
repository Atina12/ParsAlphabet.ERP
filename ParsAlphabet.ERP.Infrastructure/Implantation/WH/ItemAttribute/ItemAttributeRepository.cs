using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.WH.ItemAttribute;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.ItemCategoryAttribute;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.WH.ItemAttribute;

public class ItemAttributeRepository :
    BaseRepository<Application.Dtos.WH.ItemAttribute.ItemAttribute, int, string>,
    IBaseRepository<Application.Dtos.WH.ItemAttribute.ItemAttribute, int, string>
{
    private readonly ItemCategoryAttributeRepository _itemCategoryAttributeRepository;

    public ItemAttributeRepository(IConfiguration config,
        ItemCategoryAttributeRepository itemCategoryAttributeRepository)
        : base(config)
    {
        _itemCategoryAttributeRepository = itemCategoryAttributeRepository;
    }

    public new GetColumnsViewModel GetColumns()
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.Int, IsPrimary = true, IsDtParameter = true,
                    IsFilterParameter = true, Width = 6, FilterType = "number"
                },
                new()
                {
                    Id = "name", Title = "نام ", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
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
                new()
                {
                    Name = "AttributeTypeSimple", Title = "تخصیص متغیر ", ClassName = "",
                    IconName = "fa fa-list color-green"
                }
            }
        };

        return list;
    }

    public async Task<MyResultPage<List<ItemAttributeGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<ItemAttributeGetPage>>();
        result.Data = new List<ItemAttributeGetPage>();


        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("Name",
            model.Filters.Any(x => x.Name == "name")
                ? model.Filters.FirstOrDefault(x => x.Name == "name").Value
                : null);

        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "wh.Spc_ItemAttribute_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<ItemAttributeGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }


        return result;
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
                IsActive = p.IsActive ? "فعال" : "غیر فعال"
            };
        return result;
    }

    public async Task<MyResultPage<ItemAttributeGetRecord>> GetRecordByIdItemAttributeLine(int id, int companyId)
    {
        var result = new MyResultPage<ItemAttributeGetRecord>
        {
            Data = new ItemAttributeGetRecord()
        };

        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_ItemAttribuet_GetRecord]";
            result.Data = await conn.QueryFirstOrDefaultAsync<ItemAttributeGetRecord>(sQuery, new
            {
                Id = id,
                CompanyId = companyId
            }, commandType: CommandType.StoredProcedure);
        }

        return result;
    }

    public async Task<ItemAttributeLineGetRecord> GetRecordItemAttributeLine(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetRecord";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<ItemAttributeLineGetRecord>(sQuery, new
            {
                IsSecondLang = false,
                TableName = "wh.ItemAttributeLine",
                Filter = $"Id={id}"
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }

    public async Task<MyResultStatus> ItemAttributeLineSave(ItemAttributeLineModel model)
    {
        var result = new MyResultStatus();
        string validateResult;
        validateResult = await ValidationItemAttributeLine(model, OperationType.Insert);
        if (validateResult.Length > 0)
        {
            result.Successfull = false;
            result.StatusMessage = validateResult;
            return result;
        }

        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_ItemAttribuetLine_InsUpd]";
            conn.Open();
            var outPut = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                model.Id,
                model.ItemAttributeId,
                Name = model.Name.ConvertArabicAlphabet(),
                model.IsActive,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
            result.Id = outPut;
            result.Successfull = outPut > 0 ? true : false;
            result.Status = outPut > 0 ? 100 : -99;
            result.StatusMessage = "عملیات ثبت  با موفقیت انجام پذیرفت";
        }

        return result;
    }


    public async Task<string> ValidationItemAttributeLine(ItemAttributeLineModel model, OperationType operationType)
    {
        var error = "";
        if (model == null)
        {
            error = "درخواست معتبر نمی باشد";
            return error;
        }

        await Task.Run(async () =>
        {
            var existItem = await ExistByItemAttributeLineId(model, operationType);
            if (existItem) error = $"صفت/ویژگی {model.Name} قبلا ثبت شده است، مجاز به ثبت تکراری نیستید";
        });

        return error;
    }

    public async Task<bool> ExistByItemAttributeLineId(ItemAttributeLineModel model, OperationType operationType)
    {
        long existResult = 0;

        string filter;
        if (operationType == OperationType.Insert)
            filter =
                $"Name = N'{model.Name}'  AND ItemAttributeId = N'{model.ItemAttributeId}'  AND CompanyId = N'{model.CompanyId}' ";
        else
            filter =
                $"Name = N'{model.Name}' AND IsActive = N'{model.IsActive}'  AND ItemAttributeId = N'{model.ItemAttributeId}'  AND CompanyId = N'{model.CompanyId}' ";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();

            existResult = await conn.ExecuteScalarAsync<long>(sQuery, new
            {
                TableName = "wh.ItemAttributeLine",
                ColumnName = "Id",
                Filter = filter,
                OrderBy = ""
            }, commandType: CommandType.StoredProcedure);

            conn.Close();
        }

        return existResult > 0;
    }

    public async Task<MyResultStatus> ItemAttributeLineUpdate(ItemAttributeLineModel model)
    {
        var result = new MyResultStatus();
        string validateResult;
        validateResult = await ValidationItemAttributeLine(model, OperationType.Update);
        if (validateResult.Length > 0)
        {
            result.Successfull = false;
            result.StatusMessage = validateResult;
            return result;
        }

        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_ItemAttribuetLine_InsUpd]";
            conn.Open();

            var outPut = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                model.Id,
                model.ItemAttributeId,
                Name = model.Name.ConvertArabicAlphabet(),
                model.IsActive,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.Successfull = outPut > 0 ? true : false;
            result.Status = outPut > 0 ? 100 : -99;
            result.StatusMessage = "عملیات ویرایش با موفقیت انجام پذیرفت";
        }

        return result;
    }

    public async Task<MyResultStatus> ItemAttributeLineDelete(int id)
    {
        var result = new MyResultStatus();

        var validationDelete = await _itemCategoryAttributeRepository.CheckExist_Attribute(null, id.ToString(), 2);

        if (validationDelete > 0)
        {
            result.Successfull = false;
            result.StatusMessage = "ویژگی استفاده شده است، مجاز به حذف نیستید";
        }
        else
        {
            using (var conn = Connection)
            {
                var sQuery = "pb.Spc_Tables_DelRecordWithFilter";
                conn.Open();
                result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
                {
                    TableName = "wh.ItemAttributeLine",
                    Filter = $"Id = N'{id}'"
                }, commandType: CommandType.StoredProcedure);

                conn.Close();
            }

            result.Successfull = result.Status == 100;
            result.StatusMessage = " حذف با موفقیت انجام شد";
        }

        return result;
    }

    //public async Task<bool> ExistItemAttributeLine(int id)
    //{
    //    using (IDbConnection conn = Connection)
    //    {
    //        string sQuery = "pb.Spc_Tables_GetItem";

    //        conn.Open();

    //        var result = await conn.ExecuteScalarAsync<string>(sQuery, new
    //        {
    //            TableName = "wh.ItemCategoryAttribute",
    //            ColumnName = "ItemAttributeLineIds",
    //            Filter = $"ItemAttributeLineIds like '%{id}%'",
    //            OrderBy = ""
    //        }, commandType: CommandType.StoredProcedure);

    //        return string.IsNullOrEmpty(result);
    //    }
    //}

    public async Task<List<MyDropDownViewModel2>> AttributeItem_GetDropDown(string itemCategoryIds, int companyId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("ItemCategoryIds", itemCategoryIds == "null" ? null : itemCategoryIds);
        parameters.Add("CompanyId", companyId);
        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_BaseItemAttribute_GetList]";
            var result = await conn.QueryAsync<object>(sQuery, parameters, commandType: CommandType.StoredProcedure);

            var name = "";
            var id = "";
            var ListName = new List<string>();
            var ListId = new List<string>();
            var groups = result.Select((x, i) => new { Item = x, Index = i });

            foreach (var item in groups)
            {
                name = "";
                id = "";
                var AttributeList = item.Item.ToString().Split(',');
                var count = (AttributeList.Length - 1) / 3;
                for (var i = 1; i < AttributeList.Length; i++)
                for (var k = 0; k < count; k++)
                    if (AttributeList[i].Split('=')[0].Trim() == "Attribute" + k)
                        id += AttributeList[i].Split('=')[1].Trim().Replace("'", "") == "NULL" ||
                              AttributeList[i + 2].Split('=')[1].Trim().Replace("'", "").Replace("{", "")
                                  .Replace("}", "") == "NULL"
                            ? ""
                            : AttributeList[i].Split('=')[1].Trim().Replace("'", "") + ',';
                    else if (AttributeList[i].Split('=')[0].Trim() == "AttributeName" + k)
                        name += AttributeList[i - 2].Split('=')[1].Trim().Replace("'", "") == "NULL" ||
                                AttributeList[i].Split('=')[1].Trim().Replace("'", "").Replace("{", "")
                                    .Replace("}", "") == "NULL"
                            ? ""
                            : AttributeList[i].Split('=')[1].Trim().Replace("'", "").Replace("{", "").Replace("}", "") +
                              ',';
                if (!string.IsNullOrEmpty(name) && !string.IsNullOrEmpty(id))
                {
                    ListName.Add(name.Remove(name.Length - 1, 1));
                    ListId.Add(id.Remove(id.Length - 1, 1));
                }
            }

            var dropDownViewModel = new List<MyDropDownViewModel2>();
            for (var i = 0; i < ListName.Count; i++)
            {
                var drop = new List<MyDropDownViewModel2>
                {
                    new()
                    {
                        Id = ListId[i],
                        Name = ListName[i]
                    }
                };
                dropDownViewModel.AddRange(drop);
            }

            return dropDownViewModel.ToList();
        }
    }
}