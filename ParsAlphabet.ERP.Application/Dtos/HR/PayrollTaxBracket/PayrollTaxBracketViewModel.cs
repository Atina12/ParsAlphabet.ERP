using Newtonsoft.Json;

namespace ParsAlphabet.ERP.Application.Dtos.HR.PayrollTaxBracket;

public class PayrollTaxBracketGetPage
{
    public int Id { get; set; }
    public int FiscalYearId { get; set; }
    public string FiscalYearName { get; set; }
    public string FiscalYear => IdAndTitle(FiscalYearId, FiscalYearName);
    public string Name { get; set; }
    public DateTime? CreateDateTime { get; set; }
    public string CreateDateTimePersian { get; set; }
    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public string UserFullName => IdAndTitle(CreateUserId, CreateUserFullName);
    public bool IsActive { get; set; }
}

public class PayrollTaxBracketGetRecord
{
    public int Id { get; set; }
    public int FiscalYearId { get; set; }
    public string Name { get; set; }
    public DateTime? CreateDateTime { get; set; }
    public int CreateUserId { get; set; }
    public bool IsActive { get; set; }
}

public class PayrollTaxBracketLineListGetRecord
{
    public int Id { get; set; }
    public string Name { get; set; }
    public bool IsActive { get; set; }
    public string PayrollTaxBracketLine { get; set; }

    public List<PayrollTaxBracketLineList> PayrollTaxBracketLineList => !string.IsNullOrEmpty(PayrollTaxBracketLine)
        ? JsonConvert.DeserializeObject<List<PayrollTaxBracketLineList>>(PayrollTaxBracketLine)
        : null;
}

public class PayrollTaxBracketLineList
{
    public int Id { get; set; }
    public short? HeaderId { get; set; }
    public byte RowNumber { get; set; }
    public long StartAmount { get; set; }
    public long EndAmount { get; set; }
    public byte TaxPercentage { get; set; }
    public DateTime? CreateDateTime { get; set; }
    public int CreateUserId { get; set; }
}