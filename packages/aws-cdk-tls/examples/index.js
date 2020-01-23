#!/usr/bin/env node
const cdk = require("@aws-cdk/core");
const { ExampleStack } = require("./stack");

const app = new cdk.App();

new ExampleStack(app, "rnbw-aws-cdk-tls-ExampleStack", {
  // Stack must be in us-east-1, because the ACM certificate for a
  // global CloudFront distribution must be requested in us-east-1.
  env: {
    region: "us-east-1",
    account: process.env.CDK_DEFAULT_ACCOUNT
  }
});
