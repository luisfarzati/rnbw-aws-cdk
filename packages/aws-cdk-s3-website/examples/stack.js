const cdk = require("@aws-cdk/core");
const { S3Website } = require("../dist/S3Website");

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
    const sourcePath = this.node.tryGetContext("sourcePath");

    const website = new S3Website(this, "S3WebsiteExample", {
      domain,
      zoneDomain,
      sourcePath,
      bucketRemovalPolicy: cdk.RemovalPolicy.DESTROY
    });

    new cdk.CfnOutput(this, "SiteUrl", {
      value: `https://${website.dnsDomainRecord.domainName}`
    });

    new cdk.CfnOutput(this, "BucketArn", {
      value: website.bucket.bucketArn
    });

    new cdk.CfnOutput(this, "DistributionId", {
      value: website.distribution.distributionId
    });
  }
}

module.exports = { ExampleStack };
