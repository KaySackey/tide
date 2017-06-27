import {observable} from "mobx";
import {User} from "tide/model/user";
import {update} from "serializr";
import {is_empty} from "tide/utils/object";
/**
 * @class
 */
export class GeneralStore {
    @observable user = new User();

    initialize(data) {
        if ( !is_empty(data) ) {
            // what is context.target?
            update(this.user, data.user);
        }
    }
}

export const general_store = new GeneralStore();