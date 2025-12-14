using System.Collections;
using ParsAlphabet.ERP.Application.Dtos.FA.FixedAssetLocation;

namespace ParsAlphabet.ERP.Application.Interfaces.FA.FixedAssetLocation;

public interface IFixedAssetLocationRepository
{
    Task<MyResultPage<List<FixedAssetLocationGetPage>>> GetPage(GetPageViewModel model);
    Task<MyResultPage<FixedAssetLocationGetRecord>> GetRecordById(int id);
    Task<List<MyDropDownViewModel>> GetDropDown();
    Task<MyResultQuery> Insert(FixedAssetLocationModel model);
    Task<MyResultQuery> Update(FixedAssetLocationModel model);
    Task<MyResultQuery> Delete(int keyvalue);
    GetColumnsViewModel GetColumns();
    Task<CSVViewModel<IEnumerable>> Csv(GetPageViewModel model);
}