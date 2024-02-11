using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddAdditionalDatasetFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AppUserId",
                table: "Datasets",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsPublic",
                table: "Datasets",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_Datasets_AppUserId",
                table: "Datasets",
                column: "AppUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Datasets_AspNetUsers_AppUserId",
                table: "Datasets",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Datasets_AspNetUsers_AppUserId",
                table: "Datasets");

            migrationBuilder.DropIndex(
                name: "IX_Datasets_AppUserId",
                table: "Datasets");

            migrationBuilder.DropColumn(
                name: "AppUserId",
                table: "Datasets");

            migrationBuilder.DropColumn(
                name: "IsPublic",
                table: "Datasets");
        }
    }
}
