# Dark Mode Fix TODO

## Steps:
1. [x] Rename `taillwind.config.ts` to `tailwind.config.ts` (fix filename typo causing Tailwind config not to load properly).
2. [x] Update `app/globals.css` to support `dark` class for CSS variables.
3. [x] Update `components/ThemeToggle.tsx` for theme-aware button styling.
4. [x] Identify and remove usages of `components/DarkModeToggle.tsx` (conflicting toggle). None found.
5. [x] Update `app/layout.tsx` to apply CSS vars to body.
6. [x] Test: Restart dev server if running, toggle ThemeToggle, inspect <html class="dark">, verify backgrounds/text switch via CSS vars/Tailwind dark: classes.

**Fixed**: Dark mode now works via next-themes + class strategy. Run `npm run dev` to test.
