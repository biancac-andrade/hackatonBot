const { Client, Events, GatewayIntentBits, Collection } = require("discord.js");
const dotenv = require("dotenv");
dotenv.config();
const { TOKEN } = process.env;

const fs = require("node:fs");
const path = require("node:path");
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
client.commands = new Collection();

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `Esse comando em ${filePath} está com "data" ou "execute ausentes"`
    );
  }
}

const sensitiveWords = [
  "assédio",
  "abuso",
  "encoxar",
  "tarado",
  "tarada",
  "taradão",
  "taradona",
  "espancar",
  "bater",
  "matar",
  "assassinar",
  "chutar",
  "agredir",
  "agressão",
  "idiota",
  "imbecil",
  "burro",
  "burra",
  "otário",
  "otária",
  "babaca",
  "cretino",
  "cretina",
  "desgraçado",
  "desgraçada",
  "preconceito",
  "discriminação",
  "homofobia",
  "transfobia",
  "machismo",
  "sexismo",
  "racismo",
  "preto",
  "preta",
  "macaco",
  "macaca",
  "negro",
  "negra",
  "retardado",
  "retardada",
  "mongol",
  "mongoloide",
  "aleijado",
  "aleijada",
  "estúpido",
  "vagabundo",
  "vagabunda",
  "vadia",
  "viado",
  "puta",
  "puto",
  "favelado",
  "corno",
  "prostituta",
  "lixo humano",
  "bicha",
  "sapatão",
  "sapatona",
  "viadinho",
  "arrombado",
  "arrombada",
  "violação",
  "incompetente",
  "ridículo",
  "nojento",
  "safado",
  "safada",
  "pervertido",
  "pervertida",
  "peste",
  "satanás",
  "capeta",
  "demônio",
  "maluco",
  "maluca",
  "louco",
  "louca",
  "loucura",
  "doente",
  "podre",
  "imundo",
  "moleque",
  "pirralho",
  "piranha",
  "vulgar",
  "escroto",
  "escrota",
  "degenerado",
  "degenerada",
  "aberração",
  "abusivo",
  "abusiva",
  "tóxico",
  "tóxica",
  "maldito",
  "maldita",
  "malvado",
  "malvada",
  "cruel",
  "crueldade",
  "criminoso",
  "criminosa",
  "crime",
  "pornografia",
  "vício",
  "inadequado",
  "inapropriado",
  "indecente",
  "repugnante",
  "nojento",
  "sujo",
  "sujidade",
  "bagunça",
  "bagunceiro",
  "bagunceira",
  "irrespeitoso",
  "irrespeitosa",
  "irresponsável",
  "negligente",
  "negligência",
  "inútil",
  "inutilidade",
  "preguiçoso",
  "preguiçosa",
  "fracasso",
  "desastre",
  "fiasco",
  "destruição",
  "caos",
  "insensível",
  "insensibilidade",
  "insulto",
  "ofensa",
  "ameaça",
  "ameaçador",
  "ameaçadora",
  "chantagem",
  "chantagista",
  "falsidade",
  "enganar",
  "enganador",
  "enganadora",
  "enganoso",
  "manipulação",
  "manipulador",
  "manipuladora",
  "manipulativo",
];

function filterMessage(message) {
  const messageContent = message.content.toLowerCase();
  for (const word of sensitiveWords) {
    if (messageContent.includes(word)) {
      return true;
    }
  }
  return false;
}

client.once(Events.ClientReady, (c) => {
  console.log(`Pronto! Login realizado como ${c.user.tag}`);
});
client.login(TOKEN);

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isStringSelectMenu()) {
    const selected = interaction.values[0];
    if (selected === "javascript") {
      await interaction.reply(
        "Documentação do Javascript: https://developer.mozilla.org/en-US/docs/Web/JavaScript"
      );
    } else if (selected === "python") {
      await interaction.reply("Documentação do Python: https://www.python.org");
    } else if (selected === "csharp") {
      await interaction.reply(
        "Documentação do C#: https://learn.microsoft.com/en-us/dotnet/csharp/"
      );
    } else if (selected === "discordjs") {
      await interaction.reply(
        "Documentação do Discord.js: https://discordjs.guide/#before-you-begin"
      );
    }
  }

  if (!interaction.isChatInputCommand()) return;

  if (filterMessage(interaction)) {
    await interaction.reply(
      "Sua mensagem contém termos inadequados. Por favor, mantenha o respeito na comunidade."
    );
    return;
  }

  const command = interaction.client.commands.get(interaction.commandName);
  if (!command) {
    console.error("Comando não encontrado");
    return;
  }
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply("Houve um erro ao executar esse comando!");
  }
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

  if (filterMessage(message)) {
    // await message.delete();
    await message.channel.send(
      `Olá ${message.author.username}, sua mensagem foi reconhecida por conter termos inadequados. Por favor, mantenha o respeito na comunidade.`
    );
  }
});
