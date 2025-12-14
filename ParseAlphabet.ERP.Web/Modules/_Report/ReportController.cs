using System.Data;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos._Setup;
using ParsAlphabet.ERP.Application.Interfaces._Setup;
using Stimulsoft.Base;
using Stimulsoft.Base.Drawing;
using Stimulsoft.Report;
using Stimulsoft.Report.Components;
using Stimulsoft.Report.Dictionary;
using Stimulsoft.Report.Export;
using Stimulsoft.Report.Mvc;
using static ParsAlphabet.ERP.Application.Dtos.ReportModel;
using IHostingEnvironment = Microsoft.AspNetCore.Hosting.IHostingEnvironment;

namespace ParseAlphabet.ERP.Web.Modules._Report;

//[Authorize]
//[DisableRequestSizeLimit]
[IgnoreAntiforgeryToken]
public class ReportController : Controller
{
    private readonly IHttpContextAccessor _accessor;
    private readonly IConfiguration _configuration;
    private readonly IHostingEnvironment _hostingEnvironment;
    private readonly ISetupRepository _SetupRepository;

    public ReportController(ISetupRepository SetupRepository, IConfiguration configuration,
        IHttpContextAccessor accessor, IHostingEnvironment hostingEnvironment)
    {
        _SetupRepository = SetupRepository;
        _configuration = configuration;
        _accessor = accessor;
        _hostingEnvironment = hostingEnvironment;
    }

    public IActionResult Index(string strReportModel)
    {
        var reportModel = JsonConvert.DeserializeObject<ReportViewModel>(strReportModel);
        ViewBag.ReportName = reportModel.ReportName;
        return View(Views.Report.ReportIndex);
    }

    public IActionResult Print()
    {
        return View(Views.Report.PrintIndex);
    }

    public IActionResult NewPrint()
    {
        return View(Views.Report.NewPrintIndex);
    }

    public IActionResult GetPrint()
    {
        return View();
    }
    public IActionResult GetPrint(string pUrl = "", string pName = "", string pValue = "", int pType = 0, int pSize = 0,
        bool isPageTable = false, string tableName = "", int keyValue = 0, bool isSecondLang = false)
    {
        var reportModel = new ReportViewModel
        {
            ReportUrl = pUrl
        };

        var parameters = new List<ReportParameter>();

        if (isPageTable)
        {
            var reportParameter01 = new ReportParameter { Item = "@PageNo", Value = "0" };
            var reportParameter02 = new ReportParameter { Item = "@PageRowsCount", Value = "0" };

            parameters.Add(reportParameter01);
            parameters.Add(reportParameter02);
            parameters.Add(new ReportParameter
            { Item = "@TotalRecord", Value = "0", SqlDbType = (int)SqlDbType.Int, Size = 0 });
        }

        if (isSecondLang)
        {
            MyClaim.Init(_accessor);
            var reportParameter03 = new ReportParameter
            { Item = "@IsSecondLang", Value = MyClaim.IsSecondLang.ToString() };
            parameters.Add(reportParameter03);
        }

        if (!string.IsNullOrEmpty(tableName))
            parameters.Add(new ReportParameter
            { Item = "@TableName", Value = $"\"{tableName}\"", SqlDbType = (int)SqlDbType.VarChar, Size = 50 });


        if (!string.IsNullOrEmpty(pName))
        {
            var reportParameter03 = new ReportParameter();

            if (pType == (int)SqlDbType.NVarChar || pType == (int)SqlDbType.VarChar)
                reportParameter03 = new ReportParameter
                { Item = $"@{pName}", Value = $"\"{pValue}\"", SqlDbType = pType, Size = pSize };
            else
                reportParameter03 = new ReportParameter
                { Item = $"@{pName}", Value = $"{pValue}", SqlDbType = pType, Size = pSize };

            parameters.Add(reportParameter03);
        }

        if (keyValue != 0)
        {
            var reportParameter04 = new ReportParameter
            { Item = "@KeyId", Value = $"\"{keyValue}\"", SqlDbType = 8, Size = 0 };
            parameters.Add(reportParameter04);
        }

        reportModel.Parameters = parameters;

        var report = new StiReport();

        //StiLicense.LoadFromString(Report.Lisence);
        var url = reportModel.ReportUrl;
        report.Load(StiNetCoreHelper.MapPath(this, url));

        var dataSource = (StiSqlSource)report.DataSources[0];

        var sqlCommand = dataSource.SqlCommand;

        sqlCommand = sqlCommand.Replace("exec ", "", StringComparison.OrdinalIgnoreCase)
            .Replace("execute ", "", StringComparison.OrdinalIgnoreCase);

        var pos = sqlCommand.IndexOf("@");
        sqlCommand = pos != -1 ? sqlCommand.Substring(0, pos - 1) : sqlCommand;

        var setupInfo = _SetupRepository.GetSetupInfo().Result;
        var shamsiDate = new ShamsiDateTime();
        shamsiDate.Init();

        report["CorpLogo"] = StiImageConverter.StringToImage(setupInfo.LogoBase64);
        report["CorpName"] = setupInfo.Name;
        report["ReportDate"] = shamsiDate.Date;
        report["CurrentUserFullName"] = User.FindFirstValue("FullName");

        var connectionString = _configuration.GetValue<string>("ConnectionStrings:DefaultConnection");

        var sqlDB = new StiSqlDatabase();
        sqlDB = (StiSqlDatabase)report.Dictionary.Databases["Connection"];
        sqlDB.ConnectionString = connectionString;

        dataSource.SqlCommand = sqlCommand;
        var rParams = new StiDataParametersCollection();

        var existCompanyId = report.DataSources[0].Parameters.ToList().Find(a => a.Name == "@CompanyId");

        foreach (var item in reportModel.Parameters)
        {
            var rParam = new StiDataParameter(item.Item, item.SqlDbType, item.Size)
            {
                Value = item.Value.ToString()
            };

            rParams.Add(rParam);
        }

        report.DataSources[0].Parameters = rParams;

        return StiNetCoreViewer.GetReportResult(this, report);
    }


    public IActionResult NewGetPrint(string pUrl, string pName, string pValue, int pType, int pSize,
        bool isPageTable = false, string tableName = "", int keyValue = 0, bool isSecondLang = false)
    {
        var reportModel = new ReportViewModel
        {
            ReportUrl = pUrl
        };

        var parameters = new List<ReportParameter>();

        if (isPageTable)
        {
            var reportParameter01 = new ReportParameter { Item = "@PageNo", Value = "null" };
            var reportParameter02 = new ReportParameter { Item = "@PageRowsCount", Value = "null" };

            parameters.Add(reportParameter01);
            parameters.Add(reportParameter02);
        }

        if (isSecondLang)
        {
            MyClaim.Init(_accessor);
            var reportParameter03 = new ReportParameter
            { Item = "@IsSecondLang", Value = MyClaim.IsSecondLang.ToString() };
            parameters.Add(reportParameter03);
        }

        if (!string.IsNullOrEmpty(tableName))
            parameters.Add(new ReportParameter
            { Item = "@TableName", Value = $"\"{tableName}\"", SqlDbType = (int)SqlDbType.VarChar, Size = 50 });


        if (!string.IsNullOrEmpty(pName))
        {
            var reportParameter03 = new ReportParameter();

            if (pType == (int)SqlDbType.NVarChar || pType == (int)SqlDbType.VarChar)
                reportParameter03 = new ReportParameter
                { Item = $"@{pName}", Value = $"\"{pValue}\"", SqlDbType = pType, Size = pSize };
            else
                reportParameter03 = new ReportParameter
                { Item = $"@{pName}", Value = $"{pValue}", SqlDbType = pType, Size = pSize };

            parameters.Add(reportParameter03);
        }

        if (keyValue != 0)
        {
            var reportParameter04 = new ReportParameter
            { Item = "@KeyId", Value = $"\"{keyValue}\"", SqlDbType = 8, Size = 0 };
            parameters.Add(reportParameter04);
        }

        reportModel.Parameters = parameters;

        var lisence = "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHkcgIvwL0jnpsDqRpWg5FI5kt2G7A0tYIcUygBh1sPs7koivWV0htru4Pn2682yhdY3+9jxMCVTKcKAjiEjgJzqXgLFCpe62hxJ7/VJZ9Hq5l39md0pyydqd5Dc1fSWhCtYqC042BVmGNkukYJQN0ufCozjA/qsNxzNMyEql26oHE6wWE77pHutroj+tKfOO1skJ52cbZklqPm8OiH/9mfU4rrkLffOhDQFnIxxhzhr2BL5pDFFCZ7axXX12y/4qzn5QLPBn1AVLo3NVrSmJB2KiwGwR4RL4RsYVxGScsYoCZbwqK2YrdbPHP0t5vOiLjBQ+Oy6F4rNtDYHn7SNMpthfkYiRoOibqDkPaX+RyCany0Z+uz8bzAg0oprJEn6qpkQ56WMEppdMJ9/CBnEbTFwn1s/9s8kYsmXCvtI4iQcz+RkUWspLcBzlmj0lJXWjTKMRZz+e9PmY11Au16wOnBU3NHvRc9T/Zk0YFh439GKd/fRwQrk8nJevYU65ENdAOqiP5po7Vnhif5FCiHRpxgF";

        var report = new StiReport();
        StiLicense.LoadFromString(lisence);

        //StiLicense.LoadFromString(Report.Lisence);
        var url = reportModel.ReportUrl;
        report.Load(StiNetCoreHelper.MapPath(this, url));

        var dataSource = (StiSqlSource)report.DataSources[0];

        var sqlCommand = dataSource.SqlCommand;

        sqlCommand = sqlCommand.Replace("exec ", "", StringComparison.OrdinalIgnoreCase)
            .Replace("execute ", "", StringComparison.OrdinalIgnoreCase);

        var pos = sqlCommand.IndexOf("@");
        sqlCommand = pos != -1 ? sqlCommand.Substring(0, pos - 1) : sqlCommand;

        var setupInfo = _SetupRepository.GetSetupInfo().Result;
        var shamsiDate = new ShamsiDateTime();
        shamsiDate.Init();

        report["CorpLogo"] = StiImageConverter.StringToImage(setupInfo.LogoBase64);
        report["CorpName"] = setupInfo.Name;
        report["ReportDate"] = shamsiDate.Date;

        var connectionString = _configuration.GetValue<string>("ConnectionStrings:DefaultConnection");

        var sqlDB = new StiSqlDatabase();
        sqlDB = (StiSqlDatabase)report.Dictionary.Databases["Connection"];
        sqlDB.ConnectionString = connectionString;

        dataSource.SqlCommand = sqlCommand;
        var rParams = new StiDataParametersCollection();

        var existCompanyId = report.DataSources[0].Parameters.ToList().Find(a => a.Name == "@CompanyId");

        foreach (var item in reportModel.Parameters)
        {
            var rParam = new StiDataParameter(item.Item, item.SqlDbType, item.Size)
            {
                Value = item.Value.ToString()
            };

            rParams.Add(rParam);
        }

        report.DataSources[0].Parameters = rParams;

        return StiNetCoreViewer.GetReportResult(this, report);
    }

    public IActionResult GetReport(string strReportModel)
    {
        var reportModel = JsonConvert.DeserializeObject<ReportViewModel>(strReportModel);

        var reportVariable = reportModel.Parameters.Where(p => p.ItemType == "Var").ToList();

        var reportParameters = new StiDataParametersCollection();
        var reportValue = string.Empty;


        var parameters = reportModel.Parameters.Where(p => p.ItemType == "Parameter");

        foreach (var param in parameters)
            if (param.Item != "")
            {
                if (param.SqlDbType == (int)SqlDbType.NVarChar || param.SqlDbType == (int)SqlDbType.VarChar)
                    reportValue = param.Value == null ? null : $"\"{param.Value}\"";
                else if (param.SqlDbType == (int)SqlDbType.Date)
                    reportValue = param.Value == null ? null : $"\"{param.Value}\"";
                else
                    reportValue = param.Value == null ? null : $"{param.Value}";

                var reportParameter = new StiDataParameter(param.Item, param.SqlDbType, param.Size)
                {
                    Value = reportValue
                };

                reportParameters.Add(reportParameter);
            }

        var report = new StiReport();
        StiLicense.LoadFromString(Report.Lisence);
        var fonturl = _hostingEnvironment.WebRootPath + "/content/myicon.ttf";
        var url = reportModel.ReportUrl;
        report.Load(StiNetCoreHelper.MapPath(this, url));

        if (report.DataSources.Count > 0)
        {
            var dataSource = (StiSqlSource)report.DataSources[0];
            var sqlCommand = dataSource.SqlCommand;

            var CompanyItemParam = report.DataSources[0].Parameters.ToList()
                .Where(a => a.Name.ToLower().Contains("companyid")).FirstOrDefault();

            report.DataSources[0].Parameters = reportParameters;

            if (CompanyItemParam != null)
            {
                CompanyItemParam.Value = "1";
                report.DataSources[0].Parameters.Add(CompanyItemParam);
            }

            sqlCommand = sqlCommand.ToLower().Replace("exec ", "", StringComparison.OrdinalIgnoreCase)
                .Replace("execute ", "", StringComparison.OrdinalIgnoreCase);

            var pos = sqlCommand.IndexOf("@");
            sqlCommand = pos != -1 ? sqlCommand.Substring(0, pos - 1) : sqlCommand;
            dataSource.SqlCommand = sqlCommand;

            var connectionString = _configuration.GetValue<string>("ConnectionStrings:DefaultConnection");

            var sqlDB = new StiSqlDatabase();
            sqlDB = (StiSqlDatabase)report.Dictionary.Databases["Connection"];
            sqlDB.ConnectionString = connectionString;
        }

        var qut = (char)34;
        foreach (StiDataParameter sdp in reportParameters)
            if (sdp.Type == (int)SqlDbType.NVarChar || sdp.Type == (int)SqlDbType.VarChar)
                report[sdp.Name] = sdp.Value != null
                    ? sdp.Value.Replace(qut.ToString(), "")
                    : string.Empty.Replace(qut.ToString(), "");
            else
                report[sdp.Name] = sdp.Value;

        var setupInfo = _SetupRepository.GetSetupInfo().Result;
        var shamsiDate = new ShamsiDateTime();
        shamsiDate.Init();

        if (reportModel.ReportSetting != null)
        {
            if (reportModel.ReportSetting.ShowLogo)
                report["CorpLogo"] = StiImageConverter.StringToImage(setupInfo.LogoBase64);

            if (reportModel.ReportSetting.ShowReportDate)
                report["ReportDate"] = shamsiDate.Date;


            report["CurrentUserFullName"] = User.FindFirstValue("FullName");
            report["CorpName"] = setupInfo.Name;

            foreach (var variable in reportVariable)
            {
                report[variable.Item] = variable.Value;
            };


            var lstfooterName = "";
            var coll = report.GetComponents();
            foreach (StiComponent sc in coll)
                if (sc is StiGroupFooterBand)
                    lstfooterName = sc.PropName;
            foreach (StiComponent sc in coll)
                if (sc is StiGroupFooterBand && sc.PropName == lstfooterName)
                {
                    var footer = (StiGroupFooterBand)sc;
                    footer.NewPageAfter = reportModel.ReportSetting.NewPageAfter;
                    footer.ResetPageNumber = reportModel.ReportSetting.ResetPageNumber;
                }
        }


        return StiNetCoreViewer.GetReportResult(this, report);
    }

    public IActionResult PrintPdf(string strReportModel)
    {
        var reportModel = JsonConvert.DeserializeObject<ReportViewModel>(strReportModel);

        var reportVariable = reportModel.Parameters.Where(p => p.ItemType == "Var").ToList();

        var reportParameters = new StiDataParametersCollection();
        var reportValue = string.Empty;


        var parameters = reportModel.Parameters.Where(p => p.ItemType == "Parameter");

        foreach (var param in parameters)
            if (param.Item != "")
            {
                if (param.SqlDbType == (int)SqlDbType.NVarChar || param.SqlDbType == (int)SqlDbType.VarChar)
                    reportValue = param.Value == null ? null : $"\"{param.Value}\"";
                else if (param.SqlDbType == (int)SqlDbType.Date)
                    reportValue = $"\"{param.Value}\"";
                else
                    reportValue = $"{param.Value}";

                var reportParameter = new StiDataParameter(param.Item, param.SqlDbType, param.Size)
                {
                    Value = reportValue
                };

                reportParameters.Add(reportParameter);
            }

        var report = new StiReport();
        var lisence = "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHkcgIvwL0jnpsDqRpWg5FI5kt2G7A0tYIcUygBh1sPs7koivWV0htru4Pn2682yhdY3+9jxMCVTKcKAjiEjgJzqXgLFCpe62hxJ7/VJZ9Hq5l39md0pyydqd5Dc1fSWhCtYqC042BVmGNkukYJQN0ufCozjA/qsNxzNMyEql26oHE6wWE77pHutroj+tKfOO1skJ52cbZklqPm8OiH/9mfU4rrkLffOhDQFnIxxhzhr2BL5pDFFCZ7axXX12y/4qzn5QLPBn1AVLo3NVrSmJB2KiwGwR4RL4RsYVxGScsYoCZbwqK2YrdbPHP0t5vOiLjBQ+Oy6F4rNtDYHn7SNMpthfkYiRoOibqDkPaX+RyCany0Z+uz8bzAg0oprJEn6qpkQ56WMEppdMJ9/CBnEbTFwn1s/9s8kYsmXCvtI4iQcz+RkUWspLcBzlmj0lJXWjTKMRZz+e9PmY11Au16wOnBU3NHvRc9T/Zk0YFh439GKd/fRwQrk8nJevYU65ENdAOqiP5po7Vnhif5FCiHRpxgF";


        StiLicense.LoadFromString(lisence);
        var fonturl = _hostingEnvironment.WebRootPath + "/content/myicon.ttf";
        var url = reportModel.ReportUrl;
        report.Load(StiNetCoreHelper.MapPath(this, url));

        if (report.DataSources.Count > 0)
        {
            var dataSource = (StiSqlSource)report.DataSources[0];
            var sqlCommand = dataSource.SqlCommand;

            var CompanyItemParam = report.DataSources[0].Parameters.ToList()
                .Where(a => a.Name.ToLower().Contains("companyid")).FirstOrDefault();

            report.DataSources[0].Parameters = reportParameters;

            if (CompanyItemParam != null)
            {
                CompanyItemParam.Value = "1";
                report.DataSources[0].Parameters.Add(CompanyItemParam);
            }

            sqlCommand = sqlCommand.ToLower().Replace("exec ", "", StringComparison.OrdinalIgnoreCase)
                .Replace("execute ", "", StringComparison.OrdinalIgnoreCase);

            var pos = sqlCommand.IndexOf("@");
            sqlCommand = pos != -1 ? sqlCommand.Substring(0, pos - 1) : sqlCommand;
            dataSource.SqlCommand = sqlCommand;

            var connectionString = _configuration.GetValue<string>("ConnectionStrings:DefaultConnection");

            var sqlDB = new StiSqlDatabase();
            sqlDB = (StiSqlDatabase)report.Dictionary.Databases["Connection"];
            sqlDB.ConnectionString = connectionString;
        }

        var qut = (char)34;
        foreach (StiDataParameter sdp in reportParameters)
            if (sdp.Type == (int)SqlDbType.NVarChar || sdp.Type == (int)SqlDbType.VarChar)
                report[sdp.Name] = sdp.Value != null
                    ? sdp.Value.Replace(qut.ToString(), "")
                    : string.Empty.Replace(qut.ToString(), "");
            else
                report[sdp.Name] = sdp.Value;

        var setupInfo = _SetupRepository.GetSetupInfo().Result;
        var shamsiDate = new ShamsiDateTime();
        shamsiDate.Init();

        if (reportModel.ReportSetting != null)
        {
            if (reportModel.ReportSetting.ShowLogo)
                report["CorpLogo"] = StiImageConverter.StringToImage(setupInfo.LogoBase64);

            if (reportModel.ReportSetting.ShowReportDate)
                report["ReportDate"] = shamsiDate.Date;


            report["CurrentUserFullName"] = User.FindFirstValue("FullName");
            report["CorpName"] = setupInfo.Name;

            foreach (var variable in reportVariable) report[variable.Item] = variable.Value;


            var lstfooterName = "";
            var coll = report.GetComponents();
            foreach (StiComponent sc in coll)
                if (sc is StiGroupFooterBand)
                    lstfooterName = sc.PropName;
            foreach (StiComponent sc in coll)
                if (sc is StiGroupFooterBand && sc.PropName == lstfooterName)
                {
                    var footer = (StiGroupFooterBand)sc;
                    footer.NewPageAfter = reportModel.ReportSetting.NewPageAfter;
                    footer.ResetPageNumber = reportModel.ReportSetting.ResetPageNumber;
                }
        }

        return StiNetCoreReportResponse.PrintAsPdf(report);
    }

    public IActionResult ExportPdf(string strReportModel)
    {
        var reportModel = JsonConvert.DeserializeObject<ReportViewModel>(strReportModel);

        var reportVariable = reportModel.Parameters.Where(p => p.ItemType == "Var").ToList();

        var reportParameters = new StiDataParametersCollection();
        var reportValue = string.Empty;


        var parameters = reportModel.Parameters.Where(p => p.ItemType == "Parameter");

        foreach (var param in parameters)
            if (param.Item != "")
            {
                if (param.SqlDbType == (int)SqlDbType.NVarChar || param.SqlDbType == (int)SqlDbType.VarChar)
                    reportValue = param.Value == null ? null : $"\"{param.Value}\"";
                else if (param.SqlDbType == (int)SqlDbType.Date)
                    reportValue = $"\"{param.Value}\"";
                else
                    reportValue = $"{param.Value}";

                var reportParameter = new StiDataParameter(param.Item, param.SqlDbType, param.Size)
                {
                    Value = reportValue
                };

                reportParameters.Add(reportParameter);
            }

        var report = new StiReport();
        StiLicense.LoadFromString(Report.Lisence);
        var fonturl = _hostingEnvironment.WebRootPath + "/content/myicon.ttf";
        var url = reportModel.ReportUrl;
        report.Load(StiNetCoreHelper.MapPath(this, url));

        if (report.DataSources.Count > 0)
        {
            var dataSource = (StiSqlSource)report.DataSources[0];
            var sqlCommand = dataSource.SqlCommand;

            var CompanyItemParam = report.DataSources[0].Parameters.ToList()
                .Where(a => a.Name.ToLower().Contains("companyid")).FirstOrDefault();

            report.DataSources[0].Parameters = reportParameters;

            if (CompanyItemParam != null)
            {
                CompanyItemParam.Value = "1";
                report.DataSources[0].Parameters.Add(CompanyItemParam);
            }

            sqlCommand = sqlCommand.ToLower().Replace("exec ", "", StringComparison.OrdinalIgnoreCase)
                .Replace("execute ", "", StringComparison.OrdinalIgnoreCase);

            var pos = sqlCommand.IndexOf("@");
            sqlCommand = pos != -1 ? sqlCommand.Substring(0, pos - 1) : sqlCommand;
            dataSource.SqlCommand = sqlCommand;

            var connectionString = _configuration.GetValue<string>("ConnectionStrings:DefaultConnection");

            var sqlDB = new StiSqlDatabase();
            sqlDB = (StiSqlDatabase)report.Dictionary.Databases["Connection"];
            sqlDB.ConnectionString = connectionString;
        }

        var qut = (char)34;
        foreach (StiDataParameter sdp in reportParameters)
            if (sdp.Type == (int)SqlDbType.NVarChar || sdp.Type == (int)SqlDbType.VarChar)
                report[sdp.Name] = sdp.Value != null
                    ? sdp.Value.Replace(qut.ToString(), "")
                    : string.Empty.Replace(qut.ToString(), "");
            else
                report[sdp.Name] = sdp.Value;

        var setupInfo = _SetupRepository.GetSetupInfo().Result;
        var shamsiDate = new ShamsiDateTime();
        shamsiDate.Init();

        if (reportModel.ReportSetting != null)
        {
            if (reportModel.ReportSetting.ShowLogo)
                report["CorpLogo"] = StiImageConverter.StringToImage(setupInfo.LogoBase64);

            if (reportModel.ReportSetting.ShowReportDate)
                report["ReportDate"] = shamsiDate.Date;


            report["CurrentUserFullName"] = User.FindFirstValue("FullName");
            report["CorpName"] = setupInfo.Name;

            foreach (var variable in reportVariable) report[variable.Item] = variable.Value;


            var lstfooterName = "";
            var coll = report.GetComponents();
            foreach (StiComponent sc in coll)
                if (sc is StiGroupFooterBand)
                    lstfooterName = sc.PropName;
            foreach (StiComponent sc in coll)
                if (sc is StiGroupFooterBand && sc.PropName == lstfooterName)
                {
                    var footer = (StiGroupFooterBand)sc;
                    footer.NewPageAfter = reportModel.ReportSetting.NewPageAfter;
                    footer.ResetPageNumber = reportModel.ReportSetting.ResetPageNumber;
                }
        }

        return StiNetCoreReportResponse.ResponseAsPdf(report);
    }

    public IActionResult ViewerEvent()
    {
        return StiNetCoreViewer.ViewerEventResult(this);
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> DirectPrint([FromBody] PrintViewModel model)
    {
        var report = new StiReport();
        StiLicense.LoadFromString(Report.Lisence);

        report.Load(StiNetCoreHelper.MapPath(this, model.Url));

        var dataSource = (StiSqlSource)report.DataSources[0];
        var sqlCommand = dataSource.SqlCommand;

        sqlCommand = sqlCommand.Replace("exec ", "", StringComparison.OrdinalIgnoreCase)
            .Replace("execute ", "", StringComparison.OrdinalIgnoreCase);

        var pos = sqlCommand.IndexOf("@");
        sqlCommand = pos != -1 ? sqlCommand.Substring(0, pos - 1) : sqlCommand;

        var setupInfo = _SetupRepository.GetSetupInfo().Result;
        var shamsiDate = new ShamsiDateTime().Date;

        report["CorpLogo"] = Stimulsoft.Base.Drawing.StiImageConverter.StringToImage(setupInfo.LogoBase64);
        report["CurrentUserFullName"] = User.FindFirstValue("FullName");
        report["CorpName"] = setupInfo.Name;
        report["ReportDate"] = shamsiDate;

        var connectionString = _configuration.GetValue<string>("ConnectionStrings:DefaultConnection");
        var sqlDB = new StiSqlDatabase();
        sqlDB = (StiSqlDatabase)report.Dictionary.Databases["Connection"];
        sqlDB.ConnectionString = connectionString;

        dataSource.SqlCommand = sqlCommand;

        if (!string.IsNullOrEmpty(model.Item))
        {
            var rParams = new StiDataParametersCollection
            {
                new StiDataParameter(model.Item, model.SqlDbType, model.Size) { Value = model.Value }
            };

            report.DataSources[0].Parameters = rParams;
        }

        await Task.Run(() => { report.Render(false); });

        var stream = new MemoryStream();

        var settings = new StiHtmlExportSettings
        {
            AddPageBreaks = true
        };

        var service = new StiHtmlExportService();
        service.ExportHtml(report, stream, settings);

        var reader = new StreamReader(stream);
        stream.Position = 0;
        var html = reader.ReadToEnd();
        html = html.Replace("</body>", "<script type='text/javascript'>window.print();</script></body>");
        return Json(html);
    }

    public IActionResult JsonPrint(string pUrl)
    {
        return View(Views.Report.JsonPrintIndex);
    }

    public IActionResult GetJsonReport(string pUrl)
    {
        var report = new StiReport();
        StiLicense.LoadFromString(Report.Lisence);
        report.Load(StiNetCoreHelper.MapPath(this, pUrl));
        var setupInfo = _SetupRepository.GetSetupInfo().Result;
        var shamsiDate = new ShamsiDateTime();
        shamsiDate.Init();
        report["CorpLogo"] = StiImageConverter.StringToImage(setupInfo.LogoBase64);
        report["CorpName"] = setupInfo.Name;
        report["ReportDate"] = shamsiDate.Date;
        report["CurrentUserFullName"] = User.FindFirstValue("FullName");

        return StiNetCoreViewer.GetReportResult(this, report);
    }

    public IActionResult NewReport()
    {
        return View(Views.Report.NewReport);
    }

    [AllowAnonymous]
    public IActionResult GetHeaderPrint()
    {
        return PartialView(Views.Report.HeaderPrintIndex);
    }

    public IActionResult NewGetHeaderPrint()
    {
        return PartialView(Views.Report.NewHeaderPrintIndex);
    }
}