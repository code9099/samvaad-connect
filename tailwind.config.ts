import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Enhanced Indian Tricolor Theme Colors
				saffron: {
					DEFAULT: 'hsl(var(--saffron))',
					light: 'hsl(var(--saffron-light))',
					dark: 'hsl(var(--saffron-dark))',
					glow: 'hsl(var(--saffron-glow))'
				},
				green: {
					DEFAULT: 'hsl(var(--green))',
					light: 'hsl(var(--green-light))',
					dark: 'hsl(var(--green-dark))',
					glow: 'hsl(var(--green-glow))'
				},
				navy: {
					DEFAULT: 'hsl(var(--navy))',
					light: 'hsl(var(--navy-light))',
					muted: 'hsl(var(--navy-muted))'
				},
				gold: {
					DEFAULT: 'hsl(var(--gold))',
					light: 'hsl(var(--gold-light))'
				},
				'white-warm': 'hsl(var(--white-warm))',
				'white-cream': 'hsl(var(--white-cream))',
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))'
				},
				info: {
					DEFAULT: 'hsl(var(--info))',
					foreground: 'hsl(var(--info-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			fontFamily: {
				'poppins': ['Poppins', 'sans-serif'],
				'inter': ['Inter', 'sans-serif'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				'saffron': 'var(--shadow-saffron)',
				'green': 'var(--shadow-green)',
				'elegant': 'var(--shadow-elegant)',
				'card': 'var(--shadow-card)',
				'floating': 'var(--shadow-floating)',
				'glow': 'var(--shadow-glow)',
			},
			backgroundImage: {
				'tricolor': 'var(--gradient-tricolor)',
				'header': 'var(--gradient-header)',
				'saffron': 'var(--gradient-saffron)',
				'green': 'var(--gradient-green)',
				'card': 'var(--gradient-card)',
				'glass': 'var(--gradient-glass)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'chat-bubble-enter': {
					'0%': { opacity: '0', transform: 'translateY(16px) scale(0.95)' },
					'100%': { opacity: '1', transform: 'translateY(0) scale(1)' }
				},
				'modal-enter': {
					'0%': { opacity: '0', transform: 'translateY(32px) scale(0.95)' },
					'100%': { opacity: '1', transform: 'translateY(0) scale(1)' }
				},
				'waveform': {
					'0%': { transform: 'scaleY(0.3)' },
					'100%': { transform: 'scaleY(1)' }
				},
				'status-pulse': {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.05)' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'chat-bubble-enter': 'chat-bubble-enter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
				'modal-enter': 'modal-enter 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
				'waveform': 'waveform 1.5s ease-in-out infinite alternate',
				'status-pulse': 'status-pulse 2s ease-in-out infinite',
				'fade-in': 'fade-in 0.3s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
