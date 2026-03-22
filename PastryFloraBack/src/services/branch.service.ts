import * as repo from '../repositories/branch.repository';

export const listBranches = async () => {
  return await repo.findAllBranches();
};
