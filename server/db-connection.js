const mongoose = require("mongoose");
const MONGO_URI =
  "mongodb+srv://sunil-db:jrb3AH9loFSkzOHr@cluster0.9wpuow8.mongodb.net/test-db?retryWrites=true&w=majority&appName=Cluster0b";
try {
  mongoose.connect(process.env.MONGO_URI || MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
} catch (e) {
  console.log(e);
}
