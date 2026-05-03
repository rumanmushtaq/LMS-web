import { AuthUser } from "@/store/auth";

export enum OnboardingStep {
  SIGNED_UP = "signed_up",
  CONTRACT_ACCEPTED = "contract_accepted",
  TAX_SELECTED = "tax_selected",
  TAX_SUBMITTED = "tax_submitted",
  KYC_COMPLETED = "kyc_completed",
  COMPLETED = "completed",
}

export enum UserStatus {
  ACTIVE = "active",
  PENDING = "pending",
  SUSPENDED = "suspended",
}

export enum UserRole {
  TUTOR = "tutor",
  STUDENT = "student",
  ADMIN = "admin",
}

export const getTutorRedirectPath = (user: AuthUser | null): string => {
  if (!user || user.role !== UserRole.TUTOR) return "/";

  // If suspended, they probably shouldn't be here, but let the backend handle it mostly.
  if (user.status === UserStatus.SUSPENDED) return "/login";

  switch (user.onboardingStep) {
    case OnboardingStep.SIGNED_UP:
      return "/independent-contract";
    case OnboardingStep.CONTRACT_ACCEPTED:
    case OnboardingStep.TAX_SELECTED:
      return "/onboarding/tax-forms";
    case OnboardingStep.TAX_SUBMITTED:
      return "/onboarding/kyc";
    case OnboardingStep.KYC_COMPLETED:
    case OnboardingStep.COMPLETED:
      if (user.status === UserStatus.ACTIVE) {
        return "/instructor/dashboard";
      }
      return "/waiting-verification";
    default:
      return "/";
  }
};

export const isInstructorAccessAllowed = (user: AuthUser | null): boolean => {
  return (
    user?.role === UserRole.TUTOR &&
    user?.status === UserStatus.ACTIVE &&
    (user?.onboardingStep === OnboardingStep.COMPLETED ||
      user?.onboardingStep === OnboardingStep.KYC_COMPLETED)
  );
};
