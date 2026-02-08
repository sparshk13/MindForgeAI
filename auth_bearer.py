# app/auth/auth_bearer.py
from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from .auth_handler import decode_access_token

class JWTBearer(HTTPBearer):
    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super().__call__(request)
        if not credentials:
            raise HTTPException(status_code=403, detail="Authorization token missing")
        payload = decode_access_token(credentials.credentials)
        if payload is None:
            raise HTTPException(status_code=403, detail="Invalid token")
        return payload
