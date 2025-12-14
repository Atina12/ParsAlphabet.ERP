using ParsAlphabet.ERP.Application.Dtos.FM.NewTreasury;
using ParsAlphabet.ERP.Application.Dtos.FM.PostingGroup;
using ParsAlphabet.ERP.Application.Dtos.PU.PurchaseInvoice;
using ParsAlphabet.ERP.Application.Dtos.PU.Vendor;
using ParsAlphabet.ERP.Application.Dtos.SM.Customer;
using ParsAlphabet.ERP.Application.Dtos.WF.StageAction;
using ParsAlphabet.ERP.Application.Dtos.WH.UnitCostCalculation;
using ParsAlphabet.ERP.Application.Dtos.WH.WarehouseTransaction;
using ParsAlphabet.ERP.Application.Interfaces;
using ParsAlphabet.ERP.Application.Interfaces.FM.NewTreasury;
using ParsAlphabet.ERP.Application.Interfaces.FM.NewTreasuryLine;
using ParsAlphabet.ERP.Application.Interfaces.PU.PurchaseInvoice;
using ParsAlphabet.ERP.Application.Interfaces.PU.PurchaseInvoiceLine;
using ParsAlphabet.ERP.Infrastructure.Implantation;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.AccountDetail;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.AccountGL;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.AccountSGL;
using ParsAlphabet.ERP.Infrastructure.Implantation.PU.Vendor;
using ParsAlphabet.ERP.Infrastructure.Implantation.SM.Customer;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.Stage;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageAction;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.WarehouseTransaction;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.WarehouseTransactionLine;

namespace ParseAlphabet.ERP.Web.Modules.FM.PostingGroup;

public class PostingGroupSystemRepository :
    BaseRepository<PostingGroupModel, int, string>,
    IBaseRepository<PostingGroupModel, int, string>
{
    private readonly AccountDetailRepository _accountDetailRepository;
    private readonly AccountGLRepository _accountGLRepository;
    private readonly AccountSGLRepository _accountSGLRepository;
    private readonly CustomerRepository _customerRepository;
    private readonly INewTreasuryRepository _newTreasuryRepository;
    private readonly IPurchaseInvoiceLineRepository _purchaseInvoiceLineRepository;
    private readonly IPurchaseInvoiceRepository _purchaseInvoiceRepository;
    private readonly StageActionRepository _stageActionRepository;
    private readonly StageRepository _stageRepository;
    private readonly INewTreasuryLineRepository _treasuryLineRepository;
    private readonly VendorRepository _vendorRepository;
    private readonly WarehouseTransactionLineRepository _warehouseTransactionLineRepository;
    private readonly WarehouseTransactionRepository _warehouseTransactionRepository;

    public PostingGroupSystemRepository(IConfiguration config,
        INewTreasuryRepository newTreasuryRepository,
        INewTreasuryLineRepository treasuryLineRepository,
        StageActionRepository stageActionRepository,
        AccountGLRepository accountGLRepository,
        AccountSGLRepository accountSGLRepository,
        AccountDetailRepository accountDetailRepository,
        StageRepository stageRepository,
        IPurchaseInvoiceRepository purchaseInvoiceRepository,
        IPurchaseInvoiceLineRepository purchaseInvoiceLineRepository,
        VendorRepository vendorRepository,
        WarehouseTransactionLineRepository warehouseTransactionLineRepository,
        WarehouseTransactionRepository warehouseTransactionRepository,
        CustomerRepository customerRepository) : base(config)
    {
        _newTreasuryRepository = newTreasuryRepository;
        _treasuryLineRepository = treasuryLineRepository;
        _stageActionRepository = stageActionRepository;
        _accountGLRepository = accountGLRepository;
        _accountSGLRepository = accountSGLRepository;
        _accountDetailRepository = accountDetailRepository;
        _vendorRepository = vendorRepository;
        _customerRepository = customerRepository;
        _stageRepository = stageRepository;
        _purchaseInvoiceRepository = purchaseInvoiceRepository;
        _purchaseInvoiceLineRepository = purchaseInvoiceLineRepository;
        _warehouseTransactionLineRepository = warehouseTransactionLineRepository;
        _warehouseTransactionRepository = warehouseTransactionRepository;
    }

    public async Task<List<string>> ValidatePostingGroupTreasury(List<ID> model, int companyId)
    {
        var errors = new List<string>();

        if (!model.ListHasRow())
        {
            errors.Add("موردی برای ارسال نمی باشد");
            return errors;
        }


        var list = await _newTreasuryRepository.GetHeaderTreasuryPostingGroup(model, companyId);

        var validateDocumentTypeId = list.Any(b => b.DocumentTypeId == 0);
        if (validateDocumentTypeId) errors.Add("نوع سند مشخص نیست ، به مدیر سیستم اطلاع دهید");


        var IdentityIgnoredFiscalYear = list.Where(b => b.IsFiscal != 100).Select(w => w.Id).ToList();

        if (IdentityIgnoredFiscalYear.ListHasRow())
        {
            var fiscalIgnoredIds = string.Join(',', IdentityIgnoredFiscalYear);

            errors.Add(
                $"سال و ماه دوره مالی برگه های با شناسه {fiscalIgnoredIds}بسته است ، مجاز به ارسال سند نمی باشید");
        }


        var isFiscalList = list.Where(f => f.IsFiscal == 100).ToList();

        var hasntPermissionStepIdList = new List<int>();
        var hasntPermissionPostStepIdList = new List<int>();
        var isPostedIdList = new List<int>();

        for (var i = 0; i < isFiscalList.Count(); i++)
        {
            var item = isFiscalList[i];


            if (item.IsPosted)
                isPostedIdList.Add(item.Id);

            var getTreasuryStageAction = new GetStageAction
            {
                WorkflowId = item.WorkflowId,
                StageId = item.StageId,
                ActionId = item.CurrentStepId,
                Priority = 0,
                CompanyId = item.CompanyId
            };

            var treasuryPostingStageAction =
                await _stageActionRepository.GetStageActionWithParam(getTreasuryStageAction);

            var currentPriority = treasuryPostingStageAction.FirstOrDefault().Priority;

            getTreasuryStageAction.ActionId = 0;

            var existStageStepPriority =
                await _stageActionRepository.GetStageActionWithOutActionIdParam(getTreasuryStageAction);

            if (existStageStepPriority.NotNull() && existStageStepPriority.IsPostedGroup)
            {
                var nextPriority = Convert.ToByte(currentPriority + 1);

                getTreasuryStageAction.Priority = nextPriority;

                var nextStageStepTreasury =
                    await _stageActionRepository.GetStageActionWithOutActionIdParam(getTreasuryStageAction);

                if (!nextStageStepTreasury.IsPostedGroup)
                    hasntPermissionStepIdList.Add(item.Id);
            }
            else
            {
                hasntPermissionPostStepIdList.Add(item.Id);
            }
        }

        if (hasntPermissionStepIdList.ListHasRow())
        {
            var hasntPermissionStepIds = string.Join(',', hasntPermissionStepIdList);
            errors.Add($"برگه های {hasntPermissionStepIds} در گام جاری مجوز ارسال سند ندارد.");
            return errors;
        }

        if (hasntPermissionPostStepIdList.ListHasRow())
        {
            var hasntPermissionPostStepIds = string.Join(',', hasntPermissionPostStepIdList);
            errors.Add($"برگه های {hasntPermissionPostStepIds} در مرحله جاری گام(ارسال سند) تعریف نشده است.");
            return errors;
        }


        if (isPostedIdList.ListHasRow())
        {
            var isPostedIds = string.Join(',', isPostedIdList);
            errors.Add($"برگه های {isPostedIds} ارسال سند انجام شده است");
        }

        var groupedAcceptedForPost = isFiscalList.GroupBy(
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

        var len = groupedAcceptedForPost.Count;
        for (var t = 0; t < len; t++)
        {
            var doc = groupedAcceptedForPost[t];

            var treasuryIds = isFiscalList.Where(d => d.TransactionDate == doc.TransactionDate &&
                                                      d.DocumentTypeId == doc.DocumentTypeId &&
                                                      d.BranchId == doc.BranchId &&
                                                      d.CompanyId == doc.CompanyId).Select(e => new ID { Id = e.Id })
                .ToList();

            var getStepModelTreasury = new GetStageAction
            {
                StageId = doc.StageId,
                CompanyId = companyId,
                Priority = 1,
                ActionId = 0,
                WorkflowId = doc.WorkflowId
            };

            // if istreasur
            var stageStepTreasury = await _stageActionRepository.GetStageActionWithParam(getStepModelTreasury);
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
            var treasuryLineCount = treasuryLine.Count();

            if (!treasuryLine.ListHasRow())
            {
                var output =
                    $"سطری با مشخصات برگهء ، تاریخ : {doc.TransactionDatePersian} - نوع سند : {doc.DocumentTypeName} - کد شعبه : {doc.BranchId} وجود ندارد";
                errors.Add(output);
            }
            else
            {
                var existTreasuryId = treasuryLine.GroupBy(
                    t1 => new
                    {
                        t1.TreasuryId
                    }).Select(tr => new ID
                {
                    Id = tr.Key.TreasuryId
                }).ToList();

                var existTreasuryIdCount = existTreasuryId.Count();

                for (var i = 0; i < existTreasuryIdCount; i++)
                {
                    var currentTreasuryId = existTreasuryId[i].Id;

                    var accountGLIdModel = treasuryLine.Where(z => z.TreasuryId == currentTreasuryId)
                        .Select(x => x.AccountGLId).Distinct().ToList();
                    var accountGlIdDb = await _accountGLRepository.GetAll();
                    var accountGLExceptList = accountGLIdModel.Except(accountGlIdDb);

                    if (accountGLExceptList.Count() > 0)
                        errors.Add($"شناسه خزانه {currentTreasuryId}" +
                                   (accountGLExceptList.Count() == 1 ? " کد کل " : " کدهای کل ") +
                                   string.Join(",", accountGLExceptList) + " تعریف نشده است ");

                    var accountSGLIdModel = treasuryLine.Where(z => z.TreasuryId == currentTreasuryId)
                        .Select(x => x.AccountSGLId).Distinct().ToList();
                    var accountSGlIdDb = await _accountSGLRepository.GetAll();
                    var accountSGLExceptList = accountSGLIdModel.Except(accountSGlIdDb);


                    if (accountSGLExceptList.Count() > 0)
                        errors.Add($"شناسه خزانه {currentTreasuryId} :" +
                                   (accountSGLExceptList.Count() == 1 ? " کد معین " : " کدهای معین ") +
                                   string.Join(",", accountSGLExceptList) + " تعریف نشده است ");

                    var accountDetailIdModel = treasuryLine
                        .Where(z => z.TreasuryId == currentTreasuryId && z.AccountDetailId != 0)
                        .Select(x => x.AccountDetailId).Distinct().ToList();
                    var accountDetailIdDb = await _accountDetailRepository.GetAll();
                    var accountDetailExceptList = accountDetailIdModel.Except(accountDetailIdDb);

                    if (accountDetailExceptList.Count() > 0)
                        errors.Add($"شناسه خزانه {currentTreasuryId} :" +
                                   (accountDetailExceptList.Count() == 1 ? " کد تفصیل " : " کدهای تفصیل ") +
                                   string.Join(",", accountDetailExceptList) + " تعریف نشده است ");

                    var accountGlSglItemsDistinct = treasuryLine.Where(z => z.TreasuryId == currentTreasuryId)
                        .Select(a => new { a.AccountGLId, a.AccountSGLId }).Distinct();
                    var accountGlSglModel = accountGlSglItemsDistinct.Select(a => a.AccountGLId + "_" + a.AccountSGLId)
                        .ToList();
                    var accountGlSglDb = await _accountSGLRepository.GetAllGlSgl(string.Join(",", accountGLIdModel));
                    var accountGlSglDbDistinct =
                        accountGlSglDb.Select(a => new { a.AccountGlId, a.AccountSglId }).Distinct();
                    var accountGlSglFinal = accountGlSglDbDistinct.Select(a => a.AccountGlId + "_" + a.AccountSglId)
                        .ToList();
                    var accountGlSglExceptList = accountGlSglModel.Except(accountGlSglFinal);

                    if (accountGlSglExceptList.Count() > 0)
                    {
                        var str = "";
                        foreach (var item in accountGlSglExceptList)
                            str += $"کل : {item.Split("_")[0]} معین : {item.Split("_")[1]} ";
                        errors.Add($"شناسه خزانه {currentTreasuryId} :" + $"کدینگ های نا مرتبط : {str}");
                    }
                }

                for (var i = 0; i < treasuryLineCount; i++)
                {
                    var currentLine = treasuryLine[i];
                    if (currentLine.NoseriesId > 0)
                    {
                        var noSeriesId = currentLine.NoseriesId;

                        if (noSeriesId == 102 || noSeriesId == 103)
                        {
                            var vendor = new MyResultPage<VendorGetRecordForm>();
                            var customer = new MyResultPage<CustomerGetRecordForm>();

                            if (currentLine.AccountDetailId != 0)
                            {
                                if (noSeriesId == 102)
                                {
                                    vendor = await _vendorRepository.GetRecordById(currentLine.AccountDetailId,
                                        companyId);

                                    if (vendor.Data.VATIncludeVe != null && vendor.Data.VATIncludeVe.Value &&
                                        vendor.Data.VATIncludeVe.Value && !vendor.Data.VATEnableVe.Value &&
                                        vendor.Data.VATEnableVe != null)
                                        errors.Add("تامین کننده ، اعتبار ارزش افزوده ندارد ، مجاز به ثبت نمی باشید");
                                }
                                else if (noSeriesId == 103)
                                {
                                    customer = await _customerRepository.GetRecordById(currentLine.AccountDetailId,
                                        companyId);

                                    if (customer.Data.VATIncludeCu != null && customer.Data.VATIncludeCu.Value &&
                                        !customer.Data.VATEnableCu.Value)
                                        errors.Add("مشتری ، اعتبار ارزش افزوده ندارد ، مجاز به ثبت نمی باشید");
                                }
                            }
                        }
                    }
                }

                // بدهکار
                var sumNature1 = treasuryLine.Where(s => s.AccountNatureTypeId == 1).Sum(t1 => t1.Amount);

                // بستانکار
                var sumNature2 = treasuryLine.Where(s => s.AccountNatureTypeId == 2).Sum(t1 => t1.Amount);

                var sumFinal = sumNature1 - sumNature2;
                if (sumFinal != 0)
                {
                    var ids = string.Join(',', treasuryIds.Select(x => x.Id));

                    var messages = new List<string>();
                    messages.Add($@"برگه های {ids} به دلیل مغایرت بدهکار-بستانکار امکان ثبت سند را ندارد");
                    messages.Add(
                        $@"جمع بدهکار:({string.Format("{0:n}", sumNature1)}) - جمع بستانکار:({string.Format("{0:n}", sumNature2)}) = ({string.Format("{0:n}", sumFinal)})");
                    errors.Add(string.Join("</br>", messages));
                }
            }
        }

        return errors;
    }

    public async Task<List<string>> ValidatePostingGroupPurchase(List<ID> model, int companyId)
    {
        var errors = new List<string>();


        if (!model.ListHasRow())
        {
            errors.Add("موردی برای ارسال نمی باشد");
            return errors;
        }

        var list = await _purchaseInvoiceRepository.GetHeaderPurchasePostingGroup(model, companyId);


        var validateDocumentTypeId = list.Any(b => b.DocumentTypeId == 0);
        if (validateDocumentTypeId) errors.Add("نوع سند مشخص نیست ، به مدیر سیستم اطلاع دهید");


        var IdentityIgnoredFiscalYear = list.Where(b => b.IsFiscal != 100).Select(p => p.Id).ToList();
        if (IdentityIgnoredFiscalYear.ListHasRow())
        {
            var fiscalIgnoredIds = string.Join(',', IdentityIgnoredFiscalYear);
            errors.Add(
                $"سال و ماه دوره مالی برگه های با شناسه {fiscalIgnoredIds}بسته است ، مجاز به ارسال سند نمی باشید");
        }

        var isFiscalList = list.Where(f => f.IsFiscal == 100).ToList();

        var hasntPermissionStepIdList = new List<int>();
        var hasntPermissionPostStepIdList = new List<int>();
        var isPostedIdList = new List<int>();


        for (var i = 0; i < isFiscalList.Count(); i++)
        {
            var item = isFiscalList[i];


            if (item.IsPosted)
                isPostedIdList.Add(item.Id);

            var getPurchaseStageAction = new GetStageAction
            {
                WorkflowId = item.WorkflowId,
                StageId = item.StageId,
                ActionId = item.CurrentStepId,
                Priority = 0,
                CompanyId = item.CompanyId
            };

            var purchasePostingStageAction =
                await _stageActionRepository.GetStageActionWithParam(getPurchaseStageAction);

            var currentPriority = purchasePostingStageAction.FirstOrDefault().Priority;

            getPurchaseStageAction.ActionId = 0;

            var existStageStepPriority =
                await _stageActionRepository.GetStageActionWithOutActionIdParam(getPurchaseStageAction);

            if (existStageStepPriority.NotNull() && existStageStepPriority.IsPostedGroup)
            {
                var nextPriority = Convert.ToByte(currentPriority + 1);

                getPurchaseStageAction.Priority = nextPriority;

                var nextStageStepPurchase =
                    await _stageActionRepository.GetStageActionWithOutActionIdParam(getPurchaseStageAction);

                if (!nextStageStepPurchase.IsPostedGroup)
                    hasntPermissionStepIdList.Add(item.Id);
            }
            else
            {
                hasntPermissionPostStepIdList.Add(item.Id);
            }
        }

        if (hasntPermissionStepIdList.ListHasRow())
        {
            var hasntPermissionStepIds = string.Join(',', hasntPermissionStepIdList);
            errors.Add($"برگه های {hasntPermissionStepIds} در گام جاری مجوز ارسال سند ندارد.");
            return errors;
        }

        if (hasntPermissionPostStepIdList.ListHasRow())
        {
            var hasntPermissionPostStepIds = string.Join(',', hasntPermissionPostStepIdList);
            errors.Add($"برگه های {hasntPermissionPostStepIds} در مرحله جاری گام(ارسال سند) تعریف نشده است.");
            return errors;
        }

        if (isPostedIdList.ListHasRow())
        {
            var isPostedIds = string.Join(',', isPostedIdList);
            errors.Add($"برگه های {isPostedIds} ارسال سند انجام شده است");
        }


        var groupedAcceptedForPost = isFiscalList.GroupBy(
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

        var len = groupedAcceptedForPost.Count;
        for (var t = 0; t < len; t++)
        {
            var doc = groupedAcceptedForPost[t];

            var purchaseIds = isFiscalList.Where(d => d.DocumentDate == doc.DocumentDate &&
                                                      d.DocumentTypeId == doc.DocumentTypeId &&
                                                      d.BranchId == doc.BranchId &&
                                                      d.CompanyId == doc.CompanyId).Select(e => new ID { Id = e.Id })
                .ToList();

            var getStepModelTreasury = new GetStageAction
            {
                StageId = doc.StageId,
                CompanyId = companyId,
                Priority = 1,
                ActionId = 0,
                WorkflowId = doc.WorkflowId
            };


            // add sum purchaseLine Group by Currency-Exchange  For Add To JournalLine >>PART1<<
            var purchaseLine =
                await _purchaseInvoiceLineRepository.GetPurchaseLineListForPost(purchaseIds, doc.CompanyId);
            var purchaseLineCount = purchaseLine.Count();

            if (!purchaseLine.ListHasRow())
            {
                var output =
                    $"سطری با مشخصات برگهء ، تاریخ : {doc.DocumentDatePersian} - نوع سند : {doc.DocumentTypeName} - کد شعبه : {doc.BranchId} وجود ندارد";
                errors.Add(output);
            }
            else
            {
                var existPurchaseId = purchaseLine.GroupBy(
                    t1 => new
                    {
                        t1.HeaderId
                    }).Select(tr => new ID
                {
                    Id = tr.Key.HeaderId
                }).ToList();

                var existTreasuryIdCount = existPurchaseId.Count();

                for (var i = 0; i < existTreasuryIdCount; i++)
                {
                    var currentPurchaseId = existPurchaseId[i].Id;

                    var accountGLIdModel = purchaseLine.Where(z => z.HeaderId == currentPurchaseId)
                        .Select(x => x.AccountGLId).Distinct().ToList();
                    var accountGlIdDb = await _accountGLRepository.GetAll();
                    var accountGLExceptList = accountGLIdModel.Except(accountGlIdDb);

                    if (accountGLExceptList.Count() > 0)
                        errors.Add($"شناسه خرید {currentPurchaseId}" +
                                   (accountGLExceptList.Count() == 1 ? " کد کل " : " کدهای کل ") +
                                   string.Join(",", accountGLExceptList) + " تعریف نشده است ");

                    var accountSGLIdModel = purchaseLine.Where(z => z.HeaderId == currentPurchaseId)
                        .Select(x => x.AccountSGLId).Distinct().ToList();
                    var accountSGlIdDb = await _accountSGLRepository.GetAll();
                    var accountSGLExceptList = accountSGLIdModel.Except(accountSGlIdDb);


                    if (accountSGLExceptList.Count() > 0)
                        errors.Add($"شناسه خرید {currentPurchaseId} :" +
                                   (accountSGLExceptList.Count() == 1 ? " کد معین " : " کدهای معین ") +
                                   string.Join(",", accountSGLExceptList) + " تعریف نشده است ");

                    var accountDetailIdModel = purchaseLine
                        .Where(z => z.HeaderId == currentPurchaseId && z.AccountDetailId != 0)
                        .Select(x => x.AccountDetailId).Distinct().ToList();
                    var accountDetailIdDb = await _accountDetailRepository.GetAll();
                    var accountDetailExceptList = accountDetailIdModel.Except(accountDetailIdDb);

                    if (accountDetailExceptList.Count() > 0)
                        errors.Add($"شناسه خرید {currentPurchaseId} :" +
                                   (accountDetailExceptList.Count() == 1 ? " کد تفصیل " : " کدهای تفصیل ") +
                                   string.Join(",", accountDetailExceptList) + " تعریف نشده است ");

                    var accountGlSglItemsDistinct = purchaseLine.Where(z => z.HeaderId == currentPurchaseId)
                        .Select(a => new { a.AccountGLId, a.AccountSGLId }).Distinct();
                    var accountGlSglModel = accountGlSglItemsDistinct.Select(a => a.AccountGLId + "_" + a.AccountSGLId)
                        .ToList();
                    var accountGlSglDb = await _accountSGLRepository.GetAllGlSgl(string.Join(",", accountGLIdModel));
                    var accountGlSglDbDistinct =
                        accountGlSglDb.Select(a => new { a.AccountGlId, a.AccountSglId }).Distinct();
                    var accountGlSglFinal = accountGlSglDbDistinct.Select(a => a.AccountGlId + "_" + a.AccountSglId)
                        .ToList();
                    var accountGlSglExceptList = accountGlSglModel.Except(accountGlSglFinal);

                    if (accountGlSglExceptList.Count() > 0)
                    {
                        var str = "";
                        foreach (var item in accountGlSglExceptList)
                            str += $"کل : {item.Split("_")[0]} معین : {item.Split("_")[1]} ";
                        errors.Add($"شناسه خرید {currentPurchaseId} :" + $"کدینگ های نا مرتبط : {str}");
                    }
                }

                for (var i = 0; i < purchaseLineCount; i++)
                {
                    var currentLine = purchaseLine[i];
                    if (currentLine.NoseriesId > 0)
                    {
                        var noSeriesId = currentLine.NoseriesId;

                        if (noSeriesId == 102 || noSeriesId == 103)
                        {
                            var vendor = new MyResultPage<VendorGetRecordForm>();
                            var customer = new MyResultPage<CustomerGetRecordForm>();

                            if (currentLine.AccountDetailId != 0)
                            {
                                if (noSeriesId == 102)
                                {
                                    vendor = await _vendorRepository.GetRecordById(currentLine.AccountDetailId,
                                        companyId);

                                    if (vendor.Data.VATIncludeVe != null && vendor.Data.VATIncludeVe.Value &&
                                        vendor.Data.VATIncludeVe.Value && !vendor.Data.VATEnableVe.Value &&
                                        vendor.Data.VATEnableVe != null)
                                        errors.Add("تامین کننده ، اعتبار ارزش افزوده ندارد ، مجاز به ثبت نمی باشید");
                                }
                                else if (noSeriesId == 103)
                                {
                                    customer = await _customerRepository.GetRecordById(currentLine.AccountDetailId,
                                        companyId);

                                    if (customer.Data.VATIncludeCu != null && customer.Data.VATIncludeCu.Value &&
                                        !customer.Data.VATEnableCu.Value)
                                        errors.Add("مشتری ، اعتبار ارزش افزوده ندارد ، مجاز به ثبت نمی باشید");
                                }
                            }
                        }
                    }
                }

                // بدهکار
                var sumNature1 = purchaseLine.Where(s => s.AccountNatureTypeId == 1).Sum(t1 => t1.Amount);

                // بستانکار
                var sumNature2 = purchaseLine.Where(s => s.AccountNatureTypeId == 2).Sum(t1 => t1.Amount);

                var sumFinal = sumNature1 - sumNature2;
                if (sumFinal != 0)
                {
                    var ids = string.Join(',', purchaseIds.Select(x => x.Id));

                    var messages = new List<string>();
                    messages.Add($@"برگه های {ids} به دلیل مغایرت بدهکار-بستانکار امکان ثبت سند را ندارد");
                    messages.Add(
                        $@"جمع بدهکار:({string.Format("{0:n}", sumNature1)}) - جمع بستانکار:({string.Format("{0:n}", sumNature2)}) = ({string.Format("{0:n}", sumFinal)})");
                    errors.Add(string.Join("</br>", messages));
                }
            }
        }

        return errors;
    }


    public async Task<List<string>> ValidatePostingGroupWarehouse(HeaderUnitCostCalculationPostingGroupModel model)
    {
        var errors = new List<string>();

        if (model.FromDate == null && model.ToDate == null)
        {
            errors.Add("موردی برای ارسال نمی باشد");
            return errors;
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


        var validateDocumentTypeId = list.Any(b => b.DocumentTypeId == 0);
        if (validateDocumentTypeId) errors.Add("نوع سند مشخص نیست ، به مدیر سیستم اطلاع دهید");


        var IdentityIgnoredFiscalYear = list.Where(b => b.IsFiscal != 100).Select(p => p.Id).ToList();
        if (IdentityIgnoredFiscalYear.ListHasRow())
        {
            var fiscalIgnoredIds = string.Join(',', IdentityIgnoredFiscalYear);
            errors.Add(
                $"سال و ماه دوره مالی برگه های با شناسه {fiscalIgnoredIds}باز است ، مجاز به ارسال سند نمی باشید");
        }

        var isFiscalList = list.Where(f => f.IsFiscal == 100).ToList();

        var hasntPermissionStepIdList = new List<int>();
        var hasntPermissionPostStepIdList = new List<int>();
        var isPostedIdList = new List<int>();


        for (var i = 0; i < isFiscalList.Count(); i++)
        {
            var item = isFiscalList[i];


            if (item.IsPosted)
                isPostedIdList.Add(item.Id);

            var getWarehouseStageAction = new GetStageAction
            {
                WorkflowId = model.WorkflowId,
                StageId = model.StageId,
                ActionId = (byte)model.CurrentActionId,
                Priority = 0,
                CompanyId = item.CompanyId
            };

            var warehousePostingStageAction =
                await _stageActionRepository.GetStageActionWithParam(getWarehouseStageAction);

            var currentPriority = warehousePostingStageAction.FirstOrDefault().Priority;

            getWarehouseStageAction.ActionId = 0;

            var existStageStepPriority =
                await _stageActionRepository.GetStageActionWithOutActionIdParam(getWarehouseStageAction);

            if (existStageStepPriority.NotNull() && existStageStepPriority.IsPostedGroup)
            {
                var nextPriority = Convert.ToByte(currentPriority + 1);

                getWarehouseStageAction.Priority = nextPriority;

                var nextStageStepWarehouse =
                    await _stageActionRepository.GetStageActionWithOutActionIdParam(getWarehouseStageAction);

                if (!nextStageStepWarehouse.IsPostedGroup)
                    hasntPermissionStepIdList.Add(item.Id);
            }
            else
            {
                hasntPermissionPostStepIdList.Add(item.Id);
            }
        }

        if (hasntPermissionStepIdList.ListHasRow())
        {
            var hasntPermissionStepIds = string.Join(',', hasntPermissionStepIdList);
            errors.Add($"برگه های {hasntPermissionStepIds} در گام جاری مجوز ارسال سند ندارد.");
            return errors;
        }

        if (hasntPermissionPostStepIdList.ListHasRow())
        {
            var hasntPermissionPostStepIds = string.Join(',', hasntPermissionPostStepIdList);
            errors.Add($"برگه های {hasntPermissionPostStepIds} در مرحله جاری گام(ارسال سند) تعریف نشده است.");
            return errors;
        }

        if (isPostedIdList.ListHasRow())
        {
            var isPostedIds = string.Join(',', isPostedIdList);
            errors.Add($"برگه های {isPostedIds} ارسال سند انجام شده است");
        }


        var groupedAcceptedForPost = isFiscalList.GroupBy(
            t => new
            {
                t.DocumentDate,
                t.DocumentTypeId,
                t.BranchId,
                t.StageId,
                t.WorkflowId,
                t.WorkflowCategoryId,
                t.CompanyId
            }).Select(tr => new HeaderPurchasePostingGroup
        {
            DocumentDate = tr.Key.DocumentDate,
            DocumentTypeId = tr.Key.DocumentTypeId,
            BranchId = tr.Key.BranchId,
            StageId = model.StageId,
            WorkflowId = model.WorkflowId,
            WorkflowCategoryId = tr.Key.WorkflowCategoryId,
            CompanyId = tr.Key.CompanyId
        }).ToList();

        var len = groupedAcceptedForPost.Count;
        for (var t = 0; t < len; t++)
        {
            var doc = groupedAcceptedForPost[t];

            var itemTransactionIds = isFiscalList.Where(d => d.DocumentDate == doc.DocumentDate &&
                                                             d.DocumentTypeId == doc.DocumentTypeId &&
                                                             d.BranchId == doc.BranchId &&
                                                             d.CompanyId == doc.CompanyId)
                .Select(e => new ID { Id = e.Id }).ToList();

            // add sum itemTransactionLine Group by Currency-Exchange  For Add To JournalLine >>PART1<<

            var itemTransactionLine =
                await _warehouseTransactionLineRepository.GetWarehouseTransactionLineListForPost(itemTransactionIds,
                    doc.WorkflowCategoryId, doc.CompanyId);
            var itemTransactionLineCount = itemTransactionLine.Count();

            if (!itemTransactionLine.ListHasRow())
            {
                var output =
                    $"سطری با مشخصات برگهء ، تاریخ : {doc.DocumentDatePersian} - نوع سند : {doc.DocumentTypeName} - کد شعبه : {doc.BranchId} وجود ندارد";
                errors.Add(output);
            }
            else
            {
                var existWarehouseId = itemTransactionLine.GroupBy(
                    t1 => new
                    {
                        t1.HeaderId
                    }).Select(tr => new ID
                {
                    Id = tr.Key.HeaderId
                }).ToList();

                var existTreasuryIdCount = existWarehouseId.Count();

                for (var i = 0; i < existTreasuryIdCount; i++)
                {
                    var currentTreasuryId = existWarehouseId[i].Id;

                    var accountGLIdModel = itemTransactionLine.Where(z => z.HeaderId == currentTreasuryId)
                        .Select(x => x.AccountGLId).Distinct().ToList();
                    var accountGlIdDb = await _accountGLRepository.GetAll();
                    var accountGLExceptList = accountGLIdModel.Except(accountGlIdDb);

                    if (accountGLExceptList.Count() > 0)
                        errors.Add($"شناسه  {currentTreasuryId}" +
                                   (accountGLExceptList.Count() == 1 ? " کد کل " : " کدهای کل ") +
                                   string.Join(",", accountGLExceptList) + " تعریف نشده است ");

                    var accountSGLIdModel = itemTransactionLine.Where(z => z.HeaderId == currentTreasuryId)
                        .Select(x => x.AccountSGLId).Distinct().ToList();
                    var accountSGlIdDb = await _accountSGLRepository.GetAll();
                    var accountSGLExceptList = accountSGLIdModel.Except(accountSGlIdDb);


                    if (accountSGLExceptList.Count() > 0)
                        errors.Add($"شناسه  {currentTreasuryId} :" +
                                   (accountSGLExceptList.Count() == 1 ? " کد معین " : " کدهای معین ") +
                                   string.Join(",", accountSGLExceptList) + " تعریف نشده است ");

                    var accountDetailIdModel = itemTransactionLine
                        .Where(z => z.HeaderId == currentTreasuryId && z.AccountDetailId != 0)
                        .Select(x => x.AccountDetailId).Distinct().ToList();
                    var accountDetailIdDb = await _accountDetailRepository.GetAll();
                    var accountDetailExceptList = accountDetailIdModel.Except(accountDetailIdDb);

                    if (accountDetailExceptList.Count() > 0)
                        errors.Add($"شناسه  {currentTreasuryId} :" +
                                   (accountDetailExceptList.Count() == 1 ? " کد تفصیل " : " کدهای تفصیل ") +
                                   string.Join(",", accountDetailExceptList) + " تعریف نشده است ");

                    var accountGlSglItemsDistinct = itemTransactionLine.Where(z => z.HeaderId == currentTreasuryId)
                        .Select(a => new { a.AccountGLId, a.AccountSGLId }).Distinct();
                    var accountGlSglModel = accountGlSglItemsDistinct.Select(a => a.AccountGLId + "_" + a.AccountSGLId)
                        .ToList();
                    var accountGlSglDb = await _accountSGLRepository.GetAllGlSgl(string.Join(",", accountGLIdModel));
                    var accountGlSglDbDistinct =
                        accountGlSglDb.Select(a => new { a.AccountGlId, a.AccountSglId }).Distinct();
                    var accountGlSglFinal = accountGlSglDbDistinct.Select(a => a.AccountGlId + "_" + a.AccountSglId)
                        .ToList();
                    var accountGlSglExceptList = accountGlSglModel.Except(accountGlSglFinal);

                    if (accountGlSglExceptList.Count() > 0)
                    {
                        var str = "";
                        foreach (var item in accountGlSglExceptList)
                            str += $"کل : {item.Split("_")[0]} معین : {item.Split("_")[1]} ";
                        errors.Add($"شناسه  {currentTreasuryId} :" + $"کدینگ های نا مرتبط : {str}");
                    }
                }

                for (var i = 0; i < itemTransactionLineCount; i++)
                {
                    var currentLine = itemTransactionLine[i];
                    if (currentLine.NoseriesId > 0)
                    {
                        var noSeriesId = currentLine.NoseriesId;

                        if (noSeriesId == 102 || noSeriesId == 103)
                        {
                            var vendor = new MyResultPage<VendorGetRecordForm>();
                            var customer = new MyResultPage<CustomerGetRecordForm>();

                            if (currentLine.AccountDetailId != 0)
                            {
                                if (noSeriesId == 102)
                                {
                                    vendor = await _vendorRepository.GetRecordById(currentLine.AccountDetailId,
                                        model.CompanyId);

                                    if (vendor.Data.VATIncludeVe != null && vendor.Data.VATIncludeVe.Value &&
                                        vendor.Data.VATIncludeVe.Value && !vendor.Data.VATEnableVe.Value &&
                                        vendor.Data.VATEnableVe != null)
                                        errors.Add("تامین کننده ، اعتبار ارزش افزوده ندارد ، مجاز به ثبت نمی باشید");
                                }
                                else if (noSeriesId == 103)
                                {
                                    customer = await _customerRepository.GetRecordById(currentLine.AccountDetailId,
                                        model.CompanyId);

                                    if (customer.Data.VATIncludeCu != null && customer.Data.VATIncludeCu.Value &&
                                        !customer.Data.VATEnableCu.Value)
                                        errors.Add("مشتری ، اعتبار ارزش افزوده ندارد ، مجاز به ثبت نمی باشید");
                                }
                            }
                        }
                    }
                }

                // بدهکار
                var sumNature1 = itemTransactionLine.Where(s => s.AccountNatureTypeId == 1).Sum(t1 => t1.Amount);

                // بستانکار
                var sumNature2 = itemTransactionLine.Where(s => s.AccountNatureTypeId == 2).Sum(t1 => t1.Amount);

                var sumFinal = sumNature1 - sumNature2;
                if (sumFinal != 0)
                {
                    var ids = string.Join(',', itemTransactionIds.Select(x => x.Id));

                    var messages = new List<string>();
                    messages.Add($@"برگه های {ids} به دلیل مغایرت بدهکار-بستانکار امکان ثبت سند را ندارد");
                    messages.Add(
                        $@"جمع بدهکار:({string.Format("{0:n}", sumNature1)}) - جمع بستانکار:({string.Format("{0:n}", sumNature2)}) = ({string.Format("{0:n}", sumFinal)})");
                    errors.Add(string.Join("</br>", messages));
                }
            }
        }

        return errors;
    }
}