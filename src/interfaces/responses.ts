import { IAddress } from "./address";

export interface ICitiesByTagResponse {
    cities: IAddress[];
}

export interface IDistanceResponse {
    from: IAddress;
    to: IAddress;
    unit: string;
    distance: number;
}

export interface IAreaReportGenerationResponse {
    resultsUrl: string;
}