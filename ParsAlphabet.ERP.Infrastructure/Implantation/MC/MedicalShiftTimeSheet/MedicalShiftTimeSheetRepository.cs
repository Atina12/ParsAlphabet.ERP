using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.MC.MedicalShiftTimeSheet;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.MedicalShiftTimeSheet;

public class MedicalShiftTimeSheetRepository :
    BaseRepository<MedicalShiftTimeSheetModel, int, string>,
    IBaseRepository<MedicalShiftTimeSheetModel, int, string>
{
    public MedicalShiftTimeSheetRepository(IConfiguration _config) : base(_config)
    {
    }

    //public async Task<List<SaveResultMedicalShiftTimeSheet>> Save(MedicalShiftTimeSheetModel model)
    //{
    //	if (model.SelectShift)
    //	{
    //		var errors = await CheckValidation(model, OperationType.Insert);

    //		if (errors.Count > 0)
    //		{
    //			return new List<SaveResultMedicalShiftTimeSheet>()
    //			{
    //				new SaveResultMedicalShiftTimeSheet(){Successfull=false,ValidationErrors=errors }
    //			};
    //		}
    //	}

    //	string sQuery = "[mc].[Spc_MedicalShiftTimeSheet_InsUpd]";
    //	using (IDbConnection conn = Connection)
    //	{
    //		conn.Open();
    //		var result = await Connection.QueryAsync<SaveResultMedicalShiftTimeSheet>(sQuery, new
    //		{
    //			model.SelectShift,
    //			model.WorkDayDate,
    //			model.MedicalTimeShiftId,
    //			model.StandardTimeSheetId,
    //			model.YearId,
    //			model.MonthId,
    //			model.DayId,
    //			DayInWeek = model.DayOfWeek,
    //			model.CreateUserId,
    //			model.CreateDateTime
    //		}, commandType: CommandType.StoredProcedure);
    //		conn.Close();

    //		return result.AsList();
    //	}

    //}


    public async Task<bool> CheckExist(DateTime workDayDate, int medicalTimeShiftId, int standardTimeSheetId,
        int departmentTimeShiftLineId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<int>(sQuery,
                new
                {
                    TableName = "mc.MedicalShiftTimeSheet",
                    ColumnName = "MedicalTimeShiftId",
                    Filter =
                        $"WorkDayDate=CAST('{workDayDate}' as DATE) AND MedicalTimeShiftId={medicalTimeShiftId} AND StandardTimeSheetId={standardTimeSheetId}"
                }, commandType: CommandType.StoredProcedure);

            conn.Close();
            return result != 0;
        }
    }


    public async Task<List<string>> CheckValidation(MedicalShiftTimeSheetModel model, OperationType operationType)
    {
        var errors = new List<string>();

        if (model == null)
            errors.Add("مقادیر معتبر نمی باشد");

        if (operationType == OperationType.Insert)
        {
            var checkExist = await CheckExist(model.WorkDayDate, model.MedicalTimeShiftId, model.StandardTimeSheetId,
                model.DepartmentTimeShiftLineId);

            if (checkExist)
                errors.Add("شیفت موردنظر قبلا به ثبت رسیده است");


            //var checkRange = await CheckMedicalTimeShiftRange(model, 1);

            //if (checkRange)
            //    errors.Add("شیفت انتخابی با شیفت های دیگر در این روز تداخل دارد");
        }

        return errors;
    }

    public async Task<MyResultStatus> ChangeLockMedicalShiftTimeSheet(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_MedicalShiftTimeSheet_ChangeLock]";
            conn.Open();
            var result = await Connection.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                Id = id
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
            result.Successfull = result.Status == 100;
            return result;
        }
    }

    public async Task<bool> GetItem(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<bool>(sQuery,
                new
                {
                    TableName = "mc.MedicalShiftTimeSheet",
                    ColumnName = "Locked",
                    Filter = $"Id='{id}'"
                }, commandType: CommandType.StoredProcedure);

            return result;
        }
    }
}