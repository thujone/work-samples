using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NGRM.Domain.Entities;

namespace NGRM.Infrastructure.Configuration
{
    public class HostEntityConfiguration
    {
        public static void Build(EntityTypeBuilder<HostEntity> builder)
        {
            // Table & Primary Key
            builder.ToTable("Host");
            builder.HasKey(t => t.Id);

            // Properties & Column Mapping
            builder.Property(t => t.Id)
                .HasColumnName("Id");

            builder.Property(t => t.NameBytes)
                .HasColumnName("NameBytes");

            builder.Property(t => t.IPAddressBytes)
                .HasColumnName("IPAddressBytes");

            builder.Property(t => t.OperatingSystemBytes)
                .HasColumnName("OperatingSystemBytes");

            builder.Property(t => t.EngagementId)
                .HasColumnName("EngagementId")
                .IsRequired();

            builder.Property(t => t.PhaseId)
                .HasColumnName("PhaseId");

            builder.Property(t => t.OSConfidence)
                .HasColumnName("OSConfidence");

            builder.Property(t => t.AssetGroupId)
                .HasColumnName("AssetGroupId");

            builder.Property(t => t.IsCritical)
                .HasColumnName("IsCritical");

            builder.Property(t => t.ImportedBy)
                .HasColumnName("ImportedBy")
                .HasMaxLength(100);

            builder.Property(t => t.ImportedDate)
                .HasColumnName("ImportedDate");

            builder.Property(t => t.Status)
                .HasColumnName("Status")
                .IsRequired()
                .HasMaxLength(10);

            // Relationships
            builder.HasOne(t => t.Phase)
                .WithMany(t => t.Hosts)
                .HasForeignKey(t => t.PhaseId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}