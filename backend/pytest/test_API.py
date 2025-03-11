import pytest
import requests as req
from time import sleep
import os
import json

# pytest --json-report --json-report-omit keywords streams root --json-report-verbosity 2 --json-report-indent 2

domain = "https://api.wishify.ca"
email = "testAccount287232@gmail.com"
password = "$eCur3Pa$$w0rD!1"

sleepTime = 0.5

##################  /auth  #########################

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
    yield
    sleep(sleepTime)
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


def test_create_account(reset_test_account_state, cleanup_test_account):
    sleep(sleepTime)
    res = req.post(
        domain+"/auth/register",
        json={
            "email":email,
            "password":password,
            "displayName":"Automated Test Account"
        }
    )

    assert res.status_code == 201

def test_create_account_duplicate_email(setup_test_account, cleanup_test_account):
    sleep(sleepTime)
    res = req.post(
        domain+"/auth/register",
        json={
            "email":email,
            "password":password,
            "displayName":"Automated Test Account"
        }
    )

    assert res.status_code == 409

def test_create_account_missing_data():
    sleep(sleepTime)
    
    res = req.post(
        domain+"/auth/register",
        json={
            # Missing email
            "password":password,
            "displayName":"Automated Test Account"
        }
    )

    assert res.status_code == 400 

    sleep(sleepTime)
    
    res = req.post(
        domain+"/auth/register",
        json={
            "email":email,
            # missing password
            "displayName":"Automated Test Account"
        }
    )

    assert res.status_code == 400

    sleep(sleepTime)
    
    res = req.post(
        domain+"/auth/register",
        json={
            "email":email,
            "password":password,
            # missing displayName
        }
    )

    assert res.status_code == 400

def test_login_account(setup_test_account, cleanup_test_account):
    sleep(sleepTime)
    res = req.post(
        domain+"/auth/login",
        json={
            "email":email,
            "password":password,
        }
    )
    
    assert res.status_code == 200
    assert res.json()["token"]

def test_login_missing_credentials(setup_test_account, cleanup_test_account):
    sleep(sleepTime)
    res = req.post(
        domain+"/auth/login",
        json={
            # missing email
            "password":password,
        }
    )

    assert res.status_code == 400

    res = req.post(
        domain+"/auth/login",
        json={
            "email":email,
            # missing password
        }
    )

    assert res.status_code == 400

def test_login_account_incorrect_credentials(setup_test_account, cleanup_test_account):
    sleep(sleepTime)
    res = req.post(
        domain+"/auth/login",
        json={
            "email":email+"eXtraCharActers???21374561",
            "password":password,
        }
    )
    
    assert res.status_code == 401

    sleep(sleepTime)
    res = req.post(
        domain+"/auth/login",
        json={
            "email":email,
            "password":password+"pRe$altiNg?",
        }
    )
    
    assert res.status_code == 401

def test_logout(setup_test_account, log_in, cleanup_test_account):
    token = log_in

    sleep(sleepTime)
    res = req.post(
        domain+"/auth/logout",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 200

    sleep(sleepTime)
    res = req.post(
        domain+"/auth/logout",
    )

    assert res.status_code == 401

def test_auth_me(setup_test_account, log_in, cleanup_test_account):
    token = log_in

    sleep(sleepTime)
    res = req.get(
        domain+"/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 200
    
def test_auth_me_token_errors(setup_test_account, cleanup_test_account):
    sleep(sleepTime)
    res = req.get(
        domain+"/auth/me",
        # no token provided headers={"Authorization": f"Bearer {token}"},
    )
    
    assert res.status_code == 401

    sleep(sleepTime)
    res = req.get(
        domain+"/auth/me",
        headers={"Authorization": "Bearer ThisIsntAValidToken"}, # incorrect token provided
    )
    
    assert res.status_code == 401

##################  /wishlists  #########################

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

def test_create_wishlist(setup_test_account, log_in, cleanup_test_wishlist):
    sleep(sleepTime)
    token = log_in
    res = req.post(
        domain+"/wishlists",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "name":"Automated Test Wishlist",
        }
    )

    cleanup_test_wishlist(token, res.json()["wishlist_id"])

    assert res.status_code == 201

def test_create_wishlist_missing_name(setup_test_account, log_in, cleanup_test_account):
    token = log_in
    sleep(sleepTime)
    res = req.post(
        domain+"/wishlists",
        headers={"Authorization": f"Bearer {token}"},
        json={
            # missing name "name":"Automated Test Wishlist",
            "description":"This is my automated test wishlist"
        }
    )

    assert res.status_code == 400

def test_get_wishlist(setup_test_account, setup_test_wishlist, cleanup_test_wishlist, cleanup_test_account):
    token, wishlist_id = setup_test_wishlist

    sleep(sleepTime)
    res = req.get(
        domain+f"/wishlists/{wishlist_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    cleanup_test_wishlist(token, wishlist_id)

    assert res.status_code == 200
    assert res.json()["wishlist"]["id"] == wishlist_id

def test_get_wishlist_token_errors(setup_test_account, setup_test_wishlist, cleanup_test_wishlist, cleanup_test_account):
    token, wishlist_id = setup_test_wishlist

    sleep(sleepTime)
    res = req.get(
        domain+f"/wishlists/{wishlist_id}",
        # no token headers={"Authorization": f"Bearer {token}"},
    )

    cleanup_test_wishlist(token, wishlist_id)

    assert res.status_code == 401

    sleep(sleepTime)
    res = req.get(
        domain+f"/wishlists/{wishlist_id}",
        headers={"Authorization": f"Bearer WrongToken"},   # wrong token
    )

    assert res.status_code == 401