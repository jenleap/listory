# Task T006: SectionHeader UI Component

## Feature
F006 - Create Section

## Description
Create the `SectionHeader` React Native component that renders a section name as a list header row.

## Files
- `mobile/features/sections/ui/section-header.tsx` (create)

## Implementation Steps
1. Create directory `mobile/features/sections/ui/`
2. Create `section-header.tsx` with the following:

**Props**
```ts
type Props = {
  name: string;
};
```

**Render**
- A `View` with a bottom border (hairline, `#ddd`)
- A `Text` displaying the section name
- Style: uppercase or bold to distinguish from item rows; use `#555` color, font size 13, `paddingHorizontal: 16`, `paddingVertical: 10`, `backgroundColor: '#f5f5f5'`

**Example structure**
```tsx
export default function SectionHeader({ name }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
    </View>
  );
}
```

## Constraints
- Use React Native primitives only (View, Text, StyleSheet)
- No interactive behavior — display only
- Follow the styling patterns in `mobile/features/items/ui/item-row.tsx`

## Acceptance Criteria
- Section name is displayed in the header row
- Component is visually distinct from item rows
- No TypeScript errors

## Test Steps
1. TypeScript compiles with no errors
2. Component renders in the list screen (verified in T007)
