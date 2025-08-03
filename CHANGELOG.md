## [0.1.0] - 2025-06-29

### Added
- Initial structure for task list web app
- Custom dark mode UI using CSS
- Functionality to add tasks and save them using localStorage
- JavaScript logic in `script.js` to handle UI interactions



## [0.2.0] - 2025-06-30

### Added
- Automatically sets the date on the card based on user's current date.
- Logic added to reflect changes on the next day's card.

### Changed
- UI styling updated to enhance checkbox visibility.



## [0.3.0] - 2025-06-30

### Added
- Task delete functionality to remove individual tasks from the list.
- UI styling updated to enhance checkbox visibility.




## [0.4.0] - 2025-06-30

### Added
- Dropdown in task UI to select task type (UI only, no functionality).
- Button to add images to a task (UI only).

### Changed
- Minor HTML and CSS updates to support new task UI components.




## [0.5.0] - 2025-07-02

### Added
 - Dropdown functionality for selecting task type with JavaScript. 
 - Dynamic update of the selected task type label based on user choice.
 - Accent color indicator that changes to match the selected type.
 - Logic to close dropdown when clicking outside the menu.

### Changed
 - Dropdown behavior logic shifted from pure CSS hover-based to JavaScript-controlled   toggle.




## [0.6.0] - 2025-07-20

### Added
- Image upload feature for tasks with support for image preview via modal.
- Image modal UI for viewing enlarged images (with escape key and background click to close).
- Task type color indicators and badges to visually distinguish task types.

### Changed
- Refactored task structure to include modular task components as objects.
- Updated dropdown and task UI to support image + type badges.




## [0.7.0] - 2025-07-27

### Added

- Course selection dropdown with predefined courses
- Link attachment feature with URL validation modal for adding external links to tasks
- Collapsible task layout with expandable header/content structure

### Changed

- Redesigned form options layout with "Add link" and "Select Course"
- Task display architecture completely redesigned with header/content separation
- Tasks now show minimal information by default (taks type + course name) with detailed view on expansion

### Enhanced

- Task data structure now includes course information and expansion state
- Better organization of task metadata (links, images, actions)
- Improved user experience with less visual clutter and more intuitive interactions





## [0.8.0] - 2025-07-31

### Added
- Firebase integration to enable real-time sync of tasks across devices.
- Included Firebase App and Realtime Database SDK scripts in `index.html`.
- New logic in `script.js` to:
  - Upload tasks (with type, course, image, and link) to Firebase.
  - Fetch and render tasks from Firebase on page load.
  - Delete tasks from Firebase.

### Changed
- Replaced localStorage-based task management with Firebase Realtime Database operations.
- Modularized Firebase-related code in `script.js` for better maintainability.
- Adjusted event logic to ensure UI stays in sync with Firebase data.




## [0.9.0] - 2025-08-03

### Added
- Full course names along with course code displayed in dropdown 

### Changed
- Refined CSS to prevent course labels from resizing and wrapping
- Added text-overflow ellipsis to keep label size consistent

### Fixed
- Global toggle bug: previously, toggling one task's checkbox affected all users
- Now toggles are local-only and no longer synced to Firebase




## [0.9.1] - 2025-08-03

### Added
- Alert modal with warning icon to prompt user when task is added without description