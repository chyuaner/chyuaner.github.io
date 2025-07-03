export function initPage() {
  const tl = gsap.timeline();

  tl
	.from('#main-avatar', {
    x: -200,
    scale: 0.9,
    opacity: 0,
    duration: 0.8
  })
	.from('#main-content', {
    opacity: 0,
    duration: 0.5
  })
	// .from('#site-title', {
  //   scale: 0.8,
  //   opacity: 0,
  //   duration: 0.5
  // })
  .from('#contact-links', {
    // scale: 0.8,
		y: -10,
    opacity: 0,
    duration: 0.3
  })
  .from('#main-links', {
    // scale: 0.8,
		y: -10,
    opacity: 0,
    duration: 0.3
  });
}
