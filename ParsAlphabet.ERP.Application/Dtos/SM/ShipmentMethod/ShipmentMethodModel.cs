using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.SM.ShipmentMethod;

[DisplayName("ShipmentMethod")]
public class ShipmentMethodModel : CompanyViewModel
{
    public int Id { get; set; }
    public string Name { get; set; }

    [NotMapped] public string TableName { get; set; }

    [NotMapped] public string Opr => Id == 0 ? "Ins" : "Upd";

    public bool IsSecondLang { get; set; }
}