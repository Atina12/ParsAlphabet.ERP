namespace ParsAlphabet.ERP.Application.Dtos.FA.FixedAsset;

public class FixedAssetGetPage
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string MainAssetComponent { get; set; }
    public int? FixedAssetParentId { get; set; }
    public string TechnicalCode { get; set; }
    public DateTime DepreciationStartDate { get; set; }
    public string DepreciationStartDatePersian => DepreciationStartDate.ToPersianDateString("{0}/{1}/{2}");
    public DateTime DepreciationEndDate { get; set; }
    public string DepreciationEndDatePersian => DepreciationEndDate.ToPersianDateString("{0}/{1}/{2}");
    public byte DepreciationMethodId { get; set; }
    public string DepreciationMethodName { get; set; }
    public string DepreciationMethod => IdAndTitle(DepreciationMethodId, DepreciationMethodName);
    public string SubClassName { get; set; }
    public bool UnderMaintenance { get; set; }
    public bool DepreciationEnable { get; set; }
    public bool IsActive { get; set; }
}

public class FixedAssetAssignList
{
    public List<FixedAssetGetPage> Assigns { get; set; }
}

public class FixedAssetGetRecord
{
    public bool NegativeInventory { get; set; }
    public int Id { get; set; }
    public string Name { get; set; }
    public byte MainAssetComponent { get; set; }
    public int? FixedAssetId { get; set; }
    public byte? UnitId { get; set; }
    public int FixedAssetCategoryId { get; set; }
    public int FixedAssetClassId { get; set; }
    public string FixedAssetClassName { get; set; }
    public short FixedAssetSubClassId { get; set; }
    public string FixedAssetSubClasstName { get; set; }
    public string TechnicalCode { get; set; }
    public byte DepreciationMethodId { get; set; }
    public DateTime? DepreciationStartDate { get; set; }

    public string DepreciationStartDatePersian
    {
        get => DepreciationStartDate.ToPersianDateStringNull("{0}/{1}/{2}");
        set
        {
            var str = value.ToMiladiDateTime();
            DepreciationStartDate = str == null ? null : str.Value;
        }
    }

    public DateTime? DepreciationEndDate { get; set; }

    public string DepreciationEndDatePersian
    {
        get => DepreciationEndDate.ToPersianDateStringNull("{0}/{1}/{2}");
        set
        {
            var str = value.ToMiladiDateTime();
            DepreciationEndDate = str == null ? null : str.Value;
        }
    }

    public bool UnderMaintenance { get; set; }
    public byte DepreciationPeriodType { get; set; }
    public byte DepreciationPeriod { get; set; }
    public bool DepreciationEnable { get; set; }
    public bool VATEnable { get; set; }
    public byte VATId { get; set; }
    public bool IsActive { get; set; }
}

public class FixedAssetInfo
{
    public short UnitId { get; set; }
    public short CategoryId { get; set; }
    public string CategoryName { get; set; }
    public string CategoryIdName => IdAndTitle(CategoryId, CategoryName);
}