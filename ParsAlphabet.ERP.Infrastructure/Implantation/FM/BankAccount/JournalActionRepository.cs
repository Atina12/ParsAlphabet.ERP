using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.FM.Journal;
using ParsAlphabet.ERP.Application.Dtos.FM.JournalAction;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.FM.BankAccount;

public class JournalActionRepository :
    BaseRepository<JournalActionModel, int, string>,
    IBaseRepository<JournalActionModel, int, string>
{
    public JournalActionRepository(IConfiguration config) : base(config)
    {
    }

    public async Task<JournalActionModel> GetJournalAction(GetJournalAction model)
    {
        var filter = $"StageId={model.StageId} AND WorkflowId={model.WorkflowId}";

        if (model.ActionId != 0)
            filter += $" AND ActionId={model.ActionId} ";
        else
            filter += $" AND Priority={model.Priority}";

        var sQuery = "[pb].[Spc_Tables_GetRecord]";

        using (var conn = Connection)
        {
            conn.Open();
            var result = new JournalActionModel();

            result = await Connection.QueryFirstOrDefaultAsync<JournalActionModel>(sQuery,
                new
                {
                    TableName = "wf.StageAction",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }

    public async Task<JournalActionLogicModel> GetJournalActionByJournal(int treasuryId)
    {
        var sQuery = "[fm].[Spc_Journal_GetLogic]";
        using (var conn = Connection)
        {
            conn.Open();
            var result = await Connection.QueryFirstOrDefaultAsync<JournalActionLogicModel>(sQuery,
                new
                {
                    JournalId = treasuryId
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetDropDown()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "wf.Action",
                    IdColumnName = "Id",
                    TitleColumnName = "Name"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }
}