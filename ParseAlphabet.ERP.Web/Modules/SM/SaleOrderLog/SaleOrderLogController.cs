using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.SM.SaleOrderLog;
using ParsAlphabet.ERP.Application.Interfaces.SM.SaleOrderLog;

namespace ParseAlphabet.ERP.Web.Modules.SM.SaleOrderLog;

[Route("api/SM/[controller]")]
[ApiController]
[Authorize]
public class SaleOrderStepApiController(ISaleOrderLogRepository saleOrderStepRepository) : ControllerBase
{
    [HttpPost]
    [Route("getsaleordersteplist")]
    public async Task<MyResultDataQuery<List<SaleOrderStepLogList>>> GetSaleOrderStepList([FromBody] int saleOrderId)
    {
        var companyId = UserClaims.GetCompanyId();
        return await saleOrderStepRepository.GetSaleOrderStepList(saleOrderId, companyId);
    }
}