using ParsAlphabet.ERP.Application.Dtos.FM.TreasurySearch;

namespace ParsAlphabet.ERP.Application.Interfaces.FM.TreasurySearch;

public interface ITreasurySearchRepository
{
    Task<MyResultPage<List<GetTreasuryQuickSearch>>> GetTreasuryQuickSearch(TreasuryQuickSearch model, byte roleId);
    Task<MyResultPage<List<GetTreasuryQuickSearchType>>> GetTreasuryQuickSearchType(TreasuryQuickSearchtype model);
}