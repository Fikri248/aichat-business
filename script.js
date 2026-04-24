document.querySelectorAll('.md-ripple').forEach(el => {
            el.addEventListener('click', function (e) {
                const rect = this.getBoundingClientRect();
                const circle = document.createElement('span');
                const diameter = Math.max(rect.width, rect.height);
                const radius = diameter / 2;
                circle.style.width = circle.style.height = diameter + 'px';
                circle.style.left = (e.clientX - rect.left - radius) + 'px';
                circle.style.top = (e.clientY - rect.top - radius) + 'px';
                circle.classList.add('ripple-circle');
                const existing = this.querySelector('.ripple-circle');
                if (existing) existing.remove();
                this.appendChild(circle);
                circle.addEventListener('animationend', () => circle.remove());
            });
        });

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

        document.querySelectorAll('.md-reveal').forEach(el => revealObserver.observe(el));
        document.querySelectorAll('.cmp-wrap').forEach(el => revealObserver.observe(el));

        document.querySelectorAll('details').forEach(detail => {
            detail.addEventListener('toggle', function () {
                if (this.open) {
                    document.querySelectorAll('details[open]').forEach(d => {
                        if (d !== detail) d.removeAttribute('open');
                    });
                }
            });
        });

        const nav = document.querySelector('nav');
        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 20);
        }, { passive: true });

        /* ===== Mockup Dashboard: Model Selector Logic ===== */
        (function () {
            let mockupDropdownOpen = false;
            let mockupAutoRotate = null;
            let mockupRotateIndex = 0;
            const mockupModels = ['ChatGPT 5.5 Auto', 'ChatGPT 5.5 Instant', 'ChatGPT 5.5 Thinking', 'ChatGPT 5.5 Pro'];

            // Toggle dropdown
            window.toggleMockupDropdown = function () {
                const dd = document.getElementById('mockup-dropdown');
                const chevron = document.getElementById('mockup-chevron');
                mockupDropdownOpen = !mockupDropdownOpen;

                if (mockupDropdownOpen) {
                    dd.classList.remove('opacity-0', 'scale-95', 'pointer-events-none');
                    dd.classList.add('opacity-100', 'scale-100', 'pointer-events-auto');
                    chevron.style.transform = 'rotate(180deg)';
                    // Pause auto-rotate saat dropdown dibuka
                    pauseMockupRotate();
                } else {
                    dd.classList.remove('opacity-100', 'scale-100', 'pointer-events-auto');
                    dd.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
                    chevron.style.transform = 'rotate(0deg)';
                    // Resume auto-rotate setelah dropdown ditutup
                    startMockupRotate();
                }
            };

            // Select model
            window.selectMockupModel = function (el) {
                const value = el.getAttribute('data-value');
                const selectorText = document.getElementById('mockup-selector-text');

                // Animate text change
                selectorText.style.opacity = '0';
                selectorText.style.transform = 'translateY(-4px)';

                setTimeout(function () {
                    selectorText.textContent = value;
                    selectorText.style.transform = 'translateY(4px)';
                    requestAnimationFrame(function () {
                        selectorText.style.opacity = '1';
                        selectorText.style.transform = 'translateY(0)';
                    });
                }, 150);

                // Update checkmarks
                document.querySelectorAll('.mockup-check').forEach(function (c) {
                    c.classList.add('opacity-0');
                    c.classList.remove('opacity-100');
                });
                el.querySelector('.mockup-check').classList.remove('opacity-0');
                el.querySelector('.mockup-check').classList.add('opacity-100');

                // Update rotate index
                mockupRotateIndex = mockupModels.indexOf(value);

                // Close dropdown
                setTimeout(function () { toggleMockupDropdown(); }, 200);
            };

            // Auto-rotate text
            function rotateMockupText() {
                mockupRotateIndex = (mockupRotateIndex + 1) % mockupModels.length;
                const selectorText = document.getElementById('mockup-selector-text');
                const value = mockupModels[mockupRotateIndex];

                // Animate out
                selectorText.style.opacity = '0';
                selectorText.style.transform = 'translateY(-6px)';

                setTimeout(function () {
                    selectorText.textContent = value;
                    selectorText.style.transform = 'translateY(6px)';

                    requestAnimationFrame(function () {
                        selectorText.style.opacity = '1';
                        selectorText.style.transform = 'translateY(0)';
                    });
                }, 200);

                // Update checkmarks
                document.querySelectorAll('.mockup-option').forEach(function (opt, i) {
                    var check = opt.querySelector('.mockup-check');
                    if (opt.getAttribute('data-value') === value) {
                        check.classList.remove('opacity-0');
                        check.classList.add('opacity-100');
                    } else {
                        check.classList.add('opacity-0');
                        check.classList.remove('opacity-100');
                    }
                });
            }

            function startMockupRotate() {
                if (mockupAutoRotate) return;
                mockupAutoRotate = setInterval(rotateMockupText, 2500);
            }

            function pauseMockupRotate() {
                clearInterval(mockupAutoRotate);
                mockupAutoRotate = null;
            }

            // Close dropdown on click outside
            document.addEventListener('click', function (e) {
                const dd = document.getElementById('mockup-dropdown');
                const trigger = document.getElementById('mockup-trigger');
                if (mockupDropdownOpen && !dd.contains(e.target) && !trigger.contains(e.target)) {
                    toggleMockupDropdown();
                }
            });

            // Start auto-rotate on load
            startMockupRotate();

            // Mobile Nav - Expanding Pill
            window.toggleMobileNav = function () {
                const pill = document.getElementById('nav-pill');
                const links = document.getElementById('mobile-nav-links');
                const icon = document.getElementById('hamburger-icon');
                const isOpen = links.classList.contains('open');

                if (isOpen) {
                    links.classList.remove('open');
                    pill.classList.remove('menu-open');
                    icon.textContent = 'menu';
                    icon.style.transform = '';
                } else {
                    links.classList.add('open');
                    pill.classList.add('menu-open');
                    icon.textContent = 'close';
                    icon.style.transform = 'rotate(90deg)';
                }
            };

            // Close on click outside pill
            document.addEventListener('click', function (e) {
                const pill = document.getElementById('nav-pill');
                const links = document.getElementById('mobile-nav-links');
                if (links && links.classList.contains('open') && !pill.contains(e.target)) {
                    toggleMobileNav();
                }
            });

            // Close on scroll
            window.addEventListener('scroll', function () {
                const links = document.getElementById('mobile-nav-links');
                if (links && links.classList.contains('open')) {
                    toggleMobileNav();
                }
            }, { passive: true });

            // Mockup Chat Interaction
            window.sendMockupChat = function () {
                var input = document.getElementById('mockup-input');
                var message = input.value.trim();
                if (!message) return;

                // Hide greeting
                var greeting = document.getElementById('mockup-greeting');
                greeting.style.display = 'none';

                // Switch layout from centered to chat mode
                var content = document.getElementById('mockup-content');
                content.classList.remove('justify-center');
                content.classList.add('justify-end');

                // Show messages area
                var msgArea = document.getElementById('mockup-messages');
                msgArea.classList.remove('hidden');

                // Add user message bubble
                var userMsg = document.createElement('div');
                userMsg.className = 'flex justify-end';
                userMsg.innerHTML = '<div class="bg-gray-200/80 rounded-2xl rounded-br-md px-4 py-2.5 max-w-[80%] text-sm text-gray-900">' + message + '</div>';
                msgArea.appendChild(userMsg);

                // Clear input & disable send
                input.value = '';
                input.disabled = true;
                var sendBtn = document.getElementById('mockup-send-btn');
                sendBtn.style.opacity = '0.4';
                sendBtn.style.pointerEvents = 'none';

                // Hide chip
                document.getElementById('mockup-chip').style.display = 'none';

                // ChatGPT avatar HTML (reusable)
                var avatarHTML = ''
                    + '<div class="w-7 h-7 rounded-full bg-[#212121] flex items-center justify-center shrink-0 mt-0.5">'
                    + '<svg width="16" height="16" viewBox="0 0 41 41" fill="none">'
                    + '<path d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835A9.964 9.964 0 0 0 18.306.5a10.079 10.079 0 0 0-9.614 6.977 9.967 9.967 0 0 0-6.664 4.834 10.08 10.08 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 7.516 3.35 10.078 10.078 0 0 0 9.617-6.981 9.967 9.967 0 0 0 6.663-4.834 10.079 10.079 0 0 0-1.243-11.813ZM22.498 37.886a7.474 7.474 0 0 1-4.799-1.735c.061-.033.168-.091.237-.134l7.964-4.6a1.294 1.294 0 0 0 .655-1.134V19.054l3.366 1.944a.12.12 0 0 1 .066.092v9.299a7.505 7.505 0 0 1-7.49 7.496ZM6.392 31.006a7.471 7.471 0 0 1-.894-5.023c.06.036.162.099.237.141l7.964 4.6a1.297 1.297 0 0 0 1.308 0l9.724-5.614v3.888a.12.12 0 0 1-.048.103l-8.051 4.649a7.504 7.504 0 0 1-10.24-2.744ZM4.297 13.62A7.469 7.469 0 0 1 8.2 10.333c0 .068-.004.19-.004.274v9.201a1.294 1.294 0 0 0 .654 1.132l9.723 5.614-3.366 1.944a.12.12 0 0 1-.114.012L7.044 23.86a7.504 7.504 0 0 1-2.747-10.24Zm27.658 6.437-9.724-5.615 3.367-1.943a.121.121 0 0 1 .113-.012l8.051 4.649a7.498 7.498 0 0 1-1.158 13.528v-9.476a1.293 1.293 0 0 0-.649-1.131Zm3.35-5.043c-.059-.037-.162-.099-.236-.141l-7.965-4.6a1.298 1.298 0 0 0-1.308 0l-9.723 5.614v-3.888a.12.12 0 0 1 .048-.103l8.05-4.645a7.497 7.497 0 0 1 11.135 7.763Zm-21.063 6.929-3.367-1.944a.12.12 0 0 1-.065-.092v-9.299a7.497 7.497 0 0 1 12.293-5.756 6.94 6.94 0 0 0-.236.134l-7.965 4.6a1.294 1.294 0 0 0-.654 1.132l-.006 11.225Zm1.829-3.943 4.33-2.501 4.332 2.5v5l-4.331 2.5-4.331-2.5V18Z" fill="white"/>'
                    + '</svg>'
                    + '</div>';

                // Canva icon HTML
                var canvaIconHTML = ''
                    + '<div class="w-9 h-9 rounded-xl overflow-hidden shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">'
                    + '<svg width="36" height="36" viewBox="0 0 500 500">'
                    + '<defs><linearGradient id="cg" gradientUnits="userSpaceOnUse" x1="186.5668" y1="103.6641" x2="338.9911" y2="455.296">'
                    + '<stop offset="0" stop-color="#01C3CC"/>'
                    + '<stop offset="0.51" stop-color="#4569E0"/>'
                    + '<stop offset="0.998" stop-color="#7428EF"/>'
                    + '<stop offset="1" stop-color="#7428EF"/>'
                    + '</linearGradient></defs>'
                    + '<circle cx="250" cy="250" r="225" fill="url(#cg)"/>'
                    + '<path d="M359.773,300.804c0.361-4.351-5.443-5.99-7.443-2.175c-19.959,39.196-52.072,66.959-89.639,69.31c-30.299,1.814-56.979-17.237-67.32-47.722c-9.979-29.577-9.794-54.979-3.629-89.639c9.258-51.897,42.639-107.783,94.897-105.423c21.959,0.907,32.484,13.969,32.484,35.567c0,25.948-14.516,38.103-14.516,47.907c0,2.907,2.536,5.99,7.443,5.99c19.959,0,43.547-23.588,43.547-55.526c0-32.114-25.948-55.526-72.031-55.526c-76.031,0-143.526,71.309-143.526,169.289c0,78.021,46.268,123.567,112.866,123.567c23.949,0,57.34-14.155,84.196-45.546C361.773,322.402,359.773,300.804,359.773,300.804z" fill="#FFFFFF"/>'
                    + '</svg>'
                    + '</div>';

                // Show typing indicator
                var typingDiv = document.createElement('div');
                typingDiv.className = 'flex items-start gap-2.5';
                typingDiv.innerHTML = ''
                    + avatarHTML
                    + '<div class="flex gap-1.5 items-center px-3 py-3">'
                    + '<div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay:0ms"></div>'
                    + '<div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay:150ms"></div>'
                    + '<div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay:300ms"></div>'
                    + '</div>';
                msgArea.appendChild(typingDiv);
                msgArea.scrollTop = msgArea.scrollHeight;

                // After delay, show AI response
                setTimeout(function () {
                    typingDiv.remove();

                    var botMsg = document.createElement('div');
                    botMsg.className = 'flex items-start gap-2.5';
                    botMsg.style.opacity = '0';
                    botMsg.style.transform = 'translateY(8px)';
                    botMsg.style.transition = 'opacity 400ms ease, transform 400ms ease';
                    botMsg.innerHTML = ''
                        + avatarHTML
                        + '<div class="text-sm text-gray-800 leading-relaxed space-y-3 max-w-[85%]">'
                        + '<p>Siaap! Ini link invite <strong>Canva Business</strong> kamu:</p>'
                        + '<a href="https://www.canva.com/brand/join?token=gk2l40eK_jaP8GuFUfAPDw&referrer=team-invite" target="_blank" rel="noopener noreferrer" class="group flex items-center gap-3 w-full max-w-xs px-4 py-3 rounded-2xl bg-gradient-to-br from-[#7d2ae8]/5 via-[#00c4cc]/5 to-[#7d2ae8]/10 border border-[#7d2ae8]/20 hover:border-[#7d2ae8]/40 hover:shadow-lg hover:shadow-[#7d2ae8]/10 transition-all duration-300">'
                        + canvaIconHTML
                        + '<div class="flex flex-col">'
                        + '<span class="text-[13px] font-bold text-gray-900 group-hover:text-[#7d2ae8] transition-colors">Gabung Canva Business</span>'
                        + '<span class="text-[11px] text-gray-400">Klik untuk join workspace</span>'
                        + '</div>'
                        + '<span class="material-symbols-outlined text-gray-300 text-[18px] ml-auto group-hover:text-[#7d2ae8] group-hover:translate-x-0.5 transition-all">arrow_forward</span>'
                        + '</a>'
                        + '<p class="text-gray-500 text-xs leading-relaxed">Klik link di atas buat join workspace Canva Business (Expired 26 Maret 2026). Kalau ada kendala, langsung hubungi admin WhatsApp ya!</p>'
                        + '</div>';
                    msgArea.appendChild(botMsg);

                    // Animate in
                    requestAnimationFrame(function () {
                        botMsg.style.opacity = '1';
                        botMsg.style.transform = 'translateY(0)';
                    });

                    msgArea.scrollTop = msgArea.scrollHeight;
                }, 1800);
            };


        })();
    

    // === Comparison Table: Mobile Compact + Expand ===
    (function () {
        function initCmpMobile() {
            if (window.innerWidth > 768) return;
            var wrap = document.querySelector('.cmp-wrap');
            if (!wrap || wrap.dataset.mobileInit) return;
            wrap.dataset.mobileInit = 'true';
            wrap.classList.add('cmp-mobile-compact');
            var rows = wrap.querySelectorAll('tr');
            for (var i = 0; i < rows.length; i++) {
                var cells = rows[i].querySelectorAll('th, td');
                if (cells[2]) cells[2].classList.add('cmp-col-hide');
                if (cells[3]) cells[3].classList.add('cmp-col-hide');
            }
            var chip = document.getElementById('cmp-mobile-toggle');
            if (chip) chip.style.display = 'flex';
        }
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initCmpMobile);
        } else {
            initCmpMobile();
        }
    })();

    window.showAllPlans = function () {
        var wrap = document.querySelector('.cmp-wrap');
        if (!wrap) return;
        wrap.classList.remove('cmp-mobile-compact');
        wrap.classList.add('cmp-mobile-expanded');
        var hidden = wrap.querySelectorAll('.cmp-col-hide');
        for (var i = 0; i < hidden.length; i++) {
            hidden[i].classList.remove('cmp-col-hide');
            hidden[i].style.display = '';
        }
        var table = wrap.querySelector('.cmp-table');
        if (table) {
            table.style.tableLayout = 'fixed';
            table.style.width = '100%';
        }
        var allCells = wrap.querySelectorAll('th, td');
        for (var j = 0; j < allCells.length; j++) {
            allCells[j].style.minWidth = '0';
        }
        wrap.style.overflow = 'visible';
        var toggle = document.getElementById('cmp-mobile-toggle');
        if (toggle) toggle.style.display = 'none';
    };