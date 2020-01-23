const { App } = require("@aws-cdk/core");
const { SynthUtils } = require("@aws-cdk/assert");
const { ExampleStack } = require("./stack");

const appProps = {
  context: require("./cdk.json").context
};

const stackProps = {
  env: {
    region: "us-east-1",
    account: "test-account"
  }
};

test("Matches CloudFormation snapshot", () => {
  const stack = new ExampleStack(
    new App(appProps),
    "ExampleStackTest",
    stackProps
  );

  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});
