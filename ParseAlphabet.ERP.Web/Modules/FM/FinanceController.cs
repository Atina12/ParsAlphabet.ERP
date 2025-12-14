using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.FM;
using ParsAlphabet.ERP.Application.Interfaces.FM;

namespace ParseAlphabet.ERP.Web.Modules.FM;

[Route("api/[controller]")]
[ApiController]
public class FMApiController : ControllerBase
{
    private readonly IFinanceRepository _FinancesRepository;

    public FMApiController(IFinanceRepository FinancesRepository)
    {
        _FinancesRepository = FinancesRepository;
    }

    [HttpGet]
    [Route("fundtype_getdropdown/{fundType?}")]
    public async Task<IEnumerable<MyDropDownViewModel>> FundType_GetDropDown(string fundType)
    {
        return await _FinancesRepository.FundType_GetDropDown(fundType);
    }

    //[HttpGet]
    //[Route("openaccount_getdropdown/{openacc}")]
    //public async Task<List<MyDropDownViewModel>> OpenAccount_GetDropDown(string openacc)=> await _FinancesRepository.OpenAccount_GetDropDown(openacc);

    [HttpGet]
    [Route("fundtype_adm_getdropdown")]
    public async Task<List<MyDropDownViewModel>> FundType_Adm_GetDropDown()
    {
        var isOpenAcc = bool.Parse(User.FindFirstValue("AdmCashierIsOpenAcc"));

        return await _FinancesRepository.FundType_Adm_GetDropDown(isOpenAcc);
    }

    [HttpGet]
    [Route("incomebalancetype_getdropdown")]
    public async Task<List<MyDropDownViewModel>> IncomeBalanceType_GetDropDown()
    {
        return await _FinancesRepository.IncomeBalanceType_GetDropDown();
    }


    [HttpGet]
    [Route("vatArea_getdropdown")]
    public async Task<List<MyDropDownViewModel>> VatArea_GetDropDown()
    {
        return await _FinancesRepository.VatArea_GetDropDown();
    }

    [HttpGet]
    [Route("costdrivertype_getdropdown")]
    public async Task<List<MyDropDownViewModel>> CostDriverType_GetDropDown()
    {
        return await _FinancesRepository.CostDriverType_GetDropDown();
    }

    [HttpGet]
    [Route("costdriver_getdropdown/{driverTypeId}")]
    public async Task<List<MyDropDownViewModel>> CostDriver_GetDropDown(byte driverTypeId)
    {
        return await _FinancesRepository.CostDriver_GetDropDown(driverTypeId);
    }

    [HttpGet]
    [Route("costcategory_getdropdown")]
    public async Task<List<MyDropDownViewModel>> CostCategory_GetDropDown()
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await _FinancesRepository.CostCategory_GetDropDown(CompanyId);
    }

    [HttpGet]
    [Route("costobject_getdropdown/{driverTypeId}")]
    public async Task<List<MyDropDownViewModel>> CostObject_GetDropDown(byte driverTypeId)
    {
        return await _FinancesRepository.CostObject_GetDropDown(driverTypeId);
    }

    [HttpGet]
    [Route("costentitytype_getdropdown")]
    public async Task<List<MyDropDownViewModel>> CostEntityType_GetDropDown(byte driverTypeId)
    {
        return await _FinancesRepository.CostEntityType_GetDropDown();
    }

    [HttpGet]
    [Route("bankaccountcategory_getdropdown")]
    public async Task<List<MyDropDownViewModel>> BankAccountCategory_GetDropDown()
    {
        return await _FinancesRepository.BankAccountCategory_GetDropDown();
    }

    [HttpGet]
    [Route("costobject_getdropdown")]
    public async Task<List<MyDropDownViewModel>> CostObject_GetDropDown()
    {
        return await _FinancesRepository.CostObject_GetDropDown(0);
    }

    [HttpPost]
    [Route("fundtypeadm_getdropdown")]
    public async Task<List<MyDropDownViewModel>> FundType_GetDropDown([FromBody] GetFundTypeAdm model)
    {
        return await _FinancesRepository.FundTypeAdm_GetDropDown(model);
    }

    [HttpGet]
    [Route("fundtypeactiveadm_getdropdown")]
    public async Task<List<MyDropDownViewModel>> FundTypeActive_GetDropDown()
    {
        return await _FinancesRepository.FundTypeAdmActive_GetDropDown();
    }

    [HttpGet]
    [Route("accountdetail_getdropdown")]
    public async Task<List<MyDropDownViewModel>> AccountDetail_GetDropDown()
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await _FinancesRepository.AccountDetail_GetDropDown(CompanyId);
    }

    [HttpGet]
    [Route("cashflowcategory_getdropdown")]
    public async Task<List<MyDropDownViewModel>> CashFlowCategory_GetDropDown()
    {
        return await _FinancesRepository.CashFlowCategory_GetDropDown();
    }

    [HttpGet]
    [Route("naturetype_getdropdown")]
    public async Task<List<MyDropDownViewModel>> AccountNatureType_GetDropDown()
    {
        return await _FinancesRepository.AccountNatureType_GetDropDown();
    }

    [HttpPost]
    [Route("getfundtypeinputmethod")]
    public async Task<byte> GetFundTypeInputMethod([FromBody] int fundTypeId)
    {
        return await _FinancesRepository.FundTypeInputMethod(fundTypeId);
    }
}