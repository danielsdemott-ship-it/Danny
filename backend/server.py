from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR: Path = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url: str = os.environ['MONGO_URL']
client: AsyncIOMotorClient = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app: FastAPI = FastAPI(title="PhantomWorx API")
api_router: APIRouter = APIRouter(prefix="/api")


# ----- Models -----
class Inquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    origin: Optional[str] = None
    intent: str
    room: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class InquiryCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    origin: Optional[str] = Field(default=None, max_length=200)
    intent: str = Field(..., min_length=5, max_length=4000)
    room: Optional[str] = Field(default=None, max_length=200)


class InquiryResponse(BaseModel):
    id: str
    received_at: datetime
    message: str


class RootResponse(BaseModel):
    name: str
    status: str
    motto: str


# ----- Routes -----
@api_router.get("/", response_model=RootResponse)
async def root() -> RootResponse:
    return RootResponse(name="PhantomWorx", status="live", motto="Quietly.")


@api_router.post("/inquiries", response_model=InquiryResponse)
async def create_inquiry(payload: InquiryCreate) -> InquiryResponse:
    inquiry = Inquiry(**payload.model_dump())
    doc = inquiry.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.inquiries.insert_one(doc)
    return InquiryResponse(
        id=inquiry.id,
        received_at=inquiry.created_at,
        message="Sealed. Replies are sent within seventy-two hours, or not at all.",
    )


@api_router.get("/inquiries", response_model=List[Inquiry])
async def list_inquiries() -> List[Inquiry]:
    docs = await db.inquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for d in docs:
        if isinstance(d.get('created_at'), str):
            d['created_at'] = datetime.fromisoformat(d['created_at'])
    return docs


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger: logging.Logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client() -> None:
    client.close()
