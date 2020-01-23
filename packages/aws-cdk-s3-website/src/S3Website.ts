import * as acm from "@aws-cdk/aws-certificatemanager";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as route53 from "@aws-cdk/aws-route53";
import * as s3 from "@aws-cdk/aws-s3";
import * as s3deployment from "@aws-cdk/aws-s3-deployment";
import * as cdk from "@aws-cdk/core";
import {
  StaticWebsite,
  StaticWebsiteProps
} from "@rnbw/aws-cdk-static-website";

export type S3WebsiteProps = Omit<StaticWebsiteProps, "sources"> & {
  /**
   * Name of the bucket containing the website files. When not specified, the
   * domain name is used instead.
   */
  bucketName?: string;
  /**
   * The default removal policy is RETAIN, which means that `cdk destroy` will
   * not attempt to delete the new bucket, and it will remain in your account
   * until manually deleted. By setting the policy to DESTROY, `cdk destroy`
   * will attempt to delete the bucket, but will error if the bucket is not
   * empty. Default is RETAIN.
   */
  bucketRemovalPolicy?: cdk.RemovalPolicy;
  /**
   * Path containing the website files to be uploaded to the S3 bucket.
   */
  sourcePath: string;
};

/**
 * Represents a website hosted in an S3 bucket.
 */
export class S3Website extends cdk.Construct {
  private readonly _certificate: acm.ICertificate;
  private readonly _distribution: cloudfront.IDistribution;
  private readonly _dnsDomainRecord: route53.IRecordSet;
  private readonly _bucket: s3.IBucket;

  constructor(scope: cdk.Construct, id: string, props: S3WebsiteProps) {
    super(scope, id);

    const {
      bucketName,
      bucketRemovalPolicy = cdk.RemovalPolicy.RETAIN,
      sourcePath,
      ...websiteProps
    } = props;

    //
    // S3 Bucket
    //
    const bucket = new s3.Bucket(this, "S3WebsiteBucket", {
      bucketName: bucketName || websiteProps.domain,
      websiteIndexDocument: "index.html",
      publicReadAccess: true,
      removalPolicy: bucketRemovalPolicy
    });

    this._bucket = bucket;

    //
    // Website
    //
    const website = new StaticWebsite(this, "S3Website", {
      ...websiteProps,
      sources: [
        {
          s3OriginSource: {
            s3BucketSource: bucket
          },
          behaviors: [{ isDefaultBehavior: true }]
        }
      ]
    });

    //
    // S3 Deployment and CloudFront cache invalidation
    //
    new s3deployment.BucketDeployment(this, "S3WebsiteDeployment", {
      sources: [s3deployment.Source.asset(sourcePath)],
      destinationBucket: bucket,
      distribution: website.distribution,
      distributionPaths: ["/*"]
    });

    this._certificate = website.certificate;
    this._distribution = website.distribution;
    this._dnsDomainRecord = website.dnsDomainRecord;
  }

  get bucket() {
    return this._bucket;
  }

  get certificate() {
    return this._certificate;
  }

  get distribution() {
    return this._distribution;
  }

  get dnsDomainRecord() {
    return this._dnsDomainRecord;
  }
}
