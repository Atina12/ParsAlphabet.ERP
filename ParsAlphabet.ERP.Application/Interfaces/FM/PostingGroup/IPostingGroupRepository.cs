using System.Collections;
using ParsAlphabet.ERP.Application.Dtos.FM.PostingGroup;

namespace ParsAlphabet.ERP.Application.Interfaces.FM.PostingGroup;

public interface IPostingGroupRepository
{
    GetColumnsViewModel GetColumnsTreasury();
    GetColumnsViewModel GetColumnsTreasurySubject();
    GetColumnsViewModel GetColumnsBankAccount();
    GetColumnsViewModel GetColumnsBranch();
    GetColumnsViewModel GetColumnsAdmission();
    GetColumnsViewModel GetColumnsWarehouse();
    Task<MyResultPage<IEnumerable>> GetPage(NewGetPageViewModel model);
    Task<MyResultPage<PostingGroupGetRecord>> PostingGroupGetRecordById(GetPostingGroupRecord model);
    Task<PostingGroupSaveResultQuery> Save(PostingGroupHeaderModel model);
    Task<PostingGroupSaveResultQuery> SaveLine(PostingGroupLineModel model);
    Task<MyResultStatus> Delete(string filter);
    Task<MyResultPage<IEnumerable>> PostingGroupDetailGetList(NewGetPageViewModel model);

    Task<MyResultPage<IEnumerable<PostingGroupLineDetailList>>>
        PostingGroupLineDetailGetList(NewGetPageViewModel model);

    GetColumnsViewModel GetColumnsDetailPageHeaderList(byte workFlowCategoryId);
    GetColumnsViewModel GetColumnsDetailPageLineList();
    GetColumnsViewModel GetColumnsDetailAdmPageLineList();
    GetColumnsViewModel GetColumnsDetailPageLineForOrderSaleList();
    Task<PostingGroupAccountGLSGLInfo> GetPostingGroupAccountGLSGLInfo(GetPostingGroupAccountGLSGLInfo model);
    Task<PostingGroupHeaderModel> GetPostingGroupHeader(GetPostingGroup model);
    Task<PostingGroupHeaderModel> GetPostingGroupLine(GetPostingGroup model);
    Task<int> GetPostingGroupLineId(byte postingGroupTypeId, int headerIdentityId, int companyId);
    Task<List<MyDropDownViewModel>> GetAllDataDropDown(int HeaderId);
    Task<List<PostingGroupbyTypeLineModel>> GetPostingGroupByTypeLine(GetPostingGroup model);

    Task<List<PostingGroupLastAcountModel>> GetPostingGroupLastAcountLine(GetPostingGroupLastAcount model);
}