using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.MC.FavoritePrescription;
using ParsAlphabet.ERP.Application.Interfaces.MC.FavoritePrescription;

namespace ParseAlphabet.ERP.Web.Modules.MC.FavoritePrescription;

[Route("api/MC/[controller]")]
[ApiController]
[Authorize]
public class FavoritePrescriptionApiController : ControllerBase
{
    private readonly IFavoritePrescriptionRepository _favoritePrescriptionRepository;

    public FavoritePrescriptionApiController(IFavoritePrescriptionRepository favoritePrescriptionRepository)
    {
        _favoritePrescriptionRepository = favoritePrescriptionRepository;
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return _favoritePrescriptionRepository.GetColumns();
    }

    [HttpPost]
    [Route("getfavoritediassign")]
    [Authenticate(Operation.VIW, "PrescriptionTamin")]
    public async Task<MyResultPage<AssignList>> GetFavoriteDiAssign([FromBody] NewGetPageViewModel pageViewModel)
    {
        return await _favoritePrescriptionRepository.GetFavoriteDiAssign(pageViewModel);
    }

    [HttpPost]
    [Route("getfavoriteassign")]
    [Authenticate(Operation.VIW, "PrescriptionTamin")]
    public async Task<MyResultPage<AssignList>> GetFavoriteAssign([FromBody] NewGetPageViewModel pageViewModel)
    {
        return await _favoritePrescriptionRepository.GetFavoriteAssign(pageViewModel);
    }

    [HttpPost]
    [Route("getfavoritelist")]
    [Authenticate(Operation.VIW, "PrescriptionTamin")]
    public async Task<List<MyDropDownViewModel>> GetFavoriteList([FromBody] GetFavoriteAssignDropDown model)
    {
        return await _favoritePrescriptionRepository.GetFavoriteList(model);
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "PrescriptionTamin")]
    public async Task<MyResultQuery> Insert([FromBody] FavoriteAssign model)
    {
        return await _favoritePrescriptionRepository.FavoriteAssign(model);
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "PrescriptionTamin")]
    public async Task<MyResultQuery> Delete([FromBody] FavoriteAssign model)
    {
        return await _favoritePrescriptionRepository.FavoriteDiAssign(model);
    }

    [HttpGet]
    [Route("favoritecategorydropdown/{admissionTypeId}")]
    public async Task<List<MyDropDownViewModel>> FavoriteCategoryGetDropDown(byte admissionTypeId)
    {
        return await _favoritePrescriptionRepository.FavoriteCategoryDropDown(admissionTypeId);
    }


    [HttpPost]
    [Route("savefavorite")]
    [Authenticate(Operation.INS, "PrescriptionTamin")]
    public async Task<MyResultStatus> SaveFavorite([FromBody] SaveFavoritenTamin model)
    {
        model.CreateUserId = UserClaims.GetUserId();
        ;

        var result = await _favoritePrescriptionRepository.SaveFavorite(model);

        return result;
    }

    [HttpPost]
    [Route("getpagefavorite")]
    [Authenticate(Operation.VIW, "PrescriptionTamin")]
    public async Task<MyResultPage<List<FavoritenTaminGetPage>>> GetPagefavorite([FromBody] NewGetPageViewModel model)
    {
        return await _favoritePrescriptionRepository.GetPageFavorite(model);
    }

    [HttpPost]
    [Route("getrecordfavoritebyid")]
    [Authenticate(Operation.VIW, "PrescriptionTamin")]
    public async Task<MyResultPage<FavoritenTaminGetPage>> GetRecordFavorite([FromBody] int id)
    {
        return await _favoritePrescriptionRepository.GetRecordFavorite(id);
    }

    [HttpPost]
    [Route("deletefavoriteid")]
    [Authenticate(Operation.DEL, "PrescriptionTamin")]
    public async Task<MyResultStatus> DeleteFavorite([FromBody] int id)
    {
        return await _favoritePrescriptionRepository.DeleteFavorite(id);
    }
}

[Route("MC")]
[Authorize]
public class FavoritePrescriptionController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return View(Views.MC.FavoritePrescription);
    }
}