// src/DB/connection/connection.DB.ts
import { MongooseModule } from "@nestjs/mongoose";
import { Connection } from "mongoose";

const ConnectionDB = () => 
  MongooseModule.forRoot(process.env.MONGO_URL as string, {
    onConnectionCreate: (connection: Connection) => {
      connection.on('connected', () => console.log(`DB connected successfully ✌️ 💙`));
      return connection;
    },
  });

export default ConnectionDB;
