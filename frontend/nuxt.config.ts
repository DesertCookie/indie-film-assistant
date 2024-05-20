// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devServer: {
		port: 3005
	},
	devtools: {
		enabled: true,
		timeline: {
			enabled: true
		}
	},
	runtimeConfig: {
		public: {
			buildTime: new Date().toISOString(),
			appVersion: '0.0.1-alpha',
			// API_URL: process.env.API_URL
		}
	},
	ssr: false, // disabled since nuxt-permissions doesn't support SSR
	modules: [
		'@nuxt/ui',
		'@nuxtjs/html-validator',
		'@nuxtjs/tailwindcss',
		"@nuxt/fonts",
		'@nuxt/image',
		'nuxt-icon',
		'nuxt-permissions',
		'@pinia/nuxt',
		'@pinia-plugin-persistedstate/nuxt',
		'@formkit/auto-animate/nuxt',
		'@formkit/nuxt',
	],
	build: {
		transpile: ['pinia-plugin-persistedstate'],
	},
	css: [
		'@/assets/reset.scss',
		'@/assets/global.scss',
	],
	image: {
		quality: 75,
		format: ['webp'],
		screens: {
			'xs': 64,
			's': 256,
			'm': 512,
			'l': 1024,
			'xl': 2048
		}
	},
	piniaPersistedstate: {
		cookieOptions: {
			sameSite: 'strict',
			secure: true,
			maxAge: 60 * 60 * 24 * 30 // 30 days
		},
		storage: 'cookies'
	},
})