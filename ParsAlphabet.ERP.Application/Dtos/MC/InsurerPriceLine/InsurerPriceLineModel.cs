namespace ParsAlphabet.ERP.Application.Dtos.MC.InsurerPriceLine;

public class InsurerPriceLineModel : CompanyViewModel
{
    public string Opr => Id == 0 ? "Ins" : "Upd";
    public int Id { get; set; }
    public int InsurerId { get; set; }
    public int? InsurerLineId { get; set; }
    public int MedicalItemPriceId { get; set; }
    public int InsurerPriceCalculationMethodId { get; set; }
    public decimal InsurerPrice { get; set; }
    public decimal InsurerSharePer { get; set; }
    public int CreateUserId { get; set; }
    public DateTime CreateDateTime { get; set; } = DateTime.Now;
}