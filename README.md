# ChroMarx

A powerful Chrome extension for managing and organizing your bookmarks with AI assistance, leveraging Chrome's built-in AI capabilities for intelligent bookmark management.

## Features

### AI-Powered Organization
- **Smart Categorization**: Automatically suggests categories for bookmarks using Chrome's Language Model API
- **Intelligent Summaries**: Generates concise summaries of bookmarked pages using Chrome's Summarizer API
- **Multi-Language Support**: Translates summaries and categories into multiple languages (English, Spanish, Japanese, French, Arabic, Chinese)
- **AI Chat Assistant**: Interactive chat interface for querying your bookmarks and getting contextual recommendations

### Bookmark Management
- **Advanced Search**: Quick search through titles and URLs
- **Category Filters**: Organize bookmarks by categories with AI suggestions
- **Bulk Actions**: Select multiple bookmarks for batch operations
- **Cleanup Tools**: Find and remove duplicate bookmarks and broken links
- **Smart Sorting**: Sort by date or alphabetically

### Focus & Entertainment Modes
- **Focus Mode**: Filter bookmarks to show only work and education-related content
- **Entertainment Mode**: Quick access to entertainment and leisure bookmarks
- **Privacy Mode**: Hide sensitive bookmark details when sharing your screen

### Sharing & Export
- **Multiple Share Options**: Share bookmarks via WhatsApp or email
- **Summary Sharing**: Share AI-generated summaries of bookmarks
- **Bulk Export**: Export multiple bookmarks at once

## Technical Details

### Chrome AI Integration
- **Language Model API**: Used for bookmark categorization and chat interactions
- **Summarizer API**: Generates concise summaries of bookmarked content
- **Translation API**: Provides multi-language support across the extension

### Technologies Used
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Components**: shadcn/ui for consistent design
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React Query for efficient data handling
- **Icons**: Lucide React for modern iconography

### AI Models & Capabilities
- Chrome's built-in Language Model for natural language processing
- Chrome's Summarizer for content summarization
- Chrome's Translation model for multi-language support
- All AI processing happens locally on your device

## Requirements
- Chrome version 128 or higher
- Chrome's built-in AI capabilities enabled
- Sufficient device resources for AI model processing

## Privacy & Security
- All AI processing happens locally on your device
- No data is sent to external servers
- Privacy mode available for sensitive bookmarks
- Bookmark data stays within your Chrome browser

## Installation
1. Install from the Chrome Web Store
2. Enable Chrome's AI capabilities if not already enabled
3. Start organizing your bookmarks with AI assistance

## Development
```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Create extension bundle
node scripts/build-extension.js
```

## Credits
Created by [Amir Lotfy](https://amirlotfy.com)

## License
MIT License - feel free to use and modify as needed.