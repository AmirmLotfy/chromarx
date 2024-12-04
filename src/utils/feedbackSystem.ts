type FeedbackType = 'category' | 'summary' | 'suggestion' | 'settings' | 'feature' | 'bug' | 'other';
type FeedbackScore = 1 | 2 | 3 | 4 | 5;

interface Feedback {
  type: FeedbackType;
  score: FeedbackScore;
  message: string;
  timestamp: number;
}

class FeedbackSystem {
  private feedback: Feedback[] = [];
  private storageKey = 'feedback_data';

  constructor() {
    this.loadFeedback();
  }

  private loadFeedback() {
    const storedFeedback = localStorage.getItem(this.storageKey);
    if (storedFeedback) {
      this.feedback = JSON.parse(storedFeedback);
    }
  }

  private saveFeedback() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.feedback));
  }

  addFeedback(type: FeedbackType, score: FeedbackScore, message: string) {
    const newFeedback: Feedback = {
      type,
      score,
      message,
      timestamp: Date.now(),
    };
    this.feedback.push(newFeedback);
    this.saveFeedback();
  }

  getFeedbackStats() {
    const stats: Record<FeedbackType, { total: number; average: number }> = {
      category: { total: 0, average: 0 },
      summary: { total: 0, average: 0 },
      suggestion: { total: 0, average: 0 },
      settings: { total: 0, average: 0 },
      feature: { total: 0, average: 0 },
      bug: { total: 0, average: 0 },
      other: { total: 0, average: 0 },
    };

    this.feedback.forEach((item) => {
      const typeStats = stats[item.type];
      typeStats.total++;
      typeStats.average = (typeStats.average * (typeStats.total - 1) + item.score) / typeStats.total;
    });

    return stats;
  }

  getAllFeedback() {
    return this.feedback;
  }

  clearFeedback() {
    this.feedback = [];
    this.saveFeedback();
  }
}

export const feedbackSystem = new FeedbackSystem();