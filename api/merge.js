import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new formidable.IncomingForm();
  form.uploadDir = "./public/uploads";
  form.keepExtensions = true;
  form.multiples = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "File upload failed" });
    }

    const uploadedFiles = Array.isArray(files.files) ? files.files : [files.files];
    let mergedBody = "";
    let mergedHead = "";

    for (let i = 0; i < uploadedFiles.length; i++) {
      const filePath = uploadedFiles[i].filepath;
      const content = fs.readFileSync(filePath, "utf-8");

      const headMatch = content.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
      if (i === 0 && headMatch) {
        mergedHead = headMatch[1];
      }

      const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      if (bodyMatch) {
        mergedBody += `<div class="page">${bodyMatch[1]}</div>\n`;
      }

      fs.unlinkSync(filePath); // Clean up uploaded files
    }

    const mergedHtml = `
    <!DOCTYPE html>
    <html>
    <head>
    ${mergedHead}
    <style>
        body { font-family: Arial, sans-serif; }
        .container { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; padding: 10px; }
        .page { border: 1px solid #ddd; padding: 10px; page-break-inside: avoid; }
        @media print {
            .container { display: grid; grid-template-columns: repeat(2, 1fr); }
            .page { page-break-inside: avoid; }
        }
    </style>
    </head>
    <body>
    <div class="container">
    ${mergedBody}
    </div>
    </body>
    </html>
    `;

    const outputPath = path.join("./public", "merged.html");
    fs.writeFileSync(outputPath, mergedHtml);

    return res.status(200).json({ url: "/merged.html" });
  });
         }
