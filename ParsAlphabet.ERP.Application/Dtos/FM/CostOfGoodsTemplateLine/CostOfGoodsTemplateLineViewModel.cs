namespace ParsAlphabet.ERP.Application.Dtos.FM.CostOfGoodsTemplateLine;

public class CostOfGoodsTemplateLineGetPage
{
    public int CostOfGoodsTemplateLineId { get; set; }
    public short ItemCategoryId { get; set; }
    public string ItemCategoryName { get; set; }
    public string ItemCategory => IdAndTitle(ItemCategoryId, ItemCategoryName);

    public byte ItemTypeId { get; set; }
    public string ItemTypeName { get; set; }
    public string ItemType => IdAndTitle(ItemTypeId, ItemTypeName);

    public int CostRelationId { get; set; }
    public int CostObjectId { get; set; }
    public string CostObjectName { get; set; }
    public string CostObject => IdAndTitle(CostObjectId, CostObjectName);

    public bool IsAllocated { get; set; }
}

public class CostOfGoodsTemplateLineGetRecord
{
    public int Id { get; set; }
    public int HeaderId { get; set; }
    public short ItemCategoryId { get; set; }
    public byte ItemTypeId { get; set; }
    public int CostRelationId { get; set; }
    public int CostObjectId { get; set; }
    public byte IsAllocated { get; set; }
    public bool IsActive { get; set; }
}

public class CostRelationDropDown
{
    public short Id { get; set; }
    public byte ItemTypeId { get; set; }
    public string ItemTypeName { get; set; }
    public byte CostObjectId { get; set; }
    public string CostObjectName { get; set; }
    public bool IsAllocated { get; set; }
    public string Allocated => IsAllocated ? "تسهیم شده" : "تسهیم نشده";

    public string Name => $"{CostObjectId} - {CostObjectName} , {ItemTypeId} - {ItemTypeName},{Allocated}";
}

public class CostobjectAllocateModel
{
    public byte ItemTypeId { get; set; }
    public int CostRelationId { get; set; }
}