from fastapi import FastAPI, APIRouter, BackgroundTasks, Depends, HTTPException, Request, status
from fastapi.security import HTTPBearer, HTTPAuthCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from slowapi import Limiter
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi.util import get_remote_address

from notify import notify_new_inquiry


ROOT_DIR: Path = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url: str = os.environ['MONGO_URL']
client: AsyncIOMotorClient = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app: FastAPI = FastAPI(title="PhantomWorx API")
api_router: APIRouter = APIRouter(prefix="/api")

# Auth configuration
SECRET_KEY: str = os.environ.get('SECRET_KEY', 'your-secret-key-change-in-production')
ALGORITHM: str = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

pwd_context: CryptContext = CryptContext(schemes=["bcrypt"], deprecated="auto")
security: HTTPBearer = HTTPBearer()
limiter: Limiter = Limiter(key_func=get_remote_address)


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


# ----- Admin & Auth Models -----
class AdminLogin(BaseModel):
    username: str
    password: str


class AdminToken(BaseModel):
    access_token: str
    token_type: str


# ----- Inventory Models -----
class InventoryItem(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    category: str
    title: str
    description: Optional[str] = None
    price: Optional[float] = None
    availability: str = "available"
    image_url: Optional[str] = None
    status_code: Optional[str] = None
    metadata: Optional[dict] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class InventoryItemCreate(BaseModel):
    category: str = Field(..., min_length=1)
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=4000)
    price: Optional[float] = None
    availability: str = "available"
    image_url: Optional[str] = None
    status_code: Optional[str] = None
    metadata: Optional[dict] = None


class InventoryItemUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    availability: Optional[str] = None
    image_url: Optional[str] = None
    status_code: Optional[str] = None
    metadata: Optional[dict] = None


# ----- Auth Helpers -----
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_admin(credentials: HTTPAuthCredentials = Depends(security)) -> str:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    return username


# ----- Routes -----
@api_router.get("/", response_model=RootResponse)
async def root() -> RootResponse:
    return RootResponse(name="PhantomWorx", status="live", motto="Quietly.")


@api_router.post("/admin/login", response_model=AdminToken)
async def admin_login(credentials: AdminLogin) -> AdminToken:
    """Authenticate admin user and return JWT token"""
    admin_user = await db.admins.find_one({"username": credentials.username})
    
    if not admin_user or not verify_password(credentials.password, admin_user["password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": credentials.username})
    return AdminToken(access_token=access_token, token_type="bearer")


@api_router.post("/admin/register", response_model=dict)
async def admin_register(credentials: AdminLogin) -> dict:
    """Register a new admin user (first time setup only)"""
    admin_count = await db.admins.count_documents({})
    if admin_count:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin registration is closed")

    existing = await db.admins.find_one({"username": credentials.username})
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Admin already exists")
    
    hashed_pw = get_password_hash(credentials.password)
    doc = {"username": credentials.username, "password": hashed_pw, "created_at": datetime.now(timezone.utc).isoformat()}
    await db.admins.insert_one(doc)
    
    return {"message": "Admin registered successfully", "username": credentials.username}


# ----- Inventory Routes (Admin Only) -----
@api_router.post("/inventory", response_model=InventoryItem)
async def create_inventory_item(
    payload: InventoryItemCreate,
    admin: str = Depends(get_current_admin)
) -> InventoryItem:
    """Create a new inventory item (admin only)"""
    item = InventoryItem(**payload.model_dump())
    doc = item.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    await db.inventory.insert_one(doc)
    return item


@api_router.get("/inventory", response_model=List[InventoryItem])
async def list_inventory(category: Optional[str] = None) -> List[InventoryItem]:
    """List all inventory items, optionally filtered by category"""
    query = {} if not category else {"category": category}
    docs = await db.inventory.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for d in docs:
        if isinstance(d.get('created_at'), str):
            d['created_at'] = datetime.fromisoformat(d['created_at'])
        if isinstance(d.get('updated_at'), str):
            d['updated_at'] = datetime.fromisoformat(d['updated_at'])
    return docs


@api_router.get("/inventory/{item_id}", response_model=InventoryItem)
async def get_inventory_item(item_id: str) -> InventoryItem:
    """Get a specific inventory item"""
    doc = await db.inventory.find_one({"id": item_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    if isinstance(doc.get('created_at'), str):
        doc['created_at'] = datetime.fromisoformat(doc['created_at'])
    if isinstance(doc.get('updated_at'), str):
        doc['updated_at'] = datetime.fromisoformat(doc['updated_at'])
    return doc


@api_router.put("/inventory/{item_id}", response_model=InventoryItem)
async def update_inventory_item(
    item_id: str,
    payload: InventoryItemUpdate,
    admin: str = Depends(get_current_admin)
) -> InventoryItem:
    """Update an inventory item (admin only)"""
    doc = await db.inventory.find_one({"id": item_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    
    update_data = payload.model_dump(exclude_unset=True)
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    await db.inventory.update_one({"id": item_id}, {"$set": update_data})
    
    updated_doc = await db.inventory.find_one({"id": item_id}, {"_id": 0})
    if isinstance(updated_doc.get('created_at'), str):
        updated_doc['created_at'] = datetime.fromisoformat(updated_doc['created_at'])
    if isinstance(updated_doc.get('updated_at'), str):
        updated_doc['updated_at'] = datetime.fromisoformat(updated_doc['updated_at'])
    return updated_doc


@api_router.delete("/inventory/{item_id}", response_model=dict)
async def delete_inventory_item(item_id: str, admin: str = Depends(get_current_admin)) -> dict:
    """Delete an inventory item (admin only)"""
    result = await db.inventory.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    return {"message": "Item deleted successfully", "item_id": item_id}


@api_router.post("/inquiries", response_model=InquiryResponse)
@limiter.limit("5/minute")
async def create_inquiry(
    request: Request,
    payload: InquiryCreate,
    background: BackgroundTasks,
) -> InquiryResponse:
    inquiry = Inquiry(**payload.model_dump())
    doc = inquiry.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.inquiries.insert_one(doc)

    # Fire-and-forget email + SMS notification (never blocks the response)
    background.add_task(
        notify_new_inquiry,
        name=inquiry.name,
        email=inquiry.email,
        intent=inquiry.intent,
        origin=inquiry.origin,
        room=inquiry.room,
        inquiry_id=inquiry.id,
    )

    return InquiryResponse(
        id=inquiry.id,
        received_at=inquiry.created_at,
        message="Sealed. Replies are sent within seventy-two hours, or not at all.",
    )


@api_router.get("/inquiries", response_model=List[Inquiry])
async def list_inquiries(admin: str = Depends(get_current_admin)) -> List[Inquiry]:
    """List all inquiries (admin only)"""
    docs = await db.inquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for d in docs:
        if isinstance(d.get('created_at'), str):
            d['created_at'] = datetime.fromisoformat(d['created_at'])
    return docs


app.include_router(api_router)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

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
