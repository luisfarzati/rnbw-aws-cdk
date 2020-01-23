const cdk = require("@aws-cdk/core");
const { StaticWebsite } = require("../dist/StaticWebsite");
const { EdgeLocation } = require("../dist/EdgeLocations");

class ExampleStack extends cdk.Stack {
  /**
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const zoneDomain = this.node.tryGetContext("zoneDomain");
    const domain = this.node.tryGetContext("domain");

    const { distribution } = new StaticWebsite(this, "StaticWebsiteExample", {
      zoneDomain,
      domain,
      edgeLocations: EdgeLocation.USCanadaEurope | EdgeLocation.LATAM,
      sources: [
        {
          customOriginSource: {
            domainName: "google.com"
          },
          behaviors: [{ isDefaultBehavior: true }]
        }
      ]
    });

    new cdk.CfnOutput(this, "SiteUrl", {
      value: `https://${domain}`
    });

    new cdk.CfnOutput(this, "DistributionId", {
      value: distribution.distributionId
    });
  }
}

module.exports = { ExampleStack };
