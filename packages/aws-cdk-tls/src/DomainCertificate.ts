import * as acm from "@aws-cdk/aws-certificatemanager";
import * as route53 from "@aws-cdk/aws-route53";
import * as cdk from "@aws-cdk/core";

export type DomainCertificateProps = {
  /**
   * Domain name of this certificate.
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
   * Region where this certificate will be created. Certificates used for
   * CloudFront distributions require the region to be `us-east-1`.
   */
  certificateRegion?: string;
};

/**
 * Represents a TLS certificate for a given domain.
 */
export class DomainCertificate extends cdk.Construct {
  private readonly _certificate: acm.ICertificate;

  constructor(
    parent: cdk.Construct,
    id: string,
    props: DomainCertificateProps
  ) {
    super(parent, id);

    const { domain, zoneDomain, hostedZone, certificateRegion } = props;

    //
    // Route53 HostedZone
    //
    const zone =
      hostedZone ||
      route53.HostedZone.fromLookup(this, "DomainCertificateHostedZone", {
        domainName: zoneDomain || domain
      });

    //
    // ACM Certificate
    //
    const certificate = new acm.DnsValidatedCertificate(
      this,
      "DomainCertificate",
      {
        domainName: domain,
        validationMethod: acm.ValidationMethod.DNS,
        hostedZone: zone,
        region: certificateRegion
      }
    );

    this._certificate = certificate;
  }

  get certificate() {
    return this._certificate;
  }
}
