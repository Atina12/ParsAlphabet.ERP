using AutoMapper;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.Net.Http.Headers;
using Microsoft.OpenApi.Models;
using ParsAlphabet.ERP.Domain.Data;
using ParseAlphabet.ERP.Web.Utility.ServiceCollection;
using System.Globalization;
using System.IO.Compression;
using System.Text.Encodings.Web;
using System.Text.Unicode;
using ParseAlphabet.ERP.Web.Redis;
using DayOfWeek = System.DayOfWeek;
using Microsoft.AspNetCore.DataProtection;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

var myCI = new CultureInfo("en-US", false);
var myCIclone = (CultureInfo)myCI.Clone();
var dateformat = new DateTimeFormatInfo
{
    ShortDatePattern = "yyyy/MM/dd",
    LongDatePattern = "dddd, MMMM d, yyyy",
    ShortTimePattern = "HH:mm tt",
    LongTimePattern = "HH:mm:ss tt",
    FirstDayOfWeek = DayOfWeek.Saturday
};
builder.Services.AddCors(option =>
{
    option.AddPolicy("CashStandOrigin", policy => policy.WithOrigins("http://localhost", "http://192.168.6.12/"));
    option.AddPolicy("CashStandOrigin", policy => policy.WithOrigins("http://localhost", "http://192.168.6.12/"));
    option.AddPolicy("PosBehpardakht", policy => policy.WithOrigins("http://localhost", "http://192.168.6.12/"));
});

myCIclone.DateTimeFormat = dateformat;
CultureInfo.DefaultThreadCurrentCulture = myCIclone;


var mapperConfig = new MapperConfiguration(mc => { mc.AddProfile(new MappingProfile()); });

var mapper = mapperConfig.CreateMapper();
builder.Services.AddSingleton(mapper);

//builder.Services.AddWebMarkupMin(options =>
//{
//    options.AllowCompressionInDevelopmentEnvironment = true;
//    options.AllowMinificationInDevelopmentEnvironment = true;
//})
//   .AddHtmlMinification()
//    .AddHttpCompression()
//    .AddXmlMinification();

builder.Services.AddTransients();

builder.Services.AddSingleton(sp =>
{
    var redisUrl = configuration["Redis:url"];
    return new ConnectionHelper(redisUrl);
});

builder.Services.AddMemoryCache();
builder.Services.AddHttpClient();

builder.Services.AddDbContext<ERPContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions => sqlOptions.CommandTimeout(180) 
    )
);




var appUrl = configuration["Application:applicationUrl"];

builder.Services.AddAuthentication(o =>
{
    o.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    o.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    o.DefaultChallengeScheme = CookieAuthenticationDefaults.AuthenticationScheme;
}).AddCookie(o =>
{
    o.Cookie.Name = ".AspNetAuth" + appUrl;
    o.LoginPath = new PathString("/");
    o.AccessDeniedPath = new PathString("/");
    o.ExpireTimeSpan = TimeSpan.FromDays(30);
    o.SlidingExpiration = true;
});

builder.Services.AddDataProtection()
    .PersistKeysToFileSystem(new DirectoryInfo(Path.Combine(builder.Environment.ContentRootPath, "App_Data", "DataProtectionKeys")))
    .SetApplicationName("ParseAlphabet.ERP.Web");

//حل مشکل فارسی در ViewData[]
builder.Services.AddSingleton(HtmlEncoder.Create(UnicodeRanges.BasicLatin, UnicodeRanges.Arabic));
//Client Ip

builder.Services.Configure<GzipCompressionProviderOptions>(options => { options.Level = CompressionLevel.Fastest; });

builder.Services.AddMvcCore()
    .AddApiExplorer();

builder.Services.AddMvc();
builder.Services.AddSwaggerGen(c =>
{
    c.CustomSchemaIds(type => type.ToString());
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "Implement",
        Description = "swagger ui",
        TermsOfService = new Uri("https://example.com/terms"),
        Contact = new OpenApiContact
        {
            Name = "ParsAlphabet",
            Email = "email@[domain].com",
            Url = new Uri("https://twitter.com/[twitterName]")
        },
        License = new OpenApiLicense
        {
            Name = "License",
            Url = new Uri("https://example.com/license")
        }
    });
});


var app = builder.Build();
var httpContext = app.Services.GetService<IHttpContextAccessor>();

UserClaims.SetHttpContextAccessor(httpContext);

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseExceptionHandler("/errorlog/logtodb");
}
else
{
    app.UseExceptionHandler("/errorlog/logtodb");
}


app.UseSwagger();
app.UseSwaggerUI(c => { c.SwaggerEndpoint("/swagger/v1/swagger.json", "Showing API V1"); });
app.UseHttpsRedirection();
app.UseCookiePolicy();
app.UseAuthentication();
app.UseAuthorization();

//compress and minify
//app.UseWebMarkupMin();

app.UseCors("CashStandOrigin");
app.UseCors("PosBehpardakht");

//app.UseMiddleware<SecurityHeadersMiddleware>();

var options = new StaticFileOptions
{
    OnPrepareResponse = context => context.Context.Response.GetTypedHeaders()
        .CacheControl = new CacheControlHeaderValue
    {
        Public = true,
        NoCache = true,
        NoStore = true,
        MaxAge = TimeSpan.FromMinutes(-1) // 1 year
    }
};

app.UseStaticFiles(options);

//حل مشکل شناسایی در فولدر js
app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = context =>
    {
        // Disable caching of all static files.
        context.Context.Response.Headers.Add("Cache-Control", "no-cache, no-store");
        context.Context.Response.Headers.Add("Expires", "-1");
        context.Context.Response.Headers.Add("Pragma", "no-cache");
    },

    FileProvider = new PhysicalFileProvider(
        Path.Combine(app.Environment.WebRootPath, "Modules")),
    RequestPath = "/Modules",
    ContentTypeProvider = new FileExtensionContentTypeProvider(
        new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            { ".js", "application/javascript" },
            { ".html", "" },
            { ".json", "" },
            { ".txt", "" }
        })
});




//app.UseSignalR(signal =>
//{
//    signal.MapHub<NotifyHub>("/NotifyHub");
//});
//app.UseResponseCaching();

app.MapControllerRoute(
    "default",
    "{controller=Login}/{action=LoginIndex}/{id?}");
app.Run();
