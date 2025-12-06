using EasyCourse.Core.DTO;
using EasyCourse.Core.DTO.Rating;
using EasyCourse.Core.Interfaces.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EasyCourse.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class RatingController(IRatingService ratingService) : ApiControllerBase
{
    [Authorize]
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<RatingDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> RateEntity([FromBody] RatingDto rateEntityDto)
    {
        var userId = GetUserId();
        var result = await ratingService.CreateRating(rateEntityDto, new Guid(userId));
        return HandleResult(result);
    }

    [HttpGet("course/{courseId}")]
    [ProducesResponseType(typeof(ApiResponse<RatingDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCourseRating([FromRoute] Guid courseId)
    {
        var result = await ratingService.GetRatingsByEntity("course", courseId.ToString());
        return HandleResult(result);
    }

    [Authorize]
    [HttpPut]
    [ProducesResponseType(typeof(ApiResponse<RatingDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateRating([FromBody] RatingDto ratingDto)
    {
        var userId = GetUserId();
        var result = await ratingService.UpdateRating(ratingDto, new Guid(userId));
        return HandleResult(result);
    }
}