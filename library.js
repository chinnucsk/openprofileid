try {
    (function() {
        if (!window.hasOwnProperty('OpenProfileId')) {
            var OpenProfileId = {};

            // Helper functions
            
            // START Plugins getters for IE.
            // Cf. http://www.matthewratzloff.com/blog/2007/06/26/detecting-plugins-in-internet-explorer-and-a-few-hints-for-all-the-others/
            function getAdobeReaderPluginIE() {
                var isInstalled = false,
                    version = '',
                    control = null,
                    temp = '',
                    name = '';
                
                try {
                    // AcroPDF.PDF is used by version 7 and later
                    temp = 'AcroPDF.PDF';
                    control = new ActiveXObject(temp);
                } catch (e) {}
                
                if (!control) {
                    try {
                        // PDF.PdfCtrl is used by version 6 and earlier
                        temp = 'PDF.PdfCtrl';
                        control = new ActiveXObject(temp);
                    } catch (e) {}
                }
                
                if (control) {
                    try {
                        isInstalled = true;
                        name = temp;
                        version = control.GetVersions().split(',');
                        version = version[0].split('=');
                        version = parseFloat(version[1]);
                    } catch (e) {}
                }
                
                return {"isInstalled": isInstalled, "version": version, "name": name};
            }
            
            function getFlashPlayerIE() {
                var isInstalled = false,
                    version = '',
                    control = null,
                    temp = '',
                    name = '';
                
                try {
                    temp = 'ShockwaveFlash.ShockwaveFlash';
                    control = new ActiveXObject(temp);
                } catch (e) {}
                
                if (control) {
                    try {
                        isInstalled = true;
                        name = temp;
                        version = control.GetVariable('$version').substring(4);
                        version = version.split(',');
                        version = parseFloat(version[0] + '.' + version[1]);
                    } catch (e) {}
                }
                
                return {"isInstalled": isInstalled, "version": version, "name": name};
            }
            
            function getJavaIE() {
                // The JRE (formerly Java Virtual Machine, or JVM) is actually more difficult to handle than you would think. Determining if Java is installed is easy—a quick call to navigator.javaEnabled() returns a simple Boolean. The problem is detecting the version and provider (Microsoft or Sun) you need to load an applet.
                var isInstalled = false,
                    version = '',
                    name = '';
                
                try {
                    isInstalled = navigator.javaEnabled();
                    name = isInstalled ? 'Java' : '';
                } catch (e) {}
                
                return {"isInstalled": isInstalled, "version": version, "name": name};
            }
            
            function getQuickTimeIE() {
                var isInstalled = false,
                    version = '',
                    control = null,
                    temp = '',
                    name = '';
                
                try {
                    temp = 'QuickTime.QuickTime';
                    control = new ActiveXObject(temp);
                } catch (e) {}
                
                if (control) {
                    try {
                        isInstalled = true;
                        name = temp;
                        version = control.QuickTimeVersion.toString(16); // Convert to hex
                        version = version.substring(0, 1) + '.' + version.substring(1, 3);
                        version = parseFloat(version);
                    } catch (e) {}
                }
                
                return {"isInstalled": isInstalled, "version": version, "name": name};
            }
            
            function getRealPlayerIE() {
                var isInstalled = false,
                    version = '',
                    definedControls = [
                        'rmocx.RealPlayer G2 Control',
                        'rmocx.RealPlayer G2 Control.1',
                        'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)',
                        'RealVideo.RealVideo(tm) ActiveX Control (32-bit)',
                        'RealPlayer'
                    ],
                    control = null,
                    temp = '',
                    name = '';
                
                for (var i = 0; i < definedControls.length; i++) {
                    try {
                        control = new ActiveXObject(definedControls[i]);
                    } catch (e) {
                        continue;
                    }
                    if (control) {
                        temp = definedControls[i];
                        break;
                    }
                }
                
                if (control) {
                    try {
                        isInstalled = true;
                        name = temp;
                        version = control.GetVersionInfo();
                        version = parseFloat(version);
                    } catch (e) {}
                }
                
                return {"isInstalled": isInstalled, "version": version, "name": name};
            }
            
            function getShockwavePlayerIE() {
                var isInstalled = false,
                    version = '',
                    control = null,
                    temp = '',
                    name = '';

                try {
                    temp = 'SWCtl.SWCtl';
                    control = new ActiveXObject(temp);
                } catch (e) {}
                
                if (control) {
                    try {
                        isInstalled = true;
                        name = temp;
                        version = control.ShockwaveVersion('').split('r');
                        version = parseFloat(version[0]);
                    } catch (e) {}
                }
                
                return {"isInstalled": isInstalled, "version": version, "name": name};
            }
            
            function getWindowsMediaPlayerIE() {
                var isInstalled = false,
                    version = '',
                    control = null,
                    temp = '',
                    name = '';
                
                try {
                    temp = 'WMPlayer.OCX';
                    control = new ActiveXObject(temp);
                } catch (e) {}
                
                if (control) {
                    try {
                        isInstalled = true;
                        name = temp;
                        version = parseFloat(control.versionInfo);
                    } catch (e) {}
                }
                
                return {"isInstalled": isInstalled, "version": version, "name": name};
            }
            // END Plugins getters for IE.
            
            
            function getPluginsList() {
                var delimiter = "|",
                    pluginsList = "",
                    plugins = {},
                    pluginsTemp = [];
                
                try {
                    if (window.navigator.plugins && window.navigator.plugins.length) {
                        // This works on all browsers except IE
                        for (var i = 0, l = window.navigator.plugins.length; i < l; i++) {
                            var plugin_name = window.navigator.plugins[i]["name"] || "";
                            
                            // have we already added this plugin?
                            if (!plugins.hasOwnProperty(plugin_name)) {
                                plugins[plugin_name] = '';
                                pluginsTemp.push(plugin_name);
                            }
                        }
                        pluginsList = pluginsTemp.join(delimiter);
                    } else if (window.ActiveXObject) {
                        pluginsList = getAdobeReaderPluginIE().name + delimiter +
                            getFlashPlayerIE().name + delimiter +
                            getJavaIE().name + delimiter +
                            getQuickTimeIE().name + delimiter +
                            getRealPlayerIE().name + delimiter +
                            getShockwavePlayerIE().name + delimiter +
                            getWindowsMediaPlayerIE().name;
                    }
                } catch(err1) {}
                
                return pluginsList;
            }
            
            function getGmtOffset() {
                var localTime = new Date(),
                    tz = localTime.getTimezoneOffset() / 60 * (-1);
                
                tz = (tz > 0 ? "+" : "") + tz;
                
                return "GMT" + tz;
            }
            
            /*
             * START Hashing algo
             *
             * Joseph Myer's md5() algorithm, modified to hash unicode characters as UTF-8.
             *  
             * Copyright 1999-2010, Joseph Myers, Paul Johnston, Greg Holt, Will Bond <will@wbond.net>
             * http://www.myersdaily.org/joseph/javascript/md5-text.html
             * http://pajhome.org.uk/crypt/md5
             * 
             * Released under the BSD license
             * http://www.opensource.org/licenses/bsd-license
             */
            function md5cycle(x, k) {
                var a = x[0], b = x[1], c = x[2], d = x[3];

                a = ff(a, b, c, d, k[0], 7, -680876936);
                d = ff(d, a, b, c, k[1], 12, -389564586);
                c = ff(c, d, a, b, k[2], 17, 606105819);
                b = ff(b, c, d, a, k[3], 22, -1044525330);
                a = ff(a, b, c, d, k[4], 7, -176418897);
                d = ff(d, a, b, c, k[5], 12, 1200080426);
                c = ff(c, d, a, b, k[6], 17, -1473231341);
                b = ff(b, c, d, a, k[7], 22, -45705983);
                a = ff(a, b, c, d, k[8], 7, 1770035416);
                d = ff(d, a, b, c, k[9], 12, -1958414417);
                c = ff(c, d, a, b, k[10], 17, -42063);
                b = ff(b, c, d, a, k[11], 22, -1990404162);
                a = ff(a, b, c, d, k[12], 7, 1804603682);
                d = ff(d, a, b, c, k[13], 12, -40341101);
                c = ff(c, d, a, b, k[14], 17, -1502002290);
                b = ff(b, c, d, a, k[15], 22, 1236535329);

                a = gg(a, b, c, d, k[1], 5, -165796510);
                d = gg(d, a, b, c, k[6], 9, -1069501632);
                c = gg(c, d, a, b, k[11], 14, 643717713);
                b = gg(b, c, d, a, k[0], 20, -373897302);
                a = gg(a, b, c, d, k[5], 5, -701558691);
                d = gg(d, a, b, c, k[10], 9, 38016083);
                c = gg(c, d, a, b, k[15], 14, -660478335);
                b = gg(b, c, d, a, k[4], 20, -405537848);
                a = gg(a, b, c, d, k[9], 5, 568446438);
                d = gg(d, a, b, c, k[14], 9, -1019803690);
                c = gg(c, d, a, b, k[3], 14, -187363961);
                b = gg(b, c, d, a, k[8], 20, 1163531501);
                a = gg(a, b, c, d, k[13], 5, -1444681467);
                d = gg(d, a, b, c, k[2], 9, -51403784);
                c = gg(c, d, a, b, k[7], 14, 1735328473);
                b = gg(b, c, d, a, k[12], 20, -1926607734);

                a = hh(a, b, c, d, k[5], 4, -378558);
                d = hh(d, a, b, c, k[8], 11, -2022574463);
                c = hh(c, d, a, b, k[11], 16, 1839030562);
                b = hh(b, c, d, a, k[14], 23, -35309556);
                a = hh(a, b, c, d, k[1], 4, -1530992060);
                d = hh(d, a, b, c, k[4], 11, 1272893353);
                c = hh(c, d, a, b, k[7], 16, -155497632);
                b = hh(b, c, d, a, k[10], 23, -1094730640);
                a = hh(a, b, c, d, k[13], 4, 681279174);
                d = hh(d, a, b, c, k[0], 11, -358537222);
                c = hh(c, d, a, b, k[3], 16, -722521979);
                b = hh(b, c, d, a, k[6], 23, 76029189);
                a = hh(a, b, c, d, k[9], 4, -640364487);
                d = hh(d, a, b, c, k[12], 11, -421815835);
                c = hh(c, d, a, b, k[15], 16, 530742520);
                b = hh(b, c, d, a, k[2], 23, -995338651);

                a = ii(a, b, c, d, k[0], 6, -198630844);
                d = ii(d, a, b, c, k[7], 10, 1126891415);
                c = ii(c, d, a, b, k[14], 15, -1416354905);
                b = ii(b, c, d, a, k[5], 21, -57434055);
                a = ii(a, b, c, d, k[12], 6, 1700485571);
                d = ii(d, a, b, c, k[3], 10, -1894986606);
                c = ii(c, d, a, b, k[10], 15, -1051523);
                b = ii(b, c, d, a, k[1], 21, -2054922799);
                a = ii(a, b, c, d, k[8], 6, 1873313359);
                d = ii(d, a, b, c, k[15], 10, -30611744);
                c = ii(c, d, a, b, k[6], 15, -1560198380);
                b = ii(b, c, d, a, k[13], 21, 1309151649);
                a = ii(a, b, c, d, k[4], 6, -145523070);
                d = ii(d, a, b, c, k[11], 10, -1120210379);
                c = ii(c, d, a, b, k[2], 15, 718787259);
                b = ii(b, c, d, a, k[9], 21, -343485551);

                x[0] = add32(a, x[0]);
                x[1] = add32(b, x[1]);
                x[2] = add32(c, x[2]);
                x[3] = add32(d, x[3]);
            }

            function cmn(q, a, b, x, s, t) {
                a = add32(add32(a, q), add32(x, t));
                return add32((a << s) | (a >>> (32 - s)), b);
            }

            function ff(a, b, c, d, x, s, t) {
                return cmn((b & c) | ((~b) & d), a, b, x, s, t);
            }

            function gg(a, b, c, d, x, s, t) {
                return cmn((b & d) | (c & (~d)), a, b, x, s, t);
            }

            function hh(a, b, c, d, x, s, t) {
                return cmn(b ^ c ^ d, a, b, x, s, t);
            }

            function ii(a, b, c, d, x, s, t) {
                return cmn(c ^ (b | (~d)), a, b, x, s, t);
            }

            function md51(s) {
                // Converts the string to UTF-8 "bytes" when necessary
                if (/[\x80-\xFF]/.test(s)) {
                    s = unescape(encodeURI(s));
                }
                txt = '';
                var n = s.length, state = [1732584193, -271733879, -1732584194, 271733878], i;
                for (i = 64; i <= s.length; i += 64) {
                    md5cycle(state, md5blk(s.substring(i - 64, i)));
                }
                s = s.substring(i - 64);
                var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                for (i = 0; i < s.length; i++)
                tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
                tail[i >> 2] |= 0x80 << ((i % 4) << 3);
                if (i > 55) {
                    md5cycle(state, tail);
                    for (i = 0; i < 16; i++) tail[i] = 0;
                }
                tail[14] = n * 8;
                md5cycle(state, tail);
                return state;
            }

            function md5blk(s) { /* I figured global was faster.   */
                var md5blks = [], i; /* Andy King said do it this way. */
                for (i = 0; i < 64; i += 4) {
                    md5blks[i >> 2] = s.charCodeAt(i) +
                                      (s.charCodeAt(i + 1) << 8) +
                                      (s.charCodeAt(i + 2) << 16) +
                                      (s.charCodeAt(i + 3) << 24);
                }
                return md5blks;
            }

            var hex_chr = '0123456789abcdef'.split('');

            function rhex(n) {
                var s = '', j = 0;
                for (; j < 4; j++)
                s += hex_chr[(n >> (j * 8 + 4)) & 0x0F] +
                     hex_chr[(n >> (j * 8)) & 0x0F];
                return s;
            }

            function hex(x) {
                for (var i = 0; i < x.length; i++)
                x[i] = rhex(x[i]);
                return x.join('');
            }

            function md5(s) {
                return hex(md51(s));
            }

            /* this function is much faster, so if possible we use it. Some IEs are the
            only ones I know of that need the idiotic second function, generated by an
            if clause.  */
            function add32(a, b) {
                return (a + b) & 0xFFFFFFFF;
            }

            if (md5('hello') != '5d41402abc4b2a76b9719d911017c592') {
                function add32(x, y) {
                    var lsw = (x & 0xFFFF) + (y & 0xFFFF),
                        msw = (x >> 16) + (y >> 16) + (lsw >> 16);
                    return (msw << 16) | (lsw & 0xFFFF);
                }
            }
            // END Hashing algo
            
            function getHash(str) {
                return md5(str);
            }
            
            
            // OpenProfileId functions
            OpenProfileId.getId = function() {
                var hash = '';
                
                try{
                    var ua = window.navigator.userAgent,
                        plugins = getPluginsList(),
                        timezone = getGmtOffset(),
                        screenWidth = window.screen.width,
                        screenHeight = window.screen.height,
                        screenColorDepth = window.screen.pixelDepth,
                        id = ua+plugins+timezone+screenWidth+screenHeight+screenColorDepth;
                    
                    hash = getHash(id);
                } catch(err2) {};

                return hash;
            };
            
            OpenProfileId.getVersion = function() {
                return "1.1";
            };
            
            OpenProfileId.getSite = function() {
                return window.location.host + window.location.pathname;
            };
            
            window.OpenProfileId = OpenProfileId;
        }
    })() 
} catch(err3) {}