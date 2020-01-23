# 🌈 @rnbw/aws-cdk-s3-website

AWS CDK constructs for serverless (S3-hosted) websites and single-page apps.

### Setup

If you haven't used CDK before, follow the [Getting Started with CDK guide](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html)
and make sure to install the AWS CDK command-line tool:

```
npm install -g aws-cdk
```

### Constructs Library

### S3Website

This will provision a website hosted in an S3 bucket with a domain, a CloudFront distribution and a TLS certificate.

```javascript
//
// Conceptual code – for a full working example check the /examples folder.
//
const { S3Website } = require("@rnbw/aws-cdk-s3-website");

class MyStack extends cdk.Stack {

    // ...

    const website = new S3Website(this, "MyWebsite", {
      zoneDomain: "example.com",
      domain: "www.example.com",
      sourcePath: "./public"
    });

    // ...

    new cdk.CfnOutput(this, "SiteUrl", {
      value: `https://${website.dnsDomainRecord.domainName}`
    });

    new cdk.CfnOutput(this, "BucketArn", {
      value: website.bucket.bucketArn
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

- S3Website: domain aliases
- S3Website: domain redirection
