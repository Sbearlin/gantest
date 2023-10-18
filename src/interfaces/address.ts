/**
 * Define the interface for Address Model
 */

export interface IAddress {
    guid: string;
    isActive: boolean;
    address: string;
    latitude: number;
    longitude: number;
    tags: string[]
}