using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.FM.PostingGroup;
using ParsAlphabet.ERP.Application.Interfaces.FM.PostingGroup;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageFundItemType;

namespace ParseAlphabet.ERP.Web.Modules.FM.PostingGroup;

[Route("api/FM/[controller]")]
[ApiController]
[Authorize]
public class PostingGroupApiController : ControllerBase
{
    private readonly IPostingGroupRepository _postingGroupRepository;
    private readonly StageFundItemTypeRepository _stageFundItemTypeRepository;

    public PostingGroupApiController(IPostingGroupRepository postingGroupRepository,
        StageFundItemTypeRepository stageFundItemTypeRepository)
    {
        _postingGroupRepository = postingGroupRepository;
        _stageFundItemTypeRepository = stageFundItemTypeRepository;
    }

    [HttpPost]
    [Route("getfilteritemstreasurysubject")]
    public GetColumnsViewModel GetFilterParametersTreasurySubject()
    {
        return _postingGroupRepository.GetColumnsTreasurySubject();
    }

    [HttpPost]
    [Route("getfilteritemsbankaccount")]
    public GetColumnsViewModel GetFilterParametersBankAccount()
    {
        return _postingGroupRepository.GetColumnsBankAccount();
    }

    [HttpPost]
    [Route("getfilteritemscashier")]
    public GetColumnsViewModel GetFilterParametersCashier()
    {
        return _postingGroupRepository.GetColumnsBranch();
    }

    [HttpPost]
    [Route("getfilteritemsadmission")]
    public GetColumnsViewModel GetFilterParametersAdmission()
    {
        return _postingGroupRepository.GetColumnsAdmission();
    }

    [HttpPost]
    [Route("getfilteritemswarehouse")]
    public GetColumnsViewModel GetFilterParametersWarehouse()
    {
        return _postingGroupRepository.GetColumnsWarehouse();
    }

    [HttpPost]
    [Route("getfilteritemstreasury")]
    public GetColumnsViewModel GetFilterParametersTreasury()
    {
        return _postingGroupRepository.GetColumnsTreasury();
    }

    [HttpPost]
    [Route("getheaderdetaillist")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<IEnumerable>> GetDetailHeaderList([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _postingGroupRepository.PostingGroupDetailGetList(model);
    }

    [HttpPost]
    [Route("getdetaillist")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<IEnumerable<PostingGroupLineDetailList>>> GetDetailLineList(
        [FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _postingGroupRepository.PostingGroupLineDetailGetList(model);
    }

    [HttpPost]
    [Route("getfilterheaderlist")]
    public GetColumnsViewModel GetColumnsHeaderDetailPageLineList()
    {
        return _postingGroupRepository.GetColumnsDetailPageHeaderList(0);
    }

    [HttpPost]
    [Route("getfilterdetaillist")]
    public GetColumnsViewModel GetColumnsLineDetailPageLineList()
    {
        return _postingGroupRepository.GetColumnsDetailPageLineList();
    }

    [HttpPost]
    [Route("getfilterdetailadmlist")]
    public GetColumnsViewModel GetColumnsLineDetailAdmPageLineList()
    {
        return _postingGroupRepository.GetColumnsDetailAdmPageLineList();
    }

    [HttpPost]
    [Route("getfilterdetaillistforordersale")]
    public GetColumnsViewModel GetColumnsDetailPageLineForOrderSaleList()
    {
        return _postingGroupRepository.GetColumnsDetailPageLineForOrderSaleList();
    }


    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<IEnumerable>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _postingGroupRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<PostingGroupGetRecord>> GetRecordById([FromBody] GetPostingGroupRecord model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var result = await _postingGroupRepository.PostingGroupGetRecordById(model);
        return result;
    }

    [HttpGet]
    [Route("getpostinggrouplineid/{postingGroupTypeId}/{headerIdentityId}")]
    public async Task<int> GetPostingGroupLineId(byte postingGroupTypeId, int headerIdentityId)
    {
        var companyId = UserClaims.GetCompanyId();
        var result =
            await _postingGroupRepository.GetPostingGroupLineId(postingGroupTypeId, headerIdentityId, companyId);
        return result;
    }

    [HttpPost]
    [Route("save")]
    [Authenticate(Operation.INS, "")]
    public async Task<PostingGroupSaveResultQuery> SaveHeader([FromBody] PostingGroupHeaderModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            return await _postingGroupRepository.Save(model);
        }

        return ModelState.ToPostingGroupMyResultQuery<int>();
    }

    [HttpPost]
    [Route("saveline")]
    [Authenticate(Operation.INS, "")]
    public async Task<PostingGroupSaveResultQuery> SaveLine([FromBody] PostingGroupLineModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            var stageFundItemType =
                await _stageFundItemTypeRepository.GetId(model.StageId, model.FundItemId, model.InOut);
            if (stageFundItemType.NotNull())
            {
                model.StageIdentityId = stageFundItemType.Id;
                model.IdentityTypeId = stageFundItemType.FundItemType;
            }

            return await _postingGroupRepository.SaveLine(model);
        }

        return ModelState.ToPostingGroupMyResultQuery<int>();
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultStatus> Delete([FromBody] int keyValue)
    {
        return await _postingGroupRepository.Delete($"Id={keyValue}");
    }

    [HttpPost]
    [Route("getglsgl")]
    public async Task<PostingGroupAccountGLSGLInfo> GetGLSGLInfo([FromBody] GetPostingGroupAccountGLSGLInfo model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _postingGroupRepository.GetPostingGroupAccountGLSGLInfo(model);
    }
}

[Route("FM")]
[Authorize]
public class PostingGroupController : Controller
{
    [Route("[controller]")]
    [HttpGet]
    [Authenticate(Operation.VIW, "")]
    public ActionResult Index()
    {
        return PartialView(Views.FM.PostingGroup.Index);
    }
}