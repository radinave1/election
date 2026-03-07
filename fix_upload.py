#!/usr/bin/env python3
"""
Fix Upload Script - Re-uploads failed files using Python ftplib
Handles FTP TLS connections more robustly than curl
"""
import ftplib
import os
import ssl
import time

FTP_HOST = "connect-to-ftp.viaduc.fr"
FTP_USER = "h21542"
FTP_PASS = "VC7xilR8"
REMOTE_DIR = "sites/www.choisirnanterre.fr/www"

def create_ftp_connection():
    """Create an FTP TLS connection"""
    # Try FTP_TLS first
    try:
        print("  Connecting with FTP_TLS...")
        ftp = ftplib.FTP_TLS(FTP_HOST, timeout=60)
        ftp.login(FTP_USER, FTP_PASS)
        ftp.prot_p()  # Enable data channel encryption
        ftp.set_pasv(True)
        print("  Connected with FTP_TLS!")
        return ftp
    except Exception as e:
        print(f"  FTP_TLS failed: {e}")
    
    # Fallback to plain FTP
    try:
        print("  Connecting with plain FTP...")
        ftp = ftplib.FTP(FTP_HOST, timeout=60)
        ftp.login(FTP_USER, FTP_PASS)
        ftp.set_pasv(True)
        print("  Connected with plain FTP!")
        return ftp
    except Exception as e:
        print(f"  Plain FTP failed: {e}")
        raise

def ensure_remote_dir(ftp, path):
    """Create remote directory if it doesn't exist"""
    dirs = path.split('/')
    current = ''
    for d in dirs:
        if not d:
            continue
        current += '/' + d
        try:
            ftp.cwd(current)
        except ftplib.error_perm:
            try:
                ftp.mkd(current)
            except:
                pass

def upload_file(ftp, local_path, remote_path, max_retries=3):
    """Upload a single file with retry logic"""
    for attempt in range(1, max_retries + 1):
        try:
            print(f"  [{attempt}/{max_retries}] Uploading {local_path} -> {remote_path}")
            
            # Ensure directory exists
            remote_dir = '/'.join(remote_path.rsplit('/', 1)[:-1])
            if remote_dir:
                ensure_remote_dir(ftp, remote_dir)
            
            # Upload the file
            with open(local_path, 'rb') as f:
                ftp.storbinary(f'STOR /{remote_path}', f)
            
            # Verify the file size
            try:
                remote_size = ftp.size(f'/{remote_path}')
                local_size = os.path.getsize(local_path)
                if remote_size == local_size:
                    print(f"  ✓ OK ({local_size} bytes)")
                    return True
                else:
                    print(f"  ⚠ Size mismatch: local={local_size}, remote={remote_size}")
            except:
                print(f"  ✓ Uploaded (size verification not supported)")
                return True
                
        except (ftplib.error_temp, ftplib.error_perm, ConnectionError, OSError) as e:
            print(f"  ✗ Error: {e}")
            if attempt < max_retries:
                print(f"  Reconnecting in 3 seconds...")
                time.sleep(3)
                try:
                    ftp.quit()
                except:
                    pass
                try:
                    new_ftp = create_ftp_connection()
                    # Copy the new connection back
                    ftp.__dict__.update(new_ftp.__dict__)
                except Exception as e2:
                    print(f"  Reconnect failed: {e2}")
    
    print(f"  ✗✗ FAILED: {local_path}")
    return False

def main():
    print("=========================================")
    print("Fix Upload - Python FTP Upload")
    print("=========================================")
    
    # Files to upload (critical ones first)
    files_to_upload = [
        # CRITICAL: CSS was empty on server
        ("css/style.css", f"{REMOTE_DIR}/css/style.css"),
        # CRITICAL: programme.csv was empty on server
        ("data/programme.csv", f"{REMOTE_DIR}/data/programme.csv"),
        # HTML files
        ("index.html", f"{REMOTE_DIR}/index.html"),
        ("engagements.html", f"{REMOTE_DIR}/engagements.html"),
        ("equipe.html", f"{REMOTE_DIR}/equipe.html"),
        # JS
        ("js/main.js", f"{REMOTE_DIR}/js/main.js"),
        # Data files
        ("data/agenda.csv", f"{REMOTE_DIR}/data/agenda.csv"),
        ("data/equipe.csv", f"{REMOTE_DIR}/data/equipe.csv"),
        ("data/social.csv", f"{REMOTE_DIR}/data/social.csv"),
        # Font
        ("font/AcuminVariableConcept_2.ttf", f"{REMOTE_DIR}/font/AcuminVariableConcept_2.ttf"),
        # Logo
        ("images/logo/logo.png", f"{REMOTE_DIR}/images/logo/logo.png"),
    ]
    
    # Add icons
    for fname in os.listdir("icones"):
        if fname.endswith('.png'):
            files_to_upload.append((f"icones/{fname}", f"{REMOTE_DIR}/icones/{fname}"))
    
    # Add slider images
    for fname in os.listdir("images/slider"):
        if fname.endswith('.jpg'):
            files_to_upload.append((f"images/slider/{fname}", f"{REMOTE_DIR}/images/slider/{fname}"))
    
    # Add team images
    for fname in os.listdir("images/equipe"):
        if fname.endswith('.jpg'):
            files_to_upload.append((f"images/equipe/{fname}", f"{REMOTE_DIR}/images/equipe/{fname}"))
    
    # Connect
    print("\nConnecting to FTP server...")
    ftp = create_ftp_connection()
    
    success_count = 0
    fail_count = 0
    
    for local_path, remote_path in files_to_upload:
        if not os.path.exists(local_path):
            print(f"  SKIP (not found): {local_path}")
            continue
        
        # Try upload, reconnect if needed
        try:
            if upload_file(ftp, local_path, remote_path):
                success_count += 1
            else:
                fail_count += 1
        except Exception as e:
            print(f"  Connection lost, reconnecting...")
            try:
                ftp = create_ftp_connection()
                if upload_file(ftp, local_path, remote_path):
                    success_count += 1
                else:
                    fail_count += 1
            except:
                fail_count += 1
        
        # Small delay between uploads to avoid overwhelming the server
        time.sleep(0.5)
    
    try:
        ftp.quit()
    except:
        pass
    
    print(f"\n=========================================")
    print(f"Upload complete! Success: {success_count}, Failed: {fail_count}")
    print(f"Check: https://choisirnanterre.fr")
    print(f"=========================================")

if __name__ == "__main__":
    main()
