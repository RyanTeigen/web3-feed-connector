from pydantic import BaseModel
from datetime import datetime
from typing import Literal

class FeedItem(BaseModel):
    platform: Literal["discord", "ghost", "twitter", "linkedin"]
    content: str
    timestamp: datetime
    metadata: dict = {}
