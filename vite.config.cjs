const path = require("node:path");
const engineConfig = require("bare-engine/config/vite.config.cjs");
const { bareTypeScriptTransformPlugin } = require("bare-engine/vite/plugins.cjs");

module.exports = (env) => {
    const config = engineConfig(env);
    const projectRoot = process.cwd();
    const demosRoot = path.join(projectRoot, "public/demos").replace(/\\/g, "/");
    const stripDecorators = env?.mode !== "development";

    config.plugins = [
        bareTypeScriptTransformPlugin({
            projectRoot,
            tsconfigPath: path.join(projectRoot, "tsconfig.json"),
            useTypeChecker: env?.mode !== "development",
            stripDecorators,
            include: (filePath) => filePath.replace(/\\/g, "/").startsWith(demosRoot)
        }),
        ...(config.plugins || [])
    ];

    return config;
};

