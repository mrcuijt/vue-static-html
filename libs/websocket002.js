class danmukSocket {
  constructor(process) {
    this.ws = {};
    this.uid = 0;
    this.roomid = 0;
    this.buvid = "";
    this.token = "";
    this.wsurl = "";
    this.retry = true;
    this.running = false;
    this.interval = 0;
    this.intervalHeart = 0;
    this.process = process;
  }
  init(uid, roomid, buvid, token, wsurl) {
    this.retry = true;
    this.uid = uid;
    this.roomid = roomid;
    this.buvid = buvid;
    this.token = token;
    this.wsurl = wsurl;
  }
  connection() {
    this.ws = new WebSocket(this.wsurl);
    this.ws.binaryType = "arraybuffer";
    this.ws.onopen = (evt) => {
      this.onOpen(evt);
    };
    this.ws.onclose = (evt) => {
      this.onClose(evt);
    };
  }
  close() {
    this.retry = false;
    this.ws.close();
  }
  onOpen(evt) {
    this.running = true;
    this.auth(this.uid, this.roomid, this.buvid, this.token);
    this.ws.onmessage = (evt) => {
      if (this.intervalHeart === 0) {
        this.intervalHeart = setInterval(() => {
          this.heart();
        }, 30000);
      }
      this.onMessage(evt);
    };
  }
  onMessage(evt) {
    this.process(convertToObject(evt.data));
  }
  onClose(evt) {
    this.running = false;
    clearInterval(this.interval);
    clearInterval(this.intervalHeart);
    this.interval = 0;
    this.intervalHeart = 0;
    if (this.retry)
      setTimeout(() => {
        this.connection();
      }, 3000);
  }
  send(message) {
    this.ws.send(message);
  }
  auth(uid, roomid, buvid, token) {
    this.send(this.getAuth(uid, roomid, buvid, token));
  }
  getAuth(uid, roomid, buvid, token) {
    if (!uid) uid = 0;
    if (!roomid) roomid = 3246070;
    if (!buvid) buvid = "_infoc";
    if (!token) throw new Error("auth token is null");
    var data = `{"uid":${uid},"roomid":${roomid},"protover":3,"buvid":"${buvid}","platform":"web","type":2,"key":"${token}"}`;
    var buffer = window.r.a.getEncoder().encode(data).buffer;
    var tokenHeader = this.getTokenHeader();
    var uint8Array = new Uint8Array(tokenHeader);
    uint8Array[3] = tokenHeader.byteLength + buffer.byteLength - 256;
    return this.mergeData(tokenHeader, buffer);
  }
  heart() {
    this.send(this.getHeart());
  }
  getHeart() {
    var words = [
      0, 0, 0, 31, 0, 16, 0, 1, 0, 0, 0, 2, 0, 0, 0, 1, 91, 111, 98, 106, 101,
      99, 116, 32, 79, 98, 106, 101, 99, 116, 93,
    ];
    var buffer = new ArrayBuffer(31);
    var uint8Array = new Uint8Array(buffer);
    for (var i = 0; i < words.length; i++) {
      uint8Array[i] = words[i];
    }
    return buffer;
  }
  getTokenHeader() {
    var tokenHeader = [0, 0, 1, 235, 0, 16, 0, 1, 0, 0, 0, 7, 0, 0, 0, 1];
    var buffer = new ArrayBuffer(16);
    var uint8Array = new Uint8Array(buffer);
    for (var i = 0; i < tokenHeader.length; i++) {
      uint8Array[i] = tokenHeader[i];
    }
    return buffer;
  }
  mergeData(b1, b2) {
    var a1 = new Uint8Array(b1);
    var a2 = new Uint8Array(b2);
    var length = b1.byteLength + b2.byteLength;
    var buffer = new ArrayBuffer(length);
    var uint8Array = new Uint8Array(buffer);
    var current = 0;
    for (var i = 0; i < b1.byteLength; i++) {
      uint8Array[current] = a1[i];
      current++;
    }
    for (var i = 0; i < b2.byteLength; i++) {
      uint8Array[current] = a2[i];
      current++;
    }
    return buffer;
  }
}
