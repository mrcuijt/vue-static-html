function TASK_INIT(data) {
  console.info(data);
}

function TASK_DATA_FIX(data) {
  console.info(data);
}

function DANMUK_MSG(data) {
  return data;
}

function DANMUK_MSG_RESET_PROGRESS(data) {
  return data;
}

var commands = {
  AUTH: "AUTH",
  FAIL: "FAIL",
  AUTH_FAIL: "AUTH_FAIL",
  AUTH_SUCCESS: "AUTH_SUCCESS",

  TASK_INIT: "TASK_INIT",
  TASK_DATA_FIX: "TASK_DATA_FIX",
  TASK_INCREMENT: "TASK_INCREMENT",
  TASK_INCREMENT_ACTUAL: "TASK_INCREMENT_ACTUAL",
  TASK_INCREMENT_EXPECTED: "TASK_INCREMENT_EXPECTED",

  DANMUK_MSG: "DANMUK_MSG",
  DANMUK_NOTIFY: "DANMUK_NOTIFY",
  DANMUK_MSG_RESET_PROGRESS: "DANMUK_MSG_RESET_PROGRESS",
};

var taskSet = new Set();
taskSet.add(commands.AUTH);
taskSet.add(commands.FAIL);
taskSet.add(commands.AUTH_FAIL);
taskSet.add(commands.AUTH_SUCCESS);

taskSet.add(commands.TASK_INIT);
taskSet.add(commands.TASK_DATA_FIX);
taskSet.add(commands.TASK_INCREMENT);
taskSet.add(commands.TASK_INCREMENT_ACTUAL);
taskSet.add(commands.TASK_INCREMENT_EXPECTED);

taskSet.add(commands.DANMUK_MSG);
taskSet.add(commands.DANMUK_NOTIFY);
taskSet.add(commands.DANMUK_MSG_RESET_PROGRESS);

var cmder = {
  taskSet: taskSet,
  TASK_INIT: TASK_INIT,
  TASK_DATA_FIX: TASK_DATA_FIX,
  DANMUK_MSG: DANMUK_MSG,
  AUTH_SUCCESS: DANMUK_MSG_RESET_PROGRESS,
  DANMUK_MSG_RESET_PROGRESS: DANMUK_MSG_RESET_PROGRESS,
};

function name() {}

function process(data) {
  var cmd = {};
  try {
    cmd = JSON.parse(data);
  } catch (e) {
    cmd = { error: e };
  }
  var name = cmd.cmd;
  console.info(name);
  if (cmder.taskSet.has(name)) {
    return { cmd: name, data: cmder[name](cmd.data) };
  }
  return data;
}

// 组件初始化（基础模板环境）
// 任务模块
// 建立连接
// 任务处理（消费任务）

// 1、生成页面内容区域
// 1.1、内容区域 显示/隐藏/全屏 for 组件批量生成注册，
// 2、页面内容渲染
// 3、渲染数据交互

var operator = {
  name: name,
  process: process,
};
