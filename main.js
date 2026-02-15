/* =========================================
   FLUX | LOGIC CORE v3.0 (ULTIMATE)
   ENGINEERED BY MONOAXIS
   ========================================= */

const { createFFmpeg, fetchFile } = FFmpeg;

// 1. INITIALIZE MEDIA ENGINE (FFmpeg)
const ffmpeg = createFFmpeg({
    log: true,
    corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js', // Force specific core version
    logger: ({ message }) => {
        console.log(`[FLUX CORE] ${message}`);
        // Visual Feedback for "Initializing" hang
        if (message.includes('load')) {
             document.getElementById('statusText').innerText = "LOADING WASM BINARIES...";
        }
    }
});

// BOOT SEQUENCE LOG
console.log("%c FLUX v2.1 // SYSTEM READY ", "background: #000; color: #00f2ff; font-size: 16px; font-weight: bold; border: 1px solid #00f2ff; padding: 4px;");

// DOM Elements
const masterUpload = document.getElementById('masterUpload');
const statusSection = document.getElementById('statusSection');
const statusText = document.getElementById('statusText');
const progressBar = document.getElementById('progressBar');
const percentText = document.getElementById('percentText');
const downloadArea = document.getElementById('downloadArea');
const mainCard = document.querySelector('.main-card');

/* =========================================
   UI: CLOUD-STYLE FORMAT MENU SYSTEM
   ========================================= */

// 1. THE DATABASE (Full Matrix)
const formatDatabase = {
    "Video": [
        "mp4", "mkv", "avi", "mov", "webm", "flv", "wmv", "3gp", 
        "gif", "ogg", "m4v", "mpg", "mpeg", "vob", "ts", "asf", 
        "m2ts", "mts", "rm", "swf"
    ],
    "Audio": [
        "mp3", "wav", "flac", "ogg", "m4a", "aac", "wma", "aiff", 
        "opus", "amr", "alac", "mka", "ra", "voc", "au", "dts", "ac3"
    ],
    "Image": [
        "jpg", "png", "webp", "ico", "svg", "bmp", "tiff", "heic", 
        "avif", "tga", "jp2", "j2k", "psd", "xcf", "ppm", "pgm", 
        "pbm", "pnm", "dds"
    ],
    "Document": [
        "pdf", "docx", "txt", "html", "md", "rtf", "odt", "epub", 
        "tex", "xml", "bib", "textile", "asc", "rst", "org", "wiki", "info"
    ],
    "Spreadsheet": [
        "xlsx", "csv", "json", "ods", "html", "txt", "dif", "sylk", 
        "prn", "eth", "dbf"
    ],
    "Archive": ["zip"],
    "3D Model": ["glb", "gltf", "obj", "stl", "ply", "usdz"],
    "Subtitle": ["srt", "vtt", "sbv", "sub", "ass", "lrc", "smi", "ssa", "json"],
    "Font": ["svg", "json"]
};

// 2. MENU CONTROLS
function openFormatMenu() {
    document.getElementById('formatMenuModal').classList.remove('hidden');
    renderCategories();
    renderFormats('Video'); // Default view
}

function closeFormatMenu() {
    document.getElementById('formatMenuModal').classList.add('hidden');
}

// 3. RENDER SIDEBAR (With Icons)
function renderCategories() {
    const icons = {
        "Video": "🎬", "Audio": "🎵", "Image": "🖼️", 
        "Document": "📄", "Spreadsheet": "📊", "Archive": "📦", 
        "3D Model": "🧊", "Subtitle": "💬", "Font": "🅰️"
    };

    const list = document.getElementById('categoryList');
    list.innerHTML = Object.keys(formatDatabase).map(cat => `
        <li onclick="renderFormats('${cat}')" 
            class="category-item p-4 cursor-pointer hover:bg-slate-800 hover:text-cyber transition-all border-l-2 border-transparent hover:border-cyber flex items-center gap-3">
            <span class="opacity-50 text-lg">${icons[cat] || '📁'}</span>
            <span class="font-bold tracking-wide">${cat}</span>
        </li>
    `).join('');
}

// 4. RENDER GRID CHIPS
function renderFormats(category) {
    document.getElementById('currentCategoryTitle').innerHTML = `<span class="text-cyber">●</span> ${category}`;
    
    // Highlight Active Sidebar Item
    document.querySelectorAll('.category-item').forEach(el => {
        if(el.innerText.includes(category)) {
            el.classList.add('bg-slate-800', 'text-cyber', 'border-cyber');
        } else {
            el.classList.remove('bg-slate-800', 'text-cyber', 'border-cyber');
        }
    });

    // Render Grid
    const grid = document.getElementById('formatGrid');
    grid.innerHTML = formatDatabase[category].map(fmt => `
        <button onclick="selectFormat('${fmt}')" 
                class="flex items-center justify-center p-3 bg-slate-800 border border-slate-700 rounded hover:border-cyber hover:bg-slate-700 transition-all group animate-fade-in">
            <span class="font-mono font-bold text-slate-300 group-hover:text-white uppercase">${fmt}</span>
        </button>
    `).join('');
}

// 5. SELECT FORMAT ACTION
function selectFormat(fmt) {
    document.getElementById('targetExt').value = fmt;
    closeFormatMenu();
    // Visual Pulse
    const inputDiv = document.getElementById('targetExt').parentElement;
    inputDiv.classList.add('border-cyber', 'shadow-[0_0_20px_rgba(0,242,255,0.3)]');
    setTimeout(() => inputDiv.classList.remove('border-cyber', 'shadow-[0_0_20px_rgba(0,242,255,0.3)]'), 500);
}


/* =========================================
   CORE: QUEUE & MASTER IGNITION
   ========================================= */

// FEATURE 1: VISUAL QUEUE (THUMBNAILS)
window.updateQueue = () => {
    const files = Array.from(masterUpload.files);
    const queueList = document.getElementById('fileQueue');
    
    if (files.length === 0) {
        queueList.innerHTML = `<div class="text-center text-slate-600 italic py-4">Waiting for input...</div>`;
        return;
    }

    queueList.innerHTML = files.map(file => {
        // Thumbnail Logic
        let thumbHTML = '';
        if (file.type.startsWith('image/')) {
            const url = URL.createObjectURL(file);
            thumbHTML = `<img src="${url}" class="w-10 h-10 object-cover rounded-md border border-slate-600 shadow-sm">`;
        } else if (file.type.startsWith('video/')) {
            thumbHTML = `<div class="w-10 h-10 bg-slate-900 rounded-md border border-slate-600 flex items-center justify-center text-lg shadow-[0_0_10px_rgba(0,0,0,0.5)]">🎬</div>`;
        } else if (file.type.startsWith('audio/')) {
            thumbHTML = `<div class="w-10 h-10 bg-slate-900 rounded-md border border-slate-600 flex items-center justify-center text-lg text-cyber">🎵</div>`;
        } else {
            thumbHTML = `<div class="w-10 h-10 bg-slate-900 rounded-md border border-slate-600 flex items-center justify-center text-lg text-slate-400">📄</div>`;
        }

        return `
        <div class="animate-fade-in flex justify-between items-center p-3 border border-slate-700/50 bg-slate-800/40 mb-2 rounded-xl hover:bg-slate-800 hover:border-cyber/30 transition-all group">
            <div class="flex items-center gap-4">
                ${thumbHTML}
                <div class="flex flex-col">
                    <span class="font-mono text-[11px] text-slate-200 font-bold group-hover:text-cyber transition-colors truncate max-w-[150px]">${file.name}</span>
                    <span class="text-slate-500 text-[9px] uppercase tracking-wider font-mono">${formatBytes(file.size)}</span>
                </div>
            </div>
            <div class="text-cyber/20 text-[9px] font-mono group-hover:text-cyber transition-colors">QUEUED</div>
        </div>
        `;
    }).join('');
};

// FEATURE 2: SETTINGS CONTROLLER
function toggleSettings() {
    document.getElementById('settingsModal').classList.toggle('hidden');
}


// --- THE MAIN FUNCTION ---
window.igniteMaster = async () => {
    const files = Array.from(masterUpload.files);
    const target = document.getElementById('targetExt').value.toLowerCase().trim().replace('.', '');

    if (files.length === 0 || !target) {
        alert("SYSTEM ERROR: Please select files and choose a target format.");
        return;
    }

    // Activate UI
    statusSection.classList.remove('hidden');
    mainCard.classList.add('is-converting');
    downloadArea.innerHTML = ''; 
    
    // Load FFmpeg only if needed
    if (isMedia(target) && !ffmpeg.isLoaded()) {
        statusText.innerText = "INITIALIZING MEDIA CORE...";
        await ffmpeg.load();
    }

    // --- THE GOD ROUTER ---
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const ext = file.name.split('.').pop().toLowerCase();
        
        statusText.innerHTML = `PROCESSING: <span class="text-cyber">${file.name}</span> [${i + 1}/${files.length}]`;
        updateProgress(10); 

        try {
            // ROUTE 1: ARCHIVES (Zip)
            if (target === 'zip') {
                await runArchiver(files); 
                triggerSuccess("Batch Archive");
                break; 
            }
            // ROUTE 2: UNIX (Tar)
            else if (ext === 'tar') { await runUntar(file); }
            // ROUTE 3: MEDICAL (Dicom)
            else if (ext === 'dcm' || ext === 'dicom') { await runDaikon(file); }
            // ROUTE 4: FONTS (TTF)
            else if (isFont(ext)) { await runFontConverter(file); }
            // ROUTE 5: SHEETS (Excel)
            else if (isSheet(ext)) { await runSheetJS(file, target); }
            // ROUTE 6: SUBS (SRT)
            else if (isSub(ext)) { await runSubtitles(file, target); }
            // ROUTE 7: 3D (STL)
            else if (is3D(ext)) { await run3DConverter(file, target); } 
            // ROUTE 8: MEDIA (Default)
            else { await runFFmpeg(file, target); }

            if (target !== 'zip') triggerSuccess(file.name);

        } catch (err) {
            console.error(err);
            statusText.innerHTML = `<span class="text-red-500">ERROR: ${file.name} Failed</span>`;
            if (navigator.vibrate) navigator.vibrate(500); // Error Buzz
        }
        updateProgress(100);
    }
    
    statusText.innerText = "ALL TASKS COMPLETED";
    mainCard.classList.remove('is-converting');
};

/* =========================================
   ENGINE ROOM (The Workers)
   ========================================= */

// ENGINE 1: FFmpeg (Advanced with Settings)
async function runFFmpeg(file, target) {
    const inputName = `input_${Date.now()}.${file.name.split('.').pop()}`;
    const outputName = `output_${Date.now()}.${target}`;
    
    // 1. Load Settings
    const resolution = document.getElementById('settingRes').value;
    const crf = document.getElementById('settingCRF').value;
    const customFlags = document.getElementById('settingFlags').value;
    const showLogs = document.getElementById('settingLogs').checked;

    // 2. Build Arguments
    let args = ['-i', inputName];

    // Apply Resolution (Video Only)
    if (resolution !== 'original' && isVideo(target)) {
        args.push('-vf', `scale=${resolution}`);
        console.log(`[FLUX OPTIMIZER] Resizing to ${resolution}`);
    }

    // Apply Compression (Video Only)
    if (isVideo(target)) {
        args.push('-crf', crf); // 18-35 (Lower is better quality)
        args.push('-preset', 'ultrafast'); // Speed over size for WebAssembly
    }

    // Apply Custom Flags
    if (customFlags) {
        const flagArray = customFlags.split(' ');
        args.push(...flagArray);
    }

    // Output Filename
    args.push(outputName);

    // 3. The Execution
    ffmpeg.FS('writeFile', inputName, await fetchFile(file));
    
    // Show Terminal if requested
    if (showLogs) {
        statusText.innerText = ">> EXECUTING SHELL COMMAND...";
        statusText.classList.add('font-mono', 'text-xs');
    }

    await ffmpeg.run(...args);
    
    // 4. Cleanup
    const data = ffmpeg.FS('readFile', outputName);
    createDownloadLink(new Blob([data.buffer]), `FLUX_${file.name.split('.')[0]}.${target}`);
    ffmpeg.FS('unlink', inputName); ffmpeg.FS('unlink', outputName);
}

// ENGINE 2: SheetJS
async function runSheetJS(file, target) {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    let outputData, mime;
    if (target === 'csv') { outputData = XLSX.utils.sheet_to_csv(firstSheet); mime = "text/csv"; }
    else if (target === 'json') { outputData = JSON.stringify(XLSX.utils.sheet_to_json(firstSheet), null, 2); mime = "application/json"; }
    else if (target === 'html') { outputData = XLSX.utils.sheet_to_html(firstSheet); mime = "text/html"; }
    else { outputData = XLSX.write(workbook, { bookType: target, type: 'array' }); mime = "application/octet-stream"; }
    createDownloadLink(new Blob([outputData], { type: mime }), `sheet.${target}`);
}

// ENGINE 3: Subsrt
async function runSubtitles(file, target) {
    const text = await file.text();
    const captions = subsrt.parse(text);
    createDownloadLink(new Blob([subsrt.build(captions, { format: target })], { type: 'text/plain' }), `subs.${target}`);
}

// ENGINE 4: Three.js
async function run3DConverter(file, target) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (file.name.endsWith('.stl')) {
                const loader = new THREE.STLLoader();
                const geom = loader.parse(e.target.result);
                const mesh = new THREE.Mesh(geom, new THREE.MeshStandardMaterial());
                if (target === 'gltf' || target === 'glb') {
                    new THREE.GLTFExporter().parse(mesh, (gltf) => {
                        createDownloadLink(new Blob([JSON.stringify(gltf)], { type: 'application/json' }), `model.${target}`);
                        resolve();
                    }, { binary: target === 'glb' });
                }
            } else { reject("Only STL input is currently supported for 3D."); }
        };
        reader.readAsArrayBuffer(file);
    });
}

// ENGINE 5: JSZip
async function runArchiver(files) {
    const zip = new JSZip();
    statusText.innerText = "COMPRESSING BATCH...";
    files.forEach(f => zip.file(f.name, f));
    createDownloadLink(await zip.generateAsync({ type: "blob" }), `batch_archive_${Date.now()}.zip`);
}

// ENGINE 6: Daikon
async function runDaikon(file) {
    const arrayBuffer = await file.arrayBuffer();
    const data = new DataView(arrayBuffer);
    const image = daikon.Series.parseImage(data);
    if (image) {
        const rawData = image.getInterpretedData();
        const canvas = document.createElement('canvas');
        canvas.width = image.getCols(); canvas.height = image.getRows();
        const ctx = canvas.getContext('2d');
        const imgData = ctx.createImageData(canvas.width, canvas.height);
        let p = 0;
        for (let i = 0; i < rawData.length; i++) {
            const val = rawData[i]; 
            imgData.data[p++] = val; imgData.data[p++] = val; imgData.data[p++] = val; imgData.data[p++] = 255;
        }
        ctx.putImageData(imgData, 0, 0);
        canvas.toBlob(blob => createDownloadLink(blob, `xray_scan.png`));
    } else { throw new Error("Invalid DICOM"); }
}

// ENGINE 7: Opentype
async function runFontConverter(file) {
    const buffer = await file.arrayBuffer();
    const font = opentype.parse(buffer);
    const path = font.getPath('FLUX', 0, 150, 72);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="200">${path.toSVG()}</svg>`;
    createDownloadLink(new Blob([svg], {type: 'image/svg+xml'}), `font_preview.svg`);
}

// ENGINE 8: Untar
async function runUntar(file) {
    const buffer = await file.arrayBuffer();
    untar(buffer).then((files) => {
        files.forEach(f => createDownloadLink(f.blob, `extracted_${f.name}`));
    });
}

/* =========================================
   UTILITIES & BLACK OPS
   ========================================= */

// 1. Download Helper
function createDownloadLink(blob, name) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.innerHTML = `<span><span class="text-green-400">✔</span> ${name}</span> <span class="font-bold text-cyber">DOWNLOAD ↓</span>`;
    downloadArea.appendChild(link);
}

// 2. Success Trigger (Haptic + Notification)
function triggerSuccess(name) {
    // Haptic
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    // Notification
    if (Notification.permission === "granted") {
        new Notification("FLUX | Task Complete", {
            body: `${name} is ready.`,
            icon: 'https://cdn-icons-png.flaticon.com/512/2621/2621040.png'
        });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission();
    }
}

// 3. Helpers
function updateProgress(val) { progressBar.style.width = `${val}%`; percentText.innerText = `${val}%`; }
function formatBytes(bytes) { if (!+bytes) return '0 Bytes'; const k=1024; const sizes=['Bytes','KB','MB','GB']; const i=Math.floor(Math.log(bytes)/Math.log(k)); return `${parseFloat((bytes/Math.pow(k,i)).toFixed(2))} ${sizes[i]}`; }

// 4. Detectives
function isMedia(ext) { return ['mp4','mkv','avi','mov','mp3','wav','ogg','webp','jpg','png','gif','flac'].includes(ext); }
function isVideo(ext) { return ['mp4','mkv','avi','mov','webm','flv'].includes(ext); }
function isSheet(ext) { return ['xlsx','xls','csv','json','ods'].includes(ext); }
function isSub(ext) { return ['srt','vtt','sbv'].includes(ext); }
function is3D(ext) { return ['stl','obj','gltf'].includes(ext); }
function isFont(ext) { return ['ttf','otf','woff'].includes(ext); }

/* =========================================
   EVENT LISTENERS
   ========================================= */

// Deep Linking
window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('to')) selectFormat(params.get('to'));
});

// Easter Egg ("flux")
let secretCode = '';
document.addEventListener('keydown', (e) => {
    secretCode += e.key;
    if (secretCode.includes('flux')) {
        document.body.style.fontFamily = "'Courier New', monospace";
        document.body.style.color = "#00f2ff";
        alert("GOD MODE: ACTIVATED // MONOAXIS PROTOCOL ENGAGED");
        secretCode = ''; 
    }
});
