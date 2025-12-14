using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.FM;
using ParsAlphabet.ERP.Application.Dtos.FM.JournalLine;
using ParsAlphabet.ERP.Application.Dtos.WH.UnitCostCalculation;
using ParsAlphabet.ERP.Application.Dtos.WH.WarehouseTransaction;
using ParsAlphabet.ERP.Application.Interfaces.FM.JournalLine;
using ParsAlphabet.ERP.Application.Interfaces.FM.NewTreasury;
using ParsAlphabet.ERP.Application.Interfaces.FM.NewTreasuryLine;
using ParsAlphabet.ERP.Application.Interfaces.PU.PurchaseInvoice;
using ParsAlphabet.ERP.Application.Interfaces.PU.PurchaseInvoiceLine;
using ParsAlphabet.ERP.Application.Interfaces.PU.PurchaseOrderAction;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.Journal;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.JournalStageAction;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.Stage;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageAction;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.WarehouseTransaction;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.WarehouseTransactionLine;

namespace ParseAlphabet.ERP.Web.Modules.FM.PostingGroup;

[Route("api/FM/FinanceOperation/[controller]")]
[ApiController]
[Authorize]
public class PostGroupSystemApiController : ControllerBase
{
    private readonly IJournalLineRepository _journalLineRepository;
    private readonly JournalRepository _journalRepository;
    private readonly JournalStageActionRepository _journalStageActionRepository;
    private readonly IMapper _mapper;
    private readonly INewTreasuryRepository _newTreasuryRepository;
    private readonly PostingGroupSystemRepository _postingGroupSystemRepository;
    private readonly IPurchaseInvoiceLineRepository _purchaseInvoiceLineRepository;
    private readonly IPurchaseInvoiceRepository _purchaseInvoiceRepository;
    private readonly IPurchaseOrderActionRepository _purchaseOrderActionRepository;
    private readonly StageActionRepository _stageActionRepository;
    private readonly StageRepository _stageRepository;
    private readonly INewTreasuryLineRepository _treasuryLineRepository;
    private readonly WarehouseTransactionLineRepository _warehouseTransactionLineRepository;
    private readonly WarehouseTransactionRepository _warehouseTransactionRepository;

    public PostGroupSystemApiController(
        INewTreasuryRepository newTreasuryRepository,
        INewTreasuryLineRepository treasuryLineRepository,
        IJournalLineRepository journalLineRepository,
        StageRepository stageRepository,
        PostingGroupSystemRepository postingGroupSystemRepository,
        JournalRepository journalRepository,
        IMapper mapper,
        JournalStageActionRepository journalStageActionRepository,
        StageActionRepository stageActionRepository,
        IPurchaseInvoiceRepository purchaseInvoiceRepository,
        IPurchaseOrderActionRepository purchaseOrderActionRepository,
        IPurchaseInvoiceLineRepository purchaseInvoiceLineRepository,
        WarehouseTransactionLineRepository warehouseTransactionLineRepository,
        WarehouseTransactionRepository warehouseTransactionRepository
    )
    {
        _newTreasuryRepository = newTreasuryRepository;
        _postingGroupSystemRepository = postingGroupSystemRepository;
        _journalRepository = journalRepository;
        _stageRepository = stageRepository;
        _treasuryLineRepository = treasuryLineRepository;
        _journalLineRepository = journalLineRepository;
        _mapper = mapper;
        _journalStageActionRepository = journalStageActionRepository;
        _stageActionRepository = stageActionRepository;
        _purchaseInvoiceRepository = purchaseInvoiceRepository;
        _purchaseOrderActionRepository = purchaseOrderActionRepository;
        _purchaseInvoiceLineRepository = purchaseInvoiceLineRepository;
        _warehouseTransactionLineRepository = warehouseTransactionLineRepository;
        _warehouseTransactionRepository = warehouseTransactionRepository;
    }

    [HttpPost]
    [Route("treasurypost")]
    public async Task<FinanceOperationResult> TreasurySend([FromBody] List<ID> ids)
    {
        var companyId = UserClaims.GetCompanyId();
        var userId = UserClaims.GetUserId();
        ;
        var roleId = UserClaims.GetRoleId();
        ;

        var resultValidation = await _postingGroupSystemRepository.ValidatePostingGroupTreasury(ids, companyId);

        if (resultValidation.Count() > 0)
        {
            var resultPost = new FinanceOperationResult
            {
                Results = new List<JournalPostGroupResultStatus>
                {
                    new() { Status = -90, Successfull = false, ValidationErrors = resultValidation }
                }
            };

            return resultPost;
        }

        var list = await _newTreasuryRepository.GetHeaderTreasuryPostingGroup(ids, companyId);
        var financeOperation = new SendJournalPostingGroup(
            _newTreasuryRepository,
            _treasuryLineRepository,
            _purchaseOrderActionRepository,
            _purchaseInvoiceLineRepository,
            _warehouseTransactionLineRepository,
            _warehouseTransactionRepository,
            _journalRepository,
            _journalLineRepository,
            _journalStageActionRepository,
            _stageActionRepository,
            _stageRepository,
            _mapper);

        var postTreasury = await financeOperation.TreasurySend(list, userId, roleId);
        return postTreasury;
    }

    [HttpPost]
    [Route("purchasepost")]
    public async Task<FinanceOperationResult> PurchaseSend([FromBody] List<ID> ids)
    {
        var companyId = UserClaims.GetCompanyId();
        var userId = UserClaims.GetUserId();
        ;
        var roleId = UserClaims.GetRoleId();
        ;

        var resultValidation = await _postingGroupSystemRepository.ValidatePostingGroupPurchase(ids, companyId);
        if (resultValidation.Count() > 0)
        {
            var resultPost = new FinanceOperationResult
            {
                Results = new List<JournalPostGroupResultStatus>
                {
                    new() { Status = -90, Successfull = false, ValidationErrors = resultValidation }
                }
            };

            return resultPost;
        }

        var list = await _purchaseInvoiceRepository.GetHeaderPurchasePostingGroup(ids, companyId);
        var financeOperation = new SendJournalPostingGroup(
            _newTreasuryRepository,
            _treasuryLineRepository,
            _purchaseOrderActionRepository,
            _purchaseInvoiceLineRepository,
            _warehouseTransactionLineRepository,
            _warehouseTransactionRepository,
            _journalRepository,
            _journalLineRepository,
            _journalStageActionRepository,
            _stageActionRepository,
            _stageRepository,
            _mapper);

        var postTreasury = await financeOperation.PurchaseSend(list, userId, roleId);
        return postTreasury;
    }


    [HttpPost]
    [Route("warehouseTransactionpost")]
    public async Task<FinanceOperationResult> WarehouseSend([FromBody] HeaderUnitCostCalculationPostingGroupModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var userId = UserClaims.GetUserId();
        ;

        var roleId = UserClaims.GetRoleId();
        ;

        var resultValidation = await _postingGroupSystemRepository.ValidatePostingGroupWarehouse(model);
        if (resultValidation.Count() > 0)
        {
            var resultPost = new FinanceOperationResult
            {
                Results = new List<JournalPostGroupResultStatus>
                {
                    new() { Status = -90, Successfull = false, ValidationErrors = resultValidation }
                }
            };

            return resultPost;
        }

        var headerWarehousePostingGroupModel = new HeaderWarehousePostingGroupModel
        {
            CompanyId = model.CompanyId,
            FromDatePersian = model.FromDatePersian,
            ToDatePersian = model.ToDatePersian
        };

        var list =
            await _warehouseTransactionRepository.GetHeaderWarehouseTransactionPostingGroup(
                headerWarehousePostingGroupModel);

        var financeOperation = new SendJournalPostingGroup(
            _newTreasuryRepository,
            _treasuryLineRepository,
            _purchaseOrderActionRepository,
            _purchaseInvoiceLineRepository,
            _warehouseTransactionLineRepository,
            _warehouseTransactionRepository,
            _journalRepository,
            _journalLineRepository,
            _journalStageActionRepository,
            _stageActionRepository,
            _stageRepository,
            _mapper);

        var postTreasury = await financeOperation.WarehouseSend(list, userId, roleId, model.ToDate);
        return postTreasury;
    }
}