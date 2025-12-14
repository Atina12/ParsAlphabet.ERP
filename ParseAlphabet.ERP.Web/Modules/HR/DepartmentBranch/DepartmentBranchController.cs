using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.HR.DepartmentBranch;
using ParsAlphabet.ERP.Infrastructure.Implantation.HR.DepartmentBranch;

namespace ParseAlphabet.ERP.Web.Modules.HR.DepartmentBranch;

[Route("api/HR/[controller]")]
[ApiController]
[Authorize]
public class DepartmentBranchApiController : Controller
{
    private readonly DepartmentBranchRepository _departmentBranchRepository;

    public DepartmentBranchApiController(DepartmentBranchRepository departmentBranchRepository)
    {
        _departmentBranchRepository = departmentBranchRepository;
    }


    [HttpPost]
    [Route("departmentbranchgetpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<DepartmentBranchGetPage>>> BranchDepartmentGetPage(
        [FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _departmentBranchRepository.BranchDepartmentGetPage(model);
    }

    [HttpPost]
    [Route("branchdepartmentgetpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<DepartmentBranchGetPage>>> DepartmentBranchGetPage(
        [FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _departmentBranchRepository.DepartmentBranchGetPage(model);
    }
}

[Route("HR")]
[Authorize]
public class DepartmentBranchController : Controller
{
    [Route("[Controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult Index()
    {
        return View(Views.HR.DepartmentBranch);
    }
}