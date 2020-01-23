# 🌈 @rnbw/aws-cdk-tls

TLS-related constructs for AWS CDK.

### Setup

If you haven't used CDK before, follow the [Getting Started with CDK guide](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html)
and make sure to install the AWS CDK command-line tool:

```
npm install -g aws-cdk
```

### Constructs Library

### Domain certificate

This will provision a TLS certificate for the given domain.

```javascript
//
// Conceptual code – for a full working example check the /examples folder.
//
const { DomainCertificate } = require("@rnbw/aws-cdk-tls");

class MyStack extends cdk.Stack {
    // ...

    const { certificate } = new DomainCertificate(this, "www-example-com-tls", {
      zoneDomain: "example.com",
      domain: "www.example.com"
    });

    // ...

    new cdk.CfnOutput(this, "CertificateArn", {
      value: certificate.certificateArn
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

- DomainCertificate: subject alternative names
