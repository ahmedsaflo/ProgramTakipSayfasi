let isLocked = JSON.parse(localStorage.getItem("isLocked")) || false;
let currentLanguage = localStorage.getItem("language") || "tr";

const translations = {
    tr: {
        title: "Ders Takip",
        header: "Ders Takip Tablosu",
        lockButton: " Kilitle 🔒",
        unlockButton: " Kilidi Aç 🔓",
        dateCol: "Tarih 📅",
        taskCol: "Görev 📝",
        statusCol: "Durum",
        urlCol: "URL 🔗",
        actionsCol: "İşlemler",
        rowNumCol: "Satır No",
        taskInputPlaceholder: "Yeni görev ekle...",
        urlInputPlaceholder: "İlgili URL girin...🔗",
        addButton: "Ekle ＋",
        alertMessage: "Lütfen tarih ve görev girin!",
        done: "✔ Yapıldı",
        notDone: "✖ Yapılmadı"
    },
    ar: {
        title: "متابعة الدروس",
        header: "جدول متابعة الدروس",
        lockButton: "🔒 قفل",
        unlockButton: "🔓 فتح القفل",
        dateCol: "📅 التاريخ",
        taskCol: "المهمة 📝",
        statusCol: "الحالة",
        urlCol: "🔗 الرابط",
        actionsCol: "الإجراءات",
        rowNumCol: "رقم الصف",
        taskInputPlaceholder: "أضف مهمة جديدة...",
        urlInputPlaceholder: "أدخل رابط الفيديو...",
        addButton: "＋ إضافة",
        alertMessage: "الرجاء إدخال التاريخ والمهمة!",
        done: "✔ تم",
        notDone: "✖ لم يتم"
    }
};

document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
    updateLockState();
    updateLanguage();
});

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const table = document.getElementById("taskTable");
    table.innerHTML = ""; // Clear the table first

    tasks.forEach((task, index) => {
        const row = table.insertRow(); // Daha performanslı: Satırı doğrudan tabloya ekle
        const actionsCell = row.insertCell();
        const urlCell = row.insertCell();
        const statusCell = row.insertCell();
        const taskCell = row.insertCell();
        const dateCell = row.insertCell();
        const rowNumCell = row.insertCell();

        actionsCell.innerHTML = `
            <button class="btn btn-success btn-sm" onclick="toggleTask(${index})" ${isLocked ? 'disabled' : ''}>✔ ${currentLanguage === 'tr' ? "Tamamla" : "أكمل"}</button>
            <button class="btn btn-danger btn-sm" onclick="deleteTask(${index})" ${isLocked ? 'disabled' : ''}>✖ ${currentLanguage === 'tr' ? "Sil" : "حذف"}</button>
        `;

        urlCell.innerHTML = `<a href="#" onclick="window.open('${task.url}', '_blank')">${task.url ? (currentLanguage === 'tr' ? "video için tıkla" : "اضغط للذهاب الى الفيديو") : (currentLanguage === 'tr' ? "Bağlantı yok" : "لا يوجد رابط")}</a>`;
        statusCell.classList.add(task.done ? 'text-success' : 'text-danger');
        statusCell.textContent = task.done ? translations[currentLanguage].done : translations[currentLanguage].notDone;
        taskCell.textContent = task.text;
        dateCell.textContent = task.date;
        rowNumCell.textContent = index + 1;
    });
}


function addTask() {
    if (isLocked) return;

    const taskDate = document.getElementById("dateInput").value;
    const taskText = document.getElementById("taskInput").value;
    const urlText = document.getElementById("urlInput").value;

    if (!taskText || !taskDate) {
        alert(translations[currentLanguage].alertMessage);
        return;
    }

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push({ date: taskDate, text: taskText, done: false, url: urlText });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();

    document.getElementById("taskInput").value = "";
    document.getElementById("urlInput").value = "";
    document.getElementById("dateInput").value = "";
}

function toggleTask(index) {
    if (isLocked) return;
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks[index].done = !tasks[index].done;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
}

function deleteTask(index) {
    if (isLocked) return;
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
}

function toggleLock() {
    isLocked = !isLocked;
    localStorage.setItem("isLocked", JSON.stringify(isLocked));
    updateLockState();
}

function updateLockState() {
    const lockButton = document.getElementById("lockButton");
    lockButton.textContent = isLocked ? translations[currentLanguage].unlockButton : translations[currentLanguage].lockButton;
} // loadTasks çağrısı gereksiz

function toggleLanguage() {
    currentLanguage = currentLanguage === "tr" ? "ar" : "tr";
    localStorage.setItem("language", currentLanguage);
    updateLanguage();
} // loadTasks çağrısı gereksiz

function updateLanguage() {
    const lang = translations[currentLanguage];

    document.title = lang.title;
    document.getElementById("title").textContent = lang.title;
    document.getElementById("header").textContent = lang.header;
    document.getElementById("lockButton").textContent = isLocked ? lang.unlockButton : lang.lockButton;
    document.getElementById("langButton").textContent = currentLanguage === "tr" ? "AR" : "TR";
    document.getElementById("dateCol").textContent = lang.dateCol;
    document.getElementById("taskCol").textContent = lang.taskCol;
    document.getElementById("statusCol").textContent = lang.statusCol;
    document.getElementById("urlCol").textContent = lang.urlCol;
    document.getElementById("actionsCol").textContent = lang.actionsCol;
    document.getElementById("rowNumCol").textContent = lang.rowNumCol;
    document.getElementById("taskInput").placeholder = lang.taskInputPlaceholder;
    document.getElementById("urlInput").placeholder = lang.urlInputPlaceholder;
    document.getElementById("addButton").textContent = lang.addButton;
} // loadTasks çağrısı gereksiz