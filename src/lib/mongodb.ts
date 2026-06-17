import { MongoClient, Db } from 'mongodb';

/**
 * Cached MongoDB connection.
 *
 * In serverless environments (Vercel) the module can be re-evaluated across
 * invocations, so we cache the client on the global object to avoid opening a
 * new connection (and exhausting the Atlas connection limit) on every request.
 */

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'projectblnc';

if (!uri) {
  // We throw lazily inside getDb() instead of here so that the app can still
  // build without the env var present (e.g. during `next build`).
  console.warn('MONGODB_URI is not set. Database operations will fail until it is configured.');
}

interface GlobalWithMongo {
  _mongoClientPromise?: Promise<MongoClient>;
}

const globalForMongo = global as unknown as GlobalWithMongo;

let clientPromise: Promise<MongoClient> | null = null;

function getClientPromise(): Promise<MongoClient> {
  if (!uri) {
    throw new Error(
      'MONGODB_URI is not configured. Add it to .env.local (and your Vercel project env vars).'
    );
  }
  if (process.env.NODE_ENV === 'development') {
    // Reuse the connection across hot reloads in dev.
    if (!globalForMongo._mongoClientPromise) {
      const client = new MongoClient(uri);
      globalForMongo._mongoClientPromise = client.connect();
    }
    return globalForMongo._mongoClientPromise;
  }
  // In production, cache within the module scope.
  if (!clientPromise) {
    const client = new MongoClient(uri);
    clientPromise = client.connect();
  }
  return clientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db(dbName);
}
