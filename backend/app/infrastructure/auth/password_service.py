import bcrypt


class PasswordService:
    def hash_password(self, password: str) -> str:
        password_bytes = password.encode("utf-8")
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password_bytes, salt)
        return hashed.decode("utf-8")

    def verify_password(self, password: str, password_hash: str) -> bool:
        password_bytes = password.encode("utf-8")
        hash_bytes = password_hash.encode("utf-8")
        try:
            return bcrypt.checkpw(password_bytes, hash_bytes)
        except Exception:
            return False


