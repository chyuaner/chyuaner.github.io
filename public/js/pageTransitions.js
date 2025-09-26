export const defaultTransition = {
  name: 'fade-footer',
  async leave(data) {
        await Promise.all([
					gsap.to(data.current.container, {
						opacity: 0,
						y: 20,
						duration: 0.4,
						ease: 'power2.out'
					}),
					gsap.to('footer', {
						y: 0,
						opacity: 0.5,
						duration: 0.4,
						ease: 'power2.out'
					}),
					// gsap.to('.bg-fancy', {
					// 	opacity: 0,
					// 	duration: 0.4,
					// 	ease: 'none'
					// })
				]);
      },
      enter(data) {
				// gsap.fromTo('.bg-fancy', {
				// 	opacity: 0,
				// }, {
				// 	opacity: 1,
				// 	duration: 0.4,
				// 	ease: 'none'
				// });
        gsap.from(data.next.container, {
					opacity: 0,
					y: 20,
					duration: 0.4,
					ease: 'power2.out'
				});
				gsap.fromTo('footer', {
					y: 0,
					opacity: 0.5
				}, {
					y: 0,
					opacity: 1,
					duration: 0.4,
					ease: 'power2.out'
				});
      }
};
