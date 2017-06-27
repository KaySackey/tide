import PropTypes from 'prop-types';
import * as React from "react";


export class Link extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.props = props;
    }

    static contextTypes = {
        // Context provided by router
        router: PropTypes.object
    };
    static propTypes = {
        // Context provided by router
        to: PropTypes.string.isRequired,
        params: PropTypes.object,
        children: PropTypes.node.isRequired,
        activeClassName: PropTypes.string,
        onlyActiveOnIndex: PropTypes.bool
    };
    static defaultProps = {
        params: {}
    };

    props: {
        to: string,
        params?: any,
        children: any,
        activeClassName?: string,
        onlyActiveOnIndex?: boolean,
        [indexer: string]: any
    };

    /**
     * @returns {Router}
     */
    get router() {
        return this.context.router;
    }

    /**
     * Returns the URL created by the router.
     * @returns {string}
     */
    get url() {
        // Undocumented: You shouldn't use this
        // May take it out b/c React complains about passing unused props sometimes.
        let {to, params, ...extra} = this.props;

        if (to.includes("/")) {
            return to;
        }

        params = params || extra;
        return this.router.path(to, params);
    }

    /**
     * Use router ot transition to a new URL.
     * Stop default browser behavior.
     *
     * @param {Event} e
     */
    handleClick(e) {
        e.preventDefault();
        e.stopPropagation();

        let {to} = this.props;

        if (to.includes("/")) {
            (window as any).location = to;
        }

        this.router.go(this.url);
    }

    render() {
        // todo: have active class onlyActiveOnIndex / activeClassName
        // Extra is added so we can just send props to anchor tag directly
        // probably better to make anchorProps?
        let {to, params, children, activeClassName, onlyActiveOnIndex, ...extra} = this.props;

        return (
            <a {...extra} href={this.url} onClick={this.handleClick}>{children}</a>
        )
    }
}

export class IndexLink extends Link {
    // todo: implement
}