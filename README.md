# 🛡️ Advanced Image Steganography System

An advanced, high-performance web application that securely hides text, images, documents, and multimedia (audio/video) inside carrier images. This project utilizes a dual-layer security approach combining **AES-256 (Fernet) Cryptography** and **Vectorized LSB (Least Significant Bit) Steganography**.

Originally built as a monolithic Streamlit app, this system has been re-architected into a highly optimized decoupled client-server model to prevent memory bottlenecks and reduce multimedia processing time from minutes to milliseconds.

---

## ✨ Features

* **Multi-Format Payload Support:** Hide Text, Images (JPG/PNG), Documents (PDF, DOCX, ZIP), and Media (MP4, MP3, WAV) inside a single PNG image.
* **Dual-Layer Security:** 1. **Cryptography:** Data is encrypted using Fernet Symmetric Encryption via a user-provided passcode.
  2. **Steganography:** The encrypted payload is injected into the image's LSBs.
* **Extreme Performance (Vectorization):** Replaced traditional iterative nested loops with **NumPy Vectorized Matrix Masking**. This allows multi-megabyte payloads to be processed in milliseconds without exceeding server RAM limits.
* **Media Previews:** Extracted images, audio, and video can be previewed directly within the browser before downloading.
* **Cross-Platform:** Responsive web design works flawlessly on both desktop and mobile browsers.

---

## 🛠️ Technology Stack

**Frontend (Client)**
* HTML5, CSS3, Vanilla JavaScript
* Fetch API for asynchronous server communication
* Deployed on: **GitHub Pages**

**Backend (Server)**
* **Framework:** FastAPI (Python)
* **Image Processing:** Pillow (PIL)
* **Mathematical Operations:** NumPy (Vectorized Array Processing)
* **Encryption:** Cryptography (Fernet)
* Deployed on: **Render (via Docker)**

---

## 🚀 Architecture Overview

This project utilizes a stateless REST API architecture:
1. The **Frontend** captures the carrier image, payload, and passcode, transmitting them via `multipart/form-data` to the backend.
2. The **Backend** converts the payload into binary, encrypts it, appends a byte delimiter (`::::END::::`), and executes a lightning-fast global bitwise AND/OR mask over the flattened NumPy array of the carrier image.
3. The modified image is returned as a binary stream to the frontend for download.

---

## 💻 Local Setup & Installation

### 1. Backend Setup
```bash
# Clone the repository
git clone [https://github.com/yourusername/stego-backend.git](https://github.com/yourusername/stego-backend.git)
cd stego-backend

# Create a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the FastAPI server locally
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Frontend Setup
1. Clone the frontend repository.
2. Open `script.js` and ensure the `API_URL` variable points to your local backend (e.g., `http://localhost:8000`).
3. Open `index.html` in any modern web browser (or use a local live server).

---

## ☁️ Deployment

* **Backend:** Deployed on Render using the provided `Dockerfile`. Ensure Render's Build Environment is set to Docker. 
* **Frontend:** Hosted statically via GitHub Pages. *Note: Ensure your FastAPI `CORSMiddleware` in `main.py` specifically whitelists your GitHub Pages URL.*

---

## ⚠️ Important Constraints & Usage Notes

* **Lossless Carriers Only:** This system requires **PNG** carrier images. JPEGs utilize lossy compression which destroys the LSB data layer.
* **Transmission Warning (WhatsApp/Social Media):** Sending the generated Stego-Image via standard WhatsApp or Messenger will compress the image and corrupt the hidden data. To share the image, you **must** use lossless mediums such as:
  * Google Drive / Dropbox
  * Telegram (Send as "File", not image)
  * WhatsApp (Send as "Document" via file explorer)
* **Capacity Limit:** The size of the hidden file cannot exceed the pixel capacity of the carrier image. A 1080p image can typically hold around ~750KB of encrypted data.

---

## 🎓 Academic Context
This project was developed as a B.Tech Computer Science & Engineering Major Project. It demonstrates practical implementations of cybersecurity, cloud deployment, and advanced mathematical optimization in software engineering.
