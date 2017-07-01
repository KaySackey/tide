import {observable} from "mobx";


export class TideMessage {
    expiry: number;
    message: string;
    kind: string;

    constructor(kind = "", message = "", expiry = -1) {
        this.expiry = expiry;
        this.message = message;
        this.kind = kind;
    }
}

export class TideMessageStore {
    @observable _messages : Array<TideMessage> = [];


    /**
     * Flash a message onto the screen. Requires processing via the user-given layout
     * @param {string} kind - what kind of message is this
     * @param {string} message  - content
     * @param {number} expiry - number in ms to wait before expiring this message
     */
    add(kind, message, expiry) {
        this._messages.push(new TideMessage(kind, message, expiry))
    }


    flash(message) {
        this.add("flash", message, 3000)
    }
}

export const message_store = new TideMessageStore();