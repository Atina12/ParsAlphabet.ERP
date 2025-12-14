namespace ParsAlphabet.ERP.Application.Dtos.SM.CustomerSalesPrice;

public class CustomerSalesPriceGetPage
{
    public int Id { get; set; }
    public byte ItemTypeId { get; set; }
    public string ItemTypeName { get; set; }
    public string ItemType => ItemTypeId == 0 ? "" : $"{ItemTypeId} - {ItemTypeName}";
    public int ItemId { get; set; }
    public string ItemName { get; set; }
    public string Item => IdAndTitle(ItemId, ItemName);
    public short CategoryId { get; set; }
    public string CategoryName { get; set; }
    public string Category => IdAndTitle(CategoryId, CategoryName);

    public byte CurrencyId { get; set; }
    public string CurrencyName { get; set; }
    public string Currency => IdAndTitle(CurrencyId, CurrencyName);

    public int PricingModelId { get; set; }
    public string PricingModelName { get; set; }
    public string PricingModel => IdAndTitle(PricingModelId, PricingModelName);
    public decimal MinPrice { get; set; }
    public decimal MaxPrice { get; set; }
    public string ContractTypeName { get; set; }
    public string PriceTypeName { get; set; }
    public decimal ComissionPrice { get; set; }
    public int VendorId { get; set; }
    public string VendorName { get; set; }
    public string Vendor => IdAndTitle(VendorId, VendorName);

    public bool AllowInvoiceDisc { get; set; }
    public bool PriceIncludingVAT { get; set; }
    public bool IsActive { get; set; }
}

public class CustomerSalesPriceGetRecord : CompanyViewModel
{
    public int Id { get; set; }

    public byte ItemTypeId { get; set; }

    // public string ItemTypeName { get; set; }
    public int ItemId { get; set; }
    public string ItemName { get; set; }
    public byte CurrencyId { get; set; }
    public byte PricingModelId { get; set; }
    public decimal MinPrice { get; set; }
    public decimal MaxPrice { get; set; }
    public bool AllowInvoiceDisc { get; set; }
    public short CustomerDiscGroupId { get; set; }
    public bool PriceIncludingVAT { get; set; }
    public byte ContractTypeId { get; set; }
    public byte PriceTypeId { get; set; }
    public decimal ComissionPrice { get; set; }
    public int VendorId { get; set; }
    public bool IsActive { get; set; }
    public List<ID> CustomerSalesPriceDetail { get; set; } = new();
}

public class GetCustomerSalesPriceItemId : CompanyViewModel
{
    public byte ItemTypeId { get; set; }
    public byte CurrencyId { get; set; }
    public short ItemId { get; set; }
}