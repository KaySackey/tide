import React, {PropTypes} from "react";

/**
 * @class Link
 */
export class Link extends React.Component{
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.props = props;
    }

    /**
     * @returns {Router}
     */
    get router(){
        return this.context.router;
    }

    /**
     * Returns the URL created by the router.
     * @returns {string}
     */
    get url(){
        // Undocumented: You shouldn't use this
        // May take it out b/c React complains about passing unused props sometimes.
        let {to, params, ...extra} = this.props;

        if(to.includes("/")){
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

        if(to.includes("/")){
            window.location = to;
        }

        this.router.go(this.url);
    }

    render(){
        // todo: have active class onlyActiveOnIndex / activeClassName
        let {to, params, children, activeClassName, onlyActiveOnIndex, ...extra} = this.props;
        
        return (
          <a {...extra} href={this.url} onClick={this.handleClick}>{this.props.children}</a>
        )
    }
}
Link.contextTypes = {
    // Context provided by router
    router: React.PropTypes.object
};
Link.propTypes = {
    // Context provided by router
    to: PropTypes.string.isRequired,
    params: PropTypes.object,
    children: PropTypes.node.isRequired,
    activeClassName: PropTypes.string,
    onlyActiveOnIndex: PropTypes.bool
};
Link.defaultProps = {
    params: {}
};

export class IndexLink extends Link{
    // todo: implement
}