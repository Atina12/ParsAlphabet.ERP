using Newtonsoft.Json;

namespace ParsAlphabet.ERP.Application.Dtos.WH.ItemCategory;

public class ItemCategoryGetPage
{
    public short Id { get; set; }
    public string Name { get; set; }
    public string ItemTypeName { get; set; }
    public byte ItemTypeId { get; set; }
    public string ItemType => ItemTypeId == 0 ? "" : $"{ItemTypeId} - {ItemTypeName}";
    public bool IsActive { get; set; }
    public string ItemAttributeIds { get; set; }
    public int StatusShowLine { get; set; }
}

public class ItemCategoryGetRecord
{
    public short Id { get; set; }
    public string Name { get; set; }
    public byte ItemTypeId { get; set; }
    public bool IsActive { get; set; }
    public string ItemAttributeIds { get; set; }
    public int CountItemCategoryAttribute { get; set; }
}

public class ItemAttributeAssignList
{
    public int ItemAttributeLineId { get; set; }
    public string ItemAttributeLineName { get; set; }
    public string ItemAttributeName { get; set; }
    public bool IsActive { get; set; }
    public string ItemCategoryName { get; set; }
}

public class ItemAttributeDiAssignList
{
    public int ItemAttributeLineId { get; set; }
    public string ItemAttributeLineName { get; set; }
    public string ItemAttributeName { get; set; }
    public bool IsActive { get; set; }
}

public class GetItemAttribuetDropDownList
{
    public string JsonItemAttribuet { get; set; }

    public List<MyDropDownViewModel> ItemAttribuetList
        => JsonConvert.DeserializeObject<List<MyDropDownViewModel>>(JsonItemAttribuet);
}