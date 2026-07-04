#!/bin/bash
# Convierte todas las imágenes de las galerías (img/<proyecto>/*) a webp,
# redimensionando a un máximo de 1600px en el lado más largo.
# NO borra los originales: crea el .webp al lado.
# Uso: bash tools/convertir-webp.sh

cd "$(dirname "$0")/.." || exit 1

MAX=1600
QUALITY=80
total=0
saltadas=0

find img -mindepth 2 -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) | while IFS= read -r f; do
  out="${f%.*}.webp"
  if [ -f "$out" ]; then
    saltadas=$((saltadas+1))
    continue
  fi
  w=$(sips -g pixelWidth "$f" 2>/dev/null | awk '/pixelWidth/{print $2}')
  h=$(sips -g pixelHeight "$f" 2>/dev/null | awk '/pixelHeight/{print $2}')
  if [ -z "$w" ] || [ -z "$h" ]; then
    echo "AVISO: no puedo leer dimensiones de $f, la salto"
    continue
  fi
  if [ "$w" -le "$MAX" ] && [ "$h" -le "$MAX" ]; then
    resize=""
  elif [ "$w" -ge "$h" ]; then
    resize="-resize $MAX 0"
  else
    resize="-resize 0 $MAX"
  fi
  cwebp -quiet -q $QUALITY $resize "$f" -o "$out" || echo "ERROR convirtiendo $f"
  total=$((total+1))
done

echo "Hecho."
