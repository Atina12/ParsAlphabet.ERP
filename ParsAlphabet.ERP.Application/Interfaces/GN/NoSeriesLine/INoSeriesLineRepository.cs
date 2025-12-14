using System.Collections;
using ParsAlphabet.ERP.Application.Dtos.GN.NoSeriesLine;

namespace ParsAlphabet.ERP.Application.Interfaces.GN.NoSeriesLine;

public interface INoSeriesLineRepository
{
    GetColumnsViewModel GetColumns();
    Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model);
    Task<MyResultPage<List<NoSeriesLineGetPage>>> GetPage(NewGetPageViewModel model);
    Task<MyResultPage<NoSeriesLineGetRecord>> GetRecordById(int LineId, int HeaderId, int companyId);
    Task<MyResultQuery> Insert(NoSeriesLineModel model);
    Task<MyResultQuery> Update(NoSeriesLineModel model);
    Task<MyResultQuery> Delete(int LineId, int HeaderId, int companyId);
    Task<List<MyDropDownViewModel>> GetDropDownBankAccount(short bankId, int companyId);
    Task<List<MyDropDownViewModel>> GetDropDownNoSeries(int companyId);

    Task<List<MyDropDownViewModel>> GetDropDownNoSeriesByWorkflowId(int workflowCategoryId, int accountGlId,
        int accountSGLId);

    Task<List<MyDropDownViewModel>> GetDropDownByBankCategoryId(short bankCategoryId, int companyId);
    Task<List<MyDropDownViewModel>> GetDropDownByGlSgl(int accountGlId, int accountSGLId);
    Task<List<MyDropDownViewModel>> GetNextStageActionNoseries(short stageId, short branchId);
    Task<short> GetBankId(short id, int companyId);
    Task<string> GetAccountName(short id, int companyId);
    Task<int> GetNoSeriesId(string tableName, int companyId);
    Task<List<MyDropDownViewModel>> GetDropDownByNextStage(byte workflowCategoryId);
}