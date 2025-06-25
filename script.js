document.addEventListener('DOMContentLoaded', async () => {
    // Theme Toggle
    const themeSwitch = document.getElementById('switch');
    const body = document.body;

    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-mode');
        themeSwitch.checked = true;
    }

    themeSwitch.addEventListener('change', () => {
        body.classList.toggle('light-mode');
        const isLightMode = body.classList.contains('light-mode');
        localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
    });

    // Button Animations
    const buttons = document.querySelectorAll('.social-button, .contact-button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-3px)';
            button.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
            button.style.boxShadow = '';
        });

        button.addEventListener('click', (event) => {
            if (button.classList.contains('contact-button')) {
                event.preventDefault();
                const originalBackground = button.style.backgroundColor;
                button.style.backgroundColor = '#28a745';
                button.style.transform = 'scale(0.95)';
                button.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';

                setTimeout(() => {
                    button.style.backgroundColor = originalBackground;
                    button.style.transform = '';
                    button.style.boxShadow = '';
                    window.location.href = button.getAttribute('href');
                }, 300);
            }
        });
    });

    // Lazy Load Background Images
    const banner = document.querySelector('.profile-banner');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                banner.style.backgroundImage = "url('Youssef2.jpg')";
                observer.unobserve(banner);
            }
        });
    });
    observer.observe(banner);

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector(anchor.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Horizontal Gallery Scroll
    const gallery = document.querySelector('.horizontal-gallery');
    const scrollLeftBtn = document.querySelector('.scroll-button.left');
    const scrollRightBtn = document.querySelector('.scroll-button.right');

    const updateScrollButtons = () => {
        scrollLeftBtn.style.display = gallery.scrollLeft <= 0 ? 'none' : 'flex';
        scrollRightBtn.style.display = gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth ? 'none' : 'flex';
    };

    scrollLeftBtn.addEventListener('click', () => {
        gallery.scrollBy({ left: -200, behavior: 'smooth' });
    });

    scrollRightBtn.addEventListener('click', () => {
        gallery.scrollBy({ left: 200, behavior: 'smooth' });
    });

    // Touch scrolling for mobile
    let isDown = false;
    let startX;
    let scrollLeft;

    gallery.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - gallery.offsetLeft;
        scrollLeft = gallery.scrollLeft;
        gallery.style.cursor = 'grabbing';
        gallery.style.scrollBehavior = 'auto';
    });

    gallery.addEventListener('mouseleave', () => {
        isDown = false;
        gallery.style.cursor = 'grab';
    });

    gallery.addEventListener('mouseup', () => {
        isDown = false;
        gallery.style.cursor = 'grab';
        gallery.style.scrollBehavior = 'smooth';
    });

    gallery.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - gallery.offsetLeft;
        const walk = (x - startX) * 2;
        gallery.scrollLeft = scrollLeft - walk;
    });

    gallery.addEventListener('scroll', updateScrollButtons);
    window.addEventListener('load', updateScrollButtons);
    window.addEventListener('resize', updateScrollButtons);

    // Gallery Modal
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <span class="modal-close">&times;</span>
        <img class="modal-content" src="" alt="">
    `;
    document.body.appendChild(modal);

    galleryItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.target.closest('.like-button') || e.target.closest('.like-container')) return;
            const imgSrc = item.querySelector('img').src;
            const imgAlt = item.querySelector('img').alt;
            modal.querySelector('.modal-content').src = imgSrc;
            modal.querySelector('.modal-content').alt = imgAlt;
            modal.classList.add('open');
        });
    });

    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.classList.remove('open');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('open');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            modal.classList.remove('open');
        }
    });

    // Like Buttons Functionality
    const likeButtons = document.querySelectorAll('.like-button');

    likeButtons.forEach(async (button) => {
        const galleryItem = button.closest('.gallery-item');
        const imgSrc = galleryItem.querySelector('img').src;
        const likeCountElement = galleryItem.querySelector('.like-count');
        const imageId = encodeURIComponent(imgSrc);

        try {
            // جلب عدد الإعجابات من Firebase
            const snapshot = await window.firebase.get(window.firebase.child(window.firebase.ref(window.firebase.db), 'likes/' + imageId));
            const dbLikes = snapshot.exists() ? snapshot.val() : 0;
            
            // تحديث العداد مع القيمة من Firebase
            likeCountElement.textContent = dbLikes;
            localStorage.setItem(`likes_${imgSrc}`, dbLikes);
            
            // التحقق إذا كان المستخدم قد أعجب بالصورة من قبل
            if (localStorage.getItem(`liked_${imgSrc}`)) {
                button.innerHTML = '<i class="fas fa-heart"></i>';
                button.classList.add('liked');
            }
        } catch (error) {
            console.error('Error fetching likes:', error);
            likeCountElement.textContent = localStorage.getItem(`likes_${imgSrc}`) || 0;
        }

        button.addEventListener('click', async () => {
            let currentLikes = parseInt(likeCountElement.textContent);
            const alreadyLiked = localStorage.getItem(`liked_${imgSrc}`);

            if (alreadyLiked) {
                // إلغاء الإعجاب
                currentLikes = Math.max(currentLikes - 1, 0);
                button.innerHTML = '<i class="far fa-heart"></i>';
                button.classList.remove('liked');
                localStorage.removeItem(`liked_${imgSrc}`);
            } else {
                // إضافة إعجاب
                currentLikes++;
                button.innerHTML = '<i class="fas fa-heart"></i>';
                button.classList.add('liked');
                localStorage.setItem(`liked_${imgSrc}`, 'true');

                // تأثير عند الإعجاب
                button.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    button.style.transform = 'scale(1)';
                }, 200);
            }

            // تحديث العداد والمخزن المحلي
            likeCountElement.textContent = currentLikes;
            localStorage.setItem(`likes_${imgSrc}`, currentLikes);

            // تحديث Firebase
            try {
                await window.firebase.set(window.firebase.ref(window.firebase.db, 'likes/' + imageId), currentLikes);
            } catch (error) {
                console.error('Error updating likes:', error);
            }
        });
    });
});
