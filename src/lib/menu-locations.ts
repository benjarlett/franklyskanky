export const MENU_LOCATIONS = [
	{ value: 'main', label: 'Main Navigation' },
	{ value: 'homepage', label: 'Homepage' },
	{ value: 'footer', label: 'Footer' }
] as const;

export type MenuLocation = (typeof MENU_LOCATIONS)[number]['value'];
