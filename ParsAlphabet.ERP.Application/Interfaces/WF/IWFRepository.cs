using ParsAlphabet.ERP.Application.Dtos.WF;

namespace ParsAlphabet.ERP.Application.Interfaces.WF;

public interface IWFRepository
{
    List<MyDropDownViewModel> InOut_GetDropDown();
    Task<List<MyDropDownViewModel>> StageClassDropDown(byte workflowCategoryId);
    Task<List<MyDropDownViewModel>> WorkFlowCategory_GetDropDown();
    Task<List<MyDropDownViewModel>> StageFundType_GetDropDown(short stageId);
    Task<MyResultPage<TreasurySubjectStage>> GetTreasurySubjectStage(short stageId);
    Task<MyResultPage<int>> CheckStageHasPreviousId(short stageId);
    Task<MyResultPage<HeaderBalanceRemaining>> HeaderBalance(GetHeaderBalanceRemainingViewModel model);
    Task<List<PostGroupLineFooter>> GetPostGroupLineFooter(PostGroupFooterModel model, int companyId);
}