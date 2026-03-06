#!/bin/bash

# FTP Upload Script for Viaduc hosting
FTP_HOST="ftp://connect-to-ftp.viaduc.fr"
FTP_USER="h21542"
FTP_PASS="VC7xilR8"
REMOTE_DIR="sites/www.choisirnanterre.f/www"

echo "========================================="
echo "Uploading website to choisirnanterre.fr"
echo "========================================="

# Upload HTML files
echo "Uploading HTML files..."
curl -T "index.html" "${FTP_HOST}/${REMOTE_DIR}/" --user ${FTP_USER}:${FTP_PASS} --ftp-ssl -k --ftp-create-dirs
curl -T "engagements.html" "${FTP_HOST}/${REMOTE_DIR}/" --user ${FTP_USER}:${FTP_PASS} --ftp-ssl -k
curl -T "equipe.html" "${FTP_HOST}/${REMOTE_DIR}/" --user ${FTP_USER}:${FTP_PASS} --ftp-ssl -k

# Upload CSS
echo "Uploading CSS..."
curl -T "css/style.css" "${FTP_HOST}/${REMOTE_DIR}/css/" --user ${FTP_USER}:${FTP_PASS} --ftp-ssl -k --ftp-create-dirs

# Upload JS
echo "Uploading JS..."
curl -T "js/main.js" "${FTP_HOST}/${REMOTE_DIR}/js/" --user ${FTP_USER}:${FTP_PASS} --ftp-ssl -k --ftp-create-dirs

# Upload data files
echo "Uploading data files..."
curl -T "data/agenda.csv" "${FTP_HOST}/${REMOTE_DIR}/data/" --user ${FTP_USER}:${FTP_PASS} --ftp-ssl -k --ftp-create-dirs
curl -T "data/equipe.csv" "${FTP_HOST}/${REMOTE_DIR}/data/" --user ${FTP_USER}:${FTP_PASS} --ftp-ssl -k
curl -T "data/programme.csv" "${FTP_HOST}/${REMOTE_DIR}/data/" --user ${FTP_USER}:${FTP_PASS} --ftp-ssl -k
curl -T "data/social.csv" "${FTP_HOST}/${REMOTE_DIR}/data/" --user ${FTP_USER}:${FTP_PASS} --ftp-ssl -k

# Upload font
echo "Uploading font..."
curl -T "font/AcuminVariableConcept_2.ttf" "${FTP_HOST}/${REMOTE_DIR}/font/" --user ${FTP_USER}:${FTP_PASS} --ftp-ssl -k --ftp-create-dirs

# Upload icons
echo "Uploading icons..."
for file in icones/*.png; do
    filename=$(basename "$file")
    curl -T "$file" "${FTP_HOST}/${REMOTE_DIR}/icones/" --user ${FTP_USER}:${FTP_PASS} --ftp-ssl -k --ftp-create-dirs
done

# Upload logo
echo "Uploading logo..."
curl -T "images/logo/logo.png" "${FTP_HOST}/${REMOTE_DIR}/images/logo/" --user ${FTP_USER}:${FTP_PASS} --ftp-ssl -k --ftp-create-dirs

# Upload slider images
echo "Uploading slider images..."
for file in images/slider/*.jpg; do
    filename=$(basename "$file")
    curl -T "$file" "${FTP_HOST}/${REMOTE_DIR}/images/slider/" --user ${FTP_USER}:${FTP_PASS} --ftp-ssl -k --ftp-create-dirs
done

# Upload team images
echo "Uploading team images..."
for file in images/equipe/*.jpg; do
    filename=$(basename "$file")
    echo "Uploading $filename..."
    curl -T "$file" "${FTP_HOST}/${REMOTE_DIR}/images/equipe/" --user ${FTP_USER}:${FTP_PASS} --ftp-ssl -k --ftp-create-dirs
done

echo ""
echo "========================================="
echo "Upload completed!"
echo "Your website should be available at:"
echo "http://choisirnanterre.fr"
echo "========================================="
