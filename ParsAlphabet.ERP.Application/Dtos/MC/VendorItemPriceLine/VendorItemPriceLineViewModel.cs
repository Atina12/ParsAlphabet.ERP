namespace ParsAlphabet.ERP.Application.Dtos.MC.VendorItemPriceLine;

public class VendorItemPriceAssignGetPage
{
    public List<VendorItemPriceAssignList> Assigns { get; set; }
}

public class VendorItemPriceDiAssignGetPage
{
    public List<VendorItemPriceDiAssignList> Assigns { get; set; }
}

public class VendorItemPriceDiAssignList
{
    public int ItemId { get; set; }
    public string ItemName { get; set; }
    public string Item => IdAndTitle(ItemId, ItemName);
    public byte ItemTypeId { get; set; }
    public string ItemTypeName { get; set; }
    public string ItemType => IdAndTitle(ItemTypeId, ItemTypeName);

    public byte ContractTypeId { get; set; }
    public string ContractTypeName { get; set; }
    public string ContractType => IdAndTitle(ContractTypeId, ContractTypeName);

    public int VendorId { get; set; }
    public string VendorFullName { get; set; }
    public string Vendor => IdAndTitle(VendorId, VendorFullName);
}

public class VendorItemPriceAssignList
{
    public int VendorItemPriceId { get; set; }

    public int ItemId { get; set; }
    public string ItemName { get; set; }
    public string Item => IdAndTitle(ItemId, ItemName);

    public byte ItemTypeId { get; set; }
    public string ItemTypeName { get; set; }
    public string ItemType => IdAndTitle(ItemTypeId, ItemTypeName);

    public int PriceTypeId { get; set; }
    public string PriceTypeName { get; set; }
    public string PriceType => IdAndTitle(PriceTypeId, PriceTypeName);

    public int ContractTypeId { get; set; }
    public string ContractTypeName { get; set; }
    public string ContractType => IdAndTitle(ContractTypeId, ContractTypeName);

    public decimal CommissionValue { get; set; }

    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public string CreateUser => IdAndTitle(CreateUserId, CreateUserFullName);
    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString("{0}/{1}/{2} {3}:{4}");
}

public class CheckExistVendorItemPrice
{
    public int ItemId { get; set; }
    public int VendorId { get; set; }
}

public class VendorItemList
{
    public int ItemId { get; set; }
    public string ItemName { get; set; }
    public string Item => IdAndTitle(ItemId, ItemName);


    public byte ContractTypeId { get; set; }
    public string ContractTypeName { get; set; }
    public string ContractType => IdAndTitle(ContractTypeId, ContractTypeName);
    public byte PriceTypeId { get; set; }
    public string PriceTypeName => PriceTypeId == 1 ? "درصد" : "نرخ";
    public decimal VendorCommissionValue { get; set; }

    public string VendorCommissionValueName =>
        PriceTypeId == 2 ? VendorCommissionValue.ToString("#,##0") : VendorCommissionValue.ToString();
}