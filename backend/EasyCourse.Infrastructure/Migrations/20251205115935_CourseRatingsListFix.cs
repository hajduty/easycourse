using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EasyCourse.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class CourseRatingsListFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AverageRating",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "TotalRatings",
                table: "Courses");

            migrationBuilder.AddColumn<Guid>(
                name: "CourseId",
                table: "Ratings",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.CreateIndex(
                name: "IX_Ratings_CourseId",
                table: "Ratings",
                column: "CourseId");

            migrationBuilder.AddForeignKey(
                name: "FK_Ratings_Courses_CourseId",
                table: "Ratings",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "CourseId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Ratings_Courses_CourseId",
                table: "Ratings");

            migrationBuilder.DropIndex(
                name: "IX_Ratings_CourseId",
                table: "Ratings");

            migrationBuilder.DropColumn(
                name: "CourseId",
                table: "Ratings");

            migrationBuilder.AddColumn<double>(
                name: "AverageRating",
                table: "Courses",
                type: "double",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<int>(
                name: "TotalRatings",
                table: "Courses",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
