using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.FM.DocumentType;

[DisplayName("DocumentType")]
public class DocumentTypeModel
{
    public bool IsSecondLang { get; set; }
    public byte Id { get; set; }

    [Display(Name = "نام")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string Name { get; set; }

    [Display(Name = "دسته بندی جریان کار")]
    [Required(ErrorMessage = "{0} را انتخاب کنید")]
    public byte WorkflowCategoryId { get; set; }

    [NotMapped] public string Opr { get; set; }

    public bool IsActive { get; set; }
}