import { Client, Databases , Account} from 'appwrite';
import { appwriteUrl, appwriteProjectId } from './conf/conf';

const client = new Client();

client
    .setEndpoint(appwriteUrl)
    .setProject(appwriteProjectId);


export const databases = new Databases(client);
export const account = new Account(client);


export default client;