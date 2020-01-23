import * as acm from "@aws-cdk/aws-certificatemanager";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as route53 from "@aws-cdk/aws-route53";
import * as route53target from "@aws-cdk/aws-route53-targets";
import * as cdk from "@aws-cdk/core";
import { DomainCertificate } from "@rnbw/aws-cdk-tls";
import { EdgeLocation, getPriceClass } from "./EdgeLocations";

export type StaticWebsiteProps = {
  /**
   * Domain where this website will be reachable, e.g. `example.com`.
   */
  domain: string;
  /**
   * Domain name associated to the Hosted Zone where the DNS validation record
   * will be created. Optional; defaults to the given `domain` value.
   * Not used if `hostedZone` is specified.
   */
  zoneDomain?: string;
  /**
   * An instance of IHostedZone; overrides `zoneDomain`.
   */
  hostedZone?: route53.IHostedZone;
  /**
   * A description for this website.
   */
  description?: string;
  /**
   * An union expression indicating which CloudFront edge locations should be
   * used for this website. Default value is the cheapest option
   * (US, Canada & Europe).
   */
  edgeLocations?: EdgeLocation;
  /**
   * The certificate to be used for this website; if not specified,
   * a certificate for the specified domain will be created.
   */
  domainCertificate?: DomainCertificate;
  /**
   * Sources (origins in CloudFront) for this website. Typically an S3 bucket.
   */
  sources: cloudfront.SourceConfiguration[];
};

/**
 * Represents a static website published at a given domain.
 */
export class StaticWebsite extends cdk.Construct {
  private readonly _certificate: acm.ICertificate;
  private readonly _distribution: cloudfront.IDistribution;
  private readonly _dnsDomainRecord: route53.IRecordSet;

  constructor(scope: cdk.Construct, id: string, props: StaticWebsiteProps) {
    super(scope, id);

    const {
      description,
      domain,
      hostedZone,
      zoneDomain,
      edgeLocations = EdgeLocation.PRICE_CLASS_100,
      domainCertificate,
      sources
    } = props;

    //
    // TLS Certificate
    //
    const { certificate } =
      domainCertificate ||
      new DomainCertificate(this, "StaticWebsiteDomainCertificate", {
        hostedZone,
        zoneDomain,
        domain,
        // Certificates for CloudFront need to be created in us-east-1:
        // https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cnames-and-https-requirements.html#https-requirements-aws-region
        certificateRegion: "us-east-1"
      });

    this._certificate = certificate;

    //
    // CloudFront Distribution
    //
    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      "StaticWebsiteDistribution",
      {
        viewerCertificate: cloudfront.ViewerCertificate.fromAcmCertificate(
          certificate,
          {
            aliases: [domain],
            securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1_1_2016,
            sslMethod: cloudfront.SSLMethod.SNI
          }
        ),
        originConfigs: sources,
        comment: description,
        priceClass: getPriceClass(edgeLocations)
      }
    );

    this._distribution = distribution;

    //
    // Route53 HostedZone
    //
    const zone =
      hostedZone ||
      route53.HostedZone.fromLookup(this, "StaticWebsiteHostedZone", {
        domainName: zoneDomain || domain
      });

    //
    // Route53 A record
    //
    const recordTarget = route53.AddressRecordTarget.fromAlias(
      new route53target.CloudFrontTarget(distribution)
    );

    const dnsDomainRecord = new route53.ARecord(
      this,
      "StaticWebsiteDomainRecord",
      {
        zone,
        recordName: domain,
        target: recordTarget
      }
    );

    this._dnsDomainRecord = dnsDomainRecord;
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
