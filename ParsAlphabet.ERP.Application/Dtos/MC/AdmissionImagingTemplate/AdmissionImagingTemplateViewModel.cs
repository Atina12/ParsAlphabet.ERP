using System.Web;

namespace ParsAlphabet.ERP.Application.Dtos.MC.AdmissionImagingTemplate;

public class AdmissionImagingTemplateGetPage
{
    public int Id { get; set; }
    public string Subject { get; set; }
    public string Code { get; set; }
    public string AttenderFullName { get; set; }
    public int AttenderId { get; set; }
    public string Attender => IdAndTitle(AttenderId, AttenderFullName);
    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString();
}

public class AdmissionImagingTemplateGetRecord
{
    public int Id { get; set; }
    public string Code { get; set; }
    public string Subject { get; set; }
    public int AttenderId { get; set; }
    public DateTime CreateDateTime { get; set; } = DateTime.Now;
    public string TemplateContent => HttpUtility.HtmlDecode(Template);
    public string Template { get; set; }
}