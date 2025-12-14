namespace ParsAlphabet.ERP.Application.Dtos.GN.Branch;

public class BranchGetPage
{
    public short Id { get; set; }
    public short CentralId { get; set; }
    public string Name { get; set; }

    public short StateId { get; set; }
    public string StateName { get; set; }
    public string State => IdAndTitle(StateId, StateName);

    public int CityId { get; set; }
    public string CityName { get; set; }
    public string City => IdAndTitle(CityId, CityName);
    public string Address { get; set; }
    public decimal Longitude { get; set; }
    public decimal Latitude { get; set; }
    public bool IsActive { get; set; }
    public int DetailId { get; set; }
    public bool IsDetail => DetailId != 0;
    public string JsonBranchLine { get; set; }
    public string SendResult => CentralId > 0 ? "ارسال شده" : "ارسال نشده";
}

public class BranchGetRecordModel
{
    public short? CentralId { get; set; }
    public short Id { get; set; }
    public short CompanyId { get; set; }
    public string Name { get; set; }
    public string NameEng { get; set; }
    public short StateId { get; set; }
    public int CityId { get; set; }
    public string Address { get; set; }
    public decimal? Longitude { get; set; }
    public decimal? Latitude { get; set; }
    public bool IsActive { get; set; }
    public string BranchLineJson { get; set; }
    public List<BranchLines> BranchLinesList { get; set; }
}

public class BranchSendHistoryModel
{
    public short Id { get; set; }
    public short? CentralId { get; set; }
    public Guid SendHistoryId { get; set; }
    public string Name { get; set; }
    public string NameEng { get; set; }
    public short StateId { get; set; }
    public int CityId { get; set; }
    public string Address { get; set; }
    public decimal? Longitude { get; set; }
    public decimal? Latitude { get; set; }
    public bool IsActive { get; set; }
    public short CompanyId { get; set; }
    public List<BranchLineType> BranchLineList { get; set; }
    public string BranchLineJson { get; set; }
}

public class BranchLines
{
    public int BranchLineId { get; set; }
    public byte BranchLineTypeId { get; set; }
    public string BranchLineTypeName { get; set; }
    public string BranchLineType => IdAndTitle(BranchLineTypeId, BranchLineTypeName);
    public string Value { get; set; }
}

public class BranchLineType
{
    public byte BranchLineTypeId { get; set; }
    public string Value { get; set; }
}

public class BranchLineGetList
{
    public int Id { get; set; }
    public byte BranchLineTypeId { get; set; }
    public string BranchLineTypeName { get; set; }
    public string Value { get; set; }
}

public class BranchLineTypeGetList
{
    public byte Id { get; set; }
    public string Name { get; set; }
}