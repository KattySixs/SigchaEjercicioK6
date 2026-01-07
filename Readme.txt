# Readme del ejercicio 1: Performance -- SigchaK
Este proyecto incluye un script de carga con k6 que realiza peticiones POST al endpoint de login de ejemplo: https://fakestoreapi.com/auth/login
Como validaciones principales en el ejercicio se tiene:
	- Alcanzar al menos 20 TPS (el script usa un escenario con 20 iteraciones por segundo por defecto).
	- Tiempo de respuesta permitido: máximo 1,5 segundos (p95 < 1500ms).
	- Tasa de error aceptable: menor al 3% del total de peticiones.
El script soporta parametrización vía variables de entorno de k6:
	- RATE: número de iteraciones por unidad de tiempo (por defecto 20)
	- TIME_UNIT: unidad de tiempo para RATE (por defecto '1s')
	- DURATION: duración del escenario (por defecto '1m')

## Versiones de teecnologías usadas
	- Gradle (wrapper): 9.0.0
	- JUnit (BOM): 5.10.0
	- Windows PowerShell: v5.1
	- Java version: 17.0.12
	- K6: v1.4.2

## Requisitos Previos
    - Obtener el proyecto "SigchaEjercicioK6" e importarlo desde la herramienta IntelliJ

## Ubicación de archivos:Revisar que los archivos de la prueba se encuentren en las rutas especificadas
	Script k6: src/test/resources/k6/login.js
	Datos de entrada (CSV): src/test/resources/data/entrada.csv

## El CSV debe tener el encabezado e información con el formato: user,passwd. Los mismos que se definieron en el ejercicio.

## Para la ejecución
	- Abrir la terminal
	- Establecer el comando: k6 run src/test/resources/k6/login.js

## Interpretación de resultados
	- Revisa el resumen que imprime k6 al final.
	- Validar que: http_req_duration p(95): debe ser < 1500 ms., y que http_req_failed: rate debe ser < 0.03 (3%).
	- Validar si la métrica "errors" definida marca fallos de validación en la respuesta (por ejemplo: status != 200 o body sin token).