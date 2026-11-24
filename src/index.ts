import { createServer, type IncomingMessage } from "node:http";
import { buildSchema, graphql } from "graphql";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";

const schema = buildSchema(typeDefs);

const rootValue = (resolvers as { Query: Record<string, unknown> }).Query;

// Тело POST-запроса приходит по кусочкам — собираем в одну строку
function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk: Buffer) => (body += chunk));
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

const server = createServer(async (req, res) => {
  // Лог каждого входящего запроса
  console.log(`\n📥 ${req.method} ${req.url}`);

  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  // CORS preflight
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  // GET запрос
  if (req.method === "GET") {
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const query = url.searchParams.get("query");

    if (query) {
      const result = await graphql({
        schema,
        source: query,
        rootValue,
        variableValues: JSON.parse(url.searchParams.get("variables") ?? "{}")
      });
      res.end(JSON.stringify(result));
      return;
    }

    res.end(
      JSON.stringify({
        status: "ok",
        message: "Это GraphQL-сервер. Отправляй POST с { query, variables }",
        hint: "Пример GET: /?query={ catalog { categories } }"
      })
    );
    return;
  }

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Allow", "GET, POST");
    res.end(JSON.stringify({ error: "GraphQL принимает только GET и POST" }));
    return;
  }

  // POST — главный путь: { query, variables } → { data, errors }
  try {
    const { query, variables } = JSON.parse(await readBody(req));

    console.log(query);
    if (variables && Object.keys(variables).length > 0) {
      console.log("переменные:", JSON.stringify(variables, null, 2));
    }

    const result = await graphql({
      schema,
      source: query,
      rootValue,
      variableValues: variables
    });

    if (result.errors) {
      console.error("❌ Ошибки GraphQL:", result.errors);
    }

    res.statusCode = 200;
    res.end(JSON.stringify(result));
  } catch (e) {
    res.statusCode = 400;
    res.end(JSON.stringify({ errors: [{ message: String(e) }] }));
  }
});

server.listen(4000, () => {
  console.log("🚀 GraphQL-сервер запущен: http://localhost:4000");
});
