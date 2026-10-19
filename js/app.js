/**
 * Royal Indian Wedding Invitation - Main Application Logic
 * Supports dynamic event management, live edit mode, countdown, gallery uploads, RSVP, and blessings wall.
 */

// Default wedding data
const DEFAULT_WEDDING_DATA = {
  brideName: "Ananya",
  brideFullName: "Ananya Sharma",
  brideTitle: "Daughter of Smt. Sunita & Shri Rajesh Sharma",
  groomName: "Siddharth",
  groomFullName: "Siddharth Verma",
  groomTitle: "Son of Smt. Rekha & Shri Vikram Verma",
  weddingDate: "2027-02-28T18:30:00",
  weddingDateFormatted: "Sunday, 28th February 2027",
  receptionDateFormatted: "Monday, 1st March 2027",
  venueName: "The Grand Regal Palace & Heritage Resort",
  venueAddress: "Palace Road, Near Fatehsagar Lake, Udaipur, Rajasthan 313001, India",
  familyNames: "The Sharma & Verma Families",
  invitationMessage: "With immense joy and the blessings of our families, we cordially invite you to celebrate the wedding of our beloved couple. Your presence and blessings will make this special occasion even more memorable.",
  familyQuote: "Two lives, two souls, united in love and blessed by the divine. We await your gracious company as we embark on this eternal journey together.",
  events: [
    {
      id: "event-haldi",
      type: "haldi",
      icon: "fa-sun",
      title: "Haldi Ceremony",
      subtitle: "Auspicious Turmeric & Phoolon Ki Holi",
      date: "Saturday, 27th February 2027",
      time: "10:00 AM Onwards",
      venue: "Sunlit Courtyard & Poolside, Palace Gardens",
      desc: "A splash of golden turmeric, playful marigold flower showers, folk music, and auspicious blessings to start the wedding celebrations with vibrant warmth.",
      isoStart: "2027-02-27T10:00:00"
    },
    {
      id: "event-mehendi",
      type: "mehendi",
      icon: "fa-spa",
      title: "Mehendi & Sangeet",
      subtitle: "Henna Twilight & Musical Extravaganza",
      date: "Saturday, 27th February 2027",
      time: "05:30 PM Onwards",
      venue: "Royal Peacock Lawns, Palace Grounds",
      desc: "Adorning hands with intricate bridal henna motifs, accompanied by energetic dhol beats, choreographed family performances, and street food feast.",
      isoStart: "2027-02-27T17:30:00"
    },
    {
      id: "event-wedding",
      type: "wedding",
      icon: "fa-ring",
      title: "Wedding Ceremony",
      subtitle: "Shubh Vivah & Sacred Pheras",
      date: "Sunday, 28th February 2027",
      time: "06:00 PM (Baraat) | 08:00 PM (Pheras)",
      venue: "The Grand Royal Mandap, Palace Courtyard",
      desc: "The royal Baraat procession followed by sacred Vedic nuptial vows around the holy havan fire under a canopy of roses and starlight.",
      isoStart: "2027-02-28T18:00:00"
    },
    {
      id: "event-reception",
      type: "reception",
      icon: "fa-glass-cheers",
      title: "Royal Reception",
      subtitle: "Dinner Gala & Celebrations",
      date: "Monday, 1st March 2027",
      time: "07:30 PM Onwards",
      venue: "The Regal Crystal Ballroom",
      desc: "An enchanting evening of celebration, heartfelt toasts, grand multi-cuisine royal banquet, and memorable moments with our newlyweds.",
      isoStart: "2027-03-01T19:30:00"
    }
  ],
  gallery: [
    {
      id: "gal-1",
      url: "assets/images/hero_wedding.jpg",
      caption: "Under the Royal Palace Arch",
      category: "pre-wedding"
    },
    {
      id: "gal-2",
      url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80",
      caption: "Eternal Promises & Golden Garlands",
      category: "wedding"
    },
    {
      id: "gal-3",
      url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80",
      caption: "Intricate Bridal Henna & Joy",
      category: "mehendi"
    },
    {
      id: "gal-4",
      url: "https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?auto=format&fit=crop&w=1000&q=80",
      caption: "Royal Mandap Radiance & Diya Glow",
      category: "wedding"
    },
    {
      id: "gal-5",
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80",
      caption: "Grand Celebrations & Champagne Toasts",
      category: "reception"
    },
    {
      id: "gal-6",
      url: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1000&q=80",
      caption: "Turmeric Glow & Sunlit Laughter",
      category: "haldi"
    }
  ],
  blessings: [
    {
      id: "b-1",
      author: "Ramesh & Meena Chawla",
      tag: "Elder Blessings 🌸",
      text: "May your journey together be showered with divine joy, good health, and infinite love. Sada Suhagan Raho! Wishing you both a lifetime of togetherness.",
      hearts: 28,
      time: "2 hours ago"
    },
    {
      id: "b-2",
      author: "Aditi & Rohan Kapoor",
      tag: "Best Wishes ✨",
      text: "Heartiest congratulations to our favorite couple! Can't wait to dance our hearts out at the Sangeet and celebrate this magnificent bond in Udaipur!",
      hearts: 34,
      time: "Yesterday"
    },
    {
      id: "b-3",
      author: "The Mathur Family",
      tag: "Family Love 💖",
      text: "Ananya and Siddharth, you two are made for each other. May your bond grow stronger with each passing day. Lots of blessings from Jaipur!",
      hearts: 19,
      time: "2 days ago"
    }
  ]
};

// Global App State
let weddingState = {};
let isEditMode = false;
let currentLightboxIndex = 0;
let currentLightboxList = [];

// ==========================================================================
// STATE MANAGEMENT & LOCAL STORAGE
// ==========================================================================
function loadWeddingState() {
  try {
    const saved = localStorage.getItem('royal_wedding_state_v1');
    if (saved) {
      weddingState = JSON.parse(saved);
      // Ensure arrays exist
      if (!Array.isArray(weddingState.events)) weddingState.events = DEFAULT_WEDDING_DATA.events;
      if (!Array.isArray(weddingState.gallery)) weddingState.gallery = DEFAULT_WEDDING_DATA.gallery;
      if (!Array.isArray(weddingState.blessings)) weddingState.blessings = DEFAULT_WEDDING_DATA.blessings;
    } else {
      weddingState = JSON.parse(JSON.stringify(DEFAULT_WEDDING_DATA));
    }
  } catch (e) {
    console.error("Error loading state", e);
    weddingState = JSON.parse(JSON.stringify(DEFAULT_WEDDING_DATA));
  }
}

function saveWeddingState() {
  try {
    localStorage.setItem('royal_wedding_state_v1', JSON.stringify(weddingState));
  } catch (e) {
    console.error("Error saving state", e);
  }
}

function showToast(message) {
  const toast = document.getElementById('toast-notice');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
}

// ==========================================================================
// RENDER DOM ELEMENTS FROM STATE
// ==========================================================================
function renderWeddingDetails() {
  // Hero Section
  setText('hero-groom-display', weddingState.groomName);
  setText('hero-bride-display', weddingState.brideName);
  setText('hero-date-display', weddingState.weddingDateFormatted);

  // Invitation Card
  setText('invitation-message-text', weddingState.invitationMessage);
  setText('card-groom-name', weddingState.groomFullName);
  setText('card-groom-title', weddingState.groomTitle);
  setText('card-bride-name', weddingState.brideFullName);
  setText('card-bride-title', weddingState.brideTitle);
  setText('card-family-names', weddingState.familyNames);
  setText('card-parents-groom', weddingState.groomTitle);
  setText('card-parents-bride', weddingState.brideTitle);

  // Wedding Details Summary
  setText('detail-groom-val', weddingState.groomFullName);
  setText('detail-bride-val', weddingState.brideFullName);
  setText('detail-wedding-date-val', weddingState.weddingDateFormatted);
  setText('detail-reception-date-val', weddingState.receptionDateFormatted);
  setText('detail-venue-val', weddingState.venueName);
  setText('detail-address-val', weddingState.venueAddress);
  setText('detail-family-quote', weddingState.familyQuote);
  setText('venue-name-val', weddingState.venueName);
  setText('venue-address-val', weddingState.venueAddress);

  // Directions button URL
  const directionsBtn = document.getElementById('get-directions-btn');
  if (directionsBtn) {
    directionsBtn.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(weddingState.venueAddress || weddingState.venueName)}`;
  }

  // Update map iframe
  const mapIframe = document.getElementById('venue-map-iframe');
  if (mapIframe) {
    const query = encodeURIComponent(weddingState.venueAddress || weddingState.venueName);
    mapIframe.src = `https://maps.google.com/maps?q=${query}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
  }

  // Footer
  setText('footer-couple-names', `${weddingState.groomName} & ${weddingState.brideName}`);
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text || "";
}

// ==========================================================================
// 3. WEDDING EVENTS RENDER & MANAGEMENT
// ==========================================================================
function renderEvents() {
  const container = document.getElementById('events-grid-container');
  const countBadge = document.getElementById('events-count-badge');
  if (!container) return;

  if (countBadge) {
    countBadge.textContent = `${weddingState.events.length} Auspicious Ceremonies`;
  }

  if (weddingState.events.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; color: var(--color-gold-300); padding: 40px;">
        <i class="fas fa-calendar-times" style="font-size: 2.5rem; margin-bottom: 12px; display: block;"></i>
        <p>No ceremonies added yet. Click "+ Add Ceremony" to create one.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = weddingState.events.map((evt, idx) => {
    return `
      <div class="event-card" data-type="${evt.type || 'wedding'}" id="event-card-${evt.id}">
        <div class="event-card-actions">
          <button class="event-action-btn edit-btn" onclick="openEditEventModal('${evt.id}')" title="Edit Ceremony Details">
            <i class="fas fa-pen"></i>
          </button>
          <button class="event-action-btn delete-btn" onclick="deleteEvent('${evt.id}')" title="Remove Ceremony">
            <i class="fas fa-trash"></i>
          </button>
        </div>

        <div class="event-icon-wrapper">
          <i class="fas ${evt.icon || 'fa-ring'}"></i>
        </div>

        <h3 class="event-title">${escapeHtml(evt.title)}</h3>
        <p class="event-subtitle">${escapeHtml(evt.subtitle || '')}</p>

        <ul class="event-info-list">
          <li class="event-info-item">
            <i class="far fa-calendar-alt"></i>
            <span><strong>Date:</strong> ${escapeHtml(evt.date)}</span>
          </li>
          <li class="event-info-item">
            <i class="far fa-clock"></i>
            <span><strong>Time:</strong> ${escapeHtml(evt.time)}</span>
          </li>
          <li class="event-info-item">
            <i class="fas fa-map-marker-alt"></i>
            <span><strong>Venue:</strong> ${escapeHtml(evt.venue)}</span>
          </li>
        </ul>

        <p class="event-desc">"${escapeHtml(evt.desc)}"</p>

        <button class="btn-royal-outline btn-sm event-calendar-btn" onclick="downloadEventCalendar('${evt.id}')">
          <i class="far fa-calendar-plus"></i> Add to Calendar
        </button>
      </div>
    `;
  }).join('');
}

function openAddEventModal() {
  document.getElementById('event-modal-title').textContent = "Add Auspicious Ceremony";
  document.getElementById('event-form-id').value = "";
  document.getElementById('event-form-title').value = "";
  document.getElementById('event-form-subtitle').value = "";
  document.getElementById('event-form-type').value = "wedding";
  document.getElementById('event-form-date').value = "";
  document.getElementById('event-form-time').value = "";
  document.getElementById('event-form-venue').value = "";
  document.getElementById('event-form-desc').value = "";
  openModal('event-editor-modal');
}

function openEditEventModal(id) {
  const evt = weddingState.events.find(e => e.id === id);
  if (!evt) return;

  document.getElementById('event-modal-title').textContent = "Edit Ceremony Details";
  document.getElementById('event-form-id').value = evt.id;
  document.getElementById('event-form-title').value = evt.title;
  document.getElementById('event-form-subtitle').value = evt.subtitle || "";
  document.getElementById('event-form-type').value = evt.type || "wedding";
  document.getElementById('event-form-date').value = evt.date;
  document.getElementById('event-form-time').value = evt.time;
  document.getElementById('event-form-venue').value = evt.venue;
  document.getElementById('event-form-desc').value = evt.desc;
  openModal('event-editor-modal');
}

function saveEventForm(e) {
  e.preventDefault();
  const id = document.getElementById('event-form-id').value;
  const title = document.getElementById('event-form-title').value.trim();
  const subtitle = document.getElementById('event-form-subtitle').value.trim();
  const type = document.getElementById('event-form-type').value;
  const date = document.getElementById('event-form-date').value.trim();
  const time = document.getElementById('event-form-time').value.trim();
  const venue = document.getElementById('event-form-venue').value.trim();
  const desc = document.getElementById('event-form-desc').value.trim();

  // Set appropriate icon based on ceremony type
  let icon = 'fa-ring';
  if (type === 'haldi') icon = 'fa-sun';
  else if (type === 'mehendi') icon = 'fa-spa';
  else if (type === 'reception') icon = 'fa-glass-cheers';
  else if (type === 'sangeet') icon = 'fa-music';

  if (id) {
    // Update existing
    const idx = weddingState.events.findIndex(e => e.id === id);
    if (idx !== -1) {
      weddingState.events[idx] = { ...weddingState.events[idx], title, subtitle, type, date, time, venue, desc, icon };
    }
  } else {
    // Add new
    const newId = 'event-' + Date.now();
    weddingState.events.push({
      id: newId,
      type,
      icon,
      title,
      subtitle,
      date,
      time,
      venue,
      desc
    });
  }

  saveWeddingState();
  renderEvents();
  closeModal('event-editor-modal');
  showToast("Ceremony details saved successfully! ✨");
}

function deleteEvent(id) {
  if (!confirm("Are you sure you want to remove this ceremony card?")) return;
  weddingState.events = weddingState.events.filter(e => e.id !== id);
  saveWeddingState();
  renderEvents();
  showToast("Ceremony removed.");
}

// iCalendar .ics export for single event
function downloadEventCalendar(id) {
  const evt = weddingState.events.find(e => e.id === id);
  if (!evt) return;

  const title = `${weddingState.groomName} & ${weddingState.brideName}'s ${evt.title}`;
  const description = `${evt.desc}\\n\\nVenue: ${evt.venue}\\nWith blessings of ${weddingState.familyNames}`;
  const location = `${evt.venue}, ${weddingState.venueAddress}`;

  // Simple clean .ics generator
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Royal Indian Wedding//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    `STATUS:CONFIRMED`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${evt.title.replace(/\s+/g, '_')}_Invitation.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast(`Calendar invite downloaded for ${evt.title}! 📅`);
}

// ==========================================================================
// 1. COUNTDOWN TIMER
// ==========================================================================
function startCountdown() {
  function update() {
    const target = new Date(weddingState.weddingDate || "2027-02-28T18:30:00").getTime();
    const now = new Date().getTime();
    const diff = target - now;

    if (diff <= 0) {
      document.getElementById('days-count').textContent = "00";
      document.getElementById('hours-count').textContent = "00";
      document.getElementById('minutes-count').textContent = "00";
      document.getElementById('seconds-count').textContent = "00";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days-count').textContent = String(days).padStart(2, '0');
    document.getElementById('hours-count').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes-count').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds-count').textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

// ==========================================================================
// 5. PHOTO GALLERY & UPLOAD & LIGHTBOX
// ==========================================================================
function renderGallery(filter = 'all') {
  const container = document.getElementById('gallery-grid-container');
  if (!container) return;

  let items = weddingState.gallery;
  if (filter !== 'all') {
    items = items.filter(item => item.category === filter);
  }

  currentLightboxList = items;

  if (items.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; color: var(--color-gold-300); padding: 40px;">
        <p>No photos in this category yet. Click "Upload Photographs" to add yours.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map((item, idx) => {
    return `
      <div class="gallery-item" onclick="openLightbox(${idx})">
        <img src="${item.url}" alt="${escapeHtml(item.caption)}" class="gallery-img" loading="lazy" />
        <div class="gallery-overlay">
          <span class="gallery-tag">${escapeHtml(item.category || 'moments')}</span>
          <h4 class="gallery-caption">${escapeHtml(item.caption)}</h4>
        </div>
      </div>
    `;
  }).join('');
}

function setupGalleryUpload() {
  const uploadInput = document.getElementById('gallery-file-input');
  if (!uploadInput) return;

  uploadInput.addEventListener('change', function(e) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = function(event) {
        const newPhoto = {
          id: 'user-photo-' + Date.now() + Math.random(),
          url: event.target.result,
          caption: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
          category: "moments"
        };
        weddingState.gallery.unshift(newPhoto);
        saveWeddingState();
        renderGallery('all');
        showToast("Photo uploaded to wedding album! 📸");
      };
      reader.readAsDataURL(file);
    });

    uploadInput.value = "";
  });
}

function openLightbox(index) {
  if (currentLightboxList.length === 0) return;
  currentLightboxIndex = index;
  const item = currentLightboxList[index];
  const modal = document.getElementById('lightbox-modal');
  const img = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');

  img.src = item.url;
  caption.textContent = item.caption;
  modal.classList.add('active');
}

function closeLightbox() {
  const modal = document.getElementById('lightbox-modal');
  if (modal) modal.classList.remove('active');
}

function navLightbox(direction) {
  currentLightboxIndex += direction;
  if (currentLightboxIndex < 0) currentLightboxIndex = currentLightboxList.length - 1;
  if (currentLightboxIndex >= currentLightboxList.length) currentLightboxIndex = 0;
  openLightbox(currentLightboxIndex);
}

// ==========================================================================
// 6. INTERACTIVE RSVP & GUESTBOOK BLESSINGS
// ==========================================================================
function setupRSVPForm() {
  const form = document.getElementById('wedding-rsvp-form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('rsvp-name').value.trim();
    const contact = document.getElementById('rsvp-contact').value.trim();
    const guests = document.getElementById('rsvp-guests').value;
    const food = document.getElementById('rsvp-food').value;
    const notes = document.getElementById('rsvp-notes').value.trim();

    // Checkbox ceremonies
    const ceremonies = [];
    document.querySelectorAll('input[name="attending-events"]:checked').forEach(cb => {
      ceremonies.push(cb.value);
    });

    if (!name) {
      alert("Please enter your name.");
      return;
    }

    const rsvpSubmission = {
      id: 'rsvp-' + Date.now(),
      name,
      contact,
      guests,
      food,
      notes,
      ceremonies,
      submittedAt: new Date().toISOString()
    };

    // Save to localStorage list of RSVPs
    const existing = JSON.parse(localStorage.getItem('wedding_rsvps_list') || '[]');
    existing.push(rsvpSubmission);
    localStorage.setItem('wedding_rsvps_list', JSON.stringify(existing));

    // Show celebration modal
    document.getElementById('rsvp-guest-name-badge').textContent = name;
    openModal('rsvp-success-modal');
    form.reset();

    // Trigger celebration petal explosion
    createCelebrationBurst();
    showToast(`RSVP received! Thank you, ${name}! 🎉`);
  });
}

function renderBlessings() {
  const list = document.getElementById('blessings-wall-list');
  if (!list) return;

  list.innerHTML = weddingState.blessings.map((b, idx) => {
    return `
      <div class="blessing-item" id="blessing-${b.id}">
        <div class="blessing-header">
          <span class="blessing-author">${escapeHtml(b.author)}</span>
          <span class="blessing-tag-pill">${escapeHtml(b.tag || 'Blessing 🌸')}</span>
        </div>
        <p class="blessing-text">"${escapeHtml(b.text)}"</p>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
          <small style="color: #8C7B71; font-family: var(--font-sans); font-size: 0.78rem;">${b.time || 'Recently'}</small>
          <button style="background: none; border: none; color: #AF1F47; cursor: pointer; font-size: 0.88rem;" onclick="addHeartBlessing('${b.id}')">
            <i class="fas fa-heart"></i> ${b.hearts || 1}
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function setupBlessingForm() {
  const form = document.getElementById('wedding-blessing-form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('blessing-name').value.trim();
    const tag = document.getElementById('blessing-tag-select').value;
    const msg = document.getElementById('blessing-message').value.trim();

    if (!name || !msg) {
      alert("Please provide both your name and blessings message.");
      return;
    }

    const newBlessing = {
      id: 'b-' + Date.now(),
      author: name,
      tag: tag || "Heartfelt Wishes 💖",
      text: msg,
      hearts: 1,
      time: "Just now"
    };

    weddingState.blessings.unshift(newBlessing);
    saveWeddingState();
    renderBlessings();
    form.reset();
    showToast("Your auspicious blessing was posted to the wall! 🌸");
  });
}

function addHeartBlessing(id) {
  const b = weddingState.blessings.find(item => item.id === id);
  if (b) {
    b.hearts = (b.hearts || 0) + 1;
    saveWeddingState();
    renderBlessings();
  }
}

// ==========================================================================
// FALLING ROSE & MARIGOLD PETALS CANVAS ANIMATION
// ==========================================================================
class PetalCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.petals = [];
    this.active = true;
    this.maxPetals = 45;
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Create petal pool
    for (let i = 0; i < this.maxPetals; i++) {
      this.petals.push(this.createPetal());
    }

    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createPetal(resetTop = false) {
    const isMarigold = Math.random() > 0.6; // Mix of red rose & marigold petals
    return {
      x: Math.random() * this.canvas.width,
      y: resetTop ? -20 : Math.random() * this.canvas.height,
      size: Math.random() * 12 + 10,
      speedY: Math.random() * 1.5 + 0.8,
      speedX: Math.random() * 1.5 - 0.75,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 2,
      oscillationSpeed: Math.random() * 0.03 + 0.01,
      oscillationOffset: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.5 + 0.45,
      color: isMarigold
        ? { r: 243, g: 156, b: 18 } // Marigold yellow/orange
        : { r: 175, g: 31, b: 71 }  // Deep velvet rose red
    };
  }

  animate() {
    if (!this.active) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      return;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let p of this.petals) {
      p.y += p.speedY;
      p.x += Math.sin(p.oscillationOffset) * 1.2 + p.speedX;
      p.oscillationOffset += p.oscillationSpeed;
      p.rotation += p.rotSpeed;

      // Wrap around
      if (p.y > this.canvas.height + 20) {
        Object.assign(p, this.createPetal(true));
      }
      if (p.x < -30) p.x = this.canvas.width + 20;
      if (p.x > this.canvas.width + 30) p.x = -20;

      // Draw elegant petal curve
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);

      this.ctx.beginPath();
      this.ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.opacity})`;
      // Realistic rose/marigold petal shape (bezier curve)
      this.ctx.moveTo(0, 0);
      this.ctx.quadraticCurveTo(p.size * 0.8, -p.size * 0.5, p.size, 0);
      this.ctx.quadraticCurveTo(p.size * 0.8, p.size * 0.5, 0, 0);
      this.ctx.fill();

      this.ctx.restore();
    }

    requestAnimationFrame(() => this.animate());
  }

  toggle() {
    this.active = !this.active;
    if (this.active) this.animate();
    showToast(this.active ? "Petals shower turned on 🌸" : "Petals shower paused");
  }
}

let petalAnimationInstance = null;

function createCelebrationBurst() {
  if (!petalAnimationInstance) return;
  // Temporarily boost petals
  for (let i = 0; i < 30; i++) {
    const burstPetal = petalAnimationInstance.createPetal(true);
    burstPetal.speedY *= 2.5;
    burstPetal.speedX = (Math.random() - 0.5) * 4;
    petalAnimationInstance.petals.push(burstPetal);
  }
  setTimeout(() => {
    petalAnimationInstance.petals.splice(45);
  }, 5000);
}

// ==========================================================================
// LIVE CUSTOMIZER & EDIT MODE
// ==========================================================================
function toggleEditMode() {
  isEditMode = !isEditMode;
  document.body.classList.toggle('edit-mode-active', isEditMode);
  const toggleBtn = document.getElementById('edit-mode-toggle-btn');
  if (toggleBtn) {
    toggleBtn.classList.toggle('active', isEditMode);
    toggleBtn.innerHTML = isEditMode
      ? `<i class="fas fa-check"></i> Exit Edit Mode`
      : `<i class="fas fa-edit"></i> Edit Details`;
  }
  showToast(isEditMode ? "Edit Mode Active: Click 'Customize Details' or edit event cards!" : "Edit Mode Disabled");
}

function openQuickEditModal() {
  // Populate form with current values
  document.getElementById('edit-groom-name').value = weddingState.groomName;
  document.getElementById('edit-groom-fullname').value = weddingState.groomFullName;
  document.getElementById('edit-groom-title').value = weddingState.groomTitle;
  document.getElementById('edit-bride-name').value = weddingState.brideName;
  document.getElementById('edit-bride-fullname').value = weddingState.brideFullName;
  document.getElementById('edit-bride-title').value = weddingState.brideTitle;
  document.getElementById('edit-wedding-date').value = weddingState.weddingDate.substring(0, 16);
  document.getElementById('edit-wedding-date-str').value = weddingState.weddingDateFormatted;
  document.getElementById('edit-reception-date-str').value = weddingState.receptionDateFormatted;
  document.getElementById('edit-venue-name').value = weddingState.venueName;
  document.getElementById('edit-venue-address').value = weddingState.venueAddress;
  document.getElementById('edit-family-names').value = weddingState.familyNames;
  document.getElementById('edit-invitation-msg').value = weddingState.invitationMessage;
  document.getElementById('edit-family-quote').value = weddingState.familyQuote;

  openModal('quick-customizer-modal');
}

function saveQuickEditModal(e) {
  e.preventDefault();
  weddingState.groomName = document.getElementById('edit-groom-name').value.trim();
  weddingState.groomFullName = document.getElementById('edit-groom-fullname').value.trim();
  weddingState.groomTitle = document.getElementById('edit-groom-title').value.trim();
  weddingState.brideName = document.getElementById('edit-bride-name').value.trim();
  weddingState.brideFullName = document.getElementById('edit-bride-fullname').value.trim();
  weddingState.brideTitle = document.getElementById('edit-bride-title').value.trim();
  weddingState.weddingDate = document.getElementById('edit-wedding-date').value;
  weddingState.weddingDateFormatted = document.getElementById('edit-wedding-date-str').value.trim();
  weddingState.receptionDateFormatted = document.getElementById('edit-reception-date-str').value.trim();
  weddingState.venueName = document.getElementById('edit-venue-name').value.trim();
  weddingState.venueAddress = document.getElementById('edit-venue-address').value.trim();
  weddingState.familyNames = document.getElementById('edit-family-names').value.trim();
  weddingState.invitationMessage = document.getElementById('edit-invitation-msg').value.trim();
  weddingState.familyQuote = document.getElementById('edit-family-quote').value.trim();

  saveWeddingState();
  renderWeddingDetails();
  closeModal('quick-customizer-modal');
  showToast("Wedding invitation updated! 🌟");
}

function resetToDefaultInvitation() {
  if (!confirm("Reset all invitation details back to sample royal wedding data?")) return;
  weddingState = JSON.parse(JSON.stringify(DEFAULT_WEDDING_DATA));
  saveWeddingState();
  renderWeddingDetails();
  renderEvents();
  renderGallery('all');
  renderBlessings();
  closeModal('quick-customizer-modal');
  showToast("Reset to default wedding details.");
}

function shareOnWhatsApp() {
  const text = `🌸 *Wedding Invitation* 🌸\nTogether with our families, we joyfully invite you to the wedding celebrations of:\n\n✨ *${weddingState.brideName} & ${weddingState.groomName}* ✨\n\n📅 Date: ${weddingState.weddingDateFormatted}\n📍 Venue: ${weddingState.venueName}, ${weddingState.venueAddress}\n\nExplore our digital wedding invitation card & details here:\n${window.location.href}\n\nWarmly Invited By: ${weddingState.familyNames}`;
  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

function copyInvitationLink() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    showToast("Invitation link copied to clipboard! 📋");
  }).catch(() => {
    showToast("Link: " + window.location.href);
  });
}

// Modal Helpers
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('active');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('active');
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ==========================================================================
// INITIALIZATION ON DOM READY
// ==========================================================================
document.addEventListener('DOMContentLoaded', function() {
  loadWeddingState();
  renderWeddingDetails();
  renderEvents();
  renderGallery('all');
  renderBlessings();
  startCountdown();
  setupRSVPForm();
  setupBlessingForm();
  setupGalleryUpload();

  // Initialize Falling Petals
  petalAnimationInstance = new PetalCanvas('petals-canvas');

  // Mobile Nav Toggle
  const navToggleBtn = document.getElementById('nav-toggle-btn');
  const navMenu = document.getElementById('nav-menu');
  if (navToggleBtn && navMenu) {
    navToggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
  }

  // Close mobile menu on link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu) navMenu.classList.remove('open');
    });
  });

  // Gallery Filters
  document.querySelectorAll('.gallery-filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.gallery-filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      renderGallery(this.dataset.filter);
    });
  });

  // Music Toggle Button
  const musicBtn = document.getElementById('music-toggle-btn');
  if (musicBtn) {
    musicBtn.addEventListener('click', () => {
      if (window.weddingAudio) window.weddingAudio.toggle();
    });
  }

  // Petals Toggle Button
  const petalsBtn = document.getElementById('petals-toggle-btn');
  if (petalsBtn) {
    petalsBtn.addEventListener('click', () => {
      if (petalAnimationInstance) petalAnimationInstance.toggle();
    });
  }

  // Keyboard navigation for lightbox
  window.addEventListener('keydown', (e) => {
    const modal = document.getElementById('lightbox-modal');
    if (modal && modal.classList.contains('active')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navLightbox(-1);
      if (e.key === 'ArrowRight') navLightbox(1);
    }
  });

  // First user interaction auto-prompt for music if desired
  document.getElementById('explore-btn')?.addEventListener('click', () => {
    if (window.weddingAudio && !window.weddingAudio.isPlaying) {
      window.weddingAudio.play();
    }
  });
});
