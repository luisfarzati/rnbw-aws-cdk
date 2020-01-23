#!/usr/bin/env node
const cdk = require("@aws-cdk/core");
const { ExampleStack } = require("./stack");

const app = new cdk.App();

new ExampleStack(app, "rnbw-aws-cdk-static-website-ExampleStack", {
  env: {
    region: "us-east-1",
    account: process.env.CDK_DEFAULT_ACCOUNT
  }
});
