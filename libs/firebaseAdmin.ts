// libs/firebaseAdmin.ts (Ejemplo)
import admin from 'firebase-admin';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'tu-bucket.appspot.com'
  });
}

export const bucket = admin.storage().bucket();