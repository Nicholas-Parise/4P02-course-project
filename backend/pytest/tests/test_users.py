import pytest
import requests as req
from time import sleep
import os
import json

domain = "https://api.wishify.ca"
email = "testAccount287232@wishify.ca"
password = "$eCur3Pa$$w0rD!1"

sleepTime = 0.5

##################  /users  #########################

def test_get_users(setup_test_account, log_in, cleanup_test_account):
    token = log_in

    sleep(sleepTime)
    res = req.get(
        domain+f"/users",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 200
    assert res.json()["user"]["email"] == email

def test_get_user_by_id(setup_test_account, log_in, cleanup_test_account):
    token = log_in

    # get user id
    sleep(sleepTime)
    res = req.get(
        domain+f"/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 200
    uid = res.json()["id"]

    sleep(sleepTime)
    res = req.get(
        domain+f"/users/{uid}",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 200

def test_get_user_by_id_not_found(setup_test_account, log_in, cleanup_test_account):
    token = log_in

    # get user id
    sleep(sleepTime)
    res = req.get(
        domain+f"/users/329054742",
    )

    assert res.status_code == 404
    

def test_put_users(setup_test_account, log_in, cleanup_test_account):
    token = log_in

    displayName = "Test2"

    sleep(sleepTime)
    res = req.put(
        domain+f"/users",
        headers={"Authorization": f"Bearer {token}"},
        json={"displayName":displayName}
    )

    print(res.json())

    assert res.status_code == 200
    assert res.json()["user"]["displayname"] == displayName

    sleep(sleepTime)
    res = req.get(
        domain+f"/users",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.json()["user"]["displayname"] == displayName

def test_delete_user(setup_test_account, log_in):
    token = log_in

    sleep(sleepTime)
    res = req.delete(
        domain+f"/users",
        headers={"Authorization": f"Bearer {token}"},
        json={"password":password}
    )

    assert res.status_code == 200

def test_change_password(setup_test_account, log_in, cleanup_test_account):
    token = log_in

    newPassword = password+"changed2143"

    sleep(sleepTime)
    res = req.put(
        domain+f"/users",
        headers={"Authorization": f"Bearer {token}"},
        json={"password":password, "newPassword":newPassword}
    )

    assert res.status_code == 200
    
    # try to delete account with old password
    sleep(sleepTime)
    res = req.delete(
        domain+f"/users",
        headers={"Authorization": f"Bearer {token}"},
        json={"password":password}
    )

    assert res.status_code == 403
    
    # change password back so it can be cleaned up
    sleep(sleepTime)
    res = req.put(
        domain+f"/users",
        headers={"Authorization": f"Bearer {token}"},
        json={"password":newPassword, "newPassword":password}
    )

    assert res.status_code == 200


def test_change_password_error(setup_test_account, log_in, cleanup_test_account):
    token = log_in

    newPassword = password+"changed24287"

    sleep(sleepTime)
    res = req.put(
        domain+f"/users",
        headers={"Authorization": f"Bearer {token}"},
        json={"newPassword":newPassword}
    )

    assert res.status_code == 400

    sleep(sleepTime)
    res = req.put(
        domain+f"/users",
        headers={"Authorization": f"Bearer {token}"},
        json={"newPassword":newPassword, "password":"wrongPassword342fes"}
    )

    assert res.status_code == 403
