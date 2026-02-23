import customtkinter as ctk
import tkinter.filedialog as fd
import os
import shutil
import threading
from git import Repo
import subprocess

ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("blue")

# Aquí incluimos el formato gguf y otros pesados para que active LFS automáticamente
LFS_EXTENSIONS = ['.gguf', '.psd', '.mp4', '.zip', '.tar.gz', '.bin', '.png', '.jpg']

class AvisUltimateUploader(ctk.CTk):
    def __init__(self):
        super().__init__()

        self.title("AVIS Dev Uploader - Pro Edition")
        self.geometry("700x650")
        
        self.repo_path = ctk.StringVar(value=os.path.expanduser("~/ProyectoIntermodularDAM"))
        self.selected_files = []

        self.frame_top = ctk.CTkFrame(self)
        self.frame_top.pack(pady=10, padx=20, fill="x")

        self.lbl_repo = ctk.CTkLabel(self.frame_top, text="Ruta del Repositorio Local:", font=("Roboto", 14, "bold"))
        self.lbl_repo.pack(anchor="w", padx=10, pady=(10, 0))
        
        self.entry_repo = ctk.CTkEntry(self.frame_top, textvariable=self.repo_path, width=500)
        self.entry_repo.pack(side="left", padx=10, pady=10)
        
        self.btn_repo = ctk.CTkButton(self.frame_top, text="Cambiar Repo", command=self.select_repo, width=100)
        self.btn_repo.pack(side="left", padx=10, pady=10)

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
            if repo.is_dirty(untracked_files=True):
                self.log("Aviso: Hay cambios locales sin commitear. Se incluirán en esta subida.")

            self.log("Copiando archivos al espacio de trabajo...")
            for filepath in self.selected_files:
                filename = os.path.basename(filepath)
                destino = os.path.join(repo_dir, filename)
                
                if filepath != destino:
                    shutil.copy2(filepath, destino)
                    self.log(f"Copiado: {filename}")

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
            self.log(f"❌ ERROR CRÍTICO: Asegúrate de haber seleccionado una carpeta que sea un repositorio Git válido. Detalle: {str(e)}")
        
        finally:
            self.btn_upload.configure(state="normal", text="3. Sincronizar y Subir a GitHub")

if __name__ == "__main__":
    app = AvisUltimateUploader()
    app.mainloop()
