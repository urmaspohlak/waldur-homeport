import { ENV } from '@waldur/core/services';
import { CustomersService } from '@waldur/customer/services/CustomersService';

export const InvitationPolicyService = {
  // This service provides business logic for invitation permissions:
  // 1) Staff can manage any invitation.
  // 2) Non-owner (namely customer support, project manager or system admin) can not manage invitations.
  // 3) Owner can manage any project invitation.
  // 4) Owner can manage customer invitation only if OWNERS_CAN_MANAGE_OWNERS is true.

  // Check user permissions for new invitation
  canManageRole(context, role) {
    if (context.user.is_staff) {
      return true;
    }
    if (!CustomersService.isOwner(context.customer, context.user)) {
      return false;
    }
    if (role.value === 'manager' || role.value === 'admin') {
      return true;
    }
    if (role.value === 'owner') {
      return ENV.plugins.WALDUR_CORE.OWNERS_CAN_MANAGE_OWNERS;
    }
  },

  // Check user permissions for existing invitation
  canManageInvitation(context, invitation) {
    if (context.user.is_staff) {
      return true;
    }
    if (!CustomersService.isOwner(context.customer, context.user)) {
      return false;
    }
    if (invitation.project_role) {
      return true;
    }
    if (invitation.customer_role) {
      return ENV.plugins.WALDUR_CORE.OWNERS_CAN_MANAGE_OWNERS;
    }
  },
};
