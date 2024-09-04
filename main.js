// 组件定义
Vue.component("alert-box", {
  template: `
        <div class="demo-alert-box">
          <strong>Error!</strong>
          <slot></slot>
        </div>
      `,
});

// 组件定义
Vue.component("content-001", {
  template: `
  <div>
    <button v-on:click="connect">连接</button>
    <button v-on:click="send">发送</button>
    <button v-on:click="menu">菜单</button>
    <menu-001
      v-show="isVisable"
      v-on:publish="publish"
    ></menu-001>
    <room-001
      v-for="item in rooms"
      :key="item.roomId"
      :room="item"
      @remove-room="onRemoveRoom"
    ></room-001>
  </div>
      `,
  data() {
    return {
      taskNo: "",
      current: 0,
      sockets: [],
      isVisable: false,
      rooms: [],
      datas: {}, // 初始数据
    };
  },
  methods: {
    connect: function (e) {
      e instanceof Event;
      // 建立
      var webSocketer = new WebSocketer(() => {});
      this.sockets.push(webSocketer);
      webSocketer.connect();
    },
    send: function () {
      this.sockets[0].send(new Date());
    },
    menu: function () {
      this.isVisable = !this.isVisable;
    },
    publish(data) {
      for (var i = 0; i < data.length; i++) {
        var exists = false;
        for (var j = 0; j < this.rooms.length; j++) {
          if (data[i].roomId == this.rooms[j].roomId) {
            this.rooms[j] = data[i];
            exists = true;
            break;
          }
        }
        if (exists === false) {
          this.rooms.push(data[i]);
        }
      }
    },
    onRemoveRoom(roomId) {
      for (var i = 0; i < this.rooms.length; i++) {
        if (this.rooms[i].roomId === roomId) {
          this.rooms.splice(i, 1);
          break;
        }
      }
    },
  },
});

// 组件定义
Vue.component("room-001", {
  template: `
  <div class="content">
    <div class="operator">
      <button v-on:click="webConnect">连接</button>
      <button v-on:click="webAccept">启动</button>
      <button v-on:click="webDisconnect">停止</button>
      <button v-on:click="$emit('remove-room', room.roomId)">移除</button>
      <button v-on:click="webReset">进度重置</button>
    </div>
    <div class="title">
      <div class="room">
        <span v-if="room.roomId">房间号：{{ room.roomId }}</span>
        <span v-else>UNKNOW</span>
      </div>
      <div class="live-up">
        <span v-if="room.up">主播：{{ room.up }}</span>
        <span v-else>UNKNOW</span>
      </div>
      <div class="live-title">
        <span v-if="room.title">房间名：{{ room.title }}</span>
        <span v-else>UNKNOW</span>
      </div>
      <div class="status"><button class="success-status"></button>Running</div>
    </div>
    <div class="danmuk">
      <ul>
        <li
          v-for="item in danmukArry"
          :key="item.id"
        >{{ item.id }} | {{ item.danmuk }} | {{ item.danmukTime }} | {{ item.danmukUserName }} | {{ item.danmukUserId }}</li>
      </ul>
    </div>
  </div>
      `,
  props: {
    name: String,
    room: Object,
  },
  data() {
    return {
      // socketer: new WebSocketer((data) => {
      //   if (data.cmd === commands.DANMUK_MSG) {
      //     this.danmukArry = data.data;
      //   }
      // }),
      socketer: new WebSocketer(this.messageCall),
      danmukArry: [],
      links: [],
      cur: 0,
      init: "0",
    };
  },
  methods: {
    show() {
      console.info("查看", this.init, this.name, this.item);
    },
    webConnect() {
      if (!this.socketer.socket.send) {
        this.socketer.connect(this.room.roomId, this.room.title);
      }
    },
    webDisconnect() {
      this.socketer.socket.close();
      this.socketer.socket = {};
    },
    webAccept() {
      var obj = {
        cmd: "DANMUK_MSG",
        data: {
          roomId: this.room.roomId,
        },
      };
      this.socketer.send(JSON.stringify(obj));
    },
    messageCall(data) {
      if (data.cmd === commands.DANMUK_MSG) {
        this.danmukArry = data.data;
      }
    },
    webReset() {
      var obj = {
        cmd: "DANMUK_MSG_RESET_PROGRESS",
        data: {
          roomId: this.room.roomId,
          base: 0,
        },
      };
      this.socketer.send(JSON.stringify(obj));
    },
  },
});

// 组件定义
Vue.component("menu-001", {
  template: `
      <div class="content">
        <div class="operator">
          <button>启动</button>
          <button v-on:click="previewData">预览</button>
          <button v-on:click="$emit('publish', emitData())">下放</button>
        </div>
        <div class="div-content">
          <textarea
            class="text-textarea"
            ref="textarea"
          ></textarea>
        </div>
        <div class="div-preview">
          <pre
            class="text-preview"
            ref="preview"
          ></pre>
          <ul>
            <li
              v-for="item in datas"
              :key="item.roomId"
            >{{ JSON.stringify(item) }} <button v-on:click="remove(item.roomId)">移除</button></li>
          </ul>
        </div>
      </div>
      `,
  data() {
    return {
      datas: [],
      cur: 0,
      init: "0",
    };
  },
  methods: {
    show() {
      console.info("查看", this.init, this.name, this.item);
    },
    previewData() {
      var lines = this.$refs.textarea.value.split("\n");
      var rooms = [];
      for (var i = 0; i < lines.length; i++) {
        var items = lines[i].split(" ");
        var room = {
          roomId: items[0],
          up: items[1],
          title: items[2],
        };
        rooms.push(room);
      }
      for (i = 0; i < rooms.length; i++) {
        var flag = false;
        for (var j = 0; j < this.datas.length; j++) {
          if (this.datas[j].roomId === rooms[i].roomId) {
            this.datas[j] = rooms[i];
            flag = true;
            break;
          }
        }
        if (!flag) {
          this.datas.push(rooms[i]);
        }
      }
      this.$refs.preview.innerText = JSON.stringify(rooms);
    },
    remove(roomId) {
      for (var j = 0; j < this.datas.length; j++) {
        if (this.datas[j].roomId === roomId) {
          this.datas.splice(j, 1);
          j--;
          break;
        }
      }
    },
    emitData() {
      return JSON.parse(JSON.stringify(this.datas));
    },
  },
});
