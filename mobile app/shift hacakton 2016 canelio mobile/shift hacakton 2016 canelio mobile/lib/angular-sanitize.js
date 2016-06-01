/*
 AngularJS v1.2.21
 (c) 2010-2014 Google, Inc. http://angularjs.org
 License: MIT
*/
(function (q, g, r) {
    'use strict'; function F(a) { var d = []; t(d, g.noop).chars(a); return d.join("") } function m(a) { var d = {}; a = a.split(","); var b; for (b = 0; b < a.length; b++) d[a[b]] = !0; return d } function G(a, d) {
        function b(a, c, b, h) { c = g.lowercase(c); if (u[c]) for (; f.last() && v[f.last()];) e("", f.last()); w[c] && f.last() == c && e("", c); (h = x[c] || !!h) || f.push(c); var n = {}; b.replace(H, function (a, c, d, b, e) { n[c] = s(d || b || e || "") }); d.start && d.start(c, n, h) } function e(a, c) {
            var b = 0, e; if (c = g.lowercase(c)) for (b = f.length - 1; 0 <= b && f[b] != c; b--);
            if (0 <= b) { for (e = f.length - 1; e >= b; e--) d.end && d.end(f[e]); f.length = b }
        } var c, l, f = [], n = a, h; for (f.last = function () { return f[f.length - 1] }; a;) {
            h = ""; l = !0; if (f.last() && y[f.last()]) a = a.replace(RegExp("(.*)<\\s*\\/\\s*" + f.last() + "[^>]*>", "i"), function (c, a) { a = a.replace(I, "$1").replace(J, "$1"); d.chars && d.chars(s(a)); return "" }), e("", f.last()); else {
                if (0 === a.indexOf("\x3c!--")) c = a.indexOf("--", 4), 0 <= c && a.lastIndexOf("--\x3e", c) === c && (d.comment && d.comment(a.substring(4, c)), a = a.substring(c + 3), l = !1); else if (z.test(a)) {
                    if (c =
                    a.match(z)) a = a.replace(c[0], ""), l = !1
                } else if (K.test(a)) { if (c = a.match(A)) a = a.substring(c[0].length), c[0].replace(A, e), l = !1 } else L.test(a) && ((c = a.match(B)) ? (c[4] && (a = a.substring(c[0].length), c[0].replace(B, b)), l = !1) : (h += "<", a = a.substring(1))); l && (c = a.indexOf("<"), h += 0 > c ? a : a.substring(0, c), a = 0 > c ? "" : a.substring(c), d.chars && d.chars(s(h)))
            } if (a == n) throw M("badparse", a); n = a
        } e()
    } function s(a) {
        if (!a) return ""; var d = N.exec(a); a = d[1]; var b = d[3]; if (d = d[2]) p.innerHTML = d.replace(/</g, "&lt;"), d = "textContent" in p ?
        p.textContent : p.innerText; return a + d + b
    } function C(a) { return a.replace(/&/g, "&amp;").replace(O, function (a) { var b = a.charCodeAt(0); a = a.charCodeAt(1); return "&#" + (1024 * (b - 55296) + (a - 56320) + 65536) + ";" }).replace(P, function (a) { return "&#" + a.charCodeAt(0) + ";" }).replace(/</g, "&lt;").replace(/>/g, "&gt;") } function t(a, d) {
        var b = !1, e = g.bind(a, a.push); return {
            start: function (a, l, f) {
                a = g.lowercase(a); !b && y[a] && (b = a); b || !0 !== D[a] || (e("<"), e(a), g.forEach(l, function (b, f) {
                    var k = g.lowercase(f), l = "img" === a && "src" === k || "background" ===
                    k; !0 !== Q[k] || !0 === E[k] && !d(b, l) || (e(" "), e(f), e('="'), e(C(b)), e('"'))
                }), e(f ? "/>" : ">"))
            }, end: function (a) { a = g.lowercase(a); b || !0 !== D[a] || (e("</"), e(a), e(">")); a == b && (b = !1) }, chars: function (a) { b || e(C(a)) }
        }
    } var M = g.$$minErr("$sanitize"), B = /^<((?:[a-zA-Z])[\w:-]*)((?:\s+[\w:-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)\s*(>?)/, A = /^<\/\s*([\w:-]+)[^>]*>/, H = /([\w:-]+)(?:\s*=\s*(?:(?:"((?:[^"])*)")|(?:'((?:[^'])*)')|([^>\s]+)))?/g, L = /^</, K = /^<\//, I = /\x3c!--(.*?)--\x3e/g, z = /<!DOCTYPE([^>]*?)>/i,
    J = /<!\[CDATA\[(.*?)]]\x3e/g, O = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g, P = /([^\#-~| |!])/g, x = m("area,br,col,hr,img,wbr"); q = m("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"); r = m("rp,rt"); var w = g.extend({}, r, q), u = g.extend({}, q, m("address,article,aside,blockquote,caption,center,del,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,map,menu,nav,ol,pre,script,section,table,ul")), v = g.extend({}, r, m("a,abbr,acronym,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,q,ruby,rp,rt,s,samp,small,span,strike,strong,sub,sup,time,tt,u,var")),
    y = m("script,style"), D = g.extend({}, x, u, v, w), E = m("background,cite,href,longdesc,src,usemap"), Q = g.extend({}, E, m("abbr,align,alt,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,coords,dir,face,headers,height,hreflang,hspace,ismap,lang,language,nohref,nowrap,rel,rev,rows,rowspan,rules,scope,scrolling,shape,size,span,start,summary,target,title,type,valign,value,vspace,width")), p = document.createElement("pre"), N = /^(\s*)([\s\S]*?)(\s*)$/; g.module("ngSanitize", []).provider("$sanitize",
    function () { this.$get = ["$$sanitizeUri", function (a) { return function (d) { var b = []; G(d, t(b, function (b, c) { return !/^unsafe/.test(a(b, c)) })); return b.join("") } }] }); g.module("ngSanitize").filter("linky", ["$sanitize", function (a) {
        var d = /((ftp|https?):\/\/|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s.;,(){}<>]/, b = /^mailto:/; return function (e, c) {
            function l(a) { a && k.push(F(a)) } function f(a, b) { k.push("<a "); g.isDefined(c) && (k.push('target="'), k.push(c), k.push('" ')); k.push('href="'); k.push(a); k.push('">'); l(b); k.push("</a>") }
            if (!e) return e; for (var n, h = e, k = [], m, p; n = h.match(d) ;) m = n[0], n[2] == n[3] && (m = "mailto:" + m), p = n.index, l(h.substr(0, p)), f(m, n[0].replace(b, "")), h = h.substring(p + n[0].length); l(h); return a(k.join(""))
        }
    }])
})(window, window.angular);
