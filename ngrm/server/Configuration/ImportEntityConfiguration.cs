using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NGRM.Domain.Entities;

namespace NGRM.Infrastructure.Configuration
{
    public class ImportEntityConfiguration
    {
        public static void Build(EntityTypeBuilder<ImportEntity> builder)
        {
            // Table & Primary Key
            builder.ToTable("Import");
            builder.HasKey(t => t.Id);

            // Properties & Column Mappings
            builder.Property(t => t.Id)
                .HasColumnName("Id");

            builder.Property(t => t.EngagementId)
                .IsRequired()
                .HasColumnName("EngagementId");

            builder.Property(t => t.PhaseId)
                .HasColumnName("PhaseId");

            builder.Property(t => t.ImportedBy)
                .HasColumnName("ImportedBy")
                .HasMaxLength(100);

            builder.Property(t => t.ImportedDate)
                .HasColumnName("ImportedDate");

            builder.Property(t => t.AssessmentDate)
                .HasColumnName("AssessmentDate");

            // Relationships
            builder.HasOne(t => t.Phase)
                .WithMany(t => t.Imports)
                .HasForeignKey(t => t.PhaseId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}