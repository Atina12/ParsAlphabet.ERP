using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.MC.AttenderMarginBracket;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.User;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.AttenderMarginBracket;

public class AttenderMarginBracketRepository : BaseRepository<AttenderMarginBracketModel, int, string>,
    IBaseRepository<AttenderMarginBracketModel, int, string>
{
    private readonly UserRepository _userRepository;

    public AttenderMarginBracketRepository(IConfiguration config, UserRepository userRepository) : base(config)
    {
        _userRepository = userRepository;
    }

    public new GetColumnsViewModel GetColumns()
    {
        var list = new GetColumnsViewModel
        {
            IsEditable = true,
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.Int, Size = 50, FilterType = "number",
                    IsDtParameter = true, IsFilterParameter = true, Width = 15, IsPrimary = true
                },
                new()
                {
                    Id = "name", Title = "نام", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, Width = 15, IsPrimary = true
                },
                new()
                {
                    Id = "createUserFullName", Title = " کاربر ثبت کننده", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 15
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 15
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, Size = 50, IsDtParameter = true,
                    Width = 15
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 20 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "edit", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green" },
                new() { Name = "delete", Title = "حذف", ClassName = "", IconName = "fa fa-trash color-maroon" },
                new() { Name = "additem", Title = "تخصیص متغیر", ClassName = "", IconName = "fas fa-plus color-blue" }
            }
        };


        return list;
    }

    public async Task<MyResultPage<List<AttenderMarginBracketGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<AttenderMarginBracketGetPage>>
        {
            Data = new List<AttenderMarginBracketGetPage>()
        };

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
            var sQuery = "[mc].[Spc_AttenderMarginBracket_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<AttenderMarginBracketGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<AttenderMarginBracketGetRecord> GetRecordById(int Id)
    {
        using (var conn = Connection)
        {
            conn.Open();
            var sQuery = "pb.Spc_Tables_GetRecord";
            var result = await conn.QueryFirstOrDefaultAsync<AttenderMarginBracketGetRecord>(sQuery, new
            {
                TableName = "mc.AttenderMarginBracket",
                Filter = $"Id={Id}"
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.CreateUserFullName = await _userRepository.GetUserFullName(result.CreateUserId);

            return result;
        }
    }

    public async Task<bool> CheckExistBracketByDepartmentId(int id, short departmentId)
    {
        var filter = $"DepartmentId={departmentId}";

        if (id != 0)
            filter += $" AND Id<>{id}";

        using (var conn = Connection)
        {
            conn.Open();
            var sQuery = "pb.Spc_Tables_GetItem";
            var result = await conn.ExecuteScalarAsync<short>(sQuery, new
            {
                TableName = "mc.AttenderMarginBracket",
                ColumnName = "Id",
                Filter = filter
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result > 0;
        }
    }

    public async Task<MyResultStatus> Insert(AttenderMarginBracketModel model)
    {
        var result = new MyResultStatus();
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AttenderMarginBracket_InsUpd]";
            conn.Open();
            await conn.ExecuteAsync(sQuery, new
            {
                model.Opr,
                model.Id,
                model.Name,
                model.NameEng,
                model.IsActive,
                model.CompanyId,
                model.CreateUserId,
                model.CreateDateTime
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = true;

        result.DateTime = model.CreateDateTime;

        return result;
    }

    public async Task<MyResultQuery> Delete(int id, int companyId)
    {
        var result = new MyResultQuery();


        var resultDeleteLine = await DeleteLine(id);

        if (!resultDeleteLine.Successfull)
            return resultDeleteLine;

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_DelRecordWithFilter";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                TableName = "mc.AttenderMarginBracket",
                Filter = $"Id = {id} AND CompanyId = {companyId}"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();
        }

        result.Successfull = result.Status == 100;

        return result;
    }

    public async Task<MyResultQuery> DeleteLine(int id)
    {
        var result = new MyResultQuery();

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_DelRecordWithFilter";

            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                TableName = "mc.AttenderMarginBracketLine",
                Filter = $"HeaderId={id}"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();
        }

        result.Successfull = result.Status == 100;

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
                p.CreateUserFullName,
                p.CreateDateTimePersian,
                IsActive = p.IsActive ? "فعال" : "غیر فعال"
            };
        return result;
    }

    public async Task<List<MyDropDownViewModel>> GetDropDown(string term, int companyId)
    {
        var filter = $"CompanyId={companyId} AND IsActive=1 AND Name Like N'%{term}%'";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "hr.OrganizationalDepartment",
                    IdColumnName = "",
                    TitleColumnName = "Name",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetAttenderMarginBracketDropDown(byte isActive)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AttenderMarginBracket_GetList]";
            conn.Open();

            var result = (await conn.QueryAsync<AttenderMarginBracketDropDown>(sQuery,
                new
                {
                    IsActive = isActive
                }, commandType: CommandType.StoredProcedure)).ToList();

            var finalResult = (from p in result
                select new MyDropDownViewModel
                {
                    Id = p.Id,
                    Name = p.PriceTypeId > 0
                        ? p.Name + $"/ مبنای حق الزحمه: {p.PriceTypeName} " +
                          $"({p.AttenderCommissionValueName}) -  ({p.MinAmountTitle} - {p.MaxAmountTitle})"
                        : p.Name
                }).ToList();


            return finalResult;
        }
    }
}