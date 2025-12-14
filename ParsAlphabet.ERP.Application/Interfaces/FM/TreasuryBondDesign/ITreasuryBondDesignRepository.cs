using ParsAlphabet.ERP.Application.Dtos.FM.TreasuryBondDesign;

namespace ParsAlphabet.ERP.Application.Interfaces.FM.TreasuryBondDesign;

public interface ITreasuryBondDesignRepository
{
    Task<MyResultDataQuery<TreasuryBondDesignModel>> GetTreasuryBondDesignByBankId(int bankId);
    Task<MyResultStatus> BankDuplicate(BankDuplicate model);
    Task<MyResultStatus> InsertTreasuryBondDesign(TreasuryBondDesignModel model);
    Task<MyResultStatus> UpdateTreasuryBondDesign(TreasuryBondDesignModel model);
    Task<MyResultStatus> DeleteTreasuryBondDesign(int bankId);
}