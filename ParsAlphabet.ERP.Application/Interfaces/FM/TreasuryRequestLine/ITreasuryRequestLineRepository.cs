using System.Collections;
using ParsAlphabet.ERP.Application.Dtos.FM.TreasuryRequestLine;

namespace ParsAlphabet.ERP.Application.Interfaces.FM.TreasuryRequestLine;

public interface ITreasuryRequestLineRepository
{
    Task<MyResultPage<TreasuryRequestLineDisplay>> Display(GetPageViewModel model, int userId, byte roleId);
    Task<MyResultPage<TreasuryRequestLineDisplay>> GetHeader(GetPageViewModel model, byte roleId);

    Task<MyResultStageStepConfigPage<List<Dtos.FM.TreasuryRequestLine.TreasuryRequestLine>>> GetPage(
        NewGetPageViewModel model);

    Task<TreasuryRequestLineSum> GetTreasuryRequestLineSum(NewGetPageViewModel model);
    Task<TreasuryRequestLineResult> Save(TreasuryRequestLineModel model, byte roleId);
    Task<MyResultStatus> Delete(GetTreasuryRequestLine model, int companyId, byte roleId);
    Task<MyResultPage<TreasuryRequestLineGetReccord>> GetRecordById(GetTreasuryRequestLine model);
    Task<CSVViewModel<IEnumerable>> TreasuryRequestLineCSV(NewGetPageViewModel model);
}