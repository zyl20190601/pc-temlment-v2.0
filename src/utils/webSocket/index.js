export default class WebSocketClass {
  constructor(url, msgCallback, time) {
    const IS_HTTPS = document.location.protocol.includes('https')
    let wsProtocol = IS_HTTPS ? 'wss://' : 'ws://'

    this.wsUrl = `${wsProtocol}${url}`
    this.msgCallback = msgCallback;
    //-------------------------------------------------------------------------------
    this.ws = null;  // websocket对象
    this.status = null; // websocket是否关闭
    this.pingPong = null;
    this.time = time;     //心跳时间
    this.initTimeOut = null;     //重连定时器
    this.initTime = 30000   //重连时间
    this.init()
  }

  init (data) {
    this.ws = new WebSocket(this.wsUrl);
    // eslint-disable-next-line consistent-return
    this.ws.onopen = () => {
      this.status = 'open';
      this.heartCheck();
      if (data) {
        return this.ws.send(data);
      }
    };

    this.ws.onmessage = e => {
      if (e.data == 'pong') {
        this.pingPong = 'pong';
        console.log(`收到信息:${e.data}`);
        return false;
      }
      this.msgCallback(e.data);
      return false
    };

    this.ws.onclose = () => {
      if (this.status == 'close') {
        if (this.pingInterval && this.pongInterval) {
          clearInterval(this.pingInterval);
          clearInterval(this.pongInterval);
        }
        console.log('关闭成功,清除定时器,停止运行');
        return
      }
      this.init();
    }

    this.onerror = e => {
      console.log(e);
      this.closeHandle(e); // 判断是否关闭
    }
  }

  heartCheck () {          // 心跳
    this.pingPong = 'ping';
    this.pingInterval = setInterval(() => {
      if (this.ws.readyState === 1) {
        this.ws.send('ping');               // 客户端发送ping
        //console.log('心跳检测:发送ping')
      }
    }, this.time);
    this.pongInterval = setInterval(() => {
      if (this.pingPong == 'ping') {
        //console.log('心跳检测:后端未返回pong,准备重启webSocket');
        this.closeHandle('pingPong没有改变为pong'); // 没有返回pong 重启webSocket
      } else {
        //console.log('心跳检测:返回pong');
        this.pingPong = 'ping'
      }
    }, this.time + 1000)
  }

  sendHandle (data) {
    //console.log(`发送消息给服务器:`,data);
    return this.ws.send(data);
  }
  closeHandle () {
    if (this.status !== 'close') {
      //console.log(`断开，重连websocket----${new Date().getSeconds()}`, e);
      if (this.pingInterval && this.pongInterval) {
        clearInterval(this.pingInterval);
        clearInterval(this.pongInterval);
      }
      if (this.initTimeOut) {
        //console.log(`正在重启----${new Date().getSeconds()}`);
        return
      }
      this.initTimeOut = setTimeout(() => {
        this.initTimeOut = null;
        this.ws.close();
        //console.log(`容错:手动关闭成功----${new Date().getSeconds()}`);
      }, this.initTime)      // 重连延迟时间
    } else {
      if (this.pingInterval && this.pongInterval) {
        clearInterval(this.pingInterval);
        clearInterval(this.pongInterval);
      }
      //console.log(`this.ws.readyState`);
    }
  }
  // 手动关闭WebSocket
  closeMyself () {
    this.status = 'close';
    console.log(`手动关闭`, this.ws);
    this.ws.close();
    console.log(`手动关闭成功`);
  }
}

