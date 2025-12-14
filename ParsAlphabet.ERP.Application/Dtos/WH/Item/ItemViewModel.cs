using Newtonsoft.Json;

namespace ParsAlphabet.ERP.Application.Dtos.WH.Item;

public class ItemGetPage
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string IdName => IdAndTitle(Id, Name);
    public string ItemTypeName { get; set; }
    public long ItemTypeId { get; set; }
    public string ItemType => IdAndTitle(ItemTypeId, ItemTypeName);

    public long CategoryId { get; set; }
    public string CategoryName { get; set; }
    public string Category => IdAndTitle(CategoryId, CategoryName);
    public long UnitId { get; set; }
    public string UnitName { get; set; }
    public string Unit => IdAndTitle(UnitId, UnitName);
    public bool IsActive { get; set; }
    public DateTime? SubscriptionFromDate { get; set; }
    public string SubscriptionDate { get; set; }
    public string SubscriptionFromDateTimePersian => SubscriptionFromDate.ToPersianDateStringNull("{0}/{1}/{2}");
    public DateTime? SubscriptionToDate { get; set; }
    public string SubscriptionToDateTimePersian => SubscriptionToDate.ToPersianDateStringNull("{0}/{1}/{2}");

    public bool Unlimited { get; set; }
    public bool VatEnable { get; set; }
    public bool PriceIncludingVat { get; set; }
    public bool BarcodeMandatory { get; set; }
    public bool ExclusiveSupplier { get; set; }
    public decimal VatPercent { get; set; }
    public int VatId { get; set; }
    public string VatName { get; set; }
    public short PayrollTaxId { get; set; }
    public string PayrollTaxName { get; set; }
    public string PayrollTax => IdAndTitle(PayrollTaxId, PayrollTaxName);
}

public class ItemGetRecord
{
    public int Id { get; set; }
    public byte ItemTypeId { get; set; }
    public string Name { get; set; }
    public short? CategoryId { get; set; }
    public byte? UnitId { get; set; }
    public bool VATEnable { get; set; }
    public byte VATId { get; set; }
    public bool PriceIncludingVat { get; set; }
    public bool BarcodeMandatory { get; set; }
    public bool ExclusiveSupplier { get; set; }
    public bool? IsActive { get; set; }
    public DateTime? SubscriptionFromDate { get; set; }
    public string SubscriptionFromDatePersian => SubscriptionFromDate.ToPersianDateStringNull();
    public DateTime? SubscriptionToDate { get; set; }
    public string SubscriptionToDatePersian => SubscriptionToDate.ToPersianDateStringNull();
    public bool Unlimited { get; set; }
    public string ItemUnitDetail { get; set; }

    public List<ItemUnitModel> ItemSubDetailList => !string.IsNullOrEmpty(ItemUnitDetail)
        ? JsonConvert.DeserializeObject<List<ItemUnitModel>>(ItemUnitDetail)
        : null;

    public short PayrollTaxId { get; set; }
}

public class ItemInfo
{
    public short? UnitId { get; set; }
    public short CategoryId { get; set; }
    public string CategoryName { get; set; }
    public string CategoryIdName => IdAndTitle(CategoryId, CategoryName);
}

public class ItemVatInfo
{
    public short VATId { get; set; }
    public byte VATPer { get; set; }
    public byte VATTypeId { get; set; }
    public int AccountDetailId { get; set; }
    public short NoSeriesId { get; set; }
    public bool VATEnable { get; set; }
    public bool PriceIncludingVat { get; set; }
    public bool BarcodeMandatory { get; set; }

    public string ItemName { get; set; }
}

public class ItemViewModel : CompanyViewModel
{
    public int Id { get; set; }
    public byte ItemTypeId { get; set; }
    public string Name { get; set; }
    public short CategoryId { get; set; }
    public short UnitId { get; set; }
    public bool VATEnable { get; set; }
    public short? VATId { get; set; }
    public bool PriceIncludingVat { get; set; }
    public bool BarcodeMandatory { get; set; }
    public bool ExclusiveSupplier { get; set; }
    public bool? IsActive { get; set; }
    public DateTime? SubscriptionFromDate => SubscriptionFromDatePersian.ToMiladiDateTime();
    public string SubscriptionFromDatePersian { get; set; }
    public DateTime? SubscriptionToDate => SubscriptionToDatePersian.ToMiladiDateTime();
    public string SubscriptionToDatePersian { get; set; }
    public bool Unlimited { get; set; }
    public List<ItemUnitModel> ItemUnitDetail { get; set; }
    public short? PayrollTaxId { get; set; }
}

public class ItemUnitModel
{
    public short id { get; set; }
    public int ItemId { get; set; }
    public short UnitId { get; set; }
    public short SubUnitId { get; set; }
    public decimal Ratio { get; set; }
}