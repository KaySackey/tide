import {serializable, list, object, identifier} from "serializr";
import {observable, computed} from "mobx";
import {simple, list_of} from "tide/model/schema";

export class Avatar {
    @serializable url;
    @serializable size;
}

const following_list = simple({
    communities: list(),
    users      : list()
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
    @serializable(list()) @observable moderates = [];

    @serializable @observable _lookup;

    @computed get is_anonymous() {
        return this.is_authenticated !== true;
    }
}