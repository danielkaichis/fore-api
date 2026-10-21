import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert("./fore-d2820-eed2c9770d2a.json"),
  });
}

export default admin;
