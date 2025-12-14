namespace ParsAlphabet.ERP.Application.Dtos.SM.CustomerDiscountGroup;

public class CustomerDiscountGroupGetPage
{
    public int Id { get; set; }
    public short PersonGroupId { get; set; }
    public string PersonGroupName { get; set; }
    public string PersonGroup => IdAndTitle(PersonGroupId, PersonGroupName);
    public short PriceTypeId { get; set; }
    public string PriceTypeName { get; set; }
    public string PriceType => IdAndTitle(PriceTypeId, PriceTypeName);
    public int MinQuantity { get; set; }
    public int MinQuantitySale { get; set; }
    public decimal Price { get; set; }
    public bool IsActive { get; set; }

    public string LastModifiedDateTimePersian =>
        LastModifiedDateTime.HasValue ? LastModifiedDateTime.Value.ToPersianDateString() : null;

    public DateTime? LastModifiedDateTime { get; set; }
}