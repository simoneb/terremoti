using System.Runtime.Serialization;

namespace Terremoti
{
    [DataContract]
    public class Event
    {
        [DataMember(Name = "eventId", Order = 0)]
        public string EventId { get; set; }

        [DataMember(Name = "dateUtc", Order = 1)]
        public double DateUtc { get; set; }

        [DataMember(Name = "latitude", Order = 2)]
        public float Latitude { get; set; }

        [DataMember(Name = "longitude", Order = 3)]
        public float Longitude { get; set; }

        [DataMember(Name = "depthKm", Order = 4)]
        public float DepthKm { get; set; }

        [DataMember(Name = "magnitude", Order = 5)]
        public float Magnitude { get; set; }

        [DataMember(Name = "magnitudeScale", Order = 6)]
        public string MagnitudeScale { get; set; }

        [DataMember(Name = "district", Order = 7)]
        public string District { get; set; }

        [DataMember(Name = "url", Order = 8)]
        public string Url { get; set; }
    }
}