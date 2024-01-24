// Learn cc.Class:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const SingleRoom = cc.Class({
    extends: cc.Component,

    properties: {

        gridPrefab:{
            default:null,
            type:cc.Prefab
        },
        scrollView:{
            default:null,
            type:cc.ScrollView
        },
        numRows:6,
        numCols:40
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {

     },

     createGrid(data) {
        const content = this.scrollView.content;
        for (let row = 0; row < this.numRows; row++) {
            for (let col = 0; col < this.numCols; col++) {
                let gridNode = cc.instantiate(this.gridPrefab);
                
                content.addChild(gridNode)
            }
        }
     },


    

    //  createGrid(data) {
    //     console.log(data,"from singleRoom ***************")
    //     const content = this.scrollView.content;

    //     for (let row = 0; row < this.numRows; row++) {
    //         const rowNode = new cc.Node();
    //         rowNode.addComponent(cc.Widget);
    //         rowNode.width = content.width;

    //         for (let col = 0; col < this.numCols; col++) {
    //             const gridNode = cc.instantiate(this.gridPrefab);
    //             const graphics = gridNode.addComponent(cc.Graphics);

    //             // Customize the border style
    //             graphics.lineWidth = 1;
    //             graphics.strokeColor = cc.color(57, 61, 41);

    //             // Calculate the size of each grid cell
    //             const cellWidth = content.width / this.numCols;
    //             const cellHeight = content.height / this.numRows;

    //             // Position each grid cell
    //             gridNode.x = col * cellWidth + cellWidth / 2;
    //             gridNode.y = -row * cellHeight - cellHeight / 2;

    //             // Draw the border
    //             graphics.rect(-cellWidth / 2, -cellHeight / 2, cellWidth, cellHeight);
    //             graphics.stroke();

    //             // Add the grid node to the row node
    //             rowNode.addChild(gridNode);
    //         }

    //         // Position each row
    //         rowNode.y = -row * (content.height / this.numRows);

    //         // Add the row node to the content
    //         content.addChild(rowNode);
    //     }

    //     // Adjust content height to fit all rows
    //     content.height = this.numRows * (content.height / this.numRows);
    // },

    start () {

    },

    // update (dt) {},
});

module.exports = SingleRoom