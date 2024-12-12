// 组件定义
// 可以手动翻页的弹幕列表
// 弹幕类型 筛选
// 弹幕原始 报文结构查看
// 弹幕原始 文件，报文所在文件
Vue.component("search-001", {
  template: `
        <div class="search-box">
          <p>状态：{{state}}</p>
          <div>
            <button v-on:click="get">获取</button>
            <button v-on:click="getFirst">首页</button>
            <button v-on:click="getPer">获取上一页</button>
            <button v-on:click="getNext">获取下一页</button>
            </br>
            <label for="roomId">房间号：</label>
            <input v-model="room.roomId" id="roomId" ref="roomId" type="input" placeholder="请输入房间号"/>
            <input v-model="room.roomName" id="roomName" ref="roomName" type="input" placeholder="请输入房间名"/>
            <label for="curPage">页号：</label>
            <input v-model="room.roomPage" id="curPage" ref="page" type="input" placeholder="请输入页号"/>
            <label for="danmukType">弹幕类型：</label>
            <select id="danmukType">
              <option value="DANMUK_MSG">DANMUK_MSG</option>
            </select>
          </div>
          <div class="danmuk">
            <ul>
              <li
                v-for="(item, index) in danmukArry"
                :key="item.id"
              >{{ index + 1 > 9 ? index + 1 : "0" + (index + 1) }} | {{ item.id }} | {{ item.danmuk }} | {{ item.danmukTime }} | {{ item.danmukUserName }} | {{ item.danmukUserId }}</li>
            </ul>
          </div>
        </div>
  `,
  data() {
    return {
      socketer: new WebSocketer(this.messageCall),
      danmukArry: [],
      room: {
        roomId: "30627986",
        roomName: "sybb",
        roomPage: 1,
      },
      datas: {},
      cur: 0,
      state: "",
      init: "0",
    };
  },
  methods: {
    get: function (e) {
      var obj = {
        cmd: "DANMUK_MSG_ROLLING",
        data: {
          roomId: this.room.roomId,
          roomPage: this.room.roomPage,
        },
      };
      this.socketer.send(JSON.stringify(obj));
    },
    getFirst: function (e) {
      this.room.roomPage = 1;
      this.get(e);
    },
    getPer: function (e) {
      this.room.roomPage = parseInt(this.room.roomPage) - 1;
      if (this.room.roomPage < 1) {
        this.room.roomPage = 1;
      }
      this.get(e);
    },
    getNext: function (e) {
      this.room.roomPage = parseInt(this.room.roomPage) + 1;
      this.get(e);
    },
    messageCall(data) {
      if (data.cmd === commands.DANMUK_MSG) {
        this.danmukArry = data.data;
      }
    },
    connection: function () {
      this.state = "连接";
      this.socketer.connect();
    },
  },
  mounted: function () {
    this.connection();
  },
});
