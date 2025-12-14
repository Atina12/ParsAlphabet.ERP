using System.Data;
using System.IO.Compression;
using Dapper;
using Microsoft.Extensions.Configuration;
using NReco.PdfGenerator;
using ParsAlphabet.ERP.Application.Dtos.MC.ReportImaging;
using ParsAlphabet.ERP.Application.Interfaces._Setup;
using ParsAlphabet.ERP.Application.Interfaces.MC.ReportImaging;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionImaging;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.ReportImaging;

public class ImagingReportRepository : IImagingReportRepository
{
    private readonly AdmissionImagingRepository _admissionImagingRepository;
    private readonly IConfiguration _reportConfiguration;
    private readonly ISetupRepository _setupRepository;

    public ImagingReportRepository(IConfiguration reportConfig
        , AdmissionImagingRepository admissionImagingRepository, ISetupRepository setupRepository
    )
    {
        _reportConfiguration = reportConfig;
        _admissionImagingRepository = admissionImagingRepository;
        _setupRepository = setupRepository;
    }

    public IDbConnection Connection => new SqlConnection(_reportConfiguration.GetConnectionString("DefaultConnection"));


    public GetColumnsViewModel ImagingReportGetColumns()
    {
        var list = new GetColumnsViewModel
        {
            SumDynamic = true,
            GetSumApi = "/api/MC/ImagingReportApi/repimagingsum",
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "admissionMasterId", Title = "شناسه پرونده", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Width = 7
                },
                new()
                {
                    Id = "admissionId", Title = "شناسه ثبت پذیرش", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Width = 9
                },
                new()
                {
                    Id = "id", Title = "شناسه تصویربرداری", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 9
                },
                new()
                {
                    Id = "branch", Title = "شعبه", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "workflow", Title = "جریان کار", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 12
                },
                new()
                {
                    Id = "createDatePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.VarChar, IsDtParameter = true,
                    Width = 7
                },
                new()
                {
                    Id = "createTimePersian", Title = "زمان ثبت", Type = (int)SqlDbType.VarChar, IsDtParameter = true,
                    Width = 5
                },
                new()
                {
                    Id = "reserveDatePersian", Title = "تاریخ رزرو", Type = (int)SqlDbType.VarChar,
                    IsDtParameter = true, Width = 7
                },
                new()
                {
                    Id = "patient", Title = "مراجعه کننده", Type = (int)SqlDbType.NVarChar, Size = 5,
                    IsDtParameter = true, Width = 12
                },
                new()
                {
                    Id = "patientNationalCode", Title = "کدملی مراجعه کننده", Type = (int)SqlDbType.VarChar, Size = 5,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "attender", Title = "طبیب", Type = (int)SqlDbType.NVarChar, Size = 5, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "referringDoctor", Title = "پزشک ارجاع دهنده", Type = (int)SqlDbType.NVarChar, Size = 5,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "basicInsurerExpirationDatePersian", Title = "تاریخ انقضا دفترچه",
                    Type = (int)SqlDbType.VarChar, Size = 5, IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "basicInsurerNo", Title = "شماره بیمه", Type = (int)SqlDbType.VarChar, Size = 16,
                    IsDtParameter = true, Width = 6
                },
                new()
                {
                    Id = "basicInsurerBookletPageNo", Title = "شماره صفحه دفترچه", Type = (int)SqlDbType.TinyInt,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "prescriptionDate", Title = "تاریخ نسخه", Type = (int)SqlDbType.VarChar, Size = 5,
                    IsDtParameter = true, Width = 7
                },
                new()
                {
                    Id = "department", Title = "دپارتمان", Type = (int)SqlDbType.NVarChar, Size = 5,
                    IsDtParameter = true, Width = 12
                },
                new()
                {
                    Id = "serviceType", Title = "نوع خدمت", Type = (int)SqlDbType.NVarChar, Size = 5,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "serviceNationalCode", Title = "کدملی خدمت", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Width = 7
                },
                new()
                {
                    Id = "service", Title = "خدمت", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 30
                },
                new()
                {
                    Id = "quantity", Title = "تعداد", Type = (int)SqlDbType.Int, Size = 20, IsDtParameter = true,
                    Width = 5, HasSumValue = true
                },
                new()
                {
                    Id = "serviceActualAmount", Title = "مبلغ واقعی خدمت", Type = (int)SqlDbType.Money, Size = 10,
                    IsDtParameter = true, Width = 10, IsCommaSep = true, HasSumValue = true
                },
                new()
                {
                    Id = "basicInsurer", Title = "بیمه اجباری", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 14
                },
                new()
                {
                    Id = "basicInsurerLine", Title = "صندوق بیمه اجباری", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, Width = 14
                },
                new()
                {
                    Id = "basicShareAmount", Title = "سهم بیمه اجباری", Type = (int)SqlDbType.Money, Size = 10,
                    IsCommaSep = true, IsDtParameter = true, Width = 8, HasSumValue = true
                },

                new()
                {
                    Id = "compInsurer", Title = "بیمه تکمیلی", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "compInsurerLine", Title = "صندوق بیمه تکمیلی", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "compShareAmount", Title = "سهم بیمه تکمیلی", Type = (int)SqlDbType.Money, Size = 10,
                    IsCommaSep = true, IsDtParameter = true, Width = 8, HasSumValue = true
                },

                new()
                {
                    Id = "thirdPartyInsurer", Title = "طرف قرارداد", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "thirdPartyAmount", Title = "سهم طرف قرارداد", Type = (int)SqlDbType.Money, Size = 10,
                    IsCommaSep = true, IsDtParameter = true, Width = 10, HasSumValue = true
                },

                new()
                {
                    Id = "discountInsurer", Title = "تخفیف", Type = (int)SqlDbType.Money, Size = 10,
                    IsDtParameter = true, Width = 12, IsCommaSep = true
                },
                new()
                {
                    Id = "discountAmount", Title = "سهم تخفیف", Type = (int)SqlDbType.Money, Size = 10,
                    IsCommaSep = true, IsDtParameter = true, Width = 8, HasSumValue = true
                },
                new()
                {
                    Id = "netAmount", Title = "سهم مراجعه کننده", Type = (int)SqlDbType.Money, Size = 10,
                    IsDtParameter = true, Width = 10, IsCommaSep = true, HasSumValue = true
                },
                new()
                {
                    Id = "actionIdName", Title = "گام", Type = (int)SqlDbType.NVarChar, Size = 10, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "user", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, Width = 10
                }
            }
        };

        return list;
    }

    public async Task<ReportViewModel<List<ImagingReport>>> ImagingReportPreview(ImagingReportInputModel model)
    {
        var result = new ReportViewModel<List<ImagingReport>>
        {
            Data = new List<ImagingReport>()
        };

        using (var conn = Connection)
        {
            var branchId = model.BranchIds.ToString();
            var sQuery = "mc.Spr_AdmissionImaging_ReportPreview";
            conn.Open();

            result.Data = (await conn.QueryAsync<ImagingReport>(sQuery,
                new
                {
                    model.PageNo,
                    model.PageRowsCount,
                    branchId,
                    model.WorkflowIds,
                    model.StageIds,
                    model.AdmissionId,
                    model.AdmissionMasterId,
                    model.PatientIds,
                    model.PatientNationalCode,
                    model.BasicInsurerIds,
                    model.BasicInsurerLineIds,
                    model.CompInsurerIds,
                    model.CompInsurerLineIds,
                    model.ThirdPartyInsurerIds,
                    model.DiscountInsurerIds,
                    model.FromCreateDate,
                    model.ToCreateDate,
                    model.ActionIds,
                    model.CreateUserId,
                    model.AttenderIds,
                    model.DepartmentIds,
                    model.SpecialtyIds,
                    model.ServiceTypeIds,
                    model.ServiceIds
                }, commandType: CommandType.StoredProcedure)).AsList();

            result.Columns = ImagingReportGetColumns();

            conn.Close();
            return result;
        }
    }

    public async Task<SumImagingReport> ImagingReportSumTotal(ImagingReportInputModel model)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spr_AdmissionImaging_ReportPreview_Sum]";
            conn.Open();

            var total = await conn.QueryFirstOrDefaultAsync<SumImagingReport>(sQuery,
                new
                {
                    model.BranchIds,
                    model.WorkflowIds,
                    model.StageIds,
                    model.AdmissionId,
                    model.AdmissionMasterId,
                    model.PatientIds,
                    model.PatientNationalCode,
                    model.BasicInsurerIds,
                    model.BasicInsurerLineIds,
                    model.CompInsurerIds,
                    model.CompInsurerLineIds,
                    model.ThirdPartyInsurerIds,
                    model.DiscountInsurerIds,
                    model.FromCreateDate,
                    model.ToCreateDate,
                    model.ActionIds,
                    model.CreateUserId,
                    model.AttenderIds,
                    model.DepartmentIds,
                    model.SpecialtyIds,
                    model.ServiceTypeIds,
                    model.ServiceIds
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return total;
        }
    }

    public async Task<MemoryStream> ImagingReportCSV(ImagingReportInputModel model)
    {
        var csvGenerator = new Csv();
        var csvStream = new MemoryStream();

        var columns1 = ImagingReportGetColumns().DataColumns.Where(x => x.IsDtParameter && x.Id != "action")
            .Select(z => z.Title).ToList();

        var getPage = await ImagingReportPreview(model);
        var rowsAdmissionService = (from p in getPage.Data
            select new
            {
                p.AdmissionMasterId,
                p.AdmissionId,
                p.Id,
                p.Branch,
                p.Workflow,
                p.Stage,
                p.CreateDatePersian,
                p.CreateTimePersian,
                p.ReserveDatePersian,
                p.Patient,
                p.PatientNationalCode,
                p.Attender,
                p.ReferringDoctor,
                p.BasicInsurerExpirationDatePersian,
                p.BasicInsurerNo,
                p.BasicInsurerBookletPageNo,
                p.PrescriptionDatePersian,
                p.Department,
                p.ServiceType,
                p.ServiceNationalCode,
                p.Service,
                p.Quantity,
                p.ServiceActualAmount,
                p.BasicInsurer,
                p.BasicInsurerLine,
                p.BasicShareAmount,
                p.CompInsurer,
                p.CompInsurerLine,
                p.CompShareAmount,
                p.ThirdPartyInsurer,
                p.ThirdPartyAmount,
                p.DiscountInsurer,
                p.DiscountAmount,
                p.NetAmount,
                p.ActionIdName,
                p.User
            }).ToList();

        csvStream = await csvGenerator.GenerateCsv(rowsAdmissionService, columns1);
        return csvStream;
    }


    public async Task<byte[]> GenerateImagePDF(ImagingReportInputModel model, int userId)
    {
        string fileName = string.Empty, finalContent = string.Empty;
        var pdfList = new List<Tuple<byte[], string>>();
        var decodeContent = new StringWriter();

        var setupInfo = await _setupRepository.GetSetupInfo();

        var result = new MyResultPage<List<AdmissionImagingPrint>>
        {
            Data = new List<AdmissionImagingPrint>()
        };
        result = await ImagingPrint(model);

        var htmlToPdf = new HtmlToPdfConverter();

        var currentDatePersian = DateTime.Now.ToPersianDateString("{0}/{1}/{2}");


        foreach (var item in result.Data)
        {
            item.CompanyName = setupInfo.Name;
            var html = await CreateHtmlContent(item, currentDatePersian, setupInfo.LogoBase64);
            var pdfBytes = htmlToPdf.GeneratePdf(html);

            fileName = item.AdmissionId + "-" + item.Id + "-" + item.AdmissionDateTimePersian.Replace("/", "")
                       + "-" + item.CreateDatePersian.Split(" ")[0].Replace("/", "") + "-" + item.PatientNationalCode +
                       "-" + item.PatientFullName + ".pdf";

            var items = new Tuple<byte[], string>(pdfBytes, fileName);
            pdfList.Add(items);
        }

        return GenerateZIP(pdfList);
    }

    public async Task<MyResultPage<List<AdmissionImagingPrint>>> ImagingPrint(ImagingReportInputModel model)
    {
        var result = new MyResultPage<List<AdmissionImagingPrint>>
        {
            Data = new List<AdmissionImagingPrint>()
        };

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spr_AdmissionImaging_Print]";
            conn.Open();

            result.Data = (await conn.QueryAsync<AdmissionImagingPrint>(sQuery,
                new
                {
                    model.BranchIds,
                    model.WorkflowIds,
                    model.StageIds,
                    model.AdmissionId,
                    model.AdmissionMasterId,
                    model.PatientIds,
                    model.PatientNationalCode,
                    model.BasicInsurerIds,
                    model.BasicInsurerLineIds,
                    model.CompInsurerIds,
                    model.CompInsurerLineIds,
                    model.ThirdPartyInsurerIds,
                    model.DiscountInsurerIds,
                    model.FromCreateDate,
                    model.ToCreateDate,
                    model.ActionIds,
                    model.CreateUserId,
                    model.AttenderIds,
                    model.DepartmentIds,
                    model.SpecialtyIds,
                    model.ServiceTypeIds,
                    model.ServiceIds
                }, commandType: CommandType.StoredProcedure)).AsList();

            conn.Close();
            return result;
        }
    }


    public async Task<string> CreateHtmlContent(AdmissionImagingPrint data, string currentDatePersian, string logo)
    {
        var htmlContent = string.Empty;
        await Task.Run(() =>
        {
            htmlContent = @"<html>
                                 <link rel='shortcut icon' href='/Content/images/favicon.ico'>
                                 <link rel='stylesheet' type='text/css' href='~/Content/css/styles.css'>
                                <head>
                                    <meta http-equiv='Content-Type' content='text/html'; charset='utf-8'/>
                                    <style> 
                                        @@font-face {font-family:'iransans';src: url('../../../wwwroot/Content/fonts/ttf/IRANSansXFaNum-Regular.ttf')}@@media print
                                        { body {font-family: 'iransans';} img, div, table {max-width:100%; }
                                        @@font-face { font-family: 'iransans'; src: url('../../../wwwroot/Content/fonts/ttf/IRANSansXFaNum-Regular.ttf') }
                                        @@font-face { font-family: 'BTitr'; src: url('../../../wwwroot/Content/fonts/ttf/BTitr.ttf') }
                                        @@font-face {font-family: 'BLotus';src: url('../../../wwwroot/Content/fonts/ttf/BLotus.ttf')} } 
                                        table,div{
                                         font-family: 'IRANSansFaNum';
                                         src:  url('../../../wwwroot/Content/fonts/ttf/IRANSansXFaNum-Regular.ttf')
                                        }
                                           table td th {text-align:center; white-space:pre-wrap;  width:40px; word-wrap:break-word;}
                                           * {
                                              box-sizing: border-box;
                                            }

                                        .column {
                                          float: right;
                                          width: 33%;
                                          padding: 5px;
                                        }


                                        .row::after {
                                          content: '';
                                          clear: both;
                                          display: table;
                                        }
                                        .rowmargin{
                                        padding-top:25px;
                                        margin-top:25px;
                                        }
                                    </style>
                                </head> 
                            
                                <body dir='rtl'>
                                 <div style='border:1px solid black;padding:5px;'>
                                
                            <div class='row'>
                              <div class='column rowmargin' >
                                <table style='  margin-left: auto; font-size:12pt;
                                width:100%;border:0px;align-text:center;border-spacing:0px; '>  
                               
                                <tr>
                                <td><span style ='white-space:nowrap;'>مراجعه کننده : " + data.PatientFullName +
                          @" </span></td>      
                                </tr><tr></tr><tr></tr>
                                <tr>                                                   
                                   <td><span style ='white-space:nowrap;'> تاریخ چاپ : " + currentDatePersian +
                          @"  </span></td> 
                                </tr>
                                 </table>
                                </div>
                           
                              <div class='column'>
                                <table style='  margin-left: auto; font-size:12pt;
                                 width:100%;border:0px;border-spacing:0px; '>  
                                <tr><th><span style ='white-space:nowrap;'>هوالشافی</span></th></tr>
                                <tr>
                                <td></td>    <tr>
                                <td></td>      
                                </tr>   
                                </tr><tr></tr><tr></tr><tr>
                                                                                           
                                <td style='text-align:center; '><span style ='white-space:nowrap;'> " +
                          data.CompanyName + @" </span></td>  </tr><tr>
                                <td style='text-align:center; '><span><img src=data:image/png;base64," + logo +
                          @" style='!important; width: 70px;height:70px; border - width: 0px;' /></span></td>
                              
                                </tr>
                                 </table>
                                </div>
                        
                              <div class='column rowmargin'>
                                <table style='  margin-left: auto; font-size:12pt;
                                width:100%;border:0px;border-spacing:0px; '>  
                               
                                <tr>
                                <td><span style ='white-space:nowrap;'>تاریخ پذیرش : " + data.AdmissionDateTimePersian +
                          @" </span></td>      
                                </tr><tr></tr><tr></tr>
                                 <tr>                                                            
                                <td><span style ='white-space:nowrap;'> تاریخ نسخه : " + data.PrescriptionDatePersian +
                          @"  </span></td>  
                                </tr>
                                <tr>                                                            
                                <td><span style ='white-space:nowrap;'>  شناسه پذیرش : " + data.AdmissionId +
                          @"  </span></td>
                                </tr>
                                 </table>
                                </div>
                                </div>


                               
                                  <hr style='width:100%; background-color:black;'/>
                                  <div style='width: 100%; display: flex; justify-content:flex-start; align-items:center;font-size:1.9vw;font-weight: bold; padding-top:10px; padding-right:10px; '>
                                  <span style=''> همکار ارجمند آقای / خانم </span>
                                  <span style ='visibility: hidden;'> a </span><span>" + data.ReferringDoctorName +
                          @"</span></div>
                                  <div style ='direction:rtl ; font-size:14px;' > <div style ='margin-right:10px;' >" +
                          data.DecodedContent + @"</div></div></div>
                               </body></html> ";
        });

        return htmlContent;
    }

    public byte[] GenerateZIP(List<Tuple<byte[], string>> files)
    {
        byte[] archiveFile;
        using (var archiveStream = new MemoryStream())
        {
            using (var archive = new ZipArchive(archiveStream, ZipArchiveMode.Create, true))
            {
                foreach (var file in files)
                {
                    var zipArchiveEntry = archive.CreateEntry(file.Item2, CompressionLevel.Fastest);
                    using (var zipStream = zipArchiveEntry.Open())
                    {
                        zipStream.Write(file.Item1, 0, file.Item1.Length);
                    }
                }
            }

            archiveFile = archiveStream.ToArray();
        }

        return archiveFile;
    }
}