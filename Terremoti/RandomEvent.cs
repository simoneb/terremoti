using System;

namespace Terremoti
{
    public static class RandomEvent
    {
        static readonly Random Rng = new Random();

        public static Event New()
        {
            return new Event
                {
                    EventId = DateTime.Now.Ticks.ToString(),
                    DateUtc = (DateTime.UtcNow - EventProvider.Epoch).TotalMilliseconds,
                    DepthKm = Rng.Next(40) + 2,
                    District = "whatever",
                    Latitude = (float) (44 + Rng.NextDouble()),
                    Longitude = (float) (9.4 + Rng.NextDouble()*3),
                    Magnitude = (float) (Rng.NextDouble()*3 + 2.5),
                    MagnitudeScale = "Ml",
                    Url = "whatever"
                };
        }
    }
}