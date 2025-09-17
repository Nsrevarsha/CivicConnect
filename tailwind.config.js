/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom brown and yellow theme - no gradients
        primary: {
          DEFAULT: '#654321', // Dark brown
          50: '#F5F5DC',     // Beige
          100: '#DEB887',    // Burlywood
          200: '#D2B48C',    // Tan
          300: '#BC8F8F',    // Rosy brown
          400: '#A0522D',    // Sienna
          500: '#8B4513',    // Saddle brown
          600: '#654321',    // Dark brown
          700: '#5D4037',    // Brown
          800: '#4E342E',    // Dark brown
          900: '#3E2723',    // Dark brown
        },
        secondary: {
          DEFAULT: '#FFFF00', // Lemon yellow
          50: '#FFFFF0',     // Ivory
          100: '#FFFACD',    // Lemon chiffon
          200: '#FAFAD2',    // Light goldenrod yellow
          300: '#FFFFE0',    // Light yellow
          400: '#FFFF99',    // Light yellow
          500: '#FFFF66',    // Light yellow
          600: '#FFFF33',    // Yellow
          700: '#FFFF00',    // Lemon yellow
          800: '#FFD700',    // Gold
          900: '#FFA500',    // Orange
        },
        accent: {
          DEFAULT: '#228B22', // Forest green
          50: '#F0FFF0',      // Honeydew
          100: '#98FB98',     // Pale green
          200: '#90EE90',     // Light green
          300: '#32CD32',     // Lime green
          400: '#228B22',     // Forest green
          500: '#006400',     // Dark green
        },
        neutral: {
          DEFAULT: '#F5F5F5', // White smoke
          50: '#FFFFFF',      // White
          100: '#F5F5F5',     // White smoke
          200: '#E5E5E5',     // Light gray
          300: '#D3D3D3',     // Light gray
          400: '#A9A9A9',     // Dark gray
          500: '#808080',     // Gray
          600: '#696969',     // Dim gray
          700: '#556B2F',     // Dark olive green
          800: '#2F4F4F',     // Dark slate gray
          900: '#191970',     // Midnight blue
        },
        // Shadcn/ui compatible colors
        background: '#FFFFFF',
        foreground: '#654321',
        muted: {
          DEFAULT: '#F5F5F5',
          foreground: '#8B4513'
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#654321'
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#654321'
        },
        border: '#E5E5E5',
        input: '#E5E5E5',
        ring: '#D2B48C',
        destructive: {
          DEFAULT: '#FF0000',
          foreground: '#FFFFFF'
        }
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      }
    },
  },
  plugins: [],
}