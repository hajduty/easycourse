using EasyCourse.Core.DTO;
using EasyCourse.Core.Entities;

namespace EasyCourse.Core.Mappings;

public static class CourseMappings
{
    public static CourseDto CourseToDto(Course course)
    {
        return new CourseDto
        {
            CourseId = course.CourseId,
            CourseName = course.CourseName,
            CourseDescription = course.CourseDescription,
            CreatedByUserId = course.CreatedByUserId,
            Sections = course.Sections
        };
    }
}
