namespace ParsAlphabet.ERP.Application.Dtos.FM.CostOfGoodsTemplateLine;

public class CostOfGoodsTemplateLineModel
{
    public string Opr => Id == 0 ? "Ins" : "Upd";
    public int Id { get; set; }
    public int HeaderId { get; set; }
    public short ItemCategoryId { get; set; }
    public byte ItemTypeId { get; set; }
    public int CostObjectId { get; set; }
    public byte IsAllocated { get; set; }
}