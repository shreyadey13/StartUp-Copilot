from datetime import UTC, datetime, timedelta
from typing import Any

from jose import JWTError, jwt

from app.domain.exceptions import AuthenticationError


class JwtService:
    def __init__(self, secret_key: str, algorithm: str, access_token_expire_minutes: int) -> None:
        self.secret_key = secret_key
        self.algorithm = algorithm
        self.access_token_expire_minutes = access_token_expire_minutes

    def create_access_token(self, subject: str, claims: dict[str, Any] | None = None) -> str:
        now = datetime.now(UTC)
        payload: dict[str, Any] = {
            "sub": subject,
            "iat": int(now.timestamp()),
            "exp": int((now + timedelta(minutes=self.access_token_expire_minutes)).timestamp()),
        }
        if claims:
            payload.update(claims)
        return jwt.encode(payload, self.secret_key, algorithm=self.algorithm)

    def decode_token(self, token: str) -> dict[str, Any]:
        try:
            return jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
        except JWTError as exc:
            raise AuthenticationError("Invalid or expired token") from exc

