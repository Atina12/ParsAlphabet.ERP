using System.Collections;
using System.Reflection;
using System.Web;
using Microsoft.AspNetCore.Mvc.Filters;

namespace ParseAlphabet.ERP.Web.Utility.Filter;

public class EncodeInputsActionFilter : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(
        ActionExecutingContext context,
        ActionExecutionDelegate next)
    {
        ProcessHtmlEncoding(context);
        var resultContext = await next();
        // do something after the action executes; resultContext.Result will be set
    }

    private static void ProcessHtmlEncoding(ActionExecutingContext context)
    {
        context.ActionArguments.ToList().ForEach(arg => { arg.Value.ParseProperties(); });
    }
}

public static class HttpEncode
{
    public static void ParseProperties(this object model)
    {
        if (model == null) return;

        if (IsPropertyArrayOrList(model.GetType()))
            ParsePropertiesOfList(model);
        else
            GetAllProperties(model).ForEach(t => EncodeField(t, model));
    }

    private static void ParsePropertiesOfList(object model)
    {
        foreach (var item in (IEnumerable)model) item.ParseProperties();
    }

    private static List<PropertyInfo> GetAllProperties(object value)
    {
        return value?.GetType()?.GetProperties()?.ToList();
    }

    private static void EncodeField(PropertyInfo p, object arg)
    {
        try
        {
            if (p.GetIndexParameters().Length != 0 || p.GetValue(arg) == null)
                return;

            if (IsUserDefinedClass(p.PropertyType) && p.CanWrite)
            {
                p.GetValue(arg).ParseProperties();
            }
            else if (IsPropertyArrayOrList(p.PropertyType) && p.CanWrite)
            {
                ParseArrayOrListProperty(p, arg);
            }
            else if (p.PropertyType == typeof(string) && p.CanWrite)
            {
                var encodedValue = HtmlEncode(p.GetValue(arg)?.ToString());
                SetPropertyValue(p, arg, encodedValue);
            }
        }
        catch (Exception)
        {
            // ignored
        }
    }

    private static void ParseArrayOrListProperty(PropertyInfo p, object arg)
    {
        if (p.GetValue(arg) is string[] || p.GetValue(arg) is List<string>)
            SetPropertyValueOfStaringArrayType(p, arg);
        else
            ParsePropertiesOfList(p.GetValue(arg));
    }

    private static void SetPropertyValueOfStaringArrayType(PropertyInfo propertyInfo, object arg)
    {
        if (propertyInfo.GetValue(arg) is string[] stringValue)
        {
            var result = new List<string>();
            stringValue.ToList().ForEach(l => result.Add(HtmlEncode(l)));
            SetPropertyValue(propertyInfo, arg, result.Any() ? result.ToArray() : null);
        }
        else if (propertyInfo.GetValue(arg) is List<string> listValue)
        {
            var result = new List<string>();
            listValue.ForEach(l => result.Add(HtmlEncode(l)));
            SetPropertyValue(propertyInfo, arg, result.Any() ? result : null);
        }
    }

    private static bool IsUserDefinedClass(Type type)
    {
        return type.IsClass &&
               !type.FullName.StartsWith("System.");
    }

    private static bool IsPropertyArrayOrList(Type type)
    {
        return (type.IsArray && type.GetElementType() == typeof(string)) ||
               (type != typeof(string) && type.GetInterface(typeof(IEnumerable<>).FullName) != null);
    }

    private static void SetPropertyValue(PropertyInfo propertyInfo, object allValue, object value)
    {
        propertyInfo.SetValue(allValue, value);
    }

    private static string HtmlEncode(string value)
    {
        return HttpUtility.HtmlEncode(value);
    }
}