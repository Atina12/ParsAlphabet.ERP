using System.Net;
using System.Net.Http.Headers;
using System.Text;
using ParsAlphabet.WebService.Api.Model.Tamin.Authentication;
using ParsAlphabet.WebService.Api.Model.Tamin.Public;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.WebServices.CallRequest;

public class HttpClientRequest
{
    private readonly IHttpClientFactory _clientFactory;

    public HttpClientRequest(IHttpClientFactory clientFactory)
    {
        _clientFactory = clientFactory;
    }

    public async Task<ResponseResult> OnPost(string baseUrl, string apiUrl, string content, string contentType,
        List<RequestHeader> headers, int timeout = 0)
    {
        var response = new ResponseResult();
        try
        {
            var url = baseUrl + apiUrl;
            var request = new HttpRequestMessage(HttpMethod.Post, url);

            request.Content = new StringContent(content, Encoding.UTF8, contentType);

            var client = _clientFactory.CreateClient();

            if (timeout != 0) client.Timeout = TimeSpan.FromSeconds(timeout);

            if (headers.ListHasRow())
                foreach (var header in headers)
                    client.DefaultRequestHeaders.Add(header.Key, header.Value);

            var res = await client.SendAsync(request);

            response.StatusCode = res.StatusCode;
            response.IsSuccessStatusCode = res.IsSuccessStatusCode;
            var responseString = await res.Content.ReadAsStringAsync();
            response.ResponseContent = responseString;
            return response;
        }
        catch (Exception ex)
        {
            response.StatusCode = HttpStatusCode.BadRequest;
            response.IsSuccessStatusCode = false;
            var responseString = ex.ToString();
            response.ResponseContent = responseString;
            return response;
        }
    }

    public async Task<ResponseResult> OnGet(string baseUrl, string url, string contentType, List<RequestHeader> headers)
    {
        var response = new ResponseResult();

        var client = _clientFactory.CreateClient();
        client.DefaultRequestHeaders.Add("Accept", contentType);

        foreach (var header in headers) client.DefaultRequestHeaders.Add(header.Key, header.Value);

        client.BaseAddress = new Uri(baseUrl);

        var res = await client.GetAsync(url);
        response.StatusCode = res.StatusCode;

        if (res.IsSuccessStatusCode)
        {
            var responseStream = await res.Content.ReadAsStringAsync();
            response.ResponseContent = responseStream;
        }

        return response;
    }

    public async Task<ResponseResult> OnPut(string baseUrl, string apiUrl, string content, string contentType,
        List<RequestHeader> headers)
    {
        try
        {
            var response = new ResponseResult();

            HttpContent httpContent = new StringContent(content, Encoding.UTF8, contentType);

            var client = _clientFactory.CreateClient();

            client.DefaultRequestHeaders
                .Accept
                .Add(new MediaTypeWithQualityHeaderValue("application/json")); //ACCEPT header

            client.DefaultRequestHeaders.Add("Accept", contentType);

            foreach (var header in headers) client.DefaultRequestHeaders.Add(header.Key, header.Value);

            var res = await client.PutAsync(baseUrl + apiUrl, httpContent);

            response.StatusCode = res.StatusCode;
            response.IsSuccessStatusCode = res.IsSuccessStatusCode;
            var responseString = await res.Content.ReadAsStringAsync();
            response.ResponseContent = responseString;
            return response;
        }
        catch (Exception)
        {
            return null;
        }
    }

    public async Task<ResponseResult> OnDelete(string baseUrl, string url, string contentType,
        List<RequestHeader> headers)
    {
        var response = new ResponseResult();

        var client = _clientFactory.CreateClient();
        client.DefaultRequestHeaders.Add("Accept", contentType);

        foreach (var header in headers) client.DefaultRequestHeaders.Add(header.Key, header.Value);

        client.BaseAddress = new Uri(baseUrl);

        var res = await client.DeleteAsync(url);
        response.StatusCode = res.StatusCode;

        if (res.IsSuccessStatusCode)
        {
            var responseStream = await res.Content.ReadAsStringAsync();
            response.ResponseContent = responseStream;
        }

        return response;
    }
}