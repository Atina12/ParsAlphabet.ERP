using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.PB;
using ParsAlphabet.ERP.Application.Interfaces.PB;
using ParsAlphabet.ERP.Application.Interfaces.Redis;
using Enum = System.Enum;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.PB;

public class PublicRepository : IPublicRepository
{
    private readonly IConfiguration _config;
    private readonly IRedisService _redisService;
    public PublicRepository(IConfiguration config, IRedisService redisService)
    {   
         _config = config;
        _redisService = redisService;
  
    }

    public IDbConnection Connection => new SqlConnection(_config.GetConnectionString("DefaultConnection"));

    public async Task<MyResultQuery> Delete(string tableName, string filter)
    {
        var result = new MyResultQuery();

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_DelRecordWithFilter";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                TableName = tableName,
                filter
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<MyResultDataStatus<IEnumerable<MyDropDownViewModel2>>> Search(PublicSearch model)
    {
        var result = new MyResultDataStatus<IEnumerable<MyDropDownViewModel2>>();
        result.Data = new List<MyDropDownViewModel2>();

        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetList_Paging]";
            conn.Open();
            result.Data = await conn.QueryAsync<MyDropDownViewModel2>(sQuery, new
            {
                model.PageNo,
                model.PageRowsCount,
                model.IsSecondLang,
                model.TableName,
                model.IdColumnName,
                model.TitleColumnName,
                model.IdList,
                model.Filter,
                model.OrderBy
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = true;
        return result;
    }

    public async Task<MyResultDataStatus<IEnumerable<MyDropDownViewModel2>>> SearchPagination(PublicSearch model)
    {
        var result = new MyResultDataStatus<IEnumerable<MyDropDownViewModel2>>();
        result.Data = new List<MyDropDownViewModel2>();

        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetList_Paging]";
            conn.Open();
            result.Data = await conn.QueryAsync<MyDropDownViewModel2>(sQuery, new
            {
                model.PageNo,
                model.PageRowsCount,
                model.IsSecondLang,
                model.TableName,
                model.IdColumnName,
                model.TitleColumnName,
                model.IdList,
                model.Filter,
                model.OrderBy
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = true;
        return result;
    }

    public async Task<long> GetPreveNexIdentity(GetNextPrevId model)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_NextPrev]";
            conn.Open();
            var identity = await conn.ExecuteScalarAsync<long>(sQuery, new
            {
                model.TableName,
                model.IdColumnName,
                model.IdColumnValue,
                model.Direction
            }, commandType: CommandType.StoredProcedure);

            return identity;
        }
    }

    public List<MyDropDownViewModel> MonthGetDropDown(int? id)
    {
        var mounths = Enum.GetValues(typeof(Mounths)).Cast<Mounths>();

        var result = mounths.Select(a => new MyDropDownViewModel
        {
            Id = Convert.ToByte(a),
            Name = a.MounthDisplayName()
        }).ToList();

        if (id > 0)
            result = result.Where(x => x.Id >= id).ToList();

        return result;
    }


    public int GetPageRowsCount(TakeRowsCountByPage model)
    {
        var cache = _redisService.GetData<List<TakeRowsCountByPage>>($"TakeRowsCountPage{model.UserId}");

        if (cache == null)
            return 0;

        var currentModel = cache.FirstOrDefault(x => x.UserId == model.UserId && x.Href == model.Href);


        if (currentModel == null)
            return 0;

        return currentModel.PageRowsCount;
    }


    public bool SetTakeRowsCountByPage(TakeRowsCountByPage model)
    {
        var cache = _redisService.GetData<List<TakeRowsCountByPage>>($"TakeRowsCountPage{model.UserId}");


        if (cache == null)
        {
            cache = new List<TakeRowsCountByPage>();
            cache.Add(model);
            var expirationTime = DateTimeOffset.Now.AddDays(100.0);

            _redisService.SetData($"TakeRowsCountPage{model.UserId}", cache, expirationTime);
            return true;
        }


        var currentModel = cache.FirstOrDefault(x => x.UserId == model.UserId && x.Href == model.Href);

        if (currentModel == null)
        {
            cache.Add(model);
            var expirationTime = DateTimeOffset.Now.AddDays(100.0);

            _redisService.SetData($"TakeRowsCountPage{model.UserId}", cache, expirationTime);
            return true;
        }

        currentModel.PageRowsCount = model.PageRowsCount;

        return true;
    }


   
}