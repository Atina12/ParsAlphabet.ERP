namespace ParsAlphabet.ERP.Application.Dtos.FM.CostOfGoodsTemplate;

public class CostOfGoodsTemplateGetPage : CompanyViewModel
{
    public int CostOfGoodsTemplateId { get; set; }
    public string CostOfGoodsTemplateName { get; set; }
    public short StageId { get; set; }
    public string StageName { get; set; }
    public string Stage => IdAndTitle(StageId, StageName);
    public int CostDriverId { get; set; }
    public string CostDriverName { get; set; }
    public string CostDriver => IdAndTitle(CostDriverId, CostDriverName);
    public bool IsActive { get; set; }
    public string Description { get; set; }
}

public class CostOfGoodsTemplateGetRecord
{
    public int Id { get; set; }
    public string Name { get; set; }
    public short StageId { get; set; }
    public int CostDriverId { get; set; }
    public bool IsActive { get; set; }
    public string Description { get; set; }
}