using EasyCourse.Core.DTO;
using EasyCourse.Core.DTO.Course;
using EasyCourse.Core.DTO.Participant;
using EasyCourse.Core.DTO.User;
using EasyCourse.Core.Entities;
using EasyCourse.Core.Interfaces.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EasyCourse.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UserController(ICourseService courseService, IParticipantService participantService, IUserService userService) : ApiControllerBase
{
    [HttpGet("{userId}/participations")]
    [ProducesResponseType(typeof(ApiResponse<CourseParticipantResponse[]>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetUserParticipations(Guid userId)
    {
        var result = await participantService.GetUserParticipations(userId);

        return HandleResult(result);
    }

    [HttpGet("{userId}/courses")]
    [ProducesResponseType(typeof(ApiResponse<List<CourseResponse[]>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCoursesByUser(Guid userId)
    {
        var requestId = GetUserId();
        var courses = await courseService.GetCoursesByUserId(userId, new Guid(requestId));

        return HandleResult(courses);
    }

    [HttpDelete]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteUser()
    {
        var userId = GetUserId();
        var result = await userService.DeleteUserById(new Guid(userId));

        return HandleBoolResult(result);
    }

    [HttpGet("{userId}")]
    [ProducesResponseType(typeof(ApiResponse<UserResult>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetUserById(Guid userId)
    {
        var requestId = GetUserId();
        var user = await userService.GetUserById(userId, new Guid(requestId));
        return HandleResult(user);
    }

    [HttpPut("{userId}")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<UserResult>), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateUser(Guid userId, [FromBody] UserUpdateRequest updateUserRequest)
    {
        var requestId = GetUserId();
        var updatedUser = await userService.UpdateUser(userId, updateUserRequest, new Guid(requestId));
        return HandleResult(updatedUser);
    }
}