# ChroMarx - AI-Powered Bookmark Manager

A powerful Chrome extension for managing and organizing your bookmarks with AI assistance, leveraging Chrome's built-in AI capabilities for intelligent bookmark management.

## Documentation

- [Bookmarks Tab Features](docs/features/bookmarks.md)
- [Analytics Tab Features](docs/features/analytics.md)
- [AI Zone Tab Features](docs/features/ai-zone.md)
- [Tasks Tab Features](docs/features/tasks.md)
- [Timer Tab Features](docs/features/timer.md)
- [Technologies Overview](docs/technologies.md)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/chromarx
```

2. Install dependencies:
```bash
npm install
```

3. Build the extension:
```bash
npm run build
```

4. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder from the project

## Development

### Prerequisites
- Node.js 16.x or higher
- npm 8.x or higher
- Chrome browser

### Development Workflow
1. Start the development server:
```bash
npm run dev
```
This will:
- Start Vite's development server
- Enable hot module replacement (HMR)
- Watch for file changes
- Automatically rebuild the extension

2. Load the extension in Chrome:
- Go to `chrome://extensions/`
- Enable Developer Mode
- Click "Load unpacked"
- Select the `dist` folder
- After making changes, click the refresh icon in Chrome extensions

### Building for Production
```bash
# Build the extension for production
npm run build

# Create extension bundle (generates .zip file)
node scripts/build-extension.js
```

### Testing
```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run linting
npm run lint
```

### Development Tips
- Use Chrome DevTools for debugging
- Check the console for errors
- Use React DevTools for component inspection
- Test in both light and dark modes
- Verify CSP compliance

## Privacy & Security
- All AI processing happens locally
- No data is sent to external servers
- Bookmark data stays within Chrome
- Optional privacy mode available
- End-to-end encryption for sync
- Secure storage practices

## Browser Support
- Chrome 128 or higher required
- Chrome's AI capabilities must be enabled
- Manifest V3 compliant

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
MIT License - See LICENSE file for details