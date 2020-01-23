const cdk = require("@aws-cdk/core");
const { DomainCertificate } = require("../dist/DomainCertificate");

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

    const { certificate } = new DomainCertificate(
      this,
      "DomainCertificateExample",
      {
        zoneDomain,
        domain
      }
    );

    new cdk.CfnOutput(this, "CertificateArn", {
      value: certificate.certificateArn
    });
  }
}

module.exports = { ExampleStack };
