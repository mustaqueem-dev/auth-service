import { QueryResult } from 'pg';
import { pool } from '../config/db';
import { IUser } from '../types/user.types';

export class UserRepository {
  
  /**
   * Email ke basis par user dhoondhna.
   * Ye function Login ke waqt kaam aayega jahan humein password verify karna hota hai.
   */
  public async findByEmail(email: string): Promise<IUser | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result: QueryResult = await pool.query(query, [email]);
    
    // Agar user nahi mila, toh null return karo, warna user object
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  /**
   * ID ke basis par user dhoondhna.
   * Ye function JWT token validation ke baad user ka data nikalne ke kaam aayega.
   */
  public async findById(id: string): Promise<IUser | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result: QueryResult = await pool.query(query, [id]);
    
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  /**
   * Naya user database me insert karna.
   * Dhyan rakhein, yahan hum raw password nahi, hashed password receive karenge.
   * Hash karne ka kaam Service layer ka hai, Repository sirf insert karegi.
   */
  public async create(name: string, email: string, passwordHash: string): Promise<IUser | null> {
    const query = `
      INSERT INTO users (name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    
    // RETURNING * ka fayda ye hai ki humein alag se SELECT query nahi maarni padti, 
    // insert hone ke turant baad PostgreSQL wahi row wapas bhej deta hai.
    const result: QueryResult = await pool.query(query, [name, email, passwordHash]);
    
    return result.rows[0];
  }
}