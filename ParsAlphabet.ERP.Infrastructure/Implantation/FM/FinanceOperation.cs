using ParsAlphabet.ERP.Application.Dtos.FM;
using ParsAlphabet.ERP.Application.Dtos.FM.Journal;
using ParsAlphabet.ERP.Application.Dtos.FM.JournalLine;
using ParsAlphabet.ERP.Application.Dtos.FM.JournalStageAction;
using ParsAlphabet.ERP.Application.Dtos.FM.NewTreasury;
using ParsAlphabet.ERP.Application.Dtos.PU.PurchaseInvoice;
using ParsAlphabet.ERP.Application.Dtos.WH.WarehouseTransaction;
using ParsAlphabet.ERP.Application.Interfaces.FM.JournalLine;
using ParsAlphabet.ERP.Application.Interfaces.FM.NewTreasury;
using ParsAlphabet.ERP.Application.Interfaces.FM.NewTreasuryLine;
using ParsAlphabet.ERP.Application.Interfaces.PU.PurchaseInvoiceLine;
using ParsAlphabet.ERP.Application.Interfaces.PU.PurchaseOrderAction;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.Journal;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.JournalStageAction;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.Stage;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageAction;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.WarehouseTransaction;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.WarehouseTransactionLine;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.FM;

public class SendJournalPostingGroup
{
    private readonly IJournalLineRepository _journalLineRepository;
    private readonly JournalRepository _journalRepository;
    private readonly JournalStageActionRepository _journalStageActionRepository;
    private readonly IMapper _mapper;

    private readonly INewTreasuryRepository _newTreasuryRepository;
    private readonly IPurchaseInvoiceLineRepository _purchaseInvoiceLineRepository;
    private readonly IPurchaseOrderActionRepository _purchaseOrderActionRepository;
    private readonly StageActionRepository _stageActionRepository;
    private readonly StageRepository _stageRepository;
    private readonly INewTreasuryLineRepository _treasuryLineRepository;
    private readonly WarehouseTransactionLineRepository _warehouseTransactionLineRepository;
    private readonly WarehouseTransactionRepository _warehouseTransactionRepository;

    public SendJournalPostingGroup(
        INewTreasuryRepository newTreasuryRepository,
        INewTreasuryLineRepository treasuryLineRepository,
        IPurchaseOrderActionRepository purchaseOrderActionRepository,
        IPurchaseInvoiceLineRepository purchaseInvoiceLineRepository,
        WarehouseTransactionLineRepository warehouseTransactionLineRepository,
        WarehouseTransactionRepository warehouseTransactionRepository,
        JournalRepository journalRepository,
        IJournalLineRepository journalLineRepository,
        JournalStageActionRepository journalStageActionRepository,
        StageActionRepository stageActionRepository,
        StageRepository stageRepository,
        IMapper mapper)
    {
        _newTreasuryRepository = newTreasuryRepository;
        _treasuryLineRepository = treasuryLineRepository;
        _purchaseOrderActionRepository = purchaseOrderActionRepository;
        _purchaseInvoiceLineRepository = purchaseInvoiceLineRepository;
        _warehouseTransactionLineRepository = warehouseTransactionLineRepository;
        _warehouseTransactionRepository = warehouseTransactionRepository;
        _journalRepository = journalRepository;
        _journalLineRepository = journalLineRepository;
        _journalStageActionRepository = journalStageActionRepository;
        _stageActionRepository = stageActionRepository;
        _stageRepository = stageRepository;
        _mapper = mapper;
    }


    public async Task<FinanceOperationResult> TreasurySend(List<HeaderTreasuryPostingGroup> list, int userId,
        byte roleId)
    {
        var resultOperation = new FinanceOperationResult
        {
            Results = new List<JournalPostGroupResultStatus>()
        };
        if (!list.ListHasRow())
        {
            resultOperation.Results.Add(new JournalPostGroupResultStatus
                { Successfull = false, Status = -92, StatusMessage = "برگه ای برای ثبت سند وجود ندارد" });
            return resultOperation;
        }

        var companyId = list[0].CompanyId;
        // لیست برگه هایی که اعتبارسنجی سال مالی رو دارند
        var IsFiscalList = list.Where(f => f.IsFiscal == 100).ToList();

        if (!IsFiscalList.ListHasRow())
        {
            resultOperation.Results.Add(new JournalPostGroupResultStatus
                { Successfull = false, Status = -91, StatusMessage = "تمامی سطرهای انتخابی سال مالی بسته است" });
            return resultOperation;
        }

        // ایجاد لیست به تفکیک تاریخ - نوع سند - شعبه- مرحله - کمپانی برای ایجاد نوع سند
        var acceptedForPost = IsFiscalList.GroupBy(
            t => new
            {
                t.TransactionDate,
                t.DocumentTypeId,
                t.BranchId,
                t.StageId,
                t.WorkflowId,
                t.CompanyId
            }).Select(tr => new HeaderTreasuryPostingGroup
        {
            TransactionDate = tr.Key.TransactionDate,
            DocumentTypeId = tr.Key.DocumentTypeId,
            BranchId = tr.Key.BranchId,
            StageId = tr.Key.StageId,
            WorkflowId = tr.Key.WorkflowId,
            CompanyId = tr.Key.CompanyId
        }).ToList();

        //Tupe item1:treasuryId , item2:StageId
        var treasuryIdPosted = new List<TreasuryPostedGroup>();
        var len = acceptedForPost.Count;
        var journaListForFinanacial = new List<ID>();
        for (var t = 0; t < len; t++)
        {
            var doc = acceptedForPost[t];

            var filter = $@"DocumentTypeId={doc.DocumentTypeId} AND 
                                CAST(DocumentDate AS DATE)=CAST('{doc.TransactionDate}' AS DATE) AND 
                                BranchId={doc.BranchId} AND 
                                CompanyId={doc.CompanyId} AND 
                                BySystem=1";

            var journalId = await _journalRepository.GetJournalIdByFilter(filter);

            // اگر سند با نوع سند و تاریخ برگه و شعبه و کمپانی و BySystem وجود نداشت - ایجاد می شود
            if (journalId == 0)
            {
                var getStepModel = new GetJournalStageStepByPriority
                {
                    StageId = 56,
                    WorkFlowId = 178,
                    CompanyId = companyId,
                    Starter = false,
                    ActionId = 0
                };
                var filterStageStep = " AND IsLastConfirmHeader =1";
                var stepId = await _journalStageActionRepository.GetStageStepStartEnd(getStepModel, filterStageStep);
                var journal = new JournalModel();
                journal.Id = 0;
                journal.BranchId = doc.BranchId;
                journal.StageId = 56;
                journal.DocumentTypeId = doc.DocumentTypeId;
                journal.DocumentDate = doc.TransactionDate;
                journal.CreateUserId = userId;
                journal.Status = stepId;
                journal.BySystem = true;
                journal.CompanyId = doc.CompanyId;


                var journalResult = new MyResultStatus();

                journalResult = await _journalRepository.Insert(journal, roleId);
                // -101  -102
                if (!journalResult.Successfull)
                {
                    resultOperation.Results.Add(new JournalPostGroupResultStatus
                    {
                        Successfull = journalResult.Successfull, Status = journalResult.Status,
                        StatusMessage = journalResult.StatusMessage
                    });
                    return resultOperation;
                }

                journalId = journalResult.Id;
            }
            else
            {
                var updateUserJournal = new UpdateUserJournal
                {
                    UserId = userId,
                    JournalId = journalId,
                    CreateDateTime = DateTime.Now
                };

                await _journalRepository.UpdateJournalUser(updateUserJournal);
            }

            journaListForFinanacial.Add(new ID { Id = journalId });

            var treasuryIds = IsFiscalList.Where(d => d.TransactionDate == doc.TransactionDate &&
                                                      d.DocumentTypeId == doc.DocumentTypeId &&
                                                      d.BranchId == doc.BranchId &&
                                                      d.CompanyId == doc.CompanyId).Select(e => new ID { Id = e.Id })
                .ToList();

            var getActionModelTreasury = new GetStageAction
            {
                StageId = doc.StageId,
                CompanyId = companyId,
                WorkflowId = doc.WorkflowId,
                Priority = 1,
                ActionId = 0
            };

            var stageStepTreasury = await _stageActionRepository.GetStageActionWithParam(getActionModelTreasury);
            var typeId = 0;
            var treasuryStage = await _stageRepository.GetStageById(doc.StageId);

            if (
                stageStepTreasury.Any(ss =>
                    ss.PreviousStageActionId == null && !ss.IsRequest &&
                    (treasuryStage.InOut == 1 || treasuryStage.InOut == 2) && treasuryStage.StageClassId != 1) ||
                (stageStepTreasury.Any(ss =>
                    ss.PreviousStageActionId != null && ss.IsRequest &&
                    (treasuryStage.InOut == 1 || treasuryStage.InOut == 2)) && treasuryStage.StageClassId != 1)
            )
                typeId = 1;
            // New Type
            else if (stageStepTreasury.Any(ss =>
                         ss.PreviousStageActionId != null && !ss.IsRequest &&
                         (treasuryStage.InOut == 1 || treasuryStage.InOut == 2)))
                typeId = 2;

            else
                //if (stageStepTreasury.Any(ss => treasuryStage.InOut == 3) && treasuryStage.StageClassId != 1)
                typeId = 3;

            // add sum treasuryLine Group by Currency-Exchange-FundType For Add To JournalLine >>PART1<<
            var treasuryLine =
                await _treasuryLineRepository.GetTreasuryLineListForPost(treasuryIds, doc.CompanyId, typeId);

            if (!treasuryLine.ListHasRow())
            {
                var output =
                    $"سطری با مشخصات زیر وجود ندارد تاریخ : {doc.TransactionDatePersian} - نوع سند : {doc.DocumentTypeName} - کد شعبه : {doc.BranchId}";
                resultOperation.Results.Add(new JournalPostGroupResultStatus
                    { Successfull = false, Status = -90, StatusMessage = "سطری برای ثبت سند وجود ندارد" });
            }

            var lineCount = treasuryLine.Count;
            var postGrouping = new List<DocumentPostGroup>();

            for (var r = 0; r < lineCount; r++)
            {
                var currentLine = treasuryLine[r];
                var journalLine = new JournalLinePostingGroup
                {
                    Id = 0,
                    HeaderId = journalId,
                    RowNumber = r + 1,
                    AccountGLId = currentLine.AccountGLId,
                    AccountSGLId = currentLine.AccountSGLId,
                    NoSeriesId = currentLine.NoseriesId,
                    AccountDetailId = currentLine.AccountDetailId,
                    Description = currentLine.Description,
                    Amount = currentLine.Amount,
                    ExchangeRate = currentLine.ExchangeRate,
                    NatureTypeId = currentLine.AccountNatureTypeId,
                    CreateUserId = userId,
                    CurrencyId = currentLine.CurrencyId,
                    IdentityId = currentLine.TreasuryId,
                    StageId = currentLine.StageId,
                    IdentityType = IdentityTypePostingGroup.Treasury
                };

                var document = new DocumentPostGroup
                {
                    Doc = journalLine
                };

                postGrouping.Add(document);
            }

            var addDocuments = new AddDocumentPostingGroup
            {
                Journals = postGrouping,
                CompanyId = companyId,
                UserId = userId
            };

            var listPostInserted = new List<JournalPostGroupResultStatus>();

            listPostInserted = await _journalLineRepository.PostGroupJournal(addDocuments);


            foreach (var jl in listPostInserted)
            {
                var newJL = _mapper.Map<JournalPostGroupResultStatus>(jl);

                if (newJL.Successfull)
                    treasuryIdPosted.Add(new TreasuryPostedGroup
                        { TreasuryId = newJL.IdentityId, StageId = newJL.StageId, WorkflowId = doc.WorkflowId });

                resultOperation.Results.Add(newJL);
            }
        }

        resultOperation.Successfull = resultOperation.Results.Any(r => r.Successfull);

        var treasuryPosted = (from x in treasuryIdPosted
            group x by new
            {
                x.TreasuryId,
                x.StageId,
                x.WorkflowId
            }
            into gx
            select new TreasuryPostedGroup
            {
                TreasuryId = gx.Key.TreasuryId,
                StageId = gx.Key.StageId,
                WorkflowId = gx.Key.WorkflowId
            }).ToList();

        foreach (var item in treasuryPosted)
        {
            var modelUpdate = new UpdateAction
            {
                CompanyId = companyId,
                IdentityId = item.TreasuryId,
                RequestActionId = 4,
                StageId = item.StageId,
                WorkflowCategoryId = 6,
                UserId = userId,
                WorkflowId = item.WorkflowId
            };
            await _newTreasuryRepository.UpdateTreasuryStep(modelUpdate, OperationType.Update);
        }

        var countJournalForFinancial = journaListForFinanacial.Count();

        for (var i = 0; i < countJournalForFinancial; i++)
        {
            var currentJournalForFinanacial = journaListForFinanacial[i];
            var stepId = await _journalStageActionRepository.GetActionIsLastConfirmHeader(56, 178, companyId);

            var journalUpdateFinancial = new UpdateFinanacialStep
            {
                CompanyId = companyId,
                IdentityId = currentJournalForFinanacial.Id,
                RequestStepId = stepId,
                UserId = userId
            };

            await _journalRepository.InsertFinanacialStep(journalUpdateFinancial);
        }

        return resultOperation;
    }

    public async Task<FinanceOperationResult> PurchaseSend(List<HeaderPurchasePostingGroup> list, int userId,
        byte roleId)
    {
        var resultOperation = new FinanceOperationResult
        {
            Results = new List<JournalPostGroupResultStatus>()
        };

        if (!list.ListHasRow())
        {
            resultOperation.Results.Add(new JournalPostGroupResultStatus
                { Successfull = false, Status = -92, StatusMessage = "برگه ای برای ثبت سند وجود ندارد" });
            return resultOperation;
        }

        var companyId = list[0].CompanyId;
        var WorkflowId = list[0].WorkflowId;

        // لیست برگه هایی که اعتبارسنجی سال مالی رو دارند
        var IsFiscalList = list.Where(f => f.IsFiscal == 100).ToList();

        if (!IsFiscalList.ListHasRow())
        {
            resultOperation.Results.Add(new JournalPostGroupResultStatus
                { Successfull = false, Status = -91, StatusMessage = "تمامی سطرهای انتخابی سال مالی بسته است" });
            return resultOperation;
        }

        // ایجاد لیست به تفکیک تاریخ - نوع سند - شعبه- مرحله - کمپانی برای ایجاد نوع سند
        var acceptedForPost = IsFiscalList.GroupBy(
            t => new
            {
                t.DocumentDate,
                t.DocumentTypeId,
                t.BranchId,
                t.StageId,
                t.WorkflowId,
                t.CompanyId
            }).Select(tr => new HeaderPurchasePostingGroup
        {
            DocumentDate = tr.Key.DocumentDate,
            DocumentTypeId = tr.Key.DocumentTypeId,
            BranchId = tr.Key.BranchId,
            StageId = tr.Key.StageId,
            WorkflowId = tr.Key.WorkflowId,
            CompanyId = tr.Key.CompanyId
        }).ToList();

        //Tupe item1:PurchaseOrderId , item2:StageId
        var purchaseIdPosted = new List<PurchaseOrderPostedGroup>();
        var len = acceptedForPost.Count;
        var journaListForFinanacial = new List<ID>();
        for (var t = 0; t < len; t++)
        {
            var doc = acceptedForPost[t];

            var filter = $@"DocumentTypeId={doc.DocumentTypeId} AND 
                                CAST(DocumentDate AS DATE)=CAST('{doc.DocumentDate}' AS DATE) AND 
                                BranchId={doc.BranchId} AND 
                                CompanyId={doc.CompanyId} AND 
                                BySystem=1";

            var journalId = await _journalRepository.GetJournalIdByFilter(filter);

            // اگر سند با نوع سند و تاریخ برگه و شعبه و کمپانی و BySystem وجود نداشت - ایجاد می شود
            if (journalId == 0)
            {
                var getStepModel = new GetJournalStageStepByPriority
                {
                    StageId = 56,
                    WorkFlowId = 178,
                    CompanyId = companyId,
                    Starter = false,
                    ActionId = 0
                };
                var filterStageStep = " AND IsLastConfirmHeader =1";
                var stepId = await _journalStageActionRepository.GetStageStepStartEnd(getStepModel, filterStageStep);
                var journal = new JournalModel();
                journal.Id = 0;
                journal.BranchId = doc.BranchId;
                journal.StageId = 56;
                journal.DocumentTypeId = doc.DocumentTypeId;
                journal.DocumentDate = doc.DocumentDate;
                journal.CreateUserId = userId;
                journal.Status = stepId;
                journal.BySystem = true;
                journal.CompanyId = doc.CompanyId;


                var journalResult = new MyResultStatus();

                journalResult = await _journalRepository.Insert(journal, roleId);
                // -101  -102
                if (!journalResult.Successfull)
                {
                    resultOperation.Results.Add(new JournalPostGroupResultStatus
                    {
                        Successfull = journalResult.Successfull, Status = journalResult.Status,
                        StatusMessage = journalResult.StatusMessage
                    });
                    return resultOperation;
                }

                journalId = journalResult.Id;
            }
            else
            {
                var updateUserJournal = new UpdateUserJournal
                {
                    UserId = userId,
                    JournalId = journalId,
                    CreateDateTime = DateTime.Now
                };

                await _journalRepository.UpdateJournalUser(updateUserJournal);
            }

            journaListForFinanacial.Add(new ID { Id = journalId });

            var purchaseOrderIds = IsFiscalList.Where(d => d.DocumentDate == doc.DocumentDate &&
                                                           d.DocumentTypeId == doc.DocumentTypeId &&
                                                           d.BranchId == doc.BranchId &&
                                                           d.CompanyId == doc.CompanyId)
                .Select(e => new ID { Id = e.Id }).ToList();

            var getActionModelTreasury = new GetStageAction
            {
                StageId = doc.StageId,
                CompanyId = companyId,
                WorkflowId = doc.WorkflowId,
                Priority = 1,
                ActionId = 0
            };


            // add sum treasuryLine Group by Currency-Exchange-FundType For Add To JournalLine >>PART1<<
            var purchaseOrderLine =
                await _purchaseInvoiceLineRepository.GetPurchaseLineListForPost(purchaseOrderIds, doc.CompanyId);

            if (!purchaseOrderLine.ListHasRow())
            {
                var output =
                    $"سطری با مشخصات زیر وجود ندارد تاریخ : {doc.DocumentDatePersian} - نوع سند : {doc.DocumentTypeName} - کد شعبه : {doc.BranchId}";
                resultOperation.Results.Add(new JournalPostGroupResultStatus
                    { Successfull = false, Status = -90, StatusMessage = "سطری برای ثبت سند وجود ندارد" });
            }

            var lineCount = purchaseOrderLine.Count;
            var postGrouping = new List<DocumentPostGroup>();

            for (var r = 0; r < lineCount; r++)
            {
                var currentLine = purchaseOrderLine[r];
                var journalLine = new JournalLinePostingGroup
                {
                    Id = 0,
                    HeaderId = journalId,
                    RowNumber = r + 1,
                    AccountGLId = currentLine.AccountGLId,
                    AccountSGLId = currentLine.AccountSGLId,
                    NoSeriesId = currentLine.NoseriesId,
                    AccountDetailId = currentLine.AccountDetailId,
                    Description = currentLine.Description,
                    Amount = currentLine.Amount,
                    ExchangeRate = currentLine.ExchangeRate,
                    NatureTypeId = currentLine.AccountNatureTypeId,
                    CreateUserId = userId,
                    CurrencyId = currentLine.CurrencyId,
                    IdentityId = currentLine.HeaderId,
                    StageId = currentLine.StageId,
                    IdentityType = IdentityTypePostingGroup.Purchase
                };

                var document = new DocumentPostGroup
                {
                    Doc = journalLine
                };

                postGrouping.Add(document);
            }

            var addDocuments = new AddDocumentPostingGroup
            {
                Journals = postGrouping,
                CompanyId = companyId,
                UserId = userId
            };

            var listPostInserted = new List<JournalPostGroupResultStatus>();

            listPostInserted = await _journalLineRepository.PostGroupJournal(addDocuments);


            foreach (var jl in listPostInserted)
            {
                var newJL = _mapper.Map<JournalPostGroupResultStatus>(jl);

                if (newJL.Successfull)
                    purchaseIdPosted.Add(new PurchaseOrderPostedGroup
                        { PurchaseOrderId = newJL.IdentityId, StageId = newJL.StageId });

                resultOperation.Results.Add(newJL);
            }
        }

        resultOperation.Successfull = resultOperation.Results.Any(r => r.Successfull);

        var purchaseOrderPosted = (from x in purchaseIdPosted
            group x by new
            {
                x.PurchaseOrderId,
                x.StageId
            }
            into gx
            select new PurchaseOrderPostedGroup
            {
                PurchaseOrderId = gx.Key.PurchaseOrderId,
                StageId = gx.Key.StageId
            }).ToList();

        foreach (var item in purchaseIdPosted)
        {
            var modelUpdate = new UpdateAction
            {
                CompanyId = companyId,
                IdentityId = item.PurchaseOrderId,
                RequestActionId = 4,
                StageId = item.StageId,
                WorkflowId = WorkflowId,
                WorkflowCategoryId = 1,
                UserId = userId
            };
            await _purchaseOrderActionRepository.UpdatePurchaseOrderStep(modelUpdate, OperationType.Update);
        }

        var countJournalForFinancial = journaListForFinanacial.Count();

        for (var i = 0; i < countJournalForFinancial; i++)
        {
            var currentJournalForFinanacial = journaListForFinanacial[i];
            var stepId = await _journalStageActionRepository.GetActionIsLastConfirmHeader(56, 178, companyId);

            var journalUpdateFinancial = new UpdateFinanacialStep
            {
                CompanyId = companyId,
                IdentityId = currentJournalForFinanacial.Id,
                RequestStepId = stepId,
                UserId = userId
            };

            await _journalRepository.InsertFinanacialStep(journalUpdateFinancial);
        }

        return resultOperation;
    }


    public async Task<FinanceOperationResult> WarehouseSend(List<HeaderWarehouseTransactionPostingGroup> list,
        int userId, byte roleId, DateTime? toDocumentDate)
    {
        var resultOperation = new FinanceOperationResult
        {
            Results = new List<JournalPostGroupResultStatus>()
        };

        if (!list.ListHasRow())
        {
            resultOperation.Results.Add(new JournalPostGroupResultStatus
                { Successfull = false, Status = -92, StatusMessage = "برگه ای برای ثبت سند وجود ندارد" });
            return resultOperation;
        }

        var companyId = list[0].CompanyId;

        // لیست برگه هایی که اعتبارسنجی سال مالی رو دارند
        var IsFiscalList = list.Where(f => f.IsFiscal == 100).ToList();

        if (!IsFiscalList.ListHasRow())
        {
            resultOperation.Results.Add(new JournalPostGroupResultStatus
            {
                Successfull = false,
                Status = -91,
                StatusMessage = "تمامی سطرهای انتخابی سال مالی بسته است"
            });
            return resultOperation;
        }

        // ایجاد لیست به تفکیک تاریخ - نوع سند - شعبه- مرحله - کمپانی برای ایجاد نوع سند
        var acceptedForPost = IsFiscalList.GroupBy(
            t => new
            {
                t.DocumentDate,
                t.DocumentTypeId,
                t.BranchId,
                t.StageId,
                t.WorkflowId,
                t.WorkflowCategoryId,
                t.CompanyId
            }).Select(tr => new HeaderWarehouseTransactionPostingGroup
        {
            DocumentDate = tr.Key.DocumentDate,
            DocumentTypeId = tr.Key.DocumentTypeId,
            BranchId = tr.Key.BranchId,
            StageId = tr.Key.StageId,
            WorkflowId = tr.Key.WorkflowId,
            WorkflowCategoryId = tr.Key.WorkflowCategoryId,
            CompanyId = tr.Key.CompanyId
        }).ToList();

        //Tupe item1:ItemTransactionId , item2:StageId
        var warehouseIdPosted = new List<WarehousePostedGroup>();

        var workflowCategoryId = acceptedForPost.Select(x => x.WorkflowCategoryId).Distinct().ToList();
        var workflowCategoryIdLen = workflowCategoryId.Count();
        var journaListForFinanacial = new List<ID>();

        for (var c = 0; c < workflowCategoryIdLen; c++)
        {
            var currentWorkflowCategoryId = workflowCategoryId[c];

            var acceptedForPostByWorkflowCategory =
                acceptedForPost.Where(a => a.WorkflowCategoryId == currentWorkflowCategoryId).ToList();
            var len = acceptedForPostByWorkflowCategory.Count;

            for (var t = 0; t < len; t++)
            {
                var doc = acceptedForPostByWorkflowCategory[t];

                var filter = $@"DocumentTypeId={doc.DocumentTypeId} AND 
                                CAST(DocumentDate AS DATE)=CAST('{toDocumentDate}' AS DATE) AND 
                                BranchId={doc.BranchId} AND 
                                CompanyId={doc.CompanyId} AND 
                                BySystem=1";

                var journalId = await _journalRepository.GetJournalIdByFilter(filter);

                // اگر سند با نوع سند و تاریخ برگه و شعبه و کمپانی و BySystem وجود نداشت - ایجاد می شود
                if (journalId == 0)
                {
                    var getStepModel = new GetJournalStageStepByPriority
                    {
                        StageId = 56,
                        WorkFlowId = 178,
                        CompanyId = companyId,
                        Starter = false,
                        ActionId = 0
                    };
                    var filterStageStep = " AND IsLastConfirmHeader =1";
                    var actionId =
                        await _journalStageActionRepository.GetStageStepStartEnd(getStepModel, filterStageStep);
                    var journal = new JournalModel();
                    journal.Id = 0;
                    journal.BranchId = doc.BranchId;
                    journal.StageId = 56;
                    journal.DocumentTypeId = doc.DocumentTypeId;
                    journal.DocumentDate = toDocumentDate.Value;
                    journal.CreateUserId = userId;
                    journal.Status = actionId;
                    journal.BySystem = true;
                    journal.WorkflowId = getStepModel.WorkFlowId;
                    journal.CompanyId = doc.CompanyId;


                    var journalResult = new MyResultStatus();

                    journalResult = await _journalRepository.Insert(journal, roleId);
                    // -101  -102
                    if (!journalResult.Successfull)
                    {
                        resultOperation.Results.Add(new JournalPostGroupResultStatus
                        {
                            Successfull = journalResult.Successfull, Status = journalResult.Status,
                            StatusMessage = journalResult.StatusMessage
                        });
                        return resultOperation;
                    }

                    journalId = journalResult.Id;
                }
                else
                {
                    var updateUserJournal = new UpdateUserJournal
                    {
                        UserId = userId,
                        JournalId = journalId,
                        CreateDateTime = DateTime.Now
                    };

                    await _journalRepository.UpdateJournalUser(updateUserJournal);
                }

                journaListForFinanacial.Add(new ID { Id = journalId });

                var warehouseIds = IsFiscalList.Where(d => d.DocumentDate == doc.DocumentDate &&
                                                           d.DocumentTypeId == doc.DocumentTypeId &&
                                                           d.BranchId == doc.BranchId &&
                                                           d.CompanyId == doc.CompanyId)
                    .Select(e => new ID { Id = e.Id }).ToList();


                // add sum warehouseLine Group by Currency-Exchange-FundType For Add To JournalLine >>PART1<<
                var warehouseLine =
                    await _warehouseTransactionLineRepository.GetWarehouseTransactionLineListForPost(warehouseIds,
                        doc.WorkflowCategoryId, doc.CompanyId);

                if (!warehouseLine.ListHasRow())
                {
                    var output =
                        $"سطری با مشخصات زیر وجود ندارد تاریخ : {doc.DocumentDatePersian} - نوع سند : {doc.DocumentTypeName} - کد شعبه : {doc.BranchId}";
                    resultOperation.Results.Add(new JournalPostGroupResultStatus
                        { Successfull = false, Status = -90, StatusMessage = "سطری برای ثبت سند وجود ندارد" });
                }

                var lineCount = warehouseLine.Count;
                var postGrouping = new List<DocumentPostGroup>();

                for (var r = 0; r < lineCount; r++)
                {
                    var currentLine = warehouseLine[r];
                    var journalLine = new JournalLinePostingGroup
                    {
                        Id = 0,
                        HeaderId = journalId,
                        RowNumber = r + 1,
                        AccountGLId = currentLine.AccountGLId,
                        AccountSGLId = currentLine.AccountSGLId,
                        NoSeriesId = currentLine.NoseriesId,
                        AccountDetailId = currentLine.AccountDetailId,
                        Description = currentLine.Description,
                        Amount = currentLine.Amount,
                        ExchangeRate = currentLine.ExchangeRate,
                        NatureTypeId = currentLine.AccountNatureTypeId,
                        CreateUserId = userId,
                        CurrencyId = currentLine.CurrencyId,
                        IdentityId = currentLine.HeaderId,
                        DocumentDate = doc.DocumentDate,
                        StageId = currentLine.StageId,
                        IdentityType = IdentityTypePostingGroup.Purchase
                    };

                    var document = new DocumentPostGroup
                    {
                        Doc = journalLine
                    };

                    postGrouping.Add(document);
                }

                var addDocuments = new AddDocumentPostingGroup
                {
                    Journals = postGrouping,
                    CompanyId = companyId,
                    UserId = userId
                };

                var listPostInserted = new List<JournalPostGroupResultStatus>();

                listPostInserted = await _journalLineRepository.PostGroupJournal(addDocuments);


                foreach (var jl in listPostInserted)
                {
                    var newJL = _mapper.Map<JournalPostGroupResultStatus>(jl);

                    if (newJL.Successfull)
                        if (!warehouseIdPosted.Any(x => x.ItemTransactionId == newJL.IdentityId))
                        {
                            warehouseIdPosted.Add(new WarehousePostedGroup
                            {
                                ItemTransactionId = newJL.IdentityId, StageId = newJL.StageId,
                                WorkflowId = doc.WorkflowId, DocumentDate = doc.DocumentDate
                            });
                            resultOperation.Results.Add(newJL);
                        }
                }
            }
        }

        resultOperation.Successfull = resultOperation.Results.Any(r => r.Successfull);

        foreach (var item in warehouseIdPosted)
        {
            var modelUpdate = new UpdateAction
            {
                CompanyId = companyId,
                IdentityId = item.ItemTransactionId,
                RequestActionId = 4,
                StageId = item.StageId,
                WorkflowId = item.WorkflowId,
                DocumentDate = item.DocumentDate,
                WorkflowCategoryId = 11,
                UserId = userId
            };
            await _warehouseTransactionRepository.UpdateStep(modelUpdate, OperationType.Update);
        }

        var countJournalForFinancial = journaListForFinanacial.Count();

        for (var i = 0; i < countJournalForFinancial; i++)
        {
            var currentJournalForFinanacial = journaListForFinanacial[i];
            var stepId = await _journalStageActionRepository.GetActionIsLastConfirmHeader(56, 178, companyId);

            var journalUpdateFinancial = new UpdateFinanacialStep
            {
                CompanyId = companyId,
                IdentityId = currentJournalForFinanacial.Id,
                RequestStepId = stepId,
                UserId = userId
            };

            await _journalRepository.InsertFinanacialStep(journalUpdateFinancial);
        }

        return resultOperation;
    }
}

public static class FinanceTools
{
    /// <summary>
    ///     a 1_9 , b 4_5_2 , c 3 , d 6_7_8
    /// </summary>
    /// <param name="fundTypeId"></param>
    /// <returns></returns>
    public static Tuple<bool, bool, bool, bool> GetCategoryTreasuryReqColumn(byte fundTypeId)
    {
        var d_1_9 = false;
        var d_4_5_2 = false;
        var d_3 = false;
        var d_6_7_8 = false;

        var d_1_9List = new List<byte> { 1, 9 };
        var d_4_5_2List = new List<byte> { 4, 5, 2 };
        var d_6_7_8List = new List<byte> { 6, 7, 8 };

        if (fundTypeId == 3)
            d_3 = true;
        else if (d_1_9List.Contains(fundTypeId))
            d_1_9 = true;
        else if (d_4_5_2List.Contains(fundTypeId))
            d_4_5_2 = true;
        else
            d_6_7_8 = true;

        return new Tuple<bool, bool, bool, bool>(d_1_9, d_4_5_2, d_3, d_6_7_8);
    }

    /// <summary>
    ///     a 1_9 , b 4_5_2 , c 3 , d 6_7_8
    /// </summary>
    /// <param name="fundTypeId"></param>
    /// <returns></returns>
    public static Tuple<bool, bool, bool> GetCategoryTreasuryLineColumn(byte fundTypeId)
    {
        var d_1_9 = false;
        var d_4_5_2 = false;
        var d_3_6_7_8 = false;

        var d_1_9List = new List<byte> { 1, 9 };
        var d_4_5_2List = new List<byte> { 4, 5, 2 };
        var d_3_6_7_8List = new List<byte> { 3, 6, 7, 8 };

        if (d_1_9List.Contains(fundTypeId))
            d_1_9 = true;
        else if (d_4_5_2List.Contains(fundTypeId))
            d_4_5_2 = true;
        else
            d_3_6_7_8 = true;

        return new Tuple<bool, bool, bool>(d_1_9, d_4_5_2, d_3_6_7_8);
    }
}