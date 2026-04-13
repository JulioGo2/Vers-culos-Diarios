# 🕊️ Versículo Diario · WhatsApp

Envía automáticamente un versículo bíblico curado cada mañana por WhatsApp a tus contactos, usando **GitHub Actions** (gratis) + **CallMeBot** (gratis).

---

## 📦 Estructura del proyecto

```
versiculo-diario/
├── index.html                        ← Página web (sube a Netlify)
├── netlify.toml                      ← Config de Netlify
├── scripts/
│   └── enviar.js                     ← Script que envía los mensajes
└── .github/
    └── workflows/
        └── enviar-versiculo.yml      ← Automatización diaria
```

---

## 🚀 Paso a paso para configurar todo

### PASO 1 — Preparar los números (CallMeBot)

Cada persona que quiera recibir el versículo debe hacer esto **una sola vez**:

1. Abrir WhatsApp y enviar este mensaje al número **+34 644 64 80 11**:
   ```
   I allow callmebot to send me messages
   ```
2. En pocos segundos recibirán una respuesta con su **API key personal** (ej: `1234567`).
3. Darte esa API key a ti.

---

### PASO 2 — Subir el proyecto a GitHub

1. Crea una cuenta en [github.com](https://github.com) (gratis).
2. Crea un repositorio nuevo → llámalo `versiculo-diario` → público o privado.
3. Sube todos los archivos de esta carpeta al repositorio.

   La forma más fácil: en la página del repo, clic en **"uploading an existing file"** y arrastra toda la carpeta.

---

### PASO 3 — Configurar los contactos (GitHub Secrets)

Los números y API keys se guardan como **secreto cifrado** en GitHub (nadie los puede ver).

1. En tu repositorio, ve a: **Settings → Secrets and variables → Actions → New repository secret**

2. Crea el secreto **`CONTACTS_JSON`** con este formato (reemplaza con tus datos reales):

```json
[
  { "name": "María", "phone": "51987654321", "apikey": "1234567" },
  { "name": "Juan",  "phone": "51912345678", "apikey": "7654321" },
  { "name": "Ana",   "phone": "51999888777", "apikey": "1122334" }
]
```

> ⚠️ El número debe incluir el código de país sin `+` (Perú = 51, EE.UU. = 1, etc.)

3. Crea el secreto **`THEME`** con uno de estos valores:

| Valor | Tema |
|-------|------|
| `faith` | Fe |
| `hope` | Esperanza |
| `love` | Amor |
| `peace` | Paz |
| `strength` | Fortaleza |
| `wisdom` | Sabiduría |
| `joy` | Gozo |
| `grace` | Gracia |

---

### PASO 4 — Ajustar la hora de envío

Abre `.github/workflows/enviar-versiculo.yml` y ajusta la línea `cron`.

Perú está en **UTC-5**, así que:

| Hora Perú | Cron (UTC) |
|-----------|-----------|
| 6:00 AM   | `0 11 * * *` |
| 7:00 AM   | `0 12 * * *` ← (valor actual) |
| 8:00 AM   | `0 13 * * *` |
| 9:00 AM   | `0 14 * * *` |

---

### PASO 5 — Subir la página a Netlify

1. Ve a [netlify.com](https://netlify.com) → crea cuenta gratis.
2. En el dashboard, arrastra la carpeta `versiculo-diario` al área de drop.
3. Netlify te dará una URL tipo `https://mi-versiculo.netlify.app` en segundos.
4. (Opcional) Conecta tu repo de GitHub para que Netlify se actualice automático.

---

## 🧪 Probar manualmente

Una vez configurado, puedes correr el envío manualmente:

1. Ve a tu repo en GitHub.
2. Clic en **Actions** (menú superior).
3. Clic en **"Enviar Versículo Diario"** (panel izquierdo).
4. Clic en **"Run workflow"** → **"Run workflow"** (botón verde).
5. Verás el log en tiempo real y si los mensajes se enviaron.

---

## 🔧 Agregar o quitar contactos

Solo edita el secreto `CONTACTS_JSON` en GitHub:
**Settings → Secrets and variables → Actions → CONTACTS_JSON → Update secret**

---

## ❓ Preguntas frecuentes

**¿Cuánto cuesta?**
Todo es 100% gratuito. GitHub Actions da 2,000 minutos/mes gratis. Este workflow usa menos de 1 minuto al día.

**¿Puedo enviar a más de 10 personas?**
Sí, pero CallMeBot puede ser lento con muchos envíos seguidos. El script espera 2 segundos entre cada mensaje.

**¿Puedo cambiar el tema cada semana?**
Sí, solo actualiza el secreto `THEME` en GitHub.

**¿Todos reciben el mismo versículo?**
Sí, se selecciona según la fecha del día (mismo versículo para todos), así pueden comentarlo juntos.
