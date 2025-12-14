using System.Net;
using System.Net.Http.Headers;
using System.Text;
using ParsAlphabet.Central.ObjectModel.Public;
using ParsAlphabet.Central.ObjectModel.Requests;

namespace ERPCentral.Interface.App.CallRequest;

public class HttpClientRequest
{
    private readonly IHttpClientFactory _clientFactory;

    public HttpClientRequest(IHttpClientFactory clientFactory)
    {
        _clientFactory = clientFactory;
    }

    public async Task<RequestResponse> OnPost(string baseUrl, string apiUrl, string content, string contentType,
        List<RequestHeader> headers, int timeoutSecond = 0)
    {
        var response = new RequestResponse();
        try
        {
            var url = baseUrl + apiUrl;
            var request = new HttpRequestMessage(HttpMethod.Post, url);

            request.Content = new StringContent(content, Encoding.UTF8, contentType);

            var client = _clientFactory.CreateClient();

            if (timeoutSecond != 0)
                client.Timeout = TimeSpan.FromSeconds(timeoutSecond);


            if (headers.NotNull())
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

    public async Task<RequestResponse> OnGet(string baseUrl, string url, string contentType,
        List<RequestHeader> headers, int timeoutSecond = 0)
    {
        var response = new RequestResponse();

        var client = _clientFactory.CreateClient();
        client.DefaultRequestHeaders.Add("Accept", contentType);

        if (headers.NotNull())
            foreach (var header in headers)
                client.DefaultRequestHeaders.Add(header.Key, header.Value);

        client.BaseAddress = new Uri(baseUrl);

        if (timeoutSecond != 0)
            client.Timeout = TimeSpan.FromSeconds(timeoutSecond);

        var res = await client.GetAsync(url);
        response.StatusCode = res.StatusCode;

        if (res.IsSuccessStatusCode)
        {
            var responseStream = await res.Content.ReadAsStringAsync();
            response.ResponseContent = responseStream;
        }

        return response;
    }

    public async Task<RequestResponse> OnPut(string baseUrl, string apiUrl, string content, string contentType,
        List<RequestHeader> headers, int timeoutSecond = 0)
    {
        try
        {
            var response = new RequestResponse();

            HttpContent httpContent = new StringContent(content, Encoding.UTF8, contentType);

            var client = _clientFactory.CreateClient();

            client.DefaultRequestHeaders
                .Accept
                .Add(new MediaTypeWithQualityHeaderValue("application/json")); //ACCEPT header

            client.DefaultRequestHeaders.Add("Accept", contentType);

            if (timeoutSecond != 0)
                client.Timeout = TimeSpan.FromSeconds(timeoutSecond);

            if (headers.NotNull())
                foreach (var header in headers)
                    client.DefaultRequestHeaders.Add(header.Key, header.Value);

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

    public async Task<RequestResponse> OnDelete(string baseUrl, string url, string contentType,
        List<RequestHeader> headers, int timeoutSecond = 0)
    {
        var response = new RequestResponse();

        var client = _clientFactory.CreateClient();
        client.DefaultRequestHeaders.Add("Accept", contentType);

        if (headers.NotNull())
            foreach (var header in headers)
                client.DefaultRequestHeaders.Add(header.Key, header.Value);

        if (timeoutSecond != 0)
            client.Timeout = TimeSpan.FromSeconds(timeoutSecond);

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