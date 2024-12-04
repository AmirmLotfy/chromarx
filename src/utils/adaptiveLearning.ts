import { Bookmark } from "@/types/bookmark";

interface UserPattern {
  preferredCategories: string[];
  activeTimeSlots: string[];
  categoryUsageFrequency: Record<string, number>;
}

export class AdaptiveLearningSystem {
  private static instance: AdaptiveLearningSystem;
  private userPatterns: UserPattern | null = null;

  private constructor() {}

  static getInstance(): AdaptiveLearningSystem {
    if (!AdaptiveLearningSystem.instance) {
      AdaptiveLearningSystem.instance = new AdaptiveLearningSystem();
    }
    return AdaptiveLearningSystem.instance;
  }

  analyzeUserPatterns(bookmarks: Bookmark[]): UserPattern {
    const categoryUsage: Record<string, number> = {};
    const timeSlots: Record<string, number> = {};

    bookmarks.forEach(bookmark => {
      // Analyze category usage
      const category = bookmark.category || 'Uncategorized';
      categoryUsage[category] = (categoryUsage[category] || 0) + 1;

      // Analyze time patterns
      const hour = new Date(bookmark.dateAdded).getHours();
      const timeSlot = `${hour}:00`;
      timeSlots[timeSlot] = (timeSlots[timeSlot] || 0) + 1;
    });

    const preferredCategories = Object.entries(categoryUsage)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category);

    const activeTimeSlots = Object.entries(timeSlots)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([timeSlot]) => timeSlot);

    this.userPatterns = {
      preferredCategories,
      activeTimeSlots,
      categoryUsageFrequency: categoryUsage,
    };

    return this.userPatterns;
  }

  getRecommendations(): string[] {
    if (!this.userPatterns) {
      return [];
    }

    const recommendations: string[] = [];

    // Category-based recommendations
    if (this.userPatterns.preferredCategories.length > 0) {
      recommendations.push(
        `You frequently use ${this.userPatterns.preferredCategories[0]} bookmarks. Consider organizing similar content in this category.`
      );
    }

    // Time-based recommendations
    if (this.userPatterns.activeTimeSlots.length > 0) {
      recommendations.push(
        `You're most active at ${this.userPatterns.activeTimeSlots[0]}. Consider scheduling bookmark organization during this time.`
      );
    }

    return recommendations;
  }
}

export const adaptiveLearning = AdaptiveLearningSystem.getInstance();