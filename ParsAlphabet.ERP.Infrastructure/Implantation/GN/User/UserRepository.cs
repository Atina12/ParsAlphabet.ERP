using System.Collections;
using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.GN.User;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.Company;
using Profile = ParsAlphabet.ERP.Application.Dtos.GN.User.Profile;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.GN.User;

public class UserRepository :
    BaseRepository<UserModel, int, string>,
    IBaseRepository<UserModel, int, string>
{
    private readonly CompanyRepository _companyRepository;

    public UserRepository(IConfiguration config, CompanyRepository companyRepository, IHttpContextAccessor accessor) :
        base(config)
    {
        _companyRepository = companyRepository;
    }


    public GetColumnsViewModel GetColumns(int fromValue)
    {
        var list = new GetColumnsViewModel
        {
            ActionType = fromValue != 0 ? "inline" : "dropdown",
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number", Width = 6
                },
                new()
                {
                    Id = "username", Title = "نام کاربری", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 11
                },
                new()
                {
                    Id = "fullName", Title = "نام کامل", Type = (int)SqlDbType.NVarChar, Size = 101, IsPrimary = true,
                    IsDtParameter = true, IsFilterParameter = true, Width = 10
                },
                new()
                {
                    Id = "nationalCode", Title = "نمبر تذکره", Type = (int)SqlDbType.VarChar, Size = 10,
                    IsFilterParameter = true, Width = 10
                },
                new()
                {
                    Id = "email", Title = "ایمیل", Type = (int)SqlDbType.VarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, Width = 15
                },
                new()
                {
                    Id = "mobileNo", Title = "موبایل", Type = (int)SqlDbType.VarChar, Size = 11, IsDtParameter = true,
                    IsFilterParameter = true, Width = 10
                },
                new()
                {
                    Id = "roleName", Title = "نقش", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/GN/RoleApi/getalldatadropdown", Width = 10
                },
                new()
                {
                    Id = "roleId", Title = "شناسه نقش", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = false, IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/GN/RoleApi/getalldatadropdown", Width = 10
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 5,
                    Align = "center"
                },
                new()
                {
                    Id = "picture", Title = "تصویر", Align = "center", Type = (int)SqlDbType.VarBinary, Size = 8000,
                    IsDtParameter = true, Width = 8
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 15 }
            }
        };

        if (fromValue == 0)
            list.Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "edit", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green" },
                new() { Name = "delete", Title = "حذف", ClassName = "", IconName = "fa fa-trash color-maroon" },
                new() { Name = "sep1", Title = "", ClassName = "", IconName = "", IsSeparator = true },
                new()
                {
                    Name = "changepass", Title = "تغییر رمز عبور", ClassName = "btn blue_outline_1",
                    IconName = "fas fa-lock"
                }
            };
        // تخصیص کاربر به کدینگ
        else if (fromValue == 1)
            list.Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "accountSGLUser", Title = "تخصیص کاربر به کدینگ حسابداری", ClassName = "btn blue_outline_1",
                    IconName = "fa fa-list"
                }
            };
        // تخصیص کاربران به انبار
        else if (fromValue == 2)
            list.Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "userWarehouse", Title = "تخصیص کاربران به انبار", ClassName = "btn blue_outline_1",
                    IconName = "fa fa-list"
                }
            };
        // تخصیص کاربران طبیب
        else if (fromValue == 3)
            list.Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "userAssistant", Title = "تخصیص کاربران به طبیب", ClassName = "btn blue_outline_1",
                    IconName = "fa fa-list"
                }
            };
        return list;
    }

    public async Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model)
    {
        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                GetColumns(0).DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title))
        };
        var getPage = await GetPage(model);
        result.Rows = from p in getPage.Data
            select new
            {
                p.Id,
                p.Username,
                p.FullName,
                p.Email,
                p.MobileNo,
                p.Role,
                IsActive = p.IsActive ? "فعال" : "غیرفعال"
            };
        return result;
    }

    public async Task<MyResultPage<List<UserGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<UserGetPage>>
        {
            Data = new List<UserGetPage>()
        };

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("FullName",
            model.Filters.Any(x => x.Name == "fullName")
                ? model.Filters.FirstOrDefault(x => x.Name == "fullName").Value
                : null);
        parameters.Add("Username",
            model.Filters.Any(x => x.Name == "username")
                ? model.Filters.FirstOrDefault(x => x.Name == "username").Value
                : null);
        parameters.Add("NationalCode",
            model.Filters.Any(x => x.Name == "nationalCode")
                ? model.Filters.FirstOrDefault(x => x.Name == "nationalCode").Value
                : null);
        parameters.Add("MobileNo",
            model.Filters.Any(x => x.Name == "mobileNo")
                ? model.Filters.FirstOrDefault(x => x.Name == "mobileNo").Value
                : null);
        parameters.Add("Email",
            model.Filters.Any(x => x.Name == "email")
                ? model.Filters.FirstOrDefault(x => x.Name == "email").Value
                : null);
        parameters.Add("RoleId",
            model.Filters.Any(x => x.Name == "roleName")
                ? model.Filters.FirstOrDefault(x => x.Name == "roleName").Value
                : null);
        parameters.Add("CompanyId", model.CompanyId);

        if (model.Form_KeyValue?.Length > 0)
        {
            var column = Convert.ToInt32(model.Form_KeyValue[0]?.ToString());
            result.Columns = GetColumns(column);
        }
        else
        {
            result.Columns = GetColumns(0);
        }

        using (var conn = Connection)
        {
            var sQuery = "gn.Spc_User_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<UserGetPage>(sQuery, parameters, commandType: CommandType.StoredProcedure))
                .ToList();
        }

        return result;
    }

    public async Task<MyResultPage<UserGetRecord>> GetRecordById(int id)
    {
        var result = new MyResultPage<UserGetRecord>
        {
            Data = new UserGetRecord()
        };
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetRecord";
            result.Data = await conn.QueryFirstOrDefaultAsync<UserGetRecord>(sQuery, new
            {
                MyClaim.IsSecondLang,
                TableName = "gn.[User]",
                Filter = $"Id={id}"
            }, commandType: CommandType.StoredProcedure);
        }

        return result;
    }

    public async Task<MyResultPage<UserGetRecord>> GetUserByNationalCode(GetUserByNationalCode model)
    {
        var result = new MyResultPage<UserGetRecord>
        {
            Data = new UserGetRecord()
        };
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetRecord";
            result.Data = await conn.QueryFirstOrDefaultAsync<UserGetRecord>(sQuery, new
            {
                MyClaim.IsSecondLang,
                TableName = "gn.[User]",
                Filter = $"ISNULL(NationalCode,'')={model.NationalCode} AND CompanyId={model.CompanyId}"
            }, commandType: CommandType.StoredProcedure);
        }

        return result;
    }


    public async Task<MyResultQuery> AlwoInsert(int CompanyId)
    {
        var result = new MyResultQuery();
        var CountUser = await GetUserCount(CompanyId);
        var UserActiveCount = await _companyRepository.GetUserActiveCount(CompanyId);
        if (CountUser > UserActiveCount)
        {
            result.Successfull = false;
            result.StatusMessage = "مجاز به ثبت کاربر جدید نمی باشید";
        }
        else
        {
            result.Successfull = true;
        }

        return result;
    }

    public async Task<MyResultQuery> Insert(UserModel model)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "gn.Spc_User_InsUpd";
            conn.Open();
            await conn.ExecuteAsync(sQuery, new
            {
                Opr = "Ins",
                Id = 0,
                model.FirstName,
                model.LastName,
                model.NationalCode,
                model.MobileNo,
                model.Email,
                model.Username,
                model.IsActive,
                model.PasswordSalt,
                model.PasswordHash,
                model.Picture,
                model.RoleId,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = true;
        return result;
    }

    public async Task<MyResultQuery> Update(UserModel model)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "gn.Spc_User_InsUpd";
            conn.Open();

            await conn.ExecuteAsync(sQuery, new
            {
                Opr = "Upd",
                model.Id,
                model.FirstName,
                model.LastName,
                model.NationalCode,
                model.MobileNo,
                model.Email,
                model.Username,
                model.IsActive,
                model.RoleId,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = true;
        return result;
    }

    public async Task<MyResultQuery> Delete(int keyvalue)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_DelRecord";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                TableName = "gn.[User]",
                RecordId = keyvalue
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<MyResultQuery> ChangePassword(int userid, string passwordhash, string passwordsalt)
    {
        using (var conn = Connection)
        {
            var sQuery = "gn.Spc_User_ChangePassword";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery,
                new
                {
                    userid,
                    passwordhash,
                    passwordsalt
                }, commandType: CommandType.StoredProcedure);

            result.Successfull = result.Status == 0;

            return result;
        }
    }

    public async Task<MyResultQuery> UpdateProfile(int userId, string passwordHash, string passwordSalt)
    {
        using (var conn = Connection)
        {
            var sQuery = "[gn].[Spc_User_UpdateProfile]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery,
                new
                {
                    Id = userId,
                    PasswordHash = passwordHash,
                    PasswordSalt = passwordSalt
                }, commandType: CommandType.StoredProcedure);

            result.Successfull = true;

            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetDropDown(int companyId, byte roleId, byte? isActive, bool isSystem)
    {
        var filter = $"CompanyId={companyId} ";

        if (roleId > 0)
            filter += $" AND RoleId={roleId}";

        if (!isSystem) filter += " AND Id<>1";

        if (isActive != null && isActive != 2)
            filter += $" AND IsActive = {(isActive == 1 ? 1 : 0)} ";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "gn.[User]",
                    TitleColumnName = "FullName",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<string> GetUserFullName(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    TableName = "gn.[User]",
                    ColumnName = "FullName",
                    Filter = $"Id={id}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }


    public async Task<int> GetUserCount(int CompanyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<int>(sQuery,
                new
                {
                    TableName = "gn.[User]",
                    ColumnName = "Count(Id)",
                    Filter = $"IsActive=1 and CompanyId={CompanyId}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<byte> GetUserRoleId(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<byte>(sQuery,
                new
                {
                    TableName = "gn.[User]",
                    ColumnName = "RoleId",
                    Filter = $"Id={id}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<Profile> GetProfile(int userId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[gn].[Spc_User_GetInfoByUserId]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<Profile>(sQuery,
                new
                {
                    UserId = userId
                }, commandType: CommandType.StoredProcedure);

            return result;
        }
    }

    public async Task<bool> CheckNationalCode(MyDropDownViewModel model)
    {
        var filter = "";

        if (model.Id == 0)
            filter = $"NationalCode='{model.Name}' AND CompanyId={model.CompanyId}";
        else
            filter = $"NationalCode='{model.Name}' AND ( Id<>{model.Id}) AND CompanyId={model.CompanyId}";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    TableName = "gn.[User]",
                    ColumnName = "NationalCode",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure);

            return result == null ? true : false;
        }
    }

    public async Task<bool> UserSetONOFF(bool isOn, int userId, int companyId)
    {
        var filter = $"Id={userId} AND CompanyId={companyId}";

        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_UpdItem_Number]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                TableName = "gn.[User]",
                ColumnName = "IsOnline",
                Value = isOn,
                Filter = filter
            }, commandType: CommandType.StoredProcedure);

            return result == null ? true : false;
        }
    }

    public async Task<bool> CheckExistMobileNumber(MyDropDownViewModel model)
    {
        var filter = "";

        if (model.Id == 0)
            filter = $"MobileNo='{model.Name}' AND CompanyId={model.CompanyId}";
        else
            filter = $"MobileNo='{model.Name}' AND ( Id<>{model.Id}) AND CompanyId={model.CompanyId}";
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<int>(sQuery,
                new
                {
                    TableName = "gn.[User]",
                    ColumnName = "Id",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result == 0 ? true : false;
        }
    }

    public async Task<bool> CheckExistEmailAddress(MyDropDownViewModel model)
    {
        var filter = "";

        if (model.Id == 0)
            filter = $"Email='{model.Name}' AND CompanyId={model.CompanyId}";
        else
            filter = $"Email='{model.Name}' AND ( Id<>{model.Id}) AND CompanyId={model.CompanyId}";
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<int>(sQuery,
                new
                {
                    TableName = "gn.[User]",
                    ColumnName = "Id",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result == 0 ? true : false;
        }
    }

    public async Task<bool> CheckExistUserName(MyDropDownViewModel model)
    {
        var filter = "";

        if (model.Id == 0)
            filter = $"UserName='{model.Name}' AND CompanyId={model.CompanyId}";
        else
            filter = $"Username='{model.Name}' AND ( Id<>{model.Id}) AND CompanyId={model.CompanyId}";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<int>(sQuery,
                new
                {
                    TableName = "gn.[User]",
                    ColumnName = "Id",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result == 0 ? true : false;
        }
    }
}