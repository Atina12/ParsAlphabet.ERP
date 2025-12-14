using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using Validation = ParsAlphabet.ERP.Application.Common.Extensions.Validation;

namespace ParsAlphabet.ERP.Application.Common;

public class AttributeValidator
{
    public class AfghanTazkiraAttribute : ValidationAttribute
    {
        public override bool IsValid(object value)
        {
         
            if (value == null)
                return true;

            var input = value.ToString();

            if (string.IsNullOrWhiteSpace(input))
                return true;

            var digits = Regex.Replace(input, @"\D", "");

            if (!Regex.IsMatch(digits, @"^\d{13}$"))
                return false;

            var year = int.Parse(digits.Substring(0, 4));

            var month = int.Parse(digits.Substring(4, 2));

            var rest = digits.Substring(8, 5);

            if (year < 1390 || year > 1500)
                return false;

            if (month < 1 || month > 12)
                return false;

            if (!Regex.IsMatch(rest, @"^\d{5}$"))
                return false;

            return true;

        }
    }

    public class IPv4Attribute : ValidationAttribute
    {
        public override bool IsValid(object value)
        {
            var strValue = value as string;
            if (!string.IsNullOrEmpty(strValue.Trim()))
                return Central.ObjectModel.HelperFunctions.Validation.IsValidIPv4(strValue);

            return true;
        }
    }

    public class PercentageAttribute : ValidationAttribute
    {
        public override bool IsValid(object value)
        {
            var strValue = value as string;
            if (!string.IsNullOrEmpty(strValue))
                return Validation.IsValidPercentage(strValue);

            return true;
        }
    }
}