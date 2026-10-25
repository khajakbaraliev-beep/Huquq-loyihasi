/* ============================================================
   MOBILE MENU
   ============================================================ */
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');

if(menuToggle){
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

/* ============================================================
   REVEAL ANIMATION
   ============================================================ */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('show');
    }
  });
}, { threshold:.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ============================================================
   DARK / LIGHT THEME
   ============================================================ */
const themeBtn = document.getElementById('themeBtn');

if(themeBtn){
  if(localStorage.getItem('theme') === 'light'){
    document.body.classList.add('light');
    themeBtn.textContent = '☾';
  }

  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    themeBtn.textContent = isLight ? '☾' : '☼';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
}

/* ============================================================
   ACTIVE NAV LINK
   ============================================================ */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if(href === currentPage){
    link.classList.add('active');
  }
});

/* ============================================================
   FOYDALANUVCHI MENYUSI
   ============================================================ */
function updateUserMenu(){
  if(!window.EkologyAuth) return;

  const session = window.EkologyAuth.getUser();
  const userMenu = document.getElementById('userMenu');
  const loginLink = document.getElementById('loginLink');

  if(session && userMenu && loginLink){
    userMenu.style.display = 'block';
    loginLink.style.display = 'none';

    const avatar = document.getElementById('userAvatar');
    const name = document.getElementById('userName');
    const dName = document.getElementById('dropdownName');
    const dEmail = document.getElementById('dropdownEmail');

    if(avatar) avatar.textContent = session.name.charAt(0).toUpperCase();
    if(name) name.textContent = session.name.split(' ')[0];
    if(dName) dName.textContent = session.name;
    if(dEmail) dEmail.textContent = session.email;
  } else if(userMenu && loginLink){
    userMenu.style.display = 'none';
    loginLink.style.display = 'inline-block';
  }
}

document.addEventListener('DOMContentLoaded', function(){
  updateUserMenu();

  const userBtn = document.getElementById('userBtn');
  const dropdown = document.getElementById('userDropdown');

  if(userBtn && dropdown){
    userBtn.addEventListener('click', function(e){
      e.stopPropagation();
      dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    });

    document.addEventListener('click', function(e){
      if(!e.target.closest('#userMenu')){
        dropdown.style.display = 'none';
      }
    });
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if(logoutBtn){
    logoutBtn.addEventListener('click', function(){
      if(confirm('Hisobdan chiqmoqchimisiz?')){
        window.EkologyAuth.logout();
      }
    });
  }
});