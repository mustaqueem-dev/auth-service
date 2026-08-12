import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/UserRepository";
import {
  IRegisterUserDTO,
  ILoginUserDTO,
  IUserResponseDTO,
} from "../types/user.types";
import { UserMapper } from "../utils/user.mapper";
import { JwtUtil } from "../utils/jwt.util";

export class UserService {
  // Dependency Injection: Service ko Repository ka instance denge
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * User Registration Logic
   */
  public async registerUser(data: IRegisterUserDTO): Promise<IUserResponseDTO> {
    // 1. Check if user already exists
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // 2. Hash the password (10 salt rounds is standard for good performance/security balance)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    // 3. Save to database via Repository
    const newUser = await this.userRepository.create(
      data.name,
      data.email,
      hashedPassword,
    );
    if (!newUser) {
      throw new Error("Failed to create user");
    }

    // 4. Return safe DTO (without password)
    return UserMapper.toResponseDTO(newUser);
  }

  /**
   * User Login Logic
   */
  public async loginUser(
    data: ILoginUserDTO,
  ): Promise<{ user: IUserResponseDTO; token: string }> {
    // 1. Check if user exists
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // 2. Compare incoming password with stored hash
    const isPasswordValid = await bcrypt.compare(
      data.password,
      user.password_hash,
    );
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const token = JwtUtil.generateToken({
      id: user.id,
      role: user.role,
    });


    const safeUser = UserMapper.toResponseDTO(user);

    return {
      user: safeUser,
      token,
    };
  }
}
