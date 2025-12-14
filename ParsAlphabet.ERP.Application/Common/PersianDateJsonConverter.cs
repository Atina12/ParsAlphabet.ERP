using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace ParsAlphabet.ERP.Application.Common;

public class PersianDateJsonConverter : JsonConverter
{
    public PersianDateJsonConverter()
    {
    }

    public PersianDateJsonConverter(string format)
    {
        Format = format;
    }

    public string Format { get; set; }

    public override bool CanWrite => true;
    public override bool CanRead => true;

    public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
    {
        var date = value as DateTime?;
        string persianDate = null;

        if (string.IsNullOrWhiteSpace(Format))
        {
            if (date != DateTime.MinValue)
                //persianDate = date.ToFa();
                persianDate = date.ToPersianDateStringNull("{0}/{1}/{2}");
            else
                persianDate = "1300/01/01";
        }
        else
        {
            if (date != DateTime.MinValue)
                //persianDate = date.ToFa();
                persianDate = date.ToPersianDateStringNull("{0}/{1}/{2}");
            else
                persianDate = "1300/01/01";
        }

        if (persianDate != null)
        {
            var t = JToken.FromObject(persianDate);
            t.WriteTo(writer);
        }
    }

    public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
    {
        var jValue = new JValue(reader.Value);
        if (jValue.Type == JTokenType.String)
        {
            var value = (string)reader.Value;

            if (string.IsNullOrEmpty(value))
                return null;
            try
            {
                //return value.ToEn();
                return value.ToMiladiDateTime().ToString();
            }
            catch (Exception)
            {
                return null;
            }
        }

        return reader.Value;
    }

    public override bool CanConvert(Type objectType)
    {
        return objectType == typeof(DateTime) || objectType == typeof(DateTime?);
    }
}