/**
 * ServiceEngineering (Overhaul) - Master Script
 * Interactive Gallery, Estimator, Mobile Nav & Email Submission Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initAnimatedMetrics();
    initPhotoGallery();
    initQuoteEstimator();
    initContactForm();
});

/* ==========================================
   1. Navigation & Mobile Toggle
   ========================================== */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.getElementById('nav-links');

    // Sticky Navbar shadow on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        highlightActiveNav();
    });

    // Mobile menu toggle
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });

        // Close mobile nav when clicking nav item
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
            });
        });
    }
}

function highlightActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 120;
        const sectionId = current.getAttribute('id');
        const navItem = document.querySelector(`.nav-links a[href*=${sectionId}]`);

        if (navItem) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navItem.classList.add('active');
            } else {
                navItem.classList.remove('active');
            }
        }
    });
}

/* ==========================================
   2. Animated Metrics Counter
   ========================================== */
function initAnimatedMetrics() {
    const metricElements = document.querySelectorAll('.metric-number');
    let animated = false;

    const animateCounters = () => {
        const heroSection = document.getElementById('hero');
        if (!heroSection) return;

        const sectionPos = heroSection.getBoundingClientRect().top;
        const screenPos = window.innerHeight / 1.3;

        if (sectionPos < screenPos && !animated) {
            animated = true;
            metricElements.forEach(counter => {
                const target = parseFloat(counter.getAttribute('data-target'));
                const duration = 1500; // ms
                const stepTime = 30;
                const steps = duration / stepTime;
                const increment = target / steps;
                let current = 0;

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    counter.innerText = Number.isInteger(target) ? Math.round(current) : current.toFixed(1);
                }, stepTime);
            });
        }
    };

    window.addEventListener('scroll', animateCounters);
    animateCounters(); // initial check
}

/* ==========================================
   3. Online Google Drive Photo Gallery & Lightbox
   ========================================== */
function initPhotoGallery() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');

    // Category Filter Buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                const categories = item.getAttribute('data-category');
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Lightbox triggers
    document.querySelectorAll('.btn-lightbox').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const imgSrc = button.getAttribute('data-img');
            const galleryCard = button.closest('.gallery-card');
            const titleText = galleryCard.querySelector('.gallery-title')?.innerText || '';
            const descText = galleryCard.querySelector('.gallery-info p')?.innerText || '';

            lightboxImg.src = imgSrc;
            lightboxCaption.innerHTML = `<strong>${titleText}</strong><br><small>${descText}</small>`;
            lightboxModal.classList.add('active');
        });
    });

    if (lightboxClose && lightboxModal) {
        lightboxClose.addEventListener('click', () => {
            lightboxModal.classList.remove('active');
        });

        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                lightboxModal.classList.remove('active');
            }
        });
    }
}

/* ==========================================
   4. Quote & Service Estimator
   ========================================== */
function initQuoteEstimator() {
    const serviceType = document.getElementById('est-service-type');
    const plcBrand = document.getElementById('est-plc-brand');
    const radioSizes = document.querySelectorAll('input[name="est-size"]');
    const timeOutput = document.getElementById('est-time-output');
    const complexityOutput = document.getElementById('est-complexity-output');
    const deliverablesList = document.getElementById('est-deliverables-list');
    const btnApplyQuote = document.getElementById('btn-apply-quote');

    const updateEstimate = () => {
        if (!serviceType || !timeOutput) return;

        const st = serviceType.value;
        const sizeVal = document.querySelector('input[name="est-size"]:checked')?.value || 'small';
        const plcVal = plcBrand ? plcBrand.value : 'mitsubishi';

        let timeStr = '3 - 5 วันทำการ';
        let complexityText = 'ปานกลาง (Medium)';
        let badgeClass = 'badge';
        let deliverables = [
            'เข้าสำรวจเครื่องจักรและประเมินสภาพหน้างาน (Site Survey)',
            'รายงานถอดประกอบและตรวจสอบชิ้นส่วนชำรุด',
            'ทดสอบระบบการทำงานก่อนส่งมอบงาน (Factory Acceptance Test)'
        ];

        if (st === 'overhaul') {
            if (sizeVal === 'small') timeStr = '3 - 5 วันทำการ';
            else if (sizeVal === 'medium') timeStr = '7 - 10 วันทำการ';
            else timeStr = '14 - 21 วันทำการ';
            
            deliverables.push('เปลี่ยนชุดลูกปืน Seal Gear & Wear Parts');
            deliverables.push('ปรับ Alignment และสมดุลชุดขับเคลื่อน');
        } else if (st === 'modify') {
            timeStr = (sizeVal === 'large') ? '10 - 14 วันทำการ' : '4 - 7 วันทำการ';
            deliverables.push('ติดตั้งระบบ Safety Interlock & Sensors');
            deliverables.push('ปรับปรุงโครงสร้าง mechanical & pneumatic');
        } else if (st === 'electrical') {
            timeStr = (sizeVal === 'large') ? '7 - 10 วันทำการ' : '3 - 5 วันทำการ';
            deliverables.push('ออกแบบประกอบตู้ Control Panel');
            deliverables.push('ติดตั้ง Inverter VFD & Wiring Standard');
        } else if (st === 'plc') {
            timeStr = '3 - 7 วันทำการ';
            const brandTitle = plcVal === 'omron' ? 'Omron PLC (CP1/CJ2)' : 'Mitsubishi PLC (FX/Q)';
            deliverables.push(`เขียนและทดสอบ Logic Control บน ${brandTitle}`);
            deliverables.push('ออกแบบหน้าจอ HMI Touchscreen & Alarm list');
        } else if (st === 'full') {
            timeStr = (sizeVal === 'large') ? '15 - 30 วันทำการ' : '7 - 14 วันทำการ';
            complexityText = 'สูงมาก (High Complexity)';
            deliverables.push('Overhaul โครงสร้างทางกลแบบครบวงจร');
            deliverables.push('ประกอบตู้ไฟฟ้า Control พร้อมระบบ PLC & HMI');
            deliverables.push('อบรมการใช้งานและรับประกันงานหลังส่งมอบ');
        }

        timeOutput.innerText = timeStr;
        complexityOutput.innerText = complexityText;
        
        // Render deliverables HTML
        deliverablesList.innerHTML = deliverables.map(d => `<li><i class="fa-solid fa-check"></i> ${d}</li>`).join('');
    };

    if (serviceType) {
        serviceType.addEventListener('change', updateEstimate);
        if (plcBrand) plcBrand.addEventListener('change', updateEstimate);
        radioSizes.forEach(r => r.addEventListener('change', updateEstimate));
        updateEstimate(); // Initial calculation
    }

    // Apply quote values to main contact form
    if (btnApplyQuote) {
        btnApplyQuote.addEventListener('click', () => {
            const formService = document.getElementById('form-service');
            const formDetails = document.getElementById('form-details');

            if (formService && serviceType) {
                const mapOption = {
                    'overhaul': 'Overhaul เครื่องจักร',
                    'modify': 'ปรับปรุง เครื่องจักร',
                    'electrical': 'รับทำระบบไฟฟ้า Control เครื่องจักร',
                    'plc': plcBrand.value === 'omron' ? 'ระบบ PLC HMI (Omron)' : 'ระบบ PLC HMI (Mitsubishi)',
                    'full': 'บริการครบวงจร (Full Package)'
                };
                if (mapOption[serviceType.value]) {
                    formService.value = mapOption[serviceType.value];
                }
            }

            if (formDetails) {
                const selectedPlc = plcBrand ? plcBrand.options[plcBrand.selectedIndex].text : '';
                formDetails.value = `[ส่งข้อมูลจากการประเมินหน้าเว็บ]\n- ขอบเขตงาน: ${serviceType.options[serviceType.selectedIndex].text}\n- ระบบ PLC: ${selectedPlc}\n- ระยะเวลาประมาณการ: ${timeOutput.innerText}\n- รายละเอียดเพิ่มเติม: `;
            }

            // Smooth scroll to contact section
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        });
    }
}

/* ==========================================
   5. Contact Form & Email Submission Logic
   ========================================== */
function initContactForm() {
    const contactForm = document.getElementById('service-contact-form');
    const mailtoBtn = document.getElementById('btn-mailto-fallback');
    const successModal = document.getElementById('success-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalSummaryBox = document.getElementById('modal-summary-box');

    //const targetEmails = ['rachensap@cpram.co.th', 'paitoonchi@cpram.co.th', 'wasannar@cpram.co.th'];
    const targetEmails = ['wasannar@cpram.co.th'];
    // Create a key for wasannar@cpram.co.th at https://web3forms.com/
    // Web3Forms sends to the email associated with this key.
    const web3FormsAccessKey = '';

    // Handle Mailto fallback compose link
    if (mailtoBtn) {
        mailtoBtn.addEventListener('click', () => {
            const name = document.getElementById('form-name')?.value || 'ผู้สนใจ';
            const org = document.getElementById('form-org')?.value || 'หน่วยงาน';
            const email = document.getElementById('form-email')?.value || 'ยังไม่ระบุ';
            const phone = document.getElementById('form-phone')?.value || 'ยังไม่ระบุ';
            const service = document.getElementById('form-service')?.value || 'Overhaul';
            const details = document.getElementById('form-details')?.value || '-';

            const subject = encodeURIComponent(`[แจ้งรายละเอียดงาน ServiceEngineering] จาก ${name} (${org})`);
            const body = encodeURIComponent(
                `เรียน ทีมงานวิศวกร ServiceEngineering (Overhaul),\n\n` +
                `มีรายการแจ้งรายละเอียดงานจากหน้าเว็บไซต์ ดังนี้:\n\n` +
                `• ชื่อผู้ติดต่อ: ${name}\n` +
                `• หน่วยงาน / บริษัท: ${org}\n` +
                `• Email บริษัท: ${email}\n` +
                `• เบอร์โทรศัพท์ / ข้อมูลติดต่อ: ${phone}\n` +
                `• ประเภทงานที่สนใจ: ${service}\n\n` +
                `• รายละเอียดงาน:\n${details}\n\n` +
                `----------------------------------------\n` +
                `ส่งตรงถึงวิศวกร: ${targetEmails.join(', ')}`
            );

            const mailtoUrl = `mailto:${targetEmails.join(',')}?subject=${subject}&body=${body}`;
            window.location.href = mailtoUrl;
        });
    }

    // Form Submission Event
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btnSubmit = document.getElementById('btn-submit-form');
            if (btnSubmit.disabled) return;
            const name = document.getElementById('form-name').value.trim();
            const org = document.getElementById('form-org').value.trim();
            const email = document.getElementById('form-email').value.trim();
            const phone = document.getElementById('form-phone').value.trim();
            const service = document.getElementById('form-service').value;
            const details = document.getElementById('form-details').value.trim();

            if (!name || !org || !email || !phone || !details) {
                alert('กรุณากรอกข้อมูลในช่องที่มีเครื่องหมาย * ให้ครบถ้วน');
                return;
            }

            if (!web3FormsAccessKey.trim()) {
                alert('ยังไม่ได้ตั้งค่าการส่งอีเมล กรุณาใส่ Access Key ของ Web3Forms ใน script.js หรือใช้ปุ่มส่งผ่าน Email Program แล้วกดส่งในโปรแกรมอีเมล');
                return;
            }

            // Disable submit button & show loading indicator
            const originalBtnText = btnSubmit.innerHTML;
            btnSubmit.disabled = true;
            btnSubmit.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> กำลังส่งข้อมูล...`;

            try {
                // Submit to Web3Forms / API endpoint to send emails directly to target emails
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        access_key: web3FormsAccessKey,
                        subject: `[ServiceEngineering Overhaul] รายงานแจ้งงานจาก ${name} (${org})`,
                        from_name: `${name} - ${org}`,
                        name: name,
                        organization: org,
                        email: email,
                        phone: phone,
                        service_type: service,
                        details: details,
                        target_recipients: targetEmails.join(', ')
                    })
                });
                const result = await response.json();
                if (!response.ok || result.success !== true) {
                    throw new Error(result.message || result.body?.message || `HTTP ${response.status}`);
                }

                // Show Success Modal
                if (modalSummaryBox) {
                    modalSummaryBox.textContent =
                        `📌 รายละเอียดข้อมูลที่ส่ง:\n` +
                        `• ผู้ติดต่อ: ${name}\n` +
                        `• หน่วยงาน: ${org}\n` +
                        `• อีเมลบริษัท: ${email}\n` +
                        `• เบอร์โทรศัพท์: ${phone}\n` +
                        `• บริการ: ${service}\n` +
                        `• รายละเอียด: ${details.substring(0, 100)}${details.length > 100 ? '...' : ''}\n\n` +
                        `✉️ ระบบรับข้อมูลเพื่อส่งอีเมลเรียบร้อยแล้ว`;
                }

                if (successModal) {
                    successModal.classList.add('active');
                }

                // Reset form
                contactForm.reset();
            } catch (err) {
                console.error('Email submission failed:', err);
                alert(`ส่งอีเมลไม่สำเร็จ: ${err.message}\nข้อมูลในฟอร์มยังอยู่ กรุณาลองใหม่ หรือใช้ปุ่มส่งผ่าน Email Program`);
            } finally {
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = originalBtnText;
            }
        });
    }

    if (modalCloseBtn && successModal) {
        modalCloseBtn.addEventListener('click', () => {
            successModal.classList.remove('active');
        });
    }
}
