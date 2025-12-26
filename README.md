# Spots Final Stage

### Overview

- Intro
- Figma
- Images
- Technologies/Techniques

**Intro**

This project is made so that web deployment occurs with API server integration, along functionality discused in technologies/techniques. In addition, updates/changes made to match figma design.

Please follow the link if you'd like to watch a video of me briefly describing the project. https://drive.google.com/file/d/1CecgOztFe9-E0NnzvrOpn56BnO9KJQoy/view?usp=share_link

Here is a link to the project itself. https://jmmh3191.github.io/se_project_spots/

**Figma**

- [Link to the project on Figma](https://www.figma.com/design/mXGZ6wZ4QPKx5KjpHX9QCV/Sprint-9-Project--Spots?node-id=4248-1152&t=MWLuOw4uGednAXK8-0)

For layout of content, the diminsions were derived from the 1440px and mobile examples provided on Figma.

**Images**

To optimize images, (https://tinypng.com/), was used to load images faster on the page.

**Technologies/Techniques**

## API Integration & Data Management

- RESTful API Integration: Connected to Tripleten's backend API for full CRUD operations
- Promise-based Architecture: Used .then()/.catch() chains for asynchronous operations
- Concurrent Data Fetching: Implemented getAppInfo() to fetch user profile and cards simultaneously
- Error Handling: Comprehensive error catching and user feedback throughout API calls

## Modern JavaScript Techniques

- ES6 Modules: Modular code structure with imports/exports
- Class-based API: Custom Api class for organized server communication
- Destructuring: Used in API responses and function parameters
- Template Literals: For dynamic content generation
- Arrow Functions: Modern syntax throughout event handlers

## Dynamic DOM Manipulation

- Template Cloning: Used <template> elements with cloneNode(true) for efficient card creation
- Event Delegation: Proper event listener management with cleanup
- Dynamic Content Updates: Real-time UI updates reflecting server state
- Conditional Rendering: Like states, avatar placeholders, and user-specific content

## User Experience Enhancements

- Loading States: Custom renderLoading() function for button feedback during API calls
- Modal System: Comprehensive modal management with keyboard/click-outside closing
- Form Validation: Integrated validation with dynamic button states
- Optimistic UI Updates: Immediate visual feedback with server sync

## State Management

- Global State Tracking: currentUser and selected card management
- Persistent Data: All changes saved to server and persist across sessions
- Like Status Synchronization: Real-time like/unlike with server state management
