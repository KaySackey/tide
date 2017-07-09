import {Route} from "tide/router/route";

export declare interface ExistingApplications{

}

export interface TideSettings {
    routes?: any,
    apps?: any[], // will be UserAppClass
    default_layout? : any ///todo: implement instead of default app
}

type RouteMembers = Route | Route[];
export type RouteList = RouteMembers[];