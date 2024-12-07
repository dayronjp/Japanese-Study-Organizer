// Cronograma por dia da semana
const weeklySchedule = {
    0: ["休みの日 (No study scheduled)"], // Domingo
    1: [ // Segunda-feira
        "20分: 文法（文法構造を2つ勉強する）",
        "5分: 休憩",
        "20分: 語彙（新しい単語を10個覚える）",
        "5分: 休憩",
        "20分: 漢字（新しい漢字を5個勉強する）",
        "5分: 休憩",
        "20分: 関西弁（表現を学び、標準語と比較する）"
    ],
    2: [ // Terça-feira
        "30分: 文法（月曜日の文法構造を復習し、新しい構造を2つ勉強する）",
        "5分: 休憩",
        "30分: 語彙（覚えた単語を復習し、新しい単語を10個覚える）",
        "5分: 休憩",
        "20分: 漢字（前回の漢字を復習し、新しい漢字を5個勉強する）"
    ],
    3: [ // Quarta-feira
        "30分: 文法（今週勉強した文法を全て練習する）",
        "5分: 休憩",
        "30分: 語彙（覚えた単語を練習問題や文章で定着させる）",
        "5分: 休憩",
        "20分: 漢字（学んだ漢字を含む簡単な文章を読む）"
    ],
    4: [ // Quinta-feira
        "20分: 文法（新しい文法構造を2つ勉強する）",
        "5分: 休憩",
        "20分: 語彙（新しい単語を10個覚える）",
        "5分: 休憩",
        "20分: 漢字（新しい漢字を5個勉強する）",
        "5分: 休憩",
        "20分: 関西弁（フレーズを練習し、関西弁の会話を聞く）"
    ],
    5: [ // Sexta-feira
        "40分: 総復習（文法、語彙、漢字を全て復習する）",
        "5分: 休憩",
        "20分: 模擬試験（JLPT N4の問題を解く）",
        "5分: 休憩",
        "20分: 追加練習（今週の内容を使った読解、聴解、または作文）"
    ],
    6: ["休みの日 (No study scheduled)"] // Sábado
};

// Inicializar o Pikaday
const picker = new Pikaday({
    field: document.getElementById("calendar"),
    format: "YYYY-MM-DD",
    onSelect: function () {
        const selectedDate = this.getMoment();
        const dayOfWeek = selectedDate.day(); // Obtém o dia da semana (0 = Domingo, 6 = Sábado)
        displaySchedule(dayOfWeek);
    },
});

// Função para exibir o cronograma
function displaySchedule(dayOfWeek) {
    const scheduleContainer = document.querySelector(".container");
    const activities = weeklySchedule[dayOfWeek];

    // Limpar atividades existentes
    const existingDays = document.querySelectorAll(".day");
    existingDays.forEach((day) => day.remove());

    // Criar novo dia com atividades
    const dayDiv = document.createElement("div");
    dayDiv.classList.add("day");
    const title = document.createElement("h2");
    title.textContent = `${getDayName(dayOfWeek)} のスケジュール`;
    dayDiv.appendChild(title);

    activities.forEach((activity) => {
        // Criar o contêiner de atividade
        const activityDiv = document.createElement("div");
        activityDiv.classList.add("activity");

        // Criar o texto da atividade
        const activityText = document.createElement("span");
        activityText.textContent = activity;

        // Criar o botão de início
        const timerButton = document.createElement("button");
        timerButton.classList.add("timer-button");
        timerButton.textContent = "開始"; // Texto do botão
        timerButton.dataset.time = extractTime(activity); // Define o tempo extraído como atributo data

        // Adicionar barra de progresso
        const progressBar = document.createElement("div");
        progressBar.classList.add("progress-bar");
        const progressFill = document.createElement("div");
        progressFill.classList.add("progress-fill");
        progressBar.appendChild(progressFill);

        // Adicionar elementos ao contêiner da atividade
        activityDiv.appendChild(activityText);
        activityDiv.appendChild(progressBar);
        activityDiv.appendChild(timerButton);
        dayDiv.appendChild(activityDiv);
    });

    scheduleContainer.appendChild(dayDiv);
}

// Função para obter o tempo da atividade
function extractTime(activityText) {
    const match = activityText.match(/\d+分/); // Busca pelo tempo no formato "X分"
    return match ? parseInt(match[0]) : 0; // Retorna o valor numérico
}

// Função para obter o nome do dia da semana
function getDayName(dayOfWeek) {
    const days = ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"];
    return days[dayOfWeek];
}

// Adicionar evento aos botões ao carregar ou atualizar o cronograma
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("timer-button")) {
        startTimer(event.target);
    }
});

// Função para iniciar o temporizador
function startTimer(button) {
    const totalTime = parseInt(button.dataset.time) * 60; // Tempo total em segundos
    let timeLeft = totalTime;

    // Selecionar a barra de progresso associada
    const progressBar = button.previousElementSibling.querySelector(".progress-fill");

    // Inicializar barra de progresso
    progressBar.style.width = "0%";

    // Desativar o botão durante o temporizador
    button.disabled = true;

    // Atualizar o texto do botão e a barra de progresso a cada segundo
    const timerInterval = setInterval(() => {
        timeLeft--;

        // Atualizar o texto do botão com o tempo restante
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        button.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;

        // Calcular a porcentagem do progresso
        const progressPercentage = ((totalTime - timeLeft) / totalTime) * 100;
        progressBar.style.width = `${progressPercentage}%`;

        // Quando o tempo expirar
        if (timeLeft <= 0) {
            clearInterval(timerInterval);

            // Atualizar a barra e o botão para "completado"
            button.textContent = "🌸 完了"; // Exibir conclusão
            progressBar.style.width = "100%"; // Completar a barra
            button.style.backgroundColor = "#81c784"; // Indicar conclusão no botão
            button.disabled = false; // Reativar o botão, se necessário

            // Tocar o som ao concluir
            playCompletionSound();
        }
    }, 1000); // Intervalo de 1 segundo
}

// Função para tocar o som ao finalizar o temporizador
function playCompletionSound() {
    const audio = new Audio("sounds/harp-japanese-80bpm-85660.mp3"); // Caminho para o arquivo de som
    audio.play();
}
