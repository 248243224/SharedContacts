using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SC.Model.Entity;

namespace SC.Dal
{
    public class SCContext : DbContext
    {
        private SCContext()
            : base("SCContext")
        {
            this.Configuration.ProxyCreationEnabled = false;
            this.Configuration.LazyLoadingEnabled = false;
        }

        static SCContext()
        {
            Database.SetInitializer(new MigrateDatabaseToLatestVersion<SCContext, Migrations.Configuration>(true));
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<SCUser>().ToTable("SCUser");
            modelBuilder.Entity<RedPacket>().ToTable("RedPacket");
        }

        public DbSet<SCUser> SCUsers { get; set; }
        public DbSet<RedPacket> RedPackets { get; set; }

        public static SCContext NewInstance
        {
            get { return new SCContext(); }
        }
    }
}
