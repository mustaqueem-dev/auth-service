import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { IJwtPlayload } from "../types/api.types";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key";

export class JwtUtil {
  public static generateToken(payload: IJwtPlayload): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: "24h",
    });
  }

  public static verifyToken(token: string): IJwtPlayload {
    return jwt.verify(token, JWT_SECRET) as IJwtPlayload;
  }
}
