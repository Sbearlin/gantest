import { IAddress, IAreaReport } from "../interfaces/address";
import { addresses } from "./addresses";

// This functionality is obviously not correctly implemented here, as it is a demo project.
// Ideally the /area endpoint should put the task into some background processing task, so the API is not affected.
// This could be done by /area puts in the processing in a queue, and then a seperate Function App
// In this solution it is loaded into memory, but could also be turned into json files in a tmp folder
export var areaReports : IAreaReport[] = []; 

export const generateAreaReport = async (
  fromAddress: IAddress,
  distance: number,
  areaReport: IAreaReport
): Promise<void> => {
  // Add to area reports for processing
  const reportArrayPosition = areaReports.push(areaReport);

  const addressesInArea: IAddress[] = [];
  // I'm not sure if there's a better way to approach this problem, as this is very ineffecient the bigger the dataset gets
  // A possible solution would be to make a box of distance x distance with resulting Lat + Long values. From that dataset, we could do the below calculation
  addresses.forEach((address) => {
    // Exclude from address
    if (address.guid != fromAddress.guid) {
      const calculatedDistance: number = calculateDistance(fromAddress, address);
      if (calculatedDistance < distance) {
        addressesInArea.push(address);
      }
    }
  });

  if(addressesInArea.length > 0){
    areaReport.cities = addressesInArea;
  }
  areaReport.processing = false;
  
  areaReports[reportArrayPosition] = areaReport;
};

// Completely stolen from https://stackoverflow.com/a/18883819. I'm not the biggest math expert with radius calculations. Another solution would be to use the haversine-distance library.
// Criteria for import:
// Is the radian consistent with the rounding of the assignment
// Is the function returning reasonable results by supplying a subset of test data
export const calculateDistance = (from: IAddress, to: IAddress): number => {
  const R: number = 6371; // km
  const dLat: number = toRad(to.latitude - from.latitude);
  const dLon: number = toRad(to.longitude - from.longitude);
  const lat1: number = toRad(from.latitude);
  const lat2: number = toRad(to.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  // We do *100 and /100 to create 2 decimal places
  // Other solution would be to use toFixed(2). However this returns a string. It can be cast as a number, but really doesn't make sence
  const distanceRounded = Math.round(distance * 100) / 100;
  return distanceRounded;
};

const toRad = (value: number): number => {
  return (value * Math.PI) / 180;
};
