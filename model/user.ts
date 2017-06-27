import {computed, observable} from "mobx";
import {identifier, list, object, serializable} from "serializr";
import {jsonObject, simple} from "./schema";


export class Avatar {
    @serializable url;
    @serializable size;
}

const following_list = simple({
    communities: list(jsonObject()),
    users: list(jsonObject())
});


export class User {
    @serializable(identifier()) @observable id;
    @serializable @observable username;
    @serializable @observable token;
    @serializable(object(Avatar)) @observable avatar = new Avatar();
    @serializable @observable is_authenticated = false;
    @serializable @observable is_moderator = false;
    @serializable @observable is_staff = false;
    @serializable(object(following_list)) @observable following;
    @serializable(list(jsonObject())) @observable moderates = [];

    @serializable @observable _lookup;

    @computed
    get is_anonymous() {
        return this.is_authenticated !== true;
    }
}