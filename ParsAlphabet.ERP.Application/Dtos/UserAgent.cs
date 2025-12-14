using System.Text.RegularExpressions;

namespace ParsAlphabet.ERP.Application.Dtos;

public class MatchExpression
{
    public List<Regex> Regexes { get; set; }

    public Action<Match, object> Action { get; set; }
}

public class ClientBrowser
{
    private static readonly Dictionary<string, string> _versionMap = new()
    {
        { "/8", "1.0" },
        { "/1", "1.2" },
        { "/3", "1.3" },
        { "/412", "2.0" },
        { "/416", "2.0.2" },
        { "/417", "2.0.3" },
        { "/419", "2.0.4" },
        { "?", "/" }
    };

    private static readonly List<MatchExpression> _matchs = new()
    {
        new MatchExpression
        {
            Regexes = new List<Regex>
            {
                new(@"(opera\smini)\/([\w\.-]+)", RegexOptions.IgnoreCase), // Opera Mini
                new(@"(opera\s[mobiletab]+).+version\/([\w\.-]+)", RegexOptions.IgnoreCase), // Opera Mobi/Tablet
                new(@"(opera).+version\/([\w\.]+)", RegexOptions.IgnoreCase), // Opera > 9.80
                new(@"(opera)[\/\s]+([\w\.]+)", RegexOptions.IgnoreCase) // Opera < 9.80
            },
            Action = NameVersionAction
        },
        new MatchExpression
        {
            Regexes = new List<Regex>
            {
                new(@"(opios)[\/\s]+([\w\.]+)", RegexOptions.IgnoreCase) // Opera mini on iphone >= 8.0
            },
            Action = (match, obj) =>
            {
                var current = obj as ClientBrowser;

                var nameAndVersion = match.Value.Split('/');

                current.Name = "Opera Mini";
                current.Version = nameAndVersion[1];
            }
        },
        new MatchExpression
        {
            Regexes = new List<Regex>
            {
                new(@"\s(opr)\/([\w\.]+)", RegexOptions.IgnoreCase) // Opera Webkit
            },
            Action = (match, obj) =>
            {
                var current = obj as ClientBrowser;

                var nameAndVersion = match.Value.Split('/');

                current.Name = "Opera";
                current.Version = nameAndVersion[1];
            }
        },
        new MatchExpression
        {
            Regexes = new List<Regex>
            {
                new(@"(kindle)\/([\w\.]+)", RegexOptions.IgnoreCase), // Kindle
                new(@"(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]+)*",
                    RegexOptions.IgnoreCase), // Lunascape/Maxthon/Netfront/Jasmine/Blazer

                new(@"(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?([\w\.]*)",
                    RegexOptions.IgnoreCase), // Avant/IEMobile/SlimBrowser/Baidu
                new(@"(?:ms|\()(ie)\s([\w\.]+)", RegexOptions.IgnoreCase), // Internet Explorer

                new(@"(rekonq)\/([\w\.]+)*", RegexOptions.IgnoreCase), // Rekonq
                new(
                    @"(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs)\/([\w\.-]+)",
                    RegexOptions
                        .IgnoreCase) // Chromium/Flock/RockMelt/Midori/Epiphany/Silk/Skyfire/Bolt/Iron/Iridium/PhantomJS
            },
            Action = NameVersionAction
        },
        new MatchExpression
        {
            Regexes = new List<Regex>
            {
                new(@"(trident).+rv[:\s]([\w\.]+).+like\sgecko", RegexOptions.IgnoreCase) // IE11
            },
            Action = (match, obj) =>
            {
                var current = obj as ClientBrowser;

                current.Name = "IE";
                current.Version = "11";
            }
        },
        new MatchExpression
        {
            Regexes = new List<Regex>
            {
                new(@"(edge)\/((\d+)?[\w\.]+)", RegexOptions.IgnoreCase) // Microsoft Edge
            },
            Action = NameVersionAction
        },
        new MatchExpression
        {
            Regexes = new List<Regex>
            {
                new(@"(yabrowser)\/([\w\.]+)", RegexOptions.IgnoreCase) // Yandex
            },
            Action = (match, obj) =>
            {
                var current = obj as ClientBrowser;

                var nameAndVersion = match.Value.Split('/');

                current.Name = "Yandex";
                current.Version = nameAndVersion[1];
            }
        },
        new MatchExpression
        {
            Regexes = new List<Regex>
            {
                new(@"(comodo_dragon)\/([\w\.]+)", RegexOptions.IgnoreCase) // Comodo Dragon
            },
            Action = (match, obj) =>
            {
                var current = obj as ClientBrowser;

                var nameAndVersion = match.Value.Split('/');

                current.Name = nameAndVersion[0].Replace('_', ' ');
                current.Version = nameAndVersion[1];
            }
        },
        new MatchExpression
        {
            Regexes = new List<Regex>
            {
                new(@"(micromessenger)\/([\w\.]+)", RegexOptions.IgnoreCase) // WeChat
            },
            Action = (match, obj) =>
            {
                var current = obj as ClientBrowser;

                var nameAndVersion = match.Value.Split('/');

                current.Name = "WeChat";
                current.Version = nameAndVersion[1];
            }
        },
        new MatchExpression
        {
            Regexes = new List<Regex>
            {
                new(@"xiaomi\/miuibrowser\/([\w\.]+)", RegexOptions.IgnoreCase) // MIUI Browser
            },
            Action = (match, obj) =>
            {
                var current = obj as ClientBrowser;

                var nameAndVersion = match.Value.Split('/');

                current.Name = "MIUI Browser";
                current.Version = nameAndVersion[0];
            }
        },
        new MatchExpression
        {
            Regexes = new List<Regex>
            {
                new(@"\swv\).+(chrome)\/([\w\.]+)", RegexOptions.IgnoreCase) // Chrome WebView
            },
            Action = (match, obj) =>
            {
                var current = obj as ClientBrowser;

                var nameAndVersion = match.Value.Split('/');

                current.Name = new Regex("(.+)").Replace(nameAndVersion[0], "$1 WebView");
                current.Version = nameAndVersion[1];
            }
        },
        new MatchExpression
        {
            Regexes = new List<Regex>
            {
                new(@"android.+samsungbrowser\/([\w\.]+)", RegexOptions.IgnoreCase),
                new(@"android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)*",
                    RegexOptions.IgnoreCase) // Android Browser
            },
            Action = (match, obj) =>
            {
                var current = obj as ClientBrowser;

                var nameAndVersion = match.Value.Split('/');

                current.Name = "Android Browser";
                current.Version = nameAndVersion[0];
            }
        },
        new MatchExpression
        {
            Regexes = new List<Regex>
            {
                new(@"(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)",
                    RegexOptions.IgnoreCase), // Chrome/OmniWeb/Arora/Tizen/Nokia
                new(@"(qqbrowser)[\/\s]?([\w\.]+)", RegexOptions.IgnoreCase) // QQBrowser
            },
            Action = NameVersionAction
        },
        new MatchExpression
        {
            Regexes = new List<Regex>
            {
                new(@"(uc\s?browser)[\/\s]?([\w\.]+)", RegexOptions.IgnoreCase),
                new(@"ucweb.+(ucbrowser)[\/\s]?([\w\.]+)", RegexOptions.IgnoreCase),
                new(@"juc.+(ucweb)[\/\s]?([\w\.]+)", RegexOptions.IgnoreCase) // UCBrowser
            },
            Action = (match, obj) =>
            {
                var current = obj as ClientBrowser;

                var nameAndVersion = match.Value.Split('/');

                current.Name = "Android Browser";
                current.Version = nameAndVersion[1];
            }
        },
        new MatchExpression
        {
            Regexes = new List<Regex>
            {
                new(@"(dolfin)\/([\w\.]+)", RegexOptions.IgnoreCase) // Dolphin
            },
            Action = (match, obj) =>
            {
                var current = obj as ClientBrowser;

                var nameAndVersion = match.Value.Split('/');

                current.Name = "Dolphin";
                current.Version = nameAndVersion[1];
            }
        },
        new MatchExpression
        {
            Regexes = new List<Regex>
            {
                new(@"((?:android.+)crmo|crios)\/([\w\.]+)", RegexOptions.IgnoreCase) // Chrome for Android/iOS
            },
            Action = (match, obj) =>
            {
                var current = obj as ClientBrowser;

                var nameAndVersion = match.Value.Split('/');

                current.Name = "Chrome";
                current.Version = nameAndVersion[1];
            }
        },
        new MatchExpression
        {
            Regexes = new List<Regex>
            {
                new(@";fbav\/([\w\.]+);", RegexOptions.IgnoreCase) // Facebook App for iOS
            },
            Action = (match, obj) =>
            {
                var current = obj as ClientBrowser;

                var nameAndVersion = match.Value.Split('/');

                current.Name = "Facebook";
                current.Version = nameAndVersion[0];
            }
        },
        new MatchExpression
        {
            Regexes = new List<Regex>
            {
                new(@"fxios\/([\w\.-]+)", RegexOptions.IgnoreCase) // Firefox for iOS
            },
            Action = (match, obj) =>
            {
                var current = obj as ClientBrowser;

                var nameAndVersion = match.Value.Split('/');

                current.Name = "Firefox";
                current.Version = nameAndVersion[0];
            }
        },
        new MatchExpression
        {
            Regexes = new List<Regex>
            {
                new(@"version\/([\w\.]+).+?mobile\/\w+\s(safari)", RegexOptions.IgnoreCase) // Mobile Safari
            },
            Action = (match, obj) =>
            {
                var current = obj as ClientBrowser;

                var nameAndVersion = match.Value.Split('/');

                current.Name = "Mobile Safari";
                current.Version = nameAndVersion[1];
            }
        },
        new MatchExpression
        {
            Regexes = new List<Regex>
            {
                new(@"version\/([\w\.]+).+?(mobile\s?safari|safari)", RegexOptions.IgnoreCase) // Safari & Safari Mobile
            },
            Action = (match, obj) =>
            {
                var current = obj as ClientBrowser;

                var nameAndVersion = match.Value.Split('/');

                current.Name = nameAndVersion[1];
                current.Version = nameAndVersion[0];
            }
        },
        new MatchExpression
        {
            Regexes = new List<Regex>
            {
                new(@"webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)", RegexOptions.IgnoreCase) // Safari < 3.0
            },
            Action = (match, obj) =>
            {
                var current = obj as ClientBrowser;

                var nameAndVersion = match.Value.Split('/');

                current.Name = nameAndVersion[0];

                var version = nameAndVersion[1];

                current.Version = _versionMap.Keys.Any(m => m == version) ? _versionMap[version] : version;
            }
        },
        new MatchExpression
        {
            Regexes = new List<Regex>
            {
                new(@"(konqueror)\/([\w\.]+)", RegexOptions.IgnoreCase), // Konqueror
                new(@"(webkit|khtml)\/([\w\.]+)", RegexOptions.IgnoreCase)
            },
            Action = NameVersionAction
        },
        new MatchExpression
        {
            Regexes = new List<Regex>
            {
                new(@"(navigator|netscape)\/([\w\.-]+)", RegexOptions.IgnoreCase) // Netscape
            },
            Action = (match, obj) =>
            {
                var current = obj as ClientBrowser;

                var nameAndVersion = match.Value.Split('/');

                current.Name = "Netscape";
                current.Version = nameAndVersion[1];
            }
        },
        new MatchExpression
        {
            Regexes = new List<Regex>
            {
                new(@"(swiftfox)", RegexOptions.IgnoreCase), // Swiftfox
                new(@"(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)",
                    RegexOptions.IgnoreCase), // IceDragon/Iceweasel/Camino/Chimera/Fennec/Maemo/Minimo/Conkeror
                new(@"(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix)\/([\w\.-]+)",
                    RegexOptions.IgnoreCase), // Firefox/SeaMonkey/K-Meleon/IceCat/IceApe/Firebird/Phoenix
                new(@"(mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+", RegexOptions.IgnoreCase), // Mozilla
                new(@"(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir)[\/\s]?([\w\.]+)",
                    RegexOptions.IgnoreCase), // Polaris/Lynx/Dillo/iCab/Doris/Amaya/w3m/NetSurf/Sleipnir
                new(@"(links)\s\(([\w\.]+)", RegexOptions.IgnoreCase), // Links
                new(@"(gobrowser)\/?([\w\.]+)*", RegexOptions.IgnoreCase), // GoBrowser
                new(@"(ice\s?browser)\/v?([\w\._]+)", RegexOptions.IgnoreCase), // ICE Browser
                new(@"(mosaic)[\/\s]([\w\.]+)", RegexOptions.IgnoreCase) // Mosaic
            },
            Action = NameVersionAction
        }
    };

    public ClientBrowser(string userAgent)
    {
        foreach (var matchItem in _matchs)
        foreach (var regexItem in matchItem.Regexes)
            if (regexItem.IsMatch(userAgent))
            {
                var match = regexItem.Match(userAgent);

                matchItem.Action(match, this);

                Major = new Regex(@"\d*").Match(Version).Value;

                return;
            }
    }

    public string Major { get; set; }

    public string Name { get; set; }

    public string Version { get; set; }

    public string NameAndVersion => Name + " - " + Version;

    private static void NameVersionAction(Match match, object obj)
    {
        var current = obj as ClientBrowser;

        current.Name = new Regex(@"^[a-zA-Z]+", RegexOptions.IgnoreCase).Match(match.Value).Value;
        if (match.Value.Length > current.Name.Length) current.Version = match.Value.Substring(current.Name.Length + 1);
    }
}

public class ClientOS
{
    private static readonly Dictionary<string, string> _versionMap = new()
    {
        { "4.90", "ME" },
        { "NT3.51", "NT 3.11" },
        { "NT4.0", "NT 4.0" },
        { "NT 5.0", "2000" },
        { "NT 5.1", "XP" },
        { "NT 5.2", "XP" },
        { "NT 6.0", "Vista" },
        { "NT 6.1", "7" },
        { "NT 6.2", "8" },
        { "NT 6.3", "8.1" },
        { "NT 6.4", "10" },
        { "NT 10.0", "10" },
        { "ARM", "RT" }
    };

    private static readonly List<MatchExpression> _matchs = new()
    {
        new MatchExpression
        {
            Regexes = new List<Regex>
            {
                new(@"microsoft\s(windows)\s(vista|xp)", RegexOptions.IgnoreCase) // Windows (iTunes)
            },
            Action = NameVersionAction
        },
        new MatchExpression
        {
            Regexes = new List<Regex>
            {
                new(@"(windows)\snt\s6\.2;\s(arm)", RegexOptions.IgnoreCase), // Windows RT
                new(@"(windows\sphone(?:\sos)*)[\s\/]?([\d\.\s]+\w)*", RegexOptions.IgnoreCase) // Windows Phone
            },
            Action = (match, obj) =>
            {
                var current = obj as ClientOS;

                current.Name = new Regex(@"(^[a-zA-Z]+\s[a-zA-Z]+)", RegexOptions.IgnoreCase).Match(match.Value).Value;

                if (current.Name.Length < match.Value.Length)
                {
                    var version = match.Value.Substring(current.Name.Length + 1);

                    current.Version = _versionMap.Keys.Any(m => m == version) ? _versionMap[version] : version;
                }
            }
        },
        new MatchExpression
        {
            Regexes = new List<Regex>
            {
                new(@"(windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)", RegexOptions.IgnoreCase)
            },
            Action = (match, obj) =>
            {
                var current = obj as ClientOS;

                current.Name = new Regex(@"(^[a-zA-Z]+)", RegexOptions.IgnoreCase).Match(match.Value).Value;

                if (current.Name.Length < match.Value.Length)
                {
                    var version = match.Value.Substring(current.Name.Length + 1);

                    current.Version = _versionMap.Keys.Any(m => m == version) ? _versionMap[version] : version;
                }
            }
        },
        new MatchExpression
        {
            Regexes = new List<Regex>
            {
                new(@"(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)", RegexOptions.IgnoreCase)
            },
            Action = (match, obj) =>
            {
                var current = obj as ClientOS;

                var nameAndVersion = new[]
                {
                    match.Value.Substring(0, match.Value.IndexOf(" ")),
                    match.Value.Substring(match.Value.IndexOf(" ") + 1)
                };

                current.Name = "Windows";

                var version = nameAndVersion[1];

                current.Version = _versionMap.Keys.Any(m => m == version) ? _versionMap[version] : version;
            }
        },
        new MatchExpression
        {
            Regexes = new List<Regex>
            {
                new(@"\((bb)(10);", RegexOptions.IgnoreCase) // BlackBerry 10
            },
            Action = (match, obj) =>
            {
                var current = obj as ClientOS;

                current.Name = "BlackBerry";

                current.Version = "BB10";
            }
        },
        new MatchExpression
        {
            Regexes = new List<Regex>
            {
                new(@"(blackberry)\w*\/?([\w\.]+)*", RegexOptions.IgnoreCase), // Blackberry
                new(@"(tizen)[\/\s]([\w\.]+)", RegexOptions.IgnoreCase), // Tizen
                new(@"(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|contiki)[\/\s-]?([\w\.]+)*",
                    RegexOptions.IgnoreCase), // Android/WebOS/Palm/QNX/Bada/RIM/MeeGo/Contiki
                new(@"linux;.+(sailfish);", RegexOptions.IgnoreCase) // Sailfish OS
            },
            Action = NameVersionAction
        },
        new MatchExpression
        {
            Regexes = new List<Regex>
            {
                new(@"(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]+)*", RegexOptions.IgnoreCase) // Symbian
            },
            Action = (match, obj) =>
            {
                var current = obj as ClientOS;

                var nameAndVersion = new[]
                {
                    match.Value.Substring(0, match.Value.IndexOf(" ")),
                    match.Value.Substring(match.Value.IndexOf(" ") + 1)
                };

                current.Name = "Symbian";

                current.Version = nameAndVersion[1];
            }
        },
        new MatchExpression
        {
            Regexes = new List<Regex>
            {
                new(@"\((series40);", RegexOptions.IgnoreCase) // Series 40
            },
            Action = (match, obj) =>
            {
                var current = obj as ClientOS;

                current.Name = match.Value;
            }
        },
        new MatchExpression
        {
            Regexes = new List<Regex>
            {
                new(@"mozilla.+\(mobile;.+gecko.+firefox", RegexOptions.IgnoreCase) // Firefox OS
            },
            Action = (match, obj) =>
            {
                var current = obj as ClientOS;

                var nameAndVersion = new[]
                {
                    match.Value.Substring(0, match.Value.IndexOf(" ")),
                    match.Value.Substring(match.Value.IndexOf(" ") + 1)
                };

                current.Name = "Firefox OS";

                current.Version = nameAndVersion[1];
            }
        },
        new MatchExpression
        {
            Regexes = new List<Regex>
            {
                // Console
                new(@"(nintendo|playstation)\s([wids34portablevu]+)", RegexOptions.IgnoreCase), // Nintendo/Playstation

                // GNU/Linux based
                new(@"(mint)[\/\s\(]?(\w+)*", RegexOptions.IgnoreCase), // Mint
                new(@"(mageia|vectorlinux)[;\s]", RegexOptions.IgnoreCase), // Mageia/VectorLinux
                new(
                    @"(joli|[kxln]?ubuntu|debian|[open]*suse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?(?!chrom)([\w\.-]+)*",
                    RegexOptions.IgnoreCase), // Joli/Ubuntu/Debian/SUSE/Gentoo/Arch/Slackware

                // Joli/Ubuntu/Debian/SUSE/Gentoo/Arch/Slackware
                // Fedora/Mandriva/CentOS/PCLinuxOS/RedHat/Zenwalk/Linpus
                new(@"(hurd|linux)\s?([\w\.]+)*", RegexOptions.IgnoreCase), // Hurd/Linux
                new(@"(gnu)\s?([\w\.]+)*", RegexOptions.IgnoreCase) // GNU
            },
            Action = NameVersionAction
        },
        new MatchExpression
        {
            Regexes = new List<Regex>
            {
                new(@"(cros)\s[\w]+\s([\w\.]+\w)", RegexOptions.IgnoreCase) // Chromium OS
            },
            Action = (match, obj) =>
            {
                var current = obj as ClientOS;

                var nameAndVersion = new[]
                {
                    match.Value.Substring(0, match.Value.IndexOf(" ")),
                    match.Value.Substring(match.Value.IndexOf(" ") + 1)
                };

                current.Name = "Chromium OS";

                current.Version = nameAndVersion[1];
            }
        },
        new MatchExpression
        {
            Regexes = new List<Regex>
            {
                new(@"(sunos)\s?([\w\.]+\d)*", RegexOptions.IgnoreCase) // Solaris
            },
            Action = (match, obj) =>
            {
                var current = obj as ClientOS;

                var nameAndVersion = new[]
                {
                    match.Value.Substring(0, match.Value.IndexOf(" ")),
                    match.Value.Substring(match.Value.IndexOf(" ") + 1)
                };

                current.Name = "Solaris";

                current.Version = nameAndVersion[1];
            }
        },
        new MatchExpression
        {
            Regexes = new List<Regex>
            {
                new(@"\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]+)*",
                    RegexOptions.IgnoreCase), // FreeBSD/NetBSD/OpenBSD/PC-BSD/DragonFly
                new(@"(haiku)\s(\w+)", RegexOptions.IgnoreCase)
            },
            Action = NameVersionAction
        },
        new MatchExpression
        {
            Regexes = new List<Regex>
            {
                new(@"(ip[honead]+)(?:.*os\s([\w]+)*\slike\smac|;\sopera)", RegexOptions.IgnoreCase) // iOS
            },
            Action = (match, obj) =>
            {
                var current = obj as ClientOS;

                var nameAndVersion = new[]
                {
                    match.Value.Substring(0, match.Value.IndexOf(" ")),
                    match.Value.Substring(match.Value.IndexOf(" ") + 1)
                };

                current.Name = "iOS";

                current.Version = new Regex(@"\d+(?:\.\d+)*").Match(nameAndVersion[1].Replace("_", ".")).Value;
            }
        },
        new MatchExpression
        {
            Regexes = new List<Regex>
            {
                new(@"(mac\sos\sx)\s?([\w\s\.]+\w)*", RegexOptions.IgnoreCase),
                new(@"(macintosh|mac(?=_powerpc)\s)", RegexOptions.IgnoreCase) // Mac OS
            },
            Action = (match, obj) =>
            {
                var current = obj as ClientOS;

                var nameAndVersion = new[]
                {
                    match.Value.Substring(0, match.Value.IndexOf(" ")),
                    match.Value.Substring(match.Value.IndexOf(" ") + 1)
                };

                current.Name = "Mac OS";

                current.Version = nameAndVersion[1].Replace('_', '.');
            }
        },
        new MatchExpression
        {
            Regexes = new List<Regex>
            {
                new(@"((?:open)?solaris)[\/\s-]?([\w\.]+)*", RegexOptions.IgnoreCase), // Solaris
                new(@"(aix)\s((\d)(?=\.|\)|\s)[\w\.]*)*", RegexOptions.IgnoreCase), // AIX
                new(@"(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms)",
                    RegexOptions.IgnoreCase), // Plan9/Minix/BeOS/OS2/AmigaOS/MorphOS/RISCOS/OpenVMS
                new(@"(unix)\s?([\w\.]+)*", RegexOptions.IgnoreCase) // UNIX
            },
            Action = NameVersionAction
        }
    };

    public ClientOS(string userAgent)
    {
        foreach (var matchItem in _matchs)
        foreach (var regexItem in matchItem.Regexes)
            if (regexItem.IsMatch(userAgent))
            {
                var match = regexItem.Match(userAgent);

                matchItem.Action(match, this);

                return;
            }
    }

    public string Name { get; set; }

    public string Version { get; set; }

    public string NameAndVersion => Name + " - " + Version;

    private static void NameVersionAction(Match match, object obj)
    {
        var current = obj as ClientOS;

        current.Name = new Regex(@"^[a-zA-Z]+", RegexOptions.IgnoreCase).Match(match.Value).Value;
        if (match.Value.Length > current.Name.Length) current.Version = match.Value.Substring(current.Name.Length + 1);
    }
}

public class UserAgent
{
    private readonly string _userAgent;
    private ClientBrowser _browser;

    private ClientOS _os;

    public UserAgent(string userAgent)
    {
        _userAgent = userAgent;
    }

    public ClientBrowser Browser
    {
        get
        {
            if (_browser == null) _browser = new ClientBrowser(_userAgent);
            return _browser;
        }
    }

    public ClientOS OS
    {
        get
        {
            if (_os == null) _os = new ClientOS(_userAgent);
            return _os;
        }
    }
}