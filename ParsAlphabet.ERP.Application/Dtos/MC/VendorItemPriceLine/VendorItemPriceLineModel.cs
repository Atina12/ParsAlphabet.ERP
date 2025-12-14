namespace ParsAlphabet.ERP.Application.Dtos.MC.VendorItemPriceLine;

public class VendorItemPriceLineModel : CompanyViewModel
{
    public string Opr { get; set; }
    public List<ItemIds> Assign { get; set; }
    public short ContractTypeId { get; set; }
    public int VendorId { get; set; }
    public byte PriceTypeId { get; set; }
    public decimal CommisionValue { get; set; }
    public int CreateUserId { get; set; }
    public DateTime CreateDateTime => DateTime.Now;
}

public class ItemIds
{
    public int ItemId { get; set; }
}