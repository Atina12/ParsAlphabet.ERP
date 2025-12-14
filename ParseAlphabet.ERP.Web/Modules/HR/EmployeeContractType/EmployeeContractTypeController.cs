using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.HR.EmployeeContractType;
using ParsAlphabet.ERP.Infrastructure.Implantation.HR.EmployeeContractType;

namespace ParseAlphabet.ERP.Web.Modules.HR.EmployeeContractType;

[Route("api/HR/[controller]")]
[ApiController]
[Authorize]
public class EmployeeContractTypeApiController : ControllerBase
{
    private readonly EmployeeContractTypeRepository _EmployeeContractTypeRepository;

    public EmployeeContractTypeApiController(EmployeeContractTypeRepository EmployeeContractTypeRepository)
    {
        _EmployeeContractTypeRepository = EmployeeContractTypeRepository;
    }

    #region getrecordbyid

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<EmployeeContractTypeGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        var result = new MyResultPage<EmployeeContractTypeGetRecord>
        {
            Data = await _EmployeeContractTypeRepository.GetRecordById<EmployeeContractTypeGetRecord>(keyvalue, false,
                "hr")
        };
        return result;
    }

    #endregion

    #region getpage

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<EmployeeContractTypeGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _EmployeeContractTypeRepository.GetPage(model);
    }

    #endregion

    #region insert

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] EmployeeContractTypeModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            return await _EmployeeContractTypeRepository.Insert(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    #endregion

    #region update

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] EmployeeContractTypeModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            return await _EmployeeContractTypeRepository.Update(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    #endregion

    #region delete

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int keyvalue)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await _EmployeeContractTypeRepository.Delete(keyvalue, "hr", CompanyId);
    }

    #endregion

    #region getfilteritems

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return _EmployeeContractTypeRepository.GetColumns();
    }

    #endregion

    #region Print

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _EmployeeContractTypeRepository.Csv(model);
    }

    #endregion
}

[Route("HR")]
[Authorize]
public class EmployeeContractTypeController : Controller
{
    [Route("[controller]")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.HR.EmployeeContractType);
    }
}