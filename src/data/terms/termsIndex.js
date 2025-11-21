import { serviceTerms } from "./serviceTerm";
import { privacyPolicy } from "./privacyPolicy";
import { repositoryAccess } from "./repositoryAccess";

export { serviceTerms, privacyPolicy, repositoryAccess };

export const allTerms = {
  serviceTerms,
  privacyPolicy,
  repositoryAccess,
};

export const TERMS_TYPES = {
  SERVICE: "serviceTerms",
  PRIVACY: "privacyPolicy",
  REPOSITORY: "repositoryAccess",
};
