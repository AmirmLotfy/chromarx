export const categoryColors: Record<string, { bg: string; text: string }> = {
  Work: {
    bg: "bg-[#9b87f5]/20",
    text: "text-[#9b87f5]",
  },
  Personal: {
    bg: "bg-[#D6BCFA]/20",
    text: "text-[#7E69AB]",
  },
  Shopping: {
    bg: "bg-[#6E59A5]/20",
    text: "text-[#6E59A5]",
  },
  Reading: {
    bg: "bg-[#E5DEFF]/30",
    text: "text-[#8B5CF6]",
  },
  Entertainment: {
    bg: "bg-[#FFDEE2]/30",
    text: "text-[#D946EF]",
  },
  Social: {
    bg: "bg-[#FDE1D3]/30",
    text: "text-[#F97316]",
  },
  News: {
    bg: "bg-[#D3E4FD]/30",
    text: "text-[#0EA5E9]",
  },
  Development: {
    bg: "bg-[#F2FCE2]/30",
    text: "text-[#4CAF50]",
  },
  Education: {
    bg: "bg-[#FEF7CD]/30",
    text: "text-[#F59E0B]",
  },
  Other: {
    bg: "bg-[#F1F0FB]/30",
    text: "text-[#8E9196]",
  },
  Uncategorized: {
    bg: "bg-gray-100",
    text: "text-gray-500",
  },
};

export const getCategoryColors = (category: string) => {
  const normalizedCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  return categoryColors[normalizedCategory] || categoryColors.Other;
};