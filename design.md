# design.md

# OneStop AI - Design System & UI/UX Guidelines

Version: 1.0

---

# Design Philosophy

OneStop AI should feel:

- Modern
- Clean
- Professional
- Friendly
- Trustworthy
- Minimal
- Accessible
- Student-focused

The interface should reduce cognitive load by presenting information in a clear and organized way.

---

# Design Principles

- Keep the interface simple.
- Prioritize readability.
- Use consistent spacing.
- Minimize unnecessary animations.
- Guide users with clear visual hierarchy.
- Ensure responsive layouts across all devices.
- Follow accessibility best practices (WCAG).

---

# Theme

Primary Theme

Modern AI + Education + Productivity

Design Style

- Minimal
- Soft Shadows
- Rounded Components
- Clean Cards
- Light Gradients
- Spacious Layout
- Smooth Animations

---

# Color Palette

## Primary

Blue 600

HEX: #2563EB

Purpose

- Primary Buttons
- Active Navigation
- Links
- Icons

---

## Secondary

Indigo 500

HEX: #6366F1

Purpose

- AI Features
- Highlights
- Recommendation Cards

---

## Accent

Emerald 500

HEX: #10B981

Purpose

- Success Messages
- Completed Roadmaps
- Progress Indicators

---

## Warning

Amber 500

HEX: #F59E0B

Purpose

- Alerts
- Pending Tasks

---

## Error

Red 500

HEX: #EF4444

Purpose

- Validation Errors
- Failed Operations

---

## Background

Light

#F8FAFC

Dark

#0F172A

---

## Surface Cards

Light

#FFFFFF

Dark

#1E293B

---

## Borders

Light

#E2E8F0

Dark

#334155

---

## Text

Primary

#0F172A

Secondary

#475569

Muted

#94A3B8

White

#FFFFFF

---

# Dark Mode

Support

Yes

Switch

System Default

Manual Toggle

Enabled

Dark Background

#0F172A

Cards

#1E293B

Text

#F8FAFC

---

# Typography

Primary Font

Inter

Fallback

system-ui, sans-serif

Usage

- UI
- Buttons
- Forms
- Cards

---

Secondary Font

Poppins

Usage

- Hero Titles
- Landing Page
- Marketing Sections

---

Monospace

JetBrains Mono

Usage

- Code Blocks
- API Keys
- Technical Content

---

# Font Sizes

Display

48px

Hero Heading

40px

Page Title

32px

Section Title

24px

Card Title

20px

Body Large

18px

Body

16px

Small

14px

Caption

12px

---

# Font Weight

Regular

400

Medium

500

SemiBold

600

Bold

700

---

# Spacing System

Base Unit

8px

Spacing Scale

4px

8px

12px

16px

24px

32px

48px

64px

96px

---

# Border Radius

Small

8px

Medium

12px

Large

16px

Extra Large

24px

Buttons

12px

Cards

16px

Input Fields

12px

---

# Shadows

Card

Soft Shadow

Hover

Medium Shadow

Modal

Large Shadow

No heavy shadows.

---

# Buttons

Primary

Background

Blue

Text

White

Radius

12px

Hover

Darker Blue

---

Secondary

White Background

Blue Border

Blue Text

---

Danger

Red

---

Success

Green

---

Disabled

Gray

---

# Icons

Library

Lucide React

Style

Outlined

Size

20px

24px

32px

Use icons only when they improve clarity.

---

# Layout

Maximum Width

1280px

Container

Centered

Responsive

Mobile First

---

# Grid System

Desktop

12 Columns

Tablet

8 Columns

Mobile

4 Columns

---

# Navigation

Desktop

Left Sidebar

Top Header

Mobile

Bottom Navigation

Hamburger Menu

---

# Cards

Cards should contain

- Title
- Description
- Icon
- CTA Button

Padding

24px

Border Radius

16px

Hover

Lift + Shadow

---

# Forms

Input Height

48px

Rounded

12px

Validation

Inline Error Messages

Required Fields

Clearly Marked

---

# Dashboard Components

- Welcome Card
- Progress Card
- Career Recommendation
- Learning Roadmap
- Skills Overview
- Assessment Score
- Resume Score
- AI Suggestions
- Recent Activity

---

# Charts

Library

Recharts

Charts

- Progress Line Chart
- Skill Radar Chart
- Pie Chart
- Bar Chart

Use animations sparingly.

---

# Tables

Features

- Search
- Sort
- Pagination
- Sticky Header

---

# Notifications

Toast Position

Top Right

Duration

3 Seconds

Success

Green

Warning

Amber

Error

Red

---

# Loading States

Use

- Skeleton Loader
- Spinner
- Progress Bar

Avoid blank screens.

---

# Animations

Library

Framer Motion

Duration

200–300ms

Allowed

- Fade
- Slide
- Scale
- Hover

Avoid

- Flashing
- Long Animations
- Excessive Motion

---

# Accessibility

Minimum Contrast Ratio

4.5:1

Keyboard Navigation

Supported

Focus Indicators

Visible

Alt Text

Required

ARIA Labels

Required where appropriate

---

# Responsive Breakpoints

Mobile

0–639px

Tablet

640–1023px

Laptop

1024–1279px

Desktop

1280px+

---

# UI Components

Common Components

- Button
- Input
- Select
- Checkbox
- Radio
- Switch
- Badge
- Alert
- Card
- Modal
- Drawer
- Avatar
- Tooltip
- Progress Bar
- Tabs
- Breadcrumb
- Pagination
- Skeleton
- Toast
- Spinner

All components should be reusable.

---

# Recommended Libraries

UI Components

- shadcn/ui

Styling

- Tailwind CSS

Icons

- Lucide React

Animations

- Framer Motion

Forms

- React Hook Form

Validation

- Zod

Charts

- Recharts

Notifications

- Sonner

Date Picker

- React Day Picker

---

# UX Rules

Always

- Show loading states.
- Confirm destructive actions.
- Display clear validation messages.
- Keep navigation consistent.
- Highlight active menu items.
- Use empty-state illustrations.
- Save user progress automatically where possible.

Never

- Surprise users with unexpected behavior.
- Hide important actions.
- Use more than two primary actions on a screen.
- Overload pages with too much information.
- Depend only on color to communicate status.

---

# Branding

Logo Style

Modern

Simple

AI + Graduation Cap + Compass Concept

App Name

OneStop AI

Tagline

Your Personalized Career & Education Advisor

---

# Future Enhancements

- Glassmorphism (limited use)
- AI Assistant Floating Widget
- Personalized Themes
- Multi-language Support
- Motion Preferences
- High Contrast Mode
- Mobile App Design System

---

# Final Design Goal

Every screen should answer three questions instantly:

1. Where am I?
2. What can I do here?
3. What should I do next?

The interface should help students make confident decisions without overwhelming them.