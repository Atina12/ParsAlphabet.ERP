namespace ParsAlphabet.ERP.Application.Dtos.MC.HealthIDOrder;

public class HealthIDOrderGetPage
{
    public short Id { get; set; }
    public int InsurerId { get; set; }
    public string InsurerName { get; set; }
    public string Insurer => IdAndTitle(InsurerId, InsurerName);
    public int Quantity { get; set; }
    public int Balance { get; set; }
    public int ValidCount { get; set; }
    public bool IsActive { get; set; }
}

public class HealthIDOrderGetRecord
{
    public int Id { get; set; }
    public int InsurerId { get; set; }
    public int Quantity { get; set; }
    public bool IsActive { get; set; }
}

public class GetHealthId
{
    public int Id { get; set; }
    public string HID { get; set; }
    public DateTime ValidDate { get; set; }
    public string ValidDatePersian => ValidDate.ToPersianDateString("{0}/{1}/{2}");
}

public class GenerateBatchHID : CompanyViewModel
{
    public int InsurerId { get; set; }
    public byte HIDStateId { get; set; }
    public DateTime ValidDate { get; set; }

    public string ValidDatePersian
    {
        set => ValidDate = value.ToMiladiDateTime().Value;
    }

    public List<HIDList> HIDList { get; set; }

    //public int CompanyId { get; set; }
}

public class HIDList
{
    public string HID { get; set; }
}