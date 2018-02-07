namespace SC.Dal.Migrations
{
    using SC.Model.Entity;
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
            //  init admin
            //context.SCUsers.AddOrUpdate(new SCUser
            //{
            //    UserId = 0,
            //    OpenId = "admin",
            //    AliPay = "admin",
            //    CreateTime = DateTime.Now,
            //    Name = "admin",
            //    Sex = Sex.Male,
            //    AvatarUrl = ""
            //});
            //context.SaveChanges();
        }
    }
}
