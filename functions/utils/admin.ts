import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert("./fore-d2820-firebase-adminsdk-gzklu-b305e4fa7c.json"),
  });
}

export default admin;
