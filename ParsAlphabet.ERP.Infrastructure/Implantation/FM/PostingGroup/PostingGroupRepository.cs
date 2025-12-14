using System.Collections;
using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.FM.PostingGroup;
using ParsAlphabet.ERP.Application.Interfaces.FM.PostingGroup;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.AccountGL;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.DocumentType;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.FM.PostingGroup;

public class PostingGroupRepository : IPostingGroupRepository
{
    private readonly IHttpContextAccessor _accessor;
    private readonly AccountGLRepository _accountGLRepository;
    private readonly IConfiguration _config;
    private readonly DocumentTypeRepository _documentTypeRepository;

    public PostingGroupRepository(IConfiguration config, IHttpContextAccessor accessor,
        AccountGLRepository accountGLRepository, DocumentTypeRepository documentTypeRepository)
    {
        _config = config;
        _accessor = accessor;
        _accountGLRepository = accountGLRepository;
        _documentTypeRepository = documentTypeRepository;
    }

    public IDbConnection Connection => new SqlConnection(_config.GetConnectionString("DefaultConnection"));

    public GetColumnsViewModel GetColumnsTreasurySubject()
    {
        var list = new GetColumnsViewModel
        {
            ActionType = "inline",
            DataColumns = new List<DataColumnsViewModel>
            {
                new() { Id = "id", Title = "شناسه", IsPrimary = true, Type = (int)SqlDbType.Int },
                new()
                {
                    Id = "headerId", Title = "شناسه", IsPrimary = true, Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number", Width = 5
                },
                new()
                {
                    Id = "headerName", Title = "نام", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, Width = 35
                },
                new()
                {
                    Id = "cashFlowCategoryName", Title = "طبقه بندی گردش وجوه", Type = (int)SqlDbType.NVarChar,
                    Size = 50, IsDtParameter = true, IsFilterParameter = true, Width = 20
                },
                new() { Id = "stageId", Title = "شناسه مرحله", IsPrimary = true, Type = (int)SqlDbType.Int },
                new()
                {
                    Id = "stageName", Title = " مرحله", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/WF/StageApi/getdropdownhastreasurysubject", Width = 15
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, Size = 1, IsDtParameter = true,
                    Align = "center", Width = 10
                },
                new()
                {
                    Id = "isPostingGroup", Title = "ارتباط حسابداری", Type = (int)SqlDbType.Bit, Size = 1,
                    IsDtParameter = true, Align = "center", Width = 10
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 10 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "postgroupdetaillist", Title = "مبانی سربرگ", ClassName = "btn green_outline_1",
                    IconName = "fa fa-link"
                }
            }
        };

        return list;
    }

    public GetColumnsViewModel GetColumnsBankAccount()
    {
        var list = new GetColumnsViewModel
        {
            ActionType = "inline",
            DataColumns = new List<DataColumnsViewModel>
            {
                new() { Id = "id", Title = "شناسه", IsPrimary = true, Type = (int)SqlDbType.Int, Width = 5 },
                new()
                {
                    Id = "headerId", Title = "شناسه", IsPrimary = true, Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, Width = 5
                },
                new()
                {
                    Id = "headerName", Title = "نام", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, Width = 15
                },
                new()
                {
                    Id = "bankName", Title = "بانک", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "select2", FilterTypeApi = "/api/FM/BankApi/getdropdown",
                    Width = 9
                },
                new()
                {
                    Id = "accountCategoryName", Title = "دسته بندی", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 9
                },
                new()
                {
                    Id = "branchName", Title = "شعبه", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 9
                },
                new()
                {
                    Id = "branchNo", Title = "کد شعبه", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 9
                },
                new()
                {
                    Id = "accountNo", Title = "شماره حساب", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 14
                },
                new()
                {
                    Id = "countryName", Title = "کشور/ولایت/شهر", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, Size = 1, IsDtParameter = true,
                    Align = "center", Width = 5
                },
                new()
                {
                    Id = "isPostingGroupLine", Title = "ارتباط حسابداری", Type = (int)SqlDbType.Bit, Size = 1,
                    IsDtParameter = true, Align = "center", Width = 10
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 5 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "postgrouplinedetaillist", Title = "مبانی پابرگ", ClassName = "btn green_outline_1",
                    IconName = "fa fa-link"
                }
            }
        };

        return list;
    }

    public GetColumnsViewModel GetColumnsBranch()
    {
        var list = new GetColumnsViewModel
        {
            ActionType = "inline",
            DataColumns = new List<DataColumnsViewModel>
            {
                new() { Id = "id", Title = "شناسه", IsPrimary = true, Type = (int)SqlDbType.Int, Width = 5 },
                new()
                {
                    Id = "headerId", Title = "شناسه", IsPrimary = true, Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, Width = 10
                },
                new()
                {
                    Id = "headerName", Title = "نام", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, Width = 15
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, Size = 1, IsDtParameter = true,
                    Align = "center", Width = 10
                },
                new()
                {
                    Id = "isPostingGroupLine", Title = "ارتباط حسابداری", Type = (int)SqlDbType.Bit, Size = 1,
                    IsDtParameter = true, Align = "center", Width = 15
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 35 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "postGroupLineDetailListTreasury", Title = "مبانی پابرگ (خزانه)",
                    ClassName = "btn blue_outline_1", IconName = "fa fa-link"
                },
                new()
                {
                    Name = "postGroupLineDetailListPurchase", Title = "مبانی پابرگ (خرید)",
                    ClassName = "btn green_outline_1", IconName = "fa fa-link"
                },
                new()
                {
                    Name = "postGroupLineDetailListSale", Title = "مبانی پابرگ (فروش)",
                    ClassName = "btn maroon_outline", IconName = "fa fa-link"
                },
                new()
                {
                    Name = "postGroupLineDetailListWarehouse", Title = "مبانی پابرگ (انبار)",
                    ClassName = "btn orange_outline", IconName = "fa fa-link"
                }
            }
        };

        return list;
    }

    public GetColumnsViewModel GetColumnsAdmission()
    {
        var list = new GetColumnsViewModel
        {
            ActionType = "inline",
            DataColumns = new List<DataColumnsViewModel>
            {
                new() { Id = "id", Title = "شناسه", IsPrimary = true, Type = (int)SqlDbType.Int, Width = 5 },
                new()
                {
                    Id = "headerId", Title = "شناسه", IsPrimary = true, Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, Width = 15
                },
                new()
                {
                    Id = "headerName", Title = "نام", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, Width = 15
                },
                new()
                {
                    Id = "isPostingGroup", Title = "ارتباط حسابداری/سربرگ", Type = (int)SqlDbType.Bit, Size = 1,
                    IsDtParameter = true, Align = "center", Width = 10
                },
                new()
                {
                    Id = "isPostingGroupLine", Title = "ارتباط حسابداری/پابرگ", Type = (int)SqlDbType.Bit, Size = 1,
                    IsDtParameter = true, Align = "center", Width = 10
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 45 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "postgroupdetaillist", Title = "مبانی سربرگ", ClassName = "btn green_outline_1",
                    IconName = "fa fa-link"
                },
                new()
                {
                    Name = "postgroupadmlinedetaillist", Title = "مبانی پابرگ", ClassName = "btn green_outline_3",
                    IconName = "fa fa-link"
                }
            }
        };

        return list;
    }

    public GetColumnsViewModel GetColumnsWarehouse()
    {
        var list = new GetColumnsViewModel
        {
            ActionType = "inline",
            DataColumns = new List<DataColumnsViewModel>
            {
                new() { Id = "id", Title = "شناسه", IsPrimary = true, Type = (int)SqlDbType.Int, Width = 5 },
                new()
                {
                    Id = "headerId", Title = "شناسه", IsPrimary = true, Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, Width = 15
                },
                new()
                {
                    Id = "headerName", Title = "نام", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, Width = 15
                },
                new()
                {
                    Id = "isPostingGroup", Title = "ارتباط حسابداری", Type = (int)SqlDbType.Bit, Size = 1,
                    IsDtParameter = true, Align = "center", Width = 10
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 45 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "postgroupdetaillist", Title = "مبانی سربرگ", ClassName = "btn green_outline_1",
                    IconName = "fa fa-link"
                }
            }
        };

        return list;
    }

    public GetColumnsViewModel GetColumnsTreasury()
    {
        var list = new GetColumnsViewModel
        {
            ActionType = "inline",
            DataColumns = new List<DataColumnsViewModel>
            {
                new() { Id = "id", Title = "شناسه", IsPrimary = true, Type = (int)SqlDbType.Int, Width = 5 },
                new()
                {
                    Id = "headerId", Title = "شناسه", IsPrimary = true, Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, Width = 5
                },
                new()
                {
                    Id = "headerName", Title = "نام", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, Width = 5
                },
                new()
                {
                    Id = "isPostingGroup", Title = "ارتباط حسابداری", Type = (int)SqlDbType.Bit, Size = 1,
                    IsDtParameter = true, Align = "center", Width = 6
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 10 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "postgroupdetaillist", Title = "مبانی سربرگ", ClassName = "btn green_outline_1",
                    IconName = "fa fa-link"
                }
            }
        };

        return list;
    }

    public async Task<MyResultPage<IEnumerable>> GetPage(NewGetPageViewModel model)
    {
        var type = (PostingGroupType)byte.Parse(model.Form_KeyValue[0]?.ToString());

        var result = new MyResultPage<IEnumerable>();

        if (type == PostingGroupType.TreasurySubject)
            result.Data = new List<PostingGroupTreasurySubjectGetPage>();
        else if (type == PostingGroupType.BankAccount)
            result.Data = new List<PostingGroupBankAccountGetPage>();
        else if (type == PostingGroupType.Branch)
            result.Data = new List<PostingGroupBranchGetPage>();
        else if (type == PostingGroupType.AdmissionService || type == PostingGroupType.AdmissionItem)
            result.Data = new List<PostingGroupAdmissionGetPage>();
        else if (type == PostingGroupType.Warehouse) result.Data = new List<PostingGroupWarehouseGetPage>();

        int? p_id = 0;
        int? p_bankId = null, p_stageId = null;
        string p_name = "", p_cashflowCategory = "", p_accountNo = "";

        switch (model.FieldItem)
        {
            case "headerId":
                p_id = Convert.ToInt32(model.FieldValue);
                break;
            case "headerName":
                p_name = model.FieldValue;
                break;
            case "cashFlowCategoryName":
                p_cashflowCategory = model.FieldValue;
                break;
            case "bankName":
                p_bankId = Convert.ToInt32(model.FieldValue);
                break;
            case "accountNo":
                p_accountNo = model.FieldValue;
                break;
            case "stageName":
                p_stageId = Convert.ToInt32(model.FieldValue);
                break;
        }

        var parameters = new DynamicParameters();

        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id", p_id == 0 ? null : p_id);
        parameters.Add("Name", p_name == "" ? null : p_name);
        parameters.Add("StageId", p_stageId == 0 ? null : p_stageId);
        parameters.Add("cashFlowCategoryName", p_cashflowCategory == "" ? null : p_cashflowCategory);
        parameters.Add("BankId", p_bankId);
        parameters.Add("AccountNo", p_accountNo == "" ? null : p_accountNo);
        parameters.Add("Type", model.Form_KeyValue[0]?.ToString());

        if (model.CompanyId == 0)
            parameters.Add("CompanyId");
        else
            parameters.Add("CompanyId", model.CompanyId);

        var resultCount = 0;

        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_PostingGroup_GetPage]";
            conn.Open();

            if (type == PostingGroupType.TreasurySubject)
            {
                result.Columns = GetColumnsTreasurySubject();
                var resultTreasury =
                    (await conn.QueryAsync<PostingGroupTreasurySubjectGetPage>(sQuery, parameters,
                        commandType: CommandType.StoredProcedure)).ToList();
                resultCount = resultTreasury.Count;
                result.Data = resultTreasury;
            }
            else if (type == PostingGroupType.BankAccount)
            {
                result.Columns = GetColumnsBankAccount();
                var resultBankAccount =
                    (await conn.QueryAsync<PostingGroupBankAccountGetPage>(sQuery, parameters,
                        commandType: CommandType.StoredProcedure)).ToList();
                resultCount = resultBankAccount.Count;
                result.Data = resultBankAccount;
            }
            else if (type == PostingGroupType.Branch)
            {
                result.Columns = GetColumnsBranch();
                var resultBranch =
                    (await conn.QueryAsync<PostingGroupBranchGetPage>(sQuery, parameters,
                        commandType: CommandType.StoredProcedure)).ToList();
                resultCount = resultBranch.Count;
                result.Data = resultBranch;
            }
            else if (type == PostingGroupType.AdmissionService || type == PostingGroupType.AdmissionItem)
            {
                result.Columns = GetColumnsAdmission();
                var resultAdmission =
                    (await conn.QueryAsync<PostingGroupAdmissionGetPage>(sQuery, parameters,
                        commandType: CommandType.StoredProcedure)).ToList();
                resultCount = resultAdmission.Count;
                result.Data = resultAdmission;
            }
            else if (type == PostingGroupType.Warehouse)
            {
                result.Columns = GetColumnsWarehouse();
                var resultWarehouse =
                    (await conn.QueryAsync<PostingGroupWarehouseGetPage>(sQuery, parameters,
                        commandType: CommandType.StoredProcedure)).ToList();
                resultCount = resultWarehouse.Count;
                result.Data = resultWarehouse;
            }
        }

        return result;
    }

    public async Task<MyResultPage<PostingGroupGetRecord>> PostingGroupGetRecordById(GetPostingGroupRecord model)
    {
        var result = new MyResultPage<PostingGroupGetRecord>
        {
            Data = new PostingGroupGetRecord()
        };
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_PostingGroup_GetRecord]";
            result.Data = await conn.QueryFirstOrDefaultAsync<PostingGroupGetRecord>(sQuery, new
            {
                PostingGroupType = model.PostingGroupType == 4 && (model.Id == 54 || model.Id == 55)
                    ? 5
                    : model.PostingGroupType,
                model.Id,
                model.LineId,
                model.CompanyId,
                model.BranchId,
                model.StageId
            }, commandType: CommandType.StoredProcedure);
        }

        return result;
    }

    //public async Task<PostingGroupSaveResultQuery> Save(PostingGroupHeaderModel model)
    //{
    //    var result = new PostingGroupSaveResultQuery();
    //    using (IDbConnection conn = Connection)
    //    {
    //        string sQuery = "[fm].[Spc_PostingGroup_InsUpd]";
    //        conn.Open();
    //        result = await conn.QueryFirstOrDefaultAsync<PostingGroupSaveResultQuery>(sQuery, new
    //        {
    //            model.Opr,
    //            model.Id,
    //            model.PostingGroupHeaderId,
    //            model.HeaderId,
    //            model.StageId,
    //            model.DocumentTypeId,
    //            PostingGroupTypeId = model.HeaderId == 54 || model.HeaderId == 55 ? 5 : model.PostingGroupTypeId,
    //            model.AccountGLId,
    //            model.AccountSGLId,
    //            model.CompanyId,
    //            model.BranchId,
    //            model.IsActive,
    //            model.CreateDateTime
    //        }, commandType: CommandType.StoredProcedure);
    //        conn.Close();
    //        result.Successfull = result.Status == 100;
    //        result.HasHeader = result.Id != 0;
    //    }

    //    return result;
    //}

    //public async Task<PostingGroupSaveResultQuery> SaveLine(PostingGroupLineModel model)
    //{
    //    var result = new PostingGroupSaveResultQuery();
    //    using (IDbConnection conn = Connection)
    //    {
    //        string sQuery = "[fm].[Spc_PostingGroupLine_InsUpd]";
    //        conn.Open();
    //        result = await conn.QueryFirstOrDefaultAsync<PostingGroupSaveResultQuery>(sQuery, new
    //        {
    //            model.Opr,
    //            model.Id,
    //            model.PostingGroupLineId,
    //            model.PostingGroupTypeLineId,
    //            model.HeaderId,
    //            model.PostingGroupTypeId,
    //            model.StageIdentityId,
    //            model.IdentityTypeId,
    //            model.ItemCategoryId,
    //            model.AccountGLId,
    //            model.AccountSGLId,
    //            model.CompanyId,
    //            model.CreateDateTime,
    //            model.IsActive,
    //            model.BranchId,
    //        }, commandType: CommandType.StoredProcedure);
    //        conn.Close();
    //        result.Successfull = result.Status == 100;
    //        result.HasHeader = result.Id != 0;
    //    }

    //    return result;
    //}

    public async Task<MyResultStatus> Delete(string filter)
    {
        var result = new MyResultStatus();

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_DelRecordWithFilter";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(
                sQuery, new
                {
                    TableName = "fm.PostingGroupLine",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public GetColumnsViewModel GetColumnsDetailPageHeaderList(byte workFlowCategoryId)
    {
        var listDocumentType = new List<MyDropDownViewModel>();

        if (workFlowCategoryId != 0)
            listDocumentType = _documentTypeRepository.GetDropDownByWorkflowCategoryId(workFlowCategoryId).Result;
        else
            listDocumentType = _documentTypeRepository.GetDropDown(2).Result;

        var list = new GetColumnsViewModel
        {
            IsEditable = true,
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", IsPrimary = true, Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Width = 5
                },
                new()
                {
                    Id = "branchId", Title = "شناسه شعبه", IsPrimary = true, Type = (int)SqlDbType.Int,
                    IsDtParameter = true, Width = 5
                },
                new()
                {
                    Id = "branchName", Title = "نام شعبه", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 10
                },
                new()
                {
                    Id = "accountGLName", Title = "کل", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = false, IsFilterParameter = true, Width = 15
                },
                new()
                {
                    Id = "accountGLId", Title = "کل", Size = 50, Editable = true, IsDtParameter = true, Width = 15,
                    Inputs = _accountGLRepository.GetActiveDropDown(1).Result.ToList(), IsSelect2 = true,
                    InputType = "select2",
                    FillColumnInputSelectIds = new List<string> { "accountSGLId" }
                },
                new()
                {
                    Id = "accountSGL", Title = "معین", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = false,
                    IsFilterParameter = true, Width = 15
                },
                new()
                {
                    Id = "accountSGLId", Title = "معین", Size = 50, Editable = true, IsDtParameter = true, Width = 15,
                    InputType = "select2", IsSelect2 = true,
                    GetInputSelectConfig = new GetDataColumnConfig
                    {
                        FillUrl = "/api/FM/AccountSGLApi/getactivedropdown",
                        Parameters = new List<GetDataColumnParameterModel>
                        {
                            new()
                            {
                                Id = "accountGLId"
                            }
                        }
                    }
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, Size = 50, InputType = "checkbox",
                    Editable = true, IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 10
                }
            }
        };

        return list;
    }

    public GetColumnsViewModel GetColumnsDetailPageLineList()
    {
        var list = new GetColumnsViewModel
        {
            IsEditable = true,
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", IsPrimary = true, Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Width = 5
                },
                new() { Id = "stageFundItemType", IsPrimary = true },
                new()
                {
                    Id = "stageId", Title = "شناسه مرحله", IsPrimary = true, Type = (int)SqlDbType.NVarChar, Size = 50,
                    Width = 10
                },
                new()
                {
                    Id = "stageName", Title = "نام مرحله", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/WF/StageApi/getdropdown/6/3/2/2", Width = 15
                },
                new()
                {
                    Id = "fundItemId", Title = "شناسه نوع وجه", IsPrimary = true, Type = (int)SqlDbType.NVarChar,
                    Size = 50, Width = 10
                },
                new()
                {
                    Id = "fundItemName", Title = "نوع وجه", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "api/WF/StageFundItemTypeApi/stagefunditemtype_getdropdown/0/6", Width = 12
                },
                new() { Id = "inOut", Title = "نوع گردش", IsPrimary = true, Type = (int)SqlDbType.Int, Width = 5 },
                new()
                {
                    Id = "inOutNames", Title = "نوع گردش", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 15
                },
                new()
                {
                    Id = "accountGLName", Title = "کل", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsFilterParameter = true, Width = 18
                },
                new()
                {
                    Id = "accountGLId", Title = "کل", Editable = true, IsDtParameter = true, Width = 18,
                    Inputs = _accountGLRepository.GetActiveDropDown(1).Result.ToList(), InputType = "select2",
                    IsSelect2 = true,
                    FillColumnInputSelectIds = new List<string> { "accountSGLId" }
                },
                new()
                {
                    Id = "accountSGLName", Title = "معین", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsFilterParameter = true, Width = 18
                },
                new()
                {
                    Id = "accountSGLId", Title = "معین", Size = 50, Editable = true, IsDtParameter = true, Width = 13,
                    InputType = "select2", IsSelect2 = true,
                    GetInputSelectConfig = new GetDataColumnConfig
                    {
                        FillUrl = "/api/FM/AccountSGLApi/getactivedropdown",
                        Parameters = new List<GetDataColumnParameterModel>
                        {
                            new()
                            {
                                Id = "accountGLId"
                            }
                        }
                    }
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, Size = 50, InputType = "checkbox",
                    Editable = true, IsDtParameter = true, Width = 5
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 10
                }
            }
        };

        return list;
    }

    public GetColumnsViewModel GetColumnsDetailAdmPageLineList()
    {
        var list = new GetColumnsViewModel
        {
            IsEditable = true,
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", IsPrimary = true, Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Width = 5
                },
                new() { Id = "branchId", IsPrimary = true, Type = (int)SqlDbType.Int },
                new() { Id = "stageFundItemType", IsPrimary = true },
                new()
                {
                    Id = "stageId", Title = "شناسه مرحله", IsPrimary = true, Type = (int)SqlDbType.NVarChar, Size = 50,
                    Width = 10
                },
                new()
                {
                    Id = "stageName", Title = "نام مرحله", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 15
                },
                new()
                {
                    Id = "fundItemId", Title = "شناسه نوع وجه", IsPrimary = true, Type = (int)SqlDbType.NVarChar,
                    Size = 50, Width = 10
                },
                new()
                {
                    Id = "fundItemName", Title = "نوع وجه/کالا", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 15
                },
                new() { Id = "inOut", Title = "نوع گردش", IsPrimary = true, Type = (int)SqlDbType.Int, Width = 8 },
                new()
                {
                    Id = "inOutNames", Title = "نوع گردش", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 15
                },
                new()
                {
                    Id = "accountGLName", Title = "کل", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsFilterParameter = true, Width = 15
                },
                new()
                {
                    Id = "accountGLId", Title = "کل", Editable = true, IsDtParameter = true, Width = 10,
                    Inputs = _accountGLRepository.GetActiveDropDown(1).Result.ToList(), InputType = "select2",
                    IsSelect2 = true,
                    FillColumnInputSelectIds = new List<string> { "accountSGLId" }
                },
                new()
                {
                    Id = "accountSGLName", Title = "معین", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsFilterParameter = true, Width = 15
                },
                new()
                {
                    Id = "accountSGLId", Title = "معین", Size = 50, Editable = true, IsDtParameter = true, Width = 10,
                    InputType = "select2", IsSelect2 = true,
                    GetInputSelectConfig = new GetDataColumnConfig
                    {
                        FillUrl = "/api/FM/AccountSGLApi/getactivedropdown",
                        Parameters = new List<GetDataColumnParameterModel>
                        {
                            new()
                            {
                                Id = "accountGLId"
                            }
                        }
                    }
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, Size = 50, InputType = "checkbox",
                    Editable = true, IsDtParameter = true, Width = 5
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 10
                }
            }
        };

        return list;
    }

    public GetColumnsViewModel GetColumnsDetailPageLineForOrderSaleList()
    {
        var list = new GetColumnsViewModel
        {
            IsEditable = true,
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", IsPrimary = true, Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Width = 5
                },
                new() { Id = "stageFundItemType", IsPrimary = true },
                new()
                {
                    Id = "stageId", Title = "شناسه مرحله", IsPrimary = true, Type = (int)SqlDbType.NVarChar, Size = 50,
                    Width = 5
                },
                new()
                {
                    Id = "stageName", Title = "نام مرحله", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/WF/StageApi/getdropdown/1/2,3,7/2/2", Width = 10
                },
                new()
                {
                    Id = "fundItemId", Title = "شناسه نوع وجه", IsPrimary = true, Type = (int)SqlDbType.NVarChar,
                    Size = 50, Width = 10
                },
                new()
                {
                    Id = "fundItemName", Title = "نوع آیتم", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "api/WHApi/itemTypeSalesPrice_getDropDown", Width = 10
                },
                new()
                {
                    Id = "itemCategoryId", Title = "دسته بندی کالا/خدمت", IsPrimary = true, Type = (int)SqlDbType.Int
                },
                new()
                {
                    Id = "itemCategory", Title = "دسته بندی کالا/خدمت", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/WH/ItemCategoryApi/getalldatadropdownbytype/0", Width = 10
                },
                new() { Id = "inOut", Title = "نوع گردش", IsPrimary = true, Type = (int)SqlDbType.Int, Width = 8 },
                new()
                {
                    Id = "inOutName", Title = "نوع گردش", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 10
                },
                new() { Id = "postingGroupTypeLineId", Title = "شناسه ارتباط با حسابداری", IsPrimary = true },
                new()
                {
                    Id = "postingGroupTypeLineName", Title = "جزییات ", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 5
                },

                new()
                {
                    Id = "accountGLName", Title = "کل", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsFilterParameter = true, Width = 14
                },
                new()
                {
                    Id = "accountGLId", Title = "کل", Editable = true, IsDtParameter = true, Width = 10,
                    Inputs = _accountGLRepository.GetActiveDropDown(1).Result.ToList(), InputType = "select2",
                    IsSelect2 = true,
                    FillColumnInputSelectIds = new List<string> { "accountSGLId" }
                },
                new()
                {
                    Id = "accountSGLName", Title = "معین", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsFilterParameter = true, Width = 20
                },
                new()
                {
                    Id = "accountSGLId", Title = "معین", Size = 50, Editable = true, IsDtParameter = true, Width = 10,
                    InputType = "select2", IsSelect2 = true,
                    GetInputSelectConfig = new GetDataColumnConfig
                    {
                        FillUrl = "/api/FM/AccountSGLApi/getactivedropdown",
                        Parameters = new List<GetDataColumnParameterModel>
                        {
                            new()
                            {
                                Id = "accountGLId"
                            }
                        }
                    }
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, Size = 50, InputType = "checkbox",
                    Editable = true, IsDtParameter = true, Width = 5
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 4
                }
            }
        };

        return list;
    }


    public async Task<MyResultPage<IEnumerable>> PostingGroupDetailGetList(NewGetPageViewModel model)
    {
        try
        {
            byte workFlowCategoryId = 0;

            var pgType = Convert.ToInt32(model.Form_KeyValue[1]?.ToString());

            if (pgType == 3 || pgType == 1)
                workFlowCategoryId = 6;
            else if (pgType == 4 || pgType == 5)
                workFlowCategoryId = 10;
            else if (pgType == 11)
                workFlowCategoryId = 11;


            var result = new MyResultPage<IEnumerable>
            {
                Data = new List<PostingGroupDetailList>(),
                Columns = GetColumnsDetailPageHeaderList(workFlowCategoryId)
            };

            if (pgType == 4)
                if (Convert.ToInt32(model.Form_KeyValue[0]?.ToString()) == 54 ||
                    Convert.ToInt32(model.Form_KeyValue[0]?.ToString()) == 55)
                    pgType = 5;

            string branchName = "", accountGLName = "", accountSGLName = "";
            switch (model.FieldItem)
            {
                case "branchName":
                    branchName = model.FieldValue;
                    break;
                case "accountGLName":
                    accountGLName = model.FieldValue;
                    break;
                case "accountSGLName":
                    accountSGLName = model.FieldValue;
                    break;
            }

            MyClaim.Init(_accessor);


            var parameters = new DynamicParameters();
            parameters.Add("Id", Convert.ToInt32(model.Form_KeyValue[0]?.ToString()));
            parameters.Add("CompanyId", model.CompanyId);
            parameters.Add("PostingGroupTypeId",
                Convert.ToInt32(model.Form_KeyValue[0]?.ToString()) == 54 ||
                Convert.ToInt32(model.Form_KeyValue[0]?.ToString()) == 55
                    ? 5
                    : pgType);

            
            parameters.Add("StageId",
                pgType == (byte)(PostingGroupType.Warehouse)
                    ? Convert.ToInt32(model.Form_KeyValue[0]?.ToString())
                    : Convert.ToInt32(model.Form_KeyValue[2]?.ToString()));
            parameters.Add("BranchName", branchName == "" ? null : branchName);
            parameters.Add("AccountGLName", accountGLName == "" ? null : accountGLName);
            parameters.Add("AccountSGLName", accountSGLName == "" ? null : accountSGLName);

            using (var conn = Connection)
            {
                var sQuery = "[fm].[Spc_PostingGroupDetail]";
                conn.Open();
                var resultTreasury =
                    (await conn.QueryAsync<PostingGroupDetailList>(sQuery, parameters,
                        commandType: CommandType.StoredProcedure)).ToList();
                result.Data = resultTreasury;
            }

            return result;
        }
        catch (Exception)
        {

            throw;
        }
    }


    public async Task<MyResultPage<IEnumerable<PostingGroupLineDetailList>>> PostingGroupLineDetailGetList(
        NewGetPageViewModel model)
    {
        var postingGroupTypeId = (PostingGroupType)byte.Parse(model.Form_KeyValue[1]?.ToString());

        var result = new MyResultPage<IEnumerable<PostingGroupLineDetailList>>
        {
            Data = new List<PostingGroupLineDetailList>()
        };

        if (postingGroupTypeId == PostingGroupType.BranchPurchase || postingGroupTypeId == PostingGroupType.BranchSale)
            result.Columns = GetColumnsDetailPageLineForOrderSaleList();
        else if (postingGroupTypeId == PostingGroupType.AdmissionServiceLine ||
                 postingGroupTypeId == PostingGroupType.AdmissionItemLine)
            result.Columns = GetColumnsDetailAdmPageLineList();
        else if (postingGroupTypeId == PostingGroupType.BranchWahouse)
            result.Columns = GetColumnsDetailPageLineBranchWarehouseList();
        else if (postingGroupTypeId == PostingGroupType.BankAccount || postingGroupTypeId == PostingGroupType.Branch)
            result.Columns = GetColumnsDetailPageLineBankAccountList();
        else
            result.Columns = GetColumnsDetailPageLineList();

        string branchName = "", accountGLName = "", accountSGLName = "", accountDetailName = "";
        var p_id = 0;
        int? p_stageId = null;
        int? p_fundItemId = null;
        int? p_itemCategoryId = null;
        switch (model.FieldItem)
        {
            case "id":
                p_id = Convert.ToInt32(model.FieldValue);
                break;
            case "branchName":
                branchName = model.FieldValue;
                break;
            case "stageName":
                p_stageId = Convert.ToInt32(model.FieldValue);
                break;
            case "fundItemName":
                p_fundItemId = Convert.ToInt32(model.FieldValue);
                break;
            case "itemCategory":
                p_itemCategoryId = Convert.ToInt32(model.FieldValue);
                break;
            case "accountGLName":
                accountGLName = model.FieldValue;
                break;
            case "accountSGLName":
                accountSGLName = model.FieldValue;
                break;
            case "accountDetailName":
                accountDetailName = model.FieldValue;
                break;
        }

        MyClaim.Init(_accessor);

        var parameters = new DynamicParameters();

        var sQuery = string.Empty;

        if (postingGroupTypeId == PostingGroupType.AdmissionServiceLine ||
            postingGroupTypeId == PostingGroupType.AdmissionItemLine)
        {
            sQuery = "[fm].[Spc_PostingGroupLineDetailItemType]";
            parameters.Add("BranchName");
        }
        else
        {
            sQuery = "[fm].[Spc_PostingGroupLineDetail]";

            parameters.Add("PageNo", model.PageNo);
            parameters.Add("PageRowsCount", model.PageRowsCount);
            parameters.Add("StageId",
                p_stageId != null
                    ? p_stageId
                    :
                    model.Form_KeyValue.Length > 4 && model.Form_KeyValue[4]?.ToString() != null
                        ?
                        model.Form_KeyValue[4]?.ToString()
                        : null);
            parameters.Add("FundTypeId",
                p_fundItemId != null
                    ? p_fundItemId
                    :
                    model.Form_KeyValue.Length > 4 && model.Form_KeyValue[5]?.ToString() != null
                        ?
                        model.Form_KeyValue[5]?.ToString()
                        : null);
            parameters.Add("ItemCategoryId",
                p_itemCategoryId != null
                    ? p_itemCategoryId
                    :
                    model.Form_KeyValue.Length > 4 && model.Form_KeyValue[6]?.ToString() != null
                        ?
                        model.Form_KeyValue[6]?.ToString()
                        : null);
        }

        parameters.Add("Id", Convert.ToInt32(model.Form_KeyValue[0]?.ToString()));
        parameters.Add("CompanyId", model.CompanyId);
        parameters.Add("PostingGroupTypeId", Convert.ToInt32(postingGroupTypeId).ToString());

        parameters.Add("AccountGLName", accountGLName != "" ? accountGLName : null);
        parameters.Add("AccountSGLName", accountSGLName != "" ? accountSGLName : null);

        var resultCount = 0;

        using (var conn = Connection)
        {
            conn.Open();
            var resultTreasury =
                (await conn.QueryAsync<PostingGroupLineDetailList>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            resultCount = resultTreasury.Count;
            result.Data = resultTreasury;
        }


        return result;
    }

    public async Task<PostingGroupAccountGLSGLInfo> GetPostingGroupAccountGLSGLInfo(
        GetPostingGroupAccountGLSGLInfo model)
    {
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_PostingGroup_Get_AccountGLSGL_INFO]";
            var result = await conn.QueryFirstOrDefaultAsync<PostingGroupAccountGLSGLInfo>(sQuery, new
            {
                model.HeaderId,
                model.StageId,
                model.PostingGroupTypeId,
                model.BranchId,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);

            return result;
        }
    }

    //public async Task<PostingGroupHeaderModel> GetPostingGroupHeader(GetPostingGroup model)
    //{
    //    using (IDbConnection conn = Connection)
    //    {
    //        string sQuery = "[fm].[Spc_GetPostingGroupHeader_Reccord]";
    //        var result = await conn.QueryFirstOrDefaultAsync<PostingGroupHeaderModel>(sQuery, new
    //        {
    //            model.HeaderId,
    //            model.StageId,
    //            model.PostingGroupTypeId,
    //            model.BranchId,
    //            model.CompanyId
    //        }, commandType: CommandType.StoredProcedure);

    //        return result;
    //    }
    //}

    public async Task<List<PostingGroupbyTypeLineModel>> GetPostingGroupByTypeLine(GetPostingGroup model)
    {
        using (var conn = Connection)
        {
            var sQueryInsPostingGroup = "[fm].[Spc_SelectPostingGroup_ByTypeLine]";
            conn.Open();
            var resultPersonInvoicePostingGroup = (await conn.QueryAsync<PostingGroupbyTypeLineModel>(
                sQueryInsPostingGroup, new
                {
                    model.StageId,
                    model.ItemCategoryId,
                    FundItemTypeId = model.ItemTypeId,
                    model.PostingGroupTypeId,
                    model.BranchId,
                    model.HeaderId
                }, commandType: CommandType.StoredProcedure)).ToList();
            return resultPersonInvoicePostingGroup;
        }
    }


    public async Task<List<PostingGroupLastAcountModel>> GetPostingGroupLastAcountLine(GetPostingGroupLastAcount model)
    {
        using (var conn = Connection)
        {
            var sQueryInsPostingGroup = "[wf].[Spc_GetLastAccountPostingGroup]";
            conn.Open();
            var resultPersonInvoicePostingGroup = (await conn.QueryAsync<PostingGroupLastAcountModel>(
                sQueryInsPostingGroup, new
                {
                    model.ObjectId,
                    model.WorkflowCategoryId
                }, commandType: CommandType.StoredProcedure)).ToList();
            return resultPersonInvoicePostingGroup;
        }
    }

    public async Task<PostingGroupHeaderModel> GetPostingGroupLine(GetPostingGroup model)
    {
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_PostingGroupLine_GetRecord]";
            var result = await conn.QueryFirstOrDefaultAsync<PostingGroupHeaderModel>(sQuery, new
            {
                model.HeaderId,
                model.PostingGroupTypeId,
                model.StageId,
                FundItemTypeId = model.FundTypeId,
                model.ItemCategoryId,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);

            return result;
        }
    }

    public async Task<int> GetPostingGroupLineId(byte postingGroupTypeId, int headerIdentityId, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            var result = await conn.QueryFirstOrDefaultAsync<int>(sQuery, new
            {
                TableName = "fm.PostingGroupLine",
                ColumnName = "Id",
                Filter =
                    $"CompanyId={companyId} AND HeaderId={headerIdentityId} AND PostingGroupTypeId={postingGroupTypeId}",
                OrderBy = ""
            }, commandType: CommandType.StoredProcedure);

            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetAllDataDropDown(int headerId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "fm.PostingGroupTypeLine",
                    TitleColumnName = "Name",
                    Filter = $"HeaderId={headerId}"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public Task<PostingGroupSaveResultQuery> Save(PostingGroupHeaderModel model)
    {
        throw new NotImplementedException();
    }

    public Task<PostingGroupSaveResultQuery> SaveLine(PostingGroupLineModel model)
    {
        throw new NotImplementedException();
    }

    public Task<PostingGroupHeaderModel> GetPostingGroupHeader(GetPostingGroup model)
    {
        throw new NotImplementedException();
    }

    public GetColumnsViewModel GetColumnsDetailPageLineBankAccountList()
    {
        var list = new GetColumnsViewModel
        {
            IsEditable = true,
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", IsPrimary = true, Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Width = 5
                },
                new() { Id = "stageFundItemType", IsPrimary = true },
                new()
                {
                    Id = "stageId", Title = "شناسه مرحله", IsPrimary = true, Type = (int)SqlDbType.NVarChar, Size = 50,
                    Width = 10
                },
                new()
                {
                    Id = "stageName", Title = "نام مرحله", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/WF/StageApi/getdropdown/6/3/2/2", Width = 15
                },
                new()
                {
                    Id = "fundItemId", Title = "شناسه نوع وجه", IsPrimary = true, Type = (int)SqlDbType.NVarChar,
                    Size = 50, Width = 10
                },
                new()
                {
                    Id = "fundItemName", Title = "نوع وجه", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "api/WF/StageFundItemTypeApi/stagefunditemtype_getdropdown/0/6", Width = 12
                },
                new() { Id = "inOut", Title = "نوع گردش", IsPrimary = true, Type = (int)SqlDbType.Int, Width = 5 },
                new()
                {
                    Id = "inOutNames", Title = "نوع گردش", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 15
                },
                new() { Id = "postingGroupTypeLineId", Title = "شناسه ارتباط با حسابداری", IsPrimary = true },
                new()
                {
                    Id = "postingGroupTypeLineName", Title = "جزییات ", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "accountGL", Title = "کل", Type = (int)SqlDbType.NVarChar, Size = 50, IsFilterParameter = true,
                    Width = 18
                },
                new()
                {
                    Id = "accountGLId", Title = "کل", Editable = true, IsDtParameter = true, Width = 18,
                    Inputs = _accountGLRepository.GetActiveDropDown(1).Result.ToList(), InputType = "select2",
                    IsSelect2 = true,
                    FillColumnInputSelectIds = new List<string> { "accountSGLId" }
                },
                new()
                {
                    Id = "accountSGL", Title = "معین", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsFilterParameter = true, Width = 18
                },
                new()
                {
                    Id = "accountSGLId", Title = "معین", Size = 50, Editable = true, IsDtParameter = true, Width = 13,
                    InputType = "select2", IsSelect2 = true,
                    GetInputSelectConfig = new GetDataColumnConfig
                    {
                        FillUrl = "/api/FM/AccountSGLApi/getactivedropdown",
                        Parameters = new List<GetDataColumnParameterModel>
                        {
                            new()
                            {
                                Id = "accountGLId"
                            }
                        }
                    }
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, Size = 50, InputType = "checkbox",
                    Editable = true, IsDtParameter = true, Width = 5
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 6
                }
            }
        };

        return list;
    }

    public GetColumnsViewModel GetColumnsDetailPageLineBranchWarehouseList()
    {
        var list = new GetColumnsViewModel
        {
            IsEditable = true,
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", IsPrimary = true, Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Width = 5
                },
                new() { Id = "stageFundItemType", IsPrimary = true },
                new()
                {
                    Id = "stageId", Title = "شناسه مرحله", IsPrimary = true, Type = (int)SqlDbType.NVarChar, Size = 50,
                    Width = 10
                },
                new()
                {
                    Id = "stageName", Title = "نام مرحله", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/WF/StageApi/getdropdown/11/3,16/2/2", Width = 15
                },
                new()
                {
                    Id = "fundItemId", Title = "شناسه نوع وجه", IsPrimary = true, Type = (int)SqlDbType.NVarChar,
                    Size = 50, Width = 10
                },
                new()
                {
                    Id = "fundItemName", Title = "نوع آیتم", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "api/WHApi/itemtype_getdropdown/1,4", Width = 8
                },
                new()
                {
                    Id = "itemCategoryId", Title = "دسته بندی کالا/خدمت", IsPrimary = true, Type = (int)SqlDbType.Int
                },
                new()
                {
                    Id = "itemCategory", Title = "دسته بندی کالا/خدمت", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/WH/ItemCategoryApi/getalldatadropdownbytype/1,4", Width = 14
                },
                new() { Id = "inOut", Title = "نوع گردش", IsPrimary = true, Type = (int)SqlDbType.Int, Width = 8 },
                new()
                {
                    Id = "inOutName", Title = "نوع گردش", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 10
                },
                new() { Id = "postingGroupTypeLineId", Title = "شناسه ارتباط با حسابداری", IsPrimary = true },
                new()
                {
                    Id = "postingGroupTypeLineName", Title = "جزییات ", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 20
                },
                new()
                {
                    Id = "accountGLName", Title = "کل", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsFilterParameter = true, Width = 14
                },
                new()
                {
                    Id = "accountGLId", Title = "کل", Editable = true, IsDtParameter = true, Width = 14,
                    Inputs = _accountGLRepository.GetActiveDropDown(1).Result.ToList(), InputType = "select2",
                    IsSelect2 = true,
                    FillColumnInputSelectIds = new List<string> { "accountSGLId" }
                },
                new()
                {
                    Id = "accountSGLName", Title = "معین", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsFilterParameter = true, Width = 20
                },
                new()
                {
                    Id = "accountSGLId", Title = "معین", Size = 50, Editable = true, IsDtParameter = true, Width = 15,
                    InputType = "select2", IsSelect2 = true,
                    GetInputSelectConfig = new GetDataColumnConfig
                    {
                        FillUrl = "/api/FM/AccountSGLApi/getactivedropdown",
                        Parameters = new List<GetDataColumnParameterModel>
                        {
                            new()
                            {
                                Id = "accountGLId"
                            }
                        }
                    }
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, Size = 50, InputType = "checkbox",
                    Editable = true, IsDtParameter = true, Width = 5
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 6
                },
                new() { Id = "postingGroupTypeLineId", Title = "شناسه ارتباط با حسابداری", IsPrimary = true }
            }
        };

        return list;
    }
}