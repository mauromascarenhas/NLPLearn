export default {
    verbose: true,
    transform: {
        "\\.[jt]sx?$": "babel-jest"
    },
    testEnvironment: "jest-environment-node"
};
