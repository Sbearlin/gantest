import { Request, Response } from "express";

import { addresses } from "../data/addresses";
import {
  IAddressRequestQuery,
  IAreaReportParams,
} from "../interfaces/requests";
import { IAddress, IAreaReport } from "../interfaces/address";
import {
  IAreaReportGenerationResponse,
  ICitiesByTagResponse,
  IDistanceResponse,
} from "../interfaces/responses";
import {
  areaReports,
  calculateDistance,
  generateAreaReport,
} from "../data/areaAddressProcessing";

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

    const response : ICitiesByTagResponse = {
      cities: filteredAdresses
    };

    res.send(response);
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

    const distance: number = calculateDistance(fromAddress, toAddress);

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

    const reportGuid: string = "2152f96f-50c7-4d76-9e18-f7033bd14428"; // This is hardcoded for the challenge, should be generated with a UUID generator
    const areaReport: IAreaReport = {
      guid: reportGuid,
      processing: true,
    };
    generateAreaReport(fromAddress, distance, areaReport); // generateAreaReport is a async function, and we will not wait for it to complete

    const responseBody: IAreaReportGenerationResponse = {
      resultsUrl: `http://127.0.0.1:8080/area-result/${reportGuid}`, // This is hardcoded, but the domain could be controlled by i.e. an env variable
    };
    res.status(202).send(responseBody);
  };

  public getAreaResult = (req: Request<IAreaReportParams>, res: Response) => {
    const { guid } = req.params;
    console.log("Guid", guid);
    if (!guid) {
      res.status(400).send("Missing url params. Required params are guid");
      return;
    }

    const report = areaReports.find((ar) => ar.guid == guid);
    console.log("Report found", report);
    if (!report) {
      res.status(400).send("No report with that guid");
      return;
    }

    // If processing is still true, we answer back 202. Supplying the report object to give transpearency of the process for API consumers
    if (report.processing) {
      res.status(202).send(report);
      return;
    }

    res.send(report);
  };

  public getAllCities = (req: Request, res: Response) => {
    if(!addresses || addresses.length == 0){
      res.status(500).send("No address data available");
      return;
    }
    // Adding array start marker
    res.write('[');
    const addressesLength = addresses.length;
    addresses.forEach((address, index) => {
      let streamString = JSON.stringify(address);
      if(index != addressesLength){
        streamString += ','; // Adding , in the end for separation of objects for all objects except for the last one
      }
      res.write(streamString); 
    });
    // Adding array end marker
    res.write(']');
    res.end();
  };
}
