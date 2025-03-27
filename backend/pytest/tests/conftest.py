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
        nonlocal token
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
        nonlocal event_id
        nonlocal token
        event_id = e_id
        token = tok

    yield _method

    assert event_id is not None # event_id must not be none!

    sleep(sleepTime)
    res = req.delete(
        domain+f"/events/{event_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    # check that the wishlist no longer exists
    sleep(sleepTime)
    res = req.get(
        domain+f"/events/{event_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 404

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
    wishlist_token = None

    def _method(tok, w_id):
        nonlocal wishlist_id
        nonlocal wishlist_token
        wishlist_id = w_id
        wishlist_token = tok

    yield _method

    assert wishlist_id is not None # wishlist_id must not be none!

    sleep(sleepTime)
    res = req.delete(
        domain+f"/wishlists/{wishlist_id}",
        headers={"Authorization": f"Bearer {wishlist_token}"},
    )

    # check that the wishlist no longer exists
    sleep(sleepTime)
    res = req.get(
        domain+f"/wishlists/{wishlist_id}",
        headers={"Authorization": f"Bearer {wishlist_token}"},
    )

    assert res.status_code == 404