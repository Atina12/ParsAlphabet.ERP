using System.Text.RegularExpressions;

namespace ParsAlphabet.ERP.Application.Dtos.GN.PersonAccount;

public class PersonAccountGetPage
{
    public int Id { get; set; }
    public int KeyId { get; set; }
    public short BankId { get; set; }
    public string BankName { get; set; }
    public string Bank => BankId == 0 ? "" : $"{BankId} - {BankName}";
    public string AccountNo { get; set; }
    public string CardNo { get; set; }
    public string ShebaNo { get; set; }

    public string ShebaNoTyped
    {
        get
        {
            var pattern = @"/(IR)\d{2}-\d{4}-\d{4}-\d{4}-\d{4}-\d{4}-\d{2}/";
            var shebaStr = ShebaNo;
            var sheba = ShebaNo;
            if (Regex.IsMatch(ShebaNo, pattern))
                shebaStr = Regex.Replace(sheba, pattern, ",");

            return shebaStr;
        }
    }

    public bool IsActive { get; set; }
    public bool IsDefualt { get; set; }
    public string PersonName { get; set; }
    public string Person => KeyId == 0 ? "" : $"{KeyId} - {PersonName}";
}

public class PersonAccountGetRecord
{
    public int Id { get; set; }
    public int PersonId { get; set; }
    public string PersonName { get; set; }
    public short BankId { get; set; }
    public string AccountNo { get; set; }
    public string CardNo { get; set; }
    public string ShebaNo { get; set; }
    public string ShebaNoStr => ShebaNo;
    public bool IsActive { get; set; }
    public bool IsDefualt { get; set; }
}

public class Get_PersonAccount : CompanyViewModel
{
    public int Id { get; set; }
    public int PersonId { get; set; }
    public byte PersonTypeId { get; set; } = 2;
    public short BankId { get; set; }
    public string AccountNo { get; set; }
}