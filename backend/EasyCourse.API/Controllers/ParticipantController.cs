using EasyCourse.Core.DTO;
using EasyCourse.Core.DTO.Participant;
using EasyCourse.Core.Interfaces.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EasyCourse.API.Controllers;

[Route("api/course/{courseId}/participant/")]
[ApiController]
public class ParticipantController(IParticipantService service) : ApiControllerBase
{
    [HttpPost]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<CourseParticipantResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> RegisterParticipant([FromBody]CourseParticipantRequest participant)
    {
        var userId = GetUserId();
        var result = await service.RegisterParticipant(participant, new Guid(userId));

        return HandleResult(result);
    }

    [HttpGet("{userId}")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<CourseParticipantResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetParticipantInfo(Guid courseId)
    {
        var uid = GetUserId();
        var result = await service.GetParticipantInfo(new Guid(uid), courseId);

        return HandleResult(result);
    }

    [HttpPut("{userId}")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<CourseParticipantResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateParticipantInfo([FromBody] CourseParticipantRequest participant)
    {
        var userId = GetUserId();
        var result = await service.UpdateParticipantInfo(participant, new Guid(userId));

        return HandleResult(result);
    }

    [HttpDelete("{userId}")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteParticipantInfo(Guid courseId, Guid userId)
    {
        var requestUserId = GetUserId();
        var result = await service.UnregisterParticipant(userId, courseId, new Guid(requestUserId));

        return HandleBoolResult(result);
    }
}