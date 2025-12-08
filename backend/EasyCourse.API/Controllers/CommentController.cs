using EasyCourse.Core.DTO;
using EasyCourse.Core.DTO.Auth;
using EasyCourse.Core.DTO.Comment;
using EasyCourse.Core.Interfaces.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EasyCourse.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommentController(ICommentService commentService) : ApiControllerBase
{
    [HttpGet("type/{entityType}/{entityId}")]
    [ProducesResponseType(typeof(ApiResponse<CommentResponse[]>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCommentsForEntity(string entityId, string entityType)
    {
        var result = await commentService.GetCommentsForEntity(entityType, entityId);
        return HandleResult(result);
    }

    [HttpGet("{commentId}")]
    [ProducesResponseType(typeof(ApiResponse<CommentResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetComment(int commentId)
    {
        var result = await commentService.GetCommentById(commentId);
        return HandleResult(result);
    }

    [HttpPost]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<CommentResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> CreateComment([FromBody] CommentRequest request)
    {
        var userId = GetUserId();
        var result = await commentService.CreateComment(request, new Guid(userId));
        return HandleResult(result);
    }

    [HttpPut("{commentId}")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<CommentResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateComment([FromBody] CommentRequest request, int commentId)
    {
        var userId = GetUserId();
        var result = await commentService.UpdateComment(commentId, request, new Guid(userId));
        return HandleResult(result);
    }

    [HttpDelete("{commentId}")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteComment(int commentId)
    {
        var userId = GetUserId();
        var result = await commentService.DeleteComment(commentId, new Guid(userId));
        return HandleBoolResult(result);
    }
}
