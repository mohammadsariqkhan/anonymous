import mongoose from "mongoose";

type ConnnectionObject = {
    isConnected?: number
}

const connection: ConnnectionObject = {}

async function dbConnect(): Promise<void>{
    if(connection.isConnected){
        console.log("Already connected to database")
        return
    }
    try{
        const db = await mongoose.connect(process.env.MONOGDB_URI || '',{})
        connection.isConnected = db.connections[0].readyState

        console.log("DB connected Successfully")
    }catch (error){
        console.log("database connection failed",error)
        process.exit(1)
    }
}

export default dbConnect