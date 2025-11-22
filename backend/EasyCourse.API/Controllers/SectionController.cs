using EasyCourse.Core.DTO;
using EasyCourse.Core.Entities;
using EasyCourse.Core.Interfaces.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EasyCourse.API.Controllers;

[Route("api/course/{courseId}/[controller]")]
[ApiController]
public class SectionController(ISectionService sectionService) : ApiControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<SectionDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSectionsByCourseId(Guid courseId)
    {
        var sections = await sectionService.GetSectionsByCourseId(courseId);

        return HandleResult(sections);
    }

    [Authorize]
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<SectionDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> CreateSection([FromBody] SectionDto section)
    {
        var userId = GetUserId();
        var createdSection = await sectionService.CreateSection(section, new Guid(userId));

        return HandleResult(createdSection);
    }

    [Authorize]
    [HttpPut]
    [ProducesResponseType(typeof(ApiResponse<SectionDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateSection([FromBody] SectionDto section)
    {
        var userId = GetUserId();
        var updatedSection = await sectionService.UpdateSection(section, new Guid(userId));

        return HandleResult(updatedSection);
    }

    [Authorize]
    [HttpDelete("{id}")]
    [ProducesResponseType(typeof(ApiResponse<SectionDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteSection(Guid id)
    {
        var userId = GetUserId();
        var result = await sectionService.DeleteSectionById(id, new Guid(userId));

        return result ? HandleBoolResult(result, "Course updated successfully") : HandleBoolResult(result, "Failed to update course");
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ApiResponse<SectionDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSectionById(Guid id)
    {
        var userId = GetUserId();
        var result = await sectionService.GetSectionById(id);

        return HandleResult(result);
    }
}