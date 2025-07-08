import { getAuth } from "firebase-admin/auth";

export const authenticateUserMiddleware = async (
  authToken: string,
) => {
  if (authToken.startsWith("Bearer ")) {
    authToken = authToken.slice(7, authToken.length);
  }
  const user = await getAuth().verifyIdToken(authToken).then(async (decodedToken) => {
    const uid = decodedToken.uid;
    return await getAuth().getUser(uid);
  });
  return user;
};
