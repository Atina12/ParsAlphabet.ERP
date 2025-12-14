namespace ParsAlphabet.ERP.Application.Dtos.MC.AdmissionCash;

public class AdmissionCashGetPage
{
    public int Id { get; set; }

    public short BranchId { get; set; }
    public string BranchName { get; set; }
    public string Branch => IdAndTitle(BranchId, BranchName);

    public short StageId { get; set; }
    public string StageName { get; set; }
    public string Stage => IdAndTitle(StageId, StageName);

    public int WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public string Workflow => IdAndTitle(WorkflowId, WorkflowName);

    public int AdmissionMasterId { get; set; }

    public string PatientNationalCode { get; set; }
    public int PatientId { get; set; }
    public string PatientFullName { get; set; }
    public string Patient => IdAndTitle(PatientId, PatientFullName);
    public decimal SumMasterAmount { get; set; }
    public decimal SumCashAmount { get; set; }

    public byte ActionId { get; set; }
    public string ActionName { get; set; }
    public string ActionIdName => IdAndTitle(ActionId, ActionName);

    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString();

    public int UserId { get; set; }
    public string UserFullName { get; set; }
    public string User => IdAndTitle(UserId, UserFullName);
}

public class AdmissionCashRequest : CompanyViewModel
{
    public int Id { get; set; }
    public int AdmissionMasterId { get; set; }

    public short BranchId { get; set; }
    public string BranchName { get; set; }
    public string Branch => IdAndTitle(BranchId, BranchName);

    public int WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public string Workflow => IdAndTitle(WorkflowId, WorkflowName);

    public short StageId { get; set; }
    public string StageName { get; set; }
    public string Stage => IdAndTitle(StageId, StageName);

    public byte WorkflowCategoryId { get; set; }

    public byte ActionId { get; set; }
    public byte MedicalRevenue { get; set; }


    public int AdmissionCashWorkflowId { get; set; }
    public string AdmissionCashWorkflowName { get; set; }
    public string AdmissionCashWorkflow => IdAndTitle(AdmissionCashWorkflowId, AdmissionCashWorkflowName);

    public short AdmissionCashStageId { get; set; }
    public string AdmissionCashStageName { get; set; }
    public string AdmissionCashStage => IdAndTitle(AdmissionCashStageId, AdmissionCashStageName);
    public byte AdmissionCashActionId { get; set; }

    public decimal SumRequestAmount { get; set; }
    public decimal SumCashAmount { get; set; }
    public decimal RemainingAmount { get; set; }


    public int PatientId { get; set; }
    public string PatientFullName { get; set; }
    public string Patient => IdAndTitle(PatientId, PatientFullName);
    public string PatientNationalCode { get; set; }


    public int UserId { get; set; }
    public string UserFullName { get; set; }
    public string User => IdAndTitle(UserId, UserFullName);

    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString();
}

public class AdmissionCashInfo
{
    public int AdmissionCashId { get; set; }
    public int AdmissionId { get; set; }
    public int AdmissionTypeId { get; set; }
    public int AdmissionPatientId { get; set; }
    public byte RowNumber { get; set; }
    public int AdmissionAmount { get; set; }
    public byte AdmissionSaleTypeId { get; set; }
    public string AdmissionSaleTypeName => AdmissionSaleTypeId == 1 ? "فروش" : "مرجوع";
}

public class GetAdmissionCashGrouByFundType : CompanyViewModel
{
    public DateTime CreateDate { get; set; }

    public string CreateDatePersian
    {
        get => CreateDate.ToPersianDateString("{0}/{1}/{2}");
        set
        {
            var str = value.ToMiladiDateTime();
            CreateDate = str == null ? DateTime.Now : str.Value;
        }
    }

    public int UserId { get; set; }
}

public class AdmissionCashGrouByFundType
{
    public short WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public string Workflow => IdAndTitle(WorkflowId, WorkflowName);

    public int StageId { get; set; }
    public string StageName { get; set; }
    public string Stage => IdAndTitle(StageId, StageName);
    public decimal Cash { get; set; }
    public decimal Pos { get; set; }
    public decimal BankReceipt { get; set; }
    public decimal AccountReceivable { get; set; }
    public decimal AccountReceivableEmployeeDeductionAndAddition { get; set; }
    public decimal AccountReceivablePatientCredit { get; set; }
    public decimal AccountReceivableAttenderCommission { get; set; }
    public decimal AccountReceivableEmployeeCredit { get; set; }
    public decimal AccountReceivableCharityCredit { get; set; }
    public decimal AccountReceivableInsurerCredit { get; set; }
    public decimal AccountReceivableAttenderCredit { get; set; }
}

public class AdmissionCashSumGrouByFundType
{
    public decimal Cash { get; set; }
    public decimal Pos { get; set; }
    public decimal BankReceipt { get; set; }
    public decimal AccountReceivable { get; set; }
    public decimal AccountReceivableEmployeeDeductionAndAddition { get; set; }
    public decimal AccountReceivablePatientCredit { get; set; }
    public decimal AccountReceivableAttenderCommission { get; set; }
    public decimal AccountReceivableEmployeeCredit { get; set; }
    public decimal AccountReceivableCharityCredit { get; set; }
    public decimal AccountReceivableInsurerCredit { get; set; }
    public decimal AccountReceivableAttenderCredit { get; set; }
}

public class AdmissionCashGetList
{
    public byte InOut { get; set; }
    public string InOutName { get; set; }
    public string FundTypeName { get; set; }
    public string OpenAccTypeName { get; set; }
    public int DetailAccountId { get; set; }
    public string DetailAccountName { get; set; }
    public byte CurrencyId { get; set; }
    public string CurrencyName { get; set; }
    public int ExchangeRate { get; set; }
    public decimal Amount { get; set; }
    public decimal NetAmount { get; set; }
    public int UserId { get; set; }
    public string UserFullName { get; set; }
    public DateTime? CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateStringNull("{0}/{1}/{2} {3}:{4}");
    public int PosId { get; set; }
    public string PosName { get; set; }
    public string Pos => PosId == 0 ? "" : $"{PosId} - {PosName}";
}

public class AdmissionCashGetType : CompanyViewModel
{
    public byte AdmissionTypeId { get; set; }
    public byte AdmissionSaleTypeId { get; set; }
}

public class DetailCash
{
    public int CashId { get; set; }
    public int? RowNumber { get; set; }
}

public class DetailAdmissionCash
{
    public int HeaderId { get; set; }
    public short RowNumber { get; set; }
    public byte InOut { get; set; }
    public byte FundTypeId { get; set; }
    public string FundTypeName { get; set; }
    public byte CurrencyId { get; set; }
    public string CurrencyName { get; set; }
    public decimal ExchangeRate { get; set; }
    public decimal Amount { get; set; }
    public string AccountNo { get; set; }
    public string RefNo { get; set; }
    public string CardNo { get; set; }
    public string TerminalNo { get; set; }
    public int PosId { get; set; }
    public string PosName { get; set; }
    public string Pos => $"{PosId} - {PosName}";
    public int DetailAccountId { get; set; }
    public string DetailAccountName { get; set; }
    public string DetailAccount => $"{DetailAccountId} - {DetailAccountName}";
    public int UserId { get; set; }
    public string UserFullName { get; set; }
    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersan => CreateDateTime.ToPersianDateString("{0}/{1}/{2} {3}:{4}");
}

public class GetAdmissionPaymentCashInfo
{
    public short AdmissionStageId { get; set; }
    public int AdmissionWorkflowId { get; set; }
    public byte AdmissionActionId { get; set; }
    public int AdmissionId { get; set; }
}

public class AdmissionPaymentCashInfo
{
    public int AdmissionAmount { get; set; }
    public int PaidAmount { get; set; }
    public int PayableAmount { get; set; }
}

public class AdmissionCashInfoPrint
{
    public int Id { get; set; }
    public short StageId { get; set; }
    public string StageName { get; set; }
    public decimal CashAmount { get; set; }
    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
}

public class AdmissionCashDetailInfo
{
    public byte Type { get; set; }
    public short MedicalRevenue { get; set; }
    public byte AdmissionMasterSettlement { get; set; }
    public int WorkflowCategoryId { get; set; }
}