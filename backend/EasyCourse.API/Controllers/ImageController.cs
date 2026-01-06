using EasyCourse.Core.DTO;
using EasyCourse.Core.DTO.Image;
using EasyCourse.Core.Entities;
using EasyCourse.Core.Interfaces.Service;
using EasyCourse.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EasyCourse.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ImageController(IImageService imageService) : ApiControllerBase
{
    [Authorize]
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<ImageDto>), StatusCodes.Status200OK)]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadImage([FromForm] ImageRequest file)
    {
        var userId = GetUserId();
        var image = await imageService.UploadImageAsync(file.File, new Guid(userId));
        return HandleResult(image);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ApiResponse<ImageDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetImage(Guid id)
    {
        var image = await imageService.GetMetadataAsync(id);
        return HandleResult(image);
    }

    [Authorize]
    [HttpDelete("{id}")]
    [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteImage(Guid id)
    {
        var userId = GetUserId();
        await imageService.DeleteAsync(id, new Guid(userId));
        return HandleBoolResult(true, "Image deleted successfully");
    }
}