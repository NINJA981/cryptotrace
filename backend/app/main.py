import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.core.config import settings
from backend.app.models.database import init_db, AsyncSessionLocal
from backend.app.services.vasp.matcher import vasp_matcher
from backend.app.api.v1.router import api_router

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("app.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing SIH Crypto Attribution Intelligence Service...")
    # 1. Initialize DB schema
    await init_db()
    
    # 2. Load VASP seed database
    loaded_count = vasp_matcher.load_seed_data()
    logger.info(f"Loaded {loaded_count} verified VASP addresses into memory cache.")
    
    # 3. Synchronize VASP records to relational database
    try:
        async with AsyncSessionLocal() as session:
            await vasp_matcher.sync_to_database(session)
    except Exception as e:
        logger.warning(f"Database VASP sync notice: {e}")
        
    yield
    logger.info("Shutting down service...")


app = FastAPI(
    title="Cryptocurrency Wallet-to-VASP Attribution Engine",
    description="Automated attribution of unknown cryptocurrency wallets to nearest Virtual Asset Service Providers (VASPs) through real blockchain intelligence APIs.",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routers
app.include_router(api_router)


@app.get("/")
async def root():
    return {
        "title": "SIH Cryptocurrency Wallet-to-VASP Attribution Platform",
        "version": "1.0.0",
        "docs_url": "/docs",
        "api_prefix": "/api/v1",
        "blockchain": "Ethereum Mainnet",
        "max_hops": settings.MAX_HOPS
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
