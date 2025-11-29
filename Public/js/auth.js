// Verificar si el usuario está autenticado
function checkAuth() {
    const user = localStorage.getItem('user');
    if (!user) {
        window.location.href = '/login';
        return null;
    }
    return JSON.parse(user);
}

// Cerrar sesión
function logout() {
    localStorage.removeItem('user');
    window.location.href = '/login';
}

// Obtener usuario actual
function getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// Mostrar información del usuario en el header
function displayUserInfo() {
    const user = getCurrentUser();
    if (user) {
        const userInfoDiv = document.getElementById('userInfo');
        if (userInfoDiv) {
            userInfoDiv.innerHTML = 
                '<span>👤 <strong>' + user.nombre + ' ' + user.apellido + '</strong> (' + user.rol + ')</span>' +
                '<button onclick="logout()" style="margin-left: 15px; padding: 5px 15px; cursor: pointer; background: rgba(255,255,255,0.2); border: 1px solid white; color: white; border-radius: 5px;">' +
                    'Cerrar Sesión' +
                '</button>';
        }
    }
}