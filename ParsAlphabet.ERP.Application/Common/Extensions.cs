using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;
using ParsAlphabet.ERP.Application.Dtos.FM.PostingGroup;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using System.Dynamic;
using System.Net;
using System.Net.NetworkInformation;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using Enum = System.Enum;

namespace ParsAlphabet.ERP.Application.Common;

public static class Extensions
{
    private static readonly int maxAllowedFileSize = 1000000;

    //static string staticFileVersion = "02.1.1";

    public static string uploadFileFTP = "UploadFile";

    public static string GetEnumDescription<T>(string value)
    {
        var type = typeof(T);
        var name = Enum.GetNames(type).Where(f => f.Equals(value, StringComparison.CurrentCultureIgnoreCase))
            .Select(d => d).FirstOrDefault();
        if (name == null) return string.Empty;
        var customAttribute = type.GetField(name).GetCustomAttributes(typeof(DescriptionAttribute), false);
        return customAttribute.Length > 0 ? ((DescriptionAttribute)customAttribute[0]).Description : name;
    }

    public static string GetEnumDescription(object value)
    {
        var fi = value.GetType().GetField(value.ToString());
        if (fi != null)
        {
            var attributes = (DescriptionAttribute[])fi.GetCustomAttributes(typeof(DescriptionAttribute), false);
            return attributes.Length > 0 ? attributes[0].Description : value.ToString();
        }

        return "";
    }

    public static string IdAndTitle(object id, string name)
    {
        if (id == null || name.IsNullOrEmptyOrWhiteSpace())
            return string.Empty;

        if (id.ToString() == "0")
            return name;
        return $"{id} - {name}";
    }

    public static byte GetPersonGroupTypeId(short? NoSeriesId)
    {
        if (NoSeriesId == 102)
            return 2;
        if (NoSeriesId == 103)
            return 1;
        if (NoSeriesId == 104)
            return 3;
        if (NoSeriesId == 105)
            return 4;
        if (NoSeriesId == 106)
            return 5;
        return 0;
    }

    public static string GetMonth(byte MonthId)
    {
        var month = "";
        if (MonthId == 1)
            month = $"{MonthId} - حمل".ToString();
        else if (MonthId == 2)
            month = $"{MonthId} - ثور".ToString();
        else if (MonthId == 3)
            month = $"{MonthId} - جوزا".ToString();
        else if (MonthId == 4)
            month = $"{MonthId} - سرطان".ToString();
        else if (MonthId == 5)
            month = $"{MonthId} - اسد".ToString();
        else if (MonthId == 6)
            month = $"{MonthId} - سنبله".ToString();
        else if (MonthId == 7)
            month = $"{MonthId} - میزان".ToString();
        else if (MonthId == 8)
            month = $"{MonthId} - قوس".ToString();
        else if (MonthId == 9)
            month = $"{MonthId} - عقرب".ToString();
        else if (MonthId == 10)
            month = $"{MonthId} - جدی".ToString();
        else if (MonthId == 11)
            month = $"{MonthId} - دلو".ToString();
        else if (MonthId == 12)
            month = $"{MonthId} - حوت".ToString();

        return month;
    }

    public static string GetMonthWithOutId(byte MonthId)
    {
        var month = "";
        if (MonthId == 1)
            month = "حمل";
        else if (MonthId == 2)
            month = "ثور";
        else if (MonthId == 3)
            month = "جوزا";
        else if (MonthId == 4)
            month = "سرطان";
        else if (MonthId == 5)
            month = "اسد";
        else if (MonthId == 6)
            month = "سنبله";
        else if (MonthId == 7)
            month = "میزان";
        else if (MonthId == 8)
            month = "قوس";
        else if (MonthId == 9)
            month = "عقرب";
        else if (MonthId == 10)
            month = "جدی";
        else if (MonthId == 11)
            month = "دلو";
        else if (MonthId == 12)
            month = "حوت";

        return month;
    }

    public static byte DayOfWeek(short yearId, byte monthId, string dayId)
    {
        var shamsiDate = $"{yearId}/{monthId}/{dayId}";
        var miladiDate = shamsiDate.ToMiladiDateTime().Value;

        var dayOfWeek = (byte)miladiDate.DayOfWeek;

        // Miladi To Shamsi
        var dayWeekId = Convert.ToByte(dayOfWeek <= 6 ? dayOfWeek + 1 : dayOfWeek - 6);


        // Shamsi To Miladi
        //var dayWeekId = Convert.ToByte(dayOfWeek==1 ? dayOfWeek +6 : dayOfWeek - 1);

        return dayWeekId;
    }

    public static byte DayOfWeekToMiladi(byte dayOfWeek)
    {
        // Shamsi To Miladi
        var dayWeekId = Convert.ToByte(dayOfWeek == 1 ? dayOfWeek + 6 : dayOfWeek - 1);

        return dayWeekId;
    }

    public static byte DayOfWeekToShamsi(byte dayOfWeek)
    {
        //  Miladi To Shamsi
        var dayWeekId = Convert.ToByte(dayOfWeek <= 6 ? dayOfWeek + 1 : dayOfWeek - 6);

        return dayWeekId;
    }

    public static string GetDayName(byte weekDayId)
    {
        if (weekDayId == 1)
            return "شنبه";
        if (weekDayId == 2)
            return "یکشنبه";
        if (weekDayId == 3)
            return "دوشنبه";
        if (weekDayId == 4)
            return "سه شنبه";
        if (weekDayId == 5)
            return "چهارشنبه";
        if (weekDayId == 6)
            return "پنج شنبه";
        return "جمعه";
    }

    public static List<DataStageStepConfigColumnsViewModel> ColumnWidthNormalization(
        this List<DataStageStepConfigColumnsViewModel> dataColumns)
    {
        if (dataColumns.Where(a => a.IsDtParameter).Sum(a => a.Width) < 100)
        {
            var diffOfWidh = 100 - dataColumns.Where(a => a.IsDtParameter).Sum(a => a.Width);
            var addWidthValue = diffOfWidh / dataColumns.Where(a => a.IsDtParameter).Count();
            dataColumns.Where(a => a.IsDtParameter).ToList().ForEach(item =>
            {
                if (dataColumns.Where(a => a.IsDtParameter).Sum(a => a.Width) + addWidthValue <= 100)
                    item.Width += addWidthValue;
            });

            if (dataColumns.Where(a => a.IsDtParameter).Sum(a => a.Width) < 100)
            {
                diffOfWidh = 100 - dataColumns.Where(a => a.IsDtParameter).Sum(a => a.Width);
                dataColumns.Where(a => a.Id == "action").ToList().ForEach(item => { item.Width += diffOfWidh; });
            }
        }

        return dataColumns;
    }

    public static object GetPropValue(object src, string propName)
    {
        var propertyName = propName.ToPascalCase();
        return src.GetType().GetProperty(propertyName).GetValue(src, null);
    }

    public static string ToPascalCase(this string the_string)
    {
        // If there are 0 or 1 characters, just return the string.
        if (the_string == null) return the_string;
        if (the_string.Length < 2) return the_string.ToUpper();

        // Split the string into words.
        var words = the_string.Split(
            new char[] { },
            StringSplitOptions.RemoveEmptyEntries);

        // Combine the words.
        var result = "";
        foreach (var word in words)
            result +=
                word.Substring(0, 1).ToUpper() +
                word.Substring(1);

        return result;
    }

    public static async Task<string> GenerateFileName(string fileName)
    {
        var name = Guid.NewGuid().ToString().Replace("-", string.Empty) + Path.GetExtension(fileName);

        return await Task.FromResult(name);
    }

    public static async Task<ValidationFile> ValidateFile(this IFormFile file)
    {
        var extention = Path.GetExtension(file.FileName).ToLower();

        if (file != null && file.Length != 0)
        {
            if (Path.GetExtension(file.FileName).ToLower() == ".png" ||
                Path.GetExtension(file.FileName).ToLower() == ".pdf" ||
                Path.GetExtension(file.FileName).ToLower() == ".jpg" ||
                Path.GetExtension(file.FileName).ToLower() == ".jpeg")
                if (file.Length <= maxAllowedFileSize)
                    return await Task.FromResult(ValidationFile.Ok);

            return await Task.FromResult(ValidationFile.Extention);
        }

        return await Task.FromResult(ValidationFile.IsNull);
    }

    public static async Task<bool> IsImage(string fileName)
    {
        var ext = Path.GetExtension(fileName);

        if (string.Equals(ext, ".jpg", StringComparison.OrdinalIgnoreCase)
            || string.Equals(ext, ".png", StringComparison.OrdinalIgnoreCase)
            || string.Equals(ext, ".gif", StringComparison.OrdinalIgnoreCase)
            || string.Equals(ext, ".jpeg", StringComparison.OrdinalIgnoreCase))
            return await Task.FromResult(true);

        return await Task.FromResult(false);
    }

    public static string ConvertArabicAlphabet(this string text, bool isNull = false)
    {
        if (isNull) return null;

        if (text.IsNullOrEmptyOrWhiteSpace())
            return "";

        var newText = text.Trim();

        newText = newText.Replace("ي", "ی").Replace("ك", "ک");

        return newText;
    }

    public static string RemoveDigits(this string text)
    {
        if (text.IsNullOrEmptyOrWhiteSpace())
            return "";

        var newText = text.Trim();

        newText = Regex.Replace(text, @"[\d-]", string.Empty);

        return newText;
    }

    public static bool IsNullOrEmptyOrWhiteSpace(this string text)
    {
        return string.IsNullOrEmpty(text) || string.IsNullOrWhiteSpace(text);
    }

    public static string ConvertNullToEmpty(this string text)
    {
        if (text == null)
            return "";

        return text.Trim();
    }

    public static int ConvertNullToInt(this int? number)
    {
        if (number == null)
            return 0;

        return number.Value;
    }

    public static MyResultPage<T> ToMyResultPage<T>(this T data, string message = "", bool successfull = true)
    {
        return new MyResultPage<T>
        {
            Successfull = successfull,
            Data = data,
            Message = message
        };
    }

    public static MyResultDataQuery<T> ToMyResultDataQuery<T>(this ModelStateDictionary modelState)
    {
        var validationErrors = modelState.Values.SelectMany(v => v.Errors.Select(m => m.ErrorMessage)).ToList();

        return new MyResultDataQuery<T>
        {
            Successfull = false,
            ValidationErrors = validationErrors
        };
    }

    public static MyResultQuery ToMyResultQuery<T>(this ModelStateDictionary modelState)
    {
        var validationErrors = modelState.Values.SelectMany(v => v.Errors.Select(m => m.ErrorMessage)).ToList();

        return new MyResultQuery
        {
            Successfull = false,
            ValidationErrors = validationErrors
        };
    }

    public static PostingGroupSaveResultQuery ToPostingGroupMyResultQuery<T>(this ModelStateDictionary modelState)
    {
        var validationErrors = modelState.Values.SelectMany(v => v.Errors.Select(m => m.ErrorMessage)).ToList();

        return new PostingGroupSaveResultQuery
        {
            Successfull = false,
            ValidationErrors = validationErrors
        };
    }

    public static MyResultDataStatus<T> ToMyResultDataStatus<T>(this ModelStateDictionary modelState)
    {
        var validationErrors = modelState.Values.SelectMany(v => v.Errors.Select(m => m.ErrorMessage)).ToList();

        return new MyResultDataStatus<T>
        {
            Successfull = false,
            ValidationErrors = validationErrors
        };
    }

    public static MyResultStatus ToMyResultStatus<T>(this ModelStateDictionary modelState)
    {
        var validationErrors = modelState.Values.SelectMany(v => v.Errors.Select(m => m.ErrorMessage)).ToList();

        return new MyResultStatus
        {
            Successfull = false,
            ValidationErrors = validationErrors
        };
    }

    public static string MounthDisplayName(this Mounths value)
    {
        var enumType = value.GetType();
        var member = enumType.GetMember(Enum.GetName(enumType, value))[0];
        var attrs = member.GetCustomAttributes(typeof(DisplayAttribute), false);
        var outString = ((DisplayAttribute)attrs[0]).Name;

        if (((DisplayAttribute)attrs[0]).ResourceType != null) outString = ((DisplayAttribute)attrs[0]).GetName();

        return outString;
    }

    public static string AdmissionReimbursmentDisplayName(this AdmissionReimbursmentEnumerator value)
    {
        var enumType = value.GetType();
        var member = enumType.GetMember(Enum.GetName(enumType, value))[0];
        var attrs = member.GetCustomAttributes(typeof(DisplayAttribute), false);
        var outString = ((DisplayAttribute)attrs[0]).Name;

        if (((DisplayAttribute)attrs[0]).ResourceType != null) outString = ((DisplayAttribute)attrs[0]).GetName();

        return outString;
    }

    public static string AttributeTypeDisplayName(this AttributeType value)
    {
        var enumType = value.GetType();
        var member = enumType.GetMember(Enum.GetName(enumType, value))[0];
        var attrs = member.GetCustomAttributes(typeof(DisplayAttribute), false);
        var outString = ((DisplayAttribute)attrs[0]).Name;

        if (((DisplayAttribute)attrs[0]).ResourceType != null) outString = ((DisplayAttribute)attrs[0]).GetName();

        return outString;
    }

    public static string GetDropDownCacheName(DropDownCache dropDownCache)
    {
        string cacheName;
        if (dropDownCache == DropDownCache.InsurerLine)
            cacheName = "InsurerLineCache";
        else if (dropDownCache == DropDownCache.Attender)
            cacheName = "AttenderCache";
        else if (dropDownCache == DropDownCache.AttenderParaClinic)
            cacheName = "AttenderParaClinicCache";
        else if (dropDownCache == DropDownCache.CompInsurerLine)
            cacheName = "CompInsurerLine";
        else if (dropDownCache == DropDownCache.ThirdParty)
            cacheName = "ThirdPartyCache";
        else if (dropDownCache == DropDownCache.Discount)
            cacheName = "DiscountCache";
        else
            cacheName = "CompInsurerLineThirdParty";

        return cacheName;
    }

    public static string IsDecimalDisplayName(this IsDecimal value)
    {
        var enumType = value.GetType();
        var member = enumType.GetMember(Enum.GetName(enumType, value))[0];
        var attrs = member.GetCustomAttributes(typeof(DisplayAttribute), false);
        var outString = ((DisplayAttribute)attrs[0]).Name;

        if (((DisplayAttribute)attrs[0]).ResourceType != null) outString = ((DisplayAttribute)attrs[0]).GetName();

        return outString;
    }

    public static string SexDisplayName(this Sex value)
    {
        var enumType = value.GetType();
        var member = enumType.GetMember(Enum.GetName(enumType, value))[0];
        var attrs = member.GetCustomAttributes(typeof(DisplayAttribute), false);
        var outString = ((DisplayAttribute)attrs[0]).Name;

        if (((DisplayAttribute)attrs[0]).ResourceType != null) outString = ((DisplayAttribute)attrs[0]).GetName();

        return outString;
    }

    public static string DaysDisplayName(this Days value)
    {
        var enumType = value.GetType();
        var member = enumType.GetMember(Enum.GetName(enumType, value))[0];
        var attrs = member.GetCustomAttributes(typeof(DisplayAttribute), false);
        var outString = ((DisplayAttribute)attrs[0]).Name;

        if (((DisplayAttribute)attrs[0]).ResourceType != null) outString = ((DisplayAttribute)attrs[0]).GetName();

        return outString;
    }


    public static List<MyDropDownViewModel> GetDaysDisplayName()
    {
        var list = Enum.GetValues(typeof(Days))
            .Cast<Days>()
            .Select(t => new MyDropDownViewModel
            {
                Id = (int)t,
                Name = t.DaysDisplayName()
            }).ToList();

        return list;
    }

    /// <summary>
    ///     بررسی null نبودن و رکورد داشت
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="items"></param>
    /// <returns>true => is not null</returns>
    public static bool ListHasRow<T>(this List<T> items)
    {
        return items != null && items.Any();
    }

    /// <summary>
    ///     بررسی null نبودن آبجکت
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="item"></param>
    /// <returns>true => is not null</returns>
    public static bool NotNull<T>(this T item)
    {
        return item != null;
    }

    public static bool In<T>(this T source, params T[] list)
    {
        return list.Contains(source);
    }

    public static bool ExistValueList<T>(this List<T> list, long value)
    {
        return list.Any(x => long.Parse(x.ToString()) == value);
    }

    public static class MyClaim
    {
        private static IHttpContextAccessor _httpContextAccessor;
        public static string IpAddress => _httpContextAccessor.HttpContext.Connection.RemoteIpAddress.ToString();

        public static bool IsSecondLang =>
            bool.Parse(_httpContextAccessor.HttpContext.User.FindFirst("IsSecondLang")?.Value);

        public static void Init(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }
    }

    public class OriginalNameContractResolver : DefaultContractResolver
    {
        protected override IList<JsonProperty> CreateProperties(Type type, MemberSerialization memberSerialization)
        {
            // Let the base class create all the JsonProperties 
            var list = base.CreateProperties(type, memberSerialization);

            // assign the C# property name
            foreach (var prop in list) prop.PropertyName = prop.UnderlyingName;

            return list;
        }
    }

    public static class WCFWebService
    {
        public static string WCFBaseUrl = "http://192.168.1.10:8081/";
        public static string WCFServiceName = "CIS_WCF.MyService.svc";
    }

    public static class Sms
    {
        //public static string kavenegarApiKey = "30356530714438562F6C4D6842434B546948564C32627972326F4A4233516E662B763370707A6163424B633D";
        public static string kavenegarApiKey =
            "5A50553761474959464561626B6751496A764B6F6C577257416565586141497A78574D50774B774C565A343D";

        public static bool SendSMS(string number, string content)
        {
            try
            {
                var wc = new WebClient();
                wc.QueryString.Add("receptor", number);
                wc.QueryString.Add("message", content);
                wc.QueryString.Add("sender", "10004000202022");
                //wc.QueryString.Add("sender", "0018018949161");
                var result = wc.DownloadString($"https://api.kavenegar.com/v1/{kavenegarApiKey}/sms/send.json");
                var obj = JsonConvert.DeserializeObject<Kavenegar>(result);
                return obj.@return.status == 200;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public class Return
        {
            public int status { get; set; }
            public string message { get; set; }
        }

        public class Entry
        {
            public int messageid { get; set; }
            public string message { get; set; }
            public int status { get; set; }
            public string statustext { get; set; }
            public string sender { get; set; }
            public string receptor { get; set; }
            public int date { get; set; }
            public int cost { get; set; }
        }

        public class Kavenegar
        {
            public Return @return { get; set; }
            public List<Entry> entries { get; set; }
        }
    }

    public static class Validation
    {
        public static bool IsValidIranianNationalCode(string value)
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

        public static bool IsValidIPv4(string input)
        {
            var regex =
                @"^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$";

            return Regex.IsMatch(input, regex);
        }

        public static bool IsValidPercentage(string input)
        {
            var regex = @"(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,3})?$)";

            return Regex.IsMatch(input, regex);
        }

        public static bool IsValidPersianDate(string input)
        {
            var regex = @"^(\d{4})\/(0?[1-9]|1[012])\/(0?[1-9]|[12][0-9]|3[01])$";
            return Regex.IsMatch(input, regex);
        }
    }

    public static class ActivationCode
    {
        public static int RandomNumber(int min, int max)
        {
            var random = new Random();
            return random.Next(min, max);
        }

        public static string RandomString(int size, bool lowerCase)
        {
            var builder = new StringBuilder();
            var random = new Random();
            char ch;
            for (var i = 0; i < size; i++)
            {
                ch = Convert.ToChar(Convert.ToInt32(Math.Floor(26 * random.NextDouble() + 65)));
                builder.Append(ch);
            }

            if (lowerCase)
                return builder.ToString().ToLower();
            return builder.ToString();
        }

        public static string RandomPassword()
        {
            var builder = new StringBuilder();
            builder.Append(RandomString(4, true));
            builder.Append(RandomNumber(1000, 9999));
            builder.Append(RandomString(2, false));
            return builder.ToString();
        }
    }

    public static class Password
    {
        public static string GetRandomSalt()
        {
            var rng = new RNGCryptoServiceProvider();
            var buffer = new byte[5];
            rng.GetBytes(buffer);
            var salt = Convert.ToBase64String(buffer);
            return salt;
        }

        public static string GetHash(string password, string saltstr)
        {
            if (saltstr == null || saltstr == "")
                return "";

            var salt = new byte[128 / 8];
            salt = Encoding.ASCII.GetBytes(saltstr);
            var hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password,
                salt,
                KeyDerivationPrf.HMACSHA1,
                10000,
                256 / 8));
            return hashed;
        }
    }

    public class NetTcp
    {
        public bool PingIp(string ip)
        {
            try
            {
                if (!Validation.IsValidIPv4(ip))
                    return false;

                var ping = new Ping();
                var options = new PingOptions
                {
                    DontFragment = true
                };

                var buffer = Encoding.ASCII.GetBytes("xxsd");
                var timeout = 1024;

                var pingresult = ping.Send(ip, timeout);
                return pingresult.Status == IPStatus.Success;
            }
            catch
            {
                return false;
            }
        }
    }

    public class Password1
    {
        private readonly int BlockSize;
        private uint BlockIndex = 1;

        private byte[] BufferBytes;
        private int BufferEndIndex;
        private int BufferStartIndex;

        /// <summary>
        ///     Creates new instance.
        /// </summary>
        /// <param name="algorithm">HMAC algorithm to use.</param>
        /// <param name="password">The password used to derive the key.</param>
        /// <param name="salt">The key salt used to derive the key.</param>
        /// <param name="iterations">The number of iterations for the operation.</param>
        /// <exception cref="ArgumentNullException">Algorithm cannot be null - Password cannot be null. -or- Salt cannot be null.</exception>
        public Password1(HMAC algorithm, byte[] password, byte[] salt, int iterations)
        {
            if (algorithm == null) throw new ArgumentNullException("algorithm", "Algorithm cannot be null.");
            if (salt == null) throw new ArgumentNullException("salt", "Salt cannot be null.");
            if (password == null) throw new ArgumentNullException("password", "Password cannot be null.");
            Algorithm = algorithm;
            Algorithm.Key = password;
            Salt = salt;
            IterationCount = iterations;
            BlockSize = Algorithm.HashSize / 8;
            BufferBytes = new byte[BlockSize];
        }

        /// <summary>
        ///     Creates new instance.
        /// </summary>
        /// <param name="algorithm">HMAC algorithm to use.</param>
        /// <param name="password">The password used to derive the key.</param>
        /// <param name="salt">The key salt used to derive the key.</param>
        /// <exception cref="ArgumentNullException">Algorithm cannot be null - Password cannot be null. -or- Salt cannot be null.</exception>
        public Password1(HMAC algorithm, byte[] password, byte[] salt)
            : this(algorithm, password, salt, 1000)
        {
        }

        /// <summary>
        ///     Creates new instance.
        /// </summary>
        /// <param name="algorithm">HMAC algorithm to use.</param>
        /// <param name="password">The password used to derive the key.</param>
        /// <param name="salt">The key salt used to derive the key.</param>
        /// <param name="iterations">The number of iterations for the operation.</param>
        /// <exception cref="ArgumentNullException">Algorithm cannot be null - Password cannot be null. -or- Salt cannot be null.</exception>
        public Password1(HMAC algorithm, string password, string salt, int iterations) :
            this(algorithm, Encoding.UTF8.GetBytes(password), Encoding.UTF8.GetBytes(salt), iterations)
        {
        }

        /// <summary>
        ///     Creates new instance.
        /// </summary>
        /// <param name="algorithm">HMAC algorithm to use.</param>
        /// <param name="password">The password used to derive the key.</param>
        /// <param name="salt">The key salt used to derive the key.</param>
        /// <exception cref="ArgumentNullException">Algorithm cannot be null - Password cannot be null. -or- Salt cannot be null.</exception>
        public Password1(HMAC algorithm, string password, string salt) :
            this(algorithm, password, salt, 1000)
        {
        }


        /// <summary>
        ///     Gets algorithm used for generating key.
        /// </summary>
        public HMAC Algorithm { get; }

        /// <summary>
        ///     Gets salt bytes.
        /// </summary>
        [SuppressMessage("Microsoft.Performance", "CA1819:PropertiesShouldNotReturnArrays",
            Justification = "Byte array is proper return value in this case.")]
        public byte[] Salt { get; }

        /// <summary>
        ///     Gets iteration count.
        /// </summary>
        public int IterationCount { get; }

        public static string GetRandomSalt()
        {
            var rng = new RNGCryptoServiceProvider();
            var buffer = new byte[5];
            rng.GetBytes(buffer);
            var salt = Convert.ToBase64String(buffer);
            return salt;
        }

        public static string GetHash(string password, string saltstr)
        {
            if (saltstr == null || saltstr == "")
                return "";

            var salt = new byte[128 / 8];
            salt = Encoding.ASCII.GetBytes(saltstr);
            //string hashed = Convert.ToBase64String(new Pbkdf2(password: password,salt: salt,prf: KeyDerivationPrf.HMACSHA1,iterationCount: 10000,numBytesRequested: 256 / 8));
            var hashed =
                Convert.ToBase64String(new Password1(new HMACSHA512(), Encoding.UTF8.GetBytes(password), salt, 100000)
                    .GetBytes(256 / 8));
            return hashed;
        }


        /// <summary>
        ///     Returns a pseudo-random key from a password, salt and iteration count.
        /// </summary>
        /// <param name="count">Number of bytes to return.</param>
        /// <returns>Byte array.</returns>
        public byte[] GetBytes(int count)
        {
            var result = new byte[count];
            var resultOffset = 0;
            var bufferCount = BufferEndIndex - BufferStartIndex;

            if (bufferCount > 0)
            {
                //if there is some data in buffer
                if (count < bufferCount)
                {
                    //if there is enough data in buffer
                    Buffer.BlockCopy(BufferBytes, BufferStartIndex, result, 0, count);
                    BufferStartIndex += count;
                    return result;
                }

                Buffer.BlockCopy(BufferBytes, BufferStartIndex, result, 0, bufferCount);
                BufferStartIndex = BufferEndIndex = 0;
                resultOffset += bufferCount;
            }

            while (resultOffset < count)
            {
                var needCount = count - resultOffset;
                BufferBytes = Func();
                if (needCount > BlockSize)
                {
                    //we one (or more) additional passes
                    Buffer.BlockCopy(BufferBytes, 0, result, resultOffset, BlockSize);
                    resultOffset += BlockSize;
                }
                else
                {
                    Buffer.BlockCopy(BufferBytes, 0, result, resultOffset, needCount);
                    BufferStartIndex = needCount;
                    BufferEndIndex = BlockSize;
                    return result;
                }
            }

            return result;
        }


        private byte[] Func()
        {
            var hash1Input = new byte[Salt.Length + 4];
            Buffer.BlockCopy(Salt, 0, hash1Input, 0, Salt.Length);
            Buffer.BlockCopy(GetBytesFromInt(BlockIndex), 0, hash1Input, Salt.Length, 4);
            var hash1 = Algorithm.ComputeHash(hash1Input);

            var finalHash = hash1;
            for (var i = 2; i <= IterationCount; i++)
            {
                hash1 = Algorithm.ComputeHash(hash1, 0, hash1.Length);
                for (var j = 0; j < BlockSize; j++) finalHash[j] = (byte)(finalHash[j] ^ hash1[j]);
            }

            if (BlockIndex == uint.MaxValue) throw new InvalidOperationException("Derived key too long.");
            BlockIndex += 1;

            return finalHash;
        }

        private static byte[] GetBytesFromInt(uint i)
        {
            var bytes = BitConverter.GetBytes(i);
            if (BitConverter.IsLittleEndian)
                return new[] { bytes[3], bytes[2], bytes[1], bytes[0] };
            return bytes;
        }
    }

    public static class Report
    {
        public static string Lisence =
            "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHkcgIvwL0jnpsDqRpWg5FI5kt2G7A0tYIcUygBh1sPs7koivWV0htru4Pn2682yhdY3+9jxMCVTKcKAjiEjgJzqXgLFCpe62hxJ7/VJZ9Hq5l39md0pyydqd5Dc1fSWhCtYqC042BVmGNkukYJQN0ufCozjA/qsNxzNMyEql26oHE6wWE77pHutroj+tKfOO1skJ52cbZklqPm8OiH/9mfU4rrkLffOhDQFnIxxhzhr2BL5pDFFCZ7axXX12y/4qzn5QLPBn1AVLo3NVrSmJB2KiwGwR4RL4RsYVxGScsYoCZbwqK2YrdbPHP0t5vOiLjBQ+Oy6F4rNtDYHn7SNMpthfkYiRoOibqDkPaX+RyCany0Z+uz8bzAg0oprJEn6qpkQ56WMEppdMJ9/CBnEbTFwn1s/9s8kYsmXCvtI4iQcz+RkUWspLcBzlmj0lJXWjTKMRZz+e9PmY11Au16wOnBU3NHvRc9T/Zk0YFh439GKd/fRwQrk8nJevYU65ENdAOqiP5po7Vnhif5FCiHRpxgF";

    }

    public class Operation
    {
        public const string PUB = "PUB";
        public const string MNU = "MNU";
        public const string VIW = "VIW";
        public const string DIS = "DIS";
        public const string INS = "INS";
        public const string UPD = "UPD";
        public const string DEL = "DEL";
        public const string PRN = "PRN";
        public const string FIL = "FIL";
    }

    public static class Convertor
    {
        public static byte[] ImageBase64ToByte(string base64)
        {
            if (base64 != null)
                return Convert.FromBase64String(base64);
            return null;
        }

        public static object ToMappedModel<T>(T model)
        {
            var propertyDescriptorCollection =
                TypeDescriptor.GetProperties(typeof(T));

            dynamic newClass = new ExpandoObject();

            for (var i = 0; i < propertyDescriptorCollection.Count; i++)
            {
                var propertyDescriptor = propertyDescriptorCollection[i];
                var type = propertyDescriptor.PropertyType;

                var hasNotMapped = propertyDescriptor.Attributes.OfType<NotMappedAttribute>().Any();

                if (!hasNotMapped)
                {
                    var value = model.GetType().GetProperty(propertyDescriptor.DisplayName).GetValue(model, null);

                    AddProperty(newClass, propertyDescriptor.DisplayName, value);
                }
            }

            return newClass;
        }

        public static void AddProperty(ExpandoObject expando, string propertyName, object propertyValue)
        {
            var expandoDict = expando as IDictionary<string, object>;
            if (expandoDict.ContainsKey(propertyName))
                expandoDict[propertyName] = propertyValue;
            else
                expandoDict.Add(propertyName, propertyValue);
        }
    }

    public static class IsAjax
    {
        public static bool CheckAjax(HttpContext httpContext)
        {
            return httpContext.Request.Headers["x-requested-with"] == "XMLHttpRequest";
        }
    }
}