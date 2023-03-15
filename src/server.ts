import { app } from "./app";

app.listen({
  host: '0.0.0.0',
  port: 8000,
}).then(() => console.log('HTTP Server running'))
