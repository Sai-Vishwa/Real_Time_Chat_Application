import { BlobServiceClient } from "@azure/storage-blob";

// Your connection string
const AZURE_STORAGE_CONNECTION_STRING =
  "";

// Create blob service client
const blobServiceClient = BlobServiceClient.fromConnectionString("DefaultEndpointsProtocol=https;AccountName=studentmentorprotegesys;AccountKey=x/nL4Y4NsFYhwKSCMJ5lJDwTvfh8N6Ddf9Z7Rcj7ukAq0nRHTXzjIdRE1RJPv2t3fMkXL83gimis+AStH39VuQ==;EndpointSuffix=core.windows.net");

export default blobServiceClient;
