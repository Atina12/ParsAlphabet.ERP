using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.MC.AttenderMarginBracketLine;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.User;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.AttenderMarginBracketLine;

public class AttenderMarginBracketLineRepository :
    BaseRepository<AttenderMarginBracketLineModel, int, string>,
    IBaseRepository<AttenderMarginBracketLineModel, int, string>
{
    private readonly UserRepository _userRepository;

    public AttenderMarginBracketLineRepository(IConfiguration config, UserRepository userRepository) : base(config)
    {
        _userRepository = userRepository;
    }

    public async Task<List<AttenderMarginBracketLineGetPage>> GetPage(int headerId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("HeaderId", headerId);

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AttenderMarginBracketLine_GetPage]";
            conn.Open();
            var result =
                (await conn.QueryAsync<AttenderMarginBracketLineGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();

            return result;
        }
    }

    public async Task<AttenderMarginBracketLineGetRecord> GetRecordById(int Id)
    {
        using (var conn = Connection)
        {
            conn.Open();
            var sQuery = "pb.Spc_Tables_GetRecord";
            var result = await conn.QueryFirstOrDefaultAsync<AttenderMarginBracketLineGetRecord>(sQuery, new
            {
                TableName = "mc.AttenderMarginBracketLine",
                Filter = $"Id={Id}"
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.CreateUserFullName = await _userRepository.GetUserFullName(result.CreateUserId);

            return result;
        }
    }

    public async Task<MyResultStatus> Save(AttenderMarginBracketLineModel model)
    {
        if (await CheckAmountRange(model.Id, model.HeaderId, model.StartAmount, model.EndAmount))
            return new MyResultStatus
            {
                Successfull = false,
                Status = -100,
                StatusMessage = "محدوده نرخ وارد شده همپوشانی دارد ، مجاز به ثبت نمی باشید"
            };

        var result = new MyResultStatus();
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AttenderMarginBracketLine_InsUpd]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                model.Opr,
                model.Id,
                model.HeaderId,
                model.StartAmount,
                model.EndAmount,
                model.PriceTypeId,
                model.AttenderCommissionValue,
                model.CreateUserId,
                model.CreateDateTime
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = result.Status == 100;

        result.DateTime = model.CreateDateTime;

        return result;
    }

    public async Task<MyResultQuery> Delete(int id)
    {
        var result = new MyResultQuery();

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_DelRecordWithFilter";

            conn.Open();

            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                TableName = "mc.AttenderMarginBracketLine",
                Filter = $"Id = {id}"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();
        }

        result.Successfull = result.Status == 100;

        return result;
    }

    public async Task<bool> CheckAmountRange(int id, int headerId, decimal startAmount, decimal endAmount)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_CheckAttenderMarginBracketLine_Range]";

            conn.Open();

            var result = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                Headerid = headerId,
                Id = id,
                StartAmount = startAmount,
                EndAmount = endAmount
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result != 0;
        }
    }

    public async Task<decimal> GetNewStartAmount(int headerId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";

            conn.Open();

            var result = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                TableName = "mc.AttenderMarginBracketLine",
                ColumnName = "ISNULL(max(EndAmount),0)+1",
                Filter = $"HeaderId={headerId}"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }
}