import { BlobServiceClient } from "@azure/storage-blob";
import fs from "fs";
import path from "path";

// Azure blob client (your connection)
const blobServiceClient = BlobServiceClient.fromConnectionString(
  "DefaultEndpointsProtocol=https;AccountName=studentmentorprotegesys;AccountKey=x/nL4Y4NsFYhwKSCMJ5lJDwTvfh8N6Ddf9Z7Rcj7ukAq0nRHTXzjIdRE1RJPv2t3fMkXL83gimis+AStH39VuQ==;EndpointSuffix=core.windows.net"
);

// Container name (you can change this)
const containerName = "uploads";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedBlobs() {
  // Create container if not exists
  const containerClient = blobServiceClient.getContainerClient(containerName);
  await containerClient.createIfNotExists();

  console.log("📦 Container ready:", containerName);

  // Files you want to upload
 const files = [
  {
    localPath: path.join(__dirname, "assignment.png"),
    blobName: "seed-assignment.png",
  },
  {
    localPath: path.join(__dirname, "notes.pdf"),
    blobName: "seed-notes.pdf",
  },
];

  const results = [];

  for (const file of files) {
    if (!fs.existsSync(file.localPath)) {
      console.log("⚠️ File missing:", file.localPath);
      continue;
    }

    const blockBlobClient = containerClient.getBlockBlobClient(file.blobName);

    // Upload file
    await blockBlobClient.uploadFile(file.localPath);

    const blobUrl = blockBlobClient.url;

    console.log(`✅ Uploaded: ${file.blobName}`);
    console.log(`   URL: ${blobUrl}`);

    results.push({
      blob_name: file.blobName,
      blob_url: blobUrl,
    });
  }

  console.log("\n🎉 Blob Seeding Complete!");
  console.log(results);

  return results;
}

seedBlobs().catch((err) => {
  console.error("❌ Blob Seed Failed:", err);
});
