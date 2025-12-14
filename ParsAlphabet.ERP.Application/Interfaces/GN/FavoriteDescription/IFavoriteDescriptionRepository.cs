using System.Collections;
using ParsAlphabet.ERP.Application.Dtos.GN.FavoriteDescription;
using ParsAlphabet.ERP.Application.Dtos.PB;

namespace CIS.Repositories.Interfaces;

public interface IFavoriteDescriptionRepository
{
    Task<MyResultPage<List<FavoriteDescriptionGetPage>>> GetPage(NewGetPageViewModel model);
    Task<List<MyDropDownViewModel>> GetDropDownByUserId(int userId, int companyId);
    Task<MyResultPage<FavoriteDescriptionGetRecord>> GetRecordById(int id, int companyId);
    Task<MyResultQuery> Insert(FavoriteDescriptionModel model);
    Task<MyResultQuery> Update(FavoriteDescriptionModel model);
    Task<MyResultQuery> Delete(int keyvalue);
    Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model);
    GetColumnsViewModel GetColumns(string workFlowCategoryId);
    Task<MyResultDataStatus<IEnumerable<MyDropDownViewModel2>>> SearchFavoriteDescription(
      GetPublicSearch model);
    Task<MyResultDataStatus<IEnumerable<MyDropDownViewModel2>>> SearchFavoriteDescriptionOld(
       GetPublicSearch model);
}