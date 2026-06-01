// Constants
const WHATSAPP_PHONE_NUMBER = '233243208436'; // Standard wa.me formatting without special characters or pluses

// Sticky Header Scroll Effect
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (!header) return;
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Mobile Hamburger Menu Navigation Toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    // Hamburger animation to 'X'
    menuToggle.classList.toggle('open');
    const spans = menuToggle.querySelectorAll('span');
    if (menuToggle.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });
}

window.closeMenu = function closeMenu() {
  if (!navLinks || !menuToggle) return;
  navLinks.classList.remove('active');
  menuToggle.classList.remove('open');
  const spans = menuToggle.querySelectorAll('span');
  spans[0].style.transform = 'none';
  spans[1].style.opacity = '1';
  spans[2].style.transform = 'none';
};

// -------------------------------------------------------------
// WHATSAPP URL GENERATION & INTEGRATION
// -------------------------------------------------------------

// 1. General WhatsApp Greetings (Header, Hero, Floating Buttons, Footer)
window.handleGeneralWhatsAppInquiry = function handleGeneralWhatsAppInquiry(source) {
  let greeting = "Hello Oliver Car Rentals, I'm visiting your website and I'm interested in booking a VIP ride. Please assist me with availability and rates.";

  if (source === 'header') {
    greeting = "Hello Oliver Car Rentals, I would like to book a premium car rental from the website header desk. Please guide me.";
  } else if (source === 'hero_vip') {
    greeting = "Hello Oliver Car Rentals, I would like to book a VIP rental ride via WhatsApp right now. Please assist me with the fleet options.";
  } else if (source === 'floating_widget') {
    greeting = "Hello Oliver Car Rentals, I have a quick inquiry regarding your available car rentals in Accra. Can we chat?";
  } else if (source === 'footer_mail' || source === 'footer_bottom') {
    greeting = "Hello Oliver Car Rentals, I'm checking out your site footer details and would like to coordinate a rental car service.";
  } else if (source === 'custom_fleet_request') {
    greeting = "Hello Oliver Car Rentals, I have a special vehicle request. Can you supply a custom car type for me in Accra?";
  } else if (source === 'contact_form_chat') {
    greeting = "Hello Oliver Car Rentals, I'm filling out the contact details and would like to directly chat with an agent regarding rental plans.";
  }

  openWhatsAppChat(greeting);
};

// 2. Specific Vehicle Fleet Inquiries
window.handleVehicleWhatsAppInquiry = function handleVehicleWhatsAppInquiry(vehicleClass) {
  const greeting = `Hello Oliver Car Rentals, I am highly interested in inquiring about your "${vehicleClass}" vehicle fleet options. Please provide information on rates, structural policies, and general availability in Accra.`;
  openWhatsAppChat(greeting);
};

// 3. Complete Contact Form Submission WhatsApp Compiler
const bookingForm = document.getElementById('whatsappBookingForm');

if (bookingForm) {
  bookingForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Halt normal submission

    const name = document.getElementById('clientName')?.value.trim();
    const phone = document.getElementById('clientPhone')?.value.trim();
    const rawPickup = document.getElementById('pickupDate')?.value;
    const rawReturn = document.getElementById('returnDate')?.value;
    const vehicle = document.getElementById('vehicleType')?.value;
    const additionalMsg = document.getElementById('clientMessage')?.value.trim();

    // Simple logical date verification
    const pickupDateObj = new Date(rawPickup);
    const returnDateObj = new Date(rawReturn);
    const currentDateObj = new Date();

    if (pickupDateObj < currentDateObj && pickupDateObj.toDateString() !== currentDateObj.toDateString()) {
      alert('Attention: The pickup date cannot be in the past. Please select a valid upcoming date.');
      return;
    }

    if (returnDateObj <= pickupDateObj) {
      alert('Attention: The return date must be strictly after your selected pickup date.');
      return;
    }

    // Format dates into readable localized strings
    const dateOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const formattedPickup = pickupDateObj.toLocaleDateString('en-US', dateOptions);
    const formattedReturn = returnDateObj.toLocaleDateString('en-US', dateOptions);

    // Construct a highly structured, premium WhatsApp booking request
    let message = `Hello Oliver Car Rentals, I'm interested in renting a car.\n\n`;
    message += `📋 *RENTAL BOOKING DETAILS*\n`;
    message += `• *Name:* ${name}\n`;
    message += `• *Phone:* ${phone}\n`;
    message += `• *Vehicle Type:* ${vehicle}\n`;
    message += `• *Pickup Date:* ${formattedPickup}\n`;
    message += `• *Return Date:* ${formattedReturn}\n`;

    if (additionalMsg) {
      message += `\n💬 *Additional Notes & Special Requests:*\n${additionalMsg}`;
    } else {
      message += `\n💬 *Additional Notes:* None.`;
    }

    openWhatsAppChat(message);
  });
}

// Helper: Build URL and trigger redirection safely
function openWhatsAppChat(messageText) {
  const encodedText = encodeURIComponent(messageText);
  const whatsappURL = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodedText}`;
  window.open(whatsappURL, '_blank');
}

// -------------------------------------------------------------
// LIVE STATUS HOURS CALCULATOR
// -------------------------------------------------------------

function renderLiveBusinessStatus() {
  const container = document.getElementById('liveStatusContainer');
  if (!container) return;

  const now = new Date();

  // Ghana is strictly UTC/GMT+0
  const currentDay = now.getUTCDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  let isOpen = currentDay !== 0;
  let statusHTML = '';

  if (isOpen) {
    statusHTML = `
      <div class="status-badge status-open">
        <span class="status-dot"></span>
        WE ARE OPEN NOW (24/7 Support)
      </div>
    `;
  } else {
    statusHTML = `
      <div class="status-badge status-closed">
        <span class="status-dot"></span>
        WE ARE CLOSED TODAY (Resumes Mon 24/7)
      </div>
    `;
  }

  container.innerHTML = statusHTML;
}

// Initialize Page states
document.addEventListener('DOMContentLoaded', () => {
  renderLiveBusinessStatus();

  // Refresh business hours calculator every 60 seconds
  setInterval(renderLiveBusinessStatus, 60000);

  // Pre-set some default dates for user convenience (pickup today in +2 hours, return in 3 days)
  const now = new Date();
  now.setHours(now.getHours() + 2);
  now.setMinutes(0);

  const pickupInput = document.getElementById('pickupDate');
  const returnInput = document.getElementById('returnDate');

  if (pickupInput && returnInput) {
    const pad = (num) => String(num).padStart(2, '0');
    const formatLocalISO = (date) => {
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    };

    pickupInput.value = formatLocalISO(now);

    const returnDate = new Date(now);
    returnDate.setDate(returnDate.getDate() + 3);
    returnInput.value = formatLocalISO(returnDate);
  }
});

