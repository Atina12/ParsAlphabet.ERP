namespace ParsAlphabet.ERP.Application.Dtos.FM.PostingGroup;

public class PostingGroupModel : CompanyViewModel
{
    public string Opr => Id == 0 ? "Ins" : "Upd";
    public int Id { get; set; }
    public int HeaderId { get; set; }
    public byte PostingGroupTypeId { get; set; }
    public byte StageFundItemType { get; set; }
    public int AccountGLId { get; set; }
    public int AccountSGLId { get; set; }
    public short AccountCategoryId { get; set; }
    public byte IncomeBalanceId { get; set; }
    public int AccountDetailId { get; set; }
    public short BranchId { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreateDateTime { get; set; } = DateTime.Now;
}

public class PostingGroupHeaderModel : PostingGroupModel
{
    public byte IJ { get; set; }
    public int PostingGroupHeaderId { get; set; }
    public short StageId { get; set; }
    public byte FundTypeId { get; set; }
    public int StageIdentityId { get; set; }
    public byte IdentityTypeId { get; set; }
    public byte? DocumentTypeId { get; set; }

    public byte StageClassId { get; set; }
}

public class PostingGroupLineModel : PostingGroupModel
{
    public int PostingGroupLineId { get; set; }
    public short StageId { get; set; }
    public byte FundItemId { get; set; }
    public short ItemCategoryId { get; set; }
    public int? PostingGroupTypeLineId { get; set; }

    public int StageIdentityId { get; set; }
    public byte IdentityTypeId { get; set; }
    public byte InOut { get; set; }
}