import api from '../api/axios';
import type { Branch } from '../types/branch';

export const BranchService = {
  getAll(): Promise<Branch[]> {
    return api.get('/branches').then((r: any) => r.data);
  }
};
