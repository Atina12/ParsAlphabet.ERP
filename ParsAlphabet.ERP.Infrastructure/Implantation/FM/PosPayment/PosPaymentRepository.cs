using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.FM.PosPayment;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.FM.PosPayment;

public class PosPaymentRepository :
    BaseRepository<PosPaymentModel, int, string>,
    IBaseRepository<PosPaymentModel, int, string>
{
    public PosPaymentRepository(IConfiguration config) : base(config)
    {
    }


    public async Task Insert(PosPaymentModel model)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_Pos_Payment_InsUpd]";
            conn.Open();
            await conn.ExecuteAsync(sQuery, new
            {
                model.RefNo,
                model.CardNo,
                model.TerminalNo,
                model.AccountNo,
                model.PosId,
                model.Amount,
                model.CreateDateTime,
                model.PaymentId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }
    }
}