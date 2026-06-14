"""PhantomWorx backend API tests"""
import os
import time
import pytest
import requests
from datetime import datetime

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://phantom-preview-2.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ----- Root -----
class TestRoot:
    def test_root_payload(self, session):
        r = session.get(f"{API}/")
        assert r.status_code == 200, r.text
        data = r.json()
        assert data.get("name") == "PhantomWorx"
        assert data.get("status") == "live"
        assert data.get("motto") == "Quietly."


# ----- Inquiries: create -----
class TestInquiryCreate:
    def test_create_valid_full(self, session):
        payload = {
            "name": "TEST Phantom Tester",
            "email": "test_phantom@example.com",
            "origin": "Referral by Editor",
            "intent": "Seeking quiet introduction for an art acquisition.",
            "room": "Acquisitions",
        }
        r = session.post(f"{API}/inquiries", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "id" in data and isinstance(data["id"], str) and len(data["id"]) > 10
        assert "received_at" in data
        # parse received_at
        datetime.fromisoformat(data["received_at"].replace("Z", "+00:00"))
        assert "message" in data and "Sealed" in data["message"]

    def test_create_minimal_required(self, session):
        payload = {
            "name": "TEST Minimal",
            "email": "min_test@example.com",
            "intent": "Quietly explore listings.",
        }
        r = session.post(f"{API}/inquiries", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["id"]
        assert data["message"]

    def test_missing_name(self, session):
        r = session.post(f"{API}/inquiries", json={"email": "a@b.com", "intent": "Hello there"})
        assert r.status_code == 422

    def test_missing_email(self, session):
        r = session.post(f"{API}/inquiries", json={"name": "Foo Bar", "intent": "Hello there"})
        assert r.status_code == 422

    def test_missing_intent(self, session):
        r = session.post(f"{API}/inquiries", json={"name": "Foo Bar", "email": "a@b.com"})
        assert r.status_code == 422

    def test_invalid_email(self, session):
        r = session.post(
            f"{API}/inquiries",
            json={"name": "Foo Bar", "email": "not-an-email", "intent": "Hello there"},
        )
        assert r.status_code == 422

    def test_intent_too_short(self, session):
        r = session.post(
            f"{API}/inquiries",
            json={"name": "Foo Bar", "email": "a@b.com", "intent": "Hi"},
        )
        assert r.status_code == 422

    def test_name_too_short(self, session):
        r = session.post(
            f"{API}/inquiries",
            json={"name": "A", "email": "a@b.com", "intent": "Hello world"},
        )
        assert r.status_code == 422


# ----- Inquiries: list -----
class TestInquiryList:
    def test_list_after_creation(self, session):
        # Create an inquiry to ensure list is non-empty
        marker = f"TEST_list_{int(time.time())}@example.com"
        create_payload = {
            "name": "TEST List Reader",
            "email": marker,
            "intent": "Reading the list quietly.",
            "origin": "self-test",
            "room": "library",
        }
        cr = session.post(f"{API}/inquiries", json=create_payload)
        assert cr.status_code == 200
        created_id = cr.json()["id"]

        r = session.get(f"{API}/inquiries")
        assert r.status_code == 200, r.text
        items = r.json()
        assert isinstance(items, list)
        assert len(items) >= 1

        # no _id leaks
        for item in items:
            assert "_id" not in item, f"_id leaked in item: {item}"
            assert "id" in item
            assert "name" in item
            assert "email" in item
            assert "intent" in item
            assert "created_at" in item
            # created_at must parse
            datetime.fromisoformat(item["created_at"].replace("Z", "+00:00"))

        # Verify our inserted item is in the list
        emails = [i["email"] for i in items]
        assert marker in emails

        # Verify newly created is at/near top (sorted desc by created_at)
        # the newest should be first
        first = items[0]
        assert first["email"] == marker or first["id"] == created_id

    def test_list_sorted_desc(self, session):
        # Create two items in order
        t = int(time.time())
        first = {
            "name": "TEST Order One",
            "email": f"order1_{t}@example.com",
            "intent": "Order test one.",
        }
        second = {
            "name": "TEST Order Two",
            "email": f"order2_{t}@example.com",
            "intent": "Order test two.",
        }
        r1 = session.post(f"{API}/inquiries", json=first)
        assert r1.status_code == 200
        time.sleep(1.1)
        r2 = session.post(f"{API}/inquiries", json=second)
        assert r2.status_code == 200

        r = session.get(f"{API}/inquiries")
        items = r.json()
        # Find indexes
        idx1 = next((i for i, it in enumerate(items) if it["email"] == first["email"]), None)
        idx2 = next((i for i, it in enumerate(items) if it["email"] == second["email"]), None)
        assert idx1 is not None and idx2 is not None
        # second was created after first -> should appear earlier (lower index)
        assert idx2 < idx1, f"Expected desc sort by created_at, got idx2={idx2}, idx1={idx1}"
