namespace ParsAlphabet.ERP.Application.Dtos.SM.SaleOrder;

public class SaleOrderGetPage
{
    public int Id { get; set; }
    public int RequestId { get; set; }
    public int OrderNo { get; set; }
    public short StageId { get; set; }
    public string StageName { get; set; }
    public string Stage => $"{StageId} - {StageName}";
    public short BranchId { get; set; }
    public string BranchName { get; set; }
    public string Branch => $"{BranchId} - {BranchName}";
    public int CreateUserId { get; set; }
    public string UserFullName { get; set; }
    public string UserName => IdAndTitle(CreateUserId, UserFullName);
    public long ReturnReasonId { get; set; }
    public string ReturnReasonName { get; set; }
    public string ReturnReason => IdAndTitle(ReturnReasonId, ReturnReasonName);
    public string OrderDatePersian { get; set; }
    public string CreateDateTimePersian { get; set; }
    public byte ActionId { get; set; }
    public string ActionName { get; set; }
    public string ActionIdName => IdAndTitle(ActionId, ActionName);
    public byte IsDataEntry { get; set; }
    public short NoSeriesId { get; set; }
    public string NoSeriesName { get; set; }
    public string NoSeries => IdAndTitle(NoSeriesId, NoSeriesName);
    public int AccountDetailId { get; set; }
    public string AccountDetailName { get; set; }
    public string AccountDetail => IdAndTitle(AccountDetailId, AccountDetailName);
    public int TreasurySubjectId { get; set; }
    public string TreasurySubjectName { get; set; }
    public string TreasurySubject => IdAndTitle(TreasurySubjectId, TreasurySubjectName);
}

public class SaleOrderViewModel
{
    public int Id { get; set; }
    public short StageId { get; set; }
    public byte ActionId { get; set; }
    public DateTime? OrderDate { get; set; }
}

public class SaleOrderGetRecord
{
    public int Id { get; set; }
    public long? RequestId { get; set; }
    public short StageId { get; set; }
    public string StageName { get; set; }
    public short BranchId { get; set; }
    public string BranchName { get; set; }
    public DateTime OrderDate { get; set; }
    public string OrderDatePersian => OrderDate.ToPersianDateString("{0}/{1}/{2}");
    public short ReturnReasonId { get; set; }
    public string Note { get; set; }
    public int AccountGLId { get; set; }
    public string AccountGLName { get; set; }
    public int AccountSGLId { get; set; }
    public string AccountSGLName { get; set; }
    public short NoSeriesId { get; set; }
    public string NoSeriesName { get; set; }
    public int AccountDetailId { get; set; }
    public string AccountDetailName { get; set; }
    public byte InOut { get; set; }
    public string InOutName => InOut == 1 ? "1-بدهکار" : "2-بستانکار";
    public byte ActionId { get; set; }
    public byte DocumentTypeId { get; set; }
    public int CategoryItemId { get; set; }
    public string CategoryName { get; set; }
    public int TreasurySubjectId { get; set; }
}