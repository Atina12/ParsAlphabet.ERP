using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.WF.StageActionLog;
using ParsAlphabet.ERP.Application.Dtos.WH.WarehouseTransaction;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.WarehouseTransaction;
using Enum = ParsAlphabet.ERP.Application.Enums.Enum;

namespace ParseAlphabet.ERP.Web.Modules.WH.WarehouseTransaction;

[Route("api/WH/[controller]")]
[ApiController]
[Authorize]
public class WarehouseTransactionApiController(WarehouseTransactionRepository warehouseTransactionRepository)
    : ControllerBase
{
    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "ItemRequest")]
    public async Task<MyResultQuery> Insert([FromBody] WarehouseTransactionModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            model.CreateUserId = UserClaims.GetUserId();
            ;
            var roleId = UserClaims.GetRoleId();
            ;
            return await warehouseTransactionRepository.Insert(model, roleId);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("insertTransaction")]
    [Authenticate(Operation.INS, "ItemTransaction")]
    public async Task<MyResultQuery> InsertTransaction([FromBody] WarehouseTransactionModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            model.CreateUserId = UserClaims.GetUserId();
            ;
            var roleId = UserClaims.GetRoleId();
            ;
            return await warehouseTransactionRepository.Insert(model, roleId);
        }

        return ModelState.ToMyResultQuery<int>();
    }


    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "ItemRequest")]
    public async Task<MyResultQuery> Update([FromBody] WarehouseTransactionModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            model.CreateUserId = UserClaims.GetUserId();
            ;
            return await warehouseTransactionRepository.Update(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }


    [HttpPost]
    [Route("updateTransaction")]
    [Authenticate(Operation.UPD, "ItemTransaction")]
    public async Task<MyResultQuery> UpdateTransaction([FromBody] WarehouseTransactionModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            model.CreateUserId = UserClaims.GetUserId();
            ;
            return await warehouseTransactionRepository.Update(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }


    [HttpPost]
    [Route("getrecordbyid")]
    public async Task<MyResultPage<ItemTransactionGetRecord>> GetRecordById([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();

        return await warehouseTransactionRepository.GetRecordById(id, companyId);
    }


    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "ItemRequest")]
    public async Task<MyResultQuery> Delete([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await warehouseTransactionRepository.Delete(id, companyId, roleId);
    }

    [HttpPost]
    [Route("deleteTransaction")]
    [Authenticate(Operation.DEL, "ItemTransaction")]
    public async Task<MyResultQuery> DeleteTransaction([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await warehouseTransactionRepository.Delete(id, companyId, roleId);
    }

    [HttpPost]
    [Route("updatestep")]
    public async Task<MyResultStatus> UpdateStep([FromBody] UpdateAction model)
    {
        model.UserId = UserClaims.GetUserId();
        ;
        model.CompanyId = UserClaims.GetCompanyId();

        return await warehouseTransactionRepository.UpdateStep(model, Enum.OperationType.Update);
    }

    [HttpPost]
    [Route("checkunitcostcalculation_checkLock")]
    public async Task<bool> checkLockFiscalYear([FromBody] CheckLockModel model)
    {
        return await warehouseTransactionRepository.CheckLockFiscalYear(model);
    }


    [HttpPost]
    [Route("getheaderwarehousepostinggroupids")]
    public async Task<List<HeaderWarehouseTransactionPostingGroup>> getHeaderWarehousePostingGroupIds(
        [FromBody] HeaderWarehousePostingGroupModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await warehouseTransactionRepository.GetHeaderWarehouseTransactionPostingGroup(model);
    }


    [HttpPost]
    [Route("validateupdatestep")]
    public async Task<List<string>> ValidateUpdateStep([FromBody] UpdateAction model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await warehouseTransactionRepository.ValidateUpdateStep(model, Enum.OperationType.Update);
    }


    [HttpPost]
    [Route("validatedeletestep")]
    public async Task<List<string>> ValidateDeleteStep([FromBody] ItemTransactionViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await warehouseTransactionRepository.ValidateDeleteStep(model, roleId);
    }

    [HttpPost]
    [Route("getinfo")]
    public async Task<ItemTransactionViewModel> GetItemTransactionInfo([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        return await warehouseTransactionRepository.GetItemTransactionInfo(id, companyId);
    }
}