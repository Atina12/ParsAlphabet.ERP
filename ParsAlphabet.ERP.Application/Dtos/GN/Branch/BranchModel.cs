using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.GN.Branch;

[DisplayName("Branch")]
public class BranchModel : CompanyViewModel
{
    public short Id { get; set; }
    public int? CentralId { get; set; }

    [Display(Name = "نام شعبه")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string Name { get; set; }

    public short StateId { get; set; }
    public int CityId { get; set; }
    public decimal? Longitude { get; set; }
    public decimal? Latitude { get; set; }
    public string Address { get; set; }
    public bool IsActive { get; set; }
    public bool IsSecondLang { get; set; }

    [NotMapped] public string Opr => Id == 0 ? "Ins" : "Upd";

    public List<BranchLinesModel> BranchLineJsonList { get; set; }

    public int CreateUserId { get; set; }
    public DateTime CreateDateTime => DateTime.Now;
}

public class BranchLinesModel
{
    public byte BranchLineTypeId { get; set; }
    public string Value { get; set; }
}