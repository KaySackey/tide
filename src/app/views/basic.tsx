import * as React from "react";
import {IndexLink} from "tide/router";

export class InternalError extends React.Component {
    static displayName = "TideInternalError";

    render() {
        return (
            <div>
                <h1>Tide: Internal Error</h1>
                <div>The current view could not be displayed. Please contact the admin.</div>
                <div>Go back to the <IndexLink to="/">home page</IndexLink></div>
            </div>
        )
    }
}

export class NotFound extends React.Component {
    static displayName = "Tide.NotFound";

    render() {
        let code = `route("/{path*}", my_controller.not_found, "error_404")`;

        return (
            <div>
                <h1>Tide: Page Not Found</h1>
                <div>You are seeing this because you haven't yet configured a real 404 page</div>
                <div>Configure one by adding route {code} to one of your applications.</div>
                <div>Go back to the <IndexLink to="/">home page</IndexLink></div>
            </div>
        )
    }
}

export class BasicLayout extends React.Component {
    render() {
        return (
            <div>{this.props.children}</div>
        )
    }
}