from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import cv2
import numpy as np
import os

app = Flask(__name__)
CORS(app) 

# Carpeta para guardar imagenes
UPLOAD_FOLDER = 'fish'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Ruta para subir las imagenes
@app.route('/upload', methods=['POST'])
def upload_image():
    file = request.files['image'] 
    filename = file.filename 
    filepath = os.path.join(UPLOAD_FOLDER, filename) 
    file.save(filepath) 

    # Se lee la imagen con OpenCV
    img = cv2.imread(filepath)
    # Pasar imagen a colores HSV
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)  

    # Identificar colores del fondo pa quitarlos
    lower_green = np.array([35, 40, 40])
    upper_green = np.array([90, 255, 255])
    mask_green = cv2.inRange(hsv, lower_green, upper_green)

    lower_white = np.array([0, 0, 200])
    upper_white = np.array([180, 50, 255])
    mask_white = cv2.inRange(hsv, lower_white, upper_white)

    # Combina las máscaras para verde y blanco
    mask_combined = cv2.bitwise_or(mask_green, mask_white)
    mask_inv = cv2.bitwise_not(mask_combined)  

    # Quita fondos
    img_bgra = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)
    img_bgra[:, :, 3] = mask_inv  

    # Guardar imagen sin fondo
    out_filename = filename.rsplit('.', 1)[0] + '.png'
    out_path = os.path.join(UPLOAD_FOLDER, out_filename)
    cv2.imwrite(out_path, img_bgra)

    # Matar archivo
    if 'assets' not in filepath:
        try:
            os.remove(filepath)
        except Exception as e:
            print(f"No se elimino lol: {e}")

    return jsonify({"status": "success", "filename": out_filename})

@app.route('/fish/<path:filename>')
def get_image(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

# Obtener lista con imagenes
@app.route('/fish', methods=['GET'])
def list_fishes():
    files = [f for f in os.listdir(UPLOAD_FOLDER) if f.endswith('.png')] 
    return jsonify(files)

if __name__ == '__main__':
    app.run(debug=True)
