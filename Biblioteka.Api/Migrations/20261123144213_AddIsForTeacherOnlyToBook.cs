using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Biblioteka.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddIsForTeacherOnlyToBook : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsForTeacherOnly",
                table: "Books",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsForTeacherOnly",
                table: "Books");
        }
    }
}
