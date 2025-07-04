export function initPage() {
  const tl = gsap.timeline();

  tl
	.from('h2', {
    opacity: 0,
    duration: 0.8
  })
	// .from('#site-title', {
  //   scale: 0.8,
  //   opacity: 0,
  //   duration: 0.5
  // })
  .from('.card', {
    // scale: 0.8,
		y: -50,
    opacity: 0,
    duration: 0.5,
		stagger: 0.2
  });
}
