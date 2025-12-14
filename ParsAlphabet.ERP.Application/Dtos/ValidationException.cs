namespace ParsAlphabet.ERP.Application.Dtos;

public class ValidationException : Exception
{
    public ValidationException()
    {
        Errors = new List<ValidationError>();
    }

    public List<ValidationError> Errors { get; set; }

    public bool HasError => Errors.Count > 0;

    public void AddRangeError(List<ValidationError> validationErrors)
    {
        foreach (var item in validationErrors) Errors.Add(item);
    }

    public void AddError(string message, object data = null)
    {
        Errors.Add(new ValidationError
        {
            Message = message,
            Data = data
        });
    }
}

public class ValidationError
{
    public string Message { get; set; }
    public object Data { get; set; }
}