namespace ParsAlphabet.ERP.Application.Dtos.MC.AttenderServicePriceLine;

public class AttenderServicePriceLineModel
{
    public int AttenderId { get; set; }
    public List<ServiceAndSubjectIds> Assign { get; set; }
    public int AttenderMarginBracketId { get; set; }
    public int CompanyId { get; set; }
    public int CreateUserId { get; set; }
    public DateTime CreateDateTime { get; set; } = DateTime.Now;
}

public class ServiceAndSubjectIds
{
    public int ServiceId { get; set; }
    public int MedicalSubjectId { get; set; }
}