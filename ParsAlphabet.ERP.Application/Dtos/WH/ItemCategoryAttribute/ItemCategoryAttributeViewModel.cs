namespace ParsAlphabet.ERP.Application.Dtos.WH.ItemCategoryAttribute;

public class ItemAttributeList
{
    public int RowNumber { get; set; }
    public short ItemAttributeId { get; set; }
    public string ItemAttributeName { get; set; }
    public short ItemAttributeLineId { get; set; }
    public string ItemAttributeLineName { get; set; }

    public string ItemAttributeLineNameId =>
        //if (ItemAttributeId == 6)
        //{
        //    var item = Convert.ToByte(ItemAttributeLineName);
        //    return Common.SexDisplayName((Sex)item);
        //}
        //else
        ItemAttributeLineName;
}

public class ItemCategoryAttributeAssign
{
    public short ItemCategoryId { get; set; }
    public string ItemAttributeLineIds { get; set; }
}