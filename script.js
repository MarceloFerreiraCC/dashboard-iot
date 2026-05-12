const channelID = "3375309";

const umidadeTexto =
  document.getElementById("umidade");

const statusTexto =
  document.getElementById("status");

const ctx =
  document.getElementById("grafico");

const dados = {

  labels: [],

  datasets: [{

    label: "Umidade (%)",

    data: [],

    borderWidth: 2

  }]
};

const grafico = new Chart(ctx, {

  type: "line",

  data: dados,

  options: {

    responsive: true,

    scales: {

      y: {

        min: 0,

        max: 100
      }
    }
  }
});

async function buscarDados() {

  try {

    const resposta = await fetch(
      `https://api.thingspeak.com/channels/${channelID}/fields/1.json?api_key=G0AHWT8BYB70SNTT&results=2`
    );

    const json = await resposta.json();

    const feeds = json.feeds;

    dados.labels = [];
    dados.datasets[0].data = [];

    feeds.forEach(feed => {

      let umidade =
        parseInt(feed.field1);

      let horario =
        new Date(feed.created_at)
        .toLocaleTimeString();

      dados.labels.push(horario);

      dados.datasets[0].data.push(umidade);
    });

    const ultimo =
      parseInt(
        feeds[feeds.length - 1].field1
      );

    umidadeTexto.innerHTML =
      ultimo + "%";

    // Status inteligente
    if (ultimo < 30) {

      statusTexto.innerHTML =
        "⚠️ Solo Seco";

      statusTexto.style.color =
        "red";

    } else if (ultimo < 60) {

      statusTexto.innerHTML =
        "🌤️ Umidade Moderada";

      statusTexto.style.color =
        "orange";

    } else {

      statusTexto.innerHTML =
        "💧 Solo Úmido";

      statusTexto.style.color =
        "lightgreen";
    }

    grafico.update();

  } catch (erro) {

    statusTexto.innerHTML =
      "Erro ao conectar";

    statusTexto.style.color =
      "red";

    console.error(erro);
  }
}

// Atualiza automaticamente
buscarDados();

setInterval(buscarDados, 15000);