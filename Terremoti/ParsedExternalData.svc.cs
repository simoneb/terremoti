using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Web;

namespace Terremoti
{
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
    [ServiceBehavior(InstanceContextMode = InstanceContextMode.Single)]
    public class ParsedExternalData : IParsedExternalData
    {
        private readonly EventProvider _provider;

        public ParsedExternalData()
        {
            _provider = new EventProvider(HttpContext.Current.Server.MapPath("~/app_data/events.xml"));
        }

        public Event[] GetEvents(string lastReceivedTimestamp)
        {
            return
//#if DEBUG
//                lastReceivedTimestamp != "0" ? new[]{ RandomEvent.New() } :
//#endif
                _provider.GetEventsFrom(lastReceivedTimestamp);
        }
    }
}
