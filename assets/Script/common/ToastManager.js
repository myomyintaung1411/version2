// ToastManager.js
const Toast = require('Toast')
const eventManager = require('EventManager');

const ToastManager = cc.Class({
    extends: cc.Component,

    properties: {
        toastPrefab: {
            default: null,
            type: cc.Prefab,
        },
    },

    statics: {
        instance: null,
    },

    onLoad() {
        // Ensure there's only one instance of ToastManager
        if (!cc.isValid(ToastManager.instance)) {
            ToastManager.instance = this;
        } else {
            cc.error("Duplicate ToastManager instance detected. Destroying the new instance.");
            this.node.destroy();
        }

            // Listen for the showToast event
    eventManager.on('showToast', this.showToast, this);

    },

    showToast(message,time) {
        console.log("leeeeeeeeeeeeeeeeeeeeeeee",message)
        if (this.toastPrefab) {
            const toastNode = cc.instantiate(this.toastPrefab);
            this.node.addChild(toastNode);

            const toastScript = toastNode.getComponent('Toast');

            if (toastScript) {
                toastScript.show(message,time);
            }
        }
    },
});
module.exports = ToastManager
