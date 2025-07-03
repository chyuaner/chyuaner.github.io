import gsap from 'gsap';

export function initPage() {
  gsap.from('h1', {
    scale: 0.8,
    opacity: 0,
    duration: 0.5
  });
}
