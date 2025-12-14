using System.ComponentModel.DataAnnotations;

namespace ParsAlphabet.ERP.Application.Dtos.FM.CostOfGoodsTemplate;

public class CostOfGoodsTemplateModel : CompanyViewModel
{
    public string Opr => Id == 0 ? "Ins" : "Upd";
    public int Id { get; set; }

    [Display(Name = "نام")]
    [Required(ErrorMessage = "{0} را انتخاب کنید")]
    public string Name { get; set; }

    public short StageId { get; set; }
    public int CostDriverId { get; set; }
    public bool IsActive { get; set; }
    public string Description { get; set; }
}