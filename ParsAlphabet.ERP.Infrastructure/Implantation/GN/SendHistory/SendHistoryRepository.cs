using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.GN.Branch;
using ParsAlphabet.ERP.Application.Dtos.GN.Role;
using ParsAlphabet.ERP.Application.Dtos.GN.SendHistory;
using ParsAlphabet.ERP.Application.Dtos.MC.Attender;
using ParsAlphabet.ERP.Application.Dtos.MC.AttenderServicePriceLine;
using ParsAlphabet.ERP.Application.Dtos.MC.AttenderTimeSheetLine;
using ParsAlphabet.ERP.Application.Dtos.MC.InsurerPriceLine;
using ParsAlphabet.ERP.Application.Dtos.MC.Service;
using ParsAlphabet.ERP.Application.Dtos.MC.ServiceItemPricing;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.GN.SendHistory;

public class SendHistoryRepository :
    BaseRepository<RoleModel, int, string>,
    IBaseRepository<RoleModel, int, string>
{
    public SendHistoryRepository(IConfiguration config) : base(config)
    {
    }

    public async Task<SendHistoryUpdateResult> Update(Guid id, string centralId, int userId)
    {
        var result = new SendHistoryUpdateResult();

        var sQuery = "[gn].[Spc_SendHistory_Upd]";
        using (var conn = Connection)
        {
            conn.Open();
            result = await Connection.QueryFirstOrDefaultAsync<SendHistoryUpdateResult>(sQuery, new
            {
                Id = id,
                CentralId = centralId,
                SendUserId = userId,
                SendDateTime = DateTime.Now
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<MyResultStatus> UpdateBulk(List<SendHistoryViewModel> model, byte objectTypeId, int userId)
    {
        var result = new MyResultStatus();

        var jsonIds = (from m in model
            select new
            {
                m.Id,
                m.CentralId,
                m.ObjectId
            }).ToList();

        var sQuery = "[gn].[Spc_SendHistory_BulkUpd]";
        using (var conn = Connection)
        {
            conn.Open();
            result = await Connection.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                IdJson = JsonConvert.SerializeObject(jsonIds),
                SendObjectTypeId = objectTypeId,
                SendUserId = userId,
                SendDateTime = DateTime.Now
            }, commandTimeout: 180, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<MyResultStatus> InsertBulk(SendHistoryBulkInsert model)
    {
        var result = new MyResultStatus();

        if (!model.NotNull() || (!model.NotNull() && !model.ObjectHistoryList.ListHasRow()))
        {
            result.Successfull = false;
            result.Status = -100;
            return result;
        }

        var jsonIds = (from m in model.ObjectHistoryList
            select new
            {
                m.Id,
                m.CentralId,
                m.ObjectId
            }).ToList();

        var sQuery = "[gn].[Spc_SendHistory_BulkUpd]";
        using (var conn = Connection)
        {
            conn.Open();
            result = await Connection.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                IdJson = JsonConvert.SerializeObject(jsonIds),
                model.SendObjectTypeId,
                model.SendUserId,
                SendDateTime = DateTime.Now
            }, commandTimeout: 180, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<BranchSendHistoryModel> BranchSendHistoryGetRecord(short id)
    {
        using (var conn = Connection)
        {
            var sQuery = "[gn].[Spc_SendHistory_GetRecord_Branch]";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<BranchSendHistoryModel>(sQuery,
                new
                {
                    ObjectId = id
                }, commandType: CommandType.StoredProcedure);

            conn.Close();

            if (result != null)
                result.BranchLineList = result.BranchLineJson != null
                    ? JsonConvert.DeserializeObject<List<BranchLineType>>(result.BranchLineJson)
                    : null;

            return result;
        }
    }

    public async Task<AttenderSendHistoryGetRecord> AttenderSendHistoryGetRecord(int id)
    {
        if (string.IsNullOrEmpty(id.ToString()))
        {
            var model = new AttenderSendHistoryGetRecord();
            return model;
        }

        var sQuery = "[gn].[Spc_SendHistory_GetRecord_Attender]";
        var result = new AttenderSendHistoryGetRecord();
        using (var conn = Connection)
        {
            conn.Open();
            result = await Connection.QueryFirstOrDefaultAsync<AttenderSendHistoryGetRecord>(sQuery,
                new
                {
                    ObjectId = id
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        return result;
    }

    public async Task<AttenderServiceSendHistoryGetRecord> AttenderServiceSendHistoryGetRecord(int id)
    {
        var sQuery = "[gn].[Spc_SendHistory_GetRecord_AttenderService]";
        var result = new AttenderServiceSendHistoryGetRecord();
        using (var conn = Connection)
        {
            conn.Open();
            result = await Connection.QueryFirstOrDefaultAsync<AttenderServiceSendHistoryGetRecord>(sQuery,
                new
                {
                    ObjectId = id
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        return result;
    }

    public async Task<ServiceSendHistoryGetRecord> ServiceSendHistoryGetRecord(int id)
    {
        if (string.IsNullOrEmpty(id.ToString()))
        {
            var model = new ServiceSendHistoryGetRecord();
            return model;
        }

        var sQuery = "[gn].[Spc_SendHistory_GetRecord_Service]";
        var result = new ServiceSendHistoryGetRecord();
        using (var conn = Connection)
        {
            conn.Open();
            result = await Connection.QueryFirstOrDefaultAsync<ServiceSendHistoryGetRecord>(sQuery,
                new
                {
                    ObjectId = id
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        return result;
    }

    public async Task<List<ServiceItemPriceSendHistoryGetList>> ServiceItemPriceSendHistoryGetList(string ids)
    {
        var sQuery = "[gn].[Spc_SendHistory_GetList_MedicalItemPrice]";
        var result = new List<ServiceItemPriceSendHistoryGetList>();
        using (var conn = Connection)
        {
            conn.Open();
            result = (await Connection.QueryAsync<ServiceItemPriceSendHistoryGetList>(sQuery,
                new
                {
                    ObjectIds = ids
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<MyResultPage<List<MedicalItemPriceSendHistoryGetpage>>> ServiceItemPriceSendHistoryGetPage(
        DynamicParameters parameters)
    {
        var result = new MyResultPage<List<MedicalItemPriceSendHistoryGetpage>>();
        result.Data = new List<MedicalItemPriceSendHistoryGetpage>();

        using (var conn = Connection)
        {
            var sQuery = "[gn].[Spc_SendHistory_GetPage_MedicalItemPrice]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<MedicalItemPriceSendHistoryGetpage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }


    public async Task<List<AttenderScheduleBlockSendHistoryGetList>> ScheduleBlockSendHistoryGetList(
        IEnumerable<Guid> ids)
    {
        var sQuery = "[gn].[Spc_SendHistory_GetList_AttenderScheduleBlock]";

        var result = new List<AttenderScheduleBlockSendHistoryGetList>();

        using (var conn = Connection)
        {
            conn.Open();
            result = (await Connection.QueryAsync<AttenderScheduleBlockSendHistoryGetList>(sQuery,
                new
                {
                    ObjectIds = string.Join(',', ids)
                }, commandTimeout: 180, commandType: CommandType.StoredProcedure)).ToList();

            conn.Close();
        }

        return result;
    }

    public async Task<List<InsurerPriceSendHistoryGetList>> InsurerPriceSendHistoryGetList(string ids)
    {
        var sQuery = "[gn].[Spc_SendHistory_GetList_InsurerPrice]";

        var result = new List<InsurerPriceSendHistoryGetList>();

        using (var conn = Connection)
        {
            conn.Open();
            result = (await Connection.QueryAsync<InsurerPriceSendHistoryGetList>(sQuery,
                new
                {
                    ObjectIds = string.Join(',', ids)
                }, commandType: CommandType.StoredProcedure)).ToList();

            conn.Close();
        }

        return result;
    }

    public async Task<MyResultPage<List<InsurerPriceSendHistoryGetpage>>> InsurerPriceSendHistoryGetPage(
        DynamicParameters parameters)
    {
        var result = new MyResultPage<List<InsurerPriceSendHistoryGetpage>>();
        result.Data = new List<InsurerPriceSendHistoryGetpage>();

        using (var conn = Connection)
        {
            var sQuery = "[gn].[Spc_SendHistory_GetPage_InsurerPrice]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<InsurerPriceSendHistoryGetpage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }

    public async Task<InsurerPriceSendHistoryGetRecord> InsurerPriceSendHistoryGetRecord(int id)
    {
        if (string.IsNullOrEmpty(id.ToString()))
        {
            var model = new InsurerPriceSendHistoryGetRecord();
            return model;
        }

        var sQuery = "[gn].[Spc_SendHistory_GetRecord_InsurerPrice]";
        var result = new InsurerPriceSendHistoryGetRecord();
        using (var conn = Connection)
        {
            conn.Open();
            result = await Connection.QueryFirstOrDefaultAsync<InsurerPriceSendHistoryGetRecord>(sQuery,
                new
                {
                    ObjectId = id
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        return result;
    }
}