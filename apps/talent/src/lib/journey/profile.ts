import { profileSectionSchemas } from "./schemas";
import { profileSectionKeys, type CandidateProfile, type ProfileSectionInput, type ProfileSectionKey } from "./types";

export const profileSectionMeta: Record<ProfileSectionKey, { title: string; description: string }> = {
  personal: { title: "Personal details", description: "Your name, date of birth and a short professional summary." },
  contact: { title: "Contact details", description: "How we and, with your consent, recruiters can reach you." },
  education: { title: "Education", description: "Degrees, diplomas and certifications." },
  experience: { title: "Work experience", description: "Roles you have held, or mark yourself as a fresher." },
  skills: { title: "Technical skills", description: "The skills recruiters can search you by." },
  preferences: { title: "Career preferences", description: "Roles, locations and work modes you are open to." },
  resume: { title: "Resume", description: "Upload your latest resume for verification and recruiters." },
};

/** The values each section form edits, in the shape the API accepts. */
export function sectionValues<K extends Exclude<ProfileSectionKey, "resume">>(
  profile: CandidateProfile,
  key: K
): ProfileSectionInput[K] {
  const values: ProfileSectionInput = {
    personal: profile.personal,
    contact: {
      phone: profile.contact.phone,
      city: profile.contact.city,
      state: profile.contact.state,
      country: profile.contact.country,
      linkedinUrl: profile.contact.linkedinUrl,
      portfolioUrl: profile.contact.portfolioUrl,
    },
    education: { items: profile.education },
    experience: profile.experience,
    skills: { items: profile.skills },
    preferences: profile.preferences,
  };
  return values[key];
}

export function isSectionComplete(profile: CandidateProfile, key: ProfileSectionKey): boolean {
  if (key === "resume") return profile.resume !== null;
  return profileSectionSchemas[key].isValidSync(sectionValues(profile, key));
}

export type ProfileCompletion = {
  percent: number;
  complete: ProfileSectionKey[];
  incomplete: ProfileSectionKey[];
};

/**
 * Live completion for the form UI, using the same mandatory-field rules as the
 * schemas. The stage itself only completes when the API accepts the profile.
 */
export function profileCompletion(profile: CandidateProfile): ProfileCompletion {
  const complete = profileSectionKeys.filter((key) => isSectionComplete(profile, key));
  const incomplete = profileSectionKeys.filter((key) => !complete.includes(key));

  return {
    percent: Math.round((complete.length / profileSectionKeys.length) * 100),
    complete,
    incomplete,
  };
}
