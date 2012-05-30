using System.ServiceModel;
using System.ServiceModel.Web;

namespace Terremoti
{
    [ServiceContract]
    public interface IParsedExternalData
    {
        [OperationContract]
        [WebGet(UriTemplate = "events/{lastReceivedTimestamp}", ResponseFormat = WebMessageFormat.Json)]
        Event[] GetEvents(string lastReceivedTimestamp);
    }
}
