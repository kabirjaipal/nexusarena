# Jaipal Esports - Gaming Green Color Guide

## 🎨 Color Scheme Overview

Your Jaipal Esports platform now uses a **Gaming Green** color scheme that emphasizes energy, growth, and positive gaming experiences while maintaining professional trust for payment processing and user management.

## 🎯 Primary Colors

### Main Theme Colors
- **Primary**: Gaming Green (`oklch(0.65 0.25 140)`) - Main brand color
- **Accent**: Electric Purple (`oklch(0.7 0.25 280)`) - Secondary brand color
- **Background**: Deep Black (`oklch(0.1 0 0)`) - Main background
- **Foreground**: Pure White (`oklch(0.98 0 0)`) - Main text color

### Status Colors
- **Success**: Bright Green (`oklch(0.6 0.2 120)`) - Success states
- **Warning**: Bright Yellow (`oklch(0.8 0.25 60)`) - Warning states
- **Destructive**: Bright Red (`oklch(0.65 0.25 20)`) - Error states

## 🎮 Game-Specific Colors

Use these colors to represent different games in your tournaments:

```css
/* PUBG */
.text-pubg, .bg-pubg, .border-pubg
color: oklch(0.6 0.2 200) /* PUBG Blue */

/* Free Fire */
.text-freefire, .bg-freefire, .border-freefire
color: oklch(0.65 0.25 140) /* Free Fire Green (matches primary) */

/* BGMI */
.text-bgmi, .bg-bgmi, .border-bgmi
color: oklch(0.7 0.2 60) /* BGMI Orange */

/* Valorant */
.text-valorant, .bg-valorant, .border-valorant
color: oklch(0.55 0.2 20) /* Valorant Red */

/* CS2 */
.text-cs2, .bg-cs2, .border-cs2
color: oklch(0.5 0.15 180) /* CS2 Cyan */
```

## ✨ Special Effects

### Glow Effects
Add energetic glow effects to important elements:

```css
.glow-primary    /* Gaming green glow */
.glow-accent     /* Electric purple glow */
.glow-success    /* Bright green glow */
.glow-warning    /* Bright yellow glow */
.glow-destructive /* Bright red glow */
```

### Gaming Text Effects
Create dynamic gaming text:

```css
.text-gaming-primary  /* Gaming green text */
.text-gaming-accent   /* Electric purple text */
```

### Gradients
Use these gradients for energetic, dynamic backgrounds:

```css
.bg-gaming-gradient  /* Full gaming gradient */
.bg-primary-gradient /* Primary to accent gradient */
.bg-green-gradient   /* Pure green gradient */
```

### Gaming Borders
Add dynamic border effects:

```css
.border-gaming   /* Gaming green border with glow */
.border-electric /* Electric purple border with glow */
```

### Energy Effects
Add pulsing energy animations:

```css
.energy-pulse    /* Pulsing green energy effect */
```

## 🎯 Usage Examples

### Tournament Cards
```jsx
<Card className="border-gaming glow-primary">
  <CardHeader>
    <CardTitle className="text-gaming-primary">PUBG Championship</CardTitle>
  </CardHeader>
</Card>
```

### Buttons
```jsx
<Button className="bg-primary-gradient glow-primary">
  Join Tournament
</Button>
```

### Game Icons
```jsx
<Gamepad2 className="h-8 w-8 text-pubg" />
```

### Status Badges
```jsx
<Badge className="bg-success glow-success">Registration Open</Badge>
<Badge className="bg-warning glow-warning">Starting Soon</Badge>
<Badge className="bg-destructive glow-destructive">Registration Closed</Badge>
```

### Gaming Elements
```jsx
<div className="bg-green-gradient border-gaming glow-primary energy-pulse p-6 rounded-lg">
  <h2 className="text-gaming-primary">Championship Prize Pool</h2>
  <p className="text-foreground">₹50,000 Total Prize Money</p>
</div>
```

### Free Fire Special
```jsx
<div className="bg-freefire border-freefire glow-primary">
  <h3 className="text-freefire">Free Fire Tournament</h3>
  <p>Perfect match with primary green theme!</p>
</div>
```

## 🌙 Dark Mode

The color scheme automatically adapts to dark mode with enhanced brightness and contrast, maintaining the energetic gaming aesthetic while ensuring excellent readability in low-light environments.

## ♿ Accessibility

All color combinations meet WCAG accessibility standards:
- High contrast ratios for text readability
- Color-blind friendly palette
- Sufficient contrast for interactive elements

## 🚀 Implementation Tips

1. **Use semantic colors**: Prefer `text-primary` over `text-green-500`
2. **Add glow effects sparingly**: Use for important CTAs and highlights
3. **Game colors**: Use game-specific colors for tournament cards and game icons
4. **Consistent theming**: All shadcn/ui components automatically use the new colors
5. **Dark mode**: Test both light and dark modes for optimal user experience
6. **Energy effects**: Use pulsing animations for live tournaments and active elements
7. **Free Fire synergy**: Free Fire green matches your primary color perfectly!

## 🎨 Color Psychology

- **Gaming Green**: Energy, growth, success, positive gaming experiences, nature
- **Electric Purple**: Creativity, gaming energy, premium feel, innovation
- **Deep Black**: Focus, sophistication, reduces eye strain during gaming
- **Pure White**: Clarity, clean interface, professional trust
- **Bright Green**: Success, growth, positive actions, money, achievement
- **Bright Red**: Urgency, important alerts, destructive actions, danger

This color scheme creates the perfect balance between energetic gaming appeal and professional trust needed for your esports platform!
