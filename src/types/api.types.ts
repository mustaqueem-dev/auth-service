// Standard API response structure
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string | any;
}

// JWT Payload Structure
export interface IJwtPlayload {
  id: string;
  role: string;
}
