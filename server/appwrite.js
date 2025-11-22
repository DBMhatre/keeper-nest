import { Client, Account, Databases, Functions } from 'appwrite';
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_API_KEY } from '@env';

export const APPWRITE_CONFIG = {
  endpoint: {APPWRITE_ENDPOINT},
  projectId:{APPWRITE_PROJECT_ID}, 
  apiKey: {APPWRITE_API_KEY}, 
};

export const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const functions = new Functions(client);