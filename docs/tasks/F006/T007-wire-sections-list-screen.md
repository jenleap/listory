# Task T007: Wire Sections into ListScreen

## Feature
F006 - Create Section

## Description
Update `ListScreen` to use `useSections`, render existing section headers, and support inline section creation with save-on-blur behavior.

## Files
- `mobile/features/lists/ui/list-screen.tsx`

## Implementation Steps

### 1. Import useSections and SectionHeader
Add imports:
```ts
import { useSections } from '../../sections/hooks/use-sections';
import SectionHeader from '../../sections/ui/section-header';
```

### 2. Call useSections in the component
```ts
const { sections, error: sectionError, addSection } = useSections(listId);
```

### 3. Add inline section creation state
```ts
const [isAddingSection, setIsAddingSection] = useState(false);
const [sectionInputText, setSectionInputText] = useState('');
const sectionInputRef = useRef<TextInput>(null);
```

### 4. Add "Add Section" button
Render a button below the item list (above the item input bar) that sets `isAddingSection = true` and focuses `sectionInputRef`.

### 5. Inline section input
When `isAddingSection` is true, render a `TextInput` (auto-focused) for the section name:
- `onBlur`: call `addSection(sectionInputText.trim())`, then reset `isAddingSection = false` and `setSectionInputText('')`
- `onSubmitEditing`: blur the input (which triggers `onBlur`)
- If the input is empty on blur → `addSection` will discard (service returns error, hook does not add) — the UI simply hides the input regardless

### 6. Render section headers in the list
Above the `FlatList`, build a combined data array that interleaves section headers and items. Sections without items still render their header.

Use a flat data structure for the `FlatList`:
```ts
type ListRow =
  | { type: 'section'; section: Section }
  | { type: 'item'; item: Item };
```

Build `rows: ListRow[]` by:
1. First, append all unsectioned items (where `section_id === null`)
2. Then, for each section in order, append `{ type: 'section', section }` followed by items where `section_id === section.id`

Render each row accordingly in `renderItem`.

### 7. Display sectionError
Show `sectionError` alongside the existing `error` display (or replace the single error state with both).

## Constraints
- Do not remove or break existing item add/edit/delete behavior
- `isAddingSection` input must auto-focus when shown
- Section input auto-dismisses (does not block) if name is empty
- Follow existing StyleSheet patterns

## Acceptance Criteria
- Existing item functionality is unaffected
- "Add Section" button appears on the list screen
- Tapping it shows an auto-focused inline text input
- Blurring with a valid, unique name creates and renders the section header immediately
- Blurring with an empty name discards the input silently
- Blurring with a duplicate name shows an error and discards the input
- Section headers appear above their items in the list

## Test Steps
1. Open a list screen
2. Tap "Add Section", type a name, blur → section header appears at bottom of list
3. Tap "Add Section" again, leave blank, blur → no section created, no error visible
4. Tap "Add Section" again, type the same name → error shown, no duplicate section
5. Existing add/edit/delete item flows work as before
