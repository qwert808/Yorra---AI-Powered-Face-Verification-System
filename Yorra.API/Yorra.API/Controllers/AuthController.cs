using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace Yorra.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public AuthController()
        {
            _httpClient = new HttpClient();
        }

        [HttpPost("verify-face")]
        public async Task<IActionResult> VerifyFace(IFormFile image)
        {
            if (image == null || image.Length == 0)
            {
                return BadRequest(new { status = "error", message = "No image file provided" });
            }

            // The URL for our local Python verification service
            var pythonServiceUrl = "http://localhost:5001/verify-face";

            try
            {
                // --- 1. Prepare the Request to send to the Python service ---
                using var content = new MultipartFormDataContent();
                using var imageStream = new StreamContent(image.OpenReadStream());
                content.Add(imageStream, "image", image.FileName);

                // --- 2. Call the Python Service ---
                var response = await _httpClient.PostAsync(pythonServiceUrl, content);

                if (!response.IsSuccessStatusCode)
                {
                    return StatusCode(500, new { status = "error", message = "Error from the internal verification service." });
                }

                // --- 3. Process the Response from the Python service ---
                var jsonResponse = await response.Content.ReadAsStringAsync();
                var result = JsonSerializer.Deserialize<JsonElement>(jsonResponse);

                if (!result.TryGetProperty("gender", out var genderElement))
                {
                    return Ok(new { status = "failure", message = "No face detected." });
                }

                var gender = genderElement.GetString();

                // --- 4. Return the Final Verdict to the mobile app ---
                if (gender == "Female")
                {
                    return Ok(new { status = "success", message = "Verification successful. Welcome!", verified = true });
                }
                else
                {
                    return Ok(new { status = "failure", message = "Verification failed: User is not female.", verified = false });
                }
            }
            catch (Exception ex)
            {
                // This will catch errors if the Python service is not running
                return StatusCode(500, new { status = "error", message = $"An internal server error occurred: {ex.Message}" });
            }
        }
    }
}
