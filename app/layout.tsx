import '@/css/style.css';
import type { ReactNode } from 'react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Metadata, Viewport } from 'next';

// Typo und CSS einbinden
import { Inter, Roboto } from 'next/font/google';

export const metadata: Metadata = {
	title: 'Next project - Balligh',
	description: 'Eine Next Seite mit Vereinssuche',
	icons: [{ url: 'favicon.ico', type: 'image/x-icon' }],
};

const roboto = Roboto({
	subsets: ['latin'],
	weight: ['100', '400', '700', '900'],
	style: ['normal', 'italic'],
	display: 'swap',
	variable: '--font-roboto',
});

const inter = Inter({
	subsets: ['latin'],
	weight: ['100', '400', '700', '900'],
	style: ['normal'],
	display: 'swap',
	variable: '--font-inter',
});

export const viewport: Viewport = {
	themeColor: [
		{ color: 'darkgray', media: '(prefers-color-scheme: light)' },
		{ color: 'lightgray', media: '(prefers-color-scheme: dark)' },
	],
};
export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="de">
			<body className={`${roboto.variable} ${inter.variable}`}>
				<div className="site-wrapper">
					<Header />
					<div className="site-content">{children}</div>
					<Footer />
				</div>
			</body>
		</html>
	);
}
