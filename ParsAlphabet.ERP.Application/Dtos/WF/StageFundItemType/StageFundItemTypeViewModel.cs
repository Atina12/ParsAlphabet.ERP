namespace ParsAlphabet.ERP.Application.Dtos.WF.StageFundItemType;

public class GetStageFundItemTypeInOut
{
    public byte FundItemTypeId { get; set; }
    public short StageId { get; set; }
}

public class StageFundItemTypeDropDown : MyDropDownViewModel
{
    public byte SelectType { get; set; }
}

public class StageFundItemTypeGetPage : CompanyViewModel
{
    public int Id { get; set; }
    public short StageId { get; set; }
    public string StageName { get; set; }
    public byte? FundTypeId { get; set; }
    public string FundTypeName { get; set; }
    public string FundTypeIdName => $"{FundTypeId} - {FundTypeName}";
    public byte PostingGroupTypeId { get; set; }
    public string PostingGroupTypeName { get; set; }
    public string PostingGroupType => $"{PostingGroupTypeId} - {PostingGroupTypeName}";
    public byte FundItemType { get; set; }
    public string FundItemTypeName { get; set; }
    public string FundItemTypeIdName => $"{FundItemType} - {FundItemTypeName}";
    public byte InOut { get; set; }
    public string InOutIdName => InOut == 1 ? "1 - دریافت" : "2 - پرداخت";
    public int PreviousStageId { get; set; }
    public bool IsActive { get; set; }

    public string PreviousStageName { get; set; }

    //public string PreviousStageName => $"{PreviousStageId} - {PreviousStageName}";
    public long workflowId { get; set; }
    public string stage => $"{StageId} - {StageName}";
}

public class StageFundItemType
{
    public short Id { get; set; }
    public byte FundItemType { get; set; }
}