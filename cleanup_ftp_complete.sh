#!/bin/bash

# FTP Complete Cleanup Script - Delete all files from wrong root location
FTP_HOST="ftp://connect-to-ftp.viaduc.fr"
FTP_USER="h21542"
FTP_PASS="VC7xilR8"

echo "========================================="
echo "Cleaning up files from root directory"
echo "========================================="

# Delete HTML files from root
echo "Deleting HTML files from root..."
curl "${FTP_HOST}/" --user ${FTP_USER}:${FTP_PASS} --ftp-ssl -k -Q "DELE index.html" 2>/dev/null
curl "${FTP_HOST}/" --user ${FTP_USER}:${FTP_PASS} --ftp-ssl -k -Q "DELE engagements.html" 2>/dev/null
curl "${FTP_HOST}/" --user ${FTP_USER}:${FTP_PASS} --ftp-ssl -k -Q "DELE equipe.html" 2>/dev/null

# Delete CSS files
echo "Deleting CSS files..."
curl "${FTP_HOST}/css/" --user ${FTP_USER}:${FTP_PASS} --ftp-ssl -k -Q "DELE style.css" 2>/dev/null
curl "${FTP_HOST}/" --user ${FTP_USER}:${FTP_PASS} --ftp-ssl -k -Q "RMD css" 2>/dev/null

# Delete JS files
echo "Deleting JS files..."
curl "${FTP_HOST}/js/" --user ${FTP_USER}:${FTP_PASS} --ftp-ssl -k -Q "DELE main.js" 2>/dev/null
curl "${FTP_HOST}/" --user ${FTP_USER}:${FTP_PASS} --ftp-ssl -k -Q "RMD js" 2>/dev/null

# Delete data files
echo "Deleting data files..."
curl "${FTP_HOST}/data/" --user ${FTP_USER}:${FTP_PASS} --ftp-ssl -k -Q "DELE agenda.csv" 2>/dev/null
curl "${FTP_HOST}/data/" --user ${FTP_USER}:${FTP_PASS} --ftp-ssl -k -Q "DELE equipe.csv" 2>/dev/null
curl "${FTP_HOST}/data/" --user ${FTP_USER}:${FTP_PASS} --ftp-ssl -k -Q "DELE programme.csv" 2>/dev/null
curl "${FTP_HOST}/data/" --user ${FTP_USER}:${FTP_PASS} --ftp-ssl -k -Q "DELE social.csv" 2>/dev/null
curl "${FTP_HOST}/" --user ${FTP_USER}:${FTP_PASS} --ftp-ssl -k -Q "RMD data" 2>/dev/null

# Delete font
echo "Deleting font file..."
curl "${FTP_HOST}/font/" --user ${FTP_USER}:${FTP_PASS} --ftp-ssl -k -Q "DELE AcuminVariableConcept_2.ttf" 2>/dev/null
curl "${FTP_HOST}/" --user ${FTP_USER}:${FTP_PASS} --ftp-ssl -k -Q "RMD font" 2>/dev/null

# Delete icons
echo "Deleting icon files..."
curl "${FTP_HOST}/icones/" --user ${FTP_USER}:${FTP_PASS} --ftp-ssl -k -Q "DELE Nanterrequicreedulien.png" 2>/dev/null
curl "${FTP_HOST}/icones/" --user ${FTP_USER}:${FTP_PASS} --ftp-ssl -k -Q "DELE Nanterrequifaitface.png" 2>/dev/null
curl "${FTP_HOST}/icones/" --user ${FTP_USER}:${FTP_PASS} --ftp-ssl -k -Q "DELE Nanterrequiprotege.png" 2>/dev/null
curl "${FTP_HOST}/icones/" --user ${FTP_USER}:${FTP_PASS} --ftp-ssl -k -Q "DELE Nanterrequiresiste.png" 2>/dev/null
curl "${FTP_HOST}/" --user ${FTP_USER}:${FTP_PASS} --ftp-ssl -k -Q "RMD icones" 2>/dev/null

# Delete logo
echo "Deleting logo..."
curl "${FTP_HOST}/images/logo/" --user ${FTP_USER}:${FTP_PASS} --ftp-ssl -k -Q "DELE logo.png" 2>/dev/null
curl "${FTP_HOST}/images/" --user ${FTP_USER}:${FTP_PASS} --ftp-ssl -k -Q "RMD logo" 2>/dev/null

# Delete slider images
echo "Deleting slider images..."
curl "${FTP_HOST}/images/slider/" --user ${FTP_USER}:${FTP_PASS} --ftp-ssl -k -Q "DELE slide1.jpg" 2>/dev/null
curl "${FTP_HOST}/images/slider/" --user ${FTP_USER}:${FTP_PASS} --ftp-ssl -k -Q "DELE slide2.jpg" 2>/dev/null
curl "${FTP_HOST}/images/slider/" --user ${FTP_USER}:${FTP_PASS} --ftp-ssl -k -Q "DELE slide3.jpg" 2>/dev/null
curl "${FTP_HOST}/images/" --user ${FTP_USER}:${FTP_PASS} --ftp-ssl -k -Q "RMD slider" 2>/dev/null

# Delete team images (all 55+ files)
echo "Deleting team images..."
for i in {1..55}; do
    curl "${FTP_HOST}/images/equipe/" --user ${FTP_USER}:${FTP_PASS} --ftp-ssl -k -Q "DELE ${i}*.jpg" 2>/dev/null
done

# Try to delete common team image patterns
curl "${FTP_HOST}/images/equipe/" --user ${FTP_USER}:${FTP_PASS} --ftp-ssl -k -Q "DELE *.jpg" 2>/dev/null
curl "${FTP_HOST}/images/" --user ${FTP_USER}:${FTP_PASS} --ftp-ssl -k -Q "RMD equipe" 2>/dev/null
curl "${FTP_HOST}/" --user ${FTP_USER}:${FTP_PASS} --ftp-ssl -k -Q "RMD images" 2>/dev/null

echo ""
echo "========================================="
echo "Cleanup completed!"
echo "Checking remaining files in root..."
echo "========================================="
curl "${FTP_HOST}/" --user ${FTP_USER}:${FTP_PASS} --ftp-ssl -k 2>/dev/null

echo ""
echo "Done!"
