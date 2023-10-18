import { Request, Response } from "express";

import { addresses } from "../data/addresses";
import { IAddressRequestQuery } from "../interfaces/requests";
import { IAddress } from "../interfaces/address";
import { IDistanceResponse } from "../interfaces/responses";

export default class Cities {
  public getCitiesByTag = (
    req: Request<{}, {}, {}, IAddressRequestQuery>,
    res: Response
  ) => {
    const { tag, isActive } = req.query;

    // Check if isActive and tag is set
    if (!isActive || !tag) {
      res
        .status(400)
        .send("Missing params. Required params are IsActive and tag");
      return;
    }

    // using .filter to search for the elements where conditions are met, this will take O(n) time to run through,
    // so ideally preprocessing the data/having it in a DB with indexes would be best.
    // a.tags.indexOf might be able to be optimized better, haven't benchmarked it
    const filteredAdresses = addresses.filter(
      (a) => a.isActive == true && a.tags.indexOf(tag) > 0
    );

    res.send(filteredAdresses);
  };

  public getDistance = (
    req: Request<{}, {}, {}, IAddressRequestQuery>,
    res: Response
  ) => {
    const { from, to } = req.query;

    // Check if from and to is set
    if (!from || !to) {
      res.status(400).send("Missing params. Required params are from and to");
      return;
    }

    const fromAddress = addresses.find((a) => a.guid == from);
    const toAddress = addresses.find((a) => a.guid == to);

    if (!fromAddress || !toAddress) {
      res.status(400).send("Guids for fromAddress or toAddress are invalid");
      return;
    }

    const distance: number = this.calculateDistance(fromAddress, toAddress);

    const distanceResponse: IDistanceResponse = {
      from: fromAddress,
      to: toAddress,
      unit: "km",
      distance: distance,
    };

    res.send(distanceResponse);
  };

  public getArea = (
    req: Request<{}, {}, {}, IAddressRequestQuery>,
    res: Response
  ) => {
    const { from, distance } = req.query;

    // Check if from and to is set
    if (!from || !distance) {
      res
        .status(400)
        .send("Missing params. Required params are from and distance");
      return;
    }

    const fromAddress = addresses.find((a) => a.guid == from);

    if (!fromAddress) {
      res.status(400).send("Guid for fromAddress is invalid");
      return;
    }

    const addressesInArea: IAddress[] = [];
    // I'm not sure if there's a better way to approach this problem, as this is very ineffecient the bigger the dataset gets
    // A possible solution would be to make a box of distance x distance with resulting Lat + Long values. From that dataset, we could do the below calculation
    addresses.forEach((address) => {
      // Exclude from address
      if (address.guid != from) {
        const distance: number = this.calculateDistance(fromAddress, address);
        if(distance < 250){
            addressesInArea.push(address);
        }
      }
    });

    res.send(addressesInArea);
  };

  public getAreaResult = (
    req: Request<{}, {}, {}, IAddressRequestQuery>,
    res: Response
  ) => {
    
  }

  // Completely stolen from https://stackoverflow.com/a/18883819. I'm not the biggest math expert with radius calculations. Another solution would be to use the haversine-distance library.
  // Criteria for import:
  // Is the radian consistent with the rounding of the assignment
  // Is the function returning reasonable results by supplying a subset of test data
  private calculateDistance(from: IAddress, to: IAddress): number {
    const R: number = 6371; // km
    const dLat: number = this.toRad(to.latitude - from.latitude);
    const dLon: number = this.toRad(to.longitude - from.longitude);
    const lat1: number = this.toRad(from.latitude);
    const lat2: number = this.toRad(to.latitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    // We do *100 and /100 to create 2 decimal places
    // Other solution would be to use toFixed(2). However this returns a string. It can be cast as a number, but really doesn't make sence
    const distanceRounded = Math.round(distance * 100) / 100;
    return distanceRounded;
  }

  private toRad(value: number): number {
    return (value * Math.PI) / 180;
  }
}
