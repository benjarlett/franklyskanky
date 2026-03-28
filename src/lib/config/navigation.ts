export interface NavItem {
	title: string;
	href: string;
}

export const mainNav: NavItem[] = [
	{ title: 'About me', href: '/about-me' },
	{ title: 'My Family', href: '/my-family' },
	{ title: 'Gasworks Choir', href: '/gasworks-choir' },
	{ title: 'Gasworks Studio', href: '/gasworks-studio' },
	{ title: 'Links', href: '/links' },
	{ title: 'Contact me', href: '/contact' },
	{ title: 'Arrangements', href: '/arrangements' }
];
