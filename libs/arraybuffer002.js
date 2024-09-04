
var wsBinaryHeaderList = [
  { name: "Header Length", key: "headerLen", bytes: 2, offset: 4, value: 16 },
  { name: "Protocol Version", key: "ver", bytes: 2, offset: 6, value: 1 },
  { name: "Operation", key: "op", bytes: 4, offset: 8, value: 2 },
  { name: "Sequence Id", key: "seq", bytes: 4, offset: 12, value: 1 },
];

var o = {
  a: {
    WS_AUTH_OK: 0,
    WS_AUTH_TOKEN_ERROR: -101,
    WS_BODY_PROTOCOL_VERSION_BROTLI: 3,
    WS_BODY_PROTOCOL_VERSION_NORMAL: 0,
    WS_HEADER_DEFAULT_OPERATION: 1,
    WS_HEADER_DEFAULT_SEQUENCE: 1,
    WS_HEADER_DEFAULT_VERSION: 1,
    WS_HEADER_OFFSET: 4,
    WS_OPERATION_OFFSET: 8,
    WS_OP_CONNECT_SUCCESS: 8,
    WS_OP_HEARTBEAT: 2,
    WS_OP_HEARTBEAT_REPLY: 3,
    WS_OP_MESSAGE: 5,
    WS_OP_USER_AUTHENTICATION: 7,
    WS_PACKAGE_HEADER_TOTAL_LENGTH: 16,
    WS_PACKAGE_OFFSET: 0,
    WS_SEQUENCE_OFFSET: 12,
    WS_VERSION_OFFSET: 6,
  },
};

var convertToObject = function (t) {
  var e = new DataView(t),
    n = {
      body: [],
    };
  if (
    ((n.packetLen = e.getInt32(o.a.WS_PACKAGE_OFFSET)),
    this.wsBinaryHeaderList.forEach(function (t) {
      4 === t.bytes
        ? (n[t.key] = e.getInt32(t.offset))
        : 2 === t.bytes && (n[t.key] = e.getInt16(t.offset));
    }),
    n.packetLen < t.byteLength && this.convertToObject(t.slice(0, n.packetLen)),
    this.decoder || (this.decoder = r.a.getDecoder()),
    !n.op || (o.a.WS_OP_MESSAGE !== n.op && n.op !== o.a.WS_OP_CONNECT_SUCCESS))
  )
    n.op &&
      o.a.WS_OP_HEARTBEAT_REPLY === n.op &&
      (n.body = {
        count: e.getInt32(o.a.WS_PACKAGE_HEADER_TOTAL_LENGTH),
      });
  else
    for (
      var i = o.a.WS_PACKAGE_OFFSET, s = n.packetLen, a = "", u = "";
      i < t.byteLength;
      i += s
    ) {
      (s = e.getInt32(i)), (a = e.getInt16(i + o.a.WS_HEADER_OFFSET));
      try {
        if (n.ver === o.a.WS_BODY_PROTOCOL_VERSION_NORMAL) {
          var c = this.decoder.decode(t.slice(i + a, i + s));
          u = 0 !== c.length ? JSON.parse(c) : null;
        } else if (n.ver === o.a.WS_BODY_PROTOCOL_VERSION_BROTLI) {
          var l = t.slice(i + a, i + s),
            h = window.BrotliDecode(new Uint8Array(l));
          u = this.convertToObject(h.buffer).body;
        }
        u && n.body.push(u);
      } catch (e) {
        //this.options.onLogger("decode body error:", new Uint8Array(t), n, e)
        console.info("decode body error:", new Uint8Array(t), n, e);
      }
    }
  return n;
};

function getR(t, e, n) {
  "use strict";
  var o = {
    getDecoder: function () {
      return window.TextDecoder
        ? new window.TextDecoder()
        : {
            decode: function (t) {
              return decodeURIComponent(
                window.escape(
                  String.fromCharCode.apply(String, new Uint8Array(t))
                )
              );
            },
          };
    },
    getEncoder: function () {
      return window.TextEncoder
        ? new window.TextEncoder()
        : {
            encode: function (t) {
              for (
                var e = new ArrayBuffer(t.length),
                  n = new Uint8Array(e),
                  o = 0,
                  i = t.length;
                o < i;
                o++
              )
                n[o] = t.charCodeAt(o);
              return e;
            },
          };
    },
    mergeArrayBuffer: function (t, e) {
      var n = new Uint8Array(t),
        o = new Uint8Array(e),
        i = new Uint8Array(n.byteLength + o.byteLength);
      return i.set(n, 0), i.set(o, n.byteLength), i.buffer;
    },
    callFunction: function (t, e) {
      return t instanceof Array && t.length
        ? (t.forEach(function (t) {
            return "function" == typeof t && t(e);
          }),
          null)
        : "function" == typeof t && t(e);
    },
    extend: function (t) {
      for (
        var e = arguments.length, n = Array(e > 1 ? e - 1 : 0), o = 1;
        o < e;
        o++
      )
        n[o - 1] = arguments[o];
      var i = t || {};
      return (
        i instanceof Object &&
          n.forEach(function (t) {
            t instanceof Object &&
              Object.keys(t).forEach(function (e) {
                i[e] = t[e];
              });
          }),
        i
      );
    },
  };
  e.a = o;
}

window.r = {};

getR(buffer, r, {});

var obj = convertToObject(buffer);

console.info(obj);

// for (tag in window) {
//   console.info(tag, window[tag]);
// }
