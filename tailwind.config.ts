import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
	content: ["./src/**/*.tsx"],

	prefix: "tw-",
	important: true,
	theme: {
    extend: {
      colors: {
        primary: "#642488",
        secondary: "#d62daa",
        tertiary: "#76c2d1"
      },
			fontFamily: {
				sans: ["var(--font-sans)", ...fontFamily.sans],
			},
		},
	},
	plugins: [],
} satisfies Config;
