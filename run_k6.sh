#!/usr/bin/env bash
# Script para ejecutar la prueba k6 con valores por defecto o usando variables de entorno.
# Uso: ./run_k6.sh [RATE] [DURATION] [TIME_UNIT]
# Ejemplo: ./run_k6.sh 20 2m 1s

SCRIPT_PATH="src/test/resources/k6/login.js"
RATE_ARG=${1:-${RATE:-20}}
DURATION_ARG=${2:-${DURATION:-1m}}
TIME_UNIT_ARG=${3:-${TIME_UNIT:-1s}}

# Comprobar si k6 está disponible
if ! command -v k6 >/dev/null 2>&1; then
  echo "k6 no está instalado o no está en PATH. Sigue: https://k6.io/docs/getting-started/installation"
  exit 1
fi

echo "Ejecutando k6: RATE=${RATE_ARG}, DURATION=${DURATION_ARG}, TIME_UNIT=${TIME_UNIT_ARG}"
RATE=${RATE_ARG} DURATION=${DURATION_ARG} TIME_UNIT=${TIME_UNIT_ARG} k6 run "$SCRIPT_PATH"

