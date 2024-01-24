// Learn cc.Class:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const RoomData = cc.Class({
    extends: cc.Component,
    
    properties: {
        roomPrefab:{
            default:null,
            type:cc.Prefab
        },
        mainScrollView:{
            default:null,
            type:cc.ScrollView
        },

        roadmapItem: [],

    },

    start () {

    },

    setData(data){
        console.log(data, data.length,"setData ---------------->")
      this.roadmapItem = data
      console.log(this.roadmapItem,this.roadmapItem.length,"dsafsdfasdf")
      for (let data = 0; data < this.roadmapItem.length; data++) {
        let item = cc.instantiate(this.roomPrefab);
        //console.log(item,"item")

        const headerNode = item.getChildByName('Header');
        // item.createGrid(this.roadmapItem[data])

        const singleRoomComponent = item.getComponent('SingleRoom');

        if (singleRoomComponent) {
            singleRoomComponent.createGrid(this.roadmapItem[data]);
        }

        if (!headerNode) {
            cc.error("Header node not found in the prefab.");
            continue;
        }
        
        const roomNameLabel = headerNode.getChildByName('Number').getChildByName('Name');
        const AmountLabel = headerNode.getChildByName('Amount')
        const timerLabel = headerNode.getChildByName('Timer')

        if (roomNameLabel && AmountLabel && timerLabel) {
            const labelComponent = roomNameLabel.getComponent(cc.Label);
            const labelAmount = AmountLabel.getComponent(cc.Label)
            const labelTime = timerLabel.getComponent(cc.Label)
            // Set the text using the 'name' property of the current roadmapItem entry
            if (labelComponent) {
                labelComponent.string = this.roadmapItem[data].name;
                labelAmount.string = this.roadmapItem[data].amount;
                labelTime.string = this.roadmapItem[data].time;
            }
        }
         
        this.mainScrollView.content.addChild(item)
    }
    }

    // update (dt) {},
});

module.exports = RoomData
