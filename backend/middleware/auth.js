// backend/middleware/auth.js
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { config } from "../config.js";

const verifier = CognitoJwtVerifier.create({
  userPoolId: config.COGNITO_POOL_ID,
  tokenUse: "access",
  clientId: config.COGNITO_CLIENT_ID
});

export async function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });
    const payload = await verifier.verify(token);
    req.user = payload;
    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ message: "Unauthorized" });
  }
}
