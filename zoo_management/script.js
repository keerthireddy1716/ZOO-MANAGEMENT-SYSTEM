const animals = [
  {
    id: 'a1',
    name: 'African Lion',
    species: 'Panthera leo',
    img: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=800&q=60',
    images: [
      'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=600&q=60'
    ],
    location: 'Savannah Zone',
    availability: '09:00 - 17:00',
    feedingTime: '13:30',
    etaMinutes: 8,
    route: [
      'Enter via Main Gate',
      'Walk straight past the Central Fountain',
      'Turn left at the aviary (colorful flags)',
      'Follow the sandy path to Savannah Zone'
    ],
    amenities: ['Restroom (200m)', 'Cafe - Palm Roasts', 'First Aid Station']
  },
  {
    id: 'a2',
    name: 'Bengal Tiger',
    species: 'Panthera tigris tigris',
    img: 'https://images.unsplash.com/photo-1525253086316-d0c936c814f8?auto=format&fit=crop&w=800&q=60',
    images: [
      'https://images.unsplash.com/photo-1525253086316-d0c936c814f8?auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1601758123927-2d6d8a3a9a08?auto=format&fit=crop&w=600&q=60'
    ],
    location: 'Big Cats Enclosure',
    availability: '10:00 - 16:30',
    feedingTime: '12:00',
    etaMinutes: 12,
    route: [
      'From Central Plaza, head east toward the Rose Garden',
      'Pass the koi pond and cross the wooden bridge',
      'Signs for Big Cats will direct you to the enclosure'
    ],
    amenities: ['Benches', 'Drinking Fountain', 'Gift Shop']
  },
  {
    id: 'a3',
    name: 'Giant Tortoise',
    species: 'Aldabrachelys gigantea',
    img: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=800&q=60',
    images: [
      'https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?auto=format&fit=crop&w=600&q=60'
    ],
    location: 'Reptile House',
    availability: '09:30 - 16:00',
    feedingTime: '11:00',
    etaMinutes: 5,
    route: [
      'From Main Gate, follow the shaded walkway',
      'Turn right at the sign Reptile House (green arrow)',
      'Tortoise exhibit at the end of the corridor'
    ],
    amenities: ['Accessible Ramp', 'Wheelchair Parking', 'Info Board']
  }
];

const grid = document.getElementById('animalGrid');
const panel = document.getElementById('directionsPanel');
const panelTitle = document.getElementById('panelTitle');
const panelSubtitle = document.getElementById('panelSubtitle');
const routeList = document.getElementById('routeList');
const eta = document.getElementById('eta');
const amenitiesEl = document.getElementById('amenities');
const availabilityEl = document.getElementById('availability');
const closeBtn = document.getElementById('closeBtn');
const getDirectionsBtn = document.getElementById('getDirectionsBtn');
const saveBtn = document.getElementById('saveBtn');
const moreImagesEl = document.getElementById('moreImages');
const moreImagesContainer = document.getElementById('moreImagesContainer');
const toast = document.getElementById('toast');

function createCard(animal){
  const card = document.createElement('article');
  card.className = 'card';
  card.innerHTML = `
    <img src="${animal.img}" alt="${animal.name}" data-id="${animal.id}" loading="lazy" />
    <div class="card-body">
      <h3 class="name">${animal.name}</h3>
      <div class="meta">${animal.species} • ${animal.location}</div>
      <div class="small">Feeding: ${animal.feedingTime}</div>
      <div style="margin-top:8px;display:flex;justify-content:space-between;align-items:center">
        <button class="btn" data-id="${animal.id}">Get Directions</button>
        <div class="small" title="Availability">${animal.availability}</div>
      </div>
    </div>
  `;
  const img = card.querySelector('img');
  const btn = card.querySelector('button');
  img.addEventListener('click', ()=> showDirections(animal.id));
  btn.addEventListener('click', ()=> showDirections(animal.id));
  return card;
}

animals.forEach(a => grid.appendChild(createCard(a)));

function showDirections(id){
  const animal = animals.find(x => x.id === id);
  if(!animal) return;
  panel.style.display = 'block';
  panelTitle.textContent = animal.name;
  panelSubtitle.textContent = animal.location + ' • Feeding ' + (animal.feedingTime || 'N/A');
  routeList.innerHTML = '';
  animal.route.forEach(step => {
    const li = document.createElement('li');
    li.textContent = step;
    routeList.appendChild(li);
  });
  eta.textContent = animal.etaMinutes + ' min (approx. walking time)';
  amenitiesEl.innerHTML = '';
  animal.amenities.forEach(a => {
    const d = document.createElement('div');
    d.className = 'amenity';
    d.textContent = a;
    amenitiesEl.appendChild(d);
  });
  availabilityEl.textContent = animal.availability;
  // show more images
  moreImagesEl.innerHTML = '';
  if(animal.images && animal.images.length){
    animal.images.forEach(src=>{
      const im = document.createElement('img');
      im.src = src;
      im.alt = animal.name;
      im.addEventListener('click', ()=> window.open(src, '_blank'));
      moreImagesEl.appendChild(im);
    });
    moreImagesContainer.style.display = 'block';
  } else {
    moreImagesContainer.style.display = 'none';
  }
  panel.dataset.animalId = id;
}

// close
closeBtn.addEventListener('click', ()=> {
  panel.style.display = 'none';
  panel.removeAttribute('data-animal-id');
});

// get directions (placeholder)
getDirectionsBtn.addEventListener('click', ()=>{
  const id = panel.dataset.animalId;
  const animal = animals.find(x=>x.id===id);
  if(!animal) return;
  alert('Open map for ' + animal.name + '\n(Integrate with Google Maps / zoo map in production.)');
});

// save visit
saveBtn.addEventListener('click', ()=>{
  const id = panel.dataset.animalId;
  const animal = animals.find(x=>x.id===id);
  if(!animal) return;
  const saved = JSON.parse(localStorage.getItem('zoo_saves') || '[]');
  saved.unshift({id: animal.id, name: animal.name, savedAt: new Date().toISOString()});
  localStorage.setItem('zoo_saves', JSON.stringify(saved));
  showToast('Saved visit for ' + animal.name);
});

// request form
const requestForm = document.getElementById('requestForm');
requestForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const form = new FormData(requestForm);
  const name = form.get('name');
  const email = form.get('email');
  const moreImages = form.get('moreImages') === 'on' || form.get('moreImages') === 'true' || form.get('moreImages') !== null;
  const detailed = form.get('detailedDirections') === 'on' || form.get('detailedDirections') === 'true' || form.get('detailedDirections') !== null;
  const requests = JSON.parse(localStorage.getItem('zoo_requests') || '[]');
  requests.unshift({name, email, moreImages, detailed, at: new Date().toISOString()});
  localStorage.setItem('zoo_requests', JSON.stringify(requests));
  showToast('Request saved. We will provide more images and directions soon.');
  requestForm.reset();
});

// toast
function showToast(msg){
  toast.textContent = msg;
  toast.style.display = 'block';
  setTimeout(()=> toast.style.display = 'none', 2000);
}

// keyboard esc
document.addEventListener('keydown', (e)=> {
  if(e.key === 'Escape' && panel.style.display === 'block') closeBtn.click();
});
