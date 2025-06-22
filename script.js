document.addEventListener('DOMContentLoaded', function() {
    const contactButton = document.querySelector('.contact-button');
    
    if (contactButton) {
        contactButton.addEventListener('click', function(event) {
            // حفظ الخصائص الأصلية
            const originalBackground = this.style.backgroundColor;
            const originalTransform = this.style.transform;
            const originalBoxShadow = this.style.boxShadow;
            
            // تأثير النقر (النبض)
            this.style.backgroundColor = '#28a745'; // لون التأثير
            this.style.transform = 'scale(0.95)';
            this.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
            
            // استعادة الخصائص الأصلية بعد 300ms
            setTimeout(() => {
                this.style.backgroundColor = originalBackground;
                this.style.transform = originalTransform;
                this.style.boxShadow = originalBoxShadow;
                
                // فتح عميل البريد بعد انتهاء التأثير
                window.location.href = this.getAttribute('href');
            }, 300);
            
            // منع السلوك الافتراضي مؤقتاً حتى يكتمل التأثير
            event.preventDefault();
        });
    }

    // تحسينات إضافية لجميع الأزرار
    const allButtons = document.querySelectorAll('.social-button, .contact-button');
    
    allButtons.forEach(button => {
        // تأثير التحويم (Hover)
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
        
        // تهيئة أولية للخصائص
        button.style.transition = 'all 0.3s ease';
    });
});
