using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionDiagnosis;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionDiagnosis;

public class AdmissionDiagnosisRepository :
    BaseRepository<AdmissionDiagnosisModel, int, string>,
    IBaseRepository<AdmissionDiagnosisModel, int, string>
{
    public AdmissionDiagnosisRepository(IConfiguration config) : base(config)
    {
    }

    public async Task<MyResultStatus> SaveDiagnosis(DateTime createDateTime, int admissionId,
        List<AdmissionDiagnosisModel> model)
    {
        var result = new MyResultStatus();
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionDiagnosis_InsUpd]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery,
                new
                {
                    AdmissionId = admissionId,
                    CreateDateTime = createDateTime,
                    AdmissionDiagnosisJSON = JsonConvert.SerializeObject(model)
                }, commandType: CommandType.StoredProcedure);

            result.Successfull = result.Status == 0;
            conn.Close();
            return result;
        }
    }

    public async Task<List<AdmissionDiagnosisLineList>> GetDiagnosisList(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_Admission_DiagnosisList]";
            conn.Open();
            var result = (await conn.QueryAsync<AdmissionDiagnosisLineList>(sQuery,
                new
                {
                    AdmissionId = id
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<MyResultStatus> DeleteDiagnosisList(int admissionId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_DelRecordWithFilter]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery,
                new
                {
                    TableName = "mc.AdmissionDiagnosis",
                    Filter = $"HeaderId={admissionId}"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            result.Successfull = result.Status == 0;
            return result;
        }
    }
}