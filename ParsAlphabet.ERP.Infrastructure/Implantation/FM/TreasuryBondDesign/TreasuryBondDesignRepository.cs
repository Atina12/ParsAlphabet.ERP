using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.FM.TreasuryBondDesign;
using ParsAlphabet.ERP.Application.Interfaces.FM.TreasuryBondDesign;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.FM.TreasuryBondDesign;

public class TreasuryBondDesignRepository : ITreasuryBondDesignRepository
{
    private readonly IConfiguration _config;

    public TreasuryBondDesignRepository(IConfiguration config)
    {
        _config = config;
    }

    public IDbConnection Connection => new SqlConnection(_config.GetConnectionString("DefaultConnection"));

    public async Task<MyResultDataQuery<TreasuryBondDesignModel>> GetTreasuryBondDesignByBankId(int bankId)
    {
        var result = new MyResultDataQuery<TreasuryBondDesignModel>();
        result.Data = new TreasuryBondDesignModel();
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_TreasuryBondDesign_GetRecord]";
            conn.Open();
            result.Data = await conn.QueryFirstOrDefaultAsync<TreasuryBondDesignModel>(sQuery, new
                { BankId = bankId }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        return result;
    }

    public async Task<MyResultStatus> BankDuplicate(BankDuplicate model)
    {
        var sQuery = "[fm].[Spc_TreasuryBondDesign_Duplicate]";
        var result = new MyResultStatus();
        using (var conn = Connection)
        {
            conn.Open();
            await Connection.ExecuteAsync(sQuery,
                new
                {
                    model.OriginBankId,
                    model.DestinationBankId
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Status = 100;
        result.Successfull = true;
        return result;
    }

    public async Task<MyResultStatus> InsertTreasuryBondDesign(TreasuryBondDesignModel model)
    {
        var result = new MyResultStatus();
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_TreasuryBondDesign_InsUpd]";
            conn.Open();

            await conn.ExecuteAsync(sQuery, new
            {
                Id = 0,
                model.BankId,

                model.ColorText,
                model.Width,
                model.Height,

                model.IdNo_Top,
                model.IdNo_Right,
                model.IdNo_Width,
                model.IdNo_Height,
                model.IdNo_Font,
                model.IdNo_FontSize,
                model.IdNo_IsActive,

                model.LetterAmount_Top,
                model.LetterAmount_Right,
                model.LetterAmount_Width,
                model.LetterAmount_Height,
                model.LetterAmount_Font,
                model.LetterAmount_FontSize,
                model.LetterAmount_IsActive,

                model.LetterDate_Top,
                model.LetterDate_Right,
                model.LetterDate_Width,
                model.LetterDate_Height,
                model.LetterDate_Font,
                model.LetterDate_FontSize,
                model.LetterDate_IsActive,

                model.NumericAmount_Top,
                model.NumericAmount_Right,
                model.NumericAmount_Width,
                model.NumericAmount_Height,
                model.NumericAmount_Font,
                model.NumericAmount_FontSize,
                model.NumericAmount_IsSeprate,
                model.NumericAmount_IsActive,

                model.NumericDate_Top,
                model.NumericDate_Right,
                model.NumericDate_Width,
                model.NumericDate_Height,
                model.NumericDate_Font,
                model.NumericDate_FontSize,
                model.NumericDate_IsSeprate,
                model.NumericDate_IsActive,

                model.Recipient_Top,
                model.Recipient_Right,
                model.Recipient_Width,
                model.Recipient_Height,
                model.Recipient_Font,
                model.Recipient_FontSize,
                model.Recipient_IsActive,

                model.Description_Top,
                model.Description_Right,
                model.Description_Width,
                model.Description_Height,
                model.Description_Font,
                model.Description_FontSize,
                model.Description_IsActive
            }, commandType: CommandType.StoredProcedure);

            conn.Close();
        }

        result.Status = 100;
        result.Successfull = true;
        return result;
    }

    public async Task<MyResultStatus> UpdateTreasuryBondDesign(TreasuryBondDesignModel model)
    {
        var result = new MyResultStatus();
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_TreasuryBondDesign_InsUpd]";
            conn.Open();

            var entity = GetTreasuryBondDesignByBankId(model.BankId).Result.Data;
            var id = entity != null ? entity.Id : 0;
            if (id > 0)
            {
                await conn.ExecuteAsync(sQuery, new
                {
                    Id = id,
                    model.BankId,

                    model.ColorText,
                    model.Width,
                    model.Height,

                    model.IdNo_Top,
                    model.IdNo_Right,
                    model.IdNo_Width,
                    model.IdNo_Height,
                    model.IdNo_Font,
                    model.IdNo_FontSize,
                    model.IdNo_IsActive,

                    model.LetterAmount_Top,
                    model.LetterAmount_Right,
                    model.LetterAmount_Width,
                    model.LetterAmount_Height,
                    model.LetterAmount_Font,
                    model.LetterAmount_FontSize,
                    model.LetterAmount_IsActive,

                    model.LetterDate_Top,
                    model.LetterDate_Right,
                    model.LetterDate_Width,
                    model.LetterDate_Height,
                    model.LetterDate_Font,
                    model.LetterDate_FontSize,
                    model.LetterDate_IsActive,

                    model.NumericAmount_Top,
                    model.NumericAmount_Right,
                    model.NumericAmount_Width,
                    model.NumericAmount_Height,
                    model.NumericAmount_Font,
                    model.NumericAmount_FontSize,
                    model.NumericAmount_IsSeprate,
                    model.NumericAmount_IsActive,

                    model.NumericDate_Top,
                    model.NumericDate_Right,
                    model.NumericDate_Width,
                    model.NumericDate_Height,
                    model.NumericDate_Font,
                    model.NumericDate_FontSize,
                    model.NumericDate_IsSeprate,
                    model.NumericDate_IsActive,

                    model.Recipient_Top,
                    model.Recipient_Right,
                    model.Recipient_Width,
                    model.Recipient_Height,
                    model.Recipient_Font,
                    model.Recipient_FontSize,
                    model.Recipient_IsActive,

                    model.Description_Top,
                    model.Description_Right,
                    model.Description_Width,
                    model.Description_Height,
                    model.Description_Font,
                    model.Description_FontSize,
                    model.Description_IsActive
                }, commandType: CommandType.StoredProcedure);
                result.Status = 100;
                result.Successfull = true;
            }

            conn.Close();
        }

        return result;
    }

    public async Task<MyResultStatus> DeleteTreasuryBondDesign(int bankId)
    {
        var result = new MyResultStatus();

        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_DelRecordWithFilter]";
            conn.Open();
            await conn.ExecuteAsync(sQuery,
                new
                {
                    TableName = "fm.TreasuryBondDesign",
                    Filter = $"BankId={bankId}"
                }, commandType: CommandType.StoredProcedure);
        }

        result.Status = 100;
        result.Successfull = true;
        return result;
    }
}