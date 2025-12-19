using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class TreasuryBondDesign
{
    public byte Id { get; set; }

    public short BankId { get; set; }

    public string ColorText { get; set; }

    public string Width { get; set; }

    public string Height { get; set; }

    public string NumericDateTop { get; set; }

    public string NumericDateRight { get; set; }

    public string NumericDateWidth { get; set; }

    public string NumericDateHeight { get; set; }

    public bool? NumericDateIsSeprate { get; set; }

    public string NumericDateFont { get; set; }

    public string NumericDateFontSize { get; set; }

    public string LetterDateTop { get; set; }

    public string LetterDateRight { get; set; }

    public string LetterDateWidth { get; set; }

    public string LetterDateHeight { get; set; }

    public string LetterDateFont { get; set; }

    public string LetterDateFontSize { get; set; }

    public string NumericAmountTop { get; set; }

    public string NumericAmountRight { get; set; }

    public string NumericAmountWidth { get; set; }

    public string NumericAmountHeight { get; set; }

    public string NumericAmountFont { get; set; }

    public string NumericAmountFontSize { get; set; }

    public bool? NumericAmountIsSeprate { get; set; }

    public string LetterAmountTop { get; set; }

    public string LetterAmountRight { get; set; }

    public string LetterAmountWidth { get; set; }

    public string LetterAmountHeight { get; set; }

    public string LetterAmountFont { get; set; }

    public string LetterAmountFontSize { get; set; }

    public string RecipientTop { get; set; }

    public string RecipientRight { get; set; }

    public string RecipientWidth { get; set; }

    public string RecipientHeight { get; set; }

    public string RecipientFont { get; set; }

    public string RecipientFontSize { get; set; }

    public string IdnoTop { get; set; }

    public string IdnoRight { get; set; }

    public string IdnoWidth { get; set; }

    public string IdnoHeight { get; set; }

    public string IdnoFont { get; set; }

    public string IdnoFontSize { get; set; }

    public string DescriptionTop { get; set; }

    public string DescriptionRight { get; set; }

    public string DescriptionWidth { get; set; }

    public string DescriptionHeight { get; set; }

    public string DescriptionFont { get; set; }

    public string DescriptionFontSize { get; set; }

    public bool? NumericDateIsActive { get; set; }

    public bool? LetterDateIsActive { get; set; }

    public bool? NumericAmountIsActive { get; set; }

    public bool? LetterAmountIsActive { get; set; }

    public bool? RecipientIsActive { get; set; }

    public bool? IdnoIsActive { get; set; }

    public bool? DescriptionIsActive { get; set; }
}
