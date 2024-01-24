

//  import pomelo from './pomelo-client';

import { aesDecrypt, aesEncrypt } from "../EncryptUtil"
import './LeafyClient'
import eventManager from "../../common/EventManager"
const ToastManager = require('../../common/ToastManager')
let nHeartBeat = 0
let s_timer = null
let interval = null
let isConn = true
let kickk = false
let reconnet_success = false
let p_server = new window.Pomelo()
let p_server2 = new window.Pomelo()

console.log(p_server,p_server2,"ddddddddddddddddddddddddddddddd")

function conn(cb){
	
	let host = 'pc2.th371.com'+"/conn2";
	const _user_data = cc.sys.localStorage.getItem('userinfo');
	const userInfo = JSON.parse(_user_data)
	  let msg = { uid: userInfo.userId}
	  let msg2 = { userId: userInfo.userId, token: userInfo.token,rType:'',roomId:'',player_type:userInfo.userType}
		  p_server.init({ host:host, port: '', log: true },
		    function (num) {
				console.log(num,"--------------------->1111111111111111111111")
		      p_server.request("gate.gateHandler.queryEntry", msg, function (res) {
				   console.log(res,"response 22222222222222******************")
		        p_server.disconnect();
		        if (res.code == 200) {
					let port = res.port;
					if(port=="3010"){
						host = 'pc2.th371.com'+'/conn4';
					  }
					  if(port=="3011"){
						host = 'pc2.th371.com'+'/conn5';
					  }
					  if(port=="3012"){
						host = 'pc2.th371.com'+'/conn6';
					  }
					  port = '';
					   console.log(port,"response ****************** 33333333333333333333")
		          p_server2.init({ host: host, port: port, log: true },function (res) {
		              p_server2.request("connector.entryHandler.entry", msg2, function (res) {
						    if (res.code == 200) {
							  isConn = false
							  clsInterval(interval)
							  clsInterval(s_timer)
							  startTimer()
							  cb(res, res)
							}
		              })
		            }
		          )
		        }
		      })
		    }
		)
		 return isConn;
}

p_server2.on('close', function (e) {
  console.log('close 断线关闭', new Date())
  isConn = true
  reconnet_success = false
  clsInterval(interval)
  // 连接关闭
  if(isConn && !kickk) {
    interval = setInterval(() => {
      if (isConn) {
        conn(function (err, res) {
          if (res.code == 200) {
            clsInterval(interval)
            reconnet_success = true
          }
        })
      }
    }, 5000)
  }
})

p_server2.on('onMsg', function (e) {
	//console.log("接收消息"+JSON.stringify(e));
	 //uni.$emit('message', e)
	 cc.systemEvent.emit('message', e)
  //ws.doData(e)
})

// 被踢开
p_server2.on('onKick', function (e) {
  kickk = true
  nHeartBeat = 0
  clsInterval(interval)
  clsInterval(s_timer)
   p_server2.disconnect()
  kick()
})

function disconnectServer() {
	clsInterval(interval);
	clsInterval(s_timer);
	p_server2.disconnect();
}

// 被踢开
function kick() {
	console.log("kickkkkkkkkkkk")
	// uni.showToast({
	// 	icon:'error',
	// 	duration:3000, 
	// 	title:"该账号重复登录！",
	// 	success() {
	// 		setTimeout(() => {
	// 			uni.reLaunch({
	// 				url:'/pages/pc/login/login'
	// 			})
	// 		}, 2000)
	// 	}
	// });

	eventManager.emit('showToast', '该账号重复登录！');
    disconnectServer()
    cc.director.loadScene('Log')
 
	 
}

var n = 0
/**
 * 发送报文函数
 * @param {Json Object} msg 
 * @description 记得发送前对json对象AES加密
 */
function send(msg,route,cb) {
  n = n + 1
  p_server2.request(route, msg, function (res) {
	   // console.log(JSON.stringify(res)+"-=---收到信息")
	  //return res;
	 cb(res);
    //ws.doData(res)
  })
}

function sendcb(msg, cb) {
  n = n + 1
  //const en = global.en
 // const msgSend = AES.encrypt(JSON.stringify(msg), en)
 const msgSend = aesEncrypt(JSON.stringify(msg))
  var route = process.env.VUE_APP_AGENT
  p_server2.request(route, msgSend, function (res) {
    // console.log('res ', res)
    cb(JSON.parse(aesDecrypt(JSON.parse(res))))
  })
}

/**
 * @name clsInterval
 * @description 清除定时器函数
 * @param {timer_Interval} interval 
 */
function clsInterval(interval) {
	
  if(interval !== null) {
    clearInterval(interval)
    interval = null
  }
}

/**
 * @name startTimer
 * @description 登录成功后，开始计时心跳
 */
function startTimer() {
  clsInterval(s_timer);
  console.log("开启心跳")
  s_timer = setInterval(() => {
    chkHeartBeat(p_server2)
  }, 5000)
}

/**
 * 心跳包机制函数
 * @name chkHeartBeat
 * @param {pomelo 链接} server
 * @description 返回值 07：正常链接中，否则链接有问题  nHeartBeat += 5 超过40秒提示
 */
function chkHeartBeat(server) {
		console.log(nHeartBeat)
  if (nHeartBeat > 70) {
	  	// uni.showToast({
	  	// 	icon:'error',
	  	// 	title:'您的网络状态不佳，请检查网络或重新登录! 努力重连中...',
	  	// 	duration:2000
	  	// })
	  	  console.log('重连时间过长...请检查网络链接或重新登录!');
		  clsInterval(s_timer)
		  server.disconnect()
		  window.location.reload();
		//   uni.reLaunch({
		// 	url:'/pages/pc/login/login'
		//   })
  
  
    if(nHeartBeat > 300) {
      clsInterval(s_timer)
      server.disconnect()
      window.location.reload()
    }
  }
  nHeartBeat += 5
  const _user_data =  cc.sys.localStorage.getItem('userinfo');
  const userInfo = JSON.parse(_user_data)

  var msg = { uid: userInfo.userId } // 记得改
  var route = 'bjl.bjlHandler.chkHardBean';
  server.request(route, msg, function (data) {
    if (data.code === '07') {
      nHeartBeat = 0
    }
  })
}



 export {conn,send,disconnectServer}

