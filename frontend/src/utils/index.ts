// Utility functions directory
// Shared helper functions will be added here.
// Examples:
//   formatDate()
//   capitalize()
//   debounce()

export function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ');
}
