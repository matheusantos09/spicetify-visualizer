#!/usr/bin/env bash
# spicetify-visualizer — installer (Linux / macOS)
# Run from the project folder: ./install-linux-macos.sh

set -e

THEME_NAME="spicetify-visualizer"
PROJECT_PATH="$(cd "$(dirname "$0")" && pwd)"
THEMES_DIR="$HOME/.config/spicetify/Themes"
THEME_TARGET="$THEMES_DIR/$THEME_NAME"

echo ""
echo "=== spicetify-visualizer installer ==="
echo ""

# 1. Check spicetify
if ! command -v spicetify &> /dev/null; then
    echo "[ERROR] spicetify not found in PATH."
    echo "Install it first: https://spicetify.app/docs/getting-started"
    exit 1
fi
echo "[OK] spicetify found"

# 2. Ensure themes directory exists
mkdir -p "$THEMES_DIR"
echo "[OK] Themes directory exists"

# 3. Copy theme files
if [ -d "$THEME_TARGET" ] || [ -L "$THEME_TARGET" ]; then
    echo "Removing existing theme folder..."
    rm -rf "$THEME_TARGET"
fi
cp -r "$PROJECT_PATH" "$THEME_TARGET"
echo "[OK] Files copied to $THEME_TARGET"

# 4. Configure spicetify
echo ""
echo "Configuring spicetify..."
spicetify config current_theme "$THEME_NAME"
spicetify config color_scheme Base
echo "[OK] Theme and color scheme set"

# 5. Apply
echo ""
echo "Applying theme..."
spicetify apply

echo ""
echo "=== Done! ==="
echo ""
echo "Open Spotify and press Ctrl+Shift+R for a hard reload."
echo ""
