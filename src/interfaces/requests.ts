export interface IAddressRequestQuery {
    tag: string;
    isActive: boolean;
    from: string;
    to: string;
    distance: number
}

export interface IAreaReportParams {
    guid: string;
}