namespace ParseAlphabet.ERP.Web.Modules._History;

public class HistoryModel : CompanyViewModel
{
    public string ControllerName { get; set; }
    public string ActionName { get; set; }
    public int UserId { get; set; }
    public string Description { get; set; }
    public string Browser { get; set; }
    public string OperatingSystem { get; set; }
    public string IpAddress { get; set; }
    public DateTime CreateDate { get; set; } = DateTime.Now;
}