import { IJwtPayload } from '../api.types';

// Express ki global Request interface me 'user' property add kar rahe hain
declare global {
  namespace Express {
    interface Request {
      user?: IJwtPayload;
    }
  }
}