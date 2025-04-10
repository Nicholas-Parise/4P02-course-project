import pytest
import requests as req
from time import sleep
import os
import json

domain = "https://api.wishify.ca"

sleepTime = 0.8

##################  /contributions  #########################

def test_create_contribution(setup_test_account, setup_test_item_full, cleanup_test_account, cleanup_test_item_full, cleanup_test_contribution):
    token, wishlist_id, item_id = setup_test_item_full

    sleep(sleepTime)
    res = req.post(
        domain+"/contributions",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "item_id": item_id,
            "note": "I plan to buy this test item",
            "quantity": 1,
            "purchased": False
        }
    )

    contribution_id = res.json()["contribution"]["id"]
    cleanup_test_contribution(token, contribution_id)
    cleanup_test_item_full(token, wishlist_id, item_id)

    assert res.status_code == 201
    assert res.json()["contribution"]["item_id"] == item_id
    assert res.json()["contribution"]["quantity"] == 1

def test_get_all_contribution(setup_test_account, setup_test_contribution_full, cleanup_test_account, cleanup_test_contribution_full):
    token, wishlist_id, item_id, contribution_id = setup_test_contribution_full

    sleep(sleepTime)
    res = req.get(
        domain+f"/contributions/",
        headers={"Authorization": f"Bearer {token}"},
    )

    cleanup_test_contribution_full(token, wishlist_id, item_id, contribution_id)

    assert res.status_code == 200
    assert res.json()[0]["id"] == contribution_id

def test_get_contribution_by_item(setup_test_account, setup_test_contribution_full, cleanup_test_account, cleanup_test_contribution_full):
    token, wishlist_id, item_id, contribution_id = setup_test_contribution_full

    sleep(sleepTime)
    res = req.get(
        domain+f"/contributions/items/{item_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    cleanup_test_contribution_full(token, wishlist_id, item_id, contribution_id)

    assert res.status_code == 200
    assert res.json()[0]["id"] == contribution_id

def test_get_contribution_by_wishlist(setup_test_account, setup_test_contribution_full, cleanup_test_account, cleanup_test_contribution_full):
    token, wishlist_id, item_id, contribution_id = setup_test_contribution_full

    sleep(sleepTime)
    res = req.get(
        domain+f"/contributions/wishlists/{wishlist_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    cleanup_test_contribution_full(token, wishlist_id, item_id, contribution_id)

    assert res.status_code == 200
    assert res.json()[0]["id"] == contribution_id

def test_put_contribution(setup_test_account, setup_test_contribution_full, cleanup_test_account, cleanup_test_contribution_full):
    token, wishlist_id, item_id, contribution_id = setup_test_contribution_full

    updated_note = "Updated contribution note"

    sleep(sleepTime)
    res = req.put(
        domain+f"/contributions/{contribution_id}",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "note": updated_note,
            "quantity": 9
        }
    )

    cleanup_test_contribution_full(token, wishlist_id, item_id, contribution_id)

    assert res.status_code == 200
    assert res.json()["contribution"]["id"] == contribution_id
    assert res.json()["contribution"]["item_id"] == item_id
    assert res.json()["contribution"]["note"] == updated_note
    assert res.json()["contribution"]["quantity"] == 9

def test_put_contribution_no_token(setup_test_account, setup_test_contribution_full, cleanup_test_account, cleanup_test_contribution_full):
    token, wishlist_id, item_id, contribution_id = setup_test_contribution_full

    updated_note = "Updated contribution note"

    sleep(sleepTime)
    res = req.put(
        domain+f"/contributions/{contribution_id}",
        # headers={"Authorization": f"Bearer {token}"}, no token
        json={
            "note": updated_note,
            "quantity": 9
        }
    )

    cleanup_test_contribution_full(token, wishlist_id, item_id, contribution_id)

    assert res.status_code == 401

def test_delete_contribution(setup_test_account, setup_test_contribution_full, cleanup_test_account, cleanup_test_item_full):
    token, wishlist_id, item_id, contribution_id = setup_test_contribution_full

    updated_note = "Updated contribution note"

    sleep(sleepTime)
    res = req.delete(
        domain+f"/contributions/{contribution_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    cleanup_test_item_full(token, wishlist_id, item_id)

    assert res.status_code == 200

    # check that the contribution no longer exists
    sleep(sleepTime)
    res = req.get(
        domain+f"/contributions/{contribution_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 404

def test_delete_contribution_no_token(setup_test_account, setup_test_contribution_full, cleanup_test_account, cleanup_test_contribution_full):
    token, wishlist_id, item_id, contribution_id = setup_test_contribution_full

    updated_note = "Updated contribution note"

    sleep(sleepTime)
    res = req.delete(
        domain+f"/contributions/{contribution_id}",
        # headers={"Authorization": f"Bearer {token}"}, no token provided
    )

    cleanup_test_contribution_full(token, wishlist_id, item_id, contribution_id)

    assert res.status_code == 401

    # check that the contribution still exists
    sleep(sleepTime)
    res = req.get(
        domain+f"/contributions/",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert len(res.json()) > 0
    assert res.json()[0]["id"] == contribution_id

def test_delete_contribution_invalid_token(setup_test_account, setup_test_contribution_full, cleanup_test_account, cleanup_test_item_full):
    token, wishlist_id, item_id, contribution_id = setup_test_contribution_full

    updated_note = "Updated contribution note"

    sleep(sleepTime)
    res = req.delete(
        domain+f"/contributions/{contribution_id}",
        headers={"Authorization": f"Bearer 109319someRandom419248Token1293"}, # invalid token
    )

    cleanup_test_item_full(token, wishlist_id, item_id)

    assert res.status_code == 401

    # check that the contribution still exists
    sleep(sleepTime)
    res = req.get(
        domain+f"/contributions/",
        headers={"Authorization": f"Bearer {token}"},
    )
    
    assert len(res.json()) > 0
    assert res.json()[0]["id"] == contribution_id

