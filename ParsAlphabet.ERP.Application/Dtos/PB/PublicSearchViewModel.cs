namespace ParsAlphabet.ERP.Application.Dtos.PB;

public class GetPublicSearch : NewGetPageViewModel
{
    public object[] Items { get; set; }
    public string Filter { get; set; }
    public List<ParameterSearch> Parameters { get; set; }
}

public class ParameterSearch
{
    public string Name { get; set; }
    public string Value { get; set; }
}

public class MinMaxViewModel
{
    public int MinId { get; set; }
    public int MaxId { get; set; }
}

public class Persian_Date
{
    public string Date { get; set; }
    public string Time { get; set; }
    public bool isFrom { get; set; }
}

public class PublicSearch : NewGetPageViewModel
{
    public bool IsSecondLang { get; set; }
    public string TableName { get; set; }
    public string IdColumnName { get; set; }
    public string IdColumnValue { get; set; }
    public string TitleColumnName { get; set; }
    public string ColumnNameList { get; set; }
    public string IdList { get; set; }
    public string Filter { get; set; }
    public string OrderBy { get; set; }
}

public class PersianDateRange
{
    public DatePart DatePart { get; set; }
    public string FromPersianDate { get; set; }
    public DateTime? FromDate => FromPersianDate.ToMiladiDateTime().Value;
    public string ToPersianDate { get; set; }
    public DateTime? ToDate => ToPersianDate.ToMiladiDateTime().Value;
}

public class GetNextPrevId : CompanyViewModel
{
    public string IdColumnName { get; set; }
    public string IdColumnValue { get; set; }
    public string TableName { get; set; }
    public PrevNextDirection Direction { get; set; }
}