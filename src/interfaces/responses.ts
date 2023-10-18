import { IAddress } from "./address";

export interface IDistanceResponse {
    from: IAddress;
    to: IAddress;
    unit: string;
    distance: number;
}