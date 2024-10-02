import fs from "fs";
import path from "path";

let filename = "index.html";
let filePath = path.join("", filename);
let tags = ["nav", "aside", "header", "footer"];
let ids = ["loginregisterforgot"];

init();

fs.watchFile(filePath, () => {
    console.log("File Changed ...");
    let files = getAllFiles(filename, "");
    setFiles(files);
});
function init() {
    let files = getAllFiles(filename, "");
    setFiles(files);
}
function setFiles(files) {
    files.forEach((file, index) => {
        if (index > 0) {
            replaceSpecificTags(files[0], file, tags, ids);
            console.log(`Replaced tags in ${file}`);
        }
    });
}

function getAllFiles(fileName, dir) {
    // give all files with fileName from the root directory recursively
    let results = [];
    dir = path.join(dir);
    let list = fs.readdirSync(dir);

    list.forEach((file) => {
        file = path.join(dir, file);
        let stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(getAllFiles(fileName, file));
        } else {
            if (file.includes(fileName)) {
                results.push(file);
            }
        }
    });
    return results;
}
function replaceSpecificTags(filePath1, filePath2, tags, ids) {
    // Read the contents of both HTML files
    let htmlContent1 = fs.readFileSync(filePath1, "utf8");
    let htmlContent2 = fs.readFileSync(filePath2, "utf8");

    // Define the tags that need to be replaced
    const tagsToReplace = tags;

    // Function to replace tags
    function replaceTag(tag, html1, html2) {
        const regex = new RegExp(`<${tag}[^>]*>[\\s\\S]*?<\\/${tag}>`, "gi");
        const matches1 = html1.match(regex);
        const matches2 = html2.match(regex);

        if (matches1 && matches2) {
            // Replace all occurrences
            for (let i = 0; i < matches1.length && i < matches2.length; i++) {
                html2 = html2.replace(matches2[i], matches1[i]);
            }
        }

        return html2;
    }

    // Replace the specified tags
    tagsToReplace.forEach((tag) => {
        htmlContent2 = replaceTag(tag, htmlContent1, htmlContent2);
    });

    // Function to replace <section> tags with an id attribute
    function replaceSectionWithId(html1, html2, ids) {
        const regex =
            /<section[^>]*id=["']?([^>"'\s]+)["']?[^>]*>[\s\S]*?<\/section>/gi;
        let match;

        // Create a map of sections by id from html1
        const sectionsMap = {};
        while ((match = regex.exec(html1)) !== null) {
            const id = match[1];
            if (ids.indexOf(id) === -1) {
                continue;
            }
            sectionsMap[id] = match[0];
        }

        // Replace matching sections in html2
        html2 = html2.replace(regex, function (fullMatch, id) {
            if (sectionsMap[id]) {
                return sectionsMap[id];
            } else {
                return fullMatch;
            }
        });

        return html2;
    }

    // Replace <section> tags with an id
    htmlContent2 = replaceSectionWithId(htmlContent1, htmlContent2, ids);

    // Write the modified content back to the second file
    fs.writeFileSync(filePath2, htmlContent2, "utf8");
}
