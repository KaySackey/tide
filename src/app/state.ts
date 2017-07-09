import * as mobx from "mobx";
import {default as remotedev} from 'mobx-remotedev/lib/dev';
import {PageStateStore} from "./page_state";
import {observable} from "mobx";


type URL = string;

export interface ITideMessage {
    expiry: number;
    message: string;
    kind: string;
}

export interface ITideUser {
    pk: number;
    username: string;
    avatar: {
        url: URL,
        size: string
    };
    is_moderator;
    is_staff;
    is_authenticated;
    _lookup: URL;
}

export interface ITideState{
    messages: mobx.IObservableArray<ITideMessage>;
    user: ITideUser;
    page: PageStateStore;
}

export function create() {
    const store = observable({
        messages: mobx.observable.array([]) as mobx.IObservableArray<ITideMessage>,
        user: {} as ITideUser,
        page: new PageStateStore()
    });

    const config = {
        name: "Tide",
        onlyActions: false,
        global: false
    };

    return remotedev(store, config)
}

export const state = create();