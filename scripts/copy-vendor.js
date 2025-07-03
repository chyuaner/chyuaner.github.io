import fs from 'fs-extra';

async function copyVendor() {
  await fs.ensureDir('public/vendor');
  await fs.copy('node_modules/@barba/core/dist/barba.umd.js', 'public/vendor/barba.js');
  await fs.copy('node_modules/gsap/dist/gsap.min.js', 'public/vendor/gsap.js');
  console.log('Vendor files copied');
}

copyVendor();
