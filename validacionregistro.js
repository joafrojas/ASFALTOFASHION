const loginSection = document.getElementById('loginForm');
const registerSection = document.getElementById('registerForm');

document.getElementById('toRegister').onclick = e => {
  e.preventDefault();
  clearErrors();
  loginSection.style.display = 'none';
  registerSection.style.display = 'block';
};

document.getElementById('toLogin').onclick = e => {
  e.preventDefault();
  clearErrors();
  registerSection.style.display = 'none';
  loginSection.style.display = 'block';
};

function clearErrors() {
  document.querySelectorAll('.error').forEach(el => el.textContent = '');
}

function setError(id, msg) {
  document.getElementById(id).textContent = msg;
}

function validarRut(rut) {
  return /^\d{7,8}-[\dKk]$/.test(rut);
}

function validarCorreo(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarPassword(pass) {
  return pass.length >= 6;
}

function validarEdad(fecha) {
  const hoy = new Date();
  const nacimiento = new Date(fecha);
  const edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  const dia = hoy.getDate() - nacimiento.getDate();

  if (mes < 0 || (mes === 0 && dia < 0)) {
    return edad - 1 >= 18;
  }
  return edad >= 18;
}

document.getElementById('registerForm').onsubmit = e => {
  e.preventDefault();
  clearErrors();

  const campos = {
    rut: document.getElementById('rut').value.trim(),
    nombre: document.getElementById('nombre').value.trim(),
    fecha_nac: document.getElementById('fecha_nac').value.trim(),
    correo: document.getElementById('correo').value.trim(),
    nombre_usu: document.getElementById('nombre_usu').value.trim(),
    password: document.getElementById('password_reg').value.trim()
  };

  let valid = true;

  if (!validarRut(campos.rut)) setError('errorRut', 'RUT inválido'), valid = false;
  if (!campos.nombre) setError('errorNombre', 'Ingresa tu nombre'), valid = false;
  if (!campos.fecha_nac) setError('errorFechaNac', 'Ingresa tu fecha de nacimiento'), valid = false;
  else if (!validarEdad(campos.fecha_nac)) setError('errorFechaNac', 'Debes tener al menos 18 años'), valid = false;
  if (!validarCorreo(campos.correo)) setError('errorCorreo', 'Correo inválido'), valid = false;
  if (!campos.nombre_usu) setError('errorNombreUsu', 'Ingresa un usuario'), valid = false;
  if (!validarPassword(campos.password)) setError('errorPasswordReg', 'Contraseña mínima 6 caracteres'), valid = false;

  if (!valid) return;

  const users = JSON.parse(localStorage.getItem('users') || '[]');

  if (users.some(u => u.nombre_usu === campos.nombre_usu)) return setError('errorNombreUsu', 'Usuario ya existe');
  if (users.some(u => u.rut === campos.rut)) return setError('errorRut', 'RUT ya registrado');
  if (users.some(u => u.correo === campos.correo)) return setError('errorCorreo', 'Correo ya registrado');

  users.push(campos);
  localStorage.setItem('users', JSON.stringify(users));
  alert('Registro exitoso. Ahora inicia sesión.');
  document.getElementById('registerForm').reset();
  loginSection.style.display = 'block';
  registerSection.style.display = 'none';
};

document.getElementById('loginForm').onsubmit = e => {
  e.preventDefault();
  clearErrors();

  const usuario = document.getElementById('usuario').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!usuario) return setError('errorUsuario', 'Ingresa tu usuario');
  if (!password) return setError('errorPassword', 'Ingresa tu contraseña');

  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.nombre_usu === usuario && u.password === password);

  if (user) {
    localStorage.setItem('nombreActivo', user.nombre); 
    window.location.href = "pagmomentanea.html";
  } else {
    setError('errorPassword', 'Usuario o contraseña incorrectos');
  }
};