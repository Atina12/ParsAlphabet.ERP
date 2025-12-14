using System.ComponentModel.DataAnnotations;

namespace ParsAlphabet.ERP.Application.Dtos.MC.Insurance;

public class InsuranceModel : CompanyViewModel
{
    public short Id { get; set; }
    public string Opr => Id == 0 ? "Ins" : "Upd";

    [Display(Name = "نام بیمه")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string Name { get; set; }

    public byte? InsurerTypeId { get; set; }
    public string InsurerTerminologyId { get; set; }
    public bool IsActive { get; set; }
    public List<InsuranceBoxList> InsuranceBoxList { get; set; }
    public int CreateUserId { get; set; }
    public DateTime CreateDateTime { get; set; } = DateTime.Now;
}

public class InsuranceBoxList
{
    public short Id { get; set; }
    public string Name { get; set; }
    public string InsuranceBoxTerminologyId { get; set; }
    public int InsurerId { get; set; }
    public bool IsActive { get; set; }
}