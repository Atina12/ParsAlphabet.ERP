using System.Web;

namespace ParsAlphabet.ERP.Application.Dtos.MC.AdmissionImagingTemplate;

public class AdmissionImagingTemplateModel : CompanyViewModel
{
    public string Subject { get; set; }
    public int Id { get; set; }

    public int AttenderId { get; set; }

    //public int UserId { get; set; }
    public DateTime CreateDateTime { get; set; } = DateTime.Now;
    public string TemplateContent { get; set; }
    public string Template => HttpUtility.HtmlEncode(TemplateContent);
    public string Code { get; set; }
}