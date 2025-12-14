using System.Collections;
using ParsAlphabet.ERP.Application.Dtos.MC.Attender_Assistant;

namespace ParsAlphabet.ERP.Application.Interfaces.MC.Attender_Assistant;

public interface IAttender_AssistantRepository
{
    GetColumnsViewModel GetColumns(string FormType);
    Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model, string FormType);
    Task<MyResultPage<List<AttenderAssistantGetPage>>> GetPage(NewGetPageViewModel model);
    Task<MyResultPage<List<AssistantAttenderGetPage>>> GetPageAssistant(NewGetPageViewModel model);
    Task<MyResultPage<Attender_AssistantGetRecord>> GetRecordBy_Attender_Assistant(Get_Attender_Assistant model);
    Task<MyResultQuery> Save(Attender_AssistantModel model);
    Task<List<MyDropDownViewModel>> GetDropDown(int userid, int CompanyId);
    Task<List<MyDropDownViewModel>> GetAttenderIsParaClinic(int userid, int companyId);
    Task<List<int>> NewGetAttendersByUserId(int userId, int companyId);
}