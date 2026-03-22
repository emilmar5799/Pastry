import { db } from '../config/database';
import { Branch } from '../models/branch.model';

export const findAllBranches = async (): Promise<Branch[]> => {
  const [rows] = await db.query<any[]>(`SELECT * FROM branches`);
  return rows;
};
