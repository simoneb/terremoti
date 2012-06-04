using System;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using System.Threading;
using HtmlAgilityPack;
using ScrapySharp.Extensions;

namespace Terremoti
{
    public static class EventProvider
    {
        public static readonly DateTimeOffset Epoch = new DateTimeOffset(1970, 1, 1, 0, 0, 0, 0, TimeSpan.Zero);
        private static readonly TimeSpan Never = TimeSpan.FromMilliseconds(-1);
        private static readonly TimeSpan RefreshInterval = TimeSpan.FromSeconds(30);
        private static readonly Timer Timer;
        private static readonly object SyncLock = new object();
        private static readonly Regex UrlRegex = new Regex(@"window.open\('\.(.*)'\)", RegexOptions.Compiled | RegexOptions.IgnoreCase);
        private static readonly Regex DateRegex = new Regex(@"\d{4}/\d{2}/\d{2}", RegexOptions.Compiled | RegexOptions.IgnoreCase);
        private static readonly Regex TimeRegex = new Regex(@"\d{2}:\d{2}:\d{2}", RegexOptions.Compiled | RegexOptions.IgnoreCase);
        private static readonly Regex MagnitudeRegex = new Regex(@"\d+(?:\.\d+)?", RegexOptions.Compiled | RegexOptions.IgnoreCase);
        private static readonly Regex MagnitudeScaleRegex = new Regex(@"^\w+", RegexOptions.Compiled | RegexOptions.IgnoreCase);
        private static Event[] Events { get; set; }

        static EventProvider()
        {
            Events = Enumerable.Empty<Event>().ToArray();
            Timer = new Timer(ReloadEvents, null, Never, Never);

            ReloadEvents(null);
        }

        public static Event[] GetEventsFrom(string lastReceivedTimetstamp)
        {
            var doubleTimestamp = double.Parse(lastReceivedTimetstamp, CultureInfo.InvariantCulture);

            lock (SyncLock)
                return Events.SkipWhile(e => e.DateUtc <= doubleTimestamp).ToArray();
        }

        private static void ReloadEvents(object state)
        {
            try
            {
                var request = WebRequest.Create("http://cnt.rm.ingv.it/index.html");
                request.Timeout = 10000;

                using (var rs = request.GetResponse().GetResponseStream())
                {
                    var doc = new HtmlDocument();
                    doc.Load(rs);

                    var events = from row in doc.DocumentNode.CssSelect("table.table_events tr")
                                 let onclick = row.Attributes["onclick"]
                                 where onclick != null
                                 let url = UrlRegex.Match(onclick.Value) where url.Success
                                 let columns = from column in row.CssSelect("td") select column.InnerText
                                 let date = DateRegex.Match(columns.ElementAt(2)) where date.Success
                                 let time = TimeRegex.Match(columns.ElementAt(3)) where time.Success
                                 let magnitude = MagnitudeRegex.Match(columns.ElementAt(7))
                                 where magnitude.Success
                                 let magnitudeScale = MagnitudeScaleRegex.Match(columns.ElementAt(7))
                                 where magnitudeScale.Success
                                 let @event = new Event
                                    {
                                        EventId = columns.ElementAt(0),
                                        DateUtc = (DateTimeOffset.ParseExact(date.Value + " " + time.Value,
                                                                            "yyyy/MM/dd HH:mm:ss",
                                                                            CultureInfo.InvariantCulture,
                                                                            DateTimeStyles.AssumeUniversal) - Epoch).TotalMilliseconds,
                                        Latitude = float.Parse(columns.ElementAt(4), CultureInfo.InvariantCulture),
                                        Longitude = float.Parse(columns.ElementAt(5), CultureInfo.InvariantCulture),
                                        DepthKm = float.Parse(columns.ElementAt(6), CultureInfo.InvariantCulture),
                                        Magnitude = float.Parse(magnitude.Value, CultureInfo.InvariantCulture),
                                        MagnitudeScale = magnitudeScale.Value,
                                        District = columns.ElementAt(9).Replace("_", " "),
                                        Url = "http://cnt.rm.ingv.it" + url.Groups[1].Value
                                    }
                                 where
                                     @event.Magnitude > 2.5 &&
                                     @event.Latitude > 44 && @event.Latitude < 45 && 
                                     @event.Longitude > 9.4 && @event.Longitude < 12.2
                                 where
                                     @event.DateUtc > (new DateTimeOffset(2012, 5, 20, 0, 0, 0, TimeSpan.FromHours(2)) - Epoch).TotalMilliseconds
                                 select @event;

                    lock(SyncLock)
                        Events = events.Reverse().ToArray();

                    Timer.Change(RefreshInterval, Never);
                }
            }
            catch (Exception)
            {
                Timer.Change(TimeSpan.FromSeconds(5), Never);
            }
        }
    }
}