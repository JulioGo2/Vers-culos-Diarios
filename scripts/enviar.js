// scripts/enviar.js
// Se corre cada día por GitHub Actions

const https = require('https');

// ─── VERSÍCULOS CURADOS POR TEMA ─────────────────────────────────────────────
const VERSES = {
  faith: [
    { ref: "Hebreos 11:1", text: "La fe es la certeza de lo que se espera, y la convicción de lo que no se ve." },
    { ref: "Marcos 9:23", text: "Todo es posible para el que cree." },
    { ref: "Romanos 10:17", text: "La fe viene por el oír, y el oír, por la palabra de Dios." },
    { ref: "Santiago 2:17", text: "Así también la fe, si no tiene obras, es muerta en sí misma." },
    { ref: "Mateo 17:20", text: "Si tenéis fe como un grano de mostaza... nada os será imposible." },
    { ref: "1 Corintios 2:5", text: "Para que vuestra fe no esté fundada en la sabiduría de los hombres, sino en el poder de Dios." },
    { ref: "Gálatas 2:20", text: "Con Cristo estoy juntamente crucificado, y ya no vivo yo, mas vive Cristo en mí; y lo que ahora vivo en la carne, lo vivo en la fe del Hijo de Dios." },
  ],
  hope: [
    { ref: "Jeremías 29:11", text: "Porque yo sé los planes que tengo para vosotros, planes de bienestar y no de calamidad, para daros un futuro y una esperanza." },
    { ref: "Romanos 8:28", text: "A los que aman a Dios, todas las cosas les ayudan a bien." },
    { ref: "Romanos 15:13", text: "El Dios de esperanza os llene de todo gozo y paz en el creer, para que abundéis en esperanza por el poder del Espíritu Santo." },
    { ref: "Lamentaciones 3:22-23", text: "Por la misericordia del Señor no hemos sido consumidos; sus misericordias nunca decaen. Nuevas son cada mañana." },
    { ref: "Salmos 42:11", text: "¿Por qué te abates, oh alma mía? Espera en Dios, porque aún he de alabarle." },
    { ref: "Isaías 40:31", text: "Los que esperan al Señor tendrán nuevas fuerzas; levantarán alas como las águilas." },
  ],
  love: [
    { ref: "Juan 3:16", text: "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna." },
    { ref: "1 Corintios 13:4-5", text: "El amor es sufrido, es benigno; el amor no tiene envidia; el amor no es jactancioso, no se envanece." },
    { ref: "1 Juan 4:8", text: "El que no ama no ha conocido a Dios, porque Dios es amor." },
    { ref: "Juan 15:13", text: "Nadie tiene mayor amor que este: que alguno ponga su vida por sus amigos." },
    { ref: "Romanos 8:38-39", text: "Nada nos podrá separar del amor de Dios, que es en Cristo Jesús Señor nuestro." },
    { ref: "1 Juan 4:19", text: "Nosotros le amamos a él, porque él nos amó primero." },
  ],
  peace: [
    { ref: "Juan 14:27", text: "La paz os dejo, mi paz os doy; yo no os la doy como el mundo la da. No se turbe vuestro corazón, ni tenga miedo." },
    { ref: "Filipenses 4:7", text: "La paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús." },
    { ref: "Isaías 26:3", text: "Tú guardarás en perfecta paz a aquel cuyo pensamiento en ti persevera, porque en ti ha confiado." },
    { ref: "Salmos 46:10", text: "Estad quietos y conoced que yo soy Dios." },
    { ref: "Mateo 5:9", text: "Bienaventurados los pacificadores, porque ellos serán llamados hijos de Dios." },
    { ref: "Colosenses 3:15", text: "La paz de Dios gobierne en vuestros corazones, a la que asimismo fuisteis llamados en un solo cuerpo." },
  ],
  strength: [
    { ref: "Filipenses 4:13", text: "Todo lo puedo en Cristo que me fortalece." },
    { ref: "Josué 1:9", text: "Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes, porque el Señor tu Dios estará contigo." },
    { ref: "2 Corintios 12:9", text: "Mi poder se perfecciona en tu debilidad. De buena gana me gloriaré en mis debilidades para que el poder de Cristo repose sobre mí." },
    { ref: "Salmos 28:7", text: "El Señor es mi fortaleza y mi escudo; en él confió mi corazón, y fui ayudado." },
    { ref: "Isaías 41:10", text: "No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo." },
    { ref: "Efesios 6:10", text: "Fortaleceos en el Señor y en el poder de su fuerza." },
  ],
  wisdom: [
    { ref: "Proverbios 3:5-6", text: "Confía en el Señor con todo tu corazón; no te apoyes en tu propia prudencia. Reconócelo en todos tus caminos, y él dirigirá tus sendas." },
    { ref: "Santiago 1:5", text: "Si alguno de vosotros tiene falta de sabiduría, pídala a Dios, el cual da a todos abundantemente y sin reproche." },
    { ref: "Proverbios 9:10", text: "El principio de la sabiduría es el temor del Señor." },
    { ref: "Eclesiastés 7:12", text: "La sabiduría es defensa, y el dinero es defensa; pero la sabiduría da vida a los que la tienen." },
    { ref: "Proverbios 16:16", text: "Mejor es adquirir sabiduría que oro preciado, y adquirir inteligencia vale más que la plata." },
    { ref: "Proverbios 4:7", text: "La sabiduría es lo primero. ¡Adquiere sabiduría! Y sobre todas tus posesiones adquiere inteligencia." },
  ],
  joy: [
    { ref: "Nehemías 8:10", text: "El gozo del Señor es vuestra fortaleza." },
    { ref: "Salmos 118:24", text: "Este es el día que hizo el Señor; regocijémonos y alegrémonos en él." },
    { ref: "Filipenses 4:4", text: "Regocijaos en el Señor siempre. Otra vez digo: ¡Regocijaos!" },
    { ref: "Juan 15:11", text: "Estas cosas os he hablado, para que mi gozo esté en vosotros, y vuestro gozo sea completo." },
    { ref: "Salmos 16:11", text: "En tu presencia hay plenitud de gozo; delicias a tu diestra para siempre." },
    { ref: "Romanos 14:17", text: "El reino de Dios no es comida ni bebida, sino justicia, paz y gozo en el Espíritu Santo." },
  ],
  grace: [
    { ref: "Efesios 2:8-9", text: "Por gracia sois salvos por medio de la fe; y esto no de vosotros, pues es don de Dios, no por obras." },
    { ref: "2 Corintios 12:9", text: "Te basta mi gracia; porque mi poder se perfecciona en la debilidad." },
    { ref: "Hebreos 4:16", text: "Acerquémonos, pues, confiadamente al trono de la gracia, para alcanzar misericordia y hallar gracia para el oportuno socorro." },
    { ref: "Salmos 84:11", text: "Gracia y gloria dará el Señor. No quitará el bien a los que caminan en integridad." },
    { ref: "Juan 1:16", text: "De su plenitud tomamos todos, y gracia sobre gracia." },
    { ref: "2 Timoteo 1:9", text: "Dios nos salvó y llamó con vocación santa, no conforme a nuestras obras, sino según el propósito suyo y la gracia que nos fue dada en Cristo Jesús." },
  ],
};

// ─── SELECCIONAR VERSÍCULO DEL DÍA ──────────────────────────────────────────
// Usa la fecha como semilla para que todos reciban el mismo versículo cada día
function getVerseOfTheDay(theme) {
  const pool = VERSES[theme] || VERSES['faith'];
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const index = seed % pool.length;
  return pool[index];
}

// ─── FORMATEAR MENSAJE ───────────────────────────────────────────────────────
function formatMessage(verse) {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const now = new Date();
  const dayName = days[now.getDay()];
  const day = now.getDate();
  const month = months[now.getMonth()];

  return `🌅 *Versículo del día*\n${dayName}, ${day} de ${month}\n\n📖 _"${verse.text}"_\n\n— *${verse.ref}*\n\n🙏 Que Dios bendiga tu día`;
}

// ─── ENVIAR VÍA CALLMEBOT ────────────────────────────────────────────────────
function sendWhatsApp(phone, apikey, message) {
  return new Promise((resolve, reject) => {
    const encoded = encodeURIComponent(message);
    const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encoded}&apikey=${apikey}`;

    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve({ ok: true, response: data });
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    }).on('error', reject);
  });
}

// ─── ESPERAR N MILISEGUNDOS ──────────────────────────────────────────────────
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  // Leer configuración desde variables de entorno (GitHub Secrets)
  const contactsJson = process.env.CONTACTS_JSON;
  const theme = process.env.THEME || 'faith';

  if (!contactsJson) {
    console.error('❌ ERROR: La variable CONTACTS_JSON no está configurada en GitHub Secrets.');
    console.error('   Ve a tu repo → Settings → Secrets and variables → Actions → New repository secret');
    process.exit(1);
  }

  let contacts;
  try {
    contacts = JSON.parse(contactsJson);
  } catch (e) {
    console.error('❌ ERROR: CONTACTS_JSON no es un JSON válido:', e.message);
    process.exit(1);
  }

  const verse = getVerseOfTheDay(theme);
  const message = formatMessage(verse);

  console.log('─'.repeat(50));
  console.log(`📅 Fecha: ${new Date().toLocaleDateString('es-PE')}`);
  console.log(`📖 Tema: ${theme}`);
  console.log(`✨ Versículo: ${verse.ref}`);
  console.log(`👥 Contactos: ${contacts.length}`);
  console.log('─'.repeat(50));

  let ok = 0;
  let err = 0;

  for (const contact of contacts) {
    if (!contact.phone || !contact.apikey) {
      console.log(`⚠️  ${contact.name || '?'}: faltan datos, omitido`);
      err++;
      continue;
    }

    try {
      await sendWhatsApp(contact.phone, contact.apikey, message);
      console.log(`✅ Enviado a ${contact.name} (+${contact.phone})`);
      ok++;
    } catch (e) {
      console.error(`❌ Error con ${contact.name}: ${e.message}`);
      err++;
    }

    // Esperar 2 segundos entre envíos para no sobrecargar la API
    await wait(2000);
  }

  console.log('─'.repeat(50));
  console.log(`📊 Resultado: ${ok} enviados, ${err} errores`);

  if (err > 0 && ok === 0) process.exit(1);
}

main().catch(e => {
  console.error('Error fatal:', e);
  process.exit(1);
});
