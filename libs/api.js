class Api {
  constructor(uploadApi) {
    this.uploadApi = uploadApi;
    this.hosts = [];
    this.token = "";
    this.choose = 0;
  }

  getTokenApi(roomid) {
    return `https://api.live.bilibili.com/xlive/web-room/v1/index/getDanmuInfo?id=${roomid}&type=0`;
  }

  initToken(result) {
    this.hosts = result.data.host_list;
    this.token = result.data.token;
  }

  wsurl() {
    var host = hosts[choose].host;
    var port = hosts[choose].wss_port;
    return `wss://${host}:${port}/sub`;
  }
}

var uploadApi = "https://a.bilibili.com:8600/tools/upload";


function ajaxJson(url, obj) {
  var promise = new Promise(function (resolve, reject) {
    // 1. create XMLHttpRequset Object.
    var xmlhttp;
    if (window.XMLHttpRequest) {
      //  IE7+, Firefox, Chrome, Opera, Safari Usage
      xmlhttp = new XMLHttpRequest();
    } else {
      // IE6, IE5 Usage
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    // 2. add ajax readystatechange event listener.
    xmlhttp.onreadystatechange = function () {
      console.info("[readystatechange - begin]");
      console.info(xmlhttp.status + " " + xmlhttp.readyState);
      if (xmlhttp.readyState == 4) {
        if (xmlhttp.status == 200) {
          console.info(xmlhttp.responseType);
          if (xmlhttp.responseType == "json") {
            console.info(xmlhttp.response);
            resolve(xmlhttp.response);
          } else if (xmlhttp.responseType == "arraybuffer") {
            resolve(xmlhttp.response);
          } else if (xmlhttp.responseType == "text") {
            resolve(xmlhttp.responseText);
          } else if (xmlhttp.responseType == "document") {
            resolve(xmlhttp.responseXML);
          } else {
          }
        } else {
          console.info("requset fail");
          reject();
        }
      }
    };

    xmlhttp.responseType = "json";
    xmlhttp.withCredentials = true;

    // 3. set ajax request info
    //   1) Request Method ["GET","POST","HEAD","PUT","DELETE","CONNECT","TRACE","OPTIONS"]
    //   2) URL
    //   3) async
    xmlhttp.open("GET", url, true);
    //xmlhttp.setRequestHeader("Content-type", "application/json");
    //xmlhttp.setRequestHeader("token", "");

    // 4. send ajax request
    xmlhttp.send(obj);
  });
  return promise;
}

function fileUpload(url, obj) {
  var promise = new Promise(function (resolve, reject) {
    // 1. create XMLHttpRequset Object.
    var xmlhttp;
    if (window.XMLHttpRequest) {
      // IE7+, Firefox, Chrome, Opera, Safari Usage
      xmlhttp = new XMLHttpRequest();
    } else {
      // IE6, IE5 Usage
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    // 2. add ajax readystatechange event listener.
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4) {
        if (xmlhttp.status == 200) {
          if (xmlhttp.responseType == "json") {
            resolve(xmlhttp.response);
          } else if (xmlhttp.responseType == "arraybuffer") {
            resolve(xmlhttp.response);
          } else if (xmlhttp.responseType == "text") {
            resolve(xmlhttp.responseText);
          } else if (xmlhttp.responseType == "document") {
            resolve(xmlhttp.responseXML);
          } else {
          }
        } else {
          console.info("requset fail");
          reject();
        }
      }
    };
    xmlhttp.responseType = "json";
    // 3. set ajax request info
    //   1) Request Method ["GET","POST","HEAD","PUT","DELETE","CONNECT","TRACE","OPTIONS"]
    //   2) URL
    //   3) async
    xmlhttp.open("POST", url, true);

    var blob = new Blob([JSON.stringify(obj)]);
    var f = new File([blob], roomid, { type: blob.type });
    var formData = new FormData();
    formData.append("file", f);
    xmlhttp.send(formData);
  });
  return promise;
}
