using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.WH.WarehouseTransactionLine;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.WarehouseTransactionLine;

namespace ParseAlphabet.ERP.Web.Modules.WH.WarehouseTransactionLine;

[Route("api/WH/[controller]")]
[ApiController]
[Authorize]
public class WarehouseTransactionLineApiController(
    WarehouseTransactionLineRepository warehouseTransactionLineRepository)
    : ControllerBase
{
    [HttpPost]
    [Route("getLineSum")]
    public async Task<WarehouseTransactionLineSum> GetItemRequestLineSum([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await warehouseTransactionLineRepository.GetLineSum(model);
    }

    [HttpPost]
    [Route("getrecordbyids")]
    public async Task<MyResultPage<WarehouseTransactionLineGetReccord>> GetRecordById(
        [FromBody] GetWarehouseTransactionLine model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await warehouseTransactionLineRepository.GetRecordById(model);
    }
}