using System.ComponentModel;

namespace ParsAlphabet.ERP.Application.Dtos.FA.FixedAsset;

[DisplayName("FixedAsset")]
public class FixedAssetModel : CompanyViewModel
{
    public int Id { get; set; }
    public int ItemId { get; set; }
    public byte MainAssetComponent { get; set; }
    public int? FixedAssetId { get; set; }
    public short FixedAssetSubClassId { get; set; }
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
    public byte? DepreciationPeriodType { get; set; }
    public byte? DepreciationPeriod { get; set; }
    public bool DepreciationEnable { get; set; }
    public bool IsActive { get; set; }
}