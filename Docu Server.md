Documentación Técnica y Configuración - AVIS: Chronicles of Flight
Este documento detalla la arquitectura base, la configuración del entorno de desarrollo (optimizado para Lubuntu/Debian) y el uso de las herramientas internas creadas para el proyecto AVIS (juego TCG con geolocalización y mecánicas MMO).

1. Stack Tecnológico del Proyecto
El proyecto está diseñado para soportar alta concurrencia y baja latencia:

Backend: Java 21 con Spring Boot 3 (WebFlux / Reactor) y RSocket.

Base de Datos: Supabase (PostgreSQL con JSONB) y Redis (Caché/Marketplace).

Frontend: React Native / Flutter.

Herramientas Auxiliares: Scripts en Python y Node.js para gestión de assets y modelos.

2. Preparación del Entorno de Desarrollo (Lubuntu)
Para desarrollar el servidor backend y ejecutar las herramientas del equipo, es necesario instalar las siguientes dependencias base en el sistema operativo:

2.1. Herramientas Base y Lenguajes
Bash
# Actualizar repositorios del sistema
sudo apt update && sudo apt upgrade -y

# Instalar Python 3 y entornos virtuales (necesario para las herramientas internas)
sudo apt install python3 python3-pip python3-venv python3-tk -y

# Instalar Node.js y npm (para los MCPs del editor Antigravity)
sudo apt install nodejs npm -y

# Instalar Java 21 (JDK requerido por Spring Boot 3) y Maven
sudo apt install openjdk-21-jdk maven -y
2.2. Infraestructura y Contenedores
Bash
# Instalar Docker para levantar Redis y RabbitMQ/Kafka en local
sudo apt install docker.io docker-compose -y
sudo usermod -aG docker $USER # Requiere reiniciar sesión

# Instalar Git y Git LFS (Large File Storage)
sudo apt install git git-lfs -y
git lfs install
3. Herramienta Interna: AVIS Dev Uploader
Para facilitar el trabajo del equipo, se ha desarrollado una aplicación de escritorio que automatiza la sincronización con GitHub. Está diseñada específicamente para evitar bloqueos en el repositorio al subir archivos masivos, configurando automáticamente Git LFS para los modelos .gguf generados en local, audios pesados y assets gráficos de alta resolución.

3.1. Instalación de la Herramienta
Abre la terminal y ejecuta estos comandos para crear un entorno aislado e instalar la aplicación:

Bash
mkdir ~/avis-dev-tools
cd ~/avis-dev-tools
python3 -m venv venv
source venv/bin/activate
python -m pip install customtkinter GitPython
3.2. Código Fuente (app.py)
Dentro de la carpeta ~/avis-dev-tools, crea un archivo llamado app.py y pega el siguiente código:

Python
import customtkinter as ctk
import tkinter.filedialog as fd
import os
import shutil
import threading
from git import Repo
import subprocess

# Configuración visual
ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("blue")

# Extensiones configuradas para Git LFS automático
LFS_EXTENSIONS = ['.gguf', '.psd', '.mp4', '.zip', '.tar.gz', '.bin', '.png', '.jpg']

class AvisUltimateUploader(ctk.CTk):
    def __init__(self):
        super().__init__()

        self.title("AVIS Dev Uploader - Pro Edition")
        self.geometry("700x650")
        
        self.repo_path = ctk.StringVar(value=os.getcwd())
        self.selected_files = []

        # Interfaz - Sección Superior
        self.frame_top = ctk.CTkFrame(self)
        self.frame_top.pack(pady=10, padx=20, fill="x")

        self.lbl_repo = ctk.CTkLabel(self.frame_top, text="Ruta del Repositorio Local:", font=("Roboto", 14, "bold"))
        self.lbl_repo.pack(anchor="w", padx=10, pady=(10, 0))
        
        self.entry_repo = ctk.CTkEntry(self.frame_top, textvariable=self.repo_path, width=500)
        self.entry_repo.pack(side="left", padx=10, pady=10)
        
        self.btn_repo = ctk.CTkButton(self.frame_top, text="Cambiar Repo", command=self.select_repo, width=100)
        self.btn_repo.pack(side="left", padx=10, pady=10)

        # Interfaz - Sección Media
        self.frame_mid = ctk.CTkFrame(self)
        self.frame_mid.pack(pady=10, padx=20, fill="x")

        self.btn_select = ctk.CTkButton(self.frame_mid, text="1. Seleccionar Archivos a Subir", command=self.select_files)
        self.btn_select.pack(pady=10)

        self.files_label = ctk.CTkLabel(self.frame_mid, text="0 archivos seleccionados", text_color="gray")
        self.files_label.pack(pady=5)

        self.commit_msg = ctk.CTkEntry(self.frame_mid, placeholder_text="2. Escribe el mensaje del commit...", width=500)
        self.commit_msg.pack(pady=15)

        self.btn_upload = ctk.CTkButton(self.frame_mid, text="3. Sincronizar y Subir a GitHub", command=self.start_upload_thread, fg_color="#10b981", hover_color="#059669", font=("Roboto", 14, "bold"))
        self.btn_upload.pack(pady=10)

        # Interfaz - Consola de Logs
        self.lbl_log = ctk.CTkLabel(self, text="Terminal de Operaciones:", font=("Roboto", 12, "bold"))
        self.lbl_log.pack(anchor="w", padx=20)

        self.log_console = ctk.CTkTextbox(self, width=660, height=200, state="disabled", fg_color="#1e1e1e", text_color="#00ff00")
        self.log_console.pack(pady=5, padx=20)

    def log(self, message):
        self.log_console.configure(state="normal")
        self.log_console.insert("end", f"> {message}\n")
        self.log_console.see("end")
        self.log_console.configure(state="disabled")

    def select_repo(self):
        directorio = fd.askdirectory(title="Selecciona la carpeta raíz del repositorio Git")
        if directorio:
            self.repo_path.set(directorio)
            self.log(f"Repositorio fijado en: {directorio}")

    def select_files(self):
        archivos = fd.askopenfilenames(title="Elige los archivos para añadir al proyecto")
        if archivos:
            self.selected_files = list(archivos)
            self.files_label.configure(text=f"{len(archivos)} archivo(s) listo(s) para copiar y subir", text_color="white")
            self.log(f"Se han seleccionado {len(archivos)} archivos.")

    def start_upload_thread(self):
        if not self.selected_files:
            self.log("ERROR: No has seleccionado ningún archivo.")
            return
        if not self.commit_msg.get():
            self.log("ERROR: El mensaje de commit no puede estar vacío.")
            return
        
        self.btn_upload.configure(state="disabled", text="Subiendo...")
        hilo = threading.Thread(target=self.process_and_upload)
        hilo.start()

    def process_and_upload(self):
        repo_dir = self.repo_path.get()
        mensaje = self.commit_msg.get()

        try:
            self.log("Verificando repositorio Git...")
            repo = Repo(repo_dir)
            
            self.log("Copiando archivos al espacio de trabajo...")
            for filepath in self.selected_files:
                filename = os.path.basename(filepath)
                destino = os.path.join(repo_dir, filename)
                
                if filepath != destino:
                    shutil.copy2(filepath, destino)
                    self.log(f"Copiado: {filename}")

                # Auto-configuración de Git LFS
                ext = os.path.splitext(filename)[1].lower()
                if ext in LFS_EXTENSIONS:
                    self.log(f"Extensión pesada detectada ({ext}). Configurando Git LFS...")
                    subprocess.run(["git", "lfs", "track", f"*{ext}"], cwd=repo_dir, check=True, capture_output=True)
                    repo.git.add(".gitattributes")

            self.log("Añadiendo archivos al índice (git add)...")
            repo.git.add(all=True)

            self.log(f"Creando commit: '{mensaje}'...")
            repo.index.commit(mensaje)

            self.log("Enviando datos a GitHub (git push)... Esto puede tardar.")
            origen = repo.remote(name='origin')
            info_push = origen.push()
            
            for info in info_push:
                self.log(f"Resultado Push: {info.summary}")

            self.log("✅ ¡SUBIDA COMPLETADA CON ÉXITO!")
            
            self.selected_files = []
            self.files_label.configure(text="0 archivos seleccionados", text_color="gray")
            self.commit_msg.delete(0, 'end')

        except Exception as e:
            self.log(f"❌ ERROR CRÍTICO: {str(e)}")
        
        finally:
            self.btn_upload.configure(state="normal", text="3. Sincronizar y Subir a GitHub")

if __name__ == "__main__":
    app = AvisUltimateUploader()
    app.mainloop()
3.3. Acceso Directo de Escritorio (Lanzador)
Para no tener que abrir la terminal cada vez, se creó un acceso directo en el escritorio de Lubuntu. Ejecuta esto en la terminal:

Bash
cd $(xdg-user-dir DESKTOP)
nano AVIS_Uploader.desktop
Pega el siguiente contenido, guarda (Ctrl + O) y sal (Ctrl + X):

Ini, TOML
[Desktop Entry]
Version=1.0
Type=Application
Name=AVIS Dev Uploader
Comment=Herramienta interna para subir archivos masivos a GitHub
Exec=bash -c "cd ~/avis-dev-tools && source venv/bin/activate && python app.py"
Icon=utilities-terminal
Terminal=false
Categories=Development;
Finalmente, dale permisos de ejecución:

Bash
chmod +x AVIS_Uploader.desktop
(Ahora puedes hacer doble clic en el icono del escritorio para lanzar la aplicación).
