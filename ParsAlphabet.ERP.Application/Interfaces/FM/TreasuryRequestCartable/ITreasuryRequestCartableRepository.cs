using ParsAlphabet.ERP.Application.Dtos.FM.NewTreasury;

namespace ParsAlphabet.ERP.Application.Interfaces.FM.TreasuryRequestCartable;

public interface ITreasuryRequestCartableRepository
{
    Task<List<MyDropDownViewModel>> TreasuryRequestCartableSection(int stageClassId, int companyId, int? userId,
        byte roleId);

    GetColumnsViewModel GetColumnsTreasuryRequestCartable(int companyId);

    Task<MyResultPage<List<TreasuryCartableGetPage>>> TreasuryRequestCartableSectionGetPage(NewGetPageViewModel model,
        int userId, byte roleId);
}