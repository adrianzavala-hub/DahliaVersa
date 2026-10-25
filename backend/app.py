from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
from google import genai
import os
import psycopg2
import time
import json

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

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

def validar_ine_con_gemini(image_path, parte):
    try:
        imagen = Image.open(image_path)
    except Exception as e:
        return False, f"Error al abrir la imagen de INE: {str(e)}"
    
    prompt = (
        f"Analiza con atención esta fotografía. Se espera que sea el {parte} de una Credencial para Votar (INE de México). "
        "Verifica si muestra los elementos oficiales característicos de una identificación oficial del INE. "
        "Responde estrictamente en el siguiente formato JSON simulado (sin bloques de código markdown adicionales): "
        '{"valido": true o false, "razon": "Explicación breve de por qué es o no una credencial válida"}'
    )

    for intento in range(3):
        try:
            response = client.models.generate_content(model='gemini-3.8-flash', contents=[imagen, prompt])
            texto_respuesta = response.text.strip().replace("```json", "").replace("```", "").strip()
            resultado_ia = json.loads(texto_respuesta)
            return resultado_ia.get("valido", False), resultado_ia.get("razon", "Validación de INE completada.")
        except Exception as e:
            if intento == 2:
                return False, f"Error en validación de INE con IA: {str(e)}"
            time.sleep(2)

def validar_incidencia_con_gemini(image_path, tipo_reporte):
    descripciones_esperadas = {
        "baches": "un bache, pavimento roto, bacheo o daño severo en la calle o asfalto",
        "fuga-agua": "una tubería rota, fuga de agua, chorro de agua o aniegos en la vía pública",
        "poste-luz": "un poste de luz dañado, luminaria fallando, cables colgando o poste eléctrico"
    }
    criterio = descripciones_esperadas.get(tipo_reporte, "una incidencia de infraestructura urbana")
    
    try:
        imagen = Image.open(image_path)
    except Exception as e:
        return False, f"Error al abrir la imagen de incidencia: {str(e)}"
    
    prompt = (
        f"Analiza con atención esta fotografía. El ciudadano reporta el problema de tipo: '{tipo_reporte}'. "
        f"Para ser considerada válida, la imagen debe mostrar claramente {criterio}. "
        "Responde estrictamente en el siguiente formato JSON simulado (sin bloques de código markdown adicionales): "
        '{"valido": true o false, "razon": "Explicación breve y clara del motivo"}'
    )

    for intento in range(3):
        try:
            response = client.models.generate_content(model='gemini-3.8-flash', contents=[imagen, prompt])
            texto_respuesta = response.text.strip().replace("```json", "").replace("```", "").strip()
            resultado_ia = json.loads(texto_respuesta)
            return resultado_ia.get("valido", False), resultado_ia.get("razon", "Análisis de incidencia completado.")
        except Exception as e:
            if intento == 2:
                return False, f"Error en validación de incidencia con IA: {str(e)}"
            time.sleep(2)

@app.route('/api/enviar-reporte', methods=['POST'])
def enviar_reporte():
    nombre = request.form.get('nombre')
    edad = request.form.get('edad')
    telefono = request.form.get('telefono')
    fecha = request.form.get('fecha')
    referencias = request.form.get('referencias')
    lat_long = request.form.get('lat_long')
    tipo_reporte = request.form.get('tipo_reporte') 
    f_ine_frente = request.files.get('ine_frente')
    f_ine_reverso = request.files.get('ine_reverso')
    f_incidencia = request.files.get('foto_incidencia') or request.files.get('selfie')
    
    upload_dir = './uploads'
    os.makedirs(upload_dir, exist_ok=True)
    
    nombre_ine_frente = f_ine_frente.filename if f_ine_frente else ""
    nombre_ine_reverso = f_ine_reverso.filename if f_ine_reverso else ""
    nombre_incidencia = f_incidencia.filename if f_incidencia else ""
    
    ruta_ine_frente = None
    ruta_ine_reverso = None
    ruta_incidencia = None
    
    if f_ine_frente:
        ruta_ine_frente = os.path.join(upload_dir, nombre_ine_frente)
        f_ine_frente.save(ruta_ine_frente)
    if f_ine_reverso:
        ruta_ine_reverso = os.path.join(upload_dir, nombre_ine_reverso)
        f_ine_reverso.save(ruta_ine_reverso)
    if f_incidencia:
        ruta_incidencia = os.path.join(upload_dir, nombre_incidencia)
        f_incidencia.save(ruta_incidencia)
        
    motivos_rechazo = []
    es_valido = True

    if ruta_ine_frente and os.path.exists(ruta_ine_frente):
        val_frente, raz_frente = validar_ine_con_gemini(ruta_ine_frente, "anverso (frente)")
        if not val_frente:
            es_valido = False
            motivos_rechazo.append(f"INE Frente inválido: {raz_frente}")
    else:
        es_valido = False
        motivos_rechazo.append("Falta la fotografía del anverso de la INE.")

    if ruta_ine_reverso and os.path.exists(ruta_ine_reverso):
        val_reverso, raz_reverso = validar_ine_con_gemini(ruta_ine_reverso, "reverso")
        if not val_reverso:
            es_valido = False
            motivos_rechazo.append(f"INE Reverso inválido: {raz_reverso}")
    else:
        es_valido = False
        motivos_rechazo.append("Falta la fotografía del reverso de la INE.")

    if ruta_incidencia and os.path.exists(ruta_incidencia):
        val_inc, raz_inc = validar_incidencia_con_gemini(ruta_incidencia, tipo_reporte)
        if not val_inc:
            es_valido = False
            motivos_rechazo.append(f"Foto de incidencia no coincide: {raz_inc}")
    else:
        es_valido = False
        motivos_rechazo.append("Falta la fotografía de evidencia de la incidencia.")

    motivo_final = " | ".join(motivos_rechazo) if not es_valido else "Todas las validaciones visuales fueron aprobadas correctamente."
    estado_inicial = "aprobado" if es_valido else "rechazado"
    
    tablas_map = {
        "baches": "baches",
        "fuga-agua": "fugas_agua",
        "poste-luz": "postes_luz",
        "poste_luz": "postes_luz",
        "postes-luz": "postes_luz"
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
        cursor.execute(query, (nombre, edad, telefono, fecha, referencias, lat_long, nombre_ine_frente, nombre_ine_reverso, nombre_incidencia, estado_inicial, motivo_final))
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
        "motivo": motivo_final
    }), 200

@app.route('/api/login-empresa', methods=['POST'])
def login_empresa():
    data = request.get_json() or request.json
    usuario = data.get('usuario')
    password = data.get('password')

    try:
        conn = obtener_conexion_db()
        cursor = conn.cursor()
        query = "SELECT * FROM empresa_usuarios WHERE usuario = %s AND password = %s"
        cursor.execute(query, (usuario, password))
        resultado = cursor.fetchone()
        cursor.close()
        conn.close()

        if resultado:
            return jsonify({"success": True, "message": "Acceso autorizado"}), 200
        else:
            return jsonify({"success": False, "message": "Usuario o contraseña incorrectos."}), 401

    except Exception as err:
        print("EXCEPCIÓN DETALLADA EN LOGIN:", str(err))
        return jsonify({"success": False, "message": f"Error interno: {str(err)}"}), 500

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

@app.route('/api/empresa/actualizar-estado', methods=['POST'])
def actualizar_estado():
    data = request.json
    tablas_map = {"baches": "baches", "fuga-agua": "fugas_agua", "poste-luz": "postes_luz", "poste_luz": "postes_luz", "postes-luz": "postes_luz"}
    tabla = tablas_map.get(data.get('tipo'))
    
    conn = obtener_conexion_db()
    cursor = conn.cursor()
    cursor.execute(f"UPDATE {tabla} SET estado = %s WHERE id = %s", (data.get('estado'), data.get('id')))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"status": "success"})

@app.route('/api/seguimiento/<tipo>/<int:reporte_id>', methods=['GET'])
def seguimiento_reporte(tipo, reporte_id):
    tablas_map = {"baches": "baches", "fuga-agua": "fugas_agua", "poste-luz": "postes_luz", "poste_luz": "postes_luz", "postes-luz": "postes_luz"}
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

@app.route('/api/reportes', methods=['GET'])
def obtener_reportes_por_nombre():
    nombre_buscado = request.args.get('nombre', '').strip().lower()
    if not nombre_buscado:
        return jsonify([]), 200

    conn = obtener_conexion_db()
    cursor = conn.cursor()
    reportes = []

    tablas_info = [
        ("baches", "baches"),
        ("fuga-agua", "fugas_agua"),
        ("poste-luz", "postes_luz")
    ]

    for tipo, tabla in tablas_info:
        cursor.execute(f"SELECT id, nombre, telefono, fecha, referencias, estado, observacion_ia, '{tipo}' as tipo FROM {tabla} WHERE LOWER(nombre) LIKE %s", (f"%{nombre_buscado}%",))
        for r in cursor.fetchall():
            reportes.append({
                "id": r[0], "nombre": r[1], "telefono": r[2], "fecha": r[3],
                "referencias": r[4], "estado": r[5], "observacion_ia": r[6], "tipo": r[7]
            })

    cursor.close()
    conn.close()
    return jsonify(reportes)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)