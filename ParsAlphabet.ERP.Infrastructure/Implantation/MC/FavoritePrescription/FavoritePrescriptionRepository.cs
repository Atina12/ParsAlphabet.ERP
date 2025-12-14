using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.MC.FavoritePrescription;
using ParsAlphabet.ERP.Application.Interfaces.MC.FavoritePrescription;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.FavoritePrescription;

public class FavoritePrescriptionRepository : IFavoritePrescriptionRepository
{
    private readonly IHttpContextAccessor _accessor;
    private readonly IConfiguration _config;

    public FavoritePrescriptionRepository(IConfiguration config, IHttpContextAccessor httpContextAccessor)
    {
        _config = config;
        _accessor = httpContextAccessor;
    }

    public IDbConnection Connection => new SqlConnection(_config.GetConnectionString("DefaultConnection"));

    public GetColumnsViewModel GetColumns()
    {
        var list = new GetColumnsViewModel
        {
            IsEditable = false,
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", IsPrimary = true, Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, Width = 10
                },
                new()
                {
                    Id = "name", Title = "نام", IsPrimary = true, Type = (int)SqlDbType.NVarChar, Size = 101,
                    IsDtParameter = true, IsFilterParameter = true, Width = 45
                },
                new()
                {
                    Id = "code", Title = "نمبر تذکره", Type = (int)SqlDbType.NVarChar, Size = 101, IsFilterParameter = true,
                    IsDtParameter = true, Width = 45
                }
            }
        };

        return list;
    }

    public async Task<MyResultPage<AssignList>> GetFavoriteDiAssign(NewGetPageViewModel model)
    {
        var result = new MyResultPage<AssignList>
        {
            Data = new AssignList()
        };

        int? p_id = null;
        string p_name = null, p_code = null;

        switch (model.FieldItem)
        {
            case "id":
                p_id = Convert.ToInt32(model.FieldValue);
                break;
            case "name":
                p_name = model.FieldValue;
                break;
            case "code":
                p_code = model.FieldValue;
                break;
        }

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id", model.Form_KeyValue[0]?.ToString());
        parameters.Add("FavoriteCategory", model.Form_KeyValue[1]?.ToString());
        parameters.Add("AdmissionTypeId", model.Form_KeyValue[2]?.ToString());
        parameters.Add("IdentityId", p_id);
        parameters.Add("IdentityName", p_name);
        parameters.Add("IdentityCode", p_code);

        result.Columns = GetColumns();
        var resultAssign = new List<Assigns>();

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_Favorite_DiAssign]";
            conn.Open();
            resultAssign =
                (await conn.QueryAsync<Assigns>(sQuery, parameters, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        result.Data.Assigns = resultAssign;

        return result;
    }

    public async Task<MyResultPage<AssignList>> GetFavoriteAssign(NewGetPageViewModel model)
    {
        var result = new MyResultPage<AssignList>
        {
            Data = new AssignList()
        };

        int? p_id = null;
        string p_name = null, p_code = null;


        switch (model.FieldItem)
        {
            case "id":
                p_id = Convert.ToInt32(model.FieldValue);
                break;
            case "name":
                p_name = model.FieldValue;
                break;
            case "code":
                p_code = model.FieldValue;
                break;
        }

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id", model.Form_KeyValue[0]?.ToString());
        parameters.Add("FavoriteCategory", model.Form_KeyValue[1]?.ToString());
        parameters.Add("AdmissionTypeId", model.Form_KeyValue[2]?.ToString());
        parameters.Add("IdentityId", p_id);
        parameters.Add("IdentityName", p_name);
        parameters.Add("IdentityCode", p_code);

        result.Columns = GetColumns();
        var resultAssign = new List<Assigns>();

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_Favorite_Assign]";
            conn.Open();
            resultAssign =
                (await conn.QueryAsync<Assigns>(sQuery, parameters, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        result.Data.Assigns = resultAssign;

        return result;
    }

    public async Task<List<MyDropDownViewModel>> GetFavoriteList(GetFavoriteAssignDropDown model)
    {
        var parameters = new DynamicParameters();

        parameters.Add("Id", model.Id);
        parameters.Add("FavoriteCategory", model.FavoriteCategory);
        parameters.Add("IdentityId", int.TryParse(model.Term, out _) ? model.Term : "0");
        parameters.Add("IdentityName", model.Term);
        parameters.Add("IdentityCode", int.TryParse(model.Term, out _) ? model.Term : "0");
        parameters.Add("Filter", int.TryParse(model.Term, out _) ? model.Term : "0");

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_Favorite_Assign_List]";
            conn.Open();
            var result =
                (await conn.QueryAsync<MyDropDownViewModel>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<MyResultQuery> FavoriteAssign(FavoriteAssign model)
    {
        var identites = model.Assign.Select(a => a.Id).ToList();
        var result = new MyResultQuery();

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_Favorite_InsDel]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                Opr = "Ins",
                model.AttenderId,
                model.FavoriteCategory,
                Identites = string.Join(',', identites),
                model.AdmissionTypeId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<MyResultQuery> FavoriteDiAssign(FavoriteAssign model)
    {
        var identites = model.Assign.Select(a => a.Id).ToList();
        var result = new MyResultQuery();

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_Favorite_InsDel]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                Opr = "Del",
                model.AttenderId,
                model.FavoriteCategory,
                Identites = string.Join(',', identites),
                model.AdmissionTypeId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<List<MyDropDownViewModel>> FavoriteCategoryDropDown(byte admissionTypeId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.FavoriteCategory",
                    Filter = $"ISNULL(IsActive,0)=1 AND AdmissionTypeId={admissionTypeId}"
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<MyResultPage<List<FavoritenTaminGetPage>>> GetPageFavorite(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<FavoritenTaminGetPage>>();

        result.Columns = GetFavoriteColumns(Convert.ToByte(model.Form_KeyValue[1]?.ToString()));


        var parameters = new DynamicParameters();

        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Ids", model.Form_KeyValue[2]?.ToString());
        parameters.Add("AttenderId", model.Form_KeyValue[0]?.ToString());
        parameters.Add("TaminPrescriptionTypeId", model.Form_KeyValue[1]?.ToString());


        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_FavoriteTamin_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<FavoritenTaminGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<MyResultPage<FavoritenTaminGetPage>> GetRecordFavorite(int id)
    {
        var result = new MyResultPage<FavoritenTaminGetPage>();

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_FavoriteTamin_GetRecord]";
            conn.Open();
            result.Data = await conn.QueryFirstOrDefaultAsync<FavoritenTaminGetPage>(sQuery, new
            {
                Id = id
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        return result;
    }

    public async Task<MyResultStatus> SaveFavorite(SaveFavoritenTamin model)
    {
        var result = new MyResultStatus();

        var errorValidation = await Validate(model);
        if (errorValidation.Count > 0)
            return new MyResultStatus
            {
                Successfull = false,
                ValidationErrors = errorValidation
            };

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_FavoriteTamin_InsUpd]";
            conn.Open();
            var outPut = await conn.QueryFirstOrDefaultAsync<int>(sQuery, new
            {
                model.Id,
                model.AttenderId,
                model.TaminServicePrescriptionId,
                model.TaminPrescriptionTypeId,
                model.CodeTypeId,
                model.Quantity,
                model.TaminDrugInstructionId,
                model.TaminDrugAmountId,
                model.TaminDrugUsageId,
                model.Repeat,
                model.TaminParentOrganId,
                model.TaminOrganId,
                model.TaminIllnessId,
                model.TaminPlanId,
                model.CreateUserId,
                CreateDateTime = DateTime.Now
            }, commandType: CommandType.StoredProcedure);
            result.Successfull = outPut > 0 ? true : false;
            result.Id = outPut;
        }

        return result;
    }

    public async Task<bool> CheckExist(SaveFavoritenTamin model)
    {
        var filter = "";
        if (model.Id == null)
            switch (model.TaminPrescriptionTypeId)
            {
                case 1:
                    filter = $"TaminServicePrescriptionId='{model.TaminServicePrescriptionId}' " +
                             $"AND TaminPrescriptionTypeId='{model.TaminPrescriptionTypeId}' " +
                             $"AND Quantity='{model.Quantity}' " +
                             $"AND TaminDrugInstructionId='{model.TaminDrugInstructionId}'" +
                             $"AND TaminDrugAmountId='{model.TaminDrugAmountId}' " +
                             $"AND TaminDrugUsageId='{model.TaminDrugUsageId}' " +
                             $"AND AttenderId='{model.AttenderId}' " +
                             $"AND Repeat='{model.Repeat}'";
                    break;

                case 13:
                    filter = $"TaminServicePrescriptionId='{model.TaminServicePrescriptionId}' " +
                             $"AND TaminPrescriptionTypeId='{model.TaminPrescriptionTypeId}' " +
                             $"AND Quantity='{model.Quantity}' " +
                             $"AND TaminParentOrganId='{model.TaminParentOrganId}' " +
                             $"AND TaminOrganId='{model.TaminOrganId}'" +
                             $"AND TaminIllnessId='{model.TaminIllnessId}'" +
                             $"AND AttenderId='{model.AttenderId}' " +
                             $"AND TaminPlanId='{model.TaminPlanId}'";
                    break;

                default:
                    filter = $"TaminServicePrescriptionId='{model.TaminServicePrescriptionId}' " +
                             $"AND TaminPrescriptionTypeId='{model.TaminPrescriptionTypeId}' " +
                             $"AND AttenderId='{model.AttenderId}' " +
                             $"AND Quantity='{model.Quantity}'";
                    break;
            }

        else
            switch (model.TaminPrescriptionTypeId)
            {
                case 1:
                    filter = $"TaminServicePrescriptionId='{model.TaminServicePrescriptionId}' " +
                             $"AND TaminPrescriptionTypeId='{model.TaminPrescriptionTypeId}' " +
                             $"AND Quantity='{model.Quantity}' " +
                             $"AND TaminDrugInstructionId='{model.TaminDrugInstructionId}'" +
                             $"AND TaminDrugAmountId='{model.TaminDrugAmountId}' " +
                             $"AND TaminDrugUsageId='{model.TaminDrugUsageId}' " +
                             $"AND Repeat='{model.Repeat}'" +
                             $"AND AttenderId='{model.AttenderId}' " +
                             $"AND ( Id<>{model.Id})";
                    break;

                case 13:
                    filter = $"TaminServicePrescriptionId='{model.TaminServicePrescriptionId}' " +
                             $"AND TaminPrescriptionTypeId='{model.TaminPrescriptionTypeId}' " +
                             $"AND Quantity='{model.Quantity}' " +
                             $"AND TaminParentOrganId='{model.TaminParentOrganId}' " +
                             $"AND TaminOrganId='{model.TaminOrganId}'" +
                             $"AND TaminIllnessId='{model.TaminIllnessId}'" +
                             $"AND TaminPlanId='{model.TaminPlanId}'" +
                             $"AND AttenderId='{model.AttenderId}' " +
                             $"AND ( Id<>{model.Id})";
                    break;

                default:
                    filter = $"TaminServicePrescriptionId='{model.TaminServicePrescriptionId}' " +
                             $"AND TaminPrescriptionTypeId='{model.TaminPrescriptionTypeId}' " +
                             $"AND Quantity='{model.Quantity}'" +
                             $"AND AttenderId='{model.AttenderId}' " +
                             $"AND ( Id<>{model.Id})";
                    break;
            }


        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                TableName = "mc.FavoriteTamin",
                ColumnName = "Id",
                Filter = filter
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result > 0;
        }
    }

    public async Task<MyResultStatus> DeleteFavorite(int id)
    {
        var result = new MyResultStatus();


        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_FavoriteTamin_Delete]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                Id = id
            }, commandType: CommandType.StoredProcedure);
        }


        result.Successfull = result.Status == 100;
        result.ValidationErrors = result.Successfull
            ? new List<string> { "عملیات حذف با موفقیت انجام شد" }
            : new List<string> { "عملیات حذف با موفقیت انجام نشد" };
        return result;
    }

    public GetColumnsViewModel GetFavoriteColumns(byte type)
    {
        var list = new GetColumnsViewModel
        {
            IsSelectable = true,
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", IsPrimary = true, Title = "شناسه ", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    FilterType = "number", Width = 6
                },
                new()
                {
                    Id = "service", Title = type == 1 ? "دارو" : "خدمت ", Type = (int)SqlDbType.Int,
                    IsDtParameter = true, FilterType = "number", Width = 32
                },
                new()
                {
                    Id = "codeTypeId", Title = "برند", Type = (int)SqlDbType.Bit, IsDtParameter = type == 1, Width = 5,
                    Align = "center"
                },
                new()
                {
                    Id = "quantity", Title = "تعداد ", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    FilterType = "number", Width = 6
                },

                new()
                {
                    Id = "taminDrugInstruction", Title = "زمان مصرف ", Type = (int)SqlDbType.Int,
                    IsDtParameter = type == 1, FilterType = "number", Width = 6
                },
                new()
                {
                    Id = "taminDrugAmount", Title = "مقدار مصرف ", Type = (int)SqlDbType.Int, IsDtParameter = type == 1,
                    FilterType = "number", Width = 6
                },
                new()
                {
                    Id = "taminDrugUsage", Title = "طریقه مصرف ", Type = (int)SqlDbType.Int, IsDtParameter = type == 1,
                    FilterType = "number", Width = 6
                },
                new()
                {
                    Id = "repeat", Title = "تکرار ", Type = (int)SqlDbType.Int, IsDtParameter = type == 1,
                    FilterType = "number", Width = 6
                },

                new()
                {
                    Id = "taminParentOrgan", Title = "عنوان اندام ", Type = (int)SqlDbType.Int,
                    IsDtParameter = type == 13, FilterType = "number", Width = 6
                },
                new()
                {
                    Id = "taminOrgan", Title = "اندامک ", Type = (int)SqlDbType.Int, IsDtParameter = type == 13,
                    FilterType = "number", Width = 6
                },
                new()
                {
                    Id = "taminIllness", Title = "نام بیماری ", Type = (int)SqlDbType.Int, IsDtParameter = type == 13,
                    FilterType = "number", Width = 6
                },
                new()
                {
                    Id = "taminPlan", Title = "طرح درمان ", Type = (int)SqlDbType.Int, IsDtParameter = type == 13,
                    FilterType = "number", Width = 6
                },

                new()
                {
                    Id = "effectiveDatePersian", Title = "تاریخ موثر ", Type = (int)SqlDbType.Int,
                    IsDtParameter = type == 1, FilterType = "number", Width = 8
                },
                new()
                {
                    Id = "createUser", Title = "کاربر ثبت کننده ", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    FilterType = "number", Width = 10
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت ", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    FilterType = "number", Width = 8
                },

                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 7 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "editfavoritetamin", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green"
                },
                new()
                {
                    Name = "deletefavoritetamin", Title = "حذف", ClassName = "", IconName = "fa fa-trash color-maroon"
                }
            }
        };

        return list;
    }

    public async Task<List<string>> Validate(SaveFavoritenTamin model)
    {
        var error = new List<string>();

        if (model == null)
        {
            error.Add("مقادیر معتبر نمی باشد");
        }

        else
        {
            var checkExist = await CheckExist(model);

            if (checkExist)
                error.Add("آیتم موردنظر قبلا به ثبت رسیده است");
        }

        return error;
    }
}