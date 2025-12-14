using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace ParsAlphabet.ERP.Application.Dtos.MC.Bundle;

[DisplayName("Bundle")]
public class BundleModel
{
    public int Id { get; set; }

    [Required(ErrorMessage = "{0} را وارد کنید")]
    public string Name { get; set; }

    public short BranchId { get; set; }

    public short StageId { get; set; }

    public int CreateUserId { get; set; }

    public DateTime CreateDateTime { get; set; }
}