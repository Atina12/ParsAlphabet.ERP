using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionTaminWebService;
using ParsAlphabet.ERP.Application.Dtos.MC.PrescriptionTamin;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionTaminWebService;

public class AdmissionTaminWebServiceRepository :
    BaseRepository<AdmissionTaminWebServiceViewModel, int, string>,
    IBaseRepository<AdmissionTaminWebServiceViewModel, int, string>
{
    public AdmissionTaminWebServiceRepository(IConfiguration config) : base(config)
    {
    }

    public new GetColumnsViewModel GetColumns()
    {
        var list = new GetColumnsViewModel
        {
            ConditionOn = "row",
            Condition = new List<ConditionPageTable>
                { new() { FieldName = "sendEPrescriptionResult", FieldValue = "0", Operator = "==" } },
            AnswerCondition = "color:#da1717",
            IsSelectable = true,
            ActionType = "inline",
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, IsPrimary = true, FilterType = "number", Width = 5
                },
                new()
                {
                    Id = "workflow", Title = "جریان کار", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/WF/WorkflowApi/getdropdown/0/10/17,22", Width = 7
                },
                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/WF/StageApi/getdropdown/10/17,22/2/2", Width = 7
                },
                new()
                {
                    Id = "paraclinicType", Title = "نوع نسخه الکترونیک", Type = (int)SqlDbType.TinyInt,
                    IsPrimary = true, IsDtParameter = true, Width = 6
                },
                new() { Id = "paraclinicTypeCode", IsPrimary = true },
                new()
                {
                    Id = "requestEPrescriptionId", Title = "شناسه الکترونیک", Type = (int)SqlDbType.VarChar,
                    IsDtParameter = true, IsFilterParameter = true, IsPrimary = true, FilterType = "strnumber",
                    Width = 6
                },
                new()
                {
                    Id = "registerPrescriptionId", Title = "شناسه ثبت نسخه", Type = (int)SqlDbType.VarChar, Size = 11,
                    IsDtParameter = true, Width = 6
                },
                new()
                {
                    Id = "inqueryID", Title = "شناسه پیگیری استحقاق", Type = (int)SqlDbType.VarChar, Size = 11,
                    IsDtParameter = true, Width = 6
                },
                new()
                {
                    Id = "attender", Title = "طبیب", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    IsFilterParameter = true, Width = 5
                },
                new()
                {
                    Id = "patient", Title = "مراجعه کننده", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 6
                },
                new()
                {
                    Id = "patientNationalCode", Title = "نمبر تذکره مراجعه کننده", Type = (int)SqlDbType.VarChar, Size = 10,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "strnumber", Width = 6
                },
                new()
                {
                    Id = "createUser", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 5
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.VarChar, Size = 20,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "doublepersiandate", Width = 4
                },
                new()
                {
                    Id = "sendEPrescription", Title = "مجوز ارسال نسخه پیچی", Type = (int)SqlDbType.Bit,
                    IsPrimary = true, Align = "center"
                },
                new()
                {
                    Id = "sendEPrescriptionResultName", Title = "وضعیت ارسال", Type = (int)SqlDbType.TinyInt,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "select2static",
                    FilterItems = new List<MyDropDownViewModel2>
                    {
                        new() { Id = "0", Name = "ارسال نشده" },
                        new() { Id = "1", Name = "ارسال موفق" },
                        new() { Id = "2", Name = "ارسال ناموفق" }
                    },
                    Width = 10
                },
                new()
                {
                    Id = "sendEPrescriptionDateTimePersian", Title = "تاریخ ارسال", Type = (int)SqlDbType.VarChar,
                    Size = 20, IsDtParameter = true, Width = 6
                },
                new()
                {
                    Id = "actionIdName", Title = "گام", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/WF/StageActionApi/getdropdown/10/2/17,22", Width = 6
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 8 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "showServiceLines", Title = "نمایش", ClassName = "btn green_outline_1",
                    IconName = "far fa-file-alt"
                },
                new()
                {
                    Name = "getPrescriptionInfoDetails", Title = "جزئیات", ClassName = "btn btn-info infoprescription",
                    IconName = "fa fa-info"
                }
            }
        };

        return list;
    }

    public async Task<MyResultPage<List<AdmissionTaminWebServiceViewModel>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<AdmissionTaminWebServiceViewModel>>
        {
            Data = new List<AdmissionTaminWebServiceViewModel>()
        };

        byte p_medicalRevenue = 1;

        var fromDateMiladi = (DateTime?)null;
        var toDateMiladi = (DateTime?)null;

        if (model.Filters.Any(x => x.Name == "createDateTimePersian"))
        {
            fromDateMiladi = model.Filters.FirstOrDefault(x => x.Name == "createDateTimePersian").Value.Split('-')[0]
                .ToMiladiDateTime();
            toDateMiladi = model.Filters.FirstOrDefault(x => x.Name == "createDateTimePersian").Value.Split('-')[1]
                .ToMiladiDateTime();
        }

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("PatientName",
            model.Filters.Any(x => x.Name == "patient")
                ? model.Filters.FirstOrDefault(x => x.Name == "patient").Value.Replace(" ", "+")
                : null);
        parameters.Add("AttenderName",
            model.Filters.Any(x => x.Name == "attender")
                ? model.Filters.FirstOrDefault(x => x.Name == "attender").Value.Replace(" ", "+")
                : null);
        parameters.Add("UserFullName",
            model.Filters.Any(x => x.Name == "createUser")
                ? model.Filters.FirstOrDefault(x => x.Name == "createUser").Value.Replace(" ", "+")
                : null);
        parameters.Add("PatientNationalCode",
            model.Filters.Any(x => x.Name == "patientNationalCode")
                ? model.Filters.FirstOrDefault(x => x.Name == "patientNationalCode").Value
                : null);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("RequestEPrescriptionId",
            model.Filters.Any(x => x.Name == "requestEPrescriptionId")
                ? model.Filters.FirstOrDefault(x => x.Name == "requestEPrescriptionId").Value
                : null);
        parameters.Add("SendEPrescriptionResult",
            model.Filters.Any(x => x.Name == "sendEPrescriptionResultName")
                ? model.Filters.FirstOrDefault(x => x.Name == "sendEPrescriptionResultName").Value
                : null);
        parameters.Add("FromCreateDate", fromDateMiladi);
        parameters.Add("ToCreateDate", toDateMiladi);
        parameters.Add("MedicalRevenue", p_medicalRevenue);
        parameters.Add("ActionId",
            model.Filters.Any(x => x.Name == "actionIdName")
                ? model.Filters.FirstOrDefault(x => x.Name == "actionIdName").Value
                : null);
        parameters.Add("StageIds",
            model.Filters.Any(x => x.Name == "stage")
                ? model.Filters.FirstOrDefault(x => x.Name == "stage").Value
                : null);
        parameters.Add("WorkflowId",
            model.Filters.Any(x => x.Name == "workflow")
                ? model.Filters.FirstOrDefault(x => x.Name == "workflow").Value
                : null);
        parameters.Add("CompanyId", model.CompanyId);

        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionServiceTamin_WebService_GetPage]";
            conn.Open();
            result.Data = (await conn.QueryAsync<AdmissionTaminWebServiceViewModel>(sQuery, parameters,
                commandType: CommandType.StoredProcedure, commandTimeout: 120)).ToList();
            conn.Close();
        }

        return result;
    }

    public GetColumnsViewModel ReturnGetColumns()
    {
        var list = new GetColumnsViewModel
        {
            ConditionOn = "row",
            Condition = new List<ConditionPageTable>
                { new() { FieldName = "sendEPrescriptionResult", FieldValue = "0", Operator = "==" } },
            AnswerCondition = "color:#da1717",

            IsSelectable = true,
            ActionType = "inline",
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, IsPrimary = true, FilterType = "number", Width = 4
                },
                new()
                {
                    Id = "workflow", Title = "جریان کار", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/WF/WorkflowApi/getdropdown/0/10/17,22", Width = 7
                },
                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/WF/StageApi/getdropdown/10/17,22/2/2", Width = 7
                },
                new()
                {
                    Id = "paraclinicType", Title = "نوع نسخه الکترونیک", Type = (int)SqlDbType.TinyInt,
                    IsPrimary = true, IsDtParameter = true, Width = 5
                },
                new() { Id = "paraclinicTypeCode", IsPrimary = true },
                new()
                {
                    Id = "requestEPrescriptionId", Title = "شناسه الکترونیک", Type = (int)SqlDbType.VarChar,
                    IsDtParameter = true, IsFilterParameter = true, IsPrimary = true, FilterType = "strnumber",
                    Width = 6
                },
                new()
                {
                    Id = "registerPrescriptionId", Title = "شناسه ثبت نسخه", Type = (int)SqlDbType.VarChar, Size = 11,
                    IsDtParameter = true, Width = 7
                },
                new()
                {
                    Id = "inqueryID", Title = "شناسه پیگیری استحقاق", Type = (int)SqlDbType.VarChar, Size = 11,
                    IsDtParameter = true, Width = 6
                },
                new()
                {
                    Id = "attender", Title = "طبیب", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    IsFilterParameter = true, Width = 7
                },
                new()
                {
                    Id = "patient", Title = "مراجعه کننده", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 6
                },
                new()
                {
                    Id = "patientNationalCode", Title = "نمبر تذکره مراجعه کننده", Type = (int)SqlDbType.VarChar, Size = 10,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "strnumber", Width = 6
                },
                new()
                {
                    Id = "createUser", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 7
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.VarChar, Size = 20,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "doublepersiandate", Width = 5
                },
                new()
                {
                    Id = "sendEPrescription", Title = "مجوز ارسال نسخه پیچی", Type = (int)SqlDbType.Bit,
                    IsPrimary = true, Align = "center"
                },
                new()
                {
                    Id = "deleteEPrescriptionResultName", Title = "وضعیت ارسال", Type = (int)SqlDbType.TinyInt,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "select2static",
                    FilterItems = new List<MyDropDownViewModel2>
                    {
                        new() { Id = "0", Name = "ارسال نشده" },
                        new() { Id = "1", Name = "ارسال موفق" },
                        new() { Id = "2", Name = "ارسال ناموفق" }
                    },
                    Width = 10
                },
                new()
                {
                    Id = "deleteEPrescriptionDateTimePersian", Title = "تاریخ ارسال", Type = (int)SqlDbType.VarChar,
                    Size = 20, IsDtParameter = true, Width = 4
                },
                new()
                {
                    Id = "actionIdName", Title = "گام", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/WF/StageActionApi/getdropdown/10/2/17,22", Width = 6
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 8 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "showServiceLines", Title = "نمایش", ClassName = "btn green_outline_1",
                    IconName = "far fa-file-alt"
                },
                new()
                {
                    Name = "getPrescriptionInfoDetails", Title = "جزئیات", ClassName = "btn btn-info infoprescription",
                    IconName = "fa fa-info"
                }
            }
        };

        return list;
    }

    public async Task<MyResultPage<List<AdmissionTaminWebServiceViewModel>>> GetPageReturn(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<AdmissionTaminWebServiceViewModel>>
        {
            Data = new List<AdmissionTaminWebServiceViewModel>()
        };

        byte p_medicalRevenue = 2;

        var fromDateMiladi = (DateTime?)null;
        var toDateMiladi = (DateTime?)null;

        if (model.Filters.Any(x => x.Name == "createDateTimePersian"))
        {
            fromDateMiladi = model.Filters.FirstOrDefault(x => x.Name == "createDateTimePersian").Value.Split('-')[0]
                .ToMiladiDateTime();
            toDateMiladi = model.Filters.FirstOrDefault(x => x.Name == "createDateTimePersian").Value.Split('-')[1]
                .ToMiladiDateTime();
        }

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("PatientName",
            model.Filters.Any(x => x.Name == "patient")
                ? model.Filters.FirstOrDefault(x => x.Name == "patient").Value.Replace(" ", "+")
                : null);
        parameters.Add("AttenderName",
            model.Filters.Any(x => x.Name == "attender")
                ? model.Filters.FirstOrDefault(x => x.Name == "attender").Value.Replace(" ", "+")
                : null);
        parameters.Add("UserFullName",
            model.Filters.Any(x => x.Name == "createUser")
                ? model.Filters.FirstOrDefault(x => x.Name == "createUser").Value.Replace(" ", "+")
                : null);
        parameters.Add("PatientNationalCode",
            model.Filters.Any(x => x.Name == "patientNationalCode")
                ? model.Filters.FirstOrDefault(x => x.Name == "patientNationalCode").Value
                : null);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("RequestEPrescriptionId",
            model.Filters.Any(x => x.Name == "requestEPrescriptionId")
                ? model.Filters.FirstOrDefault(x => x.Name == "requestEPrescriptionId").Value
                : null);
        //parameters.Add("RegisterPrescriptionId", registerId);
        parameters.Add("SendEPrescriptionResult",
            model.Filters.Any(x => x.Name == "deleteEPrescriptionResultName")
                ? model.Filters.FirstOrDefault(x => x.Name == "deleteEPrescriptionResultName").Value
                : null);
        parameters.Add("FromCreateDate", fromDateMiladi);
        parameters.Add("ToCreateDate", toDateMiladi);
        parameters.Add("MedicalRevenue", p_medicalRevenue);
        parameters.Add("ActionId",
            model.Filters.Any(x => x.Name == "actionIdName")
                ? model.Filters.FirstOrDefault(x => x.Name == "actionIdName").Value
                : null);
        parameters.Add("StageIds",
            model.Filters.Any(x => x.Name == "stage")
                ? model.Filters.FirstOrDefault(x => x.Name == "stage").Value
                : null);
        parameters.Add("WorkflowId",
            model.Filters.Any(x => x.Name == "workflow")
                ? model.Filters.FirstOrDefault(x => x.Name == "workflow").Value
                : null);
        parameters.Add("CompanyId", model.CompanyId);

        result.Columns = ReturnGetColumns();

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionServiceTamin_WebService_GetPage]";
            conn.Open();
            result.Data = (await conn.QueryAsync<AdmissionTaminWebServiceViewModel>(sQuery, parameters,
                commandType: CommandType.StoredProcedure, commandTimeout: 120)).ToList();
            conn.Close();
        }

        return result;
    }

    public GetColumnsViewModel PrescriptionTaminGetColumn()
    {
        var list = new GetColumnsViewModel
        {
            ConditionOn = "row",
            Condition = new List<ConditionPageTable>
                { new() { FieldName = "sendResultStatus", FieldValue = "0", Operator = "==" } },
            AnswerCondition = "color:#da1717",
            IsSelectable = true,
            ActionType = "inline",
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه نسخه", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, IsPrimary = true, FilterType = "number", Width = 4
                },
                new()
                {
                    Id = "admissionServiceTaminId", Title = "شناسه پذیرش", Type = (int)SqlDbType.Int,
                    IsDtParameter = true, IsFilterParameter = true, IsPrimary = true, FilterType = "number", Width = 5
                },
                new() { Id = "stageId", IsPrimary = true },
                new() { Id = "workflowId", IsPrimary = true },
                new() { Id = "actionId", IsPrimary = true },
                new() { Id = "editFlg", IsPrimary = true },
                new() { Id = "otpCode", IsPrimary = true },
                new() { Id = "sendResult", IsPrimary = true },
                new()
                {
                    Id = "workflow", Title = "جریان کار", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/WF/WorkflowApi/getdropdown/0/10/17,22", Width = 6
                },
                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/WF/StageApi/getdropdown/10/17,22/2/2", Width = 6
                },
                new()
                {
                    Id = "attender", Title = "طبیب", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    IsFilterParameter = true, Width = 5
                },
                new()
                {
                    Id = "patient", Title = "مراجعه کننده", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 7
                },
                new()
                {
                    Id = "patientNationalCode", Title = "نمبر تذکره مراجعه کننده", Type = (int)SqlDbType.VarChar, Size = 10,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "strnumber", Width = 6
                },
                new()
                {
                    Id = "prescriptionDatePersian", Title = "تاریخ نسخه", Type = (int)SqlDbType.VarChar, Size = 20,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "doublepersiandate", Width = 4
                },
                new()
                {
                    Id = "taminPrescriptionCategory", Title = "نوع نسخه", Type = (int)SqlDbType.VarChar,
                    IsPrimary = true, IsDtParameter = true, Width = 5
                },
                new()
                {
                    Id = "createUser", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 7
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.VarChar, Size = 20,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "doublepersiandate", Width = 5
                },
                new()
                {
                    Id = "inqueryID", Title = "شناسه پیگیری استحقاق", Type = (int)SqlDbType.VarChar, Size = 11,
                    IsDtParameter = true, Width = 6
                },
                new()
                {
                    Id = "trackingCode", Title = "شناسه رهگیری", Type = (int)SqlDbType.VarChar, IsDtParameter = true,
                    IsFilterParameter = true, IsPrimary = true, FilterType = "strnumber", Width = 4
                },
                new()
                {
                    Id = "requestEPrescriptionId", Title = "شناسه ثبت نسخه", Type = (int)SqlDbType.VarChar,
                    IsDtParameter = true, Width = 6
                },
                new()
                {
                    Id = "taminPrescriptionCategoryId", Title = "شناسه نوع نسخه", IsPrimary = true,
                    Type = (int)SqlDbType.SmallInt
                },
                new() { Id = "sendResult", Title = "مجوز ارسال نسخه", Type = (int)SqlDbType.Bit, IsPrimary = true },
                new()
                {
                    Id = "sendResultName", Title = "وضعیت ارسال", Type = (int)SqlDbType.TinyInt, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "select2static",
                    FilterItems = new List<MyDropDownViewModel2>
                    {
                        new() { Id = "0", Name = "ارسال نشده" },
                        new() { Id = "1", Name = "ارسال موفق" },
                        new() { Id = "2", Name = "ارسال ناموفق" },
                        new() { Id = "3", Name = "ویرایش موفق" },
                        new() { Id = "4", Name = "حذف موفق" },
                        new() { Id = "5", Name = "ارسال مجدد" }
                    },
                    Width = 10
                },
                new()
                {
                    Id = "sendDateTimePersian", Title = "تاریخ ارسال", Type = (int)SqlDbType.VarChar, Size = 20,
                    IsDtParameter = true, Width = 7
                },
                new()
                {
                    Id = "actionIdName", Title = "گام", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/WF/StageActionApi/getdropdown/10/2/17,22", Width = 7
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 5 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "displayRequestPrescriptionTamin", Title = "نمایش", ClassName = "btn green_outline_1",
                    IconName = "far fa-file-alt"
                }
            }
        };

        return list;
    }

    public async Task<MyResultPage<List<PrescriptionTaminWebServiceViewModel>>> GetPagePrescription(
        NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<PrescriptionTaminWebServiceViewModel>>
        {
            Data = new List<PrescriptionTaminWebServiceViewModel>()
        };


        var fromDateMiladi = (DateTime?)null;
        var toDateMiladi = (DateTime?)null;
        var createFromDateMiladi = (DateTime?)null;
        var createToDateMiladi = (DateTime?)null;

        if (model.Filters.Any(x => x.Name == "prescriptionDatePersian"))
        {
            fromDateMiladi = model.Filters.FirstOrDefault(x => x.Name == "prescriptionDatePersian").Value.Split('-')[0]
                .ToMiladiDateTime();
            toDateMiladi = model.Filters.FirstOrDefault(x => x.Name == "prescriptionDatePersian").Value.Split('-')[1]
                .ToMiladiDateTime();
        }


        if (model.Filters.Any(x => x.Name == "createDateTimePersian"))
        {
            createFromDateMiladi =
                model.Filters.FirstOrDefault(x => x.Name == "createDateTimePersian").Value.Split('-')[0]
                    .ToMiladiDateTime();
            createToDateMiladi =
                model.Filters.FirstOrDefault(x => x.Name == "createDateTimePersian").Value.Split('-')[1]
                    .ToMiladiDateTime();
        }


        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("PatientName",
            model.Filters.Any(x => x.Name == "patient")
                ? model.Filters.FirstOrDefault(x => x.Name == "patient").Value.Replace(" ", "+")
                : null);
        parameters.Add("AttenderName",
            model.Filters.Any(x => x.Name == "attender")
                ? model.Filters.FirstOrDefault(x => x.Name == "attender").Value.Replace(" ", "+")
                : null);
        parameters.Add("UserFullName",
            model.Filters.Any(x => x.Name == "createUser")
                ? model.Filters.FirstOrDefault(x => x.Name == "createUser").Value.Replace(" ", "+")
                : null);
        parameters.Add("PatientNationalCode",
            model.Filters.Any(x => x.Name == "patientNationalCode")
                ? model.Filters.FirstOrDefault(x => x.Name == "patientNationalCode").Value
                : null);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("AdmissionServiceTaminId",
            model.Filters.Any(x => x.Name == "admissionServiceTaminId")
                ? model.Filters.FirstOrDefault(x => x.Name == "admissionServiceTaminId").Value
                : null);
        parameters.Add("RequestEPrescriptionId",
            model.Filters.Any(x => x.Name == "requestEPrescriptionId")
                ? model.Filters.FirstOrDefault(x => x.Name == "requestEPrescriptionId").Value
                : null);
        parameters.Add("SendResultStatus",
            model.Filters.Any(x => x.Name == "sendResultName")
                ? model.Filters.FirstOrDefault(x => x.Name == "sendResultName").Value
                : null);
        parameters.Add("FromCreateDate", createFromDateMiladi);
        parameters.Add("ToCreateDate", createToDateMiladi);
        parameters.Add("FromPrescriptionDate", fromDateMiladi);
        parameters.Add("ToPrescriptionDate", toDateMiladi);
        parameters.Add("TrackingCode",
            model.Filters.Any(x => x.Name == "trackingCode")
                ? model.Filters.FirstOrDefault(x => x.Name == "trackingCode").Value
                : null);
        parameters.Add("ActionId",
            model.Filters.Any(x => x.Name == "actionIdName")
                ? model.Filters.FirstOrDefault(x => x.Name == "actionIdName").Value
                : null);
        parameters.Add("StageId",
            model.Filters.Any(x => x.Name == "stage")
                ? model.Filters.FirstOrDefault(x => x.Name == "stage").Value
                : null);
        parameters.Add("WorkflowId",
            model.Filters.Any(x => x.Name == "workflow")
                ? model.Filters.FirstOrDefault(x => x.Name == "workflow").Value
                : null);
        parameters.Add("CompanyId", model.CompanyId);

        result.Columns = PrescriptionTaminGetColumn();

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_PrescriptionTamin_WebService_GetPage]";
            conn.Open();

            result.Data =
                (await conn.QueryAsync<PrescriptionTaminWebServiceViewModel>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }


    public async Task<MyResultStatus> UpdateResultSendPrescriptionTamin(TaminPrescriptionUpdate model)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionServiceTamin_Update_PrescriptionTamin]";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                model.PrescriptionId,
                model.TrackingCode,
                model.RequestEPrescriptionId,
                model.SendResult,
                SendDateTime = DateTime.Now,
                model.OTPCode
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
            result.Successfull = result.Status == 100;
            return result;
        }
    }

    public async Task<MyResultStatus> UpdateResultSendTamin(UpdateAdmissionTaminResult model)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionServiceTamin_Update_RegisterPrescription]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                model.AdmissionTaminId,
                model.RegisterPrescriptionId,
                model.RegisterTaminResult,
                model.RegisterTaminDateTime
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
            result.Successfull = result.Status == 100;
            return result;
        }
    }

    public async Task<MyResultStatus> DeleteResultSendTamin(DeleteAdmissionTaminResult model)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionServiceTamin_Delete_RegisterPrescription]";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                model.AdmissionTaminId,
                model.DeleteTaminResult,
                model.DeleteTaminDateTime
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
            result.Successfull = result.Status == 100;
            return result;
        }
    }


    public async Task UpdateResultSavePatientBill(int admissionId, byte saveBillResult)
    {
        var result = new MyResultStatus();
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_UpdItem_Number]";
            conn.Open();

            var resultSaveBillResult = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                TableName = "mc.AdmissionService",
                ColumnName = "SaveBillResult",
                Value = saveBillResult.ToString(),
                Filter = $"HeaderId={admissionId}"
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }
    }
}