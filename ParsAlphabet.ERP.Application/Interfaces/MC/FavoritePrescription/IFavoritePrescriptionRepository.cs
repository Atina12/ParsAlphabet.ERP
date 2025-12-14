using ParsAlphabet.ERP.Application.Dtos.MC.FavoritePrescription;

namespace ParsAlphabet.ERP.Application.Interfaces.MC.FavoritePrescription;

public interface IFavoritePrescriptionRepository
{
    GetColumnsViewModel GetColumns();
    Task<MyResultPage<AssignList>> GetFavoriteDiAssign(NewGetPageViewModel model);
    Task<MyResultPage<AssignList>> GetFavoriteAssign(NewGetPageViewModel model);
    Task<MyResultQuery> FavoriteAssign(FavoriteAssign model);
    Task<MyResultQuery> FavoriteDiAssign(FavoriteAssign model);
    Task<List<MyDropDownViewModel>> GetFavoriteList(GetFavoriteAssignDropDown model);
    Task<List<MyDropDownViewModel>> FavoriteCategoryDropDown(byte admissionTypeId);

    Task<MyResultPage<List<FavoritenTaminGetPage>>> GetPageFavorite(NewGetPageViewModel model);

    Task<MyResultPage<FavoritenTaminGetPage>> GetRecordFavorite(int id);

    Task<MyResultStatus> SaveFavorite(SaveFavoritenTamin model);


    Task<bool> CheckExist(SaveFavoritenTamin model);

    Task<MyResultStatus> DeleteFavorite(int id);
}