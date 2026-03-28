<script lang="ts">
	let { onSwipeLeft, onSwipeRight, children }: {
		onSwipeLeft?: () => void;
		onSwipeRight?: () => void;
		children: any;
	} = $props();

	let touchStartX = $state(0);
	let touchEndX = $state(0);
	let lastSwipeTime = $state(0);

	const SWIPE_THRESHOLD = 100;
	const DEBOUNCE_TIME = 500;

	const handleTouchStart = (e: TouchEvent) => {
		touchStartX = e.changedTouches[0].screenX;
	};

	const handleTouchEnd = (e: TouchEvent) => {
		touchEndX = e.changedTouches[0].screenX;
		handleSwipe();
	};

	const handleSwipe = () => {
		const now = Date.now();
		if (now - lastSwipeTime < DEBOUNCE_TIME) return;

		const swipeDistance = touchEndX - touchStartX;

		if (swipeDistance > SWIPE_THRESHOLD) {
			onSwipeRight?.();
			lastSwipeTime = now;
		} else if (swipeDistance < -SWIPE_THRESHOLD) {
			onSwipeLeft?.();
			lastSwipeTime = now;
		}
	};
</script>

<div
	ontouchstart={handleTouchStart}
	ontouchend={handleTouchEnd}
	class="contents"
>
	{@render children()}
</div>
