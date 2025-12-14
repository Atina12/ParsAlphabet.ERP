namespace ParsAlphabet.ERP.Application.Dtos.FM.PostingGroup;

public class PostingGroupGetPage : CompanyViewModel
{
    public int Id { get; set; }
    public int HeaderId { get; set; }
    public string HeaderName { get; set; }
}

public class PostingGroupTreasurySubjectGetPage : PostingGroupGetPage
{
    public string CashFlowCategoryName { get; set; }
    public string FlowTypeName { get; set; }
    public short StageId { get; set; }
    public string StageName { get; set; }
    public bool IsActive { get; set; }
    public bool IsPostingGroup { get; set; }
}

public class PostingGroupGetPageLine
{
    public int HeaderId { get; set; }
    public string HeaderName { get; set; }

    public int Id { get; set; }
    public short StageId { get; set; }
    public string StageName { get; set; }
    public byte FundTypeId { get; set; }
    public string FundTypeName { get; set; }

    public int AccountGLId { get; set; }
    public int AccountSGLId { get; set; }
}

public class PostingGroupBankAccountGetPage : PostingGroupGetPage
{
    public string BankName { get; set; }
    public string AccountCategoryName { get; set; }
    public string BranchNo { get; set; }
    public string BranchName { get; set; }
    public string AccountNo { get; set; }
    public string CountryName { get; set; }
    public bool IsActive { get; set; }
    public bool IsPostingGroupLine { get; set; }
}

public class PostingGroupBranchGetPage : PostingGroupGetPage
{
    public short BranchId { get; set; }
    public string BranchName { get; set; }
    public bool IsActive { get; set; }
    public bool IsPostingGroupLine { get; set; }
}

public class PostingGroupAdmissionGetPage : PostingGroupGetPage
{
    public bool IsPostingGroup { get; set; }
    public bool IsPostingGroupLine { get; set; }
}

public class PostingGroupWarehouseGetPage : PostingGroupGetPage
{
    public bool IsPostingGroup { get; set; }
}

public class PostingGroupTreasuryGetPage : PostingGroupGetPage
{
    public bool IsPostingGroup { get; set; }
}

public class GetPostingGroupRecord : CompanyViewModel
{
    public byte PostingGroupType { get; set; }
    public int Id { get; set; }
    public int LineId { get; set; }
    public short? BranchId { get; set; }
    public short StageId { get; set; }
}

public class PostingGroupGetRecord
{
    public int Id { get; set; }
    public int HeaderId { get; set; }
    public short StageId { get; set; }
    public string StageName { get; set; }
    public byte FundTypeId { get; set; }
    public string FundTypeName { get; set; }
    public byte DocumentTypeId { get; set; }
    public string DocumentTypeName { get; set; }
    public short BranchId { get; set; }
    public int StageFundTypeId { get; set; }
    public byte PostingGroupTypeId { get; set; }
    public int AccountGLId { get; set; }
    public string AccountGLName { get; set; }
    public string AccountGL => IdAndTitle(AccountGLId, AccountGLName);
    public int AccountSGLId { get; set; }
    public string AccountSGLName { get; set; }
    public string AccountSGL => IdAndTitle(AccountSGLId, AccountSGLName);
    public bool IsActive { get; set; }
    public DateTime? CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateStringNull("{0}/{1}/{2} {3}:{4}");
}

public class GetPostingGroupDetailList : CompanyViewModel
{
    public int Id { get; set; }
    public byte PostingGroupTypeId { get; set; }
}

public class PostingGroupDetailList
{
    public int Id { get; set; }
    public short BranchId { get; set; }
    public string BranchName { get; set; }
    public byte DocumentTypeId { get; set; }
    public string DocumentTypeName { get; set; }
    public int AccountGLId { get; set; }
    public string AccountGLName { get; set; }
    public int AccountSGLId { get; set; }
    public string AccountSGLName { get; set; }
    public DateTime? CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateStringNull("{0}/{1}/{2} {3}:{4}");
    public bool IsActive { get; set; }
    public string ModifiedDateTimePersian { get; set; }
}

public class PostingGroupLineDetailList
{
    public int Id { get; set; }
    public short BranchId { get; set; }
    public short StageId { get; set; }
    public string StageName { get; set; }
    public byte FundItemId { get; set; }
    public short ItemCategoryId { get; set; }
    public string ItemCategoryName { get; set; }
    public string ItemCategory => IdAndTitle(ItemCategoryId, ItemCategoryName);
    public string FundItemName { get; set; }
    public byte StageFundItemType { get; set; }
    public byte InOut { get; set; }
    public string InOutName => InOut == 1 ? "1 - بدهکار" : "2 - بستانکار";
    public string inOutNames => InOut == 1 ? "1 - دریافت" : "2 - پرداخت";

    public int AccountGLId { get; set; }
    public string AccountGLName { get; set; }
    public string AccountGL => IdAndTitle(AccountGLId, AccountGLName);
    public int AccountSGLId { get; set; }
    public string AccountSGLName { get; set; }
    public string AccountSGL => IdAndTitle(AccountSGLId, AccountSGLName);
    public DateTime? CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateStringNull("{0}/{1}/{2} {3}:{4}");
    public bool IsActive { get; set; }
    public string ModifiedDateTimePersian { get; set; }
    public byte PostingGroupTypeLineId { get; set; }
    public string PostingGroupTypeLineName { get; set; }
}

public class PostingGroupSaveResultQuery : MyResultQuery
{
    public bool HasHeader { get; set; }
    public int LineId { get; set; }
}

public class GetPostingGroupAccountGLSGLInfo : CompanyViewModel
{
    public int HeaderId { get; set; }
    public short StageId { get; set; }
    public short BranchId { get; set; }
    public byte PostingGroupTypeId { get; set; }
}

public class PostingGroupAccountGLSGLInfo
{
    public int AccountGLId { get; set; }
    public string AccountGLName { get; set; }
    public int AccountSGLId { get; set; }
    public string AccountSGLName { get; set; }
    public byte AccountDetailRequired { get; set; }
    public int AccountDetailId { get; set; }
    public string AccountDetailName { get; set; }
    public byte DocumentTypeId { get; set; }
    public string DocumentTypeName { get; set; }
}

public class GetPostingGroup : CompanyViewModel
{
    public int HeaderId { get; set; }
    public short StageId { get; set; }
    public byte FundTypeId { get; set; }
    public byte ItemTypeId { get; set; }
    public short ItemCategoryId { get; set; }

    public PostingGroupType PostingGroupTypeId { get; set; }
    public short BranchId { get; set; }
    public int AccountDetailId { get; set; }
    public decimal GrossAmount { get; set; }
    public decimal VATAmount { get; set; }
    public decimal DiscountValue { get; set; }
}

public class PostingGroupbyTypeLineModel
{
    public int AccountGLId { get; set; }
    public int AccountSGLId { get; set; }
    public int AccountDetailId { get; set; }
    public short NoSeriesId { get; set; }
    public byte WorkflowCategoryId { get; set; }
    public byte PostingGroupTypeLineId { get; set; }
    public byte PostingGroupTypeId { get; set; }
    public short CategoryId { get; set; }
    public string CategoryName { get; set; }
    public short AccountCategoryId { get; set; }
    public byte IncomeBalanceId { get; set; }
    public bool IsLast { get; set; }
}

public class GetPostingGroupLastAcount
{
    public long ObjectId { get; set; }
    public int WorkflowCategoryId { get; set; }
}

public class PostingGroupLastAcountModel
{
    public int AccountGLId { get; set; }
    public int AccountSGLId { get; set; }

    public int AccountDetailId { get; set; }
    public short NoSeriesId { get; set; }

    public byte PostingGroupTypeLineId { get; set; }
    public byte PostingGroupTypeId { get; set; }
    public short ItemCategoryId { get; set; }

    public byte InOut { get; set; }

    public byte IncomeBalanceId { get; set; }

    public byte AccountDetailRequired { get; set; }
}