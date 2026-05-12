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

    borderWidth: 3,

    tension: 0.3

  }]
};

const grafico = new Chart(ctx, {

  type: "line",

  data: dados,

  options: {

    responsive: true,

    maintainAspectRatio: false,

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

      let valor =
        parseInt(feed.field1);

      let hora =
        new Date(feed.created_at)
        .toLocaleTimeString();

      dados.labels.push(hora);

      dados.datasets[0].data.push(valor);
    });

    const ultimo =
      parseInt(
        feeds[feeds.length - 1].field1
      );

    umidadeTexto.innerHTML =
      ultimo + "%";

    if (ultimo < 30) {

      statusTexto.innerHTML =
        "⚠️ Solo Seco";

      statusTexto.style.color =
        "#ef4444";

    } else if (ultimo < 60) {

      statusTexto.innerHTML =
        "🌤️ Moderado";

      statusTexto.style.color =
        "#f59e0b";

    } else {

      statusTexto.innerHTML =
        "💧 Solo Úmido";

      statusTexto.style.color =
        "#22c55e";
    }

    grafico.update();

  } catch (erro) {

    statusTexto.innerHTML =
      "Erro conexão";

    statusTexto.style.color =
      "red";

    console.error(erro);
  }
}

buscarDados();

setInterval(buscarDados, 15000);