import { PriceClass } from "@aws-cdk/aws-cloudfront";

export enum EdgeLocation {
  // Technical names
  PRICE_CLASS_100 = 1,
  PRICE_CLASS_200 = 3,
  PRICE_CLASS_ALL = 7,

  // CloudFront console names
  USCanadaEurope = 1,
  AsiaMiddleEastAfrica = 3,
  All = 7,

  // Business regions
  NA = 1, // US and Canada
  LATAM = 7, // Latin America
  EMEA = 3, // Europe, Middle East and Africa
  APAC = 7 // Asia and Pacific Region
}

export const getPriceClass = (coverage: EdgeLocation) => {
  switch (coverage) {
    case 3:
      return PriceClass.PRICE_CLASS_ALL;
    case 2:
      return PriceClass.PRICE_CLASS_200;
    case 1:
    default:
      return PriceClass.PRICE_CLASS_100;
  }
};
