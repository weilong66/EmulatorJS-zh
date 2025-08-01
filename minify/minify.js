import path from "path";
import {
    fileURLToPath
} from "url";
import minify from "@node-minify/core";
import terser from "@node-minify/terser";
import cleanCSS from "@node-minify/clean-css";

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);
const rootPath = path.resolve(__dirname, "../");

async function doMinify() {
    await minify({
            compressor: terser,
            input: path.join(rootPath, "data/src/*.js").replace(/\\/g, '/'),
            output: path.join(rootPath, "data/emulator.min.js"),
        })
        .catch(function (err) {
            console.error(err);
        })
        .then(function () {
            console.log("Minified JS");
        });

    // 生成两个独立的 glob 模式
    const styleCss = path.join(rootPath, "data/css/**/*.css").replace(/\\/g, '/');
    const emulatorCss = path.join(rootPath, "data/emulator.css");

    // 合并：将它们放入一个数组
    const cssGlobs = [emulatorCss, styleCss];
    
    await minify({
            compressor: cleanCSS,
            input: cssGlobs,
            output: path.join(rootPath, "data/emulator.min.css"),
        })
        .catch(function (err) {
            console.error(err);
        })
        .then(function () {
            console.log("Minified CSS");
        });
}

console.log("Minifying");
await doMinify();
console.log("Minifying Done!");