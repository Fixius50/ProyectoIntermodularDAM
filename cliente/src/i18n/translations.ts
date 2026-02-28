export const translations = {
    es: {
        auth: {
            login: "Acceder",
            register: "Unirse",
            nameLabel: "Nombre de Explorador",
            namePlaceholder: "Tu nombre o alias",
            emailLabel: "Correo Electrónico",
            emailPlaceholder: "ejemplo@aery.com",
            passLabel: "Contraseña de Encriptación",
            passPlaceholder: "••••••••",
            submitLogin: "Iniciar Expedición",
            submitRegister: "Crear Credenciales",
            loading: "Procesando Transacción...",
            errorInvalid: "Credenciales inválidas. Por favor, inténtalo de nuevo.",
            errorConn: "Ocurrió un error en la conexión.",
            footer: "Al continuar, aceptas la carta de preservación y los términos de ornitología de Aery."
        },
        profile: {
            title: "Mi Perfil",
            identity: "Identidad de Explorador",
            rank: "Naturalista de Rango",
            feathers: "Plumas",
            favCompanion: "Compañero Favorito",
            change: "Cambiar",
            noCompanion: "Sin Compañero",
            selectFav: "Toca para seleccionar tu ave favorita",
            captureFirst: "Captura aves en la expedición primero",
            stats: {
                species: "Especies Vistas",
                level: "Nivel Explorador",
                expeditions: "Expediciones",
                achievements: "Logros"
            },
            progress: "Progreso de Colección",
            badges: "Tus Insignias",
            history: "Bitácora de Logros",
            noActivity: "Aún no hay actividad registrada.",
            goExplore: "¡Sal a explorar!",
            viewFullHistory: "Ver historial completo",
            chooseAvatar: "Elige tu Avatar"
        },
        common: {
            language: "Idioma",
            spanish: "Castellano",
            english: "Inglés",
            close: "Cerrar"
        }
    },
    en: {
        auth: {
            login: "Login",
            register: "Join",
            nameLabel: "Explorer Name",
            namePlaceholder: "Your name or alias",
            emailLabel: "Email Address",
            emailPlaceholder: "example@aery.com",
            passLabel: "Encryption Password",
            passPlaceholder: "••••••••",
            submitLogin: "Start Expedition",
            submitRegister: "Create Credentials",
            loading: "Processing Transaction...",
            errorInvalid: "Invalid credentials. Please try again.",
            errorConn: "A connection error occurred.",
            footer: "By continuing, you accept the preservation charter and Aery's ornithology terms."
        },
        profile: {
            title: "My Profile",
            identity: "Explorer Identity",
            rank: "Naturalist Rank",
            feathers: "Feathers",
            favCompanion: "Favorite Companion",
            change: "Change",
            noCompanion: "No Companion",
            selectFav: "Tap to select your favorite bird",
            captureFirst: "Capture birds in expedition first",
            stats: {
                species: "Species Seen",
                level: "Explorer Level",
                expeditions: "Expeditions",
                achievements: "Achievements"
            },
            progress: "Collection Progress",
            badges: "Your Badges",
            history: "Achievement Log",
            noActivity: "No activity recorded yet.",
            goExplore: "Go explore!",
            viewFullHistory: "View full history",
            chooseAvatar: "Choose your Avatar"
        },
        common: {
            language: "Language",
            spanish: "Spanish",
            english: "English",
            close: "Close"
        }
    }
};

export type TranslationKeys = typeof translations.es;
