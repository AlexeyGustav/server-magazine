# Magazine Server (graphql-demo)

Проект: сервер интернет-магазина (каталог + корзина), реализованный на **GraphQL** и **WebSocket**.

## Технологии

- **Node.js** + **TypeScript**
- **GraphQL** (`graphql` ^16) — схема каталога, запросы `GET`/`POST`
- **WebSocket / Socket.IO** (`socket.io` ^4) — синхронизация корзины в реальном времени между всеми клиентами
- `tsx` — запуск и hot-reload TypeScript без сборки

## Структура проекта

```
src/
├── index.ts      # HTTP-сервер (GraphQL endpoint) + Socket.IO (корзина)
├── schema.ts     # GraphQL type definitions (SDL)
├── resolvers.ts  # Резолверы GraphQL
├── cart.ts       # Логика корзины (add / decrement / remove / clear)
├── data.ts       # Данные каталога
└── types.ts      # Типы TypeScript
```

## Как это работает

### GraphQL (HTTP, порт 4000)

Сервер принимает GraphQL-запросы:

- `POST /` — тело вида `{ "query": "...", "variables": {...} }`
- `GET /?query={ catalog { categories } }&variables=...`

Основной запрос:

```graphql
query {
  catalog {
    categories
    filters { price { label min max currency } additional { label options } ... }
    products { id img title description text oldPrice newPrice additional material color style price }
  }
}
```

### WebSocket / Socket.IO — корзина в реальном времени

Все клиенты подключаются к Socket.IO и держат корзину синхронизированной:

События **от клиента к серверу**:

| Событие       | Payload          | Действие             |
| ------------- | ---------------- | -------------------- |
| `cart:add`    | `{ id: number }` | добавить товар       |
| `cart:plus`   | `{ id: number }` | увеличить количество |
| `cart:minus`  | `{ id: number }` | уменьшить количество |
| `cart:remove` | `{ id: number }` | удалить товар        |
| `cart:clear`  | —                | очистить корзину     |

События **от сервера к клиенту**:

- `cart-updated` — актуальное состояние корзины; рассылается всем клиентам (`io.emit`) после каждого изменения и при новом подключении.

## Запуск

```bash
npm install
npm run dev      # запуск с hot-reload (tsx watch)
npm run start    # обычный запуск
npm run build    # компиляция tsc
```

Сервер слушает `http://localhost:4000`. Без query в GET-запросе вернёт подсказку об использовании.

## Примеры проверки

```bash
# GET-запрос
curl "http://localhost:4000/?query={ catalog { categories } }"

# POST-запрос
curl -X POST http://localhost:4000 -H "Content-Type: application/json" -d "{\"query\":\"{ catalog { categories } }\"}"
```
