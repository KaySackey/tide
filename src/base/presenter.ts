import {RenderingContext} from "./context";

export class Presenter extends RenderingContext {
    static displayName = "Tide.Presenter";

    disposer? = null;

    getChildContext() : any {
        return {
            parent: this
        };
    }

    componentWillUnmount(){
        if(this.disposer){
            this.disposer();
        }
    }
}