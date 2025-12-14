using ParsAlphabet.ERP.Application.Dtos.FM.NewTreasury;

namespace ParsAlphabet.ERP.Application.Interfaces.FM.PostingGroupCartable;

public interface IPostingGroupCartableRepository
{
    Task<List<MyDropDownViewModel>> PostingGroupCartableSection(int stageClassId, int companyId, int? userId,
        byte roleId);

    GetColumnsViewModel GetColumnsTreasuryCartable(int companyId);

    Task<MyResultPage<List<TreasuryCartableGetPage>>> PostingGroupTreasuryCartableSectionGetPage(
        NewGetPageViewModel model, int userId, byte roleId);
}