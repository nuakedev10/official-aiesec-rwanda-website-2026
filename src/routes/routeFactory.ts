import { Router } from 'express';
import { protect, restrictTo } from '../middleware/auth';

// Pairs with crudFactory on the controller side: public reads, admin-only
// writes. `adminRoles` lets a route restrict who can edit it (e.g. only
// SUPER_ADMIN can touch site-wide stats, but any MCVP can edit FAQs).
export function buildCrudRoutes(
  ctrl: {
    getAll: any;
    getOne: any;
    createOne: any;
    updateOne: any;
    deleteOne: any;
  },
  adminRoles: string[] = ['SUPER_ADMIN', 'MCP', 'MCVP']
) {
  const router = Router();

  router.get('/', ctrl.getAll);
  router.get('/:id', ctrl.getOne);
  router.post('/', protect, restrictTo(...(adminRoles as any)), ctrl.createOne);
  router.patch('/:id', protect, restrictTo(...(adminRoles as any)), ctrl.updateOne);
  router.delete('/:id', protect, restrictTo(...(adminRoles as any)), ctrl.deleteOne);

  return router;
}
