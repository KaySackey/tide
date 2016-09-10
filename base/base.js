import React, {Component as ReactComponent} from "react";
import {computed} from "mobx";
import {observer} from "mobx-react";
import {use, bind_all_react_component_methods} from "tide/utils";
import {BasicEventHandler} from "tide/base/events";

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
 * @class MobxObserver
 * @extends ReactComponent
 */
export const MobxObserver = observer(ReactComponent);