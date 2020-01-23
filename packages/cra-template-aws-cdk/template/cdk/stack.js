const cdk = require("@aws-cdk/core");
const { S3Website } = require("@rnbw/aws-cdk-s3-website");

class ReactAppStack extends cdk.Stack {
  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const zoneDomain = this.node.tryGetContext("zoneDomain");
    const domain = this.node.tryGetContext("domain");

    const site = new S3Website(this, "ReactSite", {
      zoneDomain,
      domain,
      sourcePath: "./build"
    });

    new cdk.CfnOutput(this, "SiteUrl", {
      value: `https://${site.dnsDomainRecord.domainName}`
    });

    new cdk.CfnOutput(this, "BucketArn", {
      value: site.bucket.bucketArn
    });

    new cdk.CfnOutput(this, "DistributionId", {
      value: site.distribution.distributionId
    });
  }
}

module.exports = { ReactAppStack };
