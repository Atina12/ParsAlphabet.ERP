using System.ComponentModel.DataAnnotations;

namespace ParsAlphabet.ERP.Application.Common;

public static class ErpValidator
{
    /// <summary>
    ///     دریافت نتیجه اعتبار سنجی یک مدل یا جدی تی او
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    public static List<ValidationError> ValidateModel(object model)
    {
        var result = new List<ValidationError>();
        var validationResults = ValidateObject(model);

        foreach (var item in validationResults)
            result.Add(new ValidationError
            {
                Message = item.ErrorMessage
            });

        return result;
    }

    /// <summary>
    ///     دریافت لیستی از ValidationResult ها از یک مدل یا جدی تی او در صورتی که خطا داشته باشد
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    public static List<ValidationResult> ValidateObject(object model)
    {
        var results = new List<ValidationResult>();
        var context = new ValidationContext(model, null, null);

        Validator.TryValidateObject(model, context, results);

        return results;
    }
}