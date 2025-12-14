using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.GN.LocCity;

[DisplayName("LocCity")]
public class LocCityModel
{
    //public int TotalRecord { get; set; }
    public int Id { get; set; }

    [Display(Name = "نام شهر")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string Name { get; set; }

    [Display(Name = "نام ولایت")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public short StateId { get; set; }
    //public string Phone_PreCode { get; set; }
    //public short CountryId { get; set; }
    //public byte TerritoryId { get; set; }
    //public decimal? Latitude { get; set; }
    //public decimal? Longitude { get; set; }
    //public short IndexBy { get; set; }

    [NotMapped] public string Opr => Id == 0 ? "Ins" : "Upd";
}