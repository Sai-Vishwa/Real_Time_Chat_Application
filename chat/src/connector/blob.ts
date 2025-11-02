import { BlobServiceClient } from "@azure/storage-blob";

// Your connection string
const AZURE_STORAGE_CONNECTION_STRING =
  "";

// Create blob service client
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

export default blobServiceClient;
