#!/usr/bin/env bash
set -Eeuo pipefail
umask 077

APP_DIR="${APP_DIR:-/var/www/kalavridhi}"
BACKUP_DIR="${BACKUP_DIR:-/var/backups/kalavridhi}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"

for required in "$APP_DIR/data" "$APP_DIR/public/images/uploads"; do
  if [[ ! -d "$required" ]]; then
    printf 'Required backup source is missing: %s\n' "$required" >&2
    exit 1
  fi
done

install -d -m 0750 "$BACKUP_DIR"
timestamp="$(date -u +%Y%m%d_%H%M%S)"
archive="$BACKUP_DIR/kalavridhi_backup_${timestamp}.tar.gz"
temporary="${archive}.tmp"
trap 'rm -f "$temporary"' EXIT

tar -czf "$temporary" -C "$APP_DIR" data public/images/uploads
gzip -t "$temporary"
mv -- "$temporary" "$archive"
find "$BACKUP_DIR" -type f -name 'kalavridhi_backup_*.tar.gz' -mtime "+$RETENTION_DAYS" -delete
printf 'Backup created: %s\n' "$archive"
