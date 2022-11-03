const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const Koa = require("koa");
const app = new Koa();
const Router = require("koa-router");
const router = new Router();
const koaBody = require("koa-body");
const cors = require("@koa/cors");

app.use(koaBody());
app.use(cors());
app.use(router.routes());

// Connection URL
const url = "mongodb://localhost:27017";

// Database Name
const dbName = "chats";
const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const insertDocuments = (db, data) => {
  const collection = db.collection("msgs");
  // Insert some documents
  collection.insertOne(data, (err, result) => {
    console.log("Inserted success");
  });
};

const findDocuments = (db) => {
  const collection = db.collection("msgs");
  // Find some documents
  return new Promise(function (resolve, reject) {
    collection.find({}).toArray((err, docs) => {
      if (err) throw err;
      resolve(docs);
    });
  });
};

// 删除所有数据
const removeAllData = (db) => {
  const collection = db.collection("msgs");
  collection.remove({}, {}, (err, r) => {
    console.log("remove success");
  });
};

// Use connect method to connect to the server
client.connect((err) => {
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  router.get("/allmsgs", async (ctx, next) => {
    const data = await findDocuments(db);
    ctx.body = data;
    console.log("get");
  });

  router.post("/addmsg", async (ctx, next) => {
    const body = ctx.request.body;
    console.log("body", body);
    await insertDocuments(db, body);
    ctx.body = "success";
  });

  router.delete("/clearmsgs", async (ctx, next) => {
    const data = await removeAllData(db);
    ctx.body = "success";
    console.log("clearmsgs");
  });
});

app.listen(1234);
