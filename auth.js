const AUTH_KEY = 'ekology_users';
const SESSION_KEY = 'ekology_session';

function getUsers(){
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY)) || [];
  } catch(e){
    return [];
  }
}

function saveUsers(users){
  localStorage.setItem(AUTH_KEY, JSON.stringify(users));
}

function getSession(){
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch(e){
    return null;
  }
}

function setSession(user){
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    id: user.id,
    name: user.name,
    email: user.email,
    loginAt: new Date().toISOString()
  }));
}

function clearSession(){
  localStorage.removeItem(SESSION_KEY);
}

function isValidEmail(email){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(password){
  return password.length >= 6;
}

function getPasswordStrength(password){
  let score = 0;
  if(password.length >= 6) score++;
  if(password.length >= 10) score++;
  if(/[A-Z]/.test(password)) score++;
  if(/[0-9]/.test(password)) score++;
  if(/[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(score, 4);
}

function showError(el, message){
  if(!el) return;
  el.textContent = '⚠️ ' + message;
  el.classList.add('show');
}

function hideError(el){
  if(!el) return;
  el.classList.remove('show');
}

function initLogin(){
  const form = document.getElementById('loginForm');
  if(!form) return;

  const emailInput = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');
  const errorBox = document.getElementById('loginError');
  const submitBtn = document.getElementById('loginBtn');

  form.addEventListener('submit', function(e){
    e.preventDefault();
    hideError(errorBox);

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    if(!email || !isValidEmail(email)){
      showError(errorBox, 'To\'g\'ri email kiriting');
      emailInput.classList.add('error');
      return;
    }
    emailInput.classList.remove('error');

    if(!password){
      showError(errorBox, 'Parolni kiriting');
      passwordInput.classList.add('error');
      return;
    }
    passwordInput.classList.remove('error');

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    setTimeout(function(){
      const users = getUsers();
      const user = users.find(function(u){
        return u.email === email && u.password === password;
      });

      if(!user){
        showError(errorBox, 'Email yoki parol noto\'g\'ri');
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        return;
      }

      setSession(user);
      showWelcome(user);
    }, 800);
  });

  const toggle = document.getElementById('loginPasswordToggle');
  if(toggle){
    toggle.addEventListener('click', function(){
      if(passwordInput.type === 'password'){
        passwordInput.type = 'text';
        this.textContent = '🙈';
      } else {
        passwordInput.type = 'password';
        this.textContent = '👁️';
      }
    });
  }
}

function initRegister(){
  const form = document.getElementById('registerForm');
  if(!form) return;

  const nameInput = document.getElementById('regName');
  const emailInput = document.getElementById('regEmail');
  const passwordInput = document.getElementById('regPassword');
  const confirmInput = document.getElementById('regConfirm');
  const errorBox = document.getElementById('registerError');
  const submitBtn = document.getElementById('registerBtn');
  const strengthBars = document.querySelectorAll('.password-strength-bar');

  passwordInput.addEventListener('input', function(){
    const strength = getPasswordStrength(this.value);
    strengthBars.forEach(function(bar, i){
      bar.className = 'password-strength-bar';
      if(i < strength){
        if(strength <= 1) bar.classList.add('active-weak');
        else if(strength <= 2) bar.classList.add('active-medium');
        else bar.classList.add('active-strong');
      }
    });
  });

  form.addEventListener('submit', function(e){
    e.preventDefault();
    hideError(errorBox);

    const name = nameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;
    const confirm = confirmInput.value;

    if(name.length < 2){
      showError(errorBox, 'Ismingizni kiriting (kamida 2 harf)');
      nameInput.classList.add('error');
      return;
    }
    nameInput.classList.remove('error');

    if(!isValidEmail(email)){
      showError(errorBox, 'To\'g\'ri email kiriting');
      emailInput.classList.add('error');
      return;
    }
    emailInput.classList.remove('error');

    if(!isValidPassword(password)){
      showError(errorBox, 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak');
      passwordInput.classList.add('error');
      return;
    }
    passwordInput.classList.remove('error');

    if(password !== confirm){
      showError(errorBox, 'Parollar mos kelmadi');
      confirmInput.classList.add('error');
      return;
    }
    confirmInput.classList.remove('error');

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    setTimeout(function(){
      const users = getUsers();

      if(users.find(function(u){ return u.email === email; })){
        showError(errorBox, 'Bu email allaqachon ro\'yxatdan o\'tgan');
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        return;
      }

      const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password,
        createdAt: new Date().toISOString(),
        trees: 0,
        prize: 0
      };

      users.push(newUser);
      saveUsers(users);
      setSession(newUser);
      showWelcome(newUser);
    }, 800);
  });

  const toggle = document.getElementById('regPasswordToggle');
  if(toggle){
    toggle.addEventListener('click', function(){
      if(passwordInput.type === 'password'){
        passwordInput.type = 'text';
        confirmInput.type = 'text';
        this.textContent = '🙈';
      } else {
        passwordInput.type = 'password';
        confirmInput.type = 'password';
        this.textContent = '👁️';
      }
    });
  }
}

function showWelcome(user){
  const form = document.querySelector('.auth-form');
  const footer = document.querySelector('.auth-footer');
  const title = document.querySelector('.auth-title');
  const subtitle = document.querySelector('.auth-subtitle');

  if(title) title.style.display = 'none';
  if(subtitle) subtitle.style.display = 'none';
  if(form) form.style.display = 'none';
  if(footer) footer.style.display = 'none';

  const card = document.querySelector('.auth-card');
  const welcome = document.createElement('div');
  welcome.className = 'welcome-box show';
  welcome.innerHTML = `
    <div class="welcome-icon">🎉</div>
    <h2>Xush kelibsiz, ${user.name}!</h2>
    <p>Siz muvaffaqiyatli tizimga kirdingiz.</p>
    <div class="welcome-actions">
      <a href="index.html" class="auth-btn">🏠 Bosh sahifaga</a>
      <a href="trees.html" class="auth-btn" style="background:linear-gradient(135deg,#18b957,#0d7a3a);">🌳 Daraxt ekish</a>
    </div>
  `;
  card.appendChild(welcome);
}

function checkAutoLogin(){
  const session = getSession();
  if(session && (window.location.pathname.includes('login') || window.location.pathname.includes('register'))){
    showWelcome(session);
    return true;
  }
  return false;
}

document.addEventListener('DOMContentLoaded', function(){
  if(!checkAutoLogin()){
    initLogin();
    initRegister();
  }
});

window.EkologyAuth = {
  getUser: getSession,
  logout: function(){
    clearSession();
    window.location.href = 'login.html';
  },
  isLoggedIn: function(){
    return getSession() !== null;
  },
  getUsers: getUsers
};