using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageStepConfig;

public class StageStepConfigRepository :
    BaseRepository<StageStepConfigModel, int, string>,
    IBaseRepository<StageStepConfigModel, int, string>
{
    public StageStepConfigRepository(IConfiguration config) : base(config)
    {
    }

    public async Task<MyResultDataQuery<List<DataStageStepConfigColumnsViewModel>>> GetStageStepConfigColumn(
        GetStageStepConfigColumnsViewModel configColumnModel, bool justSetInputType = false, bool? isFormLoaded = false)
    {
        #region getData

        var result = new MyResultDataQuery<List<DataStageStepConfigColumnsViewModel>>();

        var config = new List<StageStepConfigJson>();
        var parameters = new DynamicParameters();
        parameters.Add("TableName", configColumnModel.StageStepConfig.LineFields.FirstOrDefault().TableName);
        parameters.Add("FieldTableName", configColumnModel.StageStepConfig.LineFields.FirstOrDefault().FieldId);
        parameters.Add("StageId", configColumnModel.StageStepConfig.HeaderFields[0].FieldValue);
        parameters.Add("WorkflowId", configColumnModel.StageStepConfig.HeaderFields[1].FieldValue);
        parameters.Add("FieldTableLineId", configColumnModel.StageStepConfig.LineFields.FirstOrDefault().FieldValue);

        using (var conn = Connection)
        {
            var sQuery = "[wf].[Spc_StageStepConfigDetail_GetList]";
            conn.Open();
            config = (await conn.QueryAsync<StageStepConfigJson>(sQuery, parameters,
                commandType: CommandType.StoredProcedure)).ToList();
        }

        #endregion

        var newDataColumnList = new List<DataStageStepConfigColumnsViewModel>();

        #region prepration config column model

        foreach (var item in configColumnModel.DataColumns)
        {
            var configItem = config.Where(a => a.Name.ToLower() == item.Id.ToLower()).FirstOrDefault();
            var newItem = configItem != null ? item : null;
            if (newItem != null)
            {
                newItem.Editable = true;
                newItem.InputMethod = configItem.InputMethodId;
                switch (configItem.InputMethodId)
                {
                    case 1:
                        newItem.InputType = newItem.InputType1 == null ? newItem.InputType : newItem.InputType1;
                        break;
                    case 2:
                        newItem.InputType = newItem.InputType2 == null ? newItem.InputType : newItem.InputType2;
                        if (newItem.InputType == "select")
                            newItem.IsSelect2 = true;
                        break;
                }

                newDataColumnList.Add(newItem);
            }
            else if (justSetInputType)
            {
                if (newDataColumnList.Where(a => a.Id == item.Id).Count() == 0)
                {
                    item.InputType = "";
                    newDataColumnList.Add(item);
                }
            }
        }

        #endregion

        if (isFormLoaded.Value)
            foreach (var itm in newDataColumnList)
                itm.DefaultReadOnly = true;

        result.Data = newDataColumnList;
        return result;
    }

    public async Task<MyResultDataQuery<StageStepConfigModel>> GetStageStepFieldTables(string formKey)
    {
        var result = new MyResultDataQuery<StageStepConfigModel>();

        result.Data = new StageStepConfigModel
        {
            HeaderFields = new List<StageStepHeaderColumn>
            {
                new()
                {
                    FieldId = "stageId"
                },
                new()
                {
                    FieldId = "workFlowId"
                }
            },
            LineFields = new List<StageStepLineColumn>
            {
                new()
                {
                    FieldId = "fundTypeId",
                    TableName = "FM.TreasuryLine"
                }
            }
        };

        return await Task.FromResult(result);
    }

    public MyResultDataQuery<string> GetValue(List<StageStepGetValueModel> model)
    {
        var result = new MyResultDataQuery<string>();

        result.Data = "3";
        return result;
    }
}