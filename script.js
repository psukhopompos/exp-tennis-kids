// WhatsApp number
const WHATSAPP_NUMBER = '5562999303824'; // Updated number

// Send WhatsApp message function
function sendWhatsApp(message) {
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    // Track Facebook Pixel events
    if (typeof fbq !== 'undefined') {
        // Track based on message content
        if (message.toLowerCase().includes('aula experimental') || 
            message.toLowerCase().includes('aula grátis') ||
            message.toLowerCase().includes('vaga')) {
            // Free trial = Lead
            fbq('track', 'Lead', {
                content_name: 'Free Trial Request',
                content_category: 'Tennis Kids',
                value: 0,
                currency: 'BRL'
            });
        } else if (message.toLowerCase().includes('plano') || 
                   message.toLowerCase().includes('1x por semana') ||
                   message.toLowerCase().includes('2x por semana')) {
            // Pricing inquiry = AddToCart
            fbq('track', 'AddToCart', {
                content_name: 'Pricing Inquiry',
                content_category: 'Tennis Kids',
                value: message.includes('2x') ? 450 : 250,
                currency: 'BRL'
            });
        } else {
            // Any other message = ViewContent (they're engaged)
            fbq('track', 'ViewContent', {
                content_name: 'WhatsApp Engagement',
                content_category: 'Tennis Kids'
            });
        }
    }
    
    window.open(whatsappURL, '_blank');
    console.log('WhatsApp click:', message);
}

// Hero stories rotation
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.story-slide');
    let currentSlide = 0;
    
    if (slides.length > 1) {
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 6000); // Change story every 6 seconds
    }
    
    // Click to unmute video functionality
    const heroVideo = document.getElementById('heroVideo');
    const videoContainer = document.querySelector('.video-container');
    
    if (heroVideo && videoContainer) {
        videoContainer.addEventListener('click', function() {
            if (heroVideo.muted) {
                heroVideo.muted = false;
                videoContainer.classList.add('sound-on');
                // Track video engagement
                if (typeof fbq !== 'undefined') {
                    fbq('trackCustom', 'VideoEngagement', {
                        action: 'unmute',
                        content_name: 'Hero Video'
                    });
                }
            } else {
                heroVideo.muted = true;
                videoContainer.classList.remove('sound-on');
            }
        });
    }
    
    // Track scroll depth
    let scrollTracked = {
        pricing: false,
        testimonials: false
    };
    
    window.addEventListener('scroll', function() {
        if (typeof fbq === 'undefined') return;
        
        // Track when they see pricing
        if (!scrollTracked.pricing) {
            const pricingSection = document.querySelector('.pricing');
            if (pricingSection && isElementInViewport(pricingSection)) {
                fbq('track', 'ViewContent', {
                    content_name: 'Pricing Section',
                    content_category: 'Tennis Kids'
                });
                scrollTracked.pricing = true;
            }
        }
        
        // Track when they see testimonials
        if (!scrollTracked.testimonials) {
            const testimonialsSection = document.querySelector('.testimonials');
            if (testimonialsSection && isElementInViewport(testimonialsSection)) {
                fbq('trackCustom', 'ViewTestimonials', {
                    content_name: 'Parent Testimonials'
                });
                scrollTracked.testimonials = true;
            }
        }
    });
    
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Lazy load videos
    const videos = document.querySelectorAll('video');
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target;
                if (video.dataset.src) {
                    video.src = video.dataset.src;
                    video.load();
                    videoObserver.unobserve(video);
                }
            }
        });
    });

    videos.forEach(video => {
        videoObserver.observe(video);
    });

    // Animate elements on scroll
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                animateOnScroll.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    // Add animation to elements
    document.querySelectorAll('.proof-item, .credential-item, .pricing-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        animateOnScroll.observe(el);
    });
});

// Add animated class styles
const style = document.createElement('style');
style.textContent = `
    .animated {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// Handle video errors
document.querySelectorAll('video').forEach(video => {
    video.addEventListener('error', function() {
        console.error('Video failed to load:', this.src);
        // You could add a fallback image here
    });
});