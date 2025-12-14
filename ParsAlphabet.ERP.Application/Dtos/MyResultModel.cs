namespace ParsAlphabet.ERP.Application.Dtos;

public class MyResultPage<T>
{
    public bool Successfull { get; set; } = true;
    public List<T> RecordSet { get; set; }
    public T Data { get; set; }
    public GetColumnsViewModel Columns { get; set; }
    public GetColumnsViewModel HeaderColumns { get; set; }
    public string Message { get; set; }
    public int TotalRecordCount { get; set; } = 0;
    public int? CurrentPage { get; set; } = 1;
    public int MaxPageCount { get; set; } = 1;
    public int? PageStartRow { get; set; } = 0;
    public int? PageEndRow { get; set; } = 0;
}

public class MyResultStageStepConfigPage<T>
{
    public bool Successfull { get; set; } = true;
    public List<T> RecordSet { get; set; }
    public T Data { get; set; }
    public GetStageStepConfigColumnsViewModel Columns { get; set; }
    public GetStageStepConfigColumnsViewModel HeaderColumns { get; set; }
    public string Message { get; set; }
    public int TotalRecordCount { get; set; } = 0;
    public int? CurrentPage { get; set; } = 1;
    public int MaxPageCount { get; set; } = 1;
    public int? PageStartRow { get; set; } = 0;
    public int? PageEndRow { get; set; } = 0;
}

public class ReportViewModel<T>
{
    public T Data { get; set; }
    public GetColumnsViewModel Columns { get; set; }
}

public class CSVViewModel<T>
{
    public string Columns { get; set; }
    public T Rows { get; set; }
}

public class MyResultQuery
{
    public long Id { get; set; }
    public DateTime DateTime { get; set; }
    public string DateTimePersian => DateTime.ToPersianDateString("{0}/{1}/{2}");
    public int Status { get; set; }
    public string StatusMessage { get; set; }
    public bool Successfull { get; set; } = true;
    public List<string> ValidationErrors { get; set; }
}

public class MyResultDataQuery<T>
{
    public bool Successfull { get; set; } = true;
    public T Data { get; set; }
    public string Message { get; set; }
    public List<string> ValidationErrors { get; set; } = new();
}

public class MyResultStatus
{
    public int Id { get; set; } = 0;
    public int AffectedRows { get; set; } = 0;
    public DateTime DateTime { get; set; }
    public string DateTimePersian => DateTime.ToPersianDateString();
    public int Status { get; set; } = -99;
    public string StatusMessage { get; set; }
    public bool Successfull { get; set; }
    public List<string> ValidationErrors { get; set; } = new();

    public int UserId { get; set; }
    public string CreateUserFullName { get; set; }
}

public class MyResultDataStatus<T> : MyResultStatus
{
    public T Data { get; set; }
}

public class MyDropDownViewModel : CompanyViewModel
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Text => $"{Id} - {Name}";
}

public class MyDropDownViewModel2
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string Text => $"{Id} - {Name}";
}

public class ErrorViewModel
{
    public string RequestId { get; set; }

    public bool ShowRequestId => !string.IsNullOrEmpty(RequestId);
}

public class ReportModel
{
    public class ReportViewModel
    {
        public string ReportName { get; set; }
        public string ReportUrl { get; set; }
        public List<ReportParameter> Parameters { get; set; }
        public ReportSetting ReportSetting { get; set; }
    }

    public class ReportParameter
    {
        public string Item { get; set; }
        public object Value { get; set; }
        public int SqlDbType { get; set; }
        public int Size { get; set; }
        public string ItemType { get; set; } = "Parameter";
    }

    public class PrintViewModel
    {
        public string Url { get; set; }
        public string Item { get; set; }
        public string Value { get; set; }
        public int SqlDbType { get; set; }
        public int Size { get; set; }
    }

    public class ReportSetting
    {
        public bool NewPageAfter { get; set; } = false;
        public bool ResetPageNumber { get; set; } = false;
        public bool ShowLogo { get; set; } = true;
        public bool ShowReportDate { get; set; } = true;
    }
}