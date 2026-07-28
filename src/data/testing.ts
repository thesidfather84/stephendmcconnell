export type TestingNavItem = {
  slug: string;
  href: string;
  title: string;
  description: string;
};

export const testingNav: TestingNavItem[] = [
  {
    slug: "barnes-thyroid-temperature-test",
    href: "/testing/barnes-thyroid-temperature-test",
    title: "Barnes Thyroid Temperature Test",
    description: "History, instructions, and a printable and digital tracking chart.",
  },
  {
    slug: "kidney-function-explorer",
    href: "/testing/kidney-function-explorer",
    title: "Kidney Function Explorer",
    description: "How eGFR, creatinine, cystatin C, and proteinuria fit together.",
  },
  {
    slug: "blood-pressure-tracking",
    href: "/testing/blood-pressure-tracking",
    title: "Blood Pressure Tracking",
    description: "Why regular blood pressure monitoring matters for kidney health.",
  },
  {
    slug: "proteinuria-albumin",
    href: "/testing/proteinuria-albumin",
    title: "Proteinuria & Albumin Testing",
    description: "What protein and albumin in urine can indicate about kidney health.",
  },
  {
    slug: "cystatin-c",
    href: "/testing/cystatin-c",
    title: "Cystatin C",
    description: "An alternative marker used to estimate kidney function.",
  },
  {
    slug: "creatinine",
    href: "/testing/creatinine",
    title: "Creatinine",
    description: "The most common blood marker used to assess kidney function.",
  },
  {
    slug: "egfr",
    href: "/testing/egfr",
    title: "eGFR",
    description: "Estimated glomerular filtration rate, explained.",
  },
  {
    slug: "reference-guide",
    href: "/testing/reference-guide",
    title: "Laboratory Reference Guide",
    description: "A quick reference for common kidney-related lab tests.",
  },
];
