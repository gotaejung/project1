// Main slide functionality for slide_content1 -> hi_slide
document.addEventListener('DOMContentLoaded', function() {
    console.log('Swiper1.js loaded - Main slider initialization');
    
    // Slider configuration
    const slider = {
        currentSlide: 0,
        totalSlides: 0,
        isPlaying: false,
        autoplayInterval: null,
        autoplayDelay: 4000,
        slideWidth: 690,
        isTransitioning: false,
        
        // Initialize slider
        init() {
            console.log('Initializing main slider...');
            
            // Get slider elements
            this.sliderContainer = document.querySelector('.slide_content1 .hi_slide');
            this.slides = document.querySelectorAll('.slide_content1 .hi_slide li');
            this.prevBtn = document.querySelector('.slide_content1 .bx-prev');
            this.nextBtn = document.querySelector('.slide_content1 .bx-next');
            this.playBtn = document.querySelector('.slide_content1 .btn_hi_start');
            this.stopBtn = document.querySelector('.slide_content1 .btn_hi_stop');
            this.currentCounter = document.querySelector('.slide_content1 .index_count');
            this.totalCounter = document.querySelector('.slide_content1 .total_count');
            
            if (!this.sliderContainer || !this.slides.length) {
                console.error('Main slider elements not found');
                return;
            }
            
            this.totalSlides = this.slides.length;
            console.log(`Found ${this.totalSlides} slides`);
            
            // Setup initial state
            this.setupSlider();
            this.bindEvents();
            this.updateDisplay();
            
            // Start autoplay
            this.startAutoplay();
            
            console.log('Main slider initialized successfully');
        },
        
        // Setup slider initial state with infinite loop support
        setupSlider() {
            // Clone first and last slides for infinite loop
            const firstSlide = this.slides[0].cloneNode(true);
            const lastSlide = this.slides[this.totalSlides - 1].cloneNode(true);
            
            // Add cloned slides
            this.sliderContainer.appendChild(firstSlide);
            this.sliderContainer.insertBefore(lastSlide, this.slides[0]);
            
            // Update slides NodeList to include clones
            this.allSlides = this.sliderContainer.querySelectorAll('li');
            
            // Reset slider container
            this.sliderContainer.style.position = 'relative';
            this.sliderContainer.style.width = `${(this.totalSlides + 2) * this.slideWidth}px`;
            this.sliderContainer.style.left = `-${this.slideWidth}px`; // Start at first real slide
            this.sliderContainer.style.transition = 'left 0.5s ease-in-out';
            
            // Setup individual slides
            this.allSlides.forEach((slide, index) => {
                slide.style.float = 'left';
                slide.style.listStyle = 'none';
                slide.style.position = 'relative';
                slide.style.width = `${this.slideWidth}px`;
            });
            
            // Set initial play/stop button states
            if (this.playBtn) this.playBtn.style.display = 'none';
            if (this.stopBtn) this.stopBtn.style.display = 'inline-block';
        },
        
        // Bind event listeners
        bindEvents() {
            // Previous button
            if (this.prevBtn) {
                this.prevBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.prevSlide();
                });
            }
            
            // Next button
            if (this.nextBtn) {
                this.nextBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.nextSlide();
                });
            }
            
            // Play button
            if (this.playBtn) {
                this.playBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.startAutoplay();
                });
            }
            
            // Stop button
            if (this.stopBtn) {
                this.stopBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.stopAutoplay();
                });
            }
            
            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    this.prevSlide();
                } else if (e.key === 'ArrowRight') {
                    this.nextSlide();
                }
            });
            
            // Pause on hover
            if (this.sliderContainer) {
                this.sliderContainer.addEventListener('mouseenter', () => {
                    this.pauseAutoplay();
                });
                
                this.sliderContainer.addEventListener('mouseleave', () => {
                    if (this.isPlaying) {
                        this.resumeAutoplay();
                    }
                });
            }
            
            // Handle transition end for infinite loop
            this.sliderContainer.addEventListener('transitionend', () => {
                this.handleTransitionEnd();
            });
        },
        
        // Handle transition end for seamless infinite loop
        handleTransitionEnd() {
            this.isTransitioning = false;
            
            // If we're at the cloned first slide (after last real slide)
            if (this.currentSlide === this.totalSlides) {
                this.sliderContainer.style.transition = 'none';
                this.currentSlide = 0;
                this.sliderContainer.style.left = `-${this.slideWidth}px`;
                setTimeout(() => {
                    this.sliderContainer.style.transition = 'left 0.5s ease-in-out';
                }, 10);
            }
            
            // If we're at the cloned last slide (before first real slide)
            if (this.currentSlide === -1) {
                this.sliderContainer.style.transition = 'none';
                this.currentSlide = this.totalSlides - 1;
                this.sliderContainer.style.left = `-${(this.totalSlides) * this.slideWidth}px`;
                setTimeout(() => {
                    this.sliderContainer.style.transition = 'left 0.5s ease-in-out';
                }, 10);
            }
            
            this.updateDisplay();
        },
        
        // Go to next slide (infinite loop)
        nextSlide() {
            if (this.isTransitioning) return;
            
            this.isTransitioning = true;
            this.currentSlide++;
            
            const translateX = -(this.currentSlide + 1) * this.slideWidth;
            this.sliderContainer.style.left = `${translateX}px`;
            
            console.log(`Next slide: ${this.currentSlide + 1} (${this.currentSlide >= this.totalSlides ? 'will loop to 1' : 'normal'})`);
        },
        
        // Go to previous slide (infinite loop)
        prevSlide() {
            if (this.isTransitioning) return;
            
            this.isTransitioning = true;
            this.currentSlide--;
            
            const translateX = -(this.currentSlide + 1) * this.slideWidth;
            this.sliderContainer.style.left = `${translateX}px`;
            
            console.log(`Previous slide: ${this.currentSlide + 1} (${this.currentSlide < 0 ? 'will loop to ' + this.totalSlides : 'normal'})`);
        },
        
        // Update display counters and visual states
        updateDisplay() {
            // Normalize currentSlide for display
            let displaySlide = this.currentSlide;
            if (displaySlide < 0) displaySlide = this.totalSlides - 1;
            if (displaySlide >= this.totalSlides) displaySlide = 0;
            
            // Update counters
            if (this.currentCounter) {
                this.currentCounter.textContent = displaySlide + 1;
            }
            if (this.totalCounter) {
                this.totalCounter.textContent = this.totalSlides;
            }
            
            // Update slide visibility classes
            this.slides.forEach((slide, index) => {
                slide.classList.remove('active', 'current');
                if (index === displaySlide) {
                    slide.classList.add('active', 'current');
                }
            });
            
            console.log(`Display updated - Slide ${displaySlide + 1}/${this.totalSlides}`);
        },
        
        // Start autoplay
        startAutoplay() {
            this.isPlaying = true;
            this.autoplayInterval = setInterval(() => {
                this.nextSlide();
            }, this.autoplayDelay);
            
            // Update button states
            if (this.playBtn) this.playBtn.style.display = 'none';
            if (this.stopBtn) this.stopBtn.style.display = 'inline-block';
            
            console.log('Autoplay started');
        },
        
        // Stop autoplay
        stopAutoplay() {
            this.isPlaying = false;
            if (this.autoplayInterval) {
                clearInterval(this.autoplayInterval);
                this.autoplayInterval = null;
            }
            
            // Update button states
            if (this.playBtn) this.playBtn.style.display = 'inline-block';
            if (this.stopBtn) this.stopBtn.style.display = 'none';
            
            console.log('Autoplay stopped');
        },
        
        // Pause autoplay (temporary)
        pauseAutoplay() {
            if (this.autoplayInterval) {
                clearInterval(this.autoplayInterval);
                this.autoplayInterval = null;
            }
        },
        
        // Resume autoplay
        resumeAutoplay() {
            if (this.isPlaying && !this.autoplayInterval) {
                this.autoplayInterval = setInterval(() => {
                    this.nextSlide();
                }, this.autoplayDelay);
            }
        }
   
    };

    
    // Initialize slider
    slider.init();
    
    // Make slider globally accessible for debugging
    window.mainSlider = slider;

        // Make slider globally accessible for debugging
    window.citizenSlider = slider;
});

