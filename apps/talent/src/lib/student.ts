/*
 * Sample data until the student API exists. Pages and components only call
 * these functions, so swapping in real requests won't touch the UI.
 */

export type Student = {
  firstName: string;
  program: string;
};

export type StudentProgress = {
  milestones: { completed: number; total: number };
  profileLevel: string;
  badges: { unlocked: number; total: number };
  ongoing: { title: string; description: string; percent: number; href: string };
  upNext: { title: string; description: string; href: string };
};

export async function getCurrentStudent(): Promise<Student> {
  return { firstName: "Khushee", program: "Preview" };
}

export async function getStudentProgress(): Promise<StudentProgress> {
  return {
    milestones: { completed: 0, total: 10 },
    profileLevel: "Not started",
    badges: { unlocked: 0, total: 14 },
    ongoing: {
      title: "Complete Career Assessment",
      description:
        "Take the psychometric assessment to discover your best-fit careers and start planning your next step.",
      percent: 25,
      href: "/assessment",
    },
    upNext: {
      title: "Fill Profile Details",
      description:
        "Complete your profile so we can personalise your guidance and match you with the right opportunities.",
      href: "/profile",
    },
  };
}
