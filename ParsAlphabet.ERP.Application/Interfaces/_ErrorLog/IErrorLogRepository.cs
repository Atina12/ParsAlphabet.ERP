namespace ParsAlphabet.ERP.Application.Interfaces._ErrorLog;

public interface IErrorLogRepository
{
    Task<MyResultQuery> Insert(string errmessage, int userid, string ipaddress, string path);
}