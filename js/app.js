(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const dialog = $('#appDialog'), content = $('#dialogContent'), sosDialog = $('#sosDialog');
  const modules = ['signals','digital','limits','network'];
  const titles = {signals:'Reconoce las señales',digital:'Escudo Digital',limits:'Mi voz pone límites',network:'Activa tu red'};
  const quotes = ['No tienes que tener todas las respuestas para dar el primer paso.','Tus límites merecen respeto, incluso cuando decirlos cuesta.','Pedir apoyo es una forma de valentía.','Tu historia te pertenece. Tú decides cuándo y con quién compartirla.','No estás sola: una red de confianza se construye paso a paso.'];
  let completed = new Set(JSON.parse(localStorage.getItem('cv_completed') || '[]'));
  let quizAnswers = {};
  function updateProgress(){const n=completed.size,p=Math.round(n/4*100);$('#progressLabel').textContent=p+'%';$('#progressBar').style.width=p+'%';$('#progressText').textContent=`${n} de 4 módulos completados`;}
  function openDialog(html){content.innerHTML=html;dialog.showModal();content.scrollTop=0;}
  function closeDialog(){dialog.close();}
  function markDone(id){completed.add(id);localStorage.setItem('cv_completed',JSON.stringify([...completed]));updateProgress();}
  function quiz() {
  const questions = [
    {
      q: "¿Cuál es una señal de control en una relación?",
      o: [
        "Respetar las decisiones",
        "Exigir contraseñas",
        "Escuchar opiniones",
        "Respetar amistades"
      ],
      a: 1,
      e: "Exigir contraseñas vulnera la privacidad."
    },
    {
      q: "¿Qué caracteriza a una relación respetuosa?",
      o: [
        "Vigilancia constante",
        "Aislamiento",
        "Respeto de límites",
        "Control de horarios"
      ],
      a: 2,
      e: "El respeto incluye autonomía y confianza."
    },
    {
      q: "¿Qué hacer ante una oferta laboral sospechosa?",
      o: [
        "Pagar inmediatamente",
        "Enviar documentos",
        "Acudir sin verificar",
        "Verificar la empresa"
      ],
      a: 3,
      e: "Verificar por canales oficiales ayuda a prevenir fraudes."
    },
    {
      q: "¿Cuál es una buena práctica de seguridad digital?",
      o: [
        "Activar verificación en dos pasos",
        "Compartir claves",
        "Reutilizar contraseñas",
        "Abrir enlaces desconocidos"
      ],
      a: 0,
      e: "La verificación en dos pasos añade protección."
    },
    {
      q: "¿Cómo expresar un límite personal?",
      o: [
        "Aceptar por presión",
        "Responder con claridad",
        "Ignorar las propias necesidades",
        "Ceder siempre"
      ],
      a: 1,
      e: "Comunicar límites ayuda a expresar lo que aceptamos."
    },
    {
      q: "¿Cómo apoyar a una amiga que siente miedo?",
      o: [
        "Publicar su historia",
        "Decidir por ella",
        "Escuchar sin juzgar",
        "Confrontar a terceros"
      ],
      a: 2,
      e: "Escuchar y ofrecer apoyo respeta su autonomía."
    },
    {
      q: "¿Qué indica el aislamiento impuesto de amistades?",
      o: [
        "Confianza",
        "Comunicación sana",
        "Respeto",
        "Posible señal de control"
      ],
      a: 3,
      e: "Impedir relaciones sociales puede ser una señal de control."
    },
    {
      q: "¿Qué hacer si recibes un enlace sospechoso?",
      o: [
        "Verificar antes de abrir",
        "Compartirlo",
        "Ingresar contraseñas",
        "Descargar archivos"
      ],
      a: 0,
      e: "Verificar enlaces y remitentes reduce riesgos digitales."
    },
    {
      q: "¿Qué caracteriza a una red de apoyo?",
      o: [
        "Personas que imponen decisiones",
        "Personas confiables que escuchan",
        "Personas que difunden secretos",
        "Personas que exigen explicaciones"
      ],
      a: 1,
      e: "Una red de apoyo escucha y respeta las decisiones."
    },
    {
      q: "¿Cuál es el propósito de Código Violeta?",
      o: [
        "Controlar decisiones",
        "Recopilar datos personales",
        "Fortalecer conocimientos preventivos",
        "Reemplazar servicios de emergencia"
      ],
      a: 2,
      e: "Código Violeta ofrece educación preventiva y orientación."
    }
  ];

  const key = "cv_quiz_initial_v2";
  let initial = null;

  try {
    const saved = localStorage.getItem(key);
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (
        Number.isInteger(parsed) &&
        parsed >= 0 &&
        parsed <= 10
      ) {
        initial = parsed;
      }
    }
  } catch (error) {
    console.warn("No se pudo leer el resultado inicial.", error);
  }

  const phase = initial === null ? "inicial" : "final";
  let current = 0;
  const answers = Array(questions.length).fill(null);

  function renderQuestion() {
    const item = questions[current];
    const progress = Math.round(
      (current / questions.length) * 100
    );

    openDialog(`
      <p class="eyebrow">
        EVALUACIÓN ${phase.toUpperCase()}
      </p>

      <h2>Quiz Código Violeta 💜</h2>

      <p>
        Pregunta ${current + 1} de ${questions.length}
      </p>

      <div class="progress-track">
        <div style="width:${progress}%"></div>
      </div>

      <form id="cvQuizForm">
        <fieldset class="quiz-field">
          <legend><b>${item.q}</b></legend>

          ${item.o.map((option, index) => `
            <label class="quiz-option">
              <input
                type="radio"
                name="answer"
                value="${index}"
                required
                ${answers[current] === index ? "checked" : ""}
              >
              ${option}
            </label>
          `).join("")}
        </fieldset>

        <button class="btn btn-primary" type="submit">
          ${
            current === questions.length - 1
              ? "Finalizar evaluación"
              : "Siguiente pregunta →"
          }
        </button>
      </form>
    `);

    $("#cvQuizForm").addEventListener("submit", event => {
      event.preventDefault();

      const data = new FormData(event.currentTarget);
      const value = data.get("answer");

      if (value === null) return;

      answers[current] = Number(value);
      current++;

      if (current < questions.length) {
        renderQuestion();
      } else {
        showResults();
      }
    });
  }

  function showResults() {
    const score = questions.reduce(
      (total, question, index) =>
        total + (answers[index] === question.a ? 1 : 0),
      0
    );

    const percentage = Math.round(
      (score / questions.length) * 100
    );

    if (phase === "inicial") {
      try {
        localStorage.setItem(key, JSON.stringify(score));
      } catch (error) {
        console.warn("No se pudo guardar el resultado.", error);
      }
    }

    const comparison =
      phase === "final" && initial !== null
        ? `
          <div class="feedback">
            <h3>Comparación de aprendizaje</h3>

            <p>
              Evaluación inicial:
              <b>${initial}/10</b>
            </p>

            <p>
              Evaluación final:
              <b>${score}/10</b>
            </p>

            <p>
              Diferencia:
              <b>
                ${score - initial > 0 ? "+" : ""}
                ${score - initial} puntos
              </b>
            </p>
          </div>
        `
        : "";

    const feedback = questions.map((question, index) => `
      <div class="feedback">
        <b>${index + 1}. ${question.q}</b>

        <p>
          ${
            answers[index] === question.a
              ? "✓ Respuesta correcta"
              : "Respuesta para revisar"
          }
        </p>

        <p>
          <b>Respuesta esperada:</b>
          ${question.o[question.a]}
        </p>

        <p>${question.e}</p>
      </div>
    `).join("");

    openDialog(`
      <p class="eyebrow">
        RESULTADOS · EVALUACIÓN ${phase.toUpperCase()}
      </p>

      <h2>¡Tu aprendizaje cuenta! 💜</h2>

      <p>
        Obtuviste
        <b>${score} de ${questions.length}</b>
        respuestas correctas.
      </p>

      <div class="progress-track">
        <div style="width:${percentage}%"></div>
      </div>

      <p>
        <b>${percentage}% de respuestas correctas</b>
      </p>

      ${comparison}

      <h3>Retroalimentación</h3>

      ${feedback}

      <button
        class="btn btn-primary"
        id="cvQuizFinish"
      >
        Continuar mi ruta →
      </button>
    `);

    $("#cvQuizFinish").onclick = () => {
      closeDialog();

      $("#ruta").scrollIntoView({
        behavior: "smooth"
      });
    };
  }

  renderQuestion();
}
  const moduleContent={
    signals:{intro:'El control no es una prueba de amor. Observa cómo te hace sentir una situación y si respeta tus decisiones.',case:'Tu pareja te dice: “Si me quisieras, dejarías de hablar con tus amistades y me darías tu contraseña”.',choices:[['Aceptar para evitar problemas','Aceptar por miedo no resuelve el control. Tus cuentas, amistades y decisiones merecen privacidad.'],['Explicar que tu privacidad y amistades importan','Es una respuesta que establece un límite. Si temes una reacción, prioriza tu seguridad y busca apoyo.'],['Pedir consejo a una persona de confianza','Buscar una perspectiva segura puede ayudarte a pensar opciones sin presión.']],tip:'Señales de alerta: aislamiento, vigilancia, amenazas, humillaciones, culpa constante o presión para hacer algo que no quieres.'},
    digital:{intro:'Tu seguridad digital empieza por pequeñas decisiones. Nadie tiene derecho a amenazarte ni a compartir contenido íntimo sin consentimiento.',case:'Una cuenta te amenaza con publicar mensajes privados si no envías más imágenes.',choices:[['Enviar más contenido para que se detenga','Puede aumentar el control. No tienes que obedecer amenazas ni negociar a solas.'],['No responder impulsivamente; guardar evidencia y buscar apoyo','Una opción más segura: conserva mensajes y enlaces si puedes hacerlo sin riesgo, bloquea/reporta cuando sea seguro y pide apoyo.'],['Compartir la contraseña para demostrar confianza','Compartir contraseñas no detiene el chantaje y aumenta el acceso a tus cuentas.']],tip:'Activa verificación en dos pasos, usa contraseñas únicas y revisa sesiones abiertas. Si guardar pruebas te pone en riesgo, prioriza tu seguridad.'},
    limits:{intro:'Un límite expresa qué necesitas y qué no aceptas. No tienes que justificarlo durante horas ni convencer a otra persona para que sea válido.',case:'Alguien insiste en que hagas algo que no quieres y dice que eres exagerada.',choices:[['“No me siento cómoda. Mi respuesta es no”.','Es una frase clara y respetuosa. Puedes repetirla y retirarte si no te sientes segura.'],['Aceptar para que deje de insistir','La presión no convierte algo en consentimiento. Puedes cambiar de opinión y buscar apoyo.'],['Insultarle para que entienda','Tu enojo es comprensible, pero no necesitas exponerte a una confrontación. Prioriza una salida segura.']],tip:'Frases útiles: “Necesito pensarlo”, “No comparto mis claves”, “No acepto que me hables así” y “Prefiero irme ahora”.'},
    network:{intro:'Una red de apoyo no tiene que ser grande ni perfecta. Busca personas que te escuchen, respeten tus decisiones y puedan ayudarte sin juzgar.',case:'Una amiga te dice que tiene miedo de cómo reaccionará su pareja si intenta alejarse.',choices:[['Escuchar, creerle y preguntarle qué necesita','Acompañar sin culpar y respetar sus decisiones puede ayudarla a recuperar opciones.'],['Exigirle que lo denuncie ahora mismo','Presionarla puede hacer que se cierre. Comparte opciones y deja que participe en las decisiones.'],['Enfrentar a su pareja sin consultarla','La confrontación puede aumentar el riesgo. Prioriza un plan de apoyo seguro.']],tip:'Piensa en tres personas posibles: alguien que te escuche, alguien que pueda acompañarte y alguien que conozca servicios de orientación.'}
  };
  function showModule(id){const m=moduleContent[id];if(!m)return;openDialog(`<p class="eyebrow">RUTA CÓDIGO VIOLETA · ${modules.indexOf(id)+1}/4</p><h2>${titles[id]}</h2><p>${m.intro}</p><div class="feedback"><b>Situación ficticia</b><p>${m.case}</p></div><p><b>¿Qué opción elegirías?</b></p><div class="choice-list">${m.choices.map((c,i)=>`<button class="choice-button" data-choice="${i}">${String.fromCharCode(65+i)}. ${c[0]}</button>`).join('')}</div><div id="moduleFeedback" aria-live="polite"></div><div class="feedback"><b>Recuerda</b><p>${m.tip}</p></div><button class="btn btn-primary" id="completeModule">Marcar módulo como completado ✓</button>`);$$('[data-choice]',content).forEach(b=>b.addEventListener('click',()=>{const c=m.choices[Number(b.dataset.choice)];$('#moduleFeedback',content).innerHTML=`<div class="feedback"><b>Una forma de entenderlo</b><p>${c[1]}</p></div>`;}));$('#completeModule').onclick=()=>{markDone(id);openDialog(`<h2>¡Un paso más para ti! 💜</h2><p>Has marcado “${titles[id]}” como completado en este navegador.</p><button class="btn btn-primary" id="backRoute">Volver a la ruta →</button>`);$('#backRoute').onclick=()=>{closeDialog();$('#ruta').scrollIntoView({behavior:'smooth'});};};}
  function planTool(){openDialog(`<p class="eyebrow">PRIVADO · PLAN PERSONAL</p><h2>Mi Código Violeta</h2><p>Completa solo lo que te resulte seguro. No escribas contraseñas ni información que te identifique. Los datos se usan aquí para preparar una hoja imprimible; no se envían a un servidor.</p><form id="planForm"><label>Persona de confianza 1 (nombre o apodo)</label><input name="p1" autocomplete="off"><label>Persona de confianza 2</label><input name="p2" autocomplete="off"><label>Persona de confianza 3</label><input name="p3" autocomplete="off"><label>Palabra clave acordada (opcional)</label><input name="key" autocomplete="off"><label>Lugar o servicio de apoyo que ya identificaste</label><input name="route" autocomplete="off"><label>Frase de límite que quieres recordar</label><textarea name="limit" placeholder="Ej.: No tengo que responder ahora."></textarea><label><input type="checkbox" name="digital"> Revisé privacidad y seguridad de mis cuentas</label><button class="btn btn-primary" type="submit">Preparar plan para imprimir →</button></form>`);$('#planForm').addEventListener('submit',e=>{e.preventDefault();const d=new FormData(e.target);const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));openDialog(`<div id="printPlan" class="print-plan"><p class="eyebrow">CÓDIGO VIOLETA · MI PLAN</p><h2>Mi plan de prevención y apoyo</h2><p><b>Personas de confianza</b></p><ol><li>${esc(d.get('p1')||'Por completar')}</li><li>${esc(d.get('p2')||'Por completar')}</li><li>${esc(d.get('p3')||'Por completar')}</li></ol><p><b>Palabra clave:</b> ${esc(d.get('key')||'Por acordar')}</p><p><b>Servicio o ruta de apoyo:</b> ${esc(d.get('route')||'Por identificar')}</p><p><b>Mi frase:</b> ${esc(d.get('limit')||'Mis límites merecen respeto.')}</p><p><b>Seguridad digital:</b> ${d.get('digital')?'Revisada':'Pendiente de revisar'}</p><hr><p>Si existe peligro inmediato, prioriza llegar a un lugar seguro y contactar a servicios de emergencia o una persona de confianza. Este documento es una ayuda personal, no sustituye orientación profesional.</p></div><button class="btn btn-primary" id="printPlanBtn">Imprimir / Guardar como PDF ⤓</button><button class="btn btn-secondary" id="editPlanBtn">Volver a editar</button><p class="fine-print">Antes de imprimir, verifica que sea seguro conservar este documento en tu dispositivo o papel.</p>`);$('#printPlanBtn').onclick=()=>window.print();$('#editPlanBtn').onclick=planTool;});}
  function tool(id){const views={jobs:`<p class="eyebrow">VERIFICACIÓN PREVENTIVA</p><h2>¿La oferta laboral parece segura?</h2><p>Marca lo que aparece en el anuncio. Esta lista educativa no verifica empresas ni reemplaza una investigación.</p><form id="jobForm"><label><input type="checkbox" name="money"> Piden pagar por adelantado para postular o asegurar el puesto</label><label><input type="checkbox" name="docs"> Solicitan fotos de documentos o datos bancarios sin explicar por qué</label><label><input type="checkbox" name="isolated"> Citan en un lugar aislado o cambian el lugar a última hora</label><label><input type="checkbox" name="salary"> Prometen un sueldo extraordinario sin explicar funciones</label><label><input type="checkbox" name="pressure"> Presionan para decidir de inmediato y no permiten verificar</label><button class="btn btn-primary">Evaluar señales →</button></form><div id="jobResult"></div>`,chat:`<p class="eyebrow">SIMULADOR DE CHAT</p><h2>Detecta la señal</h2><div class="feedback"><b>Alex · 20:41</b><p>“Si de verdad confías en mí, pásame tu contraseña. Si no, seguro me ocultas algo”.</p></div><p>¿Qué señal identificas en este mensaje?</p><div class="choice-list"><button class="choice-button" data-chat="0">Una petición que debo aceptar para demostrar cariño</button><button class="choice-button" data-chat="1">Presión emocional para acceder a mi privacidad</button><button class="choice-button" data-chat="2">Una comunicación clara y respetuosa</button></div><div id="chatResult"></div>`,evidence:`<p class="eyebrow">SEGURIDAD DIGITAL</p><h2>Guía para conservar evidencias</h2><ol><li>Prioriza tu seguridad; no confrontes a quien te amenaza.</li><li>Si es seguro, conserva capturas completas, usuario, fecha, hora y enlace.</li><li>No edites los archivos originales. Guarda una copia en un lugar seguro al que otras personas no tengan acceso.</li><li>Evita reenviar contenido íntimo. Busca orientación sobre cómo entregarlo de forma segura.</li><li>Si guardar material aumenta el riesgo, detente y pide ayuda a una persona o servicio de confianza.</li></ol><p class="fine-print">Los pasos no garantizan por sí solos valor probatorio legal. Pide orientación profesional sobre tu caso.</p>`,library:`<p class="eyebrow">BIBLIOTECA DE BOLSILLO</p><h2>Guarda estas ideas</h2><div class="feedback"><b>Mis límites importan</b><p>“No necesito justificar un no”.</p></div><div class="feedback"><b>Privacidad digital</b><p>“Mis claves son privadas. Activa la verificación en dos pasos y revisa los dispositivos conectados”.</p></div><div class="feedback"><b>Apoyo sin juicio</b><p>“Te creo. No es tu culpa. ¿Qué necesitas para sentirte más segura?”.</p></div><button class="btn btn-primary" id="printLibrary">Imprimir / guardar como PDF</button>`,progress:`<p class="eyebrow">TU AVANCE</p><h2>Todo paso cuenta</h2><p>Has completado ${completed.size} de 4 módulos (${Math.round(completed.size/4*100)}%).</p><div class="progress-track"><div style="width:${completed.size/4*100}%"></div></div><ul>${modules.map(m=>`<li>${completed.has(m)?'✓':'○'} ${titles[m]}</li>`).join('')}</ul><p>El progreso se guarda únicamente en este navegador. Si lo compartes o lo borras, puede desaparecer.</p>`,stories:`<p class="eyebrow">MENSAJES PARA ACOMPAÑARTE</p><h2>Historias que inspiran</h2><div class="feedback">“Aprendí que puedo pedir tiempo antes de responder y que mis límites no son una falta de cariño”.</div><div class="feedback">“Escuchar a una amiga sin juzgarla también es una forma de acompañar”.</div><div class="feedback">“No tengo que hacerlo todo sola. Puedo construir una red a mi ritmo”.</div><p class="fine-print">Mensajes ilustrativos creados para el sitio; no son testimonios reales.</p>`,localhelp:`<p class="eyebrow">ORIENTACIÓN EN ÁNCASH</p><h2>Encuentra opciones de apoyo</h2><p>Consulta los directorios oficiales para verificar servicios y horarios en Huaraz o tu provincia. No compartas tu ubicación si hacerlo te pone en riesgo.</p><a class="btn btn-primary full" href="https://www.gob.pe/aurora" target="_blank" rel="noopener">Servicios del Programa Aurora ↗</a><a class="btn btn-secondary full" href="https://www.gob.pe/" target="_blank" rel="noopener">Portal oficial del Estado peruano ↗</a><p class="fine-print">No se ha verificado en tiempo real la disponibilidad de centros concretos en tu localidad.</p>`};openDialog(views[id]||'<h2>Herramienta</h2><p>Contenido próximamente.</p>');if(id==='jobs')$('#jobForm').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.target),n=['money','docs','isolated','salary','pressure'].filter(k=>f.has(k)).length;$('#jobResult').innerHTML=`<div class="feedback"><span class="risk">${n>=3?'RIESGO ALTO':n>=1?'RIESGO POR REVISAR':'SIN ALERTAS MARCADAS'}</span><p>${n>=3?'Hay varias señales de alerta. No pagues ni acudas a un lugar inseguro; verifica la empresa por canales independientes y consulta a alguien de confianza.':n>=1?'Detente y verifica los datos de la empresa por canales oficiales antes de compartir información o acudir a una cita.':'No marcar alertas no garantiza que la oferta sea real. Comprueba la identidad de la empresa, el contrato y los canales oficiales.'}</p></div>`;});if(id==='chat')$$('[data-chat]',content).forEach(b=>b.onclick=()=>{$('#chatResult').innerHTML=`<div class="feedback"><b>${b.dataset.chat==='1'?'¡Correcto!':'Observa esta señal'}</b><p>La frase usa culpa y presión para conseguir una contraseña. La confianza no exige renunciar a la privacidad.</p></div>`;});if(id==='library')$('#printLibrary').onclick=()=>window.print();}
  $$('[data-module]').forEach(b=>b.addEventListener('click',()=>showModule(b.dataset.module)));
  $$('[data-tool]').forEach(b=>b.addEventListener('click',()=>b.dataset.tool==='plan'?planTool():tool(b.dataset.tool)));
  $$('[data-go="quiz"]').forEach(b=>b.addEventListener('click',quiz));
  $('#closeDialog').onclick=closeDialog;$('#closeSos').onclick=()=>sosDialog.close();$('#sosBtn').onclick=()=>sosDialog.showModal();
  $('#quickExit').onclick=()=>window.location.replace('https://www.google.com/');$('#sosExit').onclick=()=>window.location.replace('https://www.google.com/');
  $('#contrastBtn').onclick=()=>document.body.classList.toggle('contrast-mode');
  $('#menuBtn').onclick=()=>{const nav=$('#mobileNav'),open=nav.hidden;nav.hidden=!open;$('#menuBtn').setAttribute('aria-expanded',String(open));};
  $('#shareLocation').onclick=()=>{if(!navigator.geolocation){alert('Tu navegador no permite compartir ubicación. Puedes enviar un mensaje sin ubicación.');return;}$('#shareLocation').disabled=true;$('#shareLocation').textContent='Solicitando permiso…';navigator.geolocation.getCurrentPosition(pos=>{const url=`https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`;const msg='Necesito apoyo. Esta es mi ubicación actual (compártela solo con alguien de confianza): '+url;openDialog(`<h2>Mensaje preparado</h2><p>La ubicación se obtuvo con tu permiso y no se envió automáticamente.</p><textarea id="locationMessage">${msg}</textarea><button class="btn btn-primary" id="copyLocation">Copiar mensaje</button><a class="btn btn-secondary" href="https://wa.me/?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">Abrir WhatsApp ↗</a><p class="fine-print">Compartir el enlace puede revelar tu ubicación. Envíalo solo a alguien de confianza.</p>`);$('#copyLocation').onclick=async()=>{try{await navigator.clipboard.writeText($('#locationMessage').value);$('#copyLocation').textContent='Copiado ✓';}catch{ $('#locationMessage').select();document.execCommand('copy');}};},()=>{alert('No fue posible obtener la ubicación. Puedes usar las opciones de ayuda sin compartirla.');$('#shareLocation').disabled=false;$('#shareLocation').textContent='Preparar mensaje con mi ubicación';},{enableHighAccuracy:false,timeout:10000});};
  $('#camouflage').onclick=()=>{sosDialog.close();document.body.innerHTML='<main class="neutral-mode"><div class="neutral-paper"><p>NOTAS DE ESTUDIO</p><h1>Calculadora de porcentajes</h1><p>Introduce un valor y un porcentaje para calcular el resultado.</p><label>Valor <input id="nValue" type="number" value="100"></label><p><label>Porcentaje <input id="nPercent" type="number" value="15"></label></p><button id="nCalc">Calcular</button> <button id="nReturn">Volver</button><p id="nResult">Resultado: 15</p></div></main>';$('#nCalc').onclick=()=>$('#nResult').textContent='Resultado: '+(Number($('#nValue').value)*Number($('#nPercent').value)/100);$('#nReturn').onclick=()=>location.reload();};
  const quoteIndex=Math.floor(Date.now()/9000)%quotes.length;$('#movingQuote').textContent=quotes[quoteIndex];setInterval(()=>{const el=$('#movingQuote');if(el)el.textContent=quotes[Math.floor(Date.now()/9000)%quotes.length];},9000);
  updateProgress();
})();
