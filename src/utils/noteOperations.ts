import { Note } from "@/types/note";
import { generateSummary } from "@/utils/aiUtils";
import { translateText } from "@/utils/translationUtils";
import { SupportedLanguage } from "@/utils/translationUtils";

export const updateNote = (notes: Note[], noteId: string, updates: Partial<Note>): Note[] => {
  return notes.map(note => 
    note.id === noteId ? { ...note, ...updates } : note
  );
};

export const generateNoteSummary = async (
  notes: Note[],
  selectedNotes: Set<string>,
  language: SupportedLanguage
): Promise<string> => {
  try {
    // Combine content from all selected notes
    const selectedContent = notes
      .filter(note => selectedNotes.has(note.id))
      .map(note => `Title: ${note.title}\n\nContent:\n${note.content}`)
      .join('\n\n---\n\n');

    // Generate a comprehensive summary using the AI model
    const summary = await generateSummary(
      `Please provide a comprehensive summary of the following notes, focusing on key points and connections between them:\n\n${selectedContent}`
    );

    // Translate if needed
    if (language !== 'en') {
      return await translateText(summary, language);
    }

    return summary;
  } catch (error) {
    console.error('Error generating summary:', error);
    throw new Error('Failed to generate summary');
  }
};