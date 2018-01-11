namespace SC.Dal.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<SC.Dal.SCContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
            AutomaticMigrationDataLossAllowed = true;
        }

        protected override void Seed(SC.Dal.SCContext context)
        {
            //  This method will be called after migrating to the latest version.

            //context.SCUsers.AddOrUpdate(b => b.UserId, new SCUser { UserId = xxxx });
        }
    }
}
