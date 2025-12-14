using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionStageAction;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionStageAction;

public class AdmissionStageActionRepository(IConfiguration config) :
    BaseRepository<AdmissionStageActionModel, int, string>(config),
    IBaseRepository<AdmissionStageActionModel, int, string>
{
    public async Task<AdmissionStageActionModel> GetAdmissionStageAction(GetAdmissionStageAction model)
    {
        var filter = $"Fk_admission_stageid={model.StageId}";

        var sQuery = "[pb].[Spc_Tables_GetRecord]";
        using (var conn = Connection)
        {
            conn.Open();
            var result = (await Connection.QueryAsync<AdmissionStageActionModel>(sQuery,
                new
                {
                    IsSecondLang = false,
                    TableName = "mc.admission_stage_action",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();

            var admissionStageAction = new AdmissionStageActionModel();

            if (model.ActionId != 0)
                admissionStageAction = result.Where(x =>
                    x.ActionId == model.ActionId && x.LogicModel.Priority == model.Priority &&
                    x.LogicModel.CompanyId == model.CompanyId).FirstOrDefault();
            else
                admissionStageAction = result.Where(x =>
                        x.LogicModel.Priority == model.Priority && x.LogicModel.CompanyId == model.CompanyId)
                    .FirstOrDefault();

            return admissionStageAction;
        }
    }
}