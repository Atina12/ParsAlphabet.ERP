namespace ParsAlphabet.ERP.Application.Dtos.FM.TreasuryBondDesign;

public class TreasuryBondDesignModel
{
    public int Id { get; set; }
    public short BankId { get; set; }

    public string ColorText { get; set; }
    public string Width { get; set; }
    public string Height { get; set; }

    public string NumericDate_Top { get; set; }
    public string NumericDate_Right { get; set; }
    public string NumericDate_Width { get; set; }
    public string NumericDate_Height { get; set; }
    public string NumericDate_Font { get; set; }
    public string NumericDate_FontSize { get; set; }
    public bool NumericDate_IsSeprate { get; set; }
    public bool NumericDate_IsActive { get; set; }

    public string LetterDate_Top { get; set; }
    public string LetterDate_Right { get; set; }
    public string LetterDate_Width { get; set; }
    public string LetterDate_Height { get; set; }
    public string LetterDate_Font { get; set; }
    public string LetterDate_FontSize { get; set; }
    public bool LetterDate_IsActive { get; set; }

    public string NumericAmount_Top { get; set; }
    public string NumericAmount_Right { get; set; }
    public string NumericAmount_Width { get; set; }
    public string NumericAmount_Height { get; set; }
    public string NumericAmount_Font { get; set; }
    public string NumericAmount_FontSize { get; set; }
    public bool NumericAmount_IsSeprate { get; set; }
    public bool NumericAmount_IsActive { get; set; }

    public string LetterAmount_Top { get; set; }
    public string LetterAmount_Right { get; set; }
    public string LetterAmount_Width { get; set; }
    public string LetterAmount_Height { get; set; }
    public string LetterAmount_Font { get; set; }
    public string LetterAmount_FontSize { get; set; }
    public bool LetterAmount_IsActive { get; set; }

    public string Recipient_Top { get; set; }
    public string Recipient_Right { get; set; }
    public string Recipient_Width { get; set; }
    public string Recipient_Height { get; set; }
    public string Recipient_Font { get; set; }
    public string Recipient_FontSize { get; set; }
    public bool Recipient_IsActive { get; set; }

    public string IdNo_Top { get; set; }
    public string IdNo_Right { get; set; }
    public string IdNo_Width { get; set; }
    public string IdNo_Height { get; set; }
    public string IdNo_Font { get; set; }
    public string IdNo_FontSize { get; set; }
    public bool IdNo_IsActive { get; set; }

    public string Description_Top { get; set; }
    public string Description_Right { get; set; }
    public string Description_Width { get; set; }
    public string Description_Height { get; set; }
    public string Description_Font { get; set; }
    public string Description_FontSize { get; set; }
    public bool Description_IsActive { get; set; }
}