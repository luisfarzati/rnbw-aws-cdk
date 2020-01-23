import * as cdk from "@aws-cdk/core";
import { SynthUtils } from "@aws-cdk/assert";
import { DomainCertificate } from "./DomainCertificate";

const testEnv = {
  env: {
    region: "us-west-1",
    account: "test-account"
  }
};

const createStack = () => new cdk.Stack(undefined, undefined, testEnv);

test("Matches CloudFormation snapshot", () => {
  const stack = createStack();

  new DomainCertificate(stack, "DomainCertificateTest", {
    domain: "www.domain.com",
    zoneDomain: "domain.com",
    certificateRegion: "us-east-1"
  });

  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});

test("Has resource properties", () => {
  const stack = createStack();

  const domain = new DomainCertificate(stack, "DomainCertificateTest", {
    domain: "domain.com"
  });

  expect(domain.certificate).toBeDefined();
});
