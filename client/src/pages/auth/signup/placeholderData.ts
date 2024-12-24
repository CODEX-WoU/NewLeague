// NOTE: REMOVE THIS FILE WHEN INTEGRATING WITH BACK-END
const courses = {
  btech: {
    label: "B.Tech",
    branches: [
      { value: "cse", label: "Computer Science" },
      { value: "cse dsai", label: "Computer Science DS&AI" },
    ],
  },
  bba: {
    label: "BBA",
    branches: [
      { value: "marketing", label: "Marketing" },
      { value: "general", label: "General" },
    ],
  },
  mba: {
    label: "MBA",
    branches: [
      { value: "finance", label: "Finance" },
      { value: "marketing", label: "Marketing" },
      { value: "hr", label: "Human Resources" },
    ],
  },
} as const;

export const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

export const courseOptions = Object.entries(courses).map(
  ([value, { label }]) => ({
    value,
    label,
  })
);

export const getBranchOptions = (courseId: string) => {
  const branches = courses[courseId as keyof typeof courses]?.branches || [];
  return branches.map((branch) => ({ ...branch }));
};
