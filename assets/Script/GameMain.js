// Learn cc.Class:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html
//const RoomData = require('RoomData')

import { getLz } from "./common/release";
import { disconnectServer,send } from "./util/socket/pomeloScoket";

cc.Class({
    extends: cc.Component,
    
    properties: {
        roomScrollView:{
            default:null,
            type:cc.ScrollView
        },
         roadMapData: {
                default: [],
        },
        noticePm:'',
        showNotice:false,
        showCenter:false,
        showBetRecord:false,
        showRule:false,
        showKf:false,
        showKfs:false,
        bgSound:true,
        bgMusic:true,
        showSetting:false,
        showRePwd:false,
        username:'',
        nickname:'',
        ye:0,
        id:'',
        isSub:'',
        showCommand:false,
        showRecode:false,
        showMenu:false,
        showLanguage:false,
        recordt_type:0,
        showStart:false,
        showEnd:false,
        websocket:null,
        timerGetData: null,//定时器名称
        rType:'bjl',
        roomList:[],
        rows:6,
        rowsNn:4,
        cols:6,
        colsNn:15,
        rowsDl:6,
        colsDl:33,
        colssix:30,
        colsdy:25,
        colsxy:25,
        gameRecord:[],
        jyRecord:[],
        recordDate:0,
        isMouseSelect:false,
        gtype:'bjl',
        showCm:false,
        cmje:'',
        cmphone:'',
        ptype:'+86',
        notice:'',
        showDown:false,
        noticeContent:'',
        currentPage:1,
        pageSize:30,
        rePassword:'',
        oldPassword:'',
        serverLink:'',
        serverLinks:[],
        showWithdraw:false,
        showWithdrawRecord:false,
        txName:'',
        txMoney:'',
        txCard:'',
        txBankName:'',
        withdrawRecords:[],
        recordInfo:null,
        userInfo:null
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        this.RoomData = this.node.getChildByName('Scrollview');
        this.roomDataComponent = this.RoomData.getComponent('RoomData');
        if (!this.roomDataComponent) {
            cc.error("RoomData component not found on the Canvas node.");
        }
        // this.roadMapData =  [
        //     {   id:1,
        //         name:'vip31',
        //         type:'bjl',
        //         amount:'20-100000',
        //         time:'tesing',
        //         road:''//show nothing should show grid of 6 row and 32 column
        //     },
        //     {   id:2,
        //         name:'30',
        //         amount:'20-100000',
        //         time:'tesing',
        //         type:'bjl',
        //         road:'a^a^i^c^i^a^i^e^e^a^g^a^e^c^e^e^e^a^e^a^e^e^a^a^e^f^a^i^i^b^a^a^b^a^i^a^e^a^e^e^a^a^a^i^a^a^e^i^e^e^e^e^a^g'
        
        //     },
        //     {   id:3,
        //         name:'vip33',
        //         amount:'20-100000',
        //         time:'tesing',
        //         type:'bjl',
        //         road:"e^a^a^a^a^a^a^e^a^b^e^a^e^a^e^a^e^a^i^e^e^a^a^e^b^e^a^a^b^a^a^a^a^e^a^a^e"
        //     },
        //     {   id:4,
        //         name:'66',
        //         amount:'20-100000',
        //         time:'tesing',
        //         type:'bjl',
        //         road:'a^a^i^c^i^a^'
        //     },
        // ]
        cc.systemEvent.on('message', this.getMessage)

        let route = "bjl.bjlHandler.doSelectGame";
        if(this.gtype=='lh'){
            route = 'lh.lhHandler.doSelectGame';
        }else if(this.gtype=='nn'){
            route = 'nn.nnHandler.doSelectGame';
        }
        const _user_data = cc.sys.localStorage.getItem('userinfo');
        const userInfo = JSON.parse(_user_data)
            if(userInfo && userInfo.token){
            const msg = { userId: userInfo.userId, token: userInfo.token,rType:this.gtype,roomId:'',player_type:userInfo.userType}
            send(msg,route,res=> {
                console.log(res,"dddddddddd")
               // uni.hideLoading();
                this.setRoomData(res);
            });
        }else{
            this.exit();
        }
     },

     setRoomData(dataStr){
        //console.log(JSON.stringify(dataStr))
        const that = this;
        if(dataStr.code!=101){
            return;
        }
        if(dataStr.data==''){
            this.roomList = [];
            return;
        }
        let roomList = dataStr.data.split("#");
        let newRoomList = [];
        for(let i in roomList){
                let roomStr = roomList[i].split(",");				
                let room = {};
                const isDt =  roomStr[18];

                if(this.userInfo.level=='5' && isDt=='1'){
                    continue;
                }
                if(this.userInfo.level!='5' && isDt=='2'){
                    continue;
                }
                room.desk = roomStr[0];
                room.xh = roomStr[1];
                room.cc = roomStr[7];
                room.name = roomStr[12];
                room.lsjg = roomStr[5];
                room.djs = roomStr[4];
                room.zt = roomStr[3];
                room.onlinenum =  roomStr[6];
                room.lsjg = room.lsjg.split("^")
                let zps = [];
                let nzps = [];
                let lds = [];			
                let result = '';
                let row = 0;
                let col = 0;
                let win = 0;
                let b_remain = 1;
                let p_remain = 1;
                let t_remain = 0;
                let ld_row = 0;
                let ld_col = 0;
                let z = 0;
                let x = 0;
                let h = 0;
                let zd = 0;
                let xd = 0;
                let isHave = 0;
                for(let n in room.lsjg){ 
                    let zp  = {};
                    let nzp  = {};
                    let ludan = {};
                    let lsjg = room.lsjg[n];
                    if(that.gtype=='bjl'){
                        if (lsjg == 'a' || lsjg == 'b' || lsjg == 'c'|| lsjg == 'd') {
                            z++;
                            
                            if(win==2){
                                t_remain = 0;//清空和连赢 Clears and winning streaks
                                col++;
                                row = 1;
                            }else if(win==1){
                                t_remain = 0;//清空和连赢 Clears and winning streaks
                                row++;
                            }
                            win = 1; 
                            zp.img= 'dl1_'+t_remain;
                            nzp.img= 'dl1_'+t_remain;
                            ludan.img = 'zp-100';
                            if(lsjg == 'b'){
                                zd++;
                              ludan.img = 'zp-101';
                            }else if(lsjg == 'c'){
                                xd++;
                              ludan.img = 'zp-110';
                            }else if(lsjg == 'd'){
                                zd++;
                                xd++;
                              ludan.img = 'zp-111';
                            }
                        }
                        if (lsjg == 'e' || lsjg == 'f' || lsjg == 'g' || lsjg == 'h') {
                            x++;
                            
                            if(win==1){
                                t_remain = 0;//清空和连赢
                                col++;
                                row = 1;
                            }else if(win==2){
                                t_remain = 0;//清空和连赢
                                row++;
                            }
                            win = 2;
                            zp.img = 'dl2_'+t_remain;
                            nzp.img= 'dl2_'+t_remain;
                            ludan.img = 'zp-200';
                            if(lsjg == 'f'){
                                zd++;
                              ludan.img = 'zp-201';
                            }else if(lsjg == 'g'){
                                xd++;
                              ludan.img = 'zp-210';
                            }else if(lsjg == 'h'){
                                zd++;
                                xd++;
                              ludan.img = 'zp-211';
                            }
                        }
                        if (lsjg == 'i' || lsjg == 'j'|| lsjg == 'k'|| lsjg == 'l') {
                            h++;
                            if(t_remain<3){
                                t_remain++;
                            }
                            if(win==2){//闲赢 free win
                                zp.img= 'dl2_'+t_remain;
                                nzp.img=  'dl2_'+t_remain;
                            }else{
                                win==1;
                                zp.img= 'dl1_'+t_remain;
                                nzp.img= 'dl1_'+t_remain;
                            }
                            ludan.img = 'zp-300';	
                            if(lsjg == 'j'){
                                zd++;
                              ludan.img = 'zp-301';
                            }else if(lsjg == 'k'){
                                xd++;
                              ludan.img = 'zp-310';
                            }else if(lsjg == 'l'){
                                zd++;
                                xd++;
                              ludan.img = 'zp-311';
                            }
                        }
                    }else if(that.gtype=='lh'){
                        if (lsjg == 'a' ) {
                            z++;
                            
                            if(win==2){
                                t_remain = 0;//清空和连赢
                                col++;
                                row = 1;
                            }else if(win==1){
                                t_remain = 0;//清空和连赢
                                row++;
                            }
                            win = 1; 
                            zp.img= 'dl1_'+t_remain;
                            nzp.img= 'dl1_'+t_remain;
                            ludan.img = 'ludan_a';
                        }
                        if (lsjg == 'c') {
                            x++;
                            
                            if(win==1){
                                t_remain = 0;//清空和连赢
                                col++;
                                row = 1;
                            }else if(win==2){
                                t_remain = 0;//清空和连赢
                                row++;
                            }
                            win = 2;
                            zp.img = 'dl2_'+t_remain;
                            nzp.img=  'dl2_'+t_remain;
                            ludan.img = 'ludan_c';
                        }
                        if (lsjg == 'b') {
                            h++;
                            if(t_remain<3){
                                t_remain++;
                            }
                            if(win==2){//闲赢
                                zp.img= 'dl2_'+t_remain;
                                nzp.img=  'dl2_'+t_remain;
                            }else{
                                win==1;
                                zp.img= 'dl1_'+t_remain;
                                nzp.img= 'dl1_'+t_remain;
                            }
                            ludan.img = 'ludan_b';	

                        }
                    }else if(that.gtype=='nn'){
                        
                        //cblb-000,cfll-100,ljll-100,lelg-101,------
                        const ludans = room.lsjg;
                        let zs = [];
                        let x1s = [];
                        let x2s = [];
                        let x3s = [];
                         z = 0;
                         x = 0;
                         h = 0;
                        for(let n in ludans){
                            let zp  = {};
                            let lsjg =ludans[n];
                            if(lsjg==''){
                                continue;
                            }
                            let zStatus = '1';
                            const winStr = lsjg[5]+''+lsjg[6]+''+lsjg[7];
                            
                            if(lsjg[5]=='1'){
                                z++;
                            }
                            if(lsjg[6]=='1'){
                                x++;
                            }
                            if(lsjg[7]=='1'){
                                h++;
                            }
                            if(winStr=="111"){
                                zStatus = '0'
                            }
                            const z_c = {'result':setNndata(lsjg[0]),'status':zStatus};
                            const x1 = {'result':setNndata(lsjg[1]),'status':lsjg[5]};
                            const x2 = {'result':setNndata(lsjg[2]),'status':lsjg[6]};
                            const x3 ={'result':setNndata(lsjg[3]),'status':lsjg[7]};
                            zs.push(z_c);
                            x1s.push(x1);
                            x2s.push(x2);
                            x3s.push(x3);
                            
                        }
                        room.nnjgzj = [z,x,h,zd,xd];
                        room.zs = zs.splice(-9, 9);
                        room.x1s = x1s.splice(-9, 9);
                        room.x2s = x2s.splice(-9, 9);
                        room.x3s = x3s.splice(-9, 9);
                    }
                    
                    
                    
                    if(lsjg == 'z' ){
                        ludan.img = 'ludan_f';
                    }
                    if(row==0){
                        row=1;
                    }
                    if(row==1){
                      isHave = 0;
                    }
                            
                            
                    if(isHave>0){
                      let zpStr = zp.img+'';
                      if(zpStr.endsWith("0")){
                        isHave ++;
                      }
                            
                    }
                    
                      for(let z in zps){
                          if(zps[z].row==row && zps[z].col==col && t_remain==0){ //下面有露珠往右走
                               isHave=isHave==0?1:isHave;
                          }
                      }
                      if(isHave>0){
                         zp.row = row-isHave;
                         zp.col = col+isHave;
                      }else{
                        if(row>6){
                          zp.row = row-(row-6);
                          zp.col = col+(row-6);
                        }else{
                          zp.row = row;
                          zp.col = col;
                        }
                      }
                    nzp.row = row;
                    nzp.col = col;
                    if(ld_row%6==0){
                        ld_col++;
                        ld_row=0;
                    }
                    ld_row++;
                    ludan.row = ld_row;
                    ludan.col = ld_col;
                    lds.push(ludan);
                    if(win>0){
                        zps.push(zp);
                        nzps.push(nzp);
                    }
                    
                }			
                room.zps = zps;
                room.nzps = nzps;
                room.lds = lds;
            
                const lzs= getLz(room.nzps);
                
                
                let xqsArr = lzs.xqs;
                let xysArr = lzs.xys;
                let dysArr = lzs.dys;
                room.dys = dysArr;
                room.xys = xysArr;
                room.xqs = xqsArr; 
                room.jgzj = [z,x,h,zd,xd];
                newRoomList.push(room);
            //console.log("lzs---"+JSON.stringify(newRoomList));
            that.roomList = newRoomList;
            that.roomDataComponent.setData(that.roomList)
        }
    },

     
     getMessage(msg){
        		//console.log(JSON.stringify(msg)+'--------')	
     },
     getUserInfo(){
        const _user_data = cc.sys.localStorage.getItem('userinfo');
        const userInfo = JSON.parse(_user_data)
            if(userInfo && userInfo.token){
            this.userInfo = userInfo;
        }else{
            this.exit();
        }
        
    },

    exit(){
        cc.sys.localStorage.setItem("userinfo","");
        disconnectServer()
        cc.director.loadScene("Log");
    },

    noticeShow(){
        const that = this;
        this.showNotice = true;
        const userInfo = this.userInfo;
        const msg = {roomId:'',userId: userInfo.userId, token: userInfo.token,rType:that.gtype,player_type:userInfo.userType}
        send(msg,'connector.entryHandler.getBulletin',res=> {
           // console.log(res,"connector.entryHandler.getBulletin")
            if( res.data.data){
                const noticeArr = res.data.data;
                for(let i in noticeArr){
                    if(noticeArr[i].address=='2'){
                        that.noticeContent = noticeArr[i].content
                    }else if(noticeArr[i].address=='1'){
                        Global.noticeContentLabel = noticeArr[i].content;
                        that.noticePm = noticeArr[i].content;
                        
                    }
                }
                
            }
        });
    },

    start () {
        this.getUserInfo()
        this.noticeShow()
        // if (this.roomDataComponent && this.roomList.length > 0) {
        //     this.roomDataComponent.setData(this.roomList)
        // }
    },

    // update (dt) {},
});
