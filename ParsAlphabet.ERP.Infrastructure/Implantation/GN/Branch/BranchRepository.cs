using System.Data;
using System.Net;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.Central.ObjectModel.MedicalCare;
using ParsAlphabet.ERP.Application.Dtos.GN.Branch;
using ParsAlphabet.ERP.Application.Interfaces.WebServices.Central;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.SendHistory;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.GN.Branch;

public class BranchRepository :
    BaseRepository<BranchModel, int, string>,
    IBaseRepository<BranchModel, int, string>
{
    private readonly IHttpContextAccessor _accessor;
    private readonly IBranchServiceCentral _centralBranchService;
    private readonly IMapper _mapper;
    private readonly SendHistoryRepository _sendHistoryRepository;

    public BranchRepository(IConfiguration config, IHttpContextAccessor accessor, IMapper mapper
        , IBranchServiceCentral centralBranchService, SendHistoryRepository sendHistoryRepository)
        : base(config)
    {
        _accessor = accessor;
        _mapper = mapper;
        _centralBranchService = centralBranchService;
        _sendHistoryRepository = sendHistoryRepository;
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
                    IsFilterParameter = true, FilterType = "number", Width = 5
                },
                new() { Id = "stateId", IsPrimary = true },
                new() { Id = "cityId", IsPrimary = true },
                new()
                {
                    Id = "name", Title = "نام شعبه", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, Width = 10
                },
                new()
                {
                    Id = "state", Title = "ولایت", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsPrimary = true, IsFilterParameter = true, Width = 10
                },
                new()
                {
                    Id = "city", Title = "شهر", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsPrimary = true, IsFilterParameter = true, Width = 10
                },
                new()
                {
                    Id = "address", Title = "آدرس", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 20
                },
                new()
                {
                    Id = "longitude", Title = "طول جغرافیایی", Type = (int)SqlDbType.Decimal, Size = 50,
                    IsDtParameter = true, Width = 7
                },
                new()
                {
                    Id = "latitude", Title = "عرض جغرافیایی", Type = (int)SqlDbType.Decimal, Size = 50,
                    IsDtParameter = true, Width = 7
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, Size = 1, IsDtParameter = true,
                    Align = "center", Width = 10
                },
                new()
                {
                    Id = "isDetail", Title = "تفصیل", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 5,
                    Align = "center"
                },
                new()
                {
                    Id = "sendResult", Title = "وضعیت ارسال", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 5
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 10 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "edit", Title = "ویرایش", IconName = "fa fa-edit color-green" },
                new() { Name = "sep1", IsSeparator = true },
                new() { Name = "sendToCentral", Title = "ارسال مرکزی", IconName = "fa fa-paper-plane color-blue" },
                new() { Name = "accountDetail", Title = "ایجاد تفصیل", IconName = "fas fa-plus color-blue" }
            }
        };

        return list;
    }

    public async Task<MemoryStream> CSV(NewGetPageViewModel model)
    {
        var csvGenerator = new Csv();
        var csvStream = new MemoryStream();

        var formType = model.Form_KeyValue[0]?.ToString();

        var Columns = string.Join(',',
            GetColumns().DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title));
        var getPage = await GetPage(model);

        var Rows = from p in getPage.Data
            select new
            {
                p.Id,
                p.Name,
                p.State,
                p.City,
                p.Address,
                p.Longitude,
                p.Latitude,
                IsActive = p.IsActive ? "فعال" : "غیرفعال",
                IsDetail = p.IsDetail ? "دارد" : "ندارد",
                p.SendResult
            };

        return csvStream = await csvGenerator.GenerateCsv(Rows, Columns.Split(',').ToList());
    }

    public async Task<MyResultPage<List<BranchGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<BranchGetPage>>();
        result.Data = new List<BranchGetPage>();
        model.PageNo = 0;

        MyClaim.Init(_accessor);

        var parameters = new DynamicParameters();


        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("Name",
            model.Filters.Any(x => x.Name == "name")
                ? model.Filters.FirstOrDefault(x => x.Name == "name").Value
                : null);
        parameters.Add("CityName",
            model.Filters.Any(x => x.Name == "city")
                ? model.Filters.FirstOrDefault(x => x.Name == "city").Value
                : null);
        parameters.Add("StateName",
            model.Filters.Any(x => x.Name == "state")
                ? model.Filters.FirstOrDefault(x => x.Name == "state").Value
                : null);

        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "[gn].[Spc_Branch_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<BranchGetPage>(sQuery, parameters, commandType: CommandType.StoredProcedure))
                .ToList();
        }

        return result;
    }

    public async Task<MyResultPage<BranchGetRecordModel>> GetRecordById(int id)
    {
        var result = new MyResultPage<BranchGetRecordModel>();
        result.Data = new BranchGetRecordModel();


        using (var conn = Connection)
        {
            var sQuery = "[gn].[Spc_Branch_GetRecord]";
            conn.Open();
            var resultData = await conn.QueryFirstOrDefaultAsync<BranchGetRecordModel>(sQuery,
                new
                {
                    Id = id
                }, commandType: CommandType.StoredProcedure);
            conn.Close();


            resultData.BranchLinesList = resultData.BranchLineJson != null
                ? JsonConvert.DeserializeObject<List<BranchLines>>(resultData.BranchLineJson)
                : null;

            result.Data = resultData;

            return result;
        }
    }

    public async Task<MyResultStatus> Insert(BranchModel model)
    {
        var result = new MyResultStatus();

        using (var conn = Connection)
        {
            var sQuery = "gn.Spc_Branch_InsUpd";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                model.IsSecondLang,
                Opr = "Ins",
                model.Id,
                model.CentralId,
                model.Name,
                model.StateId,
                model.CityId,
                model.Address,
                model.IsActive,
                model.CompanyId,
                BranchLineJson = JsonConvert.SerializeObject(model.BranchLineJsonList),
                model.Latitude,
                model.Longitude,
                model.CreateUserId,
                model.CreateDateTime
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = result.Status == 100;

        if (!result.Successfull) result.ValidationErrors.Add(result.StatusMessage);

        return result;
    }

    public async Task<MyResultStatus> Update(BranchModel model)
    {
        var result = new MyResultStatus();

        using (var conn = Connection)
        {
            var sQuery = "gn.Spc_Branch_InsUpd";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                model.IsSecondLang,
                Opr = "Upd",
                model.Id,
                CentralId = model.CentralId == 0 ? null : model.CentralId,
                model.Name,
                model.StateId,
                model.CityId,
                model.Address,
                model.IsActive,
                model.CompanyId,
                BranchLineJson = JsonConvert.SerializeObject(model.BranchLineJsonList),
                model.Latitude,
                model.Longitude,
                model.CreateUserId,
                model.CreateDateTime
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = result.Status == 100;

        if (!result.Successfull) result.ValidationErrors.Add(result.StatusMessage);
        return result;
    }

    public async Task<MyResultStatus> SendCentralBranch(short id, int userId)
    {
        var centralModel = new CentralBranch();
        var result = new MyResultStatus();
        var model = await _sendHistoryRepository.BranchSendHistoryGetRecord(id);

        if (!model.NotNull())
            return new MyResultStatus
            {
                Successfull = false,
                StatusMessage = "موردی برای ارسال وجود ندارد"
            };

        centralModel = _mapper.Map<BranchSendHistoryModel, CentralBranch>(model);

        var sendResult = await _centralBranchService.BranchCentral(centralModel);

        if (sendResult.HttpStatus == HttpStatusCode.Unauthorized ||
            sendResult.HttpStatus == HttpStatusCode.BadRequest ||
            sendResult.HttpStatus == HttpStatusCode.InternalServerError)
            return new MyResultStatus
            {
                Successfull = false,
                Status = -100,
                StatusMessage = "درخواست شما به درستی انجام نشد ، مجدد تلاش فرمایید"
            };

        if (sendResult.HttpStatus == HttpStatusCode.NotAcceptable)
        {
            if (sendResult.ValidationErrors.ListHasRow())
                return new MyResultStatus
                {
                    Successfull = false,
                    ValidationErrors = sendResult.ValidationErrors
                };
        }
        else if (sendResult.HttpStatus == HttpStatusCode.OK && sendResult.Data != null)
        {
            if (sendResult.Data.Status == 100)
            {
                var updSendHistory =
                    await _sendHistoryRepository.Update(model.SendHistoryId, sendResult.Data.Id.ToString(), userId);

                return new MyResultStatus
                {
                    Successfull = updSendHistory.Successfull,
                    StatusMessage = updSendHistory.StatusMessage
                };
            }
        }

        return result;
    }


    public async Task<MyResultPage<List<BranchLineGetList>>> GetBranchLineList(short id)
    {
        var result = new MyResultPage<List<BranchLineGetList>>
        {
            Data = new List<BranchLineGetList>()
        };

        using (var conn = Connection)
        {
            var sQuery = "[gn].[Spc_BranchLine_GetList]";
            result.Data = (await conn.QueryAsync<BranchLineGetList>(sQuery, new
            {
                BranchId = id
            }, commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }

    public async Task<List<MyDropDownViewModel>> GetBranchLineTypeList()
    {
        using (var conn = Connection)
        {
            var sQuery = "[gn].[Spc_BranchLineType_GetList]";
            return (await conn.QueryAsync<MyDropDownViewModel>(sQuery, commandType: CommandType.StoredProcedure))
                .ToList();
        }
    }

    public async Task<MyResultQuery> Delete(int keyvalue, int companyId)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_DelRecord";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                TableName = "gn.Branch",
                RecordId = keyvalue,
                CompanyId = companyId,
                Filter = $"CompanyId={companyId}"
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<List<MyDropDownViewModel>> GetDropDown(int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "gn.Branch",
                    Filter = $"CompanyId={companyId}"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetActiveBranchDropDown(int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "gn.Branch",
                    Filter = $"CompanyId={companyId} AND IsActive=1"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<int> GetBranchCount(int CompanyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<int>(sQuery,
                new
                {
                    TableName = "gn.Branch",
                    ColumnName = "Count(Id)",
                    Filter = "IsActive=1 "
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<string> GetName(short branchId)
    {
        if (branchId == 0)
            return null;

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetTable";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<string>(sQuery,
                new
                {
                    TableName = "gn.Branch",
                    ColumnNameList = "Name",
                    Filter = $"Id = {branchId}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }
}