#!/usr/bin/env node
const cdk = require("@aws-cdk/core");
const { ReactAppStack } = require("./stack");
const { name, description } = require("../package.json");

const app = new cdk.App();

new ReactAppStack(app, "ReactAppStack", {
  stackName: name.replace("@", "").replace("/", "-"),
  description,
  env: {
    region: "us-east-1",
    account: process.env.CDK_DEFAULT_ACCOUNT
  }
});
