using ParsAlphabet.ERP.Application.Dtos.GN.FiscalYearLine;

namespace ParsAlphabet.ERP.Application.Interfaces.GN.FiscalYearLine;

public interface IFiscalYearLineRepository
{
    Task<MyResultPage<List<FiscalYearLineGetPage>>> GetPage(NewGetPageViewModel model);
    Task<MyResultQuery> Insert(FiscalYearLineModel model);
    Task<MyResultQuery> Update(FiscalYearLineModel model);
    GetColumnsViewModel GetColumns();
    Task<List<MyDropDownViewModel>> GetDropDown();
    Task<MyResultPage<FiscalYearLineGetRecord>> GetRecordBy_FiscalYearLine(byte headerId, byte monthId);
}