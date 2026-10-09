from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
from google import genai
import os
import psycopg2

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Inicialización segura de Gemini y Neon PostgreSQL mediante variables de entorno
client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
DATABASE_URL = os.environ.get("DATABASE_URL")

def obtener_conexion_db():
    return psycopg2.connect(DATABASE_URL)

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "status": "online",
        "message": "Bienvenido a la API de DahliaVersa - Servidor de Validación Inteligente Activo"
    })

def validar_imagen_con_gemini(image_path, tipo_reporte):
    try:
        descripciones_esperadas = {
            "baches": "un bache, pavimento roto, bacheo o daño severo en la calle o asfalto",
            "fuga-agua": "una tubería rota, fuga de agua, chorro de agua o aniegos en la vía pública",
            "poste-luz": "un poste de luz dañado, luminaria fallando, cables colgando o poste eléctrico"
        }
        criterio = descripciones_esperadas.get(tipo_reporte, "una incidencia de infraestructura urbana")
        imagen = Image.open(image_path)
        
        prompt = (
            f"Analiza con atención esta fotografía. El ciudadano reporta: '{tipo_reporte}'. "
            f"Para ser considerada válida, la imagen debe mostrar claramente {criterio}. "
            "Responde estrictamente en el siguiente formato JSON simulado (sin bloques de código markdown adicionales): "
            '{"valido": true o false, "razon": "Explicación breve y clara del motivo"}'
        )

        response = client.models.generate_content(model='gemini-3.8-flash', contents=[imagen, prompt])
        texto_respuesta = response.text.strip().replace("```json", "").replace("```", "").strip()
        resultado_ia = json.loads(texto_respuesta)
        return resultado_ia.get("valido", False), resultado_ia.get("razon", "Análisis completado.")
    except Exception as e:
        return False, f"Error en validación con IA: {str(e)}"

@app.route('/api/enviar-reporte', methods=['POST'])
def enviar_reporte():
    nombre = request.form.get('nombre')
    edad = request.form.get('edad')
    telefono = request.form.get('telefono')
    fecha = request.form.get('fecha')
    referencias = request.form.get('referencias')
    lat_long = request.form.get('lat_long')
    tipo_reporte = request.form.get('tipo_reporte') # 'baches', 'fuga-agua', 'poste-luz'
    
    # Capturar archivos múltiples del carrusel
    f_ine_frente = request.files.get('ine_frente')
    f_ine_reverso = request.files.get('ine_reverso')
    f_selfie = request.files.get('selfie')
    
    upload_dir = './uploads'
    os.makedirs(upload_dir, exist_ok=True)
    
    nombre_ine_frente = f_ine_frente.filename if f_ine_frente else ""
    nombre_ine_reverso = f_ine_reverso.filename if f_ine_reverso else ""
    nombre_selfie = f_selfie.filename if f_selfie else ""
    
    ruta_validar = None
    if f_ine_frente:
        ruta_validar = os.path.join(upload_dir, nombre_ine_frente)
        f_ine_frente.save(ruta_validar)
    if f_ine_reverso:
        f_ine_reverso.save(os.path.join(upload_dir, nombre_ine_reverso))
    if f_selfie:
        f_selfie.save(os.path.join(upload_dir, nombre_selfie))
        
    # Validar con Gemini (si hay imagen de INE frente o usar la selfie para control de identidad/evidencia)
    if ruta_validar and os.path.exists(ruta_validar):
        es_valido, motivo = validar_imagen_con_gemini(ruta_validar, tipo_reporte)
    else:
        es_valido, motivo = True, "Registro aceptado sin validación visual estricta."
        
    estado_inicial = "aprobado" if es_valido else "rechazado"
    
    tablas_map = {
        "baches": "baches",
        "fuga-agua": "fugas_agua",
        "poste-luz": "postes_luz"
    }
    tabla_db = tablas_map.get(tipo_reporte, "baches")
    
    try:
        conn = obtener_conexion_db()
        cursor = conn.cursor()
        query = f"""
            INSERT INTO {tabla_db} (nombre, edad, telefono, fecha, referencias, lat_long, ine_frente, ine_reverso, selfie, estado, observacion_ia)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id;
        """
        cursor.execute(query, (nombre, edad, telefono, fecha, referencias, lat_long, nombre_ine_frente, nombre_ine_reverso, nombre_selfie, estado_inicial, motivo))
        nuevo_id = cursor.fetchone()[0]
        conn.commit()
        cursor.close()
        conn.close()
    except Exception as db_error:
        return jsonify({"status": "error", "message": str(db_error)}), 500

    return jsonify({
        "status": "success" if es_valido else "rejected",
        "nombre": nombre,
        "folio": nuevo_id,
        "tipo": tipo_reporte,
        "motivo": motivo
    }), 200

# LOGIN EMPRESA
@app.route('/api/empresa/login', methods=['POST'])
def empresa_login():
    data = request.json
    conn = obtener_conexion_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM empresa_usuarios WHERE usuario = %s AND password = %s", (data.get('usuario'), data.get('password')))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    if user:
        return jsonify({"status": "success"})
    return jsonify({"status": "error", "message": "Credenciales incorrectas"}), 401

# OBTENER TODOS LOS REPORTES PARA LA EMPRESA
@app.route('/api/empresa/reportes', methods=['GET'])
def obtener_todos_reportes():
    conn = obtener_conexion_db()
    cursor = conn.cursor()
    reportes = []
    for tipo, tabla in [("baches", "baches"), ("fuga-agua", "fugas_agua"), ("poste-luz", "postes_luz")]:
        cursor.execute(f"SELECT id, nombre, telefono, fecha, referencias, estado, observacion_ia, '{tipo}' as tipo FROM {tabla}")
        for r in cursor.fetchall():
            reportes.append({
                "id": r[0], "nombre": r[1], "telefono": r[2], "fecha": r[3],
                "referencias": r[4], "estado": r[5], "observacion_ia": r[6], "tipo": r[7]
            })
    cursor.close()
    conn.close()
    return jsonify(reportes)

# ACTUALIZAR ESTADO (Resuelto, En proceso, Rechazado)
@app.route('/api/empresa/actualizar-estado', methods=['POST'])
def actualizar_estado():
    data = request.json
    tablas_map = {"baches": "baches", "fuga-agua": "fugas_agua", "poste-luz": "postes_luz"}
    tabla = tablas_map.get(data.get('tipo'))
    
    conn = obtener_conexion_db()
    cursor = conn.cursor()
    cursor.execute(f"UPDATE {tabla} SET estado = %s WHERE id = %s", (data.get('estado'), data.get('id')))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"status": "success"})

# SEGUIMIENTO EN TIEMPO REAL PARA EL USUARIO
@app.route('/api/seguimiento/<tipo>/<int:reporte_id>', methods=['GET'])
def seguimiento_reporte(tipo, reporte_id):
    tablas_map = {"baches": "baches", "fuga-agua": "fugas_agua", "poste-luz": "postes_luz"}
    tabla = tablas_map.get(tipo)
    
    conn = obtener_conexion_db()
    cursor = conn.cursor()
    cursor.execute(f"SELECT id, nombre, estado, observacion_ia, fecha FROM {tabla} WHERE id = %s", (reporte_id,))
    row = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if row:
        return jsonify({
            "id": row[0], "nombre": row[1], "estado": row[2],
            "observacion_ia": row[3], "fecha": row[4]
        })
    return jsonify({"error": "No encontrado"}), 404

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)