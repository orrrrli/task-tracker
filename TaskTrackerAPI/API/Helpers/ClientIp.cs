using System.Net;
using System.Net.Sockets;

namespace API.Helpers;

public static class ClientIp
{
    // One IPv6 host controls a whole /64, so keying on the full address would hand it
    // unlimited rate-limit buckets. IPv4-mapped addresses count as the IPv4 address.
    public static string RateLimitKey(IPAddress? ip)
    {
        if (ip is null) return "unknown";
        if (ip.IsIPv4MappedToIPv6) return ip.MapToIPv4().ToString();
        if (ip.AddressFamily != AddressFamily.InterNetworkV6) return ip.ToString();

        byte[] bytes = ip.GetAddressBytes();
        Array.Clear(bytes, 8, 8);
        return $"{new IPAddress(bytes)}/64";
    }
}
