# Gerador de Tarefas — STOR Sistemas

Ferramenta web para padronizar e agilizar a abertura de tarefas de suporte técnico no sistema STOR. Preencha os campos, gere um JSON estruturado e cole no Claude para obter o título e a descrição revisada automaticamente.

---

## Como funciona

```
Preencher campos → Copiar JSON → Colar no Claude → Tarefa pronta
```

1. Abra o `index.html` no navegador
2. Preencha as seções aplicáveis à tarefa
3. Clique em **Copiar JSON para a IA**
4. Cole o JSON no Claude junto com o arquivo `instrucoes-tarefa-stor.md`
5. O Claude gera o título e a descrição formatada, pronta para registrar no sistema

---

## Seções disponíveis

| Seção | O que preencher |
|---|---|
| **Identificação** | Código e nome do cliente, versão no cliente, versão testada |
| **Introdução** | Descrição geral do problema ou solicitação |
| **Passo a passo** | Sequência de ações que reproduzem o erro |
| **Registro específico** | Data, número do registro, entidade e código |
| **Correção de relatório** | Caminho do relatório e filtros utilizados |
| **Banco de dados / NAS** | Geração automática do caminho de rede |
| **Informações adicionais** | Observações complementares |

Todas as seções podem ser ativadas ou desativadas individualmente.

---

## Geração de caminho NAS

Na seção **Banco de dados / NAS**, informe a subpasta e/ou nome do arquivo. O caminho é montado automaticamente a partir do cliente informado na identificação:

```
\\192.168.15.101\NasFtp\CLIENTES\STOR\2455 - PRIME HAMBURGUERIA\Contabilidade
\\192.168.15.101\NasFtp\CLIENTES\STOR\2455 - PRIME HAMBURGUERIA\BKP 18062026 1149.rar
```

---

## Estrutura do projeto

```
├── index.html                  # Interface principal
├── style.css                   # Estilos (dark mode incluído)
├── app.js                      # Lógica da ferramenta
└── instrucoes-tarefa-stor.md   # Prompt de instruções para o Claude
```

---

## Uso local

Não requer instalação, servidor ou dependências externas.

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/gerador-tarefas-stor.git

# Abra direto no navegador
start index.html       # Windows
open index.html        # macOS
xdg-open index.html   # Linux
```

---

## Observações

- A ferramenta **não faz chamadas à internet** — tudo roda localmente no navegador
- O JSON gerado não contém dados sensíveis além do que você digitou
- Compatível com Chrome, Edge e Firefox modernos
- O dark mode é aplicado automaticamente conforme a preferência do sistema operacional
