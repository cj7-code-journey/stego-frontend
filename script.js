// RENDER URL
const API_URL = "https://stego-api-backend.onrender.com";

function switchTab(tab) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.tabs button').forEach(b => b.classList.remove('active'));
    document.getElementById(`${tab}-sec`).classList.add('active');
    document.getElementById(`tab-${tab}`).classList.add('active');
}

function togglePayloadInput() {
    const type = document.getElementById('payload-type').value;
    if (type === 'text') {
        document.getElementById('file-input-div').style.display = 'none';
        document.getElementById('text-input-div').style.display = 'block';
    } else {
        document.getElementById('file-input-div').style.display = 'block';
        document.getElementById('text-input-div').style.display = 'none';
    }
}

// ---------------- ENCODE LOGIC ----------------
document.getElementById('encode-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = document.getElementById('enc-status');
    const btn = e.target.querySelector('button');

    status.innerText = "Processing... Please wait.";
    status.className = "status";
    btn.disabled = true;

    const formData = new FormData();
    formData.append("carrier", document.getElementById('carrier').files[0]);
    formData.append("passcode", document.getElementById('enc-pass').value);

    const type = document.getElementById('payload-type').value;
    if (type === 'file') {
        const file = document.getElementById('payload-file').files[0];
        if (!file) { alert("Please select a file to hide"); btn.disabled = false; return; }
        formData.append("payload", file);
    } else {
        const text = document.getElementById('payload-text').value;
        if (!text) { alert("Please enter text to hide"); btn.disabled = false; return; }
        formData.append("text_data", text);
    }

    try {
        const response = await fetch(`${API_URL}/encode`, { method: 'POST', body: formData });
        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.detail || "Encoding failed.");
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "stego_hidden.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        status.innerText = "Success! Image downloaded.";
        status.className = "status success";
    } catch (error) {
        status.innerText = "Error: " + error.message;
    } finally {
        btn.disabled = false;
    }
});

// ---------------- DECODE LOGIC ----------------
document.getElementById('decode-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = document.getElementById('dec-status');
    const btn = e.target.querySelector('button');
    const textResultDiv = document.getElementById('text-result');

    status.innerText = "Extracting... Please wait.";
    status.className = "status";
    textResultDiv.style.display = 'none';
    btn.disabled = true;

    const formData = new FormData();
    formData.append("stego_image", document.getElementById('stego-img').files[0]);
    formData.append("passcode", document.getElementById('dec-pass').value);

    try {
        const response = await fetch(`${API_URL}/decode`, { method: 'POST', body: formData });
        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.detail || "Wrong passcode or invalid image.");
        }

        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
            // It's a text payload
            const data = await response.json();
            document.getElementById('extracted-text').value = data.data;
            textResultDiv.style.display = 'block';
            status.innerText = "Text extracted successfully.";
        } else {
            // It's a file payload
            const blob = await response.blob();

            // Extract filename from headers automatically
            let filename = "extracted_file.bin";
            const disposition = response.headers.get("Content-Disposition");
            if (disposition && disposition.indexOf('filename*=UTF-8\'\'') !== -1) {
                filename = decodeURIComponent(disposition.split("filename*=UTF-8''")[1]);
            }

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            status.innerText = "File extracted and downloaded!";
        }
        status.className = "status success";
    } catch (error) {
        status.innerText = "Error: " + error.message;
    } finally {
        btn.disabled = false;
    }
});