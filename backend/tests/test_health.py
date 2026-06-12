from httpx import AsyncClient


async def test_health_check(client: AsyncClient) -> None:
    response = await client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


async def test_deep_health_check(client: AsyncClient) -> None:
    response = await client.get("/api/v1/health/deep")
    assert response.status_code == 200
    res_json = response.json()
    assert res_json["status"] == "ok"
    assert res_json["postgres"] == "ok"
    assert res_json["redis"] == "ok"


