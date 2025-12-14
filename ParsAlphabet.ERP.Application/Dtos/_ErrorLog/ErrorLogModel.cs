namespace ParsAlphabet.ERP.Application.Dtos._ErrorLog;

public class ErrorLogModel
{
    public int Id { get; set; }
    public DateTime ErrorDateTime { get; set; }
    public int ErrorCode { get; set; }
    public string ErrorMessage { get; set; }
    public int UserId { get; set; }
    public string Path { get; set; }
    public string IPAddress { get; set; }
    public string ComputerName { get; set; }
}