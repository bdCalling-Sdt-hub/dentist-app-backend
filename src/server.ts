import colors from "colors";
import mongoose from "mongoose";
import app from "./app";

let server: any;
async function main() {
  try {
    await mongoose.connect("mongodb://localhost:27017/dentist-app");
    console.log(colors.green("♻️  Database connected successfully"));

    //app listen here
    server = app.listen(5001, () => {
      console.log(colors.yellow(`🚀 Application Running on port:${5001}`));
    });
  } catch (error) {
    console.log(error);
  }
}

main();
