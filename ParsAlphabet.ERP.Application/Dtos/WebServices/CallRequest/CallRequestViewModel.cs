namespace ParsAlphabet.ERP.Application.Dtos.WebServices.CallRequest;

public class ResultApiRequest<T>
{
    public int Status { get; set; } = 99;
    public string StatusMessage { get; set; } = "";
    public string Errors { get; set; }
    public T Data { get; set; }
    public DateTime DateTime { get; set; } = DateTime.Now;
    public bool Successfull => Status == 200;
    public string WarningToken { get; set; }
}

public class Error
{
    public string Code { get; set; }
    public int ProblemType { get; set; }
    public int Section { get; set; }
    public string Description { get; set; }
    public string TechnicalInfo { get; set; }
}

//public class RequestHeader
//{
//    public string Key { get; set; }
//    public string Value { get; set; }

//}