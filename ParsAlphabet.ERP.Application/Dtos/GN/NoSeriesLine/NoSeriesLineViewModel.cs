namespace ParsAlphabet.ERP.Application.Dtos.GN.NoSeriesLine;

public class NoSeriesLineViewModel
{
    public int Id { get; set; }
    public string BankName { get; set; }
    public string AccountNo { get; set; }
    public string AccountName { get; set; }
    public string AccountCategoryName { get; set; }
    public int BranchNo { get; set; }
    public string BranchName { get; set; }
    public int TransitNo { get; set; }
    public string CountryName { get; set; }
    public string StateName { get; set; }
    public bool IsActive { get; set; }
}

public class NoSeriesLineGetPage
{
    public int Id { get; set; }
    public int HeaderId { get; set; }
    public string SeriesName { get; set; }
    public string StartNo { get; set; }
    public string EndNo { get; set; }
}

public class NoSeriesLineGetRecord
{
    public int HeaderId { get; set; }
    public int LineNo { get; set; }
    public string StartNo { get; set; }
    public string EndNo { get; set; }
}