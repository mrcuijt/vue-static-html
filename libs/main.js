// 组件定义
Vue.component("spider-box", {
  template: `
        <div class="spider-box">
          <div>
            <button v-on:click="addRoom">添加房间</button>
            </br>
            <input ref="uid" type="input" placeholder="请输入UID"/>
            </br>
            <input ref="session" type="input" placeholder="请输入会话标识"/>
            </br>
            <input type="input" placeholder="请输入上传地址" v-model="upLocation"/>
          </div>
          {{rooms}}
          <room-box
            v-for="item in rooms"
            :key="item.id"
            :room="item"
            @remove-room="onRemoveRoom"
          ></room-box>
        </div>
  `,
  data() {
    return {
      upLocation: "https://a.bilibili.com:8600/tools/upload",
      rooms: [],
      datas: {},
      cur: 0,
      init: "0",
    };
  },
  methods: {
    addRoom: function (e) {
      var room = {};
      room.id = this.rooms.length + 1;
      room.uid = this.$refs.uid.value;
      room.session = this.$refs.session.value;
      room.upLocation = this.upLocation;
      this.rooms.push(room);
    },
    onRemoveRoom: function (e) {},
  },
});

// 初始化
// 组件定义
Vue.component("room-box", {
  template: `
        <div class="room-box">
          <div>
          {{room}}
            <button v-on:click="start">启动</button>
            <button v-on:click="stop">停止</button>
            <input ref="roomId" type="input" placeholder="请输入房间号"/>
          </div>
        </div>
  `,
  props: {
    room: Object,
  },
  data() {
    return {
      api: new Api(this.room.upLocation),
      ds: new danmukSocket(this.process),
      danmukArry: [],
      links: [],
      cur: 0,
      init: "0",
    };
  },
  methods: {
    start: async function (e) {
      var roomId = this.$refs.roomId.value;
      this.room.roomId = roomId;
      this.api.initToken(await this.api.getTokenApi(roomId));
      var uid = this.room.uid;
      var buvid = this.room.session;
      var token = this.api.token;
      var wsurl = this.api.wsurl();
      this.ds.init(uid, roomId, buvid, token, wsurl);
      this.ds.connection();
    },
    stop: function (e) {
      this.ds.close();
    },
    process: function (data) {
      var uploadApi = this.api.uploadApi;
      var roomId = this.room.roomId;
      fileUpload(uploadApi, roomId, data).then(function (res) {
        console.info(res);
      });
    },
  },
});
