import { NextFunction, Request, Response } from "express";
import { getAuth } from "firebase-admin/auth";

export const authenticateUserMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let authToken = req.headers.authorization;
    try {
        if (authToken) {
            if (authToken.split(" ")[0] === "Bearer") {
                authToken = authToken.split(" ")[1];
            }
            getAuth()
                .verifyIdToken(authToken)
                .then((decodedToken) => {
                    const uid = decodedToken.uid;
                    // set user context
                    return next();
                })
                .catch((error) => { 
                    console.log(error);
                    return next();
                });
        }
    } catch (error) {
        console.log(error);
        return next();
    }
};