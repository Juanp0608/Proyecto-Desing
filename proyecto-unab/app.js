const ACTIVITY_OPTIONS = {
    Futbol: "Deportivas",
    Padel: "Deportivas",
    Gym: "Deportivas",
    "Servicio bibliotecario": "Bienestar",
    Charla: "Culturales",
    Conferencia: "Culturales",
    Concierto: "Culturales",
    Psicologia: "Bienestar",
    Convivencia: "Bienestar",
    Recreacion: "Bienestar",
    "Jornada de integración Banú": "Bienestar",
    "Entrenamiento libre en gimnasio": "Deportivas",
    "Conferencia de liderazgo universitario": "Culturales",
    "Charla sobre adaptividad social": "Bienestar",
    "Socialización y adaptación universitaria": "Bienestar",
    "Charla cultural": "Culturales"
};

const PLACE_ACTIVITIES = [
    {
        id: "banu-integracion",
        lugar: "Banú",
        direccion: "Espacio de bienestar estudiantil",
        nombre: "Jornada de integración Banú",
        categoria: "Bienestar",
        etiqueta: "Bienestar",
        tagClass: "tag-wellness",
        imagen: "https://unab.edu.co/wp-content/uploads/2022/01/10.-Plazoleta-Banu.jpg",
        imagenAlt: "Plazoleta Banu",
        fecha: "Martes 9 de junio de 2026",
        fechaISO: "2026-06-09T15:00:00",
        horas: 2,
        cupos: 25
    },
    {
        id: "gimnasio-diario",
        lugar: "Gimnasio",
        direccion: "Zona deportiva universitaria",
        nombre: "Entrenamiento libre en gimnasio",
        categoria: "Deportivas",
        etiqueta: "Deportiva",
        tagClass: "tag-sport",
        imagen: "https://unab.edu.co/wp-content/uploads/2022/01/4.-Gimnasio.jpg",
        imagenAlt: "Gimnasio UNAB",
        fecha: "Disponible una vez por día",
        fechaISO: "",
        horas: 2,
        cupos: 30,
        daily: true
    },
    {
        id: "cafeteria-casona-adaptividad",
        lugar: "Cafetería Casona",
        direccion: "Sector Casona",
        nombre: "Charla sobre adaptividad social",
        categoria: "Bienestar",
        etiqueta: "Bienestar",
        tagClass: "tag-wellness",
        imagen: "https://unab.edu.co/wp-content/uploads/2022/01/2.Fachada-2-Casona.jpg",
        imagenAlt: "Cafetería Casona",
        fecha: "Jueves 11 de junio de 2026",
        fechaISO: "2026-06-11T10:00:00",
        horas: 2,
        cupos: 35
    },
    {
        id: "cafeteria-bosque-socializacion",
        lugar: "Cafetería Bosque",
        direccion: "Sector Bosque",
        nombre: "Socialización y adaptación universitaria",
        categoria: "Bienestar",
        etiqueta: "Bienestar",
        tagClass: "tag-wellness",
        fecha: "Miércoles 17 de junio de 2026",
        fechaISO: "2026-06-17T09:00:00",
        horas: 2,
        cupos: 35
    },
    {
        id: "auditorio-mayor-conferencia",
        lugar: "Auditorio Mayor",
        direccion: "Bloque académico principal",
        nombre: "Conferencia de liderazgo universitario",
        categoria: "Culturales",
        etiqueta: "Cultural",
        tagClass: "tag-culture",
        imagen: "https://unab.edu.co/wp-content/uploads/2022/01/5.-Interior-Auditorio-Mayor-Carlos-Gomez-Ibarra.jpg",
        imagenAlt: "Interior Auditorio Mayor Carlos Gomez Ibarra",
        fecha: "Lunes 22 de junio de 2026",
        fechaISO: "2026-06-22T14:00:00",
        horas: 2,
        cupos: 80
    },
    {
        id: "cafeteria-csu-cultural",
        lugar: "Cafetería CSU",
        direccion: "Centro de Servicios Universitarios",
        nombre: "Charla cultural",
        categoria: "Culturales",
        etiqueta: "Cultural",
        tagClass: "tag-culture",
        fecha: "Viernes 26 de junio de 2026",
        fechaISO: "2026-06-26T16:00:00",
        horas: 2,
        cupos: 35
    }
];

function getUsers() {
    return JSON.parse(localStorage.getItem("usuariosUnab")) || [];
}

function saveUsers(users) {
    localStorage.setItem("usuariosUnab", JSON.stringify(users));
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem("usuarioActual"));
}

function setCurrentUser(user) {
    localStorage.setItem("usuarioActual", JSON.stringify(user));
}

function logoutUser() {
    localStorage.removeItem("usuarioActual");
    window.location.href = "login.html";
}

function getActivityKey() {
    const user = getCurrentUser();
    return user ? `actividades_${user.codigo}` : "actividades";
}

function isValidActivity(activity) {
    return activity &&
        ACTIVITY_OPTIONS[activity.nombre] &&
        activity.lugar &&
        activity.horas &&
        activity.fecha;
}

function getActivities() {
    const userActivities = JSON.parse(localStorage.getItem(getActivityKey())) || [];
    const validActivities = userActivities.filter(isValidActivity);

    if (validActivities.length !== userActivities.length) {
        localStorage.setItem(getActivityKey(), JSON.stringify(validActivities));
    }

    return validActivities;
}

function saveActivities(activities) {
    localStorage.setItem(getActivityKey(), JSON.stringify(activities));
}

function getPlaceActivityById(activityId) {
    return PLACE_ACTIVITIES.find(activity => activity.id === activityId);
}

function getPlaceActivityRegistrations(activityId, dateKey) {
    const registrations = JSON.parse(localStorage.getItem("registrosLugaresUnab")) || {};
    const key = dateKey ? `${activityId}_${dateKey}` : activityId;
    return registrations[key] || [];
}

function savePlaceActivityRegistration(activityId, userCode, dateKey) {
    const registrations = JSON.parse(localStorage.getItem("registrosLugaresUnab")) || {};
    const key = dateKey ? `${activityId}_${dateKey}` : activityId;
    const current = registrations[key] || [];

    if (!current.includes(userCode)) {
        current.push(userCode);
    }

    registrations[key] = current;
    localStorage.setItem("registrosLugaresUnab", JSON.stringify(registrations));
}

function registerPlaceActivity(activityId) {
    const user = getCurrentUser();
    const activity = getPlaceActivityById(activityId);

    if (!user) {
        alert("Debes iniciar sesion para registrarte.");
        window.location.href = "login.html";
        return;
    }

    if (!activity) {
        alert("No se encontro la actividad seleccionada.");
        return;
    }

    const todayKey = new Date().toISOString().slice(0, 10);
    const registrationDateKey = activity.daily ? todayKey : "";
    const registrations = getPlaceActivityRegistrations(activity.id, registrationDateKey);

    if (registrations.includes(user.codigo)) {
        alert(activity.daily
            ? "Ya registraste esta actividad del gimnasio hoy. Podrás volver a hacerlo mañana."
            : "Ya estas registrado en esta actividad.");
        return;
    }

    if (activity.cupos && registrations.length >= activity.cupos) {
        alert("No quedan cupos disponibles para esta actividad.");
        return;
    }

    const activities = getActivities();
    const date = activity.daily ? new Date() : new Date(activity.fechaISO);

    activities.push({
        fecha: activity.daily ? date.toLocaleDateString() : activity.fecha,
        fechaISO: activity.daily ? date.toISOString() : activity.fechaISO,
        nombre: activity.nombre,
        categoria: activity.categoria,
        lugar: activity.lugar,
        horas: String(activity.horas),
        semestre: getCurrentSemesterValue()
    });

    saveActivities(activities);
    savePlaceActivityRegistration(activity.id, user.codigo, registrationDateKey);
    alert(`Registro exitoso. Sumaste ${activity.horas} horas libres.`);
    window.location.href = "dashboard.html";
}

function getInitials(name) {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(part => part[0].toUpperCase())
        .join("");
}

function updateUserLabels() {
    const user = getCurrentUser();
    if (!user) return;

    document.querySelectorAll("[data-user-name]").forEach(element => {
        element.textContent = user.nombre;
    });

    document.querySelectorAll("[data-user-career]").forEach(element => {
        element.textContent = user.carrera;
    });

    document.querySelectorAll("[data-user-initials]").forEach(element => {
        element.textContent = getInitials(user.nombre);
    });
}

function getCurrentSemesterLabel() {
    const now = new Date();
    const year = now.getFullYear();
    const period = now.getMonth() < 6 ? "primer semestre" : "segundo semestre";
    return `${year} ${period}`;
}

function getCurrentSemesterValue() {
    const now = new Date();
    const year = now.getFullYear();
    const period = now.getMonth() < 6 ? "I" : "II";
    return `${year}-${period}`;
}
