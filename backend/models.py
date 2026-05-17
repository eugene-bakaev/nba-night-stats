from pydantic import BaseModel
from typing import List, Optional

class PeriodDelta(BaseModel):
    period: int
    delta: int

class Game(BaseModel):
    teams: List[str]
    delta: int
    period_deltas: List[PeriodDelta]

class UpcomingGame(BaseModel):
    teams: List[str]
    time: str
    game_date: str
    status: str

class GameResponse(BaseModel):
    game_date: str
    fetched_at: str
    games: List[Game]
    upcoming_date: Optional[str] = None
    upcoming_games: List[UpcomingGame] = []
    error: Optional[str] = None
