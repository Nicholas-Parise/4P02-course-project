import pytest
import requests as req
from time import sleep
import os
import json

domain = "https://api.wishify.ca"
email = "testAccount287232@wishify.ca"
password = "$eCur3Pa$$w0rD!1"

sleepTime = 0.8

@pytest.fixture
def reset_test_account_state(request):
    sleep(sleepTime)
    res = req.post(
        domain+"/auth/login",
        json={
            "email":email,
            "password":password
        }
    )

    if not "token" in res.json(): return    # no need to reset account since it doesn't exist
    token = res.json()["token"]

    sleep(sleepTime)
    res = req.delete(
        domain+"/users",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "password":password
        }
    )

@pytest.fixture
def cleanup_test_account(request):
    token = None

    def _method(tok):
        token = tok

    yield _method
    sleep(sleepTime)

    if token is None:
        res = req.post(
            domain+"/auth/login",
            json={
                "email":email,
                "password":password
            }
        )
        token = res.json()["token"]

    sleep(sleepTime)
    res = req.delete(
        domain+"/users",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "password":password
        }
    )

@pytest.fixture
def setup_test_account(request):
    sleep(sleepTime)
    res = req.post(
        domain+"/auth/register",
        json={
            "email":email,
            "password":password,
            "displayName":"Automated Test Account"
        }
    )

@pytest.fixture
def log_in():
    res = req.post(
        domain+"/auth/login",
        json={
            "email":email,
            "password":password,
        }
    )
    return res.json()["token"]


@pytest.fixture
def setup_test_event(request):
    res = req.post(
        domain+"/auth/login",
        json={
            "email":email,
            "password":password,
        }
    )
    token = res.json()["token"] 

    sleep(sleepTime)
    res = req.post(
        domain+"/events",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "name":"Automated Event",
        }
    )
    return token, res.json()["event_id"]

@pytest.fixture
def cleanup_test_event(request):
    event_id = None
    token = None
    def _method(tok, e_id):
        event_id = e_id
        token = tok

    yield _method

    if event_id is None: return

    sleep(sleepTime)
    res = req.delete(
        domain+f"/events/{event_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

@pytest.fixture
def setup_test_wishlist(request):
    res = req.post(
        domain+"/auth/login",
        json={
            "email":email,
            "password":password,
        }
    )
    token = res.json()["token"] 

    sleep(sleepTime)
    res = req.post(
        domain+"/wishlists",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "name":"Automated Test Wishlist",
        }
    )
    return token, res.json()["wishlist_id"]

@pytest.fixture
def cleanup_test_wishlist(request):
    wishlist_id = None
    token = None
    def _method(tok, w_id):
        wishlist_id = w_id
        token = tok

    yield _method

    if wishlist_id is None: return

    sleep(sleepTime)
    res = req.delete(
        domain+f"/wishlists/{wishlist_id}",
        headers={"Authorization": f"Bearer {token}"},
    )