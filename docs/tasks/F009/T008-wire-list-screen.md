# Task T008: Wire ShareListModal into list-screen and update navigation params

## Feature
F009 - Share List

## Description
Update navigation types to pass `ownerId` to the List screen, update `main-screen.tsx` to pass it when navigating, and update `list-screen.tsx` to show a "Share" option in the ellipsis menu (only for the owner) and render `ShareListModal`.

## Files
- `mobile/navigation/types.ts` (modify)
- `mobile/features/lists/ui/main-screen.tsx` (modify)
- `mobile/features/lists/ui/list-screen.tsx` (modify)

## Implementation Steps

### 1. Update navigation types
In `mobile/navigation/types.ts`, add `ownerId` to the `List` screen params:
```ts
export type RootStackParamList = {
  Main: undefined;
  List: { listId: string; listName: string; ownerId: string };
};
```

### 2. Update main-screen to pass ownerId
In `mobile/features/lists/ui/main-screen.tsx`, update the `onPress` in `renderItem` to pass `ownerId`:
```ts
onPress={() => navigation.navigate('List', { listId: item.id, listName: item.name, ownerId: item.owner_id })}
```

### 3. Update list-screen

a. Add `CURRENT_USER_ID` constant at the top of the file (below imports):
```ts
const CURRENT_USER_ID = 'user-1';
```

b. Destructure `ownerId` from `route.params`:
```ts
const { listId, ownerId } = route.params;
```

c. Add `shareModalVisible` state:
```ts
const [shareModalVisible, setShareModalVisible] = useState(false);
```

d. Update `handleEllipsisPress` to include a "Share" option when the current user is the owner:
```ts
function handleEllipsisPress() {
  const isOwner = CURRENT_USER_ID === ownerId;
  const options: { text: string; onPress?: () => void; style?: 'cancel' | 'destructive' | 'default' }[] = [];

  if (isOwner) {
    options.push({ text: 'Share', onPress: () => setShareModalVisible(true) });
  }
  options.push({ text: 'Clear Completed', onPress: () => clearCompleted() });
  options.push({ text: 'Cancel', style: 'cancel' });

  Alert.alert('List Actions', undefined, options);
}
```

e. Import `ShareListModal` and add it at the end of the JSX return, just before the closing `</KeyboardAvoidingView>` tag:
```tsx
import ShareListModal from '../../list-users/ui/share-list-modal';

// Inside return, before </KeyboardAvoidingView>:
<ShareListModal
  visible={shareModalVisible}
  onClose={() => setShareModalVisible(false)}
  listId={listId}
  listOwnerId={ownerId}
  currentUserId={CURRENT_USER_ID}
/>
```

## Constraints
- `CURRENT_USER_ID` must match the constant already used in `main-screen.tsx` (`'user-1'`)
- "Share" option only appears in the Alert when `CURRENT_USER_ID === ownerId`
- Do not change the existing "Clear Completed" or "Cancel" options
- Do not modify any file outside the three listed above

## Acceptance Criteria
- TypeScript compiles with no errors after `ownerId` is added to navigation params
- Navigating to a list screen still works correctly
- Ellipsis menu shows "Share" option only when `CURRENT_USER_ID === ownerId`
- Tapping "Share" opens `ShareListModal`
- "Clear Completed" and "Cancel" still work as before

## Test Steps
1. Start app on a list owned by user-1
2. Tap the ellipsis (•••) — "Share" should appear above "Clear Completed"
3. Tap "Share" — `ShareListModal` slides up
4. Close modal — list screen is unaffected
5. If testing with a non-owner list (not possible with current seed data, skip if N/A)

## Notes
`CURRENT_USER_ID` is duplicated from `main-screen.tsx` intentionally — no shared constant is introduced until an auth feature is implemented.
