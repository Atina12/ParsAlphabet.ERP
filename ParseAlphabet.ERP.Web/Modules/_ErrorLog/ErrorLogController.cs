using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Interfaces._ErrorLog;

namespace ParseAlphabet.ERP.Web.Modules._ErrorLog;

[Route("errorlog")]
public class ErrorLogController : ControllerBase
{
    private readonly IConfiguration _configuration;

    private readonly IErrorLogRepository _ErrorLogRepository;

    public ErrorLogController(IErrorLogRepository ErrorLogRepository, IConfiguration configuration)
    {
        _ErrorLogRepository = ErrorLogRepository;
        _configuration = configuration;
    }

    [Route("logtodb")]
    [AllowAnonymous]
    [HttpGet]
    public string LogToDb()
    {
        try
        {
            var context = HttpContext.Features.Get<IExceptionHandlerFeature>();
            var msg = string.Empty;

            var errorLogIsComplete = _configuration.GetValue<string>("ErrorLogs:IsComplete");

            if (bool.Parse(errorLogIsComplete))
                msg = context.Error.ToString();
            else
                msg = context.Error.Message;


            var path = ((ExceptionHandlerFeature)context).Path;
            var userId = User.FindFirstValue("UserId") != null ? int.Parse(User.FindFirstValue("UserId")) : 999;
            var ip = User.FindFirstValue("IpAddress");

            if (msg.StartsWith("Login failed for user"))
                return "امکان ارتباط با بانک اطلاعاتی بدلیل خطای لاگین ، وجود ندارد";
            if (msg.StartsWith(
                    "A network-related or instance-specific error occurred while establishing a connection to SQL Server"))
                return "امکان ارتباط با بانک اطلاعاتی بدلیل اشکال در شبکه ، وجود ندارد";
            if (msg.StartsWith("Cannot connect to the SQL Server. The original error is: Timeout expired"))
                return "امکان ارتباط با بانک اطلاعاتی بدلیل اتمام زمان پاسخگویی سرور ، وجود ندارد";
            if (msg.StartsWith("The DELETE statement conflicted with the REFERENCE constraint"))
                return "شناسه مورد نظر دارای گردش می باشد ، مجاز به حذف نمی باشید";
            _ErrorLogRepository.Insert(msg, userId, ip, path);

            return "";
        }
        catch (Exception e)
        {
            Console.WriteLine(e.Message);
            return "";
        }
    }
}