# 🌈 @rnbw/cra-template-aws-cdk

CRA template for AWS S3-hosted React applications.

## Overview

This template uses [AWS CDK](https://docs.aws.amazon.com/cdk/latest/guide/home.html) to provision the following infrastructure on AWS:

- Route53 DNS record
- TLS certificate
- S3 bucket
- CloudFront distribution

## Prerequisites

- Node 10.3+
- AWS credentials configured in your system (with an active AWS_PROFILE)
- A registered domain using Route53
- An existing Route53 Hosted Zone for that domain

## Quick Start

### 1. Create the app:

```bash
npx create-react-app my-react-app --template @rnbw/aws-cdk
```

### 2. Edit the file `cdk.json`:

```js
{
  //...
  "zoneDomain": "mydomain.com",
  "domain": "app.mydomain.com"
}
```

### 3. Build the app:

```bash
yarn build
```

### 4. Deploy:

```bash
# Make sure you have proper AWS credentials in your environment
# e.g. using AWS_PROFILE
CDK_DEFAULT_ACCOUNT=<your AWS account ID> yarn deploy

# ...

Do you wish to deploy these changes (y/n)? y
my-react-app: deploying...

# ...
# creating a CloudFront distribution typically takes ~40 minutes
# ...

 ✅  my-react-app

Outputs:
my-react-app.SiteUrl = https://app.mydomain.com
my-react-app.BucketArn = arn:aws:s3:::app.mydomain.com
```
