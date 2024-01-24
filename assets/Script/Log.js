// import { md5 } from './Md5';
import { aesEncrypt } from './util/EncryptUtil';
import { md5 } from './util/md5';
import { conn } from './util/socket/pomeloScoket';
// import toastManager from './common/ToastManager';
const ToastManager = require('ToastManager')
const Log = cc.Class({
    extends: cc.Component,

    properties: {
        username:{
            default:null,
            type:cc.EditBox
        },
        password:{
            default:null,
            type:cc.EditBox
        },

        
    },

    onLoad(){
        console.log(Global.isLogin)
        // Get the ToastManager component from the Canvas node
        this.toastManager = this.node.getComponent(ToastManager);

        // Check if the ToastManager component is present
        if (!this.toastManager) {
            cc.error("ToastManager component not found on the Canvas node.");
        }
     },

    async postData(url, data) {
        try {
            const response = await fetch(url + 'opt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add any additional headers if needed
                },
                body: JSON.stringify(data),
            });
    
            if (!response.ok) {
                const errorResponse = await response.json();
                const errorMessage = errorResponse && errorResponse.msg ? errorResponse.msg : 'Unknown error';
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorMessage}`);
            }
    
            const result = await response.json();
            console.log('API response:', result);
            return result
            // Handle the API response here
    
        } catch (error) {
            console.error('Error:', error);
            console.log(error.message)
            //showToast(error.message); // Show the error message in your toast
            // Handle errors here
        }
    },

    async onclickLogin() {
        console.log("leeeeeeeeeeeeeeeeeeeeeeeeee")
        let url  = 'https://pc2.th371.com/conn3/'
        console.log("click")
        let acc = this.username.string
       let pass = this.password.string

       if(acc == '' || pass == '') {
        if (this.toastManager) {
          return  this.toastManager.showToast('error',2);
          }
       }
       const md5_pass = md5(pass)
       const data = "01;"+acc+";"+md5_pass+";"+"windows"+";1";
       const resp =   await this.postData(url, {data:data});
       this.toastManager.showToast(resp.msg,2);
       let userInfo = null
       if(resp.code == 200){
        userInfo = resp.data;
        userInfo.userType = 1
       }
       cc.sys.localStorage.setItem('userinfo', JSON.stringify(userInfo))
        // Now you can call showToast on the ToastManager instance

       conn(res=>{
        console.log(res,"response of pomelo *************")
        if(res.code == '200') {
            Global.isLogin = true
            cc.director.loadScene("gameScene");

        }
       })




       //let enc =  JSON.parse(JSON.stringify(data))
       //let encrypt = aesEncrypt((JSON.stringify(enc)),`@hKe9@A1lKe9$Tz1kE@8HnG7`,`1234567890123456`)
      // console.log(encrypt,"dddddddddddd")
     //  set('userinfo',JSON.stringify(encrypt))

       //const resp =   await this.postData(url, {data:data});
       //let userInfo = null
      //// if(resp.code == 200){
       // userInfo = resp.data;
        
       //}
      // userInfo.userType = 1
      // set('userinfo',JSON.stringify(userInfo))
      // console.log(md5_pass)
       
    },


    // called every frame
    update: function (dt) {

    },
});

module.exports = Log