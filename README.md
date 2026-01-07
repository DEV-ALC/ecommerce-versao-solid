# Projeto Solid - E-commerce Monolítico

Este projeto é a refatoração do backend de e-commerce com código "legado".

## Instalação e Configuração

Siga os passos abaixo para preparar o ambiente:

1.  **Instale as dependências:**

    ```bash
    npm install
    ```

2.  **Crie o banco de dados (SQLite) e as tabelas:**

    ```bash
    npm run prisma:migrate
    ```

3.  **Popule o banco com dados de teste (Livro Físico e E-book):**
    ```bash
    npm run prisma:seed
    ```

## Execução

Para rodar a API em modo de desenvolvimento (reinicia ao salvar arquivos):

```bash
npm run dev
```

O servidor iniciará em `http://localhost:3000`.
_Nota: A primeira execução pode demorar alguns segundos para gerar as credenciais de teste do Ethereal Mail._

## Árvore de Arquivos (Pós-Refatoração)

```text
src/
├── modules/
│   ├── email/
│   │   └── emailService.ts               # Servico de email
│   └── order/
│       ├── controllers
│       │   └── OrderController.ts        # controller
│       ├── dto
│       │   └── OrderDto.ts               # interfaces de comunicacao de dados
│       ├── repository
│       │   └── OrderRepository.          # repository
│       ├── service
│       │   └── OrderService.ts           # service
│       ├── strategy
│       │   ├── pagamento
│       │   │   ├── creditCardStrategy.ts   # strategy concreta credito
│       │   │   ├── debitCardStrategy.ts    # strategy concreta debito
│       │   │   ├── pagamentoFactory.ts     # fabrica de pagamentos
│       │   │   └── PagamentoStrategy.ts    # interface strategy
│       │   └── total
│       │       ├── DigitalProductStrategy.ts   # strategy concreta digital
│       │       ├── OrderTotalFactory.ts        # fabrica de strategy
│       │       ├── OrderTotalStrategy.ts       # interface strategy
│       │       └── PhysicalProductStrategy.ts  # strategy concreta fisica
│       │
│       └── validator
│           └── OrderValidator.ts     # validador do basico do produto
│
├── shared/
│   ├── error/
│   │   └── appError.ts               # Wrapper de exeptions
│   └── lib/
│       ├── mail.ts                   # Configuração do Email
│       └── logger.ts                 # Configuração do Winston
│
├── app.ts
└── server.ts
```
