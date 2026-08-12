import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { ApiResponse } from "../types/api.types";

// Initialize the service instance
const userService = new UserService();

export class AuthController {
  public static async register(req: Request, res: Response): Promise<void> {
    try {
      // Extract data from request body
      const { name, email, password } = req.body;

      // Call the Service layer to handle business logic
      const newUser = await userService.registerUser({ name, email, password });

      // Send success response
      const response: ApiResponse<any> = {
        success: true,
        message: "User registered successfully",
        data: newUser,
      };

      res.status(201).json(response);
    } catch (error: any) {
      // Handle specific business logic errors (e.g., Email already exists)
      if (error.message === "User with this email already exists") {
        res.status(409).json({ success: false, message: error.message });
        return;
      }

      // Handle unexpected system errors
      console.error("Register Error:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }

  public static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Call Service layer for authentication and token generation
      const { user, token } = await userService.loginUser({ email, password });

      // Send success response with token
      const response: ApiResponse<any> = {
        success: true,
        message: "Login successful",
        data: {
          user,
          token,
        },
      };

      res.status(200).json(response);
    } catch (error: any) {
      // Handle invalid credentials
      if (error.message === "Invalid email or password") {
        res.status(401).json({ success: false, message: error.message });
        return;
      }

      // Handle unexpected system errors
      console.error("Login Error:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }

  public static async getProfile(req: Request, res: Response): Promise<unknown> {
    try {
      // Token se mili hui user ID
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      // Use Repository directly for a simple read, or add a method in UserService
      // For now, let's use a quick inline DB call just for the demo,
      // though ideally, you'd add a `getUserProfile` method in UserService!

      const user = await userService["userRepository"].findById(userId); // Access private repo just for demo brevity, fix in production!

      if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Profile Error:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
}
