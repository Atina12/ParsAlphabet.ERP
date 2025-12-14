using Newtonsoft.Json;

namespace ParsAlphabet.ERP.Application.Dtos.MC.Bundle;

public class BundelGetPage
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int BranchId { get; set; }
    public string BranchName { get; set; }
    public string Branch => IdAndTitle(BranchId, BranchName);


    public int CashierId { get; set; }
    public string CashierName { get; set; }
    public string Cashier => IdAndTitle(CashierId, CashierName);
    public string KioskIpAddress { get; set; }

    public byte Type { get; set; }

    public string TypeName
    {
        get
        {
            if (Type == 1)
                return "آقایان";
            if (Type == 2)
                return "بانوان";

            return "عمومی";
        }
    }

    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString();
    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public string CreateUser => IdAndTitle(CreateUserId, CreateUserFullName);
    public bool IsActive { get; set; }
}

public class BundelGetRecord
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string NameEng { get; set; }

    public int BranchId { get; set; }
    public string BranchName { get; set; }
    public string Branch => IdAndTitle(BranchId, BranchName);
    public byte Type { get; set; }
    public int CashierId { get; set; }
    public bool IsActive { get; set; }
    public short Priority { get; set; }

    public string BundleLineJSON { get; set; }

    public List<BundleLineList> BundleLineList => JsonConvert.DeserializeObject<List<BundleLineList>>(BundleLineJSON);
}

public class BundleLineList
{
    public int Id { get; set; }
    public int ItemTypeId { get; set; }
    public string ItemTypeName { get; set; }
    public string ItemType => IdAndTitle(ItemTypeId, ItemTypeName);
    public int ItemId { get; set; }
    public string ItemName { get; set; }
    public string Item => IdAndTitle(ItemId, ItemName);
    public int ItemUnitId { get; set; }
    public string ItemUnitName { get; set; }
    public string ItemUnit => IdAndTitle(ItemUnitId, ItemUnitName);

    public int ItemSubUnitId { get; set; }
    public string ItemSubUnitName { get; set; }
    public string ItemSubUnit => IdAndTitle(ItemSubUnitId, ItemSubUnitName);
    public decimal Ratio { get; set; }
    public string AttributeIds { get; set; }
    public string AttributeName { get; set; }
    public string Attribute => IdAndTitle(AttributeIds, AttributeName);
    public int Qty { get; set; }
    public decimal QtyFinal { get; set; }
}

public class BundleViewModel
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int CashierId { get; set; }
    public short BranchId { get; set; }
    public byte Type { get; set; }
    public int CreateUserId { get; set; }
    public DateTime CreateDateTime => DateTime.Now;
    public bool IsActive { get; set; }
    public List<BundleLineDetail> BundleLineList { get; set; }
}

public class BundleLineDetail
{
    public int ItemTypeId { get; set; }
    public int ItemId { get; set; }
    public int? ItemUnitId { get; set; }
    public int? ItemSubUnitId { get; set; }
    public string AttributeIds { get; set; }
    public decimal Ratio { get; set; }
    public int Qty { get; set; }
}