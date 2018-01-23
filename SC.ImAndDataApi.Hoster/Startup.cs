using System;
using System.Threading.Tasks;
using Microsoft.Owin;
using Owin;
using System.Web.Http;
using Microsoft.Owin.Cors;
using Autofac;
using System.Reflection;
using Autofac.Integration.WebApi;
using SC.IService;
using SC.Dal.Service;
using Microsoft.AspNet.SignalR;
using Newtonsoft.Json;

[assembly: OwinStartup(typeof(SC.ImAndDataApi.Hoster.Startup))]

namespace SC.ImAndDataApi.Hoster
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=316888

            HttpConfiguration config = new HttpConfiguration();

            config.Routes.MapHttpRoute(
                name: "SC.Api",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
            config.Formatters.JsonFormatter.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;

            app.UseCors(CorsOptions.AllowAll);
            app.UseSignalr();
            app.UseWebApi(config);

            //register autofac
            AutofacRgister(config);
        }



        public void AutofacRgister(HttpConfiguration config)
        {
            var builder = new ContainerBuilder();
            SetupResolveRules(builder);

            // Register your Web API controllers.
            builder.RegisterApiControllers(Assembly.GetExecutingAssembly());

            // OPTIONAL: Register the Autofac filter provider.
            builder.RegisterWebApiFilterProvider(config);

            // Set the dependency resolver to be Autofac.
            var container = builder.Build();
            config.DependencyResolver = new AutofacWebApiDependencyResolver(container);
        }

        private static void SetupResolveRules(ContainerBuilder builder)
        {
            builder.RegisterType<RedPacketService>().As<IRedPacketService>().InstancePerRequest();
            builder.RegisterType<WithdrawService>().As<IWithdrawService>().InstancePerRequest();
            builder.RegisterType<AttachmentService>().As<IAttachmentService>().InstancePerRequest();
            builder.RegisterType<SCUserService>().As<ISCUserService>().InstancePerRequest();
            builder.RegisterType<UserContactService>().As<IUserContactService>().InstancePerRequest();
            builder.RegisterType<MessageRecordService>().As<IMessageRecordService>().InstancePerRequest();
        }

    }
}
