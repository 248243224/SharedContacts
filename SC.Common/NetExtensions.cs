using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SC.Common
{
    public static class NetExtensions
    {
        public static double NextDouble(
        this Random random,
        double minValue,
        double maxValue)
        {
            return random.NextDouble() * (maxValue - minValue) + minValue;
        }
    }
}
