using System.Text;

namespace ParsAlphabet.ERP.Application.Common;

public static class WeatherApi
{
    public class OpenWeatherMap
    {
        public static string GetCurrent(string CityName, string LanguageCode)
        {
            var appid = "3c350f44399511500d4f266677d029c4";
            var lang = "";
            if (LanguageCode != "")
                lang = LanguageCode;
            var url = "http://api.openweathermap.org/data/2.5/weather?q=" + CityName + "&lang=" + lang + "&APPID=" +
                      appid + "&units=metric&mode=xml";
            const string param = @"{"""": """"}";
            var client = new HttpClient();
            client.Timeout = TimeSpan.FromSeconds(1);
            client.BaseAddress = new Uri(url);
            HttpContent content = new StringContent(param, Encoding.UTF8, "text/xml");
            var messge = client.PostAsync(url, content).Result;
            var description = string.Empty;
            if (messge.IsSuccessStatusCode)
            {
                var result = messge.Content.ReadAsStringAsync().Result;
                description = result;
            }

            return description;
        }

        public static string GetForecast(string CityName, string LanguageCode)
        {
            var appid = "3c350f44399511500d4f266677d029c4";
            var lang = "";
            if (LanguageCode != "")
                lang = LanguageCode;
            var url = "https://api.openweathermap.org/data/2.5/forecast?q=" + CityName + "&lang=" + lang + "&APPID=" +
                      appid + "&units=metric&mode=xml";
            const string param = @"{"""": """"}";
            var client = new HttpClient();
            client.Timeout = TimeSpan.FromSeconds(1);
            client.BaseAddress = new Uri(url);
            HttpContent content = new StringContent(param, Encoding.UTF8, "text/xml");
            var messge = client.PostAsync(url, content).Result;
            var description = string.Empty;
            if (messge.IsSuccessStatusCode)
            {
                var result = messge.Content.ReadAsStringAsync().Result;
                description = result;
            }

            return description;
        }
    }

    public class Parsijoo
    {
        public async Task<string> GetCurrent(string CityName)
        {
            var result = "";
            var url = "http://parsijoo.ir/api?serviceType=weather-API&q=" + CityName;
            const string param = @"{"""": """"}";
            var client = new HttpClient();
            client.Timeout = TimeSpan.FromSeconds(5);
            client.BaseAddress = new Uri(url);
            HttpContent content = new StringContent(param, Encoding.UTF8, "text/xml");
            try
            {
                var messge = await client.PostAsync(url, content);
                if (messge.IsSuccessStatusCode) result = await messge.Content.ReadAsStringAsync();
            }
            catch
            {
                result = "";
            }

            return result;
        }
    }
}