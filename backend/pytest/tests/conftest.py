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
            "displayName":"Automated Test Account",
            "notifications":False
        }
    )

@pytest.fixture
def log_in():
    sleep(sleepTime)
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
    sleep(sleepTime)
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
    return token, res.json()["event"]["id"]

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
    sleep(sleepTime)
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
    return token, res.json()["wishlist"]["id"]

@pytest.fixture
def cleanup_test_wishlist(request):
    wishlist_id = None
    token = None

    def _method(tok, w_id):
        nonlocal wishlist_id
        nonlocal token
        wishlist_id = w_id
        token = tok

    yield _method

    assert wishlist_id is not None # wishlist_id must not be none!

    sleep(sleepTime)
    res = req.delete(
        domain+f"/wishlists/{wishlist_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    # check that the wishlist no longer exists
    sleep(sleepTime)
    res = req.get(
        domain+f"/wishlists/{wishlist_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 404


@pytest.fixture
def cleanup_test_item(request):
    item_id = None
    token = None

    def _method(tok, i_id):
        nonlocal item_id
        nonlocal token
        item_id = i_id
        token = tok

    yield _method

    assert item_id is not None # item_id must not be none!

    sleep(sleepTime)
    res = req.delete(
        domain+f"/items/{item_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    # check that the item no longer exists
    sleep(sleepTime)
    res = req.get(
        domain+f"/items/{item_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 404

# create both a wishlist and an item
@pytest.fixture
def setup_test_item_full(request):
    sleep(sleepTime)
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
            "name":"Automated Test Wishlist For Item Testing",
        }
    )

    wishlist_id = res.json()["wishlist"]["id"]
    assert res.status_code == 201

    sleep(sleepTime)
    res = req.post(
        domain+f"/items/",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "name": "Automated Test Item - Fixture",
            "wishlists_id": wishlist_id,
            "quantity": 1,
            "url": "https://www.amazon.ca/Bojim-Adjustable-Lighting-Fixtures-Spotlight/dp/B0C535L1J5/ref=asc_df_B0C535L1J5?mcid=6fb57cbc666d3bf29b2b2c9e1bd29386&tag=googleshopc0c-20&linkCode=df0&hvadid=706762886578&hvpos=&hvnetw=g&hvrand=11662413811419187147&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9000777&hvtargid=pla-2187979978025&gad_source=1&th=1",
            "Description": "Will anyone ever see THIS?"
        }
    )

    item_id = res.json()["item"]["id"]
    assert res.status_code == 201

    return token, wishlist_id, item_id


# delete both the item and wishlist
@pytest.fixture
def cleanup_test_item_full(request):
    token = None
    wishlist_id = None
    item_id = None
    
    def _method(tok, w_id, i_id):
        nonlocal token
        nonlocal item_id
        nonlocal wishlist_id
        token = tok
        wishlist_id = w_id
        item_id = i_id
        
    yield _method

    assert token is not None # token must not be none!
    assert wishlist_id is not None # wishlist_id must not be none!
    assert item_id is not None # item_id must not be none!

    sleep(sleepTime)
    res = req.delete(
        domain+f"/items/{item_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    # check that the item no longer exists
    sleep(sleepTime)
    res = req.get(
        domain+f"/items/{item_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 404

    sleep(sleepTime)
    res = req.delete(
        domain+f"/wishlists/{wishlist_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    # check that the wishlist no longer exists
    sleep(sleepTime)
    res = req.get(
        domain+f"/wishlists/{wishlist_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 404


# create both a wishlist and multiple items
@pytest.fixture
def setup_test_item_full_multi(request):
    sleep(sleepTime)
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
            "name":"Automated Test Wishlist For Item Testing",
        }
    )

    wishlist_id = res.json()["wishlist"]["id"]
    assert res.status_code == 201

    item_ids = []

    for i in range(5):
        sleep(sleepTime)
        res = req.post(
            domain+f"/items/",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "name": f"Automated Test Item - Multi {i}",
                "wishlists_id": wishlist_id,
                "quantity": 1,
            }
        )
        item_ids.append(res.json()["item"]["id"])
        assert res.status_code == 201
    

    return token, wishlist_id, item_ids

# delete both the item and wishlist
@pytest.fixture
def cleanup_test_item_full_multi(request):
    token = None
    wishlist_id = None
    item_ids = None # list if item IDs
    
    def _method(tok, w_id, i_ids):
        nonlocal token
        nonlocal wishlist_id
        nonlocal item_ids
        token = tok
        wishlist_id = w_id
        item_ids = i_ids
        
    yield _method

    assert token is not None # token must not be none!
    assert wishlist_id is not None # wishlist_id must not be none!
    assert item_ids is not None # item_id must not be none!

    for item_id in item_ids:
        sleep(sleepTime)
        res = req.delete(
            domain+f"/items/{item_id}",
            headers={"Authorization": f"Bearer {token}"},
        )

        # check that the item no longer exists
        sleep(sleepTime)
        res = req.get(
            domain+f"/items/{item_id}",
            headers={"Authorization": f"Bearer {token}"},
        )

        assert res.status_code == 404

    # delete wishlist
    sleep(sleepTime)
    res = req.delete(
        domain+f"/wishlists/{wishlist_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    # check that the wishlist no longer exists
    sleep(sleepTime)
    res = req.get(
        domain+f"/wishlists/{wishlist_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 404

@pytest.fixture
def cleanup_test_contribution(request):
    contribution_id = None
    token = None

    def _method(tok, i_id):
        nonlocal contribution_id
        nonlocal token
        contribution_id = i_id
        token = tok

    yield _method

    assert contribution_id is not None # contribution_id must not be none!

    sleep(sleepTime)
    res = req.delete(
        domain+f"/contributions/{contribution_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    # check that the item no longer exists
    sleep(sleepTime)
    res = req.get(
        domain+f"/contributions/{contribution_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 404


# create both a wishlist, an item and a contribution
@pytest.fixture
def setup_test_contribution_full(request):
    sleep(sleepTime)
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
            "name":"Automated Test Wishlist For Item Testing",
        }
    )

    wishlist_id = res.json()["wishlist"]["id"]
    assert res.status_code == 201

    sleep(sleepTime)
    res = req.post(
        domain+f"/items/",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "name": "Automated Test Item - Fixture for contribtuions",
            "wishlists_id": wishlist_id,
            "quantity": 1,
            "url": "https://thumbs.dreamstime.com/b/contribute-d-word-pulled-up-team-giving-sharing-contribution-letters-working-together-donation-worthy-cause-47609276.jpg",
            "Description": "WiLl ANYONE eVer sEe THIS?"
        }
    )

    item_id = res.json()["item"]["id"]
    assert res.status_code == 201

    sleep(sleepTime)
    res = req.post(
        domain+"/contributions",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "item_id": item_id,
            "note": "Created by Fixture",
            "quantity": 1,
            "purchased": False
        }
    )

    contribution_id = res.json()["contribution"]["id"]
    assert res.status_code == 201

    return token, wishlist_id, item_id, contribution_id


# delete the contribution, item, and wishlist
@pytest.fixture
def cleanup_test_contribution_full(request):
    token = None
    wishlist_id = None
    item_id = None
    contribution_id = None
    
    def _method(tok, w_id, i_id, c_id):
        nonlocal token
        nonlocal item_id
        nonlocal wishlist_id
        nonlocal contribution_id
        token = tok
        wishlist_id = w_id
        item_id = i_id
        contribution_id = c_id
        
    yield _method

    assert token is not None # token must not be none!
    assert wishlist_id is not None # wishlist_id must not be none!
    assert item_id is not None # item_id must not be none!
    assert contribution_id is not None # contribution_id must not be none!

    # delete the contribution
    sleep(sleepTime)
    res = req.delete(
        domain+f"/contributions/{contribution_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    # check that the contribution no longer exists
    sleep(sleepTime)
    res = req.get(
        domain+f"/contributions/{contribution_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 404

    sleep(sleepTime)
    res = req.delete(
        domain+f"/items/{item_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    # check that the item no longer exists
    sleep(sleepTime)
    res = req.get(
        domain+f"/items/{item_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 404

    sleep(sleepTime)
    res = req.delete(
        domain+f"/wishlists/{wishlist_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    # check that the wishlist no longer exists
    sleep(sleepTime)
    res = req.get(
        domain+f"/wishlists/{wishlist_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 404