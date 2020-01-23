# 🌈 @rnbw/aws-cdk-static-website

AWS CDK constructs for building static websites hosted on any valid CloudFront origin.

### Setup

If you haven't used CDK before, follow the [Getting Started with CDK guide](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html)
and make sure to install the AWS CDK command-line tool:

```
npm install -g aws-cdk
```

### Constructs Library

### StaticWebsite

This will provision a domain, CloudFront distribution (using the configured origin) and a TLS certificate.

```javascript
//
// Conceptual code – for a full working example check the /examples folder.
//
const { StaticWebsite } = require("@rnbw/aws-cdk-static-website");

class MyStack extends cdk.Stack {
    // ...

    const website = new StaticWebsite(this, "MyWebsite", {
      zoneDomain: "example.com",
      domain: "www.example.com",
      sources: [
        {
          customOriginSource: {
            domainName: "some.custom-origin.com"
          },
          behaviors: [{ isDefaultBehavior: true }]
        }
      ]
    });

    // ...

    new cdk.CfnOutput(this, "SiteUrl", {
      value: `https://${website.dnsDomainRecord.domainName}`
    });

    new cdk.CfnOutput(this, "DistributionId", {
      value: website.distribution.distributionId
    });

    // ...
}
```

### ... more constructs to be added in the future!

### Development

#### Useful commands

- `yarn build`
- `yarn test`

### Roadmap

- StaticWebsite: domain aliases
- StaticWebsite: domain redirection
