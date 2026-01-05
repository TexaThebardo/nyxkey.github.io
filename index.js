function generateKey() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const part = () =>
        Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");

    const key = `KEY-${part()}-${part()}-${part()}`;
    document.getElementById("key").textContent = key;
}

function copyKey() {
    const key = document.getElementById("key").textContent;
    navigator.clipboard.writeText(key);
    alert("Key copiada correctamente");
}
