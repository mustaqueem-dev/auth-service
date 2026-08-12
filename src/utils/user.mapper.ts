import { IUser, IUserResponseDTO } from "../types/user.types";

export class UserMapper {
  public static toResponseDTO(user: IUser): IUserResponseDTO {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    };
  }
}
