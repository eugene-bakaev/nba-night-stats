from pydantic import BaseModel
from typing import List, Optional

class PeriodDelta(BaseModel):
    period: int
    delta: int

class Game(BaseModel):
    teams: List[str]
    delta: int
    period_deltas: List[PeriodDelta]

class GameResponse(BaseModel):
    game_date: str
    fetched_at: str
    games: List[Game]
    error: Optional[str] = None
