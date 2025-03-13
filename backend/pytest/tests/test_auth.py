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

    sleep(sleepTime)
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







##################  /items  #########################