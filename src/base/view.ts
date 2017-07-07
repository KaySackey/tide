import {RenderingContext} from "./context";

export class View extends RenderingContext {
    static displayName = "Tide.View";

    disposer? = null;

    componentWillUnmount(){
        if(this.disposer){
            this.disposer();
        }
    }
}