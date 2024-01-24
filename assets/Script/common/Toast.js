const Toast = cc.Class({
    extends: cc.Component,

    properties: {
        contentLabel:{
            default:null,
            type:cc.Label
        },
        // contentWdget:{
        //     default:null,
        //     type:cc.Widget
        // },

    _timer:null,
    _isShowing:false

    },

    // show(content,time = 1){
    //     console.log(content,"leeeeeeeeeeeeeeeee")
    //     if (!this._isShowing) {
    //         this._isShowing = true; // Corrected line
    //         this.node.active = true;
    //         this.node.zIndex = true
    //         this.contentLabel.string = content;
    //         console.log(this.contentLabel.string,this._isShowing)
    //         // this.contentWdget.top = -100;
    //         // console.log(this.contentWdget.top)
    //         // cc.tween(this.contentWdget).to(0.5, { top: 325 }).start();
    //         this._timer = setTimeout(()=> {
    //             this.node.active = false;
    //             this._isShowing = false;
    //         }, time*1000);
    //     } else {
    //         this.contentLabel.string = content;
    //         clearTimeout(this._timer);
    //         this._timer = setTimeout(()=> {
    //             this.node.active = false;
    //             this._isShowing = false;
    //         }, time*1000);
    //     }
    // }

    show(content, time = 1) {
        console.log(content, "leeeeeeeeeeeeeeeee");
    
        if (!this._isShowing) {
            this._isShowing = true;
    
            // Set ZIndex
            this.node.zIndex = 1; // Adjust the ZIndex value as needed
    
            // Set initial position and opacity for animation
            this.node.y = 0;  // Center of the screen
            this.node.opacity = 0;
    
            // Activate the node
            this.node.active = true;
    
            // Set the content
            this.contentLabel.string = content;
    
            // Use cc.tween for animation
            cc.tween(this.node)
                .to(0.5, { y: 50, opacity: 200 })  // Adjust the final y position as needed
                .start();
    
            this._timer = setTimeout(() => {
                // Fade out and deactivate the node after the specified time
                cc.tween(this.node)
                    .to(0.5, { y: 0, opacity: 0 })
                    .call(() => {
                        this.node.active = false;
                        this._isShowing = false;
                    })
                    .start();
            }, time * 1000);
        } else {
            // If already showing, update content and reset the timer
            this.contentLabel.string = content;
            clearTimeout(this._timer);
            this._timer = setTimeout(() => {
                cc.tween(this.node)
                    .to(0.5, { y: 0, opacity: 0 })
                    .call(() => {
                        this.node.active = false;
                        this._isShowing = false;
                    })
                    .start();
            }, time * 1000);
        }
    }
    
    

})

module.exports = Toast