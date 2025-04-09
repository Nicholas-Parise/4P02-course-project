import pytest
import requests as req
from time import sleep
import os
import json

domain = "https://api.wishify.ca"

sleepTime = 0.8

##################  /wishlists  #########################

def test_create_wishlist(setup_test_account, log_in, cleanup_test_account, cleanup_test_wishlist):
    sleep(sleepTime)
    token = log_in
    res = req.post(
        domain+"/wishlists",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "name":"Automated Test Wishlist",
        }
    )

    cleanup_test_wishlist(token, res.json()["wishlist"]["id"])

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

def test_get_all_wishlists(setup_test_account, setup_test_wishlist, cleanup_test_account, cleanup_test_wishlist):
    token, wishlist_id = setup_test_wishlist

    sleep(sleepTime)
    res = req.get(
        domain+f"/wishlists/",
        headers={"Authorization": f"Bearer {token}"},
    )

    cleanup_test_wishlist(token, wishlist_id)

    assert res.status_code == 200
    assert res.json()[0]["id"] == wishlist_id

def test_get_wishlists_token_errors(setup_test_account, setup_test_wishlist, cleanup_test_account, cleanup_test_wishlist ):
    token, wishlist_id = setup_test_wishlist

    sleep(sleepTime)
    res = req.get(
        domain+f"/wishlists/",
        # no token headers={"Authorization": f"Bearer {token}"},
    )

    cleanup_test_wishlist(token, wishlist_id)

    assert res.status_code == 401

    sleep(sleepTime)
    res = req.get(
        domain+f"/wishlists/",
        headers={"Authorization": f"Bearer WrongToken"},   # wrong token
    )

    assert res.status_code == 401

def test_get_wishlist_by_id(setup_test_account, setup_test_wishlist, cleanup_test_account, cleanup_test_wishlist):
    token, wishlist_id = setup_test_wishlist

    sleep(sleepTime)
    res = req.get(
        domain+f"/wishlists/{wishlist_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    cleanup_test_wishlist(token, wishlist_id)

    print(res.json())

    assert res.status_code == 200
    assert res.json()["wishlist"]["id"] == wishlist_id

def test_get_wishlist_by_id_token_errors(setup_test_account, setup_test_wishlist, cleanup_test_account, cleanup_test_wishlist):
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

def test_put_wishlist(setup_test_account, setup_test_wishlist, cleanup_test_account, cleanup_test_wishlist):
    token, wishlist_id = setup_test_wishlist

    rename = "My renamed Wishlist"

    sleep(sleepTime)
    res = req.put(
        domain+f"/wishlists/{wishlist_id}",
        headers={"Authorization": f"Bearer {token}"},
        json={"name":rename}
    )

    cleanup_test_wishlist(token, wishlist_id)

    assert res.status_code == 200
    assert res.json()["wishlist"]["id"] == wishlist_id
    assert res.json()["wishlist"]["name"] == rename

    sleep(sleepTime)
    res = req.get(
        domain+f"/wishlists/{wishlist_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.json()["wishlist"]["name"] == rename

def test_put_wishlist_not_found(setup_test_account, log_in, cleanup_test_account):
    token = log_in

    sleep(sleepTime)
    res = req.put(
        domain+f"/wishlists/938245217",
        headers={"Authorization": f"Bearer {token}"},
        json={"name":"rename"}
    )

    assert res.status_code == 404

def test_delete_wishlist(setup_test_account, setup_test_wishlist, cleanup_test_account):
    token, wishlist_id = setup_test_wishlist

    sleep(sleepTime)
    res = req.delete(
        domain+f"/wishlists/{wishlist_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 200

    # confirm wishlist has been deleted
    sleep(sleepTime)
    res = req.get(
        domain+f"/wishlists/{wishlist_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 404

def test_delete_wishlist_no_token(setup_test_account, setup_test_wishlist, cleanup_test_account, cleanup_test_wishlist):
    token, wishlist_id = setup_test_wishlist
    cleanup_test_wishlist(token, wishlist_id)

    sleep(sleepTime)
    res = req.delete(
        domain+f"/wishlists/{wishlist_id}",
        # headers={"Authorization": f"Bearer {token}"}, no token
    )

    assert res.status_code == 401

    # check the wishlist still exists
    sleep(sleepTime)
    res = req.get(
        domain+f"/wishlists/{wishlist_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 200

def test_delete_wishlist_invalid_token(setup_test_account, setup_test_wishlist, cleanup_test_account, cleanup_test_wishlist):
    token, wishlist_id = setup_test_wishlist
    cleanup_test_wishlist(token, wishlist_id)

    sleep(sleepTime)
    res = req.delete(
        domain+f"/wishlists/{wishlist_id}",
        headers={"Authorization": f"Bearer 1776119someRandom41648Token12303"},
    )

    assert res.status_code == 401

    # check the wishlist still exists
    sleep(sleepTime)
    res = req.get(
        domain+f"/wishlists/{wishlist_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 200