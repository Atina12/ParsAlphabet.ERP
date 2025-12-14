using Newtonsoft.Json;

namespace ParsAlphabet.ERP.Application.Dtos.FM.TreasurySubject;

public class TreasurySubjectGetPage
{
    public short Id { get; set; }
    public string TreasurySubjectName { get; set; }
    public byte CashFlowCategoryId { get; set; }
    public string CashFlowCategoryName { get; set; }
    public bool IsActive { get; set; }
}

public class TreasurySubjectGetRecord
{
    public byte Lang { get; set; }
    public int Id { get; set; }
    public string Name { get; set; }
    public byte CashFlowCategoryId { get; set; }
    public bool IsActive { get; set; }
    public string StageListJson { get; set; }

    public List<ID> StageIdList => !string.IsNullOrEmpty(StageListJson)
        ? JsonConvert.DeserializeObject<List<ID>>(StageListJson)
        : null;
}

public class TreasurySubjectAccountGLSGL
{
    public int AccountGLId { get; set; }
    public string AccountGLName { get; set; }
    public int AccountSGLId { get; set; }
    public string AccountSGLName { get; set; }

    public int AccountDetailId { get; set; }
    public string AccountDetailName { get; set; }
}

public class GetTreasurySubjectGLSGL
{
    public int Id { get; set; }
    public short StageId { get; set; }
    public short BranchId { get; set; }
}