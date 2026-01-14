from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

class Database:
    def __init__(self):
        self.MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
        self.client = None
        self.db = None
    
    async def connect(self):
        self.client = AsyncIOMotorClient(self.MONGO_URI)
        self.db = self.client.shakti_db
        print("Connected to MongoDB")
    
    async def disconnect(self):
        if self.client:
            self.client.close()

# Sync database for some operations
def get_sync_db():
    client = MongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017"))
    return client.shakti_db

db = Database()