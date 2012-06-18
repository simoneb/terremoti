using System;
using System.Collections.Generic;

namespace Terremoti
{
    internal class EventByIdComparer : IEqualityComparer<Event>
    {
        public bool Equals(Event x, Event y)
        {
            return string.Equals(x.EventId, y.EventId, StringComparison.OrdinalIgnoreCase);
        }

        public int GetHashCode(Event obj)
        {
            return obj.EventId.GetHashCode();
        }
    }
}