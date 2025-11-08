using EasyCourse.Core.DTO;
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
    public async Task<IActionResult> GetSections()
    {
        return Ok("GetSections endpoint is not yet implemented.");
    }

    [Authorize]
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<SectionDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> CreateSection([FromBody] SectionDto section)
    {
        var userId = GetUserId();

        var createdSection = await sectionService.CreateSection(section, new Guid(userId));

        return Ok(createdSection);
    }

    [Authorize]
    [HttpPut]
    [ProducesResponseType(typeof(ApiResponse<SectionDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateSection([FromBody] SectionDto section)
    {
        var userId = GetUserId();

        var updatedSection = await sectionService.UpdateSection(section, new Guid(userId));

        return Ok(updatedSection);
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
}