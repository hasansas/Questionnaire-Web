// stores/organization-invitation.ts
import { defineStore } from "pinia";

export interface OrganizationInvitationOrganization {
  id: string;
  code: string;
  name: string;
  type: string | null;
  category: string | null;
  subCategory: string | null;
  image: string | null;
  description: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  status: string | null;
}

export interface OrganizationInvitationMeta {
  token: string;
  type: string;
  expiresAt: string | null;
  verifiedAt: string | null;
  attempts: number;
  status: string;
}

export interface OrganizationInvitationUser {
  id: string;
  name: string | null;
  email: string | null;
}

export interface OrganizationInvitationDetail {
  organization: OrganizationInvitationOrganization;
  invitation: OrganizationInvitationMeta;
  invitedUser: OrganizationInvitationUser;
}

export interface AcceptOrganizationInvitePayload {
  orgId: string;
  token: string;
  password: string;
}

export interface ApiResult<T = any> {
  success: boolean;
  code?: number;
  data?: T | null;
  error?: any;
  message?: string;
}

export const useOrganizationInvitationStore = defineStore(
  "organization-invitation",
  () => {
    const api = useApiService();

    /**
     * Get invitation detail and validate invitation token
     */
    async function getInvitationDetail(
      orgId: string,
      token: string,
    ): Promise<ApiResult<OrganizationInvitationDetail>> {
      return await api.get<OrganizationInvitationDetail>(
        `/v1/organizations/${orgId}/users/invitation`,
        { token },
      );
    }

    /**
     * Accept organization invitation
     */
    async function acceptInvitation(
      payload: AcceptOrganizationInvitePayload,
    ): Promise<ApiResult> {
      const { orgId, token, password } = payload;

      return await api.post<any>(
        `/v1/organizations/${orgId}/users/accept-invite`,
        {
          token,
          password,
        },
      );
    }

    return {
      getInvitationDetail,
      acceptInvitation,
    };
  },
);
