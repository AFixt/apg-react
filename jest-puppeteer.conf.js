module.exports = {
    launch: {
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        slowMo: 50,
        ignoreHTTPSErrors: true,
    },
    server: {
        command: "npm start",
        port: 3000,
        launchTimeout: 5000,
    },
    browserContext: "default",
    exitOnPageError: true,
};
