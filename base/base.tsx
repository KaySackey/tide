import {observer} from "mobx-react";
import * as React from "react";
import {Component as ReactComponent, ComponentClass, ValidationMap} from "react";


/**
 * @class ReactComponent
 * @property props
 * @property setState
 * @property props
 * @property context
 * @property refs
 * @property state
 * @property forceUpdate
 *
 * Observer
 * @class MobxObserver
 */


type S = any;
type ReactNode = any;
type ReactInstance = any;
//
// // @observer
// interface  MobxObserver<P>  {
//     propTypes?: ValidationMap<P>;
//     contextTypes?: ValidationMap<any>;
//     childContextTypes?: ValidationMap<any>;
//     defaultProps?: Partial<P>;
//     displayName?: string;
//
//     setState<K extends keyof S>(f: (prevState: S, props: P) => Pick<S, K>, callback?: () => any): void;
//     setState<K extends keyof S>(state: Pick<S, K>, callback?: () => any): void;
//     forceUpdate(callBack?: () => any): void;
//     render(): JSX.Element | null | false;
//
//     // React.Props<T> is now deprecated, which means that the `children`
//     // property is not available on `P` by default, even though you can
//     // always pass children as variadic arguments to `createElement`.
//     // In the future, if we can define its call signature conditionally
//     // on the existence of `children` in `P`, then we should remove this.
//     props: Readonly<{ children?: ReactNode }> & Readonly<P>;
//     state: Readonly<S>;
//     context: any;
//     refs: {
//         [key: string]: ReactInstance
//     };
// }

@observer
export class MobxObserver extends ReactComponent<any, any>{
    render() : any{
        return null;
    }
}
//
// MobxObserver = observer(MobxObserver);
//
// export const MobxObserver = observer(ReactComponent) as any as MobxObserver<any>;