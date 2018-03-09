using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SC.IService;
using SC.Model.Entity;
using System.Web.Http;
using SC.Model;
using System.Diagnostics;
using SC.Model.ViewModel;
using Aop.Api;
using SC.Common;
using Aop.Api.Request;
using Aop.Api.Domain;
using Aop.Api.Response;

namespace SC.ImAndDataApi.Hoster.Controller
{
    public class AlipayController : ApiController
    {

        [HttpPost]
        public IHttpActionResult GetRequestPost(object requestItems)
        {
            try
            {
                return Ok();
            }
            catch (Exception ex)
            {
                Trace.TraceError($"AlipayController::GetRequestPost: {ex.Message}");
                return InternalServerError();
            }
        }
        [HttpGet]
        public IHttpActionResult GeneratePayInfo(string subject, string totalAmount)
        {
            IAopClient client = new DefaultAopClient(SCEnvironment.AlipayServerUrl, SCEnvironment.AlipayAppId, SCEnvironment.AlipayPrivateKey, "json", "1.0", "RSA2", SCEnvironment.AlipayPublicKey, SCEnvironment.AlipayCharset, false);
            //实例化具体API对应的request类,类名称和接口名称对应,当前调用接口名称如：alipay.trade.app.pay
            AlipayTradeAppPayRequest request = new AlipayTradeAppPayRequest();
            //SDK已经封装掉了公共参数，这里只需要传入业务参数。以下方法为sdk的model入参方式(model和biz_content同时存在的情况下取biz_content)。
            AlipayTradeAppPayModel model = new AlipayTradeAppPayModel();
            model.Body = "共享人脉支付";
            model.Subject = subject;
            model.TotalAmount = totalAmount;
            model.ProductCode = "QUICK_MSECURITY_PAY";
            model.OutTradeNo = Guid.NewGuid().ToString("N");
            model.TimeoutExpress = "30m";
            request.SetBizModel(model);
            request.SetNotifyUrl("http://sc.handsave.com/alipay/");
            //这里和普通的接口调用不同，使用的是sdkExecute
            AlipayTradeAppPayResponse response = client.SdkExecute(request);
            //HttpUtility.HtmlEncode是为了输出到页面时防止被浏览器将关键参数html转义，实际打印到日志以及http传输不会有这个问题
            return Ok(HttpUtility.HtmlEncode(response.Body));
        }
    }
}
