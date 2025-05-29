# ChatBot Component Breakdown Plan

## Current Issues
- Single file with 400+ lines
- Multiple responsibilities mixed together
- Hard to test individual features
- Difficult to maintain and extend

## Proposed Structure

### 1. Hooks (Custom React Hooks)
```
app/components/layout/ChatBot/hooks/
├── useChatState.js          # Chat messages, typing, suggestions state
├── useChatActions.js        # Message sending, service lookup actions  
├── useServiceContext.js     # Service detection and context management
├── useChatPersistence.js    # Save/restore conversation functionality
├── useChatKeyboard.js       # Keyboard shortcuts (ESC, etc.)
├── useChatUI.js            # UI state (open/close, screen size)
└── index.js                # Export all hooks
```

### 2. Components (Smaller UI Components)
```
app/components/layout/ChatBot/components/
├── ChatContainer.jsx        # Main chat container with animations
├── ChatHeader.jsx          # Header with title, service context, close button
├── ChatMessages.jsx        # Messages display area
├── ChatInput.jsx           # Input field and send functionality
├── QuickPrompts.jsx        # Suggestion buttons
├── FloatingButton.jsx      # Chat trigger button
├── ServiceIndicator.jsx    # Current service context display
├── ConversationInsights.jsx # Deep conversation badges
└── index.js               # Export all components
```

### 3. Utils (Business Logic)
```
app/components/layout/ChatBot/utils/
├── messageProcessor.js      # Process user messages and generate responses
├── conversationManager.js   # Manage conversation state and history
├── serviceDetector.js       # Enhanced service detection logic
├── responseGenerator.js     # Generate contextual responses
├── suggestionEngine.js      # Generate contextual prompts
└── index.js                # Export all utilities
```

### 4. Constants & Config
```
app/components/layout/ChatBot/config/
├── animations.js           # Framer motion variants
├── constants.js           # UI constants, timeouts, etc.
├── styles.js             # Styled components or style objects
└── index.js              # Export all config
```

### 5. Main ChatBot Component
```
app/components/layout/ChatBot/
├── index.jsx              # Main component (50-80 lines)
├── ChatBot.jsx           # Alternative main component name
└── README.md             # Component documentation
```

## Benefits of This Structure

### Maintainability
- Each file has a single responsibility
- Easier to locate and fix bugs
- Simpler to add new features

### Testability  
- Individual hooks and utilities can be unit tested
- Components can be tested in isolation
- Better test coverage possibilities

### Reusability
- Hooks can be reused in other chat components
- UI components can be used independently
- Utilities can be shared across the app

### Developer Experience
- Clearer code organization
- Easier onboarding for new developers
- Better IDE navigation and IntelliSense

## Implementation Strategy

### Phase 1: Extract Hooks
1. Create `useChatState` for state management
2. Create `useChatActions` for user actions
3. Create `useServiceContext` for service logic
4. Create `useChatPersistence` for save/restore

### Phase 2: Extract Components
1. Break out `ChatContainer` with layout logic
2. Enhance existing `ChatHeader`, `ChatMessages`, `ChatInput`
3. Create `ServiceIndicator` for context display
4. Create `ConversationInsights` for engagement tracking

### Phase 3: Extract Business Logic
1. Move message processing to `messageProcessor.js`
2. Move service detection to `serviceDetector.js`
3. Move response generation to `responseGenerator.js`
4. Create `suggestionEngine.js` for dynamic prompts

### Phase 4: Refactor Main Component
1. Import and compose all hooks and components
2. Keep only high-level orchestration logic
3. Add proper error boundaries
4. Optimize performance with React.memo

## File Size Targets
- Main ChatBot component: 50-80 lines
- Individual hooks: 30-100 lines each
- UI components: 20-80 lines each
- Utility files: 50-150 lines each

This structure will make the codebase much more maintainable and easier to work with!