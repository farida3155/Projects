window.addEventListener('scroll', function () {
    const ticker = document.querySelector('.news-ticker');
    const nav = document.querySelector('.nav');
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      ticker.style.transform = 'translateY(-100%)';
      nav.style.transform = 'translate(-50%, -100%)';
    } else {
      ticker.style.transform = 'translateY(0)';
      nav.style.transform = 'translate(-50%, 0)';
    }
  });
  